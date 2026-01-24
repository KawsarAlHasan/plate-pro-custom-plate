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

export const useMyOrderLists = () => {
  const { data, error, mutate } = useSWR(
    "/api/services/order-plates/",
    fetcherWithToken,
  );
  return {
    orderList: data,
    isLoading: !data && !error,
    isError: error,
    mutate,
  };
};

// export const useCheck = () => {
//   const { data, error, mutate } = useSWR(
//     "/api/v1/service/recent-activities/",
//     fetcherWithToken,
//   );
//   return {
//     check: data,
//     isLoading: !data && !error,
//     isError: error,
//     mutate,
//   };
// };
