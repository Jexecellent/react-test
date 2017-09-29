/*
 * react-dropzone 中没有对 window.URL 进行容错，导致了某些浏览器报错，中断代码执行
 */

import React, {Component} from 'react';
import BottomLogo from '../component/BottomLogo';
import ImageUploader from '@welab/xlib-react-components/components/ImageUploader.jsx';
import Toast from '@welab/xlib-react-components/components/Toast';

const reportKeyMap = {
  employment: 'photo_employee',
  supplement: 'photo_supplement'
}

const uploadKeyMap = {
  employment: 'employment_proof',
  supplement: 'supplement_proof'
}

export default class WorkProof extends React.Component {
  constructor(props) {
    super(props);

    let title = [
      ['1.可选含姓名及工作单位的', '@工牌、名片'],
      ['2.可选盖有公章的', '@工作证明原件'],
      ['3.可选', '@劳动合同', '（封面、职位信息项、签字盖章页）']];
    let examplePhotoUrl = '//web.wolaidai.com/img/jdd/img_work_upload.png';
    if(!!store.session('offer')){
      title = [
        ['1.可选含姓名及工作单位的', '@工牌、名片'],
        ['2.可选','@公司发送的offer'],
        ['3.可选', '@劳动合同，三方协议']];
      examplePhotoUrl = 'https://web.wolaidai.com/img/jdd/img-offer-upload.jpg';
    }
    this.state = {
      title: '工作证明',
      addTitle: '添加工作证明照片',
      desc:title,
      examplePhotoUrl: examplePhotoUrl,
      photoSourceMap: {
        employment_proof: '',
        supplement_proof: ''
      }
    }
  }

  componentDidMount() {
    utils.report('work_proof_load')
    utils.updatePageTitle(this.state.title);
    const state = this.state;
    API.get('v3/documents', {style: 'high'}).done((data) => {
      data.map((item) => {
        state.photoSourceMap[item.doc_type] = item.doc_infos[0].url;
      })
      this.setState(state);
    }).fail((xhr) => {
      utils.errorHandle(xhr,null,this.toast.show);
    })
  }


  uploadPhoto(type) {
    const reportKey = reportKeyMap[type];
    const doctype = uploadKeyMap[type];
    return (file) => {
      let photoSourceMap = this.state.photoSourceMap;
      photoSourceMap[doctype] = file;
      this.setState({
        photoSourceMap
      });
      // 开始上传
      let formData = new FormData();
      formData.append('resource', file);
      formData.append('doc_type', doctype);
      API.upload('v3/documents', formData).done(data => {
        this.reportEvent('suc')(reportKey);
      }).fail((xhr, error) => {
        this.reportEvent('fail')(reportKey);
        utils.errorHandle(xhr, error,this.toast.show);
      });
    }
  }

  reportEvent(event) {
    return (eventType) => {
      utils.report(`${eventType}_${event}`);
    }
  }

  goBack() {
    this.props.history.push('otherAuth');
  }

  render() {
    let photoSourceMap = this.state.photoSourceMap;
    let employment_proof = photoSourceMap['employment_proof'] ?
        <img src={photoSourceMap['employment_proof']}/> : null;
    let supplement_proof = photoSourceMap['supplement_proof'] ?
        <img src={photoSourceMap['supplement_proof']}/> : null;
    const photos = [
    {
      name: 'employment_proof', 
      img: employment_proof
    }, 
    {
      name: 'supplement_proof',
      img: supplement_proof
    }];

    let clickEvent = this.reportEvent('clc');
    let dropEvent = this.reportEvent('drop');
    return (
      <div className='work-proof'>
        <div className='desc'>
          <ol>
            {this.state.desc.map((item, index) => {
              return (
                <li key={index}>
                  {item.map((item, index) => {
                    let isSpecial = false;
                    if (item.startsWith('@')) {
                      isSpecial = true;
                      item = item.substr(1);
                    }
                    return (
                      <span key={index} className={isSpecial ? 'special' : ''}>{item}</span>
                    )
                  })};
                </li>
              )
            })}
          </ol>
          <div className='proof-pic'>
            <img src={this.state.examplePhotoUrl}></img>
          </div>
        </div>
        <div className='upload-photo'>
          <p>{this.state.addTitle}</p>
          <div className="upload-photo-wraps">
            {photos.map((item, index) => {
              let field = item.name.substring(0,10);
                return (
                  <ImageUploader 
                    key={index}
                    id={item.name}
                    className={item.img? 'upload-photo-wrap img-load' : 'upload-photo-wrap'}
                    imgURI={photoSourceMap[item.name]} 
                    onClick={clickEvent.bind(this, reportKeyMap[field])} 
                    onFileCheck={this.handleFileCheck} 
                    onProcessStart={dropEvent.bind(this, reportKeyMap[field])}
                    onProcessDone={this.uploadPhoto(field)} 
                    onProcessError={(c, f) => this.uploadPhoto(field)(f)} >
                    <img src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAALYAAAC2AgMAAAAJnp+XAAAACVBMVEUAAADy8vK4wMknrY4xAAAAAXRSTlMAQObYZgAAAIhJREFUaN7t1zEKgDAQRNHV0lOk9jzxPosnSekxtVUyEJDIRv4n5TQ+TBE7Fm8/xdxGLZnHmYcKGWSQQeYRMipkVMiokFF9JTNtufNcFGeODDLIIFPb3cuv5sk8zvwqzvxP/wy3CRlkkOn8qbyb6iGjQkaFjAoZFTIqZFTIqJBRDSezl3VuPnYCHn2m8/3P9zQAAAAASUVORK5CYII='/>
                    <div className="xt" style={{display: index === 1 && !item.img ? 'block' : 'none'}}>选填</div>
                  </ImageUploader>
                )
            })}
          </div>
        </div>

        <div className="btn-box">
          <button className="btn" onClick={this.goBack.bind(this)}>完成</button>
        </div>
        <BottomLogo></BottomLogo>
        <Toast timeout={1500} ref={ toast => this.toast = toast }></Toast>
      </div>
    )
  }
}

