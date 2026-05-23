import { type FC, memo, type ReactNode } from 'react';

import style from './_ChatHeader.module.css';

interface IChatHeaderProps {
    children: ReactNode;
}

const _ChatHeader: FC<IChatHeaderProps> = (props) => {
    const { children } = props;

    return <div className={`flex-between ${style['container']}`}>{children}</div>;
};

export default memo(_ChatHeader);
