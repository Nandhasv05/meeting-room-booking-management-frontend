// Version : 0.0.1
// Author : NANDHAKUMAR S V
// Date : 27/08/2026
// Description : roles API services

import { makeApiCall } from '../_common/api.utils';

export const fetchRolesCall = (payload?: any) => {
	return makeApiCall('/roles', payload);
};

export const fetchPermissionsCall = (payload?: any) => {
	return makeApiCall('/permissions', payload);
};

export const fetchRoleDetailCall = (payload?: any) => {
	const { id, ...params } = payload || {};
	return makeApiCall(`/roles/${id}`, params);
};

export const saveRolePermissionsCall = (payload?: any) => {
	return makeApiCall(`/roles/${payload.id}/permissions`, { permissionIds: payload.permissionIds });
};
