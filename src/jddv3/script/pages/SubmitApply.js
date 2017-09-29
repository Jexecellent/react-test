import React , {Component , PropTypes} from 'react';
import Ua from '@welab/xlib-corejs/lib/ua';
import {FormGroup,Input,Countdown} from '@welab/xlib-react-components';
import APIConfig from '@welab/xlib-react-components/components/APIConfig';
import Agreement from '../component/Agreement';
import Config from '../helper/config';
import FullScreen from "../component/FullScreen";

class SubmitApply extends Component{
  constructor(props){
    super(props);
  }
  countDown() {
    let count = 59;
    this.refs['otpBtn'].disabled = true;
    this.refs['otpBtn'].innerHTML = '60';
    this.intervalId = setInterval(() => {
      if (count <= 0) {
        clearInterval(this.intervalId);
        this.refs['otpBtn'].disabled = false;
        this.refs['otpBtn'].innerHTML = '重新获取';
      } else {
       this.refs['otpBtn'].innerHTML = `${count}s`;
        count--;
      }
    }, 1000);
  }
  componentWillMount(){

  }
  render(){
    return(
      <FullScreen color='#fff'>
        <div className='jdd-submitApply'>
          <div className="apply-money-wrap"><span className='apply-money'>10000</span>元</div>
          <div className="time-limit-wrap">期限: <span className="time-limit">12个月</span> </div>
          <div className="borrower-wrap"><span className="borrower-phone">克里斯</span> <span className="borrower-name">15989012100</span> </div>
          <FormGroup className='abc' withLabel={true} label="验证码" >
            <Input className='bcd' ref="mobile" attributes={{placeholder:"请输入验证码", maxLength: 11}} />
            <div className="otp-box">
              <button ref="otpBtn"
                      onClick={this.countDown.bind(this)}>获取验证码
              </button>
            </div>
          </FormGroup>
          <Agreement ref="agreement" scrollWidth="auto" url="/staff/registAgreement.html" title="同意 "
                     proxy="《借款服务与授权协议》" checked="true"/>
          <div className="btn-box">
            <button className="btn">提交</button>
          </div>
        </div>
        <div className="jdd-submitApply-finished">
          <div className="icon-submitStatus"></div>
          <span className='submit-status'>已提交审核</span>
          <div className='status-intro'>正在加速审批中,想第一时间了解审批结果 请关注我来贷公众号"<a className='officeWechat-link'>wolaidaichina</a>"</div>
          <div className="btn-box">
            <button className="btn">知道了</button>
          </div>
        </div>
      </FullScreen>
    )
  }
}
export default SubmitApply;