import React from 'react';
import { Table, Row, Col, Button, message } from 'antd';
import './index.less';
import { objectToFormData, unitConversion } from '$common/utils';
import Cookie from 'js-cookie'
import EmptyTrash from './empty'
import { connect } from 'react-redux'
import {
  setCommon,
  getSpace
} from '$common/actions'

@connect((state) => ({
  totalSpace:state.common.totalSpace,
  recycleList:state.common.recycleList,
}), {
    setCommon,
    getSpace
  })
class Recyclebin extends React.Component {
  state = {
    selectFile: null,
    loading: true
  }
  constructor(props) {
    super(props);
    this.clearAll = this.clearAll.bind(this);
    this.deleteFile = this.deleteFile.bind(this)
    this.restoreFile = this.restoreFile.bind(this)
    this.onRowClick = this.onRowClick.bind(this)
  }

  componentWillMount() {
    this.getFileList();
  }
  onRowClick(record) {
    return {
      onClick: e => {
        let sf = this.state.selectFile
        if (sf && sf.hash == record.hash) {
          sf = null
        } else {
          sf = record
        }
        this.setState({
          selectFile: sf
        })
      }
    }
  }

  getFileList() {
    var sid = Cookie.get('sid');
    var beginx = 0;
    var count = 20;
    var fileType = 1;
    var params = objectToFormData({ sid, beginx, count, fileType })
    this.setState({
      loading: true
    })
    Ajax({
      method: 'post',
      url: '/forceup/file/getUserFileList',
      data: params
    }).then((res) => {
      if (res.Code === 3) {
        let {setCommon} = this.props;
        setCommon({
          recycleList:res.Data.Detail || []
        })
      } else if (res.Code === 5) {
        message.error(res.Msg)
      }
      this.setState({
        loading: false
      })
    }).catch((error) => {
      this.setState({
        loading: false
      })
      console.log(error);
    })
  }
  deleteFile() {
    let {
      selectFile
    } = this.state
    let sid = Cookie.get('sid');
    let fileIdList = selectFile.id
    let fileType = 2

    let params = objectToFormData({ sid, fileIdList, fileType })
    Ajax({
      method: 'post',
      url: '/forceup/file/updateUserFileType',
      data: params
    }).then((res) => {
      if (res.Code === 3) {
        message.success('文件删除成功!')
        this.getFileList();
        let {getSpace} = this.props;
        getSpace();
      } else if (res.Code === 5) {
        message.error(res.Msg)
      }
    }).catch((error) => {
      console.log(error);
    })
  }
  restoreFile() {
    let {
      selectFile
    } = this.state
    let sid = Cookie.get('sid');
    let fileIdList = selectFile.id
    let fileType = 0

    let params = objectToFormData({ sid, fileIdList, fileType })
    Ajax({
      method: 'post',
      url: '/forceup/file/updateUserFileType',
      data: params
    }).then((res) => {
      if (res.Code === 3) {
        message.success('文件还原成功!')
        this.setState({
          selectFile: null
        })
        this.getFileList()
      } else if (res.Code === 5) {
        message.error(res.Msg)
      }
    }).catch((error) => {
      console.log(error);
    })
  }
  clearAll() {
    let {
      recycleList
    } = this.props
    let sid = Cookie.get('sid');
    let fileIdList = recycleList.map(item => item.id).join(',')
    let fileType = 2

    let params = objectToFormData({ sid, fileIdList, fileType })
    Ajax({
      method: 'post',
      url: '/forceup/file/updateUserFileType',
      data: params
    }).then((res) => {
      if (res.Code === 3) {
        message.success('回收站已清空!')
        this.setState({
          selectFile: null
        })
        this.getFileList();
        let {getSpace} = this.props;
        getSpace();
      } else if (res.Code === 5) {
        message.error(res.Msg)
      }
    }).catch((error) => {
      console.log(error);
    })
  }
  render() {
    let { selectFile, loading } = this.state;
    let {recycleList} = this.props;
    if (loading) {
      return null
    }
    if (recycleList.length == 0) {
      return <EmptyTrash />
    }
    const columns = [
      {
        title: '名称',
        dataIndex: 'name',
        width: 150,
        render: (data) => {
          return (
            <div className="break">
              {data}
            </div>
          )
        }
      },
      {
        title: 'Hash',
        dataIndex: 'hash',
        width: 420,
        render: (data) => {
          return (
            <div className="break">
              {data}
            </div>
          )
        }
      },
      {
        title: '大小',
        dataIndex: 'size',
        width: 150,
        render: (data) => {
          return (
            <div className="break">
              {unitConversion(data)}
            </div>
          )
        }
      },
      {
        title: '更新时间',
        dataIndex: 'gmt_modified',
      },
    ];

    // const rowSelection = {
    //   onChange: (selectedRowKeys, selectedRows) => {
    //     this.setState({
    //       selectList: selectedRows
    //     })
    //   },
    //   getCheckboxProps: record => ({
    //     disabled: record.name === 'Disabled User', // Column configuration not to be checked
    //     name: record.name,
    //   }),
    // };
    let availHeight = window.screen.availHeight

    let tableScrollY = availHeight - 280
    return (
      <div className="main_content recyclebin" style={{ marginRight: '-24px' }}>
        <div>
          <div className="flex-row">
            <div className="flex-1">
              <Table
                rowClassName={record => {
                  if (selectFile && selectFile.hash === record.hash) {
                    return 'selected-row'
                  }
                  return ''
                }}
                scroll={{ y: tableScrollY }}
                columns={columns} dataSource={recycleList} pagination={false}
                rowKey={record => record.id || Math.random() * 10000}
                onRow={this.onRowClick} />
            </div>
            <div style={{ textAlign: 'center', width: '260px' }}>
              {
                selectFile === null ?
                  <div>
                    <Row type="flex" justify="center">
                      <Col span={22}>
                        <Button type="primary" onClick={this.clearAll} style={{ width: "2.3rem" }}>清空回收站</Button>
                      </Col>
                    </Row>
                  </div>
                  : ''
              }
              {
                selectFile !== null ?
                  <div>
                    <Row type="flex" justify="center" style={{ marginBottom: '0.3rem' }}>
                      <Col span={22}>
                        <Button type="primary" onClick={this.restoreFile} style={{ width: "2.3rem" }}>还原文件</Button>
                      </Col>
                    </Row>
                    <Row type="flex" justify="center">
                      <Col span={22}>
                        <Button type="primary" className="delete-btn" onClick={this.deleteFile} style={{ width: "2.3rem" }}>彻底删除</Button>
                      </Col>
                    </Row>
                  </div>
                  : ''
              }
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Recyclebin;