export default class Validator{
  static get REGX() {
    return {
      'amount':{
        'reg': /^\d{4,5}$/,
        'errorMessage': '请填写正确的申请金额'
      },
      'tenor':{
        'reg': /^\S+$/,
        'errorMessage': '请选择贷款期限'
      },
      'mobile':{
        'reg': /^1[3|4|5|7|8][0-9]\d{8}$/,
        'errorMessage': '请输入正确的手机号码'
      },
      'liaisonMobile':{
        'reg': /^1[3|4|5|7|8][0-9]\d{8}$/,
        'errorMessage': '请输入正确的联系人手机'
      },
      'otp':{
        'reg': /^\d{6}$/,
        'errorMessage': '错误的验证码'
      },
      'knowLengthOtp':{
        'reg': /^\S+$/,
        'errorMessage': '错误的验证码'
      },
      'name':{
        'reg': /^[\u4e00-\u9fa5]([\u4e00-\u9fa5]{0,24}\u00b7{0,1}[\u4e00-\u9fa5]{1,24})+$/,
        'errorMessage': '请输入正确的姓名'
      },
      'liaisonName':{
        'reg': /^[\u4e00-\u9fa5]([\u4e00-\u9fa5]{0,24}\u00b7{0,1}[\u4e00-\u9fa5]{1,24})+$/,
        'errorMessage': '请输入正确的联系人姓名'
      },
      'cnid':{
        'reg': /^(\d|x|X){18}$/,
        'errorMessage': '请输入正确的身份证号码'
      },
      'marriage':{
        'reg': /^\S+$/,
        'errorMessage': '请选择婚姻状况'
      },
      'company_name':{
        'reg': /^[^@#\$%\^&\*]{2,50}$/,
        'errorMessage': '请输入正确的公司名称'
      },
      'telephone':{
        'reg': /^(?:010|02\d|0[3-9]\d{2})\d{7,8}(?:\-\d{1,4})?$/,
        'errorMessage': '请输入正确单位电话'
      },
      'address':{
        'reg': /^[^@#\$%\^&\*]{2,50}$/,
        'errorMessage': '请输入正确的地址'
      },
      'qq':{
        'reg': /^\d{5,20}$/,
        'errorMessage': '请输入正确QQ号码'
      },
      'education':{
        'reg': /^\S+$/,
        'errorMessage': '请选择学历'
      },
      'degrees':{
        'reg': /^\S+$/,
        'errorMessage': '请选择学历'
      },
      'enter_year':{
        'reg': /^\S+$/,
        'errorMessage': '请选择入学年份'
      },
      'relationship':{
        'reg': /^\S+$/,
        'errorMessage': '请选择关系'
      },
      'school':{
        'reg': /^\S+$/,
        'errorMessage': '请输入学校名称'
      },
      'year':{
        'reg': /^\S+$/,
        'errorMessage': '请选择年份'
      },
      'month':{
        'reg': /^\S+$/,
        'errorMessage': '请选择月份'
      },
      'date':{
        'reg': /^\S+$/,
        'errorMessage': '请选择日期'
      },
      'province':{
        'reg': /^\S+$/,
        'errorMessage': '请选择省份'
      },
      'city':{
        'reg': /^\S+$/,
        'errorMessage': '请选择城市'
      },
      'district':{
        'reg': /^\S+$/,
        'errorMessage': '请选择区域'
      },
      'bankCard':{
        'reg': /^(\d{16}|\d{19})$/,
        'errorMessage': '请输入正确的银行卡号'
      },
      'bankList':{
        'reg': /^\S+$/,
        'errorMessage': '请选择银行'
      },
      'role':{
        'reg': /^\S+$/, 
        'errorMessage': '请选择职业'
      },
      'alipayName':{
        'reg': /^\S+$/,
        'errorMessage': '请输入支付宝帐号'
      },
      'alipayPwd':{
        'reg': /^\S+$/,
        'errorMessage': '请输入支付宝密码'
      },
      'captcha':{
        'reg': /^\S+$/,
        'errorMessage': '请输入验证码'
      },
      'carNumber':{
        'reg': /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼]{1}[a-zA-Z]{1}\w{5}$/,
        'errorMessage': '请输入正确的车牌号'
      },
      'company_telephone':{
        // 'reg': /^(\(\d{3,4}\)|\d{3,4})(|-)?\d{7,8}$/,
        'reg': /([0-9]|\\+|\\-|\\*|#)*/,
        'errorMessage': '请输入正确的单位电话'
      },
      'location' : {
        'reg': /^\S+$/,
        'errorMessage': '请完善家庭地址'
      },
      'company_address' :{
        'reg': /^\S+$/,
        'errorMessage': '请完善公司地址'
      },
      'street':{
        'reg': /^[^@#\$%\^&\*]{5,50}$/,
        'errorMessage': '详细地址必须大于5个字符',
        'errorMessageUp': '详细地址必须小于50个字符'
      },
      'company_street':{
        'reg': /^[^@#\$%\^&\*]{5,50}$/,
        'errorMessage': '详细地址必须大于5个字符',
        'errorMessageUp': '详细地址必须小于50个字符'
      },
      'family_street':{
        'reg': /^[^@#\$%\^&\*]{5,50}$/,
        'errorMessage': '详细地址必须大于5个字符',
        'errorMessageUp': '详细地址必须小于50个字符'
      }
    }
  }
  static validate(name, value){
  	var validateResult = { result:true, errorMessage:'' },
      regs = this.REGX;
  	if (regs.hasOwnProperty(name)) {
  		var result = null != value && regs[name]['reg'].test(value);
      var errorMessage = regs[name]['errorMessage'];

      // 详细地址上限
      if(name === 'company_street' && value.length >50){
        errorMessage = regs[name]['errorMessageUp'];
      }
      // 家庭地址和详细地址正则区分
      if(name === 'company_address' || name === 'location'){
        result = null != value.province && regs[name]['reg'].test(value.province);
      }

    	validateResult = {result:result, errorMessage:errorMessage};
  	}
  	return validateResult;
  }
}