/*
    所有授权信息
*/

import React, {Component} from 'react';
import classnames from 'classnames';
import MenuBar from '../component/MenuBar';
import FontIcon from '../component/FontIcon';
import Config from '../helper/config';
import FullScreen from '../component/FullScreen';
import Auth from '@welab/xlib-corejs/lib/auth';
import Toast from '@welab/xlib-react-components/components/Toast';

class Authorization extends React.Component {
  constructor(props) {
    super(props);
    const authItems = [{
      type: 'YYS', 
      authInfo: {
        authPath: 'operator',
        state: 'isOperator',
        iconName: 'shoujiyunyingshang',
        iconColor: '#ff5d3d',
        text: '运营商认证',
        hide: utils.isHideChannel(),
        report: (cb) => {
          utils.report('auth_operator_click', cb)
        }
      }
    },{
      type: 'XYK', 
      authInfo: {
        authPath: 'creditcard',
        state: 'isCreditCard',
        iconName: 'xinyongqia',
        iconColor: '#A8CCF7',
        placeHolder: '选填',
        text: '信用卡授权',
        report: (cb) => {
          utils.report('auth_creditcard_click', cb)
        }
      }
    },{
      type: 'ZMXY', 
      authInfo: {
        authPath: 'zmxy',
        state: 'isZmxy',
        iconName: 'zhimaxinyong',
        iconColor: '#16bba2',
        text: '芝麻分认证',
        hide: utils.isHideChannel(),
        report: (cb) => {
          utils.report('auth_zmxy_click', cb)
        }
      }
    },{
      type: 'GJJ', 
      authInfo: {
        authPath: 'housefund',
        state: 'isHouseFund',
        iconColor: '#ff862e',
        iconName: 'gongjijin',
        placeHolder: '选填',
        text: '公积金授权',
        hide: utils.isHideChannel(),
        report: (cb) => {
            utils.report('auth_housefund_click', cb)
        }
      }
    },
    {
      type: 'WORKPROOF', 
      authInfo: {
        authPath: 'workProof',
        state: 'isWorkProof',
        iconName: 'gongzuozheng',
        iconColor: '#ff862e',
        text: !!store.session('offer')?'offer证明':'工作证明',
        report: () => {
            utils.report('sauth_workpoof_clc')
        }
      }
    }, 
    {
      type: 'SHEBAO', 
      authInfo: {
        authPath: 'shebao',
        state: 'isShebao',
        iconName: 'gongxindaishebaotubiao',
        iconColor: '#ff862e',
        placeHolder: '选填',
        text: '社保授权',
        hide: utils.isHideChannel(),
        report: (cb) => {
            utils.report('auth_shebao_click', cb)
        }
      }
    }];
    const allAuthItems = [];
    authItems.map((item) => {
      allAuthItems.push(item.authInfo);
    });
    this.state = {
      isOperator: false,
      isCreditCard: false,
      isZmxy: false,
      isHouseFund: false,
      isWorkProof: false,
      isShebao: false,
      isOffer: !!store.session('offer'),  
      zmxyScore: 0,
      allAuthItems: allAuthItems
    };
    this.toAuth = this.toAuth.bind(this);
  }

  componentDidMount() {
    utils.updatePageTitle("我的资料");
    utils.report('all_auth_load');

    window.inAjax = true;
    const authPromise = new Promise((resolve, reject) => {
      API.get('v3/authorization/checkAuth').done((data) => {
        resolve(data);
      }).fail((xhr) => {
        reject(xhr);
      });
    })
    const documentsPromise = new Promise((resolve, reject) => {
      API.get('v3/documents', {
        style: 'high'
      }).done(data => {
        resolve(data);
      }).fail((xhr, error) => {
        reject(xhr);
      })
    });

    Promise.all([authPromise, documentsPromise]).then((data) => {
      const state = this.state, auth = data[0].auth, photos = data[1], authState = {...state};
      if (auth) {
        if (auth.mobileAuth) {
          authState.isOperator = auth.mobileAuth.isAuth;
        }
        if (auth.zmxyAuth) {
          authState.isZmxy = auth.zmxyAuth.isAuth;
        }
        if (auth.houseFundAuth) {
          authState.isHouseFund = auth.houseFundAuth.isAuth;
        }
        if (auth.creditcard) {
          authState.isCreditCard = auth.creditcard.isAuth;
        }
        if (auth.shebaoAuth) {
          authState.isShebao = auth.shebaoAuth.isAuth;
        }
        if (photos) {
          photos.some((item) => {
            if (item.doc_type === 'employment_proof') {
              authState.isWorkProof = true;
              return true;
            }
          })
        }
        this.setState(authState, () => {
          utils.hideLoading();
        });
      }
    }, (xhr) => {
      utils.errorHandle(xhr,null,this.toast.show);
    })
  }

  toAuth(path, disable, report) {
    return () => {
      if (!disable) {
        if (report && typeof report === 'function') {
          if(path === 'workProof') {
            report();
            this.props.history.push(path);
            return;
          }
          report(() => {
            Auth.jumpAuth({
              name: path,
              productCode: Config.app.productCode,
              apiPath: store.session('apiDomain'),
              redirect: location.href
            });
          });
        } else {
          API.goCommon(path, store.session('apiDomain'));
        }
      }
    }
  }

  render() {
    const allAuthItems = this.state.allAuthItems;
    return (
      <FullScreen footer={false}>
        <div className="authorization-page">
          <div className="authorization-section">
            <p className="authorization-describe">认证越多，额度和通过率越高</p>
              { allAuthItems.map((item,index) => {
                return(
                  <MenuBar key={index} 
                           onClick={this.toAuth(item.authPath, item.authPath === 'workProof' ? false : this.state[item.state], item.report)}
                           leftIcon={<FontIcon iconName={item.iconName} color={item.iconColor}/>} 
                           rightIcon={this.state[item.state]?<FontIcon iconName="icon_ok" color="#00CE83"/>:<FontIcon iconName='icon_arrow' fontSize='0.28rem' color="#ccc"/>} 
                           text={item.text}/>
                )
              })}   
          </div>
          <Toast timeout={1500} ref={ toast => this.toast = toast }></Toast>
        </div>
      </FullScreen>
    );
  }
}
export default Authorization;
