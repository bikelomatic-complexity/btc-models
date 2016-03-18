'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.connect = connect;
exports.connectOne = connectOne;

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

function connectOne(pouch, klass) {
  klass.prototype.sync = (0, _backbonePouch.sync)({ db: pouch });
  return klass;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9jb25uZWN0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O1FBTWdCLE9BQU8sR0FBUCxPQUFPO1FBTVAsVUFBVSxHQUFWLFVBQVU7Ozs7Ozs7O0FBTm5CLFNBQVMsT0FBTyxDQUFFLEtBQUssRUFBZTtvQ0FBVixPQUFPO0FBQVAsV0FBTzs7O0FBQ3hDLFNBQU8sQ0FBQyxPQUFPLENBQUUsVUFBQSxLQUFLLEVBQUk7QUFDeEIsU0FBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJLEdBQUcseUJBQU0sRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLENBQUUsQ0FBQztHQUM5QyxDQUFFLENBQUM7Q0FDTDs7QUFFTSxTQUFTLFVBQVUsQ0FBRSxLQUFLLEVBQUUsS0FBSyxFQUFHO0FBQ3pDLE9BQUssQ0FBQyxTQUFTLENBQUMsSUFBSSxHQUFHLHlCQUFNLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxDQUFFLENBQUM7QUFDN0MsU0FBTyxLQUFLLENBQUM7Q0FDZCIsImZpbGUiOiJjb25uZWN0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgc3luYyB9IGZyb20gJ2JhY2tib25lLXBvdWNoJztcblxuLy8gQ29ubmVjdCBtdWx0aXBsZSBCYWNrYm9uZSBjbGFzc2VzIChNb2RlbHMgYW5kIENvbGxlY3Rpb25zKSB0byB0aGUgZGF0YWJhc2UuXG4vL1xuLy8gICogSW4gcHJvZHVjdGlvbiwgYGRhdGFiYXNlYCBpcyBhcHBlbmRlZCB0byBDb3VjaERCJ3Mgcm9vdCB1cmxcbi8vICAqIEluIHRlc3QsIGBkYXRhYmFzZWAgaXMgdXNlZCBhcyB0aGUgbmFtZSBvZiBhIGxvY2FsIGRhdGFiYXNlXG5leHBvcnQgZnVuY3Rpb24gY29ubmVjdCggcG91Y2gsIC4uLmtsYXNzZXMgKSB7XG4gIGtsYXNzZXMuZm9yRWFjaCgga2xhc3MgPT4ge1xuICAgIGtsYXNzLnByb3RvdHlwZS5zeW5jID0gc3luYyggeyBkYjogcG91Y2ggfSApO1xuICB9ICk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjb25uZWN0T25lKCBwb3VjaCwga2xhc3MgKSB7XG4gIGtsYXNzLnByb3RvdHlwZS5zeW5jID0gc3luYyggeyBkYjogcG91Y2ggfSApO1xuICByZXR1cm4ga2xhc3M7XG59XG4iXX0=