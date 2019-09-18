import React, {Component} from 'react';

import './Carousel.css';

class Recipe extends Component {

  render() {
    return (
      <div className='carousel'>
        {
          this.props.slides.length > 0 ?
            this.props.slides
            .map((slide, i) => <Slide content={slide} key={i} />)
          :
            <div className='warning-message'>
              <h2>{this.props.stringIfEmpty}</h2>
            </div>
        }
      </div>
    );
  }
}

export function Slide(props){
  return(
    <div className='carousel-slide'>
    {props.content}
    </div>
  );
}

export default Recipe;
