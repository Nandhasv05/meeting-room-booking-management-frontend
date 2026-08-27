// Version : 0.0.1
// Author : NANDHAKUMAR S V
// Date : 27/08/2026
// Description : audit sagas

import { takeLatest, put, all, call } from 'redux-saga/effects';
import auditActionTypes from './audit.types';
import {
	fetchAuditLogsCall,
} from './audit.services';
import {
	fetchAuditLogsSuccess,
	fetchAuditLogsFailure,
	fetchAuditLogsResponseChanged,
} from './audit.action';
import { invokeApi } from '../_common/saga.utils';

function* fetchAuditLogsDetails({ payload }: any) {
	yield* invokeApi(fetchAuditLogsCall, payload, fetchAuditLogsSuccess, fetchAuditLogsFailure);
}

function* fetchAuditLogsReset() {
	yield put(fetchAuditLogsResponseChanged());
}

function* onFetchAuditLogsStart() {
	yield takeLatest(auditActionTypes.FETCH_AUDIT_LOGS_START, fetchAuditLogsDetails);
}

function* onFetchAuditLogsReset() {
	yield takeLatest(auditActionTypes.FETCH_AUDIT_LOGS_RESPONSE_RESET_START, fetchAuditLogsReset);
}

export function* auditSaga() {
	yield all([call(onFetchAuditLogsStart), call(onFetchAuditLogsReset)]);
}
