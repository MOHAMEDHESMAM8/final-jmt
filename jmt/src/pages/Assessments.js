import React, {useState, useEffect} from 'react'
import FaGamepad from '@meronex/icons/fa/FaGamepad';
import FaCalendarAlt from '@meronex/icons/fa/FaCalendarAlt';
import axiosInstance from '../axiosInstance';
import { jwtDecode } from 'jwt-decode'

const Assessments = () => {
  const [assessments, setAssessments] = useState([])
  
  useEffect(() => {
    let { userId } = jwtDecode(JSON.stringify(localStorage.getItem('token')));
    const fetchAssessments = async () => {
        try {
            const response = await axiosInstance.get(`http://localhost:3000/assessments/${userId}`);
            // Convert scheduled_at format for each assessment
            const formattedassessments = response.data.map(assessment => {
            const scheduledAtDate = new Date(assessment.creation_date);
            const monthNames = ["January", "February", "March", "April", "May", "June",
                                "July", "August", "September", "October", "November", "December"];
            const month = monthNames[scheduledAtDate.getUTCMonth()];
            const day = scheduledAtDate.getUTCDate();
            const year = scheduledAtDate.getUTCFullYear();
            return {
            ...assessment,
            creation_date: `${month} ${day}, ${year}`
            };
        });
      
  
            setAssessments(formattedassessments);
        } catch (error) {
            console.error('Error fetching Assessments:', error)
        }
    };
    fetchAssessments();
}, [])
  return (
    <div style={{marginTop: 40}} className='jmt-assesments col-lg-11 col-md-8 col-sm-11'>
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
  )
}

export default Assessments