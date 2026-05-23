import { memo, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { VerifyStatusScreen } from '../../../organisms';

import { ROUT_NAMES, TEXTS } from '../../../../constants';

import { useStoreZ } from '../../../../hooks';

const VerifyAccount = () => {
    const navigate = useNavigate();
    const { verifyToken } = useParams();
    const { verifyAccountWithToken } = useStoreZ();

    const verify = useCallback(
        async (t: string) => {
            await verifyAccountWithToken(t);
        },
        [verifyAccountWithToken],
    );

    const onAction = useCallback(
        (state: 'success' | 'error') => navigate(state === 'success' ? ROUT_NAMES.LOGIN : ROUT_NAMES.HOME),
        [navigate],
    );

    return (
        <VerifyStatusScreen
            token={verifyToken}
            verify={verify}
            titles={{
                verifying: TEXTS.COMMON_LOADING,
                success: TEXTS.TOAST_REGISTER_SUCCESS,
                error: TEXTS.TOAST_GENERIC_ERROR,
            }}
            actionLabel={TEXTS.COMMON_BACK_TO_HOME}
            onAction={onAction}
        />
    );
};

export default memo(VerifyAccount);
