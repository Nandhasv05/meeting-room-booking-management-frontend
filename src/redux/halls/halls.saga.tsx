// Version : 0.0.1
// Author : NANDHAKUMAR S V
// Date : 27/08/2026
// Description : halls sagas

import { takeLatest, put, all, call } from 'redux-saga/effects';
import hallsActionTypes from './halls.types';
import {
	fetchHallsCall,
	fetchHallCall,
	fetchFacilitiesCall,
	createFacilityCall,
	saveHallCall,
	fetchHallAvailabilityCall,
} from './halls.services';
import {
	fetchHallsSuccess,
	fetchHallsFailure,
	fetchHallsResponseChanged,
	fetchHallSuccess,
	fetchHallFailure,
	fetchHallResponseChanged,
	saveHallSuccess,
	saveHallFailure,
	saveHallResponseChanged,
	fetchFacilitiesSuccess,
	fetchFacilitiesFailure,
	fetchFacilitiesResponseChanged,
	createFacilitySuccess,
	createFacilityFailure,
	createFacilityResponseChanged,
	fetchHallAvailabilitySuccess,
	fetchHallAvailabilityFailure,
	fetchHallAvailabilityResponseChanged,
} from './halls.action';
import { invokeApi } from '../_common/saga.utils';

function* fetchHallsDetails({ payload }: any) {
	yield* invokeApi(fetchHallsCall, payload, fetchHallsSuccess, fetchHallsFailure);
}

function* fetchHallsReset() {
	yield put(fetchHallsResponseChanged());
}

function* onFetchHallsStart() {
	yield takeLatest(hallsActionTypes.FETCH_HALLS_START, fetchHallsDetails);
}

function* onFetchHallsReset() {
	yield takeLatest(hallsActionTypes.FETCH_HALLS_RESPONSE_RESET_START, fetchHallsReset);
}

function* fetchHallDetails({ payload }: any) {
	yield* invokeApi(fetchHallCall, payload, fetchHallSuccess, fetchHallFailure);
}

function* fetchHallReset() {
	yield put(fetchHallResponseChanged());
}

function* onFetchHallStart() {
	yield takeLatest(hallsActionTypes.FETCH_HALL_START, fetchHallDetails);
}

function* onFetchHallReset() {
	yield takeLatest(hallsActionTypes.FETCH_HALL_RESPONSE_RESET_START, fetchHallReset);
}

function* saveHallDetails({ payload }: any) {
	yield* invokeApi(saveHallCall, payload, saveHallSuccess, saveHallFailure);
}

function* saveHallReset() {
	yield put(saveHallResponseChanged());
}

function* onSaveHallStart() {
	yield takeLatest(hallsActionTypes.SAVE_HALL_START, saveHallDetails);
}

function* onSaveHallReset() {
	yield takeLatest(hallsActionTypes.SAVE_HALL_RESPONSE_RESET_START, saveHallReset);
}

function* fetchFacilitiesDetails({ payload }: any) {
	yield* invokeApi(fetchFacilitiesCall, payload, fetchFacilitiesSuccess, fetchFacilitiesFailure);
}

function* fetchFacilitiesReset() {
	yield put(fetchFacilitiesResponseChanged());
}

function* onFetchFacilitiesStart() {
	yield takeLatest(hallsActionTypes.FETCH_FACILITIES_START, fetchFacilitiesDetails);
}

function* onFetchFacilitiesReset() {
	yield takeLatest(hallsActionTypes.FETCH_FACILITIES_RESPONSE_RESET_START, fetchFacilitiesReset);
}

function* createFacilityDetails({ payload }: any) {
	yield* invokeApi(createFacilityCall, payload, createFacilitySuccess, createFacilityFailure);
}

function* createFacilityReset() {
	yield put(createFacilityResponseChanged());
}

function* onCreateFacilityStart() {
	yield takeLatest(hallsActionTypes.CREATE_FACILITY_START, createFacilityDetails);
}

function* onCreateFacilityReset() {
	yield takeLatest(hallsActionTypes.CREATE_FACILITY_RESPONSE_RESET_START, createFacilityReset);
}

function* fetchHallAvailabilityDetails({ payload }: any) {
	yield* invokeApi(fetchHallAvailabilityCall, payload, fetchHallAvailabilitySuccess, fetchHallAvailabilityFailure);
}

function* fetchHallAvailabilityReset() {
	yield put(fetchHallAvailabilityResponseChanged());
}

function* onFetchHallAvailabilityStart() {
	yield takeLatest(hallsActionTypes.FETCH_HALL_AVAILABILITY_START, fetchHallAvailabilityDetails);
}

function* onFetchHallAvailabilityReset() {
	yield takeLatest(hallsActionTypes.FETCH_HALL_AVAILABILITY_RESPONSE_RESET_START, fetchHallAvailabilityReset);
}

export function* hallsSaga() {
	yield all([
		call(onFetchHallsStart),
		call(onFetchHallsReset),
		call(onFetchHallStart),
		call(onFetchHallReset),
		call(onSaveHallStart),
		call(onSaveHallReset),
		call(onFetchFacilitiesStart),
		call(onFetchFacilitiesReset),
		call(onCreateFacilityStart),
		call(onCreateFacilityReset),
		call(onFetchHallAvailabilityStart),
		call(onFetchHallAvailabilityReset),
	]);
}
