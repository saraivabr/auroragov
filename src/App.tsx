import { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./components/home";
import { DemoPage } from "./pages/DemoPage";
import { InvoicesPage } from "./pages/InvoicesPage";
import { UsersPage } from "./pages/UsersPage";
import { ProductsPage } from "./pages/ProductsPage";
import { AuditLogsPage } from "./pages/AuditLogsPage";
import { LoginPage } from "./pages/LoginPage";

function App() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/demo" element={<DemoPage />} />
          <Route path="/invoices" element={<InvoicesPage />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/audit" element={<AuditLogsPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </>
    </Suspense>
  );
}

export default App;
