import React, {Component} from 'react';
import { Route, Redirect } from 'react-router-dom';

const PrivateRoute = ({component, ...rest}) => (
	<Route {...rest} render={props => (
		utils.isLogin() ? React.createElement(component, props) : (<Redirect to={{
			pathname: '/login',
			state: {from: props.location}
		}} />)
	)} />
);

export default PrivateRoute;

