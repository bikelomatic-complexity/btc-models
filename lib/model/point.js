'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CommentCollection = exports.Comment = exports.PointCollection = exports.Alert = exports.Service = exports.Point = exports.pointId = exports.alertTypes = exports.serviceTypes = undefined;

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

  constructor: function constructor(attributes, options) {
    options = options || {};
    if (!attributes.uuid) {
      attributes.uuid = _nodeUuid2.default.v1();
    }
    if (!attributes._id) {
      attributes._id = options.pointId + '/comment/' + attributes.uuid;
    }
    _base.CouchModel.apply(this, arguments);
  },

  schema: {
    type: 'object',
    additionalProperties: false,
    properties: {
      username: {
        'type': 'string'
      },
      text: {
        'type': 'string',
        'maxLength': COMMENT_MAX_LENGTH
      },
      rating: {
        type: 'integer',
        minimum: 1,
        maximum: 5
      },
      uuid: {
        type: 'string'
      }
    },
    required: ['username', 'text', 'rating', 'uuid']
  }
}, {
  MAX_LENGTH: COMMENT_MAX_LENGTH
});

(0, _validationMixin.mixinValidation)(Comment);

var CommentCollection = exports.CommentCollection = _base.CouchCollection.extend({
  initialize: function initialize(models, options) {
    _base.CouchCollection.prototype.initialize.apply(this, arguments);
    var pointId = this.pointId = options.pointId;

    var connect = this.connect;
    var database = this.database;
    this.comment = connect ? connect(database, Comment) : Comment;

    this.pouch = {
      options: {
        allDocs: _extends({}, (0, _base.keysBetween)(pointId + '/comment'), {
          include_docs: true
        })
      }
    };
  },

  model: function model(attributes, options) {
    var pointId = options.collection.pointId;
    return new this.comment(attributes, _extends({ pointId: pointId }, options));
  }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tb2RlbC9wb2ludC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O1FBa0VnQixPQUFPLEdBQVAsT0FBTzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBcENoQixJQUFNLFlBQVksV0FBWixZQUFZLEdBQUc7QUFDMUIsV0FBUyxFQUFZLEVBQUUsT0FBTyxFQUFFLFNBQVMsRUFBRTtBQUMzQyxPQUFLLEVBQWdCLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRTtBQUN2QyxxQkFBbUIsRUFBRSxFQUFFLE9BQU8sRUFBRSxpQkFBaUIsRUFBRTtBQUNuRCxhQUFXLEVBQVUsRUFBRSxPQUFPLEVBQUUsV0FBVyxFQUFFO0FBQzdDLFNBQU8sRUFBYyxFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUU7QUFDekMsY0FBWSxFQUFTLEVBQUUsT0FBTyxFQUFFLFlBQVksRUFBRTtBQUM5QyxxQkFBbUIsRUFBRSxFQUFFLE9BQU8sRUFBRSxtQkFBbUIsRUFBRTtBQUNyRCxvQkFBa0IsRUFBRyxFQUFFLE9BQU8sRUFBRSxvQkFBb0IsRUFBRTtBQUN0RCxvQkFBa0IsRUFBRyxFQUFFLE9BQU8sRUFBRSxvQkFBb0IsRUFBRTtBQUN0RCxXQUFTLEVBQVksRUFBRSxPQUFPLEVBQUUsU0FBUyxFQUFFO0FBQzNDLFVBQVEsRUFBYSxFQUFFLE9BQU8sRUFBRSxRQUFRLEVBQUU7QUFDMUMsY0FBWSxFQUFTLEVBQUUsT0FBTyxFQUFFLFlBQVksRUFBRTtBQUM5QyxTQUFPLEVBQWMsRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFFO0FBQ3pDLFNBQU8sRUFBYyxFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUU7QUFDekMsZUFBYSxFQUFRLEVBQUUsT0FBTyxFQUFFLGFBQWEsRUFBRTtBQUMvQyxXQUFTLEVBQVksRUFBRSxPQUFPLEVBQUUsU0FBUyxFQUFFO0FBQzNDLFVBQVEsRUFBYSxFQUFFLE9BQU8sRUFBRSxRQUFRLEVBQUU7QUFD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QyxLQUFLLENBQUUsSUFBSSxFQUFFLFNBQVMsQ0FBRSxDQUFDO0FBQzlELFFBQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQzs7QUFFL0MsUUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQztBQUM3QixRQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDO0FBQy9CLFFBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxHQUFHLE9BQU8sQ0FBRSxRQUFRLEVBQUUsT0FBTyxDQUFFLEdBQUcsT0FBTyxDQUFDOztBQUVoRSxRQUFJLENBQUMsS0FBSyxHQUFHO0FBQ1gsYUFBTyxFQUFFO0FBQ1AsZUFBTyxlQUNGLHVCQUFhLE9BQU8sR0FBRyxVQUFVLENBQUU7QUFDdEMsc0JBQVksRUFBRSxJQUFJO1VBQ25CO09BQ0Y7S0FDRixDQUFDO0dBQ0g7O0FBRUQsT0FBSyxFQUFFLGVBQVUsVUFBVSxFQUFFLE9BQU8sRUFBRztBQUNyQyxRQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQztBQUMzQyxXQUFPLElBQU0sSUFBSSxDQUFDLE9BQU8sQ0FBRyxVQUFVLGFBQUksT0FBTyxFQUFQLE9BQU8sSUFBSyxPQUFPLEVBQUksQ0FBQztHQUNuRTtDQUNGLENBQUUsQ0FBQyIsImZpbGUiOiJwb2ludC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIGJ0Yy1hcHAtc2VydmVyIC0tIFNlcnZlciBmb3IgdGhlIEJpY3ljbGUgVG91cmluZyBDb21wYW5pb25cbiAqIENvcHlyaWdodCDCqSAyMDE2IEFkdmVudHVyZSBDeWNsaW5nIEFzc29jaWF0aW9uXG4gKlxuICogVGhpcyBmaWxlIGlzIHBhcnQgb2YgYnRjLWFwcC1zZXJ2ZXIuXG4gKlxuICogYnRjLWFwcC1zZXJ2ZXIgaXMgZnJlZSBzb2Z0d2FyZTogeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeVxuICogaXQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBBZmZlcm8gR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgYXMgcHVibGlzaGVkIGJ5XG4gKiB0aGUgRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uLCBlaXRoZXIgdmVyc2lvbiAzIG9mIHRoZSBMaWNlbnNlLCBvclxuICogKGF0IHlvdXIgb3B0aW9uKSBhbnkgbGF0ZXIgdmVyc2lvbi5cbiAqXG4gKiBidGMtYXBwLXNlcnZlciBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLFxuICogYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2ZcbiAqIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gIFNlZSB0aGVcbiAqIEFmZmVybyBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZSBkZXRhaWxzLlxuICpcbiAqIFlvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEFmZmVybyBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuICogYWxvbmcgd2l0aCBGb29iYXIuICBJZiBub3QsIHNlZSA8aHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG4gKi9cblxuaW1wb3J0IHsgbWVyZ2UsIGtleXMgfSBmcm9tICdsb2Rhc2gnO1xuXG5pbXBvcnQgeyBtaXhpblZhbGlkYXRpb24gfSBmcm9tICcuL3ZhbGlkYXRpb24tbWl4aW4nO1xuaW1wb3J0IHsgQ291Y2hNb2RlbCwgQ291Y2hDb2xsZWN0aW9uLCBrZXlzQmV0d2VlbiB9IGZyb20gJy4vYmFzZSc7XG5cbmltcG9ydCBkb2N1cmkgZnJvbSAnZG9jdXJpJztcbmltcG9ydCBuZ2VvaGFzaCBmcm9tICduZ2VvaGFzaCc7XG5pbXBvcnQgbm9ybWFsaXplIGZyb20gJ3RvLWlkJztcbmltcG9ydCB1dWlkIGZyb20gJ25vZGUtdXVpZCc7XG5cbi8qZXNmbXQtaWdub3JlLXN0YXJ0Ki9cbmV4cG9ydCBjb25zdCBzZXJ2aWNlVHlwZXMgPSB7XG4gICdhaXJwb3J0JzogICAgICAgICAgIHsgZGlzcGxheTogJ0FpcnBvcnQnIH0sXG4gICdiYXInOiAgICAgICAgICAgICAgIHsgZGlzcGxheTogJ0JhcicgfSxcbiAgJ2JlZF9hbmRfYnJlYWtmYXN0JzogeyBkaXNwbGF5OiAnQmVkICYgQnJlYWtmYXN0JyB9LFxuICAnYmlrZV9zaG9wJzogICAgICAgICB7IGRpc3BsYXk6ICdCaWtlIFNob3AnIH0sXG4gICdjYWJpbic6ICAgICAgICAgICAgIHsgZGlzcGxheTogJ0NhYmluJyB9LFxuICAnY2FtcGdyb3VuZCc6ICAgICAgICB7IGRpc3BsYXk6ICdDYW1wZ3JvdW5kJyB9LFxuICAnY29udmVuaWVuY2Vfc3RvcmUnOiB7IGRpc3BsYXk6ICdDb252ZW5pZW5jZSBTdG9yZScgfSxcbiAgJ2N5Y2xpc3RzX2NhbXBpbmcnOiAgeyBkaXNwbGF5OiAnQ3ljbGlzdHNcXCcgQ2FtcGluZycgfSxcbiAgJ2N5Y2xpc3RzX2xvZGdpbmcnOiAgeyBkaXNwbGF5OiAnQ3ljbGlzdHNcXCcgTG9kZ2luZycgfSxcbiAgJ2dyb2NlcnknOiAgICAgICAgICAgeyBkaXNwbGF5OiAnR3JvY2VyeScgfSxcbiAgJ2hvc3RlbCc6ICAgICAgICAgICAgeyBkaXNwbGF5OiAnSG9zdGVsJyB9LFxuICAnaG90X3NwcmluZyc6ICAgICAgICB7IGRpc3BsYXk6ICdIb3QgU3ByaW5nJyB9LFxuICAnaG90ZWwnOiAgICAgICAgICAgICB7IGRpc3BsYXk6ICdIb3RlbCcgfSxcbiAgJ21vdGVsJzogICAgICAgICAgICAgeyBkaXNwbGF5OiAnTW90ZWwnIH0sXG4gICdpbmZvcm1hdGlvbic6ICAgICAgIHsgZGlzcGxheTogJ0luZm9ybWF0aW9uJyB9LFxuICAnbGlicmFyeSc6ICAgICAgICAgICB7IGRpc3BsYXk6ICdMaWJyYXJ5JyB9LFxuICAnbXVzZXVtJzogICAgICAgICAgICB7IGRpc3BsYXk6ICdNdXNldW0nIH0sXG4gICdvdXRkb29yX3N0b3JlJzogICAgIHsgZGlzcGxheTogJ091dGRvb3IgU3RvcmUnIH0sXG4gICdyZXN0X2FyZWEnOiAgICAgICAgIHsgZGlzcGxheTogJ1Jlc3QgQXJlYScgfSxcbiAgJ3Jlc3RhdXJhbnQnOiAgICAgICAgeyBkaXNwbGF5OiAnUmVzdGF1cmFudCcgfSxcbiAgJ3Jlc3Ryb29tJzogICAgICAgICAgeyBkaXNwbGF5OiAnUmVzdHJvb20nIH0sXG4gICdzY2VuaWNfYXJlYSc6ICAgICAgIHsgZGlzcGxheTogJ1NjZW5pYyBBcmVhJyB9LFxuICAnc3RhdGVfcGFyayc6ICAgICAgICB7IGRpc3BsYXk6ICdTdGF0ZSBQYXJrJyB9LFxuICAnb3RoZXInOiAgICAgICAgICAgICB7IGRpc3BsYXk6ICdPdGhlcicgfVxufTtcblxuZXhwb3J0IGNvbnN0IGFsZXJ0VHlwZXMgPSB7XG4gICdyb2FkX2Nsb3N1cmUnOiAgICAgIHsgZGlzcGxheTogJ1JvYWQgQ2xvc3VyZScgfSxcbiAgJ2ZvcmVzdF9maXJlJzogICAgICAgeyBkaXNwbGF5OiAnRm9yZXN0IGZpcmUnIH0sXG4gICdmbG9vZGluZyc6ICAgICAgICAgIHsgZGlzcGxheTogJ0Zsb29kaW5nJyB9LFxuICAnZGV0b3VyJzogICAgICAgICAgICB7IGRpc3BsYXk6ICdEZXRvdXInIH0sXG4gICdvdGhlcic6ICAgICAgICAgICAgIHsgZGlzcGxheTogJ090aGVyJyB9XG59O1xuLyplc2ZtdC1pZ25vcmUtZW5kKi9cblxuZXhwb3J0IGZ1bmN0aW9uIGRpc3BsYXkoIHR5cGUgKSB7XG4gIGNvbnN0IHZhbHVlcyA9IHNlcnZpY2VUeXBlc1sgdHlwZSBdIHx8IGFsZXJ0VHlwZXNbIHR5cGUgXTtcbiAgaWYgKCB2YWx1ZXMgKSB7XG4gICAgcmV0dXJuIHZhbHVlcy5kaXNwbGF5O1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBudWxsO1xuICB9XG59XG5cbmV4cG9ydCBjb25zdCBwb2ludElkID0gZG9jdXJpLnJvdXRlKCAncG9pbnQvOnR5cGUvOm5hbWUvOmdlb2hhc2gnICk7XG5cbmV4cG9ydCBjb25zdCBQb2ludCA9IENvdWNoTW9kZWwuZXh0ZW5kKCB7XG4gIGlkQXR0cmlidXRlOiAnX2lkJyxcblxuICBpbml0aWFsaXplOiBmdW5jdGlvbiggYXR0cmlidXRlcywgb3B0aW9ucyApIHtcbiAgICBDb3VjaE1vZGVsLnByb3RvdHlwZS5pbml0aWFsaXplLmFwcGx5KCB0aGlzLCBhcmd1bWVudHMgKTtcbiAgICB0aGlzLnNldCggJ2NyZWF0ZWRfYXQnLCBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCkgKTtcbiAgfSxcblxuICBzcGVjaWZ5OiBmdW5jdGlvbiggdHlwZSwgbmFtZSwgbG9jYXRpb24gKSB7XG4gICAgaWYgKCBuYW1lICkge1xuICAgICAgY29uc3QgW2xhdCwgbG5nXSA9IGxvY2F0aW9uO1xuICAgICAgY29uc3QgX2lkID0gcG9pbnRJZCgge1xuICAgICAgICB0eXBlOiB0eXBlLFxuICAgICAgICBuYW1lOiBub3JtYWxpemUoIG5hbWUgKSxcbiAgICAgICAgZ2VvaGFzaDogbmdlb2hhc2guZW5jb2RlKCBsYXQsIGxuZyApXG4gICAgICB9ICk7XG4gICAgICB0aGlzLnNldCggeyBfaWQsIHR5cGUsIG5hbWUsIGxvY2F0aW9uIH0gKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3Qge25hbWUsIGxvY2F0aW9ufSA9IHRoaXMuYXR0cmlidXRlcztcbiAgICAgIGNvbnN0IFtsYXQsIGxuZ10gPSBsb2NhdGlvbjtcbiAgICAgIGNvbnN0IF9pZCA9IHBvaW50SWQoIHtcbiAgICAgICAgdHlwZTogdHlwZSxcbiAgICAgICAgbmFtZTogbm9ybWFsaXplKCBuYW1lICksXG4gICAgICAgIGdlb2hhc2g6IG5nZW9oYXNoLmVuY29kZSggbGF0LCBsbmcgKVxuICAgICAgfSApO1xuICAgICAgdGhpcy5zZXQoIHsgX2lkIH0gKTtcbiAgICB9XG4gIH0sXG5cbiAgc2NoZW1hOiB7XG4gICAgJHNjaGVtYTogJ2h0dHA6Ly9qc29uLXNjaGVtYS5vcmcvZHJhZnQtMDQvc2NoZW1hIycsXG4gICAgdHlwZTogJ29iamVjdCcsXG4gICAgYWRkaXRpb25hbFByb3BlcnRpZXM6IGZhbHNlLCAvLyBCdXQgc3ViY2xhc3NlcyBjYW4gbWVyZ2VcbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICBuYW1lOiB7XG4gICAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgICB9LFxuICAgICAgbG9jYXRpb246IHtcbiAgICAgICAgdHlwZTogJ2FycmF5JyxcbiAgICAgICAgbWluSXRlbXM6IDIsXG4gICAgICAgIG1heEl0ZW1zOiAyLFxuICAgICAgICBpdGVtczoge1xuICAgICAgICAgIHR5cGU6ICdudW1iZXInXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICB0eXBlOiB7XG4gICAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgICB9LFxuICAgICAgY3JlYXRlZF9hdDoge1xuICAgICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgICAgZm9ybWF0OiAnZGF0ZS10aW1lJ1xuICAgICAgfSxcbiAgICAgIGRlc2NyaXB0aW9uOiB7XG4gICAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgICB9LFxuICAgICAgZmxhZzoge1xuICAgICAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgICAgIGRlZmF1bHQ6IGZhbHNlXG4gICAgICB9XG4gICAgfSxcbiAgICByZXF1aXJlZDogW1xuICAgICAgJ25hbWUnLFxuICAgICAgJ2xvY2F0aW9uJyxcbiAgICAgICd0eXBlJyxcbiAgICAgICdjcmVhdGVkX2F0JyxcbiAgICAgICdmbGFnJ1xuICAgIF1cbiAgfVxufSApO1xuXG5leHBvcnQgY29uc3QgU2VydmljZSA9IFBvaW50LmV4dGVuZCgge1xuICBzcGVjaWZ5OiBmdW5jdGlvbiggbmFtZSwgbG9jYXRpb24gKSB7XG4gICAgUG9pbnQucHJvdG90eXBlLnNwZWNpZnkuY2FsbCggdGhpcywgJ3NlcnZpY2UnLCBuYW1lLCBsb2NhdGlvbiApO1xuICB9LFxuXG4gIHNjaGVtYTogbWVyZ2UoIHt9LCBQb2ludC5wcm90b3R5cGUuc2NoZW1hLCB7XG4gICAgcHJvcGVydGllczoge1xuICAgICAgdHlwZToge1xuICAgICAgICBlbnVtOiBrZXlzKCBzZXJ2aWNlVHlwZXMgKVxuICAgICAgfSxcbiAgICAgIGFtZW5pdGllczoge1xuICAgICAgICB0eXBlOiAnYXJyYXknLFxuICAgICAgICBpdGVtczoge1xuICAgICAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgICAgIGVudW06IGtleXMoIHNlcnZpY2VUeXBlcyApXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBhZGRyZXNzOiB7XG4gICAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgICB9LFxuICAgICAgc2NoZWR1bGU6IHtcbiAgICAgICAgdHlwZTogJ2FycmF5J1xuICAgICAgfSxcbiAgICAgIHNlYXNvbmFsOiB7XG4gICAgICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICAgICAgZGVmYXVsdDogZmFsc2VcbiAgICAgIH0sXG4gICAgICBwaG9uZToge1xuICAgICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgICAgfSxcbiAgICAgIHdlYnNpdGU6IHtcbiAgICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICAgIGZvcm1hdDogJ3VyaSdcbiAgICAgIH1cbiAgICB9LFxuICAgIHJlcXVpcmVkOiBbXG4gICAgICAnc2Vhc29uYWwnXG4gICAgXVxuICB9IClcbn0gKTtcblxubWl4aW5WYWxpZGF0aW9uKCBTZXJ2aWNlICk7XG5cbmV4cG9ydCBjb25zdCBBbGVydCA9IFBvaW50LmV4dGVuZCgge1xuICBzcGVjaWZ5OiBmdW5jdGlvbiggbmFtZSwgbG9jYXRpb24gKSB7XG4gICAgUG9pbnQucHJvdG90eXBlLnNwZWNpZnkuY2FsbCggdGhpcywgJ2FsZXJ0JywgbmFtZSwgbG9jYXRpb24gKTtcbiAgfSxcblxuICBzY2hlbWE6IG1lcmdlKCB7fSwgUG9pbnQucHJvdG90eXBlLnNjaGVtYSwge1xuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgIHR5cGU6IHtcbiAgICAgICAgZW51bToga2V5cyggYWxlcnRUeXBlcyApXG4gICAgICB9XG4gICAgfVxuICB9IClcbn0gKTtcblxubWl4aW5WYWxpZGF0aW9uKCBBbGVydCApO1xuXG5leHBvcnQgY29uc3QgUG9pbnRDb2xsZWN0aW9uID0gQ291Y2hDb2xsZWN0aW9uLmV4dGVuZCgge1xuICBpbml0aWFsaXplOiBmdW5jdGlvbiggbW9kZWxzLCBvcHRpb25zICkge1xuICAgIENvdWNoQ29sbGVjdGlvbi5wcm90b3R5cGUuaW5pdGlhbGl6ZS5hcHBseSggdGhpcywgYXJndW1lbnRzICk7XG5cbiAgICAvLyBjb25zdCB7IGJib3ggfSA9IG9wdGlvbnM7IC8vIEZvciBsYXRlciwgdG8gZ2V0IHBvaW50cyBpbiBhIGJib3hcbiAgICB0aGlzLnBvdWNoID0ge1xuICAgICAgb3B0aW9uczoge1xuICAgICAgICBhbGxEb2NzOiB7IGluY2x1ZGVfZG9jczogdHJ1ZSwgLi4ua2V5c0JldHdlZW4oICdwb2ludC8nICkgfVxuICAgICAgfVxuICAgIH07XG5cbiAgICBjb25zdCBjb25uZWN0ID0gdGhpcy5jb25uZWN0O1xuICAgIGNvbnN0IGRhdGFiYXNlID0gdGhpcy5kYXRhYmFzZTtcbiAgICB0aGlzLnNlcnZpY2UgPSBjb25uZWN0ID8gY29ubmVjdCggZGF0YWJhc2UsIFNlcnZpY2UgKSA6IFNlcnZpY2U7XG4gICAgdGhpcy5hbGVydCA9IGNvbm5lY3QgPyBjb25uZWN0KCBkYXRhYmFzZSwgQWxlcnQgKSA6IEFsZXJ0O1xuICB9LFxuXG4gIG1vZGVsOiBmdW5jdGlvbiggYXR0cmlidXRlcywgb3B0aW9ucyApIHtcbiAgICBjb25zdCBwYXJ0cyA9IHBvaW50SWQoIGF0dHJpYnV0ZXMuX2lkICk7XG4gICAgY29uc3QgbWFwID0ge1xuICAgICAgJ3NlcnZpY2UnOiBvcHRpb25zLmNvbGxlY3Rpb24uc2VydmljZSxcbiAgICAgICdhbGVydCc6IG9wdGlvbnMuY29sbGVjdGlvbi5hbGVydFxuICAgIH07XG4gICAgY29uc3QgY29uc3RydWN0b3IgPSBtYXBbIHBhcnRzLnR5cGUgXTtcbiAgICBpZiAoIGNvbnN0cnVjdG9yICkge1xuICAgICAgcmV0dXJuIG5ldyBjb25zdHJ1Y3RvciggYXR0cmlidXRlcywgb3B0aW9ucyApO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyAnQSBwb2ludCBtdXN0IGJlIGVpdGhlciBhIHNlcnZpY2Ugb3IgYWxlcnQnO1xuICAgIH1cbiAgfVxufSApO1xuXG5jb25zdCBDT01NRU5UX01BWF9MRU5HVEggPSAxNDA7XG5leHBvcnQgY29uc3QgQ29tbWVudCA9IENvdWNoTW9kZWwuZXh0ZW5kKCB7XG4gIGlkQXR0cmlidXRlOiAnX2lkJyxcblxuICBjb25zdHJ1Y3RvcjogZnVuY3Rpb24oIGF0dHJpYnV0ZXMsIG9wdGlvbnMgKSB7XG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gICAgaWYgKCAhYXR0cmlidXRlcy51dWlkICkge1xuICAgICAgYXR0cmlidXRlcy51dWlkID0gdXVpZC52MSgpO1xuICAgIH1cbiAgICBpZiAoICFhdHRyaWJ1dGVzLl9pZCApIHtcbiAgICAgIGF0dHJpYnV0ZXMuX2lkID0gb3B0aW9ucy5wb2ludElkICsgJy9jb21tZW50LycgKyBhdHRyaWJ1dGVzLnV1aWQ7XG4gICAgfVxuICAgIENvdWNoTW9kZWwuYXBwbHkoIHRoaXMsIGFyZ3VtZW50cyApO1xuICB9LFxuXG4gIHNjaGVtYToge1xuICAgIHR5cGU6ICdvYmplY3QnLFxuICAgIGFkZGl0aW9uYWxQcm9wZXJ0aWVzOiBmYWxzZSxcbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICB1c2VybmFtZToge1xuICAgICAgICAndHlwZSc6ICdzdHJpbmcnXG4gICAgICB9LFxuICAgICAgdGV4dDoge1xuICAgICAgICAndHlwZSc6ICdzdHJpbmcnLFxuICAgICAgICAnbWF4TGVuZ3RoJzogQ09NTUVOVF9NQVhfTEVOR1RIXG4gICAgICB9LFxuICAgICAgcmF0aW5nOiB7XG4gICAgICAgIHR5cGU6ICdpbnRlZ2VyJyxcbiAgICAgICAgbWluaW11bTogMSxcbiAgICAgICAgbWF4aW11bTogNVxuICAgICAgfSxcbiAgICAgIHV1aWQ6IHtcbiAgICAgICAgdHlwZTogJ3N0cmluZydcbiAgICAgIH1cbiAgICB9LFxuICAgIHJlcXVpcmVkOiBbXG4gICAgICAndXNlcm5hbWUnLFxuICAgICAgJ3RleHQnLFxuICAgICAgJ3JhdGluZycsXG4gICAgICAndXVpZCdcbiAgICBdXG4gIH1cbn0sIHtcbiAgTUFYX0xFTkdUSDogQ09NTUVOVF9NQVhfTEVOR1RIXG59ICk7XG5cbm1peGluVmFsaWRhdGlvbiggQ29tbWVudCApO1xuXG5leHBvcnQgY29uc3QgQ29tbWVudENvbGxlY3Rpb24gPSBDb3VjaENvbGxlY3Rpb24uZXh0ZW5kKCB7XG4gIGluaXRpYWxpemU6IGZ1bmN0aW9uKCBtb2RlbHMsIG9wdGlvbnMgKSB7XG4gICAgQ291Y2hDb2xsZWN0aW9uLnByb3RvdHlwZS5pbml0aWFsaXplLmFwcGx5KCB0aGlzLCBhcmd1bWVudHMgKTtcbiAgICBjb25zdCBwb2ludElkID0gdGhpcy5wb2ludElkID0gb3B0aW9ucy5wb2ludElkO1xuXG4gICAgY29uc3QgY29ubmVjdCA9IHRoaXMuY29ubmVjdDtcbiAgICBjb25zdCBkYXRhYmFzZSA9IHRoaXMuZGF0YWJhc2U7XG4gICAgdGhpcy5jb21tZW50ID0gY29ubmVjdCA/IGNvbm5lY3QoIGRhdGFiYXNlLCBDb21tZW50ICkgOiBDb21tZW50O1xuXG4gICAgdGhpcy5wb3VjaCA9IHtcbiAgICAgIG9wdGlvbnM6IHtcbiAgICAgICAgYWxsRG9jczoge1xuICAgICAgICAgIC4uLmtleXNCZXR3ZWVuKCBwb2ludElkICsgJy9jb21tZW50JyApLFxuICAgICAgICAgIGluY2x1ZGVfZG9jczogdHJ1ZVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcbiAgfSxcblxuICBtb2RlbDogZnVuY3Rpb24oIGF0dHJpYnV0ZXMsIG9wdGlvbnMgKSB7XG4gICAgY29uc3QgcG9pbnRJZCA9IG9wdGlvbnMuY29sbGVjdGlvbi5wb2ludElkO1xuICAgIHJldHVybiBuZXcgKCB0aGlzLmNvbW1lbnQpIChhdHRyaWJ1dGVzLCB7IHBvaW50SWQsIC4uLm9wdGlvbnMgfSApO1xuICB9XG59ICk7XG4iXX0=