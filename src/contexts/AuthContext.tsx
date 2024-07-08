// src/AuthContext.ts
import React, { createContext, useState, useContext, useEffect, useRef } from 'react';
import { clearStorage, closeApp, getStorage, removeStorage, setStorage } from 'zmp-sdk/apis';
import usePermissionZalo from '../hooks/usePermissionZalo';
import ModalRequestPermission from '../components/modal-request-permission';
import { verifyToken } from '../utils/jwt';
import axiosAdvancedServices from '../utils/axiosAdvancedServices';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext<AuthContextValue>({
    user: null,
    login: (data) => {},
    logout: () => {},
    showModalPermission: () => {},
    checkAuthorize: () => {},
    phoneNumberZalo: '',
    hasAuthor: false
});

export const AuthProvider = ({ children }) => {
    console.log('zoo');

    const [user, setUser] = useState(null);
    const [phoneNumberZalo, setPhoneNumberZalo] = useState('');
    const [accessTokenZalo, setAccessTokenZalo] = useState(null);
    const [hasAuthor, setHasAuthor] = useState(false);
    const refModal = useRef<{ toggle: () => void }>(null);
    const showModalPermission = () => refModal.current?.toggle();
    // const { mFetchInfoNumber, mAuthorize, mAuthorizedState, mGetAccessToken, mGetPhoneNumber, mGetUserState } = usePermissionZalo({
    //     mAuthorizedStateSuccess(authSetting) {
    //         if (!authSetting['scope.userInfo'] || !authSetting['scope.userPhonenumber']) {
    //             refModal.current?.toggle();
    //         } else {
    //             setHasAuthor(true);
    //         }
    //     },
    //     mAuthorizeSuccess(d) {
    //         mGetAccessToken.mutate();
    //         mGetPhoneNumber.mutate();
    //         mGetUserState.mutate();
    //         refModal.current?.toggle();
    //     },
    //     mGetAccessTokenSuccess(d) {
    //         setAccessTokenZalo(d);
    //     },
    //     mGetPhoneNumberSuccess(code) {
    //         mFetchInfoNumber.mutate({
    //             code: code ?? '',
    //             access_token: accessTokenZalo ?? ''
    //         });
    //     },
    //     mGetUserStateSuccess(d) {
    //         setUser(d);
    //     },
    //     mFetchInfoNumberSuccess(d) {
    //         setPhoneNumberZalo(d);
    //     }
    // });

    // useEffect(() => {
    //     if (hasAuthor) {
    //         mGetPhoneNumber.mutate();
    //         mGetUserState.mutate();
    //     }
    // }, [hasAuthor]);

    // useEffect(() => {
    //     // refModal.current?.toggle();
    //     // mGetAccessToken.mutate();
    // }, []);

    const checkAuthorize = () => {};

    // const getLocalStorageItem = async () => {
    //     // const navi = useNavigate();

    //     const res = await getStorage({ keys: ['key1'] });
    //     console.log(res, 'get', axiosAdvancedServices.defaults);
    //     if (res.key1) {
    //         const isExpired = verifyToken(res.key1);
    //         if (!isExpired) {
    //             Swal.fire({
    //                 title: 'Lỗi',
    //                 text: 'Phiên đăng nhập hết hạn, vui lòng đăng nhập lại!',
    //                 icon: 'error',
    //                 customClass: {
    //                     container: 'my-swal'
    //                 },
    //                 confirmButtonColor: '#3085d6'
    //             }).then(async (result) => {
    //                 if (result.isConfirmed) {
    //                     // navi('/login');
    //                 }
    //             });
    //         } else {
    //             // navi('/home');
    //         }
    //     }
    //     return res;
    // };

    // useEffect(() => {
    //     getLocalStorageItem();
    //     console.log('AuthProvider');
    // }, []); // Empty dependency array to run only on initial render

    const login = async (data: { username: string; password: string }) => {
        // Simulate authentication (replace with your backend integration)
        const simulatedToken = 'your_auth_token';
        // setUser({ username: data.username, token: simulatedToken });
        setStorage({
            data: {
                accessToken: simulatedToken,
                username: data.username
            },
            success: (data) => {
                // xử lý khi gọi api thành công
                const { errorKeys } = data;
                console.log(errorKeys, 'erk');
            },
            fail: (error) => {
                // xử lý khi gọi api thất bại
                console.log(error);
            }
        });
    };

    const logout = () => {
        removeStorage({ keys: ['key1'] });
        setUser(null);
    };

    const onAccept = () => {};

    return (
        <AuthContext.Provider
            value={{
                user,
                login,
                logout,
                showModalPermission,
                phoneNumberZalo,
                checkAuthorize,
                hasAuthor
            }}
        >
            {children}
            {/* <ModalRequestPermission ref={refModal} onAccept={onAccept} /> */}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
