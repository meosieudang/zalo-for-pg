import {
    Avatar,
    Box,
    Button,
    Divider,
    Grid,
    IconButton,
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
import { pink } from '@mui/material/colors';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Slider, { Settings } from 'react-slick';
import { configAppView } from 'zmp-sdk/apis';
import { Header } from 'zmp-ui';
import { useAuth } from '../contexts/AuthContext';
import { useToBeImplemented } from '../hooks/useToBeImplemented';
import star from '../static/icons/star.png';
import { renderCurrentMoment } from '../utils/datetime';
import { useCreateRedeemMutation, useGetLoyaltyPointTotal } from '../hooks/useApiv2';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import PullToRefresh from 'react-simple-pull-to-refresh';
import { Campaign } from '../types/api';

const Home = () => {
    const navi = useNavigate();
    const { user, checkAuthorize } = useAuth();
    const locationPath = new URLSearchParams(location.search);
    console.log(user?.id, 'id zalo', '6387044739791513066');
    const qGetLoyaltyPointTotal = useGetLoyaltyPointTotal({ zaloId: user?.id ?? null });
    const data = qGetLoyaltyPointTotal.data?.data;

    useEffect(() => {
        if (!locationPath.has('code')) {
            setTimeout(() => {
                !user && checkAuthorize();
            }, 500);
        }
    }, []);

    useEffect(() => {
        configAppView({
            headerColor: '#f2f2f2',
            actionBar: {
                title: 'CREGift1',
                leftButton: 'none',
                hide: true
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
                            <Avatar src={user?.avatar} />
                            <Stack>
                                <Typography variant="body2" color={'white'}>
                                    {user?.name ? renderCurrentMoment() : 'Xin chào,'}
                                </Typography>
                                <Typography variant="body1" fontWeight={'500'} color={'white'}>
                                    {user?.name ?? 'Guest'}
                                </Typography>
                            </Stack>
                        </Stack>
                    ) as unknown as string
                }
                style={{
                    background: 'transparent'
                }}
            />

            {/* <Button
        onClick={() => {
          return Swal.fire({
            title: "Bạn có chắc chắn?",
            text: `Bạn sẽ đổi 1!`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Đổi ngay",
            cancelButtonText: "Không",
            customClass: {
              container: "my-swal",
            },

            allowOutsideClick: false,
            allowEscapeKey: false,
            allowEnterKey: false,
          }).then((result) => {
            console.log(result);
            if (result.isConfirmed) {
              mCreateRedeem.mutate({
                campaignId: 21,
                userUniqueId: "121",
                giftId: 1,
                point: 1,
              });
              // Swal.fire({
              //   customClass: {
              //     container: "my-swal",
              //   },
              //   didOpen(popup) {
              //     Swal.showLoading();
              //   },
              // });
            }
          });
        }}
      >
        press
      </Button> */}
            <PullToRefresh
                pullingContent={''}
                onRefresh={async () => {
                    return qGetLoyaltyPointTotal.refetch();
                }}
            >
                <Box sx={{ paddingBottom: '100px' }}>
                    <PaperFirst data={data} />
                    {/* <PaperSecond /> */}
                    <PaperThird />
                </Box>
            </PullToRefresh>
        </Box>
    );
};

export default Home;

const PaperFirst = ({ data }: { data?: Campaign[] }) => {
    const navi = useNavigate();

    if (_.size(data) === 0)
        return (
            <Paper sx={{ bgcolor: 'white', zIndex: 9, m: 2 }}>
                <List sx={{ borderRadius: 2 }} disablePadding subheader={<ListSubheader>Danh sách chương trình</ListSubheader>}>
                    <Typography variant="subtitle2" textAlign={'center'} p={2}>
                        {'Không có dữ liệu'}
                    </Typography>
                </List>
            </Paper>
        );

    return (
        <Paper sx={{ bgcolor: 'white', zIndex: 9, m: 2 }}>
            <List disablePadding subheader={<ListSubheader sx={{ borderRadius: 2 }}>Danh sách chương trình</ListSubheader>}>
                {_.map(data, (t, i) => (
                    <React.Fragment key={i}>
                        <ListItem key={i} disableGutters disablePadding>
                            <ListItemButton onClick={() => navi(`/home-by-campaign/${t.campaignId}/${t.campaignName}`)}>
                                <ListItemAvatar>
                                    <Avatar src={star} />
                                </ListItemAvatar>
                                <ListItemText
                                    sx={{ mx: 1 }}
                                    primary={t.campaignName}
                                    secondary={
                                        <React.Fragment>
                                            <Stack direction={'row'}>
                                                <Typography component={'span'}>{`Điểm của bạn: `}</Typography>
                                                <Typography
                                                    component={'span'}
                                                    overflow={'hidden'}
                                                    whiteSpace={'nowrap'}
                                                    textOverflow={'ellipsis'}
                                                    mx={1}
                                                    fontWeight={'500'}
                                                    color={'black'}
                                                >
                                                    {`${t.totalPoint} điểm`}
                                                </Typography>
                                            </Stack>
                                        </React.Fragment>
                                    }
                                />
                                <KeyboardArrowRightIcon />
                            </ListItemButton>
                        </ListItem>
                        <Divider />
                    </React.Fragment>
                ))}
            </List>
        </Paper>
    );
};

const PaperThird = () => {
    const settings: Settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true
    };
    return (
        <Paper sx={{ bgcolor: 'white', zIndex: 9, m: 2, height: 300 }}>
            <List disablePadding subheader={<ListSubheader sx={{ borderRadius: 2 }}>{`Tin tức`}</ListSubheader>}>
                <Slider {...settings} arrows={false}>
                    <div style={{}}>
                        <img
                            src={
                                'https://static.vecteezy.com/system/resources/previews/015/181/366/non_2x/earn-points-concept-for-loyal-customers-loyalty-program-and-get-rewards-suitable-for-web-landing-page-ui-mobile-app-banner-template-vector.jpg'
                            }
                            style={{
                                borderRadius: '1rem',
                                border: '5px solid #fff',
                                height: 200,
                                width: '100%'
                            }}
                        />
                    </div>
                    <div style={{}}>
                        <img
                            src={'https://t4.ftcdn.net/jpg/02/48/39/75/360_F_248397538_OsyBnjShqT7IRsCRIgVSkq5dSWbwRN0g.jpg'}
                            width={'100%'}
                            style={{
                                borderRadius: '1rem',
                                border: '5px solid #fff',
                                height: 200,
                                width: '100%'
                            }}
                        />
                    </div>
                    <div style={{}}>
                        <img
                            src={'https://public.bnbstatic.com/image/cms/blog/20201201/6b83077b-0a18-4330-8529-57cab45f5791.png'}
                            style={{
                                borderRadius: '1rem',
                                border: '5px solid #fff',
                                height: 200,
                                width: '100%'
                            }}
                        />
                    </div>
                </Slider>
            </List>
        </Paper>
    );
};
