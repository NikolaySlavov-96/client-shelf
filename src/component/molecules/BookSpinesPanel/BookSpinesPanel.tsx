import { type FC, memo } from 'react';

import { List } from '~/component/atoms';

import { BOOK_SPINES, TEXTS } from '~/constants';

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
                <List
                    data={BOOK_SPINES}
                    keyExtractor={(_, i) => String(i)}
                    style={styles.spines}
                    renderItem={({ item: s }) => (
                        <div className={styles.spine} style={{ background: s.color, height: s.height }} />
                    )}
                />
                <p className={styles.quote}>{quote}</p>
            </div>
        </div>
    );
};

export default memo(BookSpinesPanel);
