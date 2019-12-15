import React, {useState} from 'react'

import './EditPage.css'

import Carousel from '../carousel/Carousel.js'

import {
  Button,
  TextField,
  Dialog,
  Grid
} from '@material-ui/core/index'

import {
  Delete as DeleteIcon,
  Close as CloseIcon
} from '@material-ui/icons'

const EditPage = ({media, mediaType, caption, saveCaption, closePage, setGalleryItemAsGalleryHead, deleteImage, opened}) => {

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
    <Dialog
      open={true /* whole component unmounted on close */}
      onClose={closePage}
    >
      <div className='edit-page'>
        <DeleteIcon
        className='media-delete-icon'
        onClick={deleteImage}
        />
        <CloseIcon
        className='exit-icon'
        onClick={closePage}
        />
        <Grid container xs={12} spacing={3}>
          <Grid item xs={12}>
            {generateMediaPreview(media, mediaType)}
          </Grid>
          <Grid item xs={12}>
            <TextField
              multiline
              variant="outlined"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              variant='contained'
              color='primary'
              onClick={() => saveCaption(text)}
            >
              Save
            </Button>
          </Grid>
        </Grid>
      </div>
    </Dialog>
  )
}

export default EditPage
