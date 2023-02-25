import React from 'react';
import {useParams} from 'react-router-dom';
import Authorize from './Authorize';

const ParamsAuthorize = () => {
	const {identify, token} = useParams();

	return (<Authorize identify={identify} token={token}/>)
}

export default ParamsAuthorize;