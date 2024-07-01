import { Box, Divider, Paper, Stack, Typography } from '@mui/material';
import React from 'react';
import { Header } from 'zmp-ui';
import PointBox from '../components/point-box';
import { useParams } from 'react-router-dom';
import { useGetLoyaltyPoint } from '../hooks/useApiv2';
import ErrorScreen from '../components/error-screen';
import PullToRefresh from 'react-simple-pull-to-refresh';
import LoadingScreen from '../components/loading-screen';

const PointHistory = () => {
    const { campaignId } = useParams();
    const qHistory = useGetLoyaltyPoint({ campaignId });

    if (qHistory.isLoading) return <LoadingScreen />;

    if (qHistory.error) return <ErrorScreen onRetry={qHistory.refetch} />;
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
            <Header title={'Lịch sử'} style={{ background: 'transparent' }} textColor={'white'} />
            <PointBox campaignId={campaignId} />
            <Box flex={1} display={'flex'} overflow={'hidden'}>
                <PullToRefresh pullingContent={''} onRefresh={async () => qHistory.refetch()}>
                    <Box pb={5}>
                        {_.map(qHistory.data?.data, (t) => (
                            <HistoryItem content={t.content} key={t.id} name={t.giftId} point={t.point} date={t.createdDate} />
                        ))}
                    </Box>
                </PullToRefresh>
            </Box>
        </Box>
    );
};

export default PointHistory;

const HistoryItem = ({ name, point, date, content }) => {
    return (
        <Paper sx={{ p: 2, mx: 2, mt: 1.5 }}>
            <Stack direction={'row'} alignItems={'center'} spacing={1}>
                <Typography>{`Bạn đã ${Number(point) > 0 ? 'tích' : 'đổi'}`}</Typography>
                <Box flex={1} borderBottom={1} borderColor={'divider'} />
                <Typography variant="h6" fontWeight={'500'} color={Number(point) > 0 ? 'success.main' : 'error.main'}>
                    {point}
                </Typography>
                <Typography>{`điểm`}</Typography>
            </Stack>
            <Typography variant="subtitle2">{content}</Typography>
            <Typography variant="caption">{moment(date).format('DD/MM/YYYY')}</Typography>
        </Paper>
    );
};
