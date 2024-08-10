import { UserCredentials } from "../components/FormTypes/Account";

export const getUserDetails = (): [UserCredentials, string] | null => {
  const userData = localStorage.getItem("user");
  const token = localStorage.getItem("token");

  if (userData && token) {
    try {
      const parsedUser = JSON.parse(userData) as UserCredentials;
      const parsedToken = JSON.parse(token) as string;

      if (parsedUser) {
        return [parsedUser, parsedToken];
      } else {
        //console.log(parsedUser, parsedToken);
        //console.log("No valid user data found");
      }
    } catch (error) {
      console.error("Failed to parse user data:", error);
    }
  } else {
    //console.log("No user data found in localStorage");
  }

  return null;
};
