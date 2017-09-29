import React , {Component} from 'react';
import {FormGroup, Input, Select, ButtonSelect, Toast} from '@welab/xlib-react-components';
import {Steps, Step} from '../component/StepIndex'

import GlobalHelper from '../helper/global';
import Validate from '../helper/validator';

import FullScreen from '../component/FullScreen';
import DateSelect from '../component/DateSelect';
import Location from '../component/Location';

class Profile extends Component{
  constructor(props){
    super(props);
    const pathname = this.props.location.pathname;
    this.state = {
      isInMyData: pathname === '/mydata/profile',
      needCompanyPhone: !!store.session('offer')
    }
    this.profileFields=['location','family_street','company_name','entry_time','telephone','company_address','company_street','relationship','name','mobile'];
    this.rltships = [{id:'parents',name:'父母'},{id:'spouse',name:'配偶'}];
    this.formValidate=this.formValidate.bind(this);
    this.submit=this.submit.bind(this);
    this.fecthAreas =  this.fecthAreas.bind(this);
  }
  componentDidMount(){
    !this.state.isInMyData && utils.updatePageTitle("身份信息");
  }
  // 初始化地址数据
  fecthAreas(callback){
    GlobalHelper.loadConfigData('areas', callback)
  }
  
  formValidate(){
    var validateMsg = '';
    this.profileFields.map((item) => {
      const itemValue = this.refs[item].getValue();
      if (item === 'entry_time') {
        for (let i in itemValue) {
            if (!Validate.validate(i, itemValue[i]).result) {
                validateMsg += Validate.validate(i, itemValue[i]).errorMessage + ',';
            }
        }
      } else {
        if (item === 'telephone' && !this.state.needCompanyPhone) {
          return true
        }
        if (!Validate.validate(item, this.refs[item].getValue()).result) {
          validateMsg += Validate.validate(item, this.refs[item].getValue()).errorMessage + ',';
        }
      }
    });
    return validateMsg.split(',')[0];
  }
  submit(){
    utils.report('profile_next_clc');
    
    const validateResult = this.formValidate();
    if (validateResult && validateResult != 'undefined') {
      this.toast.show(validateResult);
      return;
    }

    // 将用户信息存入session
    let userInfo = {
      'company': {'address': {}},
      'profile': {'residentAddress': {}},
      'liaison': {}
    };
    this.profileFields.map((item) => {
      const itemValue = this.refs[item].getValue();
      // 存居住信息(userInfo.profile)
      if (item === 'location') {
        userInfo.profile.residentAddress['province'] = itemValue['province'];
        userInfo.profile.residentAddress['city'] = itemValue['city'];
        userInfo.profile.residentAddress['district'] = itemValue['district'];
      } else if (item === 'family_street') {
        userInfo.profile.residentAddress['street'] = itemValue;
      }

      // 存公司信息(userInfo.company)
      if (item === 'company_address') {
        userInfo.company.address['province']= itemValue['province'];
        userInfo.company.address['city'] = itemValue['city'];
        userInfo.company.address['district'] = itemValue['district'];
      } else if (item === 'company_street') {
        userInfo.company.address['street'] = itemValue;
      } else if (item === 'company_name') {
        userInfo.company['name'] = itemValue ? itemValue : null;
      } else if (item === 'telephone') {
        userInfo.company[item] = itemValue ? itemValue : null;
      } else if (item === 'entry_time') {
        userInfo.company['entryTime'] = '';
        for (let i in itemValue) {
          userInfo.company['entryTime'] += itemValue[i] + '-';
        }
        userInfo.company['entryTime'] = userInfo.company['entryTime'] + '01';
      }
      
      // 存联系人信息(userInfo.liaison)
      if (item === 'name' || item === 'mobile' || item === 'relationship') {
        userInfo.liaison[item] = itemValue ? itemValue : null;
      }
    });
    store.session('profile', userInfo);

    this.props.history.push('operatorAuth');
  }
  render(){
    const {isInMyData} = this.state;
    const title = '请补充联系信息，方便发生紧急情况如账号被盗时联系你';
    const styles = !isInMyData ? {'marginTop': ''} : {'marginTop': '0.33rem'};
    return(
      <FullScreen footer={false} className='profile'>
        {
          !isInMyData ? <div className="section">
                          <Steps current={0}>
                            <Step title="身份信息" icon={<i className="iconfont proIcon">&#xe65b;</i>} />
                            <Step title="实名认证" icon={<i className="iconfont proIcon">&#xe65c;</i>} />
                            <Step title="提交申请" icon={<i className="iconfont proIcon">&#xe65a;</i>} />
                          </Steps>
                        </div> : ''
        }

        <div className="tipDesc">{!isInMyData ? title : ''}</div>

        <div className="section" style={{...styles}}>
          <FormGroup withLabel={true} label="居住地址" className="arrowRight">
            <Location ref="location" fecthAreas={ this.fecthAreas} placeholder="请选择省市区" />
          </FormGroup>
          <FormGroup withLabel={true} label="详细地址">
            <Input ref="family_street" attributes={{placeholder:"请填写详细地址",maxLength:50}} />
          </FormGroup>
        </div>

        <div className="section">
          <FormGroup withLabel={true} label="公司名称">
            <Input ref="company_name" attributes={{placeholder:"例:深圳卫盈智信科技有限公司",maxLength:50}} />
          </FormGroup>
          <FormGroup withLabel={true} label="入职时间" className="arrowRight">
            <DateSelect ref="entry_time" placeholder="请选择入职时间"  />
          </FormGroup>
          <FormGroup withLabel={true} label="公司电话">
            <Input ref="telephone" attributes={{placeholder:"(选填) 例:0755-12345678"}} />
          </FormGroup>
          <FormGroup withLabel={true} label="公司地址" className="arrowRight">
            <Location ref="company_address" fecthAreas={this.fecthAreas} placeholder="请选择省市区" />
          </FormGroup>
          <FormGroup withLabel={true} label="详细地址">
            <Input ref="company_street" attributes={{placeholder:"请填写详细地址",maxLength:50}} />
          </FormGroup>
        </div>

        <div className="section">
          <FormGroup withLabel={true} label="关系" className="clearfix">
            <ButtonSelect ref="relationship" defaultValue="parents" options={this.rltships}/>
          </FormGroup>
          <FormGroup withLabel={true} label="联系人" >
            <Input ref="name" attributes={{placeholder:"请填写联系人姓名",maxLength:24}} />
          </FormGroup>
          <FormGroup withLabel={true} label="手机" >
            <Input ref="mobile" attributes={{placeholder:"请填写联系人手机", maxLength: 11}} />
          </FormGroup>
        </div>
        <button className='btn' onClick={ this.submit }>{!isInMyData ? '下一步' : '保存'}</button>
        <Toast ref={(toast) => this.toast = toast} timeout={1500}/>
      </FullScreen>
    )
  }
}
export default Profile;
