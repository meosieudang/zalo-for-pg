import React, { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getStorage } from 'zmp-sdk/apis';
import { setSession, verifyToken } from '../utils/jwt';

const FirstPage = () => {
    const navi = useNavigate();
    const getLocalStorageItem = async () => {
        const res = await getStorage({ keys: ['key1'] });
        console.log(res);

        if (res.key1) {
            const isExpired = verifyToken(res.key1);
            if (!isExpired) {
                Swal.fire({
                    title: 'Lỗi',
                    text: 'Phiên đăng nhập hết hạn, vui lòng đăng nhập lại!',
                    icon: 'error',
                    customClass: {
                        container: 'my-swal'
                    },
                    confirmButtonColor: '#3085d6',
                    allowOutsideClick: false
                }).then(async (result) => {
                    if (result.isConfirmed) {
                        setSession(undefined);
                        navi('/login', { replace: true });
                    }
                });
            } else {
                navi('/home-page', { replace: true });
            }
            return;
        }

        return navi('/login', { replace: true });
    };

    useEffect(() => {
        getLocalStorageItem();
    }, []); // Empty dependency array to run only on initial render

    return null;
};

export default FirstPage;
