import React , {Component } from 'react';
import FullScreen from '../component/FullScreen';
import { Link } from 'react-router-dom' // 引入Link处理导航跳转
import PrivateRoute from '../component/PrivateRoute';
import IDCard from './IDCard';
import Authorization from './Authorization';
import Profile from './Profile';

class MyData extends Component{
  constructor(props){
    super(props);
    this.state ={
      routeType: this.props.location.pathname.split('/')[2]
    }
  }
  componentWillMount(){
    utils.updatePageTitle("我的资料");

  }
  toggleRoute(type) {
    this.setState({
      routeType: type
    })
  }

  render(){
    const { routeType } = this.state;
    const routes = [{
      type: 'idcard',
      desc: '身份信息'
    },{
      type: 'auth',
      desc: '信用认证'
    },{
      type: 'profile',
      desc: '联系资料'
    }];
    const nav = routes.map((item,index) => {
      return (
        <li key={ index } className={ item.type === routeType ? 'active' : '' } onClick={ this.toggleRoute.bind(this,item.type) }><Link to={ "/mydata/" + item.type}> { item.desc } </Link></li>
      )
    })
    return(
      <FullScreen footer={false} className='my-data'>
        <ul role="nav">
          { nav }
        </ul>
        <PrivateRoute path="/mydata/idcard" component={IDCard}/>
    		<PrivateRoute path="/mydata/auth" component={Authorization}/>
				<PrivateRoute path="/mydata/profile" component={Profile}/>	
      </FullScreen>
    )
  }
}
export default MyData;