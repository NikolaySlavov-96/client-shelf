import { memo } from 'react';

import { LinkedParagraph } from '~/component/molecules';

import { TEXTS } from '~/constants';

import style from './_Footer.module.css';

const FOOTED_CONTENT = {
    LINK: 'https://nnsn.pro',
    BUTTON_LABEL: TEXTS.FOOTER_AUTHOR,
    CONTENT: TEXTS.FOOTER_CONTENT,
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
