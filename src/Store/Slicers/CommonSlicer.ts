import { type StateCreator } from 'zustand';

import { type E_FORM_NAMES } from '~/constants';

import { type TViewType } from '~/Types/Components';

type FormFiled = Map<string, string>;
type FormData = {
    fields: FormFiled;
};

export interface ICommonSlicer {
    pageLimit: number;
    setPageLimit: (limit: number) => void;

    viewType: TViewType;
    setViewType: (viewType: TViewType) => void;

    search: Map<string, FormData>;
    setSearch: (formName: E_FORM_NAMES, field: string, value: string) => void;
    clearSearch: () => void;
}

const createCommonSlicer: StateCreator<ICommonSlicer> = (set) => ({
    pageLimit: 12,
    setPageLimit: (limit) => set({ pageLimit: limit }),

    viewType: 'grid',
    setViewType: (viewType) => set({ viewType }),

    search: new Map(),
    setSearch: (formName, field, value) => {
        set((state) => {
            const searchData = state.search;

            if (!searchData.has(formName)) {
                searchData.set(formName, { fields: new Map() });
            }

            const form = searchData.get(formName);
            form?.fields.set(field, value);

            return { search: new Map(searchData) };
        });
    },
    clearSearch: () => {},

    // getFormData: (formName) => {
    //     const data = get().data;
    //     return data.has(formName) ? data.get(formName).fields : new Map();
    //   }
});

export default createCommonSlicer;
