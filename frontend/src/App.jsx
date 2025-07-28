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
import Domains from './pages/DomainsInfo.jsx'
import Plans from './pages/PlansInfo.jsx'
import AdminManageEmployees from './pages/AdminManageEmployees.jsx'
import Distributor from './pages/DistributorInfo.jsx'
import DashboardLayout from './layout/DashboardLayout';
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

function App() {
  const [count, setCount] = useState(0)

  return (
    <AlertProvider>

      <Routes>
        <Route path="/"
          element={<MainLayout>
            <Home />
            <DomainsInfo/>
            <PlansInfo />
            <DistributorInfo />
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

        <Route path="/Client" element={<DashboardLayout />}>
          <Route index element={<ManageProfile />} />
          <Route path="ManageProfile" element={<ManageProfile />} /> {/* /client/manageProfile */}
          <Route path="Payments" element={<Payments />} /> {/* /client/payments */}
          <Route path="MyPlans" element={<MyPlans />} /> {/* /client/myplans */}
          <Route path='MyDomains' element={<MyDomains />} /> {/* /client/mydomains */}

        </Route>
        <Route path="/Distributor" element={<DashboardLayout />}>
          <Route index element={<ManageProfile />} />
          <Route path="ManageProfile" element={<ManageProfile />} /> {/* /distributor/manageProfile */}
          <Route path="Payments" element={<Payments />} /> {/* /distributor/payments */}
          <Route path="MyPlans" element={<MyPlans />} /> {/* /distributor/myplans */}
          <Route path='MyDomains' element={<MyDomains />} /> {/* /distributor/mydomains */}

        </Route>

      </Routes>


      <GlobalAlert />

    </AlertProvider>
  )
}

export default App