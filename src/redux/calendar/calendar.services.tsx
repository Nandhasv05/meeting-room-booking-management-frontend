// Version : 0.0.1
// Author : NANDHAKUMAR S V
// Date : 27/08/2026
// Description : calendar API services

import { makeApiCall } from '../_common/api.utils';

export const fetchCalendarCall = (payload?: any) => {
	return makeApiCall('/calendar', payload);
};
