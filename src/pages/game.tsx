import { Box } from '@mui/material';
import React from 'react';
import { CBVNLuckyDraw2024 } from 'react-appne';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Header } from 'zmp-ui';
import ErrorScreen from '../components/error-screen';
import { useConfirmMutation, useGetDataFromQRCode, useGetDataLuckyGift } from '../hooks/useApiv2';
import { Confirm, ReportContent } from '../types/api';
import LoadingScreen from '../components/loading-screen';
import { TYPE } from '../constant';

const Game = () => {
    let { code, type } = useParams();
    const navi = useNavigate();
    const { state }: { state: Confirm & { type?: TYPE } } = useLocation();
    const { data, isLoading, error, refetch } = useGetDataFromQRCode({ orderCode: code });
    const qGetDataLuckyGift = useGetDataLuckyGift({ orderCodeLucky: code });
    const mConfirm = useConfirmMutation({
        confirmSuccess: () => {
            return navi(`/qr-code/${code}`, { replace: true });
        }
    });
    const qrCodeData = data?.data;

    const content: ReportContent = qrCodeData && JSON.parse(qrCodeData?.content ?? '');
    console.log(content, 'cc');
    const param = `?schemes=&accept_token=${content?.accessToken}&campaignId=${qrCodeData?.campaignId}&giftCode=${code}`;
    // const param =
    //   "?schemes=&accept_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJFbWFpbCI6IiIsIkVtcGxveWVlSWQiOiIxNTA5MyIsIlVzZXJOYW1lIjoibHVja3lfZGVtbyIsIkNhbXBhaWduSWQiOiIyMDYiLCJQb3NpdGlvbiI6IiIsIlJvbGVJZCI6IjEiLCJFbXBsb3llZUNvZGUiOiJsdWNreV9kZW1vIiwiRW1wbG95ZWVOYW1lIjoiQ2FybHNiZXJnIERlbW8iLCIiOiIiLCJmdWxsTmFtZSI6IkNhcmxzYmVyZyBEZW1vIiwiQ2FtcGFpZ25OYW1lIjoiIiwiQ2FtcGFpZ25UeXBlIjoiIiwiUm9sZXMiOiIiLCJqdGkiOiI4YzQ2YThhOS0yZDQ4LTQ2Y2MtYjAyMC04MjJjY2EzZWFjMjYiLCJleHAiOjE3MTYyNTk5OTcsImlzcyI6Imh0dHBzOi8vZG9jcy5taWNyb3NvZnQuY29tIiwiYXVkIjoiaHR0cHM6Ly9kb2NzLm1pY3Jvc29mdC5jb20ifQ.Ih3Vsb8_nyus80OWORrgltiRIMeBf_96uVwlBQaOIYk&campaignId=206&giftCode=NC52VT60&provinceId=79&channelId=865";
    console.log(param, 'rr');

    const onCallBackData = (data) => {
        if (data.type === 'END') {
            qGetDataLuckyGift.refetch().then((d) => {
                mConfirm.mutate({
                    ...state,
                    isOnlyUserInfo: false,
                    gifts: JSON.stringify(d.data?.data)
                });
            });
        }
    };

    if (isLoading) return <LoadingScreen />;

    if (error) return <ErrorScreen onRetry={refetch} />;

    return (
        <Box height={'100vh'} display={'flex'} flexDirection={'column'} flex={1}>
            <Header title="Vòng quay may mắn" />
            <Box>{Boolean(content) && <CBVNLuckyDraw2024 onCallBackData={onCallBackData} urlParams={param} />}</Box>
        </Box>
    );
};

export default Game;
