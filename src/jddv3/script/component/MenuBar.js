/**
 * 菜单条组件
 * @author yong
 */

import React,{Component} from 'react';
import PropTypes from 'prop-types';
import styles from './MenuBar.less';
import classNames from 'classnames';
import CSSModules from 'react-css-modules';


const MenuBar = ({leftIcon,leftRightIcon, rightIcon, text, status,statusClass, onClick, className, hide}) => {
	return (
		<div className={classNames('menu-bar', 'flex', className)} onClick={onClick} style={{display:hide?'none':'flex'}}>
			{leftIcon}
			<div className="text">
				{text}{leftRightIcon}
			</div>
			<div className={classNames('status', statusClass)}>
				{status}
			</div>
			{rightIcon || <div className="icon-menu-right"></div>}
		</div>
	);
};

MenuBar.defaultProps = {
	rightIcon: (<div className="icon-menu-right"></div>)
}

MenuBar.propTypes = {
	onClick: PropTypes.func,
	className: PropTypes.string,
	text: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.element
	]),
	status: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.element
	]),
	leftIcon: PropTypes.element,
	rightIcon: PropTypes.element
};

export default CSSModules(MenuBar, styles);