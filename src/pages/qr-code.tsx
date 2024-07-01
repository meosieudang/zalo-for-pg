import { Box, Button, Stack, Typography } from '@mui/material';
import { QRCodeSVG } from 'qrcode.react';
import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { configAppView } from 'zmp-sdk/apis';
import { Header } from 'zmp-ui';
import ErrorScreen from '../components/error-screen';
import { useGetDataFromQRCode } from '../hooks/useApiv2';
import { ReportContent } from '../types/api';
import GiftItem from './index/gift-item';
import LoadingScreen from '../components/loading-screen';

const QRCode = () => {
    let { code } = useParams();
    const navi = useNavigate();

    const qGetDataFromQRCode = useGetDataFromQRCode({ orderCode: code });
    const qrCodeData = qGetDataFromQRCode.data?.data;
    const content: ReportContent = qrCodeData && JSON.parse(qrCodeData?.content ?? '');

    const onCloseApp = async () => {
        navi('/', { replace: true });
    };

    useEffect(() => {
        configAppView({
            headerColor: '#f2f2f2',
            actionBar: {
                title: 'CREGift',
                leftButton: 'none'
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

    if (qGetDataFromQRCode.isLoading) return <LoadingScreen />;
    if (qGetDataFromQRCode.error) return <ErrorScreen onRetry={qGetDataFromQRCode.refetch} />;

    return (
        <Box
            sx={{
                height: '100vh',
                display: 'flex',
                flexDirection: 'column',
                flex: 1,
                bgcolor: 'white'
            }}
        >
            <Header title={qrCodeData?.shopName ?? 'CREGift'} showBackIcon={false} />
            <Stack alignItems={'center'} gap={2} p={2}>
                <Typography variant="h6">{`QR Code`}</Typography>
                {code && (
                    <Box border={1} borderRadius={4} borderColor={'error.main'} p={2}>
                        <QRCodeSVG value={code} style={{ width: 200, height: 200 }} />
                    </Box>
                )}

                <Typography>{`QR xác nhận thông tin đổi quà`}</Typography>
                <Typography color={'error.main'}>{`Đưa mã này cho PG để hoàn thành đổi quà`}</Typography>
                <Typography variant="body2" color={'grey.500'}>{`Phát hành ngày ${qrCodeData?.createdDate?.toString()}`}</Typography>
            </Stack>

            <Stack overflow={'scroll'} p={2} gap={2}>
                {(content?.gifts ?? []).map((t) => (
                    <GiftItem {...t} createdDate={qrCodeData?.createdDate?.toString()} />
                ))}
            </Stack>

            <div style={{ flex: 1 }} />
            <Stack p={2}>
                <Button onClick={onCloseApp} size="large" fullWidth variant="contained">
                    Trở về trang chủ
                </Button>
            </Stack>
        </Box>
    );
};

export default QRCode;
