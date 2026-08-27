// Version : 0.0.1
// Author : NANDHAKUMAR S V
// Date : 27/08/2026
// Description : reports API services

import { makeApiCall } from '../_common/api.utils';
import { api } from '../../services/api';

export const fetchReportCall = (payload?: any) => {
	const { path, ...params } = payload || {};
	return makeApiCall(path, params);
};

export const exportReportCall = (payload: any) => {
	const { type, format, from, to } = payload || {};
	return api.post(
		'/reports/export',
		{ type, format, from, to },
		{
			responseType: 'blob',
			skipCrypto: true,
		},
	);
};
