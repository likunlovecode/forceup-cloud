import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Layout, Menu, Icon } from 'antd'
import {
  setCommon
} from '$common/actions'
import {
  docRoot,
} from '$common/utils'
import ImgLogo from 'Images/logo.png'
import HeadComponent from './Head'
import FootComponent from './Foot'
import history from '$client/history'

const { Header, Sider, Content } = Layout
const { SubMenu } = Menu;
@connect((state) => ({
  menu: state.common.menu,
  collapsed: state.common.collapsed
}), {
    setCommon
  })
class PageLayout extends Component {
  state = {
    currentUrl: '',
    openKeys: [],
  }
  constructor(props) {
    super(props)
    this.toggle = this.toggle.bind(this)
  }
  componentDidMount() {
    this.init()
    this.setCurrentUrl()
  }
  componentDidUpdate() {
    this.setCurrentUrl()
  }
  setCurrentUrl() {
    let url = window.location.hash.substr(1)
    if (url === this.state.currentUrl) {
      return
    }
    this.setState({
      currentUrl: url
    })
  }
  async init() {
    let menu = await this.getMenu()
    let {
      setCommon
    } = this.props
    setCommon({
      menu,
    })
  }
  async getMenu() {
    return Ajax({
      method: 'get',
      url: `${docRoot()}adminmenu.json`
    })
      .then(res => {
        // console.log(res);
        return res
      })
      .catch(error => {
        console.log(error)
        return []
      })
  }
  toggle() {
    let {
      setCommon,
      collapsed
    } = this.props
    setCommon({
      collapsed: !collapsed
    })

  }

  render() {
    const {
      menu,
      collapsed
    } = this.props
    const {
      currentUrl,
      openKeys
    } = this.state
    console.log(openKeys);
    console.log(currentUrl);
    return (
      <Layout>
        <Sider
          className={`layout-sider ${collapsed ? 'collapsed' : ''}`}
          theme="light"
          style={{ backgroundColor: '#F7F9FA' }}
          width={260}
          trigger={null}
          collapsible
          collapsed={collapsed}>
          <div className="flex-column" style={{ minHeight: '100vh' }}>
            <div
              style={{
                padding: '20px 24px'
              }}>
              <img className="sider-logo" src={ImgLogo} alt="logo" />
            </div>
            <div className="flex-1">
              {/* <Menu
                style={{ backgroundColor: '#F7F9FA', borderRight: 0 }}
                theme="light" mode="inline" selectedKeys={[currentUrl]}>
                {
                  menu.map((item, key) => {
                    return (
                      <Menu.Item
                        onClick={() => {
                          history.push(item.url)
                        }}
                        key={item.url}>
                        {item.iconType ? <Icon type={item.iconType} /> : null}
                        <span>{item.name}</span>
                      </Menu.Item>
                    )
                  })
                }
              </Menu> */}
              <Menu
                style={{ backgroundColor: '#F7F9FA', borderRight: 0 }}
                defaultOpenKeys={this.state.openKeys}
                theme="light" mode="inline" selectedKeys={[currentUrl]}>
                {
                  menu.map((item, key) => {
                    if(!item.children){
                      return (
                        <Menu.Item
                          onClick={() => {
                            history.push(item.url)
                          }}
                          key={item.url}>
                          {item.iconType ? <Icon type={item.iconType} /> : null}
                          <span>{item.name}</span>
                        </Menu.Item>
                      )
                    }else{
                      return(
                        <SubMenu
                          title={
                            <span>
                              {item.iconType ? <Icon type={item.iconType} /> : null}
                              <span>{item.name}</span>
                            </span>
                          }
                          key={item.name}
                        >
                          {
                            item.children.map((ele)=>{
                              return (
                                <Menu.Item key={ele.url} onClick={() => {
                                  history.push(ele.url)
                                }}>
                                  <span>{ele.name}</span>
                                </Menu.Item>
                              )
                            })
                          }
                        </SubMenu>
                      )
                    }
                  })
                }
              </Menu>
            </div>
            <FootComponent />
          </div>
        </Sider>
        <Layout>
          <Header style={{ background: '#fff', padding: 0 }}>
            <div className="flex-row">
              <Icon
                style={{ padding: 10 }}
                className="trigger"
                type={collapsed ? 'menu-unfold' : 'menu-fold'}
                onClick={this.toggle}
              />
              <HeadComponent />
            </div>
          </Header>
          <Content
            style={{
              margin: '0',
              padding: 24,
              background: '#fff',
              minHeight: 280,
              position: 'relative'
            }}
          >
            {this.props.children}
          </Content>
        </Layout>
      </Layout>
    )
  }
}

export default PageLayout
