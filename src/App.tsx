import { Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { ConsultaJuridicaPage } from "./pages/ConsultaJuridicaPage";
import { AnaliseDocumentosPage } from "./pages/AnaliseDocumentosPage";
import { GeradorDocumentosPage } from "./pages/GeradorDocumentosPage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { ForgotPasswordPage } from "./pages/ForgotPasswordPage";
import { ResetPasswordPage } from "./pages/ResetPasswordPage";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { AppLayout } from "./components/layout/AppLayout";
import { useAuth } from "./contexts/AuthContext";

function AppContent() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/" replace />} />
      <Route path="/cadastro" element={!user ? <RegisterPage /> : <Navigate to="/" replace />} />
      <Route path="/esqueci-senha" element={!user ? <ForgotPasswordPage /> : <Navigate to="/" replace />} />
      <Route path="/redefinir-senha" element={<ResetPasswordPage />} />

      <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
      <Route path="/consulta-juridica" element={<ProtectedRoute><AppLayout><ConsultaJuridicaPage /></AppLayout></ProtectedRoute>} />
      <Route path="/analise-documentos" element={<ProtectedRoute><AppLayout><AnaliseDocumentosPage /></AppLayout></ProtectedRoute>} />
      <Route path="/gerar-documentos" element={<ProtectedRoute><AppLayout><GeradorDocumentosPage /></AppLayout></ProtectedRoute>} />

      <Route path="*" element={<Navigate to={user ? "/" : "/login"} replace />} />
    </Routes>
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
