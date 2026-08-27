// Version : 0.0.1
// Author : NANDHAKUMAR S V
// Date : 27/08/2026
// Description : settings action functions

import settingsActionTypes from './settings.types';

export const fetchSettingsStart = (payload?: any) => ({
	type: settingsActionTypes.FETCH_SETTINGS_START,
	payload,
});

export const fetchSettingsSuccess = (payload: any) => ({
	type: settingsActionTypes.FETCH_SETTINGS_SUCCESS,
	payload,
});

export const fetchSettingsFailure = (payload: any) => ({
	type: settingsActionTypes.FETCH_SETTINGS_FAILURE,
	payload,
});

export const fetchSettingsResponseResetStart = () => ({
	type: settingsActionTypes.FETCH_SETTINGS_RESPONSE_RESET_START,
});

export const fetchSettingsResponseChanged = () => ({
	type: settingsActionTypes.FETCH_SETTINGS_RESPONSE_CHANGED,
});

export const saveSettingsStart = (payload?: any) => ({
	type: settingsActionTypes.SAVE_SETTINGS_START,
	payload,
});

export const saveSettingsSuccess = (payload: any) => ({
	type: settingsActionTypes.SAVE_SETTINGS_SUCCESS,
	payload,
});

export const saveSettingsFailure = (payload: any) => ({
	type: settingsActionTypes.SAVE_SETTINGS_FAILURE,
	payload,
});

export const saveSettingsResponseResetStart = () => ({
	type: settingsActionTypes.SAVE_SETTINGS_RESPONSE_RESET_START,
});

export const saveSettingsResponseChanged = () => ({
	type: settingsActionTypes.SAVE_SETTINGS_RESPONSE_CHANGED,
});

export const testMailStart = (payload?: any) => ({
	type: settingsActionTypes.TEST_MAIL_START,
	payload,
});

export const testMailSuccess = (payload: any) => ({
	type: settingsActionTypes.TEST_MAIL_SUCCESS,
	payload,
});

export const testMailFailure = (payload: any) => ({
	type: settingsActionTypes.TEST_MAIL_FAILURE,
	payload,
});

export const testMailResponseResetStart = () => ({
	type: settingsActionTypes.TEST_MAIL_RESPONSE_RESET_START,
});

export const testMailResponseChanged = () => ({
	type: settingsActionTypes.TEST_MAIL_RESPONSE_CHANGED,
});
