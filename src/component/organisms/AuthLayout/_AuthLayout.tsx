import { type FC, memo, type ReactNode } from 'react';

import { TermsFooter } from '~/component/atoms';

import { AuthCardHeader, AuthTabs, BookSpinesPanel } from '~/component/molecules';

import styles from './_AuthLayout.module.css';

type TAuthTab = 'login' | 'register';

interface IAuthLayoutProps {
    tagline: string;
    heading: string;
    subtitle: string;
    activeTab: TAuthTab;
    onSwitchTab: (tab: TAuthTab) => void;
    children: ReactNode;
}

const _AuthLayout: FC<IAuthLayoutProps> = ({ tagline, heading, subtitle, activeTab, onSwitchTab, children }) => {
    return (
        <div className={styles.wrap}>
            <BookSpinesPanel tagline={tagline} />

            <div className={`flex-start ${styles.right}`}>
                <div className={styles.card}>
                    <AuthCardHeader title={heading} subtitle={subtitle} />
                    <AuthTabs activeTab={activeTab} onSwitch={onSwitchTab} />
                    {children}
                    <TermsFooter />
                </div>
            </div>
        </div>
    );
};

export default memo(_AuthLayout);
