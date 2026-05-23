import { useCallback, useEffect } from 'react';

import { EReceiveEvents, ESendEvents, MODAL_NAMES, STORAGE_KEYS } from '~/constants';

import { useGetUserAddress, useStoreZ } from '~/hooks';
import { SocketService } from '~/services';
import { type IMessage } from '~/Store/Slicers/SupportSlicer';

const onUnsubscribe = () => {
    console.log('Unsubscribe');
};

const Socket = () => {
    const { userRole, token } = useStoreZ();

    const {
        connectId,
        openModal,
        setModalName,
        setContent,
        setUsers,
        setRooms,
        setSelectedRoom,
        setWelcomeMessage,
        addMessage,
        resetRooms,
        removeRoom,
    } = useStoreZ();

    const userAddressData = useGetUserAddress();

    const result = useCallback(
        (data: { dailyUsers: number; uncialUsers: number; isNewUser: boolean }) => {
            setModalName(MODAL_NAMES.NEW_PRODUCT);
            setContent(data);
            openModal();
        },
        [setModalName, setContent, openModal],
    );

    const updateCountOfVisitors = (data: any) => {
        console.log(data);
    };

    const notifyForCreatedRoom = (data: IMessage) => {
        setRooms({ roomName: data.roomName });
        addMessage(data);
        if (userRole !== 'support') {
            localStorage.setItem(STORAGE_KEYS.ISSUE_ROOMS, JSON.stringify(data.roomName));
            SocketService.sendData(ESendEvents.USER_ACCEPT_JOIN_TO_ROOM, { roomName: data.roomName });
        }
    };

    useEffect(() => {
        SocketService.connect(token);

        SocketService.subscribeToEvent(EReceiveEvents.ERROR, (data) => console.log(data));
        SocketService.subscribeToEvent(EReceiveEvents.NEW_PRODUCT_ADDED, result);
        SocketService.subscribeToEvent(EReceiveEvents.USER_CONNECT, updateCountOfVisitors);
        SocketService.subscribeToEvent(EReceiveEvents.SUPPORT_CHAT_USER_JOIN_ACKNOWLEDGMENT, setWelcomeMessage);
        SocketService.subscribeToEvent(EReceiveEvents.NOTIFY_FOR_CREATE_ROOM, notifyForCreatedRoom);
        SocketService.subscribeToEvent(EReceiveEvents.NOTIFY_ADMINS_OF_NEW_USER, setUsers);

        SocketService.subscribeToEvent(EReceiveEvents.COMPLETE_ISSUE, (data: { message: string; issue: string }) => {
            if (userRole === 'support') {
                setSelectedRoom('');
                removeRoom(data.issue);
                return;
            }
            resetRooms();
            localStorage.removeItem(STORAGE_KEYS.ISSUE_ROOMS);
        });

        SocketService.subscribeToEvent(EReceiveEvents.SUPPORT_MESSAGE, addMessage);

        return () => {
            SocketService.unsubscribeFromEvent(EReceiveEvents.NEW_PRODUCT_ADDED, onUnsubscribe);
            SocketService.unsubscribeFromEvent(EReceiveEvents.ERROR, onUnsubscribe);
            SocketService.unsubscribeFromEvent(EReceiveEvents.COMPLETE_ISSUE, onUnsubscribe);
            SocketService.unsubscribeFromEvent(EReceiveEvents.USER_CONNECT, onUnsubscribe);
            SocketService.unsubscribeFromEvent(EReceiveEvents.SUPPORT_CHAT_USER_JOIN_ACKNOWLEDGMENT, onUnsubscribe);
            SocketService.unsubscribeFromEvent(EReceiveEvents.NOTIFY_FOR_CREATE_ROOM, onUnsubscribe);
            SocketService.unsubscribeFromEvent(EReceiveEvents.NOTIFY_ADMINS_OF_NEW_USER, onUnsubscribe);
            SocketService.unsubscribeFromEvent(EReceiveEvents.SUPPORT_MESSAGE, onUnsubscribe);
            SocketService.disconnect();
        };
    }, [token, userRole]);

    useEffect(() => {
        const persist = localStorage.getItem(STORAGE_KEYS.ISSUE_ROOMS);
        if (persist) {
            const roomName = JSON.parse(persist);
            setRooms({ roomName });
            SocketService.sendData(ESendEvents.USER_ACCEPT_JOIN_TO_ROOM, { roomName });
        }
    }, [setRooms]);

    useEffect(() => {
        if (userAddressData.hasOwnProperty('IPv4')) {
            SocketService.sendData(ESendEvents.USER_CONNECT, userAddressData);
        }
    }, [userAddressData]);
};

export default Socket;
