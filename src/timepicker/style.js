import gradients from './gradients.js';
import _find from 'lodash.find';

const DEFAULT_PRIMARY_COLOR = '#F26B83';

export function getColorStyles({themeSelector, theme, color1, headerColor = color1}) {
  let backgroundColor = '';
  let primaryColor = '';
  if (theme) {
    let selectedGradient = _find(gradients, function getTheme(o) {
      return o.name === theme;
    });

    if (selectedGradient) {
      const colors = selectedGradient.colors;
      primaryColor = color1 ? color1 : colors[0];
      backgroundColor = `
      background: ${colors[0]};
      background: -webkit-linear-gradient(to left,${colors[0]}  , ${colors[1]});
      background: linear-gradient(to left, ${colors[0]} ,${colors[1]});`;
    } else {
      backgroundColor = `background-color: ${DEFAULT_PRIMARY_COLOR};`;
      primaryColor = DEFAULT_PRIMARY_COLOR;
    }
  } else {
    primaryColor = color1 || DEFAULT_PRIMARY_COLOR;
    backgroundColor = `background-color: ${headerColor || primaryColor};`;
  }

  return  `
    .react-timepicker-background-color-${themeSelector} {
      ${backgroundColor};
     }
    .react-timepicker-primary-color-background-${themeSelector} {
      background: ${primaryColor} !important;
    }
    .react-timepicker-primary-color-color-${themeSelector} {
      color: ${primaryColor} !important;
    }
    `;
}
const transformLeftRightMiddle = 'translateX(-50%) translateY(-50%);';
export const style = `
.timepicker-backdrop {
  position: fixed;
  width: 100%;
  height: 100%;
  max-width: 100%;
  max-height: 100%;
  top: 0;
  left: 0;
  padding: 0;
  margin: 0;
  z-index: 100000;
  background: rgba(0, 0, 0, 0.49);
}

.timepicker-modal {
  font-family: "Helvetica";
  width: 50%;
  max-width: 400px;
  min-width: 300px;
  background: #fff;
  position: fixed;
  top: 50%;
  z-index: 100001;
  left: 50%;
  -webkit-transform: translateX(-50%) translateY(-50%);
  transform: translateX(-50%) translateY(-50%);
  box-shadow: rgba(0, 0, 0, 0.25) 0px 14px 45px, rgba(0, 0, 0, 0.22) 0px 10px 18px;
  border-radius: 6px;
  overflow: hidden;
}

.timepicker-modal .timepicker-header {
  height: 120px;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  color: #fff;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.timepicker-modal .am-pm-input {
  width: 0.1px;
  height: 0.1px;
  opacity: 0;
  overflow: hidden;
  position: absolute;
  z-index: -1;
}

.text-shadow {
  text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.13);
}

.timepicker-modal .am-pm-label {
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
  margin-left: 12px;
  cursor: pointer;
  text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.13);
}

.timepicker-modal .timepicker-time-container {
  font-size: 42px;
  color: inherit;
  letter-spacing: 2px;
  cursor: pointer;
  font-weight: bold;
}

.timepicker-modal .timepicker-time-container .is-not-selected {
  color: rgba(255, 255, 255, 0.7);
}

.timepicker-modal .am-pm-input:checked + .am-pm-label {
  color: inherit;
  display: block;
}

.timepicker-modal .timepicker-main {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  padding: 20px;
  box-sizing: border-box;
}

.timepicker-modal .hours-container {
  width: 260px;
  height: 260px;
  position: relative;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  background: #efefef;
  border-radius: 50%;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.timepicker-modal .hand {
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  width: 45%;
  position: absolute;
  left: 50%;
  bottom: 50%;
  -webkit-transform-origin: center left 0px;
  transform-origin: center left 0px;
  pointer-events: none;
  -webkit-transform: rotateZ(0deg);
  transform: rotateZ(0deg);
  height: 2px;
}

.timepicker-modal .hand:after {
  position: absolute;
  content: "";
  top: -5px;
  border-radius: 50%;
  right: 0;
  width: 12px;
  height: 12px;
  background: inherit;
}

.timepicker-modal .circle {
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  font-size: 16px;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  cursor: pointer;
  width: 25px;
  height: 25px;
  position: absolute;
  border-radius: 50%;
  top: 50%;
  left: 50%;
}

.timepicker-modal .circle.selected {
  color: #fff;
}

.timepicker-modal .circle:nth-of-type(1) {
  -webkit-transform: translate3d(0px, -110px, 0) ${transformLeftRightMiddle};
  transform: translate3d(0px, -110px, 0) ${transformLeftRightMiddle};
}

.timepicker-modal .circle:nth-of-type(2) {
  transform: translate3d(55px, -95px, 0) ${transformLeftRightMiddle};
  -webkit-transform: translate3d(55px, -95px, 0) ${transformLeftRightMiddle};
}

.timepicker-modal .circle:nth-of-type(3) {
  -webkit-transform: translate3d(95px, -55px, 0) ${transformLeftRightMiddle};
  transform: translate3d(95px, -55px, 0) ${transformLeftRightMiddle};
}

.timepicker-modal .circle:nth-of-type(4) {
  transform: translate3d(110px, 0px, 0) ${transformLeftRightMiddle};
  -webkit-transform: translate3d(110px, 0px, 0) ${transformLeftRightMiddle};
}

.timepicker-modal .circle:nth-of-type(5) {
  transform: translate3d(95px, 55px, 0) ${transformLeftRightMiddle};
  -webkit-transform: translate3d(95px, 55px, 0) ${transformLeftRightMiddle};
}

.timepicker-modal .circle:nth-of-type(6) {
  transform: translate3d(55px, 95px, 0) ${transformLeftRightMiddle};
  -webkit-transform: translate3d(55px, 95px, 0) ${transformLeftRightMiddle};
}

.timepicker-modal .circle:nth-of-type(7) {
  transform: translate3d(0px, 110px, 0) ${transformLeftRightMiddle};
  -webkit-transform: translate3d(0px, 110px, 0) ${transformLeftRightMiddle};
}

.timepicker-modal .circle:nth-of-type(8) {
  transform: translate3d(-55px, 95px, 0) ${transformLeftRightMiddle};
  -webkit-transform: translate3d(-55px, 95px, 0) ${transformLeftRightMiddle};
}

.timepicker-modal .circle:nth-of-type(9) {
  transform: translate3d(-95px, 55px, 0) ${transformLeftRightMiddle};
  -webkit-transform: translate3d(-95px, 55px, 0) ${transformLeftRightMiddle};
}

.timepicker-modal .circle:nth-of-type(10) {
  transform: translate3d(-110px, 0px, 0) ${transformLeftRightMiddle};
  -webkit-transform: translate3d(-110px, 0px, 0) ${transformLeftRightMiddle};
}

.timepicker-modal .circle:nth-of-type(11) {
  transform: translate3d(-95px, -55px, 0) ${transformLeftRightMiddle};
  -webkit-transform: translate3d(-95px, -55px, 0) ${transformLeftRightMiddle};
}

.timepicker-modal .circle:nth-of-type(12) {
  transform: translate3d(-55px, -95px, 0) ${transformLeftRightMiddle};
  -webkit-transform: translate3d(-55px, -95px, 0) ${transformLeftRightMiddle};
}

.timepicker-modal .mask {
  width: 100%;
  height: 100%;
}

.timepicker-modal footer {
  text-align: right;
  padding: 20px;
}

.timepicker-modal .timepicker-button {
  border: 0;
  background: white;
  text-transform: uppercase;
  cursor: pointer;
  font-size: 14px;
  margin-left: 12px;
  font-weight: bold;
  color: #ffffff;
  padding: 10px 21px;
  border-radius: 21px;
}

.timepicker-modal .timepicker-button.close {
  background: white;
}`;
export default style;
