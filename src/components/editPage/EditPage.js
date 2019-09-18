import React, {Component} from 'react';

import './EditPage.css';

import Carousel from '../carousel/Carousel.js';

import crossImage from '../../images/cross.svg'
import binImage from '../../images/bin.svg'

class EditPage extends Component {

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
          slides={media.map(galleryItem => this.generateMediaPreview(galleryItem.media, galleryItem.mediaType))}
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
