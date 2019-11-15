import React, {useState} from 'react'

import './ToggleSwitch.css'

const ToggleSwitch = ({text, value, disabled, onChange}) => {


  function handleChange(e) {
    if (!disabled) {
      onChange(e.target.checked)
    }
  }

  // Use label to pass click to inner input tag
  return (
    <label>
      {text}
      <input
        className="checkbox"
        type="checkbox"
        checked={value}
        onChange={handleChange}
      />
      <span className="slider-container">
        <span className="slider"></span>
      </span>
    </label>
  )
}

export default ToggleSwitch
