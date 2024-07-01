import React, { useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { getSystemInfo } from 'zmp-sdk/apis';
import Home from '../pages/home';
import QRCode from '../pages/qr-code';
import AccountInfo from '../pages/account-info';
import Game from '../pages/game';
import UserPage from '../pages/user';
import { TYPE } from '../constant';
import SchemePage from '../pages/scheme';
import { AnimationRoutes } from 'zmp-ui';
import WelcomeGame from '../pages/welcome-game';
import RewardPage from '../pages/reward';
import HomeByCampaign from '../pages/home-by-campaign';
import PointHistory from '../pages/point-history';
import MyGiftPage from '../pages/my-gift';
import GiftDetailPage from '../pages/gift-detail';

if (getSystemInfo().platform === 'android') {
    const androidSafeTop = Math.round((window as any).ZaloJavaScriptInterface.getStatusBarHeight() / window.devicePixelRatio);
    document.body.style.setProperty('--zaui-safe-area-inset-top', `${androidSafeTop}px`);
}

// const paramsString2 = "?code=62245zcG&type=3";
const paramsString2 = '?code=45KRFGn314&type=2';
const a = new URLSearchParams(location.search);
// console.log(a.get("code"), window.location.search);

const Layout = () => {
    const navi = useNavigate();
    useEffect(() => {
        const locationPath = new URLSearchParams(location.search);
        // console.log(locationPath.get("type") === TYPE.LUCKY_DRAW);
        const code = locationPath.get('code');
        const type = locationPath.get('type');
        return navi(`account-info/${code}/${type}`);
    }, []);

    return (
        <AnimationRoutes>
            <Route path="/" element={<Home />}></Route>
            <Route path="/account-info/:code/:type?" element={<AccountInfo />}></Route>
            <Route path="/scheme/:code/:type?" element={<SchemePage />}></Route>
            <Route path="/notification" element={<></>}></Route>
            <Route path="/game/:code/:type?" element={<Game />}></Route>
            <Route path="/user" element={<UserPage />}></Route>
            <Route path="/qr-code/:code?" element={<QRCode />}></Route>
            <Route path="/reward/:campaignId?" element={<RewardPage />}></Route>
            <Route path="/home-by-campaign/:campaignId/:campaignName?" element={<HomeByCampaign />}></Route>
            <Route path="/welcome-game/:code?" element={<WelcomeGame />}></Route>
            <Route path="/point-history/:campaignId?" element={<PointHistory />}></Route>
            <Route path="/my-gift/:campaignId?" element={<MyGiftPage />}></Route>
            <Route path="/gift-detail" element={<GiftDetailPage />}></Route>
        </AnimationRoutes>
    );
};

export default Layout;
