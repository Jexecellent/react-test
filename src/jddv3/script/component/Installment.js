import React from 'react';
import FormInput from './FormInput';
import { Toast } from '@welab/xlib-react-components';
import FormSelect from './FormSelect';
import Validator from '../helper/validator';
import FullScreen from "./FullScreen";

export default class Installment extends React.Component {
  constructor(props){
    super(props);
    this._installments = false; 
    this.amountRange = [];
    this.tenorRange = ['3M','6M','9M','12M'];
    this.amountMin = [];
    this.amountMax = props.maxValue;
    this.state = {
      amount:'',
      tenor:'',
      tenorOptions : [
        {id:'3M',name:'3个月'},
        {id:'6M',name:'6个月'},
        {id:'9M',name:'9个月'},
        {id:'12M',name:'12个月'}
      ],
      feeRange:''
    }
  }
  doValidate() {
    if (this.state.amount<this.amountMin || this.state.amount>this.amountMax){
      this.toast.show('请填写正确的申请金额');
      return false;
    }else if (this.tenorRange.indexOf(this.state.tenor)==-1){
      this.toast.show('请选择正确的贷款期限');
      return false;
    }
    return true;
  }
  getValue(){
    return {
      amount: this.state.amount,
      tenor: this.state.tenor
    }
  }
  setValue(amount, tenor){
    if (!this.installments){
      return;
    }else if (amount<this.amountMin || amount>this.amountMax){
      return;
    }
    let index = this.tenorRange.indexOf(tenor);
    this.setState({
      amount: amount+'',
      tenor: tenor,
      feeRange: index===-1?'':this.installments[amount][index].min_installment+'~'+this.installments[amount][index].max_installment
    });
  }
  get installments(){
    return this._installments;
  }
  set installments(val){
    this.amountRange = [];
    for (let key of Object.keys(val)) {
      this.amountRange.push(key-0);
    }
    this.amountMin = this.amountRange[0];
    this.amountMax = this.props.maxValue;
    this._installments = val;
  }
  validateAmount(amount) {
    let validateRes = Validator.validate('amount',amount);
    if (!validateRes.result){
      this.setState({
        amount:'',
        tenor:'',
        feeRange:''
      });
      return validateRes.errorMessage;
    }
    let val = amount - 0;
    if (val <= this.amountMin){
      val = this.amountMin;
    }else if (val >= this.amountMax){
      val = this.amountMax;
    }else{
      val -= val%500;
    }
    this.setValue(val, this.refs['tenorSelect'].getValue());
    if (this.props.onAmountChange){
      this.props.onAmountChange(val);
    }
    return true;
  }
  onTenorChange(event) {
    let index = event.target.selectedIndex;
    if (index == 0){
      this.setState({
        tenor:'',
        feeRange: ''
      });
    }else{
      this.setValue(this.refs['amountInput'].getValue()-0, event.target.value);
    }
  }
  componentDidMount() {
    utils.updatePageTitle('简单贷');
    API.get('v4/installments').done((res)=>{
      this.installments = res;
      if (this.props.onDataLoaded){
        this.props.onDataLoaded();
      }
    }).fail((xhr, errorType, error)=>{
      utils.errorHandle(xhr,error);
    });
  }
  render() {
    return (
        <div className="jdd-apply-form">
          <Toast ref={t => this.toast = t}></Toast>
          <FormInput ref="amountInput"
                     name="amount"
                     displayName="借多少"
                     inputAttr={{
                       type: 'tel',
                       maxLength: 5,
                       placeholder:'最低3000元，且为500倍数'
                     }}
                     value={this.state.amount}
                     validateFn={this.validateAmount.bind(this)} />
          <FormSelect ref="tenorSelect"
                      noValidate
                      name="tenor"
                      displayName="借多久"
                      placeholder="选择贷款期限"
                      value={this.state.tenor}
                      options={this.state.tenorOptions}
                      onChange={this.onTenorChange.bind(this)} />
          <FormInput ref="feeInput"
                     noClear
                     name="fee"
                     displayName="月还款"
                     inputAttr={{disabled:'disabled'}}
                     value={this.state.feeRange} />
        </div>
    );
  }
}

Installment.defaultProps = {
    maxValue: 30000
};

