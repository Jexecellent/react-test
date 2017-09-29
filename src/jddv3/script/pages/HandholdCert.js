import React , {Component} from 'react';
import Config from '../helper/config';
import FullScreen from '../component/FullScreen';
import {ImageUploader, Toast} from '@welab/xlib-react-components/components/ImageUploader';
import {Steps, Step} from '../component/StepIndex'

class HandholdCert extends Component{
  constructor(props){
    super(props);
    this.state = {
      imgUrl: ''
    }
  }

  componentDidMount(){
    utils.updatePageTitle("实名认证");

  }

  uploadPhoto() {
    return (file) => {
      this.setState({
        imgUrl: file
      });
      // 开始上传
      let formData = new FormData();
      formData.append('resource', file);
      formData.append('doc_type', 'id_handheld_proof');
      API.upload('v3/documents', formData).done(data => {
      }).fail((xhr, error) => {
        utils.errorHandle(xhr, error);
      });
    }
  }

  render(){
    const { imgUrl } = this.state;
    return(
      <FullScreen color="#fff" className='handhold-cert' footer={false}>
        <Steps current={1}>
          <Step title="身份信息" icon={<i className="iconfont" style={{fontSize:'50px'}}>&#xe65b;</i>} />
          <Step title="实名认证" icon={<i className="iconfont" style={{fontSize:'50px'}}>&#xe65c;</i>} />
          <Step title="提交申请" icon={<i className="iconfont" style={{fontSize:'50px'}}>&#xe65a;</i>} />
        </Steps>
        <div className='handhold-div'>
          <p>您的借款申请即将提交，请上传手持身份证</p>
          <p>确认是本人操作</p>
          <ImageUploader
            ref = { iu => this.imgUploader = iu } 
            className="camera-face" 
            imgURI={imgUrl} 
            onProcessDone={this.uploadPhoto()} 
            onProcessError={(c, f) => this.uploadPhoto()(f)} >
            {!imgUrl && (
              <div>
                <img src="//web.wolaidai.com/img/jddv3/img_payroll_upload.png" alt="" style={{ "width":'100%',"height":'100%' }}/>
              </div>
            )}
          </ImageUploader>
        </div>
        <button className="btn" onClick={ () => this.imgUploader.triggerPicker() }>上传手持身份证</button>
        <p className='face-msg'> 已成功保护<span>5,527,534+</span>账号安全</p>
        <Toast timeout={1500} ref={ toast => this.toast = toast }></Toast>
      </FullScreen>

    )
  }
}
export default HandholdCert;