import React from 'react';
import {useParams} from 'react-router-dom';
import Edit from './Edit';

const ParamsEdit = (props) => {
	const {code} = useParams();

	return (<Edit code={code} page="編集"/>)
}

export default ParamsEdit;