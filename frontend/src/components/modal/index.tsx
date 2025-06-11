import React from "react";
import { Modal } from "antd";

type GlobalModalProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  width?: number | Record<string, string>;
  children: React.ReactNode;
  centered?: boolean;
  footer?: React.ReactNode;
  height?: string | number;
  bodyStyle?: React.CSSProperties;
  modalStyle?: React.CSSProperties;
};

const GlobalModal: React.FC<GlobalModalProps> = ({
  open,
  onClose,
  title = "",
  width = 600,
  children,
  centered = true,
  footer = null,
  height = "80vh",
  bodyStyle = {},
  modalStyle = {},
}) => {
  return (
    <Modal
      title={title}
      open={open}
      onCancel={onClose}
      footer={footer}
      centered={centered}
      width={width}
      style={modalStyle}
      bodyStyle={{
        height: height,
        overflowY: "auto",
        background: "#f9f9f9", // light gray background
        padding: "20px",
        ...bodyStyle,
      }}
    >
      {children}
    </Modal>
  );
};

export default GlobalModal;
