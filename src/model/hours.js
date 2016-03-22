import { mixinValidation } from './validation-mixin';

import { Model } from 'backbone';
import _, { keys } from 'lodash';

/*esfmt-ignore-start*/
export const days = {
  'sunday':    { display: 'Sunday',    idx: 0, type: 'weekend' },
  'monday':    { display: 'Monday',    idx: 1, type: 'weekday' },
  'tuesday':   { display: 'Tuesday',   idx: 2, type: 'weekday' },
  'wednesday': { display: 'Wednesday', idx: 3, type: 'weekday' },
  'thursday':  { display: 'Thursday',  idx: 4, type: 'weekday' },
  'friday':    { display: 'Friday',    idx: 5, type: 'weekday' },
  'saturday':  { display: 'Saturday',  idx: 6, type: 'weekend' },

  'weekend':   { display: 'Weekend',           type: 'compose' },
  'weekday' :  { display: 'Weekdays',          type: 'compose' }
};
/*esfmt-ignore-end*/

function expand( day ) {
  switch ( day ) {
  case 'weekend':
  case 'weekday':
    return _( days ).pickBy( value => value.type === day ).keys();
  default:
    return [ day ];
  }
}

export function normalize( date ) {
  const hours = date.getHours();
  const minutes = date.getMinutes();

  return new Date( 1970, 0, 1, hours, minutes, 0, 0 ).toISOString();
}

// new Date().toLocaleTimeString( [], { hour: 'numeric', minute: 'numeric' });

const hours = {
  type: 'array',
  items: {
    type: 'object',
    additionalProperties: false,
    properties: {
      day: {
        type: 'string',
        enum: keys( days )
      },
      opens: {
        type: 'string',
        format: 'date-time'
      },
      closes: {
        type: 'string',
        format: 'date-time'
      }
    }
  }
};

const schedule = {
  type: 'object',
  additionalProperties: false,
  properties: {
    schedule: {
      type: 'object',
      patternProperties: {
        '.*': hours
      }
    }
  }
};

export const Schedule = Model.extend( {
  schema: schedule,

  constructor: function( attrs, options ) {
    attrs = attrs || {};
    Model.call( this, { schedule: attrs.schedule || {} }, options );
  },

  addHoursIn: function( day, opens, closes, name = 'default' ) {
    const schedule = this.get( 'schedule' );
    const hours = expand( day ).map( day => {
      return {
        day,
        closes: normalize( closes ),
        opens: normalize( opens )
      };
    } );
    const season = schedule[ name ] || [];
    this.set( 'schedule', {
      ...schedule,
      [ name ]: [ ...season, ...hours ]
    } );
  },

  delHoursIn: function( idx, name = 'default' ) {
    const schedule = this.get( 'schedule' );
    const season = schedule[ name ] || [];

    season.splice( idx, 1 );

    this.set( 'schedule', {
      ...schedule,
      [ name ]: season
    } );
  }
} );

mixinValidation( Schedule );
