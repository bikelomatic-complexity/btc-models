'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.connect = connect;

var _backbonePouch = require('backbone-pouch');

// Connect multiple Backbone classes (Models and Collections) to the database.
//
//  * In production, `database` is appended to CouchDB's root url
//  * In test, `database` is used as the name of a local database
function connect(pouch) {
  for (var _len = arguments.length, klasses = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    klasses[_key - 1] = arguments[_key];
  }

  klasses.forEach(function (klass) {
    klass.prototype.sync = (0, _backbonePouch.sync)({ db: pouch });
  });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9jb25uZWN0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O1FBTWdCLE9BQU8sR0FBUCxPQUFPOzs7Ozs7OztBQUFoQixTQUFTLE9BQU8sQ0FBRSxLQUFLLEVBQWU7b0NBQVYsT0FBTztBQUFQLFdBQU87OztBQUN4QyxTQUFPLENBQUMsT0FBTyxDQUFFLFVBQUEsS0FBSyxFQUFJO0FBQ3hCLFNBQUssQ0FBQyxTQUFTLENBQUMsSUFBSSxHQUFHLHlCQUFNLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxDQUFFLENBQUM7R0FDOUMsQ0FBRSxDQUFDO0NBQ0wiLCJmaWxlIjoiY29ubmVjdC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHN5bmMgfSBmcm9tICdiYWNrYm9uZS1wb3VjaCc7XG5cbi8vIENvbm5lY3QgbXVsdGlwbGUgQmFja2JvbmUgY2xhc3NlcyAoTW9kZWxzIGFuZCBDb2xsZWN0aW9ucykgdG8gdGhlIGRhdGFiYXNlLlxuLy9cbi8vICAqIEluIHByb2R1Y3Rpb24sIGBkYXRhYmFzZWAgaXMgYXBwZW5kZWQgdG8gQ291Y2hEQidzIHJvb3QgdXJsXG4vLyAgKiBJbiB0ZXN0LCBgZGF0YWJhc2VgIGlzIHVzZWQgYXMgdGhlIG5hbWUgb2YgYSBsb2NhbCBkYXRhYmFzZVxuZXhwb3J0IGZ1bmN0aW9uIGNvbm5lY3QoIHBvdWNoLCAuLi5rbGFzc2VzICkge1xuICBrbGFzc2VzLmZvckVhY2goIGtsYXNzID0+IHtcbiAgICBrbGFzcy5wcm90b3R5cGUuc3luYyA9IHN5bmMoIHsgZGI6IHBvdWNoIH0gKTtcbiAgfSApO1xufVxuIl19