import { type FormEvent, useCallback, useState } from 'react';

import { ServerError, TEXTS } from '../constants';

import { Toast } from '../Toasts';
import { ESwalIcon } from '../Types/Swal';

interface IServerResult {
    messageCode?: string;
    message?: string;
}

interface IUseAuthFormOptions<T> {
    submit: (values: T) => Promise<IServerResult | undefined | unknown>;
    successCode: string;
    successText: string;
    onSuccess: () => void;
}

export default function useAuthForm<T extends Record<string, unknown>>({
    submit,
    successCode,
    successText,
    onSuccess,
}: IUseAuthFormOptions<T>) {
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = useCallback(
        async (e: FormEvent, values: T, isValid: boolean) => {
            e.preventDefault();
            if (!isValid) return;
            setIsLoading(true);
            try {
                const result = (await submit(values)) as IServerResult | undefined;
                if (result?.messageCode === successCode) {
                    Toast({ title: successText, typeIcon: ESwalIcon.SUCCESS });
                    onSuccess();
                } else {
                    Toast({
                        title: result?.message ?? TEXTS.TOAST_GENERIC_ERROR,
                        typeIcon: ESwalIcon.ERROR,
                    });
                }
            } finally {
                setIsLoading(false);
            }
        },
        [submit, successCode, successText, onSuccess],
    );

    return { isLoading, handleSubmit };
}

export { ServerError };
