import React, {useState} from 'react'
import MdDateRange from '@meronex/icons/md/MdDateRange';
import MdAccessible from '@meronex/icons/md/MdAccessible';
import FaCaretLeft from '@meronex/icons/fa/FaCaretLeft';
import EnLogOut from '@meronex/icons/en/EnLogOut';
import {NavLink, useNavigate} from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'

function Sidebar() {
    const [isOpen, setIsOpen] = useState(true)
    const navigate = useNavigate();
    let { role } = jwtDecode(JSON.stringify(localStorage.getItem('token')));
    const routes = [
    {
        path: '/admin/patients',
        name: 'Patients',
        icon: <MdAccessible />,
        hide: role === 'patient' ? true : false
    },
    {
        path: '/patient/assessments',
        name: 'Assessments',
        icon: <MdAccessible />,
        hide: role === 'doctor' ? true : false
    },
    {
        path: role === 'doctor' ? '/admin/sessions' : `/patient/sessions`,
        name: 'Sessions',
        icon: <MdDateRange />
    },
    
    ]
  return (
    <div className={`jmt-sidebar ${!isOpen && 'collapsed'}`}>
        <span className='collapseBtn' onClick={() => setIsOpen(!isOpen)}>
            <FaCaretLeft />
        </span>
        <h3 className='logo'>JMT</h3>
        <div className='sidebar_links'>
        {
            routes.map((route) => (
            
            <NavLink to={route.path} style={{ display: route.hide ? 'none' : '' }} key={route.name} className="nav_link">
                <span>{route.icon}</span>
                <span className="link_text">{route.name}</span>
            </NavLink>
            ))
        }
            <span onClick={() => navigate('/logout')} className='nav_link logout'>
                <span><EnLogOut /></span>
                <span className='link_text'>Logout</span>
            </span>
        </div>
    </div>
  )
}

export default Sidebar