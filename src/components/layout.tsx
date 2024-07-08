import React, { useEffect } from 'react';
import KeepAlive from 'react-activation';
import { Route, useNavigate } from 'react-router-dom';
import { getSystemInfo } from 'zmp-sdk/apis';
import { AnimationRoutes } from 'zmp-ui';
import { useAuth } from '../contexts/AuthContext';
import CameraPage from '../pages/camera';
import ExchangeGiftStep1 from '../pages/exchange-gift-step-1';
import ExchangeGiftStep2 from '../pages/exchange-gift-step-2';
import ExchangeGiftStep3 from '../pages/exchange-gift-step-3';
import ExchangeGiftStep4 from '../pages/exchange-gift-step-4';
import FirstPage from '../pages/first-page';
import LoginPage from '../pages/login';
import SellOutPage from '../pages/sell-out-page';
import HomePage from '../pages/home';
import OutletPage from '../pages/outlet-page';
import { setSession } from '../utils/jwt';

if (getSystemInfo().platform === 'android') {
    const androidSafeTop = Math.round((window as any).ZaloJavaScriptInterface.getStatusBarHeight() / window.devicePixelRatio);
    document.body.style.setProperty('--zaui-safe-area-inset-top', `${androidSafeTop}px`);
}

// const paramsString2 = "?code=62245zcG&type=3";
const paramsString2 =
    '?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJFbWFpbCI6IiIsIkVtcGxveWVlSWQiOiIxNTcxNSIsIlVzZXJOYW1lIjoiemFsb19kZW1vIiwiQ2FtcGFpZ25JZCI6IjIyMiIsIlBvc2l0aW9uIjoiIiwiUm9sZUlkIjoiMSIsIkVtcGxveWVlQ29kZSI6InphbG9fZGVtbyIsIkVtcGxveWVlTmFtZSI6IlphbG8gQXBwIERlbW8iLCIiOiIiLCJmdWxsTmFtZSI6IlphbG8gQXBwIERlbW8iLCJDYW1wYWlnbk5hbWUiOiIiLCJDYW1wYWlnblR5cGUiOiIiLCJSb2xlcyI6IiIsImp0aSI6IjFjMWNjMTk2LTViNjEtNDVkYy1iMTA0LTQ1YWIyYzNmNDEwOCIsImV4cCI6MTcyMDE0NTU1NCwiaXNzIjoiaHR0cHM6Ly9kb2NzLm1pY3Jvc29mdC5jb20iLCJhdWQiOiJodHRwczovL2RvY3MubWljcm9zb2Z0LmNvbSJ9.K_spcN6CB-6zR-rAqigU6BXThlo_c42Y9PVf9sU5Ig4';
const a = new URLSearchParams(location.search);
// console.log(a.get("code"), window.location.search);

const Layout = () => {
    const navi = useNavigate();
    const { user } = useAuth();

    useEffect(() => {
        if (!user) {
            // return navi('/login', { replace: true });
        }
    }, []);

    useEffect(() => {
        // const locationPath = new URLSearchParams(paramsString2);
        // // // console.log(locationPath.get("type") === TYPE.LUCKY_DRAW);
        // const token = locationPath.get('token');
        // if (locationPath.has('token')) {
        //     setSession(token);
        //     navi('/sell-out-page');
        //     // navi(`account-info/${code}/${type}`);
        //     // return;
        // }
    }, []);

    return (
        <AnimationRoutes>
            <Route path="/" element={<FirstPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/sell-out-page" element={<SellOutPage />} />
            <Route path="/outlet-page" element={<OutletPage />} />
            <Route path="/home-page" element={<HomePage />} />
            <Route
                path="/exchange-gift-step-1"
                element={
                    <KeepAlive name="A">
                        <ExchangeGiftStep1 />
                    </KeepAlive>
                }
            />
            <Route path="/exchange-gift-step-2" element={<ExchangeGiftStep2 />} />
            <Route path="/exchange-gift-step-3" element={<ExchangeGiftStep3 />} />
            <Route
                path="/exchange-gift-step-4"
                element={
                    <KeepAlive name="B">
                        <ExchangeGiftStep4 />
                    </KeepAlive>
                }
            />
            <Route path="/camera" element={<CameraPage />} />
            {/* <Route path="/account-info/:code/:type?" element={<AccountInfo />}></Route>
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
            <Route path="/gift-detail" element={<GiftDetailPage />}></Route> */}
        </AnimationRoutes>
    );
};

export default Layout;
