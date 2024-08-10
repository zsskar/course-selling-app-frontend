import { Backdrop, CircularProgress } from "@mui/material";

interface BackdropProps {
  open: boolean;
}

const Loader = ({ open }: BackdropProps) => {
  return (
    <Backdrop
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        color: "#fff",
        backgroundColor: "rgba(0, 0, 0, 0.5)", // Example background color with opacity
        display: open ? "flex" : "none", // Show backdrop based on 'open' prop and use flex for centering
        alignItems: "center", // Center vertically
        justifyContent: "center", // Center horizontally
      }}
      open={open}
    >
      <CircularProgress color="primary" />
    </Backdrop>
  );
};

export default Loader;
