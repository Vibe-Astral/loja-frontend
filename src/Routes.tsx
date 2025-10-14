import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import Home from "./pages/Home/Home";
import About from "./pages/About/About";

// Clientes
import ClientPortal from "./pages/Client/ClientPortal";
import FormAuth from "./pages/Client/FormAuth";
import ClientDashboard from "./pages/Client/ClientDashboard";

// Técnico
import TechnicianPortal from "./pages/Technician/TechnicianPortal";
import TechnicianLogin from "./pages/Technician/TechnicianLogin";
import TechnicianLayout from "./pages/Technician/TechnicianLayout";
import EstoqueTecnico from "./pages/Technician/EstoqueTecnico";
import SolicitarEquipamento from "./pages/Technician/SolicitarEquipamento";
import MeusPedidos from "./pages/Technician/MeusPedidos";
import TecnicoOrdens from "./pages/Technician/TecnicoOrdens";
import DetalheOrdem from "./pages/Technician/DetalheOrdem";

// Admin
import AdminLayout from "./pages/Admin/AdminLayout";
import AdminPortal from "./pages/Admin/AdminPortal";
import AdminLogin from "./pages/Admin/AdminLogin";
import AdminUsers from "./pages/Admin/AdminUsers";
import AdminOrdens from "./pages/Admin/AdminOrdens";
import AdminOrdemDetalhe from "./pages/Admin/AdminOrdemDetalhe";
import AdminProducts from "./pages/Admin/AdminProducts";
import MovimentacoesPage from "./pages/Admin/MovimentacoesPage";
import PedidosPendentes from "./pages/Estoque/PedidosPendentes";
import VisualizarEstoque from "./pages/Estoque/VisualizarEstoque";
import AdminRelatorios from "./pages/Admin/AdminRelatorios";
import AdminFiliais from "./pages/Admin/AdminFiliais";
import AdminEstoque from "./pages/Admin/AdminEstoque";
import AdminEstoqueTecnico from "./pages/Admin/AdminEstoqueTecnico";
import AdminVincularTecnico from "./pages/Admin/AdminVincularTecnico";
import DevolucoesPendentes from "./pages/Admin/DevolucoesPendentes";

// Consultor
import ConsultorLayout from "./pages/consultor/ConsultorLayout";
import ConsultorPortal from "./pages/consultor/ConsultorPortal";
import ConsultorLogin from "./pages/consultor/ConsultorLogin";
import ConsultorVendas from "./pages/consultor/ConsultorVendas";
import ConsultorRelatorios from "./pages/consultor/ConsultorRelatorios";
import ConsultorOrdens from "./pages/consultor/ConsultorOrdens";
import ConsultorOrdemDetalhe from "./pages/consultor/ConsultorOrdemDetalhe";

// Auth
import ProtectedRoute from "@/components/ProtectedRoute";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        {/* Público */}
        <Route path="/" element={<Home />} />
        <Route path="/sobre" element={<About />} />

        {/* Cliente */}
        <Route path="/client/portal" element={<ClientPortal />} />
        <Route path="/client/portal/auth" element={<FormAuth />} />
        <Route path="/client/dashboard" element={<ClientDashboard />} />

        {/* Consultor */}
        <Route path="/consultor/portal" element={<ConsultorPortal />} />
        <Route path="/consultor/login" element={<ConsultorLogin />} />

        <Route
          path="/consultor"
          element={
            <ProtectedRoute
              allowedRoles={["CONSULTOR", "ADMIN"]}
              redirectTo="/consultor/login"
            >
              <ConsultorLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<ConsultorVendas />} />
          <Route path="vendas" element={<ConsultorVendas />} />
          <Route path="relatorios" element={<ConsultorRelatorios />} />
          <Route path="ordens" element={<ConsultorOrdens />} />
          <Route path="ordens/:id" element={<ConsultorOrdemDetalhe />} />
        </Route>

        {/* Técnico */}
        <Route path="/tecnico/portal" element={<TechnicianPortal />} />
        <Route path="/tecnico/login" element={<TechnicianLogin />} />

        <Route
          path="/tecnico"
          element={
            <ProtectedRoute
              allowedRoles={["TECNICO", "ADMIN"]}
              redirectTo="/tecnico/login"
            >
              <TechnicianLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<EstoqueTecnico />} />
          <Route path="estoque" element={<EstoqueTecnico />} />
          <Route path="solicitar" element={<SolicitarEquipamento />} />
          <Route path="pedidos" element={<MeusPedidos />} />
          <Route path="ordens" element={<TecnicoOrdens />} />
          <Route path="ordens/:id" element={<DetalheOrdem />} />
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
          <Route path="vincular-tecnico" element={<AdminVincularTecnico />} />

          {/* Ordens */}
          <Route path="ordens" element={<AdminOrdens />} />
          <Route path="ordens/:id" element={<AdminOrdemDetalhe />} />

          {/* Estoque */}
          <Route path="estoque" element={<AdminEstoque />} />
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
