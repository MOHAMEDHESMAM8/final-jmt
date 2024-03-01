import React from 'react'

const Button = ({text, type, onClick, color, background, padding}) => {
  return (
    <button className='jmt-button' style={{color: color, backgroundColor: background, padding: padding}} onClick={onClick && onClick} type={type ? type : ''}>{text}</button>
  )
}

export default Button