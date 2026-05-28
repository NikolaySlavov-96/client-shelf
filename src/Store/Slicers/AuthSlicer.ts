import { type StateCreator } from 'zustand';

import { ServerError } from '~/constants';

import { AuthService, SocketService } from '~/services';

import { type ICommonSlicer } from './CommonSlicer';
import { type IModalSlicer } from './ModalSlicer';
import { type IProductSlicer } from './ProductSlicer';
import { type ISupportSlicer } from './SupportSlicer';

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
}

type TFullStore = IAuthSlicer & ICommonSlicer & ISupportSlicer & IModalSlicer & IProductSlicer;

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
            const result = await getAuthService().login({ email, password });
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

    // TODO(lint): drop `async` since logout() is fire-and-forget with .catch (require-await).
    onSubmitLogout: async () => {
        try {
            const { resetRooms, resetMessages, setWelcomeMessage, refreshToken } = get();
            // Best-effort: end the refresh session on the server so the token can't be reused.
            getAuthService()
                .logout({ refreshToken })
                .catch(() => undefined);
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
            setWelcomeMessage('');
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
            await getAuthService().verifyToken(token);
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
});

export default createAuthSlicer;
