import React from "react";
import type { DrawerProps } from "antd";
import { Drawer } from "antd";
interface CustomDrawerProps extends DrawerProps {
  open: boolean;
  onClose: () => void;
}
const CustomDrawer: React.FC<CustomDrawerProps> = ({
  title = "Basic Drawer",
  placement = "right",
  open,
  onClose,
  children,
  ...rest
}) => {
  return (
    <Drawer
      width={"50%"}
      title={title}
      placement={placement}
      closable={true}
      onClose={onClose}
      open={open}
      key={placement}
      {...rest}
    >
      {children}
    </Drawer>
  );
};

export default CustomDrawer;
