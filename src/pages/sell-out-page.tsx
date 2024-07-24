import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import RedeemIcon from '@mui/icons-material/Redeem';
import SearchIcon from '@mui/icons-material/Search';
import { Backdrop, Box, Divider, Fab, InputAdornment, ListItemButton, SpeedDial, Stack, TextField, Typography } from '@mui/material';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PullToRefresh from 'react-simple-pull-to-refresh';
import { configAppView } from 'zmp-sdk/apis';
import { Header } from 'zmp-ui';
import ErrorScreen from '../components/error-screen';
import LoadingScreen from '../components/loading-screen';
import { TYPE } from '../constant';
import { useGetSellouts } from '../hooks/useApiv2';
import giftIcon from '../static/icons/gift.png';
import giftBoxIcon from '../static/icons/giftbox.png';
import phoneIcon from '../static/icons/phoneIcon.png';
import userIcon from '../static/icons/userIcon.png';
import { SellOutResponse } from '../types/advancedTypes';
import { OutletsResponse } from '../types/zaloMiniTypes';
import useMathSorter from '../hooks/useMathSorter';
const SellOutPage = () => {
    const { state }: { state: OutletsResponse } = useLocation();
    const navi = useNavigate();

    const sellOutQuery = useGetSellouts({
        campaignId: _.get(state, 'campaignId'),
        shopId: _.get(state, 'shopId'),
        reportDate: moment(state.workingDate).format('YYYY-MM-DD')
    });
    // const sellOutQuery = useGetSelloutQuery({
    //     campaignId: 222,
    //     reportDate: '2024-07-01T00:00:00',
    //     selloutType: undefined,
    //     shopId: 710908
    // });
    const {
        search,
        onSearch,
        clearText,
        t: values
    } = useMathSorter({ data: _.get(sellOutQuery, 'data.data'), keys: ['customerName', 'customerMobile'] });

    configAppView({
        hideIOSSafeAreaBottom: false
    });

    if (sellOutQuery.isLoading) return <LoadingScreen />;

    if (sellOutQuery.error) return <ErrorScreen onRetry={sellOutQuery.refetch} />;
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
            />
            <Search value={values} onChange={onSearch} />
            <ConsumerList data={_.size(search) ? search : _.get(sellOutQuery, 'data.data')} />
            <Fab
                onClick={() => navi(`/exchange-gift-step-3`, { replace: false, state:{...state, fromSellOutPage:true} })}
                size="large"
                variant="extended"
                color="primary"
                sx={{ position: 'absolute', bottom: 16, alignSelf: 'center' }}
            >
                <QrCodeScannerIcon sx={{ mr: 1 }} />
                {`Quét mã`}
            </Fab>
            <SpeedDialTooltipOpen state={state} />
        </Box>
    );
};

export default SellOutPage;

const Search = ({
    onChange,
    value
}: {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void;
}) => {
    return (
        <Stack pt={2} px={2} flex={1}>
            <TextField
                id="input-with-icon-textfield"
                placeholder="Tìm kiếm người dùng"
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon />
                        </InputAdornment>
                    )
                }}
                variant="outlined"
                size="small"
                onChange={onChange}
                value={value}
            />
        </Stack>
    );
};

const actions = [
    { icon: <RedeemIcon />, name: 'Vòng quay may mắn', type: 3 },
    { icon: <RedeemIcon />, name: 'Đổi quà theo cơ cấu', type: 2 },
    { icon: <RedeemIcon />, name: 'Đổi quà', type: 1 }
];

const SpeedDialTooltipOpen = ({ state }: { state: OutletsResponse }) => {
    const navi = useNavigate();
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleClose2 = (type: TYPE) => {
        setOpen(false);
        navi(`/exchange-gift-step-1`, { state: { ...state, giftType: type } });
    };

    return (
        <Box>
            <Backdrop open={open} />
            <SpeedDial
                ariaLabel="SpeedDial tooltip example"
                sx={{ position: 'absolute', bottom: 16, right: 16 }}
                icon={<SpeedDialIcon />}
                onClose={handleClose}
                onOpen={handleOpen}
                open={open}
            >
                {actions.map((action) => (
                    <SpeedDialAction
                        sx={{
                            '& .MuiSpeedDialAction-staticTooltipLabel': {
                                textAlign: 'right',
                                width: 'max-content',
                                color: 'black'
                            }
                        }}
                        key={action.name}
                        icon={<img src={giftIcon} style={{ width: 24, height: 24 }} />}
                        tooltipTitle={action.name}
                        tooltipOpen
                        onClick={() => handleClose2(action.type.toString() as TYPE)}
                    />
                ))}
            </SpeedDial>
        </Box>
    );
};

const ConsumerList = ({ data = [] }: { data?: SellOutResponse[] }) => {
    return (
        <PullToRefresh className="mTop" pullingContent={''} onRefresh={async () => {}}>
            <Box>
                {_.map(data, (t) => (
                    <ConsumerItem key={t.id} {...t} />
                ))}

                {_.size(data) === 0 && <Typography textAlign={'center'} variant="subtitle2" m={2}>{`Dữ liệu trống`}</Typography>}
            </Box>
        </PullToRefresh>
    );
};

const ConsumerItem = (t: SellOutResponse) => {
    const navi = useNavigate();
    const { state }: { state: OutletsResponse } = useLocation();

    return (
        <>
            <ListItemButton
                onClick={() => navi('/exchange-gift-step-4', { state: { ...state, qrCode: t.orderCode, onlyRead: true, selloutId: t.id } })}
            >
                <Stack spacing={1.5} flex={1}>
                    <Stack direction={'row'} spacing={1} alignItems={'center'} justifyContent={'space-between'}>
                        <Stack spacing={1} direction={'row'} alignItems={'center'}>
                            <img src={userIcon} style={{ width: 24, height: 24 }} />
                            <Typography>{_.get(t, 'customerName')}</Typography>
                        </Stack>

                        <Stack spacing={1} direction={'row'} alignItems={'center'}>
                            <img src={phoneIcon} style={{ width: 24, height: 24 }} />
                            <Typography variant="subtitle2">{_.replace(_.get(t, 'customerMobile'), /^84/, '0')}</Typography>
                        </Stack>
                    </Stack>

                    <Stack direction={'row'} spacing={1} alignItems={'center'}>
                        <img src={giftBoxIcon} style={{ width: 24, height: 24 }} />
                        <Typography variant="subtitle2">{`Quà:`}</Typography>
                        <Typography variant="subtitle2" color="success.main">
                            {_.isNull(t.giftName) ? 'N/A' : _.get(t, 'giftName')}
                        </Typography>
                    </Stack>
                </Stack>
            </ListItemButton>
            <Divider />
        </>
    );
};
