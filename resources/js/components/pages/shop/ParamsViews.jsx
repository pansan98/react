import React from 'react';
import {useParams} from 'react-router-dom';
import Views from './Views';

const ParamsViews = () => {
	const {code} = useParams();

	return (<Views code={code}/>)
}

export default ParamsViews;