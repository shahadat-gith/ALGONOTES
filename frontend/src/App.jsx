import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useAuth } from "./context/AuthContext";

import Layout from "./components/layout/Layout";
import { ProtectedRoute, PublicOnlyRoute } from "./components/auth/RouteGuards";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import VerifyUser from "./pages/auth/VerifyUser";

import Home from "./pages/home/Home";
import Notes from "./pages/notes/Notes";
import NoteGenerator from "./pages/notes/NoteGenerator";
import NoteEditor from "./pages/notes/NoteEditor";
import NoteDetails from "./pages/notes/NoteDetails";

import NotFound from "./pages/general/NotFound";
import Developer from "./pages/developer/Developer";
import Privacy from "./pages/disclaimers/Privacy";
import Terms from "./pages/disclaimers/Terms";
import DataPrivacy from "./pages/disclaimers/DataPrivacy";

const App = () => {
  const { isAuthenticated, user, loading } = useAuth();

  return (
    <>
      <Toaster
        position="top-center"
        gutter={12}
        containerStyle={{ top: 20 }}
      />

      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/developer" element={<Developer />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/data-privacy" element={<DataPrivacy />} />
        </Route>

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
        </Route>

        <Route
          element={
            <ProtectedRoute
              isAuthenticated={isAuthenticated}
              isAuthLoading={loading}
            />
          }
        >
          <Route element={<Layout />}>
            <Route path="/notes" element={<Notes />} />
            <Route path="/notes/generate" element={<NoteGenerator />} />

            <Route path="/notes/:id" element={<NoteDetails />} />
            <Route path="/notes/:id/edit" element={<NoteEditor />} />
          </Route>
        </Route>

        <Route path="/*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default App;