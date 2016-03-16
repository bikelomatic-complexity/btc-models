'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.pointId = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.pointIdFromRaw = pointIdFromRaw;

var _docuri = require('docuri');

var _docuri2 = _interopRequireDefault(_docuri);

var _ngeohash = require('ngeohash');

var _ngeohash2 = _interopRequireDefault(_ngeohash);

var _toId = require('to-id');

var _toId2 = _interopRequireDefault(_toId);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var pointId = exports.pointId = _docuri2.default.route('point/:type/:name/:geohash');
function pointIdFromRaw(type, name, latlng) {
  var _latlng = _slicedToArray(latlng, 2);

  var lat = _latlng[0];
  var lng = _latlng[1];

  return pointId({
    type: type,
    name: (0, _toId2.default)(name),
    geohash: _ngeohash2.default.encode(lat, lng)
  });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tb2RlbC9wb2ludC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7UUFNZ0I7Ozs7Ozs7Ozs7Ozs7Ozs7QUFEVCxJQUFNLDRCQUFVLGlCQUFPLEtBQVAsQ0FBYyw0QkFBZCxDQUFWO0FBQ04sU0FBUyxjQUFULENBQXlCLElBQXpCLEVBQStCLElBQS9CLEVBQXFDLE1BQXJDLEVBQThDOytCQUNoQyxXQURnQzs7TUFDNUMsaUJBRDRDO01BQ3ZDLGlCQUR1Qzs7QUFFbkQsU0FBTyxRQUFTO0FBQ2QsVUFBTSxJQUFOO0FBQ0EsVUFBTSxvQkFBVyxJQUFYLENBQU47QUFDQSxhQUFTLG1CQUFTLE1BQVQsQ0FBaUIsR0FBakIsRUFBc0IsR0FBdEIsQ0FBVDtHQUhLLENBQVAsQ0FGbUQ7Q0FBOUMiLCJmaWxlIjoicG9pbnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcbmltcG9ydCBkb2N1cmkgZnJvbSAnZG9jdXJpJztcbmltcG9ydCBuZ2VvaGFzaCBmcm9tICduZ2VvaGFzaCc7XG5pbXBvcnQgbm9ybWFsaXplIGZyb20gJ3RvLWlkJztcblxuZXhwb3J0IGNvbnN0IHBvaW50SWQgPSBkb2N1cmkucm91dGUoICdwb2ludC86dHlwZS86bmFtZS86Z2VvaGFzaCcgKTtcbmV4cG9ydCBmdW5jdGlvbiBwb2ludElkRnJvbVJhdyggdHlwZSwgbmFtZSwgbGF0bG5nICkge1xuICBjb25zdCBbbGF0LCBsbmddID0gbGF0bG5nO1xuICByZXR1cm4gcG9pbnRJZCgge1xuICAgIHR5cGU6IHR5cGUsXG4gICAgbmFtZTogbm9ybWFsaXplKCBuYW1lICksXG4gICAgZ2VvaGFzaDogbmdlb2hhc2guZW5jb2RlKCBsYXQsIGxuZyApXG4gIH0gKTtcbn1cbiJdfQ==