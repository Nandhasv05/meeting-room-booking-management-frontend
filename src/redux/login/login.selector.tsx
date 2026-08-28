// Version : 0.0.1
// Author : NANDHAKUMAR S V
// Date : 27/08/2026
// Description : Login selectors
import { createSelector } from 'reselect';

const selectLogin = (state: any) => state.auth;

/******* SELECT CURRENT USER *******/
export const selectCurrentUser = createSelector([selectLogin], (login) => login?.user ?? null);
/******* SELECT ACCESS TOKEN *******/
export const selectAccessToken = createSelector([selectLogin], (login) => login?.accessToken ?? null);
/******* SELECT REFRESH TOKEN *******/
export const selectRefreshToken = createSelector([selectLogin], (login) => login?.refreshToken ?? null);
/******* SELECT LOGIN RESPONSE *******/
export const selectLoginResponse = createSelector([selectLogin], (login) => login?.loginResponse ?? null);
/******* SELECT LOGIN LOADING *******/
export const selectLoginLoading = createSelector([selectLogin], (login) => Boolean(login?.loginLoading));
/******* SELECT IS AUTHENTICATED *******/
export const selectIsAuthenticated = createSelector([selectLogin], (login) => Boolean(login?.accessToken));
