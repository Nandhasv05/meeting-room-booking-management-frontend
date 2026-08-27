// Version : 0.0.1
// Author : NANDHAKUMAR S V
// Date : 27/08/2026
// Description : audit selectors

import { createSelector } from 'reselect';

const selectSlice = (state: any) => state.audit;

export const selectAuditPage = createSelector([selectSlice], (slice) => slice.auditPage);
export const selectAuditLoading = createSelector([selectSlice], (slice) => slice.auditLoading);
