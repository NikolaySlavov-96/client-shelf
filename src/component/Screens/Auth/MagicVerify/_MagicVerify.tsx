import { memo, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { VerifyStatusScreen } from '~/component/organisms';

import { ROUT_NAMES, TEXTS } from '~/constants';

import { useStoreZ } from '~/hooks';
import { Toast } from '~/Toasts';
import { ESwalIcon } from '~/Types/Swal';

const MagicVerify = () => {
    const navigate = useNavigate();
    const { token } = useParams();
    const { verifyMagicLink } = useStoreZ();

    const onSuccess = useCallback(() => navigate(ROUT_NAMES.HOME), [navigate]);

    const onError = useCallback(
        (message?: string) => Toast({ title: message ?? TEXTS.AUTH_MAGIC_ERROR, typeIcon: ESwalIcon.ERROR }),
        [],
    );

    return (
        <VerifyStatusScreen
            token={token}
            verify={verifyMagicLink}
            titles={{
                verifying: TEXTS.AUTH_MAGIC_VERIFYING,
                success: TEXTS.AUTH_MAGIC_SUCCESS,
                error: TEXTS.AUTH_MAGIC_ERROR,
            }}
            actionLabel={TEXTS.NAV_LOGIN}
            onAction={() => navigate(ROUT_NAMES.LOGIN)}
            onSuccess={onSuccess}
            onError={onError}
        />
    );
};

export default memo(MagicVerify);
