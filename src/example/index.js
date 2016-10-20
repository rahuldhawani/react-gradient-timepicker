/* eslint no-alert:0 */
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import TimePicker from '../../build';
class Example extends Component {
  static propTypes = {};

  render() {
    return (
      <div>
        <TimePicker
          className="input-field"
          theme="Ash"
          placeholder="Start Time"
          onSet={ (val) => {
            alert('val:' + val.format24);
          } }
        />

        <TimePicker
          time="01:00"
          className="input-field"
          theme="Instagram"

          placeholder="Start Time"
          onSet={ (val) => {
            alert('val:' + val.format12);
          } }
        />
      </div>
    );
  }
}

ReactDOM.render(
  <Example />
  , document.getElementById('example'));
