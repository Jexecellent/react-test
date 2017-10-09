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
            <img className='person' src="//web.wolaidai.com/img/jddv3/scan.png"/>
            <img className='eyes' src="data:image/gif;base64,R0lGODlhawA3AMQUADExMeXl5ScnJzk5OSkpKcLCwnh4eFRUVD8/P0BAQOTk5H9/f319fS8vL8PDwysrK35+fsHBwTIyMiYmJv///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH/C05FVFNDQVBFMi4wAwEAAAAh/wtYTVAgRGF0YVhNUDw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDY3IDc5LjE1Nzc0NywgMjAxNS8wMy8zMC0yMzo0MDo0MiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDoyMWQ5ZTQwZC0xMzkxLTRlNWItYmUwMS03MmYyYWI5NWU0MTAiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6REJCREZFRkU5QUE2MTFFNzk2NTNDOEE1QzdGQUVBM0IiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6REJCREZFRkQ5QUE2MTFFNzk2NTNDOEE1QzdGQUVBM0IiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKE1hY2ludG9zaCkiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDoyMWQ5ZTQwZC0xMzkxLTRlNWItYmUwMS03MmYyYWI5NWU0MTAiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6MjFkOWU0MGQtMTM5MS00ZTViLWJlMDEtNzJmMmFiOTVlNDEwIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+Af/+/fz7+vn49/b19PPy8fDv7u3s6+rp6Ofm5eTj4uHg397d3Nva2djX1tXU09LR0M/OzczLysnIx8bFxMPCwcC/vr28u7q5uLe2tbSzsrGwr66trKuqqainpqWko6KhoJ+enZybmpmYl5aVlJOSkZCPjo2Mi4qJiIeGhYSDgoGAf359fHt6eXh3dnV0c3JxcG9ubWxramloZ2ZlZGNiYWBfXl1cW1pZWFdWVVRTUlFQT05NTEtKSUhHRkVEQ0JBQD8+PTw7Ojk4NzY1NDMyMTAvLi0sKyopKCcmJSQjIiEgHx4dHBsaGRgXFhUUExIREA8ODQwLCgkIBwYFBAMCAQAAIfkECfoAFAAsAAAAAGsANwAABd8gJY5kaZ5oqq5s675wLM90bd94ru987//AoHBILBqPyKRyyWw6n9CodEqtWq/YrPYWWCQeiUVA2v2Gx8kCYMJmAwpQddsNPyok8zZA4bzn3XxGDH9tC06DhBOGRgiJEwlOjYmQRgSOBE6WiZhGjmxOnhNHoaCeo6ZNpJ2oTKpFrkuwQ7JJtEG2p45HmoScTLx/vkSShJRMxH/GRIiEDIeOzkYKa397fdR51kdyc29x2HRKARAIDwgQaFDj5efpW+/w8fLz9PX29/j5+vv8/f7/AAMKHEiwoMGDCBMqTBICACH5BAUKABQALAAAAABrADcAAAWRICWOZGmeaKqubOu+cCzPdG3feK7vfO//wKBwSCwaj8ikcslsOp/QqHRKrVqv2Kx2y+16v+CweEwum89Ah+EwAEwAg4PB4VSz3XA53SiY+P9/Ak59gICCfIWGg4mBRxFrAw0TDXEGEU6PbJKUcpdon6ChoqOkpaanqKmqq6ytrq+wsbKztLW2t7i5uru8vb4jIQAh+QQJCgAUACwUABAARAATAAAFmiBFBUvyJEsgrmzrvnDskiaqigUw7TtQyMCgEKfjTXwUhcTIAyiG0GhyyTwqGFXeQsoFYrOTBQI8SXTPrzE4QSAT0PBVGzwnx+PkPO8O1+v5aH55gGeCdoRchmCIiYpVjFJ6dVVvkFCTTARqWWaWQ5tVCV9ZDJ5Do1UMCkVMTqZCq1muOa0/r0K0RkgiARAIDwgQN7dCvb/BNyEAIfkEBQoAFAAsAAAAAGsANwAABZAgJY5kaZ5oqq5s675wLM90bd94ru987//AoHBILBqPyKRyyWw6n9CodEqtWq/YrHbL7Xq/4LB4TC6LHYbDADABDA4GhxOtZrvhcqNgwu/3BU57fn6AeoOEgYd/RxFpAw0TDW8GEU6NapCScJVmnZ6foKGio6SlpqeoqaqrrK2ur7CxsrO0tba3uLm6u7y9nyEAOw=="/>
            <div className='over'></div>
            <p className='desc'>正在上传识别...</p>

          </div>
        </Modal>
      </FullScreen>
    )
  }
}
export default FaceCert;