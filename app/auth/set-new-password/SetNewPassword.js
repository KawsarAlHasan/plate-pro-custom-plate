"use client";
import React, { useState, useEffect } from "react";
import { Form, Input, Button, message, Progress } from "antd";
import { LockOutlined } from "@ant-design/icons";
import Image from "next/image";
import { API } from "../../api/api";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

const SetNewPassword = ({ setPasswordText }) => {
  const router = useRouter();
  const email = Cookies.get("forgotEmail");
  const otp = Cookies.get("code");

  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await API.post("/api/auth/set_new_password/", {
        email: email,
        code: otp,
        new_password: values.password,
        new_password2: values.password,
      });

      if (response.status === 200) {
        message.success(setPasswordText?.successMessage);
        Cookies.set("token", response?.data?.tokens?.access);
        Cookies.remove("forgotEmail");
        Cookies.remove("code");

        setTimeout(() => {
          router.push("/");
        }, 500);
      }
    } catch (error) {
      message.error(
        error?.response?.data?.message ||
          "Failed to reset password. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const onFinishFailed = (errorInfo) => {
    message.error(setPasswordText?.errorMessage);
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-4 bg-gradient-to-br from-[#e6f0f5] to-[#d4e7f0]">
      <div className="bg-white p-10 py-12 shadow-2xl rounded-2xl w-full max-w-[550px] border border-gray-100">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <Image
            src="/headerLogo.png"
            alt="volarplaat"
            width={220}
            height={35}
            className="mx-auto"
          />
        </div>

        {/* Icon */}
        <div className="flex justify-center mb-5">
          <div
            className={`w-16 h-16 rounded-full flex items-center justify-center bg-blue-100`}
          >
            <LockOutlined className={`text-3xl text-blue-600`} />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-[32px] text-[#222222] font-bold text-center mb-3">
          {setPasswordText?.title}
        </h2>

        {/* Subtitle */}
        <p className="text-center text-[#6B7280] mb-8 text-[15px] leading-relaxed px-4">
          {setPasswordText?.description}
        </p>

        {/* Form */}
        <Form
          form={form}
          name="setNewPasswordForm"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          layout="vertical"
        >
          {/* New Password Field */}
          <Form.Item
            label={
              <span className="text-[16px] text-[#374151] font-medium">
                {setPasswordText?.newPassword}
              </span>
            }
            name="password"
            rules={[
              { required: true, message: setPasswordText?.passwordRequired },
              {
                pattern: /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/,
                message: setPasswordText?.passwordPattern,
              },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-gray-400" />}
              className="p-3 rounded-lg"
              placeholder={setPasswordText?.passwordPlaceholder}
              size="large"
            />
          </Form.Item>

          {/* Confirm Password Field */}
          <Form.Item
            label={
              <span className="text-[16px] text-[#374151] font-medium">
                {setPasswordText?.confirmPassword}
              </span>
            }
            name="confirmPassword"
            dependencies={["password"]}
            rules={[
              {
                required: true,
                message: setPasswordText?.confirmPasswordRequired,
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error(setPasswordText?.passwordsDoNotMatch),
                  );
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-gray-400" />}
              className="p-3 rounded-lg"
              placeholder={setPasswordText?.confirmPasswordPlaceholder}
              size="large"
            />
          </Form.Item>

          {/* Submit Button */}
          <Form.Item className="mb-0 mt-6">
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
              loading={loading}
              className={`h-12 text-[17px] font-semibold rounded-lg shadow-md hover:shadow-lg transition-all `}
            >
              {loading ? setPasswordText?.loading : setPasswordText?.submit}
            </Button>
          </Form.Item>
        </Form>

        {/* Back to Login */}
        <div className="mt-6 text-center">
          <Button
            type="link"
            onClick={() => router.push("/auth/signin")}
            className={`text-[14px] text-blue-600 hover:text-blue-700`}
          >
            ← {setPasswordText?.backToLogin}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SetNewPassword;
