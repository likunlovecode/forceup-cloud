import React from 'react';
import { Tabs,Button,Divider } from 'antd';
import './index.less';
import UserIcon from 'Images/usericon.png'
const store = require('store');
const { TabPane } = Tabs;


export default class Account extends React.Component {
  state = {
    account:'',
  }

  componentWillMount(){
    this.setState({
      account:store.get('account')
    })
  }

  handleTabs(key){
    // console.log(key);
  }

  render() {
    let {account} = this.state;
    return(
      <div>
        <div className="personal_setting">
          <Tabs defaultActiveKey="1" onChange={this.handleTabs}>
            <TabPane tab="常规" key="1">
              <div className="information">
                <div className="top_title">
                  <span className="sp1">基本信息</span>
                </div>
              </div>
              <div className="info_list">
                <div className="info_content">
                  <div className="left_text">
                    <span>用户头像</span>
                  </div>
                  <div className="right_box">
                    <img src={UserIcon} alt=""/>
                  </div>
                </div>
                <Divider/>
                <div className="info_content">
                  <div className="left_text">
                    <span>用户名</span>
                  </div>
                  <div className="right_box">
                    <span>{account}</span>
                    <Button type="link">编辑</Button>
                  </div>
                </div>
                <Divider/>
                <div className="info_content">
                  <div className="left_text">
                    <span>用户手机号</span>
                  </div>
                  <div className="right_box">
                    <span>{account}</span>
                    <Button type="link">编辑</Button>
                  </div>
                </div>
                <Divider/>
              </div>
            </TabPane>
            <TabPane tab="购买FU" key="2">
              购买FU
            </TabPane>
            <TabPane tab="购买FU记录" key="3">
              购买FU记录
            </TabPane>
            <TabPane tab="消费记录" key="4">
              消费记录
            </TabPane>
          </Tabs>
        </div>
      </div>
    )
  }
}