import { memo } from 'react';

import { List } from '~/component/atoms';

import { TEXTS } from '~/constants';

import { cx } from '~/Utils';

import styles from './AuthTabs.module.css';

type TAuthTab = 'login' | 'register';

interface IAuthTabsProps {
    activeTab: TAuthTab;
    onSwitch: (tab: TAuthTab) => void;
    className?: string;
}

const TABS: { value: TAuthTab; label: string }[] = [
    { value: 'login', label: TEXTS.AUTH_TAB_LOGIN },
    { value: 'register', label: TEXTS.AUTH_TAB_REGISTER },
];

function AuthTabs({ activeTab, onSwitch, className }: IAuthTabsProps) {
    return (
        <List
            data={TABS}
            keyExtractor={(tab) => tab.value}
            style={cx(styles.tabs, className)}
            role="tablist"
            aria-label="Authentication"
            renderItem={({ item: tab }) => (
                <button
                    role="tab"
                    aria-selected={activeTab === tab.value}
                    className={cx(styles.tab, activeTab === tab.value ? styles['tab--active'] : '')}
                    onClick={() => onSwitch(tab.value)}
                >
                    {tab.label}
                </button>
            )}
        />
    );
}

export default memo(AuthTabs);
