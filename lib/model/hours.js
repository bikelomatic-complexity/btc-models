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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tb2RlbC9ob3Vycy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7UUEyRGdCLE9BQU8sR0FBUCxPQUFPO1FBb0JQLFNBQVMsR0FBVCxTQUFTOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXBEbEIsSUFBTSxJQUFJLFdBQUosSUFBSSxHQUFHO0FBQ2xCLFVBQVEsRUFBSyxFQUFFLE9BQU8sRUFBRSxRQUFRLEVBQUssSUFBSSxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFLO0FBQ3pFLFVBQVEsRUFBSyxFQUFFLE9BQU8sRUFBRSxRQUFRLEVBQUssSUFBSSxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFJO0FBQ3pFLFdBQVMsRUFBSSxFQUFFLE9BQU8sRUFBRSxTQUFTLEVBQUksSUFBSSxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFO0FBQ3pFLGFBQVcsRUFBRSxFQUFFLE9BQU8sRUFBRSxXQUFXLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFHO0FBQ3pFLFlBQVUsRUFBRyxFQUFFLE9BQU8sRUFBRSxVQUFVLEVBQUcsSUFBSSxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFLO0FBQ3pFLFVBQVEsRUFBSyxFQUFFLE9BQU8sRUFBRSxRQUFRLEVBQUssSUFBSSxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFHO0FBQ3pFLFlBQVUsRUFBRyxFQUFFLE9BQU8sRUFBRSxVQUFVLEVBQUcsSUFBSSxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFLOztBQUV6RSxXQUFTLEVBQUksRUFBRSxPQUFPLEVBQUUsU0FBUyxFQUFJLElBQUksRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBSTtBQUN6RSxXQUFTLEVBQUksRUFBRSxPQUFPLEVBQUUsVUFBVSxFQUFHLElBQUksRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBSTtDQUMxRTs7O0FBQUMsQUFHRixJQUFNLFFBQVEsR0FBRyxrQkFBTSxJQUFJLENBQUU7Ozs7O0FBQUMsQUFLOUIsU0FBUyxNQUFNLENBQUUsR0FBRyxFQUFHO0FBQ3JCLFVBQVMsR0FBRztBQUNaLFNBQUssU0FBUyxDQUFDO0FBQ2YsU0FBSyxTQUFTO0FBQ1osYUFBTyxzQkFBRyxJQUFJLENBQUUsQ0FBQyxNQUFNLENBQUUsVUFBQSxLQUFLO2VBQUksS0FBSyxDQUFDLElBQUksS0FBSyxHQUFHO09BQUEsQ0FBRSxDQUFDLElBQUksRUFBRSxDQUFDO0FBQUEsQUFDaEU7QUFDRSxhQUFPLENBQUUsR0FBRyxDQUFFLENBQUM7QUFBQSxHQUNoQjtDQUNGOzs7OztBQUFBLEFBS00sU0FBUyxPQUFPLENBQUUsR0FBRyxFQUFHO0FBQzdCLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBRSxHQUFHLENBQUUsQ0FBQyxJQUFJLENBQUM7QUFDOUIsTUFBSyxJQUFJLEVBQUc7QUFDVixXQUFPLElBQUksQ0FBQztHQUNiLE1BQU07QUFDTCxXQUFPLElBQUksQ0FBQztHQUNiO0NBQ0Y7Ozs7QUFBQSxBQUlELFNBQVMsS0FBSyxHQUFHO0FBQ2YsTUFBTSxHQUFHLEdBQUcsSUFBSSxJQUFJLEVBQUUsQ0FBQyxNQUFNLEVBQUUsQ0FBQztBQUNoQyxTQUFPLFFBQVEsQ0FBRSxHQUFHLENBQUUsQ0FBQztDQUN4Qjs7Ozs7O0FBQUEsQUFNTSxTQUFTLFNBQVMsQ0FBRSxJQUFJLEVBQUc7QUFDaEMsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO0FBQzlCLE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQzs7QUFFbEMsU0FBTyxJQUFJLElBQUksQ0FBRSxJQUFJLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUUsQ0FBQyxXQUFXLEVBQUUsQ0FBQztDQUNuRTs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLEFBZ0JELElBQU0sS0FBSyxHQUFHO0FBQ1osTUFBSSxFQUFFLE9BQU87QUFDYixPQUFLLEVBQUU7QUFDTCxRQUFJLEVBQUUsUUFBUTtBQUNkLHdCQUFvQixFQUFFLEtBQUs7QUFDM0IsY0FBVSxFQUFFO0FBQ1YsU0FBRyxFQUFFO0FBQ0gsWUFBSSxFQUFFLFFBQVE7QUFDZCxZQUFJLEVBQUUsa0JBQU0sSUFBSSxDQUFFO09BQ25CO0FBQ0QsV0FBSyxFQUFFO0FBQ0wsWUFBSSxFQUFFLFFBQVE7QUFDZCxjQUFNLEVBQUUsV0FBVztPQUNwQjtBQUNELFlBQU0sRUFBRTtBQUNOLFlBQUksRUFBRSxRQUFRO0FBQ2QsY0FBTSxFQUFFLFdBQVc7T0FDcEI7S0FDRjtHQUNGO0NBQ0Y7Ozs7Ozs7Ozs7Ozs7QUFBQyxBQWFGLElBQU0sUUFBUSxHQUFHO0FBQ2YsTUFBSSxFQUFFLFFBQVE7QUFDZCxzQkFBb0IsRUFBRSxLQUFLO0FBQzNCLFlBQVUsRUFBRTtBQUNWLFlBQVEsRUFBRTtBQUNSLFVBQUksRUFBRSxRQUFRO0FBQ2QsdUJBQWlCLEVBQUU7QUFDakIsWUFBSSxFQUFFLEtBQUs7T0FDWjtLQUNGO0dBQ0Y7Q0FDRjs7Ozs7Ozs7OztBQUFDLEFBVUssSUFBTSxRQUFRLFdBQVIsUUFBUSxHQUFHLGdCQUFNLE1BQU0sQ0FBRTtBQUNwQyxRQUFNLEVBQUUsUUFBUTs7QUFFaEIsYUFBVyxFQUFFLHFCQUFVLEtBQUssRUFBRSxPQUFPLEVBQUc7QUFDdEMsb0JBQU0sSUFBSSxDQUFFLElBQUksRUFBRSxFQUFFLFFBQVEsRUFBRSxLQUFLLElBQUksRUFBRSxFQUFFLEVBQUUsT0FBTyxDQUFFLENBQUM7R0FDeEQ7Ozs7OztBQU1ELFlBQVUsRUFBRSxvQkFBVSxHQUFHLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBcUI7UUFBbkIsSUFBSSx5REFBRyxTQUFTOztBQUN4RCxRQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFFLFVBQVUsQ0FBRSxDQUFDO0FBQ3hDLFFBQU0sS0FBSyxHQUFHLE1BQU0sQ0FBRSxHQUFHLENBQUUsQ0FBQyxHQUFHLENBQUUsVUFBQSxHQUFHLEVBQUk7QUFDdEMsYUFBTztBQUNMLFdBQUcsRUFBSCxHQUFHO0FBQ0gsY0FBTSxFQUFFLFNBQVMsQ0FBRSxNQUFNLENBQUU7QUFDM0IsYUFBSyxFQUFFLFNBQVMsQ0FBRSxLQUFLLENBQUU7T0FDMUIsQ0FBQztLQUNILENBQUUsQ0FBQztBQUNKLFFBQU0sTUFBTSxHQUFHLFFBQVEsQ0FBRSxJQUFJLENBQUUsSUFBSSxFQUFFLENBQUM7QUFDdEMsUUFBSSxDQUFDLEdBQUcsQ0FBRSxVQUFVLGVBQ2YsUUFBUSxzQkFDVCxJQUFJLCtCQUFTLE1BQU0sc0JBQUssS0FBSyxLQUM5QixDQUFDO0dBQ0w7Ozs7O0FBS0QsWUFBVSxFQUFFLG9CQUFVLEdBQUcsRUFBcUI7UUFBbkIsSUFBSSx5REFBRyxTQUFTOztBQUN6QyxRQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFFLFVBQVUsQ0FBRSxDQUFDO0FBQ3hDLFFBQU0sTUFBTSxHQUFHLFFBQVEsQ0FBRSxJQUFJLENBQUUsSUFBSSxFQUFFLENBQUM7O0FBRXRDLFVBQU0sQ0FBQyxNQUFNLENBQUUsR0FBRyxFQUFFLENBQUMsQ0FBRSxDQUFDOztBQUV4QixRQUFJLENBQUMsR0FBRyxDQUFFLFVBQVUsZUFDZixRQUFRLHNCQUNULElBQUksRUFBSSxNQUFNLEdBQ2YsQ0FBQztHQUNMOzs7QUFHRCxpQkFBZSw2QkFBRztBQUNoQixRQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFFLFVBQVUsQ0FBRSxDQUFDLE9BQU8sQ0FBQztBQUM5QyxRQUFNLEtBQUssR0FBRyxrQkFBTSxNQUFNLEVBQUUsRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFFLEVBQUUsQ0FBRSxDQUFDOztBQUUvQyxXQUFPLEtBQUssR0FBRyxLQUFLLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQztHQUNwQztDQUNGLENBQUUsQ0FBQzs7QUFFSixzQ0FBaUIsUUFBUSxDQUFFLENBQUMiLCJmaWxlIjoiaG91cnMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBtaXhpblZhbGlkYXRpb24gfSBmcm9tICcuL3ZhbGlkYXRpb24tbWl4aW4nO1xuXG5pbXBvcnQgeyBNb2RlbCB9IGZyb20gJ2JhY2tib25lJztcbmltcG9ydCBfLCB7IGtleXMsIGZpbmQgfSBmcm9tICdsb2Rhc2gnO1xuXG4vLyAjIExvZ2ljIGZvciBTZWFzb25zIGFuZCBIb3Vyc1xuLy8gQSBzZXJ2aWNlIHVzdWFsbHkgaGFzIHBvc3RlZCBob3VycyBmb3IgdGhlIHdlZWsuIFRoZSBsaXN0IG9mIG9wZW5pbmcgYW5kXG4vLyBjbG9zaW5nIHRpbWVzIGZvciBlYWNoIGRheSBvZiB0aGUgd2VlayBhcmUgY29uc2lkZXJlZCAnSG91cnMnLiBEaWZmZXJlbnRcbi8vIGRheXMgb2YgdGhlIHdlZWsgY2FuIGhhdmUgZGlmZmVyZW50IG9wZW5pbmcgYW5kIGNsb3NpbmcgdGltZXMuIEEgc2luZ2xlXG4vLyBkYXkgY2FuIGhhdmUgbXVsdGlwbGUgc2VnbWVudHMgd2hlcmUgdGhlIHNlcnZpY2UgaXMgb3BlbiAoZm9yIGV4YW1wbGUsXG4vLyByZXN0YXVyYW50cyBtYXkgYmUgY2xvc2VkIGJldHdlZW4gbHVuY2ggYW5kIGRpbm5lcikuIEhvd2V2ZXIsIHdlIGRvbid0XG4vLyB5ZXQgc2FuaXRpemUgb2NjdXJlbmNlcyB3aGVyZSB0aGVzZSBvdmVybGFwLlxuLy9cbi8vIFNlcnZpY2VzIGVuY291bnRlcmVkIGJ5IHRvdXJpbmcgY3ljbGlzdHMgYXJlIGxpa2VseSB0byBoYXZlIHNlYXNvbmFsIGhvdXJzLlxuLy8gQSAnU2Vhc29uJyBoYXMgYSBuYW1lLCBhbmQgYSBsaXN0IG9mIGhvdXJzLlxuLy9cbi8vIFRoZSBlbnRpcmUgbGlzdCBvZiBzZWFzb25hbCBob3VycyBpcyB0aGUgJ1NjaGVkdWxlJy4gRWFjaCBzZXJ2aWNlIGhhcyBhdFxuLy8gbGVhc3QgYSBzY2hlZHVsZSB3aXRoIGEgZGVmYXVsdCBzZWFzb24uXG5cbi8vICMjIERheSBFbnVtZXJhdGlvblxuLy8gVGhpcyBlbnVtIGhhcyBhIGBuZXh0YCBmaWVsZCB3aGljaCBpcyBwcm92aWRlZCBhcyBhIHV0aWxpdHkgZm9yIEdVSXMuXG4vLyBUaGUgc3BlY2lhbCB3ZWVrZW5kIGFuZCB3ZWVrZGF5IGtleXMgY2FuIGJlIHVzZWQgYnkgdGhlIGBleHBhbmRgXG4vLyBmdW5jdGlvbiB0byBvYnRhaW4gYSBsaXN0IG9mIHRoZSBhcHByb3ByaWF0ZSBkYXkga2V5cy5cbi8vXG4vLyBUaGUga2V5cyBvZiB0aGUgZW51bSBhcmUgb3JkZXJlZCB0byBjb3JyZXNwb25kIHdpdGggbmV3IERhdGUoKS5nZXREYXkoKS5cbi8vIFVzZSBrZXlzKCBkYXlzICkgdG8gdXNlIHRoYXQgaW5kZXguXG4vKmVzZm10LWlnbm9yZS1zdGFydCovXG5leHBvcnQgY29uc3QgZGF5cyA9IHtcbiAgJ3N1bmRheSc6ICAgIHsgZGlzcGxheTogJ1N1bmRheScsICAgIHR5cGU6ICd3ZWVrZW5kJywgbmV4dDogJ21vbmRheScgICAgfSxcbiAgJ21vbmRheSc6ICAgIHsgZGlzcGxheTogJ01vbmRheScsICAgIHR5cGU6ICd3ZWVrZGF5JywgbmV4dDogJ3R1ZXNkYXknICAgfSxcbiAgJ3R1ZXNkYXknOiAgIHsgZGlzcGxheTogJ1R1ZXNkYXknLCAgIHR5cGU6ICd3ZWVrZGF5JywgbmV4dDogJ3dlZG5lc2RheScgfSxcbiAgJ3dlZG5lc2RheSc6IHsgZGlzcGxheTogJ1dlZG5lc2RheScsIHR5cGU6ICd3ZWVrZGF5JywgbmV4dDogJ3RodXJzZGF5JyAgfSxcbiAgJ3RodXJzZGF5JzogIHsgZGlzcGxheTogJ1RodXJzZGF5JywgIHR5cGU6ICd3ZWVrZGF5JywgbmV4dDogJ2ZyaWRheScgICAgfSxcbiAgJ2ZyaWRheSc6ICAgIHsgZGlzcGxheTogJ0ZyaWRheScsICAgIHR5cGU6ICd3ZWVrZGF5JywgbmV4dDogJ3NhdHVyZGF5JyAgfSxcbiAgJ3NhdHVyZGF5JzogIHsgZGlzcGxheTogJ1NhdHVyZGF5JywgIHR5cGU6ICd3ZWVrZW5kJywgbmV4dDogJ3N1bmRheScgICAgfSxcblxuICAnd2Vla2VuZCc6ICAgeyBkaXNwbGF5OiAnV2Vla2VuZCcsICAgdHlwZTogJ2NvbXBvc2UnLCBuZXh0OiAnd2Vla2RheScgICB9LFxuICAnd2Vla2RheScgOiAgeyBkaXNwbGF5OiAnV2Vla2RheXMnLCAgdHlwZTogJ2NvbXBvc2UnLCBuZXh0OiAnd2Vla2VuZCcgICB9XG59O1xuLyplc2ZtdC1pZ25vcmUtZW5kKi9cblxuY29uc3QgZGF5c0tleXMgPSBrZXlzKCBkYXlzICk7XG5cbi8vICMjIEV4cGFuZCBTcGVjaWFsIEtleXNcbi8vIEdpdmVuICd3ZWVrZW5kJyBvciAnd2Vla2RheScsIHRoaXMgZnVuY3Rpb24gd2lsbCByZXR1cm4gYSBsaXN0IG9mIHRoZVxuLy8gcmVsZXZhbnQgZW51bSBrZXlzLiBJZiBhIHJlZ3VsYXIga2V5IGlzIHByb3ZpZGVkLCBwYXNzIGl0IHRocm91Z2guXG5mdW5jdGlvbiBleHBhbmQoIGRheSApIHtcbiAgc3dpdGNoICggZGF5ICkge1xuICBjYXNlICd3ZWVrZW5kJzpcbiAgY2FzZSAnd2Vla2RheSc6XG4gICAgcmV0dXJuIF8oIGRheXMgKS5waWNrQnkoIHZhbHVlID0+IHZhbHVlLnR5cGUgPT09IGRheSApLmtleXMoKTtcbiAgZGVmYXVsdDpcbiAgICByZXR1cm4gWyBkYXkgXTtcbiAgfVxufVxuXG4vLyAjIyBHZXQgdGhlIE5leHQgRGF5IGluIFNlcXVlbmNlXG4vLyBHaXZlbiBhIGRheSBvZiB0aGUgd2VlaywgcmV0dXJuIHRoZSBuZXh0IGRheSBpbiBzZXF1ZW5jZS4gU2F0dXJkYXkgd3JhcHNcbi8vIGFyb3VuZCB0byBTdW5kYXlcbmV4cG9ydCBmdW5jdGlvbiBuZXh0RGF5KCBkYXkgKSB7XG4gIGNvbnN0IG5leHQgPSBkYXlzWyBkYXkgXS5uZXh0O1xuICBpZiAoIG5leHQgKSB7XG4gICAgcmV0dXJuIG5leHQ7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbn1cblxuLy8gIyMgRGF5IGtleSBmb3IgVG9kYXlcbi8vIFJldHVybiB0aGUgZW51bSBrZXkgZm9yIHRvZGF5LlxuZnVuY3Rpb24gdG9kYXkoKSB7XG4gIGNvbnN0IGlkeCA9IG5ldyBEYXRlKCkuZ2V0RGF5KCk7XG4gIHJldHVybiBkYXlzS2V5c1sgaWR4IF07XG59XG5cbi8vICMjIERhdGVzIFVzZWQgYXMgVGltZXNcbi8vIElmIHlvdSBoYXZlIGEgRGF0ZSBvYmplY3Qgd2hlcmUgb25seSB0aGUgSEg6TU0gaW5mb3JtYXRpb24gaXMgcmVsZXZhbnQsXG4vLyBgbm9ybWFsaXplYCB3aWxsIHJlc2V0IHRoZSBkYXRlIGNvbXBvbmVudCB0byBKYW4gMSwgMTk3MCBhbmQgc2hhdmUgb2ZmXG4vLyBhbnkgc2Vjb25kcyBhbmQgbWlsbGlzZWNvbmRzLiAoSmF2YXNjcmlwdCBkYXRlcyBhcmUgMjAzOCBzYWZlKVxuZXhwb3J0IGZ1bmN0aW9uIG5vcm1hbGl6ZSggZGF0ZSApIHtcbiAgY29uc3QgaG91cnMgPSBkYXRlLmdldEhvdXJzKCk7XG4gIGNvbnN0IG1pbnV0ZXMgPSBkYXRlLmdldE1pbnV0ZXMoKTtcblxuICByZXR1cm4gbmV3IERhdGUoIDE5NzAsIDAsIDEsIGhvdXJzLCBtaW51dGVzLCAwLCAwICkudG9JU09TdHJpbmcoKTtcbn1cblxuLy8gIyMgSG91cnMgU2NoZW1hXG4vLyBBbiBob3VycyBhcnJheSBjb250YWlucyBvYmplY3RzIHRoYXQgc3BlY2lmeSBvcGVuaW5nIGFuZCBjbG9zaW5nIHRpbWVzXG4vLyBmb3IgYSBkYXkuIFRoZSBob3VycyBhcnJheSBjYW4gaGF2ZSBtdWx0aXBsZSBlbnRyaWVzIGZvciB0aGUgc2FtZSBkYXkuXG4vL1xuLy8gVGhlIG9wZW5pbmcgYW5kIGNsb3NpbmcgdGltZXMgbXVzdCBiZSBzdG9yZWQgYXMgSVNPIGNvbXBsaWFudCBkYXRlLXRpbWVcbi8vIHN0cmluZ3MgaW4gWnVsdSB0aW1lLlxuLy9cbi8vIGBgYFxuLy8gWyB7XG4vLyAgIFwibW9uZGF5XCIsXG4vLyAgIFwib3BlbnNcIjogXCIxOTcwLTAxLTAxVDA4OjMwOjAwLjAwMFpcIixcbi8vICAgXCJjbG9zZXNcIjogXCIxOTcwLTAxLTAxVDE3OjMwOjAwLjAwMFpcIlxuLy8gfSBdXG4vLyBgYGBcbmNvbnN0IGhvdXJzID0ge1xuICB0eXBlOiAnYXJyYXknLFxuICBpdGVtczoge1xuICAgIHR5cGU6ICdvYmplY3QnLFxuICAgIGFkZGl0aW9uYWxQcm9wZXJ0aWVzOiBmYWxzZSxcbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICBkYXk6IHtcbiAgICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICAgIGVudW06IGtleXMoIGRheXMgKVxuICAgICAgfSxcbiAgICAgIG9wZW5zOiB7XG4gICAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgICBmb3JtYXQ6ICdkYXRlLXRpbWUnXG4gICAgICB9LFxuICAgICAgY2xvc2VzOiB7XG4gICAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgICBmb3JtYXQ6ICdkYXRlLXRpbWUnXG4gICAgICB9XG4gICAgfVxuICB9XG59O1xuXG4vLyAjIyBTY2hlZHVsZSBTY2hlbWFcbi8vIEEgc2NoZW1hIG9iamVjdCBoYXMgc2Vhc29uIG5hbWVzIGZvciBrZXlzIGFuZCBob3VycyBhcnJheXMgZm9yIHZhbHVlcy4gVGhlXG4vLyBzY2hlbWEgb2JqZWN0IGhhcyBhICdkZWZhdWx0JyBzZWFzb24gaW4gY2FzZSB3ZSBkb24ndCBrbm93IHNlYXNvbi1zcGVjaWZpY1xuLy8gaG91cnMgZm9yIGEgc2VydmljZS5cbi8vXG4vLyBgYGBcbi8vIHtcbi8vICAgXCJkZWZhdWx0XCI6IC4uLixcbi8vICAgXCJ3aW50ZXJcIjogLi4uXG4vLyB9XG4vLyBgYGBcbmNvbnN0IHNjaGVkdWxlID0ge1xuICB0eXBlOiAnb2JqZWN0JyxcbiAgYWRkaXRpb25hbFByb3BlcnRpZXM6IGZhbHNlLFxuICBwcm9wZXJ0aWVzOiB7XG4gICAgc2NoZWR1bGU6IHtcbiAgICAgIHR5cGU6ICdvYmplY3QnLFxuICAgICAgcGF0dGVyblByb3BlcnRpZXM6IHtcbiAgICAgICAgJy4qJzogaG91cnNcbiAgICAgIH1cbiAgICB9XG4gIH1cbn07XG5cbi8vICMgU2NoZWR1bGUgTW9kZWxcbi8vIFRoZSBzY2hlZHVsZSBtb2RlbCBwcm92aWRlcyBhbiBlYXN5IHdheSB0byB3b3JrIHdpdGggdGhlIHNjaGVkdWxlIGRhdGFcbi8vIHN0cnVjdHVyZS4gSXQgaXMgbm90IGludGVuZGVkIHRvIGJlIGNvbm5lY3RlZCB0byBhIGRhdGFiYXNlLiBJdCBpcyBtZWFudFxuLy8gb25seSB0byBtYW5pcHVsYXRlIHRoZSBzdHJ1Y3R1cmUgYmV0d2VlbiBkZXNlcmlhbGl6YXRpb24gYW5kIHNlcmlhbGl6YXRpb25cbi8vIG9mIGEgcmVkdXggc3RvcmUuXG4vL1xuLy8gVGltZXMgZm9yIGVhY2ggZGF5IGFyZSBzdG9yZWQgYXMgSVNPLWNvbXBsaWFudCBzdHJpbmdzIG5vcm1hbGl6ZWQgdG8gaWdub3JlXG4vLyBhbGwgc2VjdGlvbnMgYmVzaWRlcyBISDpNTSAodGhleSBhcHBlYXIgYXMgMTk3MCdzIGRhdGVzKS5cbmV4cG9ydCBjb25zdCBTY2hlZHVsZSA9IE1vZGVsLmV4dGVuZCgge1xuICBzY2hlbWE6IHNjaGVkdWxlLFxuXG4gIGNvbnN0cnVjdG9yOiBmdW5jdGlvbiggYXR0cnMsIG9wdGlvbnMgKSB7XG4gICAgTW9kZWwuY2FsbCggdGhpcywgeyBzY2hlZHVsZTogYXR0cnMgfHwge30gfSwgb3B0aW9ucyApO1xuICB9LFxuXG4gIC8vICMjIEFkZCBIb3VycyB0byBTZWFzb25cbiAgLy8gQWRkIGFuIGVudHJ5IHRvIHRoZSBob3VycyBhcnJheSBmb3IgYSBzZWFzb24sIGJ5IGRlZmF1bHQgdGhlICdkZWZhdWx0J1xuICAvLyBzZWFzb24uIElmIGEgc3BlY2lhbCBkYXkga2V5IGlzIHByb3ZpZGVkLCBleHBhbmQgaXQgdG8gYW4gYXJyYXkgb2ZcbiAgLy8gZGF5IGtleXMuXG4gIGFkZEhvdXJzSW46IGZ1bmN0aW9uKCBkYXksIG9wZW5zLCBjbG9zZXMsIG5hbWUgPSAnZGVmYXVsdCcgKSB7XG4gICAgY29uc3Qgc2NoZWR1bGUgPSB0aGlzLmdldCggJ3NjaGVkdWxlJyApO1xuICAgIGNvbnN0IGhvdXJzID0gZXhwYW5kKCBkYXkgKS5tYXAoIGRheSA9PiB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBkYXksXG4gICAgICAgIGNsb3Nlczogbm9ybWFsaXplKCBjbG9zZXMgKSxcbiAgICAgICAgb3BlbnM6IG5vcm1hbGl6ZSggb3BlbnMgKVxuICAgICAgfTtcbiAgICB9ICk7XG4gICAgY29uc3Qgc2Vhc29uID0gc2NoZWR1bGVbIG5hbWUgXSB8fCBbXTtcbiAgICB0aGlzLnNldCggJ3NjaGVkdWxlJywge1xuICAgICAgLi4uc2NoZWR1bGUsXG4gICAgICBbIG5hbWUgXTogWyAuLi5zZWFzb24sIC4uLmhvdXJzIF1cbiAgICB9ICk7XG4gIH0sXG5cbiAgLy8gIyMgUmVtb3ZlIEhvdXJzIGZyb20gYSBTZWFzb25cbiAgLy8gRGVsZXRlIGFuIGVudHJ5IGluIHRoZSBob3VycyBhcmFyeSBmb3IgYSBzZWFzb24sIGJ5IGRlZmF1bHQgdGhlICdkZWZhdWx0J1xuICAvLyBzZWFzb24uIEVudHJpZXMgYXJlIGRlbGV0ZWQgYnkgaW5kZXggaW4gdGhlIGhvdXJzIGFycmF5LlxuICBkZWxIb3Vyc0luOiBmdW5jdGlvbiggaWR4LCBuYW1lID0gJ2RlZmF1bHQnICkge1xuICAgIGNvbnN0IHNjaGVkdWxlID0gdGhpcy5nZXQoICdzY2hlZHVsZScgKTtcbiAgICBjb25zdCBzZWFzb24gPSBzY2hlZHVsZVsgbmFtZSBdIHx8IFtdO1xuXG4gICAgc2Vhc29uLnNwbGljZSggaWR4LCAxICk7XG5cbiAgICB0aGlzLnNldCggJ3NjaGVkdWxlJywge1xuICAgICAgLi4uc2NoZWR1bGUsXG4gICAgICBbIG5hbWUgXTogc2Vhc29uXG4gICAgfSApO1xuICB9LFxuXG4gIC8vIEdldCB0aGUgY2xvc2luZy10aW1lIElTTyBzdHJpbmcgZm9yIHRvZGF5LlxuICBnZXRDbG9zaW5nVG9kYXkoKSB7XG4gICAgY29uc3Qgc2Vhc29uID0gdGhpcy5nZXQoICdzY2hlZHVsZScgKS5kZWZhdWx0O1xuICAgIGNvbnN0IGhvdXJzID0gZmluZCggc2Vhc29uLCB7IGRheTogdG9kYXkoKSB9ICk7XG5cbiAgICByZXR1cm4gaG91cnMgPyBob3Vycy5jbG9zZXMgOiBudWxsO1xuICB9XG59ICk7XG5cbm1peGluVmFsaWRhdGlvbiggU2NoZWR1bGUgKTtcbiJdfQ==