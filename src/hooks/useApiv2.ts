import { UseQueryOptions, useMutation, useQueries, useQuery } from '@tanstack/react-query';
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
import axiosZaloMiniServices from '../utils/axiosZaloMiniServices';
import { AxiosError } from 'axios';
import { useSnackbar } from 'zmp-ui';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { TYPE } from '../constant';
import {
    CampaignsResponse,
    LoginRequest,
    LoginResponse,
    OutletsResponse,
    ProfileResponse,
    ResponseNetwork,
    SellOutImageTypeResponse,
    SellOutTypesResponse,
    SelloutImagesResponse
} from '../types/zaloMiniTypes';
import { setSession } from '../utils/jwt';
import { GiftResponse, ProductResponse } from '../types/advancedTypes';

export const useGetCustomerGiftQueries = ({ campaignId }) => {
    return useQueries<UseQueryOptions<ResponseNetwork<ProductResponse[]>, ResponseNetwork<GiftResponse[]>>[]>({
        queries: [
            {
                queryKey: ['getproduct', campaignId],
                queryFn: () =>
                    axiosZaloMiniServices.get(`api/miniapp/creadvanced/getproduct`, {
                        params: {
                            campaignId
                        }
                    })
            },
            {
                queryKey: ['getluckywheelgift', campaignId],
                queryFn: () =>
                    axiosZaloMiniServices.get(`api/miniapp/creadvanced/getluckywheelgift`, {
                        params: {
                            campaignId
                        }
                    })
            }
        ]
    });
};

export const useGetDataFromQRCode = ({ orderCode }) => {
    return useQuery<QRCodeData>({
        queryKey: [`getDataFromQRCode_${orderCode}`],
        queryFn: () =>
            axiosZaloMiniServices.get(`api/miniapp/cregift/get`, {
                params: { orderCode }
            }),
        enabled: Boolean(orderCode),
        retry: 0
    });
};

export const useGetSelloutImage = ({
    sellId,
    photoTypeCode,
    enabledGetSelloutImage
}: {
    sellId?: number;
    photoTypeCode?: string;
    enabledGetSelloutImage?: boolean;
}) => {
    return useQuery<any>({
        queryKey: [`getselloutimage_${sellId}_${photoTypeCode}`],
        queryFn: () =>
            axiosZaloMiniServices.get(`api/miniapp/creadvanced/getselloutimage`, {
                params: { sellId, photoTypeCode }
            }),
        enabled: Boolean(enabledGetSelloutImage),
        retry: 0
    });
};

export const useGetSelloutImageQueries = ({ sellId }) => {
    return useQueries<UseQueryOptions<ResponseNetwork<SelloutImagesResponse[]>, ResponseNetwork<SelloutImagesResponse[]>>[]>({
        queries: [
            {
                queryKey: ['image_bill', sellId],
                queryFn: () =>
                    axiosZaloMiniServices.get(`api/miniapp/creadvanced/getselloutimage`, {
                        params: { sellId, photoTypeCode: 'BILL' }
                    }),
                enabled: Boolean(sellId)
            },
            {
                queryKey: ['image_giving_gift', sellId],
                queryFn: () =>
                    axiosZaloMiniServices.get(`api/miniapp/creadvanced/getselloutimage`, {
                        params: { sellId, photoTypeCode: 'GIVING_GIFT' }
                    }),
                enabled: Boolean(sellId)
            }
        ]
    });
};

export const useGetQRCodeQuery = ({ orderCode }) => {
    return useQuery<string>({
        queryKey: [`getqrcode_${orderCode}`],
        queryFn: () =>
            axiosZaloMiniServices.get(`api/miniapp/cregift/getqrcode`, {
                params: { orderCode }
            }),
        enabled: Boolean(orderCode)
    });
};

