import React from 'react'

import useStyles from './style'

import ringCircle from '../../images/ring-circle.svg'
import padlock from '../../images/padlock.svg'
import pencil from '../../images/pencil.svg'
import captionedIcon from '../../images/captioned.svg'
import videoIcon from '../../images/video.svg'
import galleryIcon from '../../images/gallery.svg'

const ImageSquare = ({media, mediaType, thumbnail, selected, locked, captioned, toggleLock, handleClick, handleEditClick}) => {

  const classes = useStyles()

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

  return (
    <div
      className={classes.imageSquare}
      style={{...backgroundImageStyle, opacity: selected ? 0.35 : 1}}
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
        className={`${classes.lockRing} ${classes.clickable} ${classes.icon}`}
        onClick={toggleLock}
      />
      {locked ? <div /> :
        (<img
          src={pencil}
          alt='edit'
          className={`${classes.editIcon} ${classes.clickable} ${classes.icon}`}
          onClick={handleEditClick}
        />)
      }
      {captioned && !locked &&
        (<img
          src={captionedIcon}
          alt='captioned'
          className={`${classes.captionedIcon} ${classes.icon}`}
        />)
      }
      {mediaType !== 'image' && !locked &&
        (<img
          src={mediaType === 'video' ? videoIcon: galleryIcon}
          alt={mediaType}
          className={`${classes.mediaTypeIcon} ${classes.icon}`}
        />)
      }
    </div>
  )
}

export default ImageSquare
