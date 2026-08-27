// Version : 0.0.1
// Author : NANDHAKUMAR S V
// Date : 27/08/2026
// Description : settings selectors

import { createSelector } from 'reselect';

const selectSlice = (state: any) => state.settings;

export const selectSettings = createSelector([selectSlice], (slice) => slice.settings);
export const selectSettingsLoading = createSelector([selectSlice], (slice) => slice.settingsLoading);
export const selectSaveSettingsResponse = createSelector([selectSlice], (slice) => slice.saveSettingsResponse);
export const selectSaveSettingsLoading = createSelector([selectSlice], (slice) => slice.saveSettingsLoading);
export const selectTestMailResponse = createSelector([selectSlice], (slice) => slice.testMailResponse);
export const selectTestMailLoading = createSelector([selectSlice], (slice) => slice.testMailLoading);
