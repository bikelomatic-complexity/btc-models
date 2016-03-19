'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.connect = connect;

var _backbonePouch = require('backbone-pouch');

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9jb25uZWN0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O1FBU2dCLE9BQU8sR0FBUCxPQUFPOzs7Ozs7Ozs7OztBQUFoQixTQUFTLE9BQU8sQ0FBRSxRQUFRLEVBQUUsS0FBSyxFQUFHO0FBQ3pDLFNBQU8sS0FBSyxDQUFDLE1BQU0sQ0FBRTtBQUNuQixXQUFPLEVBQUUsT0FBTztBQUNoQixZQUFRLEVBQUUsUUFBUTtBQUNsQixRQUFJLEVBQUUseUJBQU0sRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLENBQUU7R0FDL0IsQ0FBRSxDQUFDO0NBQ0wiLCJmaWxlIjoiY29ubmVjdC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHN5bmMgfSBmcm9tICdiYWNrYm9uZS1wb3VjaCc7XG5cbi8vICMgQ29ubmVjdCBGdW5jdGlvblxuLy8gR2l2ZW4gYSBQb3VjaERCIGRhdGFic2Ugb2JqZWN0IGFuZCBhIGJhY2tib25lIGNsYXNzLCBjb25uZWN0IHRoYXQgY2xhc3Ncbi8vIHRvIHRoZSBkYXRhYmFzZSB3aXRoIGJhY2tib25lLXBvdWNoLiBUaGlzIGZ1bmN0aW9uIGV4dGVuZHMgdGhlIGJhY2tib25lXG4vLyBtb2RlbCBvciBjb2xsZWN0aW9uIGZpcnN0LCBzbyB3ZSBkb24ndCBtb2RpZnkgYGtsYXNzYC5cbi8vXG4vLyBJbiBvcmRlciBmb3IgdGhpcyB0byBiZSB1c2VmdWwsIHRoZSBiYWNrYm9uZSBtb2RlbCBvciBjb2xsZWN0aW9uIGNsYXNzIG11c3Rcbi8vIHNwZWNpZnkgYSBbYHBvdWNoYCBvYmplY3RdKGh0dHBzOi8vZ2l0aHViLmNvbS9qby9iYWNrYm9uZS1wb3VjaCkuXG5leHBvcnQgZnVuY3Rpb24gY29ubmVjdCggZGF0YWJhc2UsIGtsYXNzICkge1xuICByZXR1cm4ga2xhc3MuZXh0ZW5kKCB7XG4gICAgY29ubmVjdDogY29ubmVjdCxcbiAgICBkYXRhYmFzZTogZGF0YWJhc2UsXG4gICAgc3luYzogc3luYyggeyBkYjogZGF0YWJhc2UgfSApXG4gIH0gKTtcbn1cbiJdfQ==