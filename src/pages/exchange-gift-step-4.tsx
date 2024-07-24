import { yupResolver } from '@hookform/resolvers/yup';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import CloseIcon from '@mui/icons-material/Close';
import { LoadingButton } from '@mui/lab';
import { Alert, Box, IconButton, Stack, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Controller, useController, useFieldArray, useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import PullToRefresh from 'react-simple-pull-to-refresh';
import { useToggle } from 'react-use';
import * as yup from 'yup';
import { configAppView } from 'zmp-sdk/apis';
import { Header } from 'zmp-ui';
import CameraModal from '../components/camera-modal';
import ErrorScreen from '../components/error-screen';
import ImageReview from '../components/image-review';
import LoadingScreen from '../components/loading-screen';
import { ERROR_PHONE, ERROR_TEXT, TYPE } from '../constant';
import {
    useCreateSelloutMutation,
    useGetDataFromQRCode,
    useGetSellOutImageTypes,
    useGetSellOutTypes,
    useGetSelloutImageQueries,
    useUpdateCustomerInfoMutation
} from '../hooks/useApiv2';
import { ReportContent } from '../types/api';
import { ConfirmDataZaloRequest, OutletsResponse } from '../types/zaloMiniTypes';
import eventEmitter from '../utils/event-emitter';
import CameraPage from './camera';
import GiftItem from './index/gift-item';

const regexPhoneVN = /((^(\+84|84|0|0084){1})(3|5|7|8|9))+([0-9]{8})$/;
const MIN_PHOTO = `Vui lòng chụp ảnh ít nhất 1 tấm`;

const validationSchema = yup.object({
    shopId: yup.number(),
    employeeId: yup.number(),
    reportDate: yup.string(),
    shiftId: yup.number(),
    content: yup.string(),
    type: yup.string(),
    billCode: yup.string().nullable(),
    photos: yup.array(),
    prizePhotos: yup.array().required(MIN_PHOTO).min(1, MIN_PHOTO),
    products: yup.array(),
    gifts: yup.array(),
    fullName: yup.string(),
    phoneNumber: yup.string(),
    phoneNumberOther: yup.string().matches(regexPhoneVN, { excludeEmptyString: true, message: ERROR_PHONE }).nullable().notRequired(),
    fullNameOther: yup.string().when('fullName', {
        is: (v) => Boolean(v),
        then: () => yup.string().required(ERROR_TEXT)
    }),
    orderCode: yup.string()
});

const ExchangeGiftStep4 = () => {
    const { state }: { state: OutletsResponse & { qrCode: string; giftType: TYPE; onlyRead?: boolean; selloutId?: number, fromSellOutPage?:boolean } } =
        useLocation();
    const navi = useNavigate();
    const mCreateSellout = useCreateSelloutMutation();
    const mUpdateCustomerInfo = useUpdateCustomerInfoMutation();
    const qGetQRCode = useGetDataFromQRCode({ orderCode: state.qrCode });
    const qGetSelloutTypes = useGetSellOutTypes({ campaignId: state.campaignId });
    const qGetSelloutImageTypes = useGetSellOutImageTypes({ campaignId: state.campaignId });
    const dataQRCode = qGetQRCode.data?.data;
    const parseDataContent: ReportContent = Boolean(dataQRCode?.content) ? JSON.parse(dataQRCode?.content ?? '') : {};
    const [billImages, givingGiftImages] = useGetSelloutImageQueries({ sellId: state.selloutId ? state.selloutId : dataQRCode?.sellOutId });

    console.log('code', state.qrCode);

    const {
        handleSubmit,
        control,
        formState: { errors },
        reset,
        watch,
        setValue
    } = useForm({
        defaultValues: async () => {
            return {
                shopId: state.shopId,
                employeeId: state.employeeId,
                reportDate: moment(state.workingDate).format('YYYY-MM-DD'),
                shiftId: state.shiftId,
                content: '',
                type: dataQRCode?.type.toString(),
                orderCode: state.qrCode,
                billCode: _.get(parseDataContent, 'invoice.billCode'),
                photos: _.map(_.get(parseDataContent, 'invoice.photos'), (t) => ({ data: t })),
                products: _.get(parseDataContent, 'products'),
                gifts: _.get(parseDataContent, 'gifts'),
                fullName: _.get(parseDataContent, 'customerInfo.fullName'),
                phoneNumber: _.get(parseDataContent, 'customerInfo.phoneNumber'),
                phoneNumberOther: _.get(parseDataContent, 'customerInfo.phoneNumberOther'),
                fullNameOther: _.get(parseDataContent, 'customerInfo.fullNameOther'),
                prizePhotos: _.map(_.get(givingGiftImages, 'data.data'), (t) => ({ data: t.photoUrl }))
            };
        },
        resolver: yupResolver(validationSchema)
    });

    const { field: fieldGifts } = useController({ control, name: 'gifts' });

    useEffect(() => {
        console.log('eff');

        if (_.size(givingGiftImages.data?.data) > 0 && !state.onlyRead) {
            Swal.fire({
                title: 'Lỗi',
                text: 'QR Code đã sử dụng!',
                icon: 'error',
                customClass: {
                    container: 'my-swal'
                },
                confirmButtonColor: '#3085d6',
                allowOutsideClick: false
            }).then((result) => {
                if (result.isConfirmed) {
                    navi(-1);
                }
            });
        }
    }, [givingGiftImages.data, state]);

    useEffect(() => {
        const dataQRCode = qGetQRCode.data?.data;
        const parseDataContent: ReportContent = Boolean(dataQRCode?.content) ? JSON.parse(dataQRCode?.content ?? '') : {};
        console.log(qGetQRCode, 'useEffect', parseDataContent);
        const d = _.get(givingGiftImages, 'data.data');

        Boolean(parseDataContent) &&
            reset({
                billCode: _.get(parseDataContent, 'invoice.billCode'),
                photos: _.map(_.get(parseDataContent, 'invoice.photos'), (t) => ({ data: t })),
                products: _.get(parseDataContent, 'products'),
                gifts: _.get(parseDataContent, 'gifts'),
                fullName: _.get(parseDataContent, 'customerInfo.fullName'),
                phoneNumber: _.get(parseDataContent, 'customerInfo.phoneNumber'),
                phoneNumberOther: _.get(parseDataContent, 'customerInfo.phoneNumberOther'),
                fullNameOther: _.get(parseDataContent, 'customerInfo.fullNameOther'),
                prizePhotos: _.map(d, (t) => ({ data: t.photoUrl }))
            });
    }, [qGetQRCode.data, givingGiftImages.data]);

    configAppView({
        hideIOSSafeAreaBottom: false
    });

    const submitData = (d: ConfirmDataZaloRequest) => {
        if (_.size(givingGiftImages.data?.data) > 0) {
            Swal.fire({
                title: 'Lỗi',
                text: `QR Code đã sử dụng!`,
                icon: 'error',
                customClass: {
                    container: 'my-swal'
                },
                confirmButtonColor: '#3085d6'
            });
            return;
        }
        const body3 = {
            shopId: state.shopId,
            reportDate: moment(state.workingDate).format('YYYY-MM-DD'),
            orderCode: state.qrCode,
            customerName: _.get(parseDataContent, 'customerInfo.fullName'),
            customerMobile: _.get(parseDataContent, 'customerInfo.phoneNumber'),
            prizePhotoList: _.map(d.prizePhotos, (v) => ({ prizePhoto: v.data?.replace('data:image/jpeg;base64,', '') })),
            campaignId: state.campaignId,
            shiftId: state.shiftId
        };
        const body12 = {
            selloutType: _.find(_.get(qGetSelloutTypes, 'data.data'), (w) => w.name == 'TAKE_GIFT')?.id,
            shopId: state.shopId,
            reportDate: moment(state.workingDate).format('YYYY-MM-DD'),
            address: state.address,
            shopName: state.shopName,
            shopCode: state.shopCode,
            shiftId: state.shiftId,
            customerName: _.get(parseDataContent, 'customerInfo.fullName'),
            customerMobile: _.get(parseDataContent, 'customerInfo.phoneNumber'),
            invoiceNo: _.get(parseDataContent, 'invoice.billCode'),
            orderCode: state.qrCode,
            photos: [
                ..._.map(d.prizePhotos, (val) => ({
                    latitude: 0,
                    longitude: 0,
                    isDelete: 0,
                    photoTime: moment().format('YYYY-MM-DD---HH:mm:ss').replace('---', 'T'),
                    platform: 'zalo-mini',
                    photoByte: val.data?.replace('data:image/jpeg;base64,', ''),
                    photoType: _.find(qGetSelloutImageTypes.data?.data, (t) => t.photoTypeCode === 'GIVING_GIFT')?.typeId
                })),
                ..._.map(_.get(parseDataContent, 'invoice.photos'), (t) => ({
                    latitude: 0,
                    longitude: 0,
                    isDelete: 0,
                    photoTime: moment().format('YYYY-MM-DD---HH:mm:ss').replace('---', 'T'),
                    platform: 'zalo-mini',
                    photoS3: t,
                    photoType: _.find(qGetSelloutImageTypes.data?.data, (t) => t.photoTypeCode === 'BILL')?.typeId
                }))
            ],
            details: _.get(parseDataContent, 'products'),
            gifts: _.get(parseDataContent, 'gifts')
        };

        if (dataQRCode?.type.toString() === TYPE.LUCKY_DRAW) {
            console.log('call api 3');
            mUpdateCustomerInfo.mutate({ body: JSON.stringify(body3), fromSellOutPage: state.fromSellOutPage ?? false});
        } else {
            console.log('call api 12');
            mCreateSellout.mutate({ body: JSON.stringify(body12), fromSellOutPage: state.fromSellOutPage ?? false });
        }
    };

    const onSubmit = (d: ConfirmDataZaloRequest) => {
        SwalConfirm({
            text: `Dữ liệu thông tin sẽ gửi!`
        }).then((result) => {
            if (result.isConfirmed) {
                console.log(d, 'data submit');
                submitData(d);
            }
        });
    };
    console.log(errors, 'err form');

    const handleBack = () => {
        if (state.onlyRead) {
            navi(-1);
        } else {
            SwalConfirm({
                text: `Dữ liệu thông tin sẽ mất!`
            }).then((result) => {
                if (result.isConfirmed) {
                    navi(-1);
                }
            });
        }
    };
    if (_.size(givingGiftImages.data?.data) > 0 && !state.onlyRead) return null;
    if (qGetQRCode.isLoading) return <LoadingScreen />;

    if (qGetQRCode.error) return <ErrorScreen onRetry={qGetQRCode.refetch} />;

    return (
        <Box height={'100vh'} justifyContent={'center'} display={'flex'} flexDirection={'column'}>
            <Header title={'CRE Advanced'} onBackClick={handleBack} />
            {_.isEmpty(errors) ? null : _.map(errors, (t) => <Alert severity="error">{t?.message}</Alert>)}
            <PullToRefresh
                pullingContent={''}
                onRefresh={async () => {
                    qGetSelloutTypes.refetch();
                    qGetQRCode.refetch();
                    qGetSelloutImageTypes.refetch();
                }}
            >
                <Box>
                    <Stack mt={1} bgcolor={'white'}>
                        <Typography color={'primary.main'} variant="subtitle1" px={2} pt={1}>{`Thông tin người nhận quà`}</Typography>
                        <Stack gap={2} bgcolor={'white'} p={2}>
                            <Controller
                                name="fullName"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        InputLabelProps={{ shrink: true }}
                                        required
                                        label="Tên Zalo của Anh/ Chị"
                                        {...field}
                                        error={Boolean(errors['fullName'])}
                                        helperText={Boolean(errors['fullName']) && errors['fullName']?.message}
                                        disabled
                                    />
                                )}
                            />
                            <Controller
                                name="phoneNumber"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        InputLabelProps={{ shrink: true }}
                                        required
                                        label="Số điện thoại"
                                        {...field}
                                        error={Boolean(errors['phoneNumber'])}
                                        helperText={Boolean(errors['phoneNumber']) && errors['phoneNumber']?.message}
                                        disabled
                                    />
                                )}
                            />
                            <Controller
                                name="phoneNumberOther"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        disabled={state.onlyRead}
                                        InputLabelProps={{ shrink: true }}
                                        label="Số điện thoại liên hệ khác (nếu có)"
                                        error={Boolean(errors['phoneNumberOther'])}
                                        helperText={Boolean(errors['phoneNumberOther']) && errors['phoneNumberOther']?.message}
                                        {...field}
                                    />
                                )}
                            />
                            <Controller
                                name="fullNameOther"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        disabled={state.onlyRead}
                                        InputLabelProps={{ shrink: true }}
                                        required
                                        label="Tên của Anh/ Chị"
                                        {...field}
                                        error={Boolean(errors['fullNameOther'])}
                                        helperText={Boolean(errors['fullNameOther']) && errors['fullNameOther']?.message}
                                    />
                                )}
                            />
                        </Stack>
                    </Stack>

                    <Stack mt={1} bgcolor={'white'} overflow={'scroll'}>
                        <Typography color={'primary.main'} variant="subtitle1" px={2} pt={1}>{`Thông tin quà tặng`}</Typography>
                        <Stack overflow={'scroll'} p={2} gap={2}>
                            {_.map(fieldGifts.value, (t) => (
                                <GiftItem key={t.giftId} {...t} createdDate={dataQRCode?.createdDate?.toString()} />
                            ))}
                        </Stack>
                    </Stack>

                    <BillInfo control={control} state={state} />
                    <PrizePhotoInfo state={state} control={control} />
                </Box>
            </PullToRefresh>

            {!state.onlyRead && (
                <Stack px={2} pt={1} bgcolor={'white'}>
                    <LoadingButton
                        onClick={handleSubmit(onSubmit)}
                        size="large"
                        fullWidth
                        variant="contained"
                        // disabled={Boolean(qGetDataFromQRCode.error)}
                        loading={mCreateSellout.isPending || mUpdateCustomerInfo.isPending}
                    >
                        {`Xác nhận`}
                    </LoadingButton>
                </Stack>
            )}
        </Box>
    );
};

