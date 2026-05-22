import { memo, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { Button } from '../../../atoms';

import { Toast } from '../../../../Toasts';
import { ESwalIcon } from '../../../../Types/Swal';
import { useStoreZ } from '../../../../hooks';
import { ROUT_NAMES, TEXTS } from '../../../../constants';

type TVerifyState = 'verifying' | 'success' | 'error';

const _MagicVerify = () => {
  const navigate = useNavigate();
  const { token } = useParams();
  const { verifyMagicLink } = useStoreZ();

  const [state, setState] = useState<TVerifyState>('verifying');

  useEffect(() => {
    if (!token) {
      setState('error');
      return;
    }
    (async () => {
      const { ok, message } = await verifyMagicLink(token);
      setState(ok ? 'success' : 'error');
      if (ok) {
        navigate(ROUT_NAMES.HOME);
      } else {
        // Show the real reason from the server (e.g. "account is not verified")
        // instead of failing silently behind the generic page title.
        Toast({ title: message ?? TEXTS.AUTH_MAGIC_ERROR, typeIcon: ESwalIcon.ERROR });
      }
    })();
  }, [token, verifyMagicLink, navigate]);

  const title =
    state === 'verifying' ? TEXTS.AUTH_MAGIC_VERIFYING :
    state === 'success' ? TEXTS.AUTH_MAGIC_SUCCESS :
    TEXTS.AUTH_MAGIC_ERROR;

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
        {state === 'error' ? (
          <Button
            label={TEXTS.NAV_LOGIN}
            variant="primary"
            size="md"
            onClick={() => navigate(ROUT_NAMES.LOGIN)}
          />
        ) : null}
      </div>
    </main>
  );
};

export default memo(_MagicVerify);
