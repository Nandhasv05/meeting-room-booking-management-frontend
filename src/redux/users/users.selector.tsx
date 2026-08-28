// Version : 0.0.1
// Author : NANDHAKUMAR S V
// Date : 27/08/2026
// Description : users selectors

import { createSelector } from 'reselect';

const selectSlice = (state: any) => state.users;

export const selectUsersPage = createSelector([selectSlice], (slice) => slice.usersPage);
export const selectUsersLoading = createSelector([selectSlice], (slice) => slice.usersLoading);
export const selectSearchResults = createSelector([selectSlice], (slice) => slice.searchResults);
export const selectSearchLoading = createSelector([selectSlice], (slice) => slice.searchLoading);
export const selectCreateUserResponse = createSelector([selectSlice], (slice) => slice.createUserResponse);
export const selectCreateUserLoading = createSelector([selectSlice], (slice) => slice.createUserLoading);
