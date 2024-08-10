import {
  Slide,
  Button,
  Dialog,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Container,
  Chip,
  Grid,
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import CloseIcon from "@mui/icons-material/Close";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

import { forwardRef, ReactElement, Ref, useState } from "react";

import {
  calculateDiscountedPrice,
  fCurrency,
  fPercent,
} from "../../../../utils/format-number";
import { useLocation, useNavigate } from "react-router-dom";
import { ShowSnackbar } from "./ShowSnackbar";

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: ReactElement;
  },
  ref: Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export const ViewCourse = ({
  openBuyCourse,
  openViewCourse,
  viewCourseHandleClickClose,
  course,
  user,
  isPurchased,
}) => {
  //   console.log(course);
  const { pathname } = useLocation();
  const path: string = pathname.split("/")[1];
  const navigate = useNavigate();
  const [openMsg, setOpenMsg] = useState(false);

  const downloadSyllabus = () => {
    const syllabusContainer = document.createElement("div");
    syllabusContainer.style.position = "absolute";
    syllabusContainer.style.left = "-9999px";
    syllabusContainer.innerHTML = `
    <div style="font-size: 16px; font-family: Arial, sans-serif; padding: 20px; width: 210mm;">
    <h1 style='font-size:40px;text-align:center;color:blue'><b>100xDevs</b></h1>  
    <h1>${course.title}</h1>
      <h2><u>Syllabus</u></h2>
      <div>${course.syllabus}</div>
    </div>
  `;
    document.body.appendChild(syllabusContainer);

    html2canvas(syllabusContainer).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgProps = pdf.getImageProperties(imgData);
      const imgHeight = (imgProps.height * 210) / imgProps.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, 210, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, 210, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`${course.title}-syllabus.pdf`);
      document.body.removeChild(syllabusContainer);
    });
  };

  const renderStatus = (
    <Chip
      label={course.status}
      variant="filled"
      color={
        course.status === "completed"
          ? "success"
          : course.status === "upcoming"
          ? "secondary"
          : "primary"
      }
      sx={{
        zIndex: 9,
        textTransform: "capitalize",
      }}
    ></Chip>
  );

  const renderDiscountPercentage = (
    <Typography
      variant="subtitle1"
      style={{
        fontSize: "20px",
        display: "inline-block",
        fontWeight: "bold",
        textAlign: "left",
        color: "green",
      }}
    >
      {course.discount !== 0 ? fPercent(course.discount) : "0%"} off
    </Typography>
  );

  const renderDiscount = (
    <Typography
      variant="subtitle1"
      style={{
        fontSize: "20px",
        display: "inline-block",
        fontWeight: "bold",
        textAlign: "left",
      }}
    >
      <Typography
        style={{
          fontSize: "15px",
          display: "inline-block",
          fontWeight: "bold",
          textAlign: "left",
        }}
        component="span"
        variant="body1"
        sx={{
          color: "text.disabled",
          textDecoration: "line-through",
        }}
      >
        {course.price && fCurrency(course.price)}
      </Typography>
      &nbsp;
      {fCurrency(calculateDiscountedPrice(course.price, course.discount))}
    </Typography>
  );

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenMsg(false);
  };

  const openMessage = () => {
    setOpenMsg(true);
  };

  const color: Array<
    | "default"
    | "primary"
    | "secondary"
    | "info"
    | "success"
    | "warning"
    | "error"
  > = ["info", "success", "warning", "primary", "secondary", "error"];
  return (
    <>
      <Dialog
        fullScreen
        open={openViewCourse}
        onClose={viewCourseHandleClickClose}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: "relative" }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={viewCourseHandleClickClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              View Course
            </Typography>
          </Toolbar>
        </AppBar>
        <Container
          sx={{
            boxShadow: "rgb(40, 60, 1) 0px 20px 30px 8px",
            borderRadius: "50%",
          }}
        >
          <Grid container spacing={2} sx={{ mt: 10 }}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardMedia
                  component="img"
                  image={course.imageLink}
                  alt={course.title}
                  sx={{ height: "100%", objectFit: "cover" }}
                />
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card sx={{ height: "100%" }}>
                <CardContent>
                  <Typography variant="h4" component="div" gutterBottom>
                    {course.title}
                  </Typography>
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    gutterBottom
                  >
                    {course.description}
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="h6" component="div" gutterBottom>
                      Price: {renderDiscount}
                    </Typography>
                    <Typography variant="h6" component="div" gutterBottom>
                      Discount: {renderDiscountPercentage}
                    </Typography>
                    {/* <Typography
                      variant="body2"
                      color="text.secondary"
                      gutterBottom
                    >
                      Status: {renderStatus}
                    </Typography> */}
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      gutterBottom
                    >
                      Published on:{" "}
                      {new Date(course.publishDate).toLocaleDateString()}
                    </Typography>
                    {renderStatus}
                    &nbsp;&nbsp;&nbsp;
                    {course.syllabus ? (
                      <Button
                        variant="contained"
                        color="primary"
                        size="medium"
                        style={{ borderRadius: 20 }}
                        onClick={downloadSyllabus}
                      >
                        Download Syllabus
                      </Button>
                    ) : (
                      <span
                        style={{
                          backgroundColor: "red",
                          color: "white",
                          fontSize: 15,
                          padding: 5,
                          borderRadius: 20,
                        }}
                      >
                        No Syllabus Available
                      </span>
                    )}
                  </Box>
                  <Box sx={{ p: 0, marginTop: 0 }}>
                    <Typography variant="h6" component="div" gutterBottom>
                      Category
                    </Typography>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                      {course.category.map((courseCategory, index) => (
                        <Chip
                          key={index}
                          color={color[index]}
                          label={courseCategory}
                          size="small"
                        />
                      ))}
                    </Box>
                  </Box>
                </CardContent>

                <CardActions sx={{ justifyContent: "right" }}>
                  {user?.role !== "admin" && !isPurchased && (
                    <Button
                      variant="contained"
                      color="primary"
                      size="large"
                      onClick={() => {
                        if (path === "") {
                          navigate("/signin");
                        } else {
                          viewCourseHandleClickClose();
                          openBuyCourse();
                        }
                      }}
                    >
                      Enroll Now
                    </Button>
                  )}
                  {user?.role === "admin" && path === "dashboard" && (
                    <Button
                      variant="contained"
                      color="primary"
                      size="large"
                      onClick={() => {
                        viewCourseHandleClickClose();
                        navigate(`/dashboard/editCourse/${course._id}`);
                      }}
                    >
                      Edit
                    </Button>
                  )}

                  {user?.role !== "admin" && isPurchased && (
                    <Button
                      variant="contained"
                      color="primary"
                      size="large"
                      onClick={() => {
                        viewCourseHandleClickClose();
                        openMessage();
                      }}
                    >
                      View Content
                    </Button>
                  )}
                </CardActions>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Dialog>
      <ShowSnackbar
        msg="No Content is available at this moment, it will be be updated soon."
        type="info"
        open={openMsg}
        close={handleClose}
      />
    </>
  );
};
