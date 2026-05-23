import { type Dispatch, type FC, memo, type SetStateAction, useCallback } from 'react';

import { ChatHeader } from '../../../component/atoms';

import style from './_ChatWindowCloser.module.css';

const DEFAULT_TITLE = 'Press if you need a help';

interface IChatWindowCloserProps {
    onPress: Dispatch<SetStateAction<boolean>>;
    title?: string;
}
const ChatWindowCloser: FC<IChatWindowCloserProps> = (props) => {
    const { onPress, title = DEFAULT_TITLE } = props;

    const onClick = useCallback(() => onPress((s) => !s), [onPress]);
    return (
        <button className={style['btn']} onClick={onClick}>
            <ChatHeader>
                <>{title}</>
            </ChatHeader>
        </button>
    );
};

export default memo(ChatWindowCloser);
