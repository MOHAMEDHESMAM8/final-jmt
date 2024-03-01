import React, { useState } from 'react';
import Button from '../components/Button';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/auth/login', formData);

      const token = response.data.token;

      let { role } = jwtDecode(JSON.stringify(token));

      localStorage.setItem('token', token);

      if(role === 'doctor'){
        navigate('/admin/patients');
      } else{
        navigate('/patient/sessions')
      }
    } catch (error) {
      console.error('Error logging in:', error);
      setError('Invalid username or password');
    }
  };

  return (
    <div className='jmt-attendee-form'>
      <form className='col-lg-6 col-md-10 col-sm-11' onSubmit={handleSubmit}>
        <h2 className='logo'>JMT</h2>
        {error && <div className="error-message text-danger fw-bold mt-4">{error}</div>}
        <div className='jmt-inputGroup'>
          <label className='fw-bold' htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            className="input"
            name="email"
            autoComplete="off"
            value={formData.email}
            required
            placeholder='eg: admin@admin.com'
            onChange={handleChange}
          />
        </div>

        <div className='jmt-inputGroup'>
          <label className='fw-bold' htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            className="input"
            autoComplete="off"
            name="password"
            value={formData.password}
            required
            onChange={handleChange}
            placeholder='Enter Your Password ..'
          />
        </div>

        <Button type="submit" text="Login" />
      </form>
    </div>
  );
}

export default Login;
