import React from 'react'

import useStyles from './style'

import {
  Typography
} from '@material-ui/core/index'

const Recipe = ({slides, stringIfEmpty}) => {

  const classes = useStyles()

  return (
    <div className={classes.carousel}>
      {
        slides.length > 0 ?
          slides
          .map((slide, i) => <Slide content={slide} key={i} />)
        :
          <Typography className={classes.warningMessage}>
            {stringIfEmpty}
          </Typography>
      }
    </div>
  )
}

export function Slide(props){
  const classes = useStyles()

  return(
    <div className={classes.carouselSlide}>
      {props.content}
    </div>
  )
}

export default Recipe
