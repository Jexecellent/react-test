/**
 * Created by 刘志敏 on 2016/11/19.
 */

var navigatorMsg;
var screenMsg;
import API from './api';
//var locationMsg;

export default class wedefendMsg{
 static reportMsg(phoneNum){
    var obj = this.getMessage();
    obj.account = phoneNum;
    this.getPosition();
    var latitude = this.getCookie('latitude');
    var longitude = this.getCookie('longitude');
    obj.pos_longtitute = longitude;
    obj.pos_latitude = latitude;
    API.post('v3/report/applogs/h5', obj).done(function (data) {

    })
  }
 /**
  * 获取地理位置
  * */
 static getPosition(){
   var options = {
     enableHighAccuracy: true,
     timeout: 50000,
     maximumAge: 0
   };
   if(navigator.geolocation){
     navigator.geolocation.getCurrentPosition(this.setPosition.bind(this), this.getError, options);
   }
 }

 static setPosition(position){
   this.setCookie('latitude', position.coords.latitude ,3650);
   this.setCookie('longitude', position.coords.longitude ,3650)
 }
 static getError(error){
   if (error.code == error.TIMEOUT) {
     console.log('获取位置信息失败，请手动输入搜索.');
   } else if (error.code == error.PERMISSION_DENIED) {
     console.log('您拒绝了使用位置共享服务.');
   } else if (error.code == error.POSITION_UNAVAILABLE) {
     console.log('获取位置信息失败.');
   } 
 }

 static getMessage(){
   var reportObject = new Object();
   //reportObject.loanId = loanId;
   reportObject.navigator = this.collectNavigatorMsg();
   reportObject.screen = this.collectScreenMsg();
   return this.getReportString(reportObject,'Data');
 }

/**
 * 获取Navigator 浏览器信息
 */
static collectNavigatorMsg() {
  //alert('collectNavigatorMsg');// TODO
  navigatorMsg = new Object();

  // 由客户机发送服务器的 user-agent 头部的值
  navigatorMsg.userAgent = navigator.userAgent;
  // 运行浏览器的操作系统平台
  navigatorMsg.platform = navigator.platform;
  // 浏览器的名称
  navigatorMsg.appName = navigator.appName;
  // 浏览器的代码名
  navigatorMsg.appCodeName = navigator.appCodeName;
  // 浏览器的平台和版本信息
  navigatorMsg.appVersion = navigator.appVersion;
  // 是否启用 cookie
  navigatorMsg.cookieEnabled = navigator.cookieEnabled;
  navigatorMsg.javaEnabled = navigator.javaEnabled();

  var plugins = new Array();
  var pluginsLength = navigator.plugins.length;
  for (var i = 0; i < pluginsLength; i++) {
    var plugin = new Object();
    plugin.name = navigator.plugins[i].name;
    plugin.filename = navigator.plugins[i].filename;
    plugin.description = navigator.plugins[i].description;
    plugins[i] = plugin;
  }
  navigatorMsg.plugins = plugins;
  return navigatorMsg;
}

/**
 * 获取Screen 屏幕信息
 */
static collectScreenMsg() {
  //alert('collectScreenMsg');// TODO
  screenMsg = new Object();

  // 返回显示屏幕的高度。
  screenMsg.height = screen.height;
  // 返回显示器屏幕的宽度。
  screenMsg.width = screen.width;
  // 返回显示屏幕的高度 (除 Windows 任务栏之外)。
  screenMsg.availHeight = screen.availHeight;
  // 返回显示屏幕的宽度 (除 Windows 任务栏之外)。
  screenMsg.availWidth = screen.availWidth;
  // 分辨率
  screenMsg.pixelDepth = screen.pixelDepth;

  return screenMsg;
}

/**
 * 组装上报数据
 */
static getReportString(reportJsonObject,dataType){
  reportJsonObject.dataType = dataType;
  reportJsonObject.sdkVerson = "1.0";
  reportJsonObject.platform = "H5";
  reportJsonObject.appKey = "E62AB0E8E35D4AEE9A75C8A6A0A9C646";
  reportJsonObject.href = location.href;

  var myDate = new Date();
  reportJsonObject.collectTime = myDate.getTime();
  reportJsonObject.timeZone = myDate.getTimezoneOffset();

  var broswerId = this.getCookie("browserId");
  if (!this.checkValueExist(broswerId)) {
    broswerId = this.getUUID();
    this.setCookie("browserId", broswerId, 3650);
  }
  reportJsonObject.broswerId = broswerId;
  // fraudmetrix(broswerId);
  //var reportJsonString = JSON.stringify(reportJsonObject);

  return reportJsonObject;
}

static getCookie(c_name) {
  if (document.cookie.length > 0) {
    var c_start = document.cookie.indexOf(c_name + "=")
    if (c_start != -1) {
      c_start = c_start + c_name.length + 1
      var c_end = document.cookie.indexOf(";", c_start)
      if (c_end == -1)
        c_end = document.cookie.length
      return unescape(document.cookie.substring(c_start, c_end))
    }
  }
  return "";
}

static setCookie(c_name, value, expiredays) {
  var exdate = new Date();
  if (value != null && value != "" && value != "null" ) {
    exdate.setDate(exdate.getDate() + expiredays);
  } else {
    exdate.setDate(exdate.getDate() -1);
  }
  document.cookie = c_name + "=" + escape(value)
    + ((expiredays == null) ? "" : "; expires=" + exdate.toGMTString());
}

static checkValueExist(value) {
  if (value != null && value != "" && value != "null" && typeof value != 'undefined') {
    return true;
  } else {
    return false;
  }
}

static fraudmetrix($tokenId){
  window._fmOpt = {
    partner: 'wolaidai',
    appName: 'wolaidai_web',
    token: $tokenId
  };

  var cimg = new Image(1,1);
  cimg.onload = function() {
    _fmOpt.imgLoaded = true;
  };
  cimg.src = "https://fp.fraudmetrix.cn/fp/clear.png?partnerCode=wolaidai&appName=wolaidai_web&tokenId=" + _fmOpt.token;
  var fm = document.createElement('script'); fm.type = 'text/javascript'; fm.async = true;
  fm.src = ('https:' == document.location.protocol ? 'https://' : 'http://') + 'static.fraudmetrix.cn/fm.js?ver=0.1&t=' + (new Date().getTime()/3600000).toFixed(0);
  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(fm, s);
}

