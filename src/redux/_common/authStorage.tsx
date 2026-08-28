// AUTHOR : NANDHAKUMAR S V
// DATE : 28/08/2026
// Description : Persist login session in localStorage (no store import)

export const AUTH_STORAGE_KEY = 'chb.auth';

/******* PERSIST AUTH *******/
export const persistAuth = (session: {
	user: unknown;
	accessToken: string | null;
	refreshToken: string | null;
}) => {
	localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
};

/******* LOAD AUTH *******/
export const loadAuth = () => {
	try {
		const stored = localStorage.getItem(AUTH_STORAGE_KEY);
		if (stored) return JSON.parse(stored);
	} catch {
		/* ignore corrupt storage */
	}
	return { user: null, accessToken: null, refreshToken: null };
};

/******* CLEAR AUTH STORAGE *******/
export const clearAuthStorage = () => {
	localStorage.removeItem(AUTH_STORAGE_KEY);
};
