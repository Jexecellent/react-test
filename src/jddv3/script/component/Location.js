import React, {Component} from 'react';
import ReactDom from 'react-dom';
import PropTypes from 'prop-types';
import {Input , Toast} from '@welab/xlib-react-components';
import Modal from '../component/Modal';
import CSSModules from 'react-css-modules';
import styles from './Location.less';
import Validate from '../helper/validator';


import classNames from 'classnames';

const OptinoNode = ({selected, text, onClick, index}) => {
	let style= selected ? {color: '#FF6122'} : null
  return (
    <li onClick={onClick} style={style}>
      {text}
    </li>
  );
};

class Location extends Component {
	constructor(props){
		super(props);
		
		this.state= {
			show: false,
      validated: true,
      addressData: {},
      province:{},
      provinceId:null,
      city: {},
      cityId:null,
      district:{},
      districtId:null,
      errStyle : { display: 'none' },
      errMsg : ''
		}

		this.handleClickSelect = this.handleClickSelect.bind(this);
		this.onDone = this.onDone.bind(this);
		this.onCancel = this.onCancel.bind(this);
		this.init = this.init.bind(this);
		this.initData = this.initData.bind(this);
		this.setValue = this.setValue.bind(this);
		this.getValue = this.getValue.bind(this);
		this.showAddress = this.showAddress.bind(this);
	}

	init(bdPosition){
		this.props.fecthAreas && this.props.fecthAreas((data) => {
			if (data) {
				if(bdPosition) {
					let provinceCode = '';
					let cityCode = '';
					let districtCode = '';
					let findFlag = false; 
					data.data.some((province) => {
						if (findFlag) { return true}
						province.areas.some((city) => {
							if (findFlag) { return true}
							city.areas.some((district) => {
								if(district.id == bdPosition.result.addressComponent.adcode) {
									provinceCode = province.id;
									cityCode = city.id;
									districtCode = district.id;

									findFlag = true;

									return true;
								}
							})
						})
					});

					this.setValue(provinceCode,cityCode,districtCode);
				} else {
					this.initData(data);
				}
			}
		})
	}

	initData(addressData=store.session('areas')){
		let cityNum = 0, provinceNum=0, districtNum=0;

		let defProvince = {};
		let city = {};
		let district = {};
		if (this.state.provinceId) {

			// province handler
			let length = addressData.data.length;
			for (let i = 0; i < length; i++) {
				let province = addressData.data[i];
				if (province.id==this.state.provinceId) {
					defProvince = Object.assign({}, province); // find province name and citys
					provinceNum = i; // province position

					// city position
					if ( this.state.cityId ) {
						let citys = defProvince.areas;
						for (var j = 0; j < citys.length; j++) {
							if (this.state.cityId==citys[j].id) {
								city = Object.assign({}, citys[j]);
								cityNum = j;
								break;
							}
						}
					}else{
						city = defProvince.areas[0];  //默认第一个城市 
					}

					// district position
					if (this.state.districtId) {
						let districts = city.areas
						for (var k = 0; k < districts.length; k++) {
							if (this.state.districtId==districts[k].id) {
								district = Object.assign({}, districts[k]);
								districtNum = k;
								break;
							}
						}
					}else{
						district = city.areas[0];
					}
					break;
				}
			}
		}

		this.setState({
			addressData,
			province: defProvince,
			provinceNum:provinceNum,
			city,
			cityNum:cityNum,
			district,
			districtNum:districtNum
		});
	}

  getValue() {
      return {
        province: this.state.province.id,
        city: this.state.city.id,
        district: this.state.district.id
      };
      
  }

  showAddress(){
  	const {province, city, district} = this.state;
  	if (province.name) {
  		return '';
  	}
  	return `${province.name} ${city.name} ${district.name}`
  }

  setValue(province, city, district) {
    if(province){
      this.setState({
        provinceId: province,
        cityId: city,
        districtId: district
      }, this.init)
    }
  }

  handleClickSelect() {
    this.setState({
      show: true,
      errStyle:{display:'none'}
    });
    const {  province, provinceNum, cityNum, districtNum} = this.state;
    const lineHeight = window.lib ? lib.flexible.rem2px(0.405)*2 : 41;
    const _self = this;
    if (typeof province.name === "undefined") {
			$.ajax({
				'url': `http://api.map.baidu.com/location/ip?ak=Cr0tXRAfpr8PC4aSOPSBGoMe&coor=bd09ll`,
				'type': 'get',
				'dataType': 'jsonp',
				'jsonpCallback':'jsonp1'
			});
			window.jsonp1 = (data) => {
				setPosition(data);
			};

			const self = this;
			function setPosition(position){
				$.ajax({
					'url':`http://api.map.baidu.com/geocoder/v2/?location=${position.content.point.y},${position.content.point.x}&output=json&pois=1&ak=Cr0tXRAfpr8PC4aSOPSBGoMe&coordtype=wgs84ll`,
					'type': 'get',
					'dataType': 'jsonp',
					'jsonpCallback':'jsonp2'
				});
				window.jsonp2 = (data) => {
					self.init(data);
				}
			}
    }
    setTimeout(function(){
	    if (provinceNum > -1) {
				ReactDom.findDOMNode(this.refs.province).scrollTop = lineHeight * _self.state.provinceNum;
	    }
	    if (cityNum > -1) {
				ReactDom.findDOMNode(this.refs.city).scrollTop = lineHeight * _self.state.cityNum;
	    }
      if (districtNum > -1) {
  			ReactDom.findDOMNode(this.refs.district).scrollTop = lineHeight * _self.state.districtNum;
      }
    }.bind(this), 500);
  }

