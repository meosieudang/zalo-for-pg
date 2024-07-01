import { Alert, Box, Button, Stack, Typography } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from 'zmp-ui';
import error from '../static/icons/error.png';

const ErrorScreen = ({ onRetry }) => {
    const navi = useNavigate();

    const onCloseApp = async () => {
        navi('/', { replace: true });
    };

    return (
        <Box height={'100vh'} bgcolor={'white'} display={'flex'} flexDirection={'column'}>
            <Header title={'CREGift'} />
            <Box flex={1} />
            <Box flex={4}>
                <img src={error} />
            </Box>
            <Box flex={3}>
                <Stack direction={'column'} spacing={3}>
                    <Typography variant="h6" textAlign={'center'}>{`Opps`}</Typography>
                    <Typography color={'error'} textAlign={'center'}>
                        {'Có lỗi xảy ra! Vui lòng liên hệ với PG!'}
                    </Typography>
                    <Stack p={2} direction={'row'} alignItems={'center'} justifyContent={'center'} spacing={2}>
                        <Button onClick={onCloseApp} variant="outlined">
                            Trở về trang chủ
                        </Button>
                        <Button variant="contained" onClick={onRetry}>{`Thử lại`}</Button>
                    </Stack>
                </Stack>
            </Box>
        </Box>
    );
};

export default ErrorScreen;
