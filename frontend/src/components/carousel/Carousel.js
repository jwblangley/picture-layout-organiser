import React from 'react'

import './Carousel.css'

const Recipe = ({slides, stringIfEmpty}) => {

  return (
    <div className='carousel'>
      {
        slides.length > 0 ?
          slides
          .map((slide, i) => <Slide content={slide} key={i} />)
        :
          <div className='warning-message'>
            <h2>{stringIfEmpty}</h2>
          </div>
      }
    </div>
  )
}

export function Slide(props){
  return(
    <div className='carousel-slide'>
      {props.content}
    </div>
  )
}

export default Recipe
