import { type FC, memo } from 'react';

import { Link } from '../../atoms';

import style from './_LinkedParagraph.module.css';

interface ILinkedParagraphProps {
    pressContent: string;
    staticContent: string;
    to: string;
    styles?: string;
}

const _LinkedParagraph: FC<ILinkedParagraphProps> = (props) => {
    const { styles, staticContent, to, pressContent } = props;

    return (
        <p className={`${style['paragraph']} ${styles ? styles : ''}`}>
            {staticContent}
            <Link to={to}>{pressContent}</Link>
        </p>
    );
};

export default memo(_LinkedParagraph);
