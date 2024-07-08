import {
    Avatar,
    Box,
    Button,
    Divider,
    List,
    ListItem,
    ListItemAvatar,
    ListItemButton,
    ListItemText,
    ListSubheader,
    Paper,
    Stack,
    Typography
} from '@mui/material';
import React from 'react';
import { Header } from 'zmp-ui';
import { renderCurrentMoment } from '../utils/datetime';
import { useGetCampaigns, useGetProfile } from '../hooks/useApiv2';
import { CampaignsResponse } from '../types/zaloMiniTypes';
import PullToRefresh from 'react-simple-pull-to-refresh';
import WorkIcon from '@mui/icons-material/Work';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { useNavigate } from 'react-router-dom';
import { setSession } from '../utils/jwt';

const HomePage = () => {
    const qProfile = useGetProfile();
    const { employeeName, photo } = _.get(qProfile, 'data.data') ?? {};
    const qGetCampaigns = useGetCampaigns();
    const navi = useNavigate();
    const onLogout = () => {
        SwalConfirm({ text: 'Bạn sẽ đăng xuất!' }).then((r) => {
            if (r.isConfirmed) {
                setSession(undefined);
                navi('/login', { replace: true });
            }
        });
    };
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
            <Header
                showBackIcon={false}
                title={
                    (
                        <Stack direction={'row'} spacing={1} alignItems={'center'} justifyItems={'center'}>
                            <Avatar src={photo} />
                            <Stack>
                                <Typography variant="body2" color={'white'}>
                                    {employeeName ? renderCurrentMoment() : 'Xin chào,'}
                                </Typography>
                                <Typography variant="body1" fontWeight={'500'} color={'white'}>
                                    {employeeName ?? 'Guest'}
                                </Typography>
                            </Stack>
                        </Stack>
                    ) as unknown as string
                }
                style={{
                    background: 'transparent'
                }}
            />
            <PullToRefresh
                pullingContent={''}
                onRefresh={async () => {
                    qGetCampaigns.refetch();
                    qProfile.refetch();
                }}
            >
                <CampaignList data={_.get(qGetCampaigns, 'data.data')} />
            </PullToRefresh>
            <Button variant="outlined" sx={{ m: 2 }} onClick={onLogout}>{`đăng xuất`}</Button>
        </Box>
    );
};

export default HomePage;

const CampaignList = ({ data }: { data?: CampaignsResponse[] }) => {
    return (
        <Paper sx={{ bgcolor: 'white', zIndex: 9, m: 2 }}>
            <List disablePadding subheader={<ListSubheader sx={{ borderRadius: 2 }}>Danh sách chương trình</ListSubheader>}>
                {_.map(data, (t) => (
                    <CampaignItem key={t.id} {...t} />
                ))}
            </List>
        </Paper>
    );
};

const CampaignItem = (t: CampaignsResponse) => {
    const navi = useNavigate();
    return (
        <React.Fragment>
            <ListItem disableGutters disablePadding>
                <ListItemButton onClick={() => navi(`/outlet-page`, { state: { campaignName: t.campaignName, campaignId: t.id } })}>
                    <ListItemAvatar>
                        <Avatar>
                            <WorkIcon />
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={t.campaignName} secondary={`Ngày bắt đầu: ${moment(t.startDate).format('DD/MM/YYYY')}`} />
                    <KeyboardArrowRightIcon />
                </ListItemButton>
            </ListItem>
            <Divider />
        </React.Fragment>
    );
};
