import React from 'react';
import PropTypes from 'prop-types';

export default class Square extends React.Component {
  render() {
    const { rowNumber, squareNumber, onMouseOver } = this.props;

    return (
      <div id={`${rowNumber},${squareNumber}`} className="square" onMouseOver={event => onMouseOver(event)} />
    );
  }

  static propTypes = {
    rowNumber: PropTypes.number.isRequired,
    squareNumber: PropTypes.number.isRequired,
    onMouseOver: PropTypes.func.isRequired,
  };
}
