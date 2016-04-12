'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Schedule = exports.days = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.nextDay = nextDay;
exports.normalize = normalize;

var _validationMixin = require('./validation-mixin');

var _backbone = require('backbone');

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

// # Logic for Seasons and Hours
// A service usually has posted hours for the week. The list of opening and
// closing times for each day of the week are considered 'Hours'. Different
// days of the week can have different opening and closing times. A single
// day can have multiple segments where the service is open (for example,
// restaurants may be closed between lunch and dinner). However, we don't
// yet sanitize occurences where these overlap.
//
// Services encountered by touring cyclists are likely to have seasonal hours.
// A 'Season' has a name, and a list of hours.
//
// The entire list of seasonal hours is the 'Schedule'. Each service has at
// least a schedule with a default season.

// ## Day Enumeration
// This enum has a `next` field which is provided as a utility for GUIs.
// The special weekend and weekday keys can be used by the `expand`
// function to obtain a list of the appropriate day keys.
//
// The keys of the enum are ordered to correspond with new Date().getDay().
// Use keys( days ) to use that index.
/*esfmt-ignore-start*/
var days = exports.days = {
  'sunday': { display: 'Sunday', type: 'weekend', next: 'monday' },
  'monday': { display: 'Monday', type: 'weekday', next: 'tuesday' },
  'tuesday': { display: 'Tuesday', type: 'weekday', next: 'wednesday' },
  'wednesday': { display: 'Wednesday', type: 'weekday', next: 'thursday' },
  'thursday': { display: 'Thursday', type: 'weekday', next: 'friday' },
  'friday': { display: 'Friday', type: 'weekday', next: 'saturday' },
  'saturday': { display: 'Saturday', type: 'weekend', next: 'sunday' },

  'weekend': { display: 'Weekend', type: 'compose', next: 'weekday' },
  'weekday': { display: 'Weekdays', type: 'compose', next: 'weekend' }
};
/*esfmt-ignore-end*/

var daysKeys = (0, _lodash.keys)(days);

// ## Expand Special Keys
// Given 'weekend' or 'weekday', this function will return a list of the
// relevant enum keys. If a regular key is provided, pass it through.
function expand(day) {
  switch (day) {
    case 'weekend':
    case 'weekday':
      return (0, _lodash2.default)(days).pickBy(function (value) {
        return value.type === day;
      }).keys();
    default:
      return [day];
  }
}

// ## Get the Next Day in Sequence
// Given a day of the week, return the next day in sequence. Saturday wraps
// around to Sunday
function nextDay(day) {
  var next = days[day].next;
  if (next) {
    return next;
  } else {
    return null;
  }
}

// ## Day key for Today
// Return the enum key for today.
function today() {
  var idx = new Date().getDay();
  return daysKeys[idx];
}

// ## Dates Used as Times
// If you have a Date object where only the HH:MM information is relevant,
// `normalize` will reset the date component to Jan 1, 1970 and shave off
// any seconds and milliseconds. (Javascript dates are 2038 safe)
function normalize(date) {
  var hours = date.getHours();
  var minutes = date.getMinutes();

  return new Date(1970, 0, 1, hours, minutes, 0, 0).toISOString();
}

