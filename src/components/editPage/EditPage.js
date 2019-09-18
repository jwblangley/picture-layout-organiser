import React, {Component} from 'react';

import './EditPage.css';

import Carousel from '../carousel/Carousel.js';

import crossImage from '../../images/cross.svg'
import binImage from '../../images/bin.svg'

class EditPage extends Component {

  // TODO: Implement ability to set gallery head

  constructor(props) {
    super(props);
    this.state = {
      'text': props.text
    }
  }

  generateMediaPreview(media, mediaType) {
    if (mediaType === 'video') {
      return (
        <video className="video-preview" controls>
          <source src={media} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      );
    } else if (mediaType === 'gallery') {
      return (
        <Carousel
          stringIfEmpty="Empty Gallery"
          slides={media.map((galleryItem, index) => {
            var mediaPreview = this.generateMediaPreview(galleryItem.media, galleryItem.mediaType)
            return this.generateGalleryItemWrapper(mediaPreview, index);
            }
          )}

        />
      );
    } else {
      // Standard image
      var backgroundImageStyle = {
        'backgroundImage': 'url(' + media + ')'
      }
      return (
        <div
          style={backgroundImageStyle}
          className='image-preview'
        ></div>
      );
    }
  }

  generateGalleryItemWrapper(itemPreview, itemIndex) {
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
              onClick={() => this.props.setGalleryItemAsGalleryHead(itemIndex)}
            >
              Make first
            </button>
          )
        }
      </div>
    );
  }

  render() {

    return (
      <div className='edit-page'>
        <img
          src={crossImage}
          className='exit-icon'
          onClick={() => this.props.closePage()}
        />
        {this.generateMediaPreview(this.props.media, this.props.mediaType)}
        <img
          src={binImage}
          className='media-delete-icon'
          onClick={this.props.deleteImage}
        />
        <textarea
          className={"caption-input-area"}
          placeholder={"Enter a caption"}
          value={this.state.text}
          onChange={(e) => this.setState({'text': e.target.value})}
        />
        <button
          id='save-caption-button'
          onClick={() => this.props.saveCaption(this.state.text)}
        >
          Save
        </button>
      </div>
    );
  }
}

export default EditPage;
