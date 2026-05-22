import { memo, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { Button } from '../../../atoms';

import { useStoreZ } from '../../../../hooks';
import { ROUT_NAMES, TEXTS } from '../../../../constants';

type TVerifyState = 'verifying' | 'success' | 'error';

const _VerifyAccount = () => {
  const navigate = useNavigate();
  const { verifyToken } = useParams();
  const { verifyAccountWithToken } = useStoreZ();

  const [state, setState] = useState<TVerifyState>('verifying');

  useEffect(() => {
    if (!verifyToken) {
      setState('error');
      return;
    }
    (async () => {
      try {
        await verifyAccountWithToken(verifyToken);
        setState('success');
      } catch {
        setState('error');
      }
    })();
  }, [verifyToken, verifyAccountWithToken]);

  const title =
    state === 'verifying' ? TEXTS.COMMON_LOADING :
    state === 'success' ? TEXTS.TOAST_REGISTER_SUCCESS :
    TEXTS.TOAST_GENERIC_ERROR;

  return (
    <main
      style={{
        minHeight: 'calc(100vh - var(--nav-height))',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--spacing-10)',
        background: 'var(--cream)',
      }}
    >
      <div
        style={{
          background: 'var(--white)',
          border: 'var(--border-default)',
          borderRadius: 'var(--radius-xl)',
          padding: 'var(--spacing-10)',
          maxWidth: 420,
          textAlign: 'center',
          boxShadow: 'var(--shadow-card)',
        }}
      >
        <h1
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'var(--text-3xl)',
            color: 'var(--ink)',
            marginBottom: 'var(--spacing-3)',
          }}
        >
          {title}
        </h1>
        {state !== 'verifying' ? (
          <Button
            label={TEXTS.COMMON_BACK_TO_HOME}
            variant="primary"
            size="md"
            onClick={() => navigate(state === 'success' ? ROUT_NAMES.LOGIN : ROUT_NAMES.HOME)}
          />
        ) : null}
      </div>
    </main>
  );
};

export default memo(_VerifyAccount);
