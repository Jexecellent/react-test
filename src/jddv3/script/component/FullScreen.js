/**
 * 全屏组件
 * @author yong
 */

import React, {Component} from 'react';
import styles from './FullScreen.less';
import classNames from 'classnames';
import CSSModules from 'react-css-modules';

class Fullscreen extends Component{
  constructor(props) {
    super(props);
  }

  static defaultProps = {
    footer: true
  }

  render() {
    const {
      color,
      footer,
      children,
      className
    } = this.props;

    return (
      <div styleName="root">
        <div style={{backgroundColor: color || '#ececec'}} styleName="container" className={classNames({'no-footer': !footer}, className)}>
          {children}
        </div>
        {
          footer && (
            <footer id="footer" className="footer">
              <a href="https://m.wolaidai.com/about?source=app">关于我来贷</a>
              <a href="http://web.wolaidai.com/webapp/faq/">常见问题</a>
              <a className="telephone" href="http://www.sobot.com/chat/h5/index.html?sysNum=43d20d665ffe4412b037bfeb7c7162d0"><i className='iconfont icon-kefu' style={{fontSize:'28px'}}></i> 在线客服</a>
            </footer>
          )
        }
      </div>
    );
  }
}

export default CSSModules(Fullscreen, styles);