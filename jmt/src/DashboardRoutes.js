import React, { useEffect } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Patients from './pages/Patients';
import Sessions from './pages/Sessions';
import { jwtDecode } from 'jwt-decode'
import Patient from './pages/Patient';
import Assessments from './pages/Assessments';

function DashboardRoutes() {
  const isAuthenticated = !!localStorage.getItem('token');
  let { role } = jwtDecode(JSON.stringify(localStorage.getItem('token')));
  const navigate = useNavigate()
  useEffect(() => {
    if(!isAuthenticated){
      navigate('/admin/login')
    }
  }, [isAuthenticated, navigate])
  return (
    <div className='jmt-dashboard'>
        <Sidebar />
        <div className='content'>
        <Routes>
          {
            role === 'doctor' ? 
            <>
              <Route path='/patients' element={<Patients />} />
              <Route path='/patients/:id' element={<Patient />} />
              <Route path='/sessions' element={<Sessions />} />
            </>
            :
            <>
            <Route path='/sessions' element={<Sessions />} />
            <Route path='/assessments' element={<Assessments />} />
            </>
          }

        </Routes>
        </div>
    </div>
  )
}

export default DashboardRoutes