import React, {Component} from 'react';

import './ToggleSwitch.css';

class ToggleSwitch extends Component {

  constructor(props) {
  super(props);
    this.state = {
      'checked': props.initial
    };
  }

  handleChange(e) {
    if (!this.props.disabled) {
      this.setState({'checked': e.target.checked});
      this.props.onChange(e.target.checked);
    }
  }

  render() {
    // Use label to pass click to inner input tag
    return (
      <label>
        {this.props.text}
        <input
          className="checkbox"
          type="checkbox"
          checked={this.state.checked}
          onChange={this.handleChange.bind(this)}
        />
        <span className="slider-container">
          <span className="slider"></span>
        </span>
      </label>
    );
  }
}

export default ToggleSwitch;
