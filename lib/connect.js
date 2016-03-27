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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9jb25uZWN0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O1FBVWdCLE9BQU8sR0FBUCxPQUFPO1FBUVAsVUFBVSxHQUFWLFVBQVU7Ozs7Ozs7Ozs7Ozs7QUFSbkIsU0FBUyxPQUFPLENBQUUsUUFBUSxFQUFFLEtBQUssRUFBRztBQUN6QyxTQUFPLEtBQUssQ0FBQyxNQUFNLENBQUU7QUFDbkIsV0FBTyxFQUFQLE9BQU87QUFDUCxZQUFRLEVBQVIsUUFBUTtBQUNSLFFBQUksRUFBRSx5QkFBTSxFQUFFLEVBQUUsRUFBRSxRQUFRLEVBQUUsQ0FBRTtHQUMvQixDQUFFLENBQUM7Q0FDTDs7QUFFTSxTQUFTLFVBQVUsQ0FBRSxRQUFRLEVBQUUsT0FBTyxFQUFHO0FBQzlDLFNBQU8sQ0FBQyxPQUFPLENBQUUsVUFBQSxLQUFLO1dBQUksbUJBQU8sS0FBSyxDQUFDLFNBQVMsRUFBRTtBQUNoRCxhQUFPLEVBQVAsT0FBTztBQUNQLGNBQVEsRUFBUixRQUFRO0FBQ1IsVUFBSSxFQUFFLHlCQUFNLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxDQUFFO0tBQy9CLENBQUU7R0FBQSxDQUFFLENBQUM7Q0FDUCIsImZpbGUiOiJjb25uZWN0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgc3luYyB9IGZyb20gJ2JhY2tib25lLXBvdWNoJztcbmltcG9ydCB7IG1lcmdlIH0gZnJvbSAnbG9kYXNoJztcblxuLy8gIyBDb25uZWN0IEZ1bmN0aW9uXG4vLyBHaXZlbiBhIFBvdWNoREIgZGF0YWJzZSBvYmplY3QgYW5kIGEgYmFja2JvbmUgY2xhc3MsIGNvbm5lY3QgdGhhdCBjbGFzc1xuLy8gdG8gdGhlIGRhdGFiYXNlIHdpdGggYmFja2JvbmUtcG91Y2guIFRoaXMgZnVuY3Rpb24gZXh0ZW5kcyB0aGUgYmFja2JvbmVcbi8vIG1vZGVsIG9yIGNvbGxlY3Rpb24gZmlyc3QsIHNvIHdlIGRvbid0IG1vZGlmeSBga2xhc3NgLlxuLy9cbi8vIEluIG9yZGVyIGZvciB0aGlzIHRvIGJlIHVzZWZ1bCwgdGhlIGJhY2tib25lIG1vZGVsIG9yIGNvbGxlY3Rpb24gY2xhc3MgbXVzdFxuLy8gc3BlY2lmeSBhIFtgcG91Y2hgIG9iamVjdF0oaHR0cHM6Ly9naXRodWIuY29tL2pvL2JhY2tib25lLXBvdWNoKS5cbmV4cG9ydCBmdW5jdGlvbiBjb25uZWN0KCBkYXRhYmFzZSwga2xhc3MgKSB7XG4gIHJldHVybiBrbGFzcy5leHRlbmQoIHtcbiAgICBjb25uZWN0LFxuICAgIGRhdGFiYXNlLFxuICAgIHN5bmM6IHN5bmMoIHsgZGI6IGRhdGFiYXNlIH0gKVxuICB9ICk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjb25uZWN0TXV0KCBkYXRhYmFzZSwga2xhc3NlcyApIHtcbiAga2xhc3Nlcy5mb3JFYWNoKCBrbGFzcyA9PiBtZXJnZSgga2xhc3MucHJvdG90eXBlLCB7XG4gICAgY29ubmVjdCxcbiAgICBkYXRhYmFzZSxcbiAgICBzeW5jOiBzeW5jKCB7IGRiOiBkYXRhYmFzZSB9IClcbiAgfSApICk7XG59XG4iXX0=