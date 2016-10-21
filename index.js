/* eslint no-alert:0 */
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import TimePicker from './src/timepicker';
class Example extends Component {
  static propTypes = {};
  constructor(props) {
   super(props);
    this.state = {
      val1: '12:00',
      val2: {
        format24: '12:00'
      }
    };
  }

  setS = (val) => {
    this.setState({
      val1:val.format24,

    });

  };

  setS2 = (val) => {
    this.setState({
      val2:val,
    }, () => {
      if(this.state.val2) {
        let time  = document.getElementById('time');
        time.classList.remove('fade-in');
        setInterval(() =>{
          time.textContent = this.state.val2.format12;
          time.classList.add('fade-in');
        }, 5);

      }
    });



  };

  render() {
    return (
      <div>
        <TimePicker
          className="example-hero"
          time={this.state.val2.format24}
          theme="Pinky"
          keyName="pinky"
          placeholder="Start Time"
          onSet={this.setS2}
        />
        <TimePicker
          className="example-hero"
          time={this.state.val2.format24}
          keyName="instagram"
          theme="Instagram"
          placeholder="Start Time"
          onSet={this.setS2}
        />

</div>
    );
  }
}

ReactDOM.render(
  <Example />
  , document.getElementById('example'));
