import { UseQueryOptions, useMutation, useQueries, useQuery } from '@tanstack/react-query';
import axiosAdvancedServices from '../utils/axiosAdvancedServices';
import { GiftResponse, ProductResponse, SellOutResponse } from '../types/advancedTypes';
import { ResponseNetwork } from '../types/zaloMiniTypes';
import { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAliveController } from 'react-activation';

export const useGetSelloutQuery = ({ campaignId, shopId, reportDate, selloutType }) => {
    return useQuery<SellOutResponse[]>({
        queryKey: ['get_sellout_bydate'],
        queryFn: () =>
            axiosAdvancedServices.get(`api/sellout/get_sellout_bydate`, {
                params: {
                    campaignId,
                    shopId,
                    reportDate,
                    selloutType
                }
            }),
        enabled: Boolean(campaignId)
    });
};
export const useGetCustomerGiftQueries = ({ campaignId, provinceId, channelId }) => {
    return useQueries<UseQueryOptions<ProductResponse[], GiftResponse[]>[]>({
        queries: [
            {
                queryKey: ['products', campaignId],
                queryFn: () =>
                    axiosAdvancedServices.get(`api/product/get_products`, {
                        params: {
                            campaignId
                        }
                    })
            },
            {
                queryKey: ['gifts', campaignId, provinceId],
                queryFn: () =>
                    axiosAdvancedServices.get(`api/luckywheel/get_luckywheels`, {
                        params: {
                            campaignId,
                            provinceId,
                            channelId
                        }
                    })
            }
        ]
    });
};

export const useCreateSelloutMutation = () => {
    const navi = useNavigate();
    const { drop, dropScope, clear, getCachingNodes } = useAliveController();

    return useMutation<{ message: string; orderCode: string; sellId: number }, AxiosError, { data; token: string }>({
        mutationFn: (d) =>
            axiosAdvancedServices.post('api/sellout/Create_SellOut', d.data, {
                headers: {
                    Authorization: `Bearer ${d.token}`
                }
            }),
        onSuccess(data, variables, context) {
            console.log(data, 'res data');
            if (data.sellId) {
                clear();
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
    const { drop, dropScope, clear, getCachingNodes } = useAliveController();

    return useMutation<number, AxiosError, { data; token: string }>({
        mutationFn: (d) =>
            axiosAdvancedServices.post('api/sellout/update_customer_info', d.data, {
                headers: {
                    Authorization: `Bearer ${d.token}`
                }
            }),
        onSuccess(data, variables, context) {
            console.log(data, 'res data');
            if (data > 0) {
                clear();
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
