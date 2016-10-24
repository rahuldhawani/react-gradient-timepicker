/* eslint no-alert:0 */
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import TimePicker from './src/timepicker';
class Example extends Component {
  static propTypes = {};

  constructor(props) {
    super(props);
    this.state = {
      val : '12:00'
    };
  }

  handleSet = (val) => {
    this.setState({
      val
    }, () => {
      if (this.state.val) {
        let time = document.getElementById('time');
        time.classList.remove('fade-in');
        setInterval(() => {
          time.textContent = this.state.val.format12;
          time.classList.add('fade-in');
        }, 5);
      }
    });
  };

  render() {
    return (
      <div>
        <TimePicker
          className="hero__action hero__action--example"
          time={this.state.val.format24}
          theme="Bourbon"
          keyName="Bourbon"
          placeholder="Try it"
          onSet={this.handleSet}
        />
      </div>
    );
  }
}

ReactDOM.render(
  <Example />
  , document.getElementById('example'));
