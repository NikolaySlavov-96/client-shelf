import { type StateCreator } from 'zustand';

export interface IModalSlicer {
    modalName: string;
    setModalName: (data: string) => void;
    content: any[]; // append-only feed (used by NewProductModal socket notifications)
    setContent: (newData: any) => void;
    modalPayload: unknown; // typed payload for the currently-open modal (consumed by the modal component)
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
