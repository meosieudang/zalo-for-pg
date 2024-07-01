import { Box, Grid } from '@mui/material';
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PullToRefresh from 'react-simple-pull-to-refresh';
import Swal from 'sweetalert2';
import { Header } from 'zmp-ui';
import ErrorScreen from '../components/error-screen';
import LoadingScreen from '../components/loading-screen';
import PointBox, { refPointBox } from '../components/point-box';
import RewardItem from '../components/reward-item';
import { BASE_URL_IMG } from '../constant';
import { useAuth } from '../contexts/AuthContext';
import { useCreateRedeemMutation, useGetReward } from '../hooks/useApiv2';
import { RewardItemData } from '../types/api';

const RewardPage = () => {
    const { campaignId } = useParams();
    const { user } = useAuth();
    const navi = useNavigate();
    const qGetReward = useGetReward({ campaignId });
    const mCreateRedeem = useCreateRedeemMutation({
        createRedeemSuccess: () => {
            qGetReward.refetch();
            refPointBox.current?.fetchData();
        }
    });
    const d = {
        status: 'success',
        data: [
            {
                quantity: null,
                id: 282,
                giftId: 282,
                campaignId: 222,
                giftName: 'Ca Nhựa',
                giftMessage: 'Ca Nhựa',
                giftIcon: '/UploadFiles/LuckyWheels/222_zalo-mini-app-demo/gift-icon_346567.png',
                giftBackground: '',
                giftWinImage: '/UploadFiles/LuckyWheels/222_zalo-mini-app-demo/gift-win_068414.png',
                giftBackgroundColor: '',
                defaultRate: 0,
                totalQuantity: 0,
                totalUsed: 8,
                giftIndex: null,
                isWin: false,
                createdDate: '2024-06-13T10:31:43.217',
                provinceApply: null,
                productApply: null,
                channelApply: null,
                isLuckyDraw: true,
                isTakeGift: false
            },
            {
                quantity: null,
                id: 283,
                giftId: 283,
                campaignId: 222,
                giftName: 'Quạt để bàn',
                giftMessage: 'Quạt để bàn',
                giftIcon: '/UploadFiles/LuckyWheels/222_zalo-mini-app-demo/gift-icon_312723.png',
                giftBackground: '',
                giftWinImage: '/UploadFiles/LuckyWheels/222_zalo-mini-app-demo/gift-win_970516.png',
                giftBackgroundColor: '',
                defaultRate: 0,
                totalQuantity: 0,
                totalUsed: 9,
                giftIndex: null,
                isWin: false,
                createdDate: '2024-06-13T10:32:22.757',
                provinceApply: null,
                productApply: null,
                channelApply: null,
                isLuckyDraw: true,
                isTakeGift: false
            },
            {
                quantity: null,
                id: 284,
                giftId: 284,
                campaignId: 222,
                giftName: 'Máy Lạnh',
                giftMessage: 'Máy Lạnh',
                giftIcon: '/UploadFiles/LuckyWheels/222_zalo-mini-app-demo/gift-icon_138887.png',
                giftBackground: '',
                giftWinImage: '/UploadFiles/LuckyWheels/222_zalo-mini-app-demo/gift-win_425484.png',
                giftBackgroundColor: '',
                defaultRate: 0,
                totalQuantity: 0,
                totalUsed: 14,
                giftIndex: null,
                isWin: false,
                createdDate: '2024-06-13T10:33:01.057',
                provinceApply: null,
                productApply: null,
                channelApply: null,
                isLuckyDraw: true,
                isTakeGift: false
            },
            {
                quantity: null,
                id: 285,
                giftId: 285,
                campaignId: 222,
                giftName: 'Quạt Điều Hòa',
                giftMessage: 'Quạt Điều Hòa',
                giftIcon: '/UploadFiles/LuckyWheels/222_zalo-mini-app-demo/gift-icon_038893.png',
                giftBackground: '',
                giftWinImage: '/UploadFiles/LuckyWheels/222_zalo-mini-app-demo/gift-win_276227.png',
                giftBackgroundColor: '',
                defaultRate: 0,
                totalQuantity: 0,
                totalUsed: 8,
                giftIndex: null,
                isWin: false,
                createdDate: '2024-06-13T10:33:56.177',
                provinceApply: null,
                productApply: null,
                channelApply: null,
                isLuckyDraw: true,
                isTakeGift: false
            },
            {
                quantity: null,
                id: 285,
                giftId: 285,
                campaignId: 222,
                giftName: 'Quạt Điều Hòa',
                giftMessage: 'Quạt Điều Hòa',
                giftIcon: '/UploadFiles/LuckyWheels/222_zalo-mini-app-demo/gift-icon_038893.png',
                giftBackground: '',
                giftWinImage: '/UploadFiles/LuckyWheels/222_zalo-mini-app-demo/gift-win_276227.png',
                giftBackgroundColor: '',
                defaultRate: 0,
                totalQuantity: 0,
                totalUsed: 8,
                giftIndex: null,
                isWin: false,
                createdDate: '2024-06-13T10:33:56.177',
                provinceApply: null,
                productApply: null,
                channelApply: null,
                isLuckyDraw: true,
                isTakeGift: false
            },
            {
                quantity: null,
                id: 285,
                giftId: 285,
                campaignId: 222,
                giftName: 'Quạt Điều Hòa',
                giftMessage: 'Quạt Điều Hòa',
                giftIcon: '/UploadFiles/LuckyWheels/222_zalo-mini-app-demo/gift-icon_038893.png',
                giftBackground: '',
                giftWinImage: '/UploadFiles/LuckyWheels/222_zalo-mini-app-demo/gift-win_276227.png',
                giftBackgroundColor: '',
                defaultRate: 0,
                totalQuantity: 0,
                totalUsed: 8,
                giftIndex: null,
                isWin: false,
                createdDate: '2024-06-13T10:33:56.177',
                provinceApply: null,
                productApply: null,
                channelApply: null,
                isLuckyDraw: true,
                isTakeGift: false
            },
            {
                quantity: null,
                id: 285,
                giftId: 285,
                campaignId: 222,
                giftName: 'Quạt Điều Hòa',
                giftMessage: 'Quạt Điều Hòa',
                giftIcon: '/UploadFiles/LuckyWheels/222_zalo-mini-app-demo/gift-icon_038893.png',
                giftBackground: '',
                giftWinImage: '/UploadFiles/LuckyWheels/222_zalo-mini-app-demo/gift-win_276227.png',
                giftBackgroundColor: '',
                defaultRate: 0,
                totalQuantity: 0,
                totalUsed: 8,
                giftIndex: null,
                isWin: false,
                createdDate: '2024-06-13T10:33:56.177',
                provinceApply: null,
                productApply: null,
                channelApply: null,
                isLuckyDraw: true,
                isTakeGift: false
            },
            {
                quantity: null,
                id: 285,
                giftId: 285,
                campaignId: 222,
                giftName: 'Quạt Điều Hòa',
                giftMessage: 'Quạt Điều Hòa',
                giftIcon: '/UploadFiles/LuckyWheels/222_zalo-mini-app-demo/gift-icon_038893.png',
                giftBackground: '',
                giftWinImage: '/UploadFiles/LuckyWheels/222_zalo-mini-app-demo/gift-win_276227.png',
                giftBackgroundColor: '',
                defaultRate: 0,
                totalQuantity: 0,
                totalUsed: 8,
                giftIndex: null,
                isWin: false,
                createdDate: '2024-06-13T10:33:56.177',
                provinceApply: null,
                productApply: null,
                channelApply: null,
                isLuckyDraw: true,
                isTakeGift: false
            },
            {
                quantity: null,
                id: 285,
                giftId: 285,
                campaignId: 222,
                giftName: 'Quạt Điều Hòa',
                giftMessage: 'Quạt Điều Hòa',
                giftIcon: '/UploadFiles/LuckyWheels/222_zalo-mini-app-demo/gift-icon_038893.png',
                giftBackground: '',
                giftWinImage: '/UploadFiles/LuckyWheels/222_zalo-mini-app-demo/gift-win_276227.png',
                giftBackgroundColor: '',
                defaultRate: 0,
                totalQuantity: 0,
                totalUsed: 8,
                giftIndex: null,
                isWin: false,
                createdDate: '2024-06-13T10:33:56.177',
                provinceApply: null,
                productApply: null,
                channelApply: null,
                isLuckyDraw: true,
                isTakeGift: false
            },
            {
                quantity: null,
                id: 285,
                giftId: 285,
                campaignId: 222,
                giftName: 'Quạt Điều Hòa',
                giftMessage: 'Quạt Điều Hòa',
                giftIcon: '/UploadFiles/LuckyWheels/222_zalo-mini-app-demo/gift-icon_038893.png',
                giftBackground: '',
                giftWinImage: '/UploadFiles/LuckyWheels/222_zalo-mini-app-demo/gift-win_276227.png',
                giftBackgroundColor: '',
                defaultRate: 0,
                totalQuantity: 0,
                totalUsed: 8,
                giftIndex: null,
                isWin: false,
                createdDate: '2024-06-13T10:33:56.177',
                provinceApply: null,
                productApply: null,
                channelApply: null,
                isLuckyDraw: true,
                isTakeGift: false
            }
        ],
        error: null
    };

    const onPressExchange = (item: RewardItemData) => {
        Swal.fire({
            title: 'Bạn có chắc chắn?',
            text: `Bạn sẽ đổi ${item.giftName}!`,
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
                    campaignId: Number(campaignId),
                    userUniqueId: user?.id ?? '',
                    giftId: item.giftId,
                    point: 1
                });
            }
        });
    };

    if (qGetReward.isLoading) return <LoadingScreen />;

    if (qGetReward.error) return <ErrorScreen onRetry={qGetReward.refetch} />;

    return (
        <Box
            height={'100vh'}
            bgcolor={'white'}
            display={'flex'}
            flexDirection={'column'}
            sx={{
                backgroundImage:
                    'linear-gradient(to bottom, #d32f2f, #d32f2f, #d32f2f, #d32f2f, #d32f2f, #de3f4d, #e65169, #eb6484, #ed8fb9, #ebb7df, #edddf5, #ffffff)'
            }}
        >
            <Header title="Đổi Quà" style={{ background: 'transparent' }} textColor={'white'} />
            <PointBox campaignId={campaignId} />
            <Box flex={1} display={'flex'} overflow={'hidden'}>
                <PullToRefresh className="mTop" pullingContent={''} onRefresh={async () => qGetReward.refetch()}>
                    <Box m={2}>
                        <Grid container spacing={3}>
                            {_.map(qGetReward.data?.data ?? [], (t, i) => (
                                <Grid item xs={6} key={i}>
                                    <RewardItem
                                        onPressDetail={() => navi(`/gift-detail`, { state: t })}
                                        name={t.giftName}
                                        urlImg={`${BASE_URL_IMG}${t.giftWinImage}`}
                                        onPressExchange={() => onPressExchange(t)}
                                    />
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                </PullToRefresh>
            </Box>
        </Box>
    );
};

export default RewardPage;
