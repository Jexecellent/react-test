import React from 'react';
import PropTypes from 'prop-types';
import {Select} from '@welab/xlib-react-components';
import Validator from '../helper/validator';


class FormSelect extends React.Component{

  constructor(props) {
    super(props);
    this.state = {
      value: this.props.value || '',
      options: this.props.options || []
    };
  }

  getValue() {
    return this.refs['xSelect'].getValue();
  }

  isValid() {
    let validateRes = Validator.validate(this.props.name,this.getValue());
    return validateRes.result;
  }

  onValidate(val) {
    let validateRes = Validator.validate(this.props.name,val);
    return validateRes.result || validateRes.errorMessage;
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.options !== this.props.options){
      return true;
    }
    if (nextState.value !== this.state.value){
      return true;
    }
    return false;
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.value !== this.state.value){
      this.setState({
        value: nextProps.value
      });
    }
  }

  render() {
    let selectAttr = this.props.selectAttr || {};
    selectAttr.name = this.props.name;
    if (this.state.disabled){
      selectAttr.disabled = 'disabled';
    }

    let xSelectProps = {};

    for (let p of ['noValidate','idField','nameField','placeholder','onChange']){
      if (this.props.hasOwnProperty(p)){
        xSelectProps[p] = this.props[p];
      }
    }

    return (
      <div className="jdd-form-select">
        <label htmlFor={this.props.name}>{this.props.displayName}</label>
        <Select ref="xSelect"
          {... xSelectProps}
          options={this.state.options}
          value={this.state.value}
          validateFn={this.onValidate.bind(this)}
          attributes={selectAttr} />
      </div>
    )
  }
}

FormSelect.propTypes = {

  /**
   * - form select displayName
   * 
   */
  displayName: PropTypes.string.isRequired,

  /**
   * - property name of the given option element to be the value, default to "id"
   */
  idField: PropTypes.string,

  /**
   * - form select name
   * 
   */
  name: PropTypes.string.isRequired,

  /**
   * - property name of the given option element to be the label, default to "name"
   */
  nameField: PropTypes.string,

  /**
   * - form select options
   * 
   */
  options: PropTypes.array.isRequired,

  /**
   * - available attributes for React `<select>` tag
   */
  selectAttr: PropTypes.shape({
    id: PropTypes.string
  }),

  /**
   * - default value
   * 
   */
  value: PropTypes.string
}

export default FormSelect;