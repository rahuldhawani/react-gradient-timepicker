export function appendZero(val) {
  return val < 10 ? '0' + val : String(val);
}

export function isMousePressed(event) {
  if (typeof event.buttons === 'undefined') {
    return event.nativeEvent.which !== 1;
  }

  return event.buttons !== 1;
}

export function format12to24(hour, minute, isAmSelected) {
  if (isAmSelected && hour === 12) {
    hour -= 12;
    return appendZero(hour) + ':' + appendZero(minute);
  }

  if (!isAmSelected && hour !== 12) {
    hour += 12;
    return appendZero(hour) + ':' + appendZero(minute);
  }

  return appendZero(hour) + ':' + appendZero(minute);
}

export function format24to12(hour, minute) {
  if (hour === 0) {
    hour += 12;
    return appendZero(hour) + ':' + appendZero(minute) + ' AM';
  }

  if (hour === 12) {
    return appendZero(hour) + ':' + appendZero(minute) + ' PM';
  }

  if (hour > 0 && hour < 12) {
    return appendZero(hour) + ':' + appendZero(minute) + ' AM';
  }

  hour -= 12;
  return appendZero(hour) + ':' + appendZero(minute) + ' PM';
}

export function getFormat12(hour, minute, isAmSelected) {
  return appendZero(hour) + ':' + appendZero(minute) + ' ' + (isAmSelected ? 'AM' : 'PM');
}
