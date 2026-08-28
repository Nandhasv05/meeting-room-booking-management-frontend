// Version : 0.0.1
// Author : NANDHAKUMAR S V
// Date : 27/08/2026
// Description : dashboard sagas

import { takeLatest, put, all, call } from 'redux-saga/effects';
import dashboardActionTypes from './dashboard.types';
import {
	fetchDashboardCall,
} from './dashboard.services';
import {
	fetchDashboardSuccess,
	fetchDashboardFailure,
	fetchDashboardResponseChanged,
} from './dashboard.action';
import { invokeApi } from '../_common/saga.utils';

/******* FETCH DASHBOARD DETAILS START *******/
function* fetchDashboardDetails({ payload }: any) {
	yield* invokeApi(fetchDashboardCall, payload, fetchDashboardSuccess, fetchDashboardFailure);
}

function* fetchDashboardReset() {
	yield put(fetchDashboardResponseChanged());
}

function* onFetchDashboardStart() {
	yield takeLatest(dashboardActionTypes.FETCH_DASHBOARD_START, fetchDashboardDetails);
}

function* onFetchDashboardReset() {
	yield takeLatest(dashboardActionTypes.FETCH_DASHBOARD_RESPONSE_RESET_START, fetchDashboardReset);
}

/******* DASHBOARD SAGA *******/
export function* dashboardSaga() {
	yield all([call(onFetchDashboardStart), call(onFetchDashboardReset)]);
}
