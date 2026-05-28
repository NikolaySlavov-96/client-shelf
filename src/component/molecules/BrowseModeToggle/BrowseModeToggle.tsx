import { type FC, memo } from 'react';

import { TEXTS } from '~/constants';

import { cx } from '~/Utils';

import { type TBrowseMode } from '~/Types/Components';

import styles from './BrowseModeToggle.module.css';

interface IBrowseModeToggleProps {
    mode: TBrowseMode;
    onChange: (mode: TBrowseMode) => void;
    className?: string;
}

const CONTAINER_CLASS = 'flex-align overflow-hidden rounded-pill border-default bg-white';

const BrowseModeToggle: FC<IBrowseModeToggleProps> = (props) => {
    const { mode, onChange, className } = props;

    const handleInfinite = () => onChange('infinite');
    const handlePaged = () => onChange('paged');

    return (
        <div className={cx(CONTAINER_CLASS, className)} role="group" aria-label={TEXTS.CATALOG_MODE_LABEL}>
            <button
                type="button"
                className={cx(styles.option, mode === 'infinite' ? styles['option--active'] : '')}
                onClick={handleInfinite}
                aria-pressed={mode === 'infinite'}
            >
                {TEXTS.CATALOG_MODE_INFINITE}
            </button>
            <button
                type="button"
                className={cx(styles.option, mode === 'paged' ? styles['option--active'] : '')}
                onClick={handlePaged}
                aria-pressed={mode === 'paged'}
            >
                {TEXTS.CATALOG_MODE_PAGED}
            </button>
        </div>
    );
};

export default memo(BrowseModeToggle);
