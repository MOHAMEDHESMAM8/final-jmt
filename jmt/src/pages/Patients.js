import React from 'react'
import DataTable from '../components/DataTable'

function Patients() {
  return (
    <div className='jmt-patients d-flex align-items-center justify-content-center flex-column col-lg-11 col-md-8 col-sm-11'>
        <h2>Patients</h2>
        <DataTable />
    </div>
  )
}

export default Patients