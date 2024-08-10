import {
  Box,
  Button,
  ButtonGroup,
  Collapse,
  Container,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { getUserDetails } from "../../common/LocalStorage";
import { UserCredentials } from "../../components/FormTypes/Account";
import {
  approveOrRejectRefundRequest,
  findRefundRequestForAdmin,
  isTokenValid,
} from "../../components/backend/apiService";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/loaders/Loader";
import { ShowSnackbar } from "./layout/common/ShowSnackbar";
import { fCurrency, calculateDiscountedPrice } from "../../utils/format-number";
import { fCustomDateTime } from "../../utils/format-time";

function createData(
  from: string,
  email: string,
  totalRequests: number,
  requests
) {
  // //console.log("createData: ", requests);

  return {
    from,
    email,
    totalRequests,
    history: requests.map((request) => ({
      _id: request?.course._id,
      courseName: request?.course?.title,
      purchaseDate: fCustomDateTime(request?.course?.purchasedDate),
      requestDate: fCustomDateTime(request?.requestDate),
      price: fCurrency(calculateDiscountedPrice(request?.course?.price, 0)),
      discount: request?.course?.discount,
      priceAfterDiscount: fCurrency(
        calculateDiscountedPrice(
          request?.course?.price,
          request?.course?.discount
        )
      ),
      status: request?.status,
    })),
  };
}

export default function RefundRequests() {
  const [rows, setRows] = useState<any[]>([]);

  const [user, setUser] = useState<UserCredentials | null>(null);
  const [token, setToken] = useState("");
  const [refunds, setRefunds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [snackBar, setSnackBar] = useState(false);
  const [type, setType] = useState("success");
  const [msg, setMsg] = useState("");
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
      // localStorage.setItem("expired", "true");
      navigate("/signin");
    } else {
      if (user && token) {
        setLoading(true);
        fetchRequests();
      }
    }
  }, [user, token]);

  const fetchRequests = async () => {
    try {
      const response = await findRefundRequestForAdmin(token);
      ////console.log("Admin :", response);
      if (response.data && response.data.requests) {
        setRefunds(response?.data?.requests);
        const newRows = response.data.requests.map((request) =>
          createData(
            request.user.firstName + " " + request.user.lastName,
            request.user.email,
            request.refundRequests.length,
            request.refundRequests
          )
        );

        setRows(newRows);
      }
      setLoading(false);
      setType("success");
      setMsg("Refund requests fetched successfully.");
      setSnackBar(true);
    } catch (err) {
      setLoading(false);
      setType("error");
      setMsg("Error fetching requests.");
      setSnackBar(true);
    }
  };

  const closeSnackbar = () => {
    setSnackBar(false);
  };
  const refreshData = () => {
    if (!isTokenValid()) {
      localStorage.clear();
      // localStorage.setItem("expired", "true");
      navigate("/signin");
    } else {
      if (user && token) {
        setLoading(true);
        fetchRequests();
      }
    }
  };

  return (
    <Container maxWidth="xl">
      <Typography variant="h4" sx={{ mb: 5 }}>
        All Refund Requests
      </Typography>
      <Box
        sx={{
          flexGrow: 1,
          bgcolor: "background.paper",
          display: "flex",
          height: "auto",
        }}
      >
        {refunds.length > 0 ? (
          <TableContainer component={Paper}>
            <Table aria-label="collapsible table">
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{
                      backgroundColor: "primary.main",
                      color: "common.white",
                      textAlign: "center",
                    }}
                  />
                  <TableCell
                    sx={{
                      backgroundColor: "primary.main",
                      color: "common.white",
                      fontWeight: "bold",
                      textAlign: "center",
                    }}
                  >
                    Request From
                  </TableCell>
                  <TableCell
                    sx={{
                      backgroundColor: "primary.main",
                      color: "common.white",
                      fontWeight: "bold",
                      textAlign: "center",
                    }}
                    align="right"
                  >
                    Total Requests
                  </TableCell>
                  <TableCell
                    sx={{
                      backgroundColor: "primary.main",
                      color: "common.white",
                      textAlign: "center",
                    }}
                  />
                  <TableCell
                    sx={{
                      backgroundColor: "primary.main",
                      color: "common.white",
                      textAlign: "center",
                    }}
                  />
                  <TableCell
                    sx={{
                      backgroundColor: "primary.main",
                      color: "common.white",
                      textAlign: "center",
                    }}
                  />
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <Row key={row.from} row={row} refreshData={refreshData} />
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
              No Refund Requests.
            </Typography>
          </Box>
        )}
      </Box>

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
    </Container>
  );
}

interface RowProps {
  row: ReturnType<typeof createData>;
  refreshData: () => void; // Typing the refreshData function correctly
}

