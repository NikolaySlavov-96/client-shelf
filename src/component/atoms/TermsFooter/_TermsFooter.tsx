import { memo } from 'react';

import { TEXTS } from '~/constants';

import styles from './_TermsFooter.module.css';

const _TermsFooter = () => {
    return (
        <p className={styles.footer}>
            {TEXTS.AUTH_TERMS} <span className={styles.link}>{TEXTS.AUTH_TERMS_LINK}</span>
        </p>
    );
};

export default memo(_TermsFooter);
