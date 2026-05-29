import {
    type ILoginRequest,
    type ILoginResponse,
    type ILogOutRequest,
    type ILogOutResponse,
    type IMagicLinkRequest,
    type IMagicLinkResponse,
    type IRegisterRequest,
    type IRegisterResponse,
    type IVerifyMagicResponse,
    type IVerifyTokenResponse,
} from '~/Types/services/AuthService';

import api from './_api';

const PREFIX = '/auth';

const _AuthServiceFactory = () => {
    const register = (data: IRegisterRequest): Promise<IRegisterResponse> =>
        api.post(`${PREFIX}/register`, { inputData: data });

    const login = (data: ILoginRequest): Promise<ILoginResponse> => api.post(`${PREFIX}/login`, { inputData: data });

    const logout = (data: ILogOutRequest): Promise<ILogOutResponse> =>
        api.post(`${PREFIX}/logout`, { inputData: data });

    const verifyToken = (token: string): Promise<IVerifyTokenResponse> =>
        api.post(`${PREFIX}/verify`, { inputData: { verifyToken: token } });

    const requestMagicLink = (data: IMagicLinkRequest): Promise<IMagicLinkResponse> =>
        api.post(`${PREFIX}/magic-link`, { inputData: data });

    const verifyMagicLink = (token: string): Promise<IVerifyMagicResponse> =>
        api.post(`${PREFIX}/magic-link/verify`, { inputData: { token } });

    return {
        register,
        login,
        logout,
        checkField,
        verifyToken,
        requestMagicLink,
        verifyMagicLink,
    };
};

export default _AuthServiceFactory;
