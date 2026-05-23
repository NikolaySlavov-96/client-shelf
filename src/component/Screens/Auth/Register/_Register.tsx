import { memo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button, FormField } from '../../../atoms';

import { AuthLayout } from '../../../organisms';

import { ROUT_NAMES, ServerError, TEXTS } from '../../../../constants';

import { useAuthForm, useStoreZ } from '../../../../hooks';

const Register = () => {
    const navigate = useNavigate();
    const { onSubmitRegister } = useStoreZ();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [year, setYear] = useState('');

    const { isLoading, handleSubmit } = useAuthForm({
        submit: (values: { email: string; password: string; year: string }) => onSubmitRegister(values),
        successCode: ServerError.SUCCESSFULLY_REGISTER.messageCode,
        successText: TEXTS.TOAST_REGISTER_SUCCESS,
        onSuccess: () => navigate(ROUT_NAMES.LOGIN),
    });

    return (
        <AuthLayout
            tagline={TEXTS.AUTH_REGISTER_TAGLINE}
            heading={TEXTS.AUTH_REGISTER_HEADING}
            subtitle={TEXTS.AUTH_REGISTER_SUBTITLE}
            activeTab="register"
            onSwitchTab={(tab) => (tab === 'login' ? navigate(ROUT_NAMES.LOGIN) : undefined)}
        >
            <form onSubmit={(e) => handleSubmit(e, { email, password, year }, !!email && !!password)} noValidate>
                <FormField
                    id="reg-email"
                    label={TEXTS.AUTH_LABEL_EMAIL}
                    type="email"
                    placeholder={TEXTS.AUTH_PLACEHOLDER_EMAIL}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    required
                />
                <FormField
                    id="reg-password"
                    label={TEXTS.AUTH_LABEL_PASSWORD}
                    type="password"
                    placeholder={TEXTS.AUTH_PLACEHOLDER_PASSWORD}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
                    required
                />
                <FormField
                    id="reg-year"
                    label={TEXTS.AUTH_LABEL_YEAR}
                    type="number"
                    placeholder={TEXTS.AUTH_PLACEHOLDER_YEAR}
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    min={1900}
                    max={2099}
                />
                <Button
                    label={TEXTS.AUTH_BTN_REGISTER}
                    variant="primary"
                    size="full"
                    type="submit"
                    isLoading={isLoading}
                    isDisabled={!email || !password}
                />
            </form>
        </AuthLayout>
    );
};

export default memo(Register);
