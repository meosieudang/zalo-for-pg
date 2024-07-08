import { Box, CircularProgress, Stack, Typography } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from 'zmp-ui';

const LoadingScreen = () => {
    return (
        <Box height={'100vh'} flex={1} bgcolor={'white'} display={'flex'} flexDirection={'column'}>
            <Header title={'CRE Advanced'} showBackIcon={false} />
            <Stack spacing={2} justifyContent={'center'} alignItems={'center'} flex={1}>
                <CircularProgress />
                <Typography>{`Loading...`}</Typography>
            </Stack>
        </Box>
    );
};

export default LoadingScreen;
