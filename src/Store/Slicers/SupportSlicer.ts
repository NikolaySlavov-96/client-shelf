import { type StateCreator } from 'zustand';

export type TMessageStatus = 'sent' | 'delivered' | 'seen';

export interface IUserQueue {
    principal: string;
    name: string;
}

interface INotifyAdminOfNewUser {
    newUserPrincipal: string;
    userQueue: IUserQueue[];
}

export interface IMessage {
    id?: number;
    createdAt: string;
    message: string;
    roomName: string;
    senderId?: string;
    senderUserId?: number | null;
    status?: TMessageStatus;
    updatedAt: string;
}

export interface IMessages {
    [key: string]: IMessage[];
}

export interface IRoom {
    roomName: string;
}

export interface IMessageStatusUpdate {
    roomName: string;
    messageId: number;
    status: TMessageStatus;
    updatedAt: string;
}

const STATUS_RANK: Record<TMessageStatus, number> = {
    sent: 0,
    delivered: 1,
    seen: 2,
};

export interface ISupportSlicer {
    welcomeMessage: string;
    setWelcomeMessage: (message: string) => void;
    principal: string;
    setPrincipal: (principal: string) => void;
    users: IUserQueue[];
    setUsers: (newData: INotifyAdminOfNewUser) => void;
    selectedRoom: string;
    setSelectedRoom: (room: string) => void;
    rooms: IRoom[];
    setRooms: (newRoom: IRoom) => void;
    removeRoom: (roomName: string) => void;
    resetRooms: () => void;
    messages: IMessages;
    addMessage: (data: IMessage) => void;
    updateMessageStatus: (data: IMessageStatusUpdate) => void;
    resetMessages: () => void;
}

const createSupportSlicer: StateCreator<ISupportSlicer> = (set) => ({
    welcomeMessage: '',
    setWelcomeMessage: (message) => set({ welcomeMessage: message }),

    principal: '',
    setPrincipal: (principal) => set({ principal }),

    users: [],
    setUsers: (newUser) => set({ users: newUser.userQueue }),

    selectedRoom: '',
    setSelectedRoom: (room) => set({ selectedRoom: room }),

    rooms: [],
    setRooms: (newRoom) =>
        set((state) => {
            if (state.rooms.some((r) => r.roomName === newRoom.roomName)) {
                return { rooms: state.rooms };
            }
            return { rooms: [...state.rooms, newRoom] };
        }),
    removeRoom: (roomName) =>
        set((state) => ({
            rooms: state.rooms.filter((r) => r.roomName !== roomName),
        })),
    resetRooms: () => set({ rooms: [] }),

    messages: {},
    addMessage: (data) =>
        set((state) => {
            const currentMessages = state.messages[data.roomName] || [];
            if (data.id !== undefined && currentMessages.some((m) => m.id === data.id)) {
                return { messages: state.messages };
            }
            const normalized: IMessage = { ...data, status: data.status ?? 'sent' };
            return {
                messages: {
                    ...state.messages,
                    [data.roomName]: [...currentMessages, normalized],
                },
            };
        }),
    updateMessageStatus: (data) =>
        set((state) => {
            const currentMessages = state.messages[data.roomName];
            if (!currentMessages) return { messages: state.messages };
            let changed = false;
            const next = currentMessages.map((m) => {
                if (m.id !== data.messageId) return m;
                const currentRank = m.status ? STATUS_RANK[m.status] : -1;
                if (currentRank >= STATUS_RANK[data.status]) return m;
                changed = true;
                return { ...m, status: data.status, updatedAt: data.updatedAt };
            });
            if (!changed) return { messages: state.messages };
            return {
                messages: {
                    ...state.messages,
                    [data.roomName]: next,
                },
            };
        }),
    resetMessages: () => set({ messages: {} }),
});

export default createSupportSlicer;
