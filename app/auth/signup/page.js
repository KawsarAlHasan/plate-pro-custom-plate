import Signup from "../../_component/auth/Signup";
import { getLanguage } from "../../lib/i18n/getLanguage";

export default async function SignupPage() {
  const { dict } = await getLanguage();
  const signupText = dict.auth.signup;

  return (
    <main className="min-h-[calc(100vh-90px)] flex justify-center items-center bg-gradient-to-br from-blue-50 via-white to-purple-50 py-4 px-2 lg:px-4">
      <Signup signupText={signupText} />
    </main>
  );
}
