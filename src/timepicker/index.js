import React, {PropTypes, Component} from 'react';
import {getColorStyles, style as commonStyles} from './style';

export default class TimePicker extends Component {
  static propTypes = {
    time        : PropTypes.string,
    theme       : PropTypes.string,
    color1      : PropTypes.string,
    headerColor : PropTypes.string,
    placeholder : PropTypes.string,
    className   : PropTypes.string,
    onSet       : PropTypes.func,
    keyName     : PropTypes.string
  };

  static defaultProps = {
    keyName : 'react-theme-style'
  };

  constructor(props) {
    super(props);
    let format12 = '';
    if (this.props.time) {
      let time = this.props.time.split(':');
      format12 = this.format24to12(Number(time[0]), Number(time[1]));
    }
    this.state = {
      toShow : false,
      time   : {
        format12 : format12,
        format24 : ''
      }
    };
  }

  componentWillMount() {
    const commonSelector = 'react-timepicker-common-style';
    const themeSelector = this.props.keyName;
    const {theme, color1, headerColor} = this.props;
    let head = document.head || document.getElementsByTagName('head')[0];

    if (!document.getElementById(commonSelector)) {
      let style = document.createElement('style');
      style.type = 'text/css';
      style.id = commonSelector;

      if (style.styleSheet) {
        style.styleSheet.cssText = commonStyles;
      } else {
        style.appendChild(document.createTextNode(commonStyles));
      }

      head.appendChild(style);
    }

    if (!document.getElementById(themeSelector)) {
      let themeStyles = getColorStyles({
        themeSelector,
        theme,
        color1,
        headerColor
      });

      let style = document.createElement('style');
      style.type = 'text/css';
      style.id = themeSelector;

      if (style.styleSheet) {
        style.styleSheet.cssText = themeStyles;
      } else {
        style.appendChild(document.createTextNode(themeStyles));
      }
      head.appendChild(style);
    }
  }


  componentWillReceiveProps(nextProps) {
    let format12 = '';
    let format24 = '';

    if (nextProps.time) {
      let temp = nextProps.time.split(':');
      format12 = this.format24to12(Number(temp[0]), Number(temp[1]));
      format24 = nextProps.time;
    }

    this.setState({
      time : {
        format12,
        format24
      }
    });
  }

  // utils
  removeEventListener() {
    window.removeEventListener('keydown', this.handleKeyPress);
  }

  addEventListener() {
    window.addEventListener('keydown', this.handleKeyPress);
  }

  appendZero(val) {
    return val < 10 ? '0' + val : val;
  }

  isMousePressed(event) {
    if (typeof event.buttons === 'undefined') {
      return event.nativeEvent.which !== 1;
    }

    return event.buttons !== 1;
  }

  format12to24 = (hour, minute, isAmSelected) => {
    if (isAmSelected && hour === 12) {
      hour -= 12;
      return this.appendZero(hour) + ':' + this.appendZero(minute);
    }

    if (!isAmSelected && hour !== 12) {
      hour += 12;
      return this.appendZero(hour) + ':' + this.appendZero(minute);
    }

    return this.appendZero(hour) + ':' + this.appendZero(minute);
  };

  format24to12 = (hour, minute) => {
    if (hour === 0) {
      hour += 12;
      return this.appendZero(hour) + ':' + this.appendZero(minute) + 'AM';
    }

    if (hour === 12) {
      hour += 12;
      return this.appendZero(hour) + ':' + this.appendZero(minute) + 'PM';
    }

    if (hour > 0 && hour < 12) {
      return this.appendZero(hour) + ':' + this.appendZero(minute) + 'AM';
    }

    hour -= 12;
    return this.appendZero(hour) + ':' + this.appendZero(minute) + 'PM';
  };

  getFormat12(hour, minute, isAmSelected) {
    return hour + ':' + minute + (isAmSelected ? 'AM' : 'PM');
  }

  // handlers

  handleKeyPress = (e) => {
    switch (e.which) {
    case 13 : {
      if (e.target !== this.closeButton) {
        this.handleSet();
      }
    }
      break;

    case 27 : {
      this.toggleToShow(false);
    }
      break;

    case 38 : { // up
      this.state.toShowHourContainer ?
        this.setHour(null, null, ((this.state.degree + 30) % 360) || 360)
        :
        this.setMinute(null, null, ((this.state.degree + 6) % 360) || 360);
    }
      break;

    case 40 : { // down
      this.state.toShowHourContainer ?
        this.setHour(null, null, ((this.state.degree - 30) % 360) || 360)
        :
        this.setMinute(null, null, ((this.state.degree - 6) % 360) || 360);
    }
      break;
    }
  };

