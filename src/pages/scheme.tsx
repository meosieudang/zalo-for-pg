import { Alert, Box, Snackbar, Stack, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { BASE_URL_IMG, TYPE } from '../constant';
import { Header } from 'zmp-ui';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useConfirmMutation, useGetDataFromQRCode, useGetSchemeGift } from '../hooks/useApiv2';
import { LoadingButton } from '@mui/lab';
import ErrorScreen from '../components/error-screen';
import LoadingScreen from '../components/loading-screen';
import { Confirm, GiftItem } from '../types/api';

const mergeAndSummarize = (items, key) => {
    const grouped = _.groupBy(items, key);
    return _.map(grouped, (group) => {
        return {
            //@ts-ignore
            ...group[0],
            quantity: _.sumBy(group, 'quantity')
        };
    });
};

const SchemePage = () => {
    const { code, type } = useParams();
    const { state }: { state: Confirm & { type?: TYPE } } = useLocation();

    const navi = useNavigate();

    const mConfirm = useConfirmMutation({
        confirmSuccess: () => {
            return navi(`/qr-code/${code}`, { replace: true });
        }
    });
    const qGetSchemeGift = useGetSchemeGift({ orderCode: code });
    const getSchemeGiftData = qGetSchemeGift.data?.data;

    const qGetDataFromQRCode = useGetDataFromQRCode({ orderCode: code });
    const qrCodeData = qGetDataFromQRCode.data?.data;

    const [open, setOpen] = React.useState(false);
    const [error, setError] = useState('');

    const onConfirmSubmit = (giftD: GiftItem[]) => {
        return mConfirm.mutate({
            ...state,
            isOnlyUserInfo: false,
            gifts: JSON.stringify(giftD)
        });
    };

    const onSubmit = () => {
        // console.log(getSchemeGiftData?.arrayRecommend);
        const d = _.map(getSchemeGiftData?.arrayRecommend, (t) => _.values(t.productRecommendResult));
        const dd = _.flatMapDeep(d).map((t) => t.listGiftMapped);
        const ddd = _.flatMapDeep(dd);
        const sumD = _.sumBy(ddd, (t) => t.quantity);
        console.log(sumD, ddd);
        const dFilter = _.filter(ddd, (t) => t.quantity > 0);
        const dSubmit: GiftItem[] = mergeAndSummarize(dFilter, 'giftId');

        if (sumD === 0) {
            setError('Vui lòng chọn quà');
            setOpen(true);
            return;
        }

        if (ddd.some((t) => t.isValid === false)) {
            setError('Thông tin nhập quà không hợp lệ');
            setOpen(true);
            return;
        }

        if (sumD < (getSchemeGiftData?.limitGift ?? 0)) {
            const answer = confirm(
                `Hiện tại bạn đã chọn ${sumD} quà, Bạn có thể nhận tối đa ${getSchemeGiftData?.limitGift} quà. Bạn có muốn tiếp tục?`
            );

            if (answer) {
                onConfirmSubmit(dSubmit);
            }
            return;
        }

        if (sumD > (getSchemeGiftData?.limitGift ?? 0)) {
            setError(`Số lượng quà tối đa được nhận là ${getSchemeGiftData?.limitGift ?? 0}`);
            setOpen(true);
            return;
        }

        console.log(dSubmit, 'submut');
        return onConfirmSubmit(dSubmit);
    };

    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };

    const onBackClick = () => {
        const a = confirm(`Bạn có muốn thoát?`);
        if (a) {
            navi('/', { replace: true });
        }
    };

    if (qGetSchemeGift.isLoading) return <LoadingScreen />;

    if (qGetSchemeGift.error) return <ErrorScreen onRetry={qGetSchemeGift.refetch} />;

    return (
        <Box minHeight={'100vh'} display={'flex'} flexDirection={'column'} flex={1} bgcolor={'white'}>
            <Header title={qrCodeData?.shopName ?? 'CRE Advanced'} onBackClick={onBackClick} />

            <Box px={2}>
                <Stack spacing={2}>
                    {_.map(getSchemeGiftData?.arrayRecommend ?? [], (product, idxPro) => {
                        return (
                            <Stack direction={'column'} key={idxPro}>
                                <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
                                    <Typography fontWeight={'500'} variant="subtitle1">{`${product.productName}`}</Typography>
                                    <Typography fontWeight={'500'} variant="subtitle1">{`SL: ${product.productQuantity}`}</Typography>
                                </Stack>
                                <B data={product.productRecommendResult} />
                            </Stack>
                        );
                    })}
                </Stack>
            </Box>

            <Stack sx={{ position: 'sticky', bottom: 0 }} px={2} pt={2} bgcolor={'white'} spacing={1}>
                <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
                    <Typography variant="caption">{`Số quà tối đa nhận được: ${getSchemeGiftData?.limitGift}`}</Typography>
                    <Typography variant="caption">
                        {`Mã code: `}
                        <Typography fontWeight={'500'} variant="caption">
                            {code}
                        </Typography>
                    </Typography>
                </Stack>

                <LoadingButton
                    onClick={onSubmit}
                    size="large"
                    fullWidth
                    variant="contained"
                    disabled={Boolean(qGetDataFromQRCode.error)}
                    loading={mConfirm.isPending}
                >
                    {`Xác nhận`}
                </LoadingButton>
            </Stack>

            <Snackbar
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                open={open}
                autoHideDuration={3000}
                onClose={handleClose}
                sx={{ paddingTop: 10 }}
            >
                <Alert onClose={handleClose} severity="error" variant="filled" sx={{ width: '100%' }}>
                    {error}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default SchemePage;

const B = ({ data }) => {
    return (
        <Stack spacing={2} direction={'column'}>
            {_.map(data, (it, idx) => {
                return (
                    <Stack direction={'column'} key={idx}>
                        <Box px={2} pb={1.5} component={'fieldset'} borderRadius={2} border={`1px solid`}>
                            <Typography component={'legend'} px={0.5}>
                                {idx.replace('option', 'Lựa chọn')}
                            </Typography>
                            <Stack direction={'column'} spacing={1.5}>
                                {_.map(it, (t, idxx) => {
                                    return (
                                        <Stack direction={'column'} key={idxx}>
                                            <Box px={2} py={1} borderRadius={1} border={`1px dashed`} component={'fieldset'}>
                                                {/* HINT */}
                                                <Typography px={0.5} component={'legend'} variant="subtitle2">
                                                    {t.hint}
                                                </Typography>
                                                <div style={{ flex: 1 }}>
                                                    <A title={t.title} data={t.listGiftMapped} maxGift={t.maxGift} />
                                                </div>
                                            </Box>
                                        </Stack>
                                    );
                                })}
                            </Stack>
                        </Box>
                    </Stack>
                );
            })}
        </Stack>
    );
};

const A = ({ data, maxGift, title }) => {
    const [val, setVal] = useState({});
    //   console.log(val, "val");
    const sumA = _.sum(Object.values(val)) <= maxGift;

    return (
        <Stack spacing={1.5} direction={'column'}>
            {_.map(data, (input, iidx) => {
                return (
                    <Stack key={iidx} direction={'row'}>
                        <Box flex={1}>
                            <img src={`${BASE_URL_IMG}${input.giftWinImage}`} width={'50%'} style={{ alignSelf: 'center' }} />
                        </Box>

                        <TextItem
                            dataItem={input}
                            maxGift={maxGift}
                            key={iidx}
                            label={input.giftName}
                            cb={(m: any) => setVal((prev) => ({ ...prev, [m['key']]: Number(m.value) }))}
                            dd={data}
                            sumA={sumA}
                            title={title}
                        />
                    </Stack>
                );
            })}
        </Stack>
    );
};

const TextItem = ({ sumA, label, dataItem, maxGift, cb, dd, title }) => {
    const [text, setText] = useState('');
    //   console.log(data, maxGift, "ll");
    //   console.log(dataItem, "ff", title);
    useEffect(() => {
        dataItem.isValid = sumA;
    }, [sumA]);

    return (
        <TextField
            inputProps={{
                inputMode: 'numeric',
                min: 0,
                pattern: '[0-9]*'
            }}
            type="number"
            variant="filled"
            size="small"
            sx={{ zIndex: 0 }}
            InputLabelProps={{ shrink: true }}
            label={label}
            value={text}
            onChange={(e) => {
                setText(e.target.value);
                dataItem.quantity = Number(e.target.value);
                cb({ key: dataItem.id, value: e.target.value });
            }}
            error={!sumA}
            helperText={!sumA ? `Tổng quà nhỏ hơn hoặc bằng ${maxGift}` : `Tối đa ${maxGift} quà`}
            //   disabled={!sumA}
        />
    );
};
