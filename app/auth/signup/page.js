"use client";
import Link from "next/link";
import { useState } from "react";
import { Form, Input, Button, message } from "antd";
import { MailOutlined, LockOutlined, UserOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { API } from "../../api/api";

export default function SignupPage() {
  const [form] = Form.useForm();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onFinish = async (values) => {
    setIsSubmitting(true);
    try {
      const payload = {
        email: values.email,
        full_name: values.full_name,
        password: values.password,
        password2: values.password2,
      };

      const res = await API.post("/api/auth/register/", payload);

      if (res.status === 201) {
        message.success("Registration successful! Please login.");
        Cookies.set("token", res?.data?.tokens?.access);
        router.push("/");
      }
    } catch (error) {
      console.log("Registration Error:", error);
      message.error(
        error?.response?.data?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Form Validation Failed:", errorInfo);
    message.error("Please check the form fields and try again.");
  };

  return (
    <main className="min-h-[calc(100vh-90px)] flex justify-center items-center bg-gradient-to-br from-blue-50 via-white to-purple-50 py-4 px-2 lg:px-4">
      <div className="w-full max-w-[590px] bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
        {/* Form Section */}
        <div className="px-4 lg:px-8 py-6 lg:py-10">
          <h1 className="text-3xl font-bold text-gray-800 text-center mb-2">
            Create Account
          </h1>
          <p className="text-gray-500 text-center mb-8">
            Sign up to get started
          </p>

          <Form
            form={form}
            name="signup"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            layout="vertical"
            // className="space-y-1"
          >
            {/* Full Name Field */}
            <Form.Item
              label={
                <span className="text-gray-700 font-medium">Full Name</span>
              }
              name="full_name"
              rules={[
                { required: true, message: "Please input your full name!" },
                { min: 2, message: "Name must be at least 2 characters!" },
              ]}
            >
              <Input
                prefix={<UserOutlined className="text-gray-400" />}
                placeholder="John Doe"
                className="rounded-lg border-gray-300 hover:border-red-500 focus:border-red-500"
                size="large"
              />
            </Form.Item>

            {/* Email Field */}
            <Form.Item
              label={
                <span className="text-gray-700 font-medium">Email Address</span>
              }
              name="email"
              rules={[
                { required: true, message: "Please input your email!" },
                { type: "email", message: "Please enter a valid email!" },
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
                <span className="text-gray-700 font-medium">Password</span>
              }
              name="password"
              rules={[
                { required: true, message: "Please input your password!" },
                {
                  pattern:
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                  message:
                    "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character and be at least 8 characters long!",
                },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="text-gray-400" />}
                placeholder="Enter your password"
                className="rounded-lg border-gray-300 hover:border-red-500 focus:border-red-500"
                size="large"
              />
            </Form.Item>

            {/* Confirm Password Field */}
            <Form.Item
              label={
                <span className="text-gray-700 font-medium">
                  Confirm Password
                </span>
              }
              name="password2"
              dependencies={["password"]}
              rules={[
                { required: true, message: "Please confirm your password!" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("The two passwords do not match!")
                    );
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="text-gray-400" />}
                placeholder="Confirm your password"
                className="rounded-lg border-gray-300 hover:border-red-500 focus:border-red-500"
                size="large"
              />
            </Form.Item>

            {/* Submit Button */}
            <Form.Item className="mt-6">
              <Button
                type="primary"
                htmlType="submit"
                loading={isSubmitting}
                size="large"
                className="w-full h-12 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 border-0 rounded-lg font-semibold text-base shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Create Account
              </Button>
            </Form.Item>
          </Form>

          {/* Login Link */}
          <div className="text-center mt-6">
            <p className="text-gray-600">
              Already have an account?{" "}
              <Link
                href="/auth/signin"
                className="text-red-600 hover:text-red-700 font-semibold transition-colors"
              >
                Sign in here
              </Link>
            </p>
          </div>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">
                Or continue with
              </span>
            </div>
          </div>

          {/* Social Login Buttons */}
          <div className="grid grid-cols-1">
            <button
              onClick={() => console.log("Google signup clicked")}
              className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span className="text-gray-700 font-medium">Google</span>
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
