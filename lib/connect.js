'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.connect = connect;

var _backbonePouch = require('backbone-pouch');

function connect(database, klass) {
  return klass.extend({
    connect: connect,
    database: database,
    sync: (0, _backbonePouch.sync)({ db: database })
  });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9jb25uZWN0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O1FBRWdCLE9BQU8sR0FBUCxPQUFPOzs7O0FBQWhCLFNBQVMsT0FBTyxDQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUc7QUFDekMsU0FBTyxLQUFLLENBQUMsTUFBTSxDQUFFO0FBQ25CLFdBQU8sRUFBRSxPQUFPO0FBQ2hCLFlBQVEsRUFBRSxRQUFRO0FBQ2xCLFFBQUksRUFBRSx5QkFBTSxFQUFFLEVBQUUsRUFBRSxRQUFRLEVBQUUsQ0FBRTtHQUMvQixDQUFFLENBQUM7Q0FDTCIsImZpbGUiOiJjb25uZWN0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgc3luYyB9IGZyb20gJ2JhY2tib25lLXBvdWNoJztcblxuZXhwb3J0IGZ1bmN0aW9uIGNvbm5lY3QoIGRhdGFiYXNlLCBrbGFzcyApIHtcbiAgcmV0dXJuIGtsYXNzLmV4dGVuZCgge1xuICAgIGNvbm5lY3Q6IGNvbm5lY3QsXG4gICAgZGF0YWJhc2U6IGRhdGFiYXNlLFxuICAgIHN5bmM6IHN5bmMoIHsgZGI6IGRhdGFiYXNlIH0gKVxuICB9ICk7XG59XG4iXX0=