import React, { useState } from 'react';
import Button from '../components/Button';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    age: '',
    role: ''
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/register', formData);

      navigate('/login');
    } catch (error) {
      console.error('Error Register:', error);
    }
  };

  return (
    <div className='jmt-attendee-form'>
      <form className='col-lg-6 col-md-10 col-sm-11' onSubmit={handleSubmit}>
        <h2 className='logo'>JMT</h2>
        <div style={{ gap: 20 }} className='w-100 d-flex align-items-center justify-content-between'>
                <div className='jmt-inputGroup'>
                <label className='fw-bold' htmlFor="email">First Name</label>
                <input
                    type="text"
                    id="first_name"
                    className="input"
                    name="first_name"
                    autoComplete="off"
                    value={formData.first_name}
                    required
                    placeholder='eg: Jon'
                    onChange={handleChange}
                />
                </div>

                <div className='jmt-inputGroup'>
                <label className='fw-bold' htmlFor="email">Last Name</label>
                <input
                    type="text"
                    id="last_name"
                    className="input"
                    name="last_name"
                    autoComplete="off"
                    value={formData.last_name}
                    required
                    placeholder='eg: Doe'
                    onChange={handleChange}
                />
                </div>
        </div>

        <div className='jmt-inputGroup'>
          <label className='fw-bold' htmlFor="email">Age</label>
          <input
            type="number"
            id="age"
            className="input"
            name="age"
            autoComplete="off"
            value={formData.age}
            required
            placeholder='eg: 28'
            onChange={handleChange}
          />
        </div>

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

        <div className='jmt-inputGroup'>
            <label className='fw-bold' htmlFor="role">Role</label>
            <select
              id="role"
              className="input"
              name="role"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="" disabled>Doctor OR Patient</option>
              <option value="doctor">Doctor</option>
              <option value="patient">Patient</option>
            </select>
          </div>

        <Button type="submit" text="Register" />
      </form>
    </div>
  );
}

export default Register;
