"use client";
import Link from "next/link";
import { useState } from "react";
import { Form, Input, Button, message } from "antd";
import { MailOutlined, LockOutlined, UserOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { API } from "../../api/api";
import SocialLogin from "../../_component/SocialLogin";

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
          "Registration failed. Please try again.",
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
                      new Error("The two passwords do not match!"),
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

          {/* <SocialLogin /> */}
        </div>
      </div>
    </main>
  );
}
