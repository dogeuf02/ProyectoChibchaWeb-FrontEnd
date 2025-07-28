import { useState } from 'react'
import './App.css'
import MainLayout from './layout/MainLayout.jsx'
import RegisterAccount from './pages/RegisterAccount.jsx'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import RegisterDistributor from './pages/RegisterDistributor.jsx'
import Login from './pages/Login.jsx'
import ManageProfile from './pages/ManageProfile.jsx'
import Home from './pages/Home.jsx'
import { AlertProvider } from './context/AlertContext.jsx'
import GlobalAlert from './components/GlobalAlert.jsx'
import Domains from './pages/Domains.jsx'
import Plans from './pages/Plans.jsx'
import AdminManageEmployees from './pages/AdminManageEmployees.jsx'
import Distributor from './pages/Distributor.jsx'
import DashboardLayout from './layout/DashboardLayout';
import AdminManageDistributors from './pages/AdminManageDistributors.jsx'
import AdminManageAdmins from './pages/AdminManageAdmins.jsx'
import AdminManageDistributorRequests from './pages/AdminManageDistributorRequests.jsx'
import Payments from './pages/Payments.jsx'
import MyPlans from './pages/MyPlans.jsx'
import AdminManageDomainRequests from './pages/AdminManageDomainRequests.jsx'
import AdminManageClients from './pages/AdminManageClients.jsx'

function App() {
  const [count, setCount] = useState(0)

  return (
    <AlertProvider>

      <Routes>
        <Route path="/"
          element={<MainLayout>
            <Home />
            <Domains />
            <Plans />
            <Distributor />
          </MainLayout>

          } />
        <Route path="/registerAccount" element={
          <MainLayout>
            <RegisterAccount />
          </MainLayout>
        } />

        <Route path="/registerDistributor" element={<MainLayout>
          <RegisterDistributor />
        </MainLayout>} />
        <Route path="/Login" element={<MainLayout>
          <Login />
        </MainLayout>} />
        <Route path="/ManageProfile" element={<MainLayout>
          <ManageProfile />
        </MainLayout>} />

        <Route path="/Domains" element={<MainLayout>
          <Domains />
        </MainLayout>} />
        <Route path="/Plans" element={<MainLayout>
          <Plans />
        </MainLayout>} />


        <Route path="/admin" element={<DashboardLayout />}>
          <Route index element={<ManageProfile />} /> {/* /admin */}
          <Route path="ManageDistributors" element={<AdminManageDistributors />} /> {/* /admin/distributors */}
          <Route path="ManageAdministrators" element={<AdminManageAdmins />} /> {/* /admin/administrators */}
          <Route path="ManageEmployees" element={<AdminManageEmployees />} /> {/* /admin/employees */}
          <Route path="ManageDistributorRequests" element={<AdminManageDistributorRequests />} /> {/* /admin/distributor-requests */}
          <Route path="ManageDomainRequests" element={<AdminManageDomainRequests />} /> {/* /admin/domain-requests */}
          <Route path='ManageClients' element={<AdminManageClients />} /> {/* /admin/manage-clients */}

        </Route>
          <Route path="/Payments" element={<MainLayout>
            <Payments />
          </MainLayout>} />

          <Route path="/MyPlans" element={<MainLayout>
            <MyPlans />
          </MainLayout>} />

        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<ManageProfile />} />

        </Route>

      </Routes>


      <GlobalAlert />

    </AlertProvider>
  )
}

export default App