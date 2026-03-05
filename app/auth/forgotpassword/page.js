import React from "react";
import ForgotPassword from "./ForgotPassword";
import { getLanguage } from "../../lib/i18n/getLanguage";

export default async function page() {
  const { dict } = await getLanguage();
  const forgotText = dict.auth.forgot;

  return (
    <div>
      <ForgotPassword forgotText={forgotText} />
    </div>
  );
}
