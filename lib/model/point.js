'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CommentCollection = exports.Comment = exports.PointCollection = exports.Alert = exports.Service = exports.Point = exports.pointCommentId = exports.pointId = exports.alertTypes = exports.serviceTypes = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; })(); /* btc-app-server -- Server for the Bicycle Touring Companion
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            * Copyright © 2016 Adventure Cycling Association
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            * This file is part of btc-app-server.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            * btc-app-server is free software: you can redistribute it and/or modify
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            * it under the terms of the Affero GNU General Public License as published by
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            * the Free Software Foundation, either version 3 of the License, or
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            * (at your option) any later version.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            * btc-app-server is distributed in the hope that it will be useful,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            * but WITHOUT ANY WARRANTY; without even the implied warranty of
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            * Affero GNU General Public License for more details.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            * You should have received a copy of the Affero GNU General Public License
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            * along with Foobar.  If not, see <http://www.gnu.org/licenses/>.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            */

exports.display = display;

var _lodash = require('lodash');

var _validationMixin = require('./validation-mixin');

var _base = require('./base');

var _docuri = require('docuri');

var _docuri2 = _interopRequireDefault(_docuri);

var _ngeohash = require('ngeohash');

var _ngeohash2 = _interopRequireDefault(_ngeohash);

var _toId = require('to-id');

var _toId2 = _interopRequireDefault(_toId);

var _nodeUuid = require('node-uuid');

var _nodeUuid2 = _interopRequireDefault(_nodeUuid);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*esfmt-ignore-start*/
var serviceTypes = exports.serviceTypes = {
  'airport': { display: 'Airport' },
  'bar': { display: 'Bar' },
  'bed_and_breakfast': { display: 'Bed & Breakfast' },
  'bike_shop': { display: 'Bike Shop' },
  'cabin': { display: 'Cabin' },
  'campground': { display: 'Campground' },
  'convenience_store': { display: 'Convenience Store' },
  'cyclists_camping': { display: 'Cyclists\' Camping' },
  'cyclists_lodging': { display: 'Cyclists\' Lodging' },
  'grocery': { display: 'Grocery' },
  'hostel': { display: 'Hostel' },
  'hot_spring': { display: 'Hot Spring' },
  'hotel': { display: 'Hotel' },
  'motel': { display: 'Motel' },
  'information': { display: 'Information' },
  'library': { display: 'Library' },
  'museum': { display: 'Museum' },
  'outdoor_store': { display: 'Outdoor Store' },
  'rest_area': { display: 'Rest Area' },
  'restaurant': { display: 'Restaurant' },
  'restroom': { display: 'Restroom' },
  'scenic_area': { display: 'Scenic Area' },
  'state_park': { display: 'State Park' },
  'other': { display: 'Other' }
};

var alertTypes = exports.alertTypes = {
  'road_closure': { display: 'Road Closure' },
  'forest_fire': { display: 'Forest fire' },
  'flooding': { display: 'Flooding' },
  'detour': { display: 'Detour' },
  'other': { display: 'Other' }
};
/*esfmt-ignore-end*/

function display(type) {
  var values = serviceTypes[type] || alertTypes[type];
  if (values) {
    return values.display;
  } else {
    return null;
  }
}

var pointId = exports.pointId = _docuri2.default.route('point/:type/:name/:geohash');
var pointCommentId = exports.pointCommentId = _docuri2.default.route('point/:type/:name/:geohash/comment/:uuid');

