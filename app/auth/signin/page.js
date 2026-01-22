import Signin from "../../_component/auth/Signin";

export default function LoginPage() {
  return (
    <main className="min-h-[calc(100vh-90px)] flex justify-center items-center bg-gradient-to-br from-blue-50 via-white to-purple-50 py-4 lg:py-12 px-2 lg:px-4">
      <Signin />
    </main>
  );
}
