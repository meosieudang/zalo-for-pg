import { Box, Button, LinearProgress, Paper, Stack, Typography, linearProgressClasses } from '@mui/material';
import React from 'react';
import { useLocation } from 'react-router-dom';
import { RewardItemData } from '../types/api';
import { Header } from 'zmp-ui';
import { BASE_URL_IMG } from '../constant';
import { styled } from '@mui/material/styles';
import { useCreateRedeemMutation, useGetLoyaltyPointTotal } from '../hooks/useApiv2';
import { useAuth } from '../contexts/AuthContext';
import { refPointBox } from '../components/point-box';

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
    height: 5,
    borderRadius: 5,
    [`&.${linearProgressClasses.colorPrimary}`]: {
        backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800]
    },
    [`& .${linearProgressClasses.bar}`]: {
        borderRadius: 5,
        backgroundColor: theme.palette.mode === 'light' ? '#1a90ff' : '#308fe8'
    }
}));

const GiftDetailPage = () => {
    const { user } = useAuth();
    const { state }: { state: RewardItemData & { fromMyGift?: boolean } } = useLocation() ?? {};
    const qGetLoyaltyPointTotal = useGetLoyaltyPointTotal({
        zaloId: user?.id ?? null
    });
    console.log(user);

    const d = _.find(qGetLoyaltyPointTotal.data?.data, (t) => t.campaignId === Number(state.campaignId));
    const mCreateRedeem = useCreateRedeemMutation({
        createRedeemSuccess: () => {
            refPointBox.current?.fetchData();
            qGetLoyaltyPointTotal.refetch();
        }
    });
    const onPress = () => {
        Swal.fire({
            title: 'Bạn có chắc chắn?',
            text: `Bạn sẽ đổi ${state?.giftName}!`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Có, đổi ngay',
            cancelButtonText: 'Không',
            customClass: {
                container: 'my-swal'
            }
        }).then((result) => {
            if (result.isConfirmed) {
                mCreateRedeem.mutate({
                    campaignId: Number(state?.campaignId),
                    userUniqueId: user?.id ?? '',
                    giftId: state?.giftId,
                    point: 1
                });
            }
        });
    };
    return (
        <Box
            sx={{
                backgroundImage:
                    'linear-gradient(to bottom, #d32f2f, #d32f2f, #d32f2f, #d32f2f, #d32f2f, #de3f4d, #e65169, #eb6484, #ed8fb9, #ebb7df, #edddf5, #ffffff)'
            }}
            height={'100vh'}
            display={'flex'}
            flexDirection={'column'}
        >
            <Header title={'Chi tiết'} style={{ background: 'transparent' }} textColor={'white'} />
            <Paper sx={{ m: 2, height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}>
                <img src={`${BASE_URL_IMG}${state?.giftWinImage || state?.giftIcon}`} style={{ width: 180, height: 180 }} />
            </Paper>
            <Box mx={2} display={'flex'} flexDirection={'column'} flex={1}>
                <Typography color={'white'} variant="h6" fontWeight={'500'}>
                    {state?.giftName}
                </Typography>
                {/* <Typography>{moment(state.createdDate).format('DD/MM/YYYY')}</Typography> */}
                <Stack spacing={1} sx={{ my: 1.5, width: '100%' }}>
                    <BorderLinearProgress variant="determinate" value={50} />
                    <Typography color={'white'}>{`${d?.totalPoint} / ${1}`}</Typography>
                </Stack>

                <Typography fontWeight={'500'} color={'white'}>{`Thông tin sản phẩm:`}</Typography>
                <Typography color={'white'} variant="subtitle2">
                    {state?.giftMessage}
                </Typography>

                <Box flex={1} />

                {state?.fromMyGift ? null : <Button onClick={onPress} variant="contained" size="large" fullWidth>{`Đổi quà`}</Button>}
            </Box>
        </Box>
    );
};

export default GiftDetailPage;
