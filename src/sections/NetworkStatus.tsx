import { useState, useEffect } from "react";
import { Snackbar, Alert } from "@mui/material";
import { ShowSnackbar } from "./dashboard/layout/common/ShowSnackbar";

export const NetworkStatus = () => {
  const [online, setOnline] = useState(navigator.onLine);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");

  const handleOnline = () => {
    setOnline(true);
    setMessage("You are online");
    setOpen(true);
  };

  const handleOffline = () => {
    setOnline(false);
    setMessage("You are offline");
    setOpen(true);
  };

  useEffect(() => {
    // Set initial network status
    setOnline(navigator.onLine);

    // Add event listeners for online and offline events
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Cleanup event listeners on component unmount
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  return (
    <>
      <ShowSnackbar
        open={open}
        type={online ? "success" : "error"}
        msg={message}
        close={handleClose}
      />
    </>
  );
};
