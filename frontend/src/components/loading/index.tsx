import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { Spin } from "antd";

const GlobalLoader: React.FC = () => {
  const loading = useSelector((state: RootState) => state.loading.loading);
  const theme = useSelector((state: RootState) => state.theme.theme);

  if (!loading) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        height: "100vh",
        width: "100vw",
        backgroundColor:
          theme === "dark" ? "rgba(0, 0, 0, 0.8)" : "rgba(255, 255, 255, 0.8)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
      }}
    >
      <Spin size="large" />
    </div>
  );
};

export default GlobalLoader;
