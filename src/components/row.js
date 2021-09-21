import React from 'react';
import PropTypes from 'prop-types';

import Square from './square';

export default class Row extends React.Component {
  renderSquares = () => {
    const { rowNumber, squareCount, onMouseOver } = this.props;

    return [...new Array(squareCount)].map((_, index) => {
      return (<Square
        rowNumber={rowNumber}
        squareNumber={index + 1}
        key={index}
        onMouseOver={onMouseOver}
      />)
    })
  }
  render() {
    return <div className="row">
      {this.renderSquares()}
    </div>
  }

  static propTypes = {
    squareCount: PropTypes.number.isRequired,
    rowNumber: PropTypes.number.isRequired,
    onMouseOver: PropTypes.func.isRequired,
  };
}
