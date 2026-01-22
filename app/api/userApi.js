"use client";
import useSWR from "swr";
import { fetcherWithToken } from "./api";

export const useMyProfile = (token) => {
  const { data, error, mutate } = useSWR(
    token ? "/api/auth/user/details/" : null,
    fetcherWithToken,
  );
  return {
    profileData: data,
    isLoading: token && !data && !error,
    isError: error,
    mutate,
  };
};
