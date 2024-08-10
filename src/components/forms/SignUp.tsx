import * as yup from "yup";
import CommonForm from "./CommonForm"; // Adjust the import path as necessary
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { UserCredentials } from "../FormTypes/Account";
import { signUp } from "../backend/apiService";
import { useState } from "react";
import { ShowSnackbar } from "../../sections/dashboard/layout/common/ShowSnackbar";
import { useNavigate } from "react-router-dom";
import { FormikHelpers } from "formik";

const signUpValidationSchema = yup.object({
  firstName: yup.string().required("first name is required"),
  lastName: yup.string().required("last name is required"),
  email: yup
    .string()
    .email("Invalid email address")
    .matches(
      /^[^\s@]+@[^\s@]+\.(com|net|org|edu|gov|mil|int)$/i,
      "Invalid email address"
    )
    .required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

export const SignUp = () => {
  const initialValues = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    isAdmin: false,
  };
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState<"success" | "error">("success");
  const navigate = useNavigate();

  const handleSubmit = (
    user: UserCredentials,
    actions: FormikHelpers<UserCredentials>
  ) => {
    console.log("signup :", user);
    setIsLoading(true);
    setTimeout(async () => {
      const response = await signUp(user);
      if ("status" in response) {
        setMessage("Account created successfully, Try login.");
        setSeverity("success");
        actions.resetForm(); // Reset the form values
        // setTimeout(() => {
        //   navigate("/signin");
        // }, 800);
      } else {
        setMessage("Something went wrong !");
        setSeverity("error");
      }
      setOpen(true);

      setIsLoading(false);
    }, 2000);
  };

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  // const handleClose = () => {
  //   setOpen(false);
  // };

  return (
    <>
      <CommonForm
        initialValues={initialValues}
        validationSchema={signUpValidationSchema}
        onSubmit={handleSubmit}
        title="Create account"
        linkText="Already have an account? Sign in"
        linkTo="/signin"
        icon={<AccountCircleIcon sx={{ color: "red", fontSize: "50px" }} />}
        isLoading={isLoading}
      />
      <ShowSnackbar
        open={open}
        type={severity}
        msg={message}
        close={handleClose}
      />
    </>
  );
};
