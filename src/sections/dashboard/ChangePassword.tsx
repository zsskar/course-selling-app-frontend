import { useState } from "react";
import {
  Box,
  Button,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useFormik } from "formik";
import * as yup from "yup";

const ChangePassword = ({
  user,
  setLoading,
  setSnackBar,
  setType,
  setMsg,
  updateTheUser,
}) => {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  const validationSchema = yup.object({
    currentPassword: yup.string().required("Current password is required"),
    newPassword: yup
      .string()
      .min(6, "New password must be at least 6 characters")
      .required("New password is required"),
    confirmNewPassword: yup
      .string()
      .oneOf(
        [yup.ref("newPassword"), null],
        "confirm password must be matched with new password"
      )
      .required("Please confirm your new password"),
  });

  const formik = useFormik({
    initialValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      console.log("Change Password Values:", values);
      const changedUser = values;
      if (changedUser.currentPassword !== user.password) {
        setType("error");
        setMsg("Current password is not correct.");
        setSnackBar(true);
      } else if (changedUser.newPassword === user.password) {
        setType("warning");
        setMsg("New password should not be same as current password.");
        setSnackBar(true);
      } else {
        user.password = changedUser.newPassword;
        console.log("changed password :", changedUser, "-", user);
        updateTheUser(user, "Password");
      }
    },
  });

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <Box sx={{ mt: 3 }} component="form" onSubmit={formik.handleSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <TextField
            label="Current Password"
            fullWidth
            type={showCurrentPassword ? "text" : "password"}
            {...formik.getFieldProps("currentPassword")}
            error={
              formik.touched.currentPassword &&
              Boolean(formik.errors.currentPassword)
            }
            helperText={
              formik.touched.currentPassword && formik.errors.currentPassword
            }
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showCurrentPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="New Password"
            fullWidth
            type={showNewPassword ? "text" : "password"}
            {...formik.getFieldProps("newPassword")}
            error={
              formik.touched.newPassword && Boolean(formik.errors.newPassword)
            }
            helperText={formik.touched.newPassword && formik.errors.newPassword}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showNewPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Confirm New Password"
            fullWidth
            type={showConfirmNewPassword ? "text" : "password"}
            {...formik.getFieldProps("confirmNewPassword")}
            error={
              formik.touched.confirmNewPassword &&
              Boolean(formik.errors.confirmNewPassword)
            }
            helperText={
              formik.touched.confirmNewPassword &&
              formik.errors.confirmNewPassword
            }
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() =>
                      setShowConfirmNewPassword(!showConfirmNewPassword)
                    }
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showConfirmNewPassword ? (
                      <Visibility />
                    ) : (
                      <VisibilityOff />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} sx={{ textAlign: "right" }}>
          <Button type="submit" variant="contained" color="primary">
            Change Password
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ChangePassword;
