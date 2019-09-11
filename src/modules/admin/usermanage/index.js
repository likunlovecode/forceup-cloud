import React from 'react';
import {Table, Tag,Pagination,Row,Col,Button } from 'antd'
import './index.less'
class Usermanage extends React.Component {
  state={
    selectFile: null,
  }
  constructor(props){
    super(props);
    this.onRowClick = this.onRowClick.bind(this)
  }

  onRowClick(record){
    return {
      onClick: e => {
        let sf = this.state.selectFile
        if (sf && sf.age == record.age) {
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

  render() {
    const columns = [
      {
        title: '用户手机号',
        dataIndex: 'name',
        key: 'name',
        render: () => <span>111</span>,
      },
      {
        title: '占用空间',
        dataIndex: 'age',
        key: 'age',
      },
      {
        title: 'FU余额',
        dataIndex: 'address',
        key: 'address',
      },
      {
        title: 'FU消费数额',
        key: 'tags',
        dataIndex: 'tags',
        render: tags => (
          <span>
            {tags.map(tag => {
              let color = tag.length > 5 ? 'geekblue' : 'green';
              if (tag === 'loser') {
                color = 'volcano';
              }
              return (
                <Tag color={color} key={tag}>
                  {tag.toUpperCase()}
                </Tag>
              );
            })}
          </span>
        ),
      },
      {
        title: '注册时间',
        key: 'action',
        render: () => (
          <span>
            Delete
          </span>
        ),
      },
    ];
    const data = [
      {
        key: '1',
        name: 'John Brown',
        age: 32,
        address: 'New York No. 1 Lake Park',
        tags: ['nice', 'developer'],
      },
      {
        key: '2',
        name: 'Jim Green',
        age: 42,
        address: 'London No. 1 Lake Park',
        tags: ['loser'],
      },
      {
        key: '3',
        name: 'Joe Black',
        age: 32,
        address: 'Sidney No. 1 Lake Park',
        tags: ['cool', 'teacher'],
      },
    ];

    let availHeight = window.screen.availHeight
    let tableScrollY = availHeight - 280
    let {selectFile} = this.state;
    return(
      <div className="user_manage" style={{ marginRight: '-24px' }}>
        <div className="flex-row">
          <div className="flex-1">
            <Table
              rowClassName={record => {
                if (selectFile && selectFile.age === record.age) {
                  return 'selected-row'
                }
                return ''
              }}
              scroll={{ y: tableScrollY }}
              onRow={this.onRowClick}
              rowKey={record => record.name || Math.random() * 10000}
              columns={columns} dataSource={data} pagination={false}/>
            <Pagination defaultCurrent={1} total={50} style={{textAlign:'center',marginTop:'1rem'}}/>
          </div>
          <div style={{width:'260px'}}>
            {
              selectFile === null ?
                <div>
                  <Row type="flex" justify="center">
                    <Col span={22}>

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
                      <Button type="primary" style={{ width: "2.3rem" }}>充值</Button>
                    </Col>
                  </Row>
                  <Row type="flex" justify="center">
                    <Col span={22}>
                      <Button type="primary" className="delete-btn" style={{ width: "2.3rem" }}>删除</Button>
                    </Col>
                  </Row>
                </div>
                : ''
            }
          </div>
          {/* <div style={{textAlign:'center',marginTop:'1rem'}}>
            <Pagination defaultCurrent={1} total={50} />
          </div> */}
        </div>
      </div>
    )
  }
}

export default Usermanage;