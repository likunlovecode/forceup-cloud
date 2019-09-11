import React, { Component, Suspense } from 'react'
import { connect } from 'react-redux'
import { useTranslation, withTranslation, Trans } from 'react-i18next'
import { Input, Menu, Dropdown, Button, message } from 'antd'
import {
  setCommon
} from '$common/actions'
import UserIcon from 'Images/usericon.png'
import Cookies from 'js-cookie';
import history from '$client/history'
import { objectToFormData } from '$common/utils';
const { Search } = Input;

@connect((state) => ({
  fileList: state.common.fileList,
}), {
    setCommon
  })
@withTranslation()
class Head extends Component {
  state = {
    input_value: '',
  }
  constructor(props) {
    super(props)
    this.searchfile = this.searchfile.bind(this);
  }
  componentDidMount() {
    //this.init()
  }
  async init() {

  }

  searchfile(value) {
    var url = window.location.hash.substr(1);
    var keyWord = value;
    if (!keyWord) {
      message.warning('请输入搜索文件名或文件hash');
      return;
    }
    var beginx = 0;
    var count = 100;
    if (url == '/user/myfile') {
      let fileType = 0;
      let params = objectToFormData({ beginx, count, fileType, keyWord })
      Ajax({
        method: 'post',
        url: '/forceup/file/searchFile',
        data: params
      }).then((res) => {
        if (res.Code === 3) {
          if (res.Data.Detail) {
            let { setCommon } = this.props;
            setCommon({
              fileList: res.Data.Detail
            })
          } else {
            let { setCommon } = this.props;
            setCommon({
              fileList: []
            })
          }
        } else if (res.Code === 5) {
          message.error(res.Msg)
        }
      }).catch((error) => {
        console.log(error);
      })
    } else if (url == '/user/recyclebin') {
      let fileType = 1;
      let params = objectToFormData({ beginx, count, fileType, keyWord })
      Ajax({
        method: 'post',
        url: '/forceup/file/searchFile',
        data: params
      }).then((res) => {
        if (res.Code === 3) {
          if (res.Data.Detail) {
            let { setCommon } = this.props;
            setCommon({
              recycleList: res.Data.Detail
            })
          } else {
            let { setCommon } = this.props;
            setCommon({
              recycleList: []
            })
          }
        } else if (res.Code === 5) {
          message.error(res.Msg)
        }
      }).catch((error) => {
        console.log(error);
      })
    }
  }

  userSet() {
    history.push('/user/account');
  }

  buyFu() {

  }

  fuDetails() {

  }

  logOut() {
    Ajax({
      method: 'post',
      url: '/forceup/user/logout',
    }).then((res) => {
      if (res.Code === 3) {
        Cookies.remove('sid');
        window.location.reload();
      } else if (res.Code === 5) {
        message.error(res.Msg);
      } else {
        message.error(res.Msg);
      }
    }).catch((error) => {
      console.log(error);
    })
  }

  render() {
    const { t, i18n } = this.props
    const menu = (
      <Menu>
        <Menu.Item>
          <Button type="link" onClick={this.userSet}>账户设置</Button>
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item>
          <Button type="link" onClick={this.buyFu}>购买FU</Button>
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item>
          <Button type="link" onClick={this.fuDetails}>FU消费明细</Button>
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item>
          <Button type="link" onClick={this.logOut}>注销</Button>
        </Menu.Item>
        {/* <Menu.Item>
          <Button type="link" onClick={() => {
            let lng = i18n.language === 'en' ? 'zh' : 'en'
            i18n.changeLanguage(lng)
          }}>{t('exchange')}</Button>
        </Menu.Item> */}
      </Menu>
    );
    return (
      <div className="flex-1 flex-row cross-center">
        <div className="flex-row flex-1">
          <div className="header-text flex-1">{t('title')}</div>
          <div >
            {/* <Input
              style={{
                width: '4.1rem',
                height: '0.45rem',
              }}
              className="head-input-wrap"
              prefix={
                <Icon type="search" />
              }
              placeholder="文件hash/文件名"
              onChange={this.search}
            /> */}
            <Search
              placeholder="文件hash/文件名"
              onSearch={this.searchfile}
              style={{
                width: '4.1rem',
                height: '0.45rem',
              }}
              className="head-input-wrap"
            />
          </div>
        </div>
        <div className="user-icon-wrap">
          <Dropdown overlay={menu}>
            <div className="user-icon" style={{ backgroundImage: `url(${UserIcon})`, cursor: 'pointer' }} />
          </Dropdown>
        </div>
      </div>
    )
  }
}

export default Head
