import { type FC, memo } from 'react';

import { BOOK_SPINES, TEXTS } from '../../../constants';

import styles from './BookSpinesPanel.module.css';

interface IBookSpinesPanelProps {
    tagline: string;
    quote?: string;
}

const BookSpinesPanel: FC<IBookSpinesPanelProps> = ({ tagline, quote = TEXTS.AUTH_LOGIN_QUOTE }) => {
    return (
        <div className={styles.panel}>
            <div className={styles.tagline}>{tagline}</div>
            <div>
                <div className={styles.spines}>
                    {BOOK_SPINES.map((s, i) => (
                        <div key={i} className={styles.spine} style={{ background: s.color, height: s.height }} />
                    ))}
                </div>
                <p className={styles.quote}>{quote}</p>
            </div>
        </div>
    );
};

export default memo(BookSpinesPanel);
