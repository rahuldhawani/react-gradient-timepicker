/* eslint func-names: 0 */
import { expect } from 'chai';
import Timepicker from '../timepicker';
import { mount } from 'enzyme';
import React from 'react';
import sinon from 'sinon';


describe('Timepicker', function() {
  before(function() {
    this.handleSetSpy = sinon.spy();
    this.timepicker = mount(
      <Timepicker
        time="01:00"
        className="input-field"
        theme="Instagram"
        keyName="instagram"
        placeholder="Start Time"
        onSet={this.handleSetSpy}
      />
    );
  });

  describe('#setHour', function() {
    it('returns hour, index, degree in object for any degree', function() {
      expect(this.timepicker.instance().setHour(0)).to.deep.equal({
        degree              : 0,
        hour                : '12',
        selectedIndexDegree : 0
      });

      expect(this.timepicker.instance().setHour(20)).to.deep.equal({
        degree              : 30,
        hour                : '01',
        selectedIndexDegree : 1
      });

      expect(this.timepicker.instance().setHour(13)).to.deep.equal({
        degree              : 0,
        hour                : '12',
        selectedIndexDegree : 0
      });
    });
  });

  describe('#setMinute', function() {
    it('returns minute, index, degree in object for any degree', function() {
      expect(this.timepicker.instance().setMinute(0)).to.deep.equal({
        degree              : 0,
        minute              : '00',
        selectedIndexDegree : 0
      });

      expect(this.timepicker.instance().setMinute(20)).to.deep.equal({
        degree              : 18,
        minute              : '03',
        selectedIndexDegree : 0.6
      });

      expect(this.timepicker.instance().setMinute(344)).to.deep.equal({
        degree              : 342,
        minute              : '57',
        selectedIndexDegree : 11.4
      });
    });
  });

  describe('#addStyles', function() {
    before(function() {
      this.timepicker1 = mount(
        <div>
          <Timepicker
            time="01:00"
            className="input-field"
            theme="Instagram"
            keyName="instagram"
            placeholder="Start Time"
            onSet={this.handleSetSpy}
          />
          <Timepicker
            time="01:00"
            className="input-field"
            theme="Pinky"
            keyName="pinky"
            placeholder="Start Time"
            onSet={this.handleSetSpy}
          />
          <Timepicker
            time="01:00"
            className="input-field"
            placeholder="Start Time"
            onSet={this.handleSetSpy}
          />
        </div>
      );
    });

    it('adds common styles only once', function() {
      expect(document.querySelectorAll('#react-timepicker-common-style').length).to.equal(1);
    });

    it('adds particular theme styles only once', function() {
      expect(document.querySelectorAll('#pinky').length).to.equal(1);
      expect(document.querySelectorAll('#instagram').length).to.equal(1);
    });

    it('adds style with id \'react-theme-style\' if no theme name is given', function() {
      expect(document.querySelectorAll('#react-theme-style').length).to.equal(1);
    });
  });

  describe('handleSet', function() {
    before(function() {
      this.timepicker.instance().handleSet();
    });

    it('closes modal; sets state toShow to false', function() {
      expect(this.timepicker.state().toShow).to.equal(false);
    });

    it('calls onSet from props', function() {
      sinon.assert.callCount(this.handleSetSpy, 1);
    });

    after(function() {
      this.handleSetSpy.reset();
    });
  });

  describe('#getTime', function() {
    it('returns object with 12hour and 24hour format for any hour, minute, and meridiem given', function() {
      expect(this.timepicker.instance().getTime(12, 12, true)).to.deep.equal({
        format12 : '12:12 AM',
        format24 : '00:12'
      });

      expect(this.timepicker.instance().getTime(1, 12, true)).to.deep.equal({
        format12 : '01:12 AM',
        format24 : '01:12'
      });

      expect(this.timepicker.instance().getTime(1, 12, false)).to.deep.equal({
        format12 : '01:12 PM',
        format24 : '13:12'
      });
    });
  });
});
