import './App.css'
import MainLayout from './layout/MainLayout.jsx'
import RegisterAccount from './pages/RegisterAccount.jsx'
import { Route, Routes } from 'react-router-dom'
import RegisterDistributor from './pages/RegisterDistributor.jsx'
import Login from './pages/Login.jsx'
import ManageProfile from './pages/ManageProfile.jsx'
import Home from './pages/Home.jsx'
import GlobalAlert from './components/GlobalAlert.jsx'
import Domains from './pages/DomainsInfo.jsx'
import Plans from './pages/PlansInfo.jsx'
import AdminManageEmployees from './pages/AdminManageEmployees.jsx'
import DashboardLayout from './layout/DashboardLayout.jsx'
import AdminManageDistributors from './pages/AdminManageDistributors.jsx'
import AdminManageAdmins from './pages/AdminManageAdmins.jsx'
import AdminManageDistributorRequests from './pages/AdminManageDistributorRequests.jsx'
import PaymentManagement from './pages/PaymentManagement.jsx'
import MyPlans from './pages/MyPlans.jsx'
import AdminManageDomainRequests from './pages/AdminManageDomainRequests.jsx'
import AdminManageClients from './pages/AdminManageClients.jsx'
import MyDomains from './pages/MyDomains.jsx'
import DistributorInfo from './pages/DistributorInfo.jsx'
import DomainsInfo from './pages/DomainsInfo.jsx'
import PlansInfo from './pages/PlansInfo.jsx'
import DomainRequest from './pages/DomainRequest.jsx'
import EmployeeManageTickets from './pages/EmployeeManageTickets.jsx'
import VerifyEmail from './components/VerifyEmail.jsx'
import Checkout from './pages/Checkout.jsx'
import { LoadingProvider } from './context/LoadingContext';
import GlobalLoader from './components/common/GlobalLoader';
import AdminManagePlans from './pages/AdminManagePlans.jsx'
import AdminManageDomains from './pages/AdminManageDomains.jsx'
import FAQSection from './pages/FAQSection.jsx'
import MyTickets from './pages/MyTickets.jsx'
import TestimonialsSection from './pages/Testimonials.jsx'
import RoleProtectedRoute from './components/routes/RoleProtectedRoute';
import { ROLE } from './enum/roleEnum';
import { Navigate } from 'react-router-dom';
import RecoveryPage from './pages/recoveryPassword/RecoveryPage.jsx';
import DomainFinder from './pages/DomainFinder.jsx'

function App() {
  return (
    <>
      <LoadingProvider>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/" element={
            <MainLayout>
              <Home />
              <DomainFinder></DomainFinder>
              <DomainsInfo />

              <PlansInfo />
              <DistributorInfo />
              <FAQSection />
              <TestimonialsSection />
            </MainLayout>
          } />

          <Route path="/registerAccount" element={<MainLayout><RegisterAccount /></MainLayout>} />
          <Route path="/registerDistributor" element={<MainLayout><RegisterDistributor /></MainLayout>} />
          <Route path="/Login" element={<MainLayout><Login /></MainLayout>} />
          <Route path="/Domains" element={<MainLayout><Domains /></MainLayout>} />
          <Route path="/Plans" element={<MainLayout><Plans /></MainLayout>} />
          <Route path="/activate" element={<VerifyEmail />} />
          <Route path="/recover" element={<MainLayout><RecoveryPage /></MainLayout>} />
          

          {/* Rutas protegidas por rol */}

          {/* ADMIN */}
          <Route element={<RoleProtectedRoute requiredRole={ROLE.ADMIN} />}>
            <Route path="/admin" element={<DashboardLayout />}>
              <Route index element={<ManageProfile />} />
              <Route path="ManageProfile" element={<ManageProfile />} />
              <Route path="ManageDistributors" element={<AdminManageDistributors />} />
              <Route path="ManageAdministrators" element={<AdminManageAdmins />} />
              <Route path="ManageEmployees" element={<AdminManageEmployees />} />
              <Route path="ManageDistributorRequests" element={<AdminManageDistributorRequests />} />
              <Route path="ManageDomainRequests" element={<AdminManageDomainRequests />} />
              <Route path="ManageClients" element={<AdminManageClients />} />
              <Route path="ManagePlans" element={<AdminManagePlans />} />
              <Route path="ManageDomains" element={<AdminManageDomains />} />
            </Route>
          </Route>

          {/* CLIENT */}
          <Route element={<RoleProtectedRoute requiredRole={ROLE.CLIENT} />}>
            <Route path="/client" element={<DashboardLayout />}>
              <Route index element={<ManageProfile />} />
              <Route path="ManageProfile" element={<ManageProfile />} />
              <Route path="PaymentManagement" element={<PaymentManagement />} />
              <Route path="MyPlans" element={<MyPlans />} />
              <Route path="MyDomains" element={<MyDomains />} />
              <Route path="DomainRequest" element={<DomainRequest />} />
              <Route path="MyTickets" element={<MyTickets />} />
              <Route path="Checkout" element={<Checkout />} />
            </Route>
          </Route>

          {/* DISTRIBUTOR */}
          <Route element={<RoleProtectedRoute requiredRole={ROLE.DISTRIBUTOR} />}>
            <Route path="/distributor" element={<DashboardLayout />}>
              <Route index element={<ManageProfile />} />
              <Route path="ManageProfile" element={<ManageProfile />} />
              <Route path="PaymentManagement" element={<PaymentManagement />} />
              <Route path="MyDomains" element={<MyDomains />} />
              <Route path="DomainRequest" element={<DomainRequest />} />
              <Route path="MyTickets" element={<MyTickets />} />
            </Route>
          </Route>

          {/* EMPLOYEE */}
          <Route element={<RoleProtectedRoute requiredRole={ROLE.EMPLOYEE} />}>
            <Route path="/employee" element={<DashboardLayout />}>
              <Route index element={<ManageProfile />} />
              <Route path="ManageProfile" element={<ManageProfile />} />
              <Route path="ManageTickets" element={<EmployeeManageTickets />} />
            </Route>
          </Route>

          {/* Ruta de error para acceso no autorizado */}
          <Route path="/unauthorized" element={<Navigate to="/" replace />} />
          <Route path="*" element={<Navigate to="/" />} />

        </Routes>

        <GlobalLoader />
        <GlobalAlert />
      </LoadingProvider>

    </>
  );
}

export default App;
