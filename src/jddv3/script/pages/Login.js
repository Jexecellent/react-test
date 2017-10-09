import React , {Component} from 'react';
import APIConfig from '@welab/xlib-react-components/components/APIConfig';
import Config from '../helper/config';
import FullScreen from "../component/FullScreen";

import Agreement from '../component/Agreement';
import FormInput from '../component/FormInput';
import OtpInput from '../component/OtpInput';
import { Toast } from '@welab/xlib-react-components';
import Ua from '@welab/xlib-corejs/lib/ua';
import Biz from '../helper/biz';
import Wedefend from '../helper/wedefend';
import Validate from '../helper/validator';
class Login extends Component{
  constructor(props) {
    super(props);
    this.isNewUser = false;
    this.getMobile = this.getMobile.bind(this);
  }

  doValidate() {
    return this.validateMobile() && this.validateOtp() && this.validateAgreement();
  }

  validateMobile() {
    const isMobileValidate = this.refs['mobileInput'].isValid();
    if (this.getMobile() == '') {
      this.toast.show('请输入手机号')
      return;
    }
    if (!isMobileValidate) {
      utils.report('lg_phone_err', '', false);
      utils.hmtReport('登录页_phone_format_error');
      this.toast.show(Validate.validate('mobile', this.getMobile()).errorMessage)
    }
    return isMobileValidate;
  }

  validateOtp() {
    const isOtpValidate = this.refs['otpInput'].isValid();
    if (!isOtpValidate) {
      if (!this.refs['otpInput'].getValue()) {
        utils.report('lg_otp_null', '', false);
      } else {
        utils.report('lg_otp_err', '', false);
      }
      this.toast.show(Validate.validate('otp', this.refs['otpInput'].getValue()).errorMessage)
    }
    return isOtpValidate;
  }

  validateAgreement() {
    let res = this.refs['agreement'].isAgree();
    if (!res) {
      this.toast.show('请先同意注册与服务协议');
    }
    return res;
  }

  getMobile() {
    return this.refs['mobileInput'].getValue();
  }

  onSubmit() {
    utils.report('lg_sub_clc', '', false);
    if (!this.doValidate()) {
      return;
    }
    let url = "v2/sessions";
    let params = {
      mobile: this.refs['mobileInput'].getValue(),
      otp: this.refs['otpInput'].getValue()
    }
    if (Ua.isWechat() && $.fn.cookie('openId')) {
      url = 'h5/sessions';
      params['stemFrom'] = 'WX';
      params['openId'] = $.fn.cookie('openId');
    }
    if (this.isNewUser) {
      params['user_role'] = 2;
      params['origin'] = utils.getChannel() || '';
    }
    window.inAjax = true;
    API.post(url, params).done((data, status, xhr) => {
      utils.report('lg_sub_clc_suc', '', false);
      utils.hmtReport('登录页_submit_success');

      store.session('LOGIN_JUMPED', null);
      store.session('LOAN_JUMPED', null);


      $.fn.cookie('openId', null);

      utils.setMobileAndToken(data['X-User-Mobile'], data['X-User-Token']);

      let wtype = this.isNewUser ? 'register' : 'login';
      Wedefend.report(wtype, () => {
        this.props.history.push('apply');
      });

    }).fail((xhr) => {
      utils.report('lg_sub_clc_fail', '', false);
      utils.hmtReport('登录页_submit_fail');
      utils.errorHandle(xhr, '', this.toast.show);
    });

  }

  sendOtp(verifyParams, callback) {
    utils.report('lg_otp_clc', '', false);

    let mobileObj = this.refs['mobileInput'];
    $.fn.cookie('X-User-Mobile', mobileObj.getValue());

    if (this.validateMobile()) {
      // do ajax call
      let sendOtpUrl = 'v3/sessions/h5/' + this.getMobile() + verifyParams;
      API.get(sendOtpUrl).done((data, status, xhr) => {

        if (data.new_user) {
          $.fn.cookie('IS_NEW_USER', true);
          this.isNewUser = true;
        } else {
          $.fn.cookie('IS_NEW_USER', null);
        }
        utils.report('lg_otp_clc_suc', '', false);
        utils.hmtReport('登录页_otp_send_success');
        callback(true);

      }).fail((xhr) => {
        utils.report('lg_otp_clc_fail', '', false);
        utils.hmtReport('登录页_otp_send_fail');
        callback(false);
        utils.errorHandle(xhr, '',this.toast.show);

      });
    }
    ;
  }

  componentDidMount() {
    utils.report('lg_load', '', false);

    utils.updatePageTitle('登录');
    if ($.fn.cookie('AUTO_LOGIN')) {
      $.fn.cookie('AUTO_LOGIN', null);
      if (!store.session('LOGIN_JUMPED')) {
        store.session('LOGIN_JUMPED', true);
        Biz.switchPageInfo((path) => {
          location.hash = `#/${path}`;
        });
      } else {
        utils.clearSession();
      }
    } else {
      utils.clearSession();
    }
  }

  mobileFocus() {
    utils.hmtReport('登录页_phone_input_click');
  }

  mobileChangeFormat() {
    if (this.getMobile() != '') {
      this.refs['otpInput'].setClass('opt active');
    } else {
      this.refs['otpInput'].setClass('opt');
    }
    const phoneFormat = this.getMobile().replace(/[^\d]/g, '').substr(0, 11).replace(/(^\d{3}\B|\d{4}\B)/g, "$1 ");
    this.refs['mobileInput'].setValue(phoneFormat);
  }

  otpFocus() {
    utils.hmtReport('登录页_otp_input_click');
  }

  render() {
    return (
      <FullScreen >
        <Toast ref={t => this.toast = t}></Toast>
        <div className="jdd-login">
          <img width='100%' className="head" src="//web.wolaidai.com/img/jdd/jddv2-login2.png"></img>
          <div className='jdd-login-form'>
            <FormInput ref="mobileInput"
                       name="mobile"
                       inputAttr={{
                         type: 'tel',
                         maxLength: 13,
                         placeholder: '请输入本人实名手机号'
                       }} noValidate
                       handleChange={this.mobileChangeFormat.bind(this)}
                       handleFocus={this.mobileFocus.bind(this)}/>
            <OtpInput ref="otpInput" inputNoValidate
                      getMobile={this.getMobile}
                      sendOtp={this.sendOtp.bind(this)}
                      validateFn={this.validateMobile.bind(this)}
                      handleFocus={this.otpFocus.bind(this)}/>

            <div className="btn-box">
              <button className="btn" onClick={this.onSubmit.bind(this)}>立即获取额度</button>
            </div>
            <Agreement ref="agreement" scrollWidth="auto" url="/staff/registAgreement.html" title="我已阅读并同意 "
                       proxy="《注册与服务协议》" checked="true"/>
            <div className='process-img'></div>
            {!utils.isProductEnv() ? <APIConfig storeKey="wolaidai_api_path"
                                                defaultPath="http://ijapi5.wolaidai.com/jrocket2/api/"></APIConfig> : ''}
          </div>
        </div>
      </FullScreen>
    );
  }
}
export default Login;