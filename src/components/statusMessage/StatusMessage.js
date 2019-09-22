import React, {Component} from 'react';

import './StatusMessage.css';

import crossImage from '../../images/cross.svg'

class StatusMessage extends Component {

  render() {
    return (
      <div className={'status-message ' + (this.props.positive ? 'positive': 'negative')}>
        {this.props.text}
        <img className='dismiss-icon' alt='dismiss' src={crossImage} onClick={this.props.handleDismiss} />
      </div>
    );
  }
}

export default StatusMessage;
