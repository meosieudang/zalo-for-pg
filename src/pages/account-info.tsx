import { yupResolver } from '@hookform/resolvers/yup';
import LoadingButton from '@mui/lab/LoadingButton';
import { Box, Stack, TextField, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import * as yup from 'yup';
import { Header } from 'zmp-ui';
import LoadingScreen from '../components/loading-screen';
import { TYPE } from '../constant';
import { useAuth } from '../contexts/AuthContext';
import { useConfirmMutation, useGetDataFromQRCode } from '../hooks/useApiv2';
import { Confirm, ReportContent } from '../types/api';
import GiftItem from './index/gift-item';
const ERROR_TEXT = 'Trường này không được để trống';
const ERROR_PHONE = 'SĐT không hợp lệ';

const regexPhoneVN = /((^(\+84|84|0|0084){1})(3|5|7|8|9))+([0-9]{8})$/;

const validationSchema = yup.object({
    fullName: yup.string(),
    phoneNumber: yup.string(),
    phoneNumberOther: yup.string().matches(regexPhoneVN, { excludeEmptyString: true, message: ERROR_PHONE }).nullable().notRequired(),
    fullNameOther: yup.string().when('fullName', {
        is: (v) => Boolean(v),
        then: () => yup.string().required(ERROR_TEXT)
    }),
    // fullNameOther: yup.string().required(ERROR_TEXT),
    orderCode: yup.string()
});

const AccountInfo: React.FunctionComponent = () => {
    const navigate = useNavigate();
    const { code, type } = useParams<{ code: string; type: TYPE }>();
    const { state } = useLocation();
    console.log(state, 'state');

    const { showModalPermission, user, phoneNumberZalo, checkAuthorize, hasAuthor } = useAuth();

    const mConfirm = useConfirmMutation({
        confirmSuccess: (v: Confirm) => {
            if (type === TYPE.LUCKY_DRAW) {
                return navigate(`/game/${code}/${type}`, { replace: true, state: v });
            }
            if (type === TYPE.SCHEME) {
                return navigate(`/scheme/${code}/${type}`, { replace: true, state: v });
            }
            return navigate(`/qr-code/${code}`, { replace: true });
        }
    });
    const qGetDataFromQRCode = useGetDataFromQRCode({ orderCode: code });

    const qrCodeData = qGetDataFromQRCode.data?.data;
    // const luckyDrawGiftData = qGetDataLuckyGift.data?.data;

    console.log(user, phoneNumberZalo, 'AccountInfo', qrCodeData);
    const content: ReportContent = qrCodeData && JSON?.parse(qrCodeData?.content ?? '');

    const {
        handleSubmit,
        control,
        formState: { errors },
        reset,
        setValue
    } = useForm({
        defaultValues: {
            fullName: '',
            phoneNumber: '',
            orderCode: '',
            phoneNumberOther: '',
            fullNameOther: ''
        },
        resolver: yupResolver(validationSchema)
    });

    useEffect(() => {
        console.log(user, phoneNumberZalo, 'ppppp', code);
        if (user && phoneNumberZalo) {
            reset({
                fullName: user.name,
                phoneNumber: phoneNumberZalo,
                orderCode: code ?? '',
                fullNameOther: user.name
            });
        }
    }, [user, phoneNumberZalo, code]);

    useEffect(() => {
        setTimeout(() => {
            checkAuthorize();
        }, 500);
    }, []);

    const onSubmit = (d: Confirm) => {
        console.log(user, 'user');

        if (!user) {
            checkAuthorize();
            return;
        }
        console.log(d, 'dd');
        // const giftsD = type === TYPE.SCHEME ? state : type === TYPE.LUCKY_DRAW ? luckyDrawGiftData : [];
        const dataAPI: Confirm & { zaloUserId: string; isOnlyUserInfo: boolean; type?: TYPE } = {
            ...d,
            // gifts: JSON.stringify(giftsD),
            zaloUserId: user?.id,
            isOnlyUserInfo: true,
            type
        };

        mConfirm.mutate(dataAPI);
    };
    console.log(errors, 'errors form');

    const onBackClick = () => {
        if (type === TYPE.SCHEME) {
            const a = confirm('Bạn có muốn chọn lại quà tặng không?');
            if (a) {
                navigate(-1);
            }
            return;
        } else {
            const b = confirm('Bạn có muốn thoát?');
            if (b) {
                navigate('/', { replace: true });
            }
        }
    };

    if (qGetDataFromQRCode.isLoading) return <LoadingScreen />;

    // if (qGetDataFromQRCode.error || qGetDataLuckyGift.error)
    //     return <ErrorScreen onRetry={qGetDataFromQRCode.refetch || qGetDataLuckyGift.refetch} />;
    return (
        <Box height={'100vh'} justifyContent={'center'} display={'flex'} flexDirection={'column'}>
            <Header title={qrCodeData?.shopName ?? 'CREGift'} onBackClick={onBackClick} />
            <Stack mt={1} bgcolor={'white'}>
                <Typography color={'primary.main'} variant="subtitle1" px={2} pt={1}>{`Thông tin người nhận quà`}</Typography>
                <Stack gap={2} bgcolor={'white'} p={2}>
                    <Controller
                        name="fullName"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                required
                                label="Tên Zalo của Anh/ Chị"
                                {...field}
                                error={Boolean(errors['fullName'])}
                                helperText={Boolean(errors['fullName']) && errors['fullName']?.message}
                                disabled
                            />
                        )}
                    />
                    <Controller
                        name="phoneNumber"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                required
                                label="Số điện thoại"
                                {...field}
                                error={Boolean(errors['phoneNumber'])}
                                helperText={Boolean(errors['phoneNumber']) && errors['phoneNumber']?.message}
                                disabled
                            />
                        )}
                    />
                    <Controller
                        name="phoneNumberOther"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                label="Số điện thoại liên hệ khác (nếu có)"
                                error={Boolean(errors['phoneNumberOther'])}
                                helperText={Boolean(errors['phoneNumberOther']) && errors['phoneNumberOther']?.message}
                                {...field}
                            />
                        )}
                    />
                    <Controller
                        name="fullNameOther"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                required
                                label="Tên của Anh/ Chị"
                                {...field}
                                error={Boolean(errors['fullNameOther'])}
                                helperText={Boolean(errors['fullNameOther']) && errors['fullNameOther']?.message}
                            />
                        )}
                    />
                </Stack>
            </Stack>

            <Stack mt={1} bgcolor={'white'} overflow={'scroll'}>
                <Typography color={'primary.main'} variant="subtitle1" px={2} pt={1}>{`Thông tin quà tặng`}</Typography>
                {type === TYPE.SCHEME && (
                    <Stack overflow={'scroll'} p={2} gap={2}>
                        {(state ?? []).map((t) => (
                            <GiftItem key={t.giftId} {...t} createdDate={qrCodeData?.createdDate?.toString()} />
                        ))}
                    </Stack>
                )}
                {type === TYPE.DEFAULT && (
                    <Stack overflow={'scroll'} p={2} gap={2}>
                        {(content?.gifts ?? []).map((t) => (
                            <GiftItem key={t.giftId} {...t} createdDate={qrCodeData?.createdDate?.toString()} />
                        ))}
                    </Stack>
                )}

                {type === TYPE.LUCKY_DRAW && (
                    <Stack overflow={'scroll'} p={2} gap={2}>
                        {/* @ts-ignore */}
                        <GiftItem giftName="Vòng quay may mắn" quantity={1} createdDate={qrCodeData?.createdDate?.toString()} />
                    </Stack>
                )}
                {type === TYPE.SCHEME && (
                    <Stack overflow={'scroll'} p={2} gap={2}>
                        {/* @ts-ignore */}
                        <GiftItem giftName="Quà chọn tùy thích" quantity={1} createdDate={qrCodeData?.createdDate?.toString()} />
                    </Stack>
                )}
            </Stack>

            <div style={{ flex: 1, background: 'white' }} />
            <Stack px={2} pt={1} bgcolor={'white'}>
                <LoadingButton
                    onClick={handleSubmit(onSubmit)}
                    size="large"
                    fullWidth
                    variant="contained"
                    disabled={Boolean(qGetDataFromQRCode.error)}
                    loading={mConfirm.isPending}
                >
                    {_.includes([TYPE.SCHEME, TYPE.LUCKY_DRAW], type) ? `Tiếp theo` : `Xác nhận`}
                </LoadingButton>
            </Stack>
        </Box>
    );
};

export default AccountInfo;
