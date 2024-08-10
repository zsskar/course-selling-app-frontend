import { Breakpoint, useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

export function useResponsive(
  query: "up" | "down" | "between" | "only",
  start: Breakpoint,
  end?: Breakpoint
) {
  const theme = useTheme();

  // Call useMediaQuery unconditionally
  const mediaUp = useMediaQuery(theme.breakpoints.up(start));
  const mediaDown = useMediaQuery(theme.breakpoints.down(start));
  const mediaBetween = end
    ? useMediaQuery(theme.breakpoints.between(start, end))
    : false;
  const mediaOnly = useMediaQuery(theme.breakpoints.only(start));

  // Return the result based on the query type
  switch (query) {
    case "up":
      return mediaUp;
    case "down":
      return mediaDown;
    case "between":
      return mediaBetween;
    case "only":
      return mediaOnly;
    default:
      return false; // Default case if query type is not matched
  }
}

// ----------------------------------------------------------------------

export function useWidth() {
  const theme = useTheme();

  const keys = [...theme.breakpoints.keys].reverse();

  return (
    keys.reduce((output, key) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const matches = useMediaQuery(theme.breakpoints.up(key));

      return !output && matches ? key : output;
    }, null) || "xs"
  );
}
