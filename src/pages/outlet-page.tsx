import React from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useGetOutlets } from '../hooks/useApiv2';
import {
    Avatar,
    Box,
    CardMedia,
    Chip,
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
import { Header } from 'zmp-ui';
import PullToRefresh from 'react-simple-pull-to-refresh';
import { OutletsResponse } from '../types/zaloMiniTypes';
import WorkIcon from '@mui/icons-material/Work';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
const OutletPage = () => {
    const { state }: { state: { campaignId: number; campaignName: string } } = useLocation();
    const q = useGetOutlets({ campaignId: state.campaignId });
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
            <Header textColor="white" title={`Danh sách cửa hàng`} style={{ background: 'transparent' }} />
            <Stack direction={'row'}>
                <Typography color="white" mx={2} mt={2} variant="body1">{`Tên chương trình: ${state.campaignName}`}</Typography>
            </Stack>
            <PullToRefresh
                pullingContent={''}
                onRefresh={async () => {
                    // qGetCampaigns.refetch();
                    // qProfile.refetch();
                }}
            >
                <OutletList data={_.get(q, 'data.data')} />
            </PullToRefresh>
        </Box>
    );
};

export default OutletPage;

const OutletList = ({ data }: { data?: OutletsResponse[] }) => {
    return (
        <Stack spacing={2} m={2}>
            {_.map(data, (t) => (
                <CampaignItem key={t.shopId} {...t} />
            ))}
        </Stack>
    );
};
import PersonIcon from '@mui/icons-material/Person';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import StorefrontIcon from '@mui/icons-material/Storefront';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import store_ic from '../static/icons/store_ic.png'
const CampaignItem = (t: OutletsResponse) => {
    const navi = useNavigate();
    const label = t.isCheckOut == 1 ? 'Đã thực hiện' : t.isCheckIn == 1 ? 'Đang thực hiện' : 'Chưa thực hiện';
    const color = t.isCheckOut == 1 ? 'success' : t.isCheckIn == 1 ? 'primary' : 'error';
    return (
        <Paper>
            <ListItemButton disableGutters sx={{ px: 1 }} onClick={() => navi(`/sell-out-page`, { state: t })}>
                <Stack direction={'row'} spacing={1}>
                    <CardMedia
                        component="img"
                        sx={{ width: 151, height: 151, objectFit: 'cover' }}
                        image={store_ic}
                        alt="Live from space album cover"
                    />
                    <Stack spacing={1}>
                        <Stack direction={'row'} spacing={1}>
                            <StorefrontIcon color="info" />
                            <Typography fontWeight={'500'}>{t.shopName}</Typography>
                        </Stack>
                        <Stack direction={'row'} spacing={1}>
                            <PersonIcon color="info" />
                            <Typography color="text.secondary">{t.employeeName}</Typography>
                        </Stack>
                        <Stack direction={'row'} spacing={1}>
                            <CalendarMonthIcon color="info" />
                            <Typography color="text.secondary">{`${moment(t.workingDate).format('DD/MM/YYYY')}`}</Typography>
                        </Stack>
                        <Stack direction={'row'} spacing={1}>
                            <LocationOnIcon color="info" />
                            <Typography color="text.secondary">{t.address}</Typography>
                        </Stack>
                        <Stack direction={'row'} spacing={1}>
                            <WorkspacePremiumIcon color="info" />
                            <Chip size="small" label={label} color={color} variant="outlined" />
                        </Stack>
                    </Stack>
                </Stack>
            </ListItemButton>
        </Paper>
    );
};
