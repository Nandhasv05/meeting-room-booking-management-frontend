// Version : 0.0.1
// Author : NANDHAKUMAR S V
// Date : 27/08/2026
// Description : Login selectors
import { createSelector } from 'reselect';

const selectUser = (state: any) => state.login;

export const selectCurrentUser = createSelector([selectUser], (login) => login.user);
export const selectAccessToken = createSelector([selectUser], (login) => login.accessToken);

export const selectRefreshToken = createSelector([selectUser], (login) => login.refreshToken);

export const selectLoginResponse = createSelector([selectUser], (login) => login.loginResponse);

export const selectLoginLoading = createSelector([selectUser], (login) => login.loginLoading);

export const selectIsAuthenticated = createSelector([selectUser], (login) => Boolean(login.accessToken));
