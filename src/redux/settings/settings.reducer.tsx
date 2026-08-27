// Version : 0.0.1
// Author : NANDHAKUMAR S V
// Date : 27/08/2026
// Description : settings reducer

import settingsActionTypes from './settings.types';

const INITIAL_STATE: any = {
	'settings': [],
	'settingsLoading': false,
	'saveSettingsResponse': null,
	'saveSettingsLoading': false,
	'testMailResponse': null,
	'testMailLoading': false
};

const settingsReducer = (state = INITIAL_STATE, action: any) => {
	switch (action.type) {
		case settingsActionTypes.FETCH_SETTINGS_START:
			return {
				...state,
				settingsLoading: true,
			};
		case settingsActionTypes.FETCH_SETTINGS_SUCCESS:
			return {
				...state,
				settingsLoading: false,
				settings: action.payload?.data ?? [],
			};
		case settingsActionTypes.FETCH_SETTINGS_FAILURE:
			return {
				...state,
				settingsLoading: false,
				settings: [],
			};
		case settingsActionTypes.FETCH_SETTINGS_RESPONSE_CHANGED:
			return {
				...state,
			};
		case settingsActionTypes.SAVE_SETTINGS_START:
			return {
				...state,
				saveSettingsLoading: true,
			};
		case settingsActionTypes.SAVE_SETTINGS_SUCCESS:
			return {
				...state,
				saveSettingsLoading: false,
				saveSettingsResponse: action.payload,
			};
		case settingsActionTypes.SAVE_SETTINGS_FAILURE:
			return {
				...state,
				saveSettingsLoading: false,
				saveSettingsResponse: action.payload,
			};
		case settingsActionTypes.SAVE_SETTINGS_RESPONSE_CHANGED:
			return {
				...state,
				saveSettingsResponse: null,
			};
		case settingsActionTypes.TEST_MAIL_START:
			return {
				...state,
				testMailLoading: true,
			};
		case settingsActionTypes.TEST_MAIL_SUCCESS:
			return {
				...state,
				testMailLoading: false,
				testMailResponse: action.payload,
			};
		case settingsActionTypes.TEST_MAIL_FAILURE:
			return {
				...state,
				testMailLoading: false,
				testMailResponse: action.payload,
			};
		case settingsActionTypes.TEST_MAIL_RESPONSE_CHANGED:
			return {
				...state,
				testMailResponse: null,
			};
		default:
			return state;
	}
};

export default settingsReducer;