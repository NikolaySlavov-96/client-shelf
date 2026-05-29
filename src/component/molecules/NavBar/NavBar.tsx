import { useCallback, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { Avatar, Button } from '~/component/atoms';

import { MODAL_NAMES, ROUT_NAMES, TEXTS } from '~/constants';

import { cx } from '~/Utils';

import { useStoreZ } from '~/hooks';
import type { ISearchModalPayload } from '../SearchModal/SearchModal';

import styles from './NavBar.module.css';

interface INavBarProps {
    className?: string;
}

const LOGO_SVG = (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <rect x="2" y="3" width="5" height="14" rx="1.5" fill="var(--accent)" />
        <rect x="8" y="3" width="4" height="14" rx="1.5" fill="var(--accent-2)" />
        <rect x="13.5" y="3" width="4.5" height="14" rx="1.5" fill="var(--ink-2)" opacity="var(--opacity-faint)" />
    </svg>
);

const SEARCH_SCOPE_BY_ROUTE: ReadonlyArray<{
    match: (path: string) => boolean;
    scope: ISearchModalPayload['scope'];
}> = [
    { match: (p) => p.startsWith('/collections'), scope: 'shelf' },
    { match: (p) => p.startsWith('/search/'), scope: 'friend' },
    { match: () => true, scope: 'catalog' },
];

const resolveSearchScope = (pathname: string): ISearchModalPayload['scope'] => {
    for (const r of SEARCH_SCOPE_BY_ROUTE) {
        if (r.match(pathname)) return r.scope;
    }
    return 'catalog';
};

function NavBar({ className }: INavBarProps) {
    const navigate = useNavigate();
    const location = useLocation();
    const { email, isAuthenticated, isVerifyUser, userRole, onSubmitLogout, openNamedModal } = useStoreZ();

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const initials = email ? email.slice(0, 2).toUpperCase() : '';

    const handleLogoClick = useCallback(() => navigate(ROUT_NAMES.HOME), [navigate]);
    const handleLogout = useCallback(async () => {
        await onSubmitLogout();
        navigate(ROUT_NAMES.HOME);
    }, [onSubmitLogout, navigate]);
    const handleProfileClick = useCallback(() => navigate(ROUT_NAMES.USER_COLLECTION), [navigate]);
    const handleToggleMenu = useCallback(() => setIsMenuOpen((prev) => !prev), []);
    const handleSearchOpen = useCallback(() => {
        const payload: ISearchModalPayload = {
            scope: resolveSearchScope(location.pathname),
        };
        openNamedModal(MODAL_NAMES.SEARCH, payload);
    }, [location.pathname, openNamedModal]);

    const linksClass = cx(styles.nav__links, 'flex-align', isMenuOpen ? styles['nav__links--open'] : '');

    return (
        <header className={cx(styles.nav, 'flex-between', 'sticky-top', className)}>
            <a
                href={ROUT_NAMES.HOME}
                className={cx(styles.nav__logo, 'flex-align', 'text-serif')}
                onClick={(e) => {
                    e.preventDefault();
                    handleLogoClick();
                }}
                aria-label={TEXTS.NAV_LOGO}
            >
                {LOGO_SVG}
                {TEXTS.NAV_LOGO_PREFIX}
                <span className={styles['nav__logo-accent']}>{TEXTS.NAV_LOGO_SUFFIX}</span>
            </a>

            <button
                className={cx(styles['nav__search-trigger'], 'flex-align')}
                onClick={handleSearchOpen}
                aria-label={TEXTS.NAV_SEARCH_TRIGGER}
                type="button"
            >
                <span className={styles['nav__search-icon']} aria-hidden="true">
                    ⌕
                </span>
                {TEXTS.NAV_SEARCH_TRIGGER}
            </button>

            <button
                className={styles.nav__toggle}
                onClick={handleToggleMenu}
                aria-expanded={isMenuOpen}
                aria-label={TEXTS.NAV_ARIA_TOGGLE}
            >
                ☰
            </button>

            <nav className={linksClass} aria-label={TEXTS.NAV_ARIA_MAIN}>
                {isAuthenticated ? (
                    <>
                        <button className={cx(styles.nav__user, 'flex-align')} onClick={handleProfileClick}>
                            <Avatar initials={initials} size="sm" />
                            <span className={styles.nav__name}>{email.split('@')[0]}</span>
                        </button>
                        <Button label={TEXTS.NAV_COLLECTIONS} variant="ghost" size="md" onClick={handleProfileClick} />
                        <Button label={TEXTS.NAV_LOGOUT} variant="ghost" size="md" onClick={handleLogout} />
                        {userRole === 'support' ? (
                            <>
                                <Button
                                    label={TEXTS.NAV_CREATE}
                                    variant="ghost"
                                    size="md"
                                    onClick={() => navigate(ROUT_NAMES.CREATE_PRODUCT)}
                                    isDisabled={!isVerifyUser}
                                    title={!isVerifyUser ? TEXTS.COMMON_COMING_SOON : undefined}
                                />
                                <Button
                                    label={TEXTS.NAV_CHAT}
                                    variant="ghost"
                                    size="md"
                                    onClick={() => navigate(ROUT_NAMES.SUPPORT_CHAT)}
                                />
                            </>
                        ) : null}
                    </>
                ) : (
                    <>
                        <Button
                            label={TEXTS.NAV_LOGIN}
                            variant="ghost"
                            size="md"
                            onClick={() => navigate(ROUT_NAMES.LOGIN)}
                        />
                        <Button
                            label={TEXTS.NAV_REGISTER}
                            variant="primary"
                            size="md"
                            onClick={() => navigate(ROUT_NAMES.REGISTER)}
                        />
                    </>
                )}
            </nav>
        </header>
    );
}

export default NavBar;
