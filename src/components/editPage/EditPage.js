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
      'backgroundImage': 'url(' + this.props.image + ')'
    }


    return (
      <div className='edit-page'>
        <img
          src={crossImage}
          className='exit-icon'
          onClick={() => this.props.saveAndClose(this.state.text)}
        />
        <div
          style={backgroundImageStyle}
          className='image-preview'
        >
        </div>
        <img
          src={binImage}
          className='image-delete-icon'
          onClick={this.props.deleteImage}
        />
        <textarea
          className={"caption-input-area"}
          placeholder={"Enter a caption"}
          value={this.state.text}
          onChange={(e) => this.setState({'text': e.target.value})}
        />
      </div>
    );
  }
}

export default EditPage;
