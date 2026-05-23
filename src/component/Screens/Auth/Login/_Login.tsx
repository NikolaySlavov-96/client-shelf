import { memo, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button, FormField } from '~/component/atoms';

import { AuthLayout } from '~/component/organisms';

import { ROUT_NAMES, ServerError, TEXTS } from '~/constants';

import { useAuthForm, useStoreZ } from '~/hooks';
import { Toast } from '~/Toasts';
import { ESwalIcon } from '~/Types/Swal';

import styles from './_Login.module.css';

const Login = () => {
    const navigate = useNavigate();
    const { onSubmitLogin, requestMagicLink } = useStoreZ();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isMagicLoading, setIsMagicLoading] = useState(false);

    const { isLoading, handleSubmit } = useAuthForm({
        submit: (values: { email: string; password: string }) => onSubmitLogin(values),
        successCode: ServerError.SUCCESSFULLY_LOGIN.messageCode,
        successText: TEXTS.TOAST_LOGIN_SUCCESS,
        onSuccess: () => navigate(ROUT_NAMES.HOME),
    });

    const handleMagicLink = useCallback(async () => {
        if (!email.trim()) {
            Toast({ title: TEXTS.TOAST_MAGIC_ENTER_EMAIL, typeIcon: ESwalIcon.INFO });
            return;
        }
        setIsMagicLoading(true);
        try {
            await requestMagicLink(email.trim());
            Toast({ title: TEXTS.TOAST_MAGIC_LINK_SENT, typeIcon: ESwalIcon.SUCCESS });
        } finally {
            setIsMagicLoading(false);
        }
    }, [email, requestMagicLink]);

    return (
        <AuthLayout
            tagline={TEXTS.AUTH_LOGIN_TAGLINE}
            heading={TEXTS.AUTH_LOGIN_HEADING}
            subtitle={TEXTS.AUTH_LOGIN_SUBTITLE}
            activeTab="login"
            onSwitchTab={(tab) => (tab === 'register' ? navigate(ROUT_NAMES.REGISTER) : undefined)}
        >
            <form onSubmit={(e) => handleSubmit(e, { email, password }, !!email && !!password)} noValidate>
                <FormField
                    id="login-email"
                    label={TEXTS.AUTH_LABEL_EMAIL}
                    type="email"
                    placeholder={TEXTS.AUTH_PLACEHOLDER_EMAIL}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    required
                />
                <FormField
                    id="login-password"
                    label={TEXTS.AUTH_LABEL_PASSWORD}
                    type="password"
                    placeholder={TEXTS.AUTH_PLACEHOLDER_PASSWORD}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    required
                />
                <Button
                    label={TEXTS.AUTH_BTN_LOGIN}
                    variant="primary"
                    size="full"
                    type="submit"
                    isLoading={isLoading}
                    isDisabled={!email || !password}
                />
            </form>

            <div className={`flex-align ${styles.divider}`}>
                <span className={styles.divider__text}>{TEXTS.AUTH_OR_DIVIDER}</span>
            </div>

            <button
                className={styles.emailLink}
                type="button"
                onClick={handleMagicLink}
                disabled={isMagicLoading}
                aria-busy={isMagicLoading}
            >
                {isMagicLoading ? TEXTS.COMMON_LOADING : TEXTS.AUTH_EMAIL_LINK}
            </button>
        </AuthLayout>
    );
};

export default memo(Login);
