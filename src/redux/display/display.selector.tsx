// Version : 0.0.1
// Author : NANDHAKUMAR S V
// Date : 27/08/2026
// Description : display selectors

import { createSelector } from 'reselect';

const selectSlice = (state: any) => state.display;

export const selectBoard = createSelector([selectSlice], (slice) => slice.board);
export const selectDisplayLoading = createSelector([selectSlice], (slice) => slice.displayLoading);
export const selectWall = createSelector([selectSlice], (slice) => slice.wall);
export const selectWallLoading = createSelector([selectSlice], (slice) => slice.wallLoading);
