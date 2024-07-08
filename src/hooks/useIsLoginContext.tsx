import { useState } from 'react';
import { getStorage } from 'zmp-sdk/apis';

const useIsLoginContext = () => {
    const [isLogin, setIsLogin] = useState(!!getStorage({ keys: ['key1'] }));

    return {
        isLogin,
        setIsLogin
    };
};

export default useIsLoginContext;
