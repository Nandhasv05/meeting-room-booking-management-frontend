// Version : 0.0.1
// Author : NANDHAKUMAR S V
// Date : 27/08/2026
// Description : reports reducer

import reportsActionTypes from './reports.types';

const INITIAL_STATE: any = {
	'rows': [],
	'reportLoading': false
};

const reportsReducer = (state = INITIAL_STATE, action: any) => {
	switch (action.type) {
		case reportsActionTypes.FETCH_REPORT_START:
			return {
				...state,
				reportLoading: true,
			};
		case reportsActionTypes.FETCH_REPORT_SUCCESS:
			return {
				...state,
				reportLoading: false,
				rows: action.payload?.data ?? [],
			};
		case reportsActionTypes.FETCH_REPORT_FAILURE:
			return {
				...state,
				reportLoading: false,
				rows: [],
			};
		case reportsActionTypes.FETCH_REPORT_RESPONSE_CHANGED:
			return {
				...state,
			};
		default:
			return state;
	}
};

export default reportsReducer;