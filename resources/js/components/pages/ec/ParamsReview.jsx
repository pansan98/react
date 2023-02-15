import React from 'react';
import {useParams} from 'react-router-dom';
import Review from './Review';

const ParamsReview = () => {
	const {code} = useParams();

	return (<Review code={code}/>)
}

export default ParamsReview;