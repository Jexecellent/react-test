import React , {Component} from 'react';
import Config from '../helper/config';
import FullScreen from '../component/FullScreen';
import Modal from '../component/Modal';
import Toast from '@welab/xlib-react-components/components/Toast';
import { livenessLimit } from '../liveness/constants';
import { createObjectURL, revokeObjectURL } from '../liveness/compatible';
import {Steps, Step} from '../component/StepIndex'

class FaceCert extends Component{
  constructor(props){
    super(props);
    this.state = {
      faceUrl: '//web.wolaidai.com/img/jddv3/camera_face.png',
      showModal: false
    }
  }

  componentDidMount() {
    utils.updatePageTitle("刷脸认证");
  }

  uploadVideo(event) {
    const check = function(file) {
      const promise = new Promise((resolve, reject) => {
        // debugger;
        if (file.size > livenessLimit.size) {
          reject({ errMsg: '视频大小大于10M，请重新上传！' });
          return;
        }

        const video = document.createElement('video');
        let metadataloaded = false;
        video.preload = 'metadata';
        video.onloadedmetadata = () => {
          metadataloaded = true;
          revokeObjectURL(video.src);
          if (video.duration > livenessLimit.duration) {
            reject({ errMsg: '视频时间大于3s，请重新上传！' });
          } else {
            resolve({ file });
          }
        };
        video.src = createObjectURL(file);
        setTimeout(() => {
          if (!metadataloaded) {
            resolve({ file });
          }
        }, 2000);
      });
      return promise;
    };

    const file = event.target.files[0];
    check(file).then(() => {
      this.setState({
        showModal: true
      })
      console.log('视频上传成功');
      this.toast.show('视频上传成功');
    },(err) => {
      console.log(err);
      this.toast.show(err.errMsg);
    })
    
  }

  render(){
    const { faceUrl, showModal } = this.state;
    return(
      <FullScreen color='#fff' className='face-cert' footer={false}>
        <Steps current={1}>
          <Step title="身份信息" icon={<i className="iconfont proIcon">&#xe65b;</i>} />
          <Step title="实名认证" icon={<i className="iconfont proIcon" >&#xe65c;</i>} />
          <Step title="提交申请" icon={<i className="iconfont proIcon" >&#xe65a;</i>} />
        </Steps>
        <div className='face-div'>
          <p>您的借款申请即将提交，为防止资金被他人盗用</p>
          <p>请按下面提示刷脸，确认是本人操作</p>
          <img className='camera-face' src={ faceUrl }/>
        </div>
        <button className='btn' onClick={ () => this.vedioInput.click() }>开始刷脸</button>
        <p className='face-msg'> 已成功保护<span>5,527,534+</span>账号安全</p>
        <input ref={ input => this.vedioInput = input } className='video' type='file' accept='video/*' capture='true' onChange={ this.uploadVideo.bind(this) }/>
        <Toast timeout={1500} ref={ toast => this.toast = toast }></Toast>
        <Modal show={ showModal }>
          <div className='face-modal'>

          </div>
        </Modal>
      </FullScreen>
    )
  }
}
export default FaceCert;