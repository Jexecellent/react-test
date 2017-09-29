import React from 'react';

import Scroll from 'iscroll/build/iscroll-lite';
import { Toast } from '@welab/xlib-react-components';

export default class Agreement extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      checked:false,
      isClicked:false,
      className: this.props.className ? this.props.className : 'agreement',
      url: this.props.url
    };
  }
  isAgree(){
    return this.state.checked;
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextProps.url != this.props.url) {
      this.setState({
        url: nextProps.url
      });
    }
  }

  componentDidMount(){
    if ($('#agreement').length==0){
      $('body').append('<div id="agreement"></div>');
    }
    if (!this.props.noCheckbox) {
      this.state.checked = this.props.checked === 'true';
      this.refs['agreement-check'].checked = this.state.checked;
    }
  }
  componentWillUnmount() {
    $('#agreement').hide();
    $('#agreement').empty();
    document.removeEventListener('touchmove',this.onTouch);
  }

  onChange(event){
    var _state = this.state;
    _state.checked = event.target.checked;
    this.setState(_state);
  }
  onTouch(event){
    event.preventDefault();
  }
  
  onClick(event){
    if (this.state.isClicked){
      document.addEventListener('touchmove',this.onTouch);
      $('#agreement').show();
      new Scroll('#agreement .agreement-window-content',{scrollX: true});
      return;
    }
    var _state = this.state;
    _state.isClicked = true;
    this.setState(_state);
    var url = this.state.url ? this.state.url : 'v3/loan_applications/installment/multiple';
    if (url.indexOf('registAgreement') >= 0) {
      $.ajax({url:url,type:'GET'}).done((result) => {
        this.showPopup(result);
      }).fail(function(xhr){
        utils.errorHandle(xhr,'',this.toast.show);
      });;
    }
    else{
      API.get(url, undefined, '', '').done((result) => {
        this.showPopup(result);
      }).fail(function(xhr){
        utils.errorHandle(xhr, "", this.toast.show);
      });
    }
  }
  showPopup(result){
    var htmlContent =
      '<div class="agreement-window">'
        +'<span class="agreement-window-close">X</span>'
        +'<div class="agreement-window-title">' + this.props.proxy + '</div>'
        +'<div class="agreement-window-content">'
          +'<div id="scroller" style="width:'+(this.props.scrollWidth || '700px')+';">'+result+'</div>'
        +'</div>'
      +'</div>';
    $('#agreement').html(htmlContent);
    document.addEventListener('touchmove',this.onTouch);
    $('#agreement').show();
    new Scroll('#agreement .agreement-window-content',{scrollX: true});
    $('#agreement .agreement-window .agreement-window-close').click(function(){
      $('#agreement').hide();
      document.removeEventListener('touchmove',this.onTouch);
    })
  }
  render() {
    return (
      <div className={this.state.className}>
        <Toast ref={t => this.toast = t}></Toast>
        <input ref='agreement-check' type="checkbox" onChange={this.onChange.bind(this)}/>
        <div className="icheck"><i className="iconfont icon-tongyi"></i></div>
        <label>{this.props.title}</label><a href="javascript:void(0);" onClick={this.onClick.bind(this)}>{this.props.proxy}</a>
      </div>
    );
  }

}

