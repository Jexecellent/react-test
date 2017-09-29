import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import CSSModules from 'react-css-modules';
import styles from './Tab.less'

class TabPanel extends Component {
  constructor(props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
  }
  handleClick($event) {
    $event.preventDefault();
    var idx = this.props.uri 
    location.href=idx
  }
  render() {
    const { title, status, curNum, uri, ...restProps} = this.props;
    const classString = classNames(
      'tab-item',
       status
    )
    return (
      <div styleName={classString} {...restProps} onClick={ this.handleClick }>
        <span>{title}</span>
      </div>
    );
  }
}

export default CSSModules(TabPanel,styles,{allowMultiple:true});