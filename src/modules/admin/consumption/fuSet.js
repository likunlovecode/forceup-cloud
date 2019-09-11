import React from 'react';
import { Input,Button,Modal } from 'antd';
import './fuset.less';
class FuSet extends React.Component {

  state ={
    modal2Visible:false,
    old_price:'',
    new_price:''
  }

  constructor(props){
    super(props);
    this.update = this.update.bind(this);
  }

  update(){
    this.setState({
      modal2Visible:true,
      old_price:'当前价格：1 RMB=10 FU',
      new_price:"修改价格：1 RMB=20 FU"
    })
  }

  setModal2Visible(modal2Visible) {
    this.setState({ modal2Visible });
  }

  render() {
    const { TextArea } = Input;
    let {old_price,new_price} = this.state;
    return(
      <div className="fu_set">
        <div className="flex-row">
          <div className="fu_text">
            <span>当前价格：</span>
            <span>1RMB = 10FU</span>
            <span style={{marginLeft:"1rem"}}>修改价格：</span>
            <span>1RMB=</span>
          </div>
          <div className="input_text">
            <Input placeholder="请输入FU" size="large"/>
          </div>
          <div>
            <span> FU</span>
          </div>
          <div style={{marginLeft:"1rem"}}>
            <Button type="primary" style={{width:'2rem'}} size="large" onClick={this.update}>修改</Button>
          </div>
          <Modal
            title="FU价格设置"
            centered
            visible={this.state.modal2Visible}
            onOk={() => this.setModal2Visible(false)}
            onCancel={() => this.setModal2Visible(false)}
          >
            <div className="flex-row flex-center">
              <div style={{width:'50%'}}>
                <TextArea rows={4} value={old_price}/>
              </div>
              <div style={{width:'50%'}}>
                <TextArea rows={4} value={new_price}/>
              </div>
            </div>
          </Modal>
        </div>
      </div>
    )
  }
}

export default FuSet;