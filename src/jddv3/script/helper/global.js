/**
 * 全局初始化
 */
require('@welab/xlib-corejs');
require('@welab/xlib-corejs/lib/zepto.cookie');
require('@welab/xlib-corejs/lib/patch');
import Utils from './utils';
import Config from './config';
export default {
  init: function(){
    const MOBILE = 'X-User-Mobile';
    const TOKEN = 'X-User-Token';
    const PRODUCT_CODE = 'X-Product-Code';
    const SOURCE_ID = 'X-Source-Id';
    // 设置默认渠道
    if(!$.fn.cookie(Config.app.channel)) {
      $.fn.cookie(Config.app.channel, 'op_prm_oth_00000001');
    }

    if(/Android [4-6]/.test(navigator.appVersion)) {
      window.addEventListener("resize", function() {
        if(document.activeElement.tagName=="INPUT" || document.activeElement.tagName=="TEXTAREA") {
          window.setTimeout(function() {
              document.activeElement.scrollIntoViewIfNeeded();
          },0);
        }
      });
    }
    // code for compatibility with other project
    let apiDomain = Config.env.i5,
        wolaidaiAPIpath = $.fn.cookie('wolaidai_api_path') || Config.env.i5;
    if (wolaidaiAPIpath.length && wolaidaiAPIpath.indexOf('jrocket2')>-1 ) {
      let l = document.createElement('a');
      l.href = wolaidaiAPIpath;
      apiDomain = l.protocol +'//'+ l.host + '/';
    }

    if (!Utils.isProductEnv()){
      let apiPath = apiDomain + 'jrocket2/api/';
      // TODO remove in the feature.
      $.fn.cookie('wolaidai_api_path', apiPath + 'v2/', {path:'/common'});
      $.fn.cookie('wolaidai_api_path', apiPath + 'v2/', {path:'/staff'});
      $.fn.cookie('jdd_api_path', apiPath, {path:'/jdd'});
    }else{
      apiDomain = Config.env.production;
    }

    window.utils = Utils;
    window.store = require('store2');
    require('store2/src/store.cache');
    window.store = store.namespace(Config.app.name);
    store.session('apiDomain',apiDomain);

    API.query = function(type, url, data){
      let setting = this.apiSetting(type, url);
      if (data) {
        if (data.platformPath){
          setting.platformPath = data.platformPath;
          delete data.platformPath;
        }
        setting.data = type === 'get' ? $.param(data) : JSON.stringify(data);
      }
      return $.ajax(setting);
    }

    let loadingAjaxCount = 0;
    $(document).on('ajaxBeforeSend', function(e, xhr, options){
      let $cpSpinnerWrap = $('.cp-spinner-wrap');
      if($cpSpinnerWrap.css("display") !== 'block'){
        $('.cp-spinner-mask').show();
        $cpSpinnerWrap.show();
      }
      loadingAjaxCount ++;
      let apiUrl = apiDomain + (options.platformPath || 'jrocket2') + '/api/';
      if(!options.url.startsWith('http')){
        options.url = apiUrl + options.url;

        if ($.fn.cookie(MOBILE)){
          xhr.setRequestHeader(MOBILE, $.fn.cookie(MOBILE));
        }
        if ($.fn.cookie(TOKEN)){
          xhr.setRequestHeader(TOKEN, $.fn.cookie(TOKEN));
        }
        xhr.setRequestHeader(PRODUCT_CODE, Config.app.productCode);
        xhr.setRequestHeader(SOURCE_ID, "2");
        // 设置渠道时，需修改此值，暂时为空
        xhr.setRequestHeader("X-Origin", $.fn.cookie(Config.app.channel));
      }

    });
    $(document).on('ajaxComplete', function(e, xhr, options){
      let $cpSpinnerWrap = $('.cp-spinner-wrap');
      if(loadingAjaxCount <= 1){
        $('.cp-spinner-mask').hide();
        $('.cp-spinner-wrap').hide();
      }
      loadingAjaxCount --;
    });
  },
  loadConfigData : function(item, callback){
    if(!item){
      return;
    }
    if(typeof callback != 'function'){
      callback = function(){};
    }
    var local = store.session(item);
    if(local){
      return callback(local);
    }
    API.get('v2/config_datas?items=' + item + '_v0').done(function(data){
      if (data && data[item]) {
        store.session(item, data[item]);
        callback(data[item]);
      }
    }).fail(function(xhr) {});
  }
};
