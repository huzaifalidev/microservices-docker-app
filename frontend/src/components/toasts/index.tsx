import { toast } from "react-toastify";

export const showSuccessToast = (message = "Success") => {
  toast.success(message, {
    position: "top-center",
    autoClose: 2000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    closeButton: false,
    style: {
      backgroundColor: "#ffffff",
      color: "#000000",
      fontFamily: "Poppins",
      fontSize: "16px",
      fontWeight: "400",
      textAlign: "center",
      borderRadius: "8px",
      padding: "13px",
      width: "220px",
    },
  });
};

export const showErrorToast = (message = "Something went wrong") => {
  toast.error(message, {
    position: "top-center",
    autoClose: 2000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    closeButton: false,
    style: {
      backgroundColor: "#ffffff",
      color: "#000000",
      fontFamily: "Poppins",
      fontSize: "16px",
      fontWeight: "400",
      textAlign: "center",
      borderRadius: "8px",
      padding: "13px",
      width: "220px",
    },
    progress: undefined,
  });
};
