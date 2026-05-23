import { memo } from 'react';

import { LinkedParagraph } from '~/component/molecules';

import style from './_Footer.module.css';

const FOOTED_CONTENT = {
    LINK: 'https://nnsn.pro',
    BUTTON_LABEL: 'NNSN',
    CONTENT: 'Designed and Implement from ',
};

const _Footer = () => {
    return (
        <footer className={style.footer}>
            <div className={style.inner}>
                <LinkedParagraph
                    staticContent={FOOTED_CONTENT.CONTENT}
                    to={FOOTED_CONTENT.LINK}
                    pressContent={FOOTED_CONTENT.BUTTON_LABEL}
                />
            </div>
        </footer>
    );
};

export default memo(_Footer);
