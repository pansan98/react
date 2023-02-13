import React from 'react';
import {useParams} from 'react-router-dom';
import Detail from './Detail';

const ParamsDetail = () => {
	const {code} = useParams();

	return (<Detail code={code}/>)
}

export default ParamsDetail;