import { useMutation, useQuery } from "@tanstack/react-query";
import axios, { AxiosError, AxiosResponse } from "axios";
import React, { useEffect, useState } from "react";
import {
  authorize,
  getAccessToken,
  getPhoneNumber,
  getSetting,
  getUserInfo,
} from "zmp-sdk/apis";

const usePermissionZalo = ({
  mAuthorizedStateSuccess,
  mAuthorizeSuccess,
  mFetchInfoNumberSuccess,
  mGetPhoneNumberSuccess,
  mGetUserStateSuccess,
  mGetAccessTokenSuccess,
}: {
  mAuthorizedStateSuccess?: (d: any) => void;
  mAuthorizeSuccess?: (d: any) => void;
  mFetchInfoNumberSuccess?: (d: any) => void;
  mGetPhoneNumberSuccess?: (d: any) => void;
  mGetUserStateSuccess?: (d: any) => void;
  mGetAccessTokenSuccess?: (d: any) => void;
}) => {
  const mAuthorizedState = useMutation({
    mutationFn: () => getSetting({}),
    onSuccess(data, variables, context) {
      mAuthorizedStateSuccess?.(data.authSetting);
      console.log(data.authSetting, "mAuthorizedState");
    },
  });
  const mAuthorize = useMutation({
    mutationFn: () =>
      authorize({
        scopes: ["scope.userInfo", "scope.userPhonenumber"],
      }),
    onSuccess(data, variables, context) {
      console.log(data, "mAuthorizeSuccess");
      mAuthorizeSuccess?.(data);
    },
  });

  const mGetUserState = useMutation({
    mutationFn: () => getUserInfo({ avatarType: "small" }),
    onSuccess(data, variables, context) {
      mGetUserStateSuccess?.(data.userInfo);
      console.log(data, "mGetUserState");
    },
  });

  const mGetPhoneNumber = useMutation({
    mutationFn: () => getPhoneNumber({ fail: console.warn }),
    onSuccess(data, variables, context) {
      mGetPhoneNumberSuccess?.(data.token);
      console.log(data, "mGetPhoneNumber");
      // mFetchInfoNumber.mutate({ code: data.token ?? "" });
    },
  });
  const mGetAccessToken = useMutation({
    mutationFn: () => getAccessToken(),
    onSuccess(data, variables, context) {
      console.log(data, "mGetAccessToken");
      mGetAccessTokenSuccess?.(data);
    },
  });

  const mFetchInfoNumber = useMutation<
    AxiosResponse,
    AxiosError,
    { code: string; access_token: string }
  >({
    mutationFn: ({ code, access_token }) =>
      axios.get("https://graph.zalo.me/v2.0/me/info", {
        headers: {
          access_token: access_token,
          secret_key: "EDJinrP7DPAEwfMoX25E",
          code,
        },
      }),
    onSuccess(data, variables, context) {
      console.log(data, "mFetchInfoNumber");
      mFetchInfoNumberSuccess?.(data.data?.data?.number);
    },
    onError(error, variables, context) {
      console.log(error, "mFetchInfoNumber error");
    },
  });

  return {
    mGetAccessToken,
    mAuthorizedState,
    mGetUserState,
    mAuthorize,
    mGetPhoneNumber,
    mFetchInfoNumber,
  };
};

export default usePermissionZalo;
