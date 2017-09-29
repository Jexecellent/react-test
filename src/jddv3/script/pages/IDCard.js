import React , {Component} from 'react';
import Config from '../helper/config';
import FullScreen from '../component/FullScreen';
import {ImageUploader, Toast} from '@welab/xlib-react-components';

class IDCard extends Component{
  constructor(props){
    super(props);
    const pathname = this.props.location.pathname;
    console.log(pathname);
    this.state = {
      isInMyData: pathname === '/mydata/idcard',
      checked: true,
      idCards: [
        {
          type: 'front',
          docType: 'id_front_proof',
          imgUrl: '//web.wolaidai.com/img/jddv3/id_card_front.png',
          exampleUrl: '//web.wolaidai.com/img/jddv3/id_card_front.png',
          loadUrl: '//web.wolaidai.com/img/jddv3/id_upload.png'
        },{
          type: 'back',
          docType: 'id_back_proof',
          imgUrl: '//web.wolaidai.com/img/jddv3/id_card_front.png',
          exampleUrl: '//web.wolaidai.com/img/jddv3/id_card_back.png',
          loadUrl: '//web.wolaidai.com/img/jddv3/id_upload.png'
        }
      ],
      idInfos:{
        name: '克里斯',
        cnid: '640381109934220048',
        validPeriod: '123'
      }
    }
  }

  componentDidMount(){
    !this.state.isInMyData && utils.updatePageTitle("身份信息");

  }

  uploadPhoto(type,docType) {
    return (file) => {
      const { idCards, idInfos } = this.state;
      idCards.some((item,index) => {
        item.type === type && (item.imgUrl = file) && this.setState({ idCards: idCards,checked: true })
      })

    }
  }

  submit() {
    const { idInfos } = this.state;
    if(idInfos.name && idInfos.cnid && idInfos.validPeriod) {
      this.props.history.push('zmxyAuth');
    } else {
      
      this.toast.show('您的信息未完善，请检查您的身份证正反面照片是否正常上传');
    }

  }

  render(){
    const { idCards,idInfos,checked,isInMyData } = this.state;
    let idInfosReady  = true;
    for(let i in idInfos) {
      !idInfos[i] && (idInfosReady = false);
    }
    const title = idInfosReady ? '请核对信息，如有误请重拍，提交后不可更改' : '请拍摄您的二代身份证，自动智能识别';
    const styles = isInMyData ? {'color':'#CCCCCC'} : {'color': '#333'};
    return(
      <FullScreen className='id-card' footer={false}>
        <Toast ref={t => this.toast = t}></Toast>
        <div className='ocr-div'>
          <h1>{!isInMyData ? title : ''}</h1>
          <div className='images'>
            {
              idCards.map((item,index) => {
                return (
                  <ImageUploader key={ index } 
                  imgURI={ item.imgUrl ? `${item.loadUrl}?` + new Date().getTime() : item.exampleUrl }
                  onProcessDone= { this.uploadPhoto.call(this, item.type, item.docType) }>  
                  </ImageUploader>
                )
              })
            }
          </div>
        </div>
        {
          checked ? 
          <div className='info-div'>
            <div>
              <div>姓名</div>
              <div style={{...styles}}>{ idInfos.name }</div>
            </div>
            <div>
              <div>身份号码</div>
              <div style={{...styles}}>{ idInfos.cnid }</div>
            </div>
            <div>
              <div>有效期限</div>
              <div style={{...styles}}>{ idInfos.validPeriod }</div>
            </div>
          </div> : null 
        }
        {!isInMyData ? <button className="btn" onClick={ this.submit.bind(this) }>提交</button> : 
        <p className="bottom" >2017-09-07实名认证通过，如需修改，请联系客服</p> }
      </FullScreen>

    )
  }
}
export default IDCard;