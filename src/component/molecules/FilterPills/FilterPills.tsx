import { memo } from 'react';

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
        <div className={cx(styles.container, className)} role="group" aria-label="Filter options">
            {options.map((opt) => (
                <button
                    key={opt.value}
                    className={cx(styles.pill, activeValue === opt.value ? styles['pill--active'] : '')}
                    onClick={() => onSelect(opt.value)}
                    aria-pressed={activeValue === opt.value}
                >
                    {opt.label}
                </button>
            ))}
        </div>
    );
}

export default memo(FilterPills);
