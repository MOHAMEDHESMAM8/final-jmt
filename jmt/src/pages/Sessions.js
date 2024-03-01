import React, {useState, useEffect } from 'react'
import AddIcon from '../components/AddIcon'
import Modal from '../components/Modal'
import axiosInstance from '../axiosInstance';
import Button from '../components/Button';
import FaUserAlt from '@meronex/icons/fa/FaUserAlt';
import FaGamepad from '@meronex/icons/fa/FaGamepad';
import MdInfoOutline from '@meronex/icons/md/MdInfoOutline';
import MdEdit from '@meronex/icons/md/MdEdit';
import FaRegTrashAlt from '@meronex/icons/fa/FaRegTrashAlt';
import MdAccessible from '@meronex/icons/md/MdAccessible';
import FaCalendarAlt from '@meronex/icons/fa/FaCalendarAlt';
import MdAccessibility from '@meronex/icons/md/MdAccessibility';
import FaSortNumericUpAlt from '@meronex/icons/fa/FaSortNumericUpAlt';
import FaTrophy from '@meronex/icons/fa/FaTrophy';
import { jwtDecode } from 'jwt-decode'

function Sessions() {
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [patients, setPatients] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [games, setGames] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [role, setRole] = useState('');
  const [userId, setUserId] = useState('');
  const [formData, setFormData] = useState({
    patient_user_id: '',
    game_id: '',
    start_angle: '',
    desired_angle: '',
    target_score: '',
    rra: '',
    scheduled_at: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDeleteSubmit = (id) => {
    axiosInstance.delete(`http://localhost:3000/sessions/${id}`).then((res) => {
      setSubmitted(!submitted)
    })
    console.log(id)
    setDeleteModal(false);
    
  }

  const handleEdit = (id) => {
    axiosInstance.get(`http://localhost:3000/sessions/${id}`).then((res) => {      
      setFormData(res.data)
    })
    setEditModal(true);
  }

  const handleDelete = (id) => {
    axiosInstance.get(`http://localhost:3000/sessions/${id}`).then((res) => {      
      setFormData((prevData) => ({...prevData, id: id}))
      console.log(res.data)
    })
    setDeleteModal(true);
  }

  const handleSubmit = (e) => {
    axiosInstance.post('http://localhost:3000/sessions', formData).then((res) => {
      setTimeout(() => {
        setShowSuccessPopup(true);
        setTimeout(() => {
          setShowSuccessPopup(false);
        }, 3000); // Hide popup after 3 seconds
      }, 300);
      setAddModal(false)
      console.log(formData, 'data')
      setSubmitted(!submitted)
    })
  }

  const handleEditSubmit = (id) => {
    axiosInstance.put(`http://localhost:3000/sessions/${id}`, formData).then((res) => {
      setTimeout(() => {
        setShowSuccessPopup(true);
        setTimeout(() => {
          setShowSuccessPopup(false);
        }, 3000); // Hide popup after 3 seconds
      }, 300);
      setEditModal(false)
      setSubmitted(!submitted)
    })
    console.log(formData, 'data')
  }

  const handleGame = (sessionID) => {
    window.location.href = `http://127.0.0.1:8080/index.html?session=${sessionID}`;
  }

  const handleRender = (sessions) => {
    if(role === 'doctor'){
      return(
        sessions.map((session) => (
          <div key={session.id} className='row jmt-session w-100
           justify-content-between align-items-center'>
            <div className='col-lg-4 rec-col d-flex flex-column justify-content-between'>
              <div className='rec'><span className='me-3'><FaUserAlt /></span><span>{session.first_name + ' ' + session.last_name}</span></div>
              <div className='rec'><span className='me-3'><FaGamepad /></span><span>{session.game_name}</span></div>
            </div>
            <div className='col-lg-4 rec-col d-flex justify-content-center align-items-center'>
              <span className='info icon'><MdInfoOutline /></span>
              <span className='edit icon' onClick={() => handleEdit(session.id)}><MdEdit /></span>
              <span className='delete icon' onClick={() => handleDelete(session.id)}><FaRegTrashAlt /></span>
            </div>
            <div className='col-lg-4 rec-col d-flex flex-column justify-content-between align-items-end'>
              <div className='rec'><span className='me-3'><MdAccessible /></span><span>{session.patient_age} Y.O</span></div>
              <div className='rec'><span className='me-3'><FaCalendarAlt /></span><span>{session.scheduled_at}</span></div>
            </div>
          </div>
        ))
      )
    } else {
      return(
        sessions.map((session) => (
          <div key={session.id} className='row jmt-session w-100 justify-content-between align-items-center'>
            <div className='col-lg-6 rec-col d-flex flex-column justify-content-between'>
              <div className='rec'><span className='me-3'><FaCalendarAlt /></span><span>{session.scheduled_at}</span></div>
              <div className='rec'><span className='me-3'><FaGamepad /></span><span>{session.game_name}</span></div>
              <div className='rec'><span className='me-3'><MdAccessibility /></span><span>Desired Angle: <span style={{color : '#47BA00', fontWeight: 600}}>{session.desired_angle} °</span></span></div>
            </div>
            <div className='col-lg-6 rec-col d-flex flex-column justify-content-between align-items-end'>
              <div className='rec'><span className='me-3'><FaSortNumericUpAlt /></span><span>Required Score: <span style={{color : '#47BA00', fontWeight: 600}}>{session.target_score}</span></span></div>
              <div className='rec'><span className='me-3'><FaTrophy /></span><span>Times To Reach Target Angle: <span style={{color : '#47BA00', fontWeight: 600}}>{session.rra}</span></span></div>
              <div className='rec'><span className='me-3'><FaCalendarAlt /></span><span>Joint: <span style={{color : '#47BA00', fontWeight: 600}}>{session.joint}</span></span></div>
            </div>
            
            <button text="Play Now" className='play-now' onClick={() => handleGame(session.id)}>Play Now</button>
          </div>
        ))
      )
    }
  }

  useEffect(() => {
    let { userId, role } = jwtDecode(JSON.stringify(localStorage.getItem('token')));
    setRole(role)
    setUserId(userId)
    console.log(role)
    console.log(userId, 'id')
    setFormData((prevData) => ({...prevData, doctor_user_id: userId}))

    const fetchPatients = async () => {
      try {
        
        const response = await axiosInstance.get(`http://localhost:3000/patients`);
        setPatients(response.data);
        console.log(response.data, 'patients')
      } catch (error) {
        console.error('Error fetching patients:', error)
      }
    };

    const fetchSessions = async () => {
      try {
        const response = await axiosInstance.get(`http://localhost:3000/sessions`);
    
        // Convert scheduled_at format for each session
        const formattedSessions = response.data.map(session => {
          const scheduledAtDate = new Date(session.scheduled_at);
          scheduledAtDate.toLocaleString('en-US', { timeZone: 'Africa/Cairo' });
          const monthNames = ["January", "February", "March", "April", "May", "June",
                              "July", "August", "September", "October", "November", "December"];
          const month = monthNames[scheduledAtDate.getMonth()];
          const day = scheduledAtDate.getDate();
          const year = scheduledAtDate.getFullYear();
          return {
            ...session,
            scheduled_at: `${month} ${day}, ${year}`
          };
        });
    
        setSessions(formattedSessions);
        console.log(formattedSessions, 'formatted sessions');
      } catch (error) {
        console.error('Error fetching sessions:', error);
      }
    };
    
    const fetchGames = async () => {
      try {
        const response = await axiosInstance.get(`http://localhost:3000/games`);
        setGames(response.data);
      } catch (error) {
        console.error('Error fetching games:', error);
      }
    };

    fetchSessions();
    fetchPatients();
    fetchGames();
  }, [submitted])


  return (
    <div className='jmt-sessions d-flex align-items-center justify-content-center flex-column col-lg-11 col-md-8 col-sm-11'>
        <h2>Upcoming Sessions</h2>

        {
          sessions && (
            handleRender(sessions)
          )
        }

        <Modal toggle={addModal} setToggle={setAddModal}>
            <div className='d-flex align-items-center flex-column justify-content-center'>
                <h3 className='fw-bold'>Add Session</h3>
                <div className='jmt-inputGroup'>
                  <label className='fw-bold' htmlFor="patient_user_id">Select Patient</label>
                  <select
                    id="patient_user_id"
                    className="input"
                    name="patient_user_id"
                    value={formData.patient_user_id}
                    onChange={handleChange}
                  >
                    <option value="" disabled>Patient</option>
                    {
                      patients && patients.map((p, index) => (
                        <option key={index} value={p.patient_id}>{p.first_name + ' ' + p.last_name}</option>
                      ))
                    }
                  </select>
                </div>

                <div className='jmt-inputGroup'>
                  <label className='fw-bold' htmlFor="patient_user_id">Select Game</label>
                  <select
                    id="game"
                    className="input"
                    name="game_id"
                    value={formData.game_id}
                    onChange={handleChange}
                  >
                    <option value="" disabled>Game</option>
                    {
                      games && games.map((p, index) => (
                        <option key={index} value={p.id}>{p.name.toUpperCase()}</option>
                      ))
                    }
                  </select>
                </div>

                <div style={{ gap: 20 }} className='w-100 d-flex align-items-center justify-content-between'>
                    <div className='jmt-inputGroup'>
                      <label className='fw-bold' htmlFor="start_angle">Start Angle</label>
                      <input
                          type="number"
                          id="start_angle"
                          className="input"
                          name="start_angle"
                          autoComplete="off"
                          value={formData.start_angle}
                          required
                          placeholder='eg: 60'
                          onChange={handleChange}
                      />
                    </div>

                    <div className='jmt-inputGroup'>
                      <label className='fw-bold' htmlFor="email">Desired Angle</label>
                      <input
                          type="number"
                          id="desired_angle"
                          className="input"
                          name="desired_angle"
                          autoComplete="off"
                          value={formData.desired_angle}
                          required
                          placeholder='eg: Doe'
                          onChange={handleChange}
                      />
                    </div>
                </div>

                <div style={{ gap: 20 }} className='w-100 d-flex align-items-center justify-content-between'>
                    <div className='jmt-inputGroup'>
                      <label className='fw-bold' htmlFor="rra">Required Times</label>
                      <input
                          type="number"
                          id="rra"
                          className="input"
                          name="rra"
                          autoComplete="off"
                          value={formData.rra}
                          required
                          placeholder='eg: 6'
                          onChange={handleChange}
                      />
                    </div>

                    <div className='jmt-inputGroup'>
                      <label className='fw-bold' htmlFor="email">Target Score</label>
                      <input
                          type="number"
                          id="target_score"
                          className="input"
                          name="target_score"
                          autoComplete="off"
                          value={formData.target_score}
                          required
                          placeholder='eg: 5000'
                          onChange={handleChange}
                      />
                    </div>
                </div>
                <div className='jmt-inputGroup'>
                  <label className='fw-bold' htmlFor="start_angle">Date</label>
                  <input
                      type="date"
                      id="scheduled_at"
                      className="input"
                      name="scheduled_at"
                      autoComplete="off"
                      value={formData.scheduled_at}
                      required
                      placeholder='eg: 60'
                      onChange={handleChange}
                  />
                </div>

                <Button text="Submit" onClick={handleSubmit} type="submit" />

            </div>
        </Modal>

        <Modal toggle={editModal} setToggle={setEditModal}>
            <div className='d-flex align-items-center flex-column justify-content-center'>
                <h3 className='fw-bold'>Edit Session</h3>
                <div className='jmt-inputGroup'>
                  <label className='fw-bold' htmlFor="patient_user_id">Select Patient</label>
                  <select
                    id="patient_user_id"
                    className="input"
                    name="patient_user_id"
                    value={formData.patient_user_id}
                    onChange={handleChange}
                  >
                    <option value="" disabled>Patient</option>
                    {
                      patients && patients.map((p, index) => (
                        <option key={index} value={p.patient_id}>{p.first_name + ' ' + p.last_name}</option>
                      ))
                    }
                  </select>
                </div>

                <div className='jmt-inputGroup'>
                  <label className='fw-bold' htmlFor="patient_user_id">Select Game</label>
                  <select
                    id="game"
                    className="input"
                    name="game_id"
                    value={formData.game_id}
                    onChange={handleChange}
                  >
                    <option value="" disabled>Game</option>
                    {
                      games && games.map((p, index) => (
                        <option key={index} value={p.id}>{p.name.toUpperCase()}</option>
                      ))
                    }
                  </select>
                </div>

                <div style={{ gap: 20 }} className='w-100 d-flex align-items-center justify-content-between'>
                    <div className='jmt-inputGroup'>
                      <label className='fw-bold' htmlFor="start_angle">Start Angle</label>
                      <input
                          type="number"
                          id="start_angle"
                          className="input"
                          name="start_angle"
                          autoComplete="off"
                          value={formData.start_angle}
                          required
                          placeholder='eg: 60'
                          onChange={handleChange}
                      />
                    </div>

                    <div className='jmt-inputGroup'>
                      <label className='fw-bold' htmlFor="email">Desired Angle</label>
                      <input
                          type="number"
                          id="desired_angle"
                          className="input"
                          name="desired_angle"
                          autoComplete="off"
                          value={formData.desired_angle}
                          required
                          placeholder='eg: Doe'
                          onChange={handleChange}
                      />
                    </div>
                </div>

                <div style={{ gap: 20 }} className='w-100 d-flex align-items-center justify-content-between'>
                    <div className='jmt-inputGroup'>
                      <label className='fw-bold' htmlFor="rra">Required Times</label>
                      <input
                          type="number"
                          id="rra"
                          className="input"
                          name="rra"
                          autoComplete="off"
                          value={formData.rra}
                          required
                          placeholder='eg: 6'
                          onChange={handleChange}
                      />
                    </div>

                    <div className='jmt-inputGroup'>
                      <label className='fw-bold' htmlFor="email">Target Score</label>
                      <input
                          type="number"
                          id="target_score"
                          className="input"
                          name="target_score"
                          autoComplete="off"
                          value={formData.target_score}
                          required
                          placeholder='eg: 5000'
                          onChange={handleChange}
                      />
                    </div>
                </div>
                <div className='jmt-inputGroup'>
                  <label className='fw-bold' htmlFor="start_angle">Date</label>
                  <input
                      type="date"
                      id="scheduled_at"
                      className="input"
                      name="scheduled_at"
                      autoComplete="off"
                      value={formData.scheduled_at}
                      required
                      placeholder='eg: 60'
                      onChange={handleChange}
                  />
                </div>

                <Button text="Submit" onClick={() => handleEditSubmit(formData.id)} type="submit" />

            </div>
        </Modal>

        <Modal toggle={deleteModal} setToggle={setDeleteModal}>
          <div className='d-flex align-items-center flex-column justify-content-center'>  
            <br />
            <h4>Are You Sure You Want To Delete This Session?</h4>
            <div style={{gap: 15}} className='d-flex justify-content-between align-items-center mt-4'>
                <Button text="No" onClick={() => setDeleteModal(false)} />
                {console.log(formData.id, 'testt')}
                <Button text="Yes" background="#8B0000"  onClick={() => handleDeleteSubmit(formData.id)} />
            </div>
          </div>
        </Modal>

        {
          role === 'doctor' && (
            <AddIcon onClick={() => {
              setAddModal(true)
              setFormData({
                patient_user_id: '',
                game_id: '',
                start_angle: '',
                desired_angle: '',
                target_score: '',
                rra: '',
                scheduled_at: '',
                doctor_user_id: userId
              })
            }
            } />
          )
        }


        {
          showSuccessPopup && (
            <div className="success_popup">Success! Your data has been submitted.</div>
          )
        }
    </div>
  )
}

export default Sessions