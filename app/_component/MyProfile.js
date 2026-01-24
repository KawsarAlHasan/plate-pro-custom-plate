"use client";
import { Modal, Form, Input, Upload, Avatar, message } from "antd";
import {
  UserOutlined,
  CameraOutlined,
  PhoneOutlined,
  MailOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import { fetcherWithTokenPut } from "../api/api";

function MyProfile({ profileData, mutate, isMobile }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [imageFile, setImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(profileData?.profile_image);

  const showModal = () => {
    // Set current data in form when modal opens
    form.setFieldsValue({
      full_name: profileData?.full_name,
      phone_number: profileData?.phone_number,
    });
    setPreviewImage(profileData?.profile_image);
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
    setImageFile(null);
    setPreviewImage(profileData?.profile_image);
  };

  const handleImageChange = (info) => {
    const file = info.file.originFileObj || info.file;
    if (file) {
      // Create image preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target.result);
      };
      reader.readAsDataURL(file);
      setImageFile(file);
    }
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("full_name", values.full_name);
      formData.append("email", profileData.email);

      if (values.phone_number) {
        formData.append("phone_number", values.phone_number);
      }

      if (imageFile) {
        formData.append("profile_image", imageFile);
      }

      await fetcherWithTokenPut("/api/auth/users/update/", formData);

      message.success("Profile updated successfully!");

      // Refresh data
      if (mutate) {
        await mutate();
      }

      setIsModalOpen(false);
      form.resetFields();
      setImageFile(null);
    } catch (error) {
      message.error( error.response.data.message || "Failed to update profile!");
      console.error("Update error:", error.response.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {isMobile ? (
        <div
          className="text-blue-600 hover:text-blue-400 hover:bg-gray-50 font-medium px-4 py-3 rounded-lg transition-colors duration-200 flex items-center gap-2 cursor-pointer"
          onClick={showModal}
        >
          <UserOutlined /> My Profile
        </div>
      ) : (
        <div
          onClick={showModal}
          className="flex items-center gap-2 cursor-pointer"
        >
          <UserOutlined /> My Profile
        </div>
      )}

      <Modal
        title={
          <div className="text-xl font-semibold text-gray-800 pb-2">
            My Profile
          </div>
        }
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        width={500}
        centered
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="mt-6"
        >
          {/* Profile Image Section */}
          <div className="flex flex-col items-center mb-6">
            <div className="relative">
              <Avatar
                size={120}
                src={previewImage}
                icon={!previewImage && <UserOutlined />}
                className="border-4 border-gray-200"
              />
              <Upload
                accept="image/*"
                showUploadList={false}
                beforeUpload={() => false} // Prevent auto upload
                onChange={handleImageChange}
              >
                <div className="absolute bottom-0 right-0 bg-blue-500 hover:bg-blue-600 text-white rounded-full p-2 cursor-pointer transition-all shadow-lg">
                  <CameraOutlined className="text-lg" />
                </div>
              </Upload>
            </div>
            <p className="text-sm text-gray-500 mt-3">
              Click to change profile picture
            </p>
          </div>

          {/* Email (Read-only) */}
          <Form.Item label="Email Address">
            <Input
              prefix={<MailOutlined className="text-gray-400" />}
              value={profileData?.email}
              disabled
              className="bg-gray-50"
            />
          </Form.Item>

          {/* Full Name */}
          <Form.Item
            label="Full Name"
            name="full_name"
            rules={[
              { required: true, message: "Please enter your name!" },
              { min: 2, message: "Name must be at least 2 characters!" },
            ]}
          >
            <Input
              prefix={<UserOutlined className="text-gray-400" />}
              placeholder="Enter your full name"
              size="large"
            />
          </Form.Item>

          {/* Phone Number */}
          <Form.Item
            label="Phone Number"
            name="phone_number"
            rules={[
              {
                pattern: /^[0-9+\-\s()]*$/,
                message: "Please enter a valid phone number!",
              },
            ]}
          >
            <Input
              prefix={<PhoneOutlined className="text-gray-400" />}
              placeholder="Enter your phone number"
              size="large"
            />
          </Form.Item>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}

export default MyProfile;
