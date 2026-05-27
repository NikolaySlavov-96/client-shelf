import { HOST, STORAGE_KEYS } from '../constants';
import { type EReceiveEvents, type ESendEvents } from '../constants';

import { io, type ManagerOptions, type Socket, type SocketOptions } from '../lib/socket';

let socket: Socket;

const options: Partial<ManagerOptions & SocketOptions> = {
    path: '/bookHub',
    transports: ['websocket'],
};

const generateClientId = (): string => {
    // TODO(lint): use `Crypto` type instead of casting globalThis (no-explicit-any).
    const cryptoObj = (typeof globalThis !== 'undefined' && (globalThis as any).crypto) as
        | { randomUUID?: () => string; getRandomValues?: (a: Uint8Array) => Uint8Array }
        | undefined;
    if (cryptoObj?.randomUUID) {
        return cryptoObj.randomUUID();
    }
    if (cryptoObj?.getRandomValues) {
        const bytes = new Uint8Array(16);
        cryptoObj.getRandomValues(bytes);
        return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
    }
    return `${Date.now().toString(36)}${Math.random().toString(36).slice(2)}${Math.random().toString(36).slice(2)}`;
};

const getOrCreateClientId = (): string => {
    try {
        const existing = localStorage.getItem(STORAGE_KEYS.CLIENT_ID);
        if (existing && /^[A-Za-z0-9_-]{8,128}$/.test(existing)) {
            return existing;
        }
        const fresh = generateClientId();
        localStorage.setItem(STORAGE_KEYS.CLIENT_ID, fresh);
        return fresh;
    } catch {
        return generateClientId();
    }
};

const connect = (token?: string) => {
    const clientId = getOrCreateClientId();
    socket = io(HOST, {
        ...options,
        auth: { token: token ?? '', clientId },
    });
};

const disconnect = () => {
    if (socket) {
        socket.disconnect();
    }
};

// TODO(lint): introduce a typed event-to-payload map so `callback` isn't `(data: any)` (no-explicit-any).
const subscribeToEvent = (event: EReceiveEvents, callback: (data: any) => void) => {
    if (socket) {
        socket.on(event, callback);
    }
};

// TODO(lint): introduce a typed event-to-payload map so `callback` isn't `(data: any)` (no-explicit-any).
const unsubscribeFromEvent = (event: EReceiveEvents, callback: (data: any) => void) => {
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

export { connect, disconnect, getOrCreateClientId, sendData, sendOnlySignal, subscribeToEvent, unsubscribeFromEvent };