const Row: React.FC<RowProps> = ({ row, refreshData }) => {
  const [open, setOpen] = useState(false);
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [snackBar, setSnackBar] = useState(false);
  const [type, setType] = useState("success");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();
  // //console.log("Row :", row);

  useEffect(() => {
    const userDetails = getUserDetails();
    if (userDetails) {
      const [, token] = userDetails;
      setToken(token);
    }
  }, []);

  const getStatusStyles = (status) => {
    switch (status) {
      case "pending":
        return {
          color: "orange",
          fontWeight: "bold",
          fontSize: "12px",
        };
      case "approved":
        return {
          color: "green",
          fontWeight: "bold",
          fontSize: "12px",
        };
      case "rejected":
        return {
          color: "red",
          fontWeight: "bold",
          fontSize: "12px",
        };
      default:
        return {};
    }
  };
  const approveOrReject = async (userId, courseId, status) => {
    if (!isTokenValid()) {
      localStorage.clear();
      navigate("/signin");
    } else {
      try {
        const response = await approveOrRejectRefundRequest(
          userId,
          courseId,
          status,
          token
        );
        setLoading(false);
        setType("success");
        setMsg(
          `Refund request ${response?.data?.refundRequest?.status} successfully.`
        );
        setSnackBar(true);
      } catch (error) {
        // //console.log(error);
        setLoading(false);
        setType("success");
        setMsg("Error while updating request.");
        setSnackBar(true);
      }
    }
  };
  const approve = async (userId, courseId) => {
    setLoading(true);
    approveOrReject(userId, courseId, "approved");
    setTimeout(() => {
      refreshData();
    }, 300);
  };

  const reject = async (userId, courseId) => {
    setLoading(true);
    approveOrReject(userId, courseId, "rejected");
    setTimeout(() => {
      refreshData();
    }, 300);
  };

  const closeSnackbar = () => {
    setSnackBar(false);
  };

  return (
    <>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell
          sx={{
            textAlign: "center",
            fontWeight: "bold",
            fontSize: "15px",
          }}
          align="right"
        >
          {row.from}
        </TableCell>
        <TableCell
          sx={{
            textAlign: "center",
            fontWeight: "bold",
            fontSize: "15px",
          }}
        >
          {row.totalRequests}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                History
              </Typography>
              <TableContainer component={Paper}>
                <Table size="medium" aria-label="purchases">
                  <TableHead>
                    <TableRow>
                      <TableCell
                        sx={{
                          backgroundColor: "primary.main",
                          color: "common.white",
                          textAlign: "center",
                        }}
                      >
                        Course Name
                      </TableCell>
                      <TableCell
                        sx={{
                          backgroundColor: "primary.main",
                          color: "common.white",
                          textAlign: "center",
                        }}
                      >
                        Purchase Date
                      </TableCell>
                      <TableCell
                        sx={{
                          backgroundColor: "primary.main",
                          color: "common.white",
                          textAlign: "center",
                        }}
                        align="right"
                      >
                        Request Date
                      </TableCell>
                      <TableCell
                        sx={{
                          backgroundColor: "primary.main",
                          color: "common.white",
                          textAlign: "center",
                        }}
                        align="right"
                      >
                        Price
                      </TableCell>
                      <TableCell
                        sx={{
                          backgroundColor: "primary.main",
                          color: "common.white",
                          textAlign: "center",
                        }}
                      >
                        Discount
                      </TableCell>
                      <TableCell
                        sx={{
                          backgroundColor: "primary.main",
                          color: "common.white",
                          textAlign: "center",
                        }}
                      >
                        Price After Discount
                      </TableCell>
                      <TableCell
                        sx={{
                          backgroundColor: "primary.main",
                          color: "common.white",
                          textAlign: "center",
                        }}
                        align="right"
                      >
                        Status
                      </TableCell>
                      <TableCell
                        sx={{
                          backgroundColor: "primary.main",
                          color: "common.white",
                          textAlign: "center",
                        }}
                        align="right"
                      >
                        Action
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {row.history.map((historyRow, index) => (
                      <TableRow
                        key={index}
                        sx={{
                          "&:nth-of-type(odd)": {
                            backgroundColor: "action.hover",
                          },
                        }}
                      >
                        <TableCell
                          component="th"
                          scope="row"
                          sx={{ textAlign: "center" }}
                        >
                          {historyRow.courseName}
                        </TableCell>
                        <TableCell align="right" sx={{ textAlign: "center" }}>
                          {historyRow.purchaseDate}
                        </TableCell>
                        <TableCell align="right" sx={{ textAlign: "center" }}>
                          {historyRow.requestDate}
                        </TableCell>
                        <TableCell align="right" sx={{ textAlign: "center" }}>
                          {historyRow.price}
                        </TableCell>
                        <TableCell align="right" sx={{ textAlign: "center" }}>
                          {historyRow.discount}%
                        </TableCell>
                        <TableCell align="right" sx={{ textAlign: "center" }}>
                          {historyRow.priceAfterDiscount}
                        </TableCell>
                        <TableCell
                          align="right"
                          sx={{
                            textAlign: "center",
                            ...getStatusStyles(historyRow.status),
                            textTransform: "uppercase",
                          }}
                        >
                          {historyRow.status}
                        </TableCell>
                        <TableCell align="right" sx={{ textAlign: "center" }}>
                          {historyRow.status === "pending" ? (
                            <ButtonGroup
                              variant="text"
                              aria-label="text button group"
                            >
                              <Button
                                sx={{
                                  textTransform: "none",
                                  color: "green",
                                  borderColor: "green",
                                  // "&:hover": {
                                  backgroundColor: "rgba(0, 255, 0, 0.1)",
                                  // },
                                }}
                                onClick={() =>
                                  approve(row.email, historyRow._id)
                                }
                              >
                                Approve
                              </Button>
                              <Button
                                sx={{
                                  textTransform: "none",
                                  color: "red",
                                  borderColor: "red",
                                  // "&:hover": {
                                  backgroundColor: "rgba(255, 0, 0, 0.1)",
                                  // },
                                }}
                                onClick={() =>
                                  reject(row.email, historyRow._id)
                                }
                              >
                                Reject
                              </Button>
                            </ButtonGroup>
                          ) : (
                            "-"
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>

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
    </>
  );
};
