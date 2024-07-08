// import { store } from 'app/store';
// import { setLogout, setToken } from 'app/store/slices/wsAccount';
import axios, { AxiosError } from 'axios';
import { getStorage } from 'zmp-sdk/apis';
import { getHmacHeaders } from './hmacAuth';
// import { getSession, setSession } from './jwt';

export type ISuccess = {
    message: string;
    success: boolean;
    error: number;
};

const apiKey = 'cre-api-key';
const secretKey = 'cre-mini-app-api';

const axiosZaloMiniServices = axios.create({
    baseURL: 'https://zalo-mini-api.creasia.vn',
    // baseURL: 'https://bb53-115-78-15-204.ngrok-free.app',
    headers: {
        'Content-Type': 'application/json'
    }
});

let refreshTokenPromise: any; // this holds any in-progress token refresh requests

const onResponseError = async (error: AxiosError) => {
    if (error.config && error.response && error.response.status === 401) {
        // const tokenApp = await getSession('accessToken');
        // const state = store.getState()['wsAccount'];

        if (!refreshTokenPromise) {
            console.log('CASE 1');

            // check for an existing in-progress request
            // if nothing is in-progress, start a new refresh token request
            refreshTokenPromise = refreshToken().then((token) => {
                refreshTokenPromise = null; // clear state
                return token; // resolve with the new token
            });
        }

        return refreshTokenPromise.then((res: { token: string; refreshToken: string }) => {
            // console.log('CASE 2', res);
            // if (res.token === tokenApp) return store.dispatch(setLogout() as any);
            // console.log('CASE 2 a');
            // if (res.token === state.token?.token) return;
            // if (res.token) {
            //     setSession(res.token, 'accessToken');
            //     setSession(res.refreshToken, 'refreshToken');
            //     store.dispatch(setToken({ token: res.token, refreshToken: res.refreshToken }) as any);
            //     //@ts-ignore
            //     error.config.headers['Authorization'] = `Bearer ${res.token}`;
            //     console.log(error.config, 'er config');
            //     //@ts-ignore
            //     return axiosZaloMiniServices(error.config);
            // } else {
            //     store.dispatch(setLogout() as any);
            // }
        });
    }
    return Promise.reject(error);
};

const refreshToken = async () => {
    //   const token = await getSession("accessToken");
    //   const refreshToken = await getSession("refreshToken");
    //   if (!refreshToken) {
    //     return;
    //   }
    //   try {
    //     const res: { token: string; refreshToken: string } =
    //       await axiosZaloMiniServices.put(
    //         "/api/authentication/authentication/refreshtoken",
    //         {
    //           token,
    //           refreshToken,
    //         }
    //       );
    //     console.log(res, "res refreshToken");
    //     return res;
    //   } catch (error) {
    return Promise.reject();
    //   }
};

axiosZaloMiniServices.interceptors.request.use(async (config) => {
    const res = await getStorage({ keys: ['key1'] });
    config.headers['Authorization'] = `Bearer ${res.key1}`;

    // const headers = getHmacHeaders(apiKey, secretKey, config.url);
    // config.headers['X-Api-Key'] = headers['X-Api-Key'];
    // config.headers['X-Signature'] = headers['X-Signature'];
    // config.headers['X-Timestamp'] = headers['X-Timestamp'];
    return config;
});

axiosZaloMiniServices.interceptors.response.use((response) => response.data, onResponseError);

export default axiosZaloMiniServices;
