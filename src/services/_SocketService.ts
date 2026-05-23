import { HOST } from '../constants';
import { type EReceiveEvents, type ESendEvents } from '../constants';

import { useStoreZ } from '../hooks';
import { io, type ManagerOptions, type Socket, type SocketOptions } from '../lib/socket';

let socket: Socket;

const options: Partial<ManagerOptions & SocketOptions> = {
    // TODO Extract in constants
    path: '/bookHub',
    transports: ['websocket'],
};

const connect = (token?: string) => {
    socket = io(HOST, { ...options, auth: { token: token ?? '' } });

    socket.on('connect', () => {
        useStoreZ.getState().setConnectId(socket.id ?? '');
    });

    socket.on('disconnect', () => {
        useStoreZ.getState().setConnectId('');
    });
};

const disconnect = () => {
    if (socket) {
        socket.disconnect();
        useStoreZ.getState().setConnectId('');
    }
};

const subscribeToEvent = (event: EReceiveEvents, callback: (data: any) => void) => {
    if (socket) {
        socket.on(event, callback);
    }
};

const unsubscribeFromEvent = (event: EReceiveEvents, callback: () => void) => {
    if (socket) {
        socket.off(event, callback);
    }
};

const sendData = (event: ESendEvents, data: string | object) => {
    if (socket) {
        socket.emit(event, data);
    }
};
const sendOnlySignal = (event: ESendEvents) => {
    if (socket) {
        socket.emit(event);
    }
};

export { connect, disconnect, sendData, sendOnlySignal, subscribeToEvent, unsubscribeFromEvent };
