import React, { useEffect, useState } from 'react'
import axiosInstance from '../axiosInstance';
import AddIcon from '../components/AddIcon'
import { useParams } from 'react-router-dom';
import FaGamepad from '@meronex/icons/fa/FaGamepad';
import FaCalendarAlt from '@meronex/icons/fa/FaCalendarAlt';
import MdInsertDriveFile from '@meronex/icons/md/MdInsertDriveFile';
import Modal from '../components/Modal';
import socket from '../socket'
import Button from '../components/Button';
import { jwtDecode } from 'jwt-decode'

const Patient = () => {
    const { id } = useParams();
    const [patient, setPatient] = useState({})
    const [sessions, setSessions] = useState([])
    const [assessments, setAssessments] = useState([])
    const [addModal, setAddModal] = useState(false);
    const [angle, setAngle] = useState(0);
    const [userId, setUserId] = useState('');
    const [maxAngle, setMaxAngle] = useState(0);
    const [minAngle, setMinAngle] = useState(180);
    const [submitted, setSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        patient_user_id: id,
        notes: '',
        joint: ''
    })
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
      };

    const handleSubmit = (e) => {
        axiosInstance.post('http://localhost:3000/assessments', {
            ...formData,
            maximum_angle: maxAngle,
            minimum_angle: minAngle,
            doctor_user_id: userId

        }).then((res) => {
          setTimeout(() => {
            setShowSuccessPopup(true);
            setTimeout(() => {
              setShowSuccessPopup(false);
            }, 3000); // Hide popup after 3 seconds
          }, 300);
          setAddModal(false)
          setFormData({})
          setSubmitted(!submitted)
        })
      }

    const normalize = (v,vmin,vmax,tmin, tmax) => {
        var nv = Math.max(Math.min(v,vmax), vmin);
        var dv = vmax-vmin;
        var pc = (nv-vmin)/dv;
        var dt = tmax-tmin;
        var tv = tmin + (pc*dt);
        return tv;
    }
    useEffect(() => {
        let { userId } = jwtDecode(JSON.stringify(localStorage.getItem('token')));
        setUserId(userId)
        const fetchPatient = async () => {
            try {
                const response = await axiosInstance.get(`http://localhost:3000/patients/${id}`);
                setPatient(response.data);
                console.log(response.data, 'patients')
            } catch (error) {
                console.error('Error fetching patient:', error)
            }
        };

        const fetchSessions = async () => {
            try {
                const response = await axiosInstance.get(`http://localhost:3000/patients/sessions/${id}`);
                // Convert scheduled_at format for each session
                const formattedSessions = response.data.map(session => {
                const scheduledAtDate = new Date(session.scheduled_at);
                const monthNames = ["January", "February", "March", "April", "May", "June",
                                    "July", "August", "September", "October", "November", "December"];
                const month = monthNames[scheduledAtDate.getUTCMonth()];
                const day = scheduledAtDate.getUTCDate() + 1;
                const year = scheduledAtDate.getUTCFullYear();
                return {
                ...session,
                scheduled_at: `${month} ${day}, ${year}`
                };
            });
          
      
                setSessions(formattedSessions);
            } catch (error) {
                console.error('Error fetching sessions:', error)
            }
        };

        const fetchAssessments = async () => {
            try {
                const response = await axiosInstance.get(`http://localhost:3000/assessments/${id}`);
                // Convert scheduled_at format for each session
                const formattedSessions = response.data.map(session => {
                const scheduledAtDate = new Date(session.creation_date);
                const monthNames = ["January", "February", "March", "April", "May", "June",
                                    "July", "August", "September", "October", "November", "December"];
                const month = monthNames[scheduledAtDate.getUTCMonth()];
                const day = scheduledAtDate.getUTCDate();
                const year = scheduledAtDate.getUTCFullYear();
                return {
                ...session,
                creation_date: `${month} ${day}, ${year}`
                };
            });
          
      
                setAssessments(formattedSessions);
            } catch (error) {
                console.error('Error fetching Assessments:', error)
            }
        };

        fetchPatient();
        fetchSessions();
        fetchAssessments();
    }, [id, submitted])

    useEffect(() => {
        if (angle > maxAngle) {
            setMaxAngle(angle);
        }
    }, [angle, maxAngle]);

    useEffect(() => {
        if (angle < minAngle && angle !== 0) {
            setMinAngle(angle);
        }
    }, [angle, minAngle]);
    return (
        <div className='jmt-patient d-flex flex-column col-lg-11 col-md-8 col-sm-11'>
            <div className='d-flex align-items-center justify-content-between'>
                <h3>{patient.first_name + ' ' + patient.last_name}</h3>
                <h6><span className='me-2'><MdInsertDriveFile /></span>History</h6>
            </div>

            <div style={{marginTop: 40}} className='age'>
                <h4>Age</h4>
                <span style={{marginTop: 15}}>{patient.age} Years Old</span>
            </div>

            {
                patient.latest_score && (
                    <div style={{marginTop: 40}} className='lscore'>
                        <h4>Latest Score</h4>
                        <span style={{marginTop: 15}}>{patient.latest_score}</span>
                    </div>
                )
            }

            <div style={{marginTop: 40}} className='usessions'>
                <h4>Upcoming Sessions</h4>
                <div style={{marginTop: 15, gap: 40}} className='d-flex align-items-center'>
                    {
                        sessions && sessions.map((session, index) => (
                            <div key={index} className='d-flex flex-column justify-content-between align-items-center session-card'>
                                <h6><span className='me-3'><FaGamepad /></span><span>{session.game_name}</span></h6>
                                <h6><span className='me-3'><FaCalendarAlt /></span><span>{session.scheduled_at}</span></h6>
                            </div>
                        ))
                    }
                </div>
            </div>     

            <div style={{marginTop: 40}} className='latestAssesments'>
                <h4>Latest Assesments</h4>
                <div style={{marginTop: 15, gap: 40}} className='d-flex align-items-center'>
                    {
                        assessments && assessments.map((assessment, index) => (
                            <div key={index} className='d-flex flex-column justify-content-between align-items-center session-card'>
                                <h6><span className='me-3'><FaGamepad /></span>Max Angle: <span>{assessment.maximum_angle}</span></h6>
                                <h6><span className='me-3'><FaGamepad /></span>Min Angle: <span>{assessment.minimum_angle}</span></h6>
                                <h6><span className='me-3'><FaCalendarAlt /></span><span>{assessment.creation_date}</span></h6>
                            </div>
                        ))
                    }
                </div>
            </div>       
            
            <Modal toggle={addModal} setToggle={setAddModal}>
                <div className='d-flex flex-column align-items-center'>
                    <h1>{angle}°</h1>
                    <h5>Maximum Angle Reached: <span style={{color: 'green'}}>{maxAngle}°</span></h5>
                    <h5>Minimum Angle Reached: <span style={{color: 'green'}}>{minAngle}°</span></h5>
                    <form className='w-100 d-flex flex-column align-items-center'>
                    <div style={{marginTop: 15}} className='jmt-inputGroup'>
                        <select
                            id="joint"
                            className="input"
                            name="joint"
                            required
                            value={formData.joint}
                            onChange={handleChange}
                        >
                            <option value="" disabled>Joint</option>
                            <option value="knee" >Knee</option>
                            <option value="elbow" >Elbow</option>
                            <option value="arm" >Arm</option>
                        </select>
                    </div>

                    <div className='jmt-inputGroup'>
                      <textarea
                          style={{height: 'auto'}}
                          id="notes"
                          className="input"
                          name="notes"
                          autoComplete="off"
                          rows={10}
                          value={formData.notes}
                          onChange={handleChange}
                          required
                          placeholder='Notes ..'
                      />
                    </div>

                    <Button text="Submit" onClick={handleSubmit} type="submit" />
                    </form>
                </div>
            </Modal>
            <AddIcon onClick={() => {
                setAddModal(true);
                socket.addEventListener('status', function(event) {
                    console.log('Message received from server:', event);
                    setAngle(Math.floor(normalize(-event.gyroy, -10, 11.5, 0, 180+15)))
                  })
            }
            } />     

        {
          showSuccessPopup && (
            <div className="success_popup">Success! Your data has been submitted.</div>
          )
        }

        </div>
    )
}

export default Patient