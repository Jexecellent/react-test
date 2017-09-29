var regs = {
	'mobile':{
		'reg': /^1[3|4|5|7|8][0-9]\d{8}$/,
		'errorMessage': '请输入正确的手机号码',
		'errorEmptyMsg': '请输入您的手机号码'
	},
	'otp':{
		'reg': /^\d{6}$/,
		'errorMessage': '错误的验证码',
		'errorEmptyMsg': '请输入验证码'
	},
	'knowLengthOtp':{
		'reg': /^\S+$/,
		'errorMessage': '错误的验证码'
	},
	'name':{
		'reg': /^[\u4e00-\u9fa5]([\u4e00-\u9fa5]{0,24}\u00b7{0,1}[\u4e00-\u9fa5]{1,24})+$/,
		'errorMessage': '请输入正确的姓名'
	},
	'cnid':{
		'reg': /^(\d|x|X){18}$/,
		'errorMessage': '请输入正确的身份证号码'
	},
	'company':{
		'reg': /^[^@#\$%\^&\*]{2,50}$/,
		'errorMessage': '请输入正确的公司名称'
	},
	'telephone':{
		'reg': /^(?:010|02\d|0[3-9]\d{2})\d{7,8}(?:\-\d{1,4})?$/,
		'errorMessage': '请输入正确单位电话'
	},
	'address':{
		'reg': /^[^@#\$%\^&\*]{2,50}$/,
		'errorMessage': '请输入正确的居住地址'
	},
	'relation':{
		'reg': /^\S+$/,
		'errorMessage': '请选择关系'
	},
	'street':{
		'reg': /^[^@#\$%\^&\*]{5,50}$/,
		'errorMessage': '请输入正确的公司地址'
	}
};

module.exports = {
  validate:function(name, value){
  	var validateResult = {result:true, errorMessage:""};
  	if (regs.hasOwnProperty(name)) {
			reg = regs[name];
      // 输入校验
				validateResult.result = reg['reg'].test(value);
				if(!validateResult.result){
          validateResult.errorMessage = reg['errorMessage'];
        }
					
  	}
  	return validateResult;
  },
	generateValidate: function(name){
		return (value) => {
      let result = this.validate(name, value);
      return result.errorMessage;
    };
	}
};