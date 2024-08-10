export type UserCredentials = {
  _id: string;
  email: string;
  password: string;
  isAdmin: boolean;
  firstName: string;
  lastName: string;
  role: string;
  purchasedCourses: [];
};
