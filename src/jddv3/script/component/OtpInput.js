import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-modal';
import FormInput from './FormInput';
import VerifyCode from './VerifyCode';
class OtpInput extends React.Component {
  static propTypes = {

    /**
     * - sendOtp function.
     */
    sendOtp: PropTypes.func.isRequired,

    /**
     * - input validate function. eg: `function(){ return false; }`
     */
    validateFn: PropTypes.func,
    /**
     * getMobile is required
     */
    getMobile: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);
    this.intervalId = 0;
    this.state = {
      verifyOn: false
    };

    this.onVerifyCommit = this.onVerifyCommit.bind(this);
  }

  setClass(className) {
    const oldOtpValue = this.getValue();
    this.setState({
      optBtnName: className
    },() => {
      return this.refs['formInput'].setValue(oldOtpValue);
    });
  }

  getValue() {
    return this.refs['formInput'].getValue();
  }

  isValid() {
    return this.refs['formInput'].isValid();
  }

  beforeSend() {
    if (!this.props.validateFn()) {
      return;
    }
    this.refs['formInput'].focus();
    var mobile = this.props.getMobile();
    API.get(`v3/sessions/h5/random_code/on_off/${mobile}`).done((data) => {
      if (data.on_off) {
        this.setState({
          verifyOn: true
        });
        this.refs['verifyCode'].refresh();
      } else {
        this.refs['otpBtn'].disabled = true;
        this.props.sendOtp('', (success) => {
          if (success) {
            this.countDown();
          } else {
            this.refs['otpBtn'].disabled = false;
          }
        });
      }
    }).fail((xhr, errorType, error) => {
      Utils.errorHandle(xhr, error);
    });
  }

  countDown() {
    let count = 59;
    this.refs['otpBtn'].disabled = true;
    this.refs['otpBtn'].innerHTML = '重新获取(60)';
    this.intervalId = setInterval(() => {
      if (count <= 0) {
        clearInterval(this.intervalId);
        this.refs['otpBtn'].disabled = false;
        this.refs['otpBtn'].innerHTML = '重新获取';
      } else {
        this.refs['otpBtn'].innerHTML = `重新获取(${count})`;
        count--;
      }
    }, 1000);
    this.refs['formInput'].focus();
  }

  onVerifyCommit(str) {
    this.props.sendOtp(str, (success) => {
      if (success) {
        this.setState({
          verifyOn: false
        });
        this.countDown();
      }
    });
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
  }

  render() {
    const customStyles = {
      overlay: {
        backgroundColor: 'rgba(0,0,0,.4)'
      },
      content: {
        top: '50%',
        left: '5%',
        right: '5%',
        bottom: 'initial',
        position: 'absolute',
        padding: '0',
        margin: '0',
        borderRadius: '10px',
        border: '0 none',
        overflow: 'visible'
      }
    };
    let formInputProps = {};
    if (this.props.hasOwnProperty('inputNoValidate')) {
      formInputProps.noValidate = true;
    }
    return (
      <div>
        <div className="jdd-otp-input">
          <FormInput ref="formInput"
                     noClear
                     {...formInputProps}
                     name="otp"
                     displayName="验证码"
                     inputAttr={{
                       type: 'tel',
                       placeholder: '请输入验证码',
                       maxLength: 6
                     }}
                     handleFocus={this.props.handleFocus}/>
          <div className="otp-box">
            <button ref="otpBtn"
                    className={this.state.optBtnName}
                    onClick={this.beforeSend.bind(this)}>获取验证码
            </button>
          </div>
        </div>
        <Modal contentLabel="verifyModal" style={customStyles} isOpen={this.state.verifyOn}>
          <VerifyCode ref='verifyCode' onCommit={this.onVerifyCommit.bind(this)}/>
        </Modal>
      </div>
    )
  }
}

export default OtpInput;