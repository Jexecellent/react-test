import Utils from './utils';
import Config from './config';
export default class Biz{
  static applyAmountCheck(amount,callback){
    API.get('v3/user/infos_and_application_allowed?amount='+amount).done((res)=>{
      callback(true);
    }).fail((xhr)=>{
      callback(false,xhr);
    });
  }
  static applyUserCheck(callback,toast){
    //老用户判断下身份，屏蔽学生贷款
    if (!$.fn.cookie('IS_NEW_USER')) {
      API.get('v3/user/login_info').done((res)=>{
        if (res.roleType===1) {
          toast('抱歉，暂不支持学生用户哦');
          callback(false);
        }else{
          callback(true);
        }
      }).fail((xhr)=>{
        Utils.errorHandle(xhr,'',toast);
        callback(false);
      });
    } else {
      callback(true);
    }
  }
  static switchPageInfo(callback){
    function originSchema() {
      API.get('v4/partner/user/switch_page_info').done((data)=>{
        let res = data.switch_page;
        //none:没有贷款, on_road:在途贷款, repayment:贷款还款中, reject:贷款被拒绝, confirmed: 贷款确认
        switch(res){
          case 'none':
            callback('apply');
            break;
          case 'on_road':
            if (data.loan_application_state == 'push_backed') {
              callback(`loan/push_back/${data.application_id}`);
            }else{
              callback('auditting');
            }
            break;
          case 'repayment':
            callback('loan/list');
            break;
          case 'reject':
            callback(`loan/reject/${data.application_id}`);
            break;
          case 'confirmed':
            callback(`loan/confirm/${data.application_id}`);
            break;
          default:
            callback('apply');
            break;
        }
      }).fail((xhr, errorType, error)=>{
        utils.errorHandle(xhr, error);
        callback('apply');
      });
    }

    originSchema();

  }

  static goStaff(staffPath) {
    if (!utils.isLogin()) {
      return;
    }
    if (!utils.isProductEnv()){
      $.fn.cookie('wolaidai_api_path', store.session('apiDomain')+'v2/', {path:'/'});
    }
    $.fn.cookie('H5-Product-Code',Config.app.productCode, {path:'/staff'});
    location.href = `/staff/main.html#/${staffPath}`;
  }

  static cacheProfile(profile){
    store.session('profile', profile);
  }

  static fetchProfile(){
    return store.session('profile');
  }

  static getUserBaseInfo(cb, alertMsg=true,toast){
    const profile = this.fetchProfile();
    // 若session中已经存入profile,说明用户已经填写了个人信息,调用callback
    if(profile) {
      cb && typeof cb === "function" && cb(profile);
      return;
    }
    // 若profile不存在,则提醒用户先完善个人信息
    API.get('h5/profile').done((data, status, xhr) => {
      if(Object.keys(data).length==0){
        // 没有填写任何个人信息
        alertMsg && toast('亲，请先完善个人信息~');
        return;
      }else{
        // 保存profile
        this.cacheProfile(data);
      }
      if(cb && typeof(cb)==="function"){
        cb(data);
      }
    })

    .fail((xhr)=>{
      Utils.errorHandle(xhr, '',toast);
    });
  }

}