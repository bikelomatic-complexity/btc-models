'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Schedule = exports.timezones = exports.days = undefined;

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
var timezones = exports.timezones = [{ display: 'PST', longName: 'Pacific Standard Time', time: -8 }, { display: 'MST', longName: 'Mountain Standard Time', time: -7 }, { display: 'CST', longName: 'Central Standard Time', time: -6 }, { display: 'EST', longName: 'Eastern Standard Time', time: -5 }];
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tb2RlbC9ob3Vycy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7UUFpRWdCO1FBb0JBOztBQXJGaEI7O0FBRUE7O0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBd0JPLElBQU0sc0JBQU87QUFDbEIsWUFBYSxFQUFFLFNBQVMsUUFBVCxFQUFzQixNQUFNLFNBQU4sRUFBaUIsTUFBTSxRQUFOLEVBQXREO0FBQ0EsWUFBYSxFQUFFLFNBQVMsUUFBVCxFQUFzQixNQUFNLFNBQU4sRUFBaUIsTUFBTSxTQUFOLEVBQXREO0FBQ0EsYUFBYSxFQUFFLFNBQVMsU0FBVCxFQUFzQixNQUFNLFNBQU4sRUFBaUIsTUFBTSxXQUFOLEVBQXREO0FBQ0EsZUFBYSxFQUFFLFNBQVMsV0FBVCxFQUFzQixNQUFNLFNBQU4sRUFBaUIsTUFBTSxVQUFOLEVBQXREO0FBQ0EsY0FBYSxFQUFFLFNBQVMsVUFBVCxFQUFzQixNQUFNLFNBQU4sRUFBaUIsTUFBTSxRQUFOLEVBQXREO0FBQ0EsWUFBYSxFQUFFLFNBQVMsUUFBVCxFQUFzQixNQUFNLFNBQU4sRUFBaUIsTUFBTSxVQUFOLEVBQXREO0FBQ0EsY0FBYSxFQUFFLFNBQVMsVUFBVCxFQUFzQixNQUFNLFNBQU4sRUFBaUIsTUFBTSxRQUFOLEVBQXREOztBQUVBLGFBQWEsRUFBRSxTQUFTLFNBQVQsRUFBc0IsTUFBTSxTQUFOLEVBQWlCLE1BQU0sU0FBTixFQUF0RDtBQUNBLGFBQWEsRUFBRSxTQUFTLFVBQVQsRUFBc0IsTUFBTSxTQUFOLEVBQWlCLE1BQU0sU0FBTixFQUF0RDtDQVZXO0FBWU4sSUFBTSxnQ0FBWSxDQUN2QixFQUFFLFNBQVMsS0FBVCxFQUFnQixVQUFVLHVCQUFWLEVBQW1DLE1BQU0sQ0FBQyxDQUFELEVBRHBDLEVBRXZCLEVBQUUsU0FBUyxLQUFULEVBQWdCLFVBQVUsd0JBQVYsRUFBb0MsTUFBTSxDQUFDLENBQUQsRUFGckMsRUFHdkIsRUFBRSxTQUFT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VTNELFNBQUssR0FBTCxDQUFVLFVBQVYsZUFDSyw4QkFDRCxtQ0FBYSw0QkFBVyxTQUY1QixFQVYyRDtHQUFqRDs7Ozs7QUFtQlosY0FBWSxvQkFBVSxHQUFWLEVBQWtDO1FBQW5CLDZEQUFPLHlCQUFZOztBQUM1QyxRQUFNLFdBQVcsS0FBSyxHQUFMLENBQVUsVUFBVixDQUFYLENBRHNDO0FBRTVDLFFBQU0sU0FBUyxTQUFVLElBQVYsS0FBb0IsRUFBcEIsQ0FGNkI7O0FBSTVDLFdBQU8sTUFBUCxDQUFlLEdBQWYsRUFBb0IsQ0FBcEIsRUFKNEM7O0FBTTVDLFNBQUssR0FBTCxDQUFVLFVBQVYsZUFDSyw4QkFDRCxNQUFRLFFBRlosRUFONEM7R0FBbEM7OztBQWFaLDhDQUFrQjtBQUNoQixRQUFNLFNBQVMsS0FBSyxHQUFMLENBQVUsVUFBVixFQUF1QixPQUF2QixDQURDO0FBRWhCLFFBQU0sUUFBUSxrQkFBTSxNQUFOLEVBQWMsRUFBRSxLQUFLLE9BQUwsRUFBaEIsQ0FBUixDQUZVOztBQUloQixXQUFPLFFBQVEsTUFBTSxNQUFOLEdBQWUsSUFBdkIsQ0FKUztHQTNDa0I7Q0FBZCxDQUFYOztBQW1EYixzQ0FBaUIsUUFBakIiLCJmaWxlIjoiaG91cnMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBtaXhpblZhbGlkYXRpb24gfSBmcm9tICcuL3ZhbGlkYXRpb24tbWl4aW4nO1xyXG5cclxuaW1wb3J0IHsgTW9kZWwgfSBmcm9tICdiYWNrYm9uZSc7XHJcbmltcG9ydCBfLCB7IGtleXMsIGZpbmQgfSBmcm9tICdsb2Rhc2gnO1xyXG5cclxuLy8gIyBMb2dpYyBmb3IgU2Vhc29ucyBhbmQgSG91cnNcclxuLy8gQSBzZXJ2aWNlIHVzdWFsbHkgaGFzIHBvc3RlZCBob3VycyBmb3IgdGhlIHdlZWsuIFRoZSBsaXN0IG9mIG9wZW5pbmcgYW5kXHJcbi8vIGNsb3NpbmcgdGltZXMgZm9yIGVhY2ggZGF5IG9mIHRoZSB3ZWVrIGFyZSBjb25zaWRlcmVkICdIb3VycycuIERpZmZlcmVudFxyXG4vLyBkYXlzIG9mIHRoZSB3ZWVrIGNhbiBoYXZlIGRpZmZlcmVudCBvcGVuaW5nIGFuZCBjbG9zaW5nIHRpbWVzLiBBIHNpbmdsZVxyXG4vLyBkYXkgY2FuIGhhdmUgbXVsdGlwbGUgc2VnbWVudHMgd2hlcmUgdGhlIHNlcnZpY2UgaXMgb3BlbiAoZm9yIGV4YW1wbGUsXHJcbi8vIHJlc3RhdXJhbnRzIG1heSBiZSBjbG9zZWQgYmV0d2VlbiBsdW5jaCBhbmQgZGlubmVyKS4gSG93ZXZlciwgd2UgZG9uJ3RcclxuLy8geWV0IHNhbml0aXplIG9jY3VyZW5jZXMgd2hlcmUgdGhlc2Ugb3ZlcmxhcC5cclxuLy9cclxuLy8gU2VydmljZXMgZW5jb3VudGVyZWQgYnkgdG91cmluZyBjeWNsaXN0cyBhcmUgbGlrZWx5IHRvIGhhdmUgc2Vhc29uYWwgaG91cnMuXHJcbi8vIEEgJ1NlYXNvbicgaGFzIGEgbmFtZSwgYW5kIGEgbGlzdCBvZiBob3Vycy5cclxuLy9cclxuLy8gVGhlIGVudGlyZSBsaXN0IG9mIHNlYXNvbmFsIGhvdXJzIGlzIHRoZSAnU2NoZWR1bGUnLiBFYWNoIHNlcnZpY2UgaGFzIGF0XHJcbi8vIGxlYXN0IGEgc2NoZWR1bGUgd2l0aCBhIGRlZmF1bHQgc2Vhc29uLlxyXG5cclxuLy8gIyMgRGF5IEVudW1lcmF0aW9uXHJcbi8vIFRoaXMgZW51bSBoYXMgYSBgbmV4dGAgZmllbGQgd2hpY2ggaXMgcHJvdmlkZWQgYXMgYSB1dGlsaXR5IGZvciBHVUlzLlxyXG4vLyBUaGUgc3BlY2lhbCB3ZWVrZW5kIGFuZCB3ZWVrZGF5IGtleXMgY2FuIGJlIHVzZWQgYnkgdGhlIGBleHBhbmRgXHJcbi8vIGZ1bmN0aW9uIHRvIG9idGFpbiBhIGxpc3Qgb2YgdGhlIGFwcHJvcHJpYXRlIGRheSBrZXlzLlxyXG4vL1xyXG4vLyBUaGUga2V5cyBvZiB0aGUgZW51bSBhcmUgb3JkZXJlZCB0byBjb3JyZXNwb25kIHdpdGggbmV3IERhdGUoKS5nZXREYXkoKS5cclxuLy8gVXNlIGtleXMoIGRheXMgKSB0byB1c2UgdGhhdCBpbmRleC5cclxuLyplc2ZtdC1pZ25vcmUtc3RhcnQqL1xyXG5leHBvcnQgY29uc3QgZGF5cyA9IHtcclxuICAnc3VuZGF5JzogICAgeyBkaXNwbGF5OiAnU3VuZGF5JywgICAgdHlwZTogJ3dlZWtlbmQnLCBuZXh0OiAnbW9uZGF5JyAgICB9LFxyXG4gICdtb25kYXknOiAgICB7IGRpc3BsYXk6ICdNb25kYXknLCAgICB0eXBlOiAnd2Vla2RheScsIG5leHQ6ICd0dWVzZGF5JyAgIH0sXHJcbiAgJ3R1ZXNkYXknOiAgIHsgZGlzcGxheTogJ1R1ZXNkYXknLCAgIHR5cGU6ICd3ZWVrZGF5JywgbmV4dDogJ3dlZG5lc2RheScgfSxcclxuICAnd2VkbmVzZGF5JzogeyBkaXNwbGF5OiAnV2VkbmVzZGF5JywgdHlwZTogJ3dlZWtkYXknLCBuZXh0OiAndGh1cnNkYXknICB9LFxyXG4gICd0aHVyc2RheSc6ICB7IGRpc3BsYXk6ICdUaHVyc2RheScsICB0eXBlOiAnd2Vla2RheScsIG5leHQ6ICdmcmlkYXknICAgIH0sXHJcbiAgJ2ZyaWRheSc6ICAgIHsgZGlzcGxheTogJ0ZyaWRheScsICAgIHR5cGU6ICd3ZWVrZGF5JywgbmV4dDogJ3NhdHVyZGF5JyAgfSxcclxuICAnc2F0dXJkYXknOiAgeyBkaXNwbGF5OiAnU2F0dXJkYXknLCAgdHlwZTogJ3dlZWtlbmQnLCBuZXh0OiAnc3VuZGF5JyAgICB9LFxyXG5cclxuICAnd2Vla2VuZCc6ICAgeyBkaXNwbGF5OiAnV2Vla2VuZCcsICAgdHlwZTogJ2NvbXBvc2UnLCBuZXh0OiAnd2Vla2RheScgICB9LFxyXG4gICd3ZWVrZGF5JyA6ICB7IGRpc3BsYXk6ICdXZWVrZGF5cycsICB0eXBlOiAnY29tcG9zZScsIG5leHQ6ICd3ZWVrZW5kJyAgIH1cclxufTtcclxuZXhwb3J0IGNvbnN0IHRpbWV6b25lcyA9IFtcclxuICB7IGRpc3BsYXk6ICdQU1QnLCBsb25nTmFtZTogJ1BhY2lmaWMgU3RhbmRhcmQgVGltZScsIHRpbWU6IC04IH0sXHJcbiAgeyBkaXNwbGF5OiAnTVNUJywgbG9uZ05hbWU6ICdNb3VudGFpbiBTdGFuZGFyZCBUaW1lJywgdGltZTogLTcgfSxcclxuICB7IGRpc3BsYXk6ICdDU1QnLCBsb25nTmFtZTogJ0NlbnRyYWwgU3RhbmRhcmQgVGltZScsIHRpbWU6IC02IH0sXHJcbiAgeyBkaXNwbGF5OiAnRVNUJywgbG9uZ05hbWU6ICdFYXN0ZXJuIFN0YW5kYXJkIFRpbWUnLCB0aW1lOiAtNSB9XHJcbl1cclxuLyplc2ZtdC1pZ25vcmUtZW5kKi9cclxuXHJcbmNvbnN0IGRheXNLZXlzID0ga2V5cyggZGF5cyApO1xyXG5cclxuLy8gIyMgRXhwYW5kIFNwZWNpYWwgS2V5c1xyXG4vLyBHaXZlbiAnd2Vla2VuZCcgb3IgJ3dlZWtkYXknLCB0aGlzIGZ1bmN0aW9uIHdpbGwgcmV0dXJuIGEgbGlzdCBvZiB0aGVcclxuLy8gcmVsZXZhbnQgZW51bSBrZXlzLiBJZiBhIHJlZ3VsYXIga2V5IGlzIHByb3ZpZGVkLCBwYXNzIGl0IHRocm91Z2guXHJcbmZ1bmN0aW9uIGV4cGFuZCggZGF5ICkge1xyXG4gIHN3aXRjaCAoIGRheSApIHtcclxuICBjYXNlICd3ZWVrZW5kJzpcclxuICBjYXNlICd3ZWVrZGF5JzpcclxuICAgIHJldHVybiBfKCBkYXlzICkucGlja0J5KCB2YWx1ZSA9PiB2YWx1ZS50eXBlID09PSBkYXkgKS5rZXlzKCk7XHJcbiAgZGVmYXVsdDpcclxuICAgIHJldHVybiBbIGRheSBdO1xyXG4gIH1cclxufVxyXG5cclxuLy8gIyMgR2V0IHRoZSBOZXh0IERheSBpbiBTZXF1ZW5jZVxyXG4vLyBHaXZlbiBhIGRheSBvZiB0aGUgd2VlaywgcmV0dXJuIHRoZSBuZXh0IGRheSBpbiBzZXF1ZW5jZS4gU2F0dXJkYXkgd3JhcHNcclxuLy8gYXJvdW5kIHRvIFN1bmRheVxyXG5leHBvcnQgZnVuY3Rpb24gbmV4dERheSggZGF5ICkge1xyXG4gIGNvbnN0IG5leHQgPSBkYXlzWyBkYXkgXS5uZXh0O1xyXG4gIGlmICggbmV4dCApIHtcclxuICAgIHJldHVybiBuZXh0O1xyXG4gIH0gZWxzZSB7XHJcbiAgICByZXR1cm4gbnVsbDtcclxuICB9XHJcbn1cclxuXHJcbi8vICMjIERheSBrZXkgZm9yIFRvZGF5XHJcbi8vIFJldHVybiB0aGUgZW51bSBrZXkgZm9yIHRvZGF5LlxyXG5mdW5jdGlvbiB0b2RheSgpIHtcclxuICBjb25zdCBpZHggPSBuZXcgRGF0ZSgpLmdldERheSgpO1xyXG4gIHJldHVybiBkYXlzS2V5c1sgaWR4IF07XHJcbn1cclxuXHJcbi8vICMjIERhdGVzIFVzZWQgYXMgVGltZXNcclxuLy8gSWYgeW91IGhhdmUgYSBEYXRlIG9iamVjdCB3aGVyZSBvbmx5IHRoZSBISDpNTSBpbmZvcm1hdGlvbiBpcyByZWxldmFudCxcclxuLy8gYG5vcm1hbGl6ZWAgd2lsbCByZXNldCB0aGUgZGF0ZSBjb21wb25lbnQgdG8gSmFuIDEsIDE5NzAgYW5kIHNoYXZlIG9mZlxyXG4vLyBhbnkgc2Vjb25kcyBhbmQgbWlsbGlzZWNvbmRzLiAoSmF2YXNjcmlwdCBkYXRlcyBhcmUgMjAzOCBzYWZlKVxyXG5leHBvcnQgZnVuY3Rpb24gbm9ybWFsaXplKCBkYXRlICkge1xyXG4gIGNvbnN0IGhvdXJzID0gZGF0ZS5nZXRIb3VycygpO1xyXG4gIGNvbnN0IG1pbnV0ZXMgPSBkYXRlLmdldE1pbnV0ZXMoKTtcclxuXHJcbiAgcmV0dXJuIG5ldyBEYXRlKCAxOTcwLCAwLCAxLCBob3VycywgbWludXRlcywgMCwgMCApLnRvSVNPU3RyaW5nKCk7XHJcbn1cclxuXHJcbi8vICMjIEhvdXJzIFNjaGVtYVxyXG4vLyBBbiBob3VycyBhcnJheSBjb250YWlucyBvYmplY3RzIHRoYXQgc3BlY2lmeSBvcGVuaW5nIGFuZCBjbG9zaW5nIHRpbWVzXHJcbi8vIGZvciBhIGRheS4gVGhlIGhvdXJzIGFycmF5IGNhbiBoYXZlIG11bHRpcGxlIGVudHJpZXMgZm9yIHRoZSBzYW1lIGRheS5cclxuLy9cclxuLy8gVGhlIG9wZW5pbmcgYW5kIGNsb3NpbmcgdGltZXMgbXVzdCBiZSBzdG9yZWQgYXMgSVNPIGNvbXBsaWFudCBkYXRlLXRpbWVcclxuLy8gc3RyaW5ncyBpbiBadWx1IHRpbWUuXHJcbi8vXHJcbi8vIGBgYFxyXG4vLyBbIHtcclxuLy8gICBcIm1vbmRheVwiLFxyXG4vLyAgIFwib3BlbnNcIjogXCIxOTcwLTAxLTAxVDA4OjMwOjAwLjAwMFpcIixcclxuLy8gICBcImNsb3Nlc1wiOiBcIjE5NzAtMDEtMDFUMTc6MzA6MDAuMDAwWlwiXHJcbi8vIH0gXVxyXG4vLyBgYGBcclxuY29uc3QgaG91cnMgPSB7XHJcbiAgdHlwZTogJ2FycmF5JyxcclxuICBpdGVtczoge1xyXG4gICAgdHlwZTogJ29iamVjdCcsXHJcbiAgICBhZGRpdGlvbmFsUHJvcGVydGllczogZmFsc2UsXHJcbiAgICBwcm9wZXJ0aWVzOiB7XHJcbiAgICAgIGRheToge1xyXG4gICAgICAgIHR5cGU6ICdzdHJpbmcnLFxyXG4gICAgICAgIGVudW06IGtleXMoIGRheXMgKVxyXG4gICAgICB9LFxyXG4gICAgICBvcGVuczoge1xyXG4gICAgICAgIHR5cGU6ICdzdHJpbmcnLFxyXG4gICAgICAgIGZvcm1hdDogJ2RhdGUtdGltZSdcclxuICAgICAgfSxcclxuICAgICAgY2xvc2VzOiB7XHJcbiAgICAgICAgdHlwZTogJ3N0cmluZycsXHJcbiAgICAgICAgZm9ybWF0OiAnZGF0ZS10aW1lJ1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG59O1xyXG5cclxuLy8gIyMgU2NoZWR1bGUgU2NoZW1hXHJcbi8vIEEgc2NoZW1hIG9iamVjdCBoYXMgc2Vhc29uIG5hbWVzIGZvciBrZXlzIGFuZCBob3VycyBhcnJheXMgZm9yIHZhbHVlcy4gVGhlXHJcbi8vIHNjaGVtYSBvYmplY3QgaGFzIGEgJ2RlZmF1bHQnIHNlYXNvbiBpbiBjYXNlIHdlIGRvbid0IGtub3cgc2Vhc29uLXNwZWNpZmljXHJcbi8vIGhvdXJzIGZvciBhIHNlcnZpY2UuXHJcbi8vXHJcbi8vIGBgYFxyXG4vLyB7XHJcbi8vICAgXCJkZWZhdWx0XCI6IC4uLixcclxuLy8gICBcIndpbnRlclwiOiAuLi5cclxuLy8gfVxyXG4vLyBgYGBcclxuY29uc3Qgc2NoZWR1bGUgPSB7XHJcbiAgdHlwZTogJ29iamVjdCcsXHJcbiAgYWRkaXRpb25hbFByb3BlcnRpZXM6IGZhbHNlLFxyXG4gIHByb3BlcnRpZXM6IHtcclxuICAgIHNjaGVkdWxlOiB7XHJcbiAgICAgIHR5cGU6ICdvYmplY3QnLFxyXG4gICAgICBwYXR0ZXJuUHJvcGVydGllczoge1xyXG4gICAgICAgICcuKic6IGhvdXJzXHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbn07XHJcblxyXG4vLyAjIFNjaGVkdWxlIE1vZGVsXHJcbi8vIFRoZSBzY2hlZHVsZSBtb2RlbCBwcm92aWRlcyBhbiBlYXN5IHdheSB0byB3b3JrIHdpdGggdGhlIHNjaGVkdWxlIGRhdGFcclxuLy8gc3RydWN0dXJlLiBJdCBpcyBub3QgaW50ZW5kZWQgdG8gYmUgY29ubmVjdGVkIHRvIGEgZGF0YWJhc2UuIEl0IGlzIG1lYW50XHJcbi8vIG9ubHkgdG8gbWFuaXB1bGF0ZSB0aGUgc3RydWN0dXJlIGJldHdlZW4gZGVzZXJpYWxpemF0aW9uIGFuZCBzZXJpYWxpemF0aW9uXHJcbi8vIG9mIGEgcmVkdXggc3RvcmUuXHJcbi8vXHJcbi8vIFRpbWVzIGZvciBlYWNoIGRheSBhcmUgc3RvcmVkIGFzIElTTy1jb21wbGlhbnQgc3RyaW5ncyBub3JtYWxpemVkIHRvIGlnbm9yZVxyXG4vLyBhbGwgc2VjdGlvbnMgYmVzaWRlcyBISDpNTSAodGhleSBhcHBlYXIgYXMgMTk3MCdzIGRhdGVzKS5cclxuZXhwb3J0IGNvbnN0IFNjaGVkdWxlID0gTW9kZWwuZXh0ZW5kKCB7XHJcbiAgc2NoZW1hOiBzY2hlZHVsZSxcclxuXHJcbiAgY29uc3RydWN0b3I6IGZ1bmN0aW9uKCBhdHRycywgb3B0aW9ucyApIHtcclxuICAgIE1vZGVsLmNhbGwoIHRoaXMsIHsgc2NoZWR1bGU6IGF0dHJzIHx8IHt9IH0sIG9wdGlvbnMgKTtcclxuICB9LFxyXG5cclxuICAvLyAjIyBBZGQgSG91cnMgdG8gU2Vhc29uXHJcbiAgLy8gQWRkIGFuIGVudHJ5IHRvIHRoZSBob3VycyBhcnJheSBmb3IgYSBzZWFzb24sIGJ5IGRlZmF1bHQgdGhlICdkZWZhdWx0J1xyXG4gIC8vIHNlYXNvbi4gSWYgYSBzcGVjaWFsIGRheSBrZXkgaXMgcHJvdmlkZWQsIGV4cGFuZCBpdCB0byBhbiBhcnJheSBvZlxyXG4gIC8vIGRheSBrZXlzLlxyXG4gIGFkZEhvdXJzSW46IGZ1bmN0aW9uKCBkYXksIG9wZW5zLCBjbG9zZXMsIG5hbWUgPSAnZGVmYXVsdCcgKSB7XHJcbiAgICBjb25zdCBzY2hlZHVsZSA9IHRoaXMuZ2V0KCAnc2NoZWR1bGUnICk7XHJcbiAgICBjb25zdCBob3VycyA9IGV4cGFuZCggZGF5ICkubWFwKCBkYXkgPT4ge1xyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIGRheSxcclxuICAgICAgICBjbG9zZXM6IG5vcm1hbGl6ZSggY2xvc2VzICksXHJcbiAgICAgICAgb3BlbnM6IG5vcm1hbGl6ZSggb3BlbnMgKVxyXG4gICAgICB9O1xyXG4gICAgfSApO1xyXG4gICAgY29uc3Qgc2Vhc29uID0gc2NoZWR1bGVbIG5hbWUgXSB8fCBbXTtcclxuICAgIHRoaXMuc2V0KCAnc2NoZWR1bGUnLCB7XHJcbiAgICAgIC4uLnNjaGVkdWxlLFxyXG4gICAgICBbIG5hbWUgXTogWyAuLi5zZWFzb24sIC4uLmhvdXJzIF1cclxuICAgIH0gKTtcclxuICB9LFxyXG5cclxuICAvLyAjIyBSZW1vdmUgSG91cnMgZnJvbSBhIFNlYXNvblxyXG4gIC8vIERlbGV0ZSBhbiBlbnRyeSBpbiB0aGUgaG91cnMgYXJhcnkgZm9yIGEgc2Vhc29uLCBieSBkZWZhdWx0IHRoZSAnZGVmYXVsdCdcclxuICAvLyBzZWFzb24uIEVudHJpZXMgYXJlIGRlbGV0ZWQgYnkgaW5kZXggaW4gdGhlIGhvdXJzIGFycmF5LlxyXG4gIGRlbEhvdXJzSW46IGZ1bmN0aW9uKCBpZHgsIG5hbWUgPSAnZGVmYXVsdCcgKSB7XHJcbiAgICBjb25zdCBzY2hlZHVsZSA9IHRoaXMuZ2V0KCAnc2NoZWR1bGUnICk7XHJcbiAgICBjb25zdCBzZWFzb24gPSBzY2hlZHVsZVsgbmFtZSBdIHx8IFtdO1xyXG5cclxuICAgIHNlYXNvbi5zcGxpY2UoIGlkeCwgMSApO1xyXG5cclxuICAgIHRoaXMuc2V0KCAnc2NoZWR1bGUnLCB7XHJcbiAgICAgIC4uLnNjaGVkdWxlLFxyXG4gICAgICBbIG5hbWUgXTogc2Vhc29uXHJcbiAgICB9ICk7XHJcbiAgfSxcclxuXHJcbiAgLy8gR2V0IHRoZSBjbG9zaW5nLXRpbWUgSVNPIHN0cmluZyBmb3IgdG9kYXkuXHJcbiAgZ2V0Q2xvc2luZ1RvZGF5KCkge1xyXG4gICAgY29uc3Qgc2Vhc29uID0gdGhpcy5nZXQoICdzY2hlZHVsZScgKS5kZWZhdWx0O1xyXG4gICAgY29uc3QgaG91cnMgPSBmaW5kKCBzZWFzb24sIHsgZGF5OiB0b2RheSgpIH0gKTtcclxuXHJcbiAgICByZXR1cm4gaG91cnMgPyBob3Vycy5jbG9zZXMgOiBudWxsO1xyXG4gIH1cclxufSApO1xyXG5cclxubWl4aW5WYWxpZGF0aW9uKCBTY2hlZHVsZSApO1xyXG4iXX0=