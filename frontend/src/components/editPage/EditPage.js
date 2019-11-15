import React, {useState} from 'react'

import './EditPage.css'

import Carousel from '../carousel/Carousel.js'

import crossImage from '../../images/cross.svg'
import binImage from '../../images/bin.svg'

const EditPage = ({media, mediaType, caption, saveCaption, closePage, setGalleryItemAsGalleryHead, deleteImage}) => {

  const [text, setText] = useState(caption)

  function generateMediaPreview(media, mediaType) {
    if (mediaType === 'video') {
      return (
        <video className="video-preview" controls>
          <source src={media} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )
    } else if (mediaType === 'gallery') {
      return (
        <Carousel
          stringIfEmpty="Empty Gallery"
          slides={media.map((galleryItem, index) => {
            var mediaPreview = generateMediaPreview(galleryItem.media, galleryItem.mediaType)
            return generateGalleryItemWrapper(mediaPreview, index)
            }
          )}
        />
      )
    } else if (mediaType === 'image') {
      // Standard image
      var backgroundImageStyle = {
        'backgroundImage': 'url(' + media + ')'
      }
      return (
        <div
          style={backgroundImageStyle}
          className='image-preview'
        ></div>
      )
    }
    throw new Error("Unknown media type")
  }

  function generateGalleryItemWrapper(itemPreview, itemIndex) {
    return (
      <div className='gallery-item-wrapper'>
        {
          itemIndex === 0 &&
          (
            <a id='gallery-preview-head' />
          )
        }
        {itemPreview}
        {
          itemIndex > 0 &&
          (
            <button
              onClick={() => setGalleryItemAsGalleryHead(itemIndex)}
            >
              Make first
            </button>
          )
        }
      </div>
    )
  }

  return (
    <div className='edit-page'>
      <img
        src={crossImage}
        alt='close'
        className='exit-icon'
        onClick={() => closePage()}
      />
      {generateMediaPreview(media, mediaType)}
      <img
        src={binImage}
        alt='delete item'
        className='media-delete-icon'
        onClick={deleteImage}
      />
      <textarea
        className={"caption-input-area"}
        placeholder={"Enter a caption"}
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button
        id='save-caption-button'
        onClick={() => saveCaption(text)}
      >
        Save
      </button>
    </div>
  )
}

export default EditPage
