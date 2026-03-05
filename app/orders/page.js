import React from "react";
import { getLanguage } from "../lib/i18n/getLanguage";
import Orders from "./Orders";

export default async function page() {
  const { dict } = await getLanguage();
  const ordersText = dict.orders;

  return (
    <div>
      <Orders ordersText={ordersText} />
    </div>
  );
}
