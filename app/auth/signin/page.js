import React from 'react'
import LoginPage from './LoginPage'
import { getLanguage } from '../../lib/i18n/getLanguage';

export default async function page() {

    const { dict } = await getLanguage();
    const signinText = dict.auth.signin;

  return (
    <div>
      <LoginPage signinText={signinText} />
    </div>
  )
}
