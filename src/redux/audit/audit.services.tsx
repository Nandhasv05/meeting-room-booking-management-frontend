// Version : 0.0.1
// Author : NANDHAKUMAR S V
// Date : 27/08/2026
// Description : audit API services
import { makeApiCall } from '../_common/api.utils';

/******* FETCH AUDIT LOGS CALL *******/
export const fetchAuditLogsCall = (payload?: any) => {
	return makeApiCall('/audit-logs', payload);
};
