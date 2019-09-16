import React, {Component} from 'react';
import './ImageSquare.css';

import ringCircle from '../../images/ring-circle.svg';
import padlock from '../../images/padlock.svg';
import pencil from '../../images/pencil.svg';
import captioned from '../../images/captioned.svg';

class ImageSquare extends Component {


  render() {
    var backgroundImageStyle = {
      'backgroundImage': 'url(' + this.props.media + ')'
    }

    var classString = 'image-square' + (this.props.selected ? ' selected' : '');

    return (
      <div
        className={classString}
        style={backgroundImageStyle}
        onClick={this.props.handleClick}
        >
        <img
          src={this.props.locked ? padlock : ringCircle}
          className='lock-ring clickable icon'
          onClick={this.props.toggleLock}
        />
        {this.props.locked ? null :
          (<img
            src={pencil}
            className='edit-icon clickable icon'
            onClick={this.props.handleEditClick}
          />)
        }
        {this.props.captioned && !this.props.locked &&
          (<img
            src={captioned}
            className='captioned-icon icon'
          />)
        }
      </div>
    );
  }
}

export default ImageSquare;
