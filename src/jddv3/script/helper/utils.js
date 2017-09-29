/**
 * 工具类
 */
import BaseUtils from '@welab/xlib-corejs/lib/utils';
import Ua from '@welab/xlib-corejs/lib/ua';
import report from '@welab/xlib-corejs/lib/report';
const Utils = {

  isProductEnv:function(){
    return env === "prod"
  },

  isLogin:function(){
    return true;
    // return $.fn.cookie('X-User-Mobile') && $.fn.cookie('X-User-Token');
  },
  isLocalEnv:function() {
    return !location.hostname.endsWith('.wolaidai.com');
  },

  getCookieOptions:function() {
    return !this.isLocalEnv() ? {
      expires: 7,
      domain: `.wolaidai.com`,
      path: '/'
    } : {
      expires: 7,
      path: '/'
    }
  },

  setMobileAndToken: function(mobile, token) {
    //清除以前旧token
    $.fn.cookie('X-User-Mobile', null);
    $.fn.cookie('X-User-Token', null);

    let cookieOptions = this.getCookieOptions();

    $.fn.cookie('X-User-Mobile', mobile, cookieOptions);
    $.fn.cookie('X-User-Token', token, cookieOptions);
  },
  clearSession:function() {
    if ($.fn.cookie('X-User-Mobile')) {
      $.fn.cookie('X-User-Mobile', null);
    }
    if ($.fn.cookie('X-User-Token')) {
      $.fn.cookie('X-User-Token', null);
    }
    $.fn.cookie('X-User-Mobile', null, {
      path: '/',
      domain: '.wolaidai.com'
    });
    $.fn.cookie('X-User-Token', null, {
      path: '/',
      domain: '.wolaidai.com'
    });
  },
  isNewUser: function() {
    if ($.fn.cookie('IS_NEW_USER') === 'true') {
      store.session('isNewUser', true);
      $.fn.cookie('IS_NEW_USER', null);
      $.fn.cookie('IS_NEW_USER', null, {
        path: '/',
        domain: '.wolaidai.com'
      });
    }
    return store.session('isNewUser');
  },

  updatePageTitle:function(title){
    document.title=title;
    // hack在微信等webview中无法修改document.title的情况
    if (Ua.isWechat() || Ua.isQQ()) {
      const $body = $('body');
      const $iframe = $('<iframe src="/static/modules/app/images/favicon.png"></iframe>').on('load', function() {
        setTimeout(function() {
          $iframe.off('load').remove()
        }, 0);
      }).appendTo($body);
    }
  },

  getQueryParams: function(search,key){  
    if(search && key){
      const params = new URLSearchParams(search);
      return params.get(key);
    }
  },

  alert: function(content, title, callback, hideOk, btnText) {
    var _content = content.length > 84 ? content.substr(0, 81) + '...' : content;
    var _title = arguments[1] || '';

    if ($('#alertCover').length == 0) {
      if (!btnText) {
        btnText = '知道了';
      }
      $('body').append('<div id="alertCover" class="popup" style="display:block;"> <div class="alert"> <div class="alert-title">' + _title + '</div> <div class="alert-text">' + _content + '</div> <div class="alert-button"> <button class="btn btn-primary" style="display:' + (hideOk ? 'none;' : 'block;') + '">' + btnText + '</button> </div> </div> </div>');

      $('#alertCover button').click(function() {
        if (callback && typeof callback === 'function') {
          callback();
        }
        $('#alertCover').remove();
      });

      if (!this._attached) {
        this._attached = true;
        window.addEventListener('hashchange', function() {
          if ($('#alertCover').length != 0) {
            $('#alertCover').remove();
          }
        }, false);
      }

    } else {
      $('#alertCover').remove();
      this.alert(content, title, callback);
    }
  },

  errorHandle: function(xhr, callback4AlertOK,alertFun) {
    const handleAlert = (() => {
      if(alertFun && typeof alertFun === 'function') return alertFun;
      return this.alert.bind(this);
    })();
    if (xhr.status == 405) {
      handleAlert('请求方式被拒绝!');
      return;
    }
    if (xhr.status == 500 || xhr.status == 502) {
      handleAlert('服务器异常，请稍后重试...');
      return;
    }

    if (xhr.status === 401 || xhr.status === 403) {
      handleAlert('您的会话已过期，请重新登录');
      location.href = 'login';
      return;
    };
    const iterateErrors = obj => {
      if (obj) {
        var values = [];
        for (var prop in obj) {
          if (obj.hasOwnProperty(prop)) {
            values.push(obj[prop]);
          }
        }
        return values.length ? values.join(",") : "";
      };
      return;
    }

    const showError = function(xhr) {
      if (xhr.response) {
        var rsp = JSON.parse(xhr.response);
        if (rsp.message) {
          handleAlert(rsp.message,'', callback4AlertOK);
        } else if (rsp.error) {
          handleAlert(rsp.error,'', callback4AlertOK);
        } else if (rsp.errors) {
          handleAlert(iterateErrors(rsp.errors),'', callback4AlertOK);
        };
      } else {
        location.reload();
      }
    }.bind(this);

    try {
      showError(xhr);
    } catch (e) {
      console.error(e);
    }
  },

  hideLoading: function(){
    window.inAjax = false;
    $('#loadingMask').hide();
    $('#loader').hide();
  },

  getMobile: function() {
    return $.fn.cookie('X-User-Mobile');
  },

  getToken: function() {
    return $.fn.cookie('X-User-Token');
  },

  getChannel: function() {
    return $.fn.cookie('channel') || 'op_prm_oth_00000001';
  },

  report: function(eventKey, callback, isOnlyNew = true) {
    callback && typeof callback === 'function' && callback();
    return;
    // if (!this.isNewUser() && isOnlyNew) {
    //   callback && typeof callback === 'function' && callback();
    //   return;
    // }
    // const postData = {
    //   "module": 'welab_toc_jddv3',
    //   "product": 'jddv3',
    //   "event": eventKey,
    //   "channel": this.getChannel(),
    //   "userId": $.fn.cookie("X-User-Mobile") || ""
    // };
    // report(postData, callback);
  },

  mtaReport: function(eventName, options) {
    if (!this.isNewUser()) {
      return;
    }
    if (options && typeof options === 'object') {
      window.MtaH5 && window.MtaH5.clickStat(eventName, options);
    } else {
      window.MtaH5 && window.MtaH5.clickStat(eventName);
    }
  },

  hmtReport: function(eventName) {
    window._hmt && window._hmt.push(['_trackEvent', eventName, this.getChannel()]);
  },

  isHideChannel: function() {
    const channels = ['on_prm_cor_40000000', 'on_prm_rzj_10000001', 'on_prm_cor_15000000', 'on_prm_cor_99000001', 'on_prm_cor_40000001', 'on_prm_cor_40000006', 'on_prm_cor_35000013', 'on_prm_cor_15300001', 'on_prm_cor_15300000'];
    const nowChannel = this.getChannel();
    return channels.indexOf(nowChannel) !== -1;
  }
}
export default Object.assign(Utils,BaseUtils);