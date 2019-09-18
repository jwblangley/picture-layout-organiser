import React, {Component} from 'react';
import './ImageSquare.css';

import ringCircle from '../../images/ring-circle.svg';
import padlock from '../../images/padlock.svg';
import pencil from '../../images/pencil.svg';
import captioned from '../../images/captioned.svg';
import videoIcon from '../../images/video.svg';
import galleryIcon from '../../images/gallery.svg';

class ImageSquare extends Component {

  generateBackgroundImageStyle(media, mediaType, thumbnail) {
    // Decide backround image for ImageSquare
    if (mediaType === 'video'){
      return {
        'backgroundImage': 'url(' + thumbnail + ')'
      }
    } else if (mediaType === 'gallery') {
      var galleryHead = media[0];
      return this.generateBackgroundImageStyle(galleryHead.media, galleryHead.mediaType, galleryHead.thumbnail);
    } else {
      // Standard image
      return {
        'backgroundImage': 'url(' + media + ')'
      }
    }
  }

  render() {

    var backgroundImageStyle = this.generateBackgroundImageStyle(this.props.media, this.props.mediaType, this.props.thumbnail);

    var classString = 'image-square' + (this.props.selected ? ' selected' : '');

    return (
      <div
        className={classString}
        style={backgroundImageStyle}
        onClick={this.props.handleClick}
        >
        {
          this.props.selected &&
          (
            <a id='current-selected-item' />
          )
        }
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
