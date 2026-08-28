// Version : 0.0.1
// Author : NANDHAKUMAR S V
// Date : 27/08/2026
// Description : audit action types

const auditActionTypes = {
	/******* FETCH AUDIT LOGS START *******/
	FETCH_AUDIT_LOGS_START: 'fetch_audit_logs_start',
	FETCH_AUDIT_LOGS_SUCCESS: 'fetch_audit_logs_success',
	FETCH_AUDIT_LOGS_FAILURE: 'fetch_audit_logs_failure',
	FETCH_AUDIT_LOGS_RESPONSE_RESET_START: 'fetch_audit_logs_response_reset_start',
	FETCH_AUDIT_LOGS_RESPONSE_CHANGED: 'fetch_audit_logs_response_changed',
	/******* FETCH AUDIT LOGS RESPONSE RESET END *******/
};
export default auditActionTypes;