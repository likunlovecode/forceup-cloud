import React from 'react';
import { Button, Form, Icon, Input, message, } from 'antd';
import { objectToFormData } from '$common/utils';
import Cookies from 'js-cookie';
import history from '$client/history';
const store = require('store');

class loginform extends React.Component {
  state = {
    confirmDirty: false,
    loginStatus: "password",
    sendcode: true,
    codetime: 0,
    resetCode: true,
    resetTime: 0,
  }

  constructor(props) {
    super(props)
    this.loginByCode = this.loginByCode.bind(this);
    this.sendVcode = this.sendVcode.bind(this);
  }

  handleSubmitLogin = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      var phone = values.userphone;
      var pwd = values.password;
      var params = objectToFormData({ phone, pwd });
      if (!err) {
        Ajax({
          method: 'post',
          url: '/forceup/user/login',
          data: params
        }).then((res) => {
          if (res.Code === 3) {
            var sid = res.Data.SessionId;
            var account = res.Data.Account;
            Cookies.set('sid', sid)
            message.success(res.Msg);
            store.set('account', account);
            history.push('/user/myfile');
          } else if (res.Code === 5) {
            message.error(res.Msg);
          } else {
            Cookies.remove('sid');
            window.location.reload();
          }
        }).catch((error) => {
          console.log(error);
        })
      }
    });
  };

  loginByCode() {
    this.setState({
      loginStatus: 'code'
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

  loginByVcode = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      var phone = values.username;
      var vcode = values.phonecode;
      var params = objectToFormData({ phone, vcode });
      if (!err) {
        Ajax({
          method: 'post',
          url: '/forceup/user/login',
          data: params
        }).then((res) => {
          if (res.Code === 3) {
            var sid = res.Data.SessionId;
            Cookies.set('sid', sid)
            message.success(res.Msg);
            history.push('/user/myfile');
          }
        }).catch((error) => {
          console.log(error);
        })
      }
    });
  };

  sendVcode() {
    var input = this.props.form.getFieldsValue(['username']);
    var input_phone = input.username;
    var params = objectToFormData({ account: input_phone });
    Ajax({
      method: 'post',
      url: '/forceup/vcode/get',
      data: params
    }).then((res) => {
      if (res.Code === 3) {
        message.success(res.Msg);
        this.setState({
          sendcode: false,
          codetime: 30,
        })
        var auth_timetimer = setInterval(() => {
          if (this.state.codetime <= 0) {
            this.setState({
              sendcode: true,
            })
            clearInterval(auth_timetimer);
          } else {
            this.setState({
              codetime: this.state.codetime - 1
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

  resetVcode() {
    var input = this.props.form.getFieldsValue(['mobile_phone']);
    var input_phone = input.mobile_phone;
    var params = objectToFormData({ account: input_phone });
    Ajax({
      method: 'post',
      url: '/forceup/vcode/get',
      data: params
    }).then((res) => {
      if (res.Code === 3) {
        message.success(res.Msg);
        this.setState({
          resetCode: false,
          resetTime: 30
        })
        var auth_timetimer = setInterval(() => {
          if (this.state.resetTime <= 0) {
            this.setState({
              resetCode: true,
            })
            clearInterval(auth_timetimer);
          } else {
            this.setState({
              resetTime: this.state.resetTime - 1
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

  resetPassword = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      var phone = values.mobile_phone;
      var vcode = values.mobile_code;
      var pwd = values.pwd;
      var confirm_pwd = values.confirm_pas;
      var params = objectToFormData({ phone, vcode, pwd, confirm_pwd });
      if (!err) {
        Ajax({
          method: 'post',
          url: '/forceup/user/resetpwd',
          data: params
        }).then((res) => {
          if (res.Code == 3) {
            message.success(res.Msg);
            this.props.forgetPassword('password');
            this.setState({
              loginStatus: "password",
            })
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

  validateToNextPassword = (rule, value, callback) => {
    const { form } = this.props;
    let validateResult = /^(?![A-Z]+$)(?![a-z]+$)(?!\d+$)(?![\W_]+$)\S{6,16}$/.test(value);  // 自定义规则
    if (value && !validateResult) {
      callback('密码为不小于8位的字母和数字或符号！');
    }
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm_pas'], { force: true });
    }
    callback();
  };

  compareToFirstPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue('pwd')) {
      callback('两次密码不一样，请重新输入!');
    } else {
      callback();
    }
  };

  handleConfirmPass = e => {
    const { value } = e.target;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    let { loginStatus, sendcode, codetime, resetCode, resetTime } = this.state;
    let { forgetPassword } = this.props;
    return (
      <div>
        {
          loginStatus === 'password' ?
            <Form onSubmit={this.handleSubmitLogin} className="login-form">
              <Form.Item>
                {getFieldDecorator('userphone', {
                  rules: [{ required: true, message: '请输入登录的手机号!' }, { validator: this.checkPhone }],
                })(
                  <Input
                    prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    placeholder="请输入登录的手机号"
                    size="large"
                  />,
                )}
              </Form.Item>
              <Form.Item>
                {getFieldDecorator('password', {
                  rules: [{ required: true, message: '请输入密码!' }],
                })(
                  <Input
                    prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    type="password"
                    placeholder="请输入密码"
                    size="large"
                  />,
                )}
              </Form.Item>
              <Form.Item style={{marginBottom:'10px'}}>
                <Button size="large" type="primary" htmlType="submit" className="login-form-button" style={{ width: '100%' }}>
                  登录
                </Button>
              </Form.Item>
              <Form.Item style={{marginBottom:'0'}}>
                <div className="use_code">
                  <Button type="link" block style={{ textAlign: 'left' }} onClick={() => {
                    this.setState({ loginStatus: 'code' })
                    forgetPassword('code');
                  }}>
                    使用手机验证码登录
                  </Button>
                </div>
              </Form.Item>
              <Form.Item style={{marginBottom:'0'}}>
                <Button type="link" block style={{ textAlign: 'right' }} onClick={() => {
                  this.setState({ loginStatus: 'forget' })
                  forgetPassword('forget');
                }}>
                  忘了密码？
              </Button>
              </Form.Item>
            </Form> : loginStatus === 'code' ?
              <Form onSubmit={this.loginByVcode} className="login-form">
                <Form.Item>
                  {getFieldDecorator('username', {
                    rules: [{ required: true, message: '请输入登录的手机号!' }, { validator: this.checkPhone }],
                  })(
                    <Input
                      prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                      placeholder="请输入登录的手机号"
                      size="large"
                    />,
                  )}
                </Form.Item>
                <Form.Item>
                  {getFieldDecorator('phonecode', {
                    rules: [{ required: true, message: '请输入验证码!' }],
                  })(
                    <Input
                      placeholder="请输入验证码"
                      style={{ width: '60%' }}
                      size="large"
                    />,
                  )}
                  {
                    sendcode == true ?
                      <Button style={{ width: '40%' }} size="large" onClick={this.sendVcode}>发送验证码</Button> :
                      <Button style={{ width: '40%' }} size="large">{codetime + 's'}</Button>
                  }
                </Form.Item>
                <Form.Item style={{marginBottom:'10px'}}>
                  <Button size="large" type="primary" htmlType="submit" className="login-form-button" style={{ width: '100%' }}>
                    登录
                  </Button>
                </Form.Item>
                <Form.Item style={{marginBottom:'0'}}>
                  <Button type="link" block style={{ textAlign: 'left' }} onClick={() => {
                    this.setState({ loginStatus: 'password' })
                    forgetPassword('password');
                  }}>
                    使用账户密码登录
                  </Button>
                </Form.Item>
                <Form.Item style={{marginBottom:'0'}}>
                  <Button type="link" block style={{ textAlign: 'right' }} onClick={() => {
                    this.setState({ loginStatus: 'forget' })
                    forgetPassword('forget');
                  }}>
                    忘了密码？
                  </Button>
                </Form.Item>
              </Form> :
              <Form onSubmit={this.resetPassword} className="login-form">
                <Form.Item>
                  {getFieldDecorator('mobile_phone', {
                    rules: [{ required: true, message: '请输入手机号!' }, { validator: this.checkPhone }],
                  })(
                    <Input
                      prefix={<Icon type="phone" style={{ color: 'rgba(0,0,0,.25)' }} />}
                      placeholder="请输入手机号"
                      size="large"
                    />,
                  )}
                </Form.Item>
                <Form.Item>
                  {getFieldDecorator('mobile_code', {
                    rules: [{ required: true, message: '请输入验证码!' }],
                  })(
                    <Input
                      placeholder="请输入验证码"
                      style={{ width: '60%' }}
                      size="large"
                    />,
                  )}
                  {
                    resetCode == true ?
                      <Button style={{ width: '40%' }} onClick={this.resetVcode.bind(this)} size="large">发送验证码</Button> :
                      <Button style={{ width: '40%' }} size="large">{resetTime + 's'}</Button>
                  }
                </Form.Item>
                <Form.Item hasFeedback>
                  {getFieldDecorator('pwd', {
                    rules: [
                      {
                        required: true,
                        message: '请输入你的密码!',
                      },
                      {
                        validator: this.validateToNextPassword,
                      },
                    ],
                  })(<Input.Password placeholder="请输入你的密码" prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} size="large" />)}
                </Form.Item>
                <Form.Item hasFeedback>
                  {getFieldDecorator('confirm_pas', {
                    rules: [
                      {
                        required: true,
                        message: '请确认你的密码!',
                      },
                      {
                        validator: this.compareToFirstPassword,
                      },
                    ],
                  })(<Input.Password onBlur={this.handleConfirmPass} placeholder="请确认你的密码" prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} size="large" />)}
                </Form.Item>
                <Form.Item style={{marginBottom:'5px'}}>
                  <Button size="large" type="primary" htmlType="submit" className="password-form-button" style={{ width: '100%'}}>
                    重置密码
                  </Button>
                </Form.Item>
                <Form.Item style={{marginBottom:'0px'}}>
                  <Button size="large" type="link" style={{ width: '100%',textAlign:'right'}} onClick={() => {
                    this.setState({ loginStatus: 'password' })
                    forgetPassword('password');
                  }}>
                    登录
                  </Button>
                </Form.Item>
              </Form>
        }
      </div>
    )
  }
}
const WrappedNormalLoginForm = Form.create({ name: 'normal_login' })(loginform);
export default WrappedNormalLoginForm;