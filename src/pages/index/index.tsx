import React, { useEffect } from 'react';
import { useNavigate } from 'zmp-ui';
import { useRecoilValue } from 'recoil';
import { useAuth } from '../../contexts/AuthContext';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, Container, Grid, Stack, TextField, Typography } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import logo from '../../static/icons/logo_no_bg.png';
import { configAppView } from 'zmp-sdk/apis';
const ERROR_TEXT = 'Trường này không được để trống';

const validationSchema = yup.object({
    code: yup.string().required(ERROR_TEXT)
});

const HomePage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const {
        handleSubmit,
        control,
        formState: { errors },
        reset,
        setValue
    } = useForm({
        defaultValues: {
            code: ''
        },
        resolver: yupResolver(validationSchema)
    });

    const onSubmit = (d, e) => {
        e.target.blur();
        setTimeout(() => {
            navigate('/account-info');
        }, 500);
    };

    useEffect(() => {
        configAppView({
            headerColor: '#f2f2f2',
            actionBar: {
                title: 'CRE Advanced'
            },
            success: () => {
                // xử lý khi gọi api thành công
            },
            fail: (error) => {
                // xử lý khi gọi api thất bại
                console.log(error);
            }
        });
    }, []);

    return (
        <Box
            sx={{
                bgcolor: 'white',
                height: '100vh',
                alignItems: 'center',
                flex: 1,
                display: 'flex',
                flexDirection: 'column'
            }}
        >
            <Stack spacing={4} alignItems={'center'}>
                <img src={logo} style={{ width: 150, height: 150 }} />
                <Typography variant="h5">Vui lòng nhập code quà tặng</Typography>
                <Controller
                    name="code"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            fullWidth
                            required
                            label="Code"
                            {...field}
                            error={Boolean(errors['code'])}
                            helperText={Boolean(errors['code']) && errors['code']?.message}
                        />
                    )}
                />
                <Button onClick={handleSubmit(onSubmit)} size="large" variant="contained">
                    Xác nhận
                </Button>
            </Stack>
        </Box>
    );
};

export default HomePage;
