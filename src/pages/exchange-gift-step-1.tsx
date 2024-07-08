import { yupResolver } from '@hookform/resolvers/yup';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import CloseIcon from '@mui/icons-material/Close';
import { Box, Button, Dialog, IconButton, Slide, Stack, TextField, Typography } from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import React, { useEffect, useState } from 'react';
import { useAliveController } from 'react-activation';
import { FieldArrayWithId, useController, useFieldArray, useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import PullToRefresh from 'react-simple-pull-to-refresh';
import * as yup from 'yup';
import { Header } from 'zmp-ui';
import ErrorScreen from '../components/error-screen';
import LoadingScreen from '../components/loading-screen';
import { ERROR_TEXT, TYPE } from '../constant';
import { GiftResponse, ProductResponse } from '../types/advancedTypes';
import { StateExchangeGiftStep1 } from '../types/state';
import eventEmitter from '../utils/event-emitter';
import { configAppView, getStorage } from 'zmp-sdk/apis';
import { CreateQRCodeZaloRequest, OutletsResponse } from '../types/zaloMiniTypes';
import { useCreateQRCodeMutation, useGetCustomerGiftQueries } from '../hooks/useApiv2';
import LoadingButton from '@mui/lab/LoadingButton';
import ImageReview from '../components/image-review';

const validationSchema = yup.object({
    shopId: yup.number(),
    employeeId: yup.number(),
    reportDate: yup.string(),
    shiftId: yup.number(),
    content: yup.string(),
    type: yup.string(),
    billCode: yup.string().nullable(),
    photos: yup.array().when('billCode', {
        is: (v) => {
            return Boolean(v);
        },
        then: () => yup.array().required().min(1, `Vui lòng chụp ảnh ít nhất 1 tấm`)
    }),
    products: yup.array(),
    gifts: yup.array()
});

const ExchangeGiftStep1 = () => {
    const { state }: { state: OutletsResponse & { giftType: TYPE } } = useLocation();
    const [products, gifts] = useGetCustomerGiftQueries({ campaignId: state.campaignId });
    const {
        handleSubmit,
        control,
        formState: { errors },
        reset,
        setValue,
        getValues,
        setError,
        watch
    } = useForm({
        defaultValues: async () => {
            return {
                shopId: state.shopId,
                employeeId: state.employeeId,
                reportDate: moment(state.workingDate).format('YYYY-MM-DD'),
                shiftId: state.shiftId,
                content: '',
                type: state.giftType,
                billCode: '',
                photos: [],
                products: _.get(products, 'data.data'),
                gifts: _.get(gifts, 'data.data')
            };
        },
        resolver: yupResolver(validationSchema)
    });

    console.log(errors, 'errors form');
    useEffect(() => {
        reset({ products: _.get(products, 'data.data'), gifts: _.get(gifts, 'data.data') });
    }, [products.data, gifts.data]);

    configAppView({
        hideIOSSafeAreaBottom: false
    });

    const navi = useNavigate();
    const { drop, dropScope, clear, getCachingNodes } = useAliveController();
    const mCreateQRCode = useCreateQRCodeMutation();
    console.log(getCachingNodes(), 'getCachingNodes');

    const onSubmit = async (d: CreateQRCodeZaloRequest) => {
        const { key1 } = await getStorage({ keys: ['key1'] });

        console.log(d, 'd');
        const sumPro = _.sumBy(d.products, (t) => t.quantity);
        const sumGift = _.sumBy(d.gifts, (t) => t.quantity);
        const valid = {};
        if (sumPro === 0 || sumPro === undefined) {
            setError('products', { message: 'Vui lòng nhập số lượng' });
            valid['product'] = 'Vui lòng nhập số lượng';
        }
        if (state.giftType === TYPE.DEFAULT && (sumGift === 0 || sumGift === undefined)) {
            setError('gifts', { message: 'Vui lòng nhập số lượng' });
            valid['gift'] = 'Vui lòng nhập số lượng';
        }

        if (Object.keys(valid).length === 0) {
            console.log('ok submit');
            const proD = _.filter(d.products, (t) => t.quantity > 0);
            const giftD = _.filter(d.gifts, (t) => t.quantity > 0);
            const invoiceD = {
                billCode: d.billCode,
                photos: _.map(d.photos, (t) => t.data)
            };

            const formData = new FormData();
            formData.append('shopId', state.shopId.toString());
            formData.append('employeeId', state.employeeId.toString());
            formData.append('reportDate', moment(state.workingDate).format('YYYY-MM-DD'));
            formData.append('shiftId', state.shiftId.toString());
            formData.append('type', state.giftType);
            formData.append(
                'content',
                JSON.stringify({
                    gifts: state.giftType === TYPE.DEFAULT ? giftD : [],
                    products: proD,
                    invoice: invoiceD
                    // accessToken: key1
                })
            );
            // console.log(Array.from(formData.entries()));

            // DATA SUBMIT
            mCreateQRCode.mutate({ data: formData, state });
            clear();
        }
    };
    // const handleSubmit = () => {};
    const handleBack = () => {
        clear();
        navi(-1);
    };

    if (products.isLoading || gifts.isLoading) return <LoadingScreen />;

    if (products.error || gifts.error) return <ErrorScreen onRetry={products.refetch || gifts.refetch} />;
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
                onBackClick={handleBack}
            />
            <PullToRefresh pullingContent={''} onRefresh={products.refetch || gifts.refetch}>
                <Box>
                    <DataList errors={errors['products']?.message} control={control} name="products" title={`Thông tin sản phẩm`} />
                    {state.giftType === TYPE.DEFAULT && (
                        <DataList errors={errors['gifts']?.message} control={control} name="gifts" title={`Thông tin quà tặng`} />
                    )}
                    <BillInfo control={control} errors={errors['photos']?.message} />
                </Box>
            </PullToRefresh>
            <LoadingButton
                loading={mCreateQRCode.isPending}
                sx={{ mx: 2 }}
                variant="contained"
                onClick={handleSubmit(onSubmit)}
                // onClick={() => navi('/exchange-gift-step-2', { state: { ...state, qrCode: '1zG9E65O4X' }, replace: true })}
            >
                {`Tiếp theo`}
            </LoadingButton>
        </Box>
    );
};

