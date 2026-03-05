"use client";
import Link from "next/link";
import { useState } from "react";
import { Form, Input, Checkbox, Button, message } from "antd";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { API } from "../../api/api";

export default function LoginPage({ signinText }) {
  const [form] = Form.useForm();

  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const onFinish = async (values) => {
    setIsSubmitting(true);
    try {
      const payload = {
        email: values.email,
        password: values.password,
      };
      const res = await API.post("/api/auth/login/", payload);

      if (res.status === 200) {
        message.success(signinText?.successMessage);
        Cookies.set("token", res?.data?.access);
        router.push("/");
      }
    } catch (error) {
      console.log("Login Error:", error);
      message.error(
        error?.response?.data?.message || "Login failed. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Form Validation Failed:", errorInfo);
    message.error(signinText?.errorMessage);
  };

  return (
    <main className="min-h-[calc(100vh-90px)] flex justify-center items-center bg-gradient-to-br from-blue-50 via-white to-purple-50 py-4 lg:py-12 px-2 lg:px-4">
      <div className="w-full max-w-[520px] bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
        <div className="px-4 lg:px-8 py-6 lg:py-10">
          <h1 className="text-3xl font-bold text-gray-800 text-center mb-2">
            {signinText?.title}
          </h1>
          <p className="text-gray-500 text-center mb-8">
            {signinText?.subtitle}
          </p>

          <Form
            form={form}
            name="login"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            layout="vertical"
          >
            {/* Email Field */}
            <Form.Item
              label={
                <span className="text-gray-700 font-medium">
                  {signinText?.email}
                </span>
              }
              name="email"
              rules={[
                { required: true, message: signinText?.emailRequired },
                { type: "email", message: signinText?.emailInvalid },
              ]}
            >
              <Input
                prefix={<MailOutlined className="text-gray-400" />}
                placeholder="someone@example.com"
                className="rounded-lg border-gray-300 hover:border-red-500 focus:border-red-500"
                size="large"
              />
            </Form.Item>

            {/* Password Field */}
            <Form.Item
              label={
                <span className="text-gray-700 font-medium">
                  {signinText?.password}
                </span>
              }
              name="password"
              rules={[
                { required: true, message: signinText?.passwordRequired },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="text-gray-400" />}
                placeholder={signinText?.passwordPlaceholder}
                className="rounded-lg border-gray-300 hover:border-red-500 focus:border-red-500"
                size="large"
              />
            </Form.Item>

            {/* Remember Me & Forgot Password */}
            <div className="flex justify-between items-center mb-6">
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox className="text-gray-600">
                  {signinText?.rememberMe}
                </Checkbox>
              </Form.Item>
              <Link
                href="/auth/forgotpassword"
                className="text-red-600 hover:text-red-700 font-medium transition-colors"
              >
                {signinText?.forgotPassword}
              </Link>
            </div>

            {/* Submit Button */}
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={isSubmitting}
                size="large"
                className="w-full h-12 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 border-0 rounded-lg font-semibold text-base shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {signinText?.submit}
              </Button>
            </Form.Item>
          </Form>

          {/* Sign Up Link */}
          <div className="text-center mt-6">
            <p className="text-gray-600">
              {signinText?.noAccount}?{" "}
              <Link
                href="/auth/signup"
                className="text-red-600 hover:text-red-700 font-semibold transition-colors"
              >
                {signinText?.signUpHere}
              </Link>
            </p>
          </div>

          {/* <SocialLogin /> */}
        </div>
      </div>
    </main>
  );
}
