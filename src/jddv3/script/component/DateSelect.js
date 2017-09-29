/**
 * 时间选择组件
 */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import ReactDom from 'react-dom';
import CSSModules from 'react-css-modules';
import {Input , Toast} from '@welab/xlib-react-components';
import Modal from '../component/Modal';
import styles from './DateSelect.less';
const OptinoNode = ({selected, text, onClick}) => {
  let style = selected ? {color: '#FF6122'} : null;
  return (
    <li onClick={onClick} style={style}>
      {text}
    </li>
  );
};


class DateSelect extends Component {
  constructor(props) {
    super(props);

    const date = new Date();
    const year = date.getFullYear();
    const gap = year - 1970;
    const yearDatas = [];
    for (let i = gap; i >= 0; i--) {
      let y = year - i;
      yearDatas.push({name: y + ' 年 ', id: y + ''});
    }
    yearDatas.reverse();

    const monthDatas = [];
    for (let m = 1; m < 13; m++) {
      if (m < 10) {
        m = '0' + m;
      }
      monthDatas.push({name: m + ' 月', id: m + ''});
    }

    this.state = {
      show: false,
      yearDatas: yearDatas,
      year: '',
      monthDatas: monthDatas,
      month: '',
      yearNum:0,
      monthNum:0,
      errStyle : { display: 'none' },
      errMsg : ''
    }

    this.handleClickSelect = this.handleClickSelect.bind(this);
    this.onCancel = this.onCancel.bind(this);
    this.onDone = this.onDone.bind(this);
    this.doValidate = this.doValidate.bind(this);
    this.setValue = this.setValue.bind(this);
    this.getValue = this.getValue.bind(this);
  }

  getValue() {
    return {
      year: this.state.year.id,
      month: this.state.month.id
    };
  }

  setValue(year, month) {
    if(year){
      let yearNum = 0;
      let monthNum = 0;
      this.state.yearDatas.map((item,index) => {
        if(item.id === year+'') {
          yearNum = index;
        }
      });
      this.state.monthDatas.map((item,index) => {
        if(item.id === month+'') {
          monthNum = index;
        }
      });
      this.setState({
        year: {name: year + ' 年 ', id: year + ''},
        month: {name: month + ' 月', id: month + ''},
        yearNum:yearNum,
        monthNum:monthNum
      })
    }
  }

  handleClickSelect() {
    const lineHeight = window.lib ? lib.flexible.rem2px(0.405)*2 : 41;
    this.setState({ 
      show:!this.state.show,
      year:this.state.year || this.state.yearDatas[0],
      month:this.state.month || this.state.monthDatas[0],
      errStyle:{display:'none'}
    })
    setTimeout(function(){
	    ReactDom.findDOMNode(this.refs.year).scrollTop = lineHeight * this.state.yearNum;
      ReactDom.findDOMNode(this.refs.month).scrollTop = lineHeight * this.state.monthNum;
    }.bind(this), 500);
  }
  onDone(e){
    e.preventDefault();
    e.stopPropagation();
		this.setState({
			show: false
		});
	}
  onCancel() {
    this.setState({
      show:false
    })
  }


  onYearChange(year, yearNum,e) {
    e.preventDefault();
    e.stopPropagation();
    if (this.state.year.id === year.id){
      return;
    }
    this.setState({
      year:year,
      yearNum :yearNum,
      month: this.state.monthDatas[0],
      monthNum: 0,
    });
    ReactDom.findDOMNode(this.refs.month).scrollTop = 0;
  }

  onMonthChange(month, monthNum,e) {
    e.preventDefault();
    e.stopPropagation();
    if (this.state.month.id === month.id) {
      return;
    }
    this.setState({
      month:month, 
      monthNum:monthNum
    });
  }
  doValidate() {
	  if(!this.state.year.name){
      this.refs['alert'].show('请选择年份')
      return false;
    }
    if(!this.state.month.name){
      this.refs['alert'].show('请选择月份')
      return  false;
    }
    return true;
  }

  render() {
    const { show, yearDatas, monthDatas, year, month,errMsg,errStyle } = this.state;
    const yearNodes = (
      yearDatas.map((yearObj, index)=> {
        let selected = year.name ? (year.name === yearObj.name) : (index === 0 ? true : false);
        return (
          <OptinoNode onClick={this.onYearChange.bind(this, yearObj, index)} key={yearObj.id} text={yearObj.name}
                      selected={selected}/>
        )
      })
    );
    const monthNodes = (monthDatas.map((monthObj, index)=> {
        let selected = month.name ? (month.name === monthObj.name) : (index === 0 ? true : false);
        return (
          <OptinoNode onClick={this.onMonthChange.bind(this, monthObj, index)} key={monthObj.id} text={monthObj.name}
                      selected={selected}/>
        )
      })
    );

    const dateValue = year.name ? `${year.name}${month.name}` : '';
    return (
      <div styleName="formdate" onClick={this.handleClickSelect}>
        {year.name ? <span styleName="val">{`${year.name}${month.name}`}</span> : <span styleName="tip">{this.props.placeholder}</span>}
        {year.id ? '' : <span styleName="error" style={errStyle}>{errMsg}</span>}
        <i className="iconfont icon-xinyongrenzhengyetiaozhuan" styleName="updown"></i>
        <Modal show={show} uiEvent={this.handleClickSelect}>
          <div styleName="dateselect">
            <div styleName="header">
              <a onClick={this.onCancel}> 取消 </a>
              <a onClick={this.onDone}> 完成 </a>
            </div>

            <div styleName="flexbox">
              <div styleName="column" ref="year">
                { yearNodes }
              </div>
              <div styleName="column" ref="month">
                { monthNodes }
              </div>
            </div>
          </div>
        </Modal>
        <Toast ref="alert" timeout={1500}/>
      </div>

    )
  }

}

export default CSSModules(DateSelect, styles);