var Point = exports.Point = _base.CouchModel.extend({
  idAttribute: 'id',

  initialize: function initialize(attributes, options) {
    _base.CouchModel.prototype.initialize.apply(arguments);
    this.created_at = new Date().toISOString();
  },

  specify: function specify(type, name, location) {
    if (name) {
      var _location = _slicedToArray(location, 2);

      var lat = _location[0];
      var lng = _location[1];

      var id = pointId({
        type: type,
        name: (0, _toId2.default)(name),
        geohash: _ngeohash2.default.encode(lat, lng)
      });
      this.set({ id: id, type: type, name: name, location: location });
    } else {
      var _attributes = this.attributes;
      var _name = _attributes.name;
      var _location2 = _attributes.location;

      var _location3 = _slicedToArray(_location2, 2);

      var lat = _location3[0];
      var lng = _location3[1];

      var id = pointId({
        type: type,
        name: (0, _toId2.default)(_name),
        geohash: _ngeohash2.default.encode(lat, lng)
      });
      this.set({ id: id });
    }
  },

  schema: {
    $schema: 'http://json-schema.org/draft-04/schema#',
    type: 'object',
    additionalProperties: false, // But subclasses can merge
    properties: {
      name: {
        type: 'string'
      },
      location: {
        type: 'array',
        minItems: 2,
        maxItems: 2,
        items: {
          type: 'number'
        }
      },
      type: {
        type: 'string'
      },
      created_at: {
        type: 'string',
        format: 'date-time'
      },
      description: {
        type: 'string'
      },
      flag: {
        type: 'boolean',
        default: false
      }
    },
    required: ['name', 'location', 'type', 'created_at', 'flag']
  }
});

var Service = exports.Service = Point.extend({
  specify: function specify(name, location) {
    Point.prototype.call(this, 'service', name, location);
  },

  schema: (0, _lodash.merge)({}, Point.prototype.schema, {
    properties: {
      type: {
        enum: (0, _lodash.keys)(serviceTypes)
      },
      amenities: {
        type: 'array',
        enum: (0, _lodash.keys)(serviceTypes)
      },
      address: {
        type: 'string'
      },
      schedule: {
        type: 'array'
      },
      seasonal: {
        type: 'boolean',
        default: false
      },
      phone: {
        type: 'string'
      },
      website: {
        type: 'string',
        format: 'uri'
      }
    },
    required: ['seasonal']
  })
});

(0, _validationMixin.mixinValidation)(Service);

var Alert = exports.Alert = Point.extend({
  specify: function specify(name, location) {
    Point.prototype.call(this, 'alert', name, location);
  },

  schema: (0, _lodash.merge)({}, Point.prototype.schema, {
    'type': {
      'enum': (0, _lodash.keys)(alertTypes)
    }
  })
});

(0, _validationMixin.mixinValidation)(Alert);

var PointCollection = exports.PointCollection = _base.CouchCollection.extend({
  initialize: function initialize(models, options) {
    _base.CouchCollection.prototype.initialize.apply(this, arguments);
    var center = options.center;
    var radius = options.radius; // For later

    this.pouch = {
      options: {
        allDocs: _extends({
          include_docs: true
        }, (0, _base.keysBetween)('/point'))
      }
    };
  },

  model: function model(attributes, options) {
    var parts = pointId(attributes.id);
    if (parts.type === 'service') {
      return new Service(attributes, options);
    } else if (parts.type === 'alert') {
      return new Alert(attributes, options);
    } else {
      throw 'A point must be either a service or alert';
    }
  }
});

var COMMENT_MAX_LENGTH = 140;
var Comment = exports.Comment = _base.CouchModel.extend({
  idAttribute: 'id',

  schema: {
    'username': {
      'type': 'string'
    },
    'text': {
      'type': 'string',
      'maxLength': COMMENT_MAX_LENGTH
    },
    'rating': {
      'type': 'integer',
      'minimum': 1,
      'maximum': 5
    }
  }
}, {
  MAX_LENGTH: COMMENT_MAX_LENGTH,

  create: function create() {
    return new Comment({ id: _nodeUuid2.default.v1() });
  }
});

(0, _validationMixin.mixinValidation)(Comment);

