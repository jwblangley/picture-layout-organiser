import React from 'react'

import './GridBlock.css'

const Grid = ({gridContent, cols}) => {

  var rows=[]
  for (var i = 0; i < gridContent.length; i += cols) {
    rows.push(
      <div className='grid-row' key={i}>
        {gridContent.slice(i, i + cols).map((item, index) =>
          <div className='grid-item' key={index}>{item}</div>
        )}
      </div>
    )
  }

  return (
    <div className='grid' style={{margin: 'auto'}}>
      {rows}
    </div>
  )
}

export default Grid
