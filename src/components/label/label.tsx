import PropTypes from "prop-types";
import { forwardRef } from "react";

import Box from "@mui/material/Box";
import { styled, SxProps, Theme, useTheme } from "@mui/material/styles";

// ----------------------------------------------------------------------

interface LabelProps {
  children: React.ReactNode;
  variant?: "filled" | "outlined" | "soft";
  color?: "primary" | "secondary" | "success";
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  sx?: SxProps<Theme>;
}

// Define the OwnerState type for StyledLabel
type OwnerState = {
  color?: "primary" | "secondary" | "success";
  variant?: "filled" | "outlined" | "soft";
};

// Define the StyledLabel styled component
const StyledLabel = styled("span", {
  shouldForwardProp: (prop) => prop !== "ownerState",
})<{ ownerState?: OwnerState }>(({ theme, ownerState }) => ({
  color: ownerState?.color
    ? theme.palette[ownerState.color].main
    : theme.palette.text.primary,
  border:
    ownerState?.variant === "outlined"
      ? `1px solid ${theme.palette[ownerState.color || "primary"].main}`
      : "none",
  backgroundColor:
    ownerState?.variant === "filled"
      ? theme.palette[ownerState.color || "primary"].main
      : "transparent",
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(1),
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

// Define the Label component
const Label: React.FC<LabelProps> = forwardRef<HTMLSpanElement, LabelProps>(
  (
    {
      children,
      color = "primary",
      variant = "soft",
      startIcon,
      endIcon,
      sx,
      ...other
    },
    ref
  ) => {
    const theme = useTheme();

    const iconStyles = {
      width: 16,
      height: 16,
      "& svg, img": { width: "100%", height: "100%", objectFit: "cover" },
    };

    return (
      <StyledLabel
        ref={ref}
        ownerState={{ color, variant }}
        sx={{
          ...(startIcon && { pl: 0.75 }),
          ...(endIcon && { pr: 0.75 }),
          ...sx,
        }}
        theme={theme}
        {...other}
      >
        {startIcon && <Box sx={{ mr: 0.75, ...iconStyles }}> {startIcon} </Box>}

        {children}

        {endIcon && <Box sx={{ ml: 0.75, ...iconStyles }}> {endIcon} </Box>}
      </StyledLabel>
    );
  }
);

Label.propTypes = {
  children: PropTypes.node.isRequired,
  endIcon: PropTypes.node,
  startIcon: PropTypes.node,
  sx: PropTypes.object,
  variant: PropTypes.oneOf(["filled", "outlined", "soft"]),
  color: PropTypes.oneOf(["primary", "secondary", "success"]),
};

export default Label;
