import {useEffect, useState} from 'react';
import { DataGrid } from '@mui/x-data-grid';
import axiosInstance from '../axiosInstance';
import { useNavigate } from 'react-router-dom';
import Button from './Button';

export default function DataTable() {
  const [patients, setPatients] = useState([]);
  const navigate = useNavigate();

  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'first_name', headerName: 'First name', width: 130 },
    { field: 'last_name', headerName: 'Last name', width: 130 },
    {
      field: 'age',
      headerName: 'Age',
      type: 'number',
      width: 90,
    },
    {
      field: 'fullName',
      headerName: 'Full name',
      description: 'This column has a value getter and is not sortable.',
      sortable: false,
      width: 160,
      valueGetter: (params) =>
        `${params.row.first_name || ''} ${params.row.last_name || ''}`,
    },
    {
      field: 'viewProfile',
      headerName: 'View Profile',
      sortable: false,
      width: 150,
      renderCell: (params) => {
        const handleViewProfile = () => {
          // Redirect to the patient's profile page
          navigate(`/admin/patients/${params.row.id}`);
        };
  
        return (
          <Button padding="10px" text="View Profile" onClick={handleViewProfile} />
        );
      },
    },
  ];
  
  useEffect(() => {

    const fetchPatients = async () => {
      try {
        const response = await axiosInstance.get(`http://localhost:3000/patients`);
        // Map over the fetched data and use 'patient_id' as the 'id' property
        const patientsWithId = response.data.map(patient => ({
          ...patient,
          id: patient.patient_id,
        }));
        setPatients(patientsWithId);
        console.log(patientsWithId, 'patients');
      } catch (error) {
        console.error('Error fetching patients:', error);
      }
    };
    

    fetchPatients();
  }, [])
  return (
    <div className='jmt-data-table' style={{ height: '70vh', width: '100%' }}>
      <DataGrid
        rows={patients}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        pageSizeOptions={[5, 10]}
        checkboxSelection
      />
    </div>
  );
}