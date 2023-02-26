import React from 'react';
import {useParams} from 'react-router-dom';
import Password from './Password';

const ParamsPassword = () => {
	const {identify, token} = useParams();

	return (<Password identify={identify} token={token}/>)
}

export default ParamsPassword;