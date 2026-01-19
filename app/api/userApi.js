"use client";
import useSWR from "swr";
import { fetcherWithToken } from "./api";

export const useMyProfile = (token) => {
  const { data, error, mutate } = useSWR(
    token ? "/api/auth/user/details/" : null,
    fetcherWithToken
  );
  return {
    profileData: data,
    isLoading: token && !data && !error,
    isError: error,
    mutate,
  };
};

export const useMyScriptBalance = () => {
  const { data, error, mutate } = useSWR(
    "/api/script/balance/",
    fetcherWithToken
  );
  return {
    myScriptsBalance: data,
    isLoading: !data && !error,
    isError: error,
    mutate,
  };
};

export const useMyDashboard = () => {
  const { data, error, mutate } = useSWR(
    "/api/script/dashboard/",
    fetcherWithToken
  );
  return {
    myDashboardData: data,
    isLoading: !data && !error,
    isError: error,
    mutate,
  };
};
