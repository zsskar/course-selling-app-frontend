import React, { useState } from "react";
import { Formik, Field, Form, FormikProps, FormikHelpers } from "formik";
import {
  TextField,
  Grid,
  Button,
  Container,
  Typography,
  FormControlLabel,
  Switch,
  CircularProgress,
  Box,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { ErrorMessage } from "formik";
import * as yup from "yup";
import { Link } from "react-router-dom";
import { Visibility, VisibilityOff } from "@mui/icons-material";

import { Header } from "../../sections/Header";

interface CommonFormProps {
  initialValues: Record<string, any>;
  validationSchema: yup.ObjectSchema<any>;
  onSubmit: (
    values: Record<string, any>,
    actions: FormikHelpers<Record<string, any>>
  ) => void;
  title: string;
  linkText: string;
  linkTo: string;
  icon: React.ReactNode;
  isLoading: boolean;
  // setIsLoading(value: boolean): void;
}

const CommonForm: React.FC<CommonFormProps> = ({
  initialValues,
  validationSchema,
  onSubmit,
  title,
  linkText,
  linkTo,
  icon,
  isLoading,
}) => {
  const styles: Record<string, React.CSSProperties> = {
    paper: {
      display: "flex",
      flexDirection: "column", // 'column' is a valid value for flexDirection
      alignItems: "center",
      margin: "-30px",
      padding: "30px",
      marginTop: "40px",
      boxShadow: "rgba(0, 0, 0, 1) 0px 5px 20px",
    },
    form: {
      width: "100%",
      marginTop: "24px",
    },
    submit: {
      margin: "24px 0 16px",
    },
  };

  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <>
      <Header />
      <Container component="main" maxWidth="xs">
        <div style={styles.paper}>
          {icon}
          <Typography component="h1" variant="h5">
            {title}
          </Typography>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            validateOnBlur={true}
            validateOnChange={true}
            onSubmit={(values, actions) => {
              onSubmit(values, actions);
              actions.setSubmitting(false);
            }}
          >
            {({ touched, errors, values, handleChange }: FormikProps<any>) => (
              <Form style={styles.form} noValidate>
                <Grid container spacing={2}>
                  {title === "Create account" && (
                    <>
                      <Grid item xs={12} sm={6}>
                        <Field
                          as={TextField}
                          variant="outlined"
                          required
                          fullWidth
                          id="firstName"
                          name="firstName"
                          label="First Name"
                          autoComplete="fname"
                          helperText={<ErrorMessage name="firstName" />}
                          error={touched.firstName && !!errors.firstName}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Field
                          as={TextField}
                          variant="outlined"
                          required
                          fullWidth
                          id="lastName"
                          name="lastName"
                          label="Last Name"
                          autoComplete="lname"
                          helperText={<ErrorMessage name="lastName" />}
                          error={touched.lastName && !!errors.lastName}
                        />
                      </Grid>
                    </>
                  )}
                  <Grid item xs={12}>
                    <Field
                      as={TextField}
                      variant="outlined"
                      required
                      fullWidth
                      id="email"
                      name="email"
                      label="Email Address"
                      autoComplete="email"
                      helperText={<ErrorMessage name="email" />}
                      error={touched.email && !!errors.email}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Field
                      as={TextField}
                      variant="outlined"
                      required
                      fullWidth
                      name="password"
                      label="Password"
                      type={showPassword ? "text" : "password"}
                      id="password"
                      autoComplete="current-password"
                      helperText={<ErrorMessage name="password" />}
                      error={touched.password && !!errors.password}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={handleClickShowPassword}
                              onMouseDown={handleMouseDownPassword}
                            >
                              {showPassword ? (
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
                  {title === "Sign In" && (
                    <Grid item xs={12}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={values.isAdmin}
                            onChange={handleChange}
                            name="isAdmin"
                            color="primary"
                          />
                        }
                        label={
                          <Typography style={{ fontWeight: "bold" }}>
                            Are you ADMIN
                          </Typography>
                        }
                      />
                    </Grid>
                  )}
                </Grid>

                <Button
                  disabled={isLoading}
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  style={styles.submit}
                >
                  {isLoading ? <GradientCircularProgress /> : title}
                </Button>

                <Grid
                  container
                  justifyContent="center"
                  style={{ margin: "0 auto" }}
                >
                  <Grid item style={{ textAlign: "center" }}>
                    <Link to={linkTo}>{linkText}</Link>
                  </Grid>
                </Grid>
              </Form>
            )}
          </Formik>
        </div>
      </Container>
    </>
  );
};

export const GradientCircularProgress = () => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <svg width={0} height={0}>
        <defs>
          <linearGradient id="my_gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#e01cd5" />
            <stop offset="100%" stopColor="#1CB5E0" />
          </linearGradient>
        </defs>
      </svg>
      <CircularProgress
        sx={{ "svg circle": { stroke: "url(#my_gradient)" } }}
      />
    </Box>
  );
};

export default CommonForm;
