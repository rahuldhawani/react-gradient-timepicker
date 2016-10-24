import React, {PropTypes, Component} from 'react';
import {getColorStyles, style as commonStyles} from './style';
import { appendZero, getFormat12, format12to24, format24to12, isMousePressed } from './utils';

export default class TimePicker extends Component {
  static propTypes = {
    time        : PropTypes.string,
    theme       : PropTypes.string,
    color1      : PropTypes.string,
    headerColor : PropTypes.string,
    placeholder : PropTypes.string.isRequired,
    className   : PropTypes.string,
    onSet       : PropTypes.func.isRequired,
    style       : PropTypes.object
  };

/*  static defaultProps = {
    keyName : 'react-theme-style'
  };*/

  constructor(props) {
    super(props);
    let format12 = '';
    if (this.props.time) {
      let time = this.props.time.split(':');
      format12 = format24to12(Number(time[0]), Number(time[1]));
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
    this.addStyles();
  }


  componentWillReceiveProps(nextProps) {
    let format12 = '';
    let format24 = '';

    if (nextProps.time) {
      let temp = nextProps.time.split(':');
      format12 = format24to12(Number(temp[0]), Number(temp[1]));
      format24 = nextProps.time;
    }

    this.setState({
      time : {
        format12,
        format24
      }
    });
  }

  addStyles() {
    const commonSelector = 'react-timepicker-common-style';
    const themeSelector = this.getThemeSelector();
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

  // utils
  removeEventListener() {
    window.removeEventListener('keydown', this.handleKeyPress);
  }

  addEventListener() {
    window.addEventListener('keydown', this.handleKeyPress);
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
        this.setHour(((this.state.degree + 30) % 360) || 360)
        :
        this.setMinute(((this.state.degree + 6) % 360) || 360);
    }
      break;

    case 40 : { // down
      this.state.toShowHourContainer ?
        this.setHour(((this.state.degree - 30) % 360) || 360)
        :
        this.setMinute(((this.state.degree - 6) % 360) || 360);
    }
      break;
    }
  };

  handleMove = (event) => {
    event.preventDefault();
    if (isMousePressed(event)) return;
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
    this.state.toShowHourContainer ? this.setHour(this.getDegree(x, y)) : this.setMinute(this.getDegree(x, y));
  };

  toggleHourOrMinuteContainer(toShowHourContainer) {
    let { degree, selectedIndexDegree } = toShowHourContainer ? this.getSelectedIndexDegreeAndDegreeForHour(Number(this.state.hour)) : this.getSelectedIndexDegreeAndDegreeForMinute(Number(this.state.minute));
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
    // hour = appendZero(Math.round(degree / 30) || '12'); //not sure why i added this
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
    let allFormat = this.getTime(Number(this.state.hour), Number(this.state.minute), this.state.isAmSelected);
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

  getThemeSelector() {
    const {
      theme,
      color1
      } = this.props;
    let _color1 = color1;
    if (color1 && color1.indexOf('#') === 0) {
      _color1 = color1.substr(1);
    }

    if (theme) {
      if (color1) {
        return theme.split(' ').join('-') + _color1;
      }
      return theme.split(' ').join('-');
    }

    if (_color1) {
      return _color1;
    }

    return 'react-time-picker-theme';
  }

  getHour(val) {
    return appendZero((val % 12) || '12');
  }

  getMinute(val) {
    return appendZero((val % 60) || '0');
  }

  getInitialConfig(time) {
    let date = new Date();
    time = time ? time : date.getHours() + ':' + date.getMinutes();
    const temp = time.split(':');
    const hour24 = Number(temp[0]);
    const minute24 = Number(temp[1]);
    const {degree, selectedIndexDegree} = this.getSelectedIndexDegreeAndDegreeForHour(hour24);

    return {
      hour         : this.getHour(hour24),
      minute       : this.getMinute(minute24),
      degree,
      selectedIndexDegree,
      isAmSelected : Number(temp[0]) <= 12
    };
  }

  getSelectedIndexDegreeAndDegreeForHour(val) {
    const degree = (val * 30) % 360;
    return {
      selectedIndexDegree : this.getSelectedIndexDegree(degree),
      degree
    };
  }

  getSelectedIndexDegreeAndDegreeForMinute(val) {
    /* const degree = val * 6 || 360; // why?
    const i = (degree / 6) % 5;
    return {
      selectedIndexDegree : i ? -1 : this.getSelectedIndexDegree(degree),
      degree
    };
    */
    const degree = (val * 6) % 360; // why?
    // const i = (degree / 6) % 5;
    return {
      selectedIndexDegree : this.getSelectedIndexDegree(degree),
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

  getTime(hour, minute, isAmSelected) {
    const format12 = getFormat12(hour, minute, isAmSelected);
    const format24 = format12to24(hour, minute, isAmSelected);
    return {
      format12,
      format24
    };
  }

  setMinute(degree) {
    /* let toRound = degree % 6;
    toRound < 3 ? degree -= toRound : degree += (6 - toRound); */
    const base = Math.round(degree / 6);
    degree = base * 6;
    const minute = this.getMinute(base);
    const selectedIndexDegree = this.getSelectedIndexDegree(degree);
    const toReturn = {
      degree,
      minute,
      selectedIndexDegree
    };
    this.setState(toReturn);
    return toReturn;
  }

  setHour(degree) {
    /* let toRound = degree % 30;
    toRound < 15 ? degree -= toRound : degree += (30 - toRound);*/
    const base = Math.round(degree / 30);
    degree = base * 30;
    const hour = this.getHour(base);
    const selectedIndexDegree = this.getSelectedIndexDegree(degree);
    const toReturn = {
      degree,
      hour,
      selectedIndexDegree
    };
    this.setState(toReturn);
    return toReturn;
  }


  getBody() {
    if (!this.state.toShow) return false;
    const themeSelector = this.getThemeSelector();
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
          style={this.props.style}
        />
        {this.getBody()}
      </div>
    );
  }
}
