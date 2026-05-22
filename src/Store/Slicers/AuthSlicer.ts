import { StateCreator } from 'zustand';

import { AuthService, FileService } from '../../services';
import { ServerError } from '../../constants';
import { SocketService } from '../../services';
import { IProfile, IUpdateProfileRequest } from '~/Types/services/AuthService';

import { ICommonSlicer } from './CommonSlicer';
import { ISupportSlicer } from './SupportSlicer';
import { IModalSlicer } from './ModalSlicer';
import { IProductSlicer } from './ProductSlicer';

export interface IAuthSlicer {
  email: string;
  token: string;
  refreshToken: string;
  userId: string;
  userRole: 'user' | 'support';
  isAuthenticated: boolean;
  isVerifyUser: boolean;

  onSubmitLogin: (data: { email: string; password: string }) => Promise<unknown>;
  onSubmitLogout: () => Promise<void>;
  onSubmitRegister: (data: { email: string; password: string; year: string }) => Promise<unknown>;
  verifyAccountWithToken: (token: string | undefined) => Promise<void>;
  requestMagicLink: (email: string) => Promise<unknown>;
  verifyMagicLink: (token: string | undefined) => Promise<{ ok: boolean; message?: string }>;

  profile: IProfile | null;
  fetchProfile: () => Promise<void>;
  updateProfile: (data: IUpdateProfileRequest) => Promise<boolean>;
  updateReadingGoal: (goal: number) => Promise<boolean>;
  uploadAvatar: (file: File, name: string) => Promise<boolean>;
}

type TFullStore = IAuthSlicer & ICommonSlicer & ISupportSlicer & IModalSlicer & IProductSlicer;

// AuthService sits inside a module-load circular dependency
// (AuthService -> _api -> _API -> useStoreZ -> AuthSlicer). Calling it at
// module-eval time can hit the import while its binding is still in the
// temporal dead zone, so resolve it lazily on first use instead.
let _authService: ReturnType<typeof AuthService> | null = null;
const getAuthService = () => (_authService ??= AuthService());

const createAuthSlicer: StateCreator<TFullStore, [], [], IAuthSlicer> = (set, get) => ({
  email: '',
  token: '',
  refreshToken: '',
  userId: '',
  userRole: 'user',
  isAuthenticated: false,
  isVerifyUser: false,

  onSubmitLogin: async ({ email, password }: { email: string; password: string }) => {
    try {
      const { connectId } = get();
      const result = await getAuthService().login({ email, password, connectId });
      if (result.messageCode === ServerError.SUCCESSFULLY_LOGIN.messageCode) {
        const { userInfo } = result;
        set({
          email: userInfo.email,
          token: userInfo.accessToken,
          refreshToken: userInfo.refreshToken,
          userId: String(userInfo.id ?? userInfo._id),
          userRole: userInfo.role,
          isAuthenticated: !!userInfo.accessToken,
          isVerifyUser: userInfo.isVerify,
        });
      }
      return result;
    } catch (err) {
      return err;
    }
  },

  onSubmitLogout: async () => {
    try {
      const { resetRooms, resetMessages, setWelcomeMessage, refreshToken } = get();
      // Best-effort: end the refresh session on the server so the token can't be reused.
      getAuthService().logout({ refreshToken }).catch(() => undefined);
      set({
        email: '',
        token: '',
        refreshToken: '',
        userId: '',
        userRole: 'user',
        isAuthenticated: false,
        isVerifyUser: false,
      });
      resetRooms();
      resetMessages();
      setWelcomeMessage({ message: '' });
      SocketService.disconnect();
      SocketService.connect();
    } catch (_err) {
      // silent — logout always clears local state
    }
  },

  onSubmitRegister: async ({ email, password, year }: { email: string; password: string; year: string }) => {
    try {
      const result = await getAuthService().register({ email, password, year });
      return result;
    } catch (err) {
      return err;
    }
  },

  verifyAccountWithToken: async (token) => {
    if (!token) return;
    try {
      await getAuthService().verifyToken({ token });
    } catch (_err) {
      // silent
    }
  },

  requestMagicLink: async (email: string) => {
    try {
      return await getAuthService().requestMagicLink({ email });
    } catch (err) {
      return err;
    }
  },

  verifyMagicLink: async (token) => {
    if (!token) return { ok: false };
    try {
      const result = await getAuthService().verifyMagicLink(token);
      if (result.messageCode === ServerError.SUCCESSFULLY_LOGIN.messageCode) {
        const { userInfo } = result;
        set({
          email: userInfo.email,
          token: userInfo.accessToken,
          refreshToken: userInfo.refreshToken,
          userId: String(userInfo.id ?? userInfo._id),
          userRole: userInfo.role,
          isAuthenticated: !!userInfo.accessToken,
          isVerifyUser: userInfo.isVerify,
        });
        return { ok: true };
      }
      // Surface the server's reason (e.g. "account is not verified") to the caller.
      return { ok: false, message: result?.message };
    } catch (err) {
      // _API throws the parsed error body on a non-2xx response.
      return { ok: false, message: (err as { message?: string })?.message };
    }
  },

  profile: null,
  fetchProfile: async () => {
    try {
      const result = await getAuthService().getProfile();
      set({ profile: result });
    } catch (_err) {
      // silent — profile is non-critical
    }
  },

  updateProfile: async (data) => {
    try {
      const result = await getAuthService().updateProfile(data);
      set({ profile: result });
      return true;
    } catch (_err) {
      return false;
    }
  },

  updateReadingGoal: async (goal: number) => {
    return await get().updateProfile({ readingGoal: goal });
  },

  uploadAvatar: async (file: File, name: string) => {
    try {
      const formData = new FormData();
      formData.append('deliverFile', file);
      formData.append('src', name);

      const fileResponse = await FileService.sendFile(
        formData as unknown as { deliverFile: File; src: string }
      );

      return await get().updateProfile({ avatarFileId: fileResponse.fileId });
    } catch (_err) {
      return false;
    }
  },
});

export default createAuthSlicer;
