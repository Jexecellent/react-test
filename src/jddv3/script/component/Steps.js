/**
 * Steps
 */
import React, {Component} from 'react'
import { findDOMNode } from 'react-dom';
import classNames from 'classnames'
import PropTypes from 'prop-types'
import CSSModules from 'react-css-modules'
import styles from './step.less'
class Steps extends Component{
  constructor(props) {
      super(props)
      this.state = {
        lastStepOffsetWidth: 0,
      };
      this.calcStepOffsetWidth = this.calcStepOffsetWidth.bind(this);
  }
  componentDidMount() {
    this.calcStepOffsetWidth();
  }
  componentDidUpdate() {
    this.calcStepOffsetWidth();
  }
  componentWillUnmount() {
    if (this.calcTimeout) {
      clearTimeout(this.calcTimeout);
    }
    if (this.calcStepOffsetWidth && this.calcStepOffsetWidth.cancel) {
      this.calcStepOffsetWidth.cancel();
    }
  }
  calcStepOffsetWidth = () => {
    const domNode = findDOMNode(this);
    if (domNode.children.length > 0) {
      if (this.calcTimeout) {
        clearTimeout(this.calcTimeout);
      }
      this.calcTimeout = setTimeout(() => {
        // +1 for fit edge bug of digit width, like 35.4px
        const lastStepOffsetWidth = (domNode.lastChild.offsetWidth || 0) + 1;
        // Reduce shake bug
        if (this.state.lastStepOffsetWidth === lastStepOffsetWidth ) {
          return;
        }
        this.setState({ lastStepOffsetWidth });
      });
    }
  }
  render() {
      const {
          style = {}, 
          className, 
          children, 
          direction, 
          iconPrefix, 
          status, 
          current, 
          ...restProps
      } = this.props;
      const filteredChildren = React.Children.toArray(children).filter(c => !!c);
      const lastIndex = filteredChildren.length - 1;
      const { lastStepOffsetWidth } = this.state;  
      return (
          <div styleName="bnsteps" data-role="xlib-step" {...restProps} >
          {
              React.Children.map(filteredChildren, (child, index) => {
                  if (!child) {
                  return null;
                  }
                  const childProps = {
                      stepNumber: `${index + 1}`,
                      iconPrefix,
                      ...child.props,
                  };
                  if ( index !== lastIndex) {
                      childProps.itemWidth = `${100 / lastIndex}%`;
                      childProps.adjustMarginRight = -Math.round(lastStepOffsetWidth / lastIndex + 1);
                  }
                  if (!child.props.status) {
                      if (index === current) {
                          childProps.status = status;
                      } else if (index < current) {
                          childProps.status = 'finish';
                      } else {
                          childProps.status = 'wait';
                      }
                  }
                  return React.cloneElement(child, childProps);
              })
          }
          </div>
      )
  }
}
Steps.propTypes = {
    className: PropTypes.string,
    iconPrefix: PropTypes.string,
    direction: PropTypes.string,
    children: PropTypes.any,
    status: PropTypes.string,
    style: PropTypes.object,
    current: PropTypes.number,
};
Steps.defaultProps = {
    iconPrefix: 'bn',
    current: 0,
    status: 'process',
};

export default CSSModules(Steps,styles,{allowMultiple:true});