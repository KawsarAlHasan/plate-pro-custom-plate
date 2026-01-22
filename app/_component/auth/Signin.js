"use client";
import Link from "next/link";
import { useState } from "react";
import { Form, Input, Checkbox, Button, message } from "antd";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { API } from "../../api/api";
import Cookies from "js-cookie";

function Signin() {
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
        message.success("Login successful!");
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
    message.error("Please check the form fields and try again.");
  };

  return (
    <div className="w-full max-w-[520px] bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
      <div className="px-4 lg:px-8 py-6 lg:py-10">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-2">
          Welcome Back
        </h1>
        <p className="text-gray-500 text-center mb-8">
          Please enter your credentials to continue
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
            label={<span className="text-gray-700 font-medium">Password</span>}
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-gray-400" />}
              placeholder="Enter your password"
              className="rounded-lg border-gray-300 hover:border-red-500 focus:border-red-500"
              size="large"
            />
          </Form.Item>

          {/* Remember Me & Forgot Password */}
          <div className="flex justify-between items-center mb-6">
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox className="text-gray-600">Remember me</Checkbox>
            </Form.Item>
            <Link
              href="/auth/forgotpassword"
              className="text-red-600 hover:text-red-700 font-medium transition-colors"
            >
              Forgot password?
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
              Sign In
            </Button>
          </Form.Item>
        </Form>

        {/* Sign Up Link */}
        <div className="text-center mt-6">
          <p className="text-gray-600">
            Don't have an account?{" "}
            <Link
              href="/auth/signup"
              className="text-red-600 hover:text-red-700 font-semibold transition-colors"
            >
              Sign up here
            </Link>
          </p>
        </div>

        {/* <SocialLogin /> */}
      </div>
    </div>
  );
}

export default Signin;
