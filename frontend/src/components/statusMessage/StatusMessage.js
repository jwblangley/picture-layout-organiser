import React from 'react';

import './StatusMessage.css';

import crossImage from '../../images/cross.svg'

const StatusMessage = ({text, positive, handleDismiss}) => {

  return (
    <div className={'status-message ' + (positive ? 'positive': 'negative')}>
      {text}
      <img className='dismiss-icon' alt='dismiss' src={crossImage} onClick={handleDismiss} />
    </div>
  )
}

export default StatusMessage;