export default ExchangeGiftStep1;

const DataList = ({ title, control, name, errors }: { control: any; name: string; title: string; errors?: string }) => {
    const { fields, update } = useFieldArray({ control, name });
    return (
        <Box mx={2} mt={2}>
            <Box p={2} borderRadius={1} border={`1px dashed`} component={'fieldset'}>
                <Typography px={0.5} component={'legend'} variant="subtitle2">
                    {title}
                </Typography>
                <Stack spacing={2}>
                    {_.map(fields, (t: ProductResponse & (GiftResponse & { id: string }), index: number) => (
                        <DataItem key={t.productId || t.giftId} item={t} index={index} update={update} />
                    ))}
                </Stack>
            </Box>
            {Boolean(errors) && (
                <Typography variant="caption" color={'error.main'}>
                    {errors}
                </Typography>
            )}
        </Box>
    );
};

const DataItem = (props: { item: ProductResponse & GiftResponse & { quantity?: number; id: String }; index: number; update: any }) => {
    const { item: t, index, update } = props;

    const [quantity, setQuantity] = useState(0);
    const increment = () => {
        setQuantity((prevCount) => {
            let a = Number(prevCount);
            update(index, { ...t, quantity: a + 1 });
            return (a += 1);
        });
    };

    const decrement = () => {
        setQuantity((prevCount) => {
            let a = Number(prevCount);

            if (a > 0) {
                update(index, { ...t, quantity: a - 1 });
                return (a -= 1);
            } else {
                return (a = 0);
            }
        });
    };

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newQuantity = Number(e.target.value);
        setQuantity(newQuantity);
        update(index, { ...t, quantity: newQuantity });
    };

    return (
        <Stack direction={'row'} flex={1}>
            <Stack flex={1} justifyContent={'center'}>
                <Typography variant="subtitle2">{_.get(t, 'productName') || _.get(t, 'giftName')}</Typography>
                <Typography variant="caption">{_.get(t, 'productCode')}</Typography>
            </Stack>

            <Stack direction={'row'} flex={2} spacing={1} alignItems={'center'} justifyContent={'center'}>
                <Button sx={{ height: 40, minWidth: 40 }} variant="outlined" onClick={decrement}>{`-`}</Button>
                <TextField
                    inputProps={{ min: 0, style: { textAlign: 'center' }, inputMode: 'numeric', pattern: '[0-9]*' }}
                    value={quantity}
                    onChange={onChange}
                    size="small"
                    type="number"
                />
                <Button sx={{ height: 40, minWidth: 40 }} variant="outlined" onClick={increment}>{`+`}</Button>
            </Stack>
        </Stack>
    );
};

const BillInfo = ({ control, errors }) => {
    const [open, setOpen] = React.useState(false);
    const [img, setImg] = useState<string | null>(null);
    const navi = useNavigate();
    const handleClickOpen = () => navi('/camera');

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

    const { field: fieldBillCode } = useController({ control, name: 'billCode' });
    const { fields: photoFields, append, remove } = useFieldArray({ control, name: 'photos' });

    return (
        <Box mx={2} mt={2}>
            <Box p={2} borderRadius={1} border={`1px dashed`} component={'fieldset'}>
                <Typography px={0.5} component={'legend'} variant="subtitle2">
                    {`Thông tin đơn hàng (Tùy chọn)`}
                </Typography>
                <Stack spacing={2}>
                    <TextField
                        InputLabelProps={{ shrink: true }}
                        size="small"
                        label={`Số hóa đơn`}
                        value={fieldBillCode.value}
                        onChange={fieldBillCode.onChange}
                    />
                    <Typography variant="subtitle2">{`Hình bill (*)`}</Typography>

                    <Stack alignItems="flex-start" direction={'row'} spacing={1} flex={1}>
                        <IconButton onClick={handleClickOpen} size="large">
                            <CameraAltIcon sx={{ width: 48, height: 48 }} />
                        </IconButton>

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
                                    <img
                                        src={t.data}
                                        style={{ objectFit: 'cover', width: 100, height: 100, position: 'fixed', borderRadius: 8 }}
                                    />
                                </Box>
                            ))}
                        </Stack>
                    </Stack>
                </Stack>
                <ImageReview open={open} handleClose={handleClose} img={img} />
            </Box>
            {Boolean(errors) && (
                <Typography variant="caption" color={'error.main'}>
                    {errors}
                </Typography>
            )}
        </Box>
    );
};
