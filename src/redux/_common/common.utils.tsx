// Version : 0.0.1
// Author : NANDHAKUMAR S V
// Date : 27/08/2026
// Description : Shared helpers for Redux services and encrypted API envelopes

import { decryptData, isDecryptFailure } from './enode-decode';
import { store } from '../../store';

export const getTokenFromRedux = () => {
	const state = store.getState() as { auth?: { accessToken?: string | null } };
	return state.auth?.accessToken || null;
};

export const docodeHexResponse = (response: any, key: string) => {
	try {
		if (!response || !response.response) {
			console.error('docodeHexResponse: Invalid response object');
			return null;
		}
		const docodeVal = decryptData(response.response, key);
		return docodeVal?.data || null;
	} catch (error) {
		console.error('docodeHexResponse: Error decoding response', error);
		return null;
	}
};

export const decodeApiResponse = (jsonData: any, key: string) => {
	try {
		if (!jsonData) {
			console.error('decodeApiResponse: Invalid jsonData input');
			return null;
		}
		const decodedData = decryptData(jsonData, key);
		return decodedData?.response || null;
	} catch (error) {
		console.error('decodeApiResponse: Error decoding API response', error);
		return null;
	}
};

export { isDecryptFailure };
