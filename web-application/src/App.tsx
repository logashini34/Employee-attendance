import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Authenticate from './pages/Authentication/Authentication'
import Landing from './pages/Landing'
import NotFound from './pages/NotFound'
import EmployeeDashboard from './pages/Employee/EmployeeDashboard'
import ManagerDashboard from './pages/Manager/ManagerDashboard'

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Landing />} />
          <Route path="/auth/*" element={<Authenticate />} />

          {/* employee routes */}
          <Route path="/employee/dashboard" element={<EmployeeDashboard />} />

          {/* manager routes */}
          <Route path="/manager/dashboard" element={<ManagerDashboard />} />

          <Route path='*' element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
