import React, {Component} from 'react';

import './Grid.css';

class Grid extends Component {

  render() {
    var rows=[];
    for(var i = 0; i < this.props.gridContent.length; i += this.props.cols) {
      rows.push(
        <div className='grid-row' key={i}>
          {this.props.gridContent.slice(i, i + this.props.cols).map((item, index) =>
            <div className='grid-item' key={index}>{item}</div>
          )}
        </div>
      );
    }

    return (
      <div className='grid'>
        {rows}
      </div>
    );
  }
}

export default Grid;
