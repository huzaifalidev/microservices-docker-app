// import "./App.css";
import SignIn from "./pages/auth/signin";
import SignUp from "./pages/auth/signup";
import ForgetPassword from "./pages/auth/forgetpassword";
import ResetPassword from "./pages/auth/resetpassword";
import LandingPage from "./pages/landingPage";
import { ThemeProvider } from "./components/ui/theme-provider.tsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/dashboard/index.tsx";
import Layout from "./layout/index.tsx";
import GlobalLoader from "./components/loading";
import Tasks from "./pages/tasks";
import Portfolios from "./pages/portfolios";
import ProtectedRoute from "./middleware/ProtectedRoute";

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="theme">
      <GlobalLoader />
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgetPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/tasks"
            element={
              <ProtectedRoute>
                <Layout>
                  <Tasks />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/portfolios"
            element={
              <ProtectedRoute>
                <Layout>
                  <Portfolios />
                </Layout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
