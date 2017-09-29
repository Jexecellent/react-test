import React, {Component} from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';

import Config from './helper/config';
import Login from './pages/Login';
import IDCard from './pages/IDCard';
import FaceCert from './pages/FaceCert';
import HandholdCert from './pages/HandholdCert';
import Profile from './pages/Profile';
import Apply from './pages/Apply';
import SubmitApply from './pages/SubmitApply';

import WorkProof from './pages/WorkProof';

import ZmxyAuth from './pages/ZmxyAuth';
import OtherAuth from './pages/OtherAuth';
import OperatorAuth from './pages/OperatorAuth';

import Loan from './pages/Loan';
import AutoJump from './pages/AutoJump';
import MyData from './pages/MyData';

import PrivateRoute from './component/PrivateRoute';

export default class App extends Component{
  render(){
    const supportsHistory = 'pushState' in window.history;
		return (
			<Router basename={Config.app.name} forceRefresh={!supportsHistory}>
				<Switch>
          <Route exact path="/login" component={Login} />
          <PrivateRoute path="/idcard" component={IDCard} />
          <PrivateRoute path="/facecert" component={FaceCert} />
					<PrivateRoute path="/handholdcert" component={HandholdCert} />
					<PrivateRoute path="/profile" component={Profile}/>
          <PrivateRoute path="/zmxyAuth" component={ZmxyAuth} />
          <PrivateRoute path="/otherAuth" component={OtherAuth} />
					<PrivateRoute path="/operatorAuth" component={OperatorAuth} />
					<PrivateRoute path="/workProof" component={WorkProof} />
					<PrivateRoute path="/apply" component={Apply} />
					<PrivateRoute path="/submitApply" component={SubmitApply} />
					<PrivateRoute path="/loan/:state" component={Loan} />
					<PrivateRoute path="/autoJump" component={AutoJump} />
					<PrivateRoute path="/mydata" component={MyData} />
					{/*路由请加在前面*/}
          <Redirect from='/' to='/login'/>
        </Switch>
      </Router>
    )
  }
}