export const useGetDataLuckyGift = ({ orderCodeLucky }) => {
    return useQuery<ResponseLuckyGift>({
        queryKey: [`getluckydrawgift_${orderCodeLucky}`],
        queryFn: () =>
            axiosZaloMiniServices.get(`api/miniapp/cregift/getluckydrawgift`, {
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
            axiosZaloMiniServices.get(`api/miniapp/cregift/getschemegift_recommend`, {
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
            axiosZaloMiniServices.get(`api/miniapp/creloyalty/getloyaltypoint_total`, {
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
            axiosZaloMiniServices.get(`api/miniapp/creloyalty/getloyaltypoint`, {
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
            axiosZaloMiniServices.get(`api/miniapp/creloyalty/getloyaltygift`, {
                params: { campaignId }
            }),
        enabled: Boolean(campaignId),
        retry: 0
    });
};

export const useGetCampaigns = () => {
    return useQuery<ResponseNetwork<CampaignsResponse[]>>({
        queryKey: [`getavailablecampaign`],
        queryFn: () => axiosZaloMiniServices.get(`api/miniapp/creadvanced/getavailablecampaign`)
    });
};

export const useGetOutlets = ({ campaignId }) => {
    return useQuery<ResponseNetwork<OutletsResponse[]>>({
        queryKey: [`getavailableoutlet_${campaignId}`],
        queryFn: () => axiosZaloMiniServices.get(`api/miniapp/creadvanced/getavailableoutlet`, { params: { campaignId } })
    });
};

export const useGetSellouts = ({ campaignId, shopId, sellOutType = '', reportDate, reportId = '' }) => {
    return useQuery<any[]>({
        queryKey: [`getsellout_${campaignId}`],
        queryFn: () =>
            axiosZaloMiniServices.get(`api/miniapp/creadvanced/getsellout`, {
                params: { campaignId, shopId, sellOutType, reportDate, reportId }
            })
    });
};

export const useGetSellOutTypes = ({ campaignId }) => {
    return useQuery<ResponseNetwork<SellOutTypesResponse[]>>({
        queryKey: [`getsellouttype_${campaignId}`],
        queryFn: () =>
            axiosZaloMiniServices.get(`api/miniapp/creadvanced/getsellouttype`, {
                params: { campaignId }
            })
    });
};

export const useGetSellOutImageTypes = ({ campaignId }) => {
    return useQuery<ResponseNetwork<SellOutImageTypeResponse[]>>({
        queryKey: [`getselloutimagetype_${campaignId}`],
        queryFn: () =>
            axiosZaloMiniServices.get(`api/miniapp/creadvanced/getselloutimagetype`, {
                params: { campaignId }
            })
    });
};

export const useGetProfile = () => {
    return useQuery<ResponseNetwork<ProfileResponse>>({
        queryKey: [`getprofile`],
        queryFn: () => axiosZaloMiniServices.get(`/api/miniapp/creadvanced/getprofile`)
    });
};

// MUTATION
export const useConfirmMutation = ({ confirmSuccess }) => {
    const { openSnackbar, setDownloadProgress, closeSnackbar } = useSnackbar();
    const navigate = useNavigate();

    return useMutation<{ data: number }, AxiosError, Confirm & { type?: TYPE }>({
        mutationFn: (d) => axiosZaloMiniServices.post('api/miniapp/cregift/confirm', d),
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
        mutationFn: (d) => axiosZaloMiniServices.post('api/miniapp/creloyalty/createredeem', d),
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

export const useLoginMutation = () => {
    const navi = useNavigate();
    return useMutation<LoginResponse, AxiosError, LoginRequest>({
        mutationFn: (d) => axiosZaloMiniServices.post('api/miniapp/creadvanced/signin', d),
        onSuccess(data, variables, context) {
            console.log(data, 'res data');
            if (data.token) {
                setSession(data.token);
                navi('/home-page', { replace: true });
            } else {
                Swal.fire({
                    title: 'Lỗi',
                    text: data.message || `Đăng nhập thất bại!`,
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

export const useCreateQRCodeMutation = () => {
    const navi = useNavigate();
    return useMutation<ResponseNetwork<string>, AxiosError, { data: FormData; state: OutletsResponse & { giftType: string } }>({
        mutationFn: (d) =>
            axiosZaloMiniServices.post('api/miniapp/cregift/create', d.data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }),
        onSuccess(data, variables, context) {
            console.log(data, 'res data');
            if (data.data) {
                navi('/exchange-gift-step-2', { state: { ...variables.state, qrCode: data.data }, replace: true });
            } else {
                Swal.fire({
                    title: 'Lỗi',
                    text: `Có lỗi xảy ra!`,
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

export const useCreateSelloutMutation = () => {
    const navi = useNavigate();

    return useMutation<ResponseNetwork<{ message: string; orderCode: string; sellId: number }>, AxiosError, { body: string }>({
        mutationFn: (d) => axiosZaloMiniServices.post('api/miniapp/creadvanced/createsellout', d),
        onSuccess(data, variables, context) {
            console.log(data, 'res data');
            if (_.get(data, 'data.sellId')) {
                navi(-2);
            } else {
                Swal.fire({
                    title: 'Lỗi',
                    text: `Có lỗi xảy ra!`,
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

export const useUpdateCustomerInfoMutation = () => {
    const navi = useNavigate();

    return useMutation<ResponseNetwork<number>, AxiosError, { body: string }>({
        mutationFn: (d) => axiosZaloMiniServices.post('/api/miniapp/creadvanced/updatecustomerinfo', d),
        onSuccess(data, variables, context) {
            console.log(data, 'res data');
            if (data.data > 0) {
                navi(-2);
            } else {
                Swal.fire({
                    title: 'Lỗi',
                    text: `Có lỗi xảy ra!`,
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
