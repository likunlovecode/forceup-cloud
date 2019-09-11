import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  setCommon,
  getSpace
} from '$common/actions'


@connect((state) => ({
  totalSpace:state.common.totalSpace,
}), {
    setCommon,
    getSpace
  })
class Foot extends Component {
  state = {

  }
  constructor(props) {
    super(props)
  }
  componentDidMount() {
    this.init()
    
  }
  async init() {
    let {getSpace} = this.props;
    getSpace();
  }

  render() {
    let {totalSpace} = this.props;
    return (
      <div className="sider-foot">
        <div className="usage flex-row cross-center">
          <div className="usage-text">已占用空间</div>
          <div className="usage-value">{`${totalSpace}` || ''}</div>
        </div>
        <div className="foot-intro">
          <div style={{ fontSize: '0.20rem', paddingBottom: 5 }}>ForceUp</div>
          <div style={{ fontSize: '0.14rem' }}>安全、便捷、无限量、无限速</div>
        </div>
      </div>
    )
  }
}

export default Foot
