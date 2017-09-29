/*
  芝麻信用授权组件
*/ 

import React, {Component} from 'react';
import BizHelper from '../helper/biz';
import Config from '../helper/config';
import Auth from '@welab/xlib-corejs/lib/auth';
import FontIcon from '../component/FontIcon';
import FullScreen from '../component/FullScreen';
import Toast from '@welab/xlib-react-components/components/Toast';

class ZmxyAuth extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      zmxyScore: '',
      secondauth: {
        type: 'ZMXY',
        isAuthed: false,
        authPath: 'zmxy'          
      }
    }
    this.toAuth = this.toAuth.bind(this);
    this.noZmxy = this.noZmxy.bind(this);
  }

  componentDidMount() {
    utils.updatePageTitle("信用认证");
    utils.report('zmxy_auth_load');

    API.get('v3/authorization/checkAuth').done((data) => {
      var state = this.state;
      let auth = data.auth, authState = {...state};
      if (auth){
        if (auth.zmxyAuth && auth.zmxyAuth.isAuth){
          authState.secondauth = {
            type: 'ZMXY',
            isAuthed: true,
            authPath: 'zmxy'
          };
        }
        store.session('secondauth',authState.secondauth.type);
        this.setState(authState);
      }
    });

    BizHelper.getUserBaseInfo((profile) => {
      // 获取用户的姓名、手机号、身份证号
      const params={
        platformPath: 'wedefend',
        account: $.fn.cookie('X-User-Mobile'),
        certNo: profile.cnid,
        name: profile.name,
        platform: 'H5',
        certType: 'IDENTITY_CARD'
      }
      API.post('v1/zmxyScore', params)
      .done((response) => {
        if (response.data && response.data.ret===0 && response.data.zmxyScore) {
          const zmxyScore = response.data.zmxyScore.zmxyScore;
          this.setState({
            zmxyScore: zmxyScore
          })
        }
      }).fail((xhr) => {
        utils.errorHandle(xhr,null,this.toast.show);
      })
    },null,this.toast.show);
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
        report('auth_zmxy_click');
      } else {
        if(this.state.zmxyScore > 650) {
          this.props.history.push('profile');
        } else {
          this.props.history.push('otherAuth');
        }
      }
    }
  }


  noZmxy () {
    utils.report('auth_nozmxy_clc');
    utils.report('auth_nozmxy_clc_suc');
    utils.mtaReport('nozmxy');
    utils.mtaReport('yonghujinjianzh',{'nozmxy':'true'});
    this.props.history.push('otherAuth');
  }

  render() {
    const secondauth = this.state.secondauth;
    return (
      <FullScreen footer={false} color={'#fff'}>
        <div className="zmxyauth-page">
          <div className="zmxy-card">
            <div className="zmxy-logo">
              <div className="logo">
                { secondauth.isAuthed ? 
                  <div>
                    <i></i>
                    <FontIcon iconName="icon_ok" color="#00CE83" fontSize='0.65rem'/>
                  </div> : ''
                }
              </div>
            </div>
            <p className="zmxy-title">芝麻信用</p>
            <p className="zmxy-description">授权芝麻信用，进行信用认证</p>
            <div className="zmxy-btn">
              <button className="btn" onClick={this.toAuth(secondauth.authPath, secondauth.isAuthed)}>
                { secondauth.isAuthed ? '已授权，下一步' : '去授权' }
              </button>
            </div>
          </div>
          { !secondauth.isAuthed ? <div className="haveNoZMScore" onClick={this.noZmxy}>没有芝麻信用？</div> : ''}
          <Toast timeout={1500} ref={ toast => this.toast = toast }></Toast>
        </div>
      </FullScreen>
    );
  }
}
export default ZmxyAuth;