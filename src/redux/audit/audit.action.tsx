// Version : 0.0.1
// Author : NANDHAKUMAR S V
// Date : 27/08/2026
// Description : audit action functions

import auditActionTypes from './audit.types';

export const fetchAuditLogsStart = (payload?: any) => ({
	type: auditActionTypes.FETCH_AUDIT_LOGS_START,
	payload,
});

export const fetchAuditLogsSuccess = (payload: any) => ({
	type: auditActionTypes.FETCH_AUDIT_LOGS_SUCCESS,
	payload,
});

export const fetchAuditLogsFailure = (payload: any) => ({
	type: auditActionTypes.FETCH_AUDIT_LOGS_FAILURE,
	payload,
});

export const fetchAuditLogsResponseResetStart = () => ({
	type: auditActionTypes.FETCH_AUDIT_LOGS_RESPONSE_RESET_START,
});

export const fetchAuditLogsResponseChanged = () => ({
	type: auditActionTypes.FETCH_AUDIT_LOGS_RESPONSE_CHANGED,
});
