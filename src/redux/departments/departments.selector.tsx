// Version : 0.0.1
// Author : NANDHAKUMAR S V
// Date : 27/08/2026
// Description : departments selectors

import { createSelector } from 'reselect';

const selectSlice = (state: any) => state.departments;

export const selectDepartments = createSelector([selectSlice], (slice) => slice.departments);
export const selectDepartmentsLoading = createSelector([selectSlice], (slice) => slice.departmentsLoading);
export const selectCreateDepartmentResponse = createSelector([selectSlice], (slice) => slice.createDepartmentResponse);
export const selectCreateDepartmentLoading = createSelector([selectSlice], (slice) => slice.createDepartmentLoading);
