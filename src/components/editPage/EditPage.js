import React, {Component} from 'react';

import './EditPage.css';

import crossImage from '../../images/cross.svg'
import binImage from '../../images/bin.svg'

class EditPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      'text': props.text
    }
  }

  render() {
    var backgroundImageStyle = {
      'backgroundImage': 'url(' + this.props.media + ')'
    }


    return (
      <div className='edit-page'>
        <img
          src={crossImage}
          className='exit-icon'
          onClick={() => this.props.closePage()}
        />
        <div
          style={backgroundImageStyle}
          className='media-preview'
        >
        </div>
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
