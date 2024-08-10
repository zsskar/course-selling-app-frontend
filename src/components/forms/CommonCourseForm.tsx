import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Grid,
  TextField,
  Switch,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Button,
  Typography,
  Paper,
  FormControlLabel,
  OutlinedInput,
  Chip,
  Container,
} from "@mui/material";
import { Formik, Form, FormikProps } from "formik";
import * as Yup from "yup";
import { useLocation, useNavigate } from "react-router-dom";
import Loader from "../loaders/Loader";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

import { getUserDetails } from "../../common/LocalStorage";
import {
  courseById,
  createCourse,
  isTokenValid,
  updateCourse,
} from "../backend/apiService";
import { ShowSnackbar } from "../../sections/dashboard/layout/common/ShowSnackbar";

interface CourseFormValues {
  title: string;
  description: string;
  price: number;
  imageLink: string;
  discount: number;
  published: boolean;
  category: string[];
  syllabus: string;
  status: "upcoming" | "ongoing" | "completed";
}

const toolbarOptions = [
  [{ header: "1" }, { header: "2" }, { font: [] }],
  [{ size: [] }],
  ["bold", "italic", "underline", "strike", "blockquote"],
  [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
  ["link"],
];

const validationSchema = Yup.object({
  title: Yup.string().required("Title is required"),
  description: Yup.string().required("Description is required"),
  price: Yup.number()
    .required("Price is required")
    .min(1, "Price must be greater than zero"),
  imageLink: Yup.string().url("Invalid URL").required("Image Link is required"),
  discount: Yup.number()
    .required("Discount is required")
    .min(0, "Discount must be at least 0"),
  published: Yup.boolean().required("Published status is required"),
  category: Yup.array()
    .of(Yup.string().required())
    .min(1, "At least one category is required"),
  status: Yup.string()
    .oneOf(["upcoming", "ongoing", "completed"])
    .required("Status is required"),
  syllabus: Yup.string(),
});

const CommonCourseForm: React.FC = () => {
  const { pathname } = useLocation();
  const path: string = pathname.split("/")[2];
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState("");
  const [msg, setMsg] = useState("");
  const [severity, setSeverity] = useState("success");
  const [open, setOpen] = useState(false);
  const [courseId, setCourseId] = useState("");
  const [initialValues, setInitialValues] = useState<CourseFormValues>({
    title: "",
    description: "",
    price: 1,
    imageLink: "",
    discount: 0,
    published: false,
    category: [],
    syllabus: "",
    status: "upcoming",
  });

  const formikRef = useRef<FormikProps<CourseFormValues>>(null);
  const navigate = useNavigate();

  console.log("Pathname: ", pathname);
  console.log("path: ", path);

  const setUserDetails = () => {
    const userDetails = getUserDetails();
    if (userDetails) {
      const [, token] = userDetails;
      setToken(token);
    }
  };

  const fetchCourse = async () => {
    if (path && path === "editCourse" && token) {
      setIsLoading(true);
      const courseId = pathname.split("/")[3];
      try {
        setCourseId(courseId);
        const response = await courseById(courseId, token);
        setInitialValues(response.data.course);
        if (formikRef.current) {
          formikRef.current.setValues(response.data.course);
        }
        setSeverity("success");
        setMsg("Course details fetched successfully.");
        setOpen(true);
        console.log(response);
      } catch (e) {
        setSeverity("error");
        setMsg("Error while fetching course details.");
        setOpen(true);
      }
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setUserDetails();
  }, []);

  useEffect(() => {
    setTimeout(() => {
      fetchCourse();
    }, 400);
  }, [token]);

  useEffect(() => {
    if (path && path === "createCourse") {
      setInitialValues({
        title: "",
        description: "",
        price: 1,
        imageLink: "",
        discount: 0,
        published: false,
        category: [],
        syllabus: "",
        status: "upcoming",
      });
    } else if (path && path === "editCourse") {
      setTimeout(() => {
        fetchCourse();
      }, 400);
    }
  }, [path]);

  //   const initialValues: CourseFormValues =

  const categories = [
    "web development",
    "devOps",
    "web3",
    "open source",
    "full stack",
  ];

  const updateACourse = async (values) => {
    try {
      const response = await updateCourse(values, token, courseId);
      console.log("update course: ", response);
      setSeverity("success");
      setMsg("Course updated successfully.");
      setOpen(true);
      setTimeout(() => {
        fetchCourse();
      }, 600);
    } catch (err) {
      setSeverity("error");
      setMsg("Error while updating course.");
      setOpen(true);
    }
    setIsLoading(false);
  };
  const createACourse = async (values) => {
    try {
      const response = await createCourse(values, token);
      console.log("Create course: ", response);
      setSeverity("success");
      setMsg("Course created successfully.");
      setOpen(true);
      setTimeout(() => {
        navigate("/dashboard/courses");
      }, 800);
    } catch (err) {
      setSeverity("error");
      setMsg("Error while creating course.");
      setOpen(true);
    }
    setIsLoading(false);
  };

  const handleSubmit = (values: CourseFormValues) => {
    console.log(values);

    if (!isTokenValid()) {
      localStorage.clear();
      navigate("/signin");
    } else {
      setIsLoading(true);
      setTimeout(() => {
        if (path && path === "editCourse" && token) {
          updateACourse(values);
        } else {
          createACourse(values);
        }
      }, 600);
    }
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

  return (
    <>
      <Typography variant="h5" component="h1" gutterBottom>
        {path === "createCourse" ? "Create" : "Edit"} Course
      </Typography>
      <Paper
        elevation={3}
        sx={{
          p: 5,
          maxWidth: 1000,
          mx: "auto",
          mt: 2,
          boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
        }}
      >
        <Formik
          innerRef={formikRef}
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({
            values,
            handleChange,
            handleBlur,
            setFieldValue,
            errors,
            touched,
          }) => (
            <Form>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    id="title"
                    label="Title"
                    name="title"
                    value={values.title}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.title && Boolean(errors.title)}
                    helperText={touched.title && errors.title}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    id="price"
                    label="Price"
                    name="price"
                    type="number"
                    value={values.price}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.price && Boolean(errors.price)}
                    helperText={touched.price && errors.price}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="description"
                    label="Description"
                    name="description"
                    multiline
                    rows={4}
                    value={values.description}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.description && Boolean(errors.description)}
                    helperText={touched.description && errors.description}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="imageLink"
                    label="Image Link"
                    name="imageLink"
                    value={values.imageLink}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.imageLink && Boolean(errors.imageLink)}
                    helperText={touched.imageLink && errors.imageLink}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    id="discount"
                    label="Discount"
                    name="discount"
                    type="number"
                    value={values.discount}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.discount && Boolean(errors.discount)}
                    helperText={touched.discount && errors.discount}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={values.published}
                        onChange={(event) =>
                          setFieldValue("published", event.target.checked)
                        }
                        name="published"
                        color="primary"
                      />
                    }
                    label="Publish"
                  />
                  {touched.published && errors.published && (
                    <Box color="error.main" mt={1}>
                      {errors.published}
                    </Box>
                  )}
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel id="category-label">Category</InputLabel>
                    <Select
                      labelId="category-label"
                      id="category"
                      name="category"
                      multiple
                      value={values.category}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      input={<OutlinedInput label="Category" />}
                      renderValue={(selected) => (
                        <Box
                          sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}
                        >
                          {selected.map((value) => (
                            <Chip key={value} label={value} />
                          ))}
                        </Box>
                      )}
                      error={touched.category && Boolean(errors.category)}
                    >
                      {categories.map((category) => (
                        <MenuItem key={category} value={category}>
                          {category}
                        </MenuItem>
                      ))}
                    </Select>
                    {touched.category && errors.category && (
                      <Box color="error.main" mt={1}>
                        {errors.category}
                      </Box>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel id="status-label">Status</InputLabel>
                    <Select
                      labelId="status-label"
                      id="status"
                      name="status"
                      value={values.status}
                      label="Status"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.status && Boolean(errors.status)}
                    >
                      <MenuItem value="upcoming">Upcoming</MenuItem>
                      <MenuItem value="ongoing">Ongoing</MenuItem>
                      <MenuItem value="completed">Completed</MenuItem>
                    </Select>
                    {touched.status && errors.status && (
                      <Box color="error.main" mt={1}>
                        {errors.status}
                      </Box>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="h6">Syllabus</Typography>
                  <div className="quill-editor">
                    <ReactQuill
                      value={values.syllabus}
                      onChange={(value) => setFieldValue("syllabus", value)}
                      modules={{ toolbar: toolbarOptions }}
                      style={{ height: "200px" }}
                    />
                    {/* {touched.syllabus && errors.syllabus && (
                      <Box color="error.main" mt={1}>
                        {errors.syllabus}
                      </Box>
                    )} */}
                  </div>
                </Grid>
                <Grid
                  item
                  xs={12}
                  style={{ textAlign: "right", marginTop: 50 }}
                >
                  <Button
                    style={{ width: "150px", height: "40px" }}
                    type="submit"
                    focusRipple
                    variant="contained"
                    color="primary"
                  >
                    Submit
                  </Button>
                </Grid>
              </Grid>
            </Form>
          )}
        </Formik>
      </Paper>

      {isLoading && (
        <Container>
          <Loader open={isLoading} />
        </Container>
      )}

      <ShowSnackbar open={open} type={severity} msg={msg} close={handleClose} />
    </>
  );
};

export default CommonCourseForm;
