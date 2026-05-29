import { memo } from 'react';

import { List } from '~/component/atoms';

import { TEXTS } from '~/constants';

import { cx } from '~/Utils';

import styles from './ShelfTabs.module.css';

interface IShelfTab {
    label: string;
    value: string;
    count: number;
}

interface IShelfTabsProps {
    tabs: IShelfTab[];
    activeValue: string;
    onSelect: (value: string) => void;
    className?: string;
}

function ShelfTabs({ tabs, activeValue, onSelect, className }: IShelfTabsProps) {
    return (
        <List
            data={tabs}
            keyExtractor={(tab) => tab.value}
            style={cx(styles.container, className)}
            role="tablist"
            aria-label={TEXTS.SHELF_ARIA_TABS}
            renderItem={({ item: tab }) => (
                <button
                    role="tab"
                    aria-selected={activeValue === tab.value}
                    className={cx(styles.tab, activeValue === tab.value ? styles['tab--active'] : '')}
                    onClick={() => onSelect(tab.value)}
                >
                    {tab.label}
                    <span className={styles.tab__count}>{tab.count}</span>
                </button>
            )}
        />
    );
}

export default memo(ShelfTabs);
