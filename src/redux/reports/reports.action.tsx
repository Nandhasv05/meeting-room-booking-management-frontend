// Version : 0.0.1
// Author : NANDHAKUMAR S V
// Date : 27/08/2026
// Description : reports action functions

import reportsActionTypes from './reports.types';

export const fetchReportStart = (payload?: any) => ({
	type: reportsActionTypes.FETCH_REPORT_START,
	payload,
});

export const fetchReportSuccess = (payload: any) => ({
	type: reportsActionTypes.FETCH_REPORT_SUCCESS,
	payload,
});

export const fetchReportFailure = (payload: any) => ({
	type: reportsActionTypes.FETCH_REPORT_FAILURE,
	payload,
});

export const fetchReportResponseResetStart = () => ({
	type: reportsActionTypes.FETCH_REPORT_RESPONSE_RESET_START,
});

export const fetchReportResponseChanged = () => ({
	type: reportsActionTypes.FETCH_REPORT_RESPONSE_CHANGED,
});
