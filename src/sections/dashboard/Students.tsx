import {
  Container,
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Info as InfoIcon } from "@mui/icons-material";
import { getUserDetails } from "../../common/LocalStorage";
import { UserCredentials } from "../../components/FormTypes/Account";
import { allStudents, isTokenValid } from "../../components/backend/apiService";
import "react-perfect-scrollbar/dist/css/styles.css";
import Loader from "../../components/loaders/Loader";
import { ShowSnackbar } from "./layout/common/ShowSnackbar";
import { fCustomDateTime } from "../../utils/format-time";
import React from "react";

type Data = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  createdDate: string;
  lastLogin: string;
  purchasedCoursesCount: number;
  purchasedCourses: [];
};

const columns = [
  { label: "First Name", dataKey: "firstName" },
  { label: "Last Name", dataKey: "lastName" },
  { label: "Email", dataKey: "email" },
  { label: "Account Created On", dataKey: "createdDate" },
  { label: "Last Logged In", dataKey: "lastLogin" },
  { label: "Total Purchased Courses", dataKey: "purchasedCoursesCount" },
];

const createData = (
  id: string,
  firstName: string,
  lastName: string,
  email: string,
  createdDate: string,
  lastLogin: string,
  purchasedCoursesCount: number,
  purchasedCourses: []
): Data => {
  return {
    id,
    firstName,
    lastName,
    email,
    createdDate,
    lastLogin,
    purchasedCoursesCount,
    purchasedCourses,
  };
};

export const Students = () => {
  const [user, setUser] = useState<UserCredentials | null>(null);
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [snackBar, setSnackBar] = useState(false);
  const [type, setType] = useState("success");
  const [msg, setMsg] = useState("");
  const [rows, setRows] = useState<Data[]>([]);
  const [infoDialogOpen, setInfoDialogOpen] = useState(false);
  const [purchasedCourses, setpurchasedCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const userDetails = getUserDetails();
    if (userDetails) {
      const [user, token] = userDetails;
      setUser(user);
      setToken(token);
    }
  }, []);

  useEffect(() => {
    if (!isTokenValid()) {
      localStorage.clear();
      navigate("/signin");
    } else {
      if (user && token) {
        setLoading(true);
        getAllStudents();
      }
    }
  }, [user, token]);

  const closeSnackbar = () => {
    setSnackBar(false);
  };

  const handleInfoClick = (purchaseCourses: []) => {
    console.log("handleInfoClick", purchaseCourses);

    setpurchasedCourses(purchaseCourses);
    setInfoDialogOpen(true);
  };

  const handleCloseInfoDialog = () => {
    setInfoDialogOpen(false);
  };

  const getAllStudents = async () => {
    try {
      const response = await allStudents(token);
      console.log("Students :", response);

      setStudents(response?.data?.data);
      const fetchedRows: Data[] = response?.data?.data.map((item) =>
        createData(
          item._id,
          item.firstName,
          item.lastName,
          item.email,
          fCustomDateTime(item.createdDate),
          fCustomDateTime(item.lastLogin),
          item.purchasedCourses.length,
          item.purchasedCourses
        )
      );
      setType("success");
      setRows(fetchedRows);
      setLoading(false);
      setMsg("Students data fetched successfully.");
      setSnackBar(true);
    } catch (error) {
      setLoading(false);
      setType("error");
      setMsg("Error fetching students data.");
      setSnackBar(true);
    }
  };

  return (
    <>
      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Students
        </Typography>
        <Box
          component={Paper}
          sx={{
            p: 2,
            flexGrow: 1,
            bgcolor: "background.paper",
            display: "flex",
            height: "auto",
            overflow: "auto",
          }}
        >
          {students.length > 0 ? (
            <TableContainer sx={{ minWidth: 650, maxHeight: 500 }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    {columns.map((column) => (
                      <TableCell key={column.dataKey}>{column.label}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row) => (
                    <TableRow key={row.id}>
                      {columns.map((column) => (
                        <TableCell key={column.dataKey} align="center">
                          {column.dataKey === "purchasedCoursesCount" &&
                          row[column.dataKey as keyof Data] !== 0 ? (
                            <>
                              {row[column.dataKey as keyof Data]}
                              <IconButton
                                onClick={() =>
                                  handleInfoClick(row.purchasedCourses)
                                }
                                sx={{ ml: 1 }}
                              >
                                <InfoIcon fontSize="small" />
                              </IconButton>
                            </>
                          ) : (
                            row[column.dataKey as keyof Data]
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              height="20vh"
              sx={{ backgroundColor: "Background" }}
              width="100%"
            >
              <Typography variant="h5" align="center" color="textSecondary">
                No Students Data.
              </Typography>
            </Box>
          )}
        </Box>
      </Container>
      {loading && (
        <Container>
          <Loader open={loading} />
        </Container>
      )}
      <ShowSnackbar
        open={snackBar}
        type={type}
        msg={msg}
        close={closeSnackbar}
      />

      <Dialog open={infoDialogOpen} onClose={handleCloseInfoDialog}>
        <DialogTitle>Purchased Courses</DialogTitle>
        <DialogContent>
          {purchasedCourses?.length > 0 && (
            <List
              sx={{ width: "100%", maxWidth: 500, bgcolor: "background.paper" }}
            >
              {purchasedCourses.map((course) => (
                <>
                  <ListItem alignItems="flex-start" key={Math.random()}>
                    <ListItemAvatar key={Math.random()}>
                      <Avatar
                        alt={course?.course?.title}
                        src={course?.course?.imageLink}
                      />
                    </ListItemAvatar>
                    <ListItemText
                      key={Math.random()}
                      primary={course?.course?.title}
                      secondary={
                        <React.Fragment>
                          <Typography
                            sx={{ display: "inline", fontWeight: "bold" }}
                            component="span"
                            variant="body2"
                            color="text.primary"
                          >
                            Purchased Date : &nbsp;
                          </Typography>

                          {fCustomDateTime(course?.purchasedDate)}
                        </React.Fragment>
                      }
                    />
                  </ListItem>
                  <Divider variant="inset" component="li" />
                </>
              ))}
            </List>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseInfoDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
