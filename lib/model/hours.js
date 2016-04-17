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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tb2RlbC9ob3Vycy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7UUEyRGdCO1FBb0JBOztBQS9FaEI7O0FBRUE7O0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBd0JPLElBQU0sc0JBQU87QUFDbEIsWUFBYSxFQUFFLFNBQVMsUUFBVCxFQUFzQixNQUFNLFNBQU4sRUFBaUIsTUFBTSxRQUFOLEVBQXREO0FBQ0EsWUFBYSxFQUFFLFNBQVMsUUFBVCxFQUFzQixNQUFNLFNBQU4sRUFBaUIsTUFBTSxTQUFOLEVBQXREO0FBQ0EsYUFBYSxFQUFFLFNBQVMsU0FBVCxFQUFzQixNQUFNLFNBQU4sRUFBaUIsTUFBTSxXQUFOLEVBQXREO0FBQ0EsZUFBYSxFQUFFLFNBQVMsV0FBVCxFQUFzQixNQUFNLFNBQU4sRUFBaUIsTUFBTSxVQUFOLEVBQXREO0FBQ0EsY0FBYSxFQUFFLFNBQVMsVUFBVCxFQUFzQixNQUFNLFNBQU4sRUFBaUIsTUFBTSxRQUFOLEVBQXREO0FBQ0EsWUFBYSxFQUFFLFNBQVMsUUFBVCxFQUFzQixNQUFNLFNBQU4sRUFBaUIsTUFBTSxVQUFOLEVBQXREO0FBQ0EsY0FBYSxFQUFFLFNBQVMsVUFBVCxFQUFzQixNQUFNLFNBQU4sRUFBaUIsTUFBTSxRQUFOLEVBQXREOztBQUVBLGFBQWEsRUFBRSxTQUFTLFNBQVQsRUFBc0IsTUFBTSxTQUFOLEVBQWlCLE1BQU0sU0FBTixFQUF0RDtBQUNBLGFBQWEsRUFBRSxTQUFTLFVBQVQsRUFBc0IsTUFBTSxTQUFOLEVBQWlCLE1BQU0sU0FBTixFQUF0RDtDQVZXOzs7QUFjYixJQUFNLFdBQVcsa0JBQU0sSUFBTixDQUFYOzs7OztBQUtOLFNBQVMsTUFBVCxDQUFpQixHQUFqQixFQUF1QjtBQUNyQixVQUFTLEdBQVQ7QUFDQSxTQUFLLFNBQUwsQ0FEQTtBQUVBLFNBQUssU0FBTDtBQUNFLGFBQU8sc0JBQUcsSUFBSCxFQUFVLE1BQVYsQ0FBa0I7ZUFB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Q0ssOEJBQ0QsTUFBUSxRQUZaLEVBTjRDO0dBQWxDOzs7QUFhWiw4Q0FBa0I7QUFDaEIsUUFBTSxTQUFTLEtBQUssR0FBTCxDQUFVLFVBQVYsRUFBdUIsT0FBdkIsQ0FEQztBQUVoQixRQUFNLFFBQVEsa0JBQU0sTUFBTixFQUFjLEVBQUUsS0FBSyxPQUFMLEVBQWhCLENBQVIsQ0FGVTs7QUFJaEIsV0FBTyxRQUFRLE1BQU0sTUFBTixHQUFlLElBQXZCLENBSlM7R0EzQ2tCO0NBQWQsQ0FBWDs7QUFtRGIsc0NBQWlCLFFBQWpCIiwiZmlsZSI6ImhvdXJzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgbWl4aW5WYWxpZGF0aW9uIH0gZnJvbSAnLi92YWxpZGF0aW9uLW1peGluJztcclxuXHJcbmltcG9ydCB7IE1vZGVsIH0gZnJvbSAnYmFja2JvbmUnO1xyXG5pbXBvcnQgXywgeyBrZXlzLCBmaW5kIH0gZnJvbSAnbG9kYXNoJztcclxuXHJcbi8vICMgTG9naWMgZm9yIFNlYXNvbnMgYW5kIEhvdXJzXHJcbi8vIEEgc2VydmljZSB1c3VhbGx5IGhhcyBwb3N0ZWQgaG91cnMgZm9yIHRoZSB3ZWVrLiBUaGUgbGlzdCBvZiBvcGVuaW5nIGFuZFxyXG4vLyBjbG9zaW5nIHRpbWVzIGZvciBlYWNoIGRheSBvZiB0aGUgd2VlayBhcmUgY29uc2lkZXJlZCAnSG91cnMnLiBEaWZmZXJlbnRcclxuLy8gZGF5cyBvZiB0aGUgd2VlayBjYW4gaGF2ZSBkaWZmZXJlbnQgb3BlbmluZyBhbmQgY2xvc2luZyB0aW1lcy4gQSBzaW5nbGVcclxuLy8gZGF5IGNhbiBoYXZlIG11bHRpcGxlIHNlZ21lbnRzIHdoZXJlIHRoZSBzZXJ2aWNlIGlzIG9wZW4gKGZvciBleGFtcGxlLFxyXG4vLyByZXN0YXVyYW50cyBtYXkgYmUgY2xvc2VkIGJldHdlZW4gbHVuY2ggYW5kIGRpbm5lcikuIEhvd2V2ZXIsIHdlIGRvbid0XHJcbi8vIHlldCBzYW5pdGl6ZSBvY2N1cmVuY2VzIHdoZXJlIHRoZXNlIG92ZXJsYXAuXHJcbi8vXHJcbi8vIFNlcnZpY2VzIGVuY291bnRlcmVkIGJ5IHRvdXJpbmcgY3ljbGlzdHMgYXJlIGxpa2VseSB0byBoYXZlIHNlYXNvbmFsIGhvdXJzLlxyXG4vLyBBICdTZWFzb24nIGhhcyBhIG5hbWUsIGFuZCBhIGxpc3Qgb2YgaG91cnMuXHJcbi8vXHJcbi8vIFRoZSBlbnRpcmUgbGlzdCBvZiBzZWFzb25hbCBob3VycyBpcyB0aGUgJ1NjaGVkdWxlJy4gRWFjaCBzZXJ2aWNlIGhhcyBhdFxyXG4vLyBsZWFzdCBhIHNjaGVkdWxlIHdpdGggYSBkZWZhdWx0IHNlYXNvbi5cclxuXHJcbi8vICMjIERheSBFbnVtZXJhdGlvblxyXG4vLyBUaGlzIGVudW0gaGFzIGEgYG5leHRgIGZpZWxkIHdoaWNoIGlzIHByb3ZpZGVkIGFzIGEgdXRpbGl0eSBmb3IgR1VJcy5cclxuLy8gVGhlIHNwZWNpYWwgd2Vla2VuZCBhbmQgd2Vla2RheSBrZXlzIGNhbiBiZSB1c2VkIGJ5IHRoZSBgZXhwYW5kYFxyXG4vLyBmdW5jdGlvbiB0byBvYnRhaW4gYSBsaXN0IG9mIHRoZSBhcHByb3ByaWF0ZSBkYXkga2V5cy5cclxuLy9cclxuLy8gVGhlIGtleXMgb2YgdGhlIGVudW0gYXJlIG9yZGVyZWQgdG8gY29ycmVzcG9uZCB3aXRoIG5ldyBEYXRlKCkuZ2V0RGF5KCkuXHJcbi8vIFVzZSBrZXlzKCBkYXlzICkgdG8gdXNlIHRoYXQgaW5kZXguXHJcbi8qZXNmbXQtaWdub3JlLXN0YXJ0Ki9cclxuZXhwb3J0IGNvbnN0IGRheXMgPSB7XHJcbiAgJ3N1bmRheSc6ICAgIHsgZGlzcGxheTogJ1N1bmRheScsICAgIHR5cGU6ICd3ZWVrZW5kJywgbmV4dDogJ21vbmRheScgICAgfSxcclxuICAnbW9uZGF5JzogICAgeyBkaXNwbGF5OiAnTW9uZGF5JywgICAgdHlwZTogJ3dlZWtkYXknLCBuZXh0OiAndHVlc2RheScgICB9LFxyXG4gICd0dWVzZGF5JzogICB7IGRpc3BsYXk6ICdUdWVzZGF5JywgICB0eXBlOiAnd2Vla2RheScsIG5leHQ6ICd3ZWRuZXNkYXknIH0sXHJcbiAgJ3dlZG5lc2RheSc6IHsgZGlzcGxheTogJ1dlZG5lc2RheScsIHR5cGU6ICd3ZWVrZGF5JywgbmV4dDogJ3RodXJzZGF5JyAgfSxcclxuICAndGh1cnNkYXknOiAgeyBkaXNwbGF5OiAnVGh1cnNkYXknLCAgdHlwZTogJ3dlZWtkYXknLCBuZXh0OiAnZnJpZGF5JyAgICB9LFxyXG4gICdmcmlkYXknOiAgICB7IGRpc3BsYXk6ICdGcmlkYXknLCAgICB0eXBlOiAnd2Vla2RheScsIG5leHQ6ICdzYXR1cmRheScgIH0sXHJcbiAgJ3NhdHVyZGF5JzogIHsgZGlzcGxheTogJ1NhdHVyZGF5JywgIHR5cGU6ICd3ZWVrZW5kJywgbmV4dDogJ3N1bmRheScgICAgfSxcclxuXHJcbiAgJ3dlZWtlbmQnOiAgIHsgZGlzcGxheTogJ1dlZWtlbmQnLCAgIHR5cGU6ICdjb21wb3NlJywgbmV4dDogJ3dlZWtkYXknICAgfSxcclxuICAnd2Vla2RheScgOiAgeyBkaXNwbGF5OiAnV2Vla2RheXMnLCAgdHlwZTogJ2NvbXBvc2UnLCBuZXh0OiAnd2Vla2VuZCcgICB9XHJcbn07XHJcbi8qZXNmbXQtaWdub3JlLWVuZCovXHJcblxyXG5jb25zdCBkYXlzS2V5cyA9IGtleXMoIGRheXMgKTtcclxuXHJcbi8vICMjIEV4cGFuZCBTcGVjaWFsIEtleXNcclxuLy8gR2l2ZW4gJ3dlZWtlbmQnIG9yICd3ZWVrZGF5JywgdGhpcyBmdW5jdGlvbiB3aWxsIHJldHVybiBhIGxpc3Qgb2YgdGhlXHJcbi8vIHJlbGV2YW50IGVudW0ga2V5cy4gSWYgYSByZWd1bGFyIGtleSBpcyBwcm92aWRlZCwgcGFzcyBpdCB0aHJvdWdoLlxyXG5mdW5jdGlvbiBleHBhbmQoIGRheSApIHtcclxuICBzd2l0Y2ggKCBkYXkgKSB7XHJcbiAgY2FzZSAnd2Vla2VuZCc6XHJcbiAgY2FzZSAnd2Vla2RheSc6XHJcbiAgICByZXR1cm4gXyggZGF5cyApLnBpY2tCeSggdmFsdWUgPT4gdmFsdWUudHlwZSA9PT0gZGF5ICkua2V5cygpO1xyXG4gIGRlZmF1bHQ6XHJcbiAgICByZXR1cm4gWyBkYXkgXTtcclxuICB9XHJcbn1cclxuXHJcbi8vICMjIEdldCB0aGUgTmV4dCBEYXkgaW4gU2VxdWVuY2VcclxuLy8gR2l2ZW4gYSBkYXkgb2YgdGhlIHdlZWssIHJldHVybiB0aGUgbmV4dCBkYXkgaW4gc2VxdWVuY2UuIFNhdHVyZGF5IHdyYXBzXHJcbi8vIGFyb3VuZCB0byBTdW5kYXlcclxuZXhwb3J0IGZ1bmN0aW9uIG5leHREYXkoIGRheSApIHtcclxuICBjb25zdCBuZXh0ID0gZGF5c1sgZGF5IF0ubmV4dDtcclxuICBpZiAoIG5leHQgKSB7XHJcbiAgICByZXR1cm4gbmV4dDtcclxuICB9IGVsc2Uge1xyXG4gICAgcmV0dXJuIG51bGw7XHJcbiAgfVxyXG59XHJcblxyXG4vLyAjIyBEYXkga2V5IGZvciBUb2RheVxyXG4vLyBSZXR1cm4gdGhlIGVudW0ga2V5IGZvciB0b2RheS5cclxuZnVuY3Rpb24gdG9kYXkoKSB7XHJcbiAgY29uc3QgaWR4ID0gbmV3IERhdGUoKS5nZXREYXkoKTtcclxuICByZXR1cm4gZGF5c0tleXNbIGlkeCBdO1xyXG59XHJcblxyXG4vLyAjIyBEYXRlcyBVc2VkIGFzIFRpbWVzXHJcbi8vIElmIHlvdSBoYXZlIGEgRGF0ZSBvYmplY3Qgd2hlcmUgb25seSB0aGUgSEg6TU0gaW5mb3JtYXRpb24gaXMgcmVsZXZhbnQsXHJcbi8vIGBub3JtYWxpemVgIHdpbGwgcmVzZXQgdGhlIGRhdGUgY29tcG9uZW50IHRvIEphbiAxLCAxOTcwIGFuZCBzaGF2ZSBvZmZcclxuLy8gYW55IHNlY29uZHMgYW5kIG1pbGxpc2Vjb25kcy4gKEphdmFzY3JpcHQgZGF0ZXMgYXJlIDIwMzggc2FmZSlcclxuZXhwb3J0IGZ1bmN0aW9uIG5vcm1hbGl6ZSggZGF0ZSApIHtcclxuICBjb25zdCBob3VycyA9IGRhdGUuZ2V0SG91cnMoKTtcclxuICBjb25zdCBtaW51dGVzID0gZGF0ZS5nZXRNaW51dGVzKCk7XHJcblxyXG4gIHJldHVybiBuZXcgRGF0ZSggMTk3MCwgMCwgMSwgaG91cnMsIG1pbnV0ZXMsIDAsIDAgKS50b0lTT1N0cmluZygpO1xyXG59XHJcblxyXG4vLyAjIyBIb3VycyBTY2hlbWFcclxuLy8gQW4gaG91cnMgYXJyYXkgY29udGFpbnMgb2JqZWN0cyB0aGF0IHNwZWNpZnkgb3BlbmluZyBhbmQgY2xvc2luZyB0aW1lc1xyXG4vLyBmb3IgYSBkYXkuIFRoZSBob3VycyBhcnJheSBjYW4gaGF2ZSBtdWx0aXBsZSBlbnRyaWVzIGZvciB0aGUgc2FtZSBkYXkuXHJcbi8vXHJcbi8vIFRoZSBvcGVuaW5nIGFuZCBjbG9zaW5nIHRpbWVzIG11c3QgYmUgc3RvcmVkIGFzIElTTyBjb21wbGlhbnQgZGF0ZS10aW1lXHJcbi8vIHN0cmluZ3MgaW4gWnVsdSB0aW1lLlxyXG4vL1xyXG4vLyBgYGBcclxuLy8gWyB7XHJcbi8vICAgXCJtb25kYXlcIixcclxuLy8gICBcIm9wZW5zXCI6IFwiMTk3MC0wMS0wMVQwODozMDowMC4wMDBaXCIsXHJcbi8vICAgXCJjbG9zZXNcIjogXCIxOTcwLTAxLTAxVDE3OjMwOjAwLjAwMFpcIlxyXG4vLyB9IF1cclxuLy8gYGBgXHJcbmNvbnN0IGhvdXJzID0ge1xyXG4gIHR5cGU6ICdhcnJheScsXHJcbiAgaXRlbXM6IHtcclxuICAgIHR5cGU6ICdvYmplY3QnLFxyXG4gICAgYWRkaXRpb25hbFByb3BlcnRpZXM6IGZhbHNlLFxyXG4gICAgcHJvcGVydGllczoge1xyXG4gICAgICBkYXk6IHtcclxuICAgICAgICB0eXBlOiAnc3RyaW5nJyxcclxuICAgICAgICBlbnVtOiBrZXlzKCBkYXlzIClcclxuICAgICAgfSxcclxuICAgICAgb3BlbnM6IHtcclxuICAgICAgICB0eXBlOiAnc3RyaW5nJyxcclxuICAgICAgICBmb3JtYXQ6ICdkYXRlLXRpbWUnXHJcbiAgICAgIH0sXHJcbiAgICAgIGNsb3Nlczoge1xyXG4gICAgICAgIHR5cGU6ICdzdHJpbmcnLFxyXG4gICAgICAgIGZvcm1hdDogJ2RhdGUtdGltZSdcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxufTtcclxuXHJcbi8vICMjIFNjaGVkdWxlIFNjaGVtYVxyXG4vLyBBIHNjaGVtYSBvYmplY3QgaGFzIHNlYXNvbiBuYW1lcyBmb3Iga2V5cyBhbmQgaG91cnMgYXJyYXlzIGZvciB2YWx1ZXMuIFRoZVxyXG4vLyBzY2hlbWEgb2JqZWN0IGhhcyBhICdkZWZhdWx0JyBzZWFzb24gaW4gY2FzZSB3ZSBkb24ndCBrbm93IHNlYXNvbi1zcGVjaWZpY1xyXG4vLyBob3VycyBmb3IgYSBzZXJ2aWNlLlxyXG4vL1xyXG4vLyBgYGBcclxuLy8ge1xyXG4vLyAgIFwiZGVmYXVsdFwiOiAuLi4sXHJcbi8vICAgXCJ3aW50ZXJcIjogLi4uXHJcbi8vIH1cclxuLy8gYGBgXHJcbmNvbnN0IHNjaGVkdWxlID0ge1xyXG4gIHR5cGU6ICdvYmplY3QnLFxyXG4gIGFkZGl0aW9uYWxQcm9wZXJ0aWVzOiBmYWxzZSxcclxuICBwcm9wZXJ0aWVzOiB7XHJcbiAgICBzY2hlZHVsZToge1xyXG4gICAgICB0eXBlOiAnb2JqZWN0JyxcclxuICAgICAgcGF0dGVyblByb3BlcnRpZXM6IHtcclxuICAgICAgICAnLionOiBob3Vyc1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG59O1xyXG5cclxuLy8gIyBTY2hlZHVsZSBNb2RlbFxyXG4vLyBUaGUgc2NoZWR1bGUgbW9kZWwgcHJvdmlkZXMgYW4gZWFzeSB3YXkgdG8gd29yayB3aXRoIHRoZSBzY2hlZHVsZSBkYXRhXHJcbi8vIHN0cnVjdHVyZS4gSXQgaXMgbm90IGludGVuZGVkIHRvIGJlIGNvbm5lY3RlZCB0byBhIGRhdGFiYXNlLiBJdCBpcyBtZWFudFxyXG4vLyBvbmx5IHRvIG1hbmlwdWxhdGUgdGhlIHN0cnVjdHVyZSBiZXR3ZWVuIGRlc2VyaWFsaXphdGlvbiBhbmQgc2VyaWFsaXphdGlvblxyXG4vLyBvZiBhIHJlZHV4IHN0b3JlLlxyXG4vL1xyXG4vLyBUaW1lcyBmb3IgZWFjaCBkYXkgYXJlIHN0b3JlZCBhcyBJU08tY29tcGxpYW50IHN0cmluZ3Mgbm9ybWFsaXplZCB0byBpZ25vcmVcclxuLy8gYWxsIHNlY3Rpb25zIGJlc2lkZXMgSEg6TU0gKHRoZXkgYXBwZWFyIGFzIDE5NzAncyBkYXRlcykuXHJcbmV4cG9ydCBjb25zdCBTY2hlZHVsZSA9IE1vZGVsLmV4dGVuZCgge1xyXG4gIHNjaGVtYTogc2NoZWR1bGUsXHJcblxyXG4gIGNvbnN0cnVjdG9yOiBmdW5jdGlvbiggYXR0cnMsIG9wdGlvbnMgKSB7XHJcbiAgICBNb2RlbC5jYWxsKCB0aGlzLCB7IHNjaGVkdWxlOiBhdHRycyB8fCB7fSB9LCBvcHRpb25zICk7XHJcbiAgfSxcclxuXHJcbiAgLy8gIyMgQWRkIEhvdXJzIHRvIFNlYXNvblxyXG4gIC8vIEFkZCBhbiBlbnRyeSB0byB0aGUgaG91cnMgYXJyYXkgZm9yIGEgc2Vhc29uLCBieSBkZWZhdWx0IHRoZSAnZGVmYXVsdCdcclxuICAvLyBzZWFzb24uIElmIGEgc3BlY2lhbCBkYXkga2V5IGlzIHByb3ZpZGVkLCBleHBhbmQgaXQgdG8gYW4gYXJyYXkgb2ZcclxuICAvLyBkYXkga2V5cy5cclxuICBhZGRIb3Vyc0luOiBmdW5jdGlvbiggZGF5LCBvcGVucywgY2xvc2VzLCBuYW1lID0gJ2RlZmF1bHQnICkge1xyXG4gICAgY29uc3Qgc2NoZWR1bGUgPSB0aGlzLmdldCggJ3NjaGVkdWxlJyApO1xyXG4gICAgY29uc3QgaG91cnMgPSBleHBhbmQoIGRheSApLm1hcCggZGF5ID0+IHtcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICBkYXksXHJcbiAgICAgICAgY2xvc2VzOiBub3JtYWxpemUoIGNsb3NlcyApLFxyXG4gICAgICAgIG9wZW5zOiBub3JtYWxpemUoIG9wZW5zIClcclxuICAgICAgfTtcclxuICAgIH0gKTtcclxuICAgIGNvbnN0IHNlYXNvbiA9IHNjaGVkdWxlWyBuYW1lIF0gfHwgW107XHJcbiAgICB0aGlzLnNldCggJ3NjaGVkdWxlJywge1xyXG4gICAgICAuLi5zY2hlZHVsZSxcclxuICAgICAgWyBuYW1lIF06IFsgLi4uc2Vhc29uLCAuLi5ob3VycyBdXHJcbiAgICB9ICk7XHJcbiAgfSxcclxuXHJcbiAgLy8gIyMgUmVtb3ZlIEhvdXJzIGZyb20gYSBTZWFzb25cclxuICAvLyBEZWxldGUgYW4gZW50cnkgaW4gdGhlIGhvdXJzIGFyYXJ5IGZvciBhIHNlYXNvbiwgYnkgZGVmYXVsdCB0aGUgJ2RlZmF1bHQnXHJcbiAgLy8gc2Vhc29uLiBFbnRyaWVzIGFyZSBkZWxldGVkIGJ5IGluZGV4IGluIHRoZSBob3VycyBhcnJheS5cclxuICBkZWxIb3Vyc0luOiBmdW5jdGlvbiggaWR4LCBuYW1lID0gJ2RlZmF1bHQnICkge1xyXG4gICAgY29uc3Qgc2NoZWR1bGUgPSB0aGlzLmdldCggJ3NjaGVkdWxlJyApO1xyXG4gICAgY29uc3Qgc2Vhc29uID0gc2NoZWR1bGVbIG5hbWUgXSB8fCBbXTtcclxuXHJcbiAgICBzZWFzb24uc3BsaWNlKCBpZHgsIDEgKTtcclxuXHJcbiAgICB0aGlzLnNldCggJ3NjaGVkdWxlJywge1xyXG4gICAgICAuLi5zY2hlZHVsZSxcclxuICAgICAgWyBuYW1lIF06IHNlYXNvblxyXG4gICAgfSApO1xyXG4gIH0sXHJcblxyXG4gIC8vIEdldCB0aGUgY2xvc2luZy10aW1lIElTTyBzdHJpbmcgZm9yIHRvZGF5LlxyXG4gIGdldENsb3NpbmdUb2RheSgpIHtcclxuICAgIGNvbnN0IHNlYXNvbiA9IHRoaXMuZ2V0KCAnc2NoZWR1bGUnICkuZGVmYXVsdDtcclxuICAgIGNvbnN0IGhvdXJzID0gZmluZCggc2Vhc29uLCB7IGRheTogdG9kYXkoKSB9ICk7XHJcblxyXG4gICAgcmV0dXJuIGhvdXJzID8gaG91cnMuY2xvc2VzIDogbnVsbDtcclxuICB9XHJcbn0gKTtcclxuXHJcbm1peGluVmFsaWRhdGlvbiggU2NoZWR1bGUgKTtcclxuIl19