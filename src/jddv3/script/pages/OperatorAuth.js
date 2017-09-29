/*
  运营商授权组件
*/ 

import React, {Component} from 'react';
import BizHelper from '../helper/biz';
import Config from '../helper/config';
import Auth from '@welab/xlib-corejs/lib/auth';
import FullScreen from '../component/FullScreen';
import FontIcon from '../component/FontIcon';
import {Steps, Step} from '../component/StepIndex';

class OperatorAuth extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOperator: false  
    }
    this.toAuth = this.toAuth.bind(this);
  }

  componentDidMount() {
    utils.updatePageTitle("身份信息");
    utils.report('operator_auth_load');
    
    API.get('v3/authorization/checkAuth').done((data) => {
      let auth = data.auth;
      if (auth){
        if (auth.mobileAuth && auth.mobileAuth.isAuth){
          this.setState({
              isOperator: auth.mobileAuth.isAuth
          });
        }
      }
    })
  }

  toAuth(path,disable){
    return () => {
      if(!disable) {
        const profile = BizHelper.fetchProfile();
        const report = (eventKey) => {
          profile && utils.report(eventKey,() => {
            Auth.jumpAuth({
              name: path,
              productCode: Config.app.productCode,
              apiPath: store.session('apiDomain'),
              redirect: location.href
            });
          });  
        }
        report('auth_operator_click');
        }else {
          utils.report('auth_operator_suc');
          utils.mtaReport('operatorauthsubmit');
          utils.mtaReport('yonghujinjianzh-1',{'operatorauthsubmit':'true'});
          this.props.history.push('facecert');
        }
    }
  }

  render() {
    const isOperator = this.state.isOperator;
    return (
      <FullScreen footer={false} color={'#fff'}>
        <div className="operatorauth-page">
          <div className="operatorauth-progress">
            <Steps current={1}>
              <Step title="身份信息" icon={<i className="iconfont" style={{fontSize:'50px'}}>&#xe65b;</i>} />
              <Step title="实名认证" icon={<i className="iconfont" style={{fontSize:'50px'}}>&#xe65c;</i>} />
              <Step title="提交申请" icon={<i className="iconfont" style={{fontSize:'50px'}}>&#xe65a;</i>} />
            </Steps>
          </div>
          <div className="operatorauth-pic">
            { isOperator ? <FontIcon iconName="icon_ok" color="#00CE83" fontSize='0.65rem'/> :''}
          </div>
          <p className="operatorauth-title">实名认证</p>
          <p className="operatorauth-description">国家规定网络资金交易必须实名认证，为了保证款项顺利发放到<span>克*斯</span>银行账户，请用实名认证手机验证</p>
          <div className="operatorauth-btn">
            <button className="btn" onClick={this.toAuth('operator', isOperator)}>
              { isOperator ? '已认证，下一步' : '实名认证' }
            </button>
          </div>
        </div>
      </FullScreen>
    );
  }
}
export default OperatorAuth;
