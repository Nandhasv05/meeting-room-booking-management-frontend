// AUTHOR : NANDHAKUMAR S V
// DATE : 28/08/2026
// Description : Shared saga helper for envelope API responses

import { call, put } from 'redux-saga/effects';
import { apiError } from '../../services/api';

/******* FAIL BODY *******/
export function failBody(error: unknown) {
	return { success: false, message: apiError(error), data: null };
}

/******* INVOKE API *******/
export function* invokeApi(apiFn: (...args: any[]) => any, args: any, success: any, failure: any): Generator {
	try {
		const response: any = yield call(apiFn, args);
		const body = response?.data;
		if (!body?.success) {
			yield put(failure(body ?? failBody(new Error('Request failed'))));
		} else {
			yield put(success(body));
		}
	} catch (error) {
		yield put(failure(failBody(error)));
	}
}
