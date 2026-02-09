// App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "@/components/routes/ProtectedRoute";
import PublicRoute from "@/components/routes/PublicRoute";

// Pages
import AuthPage from "@/pages/Auth";
import Dashboard from "@/pages/Dashboard";
import Home from "@/pages/Home";
import StudentForm from "@/pages/StudentForm";
import StudentDetail from "@/pages/StudentDetail";

export default function App() {
  return (
    <Routes>
      {/* --- PUBLIC ROUTES (Accessible by anyone) --- */}
      <Route path="/" element={<Home />} />

      {/* --- AUTH ROUTES (Only for guests) --- */}
      {/* Wraps Login/Register. If logged in, redirects to Dashboard */}
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<AuthPage />} />
        <Route path="/register" element={<AuthPage />} />
      </Route>

      {/* --- PROTECTED ROUTES (Only for logged in users) --- */}
      {/* If not logged in, redirects to Login */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        
        {/* Student Routes */}
        <Route path="/students/new" element={<StudentForm />} />
        <Route path="/students/:id" element={<StudentDetail />} />
        <Route path="/students/:id/edit" element={<StudentForm />} />
      </Route>

      {/* Catch-all: Redirect unknown pages to Home or 404 */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}