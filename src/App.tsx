import { Route, Routes, useNavigate } from "react-router-dom";
import "./App.css";
import { Landing } from "./sections/Landing";
import { Courses } from "./sections/Courses";
import { About } from "./sections/About";
import { SignIn } from "./components/forms/SignIn";
import { SignUp } from "./components/forms/SignUp";
import { PageNotFound } from "./sections/error";
import { NetworkStatus } from "./sections/NetworkStatus";
import ThemeProvider from "./theme";
import { ViewDashboard } from "./sections/dashboard/ViewDashboard";
function App() {
  return (
    <>
      <ThemeProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/dashboard/*" element={<ViewDashboard />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/about" element={<About />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </ThemeProvider>
      <NetworkStatus />
    </>
  );
}

export default App;