	componentDidMount(){
		this.init();
	}

	onProvinceChange(province, provinceNum){
		if (this.state.province.id === province.id) 
			return;
		
		if (province && province.areas.length) {
			this.setState({
				province,
				provinceNum,
				city: province.areas[0],
				cityNum: 0,
				district: province.areas[0].areas[0],
				districtNum: 0
			});

			ReactDom.findDOMNode(this.refs.city).scrollTop=0;
			ReactDom.findDOMNode(this.refs.district).scrollTop=0;
		}
	}
	
	onCityChange(city, cityNum){
		if (this.state.city.id === city.id) {
			return;
		}
		this.setState({ city, cityNum, district: city.areas[0], districtNum: 0});
		ReactDom.findDOMNode(this.refs.district).scrollTop=0;
	}

	onDistrictChange(district, districtNum){
		if (this.state.district.id === district.id) {
			return;
		}
		this.setState({ district, districtNum });
	}


	doValidate() {
	  if(!this.state.province.name){
      this.refs['alert'].show('请选择省市区')
      return false;
    }
    return true;
  }

	onDone(e){
    e.preventDefault();
    e.stopPropagation();
		this.setState({
			show: false
		});
	}


	// modal hide api props
  onCancel(e) {
    e.preventDefault();
    e.stopPropagation();
  	let state = { show: false};
  	if (!this.state.provinceId) {
  		state.province = {}
  	}

    this.setState( state );
  }

	render(){

		const {backdrop} = this.props;
		const { show, addressData, province, city, district ,errMsg, errStyle} = this.state;
		
		const provinceNodes = addressData.data ? 
			(
				addressData.data.map((provinceObj, index)=>{
					let selected = province.name ? (province.name===provinceObj.name): (index===0?true:false);
					return (
		        <OptinoNode onClick={this.onProvinceChange.bind(this, provinceObj, index)} key={provinceObj.id} text={provinceObj.name} selected={selected}/>
		      )
				})
			): null;
		const cityNodes = province.areas? (province.areas.map((cityObj, index)=>{
					let selected = city.name? (city.name===cityObj.name) : (index===0?true:false);
					return (
						<OptinoNode onClick={this.onCityChange.bind(this, cityObj, index)} key={cityObj.id} text={cityObj.name} selected={selected}/>
					)
				})
			) : null;

		const districtNodes = city.areas? (city.areas.map((districtObj, index)=>{
					let selected = district.name? (district.name===districtObj.name): (index===0?true:false);
					return (
						<OptinoNode onClick={this.onDistrictChange.bind(this, districtObj, index)} key={districtObj.id} text={districtObj.name} selected={selected}/>
					)
				})
			):null;

		const locationValue = province.name? `${province.name} ${city.name} ${district.name}`:'';
		const noLocationValue = '请选择省市区';
		return (
      <div styleName="formdate" onClick={this.handleClickSelect}>
        {province.name ? <span styleName="val">{locationValue}</span> : <span styleName="tip">{this.props.placeholder}</span>}
        {province.name ? '' : <span styleName="error" style={errStyle}>{errMsg}</span>}
        
        <i className="iconfont icon-xinyongrenzhengyetiaozhuan" styleName="updown"></i>
        <Modal show={show} uiEvent={this.handleClickSelect}>
          <div styleName="locationselect">
            <div styleName="header">
              <a onClick={this.onCancel}> 取消 </a>
              <a onClick={this.onDone}> 完成 </a>
            </div>

            <div styleName="flexbox">
              <div styleName="column" ref="province">
                { provinceNodes }
              </div>
              <div styleName="column" ref="city">
                { cityNodes }
              </div>
              <div styleName="column" ref="district">
                { districtNodes }
              </div>
            </div>
          </div>
        </Modal>
        <Toast ref="alert" timeout={1500}/>
      </div>

		)
	}

}

Location.propTypes = {
	show: PropTypes.bool,
	// label
	label: PropTypes.string,
  // 取消按钮事件
  onCancel: PropTypes.func,
  // 省市区，值为一个id
  province: PropTypes.string,
  city: PropTypes.string,
  district: PropTypes.string,

  // 初始化城市数据， 必需
  fecthAreas: PropTypes.func.isRequired, 
  // 行样式
  rowClass: PropTypes.string

}

export default CSSModules(Location, styles);




