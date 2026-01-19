"use client";
import useSWR from "swr";
import { fetcher } from "./api";

export const useShapeList = () => {
  const { data, error, mutate } = useSWR(
    "/api/services/plate-shapes/list/",
    fetcher
  );
  return {
    shapeList: data,
    isLoading: !data && !error,
    isError: error,
    mutate,
  };
};
