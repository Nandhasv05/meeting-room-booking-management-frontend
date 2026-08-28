// Version : 0.0.1
// Author : NANDHAKUMAR S V
// Date : 27/08/2026
// Description : roles selectors

import { createSelector } from 'reselect';

const selectSlice = (state: any) => state.roles;

export const selectRoles = createSelector([selectSlice], (slice) => slice.roles);
export const selectRolesLoading = createSelector([selectSlice], (slice) => slice.rolesLoading);
export const selectPermissions = createSelector([selectSlice], (slice) => slice.permissions);
export const selectPermissionsLoading = createSelector([selectSlice], (slice) => slice.permissionsLoading);
export const selectRoleDetail = createSelector([selectSlice], (slice) => slice.roleDetail);
export const selectRoleDetailLoading = createSelector([selectSlice], (slice) => slice.roleDetailLoading);
export const selectSaveRoleResponse = createSelector([selectSlice], (slice) => slice.saveRoleResponse);
export const selectSaveRoleLoading = createSelector([selectSlice], (slice) => slice.saveRoleLoading);
