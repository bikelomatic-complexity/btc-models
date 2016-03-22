'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Schedule = exports.days = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.normalize = normalize;

var _validationMixin = require('./validation-mixin');

var _backbone = require('backbone');

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/*esfmt-ignore-start*/
var days = exports.days = {
  'sunday': { display: 'Sunday', idx: 0, type: 'weekend' },
  'monday': { display: 'Monday', idx: 1, type: 'weekday' },
  'tuesday': { display: 'Tuesday', idx: 2, type: 'weekday' },
  'wednesday': { display: 'Wednesday', idx: 3, type: 'weekday' },
  'thursday': { display: 'Thursday', idx: 4, type: 'weekday' },
  'friday': { display: 'Friday', idx: 5, type: 'weekday' },
  'saturday': { display: 'Saturday', idx: 6, type: 'weekend' },

  'weekend': { display: 'Weekend', type: 'compose' },
  'weekday': { display: 'Weekdays', type: 'compose' }
};
/*esfmt-ignore-end*/

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

function normalize(date) {
  var hours = date.getHours();
  var minutes = date.getMinutes();

  return new Date(1970, 0, 1, hours, minutes, 0, 0).toISOString();
}

// new Date().toLocaleTimeString( [], { hour: 'numeric', minute: 'numeric' });

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

var Schedule = exports.Schedule = _backbone.Model.extend({
  schema: schedule,

  constructor: function constructor(attrs, options) {
    attrs = attrs || {};
    _backbone.Model.call(this, { schedule: attrs.schedule || {} }, options);
  },

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

  delHoursIn: function delHoursIn(idx) {
    var name = arguments.length <= 1 || arguments[1] === undefined ? 'default' : arguments[1];

    var schedule = this.get('schedule');
    var season = schedule[name] || [];

    season.splice(idx, 1);

    this.set('schedule', _extends({}, schedule, _defineProperty({}, name, season)));
  }
});

