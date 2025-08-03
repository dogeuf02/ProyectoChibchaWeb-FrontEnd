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
import Payments from './pages/Payments.jsx'
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

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={
          <MainLayout>
            <Home />
            <DomainsInfo />
            <PlansInfo />
            <DistributorInfo />
          </MainLayout>
        } />

        <Route path="/registerAccount" element={
          <MainLayout>
            <RegisterAccount />
          </MainLayout>
        } />

        <Route path="/registerDistributor" element={
          <MainLayout>
            <RegisterDistributor />
          </MainLayout>
        } />

        <Route path="/Login" element={
          <MainLayout>
            <Login />
          </MainLayout>
        } />

        <Route path="/Domains" element={
          <MainLayout>
            <Domains />
          </MainLayout>
        } />

        <Route path="/Plans" element={
          <MainLayout>
            <Plans />
          </MainLayout>
        } />

        <Route path="/activate" element={
          <VerifyEmail />
        } />


        {/* Admin Dashboard */}
        <Route path="/admin" element={<DashboardLayout />}>
          <Route index element={<ManageProfile />} />
          <Route path="ManageProfile" element={<ManageProfile />} />
          <Route path="ManageDistributors" element={<AdminManageDistributors />} />
          <Route path="ManageAdministrators" element={<AdminManageAdmins />} />
          <Route path="ManageEmployees" element={<AdminManageEmployees />} />
          <Route path="ManageDistributorRequests" element={<AdminManageDistributorRequests />} />
          <Route path="ManageDomainRequests" element={<AdminManageDomainRequests />} />
          <Route path="ManageClients" element={<AdminManageClients />} />
        </Route>

        {/* Client Dashboard */}
        <Route path="/client" element={<DashboardLayout />}>
          <Route index element={<ManageProfile />} />
          <Route path="ManageProfile" element={<ManageProfile />} />
          <Route path="Payments" element={<Payments />} />
          <Route path="MyPlans" element={<MyPlans />} />
          <Route path="MyDomains" element={<MyDomains />} />
          <Route path="DomainRequest" element={<DomainRequest />} />
        </Route>

        {/* Distributor Dashboard */}
        <Route path="/distributor" element={<DashboardLayout />}>
          <Route index element={<ManageProfile />} />
          <Route path="ManageProfile" element={<ManageProfile />} />
          <Route path="Payments" element={<Payments />} />
          <Route path="MyDomains" element={<MyDomains />} />
          <Route path="DomainRequest" element={<DomainRequest />} />
        </Route>

        {/* Employee Dashboard */}
        <Route path="/employee" element={<DashboardLayout />}>
          <Route index element={<ManageProfile />} />
          <Route path="ManageProfile" element={<ManageProfile />} />
          <Route path="ManageTickets" element={<EmployeeManageTickets />} />
        </Route>
      </Routes>



      <GlobalAlert />
    </>
  );
}

export default App;
