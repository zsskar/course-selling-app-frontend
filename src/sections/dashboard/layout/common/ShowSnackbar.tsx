import { Snackbar, Alert } from "@mui/material";

export const ShowSnackbar = ({ open, type, msg, close }) => {
  return (
    <Snackbar
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      open={open}
      onClose={close}
      autoHideDuration={2000}
    >
      <Alert
        onClose={close}
        variant="filled"
        severity={type}
        sx={{ width: "auto" }}
      >
        {msg}
      </Alert>
    </Snackbar>
  );
};
