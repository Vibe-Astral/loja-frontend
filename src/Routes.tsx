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
import AdminLayout from "./pages/Admin/AdminLayout";
import AdminLogin from "./pages/Admin/AdminLogin";
import EstoqueTecnico from "@/pages/Technician/EstoqueTecnico";
import AdminProducts from "@/pages/Admin/AdminProducts";
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
import About from "./pages/About/About";
import MeusPedidos from "./pages/Technician/MeusPedidos";
import AdminVincularTecnico from "./pages/Admin/AdminVincularTecnico";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        {/* Público */}
        <Route path="/" element={<Home />} />
        <Route path="/sobre" element={<About />} />

        <Route path="/client/portal" element={<ClientPortal />} />
        <Route path="/client/portal/auth" element={<FormAuth />} />
        <Route path="/client/dashboard" element={<ClientDashboard />} />

        {/* Técnico */}
        <Route path="/tecnico/portal" element={<TechnicianPortal />} />
        <Route path="/tecnico/login" element={<TechnicianLogin />} />

        <Route
          path="/tecnico"
          element={
            <ProtectedRoute allowedRoles={["TECNICO", "ADMIN"]} redirectTo="/tecnico/login">
              <TechnicianLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<EstoqueTecnico />} /> {/* default ao entrar em /tecnico */}
          <Route path="estoque" element={<EstoqueTecnico />} />
          <Route path="solicitar" element={<SolicitarEquipamento />} />
          <Route path="pedidos" element={<MeusPedidos />} />
          <Route path="ordens" element={<p>📋 Ordens de Serviço (em breve)</p>} />
        </Route>

        {/* Admin */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]} redirectTo="/admin/login">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminPortal />} />
          <Route path="usuarios" element={<AdminUsers />} />
          <Route path="relatorios" element={<AdminRelatorios />} />
          <Route path="/admin/vincular-tecnico" element={<AdminVincularTecnico />} />

          {/* Estoque */}
          <Route path="estoque" element={<AdminEstoque />} /> {/* principal */}
          <Route path="estoque/produtos" element={<AdminProducts />} />
          <Route path="estoque/posicoes" element={<VisualizarEstoque />} />
          <Route path="estoque/pedidos" element={<PedidosPendentes />} />
          <Route path="estoque/movimentacoes" element={<MovimentacoesPage />} />
          <Route path="estoque/devolucoes" element={<DevolucoesPendentes />} />
          <Route path="estoqueTecnico" element={<AdminEstoqueTecnico />} />
          <Route path="filiais" element={<AdminFiliais />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRoutes;
