import { type Dispatch, type FC, memo, type SetStateAction, useCallback } from 'react';

import { ChatHeader } from '~/component/atoms';

import { TEXTS } from '~/constants';

import style from './_ChatWindowCloser.module.css';

interface IChatWindowCloserProps {
    onPress: Dispatch<SetStateAction<boolean>>;
    title?: string;
}
const ChatWindowCloser: FC<IChatWindowCloserProps> = (props) => {
    const { onPress, title = TEXTS.SUPPORT_HELP_PROMPT } = props;

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
