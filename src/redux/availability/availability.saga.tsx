// Version : 0.0.1
// Author : NANDHAKUMAR S V
// Date : 27/08/2026
// Description : availability sagas

import { takeLatest, put, all, call } from 'redux-saga/effects';
import availabilityActionTypes from './availability.types';
import {
	checkAvailabilityCall,
} from './availability.services';
import {
	checkAvailabilitySuccess,
	checkAvailabilityFailure,
	checkAvailabilityResponseChanged,
} from './availability.action';
import { invokeApi } from '../_common/saga.utils';

function* checkAvailabilityDetails({ payload }: any) {
	yield* invokeApi(checkAvailabilityCall, payload, checkAvailabilitySuccess, checkAvailabilityFailure);
}

function* checkAvailabilityReset() {
	yield put(checkAvailabilityResponseChanged());
}

function* onCheckAvailabilityStart() {
	yield takeLatest(availabilityActionTypes.CHECK_AVAILABILITY_START, checkAvailabilityDetails);
}

function* onCheckAvailabilityReset() {
	yield takeLatest(availabilityActionTypes.CHECK_AVAILABILITY_RESPONSE_RESET_START, checkAvailabilityReset);
}

export function* availabilitySaga() {
	yield all([call(onCheckAvailabilityStart), call(onCheckAvailabilityReset)]);
}
