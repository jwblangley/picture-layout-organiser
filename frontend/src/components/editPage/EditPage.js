import React, {useState} from 'react'

import { useSnackbar } from 'notistack'

import useStyles from './style'

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

  const classes = useStyles()

  const { enqueueSnackbar } = useSnackbar()

  const [text, setText] = useState(caption)

  function generateMediaPreview(media, mediaType) {
    if (mediaType === 'video') {
      return (
        <video key={media} className={classes.videoPreview} controls>
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
        'backgroundImage': 'url("' + media + '")'
      }
      return (
        <div
          key={media}
          style={backgroundImageStyle}
          className={classes.imagePreview}
        ></div>
      )
    }
    throw new Error("Unknown media type")
  }

  function generateGalleryItemWrapper(itemPreview, itemIndex) {
    return (
      <div className={classes.galleryItemWrapper}>
        {itemPreview}
        {
          itemIndex > 0 &&
          (
            <Button
              className={classes.makeFirstButton}
              variant='contained'
              color='primary'
              onClick={() => setGalleryItemAsGalleryHead(itemIndex)}
            >
              Make first
            </Button>
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
      <div className={classes.editPage}>
        <DeleteIcon
          className={classes.mediaDeleteIcon}
          onClick={deleteImage}
        />
        <CloseIcon
          className={classes.exitIcon}
          onClick={closePage}
        />
        <Grid container spacing={3}>
          <Grid item xs={12}>
            {generateMediaPreview(media, mediaType)}
          </Grid>
          <Grid item xs={12}>
            <TextField
              multiline
              variant='outlined'
              placeholder='Caption'
              className={classes.captionInputArea}
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              variant='contained'
              color='primary'
              onClick={() => {
                saveCaption(text)
                enqueueSnackbar('Saving caption', {variant: 'info'})
              }}
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
