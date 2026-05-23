import { memo } from 'react';

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
        <div className={cx(styles.container, className)} role="tablist" aria-label="Shelf categories">
            {tabs.map((tab) => (
                <button
                    key={tab.value}
                    role="tab"
                    aria-selected={activeValue === tab.value}
                    className={cx(styles.tab, activeValue === tab.value ? styles['tab--active'] : '')}
                    onClick={() => onSelect(tab.value)}
                >
                    {tab.label}
                    <span className={styles.tab__count}>{tab.count}</span>
                </button>
            ))}
        </div>
    );
}

export default memo(ShelfTabs);
