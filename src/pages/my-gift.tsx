import { Box, Grid } from '@mui/material';
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PullToRefresh from 'react-simple-pull-to-refresh';
import { Header } from 'zmp-ui';
import ErrorScreen from '../components/error-screen';
import LoadingScreen from '../components/loading-screen';
import PointBox from '../components/point-box';
import RewardItem from '../components/reward-item';
import { BASE_URL_IMG } from '../constant';
import { useAuth } from '../contexts/AuthContext';
import { useGetRedeem } from '../hooks/useApiv2';

const MyGiftPage = () => {
    const { campaignId } = useParams();
    const { user } = useAuth();
    const qGetRedeem = useGetRedeem({ campaignId });
    const navi = useNavigate();

    if (qGetRedeem.isLoading) return <LoadingScreen />;

    if (qGetRedeem.error) return <ErrorScreen onRetry={qGetRedeem.refetch} />;
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
            <Header title="Quà của tôi" style={{ background: 'transparent' }} textColor={'white'} />
            <PointBox campaignId={campaignId} />
            <Box flex={1} display={'flex'} overflow={'hidden'}>
                <PullToRefresh className="mTop" pullingContent={''} onRefresh={qGetRedeem.refetch}>
                    <Box m={2}>
                        <Grid container spacing={3}>
                            {_.map(qGetRedeem.data?.data ?? [], (t, i) => (
                                <Grid item xs={6} key={i}>
                                    <RewardItem
                                        status
                                        name={t.giftName}
                                        urlImg={`${BASE_URL_IMG}${t.giftIcon}`}
                                        onPressDetail={() => navi('/gift-detail', { state: { ...t, fromMyGift: true } })}
                                        onPressExchange={() => {}}
                                        hidePoint
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

export default MyGiftPage;
