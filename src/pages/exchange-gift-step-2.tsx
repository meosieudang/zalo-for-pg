import { Box, Button, Stack, Typography } from '@mui/material';
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Header } from 'zmp-ui';
import ErrorScreen from '../components/error-screen';
import LoadingScreen from '../components/loading-screen';
import { useGetQRCodeQuery } from '../hooks/useApiv2';
import { StateExchangeGiftStep1 } from '../types/state';
import { OutletsResponse } from '../types/zaloMiniTypes';
//  '2qG33Hq423'
const ExchangeGiftStep2 = () => {
    const { state }: { state: OutletsResponse & { giftType: string; qrCode: string } } = useLocation();
    const navi = useNavigate();
    const qGetQRCode = useGetQRCodeQuery({ orderCode: state.qrCode });
    const qrCodeData = qGetQRCode.data ?? '';
    const onBackClick = () => {
        SwalConfirm({
            title: 'Bạn có chắc chắn?',
            text: `Mã QR code sẽ mất!`
        }).then((r) => {
            if (r.isConfirmed) {
                navi(-1);
            }
        });
    };
    if (qGetQRCode.isLoading) return <LoadingScreen />;

    if (qGetQRCode.error) return <ErrorScreen onRetry={qGetQRCode.refetch} />;
    return (
        <Box flex={1} height={'100vh'} bgcolor={'white'} display={'flex'} flexDirection={'column'}>
            <Header
                title={
                    (
                        <Stack direction={'row'} spacing={1} alignItems={'center'} justifyItems={'center'}>
                            <Stack>
                                <Typography variant="body1" fontWeight={'500'}>
                                    {_.get(state, 'shopName')}
                                </Typography>
                                <Typography variant="body2">{`Ngày ${moment().format('DD/MM/YYYY')}`}</Typography>
                            </Stack>
                        </Stack>
                    ) as unknown as string
                }
                onBackClick={onBackClick}
            />
            <Stack justifyContent={'center'} flex={1}>
                <Stack alignItems={'center'} gap={2} p={2}>
                    <Typography variant="h6">{`QR Code`}</Typography>

                    <Box border={1} borderRadius={4} borderColor={'error.main'} p={1}>
                        <img src={qrCodeData} style={{ width: 300, height: 300 }} />
                    </Box>

                    <Typography>{`QR xác nhận thông tin đổi quà`}</Typography>
                    <Typography variant="subtitle2" color={'grey.500'}>{`Vui lòng đưa mã này cho khách hàng quét trên zalo`}</Typography>
                    <Typography variant="subtitle2" color={'grey.500'}>
                        {`Phát hành ngày ${moment(state?.workingDate).format('DD/MM/YYYY')}`}
                    </Typography>
                </Stack>
                <Box flex={1} />
                <Button
                    sx={{ m: 2 }}
                    size="large"
                    variant="contained"
                    onClick={() => navi(`/exchange-gift-step-3`, { replace: false, state })}
                >
                    {`Tiếp Theo`}
                </Button>
            </Stack>
        </Box>
    );
};

export default ExchangeGiftStep2;
