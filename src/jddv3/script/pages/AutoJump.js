import React from 'react';
import Biz from '../helper/biz';

class AutoJump extends React.Component{
  componentDidMount() {
    store.session('LOGIN_JUMPED', null);
    store.session('LOAN_JUMPED', null);

    const channel = utils.getQueryParams(location.search,'channel');
    const activity = utils.getQueryParams(location.search,'activity');
    const path = utils.getQueryParams(location.search,'path');
    if(channel) {
      $.fn.cookie('jddv2-channel',channel);
      $.fn.cookie('staff-channel',channel,{path: '/'});
    }

    if(path) {
      this.props.history.push(path);
    } else {
      Biz.switchPageInfo((path) => {
        this.props.history.push(path);
      });
    }
  }

  render() {
    return (
      <div></div>
    )
  }
}

export default AutoJump;