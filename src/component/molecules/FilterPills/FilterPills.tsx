import { memo } from 'react';

import { List } from '~/component/atoms';

import { TEXTS } from '~/constants';

import { cx } from '~/Utils';

import styles from './FilterPills.module.css';

interface IFilterPillOption {
    label: string;
    value: string;
}

interface IFilterPillsProps {
    options: IFilterPillOption[];
    activeValue: string;
    onSelect: (value: string) => void;
    className?: string;
}

function FilterPills({ options, activeValue, onSelect, className }: IFilterPillsProps) {
    return (
        <List
            data={options}
            keyExtractor={(opt) => opt.value}
            style={cx(styles.container, className)}
            role="group"
            aria-label={TEXTS.FILTER_ARIA}
            renderItem={({ item: opt }) => (
                <button
                    className={cx(styles.pill, activeValue === opt.value ? styles['pill--active'] : '')}
                    onClick={() => onSelect(opt.value)}
                    aria-pressed={activeValue === opt.value}
                >
                    {opt.label}
                </button>
            )}
        />
    );
}

export default memo(FilterPills);
