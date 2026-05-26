import { useEffect } from 'react';

import { EReceiveEvents, ESendEvents, MODAL_NAMES, STORAGE_KEYS } from '~/constants';

import { useGetUserAddress, useStoreZ } from '~/hooks';
import { SocketService } from '~/services';
import { type IMessage, type IMessageStatusUpdate } from '~/Store/Slicers/SupportSlicer';

const onError = (data: unknown) => {
    console.log('socket error:', data);
};

const onNewProductAdded = (data: { dailyUsers: number; uncialUsers: number; isNewUser: boolean }) => {
    const { setModalName, setContent, openModal } = useStoreZ.getState();
    setModalName(MODAL_NAMES.NEW_PRODUCT);
    setContent(data);
    openModal();
};

const onJoinAcknowledgment = (data: { message: string; principal: string }) => {
    const { setWelcomeMessage, setPrincipal } = useStoreZ.getState();
    setWelcomeMessage(data.message);
    setPrincipal(data.principal);
};

const onNotifyForCreatedRoom = (data: IMessage) => {
    const { rooms, setRooms, addMessage, userRole } = useStoreZ.getState();
    if (!rooms.some((r) => r.roomName === data.roomName)) {
        setRooms({ roomName: data.roomName });
    }
    addMessage(data);
    if (userRole !== 'support') {
        localStorage.setItem(STORAGE_KEYS.ISSUE_ROOMS, JSON.stringify(data.roomName));
        SocketService.sendData(ESendEvents.USER_ACCEPT_JOIN_TO_ROOM, { roomName: data.roomName });
    }
};

const onNotifyAdminsOfNewUser: Parameters<typeof SocketService.subscribeToEvent>[1] = (data) => {
    useStoreZ.getState().setUsers(data);
};

const onCompleteIssue = (data: { message: string; issue: string }) => {
    const { userRole, setSelectedRoom, removeRoom, resetRooms, resetMessages } = useStoreZ.getState();
    if (userRole === 'support') {
        setSelectedRoom('');
        removeRoom(data.issue);
        return;
    }
    resetRooms();
    resetMessages();
    localStorage.removeItem(STORAGE_KEYS.ISSUE_ROOMS);
};

const onIncomingMessage = (data: IMessage) => {
    const { addMessage, principal } = useStoreZ.getState();
    addMessage(data);
    const isFromOther = !!data.senderId && !!principal && data.senderId !== principal;
    if (isFromOther && typeof data.id === 'number') {
        SocketService.sendData(ESendEvents.SUPPORT_MESSAGE_DELIVERED, {
            roomName: data.roomName,
            messageId: data.id,
        });
    }
};

const onMessageStatus = (data: IMessageStatusUpdate) => {
    useStoreZ.getState().updateMessageStatus(data);
};

const restorePersistedRoom = () => {
    const persist = localStorage.getItem(STORAGE_KEYS.ISSUE_ROOMS);
    if (!persist) return;
    try {
        const roomName = JSON.parse(persist);
        if (typeof roomName !== 'string' || !roomName) {
            localStorage.removeItem(STORAGE_KEYS.ISSUE_ROOMS);
            return;
        }
        useStoreZ.getState().setRooms({ roomName });
        SocketService.sendData(ESendEvents.USER_ACCEPT_JOIN_TO_ROOM, { roomName });
    } catch {
        localStorage.removeItem(STORAGE_KEYS.ISSUE_ROOMS);
    }
};

const Socket = () => {
    const token = useStoreZ((s) => s.token);
    const userAddressData = useGetUserAddress();

    useEffect(() => {
        SocketService.connect(token);

        SocketService.subscribeToEvent(EReceiveEvents.ERROR, onError);
        SocketService.subscribeToEvent(EReceiveEvents.NEW_PRODUCT_ADDED, onNewProductAdded);
        SocketService.subscribeToEvent(EReceiveEvents.SUPPORT_CHAT_USER_JOIN_ACKNOWLEDGMENT, onJoinAcknowledgment);
        SocketService.subscribeToEvent(EReceiveEvents.NOTIFY_FOR_CREATE_ROOM, onNotifyForCreatedRoom);
        SocketService.subscribeToEvent(EReceiveEvents.NOTIFY_ADMINS_OF_NEW_USER, onNotifyAdminsOfNewUser);
        SocketService.subscribeToEvent(EReceiveEvents.COMPLETE_ISSUE, onCompleteIssue);
        SocketService.subscribeToEvent(EReceiveEvents.SUPPORT_MESSAGE, onIncomingMessage);
        SocketService.subscribeToEvent(EReceiveEvents.SUPPORT_MESSAGE_STATUS, onMessageStatus);

        restorePersistedRoom();

        return () => {
            SocketService.unsubscribeFromEvent(EReceiveEvents.ERROR, onError);
            SocketService.unsubscribeFromEvent(EReceiveEvents.NEW_PRODUCT_ADDED, onNewProductAdded);
            SocketService.unsubscribeFromEvent(
                EReceiveEvents.SUPPORT_CHAT_USER_JOIN_ACKNOWLEDGMENT,
                onJoinAcknowledgment,
            );
            SocketService.unsubscribeFromEvent(EReceiveEvents.NOTIFY_FOR_CREATE_ROOM, onNotifyForCreatedRoom);
            SocketService.unsubscribeFromEvent(EReceiveEvents.NOTIFY_ADMINS_OF_NEW_USER, onNotifyAdminsOfNewUser);
            SocketService.unsubscribeFromEvent(EReceiveEvents.COMPLETE_ISSUE, onCompleteIssue);
            SocketService.unsubscribeFromEvent(EReceiveEvents.SUPPORT_MESSAGE, onIncomingMessage);
            SocketService.unsubscribeFromEvent(EReceiveEvents.SUPPORT_MESSAGE_STATUS, onMessageStatus);
            SocketService.disconnect();
        };
    }, [token]);

    useEffect(() => {
        if (Object.prototype.hasOwnProperty.call(userAddressData, 'IPv4')) {
            SocketService.sendData(ESendEvents.USER_CONNECT, userAddressData);
        }
    }, [userAddressData]);
};

export default Socket;
