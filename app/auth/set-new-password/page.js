import React from "react";
import SetNewPassword from "./SetNewPassword";
import { getLanguage } from "../../lib/i18n/getLanguage";

export default async function page() {
  const { dict } = await getLanguage();
  const setPasswordText = dict.auth.setPassword;

  return (
    <div>
      <SetNewPassword setPasswordText={setPasswordText} />
    </div>
  );
}
