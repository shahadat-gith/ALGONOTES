import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Layout from "./components/layout/Layout";

// Auth guards
import { ProtectedRoute, PublicOnlyRoute } from "./components/auth/RouteGuards";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import VerifyUser from "./pages/auth/VerifyUser";

import Home from "./pages/home/Home";

import Dashboard from "./pages/dashboard/Dashboard";
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
import HowNoteGenerationWorks from "./pages/general/HowNoteGenerationWorks";
import HowTheoryGenerationWorks from "./pages/general/HowTheoryGenerationWorks";


const App = () => {
  return (
    <>
      <Toaster
        position="top-center"
        gutter={12}
        containerStyle={{ top: 20 }}
      />

      <Routes>
        {/* PUBLIC CHANNELS */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/developer" element={<Developer />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/data-privacy" element={<DataPrivacy />} />
          <Route path="/how-it-works/notes" element={<HowNoteGenerationWorks />} />
          <Route path="/how-it-works/theory" element={<HowTheoryGenerationWorks />} />
        </Route>

        {/* VERIFICATION TRACKS */}
        {/* PublicOnlyRoute drops them inside if unverified, or bounces them to /notes if verified */}
        <Route element={<PublicOnlyRoute />}>
          <Route path="/verify" element={<VerifyUser />} />
        </Route>

        {/* ANONYMOUS GUEST ONLY CHANNELS */}
        <Route element={<PublicOnlyRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Route>

        {/* PROTECTED PLATFORM WORKSPACES */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            {/* DSA Coding Notes */}

            <Route path="/dashboard" element={<Dashboard />} />

            <Route path="/notes" element={<Notes />} />
            <Route path="/notes/generate" element={<NoteGenerator />} />
            <Route path="/notes/:id" element={<NoteDetails />} />
            <Route path="/notes/:id/edit" element={<NoteEditor />} />

            {/* CS Theory */}
            <Route path="/theory" element={<Theories />} />
            <Route path="/theory/generate" element={<TheoryGenerator />} />
            <Route path="/theory/:id/edit" element={<TheoryEditor />} />
            <Route path="/theory/:id" element={<TheoryDetails />} />
          </Route>
        </Route>

        {/* CATCH-ALL ANONYMOUS FALLBACK */}
        <Route path="/*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default App;