var CommentCollection = exports.CommentCollection = _base.CouchCollection.extend({
  constructor: function constructor(pointId, models, options) {
    this.pointId = pointId;
    _base.CouchCollection.apply(this, models, options);
  },

  initialize: function initialize(models, options) {
    _base.CouchCollection.prototype.initialize.apply(this, arguments);
    this.pouch = {
      options: {
        allDocs: _extends({
          include_docs: true
        }, (0, _base.keysBetween)(this.pointId + '/comment'))
      }
    };
  }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tb2RlbC9wb2ludC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O1FBa0VnQixPQUFPLEdBQVAsT0FBTzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBcENoQixJQUFNLFlBQVksV0FBWixZQUFZLEdBQUc7QUFDMUIsV0FBUyxFQUFZLEVBQUUsT0FBTyxFQUFFLFNBQVMsRUFBRTtBQUMzQyxPQUFLLEVBQWdCLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRTtBQUN2QyxxQkFBbUIsRUFBRSxFQUFFLE9BQU8sRUFBRSxpQkFBaUIsRUFBRTtBQUNuRCxhQUFXLEVBQVUsRUFBRSxPQUFPLEVBQUUsV0FBVyxFQUFFO0FBQzdDLFNBQU8sRUFBYyxFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUU7QUFDekMsY0FBWSxFQUFTLEVBQUUsT0FBTyxFQUFFLFlBQVksRUFBRTtBQUM5QyxxQkFBbUIsRUFBRSxFQUFFLE9BQU8sRUFBRSxtQkFBbUIsRUFBRTtBQUNyRCxvQkFBa0IsRUFBRyxFQUFFLE9BQU8sRUFBRSxvQkFBb0IsRUFBRTtBQUN0RCxvQkFBa0IsRUFBRyxFQUFFLE9BQU8sRUFBRSxvQkFBb0IsRUFBRTtBQUN0RCxXQUFTLEVBQVksRUFBRSxPQUFPLEVBQUUsU0FBUyxFQUFFO0FBQzNDLFVBQVEsRUFBYSxFQUFFLE9BQU8sRUFBRSxRQUFRLEVBQUU7QUFDMUMsY0FBWSxFQUFTLEVBQUUsT0FBTyxFQUFFLFlBQVksRUFBRTtBQUM5QyxTQUFPLEVBQWMsRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFFO0FBQ3pDLFNBQU8sRUFBYyxFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUU7QUFDekMsZUFBYSxFQUFRLEVBQUUsT0FBTyxFQUFFLGFBQWEsRUFBRTtBQUMvQyxXQUFTLEVBQVksRUFBRSxPQUFPLEVBQUUsU0FBUyxFQUFFO0FBQzNDLFVBQVEsRUFBYSxFQUFFLE9BQU8sRUFBRSxRQUFRLEVBQUU7QUFD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QUFFLEVBQUUsRUFBRSxFQUFFLG1CQUFLLEVBQUUsRUFBRSxFQUFFLENBQUUsQ0FBQztHQUN6QztDQUNGLENBQUUsQ0FBQzs7QUFFSixzQ0FBaUIsT0FBTyxDQUFFLENBQUM7O0FBRXBCLElBQU0saUJBQWlCLFdBQWpCLGlCQUFpQixHQUFHLHNCQUFnQixNQUFNLENBQUU7QUFDdkQsYUFBVyxFQUFFLHFCQUFVLE9BQU8sRUFBRSxNQUFNLEVBQUUsT0FBTyxFQUFHO0FBQ2hELFFBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO0FBQ3ZCLDBCQUFnQixLQUFLLENBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxPQUFPLENBQUUsQ0FBQztHQUNoRDs7QUFFRCxZQUFVLEVBQUUsb0JBQVUsTUFBTSxFQUFFLE9BQU8sRUFBRztBQUN0QywwQkFBZ0IsU0FBUyxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUUsSUFBSSxFQUFFLFNBQVMsQ0FBRSxDQUFDO0FBQzlELFFBQUksQ0FBQyxLQUFLLEdBQUc7QUFDWCxhQUFPLEVBQUU7QUFDUCxlQUFPO0FBQ0wsc0JBQVksRUFBRSxJQUFJO1dBQ2YsdUJBQWEsSUFBSSxDQUFDLE9BQU8sR0FBRyxVQUFVLENBQUUsQ0FDNUM7T0FDRjtLQUNGLENBQUM7R0FDSDtDQUNGLENBQUUsQ0FBQyIsImZpbGUiOiJwb2ludC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIGJ0Yy1hcHAtc2VydmVyIC0tIFNlcnZlciBmb3IgdGhlIEJpY3ljbGUgVG91cmluZyBDb21wYW5pb25cbiAqIENvcHlyaWdodCDCqSAyMDE2IEFkdmVudHVyZSBDeWNsaW5nIEFzc29jaWF0aW9uXG4gKlxuICogVGhpcyBmaWxlIGlzIHBhcnQgb2YgYnRjLWFwcC1zZXJ2ZXIuXG4gKlxuICogYnRjLWFwcC1zZXJ2ZXIgaXMgZnJlZSBzb2Z0d2FyZTogeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeVxuICogaXQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBBZmZlcm8gR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgYXMgcHVibGlzaGVkIGJ5XG4gKiB0aGUgRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uLCBlaXRoZXIgdmVyc2lvbiAzIG9mIHRoZSBMaWNlbnNlLCBvclxuICogKGF0IHlvdXIgb3B0aW9uKSBhbnkgbGF0ZXIgdmVyc2lvbi5cbiAqXG4gKiBidGMtYXBwLXNlcnZlciBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLFxuICogYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2ZcbiAqIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gIFNlZSB0aGVcbiAqIEFmZmVybyBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZSBkZXRhaWxzLlxuICpcbiAqIFlvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEFmZmVybyBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuICogYWxvbmcgd2l0aCBGb29iYXIuICBJZiBub3QsIHNlZSA8aHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG4gKi9cblxuaW1wb3J0IHsgbWVyZ2UsIGtleXMgfSBmcm9tICdsb2Rhc2gnO1xuXG5pbXBvcnQgeyBtaXhpblZhbGlkYXRpb24gfSBmcm9tICcuL3ZhbGlkYXRpb24tbWl4aW4nO1xuaW1wb3J0IHsgQ291Y2hNb2RlbCwgQ291Y2hDb2xsZWN0aW9uLCBrZXlzQmV0d2VlbiB9IGZyb20gJy4vYmFzZSc7XG5cbmltcG9ydCBkb2N1cmkgZnJvbSAnZG9jdXJpJztcbmltcG9ydCBuZ2VvaGFzaCBmcm9tICduZ2VvaGFzaCc7XG5pbXBvcnQgbm9ybWFsaXplIGZyb20gJ3RvLWlkJztcbmltcG9ydCB1dWlkIGZyb20gJ25vZGUtdXVpZCc7XG5cbi8qZXNmbXQtaWdub3JlLXN0YXJ0Ki9cbmV4cG9ydCBjb25zdCBzZXJ2aWNlVHlwZXMgPSB7XG4gICdhaXJwb3J0JzogICAgICAgICAgIHsgZGlzcGxheTogJ0FpcnBvcnQnIH0sXG4gICdiYXInOiAgICAgICAgICAgICAgIHsgZGlzcGxheTogJ0JhcicgfSxcbiAgJ2JlZF9hbmRfYnJlYWtmYXN0JzogeyBkaXNwbGF5OiAnQmVkICYgQnJlYWtmYXN0JyB9LFxuICAnYmlrZV9zaG9wJzogICAgICAgICB7IGRpc3BsYXk6ICdCaWtlIFNob3AnIH0sXG4gICdjYWJpbic6ICAgICAgICAgICAgIHsgZGlzcGxheTogJ0NhYmluJyB9LFxuICAnY2FtcGdyb3VuZCc6ICAgICAgICB7IGRpc3BsYXk6ICdDYW1wZ3JvdW5kJyB9LFxuICAnY29udmVuaWVuY2Vfc3RvcmUnOiB7IGRpc3BsYXk6ICdDb252ZW5pZW5jZSBTdG9yZScgfSxcbiAgJ2N5Y2xpc3RzX2NhbXBpbmcnOiAgeyBkaXNwbGF5OiAnQ3ljbGlzdHNcXCcgQ2FtcGluZycgfSxcbiAgJ2N5Y2xpc3RzX2xvZGdpbmcnOiAgeyBkaXNwbGF5OiAnQ3ljbGlzdHNcXCcgTG9kZ2luZycgfSxcbiAgJ2dyb2NlcnknOiAgICAgICAgICAgeyBkaXNwbGF5OiAnR3JvY2VyeScgfSxcbiAgJ2hvc3RlbCc6ICAgICAgICAgICAgeyBkaXNwbGF5OiAnSG9zdGVsJyB9LFxuICAnaG90X3NwcmluZyc6ICAgICAgICB7IGRpc3BsYXk6ICdIb3QgU3ByaW5nJyB9LFxuICAnaG90ZWwnOiAgICAgICAgICAgICB7IGRpc3BsYXk6ICdIb3RlbCcgfSxcbiAgJ21vdGVsJzogICAgICAgICAgICAgeyBkaXNwbGF5OiAnTW90ZWwnIH0sXG4gICdpbmZvcm1hdGlvbic6ICAgICAgIHsgZGlzcGxheTogJ0luZm9ybWF0aW9uJyB9LFxuICAnbGlicmFyeSc6ICAgICAgICAgICB7IGRpc3BsYXk6ICdMaWJyYXJ5JyB9LFxuICAnbXVzZXVtJzogICAgICAgICAgICB7IGRpc3BsYXk6ICdNdXNldW0nIH0sXG4gICdvdXRkb29yX3N0b3JlJzogICAgIHsgZGlzcGxheTogJ091dGRvb3IgU3RvcmUnIH0sXG4gICdyZXN0X2FyZWEnOiAgICAgICAgIHsgZGlzcGxheTogJ1Jlc3QgQXJlYScgfSxcbiAgJ3Jlc3RhdXJhbnQnOiAgICAgICAgeyBkaXNwbGF5OiAnUmVzdGF1cmFudCcgfSxcbiAgJ3Jlc3Ryb29tJzogICAgICAgICAgeyBkaXNwbGF5OiAnUmVzdHJvb20nIH0sXG4gICdzY2VuaWNfYXJlYSc6ICAgICAgIHsgZGlzcGxheTogJ1NjZW5pYyBBcmVhJyB9LFxuICAnc3RhdGVfcGFyayc6ICAgICAgICB7IGRpc3BsYXk6ICdTdGF0ZSBQYXJrJyB9LFxuICAnb3RoZXInOiAgICAgICAgICAgICB7IGRpc3BsYXk6ICdPdGhlcicgfVxufTtcblxuZXhwb3J0IGNvbnN0IGFsZXJ0VHlwZXMgPSB7XG4gICdyb2FkX2Nsb3N1cmUnOiAgICAgIHsgZGlzcGxheTogJ1JvYWQgQ2xvc3VyZScgfSxcbiAgJ2ZvcmVzdF9maXJlJzogICAgICAgeyBkaXNwbGF5OiAnRm9yZXN0IGZpcmUnIH0sXG4gICdmbG9vZGluZyc6ICAgICAgICAgIHsgZGlzcGxheTogJ0Zsb29kaW5nJyB9LFxuICAnZGV0b3VyJzogICAgICAgICAgICB7IGRpc3BsYXk6ICdEZXRvdXInIH0sXG4gICdvdGhlcic6ICAgICAgICAgICAgIHsgZGlzcGxheTogJ090aGVyJyB9XG59O1xuLyplc2ZtdC1pZ25vcmUtZW5kKi9cblxuZXhwb3J0IGZ1bmN0aW9uIGRpc3BsYXkoIHR5cGUgKSB7XG4gIGNvbnN0IHZhbHVlcyA9IHNlcnZpY2VUeXBlc1sgdHlwZSBdIHx8IGFsZXJ0VHlwZXNbIHR5cGUgXTtcbiAgaWYgKCB2YWx1ZXMgKSB7XG4gICAgcmV0dXJuIHZhbHVlcy5kaXNwbGF5O1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBudWxsO1xuICB9XG59XG5cbmV4cG9ydCBjb25zdCBwb2ludElkID0gZG9jdXJpLnJvdXRlKCAncG9pbnQvOnR5cGUvOm5hbWUvOmdlb2hhc2gnICk7XG5leHBvcnQgY29uc3QgcG9pbnRDb21tZW50SWQgPSBkb2N1cmkucm91dGUoICdwb2ludC86dHlwZS86bmFtZS86Z2VvaGFzaC9jb21tZW50Lzp1dWlkJyApO1xuXG5leHBvcnQgY29uc3QgUG9pbnQgPSBDb3VjaE1vZGVsLmV4dGVuZCgge1xuICBpZEF0dHJpYnV0ZTogJ2lkJyxcblxuICBpbml0aWFsaXplOiBmdW5jdGlvbiggYXR0cmlidXRlcywgb3B0aW9ucyApIHtcbiAgICBDb3VjaE1vZGVsLnByb3RvdHlwZS5pbml0aWFsaXplLmFwcGx5KCBhcmd1bWVudHMgKTtcbiAgICB0aGlzLmNyZWF0ZWRfYXQgPSBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCk7XG4gIH0sXG5cbiAgc3BlY2lmeTogZnVuY3Rpb24oIHR5cGUsIG5hbWUsIGxvY2F0aW9uICkge1xuICAgIGlmKCBuYW1lICkge1xuICAgICAgY29uc3QgW2xhdCwgbG5nXSA9IGxvY2F0aW9uO1xuICAgICAgY29uc3QgaWQgPSBwb2ludElkKCB7XG4gICAgICAgIHR5cGU6IHR5cGUsXG4gICAgICAgIG5hbWU6IG5vcm1hbGl6ZSggbmFtZSApLFxuICAgICAgICBnZW9oYXNoOiBuZ2VvaGFzaC5lbmNvZGUoIGxhdCwgbG5nIClcbiAgICAgIH0gKTtcbiAgICAgIHRoaXMuc2V0KCB7IGlkLCB0eXBlLCBuYW1lLCBsb2NhdGlvbiB9ICk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IHsgbmFtZSwgbG9jYXRpb24gfSA9IHRoaXMuYXR0cmlidXRlcztcbiAgICAgIGNvbnN0IFtsYXQsIGxuZ10gPSBsb2NhdGlvbjtcbiAgICAgIGNvbnN0IGlkID0gcG9pbnRJZCgge1xuICAgICAgICB0eXBlOiB0eXBlLFxuICAgICAgICBuYW1lOiBub3JtYWxpemUoIG5hbWUgKSxcbiAgICAgICAgZ2VvaGFzaDogbmdlb2hhc2guZW5jb2RlKCBsYXQsIGxuZyApXG4gICAgICB9ICk7XG4gICAgICB0aGlzLnNldCggeyBpZCB9ICk7XG4gICAgfVxuICB9LFxuXG4gIHNjaGVtYToge1xuICAgICRzY2hlbWE6ICdodHRwOi8vanNvbi1zY2hlbWEub3JnL2RyYWZ0LTA0L3NjaGVtYSMnLFxuICAgIHR5cGU6ICdvYmplY3QnLFxuICAgIGFkZGl0aW9uYWxQcm9wZXJ0aWVzOiBmYWxzZSwgLy8gQnV0IHN1YmNsYXNzZXMgY2FuIG1lcmdlXG4gICAgcHJvcGVydGllczoge1xuICAgICAgbmFtZToge1xuICAgICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgICAgfSxcbiAgICAgIGxvY2F0aW9uOiB7XG4gICAgICAgIHR5cGU6ICdhcnJheScsXG4gICAgICAgIG1pbkl0ZW1zOiAyLFxuICAgICAgICBtYXhJdGVtczogMixcbiAgICAgICAgaXRlbXM6IHtcbiAgICAgICAgICB0eXBlOiAnbnVtYmVyJ1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgdHlwZToge1xuICAgICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgICAgfSxcbiAgICAgIGNyZWF0ZWRfYXQ6IHtcbiAgICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICAgIGZvcm1hdDogJ2RhdGUtdGltZSdcbiAgICAgIH0sXG4gICAgICBkZXNjcmlwdGlvbjoge1xuICAgICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgICAgfSxcbiAgICAgIGZsYWc6IHtcbiAgICAgICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgICAgICBkZWZhdWx0OiBmYWxzZVxuICAgICAgfVxuICAgIH0sXG4gICAgcmVxdWlyZWQ6IFtcbiAgICAgICduYW1lJyxcbiAgICAgICdsb2NhdGlvbicsXG4gICAgICAndHlwZScsXG4gICAgICAnY3JlYXRlZF9hdCcsXG4gICAgICAnZmxhZydcbiAgICBdXG4gIH1cbn0gKTtcblxuZXhwb3J0IGNvbnN0IFNlcnZpY2UgPSBQb2ludC5leHRlbmQoIHtcbiAgc3BlY2lmeTogZnVuY3Rpb24oIG5hbWUsIGxvY2F0aW9uICkge1xuICAgIFBvaW50LnByb3RvdHlwZS5jYWxsKCB0aGlzLCAnc2VydmljZScsIG5hbWUsIGxvY2F0aW9uICk7XG4gIH0sXG5cbiAgc2NoZW1hOiBtZXJnZSgge30sIFBvaW50LnByb3RvdHlwZS5zY2hlbWEsIHtcbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICB0eXBlOiB7XG4gICAgICAgIGVudW06IGtleXMoc2VydmljZVR5cGVzKVxuICAgICAgfSxcbiAgICAgIGFtZW5pdGllczoge1xuICAgICAgICB0eXBlOiAnYXJyYXknLFxuICAgICAgICBlbnVtOiBrZXlzKHNlcnZpY2VUeXBlcylcbiAgICAgIH0sXG4gICAgICBhZGRyZXNzOiB7XG4gICAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgICB9LFxuICAgICAgc2NoZWR1bGU6IHtcbiAgICAgICAgdHlwZTogJ2FycmF5J1xuICAgICAgfSxcbiAgICAgIHNlYXNvbmFsOiB7XG4gICAgICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICAgICAgZGVmYXVsdDogZmFsc2VcbiAgICAgIH0sXG4gICAgICBwaG9uZToge1xuICAgICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgICAgfSxcbiAgICAgIHdlYnNpdGU6IHtcbiAgICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICAgIGZvcm1hdDogJ3VyaSdcbiAgICAgIH1cbiAgICB9LFxuICAgIHJlcXVpcmVkOiBbXG4gICAgICAnc2Vhc29uYWwnXG4gICAgXVxuICB9IClcbn0gKTtcblxubWl4aW5WYWxpZGF0aW9uKCBTZXJ2aWNlICk7XG5cbmV4cG9ydCBjb25zdCBBbGVydCA9IFBvaW50LmV4dGVuZCgge1xuICBzcGVjaWZ5OiBmdW5jdGlvbiggbmFtZSwgbG9jYXRpb24gKSB7XG4gICAgUG9pbnQucHJvdG90eXBlLmNhbGwoIHRoaXMsICdhbGVydCcsIG5hbWUsIGxvY2F0aW9uICk7XG4gIH0sXG5cbiAgc2NoZW1hOiBtZXJnZSgge30sIFBvaW50LnByb3RvdHlwZS5zY2hlbWEsIHtcbiAgICAndHlwZSc6IHtcbiAgICAgICdlbnVtJzoga2V5cyhhbGVydFR5cGVzKVxuICAgIH1cbiAgfSApXG59ICk7XG5cbm1peGluVmFsaWRhdGlvbiggQWxlcnQgKTtcblxuZXhwb3J0IGNvbnN0IFBvaW50Q29sbGVjdGlvbiA9IENvdWNoQ29sbGVjdGlvbi5leHRlbmQoIHtcbiAgaW5pdGlhbGl6ZTogZnVuY3Rpb24oIG1vZGVscywgb3B0aW9ucyApIHtcbiAgICBDb3VjaENvbGxlY3Rpb24ucHJvdG90eXBlLmluaXRpYWxpemUuYXBwbHkoIHRoaXMsIGFyZ3VtZW50cyApO1xuICAgIGNvbnN0IHsgY2VudGVyLCByYWRpdXMgfSA9IG9wdGlvbnM7IC8vIEZvciBsYXRlclxuICAgIHRoaXMucG91Y2ggPSB7XG4gICAgICBvcHRpb25zOiB7XG4gICAgICAgIGFsbERvY3M6IHtcbiAgICAgICAgICBpbmNsdWRlX2RvY3M6IHRydWUsXG4gICAgICAgICAgLi4ua2V5c0JldHdlZW4oICcvcG9pbnQnIClcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG4gIH0sXG5cbiAgbW9kZWw6IGZ1bmN0aW9uKCBhdHRyaWJ1dGVzLCBvcHRpb25zICkge1xuICAgIGNvbnN0IHBhcnRzID0gcG9pbnRJZCggYXR0cmlidXRlcy5pZCApO1xuICAgIGlmKCBwYXJ0cy50eXBlID09PSAnc2VydmljZScgKSB7XG4gICAgICByZXR1cm4gbmV3IFNlcnZpY2UoIGF0dHJpYnV0ZXMsIG9wdGlvbnMgKTtcbiAgICB9IGVsc2UgaWYoIHBhcnRzLnR5cGUgPT09ICdhbGVydCcgKSB7XG4gICAgICByZXR1cm4gbmV3IEFsZXJ0KCBhdHRyaWJ1dGVzLCBvcHRpb25zICk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93ICdBIHBvaW50IG11c3QgYmUgZWl0aGVyIGEgc2VydmljZSBvciBhbGVydCc7XG4gICAgfVxuICB9XG59ICk7XG5cbmNvbnN0IENPTU1FTlRfTUFYX0xFTkdUSCA9IDE0MDtcbmV4cG9ydCBjb25zdCBDb21tZW50ID0gQ291Y2hNb2RlbC5leHRlbmQoIHtcbiAgaWRBdHRyaWJ1dGU6ICdpZCcsXG5cbiAgc2NoZW1hOiB7XG4gICAgJ3VzZXJuYW1lJzoge1xuICAgICAgJ3R5cGUnOiAnc3RyaW5nJ1xuICAgIH0sXG4gICAgJ3RleHQnOiB7XG4gICAgICAndHlwZSc6ICdzdHJpbmcnLFxuICAgICAgJ21heExlbmd0aCc6IENPTU1FTlRfTUFYX0xFTkdUSFxuICAgIH0sXG4gICAgJ3JhdGluZyc6IHtcbiAgICAgICd0eXBlJzogJ2ludGVnZXInLFxuICAgICAgJ21pbmltdW0nOiAxLFxuICAgICAgJ21heGltdW0nOiA1XG4gICAgfVxuICB9XG59LCB7XG4gIE1BWF9MRU5HVEg6IENPTU1FTlRfTUFYX0xFTkdUSCxcblxuICBjcmVhdGU6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBuZXcgQ29tbWVudCggeyBpZDogdXVpZC52MSgpIH0gKTtcbiAgfVxufSApO1xuXG5taXhpblZhbGlkYXRpb24oIENvbW1lbnQgKTtcblxuZXhwb3J0IGNvbnN0IENvbW1lbnRDb2xsZWN0aW9uID0gQ291Y2hDb2xsZWN0aW9uLmV4dGVuZCgge1xuICBjb25zdHJ1Y3RvcjogZnVuY3Rpb24oIHBvaW50SWQsIG1vZGVscywgb3B0aW9ucyApIHtcbiAgICB0aGlzLnBvaW50SWQgPSBwb2ludElkO1xuICAgIENvdWNoQ29sbGVjdGlvbi5hcHBseSggdGhpcywgbW9kZWxzLCBvcHRpb25zICk7XG4gIH0sXG5cbiAgaW5pdGlhbGl6ZTogZnVuY3Rpb24oIG1vZGVscywgb3B0aW9ucyApIHtcbiAgICBDb3VjaENvbGxlY3Rpb24ucHJvdG90eXBlLmluaXRpYWxpemUuYXBwbHkoIHRoaXMsIGFyZ3VtZW50cyApO1xuICAgIHRoaXMucG91Y2ggPSB7XG4gICAgICBvcHRpb25zOiB7XG4gICAgICAgIGFsbERvY3M6IHtcbiAgICAgICAgICBpbmNsdWRlX2RvY3M6IHRydWUsXG4gICAgICAgICAgLi4ua2V5c0JldHdlZW4oIHRoaXMucG9pbnRJZCArICcvY29tbWVudCcgKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcbiAgfVxufSApO1xuIl19