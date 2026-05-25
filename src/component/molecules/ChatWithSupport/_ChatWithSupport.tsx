import { type Dispatch, type FC, memo, type SetStateAction, useCallback, useEffect, useRef } from 'react';

import { ChatHeader, List, MessageForm, MessageLine } from '~/component/atoms';

import { ESendEvents } from '~/constants';

import { SUPPORT_TOAST } from '~/Configuration';
import { useStoreZ } from '~/hooks';
import { SocketService } from '~/services';
import { type IMessage } from '~/Store/Slicers/SupportSlicer';
import { ToastWithButton } from '~/Toasts';

import style from './_ChatWithSupport.module.css';

const DEFAULT_TITLE = 'Support Chat';

const keyExtractor = (item: IMessage, index: number) => index.toString();

interface IChatWihSupportProps {
    onPress: Dispatch<SetStateAction<boolean>>;
    roomName: string;
}
const ChatWithSupport: FC<IChatWihSupportProps> = (props) => {
    const { onPress, roomName } = props;

    const messageEndRef = useRef<HTMLDivElement | null>(null);
    const { welcomeMessage, messages } = useStoreZ();

    const roomMessages = messages[roomName] || [];

    const onClose = useCallback(() => {
        onPress((s) => !s);
        SocketService.sendData(ESendEvents.SUPPORT_CHAT_USER_LEAVE, { roomName });
    }, [onPress, roomName]);

    const onVerifyChoice = useCallback(async () => {
        const result = await ToastWithButton(SUPPORT_TOAST);
        if (result?.isConfirmed) {
            onClose();
        }
    }, [onClose]);

    const renderItem = useCallback(({ item }: { item: IMessage }) => {
        return <MessageLine {...item} />;
    }, []);

    const scrollToBottom = () => {
        messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [roomMessages.length]);

    return (
        <>
            <ChatHeader>
                <p>{roomName ? roomName : DEFAULT_TITLE}</p>
                <button onClick={onVerifyChoice}>{'X'}</button>
            </ChatHeader>
            <div className={style['chat__container']}>
                <p className={style['welcome__message']}>{welcomeMessage}</p>
                <List data={roomMessages} renderItem={renderItem} keyExtractor={keyExtractor} />
                <div ref={messageEndRef} />
            </div>
            {roomName ? (
                <div className={style['input__container']}>
                    <MessageForm roomName={roomName} />
                </div>
            ) : null}
        </>
    );
};

export default memo(ChatWithSupport);
