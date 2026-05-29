import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import createAuthSlicer, { type IAuthSlicer } from '../Store/Slicers/AuthSlicer';
import createCommonSlicer, { type ICommonSlicer } from '../Store/Slicers/CommonSlicer';
import createModalSlicer, { type IModalSlicer } from '../Store/Slicers/ModalSlicer';
import createProductSlicer, { type IProductSlicer } from '../Store/Slicers/ProductSlicer';
import createProfileSlicer, { type IProfileSlicer } from '../Store/Slicers/ProfileSlicer';
import createSupportSlicer, { type ISupportSlicer } from '../Store/Slicers/SupportSlicer';

type TStoreState = IAuthSlicer & IModalSlicer & ISupportSlicer & ICommonSlicer & IProductSlicer & IProfileSlicer;

const _useStoreZ = create<TStoreState>()(
    persist(
        (set, get, store) => ({
            ...createAuthSlicer(set, get, store),
            ...createModalSlicer(set, get, store),
            ...createSupportSlicer(set, get, store),
            ...createCommonSlicer(set, get, store),
            ...createProductSlicer(set, get, store),
            ...createProfileSlicer(set, get, store),
        }),
        {
            name: '@Product_AuthState',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                email: state.email,
                token: state.token,
                refreshToken: state.refreshToken,
                userId: state.userId,
                userRole: state.userRole,
                isAuthenticated: state.isAuthenticated,
                isVerifyUser: state.isVerifyUser,
                viewType: state.viewType,
                browseMode: state.browseMode,
            }),
        },
    ),
);

export default _useStoreZ;
