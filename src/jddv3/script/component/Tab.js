import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import CSSModules from 'react-css-modules';
import styles from './Tab.less'

class Tab extends Component {
  constructor(props) {
    super(props)
  }


  render() {
    const {current, title,children, uri, changeTab, status, ...restProps} = this.props;
    const filteredChildren = React.Children.toArray(children).filter(c => !!c);
    return (
      <div styleName="bn-tab" {...restProps} >
        {
          React.Children.map(filteredChildren, (child, index) => {
              if (!child) {
                return null;
              }
              const childProps = {
                curNum: index,
                uri,
                title,
                ...child.props}
              if (index === current) {
                  childProps.status = 'tab-active';
              } 
              return React.cloneElement(child, childProps);
          })
        }
      </div>
    );
  }
}

export default CSSModules(Tab,styles,{allowMultiple:true});