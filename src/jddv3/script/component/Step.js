import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import CSSModules from 'react-css-modules';
import styles from './step.less';

function isString(str) {
  return typeof str === 'string';
}

class Step extends React.Component {
    /* renderIconNode() {
        const {stepNumber, status, title, description, icon,
        iconPrefix,
        } = this.props;
        let iconNode;
        const iconClassName = classNames(`${prefixCls}-icon`, `${iconPrefix}icon`, {
        [`${iconPrefix}icon-${icon}`]: icon && isString(icon),
        [`${iconPrefix}icon-check`]: !icon && status === 'finish',
        [`${iconPrefix}icon-cross`]: !icon && status === 'error',
        });
        const iconDot = <span className={`${prefixCls}-icon-dot`}></span>;
        // `progressDot` enjoy the highest priority
        if (progressDot) {
        if (typeof progressDot === 'function') {
            iconNode = (
            <span className={`${prefixCls}-icon`}>
                {progressDot(iconDot, { index: stepNumber - 1, status, title, description })}
            </span>
            );
        } else {
            iconNode = <span className={`${prefixCls}-icon`}>{iconDot}</span>;
        }
        } else if (icon && !isString(icon)) {
        iconNode = <span className={`${prefixCls}-icon`}>{icon}</span>;
        } else if (icon || status === 'finish' || status === 'error') {
        iconNode = <span className={iconClassName} />;
        } else {
        iconNode = <span className={`${prefixCls}-icon`}>{stepNumber}</span>;
        }
        return iconNode;
    } */
  render() {
    const {
      className, 
      style, 
      itemWidth,
      status = 'wait', 
      iconPrefix, 
      icon,
      adjustMarginRight, 
      stepNumber,
      description, 
      title, 
      ...restProps
    } = this.props;

    let iconNode 
    const iconClassName = classNames({
        [`${iconPrefix}icon-${icon}`]: icon && isString(icon),
        [`${iconPrefix}icon-check`]: !icon && status === 'finish'
    });
    if (icon && !isString(icon)) {
        iconNode = <span styleName="bnicon">{icon}</span>;
      } else if (icon || status === 'finish') {
        iconNode = <span styleName={iconClassName} />;
      } else {
        iconNode = <span styleName={`${status}-icon`}>{stepNumber}</span>;
      } 
    const classString = classNames(
      'stepitem',
      status,
      className
    );
    const stepItemStyle = { ...style };
    if (itemWidth) {
      stepItemStyle.width = itemWidth;
    }
    if (adjustMarginRight) {
      stepItemStyle.marginRight = adjustMarginRight;
    }
    return (
        <div  data-role="auto-step"
            {...restProps}
            styleName={classString}
            style={stepItemStyle}
         >
            <div styleName="item-tail"><i></i></div>
            <div styleName="item-icon">
                {iconNode}
            </div>
            <div styleName="item-content">
                <div styleName="title">{title}</div>
                {description && <div styleName="description">{description}</div>}
            </div>
        </div>
    );
  }
}
Step.PropTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    itemWidth: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]),
    status: PropTypes.string,
    iconPrefix: PropTypes.string,
    icon: PropTypes.node,
    adjustMarginRight: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]),
    stepNumber: PropTypes.string,
    description: PropTypes.any,
    title: PropTypes.any
};

export default CSSModules(Step,styles,{allowMultiple:true});