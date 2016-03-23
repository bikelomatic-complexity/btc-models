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
var daysValues = (0, _lodash.values)(days);

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

function nextDay(day) {
  var next = days[day].next;
  if (next) {
    return next;
  } else {
    return null;
  }
}

function today() {
  var idx = new Date().getDay();
  return daysKeys[idx];
}

function normalize(date) {
  var hours = date.getHours();
  var minutes = date.getMinutes();

  return new Date(1970, 0, 1, hours, minutes, 0, 0).toISOString();
}

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
    _backbone.Model.call(this, { schedule: attrs || {} }, options);
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
  },

  resetIn: function resetIn() {
    var name = arguments.length <= 0 || arguments[0] === undefined ? 'default' : arguments[0];

    var schedule = this.get('schedule');
    this.set('schedule', _extends({}, schedule, _defineProperty({}, name, [])));
  },

  getClosingToday: function getClosingToday() {
    var season = this.get('schedule').default;
    var hours = (0, _lodash.find)(season, { day: today() });

    return hours ? hours.closes : null;
  }
});

(0, _validationMixin.mixinValidation)(Schedule);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tb2RlbC9ob3Vycy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7UUFpQ2dCLE9BQU8sR0FBUCxPQUFPO1FBY1AsU0FBUyxHQUFULFNBQVM7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBekNsQixJQUFNLElBQUksV0FBSixJQUFJLEdBQUc7QUFDbEIsVUFBUSxFQUFLLEVBQUUsT0FBTyxFQUFFLFFBQVEsRUFBSyxJQUFJLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUs7QUFDekUsVUFBUSxFQUFLLEVBQUUsT0FBTyxFQUFFLFFBQVEsRUFBSyxJQUFJLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUk7QUFDekUsV0FBUyxFQUFJLEVBQUUsT0FBTyxFQUFFLFNBQVMsRUFBSSxJQUFJLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUU7QUFDekUsYUFBVyxFQUFFLEVBQUUsT0FBTyxFQUFFLFdBQVcsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUc7QUFDekUsWUFBVSxFQUFHLEVBQUUsT0FBTyxFQUFFLFVBQVUsRUFBRyxJQUFJLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUs7QUFDekUsVUFBUSxFQUFLLEVBQUUsT0FBTyxFQUFFLFFBQVEsRUFBSyxJQUFJLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUc7QUFDekUsWUFBVSxFQUFHLEVBQUUsT0FBTyxFQUFFLFVBQVUsRUFBRyxJQUFJLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUs7O0FBRXpFLFdBQVMsRUFBSSxFQUFFLE9BQU8sRUFBRSxTQUFTLEVBQUksSUFBSSxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFJO0FBQ3pFLFdBQVMsRUFBSSxFQUFFLE9BQU8sRUFBRSxVQUFVLEVBQUcsSUFBSSxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsU0FBUyxF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LENBQUM7O0FBRS9DLFdBQU8sS0FBSyxHQUFHLEtBQUssQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO0dBQ3BDO0NBQ0YsQ0FBRSxDQUFDOztBQUVKLHNDQUFpQixRQUFRLENBQUUsQ0FBQyIsImZpbGUiOiJob3Vycy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IG1peGluVmFsaWRhdGlvbiB9IGZyb20gJy4vdmFsaWRhdGlvbi1taXhpbic7XG5cbmltcG9ydCB7IE1vZGVsIH0gZnJvbSAnYmFja2JvbmUnO1xuaW1wb3J0IF8sIHsga2V5cywgdmFsdWVzLCBmaW5kIH0gZnJvbSAnbG9kYXNoJztcblxuLyplc2ZtdC1pZ25vcmUtc3RhcnQqL1xuZXhwb3J0IGNvbnN0IGRheXMgPSB7XG4gICdzdW5kYXknOiAgICB7IGRpc3BsYXk6ICdTdW5kYXknLCAgICB0eXBlOiAnd2Vla2VuZCcsIG5leHQ6ICdtb25kYXknICAgIH0sXG4gICdtb25kYXknOiAgICB7IGRpc3BsYXk6ICdNb25kYXknLCAgICB0eXBlOiAnd2Vla2RheScsIG5leHQ6ICd0dWVzZGF5JyAgIH0sXG4gICd0dWVzZGF5JzogICB7IGRpc3BsYXk6ICdUdWVzZGF5JywgICB0eXBlOiAnd2Vla2RheScsIG5leHQ6ICd3ZWRuZXNkYXknIH0sXG4gICd3ZWRuZXNkYXknOiB7IGRpc3BsYXk6ICdXZWRuZXNkYXknLCB0eXBlOiAnd2Vla2RheScsIG5leHQ6ICd0aHVyc2RheScgIH0sXG4gICd0aHVyc2RheSc6ICB7IGRpc3BsYXk6ICdUaHVyc2RheScsICB0eXBlOiAnd2Vla2RheScsIG5leHQ6ICdmcmlkYXknICAgIH0sXG4gICdmcmlkYXknOiAgICB7IGRpc3BsYXk6ICdGcmlkYXknLCAgICB0eXBlOiAnd2Vla2RheScsIG5leHQ6ICdzYXR1cmRheScgIH0sXG4gICdzYXR1cmRheSc6ICB7IGRpc3BsYXk6ICdTYXR1cmRheScsICB0eXBlOiAnd2Vla2VuZCcsIG5leHQ6ICdzdW5kYXknICAgIH0sXG5cbiAgJ3dlZWtlbmQnOiAgIHsgZGlzcGxheTogJ1dlZWtlbmQnLCAgIHR5cGU6ICdjb21wb3NlJywgbmV4dDogJ3dlZWtkYXknICAgfSxcbiAgJ3dlZWtkYXknIDogIHsgZGlzcGxheTogJ1dlZWtkYXlzJywgIHR5cGU6ICdjb21wb3NlJywgbmV4dDogJ3dlZWtlbmQnICAgfVxufTtcbi8qZXNmbXQtaWdub3JlLWVuZCovXG5cbmNvbnN0IGRheXNLZXlzID0ga2V5cyggZGF5cyApO1xuY29uc3QgZGF5c1ZhbHVlcyA9IHZhbHVlcyggZGF5cyApO1xuXG5mdW5jdGlvbiBleHBhbmQoIGRheSApIHtcbiAgc3dpdGNoICggZGF5ICkge1xuICBjYXNlICd3ZWVrZW5kJzpcbiAgY2FzZSAnd2Vla2RheSc6XG4gICAgcmV0dXJuIF8oIGRheXMgKS5waWNrQnkoIHZhbHVlID0+IHZhbHVlLnR5cGUgPT09IGRheSApLmtleXMoKTtcbiAgZGVmYXVsdDpcbiAgICByZXR1cm4gWyBkYXkgXTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gbmV4dERheSggZGF5ICkge1xuICBjb25zdCBuZXh0ID0gZGF5c1sgZGF5IF0ubmV4dDtcbiAgaWYoIG5leHQgKSB7XG4gICAgcmV0dXJuIG5leHQ7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbn1cblxuZnVuY3Rpb24gdG9kYXkoKSB7XG4gIGNvbnN0IGlkeCA9IG5ldyBEYXRlKCkuZ2V0RGF5KCk7XG4gIHJldHVybiBkYXlzS2V5c1sgaWR4IF07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBub3JtYWxpemUoIGRhdGUgKSB7XG4gIGNvbnN0IGhvdXJzID0gZGF0ZS5nZXRIb3VycygpO1xuICBjb25zdCBtaW51dGVzID0gZGF0ZS5nZXRNaW51dGVzKCk7XG5cbiAgcmV0dXJuIG5ldyBEYXRlKCAxOTcwLCAwLCAxLCBob3VycywgbWludXRlcywgMCwgMCApLnRvSVNPU3RyaW5nKCk7XG59XG5cbmNvbnN0IGhvdXJzID0ge1xuICB0eXBlOiAnYXJyYXknLFxuICBpdGVtczoge1xuICAgIHR5cGU6ICdvYmplY3QnLFxuICAgIGFkZGl0aW9uYWxQcm9wZXJ0aWVzOiBmYWxzZSxcbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICBkYXk6IHtcbiAgICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICAgIGVudW06IGtleXMoIGRheXMgKVxuICAgICAgfSxcbiAgICAgIG9wZW5zOiB7XG4gICAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgICBmb3JtYXQ6ICdkYXRlLXRpbWUnXG4gICAgICB9LFxuICAgICAgY2xvc2VzOiB7XG4gICAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgICBmb3JtYXQ6ICdkYXRlLXRpbWUnXG4gICAgICB9XG4gICAgfVxuICB9XG59O1xuXG5jb25zdCBzY2hlZHVsZSA9IHtcbiAgdHlwZTogJ29iamVjdCcsXG4gIGFkZGl0aW9uYWxQcm9wZXJ0aWVzOiBmYWxzZSxcbiAgcHJvcGVydGllczoge1xuICAgIHNjaGVkdWxlOiB7XG4gICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICAgIHBhdHRlcm5Qcm9wZXJ0aWVzOiB7XG4gICAgICAgICcuKic6IGhvdXJzXG4gICAgICB9XG4gICAgfVxuICB9XG59O1xuXG5leHBvcnQgY29uc3QgU2NoZWR1bGUgPSBNb2RlbC5leHRlbmQoIHtcbiAgc2NoZW1hOiBzY2hlZHVsZSxcblxuICBjb25zdHJ1Y3RvcjogZnVuY3Rpb24oIGF0dHJzLCBvcHRpb25zICkge1xuICAgIE1vZGVsLmNhbGwoIHRoaXMsIHsgc2NoZWR1bGU6IGF0dHJzIHx8IHt9IH0sIG9wdGlvbnMgKTtcbiAgfSxcblxuICBhZGRIb3Vyc0luOiBmdW5jdGlvbiggZGF5LCBvcGVucywgY2xvc2VzLCBuYW1lID0gJ2RlZmF1bHQnICkge1xuICAgIGNvbnN0IHNjaGVkdWxlID0gdGhpcy5nZXQoICdzY2hlZHVsZScgKTtcbiAgICBjb25zdCBob3VycyA9IGV4cGFuZCggZGF5ICkubWFwKCBkYXkgPT4ge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgZGF5LFxuICAgICAgICBjbG9zZXM6IG5vcm1hbGl6ZSggY2xvc2VzICksXG4gICAgICAgIG9wZW5zOiBub3JtYWxpemUoIG9wZW5zIClcbiAgICAgIH07XG4gICAgfSApO1xuICAgIGNvbnN0IHNlYXNvbiA9IHNjaGVkdWxlWyBuYW1lIF0gfHwgW107XG4gICAgdGhpcy5zZXQoICdzY2hlZHVsZScsIHtcbiAgICAgIC4uLnNjaGVkdWxlLFxuICAgICAgWyBuYW1lIF06IFsgLi4uc2Vhc29uLCAuLi5ob3VycyBdXG4gICAgfSApO1xuICB9LFxuXG4gIGRlbEhvdXJzSW46IGZ1bmN0aW9uKCBpZHgsIG5hbWUgPSAnZGVmYXVsdCcgKSB7XG4gICAgY29uc3Qgc2NoZWR1bGUgPSB0aGlzLmdldCggJ3NjaGVkdWxlJyApO1xuICAgIGNvbnN0IHNlYXNvbiA9IHNjaGVkdWxlWyBuYW1lIF0gfHwgW107XG5cbiAgICBzZWFzb24uc3BsaWNlKCBpZHgsIDEgKTtcblxuICAgIHRoaXMuc2V0KCAnc2NoZWR1bGUnLCB7XG4gICAgICAuLi5zY2hlZHVsZSxcbiAgICAgIFsgbmFtZSBdOiBzZWFzb25cbiAgICB9ICk7XG4gIH0sXG5cbiAgcmVzZXRJbjogZnVuY3Rpb24oIG5hbWUgPSAnZGVmYXVsdCcgKSB7XG4gICAgY29uc3Qgc2NoZWR1bGUgPSB0aGlzLmdldCggJ3NjaGVkdWxlJyApO1xuICAgIHRoaXMuc2V0KCAnc2NoZWR1bGUnLCB7XG4gICAgICAuLi5zY2hlZHVsZSxcbiAgICAgIFsgbmFtZSBdOiBbXVxuICAgIH0pO1xuICB9LFxuXG4gIGdldENsb3NpbmdUb2RheSgpIHtcbiAgICBjb25zdCBzZWFzb24gPSB0aGlzLmdldCggJ3NjaGVkdWxlJyApLmRlZmF1bHQ7XG4gICAgY29uc3QgaG91cnMgPSBmaW5kKCBzZWFzb24sIHsgZGF5OiB0b2RheSgpIH0gKTtcblxuICAgIHJldHVybiBob3VycyA/IGhvdXJzLmNsb3NlcyA6IG51bGw7XG4gIH1cbn0gKTtcblxubWl4aW5WYWxpZGF0aW9uKCBTY2hlZHVsZSApO1xuIl19