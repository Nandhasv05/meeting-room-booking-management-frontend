// Version : 0.0.1
// Author : NANDHAKUMAR S V
// Date : 27/08/2026
// Description : reports sagas
import { takeLatest, put, all, call } from 'redux-saga/effects';
import reportsActionTypes from './reports.types';
import {
	fetchReportCall,
} from './reports.services';
import {
	fetchReportSuccess,
	fetchReportFailure,
	fetchReportResponseChanged,
} from './reports.action';
import { invokeApi } from '../_common/saga.utils';

/******* FETCH REPORT DETAILS *******/
function* fetchReportDetails({ payload }: any) {
	yield* invokeApi(fetchReportCall, payload, fetchReportSuccess, fetchReportFailure);
}

function* fetchReportReset() {
	yield put(fetchReportResponseChanged());
}

function* onFetchReportStart() {
	yield takeLatest(reportsActionTypes.FETCH_REPORT_START, fetchReportDetails);
}

function* onFetchReportReset() {
	yield takeLatest(reportsActionTypes.FETCH_REPORT_RESPONSE_RESET_START, fetchReportReset);
}

/******* REPORTS SAGA *******/
export function* reportsSaga() {
	yield all([call(onFetchReportStart), call(onFetchReportReset)]);
}