  /*
  * Generate a random uuid.
  *
  * USAGE: Math.uuid(length, radix) length - the desired number of characters
  * radix - the number of allowable values for each character.
  *
  * EXAMPLES: // No arguments - returns RFC4122, version 4 ID >>> Math.uuid()
  * "92329D39-6F5C-4520-ABFC-AAB64544E172" // One argument - returns ID of the
  * specified length >>> Math.uuid(15) // 15 character ID (default base=62)
  * "VcydxgltxrVZSTV" // Two arguments - returns ID of the specified length, and
  * radix. (Radix must be <= 62) >>> Math.uuid(8, 2) // 8 character ID (base=2)
  * "01001010" >>> Math.uuid(8, 10) // 8 character ID (base=10) "47473046" >>>
  * Math.uuid(8, 16) // 8 character ID (base=16) "098F4D35"
  */
  static getUUID() {
    // Private array of chars to use
    var CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
      .split('');

    // Math.uuid = function (len, radix) {
    var len = 32;
    var radix = 16;
    var chars = CHARS, uuid = [], i;
    radix = radix || chars.length;

    if (len) {
      // Compact form
      for (i = 0; i < len; i++)
        uuid[i] = chars[0 | Math.random() * radix];
    } else {
      // rfc4122, version 4 form
      var r;

      // rfc4122 requires these characters
      uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
      uuid[14] = '4';

      // Fill in random data. At i==19 set the high bits of clock sequence as
      // per rfc4122, sec. 4.1.5
      for (i = 0; i < 36; i++) {
        if (!uuid[i]) {
          r = 0 | Math.random() * 16;
          uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
        }
      }
    }
    return uuid.join('');
  } 
}

