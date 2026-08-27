// Version : 0.0.1
// Author : NANDHAKUMAR S V
// Date : 27/08/2026
// Description : audit reducer

import auditActionTypes from './audit.types';

const INITIAL_STATE: any = {
	'auditPage': null,
	'auditLoading': false
};

const auditReducer = (state = INITIAL_STATE, action: any) => {
	switch (action.type) {
		case auditActionTypes.FETCH_AUDIT_LOGS_START:
			return {
				...state,
				auditLoading: true,
			};
		case auditActionTypes.FETCH_AUDIT_LOGS_SUCCESS:
			return {
				...state,
				auditLoading: false,
				auditPage: action.payload?.data ?? null,
			};
		case auditActionTypes.FETCH_AUDIT_LOGS_FAILURE:
			return {
				...state,
				auditLoading: false,
			};
		case auditActionTypes.FETCH_AUDIT_LOGS_RESPONSE_CHANGED:
			return {
				...state,
			};
		default:
			return state;
	}
};

export default auditReducer;