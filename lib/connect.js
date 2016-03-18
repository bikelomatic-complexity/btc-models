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
// export function connect( pouch, ...klasses ) {
//   klasses.forEach( klass => {
//     klass.prototype.sync = sync( { db: pouch } );
//   } );
// }
//
// export function connectOne( pouch, klass ) {
//   klass.prototype.sync = sync( { db: pouch } );
//   return klass;
// }

function connect(database, klass) {
  return klass.extend({
    connect: connect,
    database: database,
    sync: (0, _backbonePouch.sync)({ db: database })
  });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9jb25uZWN0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O1FBaUJnQixPQUFPLEdBQVAsT0FBTzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFoQixTQUFTLE9BQU8sQ0FBRSxRQUFRLEVBQUUsS0FBSyxFQUFHO0FBQ3pDLFNBQU8sS0FBSyxDQUFDLE1BQU0sQ0FBRTtBQUNuQixXQUFPLEVBQUUsT0FBTztBQUNoQixZQUFRLEVBQUUsUUFBUTtBQUNsQixRQUFJLEVBQUUseUJBQU0sRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLENBQUU7R0FDL0IsQ0FBRSxDQUFDO0NBQ0wiLCJmaWxlIjoiY29ubmVjdC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHN5bmMgfSBmcm9tICdiYWNrYm9uZS1wb3VjaCc7XG5cbi8vIENvbm5lY3QgbXVsdGlwbGUgQmFja2JvbmUgY2xhc3NlcyAoTW9kZWxzIGFuZCBDb2xsZWN0aW9ucykgdG8gdGhlIGRhdGFiYXNlLlxuLy9cbi8vICAqIEluIHByb2R1Y3Rpb24sIGBkYXRhYmFzZWAgaXMgYXBwZW5kZWQgdG8gQ291Y2hEQidzIHJvb3QgdXJsXG4vLyAgKiBJbiB0ZXN0LCBgZGF0YWJhc2VgIGlzIHVzZWQgYXMgdGhlIG5hbWUgb2YgYSBsb2NhbCBkYXRhYmFzZVxuLy8gZXhwb3J0IGZ1bmN0aW9uIGNvbm5lY3QoIHBvdWNoLCAuLi5rbGFzc2VzICkge1xuLy8gICBrbGFzc2VzLmZvckVhY2goIGtsYXNzID0+IHtcbi8vICAgICBrbGFzcy5wcm90b3R5cGUuc3luYyA9IHN5bmMoIHsgZGI6IHBvdWNoIH0gKTtcbi8vICAgfSApO1xuLy8gfVxuLy9cbi8vIGV4cG9ydCBmdW5jdGlvbiBjb25uZWN0T25lKCBwb3VjaCwga2xhc3MgKSB7XG4vLyAgIGtsYXNzLnByb3RvdHlwZS5zeW5jID0gc3luYyggeyBkYjogcG91Y2ggfSApO1xuLy8gICByZXR1cm4ga2xhc3M7XG4vLyB9XG5cbmV4cG9ydCBmdW5jdGlvbiBjb25uZWN0KCBkYXRhYmFzZSwga2xhc3MgKSB7XG4gIHJldHVybiBrbGFzcy5leHRlbmQoIHtcbiAgICBjb25uZWN0OiBjb25uZWN0LFxuICAgIGRhdGFiYXNlOiBkYXRhYmFzZSxcbiAgICBzeW5jOiBzeW5jKCB7IGRiOiBkYXRhYmFzZSB9IClcbiAgfSApO1xufVxuIl19