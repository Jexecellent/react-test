import React from 'react';
import Installment from '../component/Installment';
import { Toast } from '@welab/xlib-react-components';
import MenuBar from '../component/MenuBar';
import FontIcon from '../component/FontIcon';
import Biz from '../helper/biz';
import FullScreen from "../component/FullScreen";
const MaxLoanLimit = {
    offer: 30000,
    jdd: 30000//本来是正常五万要授权人行征信，但是因为转化率大幅下降，所以暂调回3w
};

export default class Apply extends React.Component {
  constructor(props) {
      super(props);
      this.isCreditAuth = false;
      this.state = {
          loanLimit: this.getMaxLoanLimit(),
          profileChecked: false,
          authChecked: false
      };
  }

  getMaxLoanLimit() {
      return MaxLoanLimit['jdd'];
  }

  onSubmit() {
      // bb.test();
    Biz.applyUserCheck((checked) => {
      if (checked) {
        utils.report('apl_sub_clc');
        let instValue = this.refs['inst'].getValue();
        $.fn.cookie('amount', instValue.amount);
        $.fn.cookie('tenor', instValue.tenor);
        this.props.history.push('idcard');
      }
    });
  }

  onInstLoaded() {
      let amount = $.fn.cookie('amount'), tenor = $.fn.cookie('tenor');
      if (amount && tenor) {
          this.refs['inst'].setValue(amount - 0, tenor);
      }
  }

  goCoupons() {
      Biz.goStaff('coupons');
  }


    // onAmountChange(val) {
    //   let { authChecked,creditInfo,zmxyScore } = this.state;
    //   if(val > 30000) {
    //     authChecked =  creditInfo.auth.peopleBankcredit;
    //   } else {
    //     authChecked = creditInfo.auth && creditInfo.auth.operators && (creditInfo.auth.creditCard || creditInfo.auth.houseFund51 || creditInfo.auth.shebao51 || zmxyScore > 650 || creditInfo.company.workProof);
    //   }
    //   this.setState({
    //     authChecked: authChecked
    //   })
    // }
  pageChange(params){
    this.props.history.push(params);
  }
  componentDidMount() {
    utils.updatePageTitle('简单贷');
    const state = this.state;
    let authChecked = false;
    let zmxyScore = 0;
    window.inAjax = true;//多个ajax请求，防止第一个ajax返回旧隐藏蒙层
    const creditInfoPromise = new Promise((resolve,reject) => {
      API.get('h5/validate_H5Credit_Info').done((res)=>{
        resolve(res);
      }).fail((xhr, errorType, error)=>{
        reject(xhr);
      });
    });
    const profilePromise = new Promise((resolve,reject) => {
      API.get('h5/jdd/profile').done((result) => {
        resolve(result);
      }).fail((xhr) => {
        reject(xhr);
      });
    })
    Promise.all([creditInfoPromise,profilePromise]).then((data) => {
      const creditInfo = data[0];
      data[1] && store.session('profile',data[1]);
      authChecked = creditInfo.auth && creditInfo.auth.operators && (creditInfo.auth.creditCard || creditInfo.auth.houseFund51 || creditInfo.auth.shebao51  || creditInfo.company.workProof || creditInfo.auth.peopleBankcredit);
      const amount = this.refs['inst'].getValue().amount;
      //大于30000必须授权人行征信
      if(amount > 30000) {
        authChecked = authChecked && creditInfo.auth.peopleBankcredit;
      }
      this.setState({
        profileChecked: creditInfo.profile && creditInfo.profile.fillIn && creditInfo.company && creditInfo.company.fillIn,
        authChecked: authChecked,
        creditInfo: creditInfo
      },() => {
        if(this.state.profileChecked) {
          const profile = Biz.fetchProfile();
          const params={
            account:$.fn.cookie('X-User-Mobile'),
            certNo: profile.cnid,
            name: profile.name,
            platform: 'H5',
            certType: 'IDENTITY_CARD'
          }
          API.post('@wedefend/api/v1/zmxyScore', params)
          .done((response) => {
            utils.hideLoading();
            if (response.data && response.data.ret===0 && response.data.zmxyScore) {
                const zmxyScore = response.data.zmxyScore.zmxyScore;
                if(!authChecked) {
                  authChecked = creditInfo.auth && creditInfo.auth.operators && (zmxyScore > 650);
                }
                if(amount > 30000) {
                  authChecked = authChecked && creditInfo.auth.peopleBankcredit;
                }
                this.setState({
                  authChecked: authChecked,
                  zmxyScore: zmxyScore
                })
              }
          }).fail((xhr) => {
            utils.errorHandle(xhr);
          })
        }
        utils.hideLoading();
        if(this.state.authChecked) {
          if(creditInfo.auth.shebao51) {
            store.session('secondauth',"SHEBAO");
          }
          if(creditInfo.auth.houseFund51) {
            store.session('secondauth',"GJJ");
          }
          if(creditInfo.auth.creditCard) {
            store.session('secondauth',"XYK");
          }
          if(creditInfo.auth.zmxy) {
            store.session('secondauth',"ZMXY");
          }
        }
      });
    },(xhr) => {
      utils.errorHandle(xhr);
    })
  }


    render() {
    console.log(utils.isNewUser())
        return (
          <FullScreen>
            <Toast ref={t => this.toast = t}></Toast>
            <div className="jdd-apply">
                <div className="jdd-apply-banner">
                  <div className={utils.isNewUser()?'active newUser':'newUser'}>
                    <p className="title">最高可申请(元)</p>
                    <p className="amount">{this.state.loanLimit}</p>
                    <p className="guider">请准备好身份证，2分钟可完成申请</p>
                  </div>
                  <div className={utils.isNewUser()?'oldUser':'oldUser active'}>
                    <img className="borrower-headPortrait" src="//web.wolaidai.com/img/jddv3/headPortrait-default.png" alt=""/>
                    <div className="borrower-wrap"><span className="borrower-phone">克里斯</span> <span className="borrower-name">15989012100</span> </div>
                  </div>
                </div>
              <div className={utils.isNewUser()?'oldUser intro-card-float':'oldUser intro-card-float active'}>
                <a className="card card-myInfo" onClick={this.pageChange.bind(this,'mydata/idcard')}>
                  <FontIcon iconName="ziliao" fontSize='48px'/>
                  <div>我的资料</div>
                </a>
                <a className="card card-borrowRecord" onClick={this.pageChange.bind(this,'')}>
                  <FontIcon iconName="daikuan" fontSize='48px'/>
                  <div className='abc'>借款记录</div>
                </a>
              </div>
              <Installment ref="inst" maxValue={this.state.loanLimit}
                            onDataLoaded={this.onInstLoaded.bind(this)}/>
              <div className="btn-box">
                  <button className="btn" onClick={this.onSubmit.bind(this)}>立即申请</button>
              </div>

          </div>
        </FullScreen>
      );
  }
}