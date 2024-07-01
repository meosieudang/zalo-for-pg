import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListSubheader from '@mui/material/ListSubheader';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Header } from 'zmp-ui';
import PointBox from '../components/point-box';
import { useToBeImplemented } from '../hooks/useToBeImplemented';
import delivery from '../static/icons/delivery.png';
import giftIcon from '../static/icons/gift.png';
import surveyor from '../static/icons/surveyor.png';
import transfer from '../static/icons/transfer.png';
import { useAuth } from '../contexts/AuthContext';

const HomeByCampaign = () => {
    const { campaignId, campaignName } = useParams();

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
            <Header title={campaignName} style={{ background: 'transparent' }} textColor={'white'} />
            <PointBox campaignId={campaignId} />

            <PaperSecond campaignId={campaignId} />
        </Box>
    );
};

export default HomeByCampaign;

const PaperSecond = ({ campaignId }) => {
    const onClick = useToBeImplemented();
    const navi = useNavigate();
    return (
        <Paper sx={{ bgcolor: 'white', zIndex: 9, m: 2 }}>
            <List subheader={<ListSubheader sx={{ borderRadius: 2 }}>{`Chức năng`}</ListSubheader>}>
                <Grid container spacing={2}>
                    <Grid item xs={4}>
                        <BoxFunc title="Đổi quà" icon={transfer} onPress={() => navi(`/reward/${campaignId}`)} />
                    </Grid>
                    <Grid item xs={4}>
                        <BoxFunc title={`Lịch sử đổi quà`} onPress={() => navi(`/point-history/${campaignId}`)} icon={delivery} />
                    </Grid>
                    <Grid item xs={4}>
                        <BoxFunc title={'Quà đã tôi'} onPress={() => navi(`/my-gift/${campaignId}`)} icon={giftIcon} />
                    </Grid>
                    <Grid item xs={4}>
                        <BoxFunc title={'Khảo sát\nnhận quà'} onPress={onClick} icon={surveyor} />
                    </Grid>
                </Grid>
            </List>
        </Paper>
    );
};

const BoxFunc = ({ title, onPress, icon }) => {
    const { user, checkAuthorize } = useAuth();
    const handlePress = () => {
        if (!user) {
            checkAuthorize();
            return;
        }
        return onPress();
    };
    return (
        <Box
            sx={{
                alignItems: 'center',
                alignSelf: 'center',
                display: 'flex',
                flexDirection: 'column'
            }}
        >
            <IconButton onClick={handlePress}>
                <img src={icon} style={{ width: 28, height: 28 }} />
            </IconButton>

            <Typography variant="caption" fontWeight={'500'}>
                {title}
            </Typography>
        </Box>
    );
};
