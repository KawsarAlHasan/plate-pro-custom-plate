"use client";
import { Modal } from "antd";
import Signin from "./Signin";
import { useAuthModal } from "../../contex/AuthModalContext";

const AuthModal = () => {
  const { isAuthModalOpen, closeAuthModal } = useAuthModal();

  return (
    <Modal
      closable={{ "aria-label": "Custom Close Button" }}
      open={isAuthModalOpen}
      footer={null}
      onCancel={closeAuthModal}
    >
      <div className="-m-5">
        <Signin />
      </div>
    </Modal>
  );
};

export default AuthModal;
