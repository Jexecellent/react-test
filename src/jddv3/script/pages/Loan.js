import React from 'react';
import Biz from '../helper/biz';

const LOAN_STATUS = {
  push_back:'loanPushBack',
  reject:'loanReject',
  list:'loanList',
  confirm:'loanAmountLimit'
}

export default class Index extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    const path = LOAN_STATUS[this.props.match.params.state || 'list'];
    const laId = this.props.match.params.id || '';
    if (!store.session('LOAN_JUMPED')){
      store.session('LOAN_JUMPED',true);
      store.session('LOGIN_JUMPED',true);
      Biz.goStaff(`${path}/${laId}`);
    }
  }
  render() {
    return (
      <div></div>
    );
  }
}
