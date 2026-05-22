import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

import createCommonSlicer, { ICommonSlicer } from '../Store/Slicers/CommonSlicer';
import createModalSlicer, { IModalSlicer } from '../Store/Slicers/ModalSlicer';
import createSupportSlicer, { ISupportSlicer } from '../Store/Slicers/SupportSlicer';
import createProductSlicer, { IProductSlicer } from '../Store/Slicers/ProductSlicer';
import createAuthSlicer, { IAuthSlicer } from '../Store/Slicers/AuthSlicer';

type TStoreState = IAuthSlicer & IModalSlicer & ISupportSlicer & ICommonSlicer & IProductSlicer;

const _useStoreZ = create<TStoreState>()(
  persist(
    (set, get, store) => ({
      ...createAuthSlicer(set, get, store),
      ...createModalSlicer(set, get, store),
      ...createSupportSlicer(set, get, store),
      ...createCommonSlicer(set, get, store),
      ...createProductSlicer(set, get, store),
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
      }),
    }
  )
);

export default _useStoreZ;
