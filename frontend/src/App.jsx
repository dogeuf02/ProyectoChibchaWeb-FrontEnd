import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
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


function App() {
  const [count, setCount] = useState(0)

  return (
    <AlertProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />} />
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
          <Route path="/Home" element={<MainLayout>
            <Home />
          </MainLayout>} />
          <Route path="/Domains" element={<MainLayout>
            <Domains />
          </MainLayout>} />
          <Route path="/Plans" element={<MainLayout>
            <Plans />
          </MainLayout>} />
        </Routes>


        <GlobalAlert />
      </BrowserRouter>

    </AlertProvider>
  )
}

export default App

