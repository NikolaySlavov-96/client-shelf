import { type StateCreator } from 'zustand';

// TODO(lint): tighten the `any` types — content/newData should use proper modal payload types (no-explicit-any x3).
export interface IModalSlicer {
    modalName: string;
    setModalName: (data: string) => void;
    content: any[];
    setContent: (newData: any) => void;
    modalPayload: unknown;
    error: { message: string };
    setErrors: (newData: any) => void;
    isVisible: boolean;
    openModal: () => void;
    closeModal: () => void;
    openNamedModal: (name: string, payload?: unknown) => void;
}

const createModalSlicer: StateCreator<IModalSlicer> = (set) => ({
    modalName: '',
    setModalName: (data) => set({ modalName: data }),
    content: [],
    setContent: (newDate) =>
        set((state) => ({
            content: [...state.content, newDate],
        })),
    modalPayload: undefined,
    error: { message: '' },
    setErrors: (error) => set({ error }),
    isVisible: false,
    openModal: () => set({ isVisible: true }),
    closeModal: () => set({ isVisible: false, modalPayload: undefined }),
    openNamedModal: (name, payload) =>
        set({
            modalName: name,
            modalPayload: payload,
            isVisible: true,
        }),
});

export default createModalSlicer;