export default ExchangeGiftStep4;

const BillInfo = ({ control, state }) => {
    const [open, setOpen] = React.useState(false);
    const [img, setImg] = useState<string | null>(null);

    const handleClose = () => {
        setOpen(false);
    };

    const { field: fieldBillCode } = useController({ control, name: 'billCode' });
    const { fields: photoFields, append, remove } = useFieldArray({ control, name: 'photos' });

    return (
        <Stack mt={1} bgcolor={'white'}>
            <Typography color={'primary.main'} variant="subtitle1" px={2} pt={1}>
                {`Thông tin đơn hàng (Tùy chọn)`}
            </Typography>
            <Stack p={2} gap={2}>
                <Stack spacing={2}>
                    <TextField
                        InputLabelProps={{ shrink: true }}
                        label={`Số hóa đơn`}
                        value={fieldBillCode.value}
                        onChange={fieldBillCode.onChange}
                        disabled={state.onlyRead}
                    />
                    <Typography variant="subtitle2">{`Hình bill (*)`}</Typography>
                    <Stack>
                        {_.map(photoFields, (t: { data: string; id: string }, i: number) => (
                            <Box
                                component={'div'}
                                onClick={() => {
                                    setOpen(true);
                                    setImg(t.data);
                                }}
                                key={i}
                                m={0.5}
                                width={100}
                                height={100}
                            >
                                <img src={t.data} style={{ objectFit: 'cover', width: 100, height: 100, borderRadius: 8 }} />
                            </Box>
                        ))}
                    </Stack>
                </Stack>
                <ImageReview open={open} handleClose={handleClose} img={img} />
            </Stack>
        </Stack>
    );
};

