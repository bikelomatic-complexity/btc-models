/*global describe it beforeEach*/
import { expect } from 'chai';
import { Schedule, normalize } from '../../src/model/hours';

describe( 'normalize', function() {
  it( 'should return an HHMM string', function() {
    const date = new Date();
    date.setHours( 11 );
    date.setMinutes( 30 );

    const result = normalize( date );

    date.setYear( 1970 );
    date.setMonth( 0 );
    date.setDate( 1 );
    date.setSeconds( 0 );
    date.setMilliseconds( 0 );

    expect( result ).to.equal( date.toISOString() );
  } );
} );
describe( 'Schedule', function() {
  beforeEach( function() {
    this.opens = new Date();
    this.opens.setHours( 11 );
    this.opens.setMinutes( 30 );

    this.closes = new Date();
    this.closes.setHours( 18 );
    this.closes.setMinutes( 30 );
  } );
  describe( 'constructor()', function() {
    it( 'should initialize the schedule object', function() {
      const schedule = new Schedule();
      expect( schedule ).to.have.deep.property( 'attributes.schedule' );
    } );
  } );
  describe( 'addHoursIn()', function() {
    it( 'should add hours in the default season', function() {
      const schedule = new Schedule();
      schedule.addHoursIn( 'monday', this.opens, this.closes );
      expect( schedule.attributes )
        .to.have.deep.property( 'schedule.default[0]' )
        .with.deep.property( 'day', 'monday' );
      expect( schedule.attributes )
        .to.have.deep.property( 'schedule.default[0]' )
        .with.deep.property( 'opens' )
        .that.is.a( 'string' );
    } );
    it( 'should add hours to a named season', function() {
      const schedule = new Schedule();
      schedule.addHoursIn( 'monday', this.opens, this.closes, 'winter' );
      expect( schedule.attributes )
        .to.have.deep.property( 'schedule.winter[0]' )
        .with.deep.property( 'day', 'monday' );
    } );
    it( 'should expand weekdays into five individual days', function() {
      const schedule = new Schedule();
      schedule.addHoursIn( 'weekday', this.opens, this.closes );
      expect( schedule.attributes )
        .to.have.deep.property( 'schedule.default' )
        .with.lengthOf( 5 );
    } );
  } );
  describe( 'delHoursIn()', function() {
    it( 'should remove hours from the default season', function() {
      const schedule = new Schedule();
      schedule.addHoursIn( 'monday', this.opens, this.closes );
      schedule.addHoursIn( 'tuesday', this.opens, this.closes );

      schedule.delHoursIn( 1 );
      expect( schedule.attributes )
        .to.have.deep.property( 'schedule.default' )
        .with.lengthOf( 1 )
        .with.deep.property( '[0].day', 'monday' );
    } );
  } );
  describe( 'validate()', function() {
    it( 'should validate the schedule', function() {
      const schedule = new Schedule();
      schedule.addHoursIn( 'monday', this.opens, this.closes );
      schedule.addHoursIn( 'tuesday', this.opens, this.closes );
      schedule.addHoursIn( 'wednesday', this.opens, this.closes );

      schedule.isValid();
      expect( schedule.validationError ).to.not.exist;
    } );
  } );
} );
