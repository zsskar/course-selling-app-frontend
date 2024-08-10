import { isMobile, isTablet, isDesktop, isBrowser } from "react-device-detect";
import axios from "axios";
import { BASE_URL } from "../components/backend/urls";

const getDeviceType = () => {
  if (isMobile) return "Mobile";
  else if (isTablet) return "Tablet";
  else if (isDesktop) return "Desktop";
  else if (isBrowser) return "Browser";
  else return "Unknown";
};

export const TrackVisit = async () => {
  const deviceType = getDeviceType();

  try {
    const response = await axios.post(BASE_URL + "/device-logs/log-visit", {
      deviceType: deviceType,
    });
    //console.log("Visit Log:", response.data);
  } catch (error) {
    console.error("Failed to log visit:", error);
  }
};
