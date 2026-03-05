import React from "react";
import { getLanguage } from "../../lib/i18n/getLanguage";
import CheckCode from "./CheckCode";

export default async function page() {
  const { dict } = await getLanguage();
  const checkOtpText = dict.auth.checkOtp;

  return (
    <div>
      <CheckCode checkOtpText={checkOtpText} />
    </div>
  );
}