  handleMove = (event) => {
    event.preventDefault();
    let isMouseMoved = this.isMousePressed(event);
    if (isMouseMoved) return;
    this.changeClock(event.nativeEvent.clientX, event.nativeEvent.clientY);
  };


  handleTouchMove = (event) => {
    event.preventDefault();
    this.changeClock(event.changedTouches[0].clientX, event.changedTouches[0].clientY);
  };
  handleTouchUp = (event) => {
    if (event.target === this.mask) return;
    this.changeClock(event.changedTouches[0].clientX, event.changedTouches[0].clientY);
  };

  handleMoveUp = (event) => {
    if (event.target === this.mask) return;
    this.changeClock(event.nativeEvent.clientX, event.nativeEvent.clientY);
  };

  changeClock = (clientX, clientY) => {
    const x = clientX - this.containerPos.x;
    const y = clientY - this.containerPos.y;
    this.state.toShowHourContainer ? this.setHour(x, y) : this.setMinute(x, y);
  };

  toggleHourOrMinuteContainer(toShowHourContainer) {
    let {degree, selectedIndexDegree} = toShowHourContainer ? this.getselectedIndexDegreeAndDegreeforHour(Number(this.state.hour)) : this.getselectedIndexDegreeAndDegreeforMinute(Number(this.state.minute));
    this.setState({
      toShowHourContainer,
      degree,
      selectedIndexDegree
    });
  }

  toggleAmPm(isAmSelected) {
    this.setState({
      isAmSelected
    });
  }

  handleFocus = (e)=> {
    e.preventDefault();
    let format24 = this.props.time;
    let {hour, minute, degree, selectedIndexDegree, isAmSelected} = this.getInitialConfig(format24);
    // hour = this.appendZero(Math.round(degree / 30) || '12'); //not sure why i added this
    this.toggleToShow();
    this.setState({
      degree,
      hour,
      minute,
      toShowHourContainer : true,
      selectedIndexDegree,
      isAmSelected
    }, () => {
      this.init();
    });
  };

  toggleToShow(toShow = true) {
    this.setState({
      toShow
    });

    toShow ? this.addEventListener() : this.removeEventListener();
  }

  handleSet = () => {
    let allFormat = this.getDate();
    this.setState({
      time : allFormat
    });

    this.toggleToShow(false);
    this.inputField.blur();
    this.props.onSet(allFormat);
  };

  // functionality
  init() {
    this.center = {
      x : 130,
      y : 130
    };

    const maskPosition = this.mask.getBoundingClientRect();
    this.containerPos = {
      y : maskPosition.top,
      x : maskPosition.left
    };
    this.basePoint = {
      x : 130,
      y : 0
    };
  }

  getInitialConfig(time) {
    let date = new Date();
    time = time ? time : date.getHours() + ':' + date.getMinutes();
    const temp = time.split(':');
    const {degree, selectedIndexDegree} = this.getselectedIndexDegreeAndDegreeforHour(Number(temp[0]));

    return {
      hour         : this.appendZero(Number(temp[0])),
      minute       : this.appendZero(Number(temp[1])),
      degree,
      selectedIndexDegree,
      isAmSelected : Number(temp[0]) <= 12
    };
  }

  getselectedIndexDegreeAndDegreeforHour(val) {
    const degree = val * 30;
    return {
      selectedIndexDegree : this.getSelectedIndexDegree(degree),
      degree
    };
  }

  getselectedIndexDegreeAndDegreeforMinute(val) {
    const degree = val * 6 || 360;
    const i = (degree / 6) % 5;
    return {
      selectedIndexDegree : i ? -1 : this.getSelectedIndexDegree(degree),
      degree
    };
  }

  getSelectedIndexDegree(degree) {
    return (degree / 30) % 12;
  }


  getDegree(offsetX, offsetY) {
    const x = offsetX - this.center.x;
    const y = offsetY - this.center.y;
    const cx = this.basePoint.x - this.center.x;
    const cy = this.basePoint.y - this.center.y;
    const atan = Math.atan2(cx, cy) - Math.atan2(x, y);
    return (atan * 57.29577951308232) % 360;
  }

