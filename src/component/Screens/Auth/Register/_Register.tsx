import { memo, useCallback, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';

import AuthTabs from '../../../molecules/AuthTabs/AuthTabs';
import { Button } from '../../../atoms';

import { Toast } from '../../../../Toasts';
import { ESwalIcon } from '../../../../Types/Swal';

import { useStoreZ } from '../../../../hooks';
import { ROUT_NAMES, ServerError, TEXTS, BOOK_SPINES } from '../../../../constants';

import styles from '../Login/_Login.module.css';

const _Register = () => {
  const navigate = useNavigate();
  const { onSubmitRegister } = useStoreZ();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [year, setYear] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = useCallback(async (e: FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setIsLoading(true);
    try {
      const result = await onSubmitRegister({ email, password, year });
      if (result?.messageCode === ServerError.SUCCESSFULLY_REGISTER.messageCode) {
        Toast({ title: TEXTS.TOAST_REGISTER_SUCCESS, typeIcon: ESwalIcon.SUCCESS });
        navigate(ROUT_NAMES.LOGIN);
      } else {
        Toast({ title: result?.message ?? TEXTS.TOAST_GENERIC_ERROR, typeIcon: ESwalIcon.ERROR });
      }
    } finally {
      setIsLoading(false);
    }
  }, [email, password, year, onSubmitRegister, navigate]);

  return (
    <div className={styles.wrap}>
      <div className={styles.left}>
        <div className={styles.tagline}>{TEXTS.AUTH_REGISTER_TAGLINE}</div>
        <div>
          <div className={styles.spines}>
            {BOOK_SPINES.map((s, i) => (
              <div
                key={i}
                className={styles.spine}
                style={{ background: s.color, height: s.height }}
              />
            ))}
          </div>
          <p className={styles.quote}>{TEXTS.AUTH_LOGIN_QUOTE}</p>
        </div>
      </div>

      <div className={`flex-start ${styles.right}`}>
        <div className={styles.card}>
          <div className={styles.head}>
            <h1 className={styles.head__title}>{TEXTS.AUTH_REGISTER_HEADING}</h1>
            <p className={styles.head__sub}>{TEXTS.AUTH_REGISTER_SUBTITLE}</p>
          </div>

          <AuthTabs
            activeTab="register"
            onSwitch={(tab) => tab === 'login' ? navigate(ROUT_NAMES.LOGIN) : undefined}
          />

          <form onSubmit={handleSubmit} noValidate>
            <div className={styles.field}>
              <label className={styles.field__label} htmlFor="reg-email">
                {TEXTS.AUTH_LABEL_EMAIL}
              </label>
              <input
                id="reg-email"
                className={styles.field__input}
                type="email"
                placeholder={TEXTS.AUTH_PLACEHOLDER_EMAIL}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>

            <div className={styles.field}>
              <label className={styles.field__label} htmlFor="reg-password">
                {TEXTS.AUTH_LABEL_PASSWORD}
              </label>
              <input
                id="reg-password"
                className={styles.field__input}
                type="password"
                placeholder={TEXTS.AUTH_PLACEHOLDER_PASSWORD}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                required
              />
            </div>

            <div className={styles.field}>
              <label className={styles.field__label} htmlFor="reg-year">
                {TEXTS.AUTH_LABEL_YEAR}
              </label>
              <input
                id="reg-year"
                className={styles.field__input}
                type="number"
                placeholder={TEXTS.AUTH_PLACEHOLDER_YEAR}
                value={year}
                onChange={(e) => setYear(e.target.value)}
                min="1900"
                max="2099"
              />
            </div>

            <Button
              label={TEXTS.AUTH_BTN_REGISTER}
              variant="primary"
              size="full"
              type="submit"
              isLoading={isLoading}
              isDisabled={!email || !password}
            />
          </form>

          <p className={styles.footer}>
            {TEXTS.AUTH_TERMS}{' '}
            <span className={styles.footer__link}>{TEXTS.AUTH_TERMS_LINK}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default memo(_Register);
