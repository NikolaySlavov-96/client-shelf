import { memo } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button, List } from '~/component/atoms';

import { NOT_FOUND_SPINES, ROUT_NAMES, TEXTS } from '~/constants';

import styles from './_NotFound.module.css';

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <main className={`flex-col flex-center ${styles.wrap}`}>
            <List
                data={NOT_FOUND_SPINES}
                keyExtractor={(_, i) => String(i)}
                style={styles.spines}
                aria-hidden="true"
                renderItem={({ item: s }) => (
                    <div className={styles.spine} style={{ height: s.height, background: s.color }} />
                )}
            />

            <h1 className={styles.code}>{TEXTS.COMMON_NOT_FOUND_TITLE}</h1>
            <p className={styles.message}>{TEXTS.COMMON_NOT_FOUND_SUBTITLE}</p>

            <Button
                label={TEXTS.COMMON_BACK_TO_HOME}
                variant="primary"
                size="md"
                onClick={() => navigate(ROUT_NAMES.HOME)}
            />
        </main>
    );
};

export default memo(NotFound);
