import { yupResolver } from '@hookform/resolvers/yup';
import LoadingButton from '@mui/lab/LoadingButton';
import { Box, Stack, TextField, Typography } from '@mui/material';
import React from 'react';
import { useController, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { useLoginMutation } from '../hooks/useApiv2';
import logo from '../static/icons/logo.png';
import { LoginRequest } from '../types/zaloMiniTypes';
import { ERROR_TEXT } from '../constant';

const validationSchema = yup.object({
    userName: yup.string().required(ERROR_TEXT),
    password: yup.string().max(255).required(ERROR_TEXT)
});

const LoginPage = () => {
    const mLogin = useLoginMutation();
    const {
        control,
        handleSubmit,
        formState: { errors }
    } = useForm<LoginRequest>({
        defaultValues: {
            userName: '',
            password: ''
        },
        resolver: yupResolver(validationSchema)
    });
    const onSubmit = (d: LoginRequest) => mLogin.mutate(d);
    const { field: fieldA } = useController({ control, name: 'userName' });
    const { field: fieldB } = useController({ control, name: 'password' });
    return (
        <Box p={2} flex={1} height={'100vh'} bgcolor={'white'} display={'flex'} justifyContent={'center'} flexDirection={'column'}>
            <Box flex={1} />

            <img src={logo} style={{ alignSelf: 'center', objectFit: 'contain', height: 200 }} />

            <Stack spacing={2} flex={1}>
                <Typography
                    textTransform={'uppercase'}
                    variant="h4"
                    align="center"
                    // sx={{
                    //     backgroundcolor: 'primary',
                    //     backgroundImage: `linear-gradient(45deg, #5514B4, #FF80FF)`,
                    //     backgroundSize: '100%',
                    //     backgroundRepeat: 'repeat',
                    //     backgroundClip: 'text',
                    //     WebkitBackgroundClip: 'text',
                    //     WebkitTextFillColor: 'transparent'
                    // }}
                >
                    Đăng nhập
                </Typography>

                <TextField
                    inputProps={{
                        autoCapitalize: 'none'
                    }}
                    label="Tài khoản"
                    {...fieldA}
                    error={Boolean(errors.userName)}
                    helperText={errors.userName?.message}
                />
                <TextField
                    type="password"
                    autoComplete="current-password"
                    label="Mật khẩu"
                    {...fieldB}
                    error={Boolean(errors.password)}
                    helperText={errors.password?.message}
                />

                <LoadingButton loading={mLogin.isPending} onClick={handleSubmit(onSubmit)} variant="contained" size="large">
                    {`Đăng nhập`}
                </LoadingButton>
            </Stack>
            <Box flex={2} />
        </Box>
    );
};

export default LoginPage;
