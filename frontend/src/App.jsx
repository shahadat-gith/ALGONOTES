import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useAuth } from "./context/AuthContext";

import Layout from "./components/layout/Layout";

// Auth pages
import { ProtectedRoute, PublicOnlyRoute } from "./components/auth/RouteGuards";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import VerifyUser from "./pages/auth/VerifyUser";

import Home from "./pages/home/Home";

// Note pages
import Notes from "./pages/notes/Notes";
import NoteGenerator from "./pages/notes/NoteGenerator";
import NoteEditor from "./pages/notes/NoteEditor";
import NoteDetails from "./pages/notes/NoteDetails";

// Theory pages
import Theories from "./pages/theory/Theories";
import TheoryGenerator from "./pages/theory/TheoryGenerator";
import TheoryEditor from "./pages/theory/TheoryEditor";
import TheoryDetails from "./pages/theory/TheoryDetails";

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

        {/* Protected Feature Tracks Layout Context */}
        <Route
          element={
            <ProtectedRoute
              isAuthenticated={isAuthenticated}
              isAuthLoading={loading}
            />
          }
        >
          <Route element={<Layout />}>
            {/* DSA Coding Notes Management Segment */}
            <Route path="/notes" element={<Notes />} />
            <Route path="/notes/generate" element={<NoteGenerator />} />
            <Route path="/notes/:id" element={<NoteDetails />} />
            <Route path="/notes/:id/edit" element={<NoteEditor />} />

            {/* CS Theory Masterclass Generation Segment */}
            <Route path="/theory" element={<Theories />} />
            <Route path="/theory/generate" element={<TheoryGenerator />} />
            <Route path="/theory/:id/edit" element={<TheoryEditor />} />
            <Route path="/theory/:id/details" element={<TheoryDetails />} />
          </Route>
        </Route>

        <Route path="/*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default App;