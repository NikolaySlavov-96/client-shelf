import { type FC, memo, useEffect, useState } from 'react';

import { Button } from '~/component/atoms';

import { StatusCard } from '~/component/molecules';

type TVerifyState = 'verifying' | 'success' | 'error';

interface IVerifyStatusScreenProps {
    token: string | undefined;
    verify: (token: string) => Promise<{ ok: boolean; message?: string } | void>;
    titles: {
        verifying: string;
        success: string;
        error: string;
    };
    actionLabel: string;
    onAction: (state: Exclude<TVerifyState, 'verifying'>) => void;
    onSuccess?: () => void;
    onError?: (message?: string) => void;
}

const VerifyStatusScreen: FC<IVerifyStatusScreenProps> = ({
    token,
    verify,
    titles,
    actionLabel,
    onAction,
    onSuccess,
    onError,
}) => {
    const [state, setState] = useState<TVerifyState>('verifying');

    useEffect(() => {
        if (!token) {
            setState('error');
            onError?.();
            return;
        }
        (async () => {
            try {
                const result = await verify(token);
                const ok = result === undefined ? true : result.ok;
                if (ok) {
                    setState('success');
                    onSuccess?.();
                } else {
                    setState('error');
                    onError?.(result && 'message' in result ? result.message : undefined);
                }
            } catch {
                setState('error');
                onError?.();
            }
        })();
    }, [token, verify, onSuccess, onError]);

    const title = state === 'verifying' ? titles.verifying : state === 'success' ? titles.success : titles.error;

    return (
        <StatusCard
            title={title}
            action={
                state !== 'verifying' ? (
                    <Button label={actionLabel} variant="primary" size="md" onClick={() => onAction(state)} />
                ) : null
            }
        />
    );
};

export default memo(VerifyStatusScreen);
