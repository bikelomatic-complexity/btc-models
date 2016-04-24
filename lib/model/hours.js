'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Schedule = exports.timezones = exports.days = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.nextDay = nextDay;
exports.normalize = normalize;

var _validationMixin = require('./validation-mixin');

var _momentTimezone = require('moment-timezone');

var _momentTimezone2 = _interopRequireDefault(_momentTimezone);

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
var timezones = exports.timezones = {
  'pst': { display: 'PST', longName: 'Pacific Standard Time', time: -8 },
  'pdt': { display: 'PDT', longName: 'Pacific Daylight Time', time: -7 },
  'mst': { display: 'MST', longName: 'Mountain Standard Time', time: -7 },
  'mdt': { display: 'MDT', longName: 'Mountain Daylight Time', time: -6 },
  'cst': { display: 'CST', longName: 'Central Standard Time', time: -6 },
  'cdt': { display: 'CDT', longName: 'Central Daylight Time', time: -5 },
  'est': { display: 'EST', longName: 'Eastern Standard Time', time: -5 },
  'edt': { display: 'EDT', longName: 'Eastern Daylight Time', time: -4 }
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
      },
      timezone: {
        type: 'string',
        enum: (0, _lodash.keys)(timezones)
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
  addHoursIn: function addHoursIn(day, opens, closes, timezone) {
    var name = arguments.length <= 4 || arguments[4] === undefined ? 'default' : arguments[4];

    var schedule = this.get('schedule');
    var hours = expand(day).map(function (day) {
      var june = (0, _momentTimezone2.default)("2014-06-01T12:00:00Z");
      console.log(june);
      return {
        day: day,
        closes: normalize(closes),
        opens: normalize(opens),
        timezone: timezone
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tb2RlbC9ob3Vycy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7UUFzRWdCO1FBb0JBOztBQTFGaEI7O0FBQ0E7Ozs7QUFFQTs7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUF3Qk8sSUFBTSxzQkFBTztBQUNsQixZQUFhLEVBQUUsU0FBUyxRQUFULEVBQXNCLE1BQU0sU0FBTixFQUFpQixNQUFNLFFBQU4sRUFBdEQ7QUFDQSxZQUFhLEVBQUUsU0FBUyxRQUFULEVBQXNCLE1BQU0sU0FBTixFQUFpQixNQUFNLFNBQU4sRUFBdEQ7QUFDQSxhQUFhLEVBQUUsU0FBUyxTQUFULEVBQXNCLE1BQU0sU0FBTixFQUFpQixNQUFNLFdBQU4sRUFBdEQ7QUFDQSxlQUFhLEVBQUUsU0FBUyxXQUFULEVBQXNCLE1BQU0sU0FBTixFQUFpQixNQUFNLFVBQU4sRUFBdEQ7QUFDQSxjQUFhLEVBQUUsU0FBUyxVQUFULEVBQXNCLE1BQU0sU0FBTixFQUFpQixNQUFNLFFBQU4sRUFBdEQ7QUFDQSxZQUFhLEVBQUUsU0FBUyxRQUFULEVBQXNCLE1BQU0sU0FBTixFQUFpQixNQUFNLFVBQU4sRUFBdEQ7QUFDQSxjQUFhLEVBQUUsU0FBUyxVQUFULEVBQXNCLE1BQU0sU0FBTixFQUFpQixNQUFNLFFBQU4sRUFBdEQ7O0FBRUEsYUFBYSxFQUFFLFNBQVMsU0FBVCxFQUFzQixNQUFNLFNBQU4sRUFBaUIsTUFBTSxTQUFOLEVBQXREO0FBQ0EsYUFBYSxFQUFFLFNBQVMsVUFBVCxFQUFzQixNQUFNLFNBQU4sRUFBaUIsTUFBTSxTQUFOLEVBQXREO0NBVlc7QUFZTixJQUFNLGdDQUFZO0FBQ3ZCLFNBQU8sRUFBRSxTQUFTLEtBQVQsRUFBZ0IsVUFBVSx1QkFBVixFQUFtQyxNQUFNLENBQUMsQ0FBRCxFQUFsRTtBQUNBLFNBQU8sRUFBRSxTQUFTLEtBQVQsRUFBZ0IsVUFBVSx1QkFBVixFQUFtQyxNQUFNLENBQUMsQ0FBRCxFQUFs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LFdBQU8sUUFBUSxNQUFNLE1BQU4sR0FBZSxJQUF2QixDQUpTO0dBOUNrQjtDQUFkLENBQVg7O0FBc0RiLHNDQUFpQixRQUFqQiIsImZpbGUiOiJob3Vycy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IG1peGluVmFsaWRhdGlvbiB9IGZyb20gJy4vdmFsaWRhdGlvbi1taXhpbic7XHJcbmltcG9ydCBtb21lbnQgZnJvbSAnbW9tZW50LXRpbWV6b25lJztcclxuXHJcbmltcG9ydCB7IE1vZGVsIH0gZnJvbSAnYmFja2JvbmUnO1xyXG5pbXBvcnQgXywgeyBrZXlzLCBmaW5kIH0gZnJvbSAnbG9kYXNoJztcclxuXHJcbi8vICMgTG9naWMgZm9yIFNlYXNvbnMgYW5kIEhvdXJzXHJcbi8vIEEgc2VydmljZSB1c3VhbGx5IGhhcyBwb3N0ZWQgaG91cnMgZm9yIHRoZSB3ZWVrLiBUaGUgbGlzdCBvZiBvcGVuaW5nIGFuZFxyXG4vLyBjbG9zaW5nIHRpbWVzIGZvciBlYWNoIGRheSBvZiB0aGUgd2VlayBhcmUgY29uc2lkZXJlZCAnSG91cnMnLiBEaWZmZXJlbnRcclxuLy8gZGF5cyBvZiB0aGUgd2VlayBjYW4gaGF2ZSBkaWZmZXJlbnQgb3BlbmluZyBhbmQgY2xvc2luZyB0aW1lcy4gQSBzaW5nbGVcclxuLy8gZGF5IGNhbiBoYXZlIG11bHRpcGxlIHNlZ21lbnRzIHdoZXJlIHRoZSBzZXJ2aWNlIGlzIG9wZW4gKGZvciBleGFtcGxlLFxyXG4vLyByZXN0YXVyYW50cyBtYXkgYmUgY2xvc2VkIGJldHdlZW4gbHVuY2ggYW5kIGRpbm5lcikuIEhvd2V2ZXIsIHdlIGRvbid0XHJcbi8vIHlldCBzYW5pdGl6ZSBvY2N1cmVuY2VzIHdoZXJlIHRoZXNlIG92ZXJsYXAuXHJcbi8vXHJcbi8vIFNlcnZpY2VzIGVuY291bnRlcmVkIGJ5IHRvdXJpbmcgY3ljbGlzdHMgYXJlIGxpa2VseSB0byBoYXZlIHNlYXNvbmFsIGhvdXJzLlxyXG4vLyBBICdTZWFzb24nIGhhcyBhIG5hbWUsIGFuZCBhIGxpc3Qgb2YgaG91cnMuXHJcbi8vXHJcbi8vIFRoZSBlbnRpcmUgbGlzdCBvZiBzZWFzb25hbCBob3VycyBpcyB0aGUgJ1NjaGVkdWxlJy4gRWFjaCBzZXJ2aWNlIGhhcyBhdFxyXG4vLyBsZWFzdCBhIHNjaGVkdWxlIHdpdGggYSBkZWZhdWx0IHNlYXNvbi5cclxuXHJcbi8vICMjIERheSBFbnVtZXJhdGlvblxyXG4vLyBUaGlzIGVudW0gaGFzIGEgYG5leHRgIGZpZWxkIHdoaWNoIGlzIHByb3ZpZGVkIGFzIGEgdXRpbGl0eSBmb3IgR1VJcy5cclxuLy8gVGhlIHNwZWNpYWwgd2Vla2VuZCBhbmQgd2Vla2RheSBrZXlzIGNhbiBiZSB1c2VkIGJ5IHRoZSBgZXhwYW5kYFxyXG4vLyBmdW5jdGlvbiB0byBvYnRhaW4gYSBsaXN0IG9mIHRoZSBhcHByb3ByaWF0ZSBkYXkga2V5cy5cclxuLy9cclxuLy8gVGhlIGtleXMgb2YgdGhlIGVudW0gYXJlIG9yZGVyZWQgdG8gY29ycmVzcG9uZCB3aXRoIG5ldyBEYXRlKCkuZ2V0RGF5KCkuXHJcbi8vIFVzZSBrZXlzKCBkYXlzICkgdG8gdXNlIHRoYXQgaW5kZXguXHJcbi8qZXNmbXQtaWdub3JlLXN0YXJ0Ki9cclxuZXhwb3J0IGNvbnN0IGRheXMgPSB7XHJcbiAgJ3N1bmRheSc6ICAgIHsgZGlzcGxheTogJ1N1bmRheScsICAgIHR5cGU6ICd3ZWVrZW5kJywgbmV4dDogJ21vbmRheScgICAgfSxcclxuICAnbW9uZGF5JzogICAgeyBkaXNwbGF5OiAnTW9uZGF5JywgICAgdHlwZTogJ3dlZWtkYXknLCBuZXh0OiAndHVlc2RheScgICB9LFxyXG4gICd0dWVzZGF5JzogICB7IGRpc3BsYXk6ICdUdWVzZGF5JywgICB0eXBlOiAnd2Vla2RheScsIG5leHQ6ICd3ZWRuZXNkYXknIH0sXHJcbiAgJ3dlZG5lc2RheSc6IHsgZGlzcGxheTogJ1dlZG5lc2RheScsIHR5cGU6ICd3ZWVrZGF5JywgbmV4dDogJ3RodXJzZGF5JyAgfSxcclxuICAndGh1cnNkYXknOiAgeyBkaXNwbGF5OiAnVGh1cnNkYXknLCAgdHlwZTogJ3dlZWtkYXknLCBuZXh0OiAnZnJpZGF5JyAgICB9LFxyXG4gICdmcmlkYXknOiAgICB7IGRpc3BsYXk6ICdGcmlkYXknLCAgICB0eXBlOiAnd2Vla2RheScsIG5leHQ6ICdzYXR1cmRheScgIH0sXHJcbiAgJ3NhdHVyZGF5JzogIHsgZGlzcGxheTogJ1NhdHVyZGF5JywgIHR5cGU6ICd3ZWVrZW5kJywgbmV4dDogJ3N1bmRheScgICAgfSxcclxuXHJcbiAgJ3dlZWtlbmQnOiAgIHsgZGlzcGxheTogJ1dlZWtlbmQnLCAgIHR5cGU6ICdjb21wb3NlJywgbmV4dDogJ3dlZWtkYXknICAgfSxcclxuICAnd2Vla2RheScgOiAgeyBkaXNwbGF5OiAnV2Vla2RheXMnLCAgdHlwZTogJ2NvbXBvc2UnLCBuZXh0OiAnd2Vla2VuZCcgICB9XHJcbn07XHJcbmV4cG9ydCBjb25zdCB0aW1lem9uZXMgPSB7XHJcbiAgJ3BzdCc6IHsgZGlzcGxheTogJ1BTVCcsIGxvbmdOYW1lOiAnUGFjaWZpYyBTdGFuZGFyZCBUaW1lJywgdGltZTogLTggfSxcclxuICAncGR0JzogeyBkaXNwbGF5OiAnUERUJywgbG9uZ05hbWU6ICdQYWNpZmljIERheWxpZ2h0IFRpbWUnLCB0aW1lOiAtNyB9LFxyXG4gICdtc3QnOiB7IGRpc3BsYXk6ICdNU1QnLCBsb25nTmFtZTogJ01vdW50YWluIFN0YW5kYXJkIFRpbWUnLCB0aW1lOiAtNyB9LFxyXG4gICdtZHQnOiB7IGRpc3BsYXk6ICdNRFQnLCBsb25nTmFtZTogJ01vdW50YWluIERheWxpZ2h0IFRpbWUnLCB0aW1lOiAtNiB9LFxyXG4gICdjc3QnOiB7IGRpc3BsYXk6ICdDU1QnLCBsb25nTmFtZTogJ0NlbnRyYWwgU3RhbmRhcmQgVGltZScsIHRpbWU6IC02IH0sXHJcbiAgJ2NkdCc6IHsgZGlzcGxheTogJ0NEVCcsIGxvbmdOYW1lOiAnQ2VudHJhbCBEYXlsaWdodCBUaW1lJywgdGltZTogLTUgfSxcclxuICAnZXN0JzogeyBkaXNwbGF5OiAnRVNUJywgbG9uZ05hbWU6ICdFYXN0ZXJuIFN0YW5kYXJkIFRpbWUnLCB0aW1lOiAtNSB9LFxyXG4gICdlZHQnOiB7IGRpc3BsYXk6ICdFRFQnLCBsb25nTmFtZTogJ0Vhc3Rlcm4gRGF5bGlnaHQgVGltZScsIHRpbWU6IC00IH1cclxufVxyXG4vKmVzZm10LWlnbm9yZS1lbmQqL1xyXG5cclxuY29uc3QgZGF5c0tleXMgPSBrZXlzKCBkYXlzICk7XHJcblxyXG4vLyAjIyBFeHBhbmQgU3BlY2lhbCBLZXlzXHJcbi8vIEdpdmVuICd3ZWVrZW5kJyBvciAnd2Vla2RheScsIHRoaXMgZnVuY3Rpb24gd2lsbCByZXR1cm4gYSBsaXN0IG9mIHRoZVxyXG4vLyByZWxldmFudCBlbnVtIGtleXMuIElmIGEgcmVndWxhciBrZXkgaXMgcHJvdmlkZWQsIHBhc3MgaXQgdGhyb3VnaC5cclxuZnVuY3Rpb24gZXhwYW5kKCBkYXkgKSB7XHJcbiAgc3dpdGNoICggZGF5ICkge1xyXG4gIGNhc2UgJ3dlZWtlbmQnOlxyXG4gIGNhc2UgJ3dlZWtkYXknOlxyXG4gICAgcmV0dXJuIF8oIGRheXMgKS5waWNrQnkoIHZhbHVlID0+IHZhbHVlLnR5cGUgPT09IGRheSApLmtleXMoKTtcclxuICBkZWZhdWx0OlxyXG4gICAgcmV0dXJuIFsgZGF5IF07XHJcbiAgfVxyXG59XHJcblxyXG4vLyAjIyBHZXQgdGhlIE5leHQgRGF5IGluIFNlcXVlbmNlXHJcbi8vIEdpdmVuIGEgZGF5IG9mIHRoZSB3ZWVrLCByZXR1cm4gdGhlIG5leHQgZGF5IGluIHNlcXVlbmNlLiBTYXR1cmRheSB3cmFwc1xyXG4vLyBhcm91bmQgdG8gU3VuZGF5XHJcbmV4cG9ydCBmdW5jdGlvbiBuZXh0RGF5KCBkYXkgKSB7XHJcbiAgY29uc3QgbmV4dCA9IGRheXNbIGRheSBdLm5leHQ7XHJcbiAgaWYgKCBuZXh0ICkge1xyXG4gICAgcmV0dXJuIG5leHQ7XHJcbiAgfSBlbHNlIHtcclxuICAgIHJldHVybiBudWxsO1xyXG4gIH1cclxufVxyXG5cclxuLy8gIyMgRGF5IGtleSBmb3IgVG9kYXlcclxuLy8gUmV0dXJuIHRoZSBlbnVtIGtleSBmb3IgdG9kYXkuXHJcbmZ1bmN0aW9uIHRvZGF5KCkge1xyXG4gIGNvbnN0IGlkeCA9IG5ldyBEYXRlKCkuZ2V0RGF5KCk7XHJcbiAgcmV0dXJuIGRheXNLZXlzWyBpZHggXTtcclxufVxyXG5cclxuLy8gIyMgRGF0ZXMgVXNlZCBhcyBUaW1lc1xyXG4vLyBJZiB5b3UgaGF2ZSBhIERhdGUgb2JqZWN0IHdoZXJlIG9ubHkgdGhlIEhIOk1NIGluZm9ybWF0aW9uIGlzIHJlbGV2YW50LFxyXG4vLyBgbm9ybWFsaXplYCB3aWxsIHJlc2V0IHRoZSBkYXRlIGNvbXBvbmVudCB0byBKYW4gMSwgMTk3MCBhbmQgc2hhdmUgb2ZmXHJcbi8vIGFueSBzZWNvbmRzIGFuZCBtaWxsaXNlY29uZHMuIChKYXZhc2NyaXB0IGRhdGVzIGFyZSAyMDM4IHNhZmUpXHJcbmV4cG9ydCBmdW5jdGlvbiBub3JtYWxpemUoIGRhdGUgKSB7XHJcbiAgY29uc3QgaG91cnMgPSBkYXRlLmdldEhvdXJzKCk7XHJcbiAgY29uc3QgbWludXRlcyA9IGRhdGUuZ2V0TWludXRlcygpO1xyXG5cclxuICByZXR1cm4gbmV3IERhdGUoIDE5NzAsIDAsIDEsIGhvdXJzLCBtaW51dGVzLCAwLCAwICkudG9JU09TdHJpbmcoKTtcclxufVxyXG5cclxuLy8gIyMgSG91cnMgU2NoZW1hXHJcbi8vIEFuIGhvdXJzIGFycmF5IGNvbnRhaW5zIG9iamVjdHMgdGhhdCBzcGVjaWZ5IG9wZW5pbmcgYW5kIGNsb3NpbmcgdGltZXNcclxuLy8gZm9yIGEgZGF5LiBUaGUgaG91cnMgYXJyYXkgY2FuIGhhdmUgbXVsdGlwbGUgZW50cmllcyBmb3IgdGhlIHNhbWUgZGF5LlxyXG4vL1xyXG4vLyBUaGUgb3BlbmluZyBhbmQgY2xvc2luZyB0aW1lcyBtdXN0IGJlIHN0b3JlZCBhcyBJU08gY29tcGxpYW50IGRhdGUtdGltZVxyXG4vLyBzdHJpbmdzIGluIFp1bHUgdGltZS5cclxuLy9cclxuLy8gYGBgXHJcbi8vIFsge1xyXG4vLyAgIFwibW9uZGF5XCIsXHJcbi8vICAgXCJvcGVuc1wiOiBcIjE5NzAtMDEtMDFUMDg6MzA6MDAuMDAwWlwiLFxyXG4vLyAgIFwiY2xvc2VzXCI6IFwiMTk3MC0wMS0wMVQxNzozMDowMC4wMDBaXCJcclxuLy8gfSBdXHJcbi8vIGBgYFxyXG5jb25zdCBob3VycyA9IHtcclxuICB0eXBlOiAnYXJyYXknLFxyXG4gIGl0ZW1zOiB7XHJcbiAgICB0eXBlOiAnb2JqZWN0JyxcclxuICAgIGFkZGl0aW9uYWxQcm9wZXJ0aWVzOiBmYWxzZSxcclxuICAgIHByb3BlcnRpZXM6IHtcclxuICAgICAgZGF5OiB7XHJcbiAgICAgICAgdHlwZTogJ3N0cmluZycsXHJcbiAgICAgICAgZW51bToga2V5cyggZGF5cyApXHJcbiAgICAgIH0sXHJcbiAgICAgIG9wZW5zOiB7XHJcbiAgICAgICAgdHlwZTogJ3N0cmluZycsXHJcbiAgICAgICAgZm9ybWF0OiAnZGF0ZS10aW1lJ1xyXG4gICAgICB9LFxyXG4gICAgICBjbG9zZXM6IHtcclxuICAgICAgICB0eXBlOiAnc3RyaW5nJyxcclxuICAgICAgICBmb3JtYXQ6ICdkYXRlLXRpbWUnXHJcbiAgICAgIH0sXHJcbiAgICAgIHRpbWV6b25lOiB7XHJcbiAgICAgICAgdHlwZTogJ3N0cmluZycsXHJcbiAgICAgICAgZW51bToga2V5cyggdGltZXpvbmVzIClcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxufTtcclxuXHJcbi8vICMjIFNjaGVkdWxlIFNjaGVtYVxyXG4vLyBBIHNjaGVtYSBvYmplY3QgaGFzIHNlYXNvbiBuYW1lcyBmb3Iga2V5cyBhbmQgaG91cnMgYXJyYXlzIGZvciB2YWx1ZXMuIFRoZVxyXG4vLyBzY2hlbWEgb2JqZWN0IGhhcyBhICdkZWZhdWx0JyBzZWFzb24gaW4gY2FzZSB3ZSBkb24ndCBrbm93IHNlYXNvbi1zcGVjaWZpY1xyXG4vLyBob3VycyBmb3IgYSBzZXJ2aWNlLlxyXG4vL1xyXG4vLyBgYGBcclxuLy8ge1xyXG4vLyAgIFwiZGVmYXVsdFwiOiAuLi4sXHJcbi8vICAgXCJ3aW50ZXJcIjogLi4uXHJcbi8vIH1cclxuLy8gYGBgXHJcbmNvbnN0IHNjaGVkdWxlID0ge1xyXG4gIHR5cGU6ICdvYmplY3QnLFxyXG4gIGFkZGl0aW9uYWxQcm9wZXJ0aWVzOiBmYWxzZSxcclxuICBwcm9wZXJ0aWVzOiB7XHJcbiAgICBzY2hlZHVsZToge1xyXG4gICAgICB0eXBlOiAnb2JqZWN0JyxcclxuICAgICAgcGF0dGVyblByb3BlcnRpZXM6IHtcclxuICAgICAgICAnLionOiBob3Vyc1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG59O1xyXG5cclxuLy8gIyBTY2hlZHVsZSBNb2RlbFxyXG4vLyBUaGUgc2NoZWR1bGUgbW9kZWwgcHJvdmlkZXMgYW4gZWFzeSB3YXkgdG8gd29yayB3aXRoIHRoZSBzY2hlZHVsZSBkYXRhXHJcbi8vIHN0cnVjdHVyZS4gSXQgaXMgbm90IGludGVuZGVkIHRvIGJlIGNvbm5lY3RlZCB0byBhIGRhdGFiYXNlLiBJdCBpcyBtZWFudFxyXG4vLyBvbmx5IHRvIG1hbmlwdWxhdGUgdGhlIHN0cnVjdHVyZSBiZXR3ZWVuIGRlc2VyaWFsaXphdGlvbiBhbmQgc2VyaWFsaXphdGlvblxyXG4vLyBvZiBhIHJlZHV4IHN0b3JlLlxyXG4vL1xyXG4vLyBUaW1lcyBmb3IgZWFjaCBkYXkgYXJlIHN0b3JlZCBhcyBJU08tY29tcGxpYW50IHN0cmluZ3Mgbm9ybWFsaXplZCB0byBpZ25vcmVcclxuLy8gYWxsIHNlY3Rpb25zIGJlc2lkZXMgSEg6TU0gKHRoZXkgYXBwZWFyIGFzIDE5NzAncyBkYXRlcykuXHJcbmV4cG9ydCBjb25zdCBTY2hlZHVsZSA9IE1vZGVsLmV4dGVuZCgge1xyXG4gIHNjaGVtYTogc2NoZWR1bGUsXHJcblxyXG4gIGNvbnN0cnVjdG9yOiBmdW5jdGlvbiggYXR0cnMsIG9wdGlvbnMgKSB7XHJcbiAgICBNb2RlbC5jYWxsKCB0aGlzLCB7IHNjaGVkdWxlOiBhdHRycyB8fCB7fSB9LCBvcHRpb25zICk7XHJcbiAgfSxcclxuXHJcbiAgLy8gIyMgQWRkIEhvdXJzIHRvIFNlYXNvblxyXG4gIC8vIEFkZCBhbiBlbnRyeSB0byB0aGUgaG91cnMgYXJyYXkgZm9yIGEgc2Vhc29uLCBieSBkZWZhdWx0IHRoZSAnZGVmYXVsdCdcclxuICAvLyBzZWFzb24uIElmIGEgc3BlY2lhbCBkYXkga2V5IGlzIHByb3ZpZGVkLCBleHBhbmQgaXQgdG8gYW4gYXJyYXkgb2ZcclxuICAvLyBkYXkga2V5cy5cclxuICBhZGRIb3Vyc0luOiBmdW5jdGlvbiggZGF5LCBvcGVucywgY2xvc2VzLCB0aW1lem9uZSwgbmFtZSA9ICdkZWZhdWx0JyApIHtcclxuICAgIGNvbnN0IHNjaGVkdWxlID0gdGhpcy5nZXQoICdzY2hlZHVsZScgKTtcclxuICAgIGNvbnN0IGhvdXJzID0gZXhwYW5kKCBkYXkgKS5tYXAoIGRheSA9PiB7XHJcbiAgICAgIHZhciBqdW5lID0gbW9tZW50KFwiMjAxNC0wNi0wMVQxMjowMDowMFpcIik7XHJcbiAgICAgIGNvbnNvbGUubG9nKGp1bmUpO1xyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIGRheSxcclxuICAgICAgICBjbG9zZXM6IG5vcm1hbGl6ZSggY2xvc2VzICksXHJcbiAgICAgICAgb3BlbnM6IG5vcm1hbGl6ZSggb3BlbnMgKSxcclxuICAgICAgICB0aW1lem9uZVxyXG4gICAgICB9O1xyXG4gICAgfSApO1xyXG4gICAgY29uc3Qgc2Vhc29uID0gc2NoZWR1bGVbIG5hbWUgXSB8fCBbXTtcclxuICAgIHRoaXMuc2V0KCAnc2NoZWR1bGUnLCB7XHJcbiAgICAgIC4uLnNjaGVkdWxlLFxyXG4gICAgICBbIG5hbWUgXTogWyAuLi5zZWFzb24sIC4uLmhvdXJzIF1cclxuICAgIH0gKTtcclxuICB9LFxyXG5cclxuICAvLyAjIyBSZW1vdmUgSG91cnMgZnJvbSBhIFNlYXNvblxyXG4gIC8vIERlbGV0ZSBhbiBlbnRyeSBpbiB0aGUgaG91cnMgYXJhcnkgZm9yIGEgc2Vhc29uLCBieSBkZWZhdWx0IHRoZSAnZGVmYXVsdCdcclxuICAvLyBzZWFzb24uIEVudHJpZXMgYXJlIGRlbGV0ZWQgYnkgaW5kZXggaW4gdGhlIGhvdXJzIGFycmF5LlxyXG4gIGRlbEhvdXJzSW46IGZ1bmN0aW9uKCBpZHgsIG5hbWUgPSAnZGVmYXVsdCcgKSB7XHJcbiAgICBjb25zdCBzY2hlZHVsZSA9IHRoaXMuZ2V0KCAnc2NoZWR1bGUnICk7XHJcbiAgICBjb25zdCBzZWFzb24gPSBzY2hlZHVsZVsgbmFtZSBdIHx8IFtdO1xyXG5cclxuICAgIHNlYXNvbi5zcGxpY2UoIGlkeCwgMSApO1xyXG5cclxuICAgIHRoaXMuc2V0KCAnc2NoZWR1bGUnLCB7XHJcbiAgICAgIC4uLnNjaGVkdWxlLFxyXG4gICAgICBbIG5hbWUgXTogc2Vhc29uXHJcbiAgICB9ICk7XHJcbiAgfSxcclxuXHJcbiAgLy8gR2V0IHRoZSBjbG9zaW5nLXRpbWUgSVNPIHN0cmluZyBmb3IgdG9kYXkuXHJcbiAgZ2V0Q2xvc2luZ1RvZGF5KCkge1xyXG4gICAgY29uc3Qgc2Vhc29uID0gdGhpcy5nZXQoICdzY2hlZHVsZScgKS5kZWZhdWx0O1xyXG4gICAgY29uc3QgaG91cnMgPSBmaW5kKCBzZWFzb24sIHsgZGF5OiB0b2RheSgpIH0gKTtcclxuXHJcbiAgICByZXR1cm4gaG91cnMgPyBob3Vycy5jbG9zZXMgOiBudWxsO1xyXG4gIH1cclxufSApO1xyXG5cclxubWl4aW5WYWxpZGF0aW9uKCBTY2hlZHVsZSApO1xyXG4iXX0=