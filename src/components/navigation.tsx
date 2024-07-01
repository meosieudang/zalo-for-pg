import React, { useMemo } from 'react';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { useVirtualKeyboardVisible } from '../hooks/useVirtualKeyboardVisible';

const tabs = {
    '/': {
        label: 'Trang chủ',
        icon: <HomeRoundedIcon />
    },
    '/phone': {
        label: 'Liên hệ',
        icon: <LocalPhoneIcon />
    },
    '/user': {
        label: 'Cá nhân',
        icon: <AccountCircleIcon />
    }
};

export const NO_BOTTOM_NAVIGATION_PAGES = ['/account-info', '/qr-code/', '/game', '/scheme'];

const Navigation = () => {
    const [value, setValue] = React.useState(0);
    const navigate = useNavigate();
    const keyboardVisible = useVirtualKeyboardVisible();
    const location = useLocation();

    const noBottomNav = useMemo(() => {
        return NO_BOTTOM_NAVIGATION_PAGES.includes(location.pathname);
    }, [location]);

    if (
        noBottomNav ||
        keyboardVisible ||
        location.pathname.startsWith('/qr') ||
        location.pathname.startsWith('/scheme') ||
        location.pathname.startsWith('/account') ||
        location.pathname.startsWith('/game') ||
        location.pathname.startsWith('/welcome') ||
        location.pathname.startsWith('/home-by') ||
        location.pathname.startsWith('/reward') ||
        location.pathname.startsWith('/point-history') ||
        location.pathname.startsWith('/my-gift') ||
        location.pathname.startsWith('/gift-detail')
    ) {
        return <></>;
    }

    const handleChange = (path: string) => {
        if (path === '/phone') {
            window.open('tel:1900996672');
            return;
        }
        return navigate(path, { replace: true });
    };

    return (
        <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
            <BottomNavigation
                showLabels
                value={value}
                onChange={(event, newValue) => {
                    if (newValue === 1) {
                        return;
                    }
                    setValue(newValue);
                }}
            >
                {Object.keys(tabs).map((path: any) => (
                    <BottomNavigationAction key={path} label={tabs[path].label} icon={tabs[path].icon} onClick={() => handleChange(path)} />
                ))}
            </BottomNavigation>
        </Paper>
    );
};
export default Navigation;
