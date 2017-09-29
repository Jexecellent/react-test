import React from 'react';
import PropTypes from 'prop-types';
import {Input} from '@welab/xlib-react-components';
import Validator from '../helper/validator';
class FormInput extends React.Component{
  static propTypes = {

    /**
     * - form input displayName
     * 
     */
    displayName: PropTypes.string,

    /**
     * - available attributes for React `<input>` tag
     */
    inputAttr: PropTypes.shape({
      disabled: PropTypes.string,
      placeholder: PropTypes.string,
      maxLength: PropTypes.number,
      minLength: PropTypes.number
    }),

    /**
     * - form input name
     * 
     */
    name: PropTypes.string.isRequired,

    /**
     * - input validate function. eg: `function(input){ return false; }`
     */
    validateFn: PropTypes.func,

    /**
     * - default value
     * 
     */
    value: PropTypes.string
  }

  constructor(props) {
    super(props);
    this.state = {};
  }

  focus() {
    this.refs['xInput'].focus();
  }

  getValue() {
    return this.refs['xInput'].getValue().replace(/\s/g,"");
  }

  setValue(val) {
    this.refs['xInput'].setValue(val);
  }

  isValid() {
    let validateRes = Validator.validate(this.props.name,this.getValue().replace(/\s+/g,""));
    return validateRes.result;
  }

  onValidate(val) {
    if (this.props.validateFn){
      return this.props.validateFn(val);
    }
    let validateRes = Validator.validate(this.props.name,val);
    return validateRes.result || validateRes.errorMessage;
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.value != this.getValue()){
      this.setValue(nextProps.value);
    }
  }

  render() {
    let attrs = this.props.inputAttr || {};
    attrs.name = this.props.name;

    let xInputProps = {
      value: this.props.value || ''
    };
    if (this.props.hasOwnProperty('noClear')){
      xInputProps.noClear = true;
    }
    if (this.props.hasOwnProperty('noValidate')){
      xInputProps.noValidate = true;
    }

    return (
      <div className="jdd-form-input">
        <label htmlFor={this.props.name}>{this.props.displayName}</label>
        <Input ref="xInput"
          {... xInputProps}
          validateFn={this.onValidate.bind(this)}
          attributes={attrs}
          onChange={this.props.handleChange}
          handleFocus={this.props.handleFocus} />
      </div>
    )
  }
}

export default FormInput;