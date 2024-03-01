import React from 'react'

function AddIcon({onClick}) {
  return (
    <div onClick={onClick && onClick} className='jmt-addIcon d-flex align-items-center justify-content-center'>
        +
    </div>
  )
}

export default AddIcon