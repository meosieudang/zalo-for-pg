import jwtDecode from 'jwt-decode';
import { clearStorage, getStorage, removeStorage, setStorage } from 'zmp-sdk/apis';
import axiosAdvancedServices from './axiosAdvancedServices';
import { KeyedObject } from '../types';
import axiosZaloMiniServices from './axiosZaloMiniServices';

const verifyToken: (st: string) => boolean = (serviceToken) => {
    if (!serviceToken) {
        return false;
    }
    const decoded: KeyedObject = jwtDecode(serviceToken);
    /**
     * Property 'exp' does not exist on type '<T = unknown>(token: string, options?: JwtDecodeOptions | undefined) => T'.
     */
    return decoded.exp > Date.now() / 1000;
};

const setSession = async (serviceToken?: string | null, key = '') => {
    console.log('session', serviceToken);

    if (serviceToken) {
        await setStorage({
            data: { key1: serviceToken }
        });
        axiosZaloMiniServices.defaults.headers.common.Authorization = `Bearer ${serviceToken}`;
    } else {
        await removeStorage({ keys: ['key1'] });
        delete axiosZaloMiniServices.defaults.headers.common.Authorization;
    }
};

export { setSession, verifyToken };
