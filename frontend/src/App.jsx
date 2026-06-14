import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useAuth } from "./context/AuthContext";

// Layout structures
import Layout from "./components/layout/Layout";
import { ProtectedRoute, PublicOnlyRoute } from "./components/auth/RouteGuards";

// Page Components
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import VerifyUser from "./pages/auth/VerifyUser";
import Home from "./pages/home/Home";
import Dashboard from "./pages/dashboard/Dashboard";
import Notes from "./pages/notes/Notes";
import GenerateNotes from "./pages/notes/GenerateNotes";
import EditNotes from "./pages/notes/EditNotes";
import ViewNotes from "./pages/notes/ViewNotes";
import NotFound from "./pages/general/NotFound";
import Developer from "./pages/developer/Developer";
import Privacy from "./pages/disclaimers/Privacy";
import Terms from "./pages/disclaimers/Terms";
import DataPrivacy from "./pages/disclaimers/DataPrivacy";

const App = () => {
  const { isAuthenticated, user, loading } = useAuth();

  return (
    <>
      <Toaster position="top-center" gutter={12} containerStyle={{ top: 20 }} />

      <Routes>
        {/* PUBLIC ROUTES */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/developer" element={<Developer />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/data-privacy" element={<DataPrivacy />} />
        </Route>

        {/* VERIFICATION ROUTE */}
        <Route
          path="/verify"
          element={
            <VerifyUser
              user={user}
              isAuthenticated={isAuthenticated}
              isAuthLoading={loading}
            />
          }
        />

        {/* AUTH ROUTES */}
        <Route
          element={
            <PublicOnlyRoute
              isAuthenticated={isAuthenticated}
              isAuthLoading={loading}
            />
          }
        >
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Route>

        {/* PROTECTED WORKSPACE */}
        <Route
          element={
            <ProtectedRoute
              isAuthenticated={isAuthenticated}
              isAuthLoading={loading}
            />
          }
        >
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />

            <Route path="/notes" element={<Notes />} />
            <Route path="/notes/generate" element={<GenerateNotes />} />
            <Route path="/notes/:noteId/view" element={<ViewNotes />} />
            <Route path="/notes/:noteId/edit" element={<EditNotes />} />
          </Route>
        </Route>

        <Route path="/*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default App;