  getClock = (className) => {
    const hours = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
    const minutes = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];
    const hoursOrMinutes = this.state.toShowHourContainer ? hours : minutes;
    return hoursOrMinutes.map((i, j) => {
      return (
        <span
          key={i}
          className={`circle ${this.state.selectedIndexDegree === j ? `selected ${className}` : ''}`}
        >
          {i}
        </span>
      );
    });
  };

  getDate() {
    const format12 = this.getFormat12(this.state.hour, this.state.minute, this.state.isAmSelected);
    const format24 = this.format12to24(Number(this.state.hour), Number(this.state.minute), this.state.isAmSelected);
    return {
      format12,
      format24
    };
  }

  setMinute(offsetX, offsetY, degree = this.getDegree(offsetX, offsetY)) {
    let toRound = degree % 6;
    toRound < 3 ? degree -= toRound : degree += (6 - toRound);
    const minute = this.appendZero((Math.round(degree / 6)) % 60) || '00';
    const selectedIndexDegree = this.getSelectedIndexDegree(degree);
    this.setState({
      degree,
      minute,
      selectedIndexDegree
    });
  }

  setHour(offsetX, offsetY, degree = this.getDegree(offsetX, offsetY)) {
    let toRound = degree % 30;
    toRound < 15 ? degree -= toRound : degree += (30 - toRound);
    const hour = this.appendZero(Math.round(degree / 30) || '12');
    const selectedIndexDegree = this.getSelectedIndexDegree(degree);
    this.setState({
      degree,
      hour,
      selectedIndexDegree
    });
  }

  getBody() {
    if (!this.state.toShow) return false;
    const themeSelector = this.props.keyName;
    const primaryColorColorClassName = `react-timepicker-primary-color-color-${themeSelector}`;
    const primaryColorBackgroundClassName = `react-timepicker-primary-color-background-${themeSelector}`;
    const backgroundColorClassName = `react-timepicker-background-color-${themeSelector}`;
    return (
      <div>
        <div
          className="timepicker-backdrop"
          onClick={this.toggleToShow.bind(this, false)}
        />

        <div className="timepicker-modal">
          <header className={`timepicker-header ${backgroundColorClassName}`}>
            <div className="timepicker-time-container">
              <span
                className={`text-shadow ${!this.state.toShowHourContainer ? 'is-not-selected' : ''}`}
                onClick={this.toggleHourOrMinuteContainer.bind(this, true)}
              >
                {this.state.hour}
              </span>
              <span className="text-shadow">:</span>
              <span
                className={`text-shadow ${this.state.toShowHourContainer ? 'is-not-selected' : ''}`}
                onClick={this.toggleHourOrMinuteContainer.bind(this, false)}
              >
                {this.state.minute}
              </span>
            </div>
            <div className="timepicker-am-pm-container">
              <input
                className="am-pm-input"
                type="radio"
                id="am"
                name="am-pm"
                value="am"
                onChange={this.toggleAmPm.bind(this, true)}
                defaultChecked={this.state.isAmSelected}
              />
              <label className="am-pm-label" htmlFor="am">AM</label>
              <input
                className="am-pm-input"
                type="radio"
                id="pm"
                name="am-pm"
                value="pm"
                onChange={this.toggleAmPm.bind(this, false)}
                defaultChecked={!this.state.isAmSelected}
              />
              <label className="am-pm-label" htmlFor="pm">PM</label>
            </div>
          </header>

          <main className="timepicker-main">
            <div
              className="hours-container"
              ref={(ref) => {this.mask = ref;}}
              onTouchMove={this.handleTouchMove}
              onTouchEnd={this.handleTouchUp}
              onMouseMove={this.handleMove}
              onMouseUp={this.handleMoveUp}
            >
              <div
                className={`${primaryColorBackgroundClassName} hand`}
                style={{
                  transform       : `rotate(${this.state.degree - 90}deg)`,
                  WebkitTransform : `rotate(${this.state.degree - 90}deg)`
                }}
              >
                &nbsp;
              </div>
              {this.getClock(primaryColorBackgroundClassName)}
            </div>
          </main>
          <footer>
            <button
              type="button"
              className={`${primaryColorColorClassName} timepicker-button close`}
              onClick={this.toggleToShow.bind(this, false)}
              ref={(ref) => {this.closeButton = ref;}}
            >
              Close
            </button>
            <button
              type="button"
              className={`${primaryColorBackgroundClassName} timepicker-button`}
              onClick={this.handleSet}
            >
              Set
            </button>
          </footer>
        </div>
      </div>
    );
  }

  render() {
    return (
      <div className="timepicker-container">
        <input
          readOnly
          type="text"
          placeholder={this.props.placeholder}
          className={this.props.className}
          value={this.state.time.format12}
          onFocus={this.handleFocus}
          ref={(ref) => {this.inputField = ref;}}
        />
        {this.getBody()}
      </div>
    );
  }
}
