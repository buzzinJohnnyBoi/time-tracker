import React, { Component } from 'react';

export class ColorPicker extends Component {
  state = {
    selectedColor: '#000000'
  };

  handleColorChange = (event) => {
    this.props.changeColor(this.props.timer, event.target.value);
  };

  render() {
    const selectedColor = this.props.color;

    return (
      <div>
        <input
          type="color"
          value={selectedColor}
          onChange={this.handleColorChange}
          className='colorInput'
          style={{height: this.props.height}}
        />
      </div>
    );
  }
}

export default ColorPicker;
