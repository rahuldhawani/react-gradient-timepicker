/* eslint func-names: 0 */
import { expect } from 'chai';

import { appendZero, getFormat12, format12to24, format24to12 } from '../timepicker/utils';

describe('#appendZero', function() {
  it('should append 0 for digits in range from 0 to 9', function() {
    expect(appendZero(0)).to.equal('00');
    expect(appendZero(9)).to.equal('09');
    expect(appendZero(11)).to.equal('11');
  });
});

describe('#getFormat12', function() { // this doesn't convent 24hour format to 12hour format
  it('should return string in 12hour format', function() {
    expect(getFormat12(1, 33, true)).to.equal('01:33 AM');
    expect(getFormat12(1, 33, false)).to.equal('01:33 PM');
  });
});

describe('#format12to24', function() {
  it('should convert given 12hour format to 24hour format', function() {
    expect(format12to24(1, 33, true)).to.equal('01:33');
    expect(format12to24(1, 33, false)).to.equal('13:33');
    expect(format12to24(12, 0, true)).to.equal('00:00');
  });
});

describe('#format24to12', function() {
  it('should convert given 24hour format to 12hour format', function() {
    expect(format24to12(1, 33)).to.equal('01:33 AM');
    expect(format24to12(2, 33)).to.equal('02:33 AM');
    expect(format24to12(12, 0)).to.equal('12:00 PM');
  });
});
