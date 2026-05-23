import { HOST } from '../constants';

import useStoreZ from '../hooks/_useStoreZ';

export type TMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface IOptions {
    method: TMethod;
    headers: any;
    body?: any;
}
interface IMoreData {
    inputData: object;
    isImage?: boolean;
}

// Endpoint that exchanges a refresh token for a fresh access/refresh pair.
const REFRESH_URL = '/auth/refresh';

// Single-flight guard: when several requests hit a 401 at the same time we only
// want ONE refresh round-trip. The first 401 starts it; the rest await the same
// promise and then retry with the token it produced.
let refreshPromise: Promise<string | null> | null = null;

const buildOptions = (method: TMethod, moreData?: IMoreData): IOptions => {
    const options: IOptions = {
        method,
        headers: {},
    };

    if (moreData?.inputData !== undefined && !moreData?.isImage) {
        options.headers['Content-Type'] = 'application/json';
        options.body = JSON.stringify(moreData?.inputData);
    }

    if (moreData?.isImage) {
        options.body = moreData?.inputData;
    }

    const accessToken = useStoreZ.getState().token;
    if (accessToken) {
        options.headers = {
            ...options.headers,
            authorization: accessToken,
        };
    }

    return options;
};

const clearSession = () => {
    useStoreZ.setState({ token: '', refreshToken: '', isAuthenticated: false });
};

const requestNewToken = async (): Promise<string | null> => {
    const { refreshToken } = useStoreZ.getState();
    if (!refreshToken) {
        clearSession();
        return null;
    }

    try {
        const response = await fetch(HOST + REFRESH_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken }),
        });

        if (!response.ok) {
            clearSession();
            return null;
        }

        const data = await response.json();
        const userInfo = data?.userInfo;
        if (!userInfo?.accessToken) {
            clearSession();
            return null;
        }

        useStoreZ.setState({
            token: userInfo.accessToken,
            refreshToken: userInfo.refreshToken,
            isAuthenticated: true,
        });

        return userInfo.accessToken;
    } catch (_err) {
        clearSession();
        return null;
    }
};

// Coalesce concurrent refresh attempts onto a single in-flight promise.
const getRefreshedToken = (): Promise<string | null> => {
    if (!refreshPromise) {
        refreshPromise = requestNewToken().finally(() => {
            refreshPromise = null;
        });
    }
    return refreshPromise;
};

const _API = async (method: TMethod, url: string, moreData?: IMoreData) => {
    const sendRequest = () => fetch(HOST + url, buildOptions(method, moreData));

    try {
        let response = await sendRequest();

        // Token expired mid-session: transparently refresh and replay the request
        // once. The refresh endpoint itself is excluded to avoid any loop.
        if (response.status === 401 && url !== REFRESH_URL) {
            const newToken = await getRefreshedToken();
            if (newToken) {
                // buildOptions re-reads the freshly stored access token.
                response = await sendRequest();
            }
        }

        if (response.status === 204) {
            return response;
        }

        const data = await response.json();
        if (!response.ok) {
            throw data;
        }

        return data;
    } catch (err) {
        throw err as Error;
    }
};

export default _API;
