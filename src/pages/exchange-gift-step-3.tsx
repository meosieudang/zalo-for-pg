import { Box, Stack, Typography } from '@mui/material';
import QrScanner from 'qr-scanner';
import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Header } from 'zmp-ui';
import { StateExchangeGiftStep1 } from '../types/state';
import { OutletsResponse } from '../types/zaloMiniTypes';

const ExchangeGiftStep3 = () => {
    const videoElementRef = useRef<HTMLVideoElement>(null);
    const navi = useNavigate();
    const { state }: { state: OutletsResponse & { giftType?: string } } = useLocation();

    useEffect(() => {
        // navi('/exchange-gift-step-4', { replace: true, state: { ...state, qrCode: '43521DE994' } });
        // return;
        const video = videoElementRef.current;
        if (!video) return;
        const qrScanner = new QrScanner(
            video,
            _.debounce((result) => {
                console.log('decoded qr code:', result);
                if (result.data) {
                    navi('/exchange-gift-step-4', { replace: true, state: { ...state, qrCode: result.data } });
                }
            }, 100),
            {
                returnDetailedScanResult: true,
                highlightScanRegion: true,
                highlightCodeOutline: true
            }
        );
        qrScanner.start();
        console.log('start');

        return () => {
            console.log(qrScanner);
            qrScanner.stop();
            qrScanner.destroy();
        };
    }, []);
    return (
        <Box flex={1} height={'100vh'} bgcolor={'white'} display={'flex'} flexDirection={'column'}>
            <Header
                title={
                    (
                        <Stack direction={'row'} spacing={1} alignItems={'center'} justifyItems={'center'}>
                            <Stack>
                                <Typography variant="body1" fontWeight={'500'}>
                                    {_.get(state, 'shopName', 'Cửa hàng 01')}
                                </Typography>
                                <Typography variant="body2">{`Ngày ${moment().format('DD/MM/YYYY')}`}</Typography>
                            </Stack>
                        </Stack>
                    ) as unknown as string
                }
            />
            <Box flex={1} />
            <Stack justifyContent={'center'} flex={1} alignItems={'center'} gap={1}>
                <Typography variant="body1">{`QUÉT MÃ QR KHÁCH HÀNG`}</Typography>
                <div className="videoWrapper">
                    <video className="qrVideo" ref={videoElementRef} />
                </div>
                <Typography variant="body1">{`Đặt mã QR vào khung để tiến hành xác nhận`}</Typography>
            </Stack>
            <Box flex={2} />
        </Box>
    );
};

export default ExchangeGiftStep3;
