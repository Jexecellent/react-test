/**
 * modal
 */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules';
import styles from './Modal.less';

class Modal extends Component{
  constructor(props){
    super(props);
  }
  render(){
    let {show , uiEvent} =this.props;
    return (
      <div className={styles.default} styleName={show ? 'show':'hide'} onClick={uiEvent}>
          {this.props.children}
      </div>
    );

  }
	
}

Modal.propTypes = {
	show: PropTypes.bool,
  uiEvent:PropTypes.func
};

export default CSSModules(Modal, styles);