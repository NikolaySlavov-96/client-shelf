import { type KeyboardEvent, memo, useState } from 'react';

import List from '~/component/atoms/List/_List';

import { cx } from '~/Utils';

import styles from './StarRating.module.css';

const STARS = [1, 2, 3, 4, 5];

interface IStarRatingProps {
    /** Currently selected value (the user's own rating, or the average for read-only). */
    value: number;
    /** When true the stars are clickable / focusable. */
    interactive?: boolean;
    /** Fired with the chosen value (1..5) when interactive. */
    onRate?: (value: number) => void;
    /** Accessible label for the whole control. */
    ariaLabel?: string;
    className?: string;
}

function StarRating({ value, interactive = false, onRate, ariaLabel = 'Rating', className }: IStarRatingProps) {
    const [hover, setHover] = useState(0);

    const active = hover || value;

    const handleSelect = (star: number) => {
        if (interactive) onRate?.(star);
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>, star: number) => {
        if (!interactive) return;
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onRate?.(star);
        }
    };

    return (
        <List
            data={STARS}
            keyExtractor={(star) => String(star)}
            style={cx(styles.stars, className)}
            role={interactive ? 'radiogroup' : 'img'}
            aria-label={interactive ? ariaLabel : `${ariaLabel}: ${value} of 5`}
            renderItem={({ item: star }) =>
                interactive ? (
                    <button
                        type="button"
                        className={cx(styles.star, star <= active ? styles['star--on'] : '')}
                        onClick={() => handleSelect(star)}
                        onMouseEnter={() => setHover(star)}
                        onMouseLeave={() => setHover(0)}
                        onKeyDown={(e) => handleKeyDown(e, star)}
                        role="radio"
                        aria-checked={value === star}
                        aria-label={`${star} ${star === 1 ? 'star' : 'stars'}`}
                    >
                        ★
                    </button>
                ) : (
                    <span
                        className={cx(styles.star, styles['star--static'], star <= active ? styles['star--on'] : '')}
                        aria-hidden="true"
                    >
                        ★
                    </span>
                )
            }
        />
    );
}

export default memo(StarRating);
