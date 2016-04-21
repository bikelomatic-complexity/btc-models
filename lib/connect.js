'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.connect = connect;
exports.connectMut = connectMut;

var _backbonePouch = require('backbone-pouch');

var _lodash = require('lodash');

// # Connect Function
// Given a PouchDB databse object and a backbone class, connect that class
// to the database with backbone-pouch. This function extends the backbone
// model or collection first, so we don't modify `klass`.
//
// In order for this to be useful, the backbone model or collection class must
// specify a [`pouch` object](https://github.com/jo/backbone-pouch).
function connect(database, klass) {
  return klass.extend({
    connect: connect,
    database: database,
    sync: (0, _backbonePouch.sync)({ db: database })
  });
}

function connectMut(database, klasses) {
  klasses.forEach(function (klass) {
    return (0, _lodash.merge)(klass.prototype, {
      connect: connect,
      database: database,
      sync: (0, _backbonePouch.sync)({ db: database })
    });
  });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9jb25uZWN0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O1FBVWdCO1FBUUE7O0FBbEJoQjs7QUFDQTs7Ozs7Ozs7O0FBU08sU0FBUyxPQUFULENBQWtCLFFBQWxCLEVBQTRCLEtBQTVCLEVBQW9DO0FBQ3pDLFNBQU8sTUFBTSxNQUFOLENBQWM7QUFDbkIsb0JBRG1CO0FBRW5CLHNCQUZtQjtBQUduQixVQUFNLHlCQUFNLEVBQUUsSUFBSSxRQUFKLEVBQVIsQ0FBTjtHQUhLLENBQVAsQ0FEeUM7Q0FBcEM7O0FBUUEsU0FBUyxVQUFULENBQXFCLFFBQXJCLEVBQStCLE9BQS9CLEVBQXlDO0FBQzlDLFVBQVEsT0FBUixDQUFpQjtXQUFTLG1CQUFPLE1BQU0sU0FBTixFQUFpQjtBQUNoRCxzQkFEZ0Q7QUFFaEQsd0JBRmdEO0FBR2hELFlBQU0seUJBQU0sRUFBRSxJQUFJLFFBQUosRUFBUixDQUFOO0tBSHdCO0dBQVQsQ0FBakIsQ0FEOEM7Q0FBekMiLCJmaWxlIjoiY29ubmVjdC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHN5bmMgfSBmcm9tICdiYWNrYm9uZS1wb3VjaCc7XHJcbmltcG9ydCB7IG1lcmdlIH0gZnJvbSAnbG9kYXNoJztcclxuXHJcbi8vICMgQ29ubmVjdCBGdW5jdGlvblxyXG4vLyBHaXZlbiBhIFBvdWNoREIgZGF0YWJzZSBvYmplY3QgYW5kIGEgYmFja2JvbmUgY2xhc3MsIGNvbm5lY3QgdGhhdCBjbGFzc1xyXG4vLyB0byB0aGUgZGF0YWJhc2Ugd2l0aCBiYWNrYm9uZS1wb3VjaC4gVGhpcyBmdW5jdGlvbiBleHRlbmRzIHRoZSBiYWNrYm9uZVxyXG4vLyBtb2RlbCBvciBjb2xsZWN0aW9uIGZpcnN0LCBzbyB3ZSBkb24ndCBtb2RpZnkgYGtsYXNzYC5cclxuLy9cclxuLy8gSW4gb3JkZXIgZm9yIHRoaXMgdG8gYmUgdXNlZnVsLCB0aGUgYmFja2JvbmUgbW9kZWwgb3IgY29sbGVjdGlvbiBjbGFzcyBtdXN0XHJcbi8vIHNwZWNpZnkgYSBbYHBvdWNoYCBvYmplY3RdKGh0dHBzOi8vZ2l0aHViLmNvbS9qby9iYWNrYm9uZS1wb3VjaCkuXHJcbmV4cG9ydCBmdW5jdGlvbiBjb25uZWN0KCBkYXRhYmFzZSwga2xhc3MgKSB7XHJcbiAgcmV0dXJuIGtsYXNzLmV4dGVuZCgge1xyXG4gICAgY29ubmVjdCxcclxuICAgIGRhdGFiYXNlLFxyXG4gICAgc3luYzogc3luYyggeyBkYjogZGF0YWJhc2UgfSApXHJcbiAgfSApO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gY29ubmVjdE11dCggZGF0YWJhc2UsIGtsYXNzZXMgKSB7XHJcbiAga2xhc3Nlcy5mb3JFYWNoKCBrbGFzcyA9PiBtZXJnZSgga2xhc3MucHJvdG90eXBlLCB7XHJcbiAgICBjb25uZWN0LFxyXG4gICAgZGF0YWJhc2UsXHJcbiAgICBzeW5jOiBzeW5jKCB7IGRiOiBkYXRhYmFzZSB9IClcclxuICB9ICkgKTtcclxufVxyXG4iXX0=