import React from 'react';
import { Table, Row, Col, Button, Upload, Icon, message,  } from 'antd';
import { objectToFormData, unitConversion } from '$common/utils';
import Cookie from 'js-cookie'
import Config from '$common/config'
import { connect } from 'react-redux'
import {
  setCommon,
  getSpace
} from '$common/actions'
import './file.less';

@connect((state) => ({
  totalSpace:state.common.totalSpace,
  fileList:state.common.fileList,
}), {
    setCommon,
    getSpace
  })
 class FileManage extends React.Component {
  state = {
    selectFile: null,
  }
  constructor(props) {
    super(props);
    this.downLoadFile = this.downLoadFile.bind(this);
    this.deleteFile = this.deleteFile.bind(this);
    this.onRowClick = this.onRowClick.bind(this);
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
    var beginx = 0;
    var count = 100;
    var fileType = 0;
    var params = objectToFormData({ beginx, count, fileType })
    Ajax({
      method: 'post',
      url: '/forceup/file/getUserFileList',
      data: params
    }).then((res) => {
      if (res.Code === 3) {
        let {setCommon} = this.props;
        setCommon({
          fileList:res.Data.Detail
        })
      } else if (res.Code === 5) {
        message.error(res.Msg)
      }
    }).catch((error) => {
      console.log(error);
    })
  }

  downLoadFile() {
    var sid = Cookie.get('sid');
    var fileId = this.state.selectFile.id;
    var params = objectToFormData({ sid, fileId })
    Ajax({
      method: 'post',
      url: '/forceup/file/getFileDownloadPath',
      data: params
    }).then((res) => {
      console.log(res);
      if (res.Code === 3) {
        const aLink = document.createElement('a');
        document.body.appendChild(aLink);
        aLink.style.display = 'none';
        const objectUrl = res.Data.URL + '?Force-Token=' + res.Data.Token;
        aLink.href = objectUrl;
        aLink.download = res.Data.FileName;
        //aLink.text = res.Data.FileName;
        aLink.target = "_blank"
        aLink.click();
        document.body.removeChild(aLink);

      } else if (res.Code === 5) {
        message.error(res.Msg)
      }
    }).catch((error) => {
      console.log(error);
    })
  }
  deleteFile() {
    let {
      selectFile
    } = this.state
    let sid = Cookie.get('sid');
    let fileIdList = selectFile.id
    let fileType = 1

    let params = objectToFormData({ sid, fileIdList, fileType })
    Ajax({
      method: 'post',
      url: '/forceup/file/updateUserFileType',
      data: params
    }).then((res) => {
      if (res.Code === 3) {
        message.success('文件删除成功!')
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


  render() {
    let { selectFile, } = this.state;
    let {getSpace,fileList} = this.props;
    let self = this;
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
    //       selectList: selectedRows,
    //     })
    //   },
    //   getCheckboxProps: record => ({
    //     disabled: record.name === 'Disabled User', // Column configuration not to be checked
    //     name: record.name,
    //   }),
    // };

    const props = {
      name: 'file',
      action: Config.apiBaseURL + '/forceup/file/uploadFile',
      headers: {
        authorization: 'authorization-text',
      },
      showUploadList: false,
      onChange(info) {
        if (info.file.status !== 'uploading') {
          // console.log(info.file, info.fileList);
        }
        if (info.file.status === 'done') {
          self.setState({
            showProgress:true
          })
          var sid = Cookie.get('sid');
          var path = info.file.originFileObj;
          var params = objectToFormData({ sid, path })
          Ajax({
            method: 'post',
            url: '/forceup/file/uploadFile',
            data: params,
            timeout:100000
          }).then((res) => {
            if (res.Code === 3) {
              message.success(`${info.file.name} file uploaded successfully`);
              self.getFileList();
              getSpace();
            } else if (res.Code === 5) {
              message.error(res.Msg);
            } else {
              message.error(res.Msg);
            }
          }).catch((error) => {
            console.log(error);
          })
        } else if (info.file.status === 'error') {
          message.error(`${info.file.name} file upload failed.`);
        }
      },
    };
    let availHeight = window.screen.availHeight

    let tableScrollY = availHeight - 280
    return (
      <div className="main_content myfile" style={{ marginRight: '-24px' }}>
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
                onRow={this.onRowClick} columns={columns} rowKey={record => record.id || Math.random() * 10000} dataSource={fileList} pagination={false} />
            </div>
            <div className="shrink" style={{ width: '260px', textAlign: 'center' }}>
              {
                selectFile === null ?
                  <Upload {...props}>
                    <Button type="primary" style={{ width: '2.3rem' }}>
                      <Icon type="upload" />上传文件（夹）
                    </Button>
                  </Upload> :
                  <div>
                    <Row type="flex" justify="center" style={{ marginBottom: '0.2rem' }}>
                      <Col span={22}>
                        <Button type="primary" style={{ width: "2.3rem" }} onClick={this.downLoadFile}>下载</Button>
                      </Col>
                    </Row>
                    <Row type="flex" justify="center">
                      <Col span={22}>
                        <Button className="delete-btn" type="primary" style={{ width: "2.3rem" }} onClick={this.deleteFile}>删除文件</Button>
                      </Col>
                    </Row>
                  </div>
              }
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default FileManage;