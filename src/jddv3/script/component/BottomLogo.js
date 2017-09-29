/**
 * 授权项组件
 * @author yong
 */

import React from 'react';
import classNames from 'classnames';
import styles from './BottomLogo.less';
import CSSModules from 'react-css-modules';

class BottomLogo extends React.Component{
	componentDidMount() {
    this.isNoLogo = ($.fn.cookie('type')==='sdy');
    this.isNoFooter = ($.fn.cookie('type')==='sdy');
    $("footer").css({
      display: "none"
    })
  }

  componentWillUnmount() {

    !this.isNoFooter && $("footer").css({
      display: "block"
    })
  }

  render() {
    return (
      <div styleName='bottom-logo' style={{display:this.isNoLogo?'none':'block'}}></div>
    );
  }
};

export default CSSModules(BottomLogo, styles);