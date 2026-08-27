// Version : 0.0.1
// Author : NANDHAKUMAR S V
// Date : 27/08/2026
// Description : settings API services

import { makeApiCall } from '../_common/api.utils';

export const fetchSettingsCall = (payload?: any) => {
	return makeApiCall('/settings', payload);
};

export const saveSettingsCall = (payload?: any) => {
	return makeApiCall('/settings/update', payload);
};

export const testMailCall = (payload?: any) => {
	return makeApiCall('/settings/test-mail', payload);
};
