import { memo, useCallback, useEffect, useRef } from 'react';

import { ChatHeader, List, MessageForm, MessageLine } from '~/component/atoms';

import { ESendEvents } from '~/constants';

import { useStoreZ } from '~/hooks';
import { SocketService } from '~/services';
import { type IMessage, type IRoom, type IUserQueue } from '~/Store/Slicers/SupportSlicer';

import style from './_Support.module.css';

const DEFAULT_TITLE = 'Support Chat - ';

const keyExtractorUser = (item: IUserQueue) => item.principal;
const keyExtractorRoom = (item: IRoom) => item.roomName.toString();
const keyExtractorMessage = (item: IMessage) => item.message.toString();

const Support = () => {
    const { rooms, users, messages, selectedRoom, setSelectedRoom, email } = useStoreZ();

    const messageEndRef = useRef<HTMLDivElement | null>(null);
    const currentRoomMessages = messages[selectedRoom] || [];

    const renderItemUser = useCallback(({ item }: { item: IUserQueue }) => {
        const onClick = () => {
            // Server resolves support identity from the socket itself
            SocketService.sendData(ESendEvents.SUPPORT_ACCEPT_USER, {
                acceptUserPrincipal: item.principal,
            });
        };
        return <button onClick={onClick}>{item.name || item.principal}</button>;
    }, []);

    const renderItemRoom = useCallback(
        ({ item }: { item: IRoom }) => {
            const onClick = () => setSelectedRoom(item.roomName);
            return (
                <button onClick={onClick} style={{ display: 'inline-block', marginRight: 10 }}>
                    {item.roomName.slice(0, 5)}
                </button>
            );
        },
        [setSelectedRoom],
    );

    const renderItemMessage = useCallback(({ item }: { item: IMessage }) => <MessageLine {...item} />, []);

    useEffect(() => {
        SocketService.sendOnlySignal(ESendEvents.SUPPORT_CHAT_USER_JOIN);
    }, []);

    const scrollToBottom = () => {
        messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (selectedRoom) scrollToBottom();
    }, [selectedRoom, currentRoomMessages.length]);

    return (
        <section className={style.container}>
            <div className={style['chat__container']}>
                <ChatHeader>
                    <p>{`${DEFAULT_TITLE}${email.split('@')[0]}`}</p>
                </ChatHeader>
                <List
                    data={users}
                    renderItem={renderItemUser}
                    keyExtractor={keyExtractorUser}
                    style={style['list-chat__container']}
                />
            </div>
            <div className={`flex-col ${style['room__container']}`}>
                <List
                    data={rooms}
                    renderItem={renderItemRoom}
                    keyExtractor={keyExtractorRoom}
                    style={style['room__header']}
                />
                <div className={`flex-col ${style['message__container']}`}>
                    <List
                        data={currentRoomMessages}
                        renderItem={renderItemMessage}
                        keyExtractor={keyExtractorMessage}
                        EmptyComponent={() => null}
                        style={style['chat__window']}
                    />
                    <div ref={messageEndRef} />
                </div>
                {selectedRoom !== '' ? <MessageForm roomName={selectedRoom} /> : null}
            </div>
        </section>
    );
};

export default memo(Support);
