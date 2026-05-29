import { type FC, memo } from 'react';

import { TEXTS } from '~/constants';

import { cx } from '~/Utils';

import { EBrowseMode } from '~/Types/Components';

import styles from './BrowseModeToggle.module.css';

interface IBrowseModeToggleProps {
    mode: EBrowseMode;
    onChange: (mode: EBrowseMode) => void;
    className?: string;
}

const CONTAINER_CLASS = 'flex-align overflow-hidden rounded-pill border-default bg-white';

const BrowseModeToggle: FC<IBrowseModeToggleProps> = (props) => {
    const { mode, onChange, className } = props;

    const handleInfinite = () => onChange(EBrowseMode.INFINITE);
    const handlePaged = () => onChange(EBrowseMode.PAGED);

    return (
        <div className={cx(CONTAINER_CLASS, className)} role="group" aria-label={TEXTS.CATALOG_MODE_LABEL}>
            <button
                type="button"
                className={cx(styles.option, mode === EBrowseMode.INFINITE ? styles['option--active'] : '')}
                onClick={handleInfinite}
                aria-pressed={mode === EBrowseMode.INFINITE}
            >
                {TEXTS.CATALOG_MODE_INFINITE}
            </button>
            <button
                type="button"
                className={cx(styles.option, mode === EBrowseMode.PAGED ? styles['option--active'] : '')}
                onClick={handlePaged}
                aria-pressed={mode === EBrowseMode.PAGED}
            >
                {TEXTS.CATALOG_MODE_PAGED}
            </button>
        </div>
    );
};

export default memo(BrowseModeToggle);
