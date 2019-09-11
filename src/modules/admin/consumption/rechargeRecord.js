import React from 'react';
import { Table, Divider, Tag,Pagination  } from 'antd';
class RechargeRecord extends React.Component {
  render() {
    const columns = [
      {
        title: '用户手机号',
        dataIndex: 'name',
        key: 'name',
        render: text => <a href="https://wwww.baidu.com">{text}</a>,
      },
      {
        title: '订单号',
        dataIndex: 'age',
        key: 'age',
      },
      {
        title: '购买金额',
        dataIndex: 'address',
        key: 'address',
      },
      {
        title: 'FU数量',
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
        title: '订单完成时间',
        key: 'action',
        render: (text, record) => (
          <span>
            <a href="https://wwww.baidu.com">Invite {record.name}</a>
            <Divider type="vertical" />
            <a href="https://wwww.baidu.com">Delete</a>
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
    return(
      <div>
        <div>
          <Table columns={columns} dataSource={data} pagination={false}/>
        </div>
        <div style={{textAlign:"left",marginTop:'1rem'}}>
          <Pagination total={50} showSizeChanger showQuickJumper />
        </div>
      </div>
    )
  }
}

export default RechargeRecord;