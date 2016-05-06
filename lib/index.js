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
var models = exports.models = [_point.Point, _point.Service, _point.Alert, _point.PointCollection, _point.Comment, _point.CommentCollection];
/*esfmt-ignore-end*/

function connectModels(database) {
  (0, _connect.connectMut)(database, models);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7b0JBQVMsT0FBTzs7Ozs7O29CQUFFLFVBQVU7Ozs7Ozs7OztrQkFDbkIsWUFBWTs7Ozs7O2tCQUFFLFVBQVU7Ozs7OztrQkFBRSxPQUFPOzs7Ozs7Ozs7a0JBRWpDLFFBQVE7Ozs7OztrQkFBRSxJQUFJOzs7Ozs7a0JBQUUsT0FBTzs7Ozs7Ozs7O2lCQUV2QixJQUFJOzs7Ozs7aUJBQUUsY0FBYzs7Ozs7O2lCQUFFLEtBQUs7Ozs7OztrQkFDM0IsS0FBSzs7Ozs7O2tCQUFFLE9BQU87Ozs7OztrQkFBRSxLQUFLOzs7Ozs7a0JBQUUsZUFBZTs7Ozs7O2tCQUFFLE9BQU87Ozs7OztrQkFBRSxpQkFBaUI7OztrQkFnQm5ELGFBQWE7OztBQVg5QixJQUFNLE1BQU0sV0FBTixNQUFNLEdBQUcsOEdBT3JCOzs7QUFBQyxBQUlhLFNBQVMsYUFBYSxDQUFFLFFBQVEsRUFBRztBQUNoRCwyQkFBWSxRQUFRLEVBQUUsTUFBTSxDQUFFLENBQUM7Q0FDaEMiLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgeyBjb25uZWN0LCBjb25uZWN0TXV0IH0gZnJvbSAnLi9jb25uZWN0JztcbmV4cG9ydCB7IHNlcnZpY2VUeXBlcywgYWxlcnRUeXBlcywgZGlzcGxheSB9IGZyb20gJy4vbW9kZWwvcG9pbnQnO1xuXG5leHBvcnQgeyBTY2hlZHVsZSwgZGF5cywgbmV4dERheSB9IGZyb20gJy4vbW9kZWwvaG91cnMnO1xuXG5leHBvcnQgeyBVc2VyLCBVc2VyQ29sbGVjdGlvbiwgTG9naW4gfSBmcm9tICcuL21vZGVsL3VzZXInO1xuZXhwb3J0IHsgUG9pbnQsIFNlcnZpY2UsIEFsZXJ0LCBQb2ludENvbGxlY3Rpb24sIENvbW1lbnQsIENvbW1lbnRDb2xsZWN0aW9uIH0gZnJvbSAnLi9tb2RlbC9wb2ludCc7XG5cbmltcG9ydCB7IFBvaW50LCBTZXJ2aWNlLCBBbGVydCwgUG9pbnRDb2xsZWN0aW9uLCBDb21tZW50LCBDb21tZW50Q29sbGVjdGlvbiB9IGZyb20gJy4vbW9kZWwvcG9pbnQnO1xuXG4vKmVzZm10LWlnbm9yZS1zdGFydCovXG5leHBvcnQgY29uc3QgbW9kZWxzID0gW1xuICBQb2ludCxcbiAgU2VydmljZSxcbiAgQWxlcnQsXG4gIFBvaW50Q29sbGVjdGlvbixcbiAgQ29tbWVudCxcbiAgQ29tbWVudENvbGxlY3Rpb25cbl07XG4vKmVzZm10LWlnbm9yZS1lbmQqL1xuXG5pbXBvcnQgeyBjb25uZWN0TXV0IH0gZnJvbSAnLi9jb25uZWN0JztcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGNvbm5lY3RNb2RlbHMoIGRhdGFiYXNlICkge1xuICBjb25uZWN0TXV0KCBkYXRhYmFzZSwgbW9kZWxzICk7XG59XG4iXX0=