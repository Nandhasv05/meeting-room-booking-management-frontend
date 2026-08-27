// Version : 0.0.1
// Author : NANDHAKUMAR S V
// Date : 27/08/2026
// Description : settings action types

const settingsActionTypes = {
	FETCH_SETTINGS_START: 'fetch_settings_start',
	FETCH_SETTINGS_SUCCESS: 'fetch_settings_success',
	FETCH_SETTINGS_FAILURE: 'fetch_settings_failure',
	FETCH_SETTINGS_RESPONSE_RESET_START: 'fetch_settings_response_reset_start',
	FETCH_SETTINGS_RESPONSE_CHANGED: 'fetch_settings_response_changed',

	SAVE_SETTINGS_START: 'save_settings_start',
	SAVE_SETTINGS_SUCCESS: 'save_settings_success',
	SAVE_SETTINGS_FAILURE: 'save_settings_failure',
	SAVE_SETTINGS_RESPONSE_RESET_START: 'save_settings_response_reset_start',
	SAVE_SETTINGS_RESPONSE_CHANGED: 'save_settings_response_changed',

	TEST_MAIL_START: 'test_mail_start',
	TEST_MAIL_SUCCESS: 'test_mail_success',
	TEST_MAIL_FAILURE: 'test_mail_failure',
	TEST_MAIL_RESPONSE_RESET_START: 'test_mail_response_reset_start',
	TEST_MAIL_RESPONSE_CHANGED: 'test_mail_response_changed',

};
export default settingsActionTypes;