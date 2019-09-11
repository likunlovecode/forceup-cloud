import React from 'react';
import './login.less';
import imagelogo from 'Images/logo.png';
import imagebird from 'Images/bird.png';
import { Button, Form, Icon, Input, Row, Col, Tabs, message, } from 'antd';
import { objectToFormData } from '$common/utils';
import LoginForm from './loginform';
import Cookies from 'js-cookie';
import history from '$client/history';

const { TabPane } = Tabs;

class Login extends React.Component {

  state = {
    confirmDirty: false,
    loginStatus: "password",
    registerCode: true,
    registerTime: 0,
  };

  constructor(props) {
    super(props)
    this.forgetPassword = this.forgetPassword.bind(this)
  }

  callback(key) {
    // console.log(key);
  }
  forgetPassword(loginStatus) {
    this.setState({
      loginStatus
    })
  }

  handleSubmitRegister = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      var phone = values.mobilephone;
      var vcode = values.mobilecode;
      var pwd = values.pass_word;
      var confirm_pwd = values.confirm;
      var params = objectToFormData({ phone: phone, vcode: vcode, pwd: pwd, confirm_pwd: confirm_pwd });
      if (!err) {
        Ajax({
          method: 'post',
          url: '/forceup/user/register',
          data: params
        }).then((res) => {
          if (res.Code == 3) {
            var sid = res.Data.SessionId;
            Cookies.set('sid', sid)
            message.success(res.Msg);
            history.push('/user/myfile');
          } else if (res.Code == 5) {
            message.error(res.Msg);
          } else {
            message.error(res.Msg);
          }
        }).catch((error) => {
          console.log(error);
        })
      }
    });
  };

  sendcode() {
    var input = this.props.form.getFieldsValue(['mobilephone']);
    var input_phone = input.mobilephone;
    var params = objectToFormData({ account: input_phone });
    Ajax({
      method: 'post',
      url: '/forceup/vcode/get',
      data: params
    }).then((res) => {
      if (res.Code === 3) {
        message.success(res.Msg);
        this.setState({
          registerCode: false,
          registerTime: 30
        })
        var auth_timetimer = setInterval(() => {
          if (this.state.registerTime <= 0) {
            this.setState({
              registerCode: true,
            })
            clearInterval(auth_timetimer);
          } else {
            this.setState({
              registerTime: this.state.registerTime - 1
            })
          }
        }, 1000);
      } else if (res.Code === 5) {
        message.error(res.Msg);
      } else {
        message.error(res.Msg);
      }
    }).catch((error) => {
      console.log(error);
    })
  }

  checkPhone = (rule, val, callback) => {
    if (!val) {
      callback();
    }
    let validateResult = /^1[3|4|5|6|7|8|9][0-9]\d{8}$/.test(val);  // 自定义规则
    if (!validateResult) {
      callback('请输入正确的手机号！');
    }
    callback();
  }

  handleConfirmBlur = e => {
    const { value } = e.target;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  };

  FirstPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue('pass_word')) {
      callback('两次密码不一样，请重新输入!');
    } else {
      callback();
    }
  };



  NextPassword = (rule, value, callback) => {
    const { form } = this.props;
    let validateResult = /^(?![A-Z]+$)(?![a-z]+$)(?!\d+$)(?![\W_]+$)\S{6,16}$/.test(value);  // 自定义规则
    if (value && !validateResult) {
      callback('密码为不小于8位的字母和数字或符号！');
    }
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    let { loginStatus, registerCode, registerTime } = this.state;
    const renderTabBar = (props, DefaultTabBar) => (

      <DefaultTabBar {...props} style={{ width: '100%' }} />

    );
    return (
      <div className="login_content">
        <div className="header_logo">
          <div className="header_box">
            <img src={imagelogo} alt="" />
            <span className="logo_name">ForceUp</span>
          </div>
        </div>
        <div className="login_box">
          <Row>
            <Col xs={4} sm={4} md={4} lg={4} xl={4}>

            </Col>
            <Col xs={8} sm={8} md={8} lg={8} xl={8}>
              <div className="img_box">
                <img src={imagebird} alt="" />
                <div className="text_box">
                  <p className="head_text">ForceUp 无限量 无限速</p>
                  <p>没有什么能够阻挡</p>
                  <p>我对自由的向往</p>
                  <p>天马行空的生涯</p>
                  <p>你的心了无牵挂</p>
                  <p>摘自《蓝莲花》</p>
                </div>
              </div>
            </Col>
            <Col xs={6} sm={6} md={6} lg={6} xl={6} offset={2}>
              <Tabs
                style={{ width: 352 }}
                renderTabBar={renderTabBar}
                defaultActiveKey="1" onChange={this.callback} tabBarGutter={10} >
                <TabPane tab={loginStatus === 'forget' ? "重置密码" : "登录"} key="1" style={{ padding: "20px 30px 10px" }}>
                  <LoginForm forgetPassword={this.forgetPassword} />
                </TabPane>
                <TabPane tab="注册" key="2" style={{ padding: "20px 30px 0" }}>
                  <Form onSubmit={this.handleSubmitRegister} className="register-form">
                    <Form.Item>
                      {getFieldDecorator('mobilephone', {
                        rules: [{ required: true, message: '请输入注册的手机号!' }, { validator: this.checkPhone }],
                      })(
                        <Input
                          prefix={<Icon type="phone" style={{ color: 'rgba(0,0,0,.25)' }} />}
                          placeholder="请输入注册的手机号"
                          size="large"
                        />,
                      )}
                    </Form.Item>
                    <Form.Item>
                      {getFieldDecorator('mobilecode', {
                        rules: [{ required: true, message: '请输入验证码!' }],
                      })(
                        <Input
                          placeholder="请输入验证码"
                          style={{ width: '60%' }}
                          size="large"
                        />,
                      )}
                      {
                        registerCode == true ?
                          <Button style={{ width: '40%' }} size="large" onClick={this.sendcode.bind(this)}>发送验证码</Button> :
                          <Button style={{ width: '40%' }} size="large">{registerTime + 's'}</Button>
                      }
                    </Form.Item>
                    <Form.Item hasFeedback>
                      {getFieldDecorator('pass_word', {
                        rules: [
                          {
                            required: true,
                            message: '请输入你的密码!',
                          },
                          {
                            validator: this.NextPassword,
                          },
                        ],
                      })(<Input.Password placeholder="请输入你的密码" prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} size="large" />)}
                    </Form.Item>
                    <Form.Item hasFeedback>
                      {getFieldDecorator('confirm', {
                        rules: [
                          {
                            required: true,
                            message: '请确认你的密码!',
                          },
                          {
                            validator: this.FirstPassword,
                          },
                        ],
                      })(<Input.Password onBlur={this.handleConfirmBlur} placeholder="请确认你的密码" prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} size="large" />)}
                    </Form.Item>
                    <Form.Item>
                      <Button size="large" type="primary" htmlType="submit" className="register-form-button" style={{ width: '100%' }}>
                        注册
                      </Button>
                    </Form.Item>
                  </Form>
                </TabPane>
              </Tabs>
            </Col>
            <Col xs={4} sm={4} md={4} lg={4} xl={4}>

            </Col>
          </Row>
        </div>
        <div className="footer_box">
          <div className="footer_text">
            <span>ForceUp 安全、便捷、无限量、无限速</span>
            <span className="ipfs_span">&copy;2018 - 2019 IPFS原力区 All Rights Reserved</span>
            <span>价值 · 共建 · 共享 · 荣耀</span>
          </div>
        </div>
      </div>
    )
  }
}
const WrappedNormalLoginForm = Form.create({ name: 'normal_login' })(Login);
export default WrappedNormalLoginForm;