const PrizePhotoInfo = ({ control, state }) => {
    const navi = useNavigate();
    const { fields: photoFields, append, remove } = useFieldArray({ control, name: 'prizePhotos' });
    const [open, setOpen] = React.useState(false);
    const [img, setImg] = useState<string | null>(null);
    const handleClickOpen = () => setToggle();
    console.log(photoFields, 'photoFields');

    const handleClose = () => {
        setOpen(false);
    };

    useEffect(() => {
        eventEmitter.addListener('QR_CODE_CHANGED', ({ data }) => {
            console.log('QR_CODE_CHANGED', data);
            append({ data });
        });

        return () => {
            eventEmitter.removeAllListeners('QR_CODE_CHANGED');
        };
    }, []);
    const [toggle, setToggle] = useToggle(false);
    const qrScanner = toggle ? <CameraPage onClose={setToggle} /> : null;

    return (
        <Stack my={1} bgcolor={'white'}>
            <Typography color={'primary.main'} variant="subtitle1" px={2} pt={1}>
                {`Hình chụp trúng thưởng`}
            </Typography>
            <Stack p={2} gap={2}>
                <Stack alignItems="flex-start" direction={'row'} spacing={1} flex={1}>
                    {!state.onlyRead && (
                        <IconButton onClick={handleClickOpen} size="large">
                            <CameraAltIcon sx={{ width: 48, height: 48 }} />
                        </IconButton>
                    )}

                    <Stack direction={'row'} flexWrap={'wrap'}>
                        {_.map(photoFields, (t: { data: string }, i: number) => (
                            <Box
                                component={'div'}
                                onClick={() => {
                                    setOpen(true);
                                    setImg(t.data);
                                }}
                                key={i}
                                m={0.5}
                                position={'relative'}
                                width={100}
                                height={100}
                            >
                                <IconButton
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        remove(i);
                                    }}
                                    color="warning"
                                    sx={{
                                        display: state.onlyRead ? 'none' : 'flex',
                                        position: 'absolute',
                                        zIndex: 99,
                                        right: 4,
                                        top: 4,
                                        width: 24,
                                        height: 24,
                                        background: 'white'
                                    }}
                                    disableRipple
                                >
                                    <CloseIcon />
                                </IconButton>
                                <img src={t.data} style={{ objectFit: 'cover', width: 100, height: 100, borderRadius: 8 }} />
                            </Box>
                        ))}
                    </Stack>
                </Stack>
            </Stack>
            <ImageReview open={open} handleClose={handleClose} img={img} />
            <CameraModal open={toggle} handleClose={setToggle}>
                {qrScanner}
            </CameraModal>
        </Stack>
    );
};
