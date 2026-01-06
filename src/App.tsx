import { Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./components/home";
import { DemoPage } from "./pages/DemoPage";
import { InvoicesPage } from "./pages/InvoicesPage";
import { UsersPage } from "./pages/UsersPage";
import { ProductsPage } from "./pages/ProductsPage";
import { AuditLogsPage } from "./pages/AuditLogsPage";
import { EditaisPage } from "./pages/EditaisPage";
import { EditalDetailsPage } from "./pages/EditalDetailsPage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { ForgotPasswordPage } from "./pages/ForgotPasswordPage";
import { ResetPasswordPage } from "./pages/ResetPasswordPage";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { Navbar } from "./components/layout/Navbar";
import { useAuth } from "./contexts/AuthContext";

function AppContent() {
  const { user } = useAuth();

  return (
    <>
      {user && <Navbar />}
      <Routes>
        <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/" replace />} />
        <Route path="/cadastro" element={!user ? <RegisterPage /> : <Navigate to="/" replace />} />
        <Route path="/esqueci-senha" element={!user ? <ForgotPasswordPage /> : <Navigate to="/" replace />} />
        <Route path="/redefinir-senha" element={<ResetPasswordPage />} />

        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/demo" element={<ProtectedRoute><DemoPage /></ProtectedRoute>} />
        <Route path="/faturas" element={<ProtectedRoute><InvoicesPage /></ProtectedRoute>} />
        <Route path="/usuarios" element={<ProtectedRoute><UsersPage /></ProtectedRoute>} />
        <Route path="/produtos" element={<ProtectedRoute><ProductsPage /></ProtectedRoute>} />
        <Route path="/logs" element={<ProtectedRoute><AuditLogsPage /></ProtectedRoute>} />
        <Route path="/editais" element={<ProtectedRoute><EditaisPage /></ProtectedRoute>} />
        <Route path="/editais/:id" element={<ProtectedRoute><EditalDetailsPage /></ProtectedRoute>} />

        <Route path="*" element={<Navigate to={user ? "/" : "/login"} replace />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <AppContent />
    </Suspense>
  );
}

export default App;
