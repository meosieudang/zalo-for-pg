import { useMutation, useQuery } from '@tanstack/react-query';
import {
    Confirm,
    CreateRedeem,
    QRCodeData,
    ResponseLoyalty,
    ResponseLoyaltyTotal,
    ResponseLuckyGift,
    ResponseReward,
    ResponseSchemeGift
} from '../types/api';
import axiosServices from '../utils/axios';
import { AxiosError } from 'axios';
import { useSnackbar } from 'zmp-ui';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { TYPE } from '../constant';

export const useGetDataFromQRCode = ({ orderCode }) => {
    return useQuery<QRCodeData>({
        queryKey: [`getDataFromQRCode_${orderCode}`],
        queryFn: () =>
            axiosServices.get(`api/miniapp/cregift/get`, {
                params: { orderCode }
            }),
        enabled: Boolean(orderCode),
        retry: 0
    });
};

export const useGetDataLuckyGift = ({ orderCodeLucky }) => {
    return useQuery<ResponseLuckyGift>({
        queryKey: [`getluckydrawgift_${orderCodeLucky}`],
        queryFn: () =>
            axiosServices.get(`api/miniapp/cregift/getluckydrawgift`, {
                params: { orderCode: orderCodeLucky }
            }),
        enabled: false,
        retry: 0
    });
};

export const useGetSchemeGift = ({ orderCode }) => {
    return useQuery<ResponseSchemeGift>({
        queryKey: [`getSchemeGift_${orderCode}`],
        queryFn: () =>
            axiosServices.get(`api/miniapp/cregift/getschemegift_recommend`, {
                params: { orderCode: orderCode }
            }),
        enabled: Boolean(orderCode),
        retry: 0
    });
};

export const useGetLoyaltyPointTotal = ({ zaloId }) => {
    return useQuery<ResponseLoyaltyTotal>({
        queryKey: [`getloyaltypoint_total_${zaloId}`],
        queryFn: () =>
            axiosServices.get(`api/miniapp/creloyalty/getloyaltypoint_total`, {
                params: { id: zaloId }
            }),
        enabled: Boolean(zaloId),
        retry: 0
    });
};

export const useGetLoyaltyPoint = ({ campaignId }) => {
    const { user } = useAuth();
    return useQuery<ResponseLoyalty>({
        queryKey: [`getloyaltypoint_${user?.id}_${campaignId}`],
        queryFn: () =>
            axiosServices.get(`api/miniapp/creloyalty/getloyaltypoint`, {
                params: { id: user?.id, campaignId }
            }),
        enabled: Boolean(user?.id) && Boolean(campaignId),
        retry: 0
    });
};

export const useGetReward = ({ campaignId }) => {
    return useQuery<ResponseReward>({
        queryKey: [`getloyaltygift_${campaignId}`],
        queryFn: () =>
            axiosServices.get(`api/miniapp/creloyalty/getloyaltygift`, {
                params: { campaignId }
            }),
        enabled: Boolean(campaignId),
        retry: 0
    });
};

export const useGetRedeem = ({ campaignId }) => {
    const { user } = useAuth();

    return useQuery<ResponseReward>({
        queryKey: [`getredeem_${campaignId}`],
        queryFn: () =>
            axiosServices.get(`api/miniapp/creloyalty/getredeem`, {
                params: { campaignId, id: user?.id ?? null }
            }),
        enabled: Boolean(campaignId),
        retry: 0
    });
};

// MUTATION
export const useConfirmMutation = ({ confirmSuccess }) => {
    const { openSnackbar, setDownloadProgress, closeSnackbar } = useSnackbar();
    const navigate = useNavigate();

    return useMutation<{ data: number }, AxiosError, Confirm & { type?: TYPE }>({
        mutationFn: (d) => axiosServices.post('api/miniapp/cregift/confirm', d),
        onSuccess(data, variables, context) {
            if (Number(data.data) > 0) {
                confirmSuccess?.(variables);
            } else {
                Swal.fire({
                    title: 'Lỗi',
                    text: `Vui lòng liên hệ PG!`,
                    icon: 'error',
                    customClass: {
                        container: 'my-swal'
                    },
                    confirmButtonColor: '#3085d6'
                });
            }
        },
        onError(error, variables, context) {
            Swal.fire({
                title: 'Lỗi',
                text: _.get(error, 'response.data.error.message') || error.message,
                icon: 'error',
                customClass: {
                    container: 'my-swal'
                },
                confirmButtonColor: '#3085d6'
            });
        }
    });
};

export const useCreateRedeemMutation = ({ createRedeemSuccess }) => {
    return useMutation<{ data: number }, AxiosError, CreateRedeem>({
        mutationFn: (d) => axiosServices.post('api/miniapp/creloyalty/createredeem', d),
        onSuccess(data, variables, context) {
            console.log(data, 'res data');

            if (Number(data.data) > 0) {
                Swal.fire({
                    title: 'Thông báo',
                    text: 'Đổi thành công',
                    icon: 'success',
                    customClass: {
                        container: 'my-swal'
                    }
                });
                createRedeemSuccess?.();
            } else {
                Swal.fire({
                    title: 'Lỗi',
                    text: `Vui lòng liên hệ PG!`,
                    icon: 'error',
                    customClass: {
                        container: 'my-swal'
                    },
                    confirmButtonColor: '#3085d6'
                });
            }
        },
        onError(error, variables, context) {
            console.log(error, 'err');
            Swal.fire({
                title: 'Lỗi',
                text: _.get(error, 'response.data.error.message') || error.message,
                icon: 'error',
                customClass: {
                    container: 'my-swal'
                },
                confirmButtonColor: '#3085d6'
            });
        }
    });
};
