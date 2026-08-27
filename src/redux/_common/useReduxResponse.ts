// Version : 0.0.1
// Author : NANDHAKUMAR S V
// Date : 27/08/2026
// Description : Watch a saga response once, then toast / reset

import { useEffect, useRef } from 'react';
import toast from 'react-hot-toast';

type Envelope = { success?: boolean; message?: string } | null;

export function useReduxResponse(
	response: Envelope,
	reset: () => void,
	onSuccess?: (response: NonNullable<Envelope>) => void,
) {
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
