/**
 * 字体图标组件
 * @auth yong
 */

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const FontIcon = ({iconName, className, color,fontSize}) => {
	let style = {
		color: color,
		fontSize: fontSize
	}
	return (
		<span style={style} className={classNames('iconfont', 'icon-' + iconName, className)}></span>
	);
};

FontIcon.propTypes = {
	color: PropTypes.string,
	fontSize: PropTypes.string,
	className: PropTypes.string,
	iconName: PropTypes.string.isRequired
}

export default FontIcon;