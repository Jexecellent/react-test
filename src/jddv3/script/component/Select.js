import React from 'react';
import PropTypes from 'prop-types';

class Select extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      label: this.props.placeholder || '',
      errStyle: { display: 'none' },
      errMsg: '无效的值...',
      useValidate: !props.hasOwnProperty('noValidate')
    }
  }

  setValue(val) {
    this.refs['select'].value = val;
  }

  getValue() {
    return this.refs['select'].value;
  }

  handleBlur(event) {
    if (this.state.useValidate){
      let validateRes = this.validate();
      if (validateRes !== true){
        let stateObj = {};
        stateObj.errStyle = { display:'block' };

        if (typeof validateRes === 'string'){
          stateObj.errMsg = validateRes;
        }

        this.setState(stateObj);
      }
    }
    this.updateDisplay();
  }

  handleChange(event) {
    if (this.props.onChange) {
      this.props.onChange(event);
    }
    if (this.state.useValidate) {
      this.setState({
        errStyle: { display: 'none' }
      });
    }
    this.updateDisplay();
  }

  validate() {
    let validateFn = this.props.validateFn || function (input) { return true; };
    return validateFn(this.getValue());
  }

  updateDisplay() {
    let index = this.refs['select'].selectedIndex;
    this.setState({
      label: this.refs['select'].options[index].text
    });
  }

  componentDidMount() {
    if (this.getValue() !== ''){
      this.updateDisplay();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.value != this.getValue()) {
      this.setValue(nextProps.value);
      this.updateDisplay();
    }
  }

  render() {
    let options = this.props.options || [];
    let optionElements = options.map((item, index) => {
      return (<option key={index+1} value={item[this.props.idField || 'id']}>{item[this.props.nameField || 'name']}</option>);
    });
    let emptyOption = (<option key="0" value="">{this.props.placeholder || ''}</option>)
    optionElements.unshift(emptyOption);
    return (
      <div className="xlib-select">
        <div className="context">
          <div className="guide"><i className="assets-guide"></i></div>
          <p className={this.state.label == this.props.placeholder ? "content tips":"content"}>{this.state.label}</p>
        </div>
        <select ref="select"
          {...this.props.attributes}
          defaultValue={this.props.value}
          onChange={this.handleChange.bind(this)}
          onBlur={this.handleBlur.bind(this)}>
          {optionElements}
        </select>
        {this.state.useValidate ?
          <span ref="err"
            className="error"
            style={this.state.errStyle}>{this.state.errMsg}</span> : null
        }
      </div>
    )
  }
}

Select.propTypes = {

  /**
   * - available attributes for React `<select>` tag
   */
  attributes: PropTypes.shape({
    disabled: PropTypes.string
  }),

  /**
   * - property name of the given option element to be the value, default to "id"
   */
  idField: PropTypes.string,

  /**
   * - property name of the given option element to be the label, default to "name"
   */
  nameField: PropTypes.string,

  /** 
   * - Array of option items. eg: `[{id:1,name:'aaa'},{id:2,name:'bbb'}]`
  */
  options: PropTypes.array.isRequired,

  /**
   * - select validate function. eg: `function(input){ return false; }`
   */
  validateFn: PropTypes.func,

  /**
   * - default value
   * 
   * # A validate Select Component.
   * 
   * `<Select value="Hello World" noValidate/>`
   * 
   * 
   * `<Select value="Hello World" validateFn={function(input){return false;}}/>`
   * 
   * 
   * `<Select attributes={{disabled:"disabled", ...}} />`
   * 
   * 
   * ... and other [supported attributes](http://reactjs.cn/react/docs/tags-and-attributes.html) for React `<select>` tag
   * 
   * 
   * :video_game: Banks
   */
  value: PropTypes.string

}

export default Select;
