import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import MainLayout from './layout/MainLayout.jsx'
import Register from './pages/Register.jsx'
import { BrowserRouter, Route, Routes } from 'react-router-dom'


function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />} />
        <Route path="/registerAccount" element={<MainLayout>
          <Register />
        </MainLayout>} />

              </Routes>
   
        

 </BrowserRouter>
  )
}

export default App

