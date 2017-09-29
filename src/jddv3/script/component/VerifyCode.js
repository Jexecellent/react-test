import React from 'react';
import Validate from '../helper/validator';

export default class VerifyCode extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      verifyClass:'popup',
      verifyKey:'',
      verifyCode:'',
      errorMessage:''
    };
    this.doValidate = this.doValidate.bind(this);
    this.getVerifyParams = this.getVerifyParams.bind(this);
    this.getValue = this.getValue.bind(this);
    this.getVerifyKey = this.getVerifyKey.bind(this);
    this.refresh = this.refresh.bind(this);
    this.commit = this.commit.bind(this);

  }
  doValidate(){
    var validateResult = Validate.validate('verifyCode', this.getValue());
    this.setState({
      errorMessage: validateResult.result ? '' : validateResult.errorMessage
    });
    return validateResult.result;
  }
  getVerifyParams(){
    return "?verify_code_token=" + this.getVerifyKey() + "&verify_code=" + this.getValue();
  }
  getValue(){
    return this.refs.verifyCode.value;
  }
  getVerifyKey(){
  	return this.state.verifyKey;
  }
  refresh(){
    API.get('v3/sessions/h5/random_code').done((data)=>{
      this.setState({
        verifyKey: data.key
      });
      this.refs.verifyImg.src = "data:image/png;base64," + data.data;
    }).fail((xhr, errorType, error)=>{
      Utils.errorHandle(xhr, error);
    });
  }
  commit(){
    if(this.doValidate()){
      this.props.onCommit(this.getVerifyParams());
    }
  }
  render() {
    return (
    	<div className='popup verify-show'>
        <div className="alert"> 
          <div className="alert-title verify-title">请输入图片中的验证码</div> 
          <div className="alert-text">
            <div className="verify-div">
              <img ref='verifyImg' className="verify-img" onClick={this.refresh} />
              <span className="verify-refresh" onClick={this.refresh} ></span>
              <div>
                <input name='verifyCode' className="verify-input" placeholder='请输入图形验证码' ref='verifyCode'/>
                <p className='verify-error'>{this.state.errorMessage}</p>
              </div>
            </div>
          </div> 
          <div className="alert-button"> 
            <button className="btn btn-primary" onClick={this.commit}>获取短信验证码</button> 
          </div> 
        </div> 
      </div>
    );
  }
}