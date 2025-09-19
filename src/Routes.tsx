import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import Home from "./pages/Home/Home";
import ClientPortal from "./pages/Client/ClientPortal";
import FormAuth from "./pages/Client/FormAuth";
import ClientDashboard from "./pages/Client/ClientDashboard";

import TechnicianPortal from "./pages/Technician/TechnicianPortal";
import TechnicianLogin from "./pages/Technician/TechnicianLogin";
import ProtectedRoute from "@/components/ProtectedRoute";

import AdminPortal from "./pages/Admin/AdminPortal";
import AdminUsers from "@/pages/Admin/AdminUsers";
import AdminLayout from "@/pages/Admin/AdminLayout";
import AdminLogin from "@/pages/Admin/AdminLogin";
import RequireAdmin from "@/components/RequireAdmin";
import EstoqueTecnico from "@/pages/Technician/EstoqueTecnico";
import AdminProducts from "@/pages/Admin/AdminProducts";
import EstoquePage from "./pages/Admin/EstoquePage";
import MovimentacoesPage from "./pages/Admin/MovimentacoesPage";
import SolicitarEquipamento from "./pages/Technician/SolicitarEquipamento";
import PedidosPendentes from "./pages/Estoque/PedidosPendentes";
import VisualizarEstoque from "./pages/Estoque/VisualizarEstoque";
import AdminRelatorios from "./pages/Admin/AdminRelatorios";
import AdminFiliais from "./pages/Admin/AdminFiliais";
import AdminEstoque from "./pages/Admin/AdminEstoque";
import AdminEstoqueTecnico from "./pages/Admin/AdminEstoqueTecnico";
import TechnicianLayout from "./pages/Technician/TechnicianLayout";
import DevolucoesPendentes from "./pages/Admin/DevolucoesPendentes";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        {/* Público */}
        <Route path="/" element={<Home />} />
        <Route path="/client/portal" element={<ClientPortal />} />
        <Route path="/client/portal/auth" element={<FormAuth />} />
        <Route path="/client/dashboard" element={<ClientDashboard />} />

        {/* Técnico */}
        <Route path="/tecnico/portal" element={<TechnicianPortal />} />
        <Route path="/tecnico/login" element={<TechnicianLogin />} />

        <Route
          path="/tecnico"
          element={
            <ProtectedRoute allowedRoles={["TECNICO", "ADMIN"]}>
              <TechnicianLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<EstoqueTecnico />} /> {/* default ao entrar em /tecnico */}
          <Route path="estoque" element={<EstoqueTecnico />} />
          <Route path="solicitar" element={<SolicitarEquipamento />} />
          {/* já preparado para futuras páginas */}
          <Route path="ordens" element={<p>📋 Ordens de Serviço (em breve)</p>} />
        </Route>

        {/* Admin */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <RequireAdmin>
              <AdminLayout />
            </RequireAdmin>
          }
        >
          <Route path="/admin/relatorios" element={<AdminRelatorios />} />
          <Route path="/admin/estoque" element={<AdminEstoque />} />
          <Route path="/admin/estoqueTecnico" element={<AdminEstoqueTecnico />} />
          <Route path="/admin/filiais" element={<AdminFiliais />} />
          <Route index element={<AdminPortal />} />
          <Route path="usuarios" element={<AdminUsers />} />
          {/* Estoque (hub + subrotas) */}
          <Route path="estoque/produtos" element={<AdminProducts />} />
          <Route path="estoque" element={<EstoquePage />} />
          <Route path="estoque/posicoes" element={<VisualizarEstoque />} />
          <Route path="estoque/pedidos" element={<PedidosPendentes />} />
          <Route path="estoque/movimentacoes" element={<MovimentacoesPage />} />
          <Route path="estoque/devolucoes" element={<DevolucoesPendentes />} />

        </Route>
      </Routes>
    </Router>
  );
};

export default AppRoutes;
