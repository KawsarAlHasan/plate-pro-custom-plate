"use client";
import React from "react";
import { useMyOrderLists } from "../api/userApi";

function page() {
  const { orderList, isLoading, isError, mutate } = useMyOrderLists();

  console.log(orderList, "orderList");

  return <div>page</div>;
}

export default page;
