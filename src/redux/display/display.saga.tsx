// Version : 0.0.1
// Author : NANDHAKUMAR S V
// Date : 27/08/2026
// Description : display sagas

import { takeLatest, put, all, call } from 'redux-saga/effects';
import displayActionTypes from './display.types';
import { fetchDisplayCall, fetchHallsForWallCall } from './display.services';
import {
	fetchDisplaySuccess,
	fetchDisplayFailure,
	fetchDisplayResponseChanged,
	fetchDisplayWallSuccess,
	fetchDisplayWallFailure,
	fetchDisplayWallResponseChanged,
} from './display.action';
import { invokeApi } from '../_common/saga.utils';

function* fetchDisplayDetails({ payload }: any) {
	yield* invokeApi(fetchDisplayCall, payload, fetchDisplaySuccess, fetchDisplayFailure);
}

function* fetchDisplayReset() {
	yield put(fetchDisplayResponseChanged());
}

function* onFetchDisplayStart() {
	yield takeLatest(displayActionTypes.FETCH_DISPLAY_START, fetchDisplayDetails);
}

function* onFetchDisplayReset() {
	yield takeLatest(displayActionTypes.FETCH_DISPLAY_RESPONSE_RESET_START, fetchDisplayReset);
}

function* fetchDisplayWallDetails({ payload }: any) {
	try {
		const hallsRes: any = yield call(fetchHallsForWallCall, { active: 'true', ...(payload || {}) });
		const halls = hallsRes?.data?.data ?? [];
		const boards: any[] = [];
		for (const hall of halls) {
			const boardRes: any = yield call(fetchDisplayCall, { hallCode: hall.Code });
			boards.push({ hall, board: boardRes?.data?.data });
		}
		yield put(fetchDisplayWallSuccess({ success: true, data: boards }));
	} catch (error) {
		yield put(fetchDisplayWallFailure({ success: false, message: String(error), data: [] }));
	}
}

function* fetchDisplayWallReset() {
	yield put(fetchDisplayWallResponseChanged());
}

function* onFetchDisplayWallStart() {
	yield takeLatest(displayActionTypes.FETCH_DISPLAY_WALL_START, fetchDisplayWallDetails);
}

function* onFetchDisplayWallReset() {
	yield takeLatest(displayActionTypes.FETCH_DISPLAY_WALL_RESPONSE_RESET_START, fetchDisplayWallReset);
}

export function* displaySaga() {
	yield all([call(onFetchDisplayStart), call(onFetchDisplayReset), call(onFetchDisplayWallStart), call(onFetchDisplayWallReset)]);
}
