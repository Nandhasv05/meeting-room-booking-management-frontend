// AUTHOR : NANDHAKUMAR S V
// Author : NANDHAKUMAR S V
// Date : 28/08/2026
// Description : Session-expiry alert bridge for Redux API calls

let showAlertFunction: ((show: boolean) => void) | null = null;

/******* SHOW ALERT FUNCTION *******/
export const setShowAlertFunction = (showAlertFn: (show: boolean) => void) => {
	showAlertFunction = showAlertFn;
};

/******* SHOW TOKEN VALIDATION ALERT *******/
export const showTokenValidationAlert = () => {
	if (showAlertFunction) {
		showAlertFunction(false);
		setTimeout(() => showAlertFunction!(true), 10);
	}
};

/******* HIDE ALERT *******/
export const hideAlert = () => {
	if (showAlertFunction) {
		showAlertFunction(false);
	}
};

/******* ALERT MANAGER *******/
const AlertManager = {
	setShowAlertFunction,
	showTokenValidationAlert,
	hideAlert,
	showAlert: (message: string) => {
		console.log('Alert:', message);
	},
};

export default AlertManager;
