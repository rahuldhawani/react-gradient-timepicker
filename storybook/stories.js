/* eslint no-alert:0 */
import React, {PropTypes, Component} from 'react';
import { storiesOf } from '@kadira/storybook';
import TimePicker from '../src/timepicker';

import githubLogo from '../assets/github.svg';

const inputStyle = {
  padding  : 12,
  fontSize : 14
};

class Code extends Component {
  static propTypes = {
    children : PropTypes.node.isRequired,
    heading  : PropTypes.string.isRequired
  };

  render() {
    return (
      <div>
        <h2>{this.props.heading}</h2>
        <h3>PropTypes</h3>
        <code style={{
          display      : 'block',
          whiteSpace   : 'pre-wrap',
          background   : '#eaeaea',
          borderRadius : 4,
          marginBottom : 20
        }}
        >
          {this.props.children}
        </code>
      </div>
    );
  }
}

storiesOf('Gradient Timepicker', module)
.add('Default', () => (
  <div>
    <Code
      heading="Default"
    >
      {`
    <TimePicker
      time="01:00"
      placeholder="Start Time"
      onSet={(val) => {
        alert('time is ' + JSON.stringify(val));
      }}
    />
    `}
    </Code>
    <TimePicker
      time="01:00"
      style={inputStyle}
      placeholder="Start Time"
      onSet={(val) => {
        alert('time is ' + JSON.stringify(val));
      }}
    />
  </div>
))
.add('Theme as Tranquil', () => (
  <div>
    <Code
      heading="Tranquil Theme"
    >
      {`
    <TimePicker
      time="01:00"
      theme="Tranquil"
      placeholder="Start Time"
      onSet={(val) => {
        alert('time is ' + JSON.stringify(val));
      }}
    />
    `}
    </Code>
    <TimePicker
      time="01:00"
      style={inputStyle}
      theme="Tranquil"
      placeholder="Start Time"
      onSet={(val) => {
        alert('time is ' + JSON.stringify(val));
      }}
    />
  </div>
))
.add('With theme as Tranquil, but button and hand color as #EF629F', () => (
  <div>
    <Code
      heading="Theme as Tranquil, but button and hand color as #EF629F"
    >
      {`
    <TimePicker
      time="12:00"
      theme="Tranquil"
      color1="#EF629F"
      placeholder="Start Time"
      onSet={(val) => {
        alert('time is ' + JSON.stringify(val));
      }}
    />
    `}
    </Code>
    <TimePicker
      time="12:00"
      theme="Tranquil"
      style={inputStyle}
      color1="#EF629F"
      placeholder="Start Time"
      onSet={(val) => {
        alert('time is ' + JSON.stringify(val));
      }}
    />

  </div>
))
.add('Header, hand and button color as #00bcd4', () => (
  <div>
    <Code
      heading="Header, hand and button color as #00bcd4"
    >
      {`
    <TimePicker
      time="12:00"
      color1="#00bcd4"
      placeholder="Start Time"
      onSet={(val) => {
        alert('time is ' + JSON.stringify(val));
      }}
    />
    `}
    </Code>
    <TimePicker
      time="12:00"
      style={inputStyle}
      color1="#00bcd4"
      placeholder="Start Time"
      onSet={(val) => {
        alert('time is ' + JSON.stringify(val));
      }}
    />

  </div>
))
.add('Header color different from other colors', () => (
  <div>
    <Code
      heading="Header color different from other colors"
    >
      {`
    <TimePicker
      time="01:00"
      color1="#9E9E9E"
      headerColor="#8bc34a"
      placeholder="Start Time"
      onSet={(val) => {
        alert('time is ' + JSON.stringify(val));
      }}
    />
    `}
    </Code>

    <TimePicker
      time="01:00"
      color1="#9E9E9E"
      style={inputStyle}
      headerColor="#8bc34a"
      placeholder="Start Time"
      onSet={(val) => {
        alert('time is ' + JSON.stringify(val));
      }}
    />
  </div>
));
