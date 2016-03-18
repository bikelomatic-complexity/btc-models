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
  idAttribute: '_id',

  initialize: function initialize(attributes, options) {
    _base.CouchModel.prototype.initialize.apply(this, arguments);
    this.set('created_at', new Date().toISOString());
  },

  specify: function specify(type, name, location) {
    if (name) {
      var _location = _slicedToArray(location, 2);

      var lat = _location[0];
      var lng = _location[1];

      var _id = pointId({
        type: type,
        name: (0, _toId2.default)(name),
        geohash: _ngeohash2.default.encode(lat, lng)
      });
      this.set({ _id: _id, type: type, name: name, location: location });
    } else {
      var _attributes = this.attributes;
      var _name = _attributes.name;
      var _location2 = _attributes.location;

      var _location3 = _slicedToArray(_location2, 2);

      var lat = _location3[0];
      var lng = _location3[1];

      var _id = pointId({
        type: type,
        name: (0, _toId2.default)(_name),
        geohash: _ngeohash2.default.encode(lat, lng)
      });
      this.set({ _id: _id });
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
    Point.prototype.specify.call(this, 'service', name, location);
  },

  schema: (0, _lodash.merge)({}, Point.prototype.schema, {
    properties: {
      type: {
        enum: (0, _lodash.keys)(serviceTypes)
      },
      amenities: {
        type: 'array',
        items: {
          type: 'string',
          enum: (0, _lodash.keys)(serviceTypes)
        }
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
    Point.prototype.specify.call(this, 'alert', name, location);
  },

  schema: (0, _lodash.merge)({}, Point.prototype.schema, {
    properties: {
      type: {
        enum: (0, _lodash.keys)(alertTypes)
      }
    }
  })
});

(0, _validationMixin.mixinValidation)(Alert);

var PointCollection = exports.PointCollection = _base.CouchCollection.extend({
  initialize: function initialize(models, options) {
    _base.CouchCollection.prototype.initialize.apply(this, arguments);

    // const { bbox } = options; // For later, to get points in a bbox
    this.pouch = {
      options: {
        allDocs: _extends({ include_docs: true }, (0, _base.keysBetween)('point/'))
      }
    };

    var connect = this.connect;
    var database = this.database;
    this.service = connect ? connect(database, Service) : Service;
    this.alert = connect ? connect(database, Alert) : Alert;
  },

  model: function model(attributes, options) {
    var parts = pointId(attributes._id);
    var map = {
      'service': options.collection.service,
      'alert': options.collection.alert
    };
    var constructor = map[parts.type];
    if (constructor) {
      return new constructor(attributes, options);
    } else {
      throw 'A point must be either a service or alert';
    }
  }
});

var COMMENT_MAX_LENGTH = 140;
var Comment = exports.Comment = _base.CouchModel.extend({
  idAttribute: '_id',

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
    return new Comment({ _id: _nodeUuid2.default.v1() });
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
        allDocs: _extends({}, (0, _base.keysBetween)(this.pointId + '/comment'), {
          include_docs: true
        })
      }
    };
  }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tb2RlbC9wb2ludC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O1FBa0VnQixPQUFPLEdBQVAsT0FBTzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBcENoQixJQUFNLFlBQVksV0FBWixZQUFZLEdBQUc7QUFDMUIsV0FBUyxFQUFZLEVBQUUsT0FBTyxFQUFFLFNBQVMsRUFBRTtBQUMzQyxPQUFLLEVBQWdCLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRTtBQUN2QyxxQkFBbUIsRUFBRSxFQUFFLE9BQU8sRUFBRSxpQkFBaUIsRUFBRTtBQUNuRCxhQUFXLEVBQVUsRUFBRSxPQUFPLEVBQUUsV0FBVyxFQUFFO0FBQzdDLFNBQU8sRUFBYyxFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUU7QUFDekMsY0FBWSxFQUFTLEVBQUUsT0FBTyxFQUFFLFlBQVksRUFBRTtBQUM5QyxxQkFBbUIsRUFBRSxFQUFFLE9BQU8sRUFBRSxtQkFBbUIsRUFBRTtBQUNyRCxvQkFBa0IsRUFBRyxFQUFFLE9BQU8sRUFBRSxvQkFBb0IsRUFBRTtBQUN0RCxvQkFBa0IsRUFBRyxFQUFFLE9BQU8sRUFBRSxvQkFBb0IsRUFBRTtBQUN0RCxXQUFTLEVBQVksRUFBRSxPQUFPLEVBQUUsU0FBUyxFQUFFO0FBQzNDLFVBQVEsRUFBYSxFQUFFLE9BQU8sRUFBRSxRQUFRLEVBQUU7QUFDMUMsY0FBWSxFQUFTLEVBQUUsT0FBTyxFQUFFLFlBQVksRUFBRTtBQUM5QyxTQUFPLEVBQWMsRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFFO0FBQ3pDLFNBQU8sRUFBYyxFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUU7QUFDekMsZUFBYSxFQUFRLEVBQUUsT0FBTyxFQUFFLGFBQWEsRUFBRTtBQUMvQyxXQUFTLEVBQVksRUFBRSxPQUFPLEVBQUUsU0FBUyxFQUFFO0FBQzNDLFVBQVEsRUFBYSxFQUFFLE9BQU8sRUFBRSxRQUFRLEVBQUU7QUFD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QUUsQ0FBQyIsImZpbGUiOiJwb2ludC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIGJ0Yy1hcHAtc2VydmVyIC0tIFNlcnZlciBmb3IgdGhlIEJpY3ljbGUgVG91cmluZyBDb21wYW5pb25cbiAqIENvcHlyaWdodCDCqSAyMDE2IEFkdmVudHVyZSBDeWNsaW5nIEFzc29jaWF0aW9uXG4gKlxuICogVGhpcyBmaWxlIGlzIHBhcnQgb2YgYnRjLWFwcC1zZXJ2ZXIuXG4gKlxuICogYnRjLWFwcC1zZXJ2ZXIgaXMgZnJlZSBzb2Z0d2FyZTogeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeVxuICogaXQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBBZmZlcm8gR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgYXMgcHVibGlzaGVkIGJ5XG4gKiB0aGUgRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uLCBlaXRoZXIgdmVyc2lvbiAzIG9mIHRoZSBMaWNlbnNlLCBvclxuICogKGF0IHlvdXIgb3B0aW9uKSBhbnkgbGF0ZXIgdmVyc2lvbi5cbiAqXG4gKiBidGMtYXBwLXNlcnZlciBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLFxuICogYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2ZcbiAqIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gIFNlZSB0aGVcbiAqIEFmZmVybyBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZSBkZXRhaWxzLlxuICpcbiAqIFlvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEFmZmVybyBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuICogYWxvbmcgd2l0aCBGb29iYXIuICBJZiBub3QsIHNlZSA8aHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG4gKi9cblxuaW1wb3J0IHsgbWVyZ2UsIGtleXMgfSBmcm9tICdsb2Rhc2gnO1xuXG5pbXBvcnQgeyBtaXhpblZhbGlkYXRpb24gfSBmcm9tICcuL3ZhbGlkYXRpb24tbWl4aW4nO1xuaW1wb3J0IHsgQ291Y2hNb2RlbCwgQ291Y2hDb2xsZWN0aW9uLCBrZXlzQmV0d2VlbiB9IGZyb20gJy4vYmFzZSc7XG5cbmltcG9ydCBkb2N1cmkgZnJvbSAnZG9jdXJpJztcbmltcG9ydCBuZ2VvaGFzaCBmcm9tICduZ2VvaGFzaCc7XG5pbXBvcnQgbm9ybWFsaXplIGZyb20gJ3RvLWlkJztcbmltcG9ydCB1dWlkIGZyb20gJ25vZGUtdXVpZCc7XG5cbi8qZXNmbXQtaWdub3JlLXN0YXJ0Ki9cbmV4cG9ydCBjb25zdCBzZXJ2aWNlVHlwZXMgPSB7XG4gICdhaXJwb3J0JzogICAgICAgICAgIHsgZGlzcGxheTogJ0FpcnBvcnQnIH0sXG4gICdiYXInOiAgICAgICAgICAgICAgIHsgZGlzcGxheTogJ0JhcicgfSxcbiAgJ2JlZF9hbmRfYnJlYWtmYXN0JzogeyBkaXNwbGF5OiAnQmVkICYgQnJlYWtmYXN0JyB9LFxuICAnYmlrZV9zaG9wJzogICAgICAgICB7IGRpc3BsYXk6ICdCaWtlIFNob3AnIH0sXG4gICdjYWJpbic6ICAgICAgICAgICAgIHsgZGlzcGxheTogJ0NhYmluJyB9LFxuICAnY2FtcGdyb3VuZCc6ICAgICAgICB7IGRpc3BsYXk6ICdDYW1wZ3JvdW5kJyB9LFxuICAnY29udmVuaWVuY2Vfc3RvcmUnOiB7IGRpc3BsYXk6ICdDb252ZW5pZW5jZSBTdG9yZScgfSxcbiAgJ2N5Y2xpc3RzX2NhbXBpbmcnOiAgeyBkaXNwbGF5OiAnQ3ljbGlzdHNcXCcgQ2FtcGluZycgfSxcbiAgJ2N5Y2xpc3RzX2xvZGdpbmcnOiAgeyBkaXNwbGF5OiAnQ3ljbGlzdHNcXCcgTG9kZ2luZycgfSxcbiAgJ2dyb2NlcnknOiAgICAgICAgICAgeyBkaXNwbGF5OiAnR3JvY2VyeScgfSxcbiAgJ2hvc3RlbCc6ICAgICAgICAgICAgeyBkaXNwbGF5OiAnSG9zdGVsJyB9LFxuICAnaG90X3NwcmluZyc6ICAgICAgICB7IGRpc3BsYXk6ICdIb3QgU3ByaW5nJyB9LFxuICAnaG90ZWwnOiAgICAgICAgICAgICB7IGRpc3BsYXk6ICdIb3RlbCcgfSxcbiAgJ21vdGVsJzogICAgICAgICAgICAgeyBkaXNwbGF5OiAnTW90ZWwnIH0sXG4gICdpbmZvcm1hdGlvbic6ICAgICAgIHsgZGlzcGxheTogJ0luZm9ybWF0aW9uJyB9LFxuICAnbGlicmFyeSc6ICAgICAgICAgICB7IGRpc3BsYXk6ICdMaWJyYXJ5JyB9LFxuICAnbXVzZXVtJzogICAgICAgICAgICB7IGRpc3BsYXk6ICdNdXNldW0nIH0sXG4gICdvdXRkb29yX3N0b3JlJzogICAgIHsgZGlzcGxheTogJ091dGRvb3IgU3RvcmUnIH0sXG4gICdyZXN0X2FyZWEnOiAgICAgICAgIHsgZGlzcGxheTogJ1Jlc3QgQXJlYScgfSxcbiAgJ3Jlc3RhdXJhbnQnOiAgICAgICAgeyBkaXNwbGF5OiAnUmVzdGF1cmFudCcgfSxcbiAgJ3Jlc3Ryb29tJzogICAgICAgICAgeyBkaXNwbGF5OiAnUmVzdHJvb20nIH0sXG4gICdzY2VuaWNfYXJlYSc6ICAgICAgIHsgZGlzcGxheTogJ1NjZW5pYyBBcmVhJyB9LFxuICAnc3RhdGVfcGFyayc6ICAgICAgICB7IGRpc3BsYXk6ICdTdGF0ZSBQYXJrJyB9LFxuICAnb3RoZXInOiAgICAgICAgICAgICB7IGRpc3BsYXk6ICdPdGhlcicgfVxufTtcblxuZXhwb3J0IGNvbnN0IGFsZXJ0VHlwZXMgPSB7XG4gICdyb2FkX2Nsb3N1cmUnOiAgICAgIHsgZGlzcGxheTogJ1JvYWQgQ2xvc3VyZScgfSxcbiAgJ2ZvcmVzdF9maXJlJzogICAgICAgeyBkaXNwbGF5OiAnRm9yZXN0IGZpcmUnIH0sXG4gICdmbG9vZGluZyc6ICAgICAgICAgIHsgZGlzcGxheTogJ0Zsb29kaW5nJyB9LFxuICAnZGV0b3VyJzogICAgICAgICAgICB7IGRpc3BsYXk6ICdEZXRvdXInIH0sXG4gICdvdGhlcic6ICAgICAgICAgICAgIHsgZGlzcGxheTogJ090aGVyJyB9XG59O1xuLyplc2ZtdC1pZ25vcmUtZW5kKi9cblxuZXhwb3J0IGZ1bmN0aW9uIGRpc3BsYXkoIHR5cGUgKSB7XG4gIGNvbnN0IHZhbHVlcyA9IHNlcnZpY2VUeXBlc1sgdHlwZSBdIHx8IGFsZXJ0VHlwZXNbIHR5cGUgXTtcbiAgaWYgKCB2YWx1ZXMgKSB7XG4gICAgcmV0dXJuIHZhbHVlcy5kaXNwbGF5O1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBudWxsO1xuICB9XG59XG5cbmV4cG9ydCBjb25zdCBwb2ludElkID0gZG9jdXJpLnJvdXRlKCAncG9pbnQvOnR5cGUvOm5hbWUvOmdlb2hhc2gnICk7XG5leHBvcnQgY29uc3QgcG9pbnRDb21tZW50SWQgPSBkb2N1cmkucm91dGUoICdwb2ludC86dHlwZS86bmFtZS86Z2VvaGFzaC9jb21tZW50Lzp1dWlkJyApO1xuXG5leHBvcnQgY29uc3QgUG9pbnQgPSBDb3VjaE1vZGVsLmV4dGVuZCgge1xuICBpZEF0dHJpYnV0ZTogJ19pZCcsXG5cbiAgaW5pdGlhbGl6ZTogZnVuY3Rpb24oIGF0dHJpYnV0ZXMsIG9wdGlvbnMgKSB7XG4gICAgQ291Y2hNb2RlbC5wcm90b3R5cGUuaW5pdGlhbGl6ZS5hcHBseSggdGhpcywgYXJndW1lbnRzICk7XG4gICAgdGhpcy5zZXQoICdjcmVhdGVkX2F0JywgbmV3IERhdGUoKS50b0lTT1N0cmluZygpICk7XG4gIH0sXG5cbiAgc3BlY2lmeTogZnVuY3Rpb24oIHR5cGUsIG5hbWUsIGxvY2F0aW9uICkge1xuICAgIGlmICggbmFtZSApIHtcbiAgICAgIGNvbnN0IFtsYXQsIGxuZ10gPSBsb2NhdGlvbjtcbiAgICAgIGNvbnN0IF9pZCA9IHBvaW50SWQoIHtcbiAgICAgICAgdHlwZTogdHlwZSxcbiAgICAgICAgbmFtZTogbm9ybWFsaXplKCBuYW1lICksXG4gICAgICAgIGdlb2hhc2g6IG5nZW9oYXNoLmVuY29kZSggbGF0LCBsbmcgKVxuICAgICAgfSApO1xuICAgICAgdGhpcy5zZXQoIHsgX2lkLCB0eXBlLCBuYW1lLCBsb2NhdGlvbiB9ICk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IHtuYW1lLCBsb2NhdGlvbn0gPSB0aGlzLmF0dHJpYnV0ZXM7XG4gICAgICBjb25zdCBbbGF0LCBsbmddID0gbG9jYXRpb247XG4gICAgICBjb25zdCBfaWQgPSBwb2ludElkKCB7XG4gICAgICAgIHR5cGU6IHR5cGUsXG4gICAgICAgIG5hbWU6IG5vcm1hbGl6ZSggbmFtZSApLFxuICAgICAgICBnZW9oYXNoOiBuZ2VvaGFzaC5lbmNvZGUoIGxhdCwgbG5nIClcbiAgICAgIH0gKTtcbiAgICAgIHRoaXMuc2V0KCB7IF9pZCB9ICk7XG4gICAgfVxuICB9LFxuXG4gIHNjaGVtYToge1xuICAgICRzY2hlbWE6ICdodHRwOi8vanNvbi1zY2hlbWEub3JnL2RyYWZ0LTA0L3NjaGVtYSMnLFxuICAgIHR5cGU6ICdvYmplY3QnLFxuICAgIGFkZGl0aW9uYWxQcm9wZXJ0aWVzOiBmYWxzZSwgLy8gQnV0IHN1YmNsYXNzZXMgY2FuIG1lcmdlXG4gICAgcHJvcGVydGllczoge1xuICAgICAgbmFtZToge1xuICAgICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgICAgfSxcbiAgICAgIGxvY2F0aW9uOiB7XG4gICAgICAgIHR5cGU6ICdhcnJheScsXG4gICAgICAgIG1pbkl0ZW1zOiAyLFxuICAgICAgICBtYXhJdGVtczogMixcbiAgICAgICAgaXRlbXM6IHtcbiAgICAgICAgICB0eXBlOiAnbnVtYmVyJ1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgdHlwZToge1xuICAgICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgICAgfSxcbiAgICAgIGNyZWF0ZWRfYXQ6IHtcbiAgICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICAgIGZvcm1hdDogJ2RhdGUtdGltZSdcbiAgICAgIH0sXG4gICAgICBkZXNjcmlwdGlvbjoge1xuICAgICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgICAgfSxcbiAgICAgIGZsYWc6IHtcbiAgICAgICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgICAgICBkZWZhdWx0OiBmYWxzZVxuICAgICAgfVxuICAgIH0sXG4gICAgcmVxdWlyZWQ6IFtcbiAgICAgICduYW1lJyxcbiAgICAgICdsb2NhdGlvbicsXG4gICAgICAndHlwZScsXG4gICAgICAnY3JlYXRlZF9hdCcsXG4gICAgICAnZmxhZydcbiAgICBdXG4gIH1cbn0gKTtcblxuZXhwb3J0IGNvbnN0IFNlcnZpY2UgPSBQb2ludC5leHRlbmQoIHtcbiAgc3BlY2lmeTogZnVuY3Rpb24oIG5hbWUsIGxvY2F0aW9uICkge1xuICAgIFBvaW50LnByb3RvdHlwZS5zcGVjaWZ5LmNhbGwoIHRoaXMsICdzZXJ2aWNlJywgbmFtZSwgbG9jYXRpb24gKTtcbiAgfSxcblxuICBzY2hlbWE6IG1lcmdlKCB7fSwgUG9pbnQucHJvdG90eXBlLnNjaGVtYSwge1xuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgIHR5cGU6IHtcbiAgICAgICAgZW51bToga2V5cyggc2VydmljZVR5cGVzIClcbiAgICAgIH0sXG4gICAgICBhbWVuaXRpZXM6IHtcbiAgICAgICAgdHlwZTogJ2FycmF5JyxcbiAgICAgICAgaXRlbXM6IHtcbiAgICAgICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgICAgICBlbnVtOiBrZXlzKCBzZXJ2aWNlVHlwZXMgKVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgYWRkcmVzczoge1xuICAgICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgICAgfSxcbiAgICAgIHNjaGVkdWxlOiB7XG4gICAgICAgIHR5cGU6ICdhcnJheSdcbiAgICAgIH0sXG4gICAgICBzZWFzb25hbDoge1xuICAgICAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgICAgIGRlZmF1bHQ6IGZhbHNlXG4gICAgICB9LFxuICAgICAgcGhvbmU6IHtcbiAgICAgICAgdHlwZTogJ3N0cmluZydcbiAgICAgIH0sXG4gICAgICB3ZWJzaXRlOiB7XG4gICAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgICBmb3JtYXQ6ICd1cmknXG4gICAgICB9XG4gICAgfSxcbiAgICByZXF1aXJlZDogW1xuICAgICAgJ3NlYXNvbmFsJ1xuICAgIF1cbiAgfSApXG59ICk7XG5cbm1peGluVmFsaWRhdGlvbiggU2VydmljZSApO1xuXG5leHBvcnQgY29uc3QgQWxlcnQgPSBQb2ludC5leHRlbmQoIHtcbiAgc3BlY2lmeTogZnVuY3Rpb24oIG5hbWUsIGxvY2F0aW9uICkge1xuICAgIFBvaW50LnByb3RvdHlwZS5zcGVjaWZ5LmNhbGwoIHRoaXMsICdhbGVydCcsIG5hbWUsIGxvY2F0aW9uICk7XG4gIH0sXG5cbiAgc2NoZW1hOiBtZXJnZSgge30sIFBvaW50LnByb3RvdHlwZS5zY2hlbWEsIHtcbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICB0eXBlOiB7XG4gICAgICAgIGVudW06IGtleXMoIGFsZXJ0VHlwZXMgKVxuICAgICAgfVxuICAgIH1cbiAgfSApXG59ICk7XG5cbm1peGluVmFsaWRhdGlvbiggQWxlcnQgKTtcblxuZXhwb3J0IGNvbnN0IFBvaW50Q29sbGVjdGlvbiA9IENvdWNoQ29sbGVjdGlvbi5leHRlbmQoIHtcbiAgaW5pdGlhbGl6ZTogZnVuY3Rpb24oIG1vZGVscywgb3B0aW9ucyApIHtcbiAgICBDb3VjaENvbGxlY3Rpb24ucHJvdG90eXBlLmluaXRpYWxpemUuYXBwbHkoIHRoaXMsIGFyZ3VtZW50cyApO1xuXG4gICAgLy8gY29uc3QgeyBiYm94IH0gPSBvcHRpb25zOyAvLyBGb3IgbGF0ZXIsIHRvIGdldCBwb2ludHMgaW4gYSBiYm94XG4gICAgdGhpcy5wb3VjaCA9IHtcbiAgICAgIG9wdGlvbnM6IHtcbiAgICAgICAgYWxsRG9jczogeyBpbmNsdWRlX2RvY3M6IHRydWUsIC4uLmtleXNCZXR3ZWVuKCAncG9pbnQvJyApIH1cbiAgICAgIH1cbiAgICB9O1xuXG4gICAgY29uc3QgY29ubmVjdCA9IHRoaXMuY29ubmVjdDtcbiAgICBjb25zdCBkYXRhYmFzZSA9IHRoaXMuZGF0YWJhc2U7XG4gICAgdGhpcy5zZXJ2aWNlID0gY29ubmVjdCA/IGNvbm5lY3QoIGRhdGFiYXNlLCBTZXJ2aWNlICkgOiBTZXJ2aWNlO1xuICAgIHRoaXMuYWxlcnQgPSBjb25uZWN0ID8gY29ubmVjdCggZGF0YWJhc2UsIEFsZXJ0ICkgOiBBbGVydDtcbiAgfSxcblxuICBtb2RlbDogZnVuY3Rpb24oIGF0dHJpYnV0ZXMsIG9wdGlvbnMgKSB7XG4gICAgY29uc3QgcGFydHMgPSBwb2ludElkKCBhdHRyaWJ1dGVzLl9pZCApO1xuICAgIGNvbnN0IG1hcCA9IHtcbiAgICAgICdzZXJ2aWNlJzogb3B0aW9ucy5jb2xsZWN0aW9uLnNlcnZpY2UsXG4gICAgICAnYWxlcnQnOiBvcHRpb25zLmNvbGxlY3Rpb24uYWxlcnRcbiAgICB9O1xuICAgIGNvbnN0IGNvbnN0cnVjdG9yID0gbWFwWyBwYXJ0cy50eXBlIF07XG4gICAgaWYgKCBjb25zdHJ1Y3RvciApIHtcbiAgICAgIHJldHVybiBuZXcgY29uc3RydWN0b3IoIGF0dHJpYnV0ZXMsIG9wdGlvbnMgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgJ0EgcG9pbnQgbXVzdCBiZSBlaXRoZXIgYSBzZXJ2aWNlIG9yIGFsZXJ0JztcbiAgICB9XG4gIH1cbn0gKTtcblxuY29uc3QgQ09NTUVOVF9NQVhfTEVOR1RIID0gMTQwO1xuZXhwb3J0IGNvbnN0IENvbW1lbnQgPSBDb3VjaE1vZGVsLmV4dGVuZCgge1xuICBpZEF0dHJpYnV0ZTogJ19pZCcsXG5cbiAgc2NoZW1hOiB7XG4gICAgJ3VzZXJuYW1lJzoge1xuICAgICAgJ3R5cGUnOiAnc3RyaW5nJ1xuICAgIH0sXG4gICAgJ3RleHQnOiB7XG4gICAgICAndHlwZSc6ICdzdHJpbmcnLFxuICAgICAgJ21heExlbmd0aCc6IENPTU1FTlRfTUFYX0xFTkdUSFxuICAgIH0sXG4gICAgJ3JhdGluZyc6IHtcbiAgICAgICd0eXBlJzogJ2ludGVnZXInLFxuICAgICAgJ21pbmltdW0nOiAxLFxuICAgICAgJ21heGltdW0nOiA1XG4gICAgfVxuICB9XG59LCB7XG4gIE1BWF9MRU5HVEg6IENPTU1FTlRfTUFYX0xFTkdUSCxcblxuICBjcmVhdGU6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBuZXcgQ29tbWVudCggeyBfaWQ6IHV1aWQudjEoKSB9ICk7XG4gIH1cbn0gKTtcblxubWl4aW5WYWxpZGF0aW9uKCBDb21tZW50ICk7XG5cbmV4cG9ydCBjb25zdCBDb21tZW50Q29sbGVjdGlvbiA9IENvdWNoQ29sbGVjdGlvbi5leHRlbmQoIHtcbiAgY29uc3RydWN0b3I6IGZ1bmN0aW9uKCBwb2ludElkLCBtb2RlbHMsIG9wdGlvbnMgKSB7XG4gICAgdGhpcy5wb2ludElkID0gcG9pbnRJZDtcbiAgICBDb3VjaENvbGxlY3Rpb24uYXBwbHkoIHRoaXMsIG1vZGVscywgb3B0aW9ucyApO1xuICB9LFxuXG4gIGluaXRpYWxpemU6IGZ1bmN0aW9uKCBtb2RlbHMsIG9wdGlvbnMgKSB7XG4gICAgQ291Y2hDb2xsZWN0aW9uLnByb3RvdHlwZS5pbml0aWFsaXplLmFwcGx5KCB0aGlzLCBhcmd1bWVudHMgKTtcbiAgICB0aGlzLnBvdWNoID0ge1xuICAgICAgb3B0aW9uczoge1xuICAgICAgICBhbGxEb2NzOiB7XG4gICAgICAgICAgLi4ua2V5c0JldHdlZW4oIHRoaXMucG9pbnRJZCArICcvY29tbWVudCcgKSxcbiAgICAgICAgICBpbmNsdWRlX2RvY3M6IHRydWVcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG4gIH1cbn0gKTtcbiJdfQ==