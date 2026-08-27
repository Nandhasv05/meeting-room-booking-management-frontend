// Version : 0.0.1
// Author : NANDHAKUMAR S V
// Date : 27/08/2026
// Description : Session-expiry alert bridge for Redux API calls

let showAlertFunction: ((show: boolean) => void) | null = null;

export const setShowAlertFunction = (showAlertFn: (show: boolean) => void) => {
	showAlertFunction = showAlertFn;
};

export const showTokenValidationAlert = () => {
	if (showAlertFunction) {
		showAlertFunction(false);
		setTimeout(() => showAlertFunction!(true), 10);
	}
};

export const hideAlert = () => {
	if (showAlertFunction) {
		showAlertFunction(false);
	}
};

const AlertManager = {
	setShowAlertFunction,
	showTokenValidationAlert,
	hideAlert,
	showAlert: (message: string) => {
		console.log('Alert:', message);
	},
};

export default AlertManager;