(0, _validationMixin.mixinValidation)(Schedule);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tb2RlbC9ob3Vycy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7UUE4QmdCLFNBQVMsR0FBVCxTQUFTOzs7Ozs7Ozs7Ozs7Ozs7OztBQXhCbEIsSUFBTSxJQUFJLFdBQUosSUFBSSxHQUFHO0FBQ2xCLFVBQVEsRUFBSyxFQUFFLE9BQU8sRUFBRSxRQUFRLEVBQUssR0FBRyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFO0FBQzlELFVBQVEsRUFBSyxFQUFFLE9BQU8sRUFBRSxRQUFRLEVBQUssR0FBRyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFO0FBQzlELFdBQVMsRUFBSSxFQUFFLE9BQU8sRUFBRSxTQUFTLEVBQUksR0FBRyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFO0FBQzlELGFBQVcsRUFBRSxFQUFFLE9BQU8sRUFBRSxXQUFXLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFO0FBQzlELFlBQVUsRUFBRyxFQUFFLE9BQU8sRUFBRSxVQUFVLEVBQUcsR0FBRyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFO0FBQzlELFVBQVEsRUFBSyxFQUFFLE9BQU8sRUFBRSxRQUFRLEVBQUssR0FBRyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFO0FBQzlELFlBQVUsRUFBRyxFQUFFLE9BQU8sRUFBRSxVQUFVLEVBQUcsR0FBRyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFOztBQUU5RCxXQUFTLEVBQUksRUFBRSxPQUFPLEVBQUUsU0FBUyxFQUFZLElBQUksRUFBRSxTQUFTLEVBQUU7QUFDOUQsV0FBUyxFQUFJLEVBQUUsT0FBTyxFQUFFLFVBQVUsRUFBVyxJQUFJLEVBQUUsU0FBUyxFQUFFO0NBQy9EOzs7QUFBQyxBQUdGLFNBQVMsTUFBTSxDQUFFLEdBQUcsRUFBRztBQUNyQixVQUFTLEdB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QztBQUN4QyxRQUFNLE1BQU0sR0FBRyxRQUFRLENBQUUsSUFBSSxDQUFFLElBQUksRUFBRSxDQUFDOztBQUV0QyxVQUFNLENBQUMsTUFBTSxDQUFFLEdBQUcsRUFBRSxDQUFDLENBQUUsQ0FBQzs7QUFFeEIsUUFBSSxDQUFDLEdBQUcsQ0FBRSxVQUFVLGVBQ2YsUUFBUSxzQkFDVCxJQUFJLEVBQUksTUFBTSxHQUNmLENBQUM7R0FDTDtDQUNGLENBQUUsQ0FBQzs7QUFFSixzQ0FBaUIsUUFBUSxDQUFFLENBQUMiLCJmaWxlIjoiaG91cnMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBtaXhpblZhbGlkYXRpb24gfSBmcm9tICcuL3ZhbGlkYXRpb24tbWl4aW4nO1xuXG5pbXBvcnQgeyBNb2RlbCB9IGZyb20gJ2JhY2tib25lJztcbmltcG9ydCBfLCB7IGtleXMgfSBmcm9tICdsb2Rhc2gnO1xuXG4vKmVzZm10LWlnbm9yZS1zdGFydCovXG5leHBvcnQgY29uc3QgZGF5cyA9IHtcbiAgJ3N1bmRheSc6ICAgIHsgZGlzcGxheTogJ1N1bmRheScsICAgIGlkeDogMCwgdHlwZTogJ3dlZWtlbmQnIH0sXG4gICdtb25kYXknOiAgICB7IGRpc3BsYXk6ICdNb25kYXknLCAgICBpZHg6IDEsIHR5cGU6ICd3ZWVrZGF5JyB9LFxuICAndHVlc2RheSc6ICAgeyBkaXNwbGF5OiAnVHVlc2RheScsICAgaWR4OiAyLCB0eXBlOiAnd2Vla2RheScgfSxcbiAgJ3dlZG5lc2RheSc6IHsgZGlzcGxheTogJ1dlZG5lc2RheScsIGlkeDogMywgdHlwZTogJ3dlZWtkYXknIH0sXG4gICd0aHVyc2RheSc6ICB7IGRpc3BsYXk6ICdUaHVyc2RheScsICBpZHg6IDQsIHR5cGU6ICd3ZWVrZGF5JyB9LFxuICAnZnJpZGF5JzogICAgeyBkaXNwbGF5OiAnRnJpZGF5JywgICAgaWR4OiA1LCB0eXBlOiAnd2Vla2RheScgfSxcbiAgJ3NhdHVyZGF5JzogIHsgZGlzcGxheTogJ1NhdHVyZGF5JywgIGlkeDogNiwgdHlwZTogJ3dlZWtlbmQnIH0sXG5cbiAgJ3dlZWtlbmQnOiAgIHsgZGlzcGxheTogJ1dlZWtlbmQnLCAgICAgICAgICAgdHlwZTogJ2NvbXBvc2UnIH0sXG4gICd3ZWVrZGF5JyA6ICB7IGRpc3BsYXk6ICdXZWVrZGF5cycsICAgICAgICAgIHR5cGU6ICdjb21wb3NlJyB9XG59O1xuLyplc2ZtdC1pZ25vcmUtZW5kKi9cblxuZnVuY3Rpb24gZXhwYW5kKCBkYXkgKSB7XG4gIHN3aXRjaCAoIGRheSApIHtcbiAgY2FzZSAnd2Vla2VuZCc6XG4gIGNhc2UgJ3dlZWtkYXknOlxuICAgIHJldHVybiBfKCBkYXlzICkucGlja0J5KCB2YWx1ZSA9PiB2YWx1ZS50eXBlID09PSBkYXkgKS5rZXlzKCk7XG4gIGRlZmF1bHQ6XG4gICAgcmV0dXJuIFsgZGF5IF07XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG5vcm1hbGl6ZSggZGF0ZSApIHtcbiAgY29uc3QgaG91cnMgPSBkYXRlLmdldEhvdXJzKCk7XG4gIGNvbnN0IG1pbnV0ZXMgPSBkYXRlLmdldE1pbnV0ZXMoKTtcblxuICByZXR1cm4gbmV3IERhdGUoIDE5NzAsIDAsIDEsIGhvdXJzLCBtaW51dGVzLCAwLCAwICkudG9JU09TdHJpbmcoKTtcbn1cblxuLy8gbmV3IERhdGUoKS50b0xvY2FsZVRpbWVTdHJpbmcoIFtdLCB7IGhvdXI6ICdudW1lcmljJywgbWludXRlOiAnbnVtZXJpYycgfSk7XG5cbmNvbnN0IGhvdXJzID0ge1xuICB0eXBlOiAnYXJyYXknLFxuICBpdGVtczoge1xuICAgIHR5cGU6ICdvYmplY3QnLFxuICAgIGFkZGl0aW9uYWxQcm9wZXJ0aWVzOiBmYWxzZSxcbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICBkYXk6IHtcbiAgICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICAgIGVudW06IGtleXMoIGRheXMgKVxuICAgICAgfSxcbiAgICAgIG9wZW5zOiB7XG4gICAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgICBmb3JtYXQ6ICdkYXRlLXRpbWUnXG4gICAgICB9LFxuICAgICAgY2xvc2VzOiB7XG4gICAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgICBmb3JtYXQ6ICdkYXRlLXRpbWUnXG4gICAgICB9XG4gICAgfVxuICB9XG59O1xuXG5jb25zdCBzY2hlZHVsZSA9IHtcbiAgdHlwZTogJ29iamVjdCcsXG4gIGFkZGl0aW9uYWxQcm9wZXJ0aWVzOiBmYWxzZSxcbiAgcHJvcGVydGllczoge1xuICAgIHNjaGVkdWxlOiB7XG4gICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICAgIHBhdHRlcm5Qcm9wZXJ0aWVzOiB7XG4gICAgICAgICcuKic6IGhvdXJzXG4gICAgICB9XG4gICAgfVxuICB9XG59O1xuXG5leHBvcnQgY29uc3QgU2NoZWR1bGUgPSBNb2RlbC5leHRlbmQoIHtcbiAgc2NoZW1hOiBzY2hlZHVsZSxcblxuICBjb25zdHJ1Y3RvcjogZnVuY3Rpb24oIGF0dHJzLCBvcHRpb25zICkge1xuICAgIGF0dHJzID0gYXR0cnMgfHwge307XG4gICAgTW9kZWwuY2FsbCggdGhpcywgeyBzY2hlZHVsZTogYXR0cnMuc2NoZWR1bGUgfHwge30gfSwgb3B0aW9ucyApO1xuICB9LFxuXG4gIGFkZEhvdXJzSW46IGZ1bmN0aW9uKCBkYXksIG9wZW5zLCBjbG9zZXMsIG5hbWUgPSAnZGVmYXVsdCcgKSB7XG4gICAgY29uc3Qgc2NoZWR1bGUgPSB0aGlzLmdldCggJ3NjaGVkdWxlJyApO1xuICAgIGNvbnN0IGhvdXJzID0gZXhwYW5kKCBkYXkgKS5tYXAoIGRheSA9PiB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBkYXksXG4gICAgICAgIGNsb3Nlczogbm9ybWFsaXplKCBjbG9zZXMgKSxcbiAgICAgICAgb3BlbnM6IG5vcm1hbGl6ZSggb3BlbnMgKVxuICAgICAgfTtcbiAgICB9ICk7XG4gICAgY29uc3Qgc2Vhc29uID0gc2NoZWR1bGVbIG5hbWUgXSB8fCBbXTtcbiAgICB0aGlzLnNldCggJ3NjaGVkdWxlJywge1xuICAgICAgLi4uc2NoZWR1bGUsXG4gICAgICBbIG5hbWUgXTogWyAuLi5zZWFzb24sIC4uLmhvdXJzIF1cbiAgICB9ICk7XG4gIH0sXG5cbiAgZGVsSG91cnNJbjogZnVuY3Rpb24oIGlkeCwgbmFtZSA9ICdkZWZhdWx0JyApIHtcbiAgICBjb25zdCBzY2hlZHVsZSA9IHRoaXMuZ2V0KCAnc2NoZWR1bGUnICk7XG4gICAgY29uc3Qgc2Vhc29uID0gc2NoZWR1bGVbIG5hbWUgXSB8fCBbXTtcblxuICAgIHNlYXNvbi5zcGxpY2UoIGlkeCwgMSApO1xuXG4gICAgdGhpcy5zZXQoICdzY2hlZHVsZScsIHtcbiAgICAgIC4uLnNjaGVkdWxlLFxuICAgICAgWyBuYW1lIF06IHNlYXNvblxuICAgIH0gKTtcbiAgfVxufSApO1xuXG5taXhpblZhbGlkYXRpb24oIFNjaGVkdWxlICk7XG4iXX0=