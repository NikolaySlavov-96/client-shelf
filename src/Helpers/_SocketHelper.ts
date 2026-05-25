import { useCallback, useEffect } from 'react';

import { EReceiveEvents, ESendEvents, MODAL_NAMES, STORAGE_KEYS } from '~/constants';

import { useGetUserAddress, useStoreZ } from '~/hooks';
import { SocketService } from '~/services';
import { type IMessage } from '~/Store/Slicers/SupportSlicer';

const Socket = () => {
    const { userRole, token } = useStoreZ();

    const {
        rooms,
        openModal,
        setModalName,
        setContent,
        setUsers,
        setRooms,
        setSelectedRoom,
        setWelcomeMessage,
        setPrincipal,
        addMessage,
        resetRooms,
        removeRoom,
    } = useStoreZ();

    const userAddressData = useGetUserAddress();

    const onNewProductAdded = useCallback(
        (data: { dailyUsers: number; uncialUsers: number; isNewUser: boolean }) => {
            setModalName(MODAL_NAMES.NEW_PRODUCT);
            setContent(data);
            openModal();
        },
        [setModalName, setContent, openModal],
    );

    const onError = useCallback((data: unknown) => {
        console.log('socket error:', data);
    }, []);

    const onJoinAcknowledgment = useCallback(
        (data: { message: string; principal: string }) => {
            setWelcomeMessage(data.message);
            setPrincipal(data.principal);
        },
        [setWelcomeMessage, setPrincipal],
    );

    const onNotifyForCreatedRoom = useCallback(
        (data: IMessage) => {
            const exists = rooms.some((r) => r.roomName === data.roomName);
            if (!exists) {
                setRooms({ roomName: data.roomName });
            }
            addMessage(data);
            if (userRole !== 'support') {
                localStorage.setItem(STORAGE_KEYS.ISSUE_ROOMS, JSON.stringify(data.roomName));
                SocketService.sendData(ESendEvents.USER_ACCEPT_JOIN_TO_ROOM, { roomName: data.roomName });
            }
        },
        [rooms, setRooms, addMessage, userRole],
    );

    const onCompleteIssue = useCallback(
        (data: { message: string; issue: string }) => {
            if (userRole === 'support') {
                setSelectedRoom('');
                removeRoom(data.issue);
                return;
            }
            resetRooms();
            localStorage.removeItem(STORAGE_KEYS.ISSUE_ROOMS);
        },
        [userRole, setSelectedRoom, removeRoom, resetRooms],
    );

    useEffect(() => {
        SocketService.connect(token);

        SocketService.subscribeToEvent(EReceiveEvents.ERROR, onError);
        SocketService.subscribeToEvent(EReceiveEvents.NEW_PRODUCT_ADDED, onNewProductAdded);
        SocketService.subscribeToEvent(EReceiveEvents.SUPPORT_CHAT_USER_JOIN_ACKNOWLEDGMENT, onJoinAcknowledgment);
        SocketService.subscribeToEvent(EReceiveEvents.NOTIFY_FOR_CREATE_ROOM, onNotifyForCreatedRoom);
        SocketService.subscribeToEvent(EReceiveEvents.NOTIFY_ADMINS_OF_NEW_USER, setUsers);
        SocketService.subscribeToEvent(EReceiveEvents.COMPLETE_ISSUE, onCompleteIssue);
        SocketService.subscribeToEvent(EReceiveEvents.SUPPORT_MESSAGE, addMessage);

        return () => {
            SocketService.unsubscribeFromEvent(EReceiveEvents.ERROR, onError);
            SocketService.unsubscribeFromEvent(EReceiveEvents.NEW_PRODUCT_ADDED, onNewProductAdded);
            SocketService.unsubscribeFromEvent(
                EReceiveEvents.SUPPORT_CHAT_USER_JOIN_ACKNOWLEDGMENT,
                onJoinAcknowledgment,
            );
            SocketService.unsubscribeFromEvent(EReceiveEvents.NOTIFY_FOR_CREATE_ROOM, onNotifyForCreatedRoom);
            SocketService.unsubscribeFromEvent(EReceiveEvents.NOTIFY_ADMINS_OF_NEW_USER, setUsers);
            SocketService.unsubscribeFromEvent(EReceiveEvents.COMPLETE_ISSUE, onCompleteIssue);
            SocketService.unsubscribeFromEvent(EReceiveEvents.SUPPORT_MESSAGE, addMessage);
            SocketService.disconnect();
        };
    }, [
        token,
        userRole,
        onError,
        onNewProductAdded,
        onJoinAcknowledgment,
        onNotifyForCreatedRoom,
        setUsers,
        onCompleteIssue,
        addMessage,
    ]);

    useEffect(() => {
        const persist = localStorage.getItem(STORAGE_KEYS.ISSUE_ROOMS);
        if (!persist) return;
        try {
            const roomName = JSON.parse(persist);
            if (typeof roomName !== 'string' || !roomName) {
                localStorage.removeItem(STORAGE_KEYS.ISSUE_ROOMS);
                return;
            }
            setRooms({ roomName });
            SocketService.sendData(ESendEvents.USER_ACCEPT_JOIN_TO_ROOM, { roomName });
        } catch {
            localStorage.removeItem(STORAGE_KEYS.ISSUE_ROOMS);
        }
    }, [setRooms]);

    useEffect(() => {
        if (Object.prototype.hasOwnProperty.call(userAddressData, 'IPv4')) {
            SocketService.sendData(ESendEvents.USER_CONNECT, userAddressData);
        }
    }, [userAddressData]);
};

export default Socket;
