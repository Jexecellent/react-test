/*
  其他信用授权组件
*/ 

import React, {Component} from 'react';
import MenuBar from '../component/MenuBar';
import FontIcon from '../component/FontIcon';
import FullScreen from '../component/FullScreen';
import Config from '../helper/config';
import classnames from 'classnames';
import Auth from '@welab/xlib-corejs/lib/auth';
import Toast from '@welab/xlib-react-components/components/Toast';

class OtherAuth extends React.Component {
  constructor(props) {
    super(props);
    const authItems = [{
      type: 'ZMXY', 
      authInfo: {
        authPath: 'zmxy',
        state: 'isZmxy',
        iconName: 'zhimaxinyong',
        iconColor: '#16bba2',
        text: '芝麻分授权',
        hide: utils.isHideChannel(),
        report: (cb) => {
          utils.report('auth_zmxy_click', cb)
        }
      }
    }, 
    {
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
    },
    {
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
    const secondauth = store.session('secondauth');
    let topItem = secondauth === 'ZMXY' ? authItems[1] : authItems[0];
    const topItemType = topItem.type;
    const otherAuthItems = [];
    if(!!store.session('offer')){
      topItem = authItems[1];
    }else{
      authItems.map((item) => {
        if (item.type !== secondauth && item.type !== topItemType) {
          otherAuthItems.push(item.authInfo);
        }
      });
    }
    this.state = {
      isOffer: !!store.session('offer'),  
      isZmxy: false,
      zmxyScore: 0,
      isHouseFund: false,
      isShebao: false,
      isCreditCard: false,
      isWorkProof: false,
      topItem: topItem.authInfo,
      showOtherAuth: false,  
      otherAuthItems: otherAuthItems
    };
    this.toAuth = this.toAuth.bind(this);
    this.saveAudit = this.saveAudit.bind(this);
  }

  componentDidMount() {
    utils.updatePageTitle("信用认证");
    utils.report('other_auth_load');

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

  saveAudit() {
    utils.report('other_auth_sub_clc');
    const goNext = () => {
      utils.report('other_auth_sub_clc_suc');
      const ext = $.fn.cookie('ext') || '';
      if(ext.indexOf('bld') !== -1) {
        try {
          platformBase('finishSelf');
        } catch (e) {
          console.log(e);
          this.toast.show('请点击导航栏返回');
        }
      } else if (ext.indexOf('dlb') !== -1) {
        location.href = '//credit.duolabao.com/index/auth/callback';
      } else {
        this.props.history.push('profile');
      }
    }

    const { topItem, otherAuthItems} = this.state;
    let authed = this.state[topItem.state];
    !authed && otherAuthItems.some((item) => {
        if (this.state[item.state]) {
            authed = true;
            return true;
        }
    })

    if (authed) {
        utils.mtaReport("otherauthorization");
        utils.mtaReport('yonghujinjianzh', {'otherauthorizationdone': 'true'});
        utils.mtaReport('yonghujinjianzh-1', {'otherauthorization': 'true'});
        goNext();
    } else {
        utils.report('other_auth_sub_clc_need_auth');
        this.toast.show('请您至少授权任意一项！');
    }
  }

  render() {
    const { topItem, otherAuthItems,showOtherAuth } = this.state;
    return (
      <FullScreen footer={false}>
        <div className="otherauth-page">
          <h5>继续认证，补充下面任意一项即可</h5>
          <MenuBar onClick={this.toAuth(topItem.authPath, this.state[topItem.state], topItem.report)}
                   leftIcon={<FontIcon iconName={topItem.iconName} color={topItem.iconColor}/>} 
                   rightIcon={this.state[topItem.state]?<FontIcon iconName="icon_ok" color="#00CE83"/>:<FontIcon iconName='icon_arrow' fontSize='0.28rem' color="#ccc"/>} 
                   status={this.state[topItem.state] ? '' : '选填'}
                   text={topItem.text}/>
          <MenuBar onClick={() => { const showOtherAuth = this.state.showOtherAuth;this.setState({showOtherAuth: !showOtherAuth}) }}
                   leftIcon={<FontIcon iconName='qita' color='#ff862e'/>}
                   rightIcon={<FontIcon iconName={showOtherAuth ? 'shanglax':'xialax'} fontSize='0.16rem' color="#ccc"/>}  
                   status='选填'
                   text='其它信用'/>
          {showOtherAuth ? otherAuthItems.map((item,index) => {
            return(
              <MenuBar key={index} 
                       onClick={this.toAuth(item.authPath, item.authPath === 'workProof' ? false : this.state[item.state], item.report)}
                       leftIcon={<FontIcon iconName={item.iconName} color={item.iconColor}/>} 
                       rightIcon={this.state[item.state]?<FontIcon iconName="icon_ok" color="#00CE83"/>:<FontIcon iconName='icon_arrow' fontSize='0.28rem' color="#ccc"/>} 
                       status={this.state[item.state] ? '' : '选填'}
                       text={item.text}/>
            )
          }): null}       
          <div className="wrap-btns">
            <button onClick={this.saveAudit} className="btn">保存</button>
          </div>
          <Toast timeout={1500} ref={ toast => this.toast = toast }></Toast>
        </div>
      </FullScreen>
    );
  }
}
export default OtherAuth;