'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.models = exports.CommentCollection = exports.Comment = exports.PointCollection = exports.Alert = exports.Service = exports.Point = exports.Login = exports.UserCollection = exports.User = exports.timezones = exports.nextDay = exports.days = exports.Schedule = exports.display = exports.alertTypes = exports.serviceTypes = exports.connectMut = exports.connect = undefined;

var _connect = require('./connect');

Object.defineProperty(exports, 'connect', {
  enumerable: true,
  get: function get() {
    return _connect.connect;
  }
});
Object.defineProperty(exports, 'connectMut', {
  enumerable: true,
  get: function get() {
    return _connect.connectMut;
  }
});

var _point = require('./model/point');

Object.defineProperty(exports, 'serviceTypes', {
  enumerable: true,
  get: function get() {
    return _point.serviceTypes;
  }
});
Object.defineProperty(exports, 'alertTypes', {
  enumerable: true,
  get: function get() {
    return _point.alertTypes;
  }
});
Object.defineProperty(exports, 'display', {
  enumerable: true,
  get: function get() {
    return _point.display;
  }
});

var _hours = require('./model/hours');

Object.defineProperty(exports, 'Schedule', {
  enumerable: true,
  get: function get() {
    return _hours.Schedule;
  }
});
Object.defineProperty(exports, 'days', {
  enumerable: true,
  get: function get() {
    return _hours.days;
  }
});
Object.defineProperty(exports, 'nextDay', {
  enumerable: true,
  get: function get() {
    return _hours.nextDay;
  }
});
Object.defineProperty(exports, 'timezones', {
  enumerable: true,
  get: function get() {
    return _hours.timezones;
  }
});

var _user = require('./model/user');

Object.defineProperty(exports, 'User', {
  enumerable: true,
  get: function get() {
    return _user.User;
  }
});
Object.defineProperty(exports, 'UserCollection', {
  enumerable: true,
  get: function get() {
    return _user.UserCollection;
  }
});
Object.defineProperty(exports, 'Login', {
  enumerable: true,
  get: function get() {
    return _user.Login;
  }
});
Object.defineProperty(exports, 'Point', {
  enumerable: true,
  get: function get() {
    return _point.Point;
  }
});
Object.defineProperty(exports, 'Service', {
  enumerable: true,
  get: function get() {
    return _point.Service;
  }
});
Object.defineProperty(exports, 'Alert', {
  enumerable: true,
  get: function get() {
    return _point.Alert;
  }
});
Object.defineProperty(exports, 'PointCollection', {
  enumerable: true,
  get: function get() {
    return _point.PointCollection;
  }
});
Object.defineProperty(exports, 'Comment', {
  enumerable: true,
  get: function get() {
    return _point.Comment;
  }
});
Object.defineProperty(exports, 'CommentCollection', {
  enumerable: true,
  get: function get() {
    return _point.CommentCollection;
  }
});
exports.default = connectModels;


/*esfmt-ignore-start*/
var models = exports.models = [_point.Point, _point.Service, _point.Alert, _point.PointCollection, _point.Comment, _point.CommentCollection, _user.User, _user.UserCollection, _user.Login];
/*esfmt-ignore-end*/

function connectModels(database) {
  (0, _connect.connectMut)(database, models);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7b0JBQVM7Ozs7OztvQkFBUzs7Ozs7Ozs7O2tCQUNUOzs7Ozs7a0JBQWM7Ozs7OztrQkFBWTs7Ozs7Ozs7O2tCQUUxQjs7Ozs7O2tCQUFVOzs7Ozs7a0JBQU07Ozs7OztrQkFBUzs7Ozs7Ozs7O2lCQUV6Qjs7Ozs7O2lCQUFNOzs7Ozs7aUJBQWdCOzs7Ozs7a0JBQ3RCOzs7Ozs7a0JBQU87Ozs7OztrQkFBUzs7Ozs7O2tCQUFPOzs7Ozs7a0JBQWlCOzs7Ozs7a0JBQVM7OztrQkFvQmxDOzs7O0FBZGpCLElBQU0sMEJBQVMsNkpBQVQ7OztBQWNFLFNBQVMsYUFBVCxDQUF3QixRQUF4QixFQUFtQztBQUNoRCwyQkFBWSxRQUFaLEVBQXNCLE1BQXRCLEVBRGdEO0NBQW5DIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IHsgY29ubmVjdCwgY29ubmVjdE11dCB9IGZyb20gJy4vY29ubmVjdCc7XHJcbmV4cG9ydCB7IHNlcnZpY2VUeXBlcywgYWxlcnRUeXBlcywgZGlzcGxheSB9IGZyb20gJy4vbW9kZWwvcG9pbnQnO1xyXG5cclxuZXhwb3J0IHsgU2NoZWR1bGUsIGRheXMsIG5leHREYXksIHRpbWV6b25lcyB9IGZyb20gJy4vbW9kZWwvaG91cnMnO1xyXG5cclxuZXhwb3J0IHsgVXNlciwgVXNlckNvbGxlY3Rpb24sIExvZ2luIH0gZnJvbSAnLi9tb2RlbC91c2VyJztcclxuZXhwb3J0IHsgUG9pbnQsIFNlcnZpY2UsIEFsZXJ0LCBQb2ludENvbGxlY3Rpb24sIENvbW1lbnQsIENvbW1lbnRDb2xsZWN0aW9uIH0gZnJvbSAnLi9tb2RlbC9wb2ludCc7XHJcblxyXG5pbXBvcnQgeyBVc2VyLCBVc2VyQ29sbGVjdGlvbiwgTG9naW4gfSBmcm9tICcuL21vZGVsL3VzZXInO1xyXG5pbXBvcnQgeyBQb2ludCwgU2VydmljZSwgQWxlcnQsIFBvaW50Q29sbGVjdGlvbiwgQ29tbWVudCwgQ29tbWVudENvbGxlY3Rpb24gfSBmcm9tICcuL21vZGVsL3BvaW50JztcclxuXHJcbi8qZXNmbXQtaWdub3JlLXN0YXJ0Ki9cclxuZXhwb3J0IGNvbnN0IG1vZGVscyA9IFtcclxuICBQb2ludCxcclxuICBTZXJ2aWNlLFxyXG4gIEFsZXJ0LFxyXG4gIFBvaW50Q29sbGVjdGlvbixcclxuICBDb21tZW50LFxyXG4gIENvbW1lbnRDb2xsZWN0aW9uLFxyXG4gIFVzZXIsXHJcbiAgVXNlckNvbGxlY3Rpb24sXHJcbiAgTG9naW5cclxuXTtcclxuLyplc2ZtdC1pZ25vcmUtZW5kKi9cclxuXHJcbmltcG9ydCB7IGNvbm5lY3RNdXQgfSBmcm9tICcuL2Nvbm5lY3QnO1xyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBjb25uZWN0TW9kZWxzKCBkYXRhYmFzZSApIHtcclxuICBjb25uZWN0TXV0KCBkYXRhYmFzZSwgbW9kZWxzICk7XHJcbn1cclxuIl19