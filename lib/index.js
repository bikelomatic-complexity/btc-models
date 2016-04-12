'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.models = exports.CommentCollection = exports.Comment = exports.PointCollection = exports.Alert = exports.Service = exports.Point = exports.Login = exports.UserCollection = exports.User = exports.nextDay = exports.days = exports.Schedule = exports.display = exports.alertTypes = exports.serviceTypes = exports.connectMut = exports.connect = undefined;

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7b0JBQVM7Ozs7OztvQkFBUzs7Ozs7Ozs7O2tCQUNUOzs7Ozs7a0JBQWM7Ozs7OztrQkFBWTs7Ozs7Ozs7O2tCQUUxQjs7Ozs7O2tCQUFVOzs7Ozs7a0JBQU07Ozs7Ozs7OztpQkFFaEI7Ozs7OztpQkFBTTs7Ozs7O2lCQUFnQjs7Ozs7O2tCQUN0Qjs7Ozs7O2tCQUFPOzs7Ozs7a0JBQVM7Ozs7OztrQkFBTzs7Ozs7O2tCQUFpQjs7Ozs7O2tCQUFTOzs7a0JBb0JsQzs7OztBQWRqQixJQUFNLDBCQUFTLDZKQUFUOzs7QUFjRSxTQUFTLGFBQVQsQ0FBd0IsUUFBeEIsRUFBbUM7QUFDaEQsMkJBQVksUUFBWixFQUFzQixNQUF0QixFQURnRDtDQUFuQyIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCB7IGNvbm5lY3QsIGNvbm5lY3RNdXQgfSBmcm9tICcuL2Nvbm5lY3QnO1xuZXhwb3J0IHsgc2VydmljZVR5cGVzLCBhbGVydFR5cGVzLCBkaXNwbGF5IH0gZnJvbSAnLi9tb2RlbC9wb2ludCc7XG5cbmV4cG9ydCB7IFNjaGVkdWxlLCBkYXlzLCBuZXh0RGF5IH0gZnJvbSAnLi9tb2RlbC9ob3Vycyc7XG5cbmV4cG9ydCB7IFVzZXIsIFVzZXJDb2xsZWN0aW9uLCBMb2dpbiB9IGZyb20gJy4vbW9kZWwvdXNlcic7XG5leHBvcnQgeyBQb2ludCwgU2VydmljZSwgQWxlcnQsIFBvaW50Q29sbGVjdGlvbiwgQ29tbWVudCwgQ29tbWVudENvbGxlY3Rpb24gfSBmcm9tICcuL21vZGVsL3BvaW50JztcblxuaW1wb3J0IHsgVXNlciwgVXNlckNvbGxlY3Rpb24sIExvZ2luIH0gZnJvbSAnLi9tb2RlbC91c2VyJztcbmltcG9ydCB7IFBvaW50LCBTZXJ2aWNlLCBBbGVydCwgUG9pbnRDb2xsZWN0aW9uLCBDb21tZW50LCBDb21tZW50Q29sbGVjdGlvbiB9IGZyb20gJy4vbW9kZWwvcG9pbnQnO1xuXG4vKmVzZm10LWlnbm9yZS1zdGFydCovXG5leHBvcnQgY29uc3QgbW9kZWxzID0gW1xuICBQb2ludCxcbiAgU2VydmljZSxcbiAgQWxlcnQsXG4gIFBvaW50Q29sbGVjdGlvbixcbiAgQ29tbWVudCxcbiAgQ29tbWVudENvbGxlY3Rpb24sXG4gIFVzZXIsXG4gIFVzZXJDb2xsZWN0aW9uLFxuICBMb2dpblxuXTtcbi8qZXNmbXQtaWdub3JlLWVuZCovXG5cbmltcG9ydCB7IGNvbm5lY3RNdXQgfSBmcm9tICcuL2Nvbm5lY3QnO1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gY29ubmVjdE1vZGVscyggZGF0YWJhc2UgKSB7XG4gIGNvbm5lY3RNdXQoIGRhdGFiYXNlLCBtb2RlbHMgKTtcbn1cbiJdfQ==