import { Container, Stack, Alert, Button } from "@mui/material";

export const ShowErrorMsg = ({ msg, handleBtn }) => {
  return (
    <Container
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "50vh",
      }}
    >
      <Stack sx={{ width: "600px" }} spacing={2}>
        <Alert
          sx={{ fontWeight: "bold" }}
          variant="filled"
          severity="error"
          action={
            <Button
              style={{
                backgroundColor: "rgb(24, 119, 242)",
                color: "white",
                top: "5px",
                fontStyle: "italic",
                fontWeight: "bold",
              }}
              size="small"
              onClick={handleBtn}
            >
              RETRY
            </Button>
          }
        >
          {msg}
        </Alert>
      </Stack>
    </Container>
  );
};
