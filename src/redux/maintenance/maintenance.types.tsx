// Version : 0.0.1
// Author : NANDHAKUMAR S V
// Date : 27/08/2026
// Description : maintenance action types

const maintenanceActionTypes = {
	/******* FETCH MAINTENANCE START *******/
	FETCH_MAINTENANCE_START: 'fetch_maintenance_start',
	FETCH_MAINTENANCE_SUCCESS: 'fetch_maintenance_success',
	FETCH_MAINTENANCE_FAILURE: 'fetch_maintenance_failure',
	FETCH_MAINTENANCE_RESPONSE_RESET_START: 'fetch_maintenance_response_reset_start',
	FETCH_MAINTENANCE_RESPONSE_CHANGED: 'fetch_maintenance_response_changed',
   /******* FETCH MAINTENANCE END *******/

   /******* CREATE MAINTENANCE START *******/
	CREATE_MAINTENANCE_START: 'create_maintenance_start',
	CREATE_MAINTENANCE_SUCCESS: 'create_maintenance_success',
	CREATE_MAINTENANCE_FAILURE: 'create_maintenance_failure',
	CREATE_MAINTENANCE_RESPONSE_RESET_START: 'create_maintenance_response_reset_start',
	CREATE_MAINTENANCE_RESPONSE_CHANGED: 'create_maintenance_response_changed',
   /******* CREATE MAINTENANCE END *******/
};
export default maintenanceActionTypes;