// AUTHOR : NANDHAKUMAR S V
// DATE : 28/08/2026
// Description : Watch a saga response once, then toast / reset

import { useEffect, useRef } from 'react';
import toast from 'react-hot-toast';

type Envelope = { success?: boolean; message?: string } | null;

/******* USE REDUX RESPONSE *******/
export function useReduxResponse(
	response: Envelope,
	reset: () => void,
	onSuccess?: (response: NonNullable<Envelope>) => void,
) {
	/******* ON SUCCESS REF *******/
	const onSuccessRef = useRef(onSuccess);
	onSuccessRef.current = onSuccess;

	useEffect(() => {
		if (!response) return;
		if (response.success) {
			onSuccessRef.current?.(response);
		} else {
			toast.error(response.message || 'Request failed');
		}
		reset();
	}, [response, reset]);
}
