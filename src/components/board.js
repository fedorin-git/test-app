import React from 'react';
import Row from './row';
import Select from 'react-select';

const URL = 'https://demo1030918.mockable.io/';
const SQUARE_HOVER_COLOR = 'rgb(47, 112, 209)';

const formatModes = options => Object.keys(options).map(key => ({
  label: key,
  value: options[key].field,
}));

const formatHoveredSquares = ids => ids.reduce((result, current) => {
  const position = current.split(',').map(Number);
  if (result[position[0]]) {
    result[position[0]].push(position[1]);
    result[position[0]].sort((a, b) => a - b);
  } else {
    result[position[0]] = [position[1]]
  }
  return result;
}, {});

export default class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modes: null,
      selectedMode: null,
      isStarted: false,
      hoveredSquares: [],
    };

    this.handleChangeMode = this.handleChangeMode.bind(this);
  }
  
  componentDidMount() {
    fetch(URL)
      .then(response => response.json()).then(res => this.setState({ modes: res }))
      .catch(error => console.log('Error:', error));
  }

  handleClickStart = value => this.setState({ isStarted: !value });

  handleClickStop = () => {
    this.setState({ hoveredSquares: [], isStarted: false });
    if (this.state.hoveredSquares.length > 0) {
      this.state.hoveredSquares.forEach(itemId => document.getElementById(itemId).removeAttribute('style'));
    }
  }

  handleChangeMode = target => this.setState({ selectedMode: target.value, hoveredSquares: [] });

  handleMouseOver = event => {
    const { isStarted, hoveredSquares } = this.state;
    const { style, id } = event.target;
    if (isStarted) {
      if (style.background === SQUARE_HOVER_COLOR) {
        style.background = 'none';
        const index = hoveredSquares.indexOf(id);
        if (index !== -1) {
          hoveredSquares.splice(index, 1);
        }
        this.setState({ hoveredSquares })
      } else {
        event.target.style.background = SQUARE_HOVER_COLOR;
        hoveredSquares.push(id);
        this.setState({ hoveredSquares });
        formatHoveredSquares(this.state.hoveredSquares);
      }
    }
  }

  renderRows = () => {
    const { selectedMode } = this.state;

    return <div className="board">
      {[...new Array(selectedMode)].map((_, index) => (<Row
        rowNumber={index + 1}
        squareCount={selectedMode}
        key={index}
        onMouseOver={this.handleMouseOver}
      />))}
    </div>
  }

  render() {
    const { isStarted, hoveredSquares, selectedMode } = this.state;
    const formattedHoveredSquares = formatHoveredSquares(hoveredSquares);

    if (!this.state.modes) return null;

    return <div className="app">
      <div className="actions">
        <Select
          className="mode-select"
          placeholder="Pick mode"
          options={formatModes(this.state.modes)}
          onChange={this.handleChangeMode}
        />
        {isStarted
          ? <button
            onClick={() => this.handleClickStop()}
            className="stop-button"
          >
            STOP
          </button>
          : <button
            onClick={() => this.handleClickStart()}
            className="start-button"
            disabled={!this.state.selectedMode}
          >
            START
          </button>
        }
      </div>
      <div className="field">
        {selectedMode && this.renderRows()}
        {isStarted && <div className="legend">
          <h1>Hover squares</h1>
          <div className="hovered-list">
            {Object.keys(formattedHoveredSquares).map(key => {
              return (<div className="hover-info-item" key={key}>
                <span>{`row ${key} col ${formattedHoveredSquares[key].join(', ')}`}</span>
              </div>)
            })}
          </div>
        </div>}
      </div>
    </div>;
  }
}
