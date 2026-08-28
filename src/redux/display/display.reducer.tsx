// Version : 0.0.1
// Author : NANDHAKUMAR S V
// Date : 27/08/2026
// Description : display reducer

import displayActionTypes from './display.types';

const INITIAL_STATE: any = {
	'board': null,
	'displayLoading': false,
	'wall': [],
	'wallLoading': false
};

const displayReducer = (state = INITIAL_STATE, action: any) => {
	switch (action.type) {
		case displayActionTypes.FETCH_DISPLAY_START:
			return {
				...state,
				displayLoading: true,
			};
		case displayActionTypes.FETCH_DISPLAY_SUCCESS:
			return {
				...state,
				displayLoading: false,
				board: action.payload?.data ?? null,
			};
		case displayActionTypes.FETCH_DISPLAY_FAILURE:
			return {
				...state,
				displayLoading: false,
			};
		case displayActionTypes.FETCH_DISPLAY_RESPONSE_CHANGED:
			return {
				...state,
			};
		case displayActionTypes.FETCH_DISPLAY_WALL_START:
			return {
				...state,
				wallLoading: true,
			};
		case displayActionTypes.FETCH_DISPLAY_WALL_SUCCESS:
			return {
				...state,
				wallLoading: false,
				wall: action.payload?.data ?? [],
			};
		case displayActionTypes.FETCH_DISPLAY_WALL_FAILURE:
			return {
				...state,
				wallLoading: false,
				wall: [],
			};
		case displayActionTypes.FETCH_DISPLAY_WALL_RESPONSE_CHANGED:
			return {
				...state,
			};
		default:
			return state;
	}
};

export default displayReducer;