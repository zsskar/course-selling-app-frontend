import axios, { AxiosResponse } from "axios";
import { BASE_URL } from "./urls";
import { UserCredentials } from "../FormTypes/Account";

interface DataResponse {
  message: string;
  token: string;
  tokenTime: number;
  user: UserCredentials;
}

interface LoginResponse {
  data: DataResponse; // Update 'any' with the appropriate type based on your API response structure
  status: number;
  statusText: string;
  headers: any;
  config: any;
  request?: any;
}

interface LoginError {
  response?: AxiosResponse<any>;
  request?: any;
  message: string;
  config: any;
  code?: string;
}

export const isTokenValid = () => {
  const expirationTime = localStorage.getItem("expirationTime");
  if (!expirationTime) {
    return false;
  }
  return new Date().getTime() < Number(expirationTime);
};

const fetchCoursesResponse = async (
  path: string,
  user: UserCredentials,
  token: string | undefined,
  isPurchased: boolean
) => {
  if (path === "dashboard") {
    if (user?.role === "admin") {
      const response = await axios.get(BASE_URL + `/${user?.role}/courses`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.courses;
    } else {
      if (isPurchased) {
        const response = await axios.get(
          BASE_URL + `/${user?.role}/purchasedCourses`,
          {
            headers: {
              email: user?.email,
              Authorization: `Bearer ${token}`,
            },
          }
        );
        return response.data.courses;
      } else {
        const response = await axios.get(
          BASE_URL + `/${user?.role}/filterCourses`,
          {
            headers: {
              email: user?.email,
              Authorization: `Bearer ${token}`,
            },
          }
        );
        return response.data.courses;
      }
    }
  } else {
    //console.log("Not dashboard");
    //console.log();

    const response = await axios.get(BASE_URL + "/user/courses");
    return response.data.courses;
  }
  // } else {
  //   const response = await axios.get(BASE_URL + `/${user.role}/courses`, {
  //     headers: {
  //       Authorization: `Bearer ${token}`,
  //     },
  //   });
  //   return response.data.courses;
  // }
};

export const fetchCourses = async (
  path: string,
  user: UserCredentials,
  token: string | undefined,
  isPurchased: boolean
) => {
  // //console.log("Path: " + path + " and role: " + role + " token: " + token);

  // if (path === "dashboard" && user.role === "admin") {
  //   return fetchCoursesResponse(path, user, token, isPurchased);
  // } else {
  return fetchCoursesResponse(path, user, token, isPurchased);
  // }
};

export const signUp = async (user: UserCredentials) => {
  const response = await axios.post(BASE_URL + "/user/signup", user);
  //console.log(response);
  return response;
};

const adminLogin = async (
  user: UserCredentials
): Promise<LoginResponse | LoginError> => {
  try {
    const response: AxiosResponse<DataResponse> = await axios.post(
      BASE_URL + "/admin/login",
      {
        email: user.email,
        password: user.password,
      }
    );
    //console.log("response", response);
    return {
      data: response.data,
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
      config: response.config,
      request: response.request,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      //console.log("Axios error:", error);
      return {
        response: error.response,
        request: error.request,
        message: error.message,
        config: error.config,
        code: error.code,
      };
    } else {
      //console.log("Unexpected error:", error);
      throw error;
    }
  }
};

const userLogin = async (
  user: UserCredentials
): Promise<LoginResponse | LoginError> => {
  try {
    const response: AxiosResponse<DataResponse> = await axios.post(
      BASE_URL + "/user/login",
      {
        email: user.email,
        password: user.password,
      }
    );
    //console.log("response", response);
    return {
      data: response.data,
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
      config: response.config,
      request: response.request,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      //console.log("Axios error:", error);
      return {
        response: error.response,
        request: error.request,
        message: error.message,
        config: error.config,
        code: error.code,
      };
    } else {
      //console.log("Unexpected error:", error);
      throw error;
    }
  }
};
export const logIn = async (
  user: UserCredentials
): Promise<LoginResponse | LoginError> => {
  if (user.isAdmin) {
    return adminLogin(user);
  } else {
    return userLogin(user);
  }
};

export const purchaseCourse = async (
  courseId: number,
  user: UserCredentials,
  token
) => {
  const response = await axios.post(
    BASE_URL + `/user/courses/${courseId}`,
    {},
    {
      headers: {
        email: user.email,
        Authorization: `Bearer ${token}`,
      },
    }
  );
  //console.log("response", response);
  return response;
};

export const getSiteVisits = async (user: UserCredentials, token: string) => {
  // //console.log(user, "inside getSiteVisits");
  // //console.log(token, "inside getSiteVisits");

  try {
    const response = await axios.get(BASE_URL + "/device-logs/last10Days", {
      headers: {
        email: user.email,
        Authorization: `Bearer ${token}`,
      },
    });
    // //console.log("response", response);
    return response;
  } catch (error) {
    console.error("Error fetching device logs:", error);
    throw error; // Re-throw the error if needed
  }
};

export const fetchDashboardAnalytics = async (
  user: UserCredentials,
  token: string
) => {
  let endPoint = BASE_URL;
  if (user.role === "admin") {
    endPoint += "/admin/dashboard/getAnalytics";
  } else {
    endPoint += "/user/dashboard/getAnalytics";
  }
  const response = await axios.get(endPoint, {
    headers: {
      email: user.email,
      Authorization: `Bearer ${token}`,
    },
  });
  // //console.log("response", response);
  return response;
};

export const createCourse = async (course, token: string) => {
  const response = await axios.post(BASE_URL + "/admin/courses", course, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  // //console.log("response", response);
  return response;
};

export const updateCourse = async (course, token: string, courseId: string) => {
  const response = await axios.put(
    BASE_URL + `/admin/courses/${courseId}`,
    course,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  // //console.log("response", response);
  return response;
};

export const courseById = async (courseId: string, token: string) => {
  const response = await axios.get(BASE_URL + `/admin/course/${courseId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  // //console.log("response", response);
  return response;
};

export const makeRefundRequest = async (course, user, token: string) => {
  const response = await axios.post(
    BASE_URL + "/user/makeRefundRequest",
    { course },
    {
      headers: {
        email: user.email,
        Authorization: `Bearer ${token}`,
      },
    }
  );
  // //console.log("response", response);
  return response;
};

export const findRefundRequestForUser = async (user, token: string) => {
  const response = await axios.get(BASE_URL + "/user/getRefundRequests", {
    headers: {
      email: user.email,
      Authorization: `Bearer ${token}`,
    },
  });
  // //console.log("response", response);
  return response;
};

export const findRefundRequestForAdmin = async (token: string) => {
  const response = await axios.get(BASE_URL + "/admin/getRefundRequests", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  // //console.log("response", response);
  return response;
};

export const approveOrRejectRefundRequest = async (
  userEmail,
  courseId,
  status,
  token: string
) => {
  const response = await axios.post(
    BASE_URL + "/admin/approveOrRejectRefundRequest",
    {
      userEmail: userEmail,
      courseId: courseId,
      status: status,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  // //console.log("response", response);
  return response;
};

export const allStudents = async (token: string) => {
  const response = await axios.get(BASE_URL + "/admin/students", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response;
};

export const checkEmail = async (token: string, email: string) => {
  const response = await axios.post(
    BASE_URL + "/user/checkEmail",
    { email },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response;
};

export const updateAccount = async (userId, user, token: string) => {
  const response = await axios.put(
    BASE_URL + `/user/updateAccount/${userId}`,
    { user },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response;
};