// ## Hours Schema
// An hours array contains objects that specify opening and closing times
// for a day. The hours array can have multiple entries for the same day.
//
// The opening and closing times must be stored as ISO compliant date-time
// strings in Zulu time.
//
// ```
// [ {
//   "monday",
//   "opens": "1970-01-01T08:30:00.000Z",
//   "closes": "1970-01-01T17:30:00.000Z"
// } ]
// ```
var hours = {
  type: 'array',
  items: {
    type: 'object',
    additionalProperties: false,
    properties: {
      day: {
        type: 'string',
        enum: (0, _lodash.keys)(days)
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

// ## Schedule Schema
// A schema object has season names for keys and hours arrays for values. The
// schema object has a 'default' season in case we don't know season-specific
// hours for a service.
//
// ```
// {
//   "default": ...,
//   "winter": ...
// }
// ```
var schedule = {
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

// # Schedule Model
// The schedule model provides an easy way to work with the schedule data
// structure. It is not intended to be connected to a database. It is meant
// only to manipulate the structure between deserialization and serialization
// of a redux store.
//
// Times for each day are stored as ISO-compliant strings normalized to ignore
// all sections besides HH:MM (they appear as 1970's dates).
var Schedule = exports.Schedule = _backbone.Model.extend({
  schema: schedule,

  constructor: function constructor(attrs, options) {
    _backbone.Model.call(this, { schedule: attrs || {} }, options);
  },

  // ## Add Hours to Season
  // Add an entry to the hours array for a season, by default the 'default'
  // season. If a special day key is provided, expand it to an array of
  // day keys.
  addHoursIn: function addHoursIn(day, opens, closes) {
    var name = arguments.length <= 3 || arguments[3] === undefined ? 'default' : arguments[3];

    var schedule = this.get('schedule');
    var hours = expand(day).map(function (day) {
      return {
        day: day,
        closes: normalize(closes),
        opens: normalize(opens)
      };
    });
    var season = schedule[name] || [];
    this.set('schedule', _extends({}, schedule, _defineProperty({}, name, [].concat(_toConsumableArray(season), _toConsumableArray(hours)))));
  },

  // ## Remove Hours from a Season
  // Delete an entry in the hours arary for a season, by default the 'default'
  // season. Entries are deleted by index in the hours array.
  delHoursIn: function delHoursIn(idx) {
    var name = arguments.length <= 1 || arguments[1] === undefined ? 'default' : arguments[1];

    var schedule = this.get('schedule');
    var season = schedule[name] || [];

    season.splice(idx, 1);

    this.set('schedule', _extends({}, schedule, _defineProperty({}, name, season)));
  },

  // Get the closing-time ISO string for today.
  getClosingToday: function getClosingToday() {
    var season = this.get('schedule').default;
    var hours = (0, _lodash.find)(season, { day: today() });

    return hours ? hours.closes : null;
  }
});

(0, _validationMixin.mixinValidation)(Schedule);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tb2RlbC9ob3Vycy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7UUEyRGdCO1FBb0JBOztBQS9FaEI7O0FBRUE7O0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBd0JPLElBQU0sc0JBQU87QUFDbEIsWUFBYSxFQUFFLFNBQVMsUUFBVCxFQUFzQixNQUFNLFNBQU4sRUFBaUIsTUFBTSxRQUFOLEVBQXREO0FBQ0EsWUFBYSxFQUFFLFNBQVMsUUFBVCxFQUFzQixNQUFNLFNBQU4sRUFBaUIsTUFBTSxTQUFOLEVBQXREO0FBQ0EsYUFBYSxFQUFFLFNBQVMsU0FBVCxFQUFzQixNQUFNLFNBQU4sRUFBaUIsTUFBTSxXQUFOLEVBQXREO0FBQ0EsZUFBYSxFQUFFLFNBQVMsV0FBVCxFQUFzQixNQUFNLFNBQU4sRUFBaUIsTUFBTSxVQUFOLEVBQXREO0FBQ0EsY0FBYSxFQUFFLFNBQVMsVUFBVCxFQUFzQixNQUFNLFNBQU4sRUFBaUIsTUFBTSxRQUFOLEVBQXREO0FBQ0EsWUFBYSxFQUFFLFNBQVMsUUFBVCxFQUFzQixNQUFNLFNBQU4sRUFBaUIsTUFBTSxVQUFOLEVBQXREO0FBQ0EsY0FBYSxFQUFFLFNBQVMsVUFBVCxFQUFzQixNQUFNLFNBQU4sRUFBaUIsTUFBTSxRQUFOLEVBQXREOztBQUVBLGFBQWEsRUFBRSxTQUFTLFNBQVQsRUFBc0IsTUFBTSxTQUFOLEVBQWlCLE1BQU0sU0FBTixFQUF0RDtBQUNBLGFBQWEsRUFBRSxTQUFTLFVBQVQsRUFBc0IsTUFBTSxTQUFOLEVBQWlCLE1BQU0sU0FBTixFQUF0RDtDQVZXOzs7QUFjYixJQUFNLFdBQVcsa0JBQU0sSUFBTixDQUFYOzs7OztBQUtOLFNBQVMsTUFBVCxDQUFpQixHQUFqQixFQUF1QjtBQUNyQixVQUFTLEdBQVQ7QUFDQSxTQUFLLFNBQUwsQ0FEQTtBQUVBLFNBQUssU0FBTDtBQUNFLGFBQU8sc0JBQUcsSUFBSCxFQUFVLE1BQVYsQ0FBa0I7ZUFB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Q0ssOEJBQ0QsTUFBUSxRQUZaLEVBTjRDO0dBQWxDOzs7QUFhWiw4Q0FBa0I7QUFDaEIsUUFBTSxTQUFTLEtBQUssR0FBTCxDQUFVLFVBQVYsRUFBdUIsT0FBdkIsQ0FEQztBQUVoQixRQUFNLFFBQVEsa0JBQU0sTUFBTixFQUFjLEVBQUUsS0FBSyxPQUFMLEVBQWhCLENBQVIsQ0FGVTs7QUFJaEIsV0FBTyxRQUFRLE1BQU0sTUFBTixHQUFlLElBQXZCLENBSlM7R0EzQ2tCO0NBQWQsQ0FBWDs7QUFtRGIsc0NBQWlCLFFBQWpCIiwiZmlsZSI6ImhvdXJzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgbWl4aW5WYWxpZGF0aW9uIH0gZnJvbSAnLi92YWxpZGF0aW9uLW1peGluJztcblxuaW1wb3J0IHsgTW9kZWwgfSBmcm9tICdiYWNrYm9uZSc7XG5pbXBvcnQgXywgeyBrZXlzLCBmaW5kIH0gZnJvbSAnbG9kYXNoJztcblxuLy8gIyBMb2dpYyBmb3IgU2Vhc29ucyBhbmQgSG91cnNcbi8vIEEgc2VydmljZSB1c3VhbGx5IGhhcyBwb3N0ZWQgaG91cnMgZm9yIHRoZSB3ZWVrLiBUaGUgbGlzdCBvZiBvcGVuaW5nIGFuZFxuLy8gY2xvc2luZyB0aW1lcyBmb3IgZWFjaCBkYXkgb2YgdGhlIHdlZWsgYXJlIGNvbnNpZGVyZWQgJ0hvdXJzJy4gRGlmZmVyZW50XG4vLyBkYXlzIG9mIHRoZSB3ZWVrIGNhbiBoYXZlIGRpZmZlcmVudCBvcGVuaW5nIGFuZCBjbG9zaW5nIHRpbWVzLiBBIHNpbmdsZVxuLy8gZGF5IGNhbiBoYXZlIG11bHRpcGxlIHNlZ21lbnRzIHdoZXJlIHRoZSBzZXJ2aWNlIGlzIG9wZW4gKGZvciBleGFtcGxlLFxuLy8gcmVzdGF1cmFudHMgbWF5IGJlIGNsb3NlZCBiZXR3ZWVuIGx1bmNoIGFuZCBkaW5uZXIpLiBIb3dldmVyLCB3ZSBkb24ndFxuLy8geWV0IHNhbml0aXplIG9jY3VyZW5jZXMgd2hlcmUgdGhlc2Ugb3ZlcmxhcC5cbi8vXG4vLyBTZXJ2aWNlcyBlbmNvdW50ZXJlZCBieSB0b3VyaW5nIGN5Y2xpc3RzIGFyZSBsaWtlbHkgdG8gaGF2ZSBzZWFzb25hbCBob3Vycy5cbi8vIEEgJ1NlYXNvbicgaGFzIGEgbmFtZSwgYW5kIGEgbGlzdCBvZiBob3Vycy5cbi8vXG4vLyBUaGUgZW50aXJlIGxpc3Qgb2Ygc2Vhc29uYWwgaG91cnMgaXMgdGhlICdTY2hlZHVsZScuIEVhY2ggc2VydmljZSBoYXMgYXRcbi8vIGxlYXN0IGEgc2NoZWR1bGUgd2l0aCBhIGRlZmF1bHQgc2Vhc29uLlxuXG4vLyAjIyBEYXkgRW51bWVyYXRpb25cbi8vIFRoaXMgZW51bSBoYXMgYSBgbmV4dGAgZmllbGQgd2hpY2ggaXMgcHJvdmlkZWQgYXMgYSB1dGlsaXR5IGZvciBHVUlzLlxuLy8gVGhlIHNwZWNpYWwgd2Vla2VuZCBhbmQgd2Vla2RheSBrZXlzIGNhbiBiZSB1c2VkIGJ5IHRoZSBgZXhwYW5kYFxuLy8gZnVuY3Rpb24gdG8gb2J0YWluIGEgbGlzdCBvZiB0aGUgYXBwcm9wcmlhdGUgZGF5IGtleXMuXG4vL1xuLy8gVGhlIGtleXMgb2YgdGhlIGVudW0gYXJlIG9yZGVyZWQgdG8gY29ycmVzcG9uZCB3aXRoIG5ldyBEYXRlKCkuZ2V0RGF5KCkuXG4vLyBVc2Uga2V5cyggZGF5cyApIHRvIHVzZSB0aGF0IGluZGV4LlxuLyplc2ZtdC1pZ25vcmUtc3RhcnQqL1xuZXhwb3J0IGNvbnN0IGRheXMgPSB7XG4gICdzdW5kYXknOiAgICB7IGRpc3BsYXk6ICdTdW5kYXknLCAgICB0eXBlOiAnd2Vla2VuZCcsIG5leHQ6ICdtb25kYXknICAgIH0sXG4gICdtb25kYXknOiAgICB7IGRpc3BsYXk6ICdNb25kYXknLCAgICB0eXBlOiAnd2Vla2RheScsIG5leHQ6ICd0dWVzZGF5JyAgIH0sXG4gICd0dWVzZGF5JzogICB7IGRpc3BsYXk6ICdUdWVzZGF5JywgICB0eXBlOiAnd2Vla2RheScsIG5leHQ6ICd3ZWRuZXNkYXknIH0sXG4gICd3ZWRuZXNkYXknOiB7IGRpc3BsYXk6ICdXZWRuZXNkYXknLCB0eXBlOiAnd2Vla2RheScsIG5leHQ6ICd0aHVyc2RheScgIH0sXG4gICd0aHVyc2RheSc6ICB7IGRpc3BsYXk6ICdUaHVyc2RheScsICB0eXBlOiAnd2Vla2RheScsIG5leHQ6ICdmcmlkYXknICAgIH0sXG4gICdmcmlkYXknOiAgICB7IGRpc3BsYXk6ICdGcmlkYXknLCAgICB0eXBlOiAnd2Vla2RheScsIG5leHQ6ICdzYXR1cmRheScgIH0sXG4gICdzYXR1cmRheSc6ICB7IGRpc3BsYXk6ICdTYXR1cmRheScsICB0eXBlOiAnd2Vla2VuZCcsIG5leHQ6ICdzdW5kYXknICAgIH0sXG5cbiAgJ3dlZWtlbmQnOiAgIHsgZGlzcGxheTogJ1dlZWtlbmQnLCAgIHR5cGU6ICdjb21wb3NlJywgbmV4dDogJ3dlZWtkYXknICAgfSxcbiAgJ3dlZWtkYXknIDogIHsgZGlzcGxheTogJ1dlZWtkYXlzJywgIHR5cGU6ICdjb21wb3NlJywgbmV4dDogJ3dlZWtlbmQnICAgfVxufTtcbi8qZXNmbXQtaWdub3JlLWVuZCovXG5cbmNvbnN0IGRheXNLZXlzID0ga2V5cyggZGF5cyApO1xuXG4vLyAjIyBFeHBhbmQgU3BlY2lhbCBLZXlzXG4vLyBHaXZlbiAnd2Vla2VuZCcgb3IgJ3dlZWtkYXknLCB0aGlzIGZ1bmN0aW9uIHdpbGwgcmV0dXJuIGEgbGlzdCBvZiB0aGVcbi8vIHJlbGV2YW50IGVudW0ga2V5cy4gSWYgYSByZWd1bGFyIGtleSBpcyBwcm92aWRlZCwgcGFzcyBpdCB0aHJvdWdoLlxuZnVuY3Rpb24gZXhwYW5kKCBkYXkgKSB7XG4gIHN3aXRjaCAoIGRheSApIHtcbiAgY2FzZSAnd2Vla2VuZCc6XG4gIGNhc2UgJ3dlZWtkYXknOlxuICAgIHJldHVybiBfKCBkYXlzICkucGlja0J5KCB2YWx1ZSA9PiB2YWx1ZS50eXBlID09PSBkYXkgKS5rZXlzKCk7XG4gIGRlZmF1bHQ6XG4gICAgcmV0dXJuIFsgZGF5IF07XG4gIH1cbn1cblxuLy8gIyMgR2V0IHRoZSBOZXh0IERheSBpbiBTZXF1ZW5jZVxuLy8gR2l2ZW4gYSBkYXkgb2YgdGhlIHdlZWssIHJldHVybiB0aGUgbmV4dCBkYXkgaW4gc2VxdWVuY2UuIFNhdHVyZGF5IHdyYXBzXG4vLyBhcm91bmQgdG8gU3VuZGF5XG5leHBvcnQgZnVuY3Rpb24gbmV4dERheSggZGF5ICkge1xuICBjb25zdCBuZXh0ID0gZGF5c1sgZGF5IF0ubmV4dDtcbiAgaWYgKCBuZXh0ICkge1xuICAgIHJldHVybiBuZXh0O1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBudWxsO1xuICB9XG59XG5cbi8vICMjIERheSBrZXkgZm9yIFRvZGF5XG4vLyBSZXR1cm4gdGhlIGVudW0ga2V5IGZvciB0b2RheS5cbmZ1bmN0aW9uIHRvZGF5KCkge1xuICBjb25zdCBpZHggPSBuZXcgRGF0ZSgpLmdldERheSgpO1xuICByZXR1cm4gZGF5c0tleXNbIGlkeCBdO1xufVxuXG4vLyAjIyBEYXRlcyBVc2VkIGFzIFRpbWVzXG4vLyBJZiB5b3UgaGF2ZSBhIERhdGUgb2JqZWN0IHdoZXJlIG9ubHkgdGhlIEhIOk1NIGluZm9ybWF0aW9uIGlzIHJlbGV2YW50LFxuLy8gYG5vcm1hbGl6ZWAgd2lsbCByZXNldCB0aGUgZGF0ZSBjb21wb25lbnQgdG8gSmFuIDEsIDE5NzAgYW5kIHNoYXZlIG9mZlxuLy8gYW55IHNlY29uZHMgYW5kIG1pbGxpc2Vjb25kcy4gKEphdmFzY3JpcHQgZGF0ZXMgYXJlIDIwMzggc2FmZSlcbmV4cG9ydCBmdW5jdGlvbiBub3JtYWxpemUoIGRhdGUgKSB7XG4gIGNvbnN0IGhvdXJzID0gZGF0ZS5nZXRIb3VycygpO1xuICBjb25zdCBtaW51dGVzID0gZGF0ZS5nZXRNaW51dGVzKCk7XG5cbiAgcmV0dXJuIG5ldyBEYXRlKCAxOTcwLCAwLCAxLCBob3VycywgbWludXRlcywgMCwgMCApLnRvSVNPU3RyaW5nKCk7XG59XG5cbi8vICMjIEhvdXJzIFNjaGVtYVxuLy8gQW4gaG91cnMgYXJyYXkgY29udGFpbnMgb2JqZWN0cyB0aGF0IHNwZWNpZnkgb3BlbmluZyBhbmQgY2xvc2luZyB0aW1lc1xuLy8gZm9yIGEgZGF5LiBUaGUgaG91cnMgYXJyYXkgY2FuIGhhdmUgbXVsdGlwbGUgZW50cmllcyBmb3IgdGhlIHNhbWUgZGF5LlxuLy9cbi8vIFRoZSBvcGVuaW5nIGFuZCBjbG9zaW5nIHRpbWVzIG11c3QgYmUgc3RvcmVkIGFzIElTTyBjb21wbGlhbnQgZGF0ZS10aW1lXG4vLyBzdHJpbmdzIGluIFp1bHUgdGltZS5cbi8vXG4vLyBgYGBcbi8vIFsge1xuLy8gICBcIm1vbmRheVwiLFxuLy8gICBcIm9wZW5zXCI6IFwiMTk3MC0wMS0wMVQwODozMDowMC4wMDBaXCIsXG4vLyAgIFwiY2xvc2VzXCI6IFwiMTk3MC0wMS0wMVQxNzozMDowMC4wMDBaXCJcbi8vIH0gXVxuLy8gYGBgXG5jb25zdCBob3VycyA9IHtcbiAgdHlwZTogJ2FycmF5JyxcbiAgaXRlbXM6IHtcbiAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICBhZGRpdGlvbmFsUHJvcGVydGllczogZmFsc2UsXG4gICAgcHJvcGVydGllczoge1xuICAgICAgZGF5OiB7XG4gICAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgICBlbnVtOiBrZXlzKCBkYXlzIClcbiAgICAgIH0sXG4gICAgICBvcGVuczoge1xuICAgICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgICAgZm9ybWF0OiAnZGF0ZS10aW1lJ1xuICAgICAgfSxcbiAgICAgIGNsb3Nlczoge1xuICAgICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgICAgZm9ybWF0OiAnZGF0ZS10aW1lJ1xuICAgICAgfVxuICAgIH1cbiAgfVxufTtcblxuLy8gIyMgU2NoZWR1bGUgU2NoZW1hXG4vLyBBIHNjaGVtYSBvYmplY3QgaGFzIHNlYXNvbiBuYW1lcyBmb3Iga2V5cyBhbmQgaG91cnMgYXJyYXlzIGZvciB2YWx1ZXMuIFRoZVxuLy8gc2NoZW1hIG9iamVjdCBoYXMgYSAnZGVmYXVsdCcgc2Vhc29uIGluIGNhc2Ugd2UgZG9uJ3Qga25vdyBzZWFzb24tc3BlY2lmaWNcbi8vIGhvdXJzIGZvciBhIHNlcnZpY2UuXG4vL1xuLy8gYGBgXG4vLyB7XG4vLyAgIFwiZGVmYXVsdFwiOiAuLi4sXG4vLyAgIFwid2ludGVyXCI6IC4uLlxuLy8gfVxuLy8gYGBgXG5jb25zdCBzY2hlZHVsZSA9IHtcbiAgdHlwZTogJ29iamVjdCcsXG4gIGFkZGl0aW9uYWxQcm9wZXJ0aWVzOiBmYWxzZSxcbiAgcHJvcGVydGllczoge1xuICAgIHNjaGVkdWxlOiB7XG4gICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICAgIHBhdHRlcm5Qcm9wZXJ0aWVzOiB7XG4gICAgICAgICcuKic6IGhvdXJzXG4gICAgICB9XG4gICAgfVxuICB9XG59O1xuXG4vLyAjIFNjaGVkdWxlIE1vZGVsXG4vLyBUaGUgc2NoZWR1bGUgbW9kZWwgcHJvdmlkZXMgYW4gZWFzeSB3YXkgdG8gd29yayB3aXRoIHRoZSBzY2hlZHVsZSBkYXRhXG4vLyBzdHJ1Y3R1cmUuIEl0IGlzIG5vdCBpbnRlbmRlZCB0byBiZSBjb25uZWN0ZWQgdG8gYSBkYXRhYmFzZS4gSXQgaXMgbWVhbnRcbi8vIG9ubHkgdG8gbWFuaXB1bGF0ZSB0aGUgc3RydWN0dXJlIGJldHdlZW4gZGVzZXJpYWxpemF0aW9uIGFuZCBzZXJpYWxpemF0aW9uXG4vLyBvZiBhIHJlZHV4IHN0b3JlLlxuLy9cbi8vIFRpbWVzIGZvciBlYWNoIGRheSBhcmUgc3RvcmVkIGFzIElTTy1jb21wbGlhbnQgc3RyaW5ncyBub3JtYWxpemVkIHRvIGlnbm9yZVxuLy8gYWxsIHNlY3Rpb25zIGJlc2lkZXMgSEg6TU0gKHRoZXkgYXBwZWFyIGFzIDE5NzAncyBkYXRlcykuXG5leHBvcnQgY29uc3QgU2NoZWR1bGUgPSBNb2RlbC5leHRlbmQoIHtcbiAgc2NoZW1hOiBzY2hlZHVsZSxcblxuICBjb25zdHJ1Y3RvcjogZnVuY3Rpb24oIGF0dHJzLCBvcHRpb25zICkge1xuICAgIE1vZGVsLmNhbGwoIHRoaXMsIHsgc2NoZWR1bGU6IGF0dHJzIHx8IHt9IH0sIG9wdGlvbnMgKTtcbiAgfSxcblxuICAvLyAjIyBBZGQgSG91cnMgdG8gU2Vhc29uXG4gIC8vIEFkZCBhbiBlbnRyeSB0byB0aGUgaG91cnMgYXJyYXkgZm9yIGEgc2Vhc29uLCBieSBkZWZhdWx0IHRoZSAnZGVmYXVsdCdcbiAgLy8gc2Vhc29uLiBJZiBhIHNwZWNpYWwgZGF5IGtleSBpcyBwcm92aWRlZCwgZXhwYW5kIGl0IHRvIGFuIGFycmF5IG9mXG4gIC8vIGRheSBrZXlzLlxuICBhZGRIb3Vyc0luOiBmdW5jdGlvbiggZGF5LCBvcGVucywgY2xvc2VzLCBuYW1lID0gJ2RlZmF1bHQnICkge1xuICAgIGNvbnN0IHNjaGVkdWxlID0gdGhpcy5nZXQoICdzY2hlZHVsZScgKTtcbiAgICBjb25zdCBob3VycyA9IGV4cGFuZCggZGF5ICkubWFwKCBkYXkgPT4ge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgZGF5LFxuICAgICAgICBjbG9zZXM6IG5vcm1hbGl6ZSggY2xvc2VzICksXG4gICAgICAgIG9wZW5zOiBub3JtYWxpemUoIG9wZW5zIClcbiAgICAgIH07XG4gICAgfSApO1xuICAgIGNvbnN0IHNlYXNvbiA9IHNjaGVkdWxlWyBuYW1lIF0gfHwgW107XG4gICAgdGhpcy5zZXQoICdzY2hlZHVsZScsIHtcbiAgICAgIC4uLnNjaGVkdWxlLFxuICAgICAgWyBuYW1lIF06IFsgLi4uc2Vhc29uLCAuLi5ob3VycyBdXG4gICAgfSApO1xuICB9LFxuXG4gIC8vICMjIFJlbW92ZSBIb3VycyBmcm9tIGEgU2Vhc29uXG4gIC8vIERlbGV0ZSBhbiBlbnRyeSBpbiB0aGUgaG91cnMgYXJhcnkgZm9yIGEgc2Vhc29uLCBieSBkZWZhdWx0IHRoZSAnZGVmYXVsdCdcbiAgLy8gc2Vhc29uLiBFbnRyaWVzIGFyZSBkZWxldGVkIGJ5IGluZGV4IGluIHRoZSBob3VycyBhcnJheS5cbiAgZGVsSG91cnNJbjogZnVuY3Rpb24oIGlkeCwgbmFtZSA9ICdkZWZhdWx0JyApIHtcbiAgICBjb25zdCBzY2hlZHVsZSA9IHRoaXMuZ2V0KCAnc2NoZWR1bGUnICk7XG4gICAgY29uc3Qgc2Vhc29uID0gc2NoZWR1bGVbIG5hbWUgXSB8fCBbXTtcblxuICAgIHNlYXNvbi5zcGxpY2UoIGlkeCwgMSApO1xuXG4gICAgdGhpcy5zZXQoICdzY2hlZHVsZScsIHtcbiAgICAgIC4uLnNjaGVkdWxlLFxuICAgICAgWyBuYW1lIF06IHNlYXNvblxuICAgIH0gKTtcbiAgfSxcblxuICAvLyBHZXQgdGhlIGNsb3NpbmctdGltZSBJU08gc3RyaW5nIGZvciB0b2RheS5cbiAgZ2V0Q2xvc2luZ1RvZGF5KCkge1xuICAgIGNvbnN0IHNlYXNvbiA9IHRoaXMuZ2V0KCAnc2NoZWR1bGUnICkuZGVmYXVsdDtcbiAgICBjb25zdCBob3VycyA9IGZpbmQoIHNlYXNvbiwgeyBkYXk6IHRvZGF5KCkgfSApO1xuXG4gICAgcmV0dXJuIGhvdXJzID8gaG91cnMuY2xvc2VzIDogbnVsbDtcbiAgfVxufSApO1xuXG5taXhpblZhbGlkYXRpb24oIFNjaGVkdWxlICk7XG4iXX0=