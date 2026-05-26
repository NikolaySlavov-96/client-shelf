import { memo, useEffect, useMemo, useState } from 'react';

import { ChatWindowCloser, ChatWithSupport } from '~/component/molecules';

import { ESendEvents } from '~/constants';

import { useStoreZ } from '~/hooks';
import { SocketService } from '~/services';

import style from './_CustomerSupportChat.module.css';

const CustomerSupportChat = () => {
    const [isOpenChat, setIsOpenChat] = useState(false);

    const { rooms } = useStoreZ();

    const roomName = rooms[0]?.roomName;

    const containerStyle = useMemo(
        () =>
            `${style['container']} ${isOpenChat ? `${style['border__open']} ${style['container__open']}` : ''}`,
        [isOpenChat],
    );

    useEffect(() => {
        if (!rooms?.length && isOpenChat) {
            SocketService.sendOnlySignal(ESendEvents.SUPPORT_CHAT_USER_JOIN);
        }
    }, [isOpenChat, rooms.length]);

    return (
        <div className={containerStyle}>
            {isOpenChat ? (
                <ChatWithSupport onPress={setIsOpenChat} roomName={roomName} />
            ) : (
                <ChatWindowCloser onPress={setIsOpenChat} />
            )}
        </div>
    );
};

export default memo(CustomerSupportChat);
