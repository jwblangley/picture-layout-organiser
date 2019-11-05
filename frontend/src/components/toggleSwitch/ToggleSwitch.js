import React, {useState} from 'react';

import './ToggleSwitch.css';

const ToggleSwitch = ({text, initial, disabled, onChange}) => {

  const [checked, setChecked] = useState(initial)

  function handleChange(e) {
    if (!disabled) {
      setChecked(e.target.checked)
      onChange(e.target.checked);
    }
  }

  // Use label to pass click to inner input tag
  return (
    <label>
      {text}
      <input
        className="checkbox"
        type="checkbox"
        checked={checked}
        onChange={handleChange}
      />
      <span className="slider-container">
        <span className="slider"></span>
      </span>
    </label>
  )
}

export default ToggleSwitch
