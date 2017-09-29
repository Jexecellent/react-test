export default class Wedefend{
  static report(eventType,callback){
    let win = window,
      doc = document,
      br = win["BAIRONG"] = (win["BAIRONG"] || {}),
      h = doc.getElementsByTagName("head")[0],
      s = doc.createElement("script");
      s.type = "text/javascript";
      s.async = true;
      s.charset = "utf-8";
      s.src = win.location.protocol+'//static.100credit.com/braf/js/braf.min.js';
      if (utils.isProductEnv()){
        br.client_id = "3000292";
      }else{
        br.client_id = "3100031";
      }
      h.appendChild(s);
      br.BAIRONG_INFO = {
        "app" : "antifraud",
        "event" : eventType, //login、lend、register
        "page_type" : "dft"
      };
      win.GetSwiftNumber = data =>{
        let setting = API.apiSetting('post', 'v3/report/fm');
        setting.beforeSend = function(){};
        setting.complete = function(){};
        setting.data = JSON.stringify({
          account:$.fn.cookie('X-User-Mobile'),
          event: 'antifraud_'+win["BAIRONG"].BAIRONG_INFO.event,
          type:"bairong",
          data:data
        });
        $.ajax(setting).done(res =>{
          let ar = [];
          let ns = s.nextElementSibling;
          while (ns) {
            ar.push(ns);
            ns = ns.nextElementSibling;
          }
          for (let i = 0; i < ar.length; i++) {
            h.removeChild(ar[i]);
          }
          h.removeChild(s);
        });
      };
    callback();
  }
};
