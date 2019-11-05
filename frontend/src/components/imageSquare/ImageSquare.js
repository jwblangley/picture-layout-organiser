import React from 'react'
import './ImageSquare.css'

import ringCircle from '../../images/ring-circle.svg'
import padlock from '../../images/padlock.svg'
import pencil from '../../images/pencil.svg'
import captionedIcon from '../../images/captioned.svg'
import videoIcon from '../../images/video.svg'
import galleryIcon from '../../images/gallery.svg'

const ImageSquare = ({media, mediaType, thumbnail, selected, locked, captioned, toggleLock, handleClick, handleEditClick}) => {

  function generateBackgroundImageStyle(media, mediaType, thumbnail) {
    // Decide backround image for ImageSquare
    if (mediaType === 'video'){
      return {
        'backgroundImage': 'url(' + thumbnail + ')'
      }
    } else if (mediaType === 'gallery') {
      var galleryHead = media[0]
      return generateBackgroundImageStyle(galleryHead.media, galleryHead.mediaType, galleryHead.thumbnail)
    } else if (mediaType === 'image') {
      // Standard image
      return {
        'backgroundImage': 'url(' + media + ')'
      }
    }
    throw new Error("Unknown media type")
  }


  var backgroundImageStyle = generateBackgroundImageStyle(media, mediaType, thumbnail)
  var classString = 'image-square' + (selected ? ' selected' : '')

  return (
    <div
      className={classString}
      style={backgroundImageStyle}
      onClick={handleClick}
    >
      {
        selected &&
        (
          <a id='current-selected-item' />
        )
      }
      <img
        src={locked ? padlock : ringCircle}
        alt={locked ? 'locked': 'unlocked'}
        className='lock-ring clickable icon'
        onClick={toggleLock}
      />
      {locked ? null :
        (<img
          src={pencil}
          alt='edit'
          className='edit-icon clickable icon'
          onClick={handleEditClick}
        />)
      }
      {captioned && !locked &&
        (<img
          src={captionedIcon}
          alt='captioned'
          className='captioned-icon icon'
        />)
      }
      {mediaType !== 'image' && !locked &&
        (<img
          src={mediaType === 'video' ? videoIcon: galleryIcon}
          alt={mediaType}
          className='media-type-icon icon'
        />)
      }
    </div>
  )
}

export default ImageSquare
