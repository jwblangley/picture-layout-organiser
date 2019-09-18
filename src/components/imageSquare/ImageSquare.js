import React, {Component} from 'react';
import './ImageSquare.css';

import ringCircle from '../../images/ring-circle.svg';
import padlock from '../../images/padlock.svg';
import pencil from '../../images/pencil.svg';
import captioned from '../../images/captioned.svg';
import videoIcon from '../../images/video.svg';
import galleryIcon from '../../images/gallery.svg';

class ImageSquare extends Component {

  render() {

    // Decide backround image for ImageSquare
    var backgroundImageStyle;
    if (this.props.mediaType === 'video'){
      backgroundImageStyle = {
        'backgroundImage': 'url(' + this.props.thumbnail + ')'
      }
    } else if (this.props.mediaType === 'gallery') {
      var galleryHead = this.props.media[0];
      if (galleryHead.mediaType === 'image' ) {
        backgroundImageStyle = {
          'backgroundImage': 'url(' + galleryHead.media + ')'
        }
      } else if (galleryHead.mediaType === 'video') {
        backgroundImageStyle = {
          'backgroundImage': 'url(' + galleryHead.thumbnail + ')'
        }
      }
    } else {
      // Standard image
      backgroundImageStyle = {
        'backgroundImage': 'url(' + this.props.media + ')'
      }
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
        {this.props.mediaType !== 'image' && !this.props.locked &&
          (<img
            src={this.props.mediaType === 'video' ? videoIcon: galleryIcon}
            className='media-type-icon icon'
          />)
        }
      </div>
    );
  }
}

export default ImageSquare;
