'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CommentCollection = exports.Comment = exports.PointCollection = exports.Alert = exports.alertTypes = exports.Service = exports.serviceTypes = exports.Point = undefined;

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

var _validationMixin = require('./validation-mixin');

var _base = require('./base');

var _lodash = require('lodash');

var _docuri = require('docuri');

var _docuri2 = _interopRequireDefault(_docuri);

var _ngeohash = require('ngeohash');

var _ngeohash2 = _interopRequireDefault(_ngeohash);

var _toId = require('to-id');

var _toId2 = _interopRequireDefault(_toId);

var _nodeUuid = require('node-uuid');

var _nodeUuid2 = _interopRequireDefault(_nodeUuid);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// # Point Model
// The point represents a location on the map with associated metadata, geodata,
// and user provided data. The point is the base shared by services and alerts.
//
// The JSON schema stored in `Point`, and as patched by `Service` and `Alert`,
// is the authoritative definition of the point record.

// ## Point Model Uri
// Points are stored in CouchDB. CouchDB documents can have rich id strings
// to help store and access data without MapReduce jobs.
//
// The point model uri is composed of four parts:
//  1. The string 'point/'`
//  2. The type of point, either 'service' or 'alert'
//  3. The normalized name of the point
//  4. The point's geohash
var pointId = _docuri2.default.route('point/:type/:name/:geohash');

var Point = exports.Point = _base.CouchModel.extend({
  idAttribute: '_id',

  initialize: function initialize(attributes, options) {
    _base.CouchModel.prototype.initialize.apply(this, arguments);
    this.set('created_at', new Date().toISOString());
  },

  // ## Specify
  // Fill in `_id` from the components of the point model uri.
  // Pull values from `attributes` if name and location are undefined.
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
    type: 'object',
    additionalProperties: false,
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

// # Service Model
// A service is a buisness or point of interest to a cyclist. A cyclist needs
// to know where they want to stop well in advance of their travel through an
// area. The service record must contain enough information to help the cyclist
// make such decisions.
//
// The record includes contact information, and a schedule of hours of
// operation. It is important that we store the time zone of a service, since
// touring cyclists will cross time zones on their travels. Furthermore,
// services of interest to touring cyclists may be seasonal: we store
// schedules for different seasons.

// ## Service Types
// A Service may have a single type, indicating the primary purpose of the
// buisness or point of interest. Service types may also be included in a
// Service's amenities array.
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
/*esfmt-ignore-end*/

var Service = exports.Service = Point.extend({
  specify: function specify(name, location) {
    Point.prototype.specify.call(this, 'service', name, location);
  },

  schema: (0, _validationMixin.mergeSchemas)(Point.prototype.schema, {
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

// Apply the validation mixin to the Service model. See validation-mixin.js.
(0, _validationMixin.mixinValidation)(Service);

// # Alert Model
// An alert is something that might impede a cyclist's tour. When a cyclist
// sees an alert on the map, the know to plan around it.

/*esfmt-ignore-start*/
var alertTypes = exports.alertTypes = {
  'road_closure': { display: 'Road Closure' },
  'forest_fire': { display: 'Forest fire' },
  'flooding': { display: 'Flooding' },
  'detour': { display: 'Detour' },
  'other': { display: 'Other' }
};
/*esfmt-ignore-end*/

var Alert = exports.Alert = Point.extend({
  specify: function specify(name, location) {
    Point.prototype.specify.call(this, 'alert', name, location);
  },

  schema: (0, _validationMixin.mergeSchemas)(Point.prototype.schema, {
    properties: {
      type: {
        enum: (0, _lodash.keys)(alertTypes)
      }
    }
  })
});

(0, _validationMixin.mixinValidation)(Alert);

// # Point Collection
// A heterogeneous collection of services and alerts. PouchDB is able to fetch
// this collection by looking for all keys starting with 'point/'.
//
// This also has the effect of fetching comments for points. TODO: handle
// `Comment` in the model function.
//
// A connected PointCollection must be able to generate connected Alerts or
// Services on demands. Therefore, if PointCollection is connected, connect
// models before returning them.
var PointCollection = exports.PointCollection = _base.CouchCollection.extend({
  initialize: function initialize(models, options) {
    _base.CouchCollection.prototype.initialize.apply(this, arguments);
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

// # Display Name for Type
// Given a type key from either the service or alert type enumerations,
// return the type's display string, or null if it does not exist.
function display(type) {
  var values = serviceTypes[type] || alertTypes[type];
  if (values) {
    return values.display;
  } else {
    return null;
  }
}

// # Comment Model
// Information about alerts and services encountered by cyclists is likely
// to change with the seasons or other reasons. Cyclists planning the next leg
// of a tour should be able to read the experiences of cyclists ahead of them.
//
// A comment must have both a rating and the text of the comment. Comments are
// limited to 140 characters to ensure they do not devolve into general alert
// or service information that should really be in the description. We really
// want users of the Bicycle Touring Companion to provide comments verifying
// info about points, or letting other cyclists know about changes in the
// service or alert.

// ## Comment Model Uri
// Comments are stored in CouchDB in the same database as points. The comment
// model uri is composed of three parts:
//  1. The entire id of the related point
//  2. The string 'comment/'
//  3. A time based UUID to uniquely identify comments
//
// We don't use `docuri` for the comment model uris because we don't have to
// parse them.

var COMMENT_MAX_LENGTH = 140;
var Comment = exports.Comment = _base.CouchModel.extend({
  idAttribute: '_id',

  // ## Constructor
  // Generate `_id`. `pointId` must be specified in options.
  constructor: function constructor(attributes, options) {
    options = options || {};
    if (!attributes.uuid) {
      attributes.uuid = _nodeUuid2.default.v1();
    }
    if (!attributes._id && options.pointId) {
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

// # Comment Collection
// Fetch only comments associated with a given point.
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
    var _options$collection = options.collection;
    var comment = _options$collection.comment;
    var pointId = _options$collection.pointId;

    return new comment(attributes, _extends({ pointId: pointId }, options));
  }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tb2RlbC9wb2ludC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O1FBd1JnQixPQUFPLEdBQVAsT0FBTzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBM092QixJQUFNLE9BQU8sR0FBRyxpQkFBTyxLQUFLLENBQUUsNEJBQTRCLENBQUUsQ0FBQzs7QUFFdEQsSUFBTSxLQUFLLFdBQUwsS0FBSyxHQUFHLGlCQUFXLE1BQU0sQ0FBRTtBQUN0QyxhQUFXLEVBQUUsS0FBSzs7QUFFbEIsWUFBVSxFQUFFLG9CQUFVLFVBQVUsRUFBRSxPQUFPLEVBQUc7QUFDMUMscUJBQVcsU0FBUyxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUUsSUFBSSxFQUFFLFNBQVMsQ0FBRSxDQUFDO0FBQ3pELFFBQUksQ0FBQyxHQUFHLENBQUUsWUFBWSxFQUFFLElBQUksSUFBSSxFQUFFLENBQUMsV0FBVyxFQUFFLENBQUUsQ0FBQztHQUNwRDs7Ozs7QUFLRCxTQUFPLEVBQUUsaUJBQVUsSUFBSSxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUc7QUFDeEMsUUFBSyxJQUFJLEVBQUc7cUNBQ1MsUUFBUTs7VUFBcEIsR0FBRztVQUFFLEdBQUc7O0FBQ2YsVUFBTSxHQUFHLEdBQUcsT0FBTyxDQUFFO0FBQ25CLFlBQUksRUFBRSxJQUFJO0FBQ1YsWUFBSSxFQUFFLG9CQUFXLElBQUksQ0FBRTtBQUN2QixlQUFPLEVBQUUsbUJBQVMsTUFBTSxDQUFFLEdBQUcsRUFBRSxHQUFHLENBQUU7T0FDckMsQ0FBRSxDQUFDO0FBQ0osVUFBSSxDQUFDLEdBQUcsQ0FBRSxFQUFFLEdBQUcsRUFBSCxHQUFHLEVBQUUsSUFBSSxFQUFKLElBQUksRUFBRSxJQUFJLEVBQUosSUFBSSxFQUFFLFFBQVEsRUFBUixRQUFRLEVBQUUsQ0FBRSxDQUFDO0tBQzNDLE1BQU07d0JBQ29CLElBQUksQ0FBQyxVQUFVO1VBQWpD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QUFHO0FBQ3RDLDBCQUFnQixTQUFTLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBRSxJQUFJLEVBQUUsU0FBUyxDQUFFLENBQUM7QUFDOUQsUUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDOztBQUUvQyxRQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDO0FBQzdCLFFBQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUM7QUFDL0IsUUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLEdBQUcsT0FBTyxDQUFFLFFBQVEsRUFBRSxPQUFPLENBQUUsR0FBRyxPQUFPLENBQUM7O0FBRWhFLFFBQUksQ0FBQyxLQUFLLEdBQUc7QUFDWCxhQUFPLEVBQUU7QUFDUCxlQUFPLGVBQ0YsdUJBQWEsT0FBTyxHQUFHLFVBQVUsQ0FBRTtBQUN0QyxzQkFBWSxFQUFFLElBQUk7VUFDbkI7T0FDRjtLQUNGLENBQUM7R0FDSDs7QUFFRCxPQUFLLEVBQUUsZUFBVSxVQUFVLEVBQUUsT0FBTyxFQUFHOzhCQUNWLE9BQU8sQ0FBQyxVQUFVO1FBQXRDLE9BQU8sdUJBQVAsT0FBTztRQUFFLE9BQU8sdUJBQVAsT0FBTzs7QUFDdkIsV0FBTyxJQUFJLE9BQU8sQ0FBRSxVQUFVLGFBQUksT0FBTyxFQUFQLE9BQU8sSUFBSyxPQUFPLEVBQUksQ0FBQztHQUMzRDtDQUNGLENBQUUsQ0FBQyIsImZpbGUiOiJwb2ludC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIGJ0Yy1hcHAtc2VydmVyIC0tIFNlcnZlciBmb3IgdGhlIEJpY3ljbGUgVG91cmluZyBDb21wYW5pb25cbiAqIENvcHlyaWdodCDCqSAyMDE2IEFkdmVudHVyZSBDeWNsaW5nIEFzc29jaWF0aW9uXG4gKlxuICogVGhpcyBmaWxlIGlzIHBhcnQgb2YgYnRjLWFwcC1zZXJ2ZXIuXG4gKlxuICogYnRjLWFwcC1zZXJ2ZXIgaXMgZnJlZSBzb2Z0d2FyZTogeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeVxuICogaXQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBBZmZlcm8gR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgYXMgcHVibGlzaGVkIGJ5XG4gKiB0aGUgRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uLCBlaXRoZXIgdmVyc2lvbiAzIG9mIHRoZSBMaWNlbnNlLCBvclxuICogKGF0IHlvdXIgb3B0aW9uKSBhbnkgbGF0ZXIgdmVyc2lvbi5cbiAqXG4gKiBidGMtYXBwLXNlcnZlciBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLFxuICogYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2ZcbiAqIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gIFNlZSB0aGVcbiAqIEFmZmVybyBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZSBkZXRhaWxzLlxuICpcbiAqIFlvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEFmZmVybyBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuICogYWxvbmcgd2l0aCBGb29iYXIuICBJZiBub3QsIHNlZSA8aHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG4gKi9cblxuaW1wb3J0IHsgbWl4aW5WYWxpZGF0aW9uLCBtZXJnZVNjaGVtYXMgfSBmcm9tICcuL3ZhbGlkYXRpb24tbWl4aW4nO1xuaW1wb3J0IHsgQ291Y2hNb2RlbCwgQ291Y2hDb2xsZWN0aW9uLCBrZXlzQmV0d2VlbiB9IGZyb20gJy4vYmFzZSc7XG5cbmltcG9ydCB7IGtleXMgfSBmcm9tICdsb2Rhc2gnO1xuXG5pbXBvcnQgZG9jdXJpIGZyb20gJ2RvY3VyaSc7XG5pbXBvcnQgbmdlb2hhc2ggZnJvbSAnbmdlb2hhc2gnO1xuaW1wb3J0IG5vcm1hbGl6ZSBmcm9tICd0by1pZCc7XG5pbXBvcnQgdXVpZCBmcm9tICdub2RlLXV1aWQnO1xuXG4vLyAjIFBvaW50IE1vZGVsXG4vLyBUaGUgcG9pbnQgcmVwcmVzZW50cyBhIGxvY2F0aW9uIG9uIHRoZSBtYXAgd2l0aCBhc3NvY2lhdGVkIG1ldGFkYXRhLCBnZW9kYXRhLFxuLy8gYW5kIHVzZXIgcHJvdmlkZWQgZGF0YS4gVGhlIHBvaW50IGlzIHRoZSBiYXNlIHNoYXJlZCBieSBzZXJ2aWNlcyBhbmQgYWxlcnRzLlxuLy9cbi8vIFRoZSBKU09OIHNjaGVtYSBzdG9yZWQgaW4gYFBvaW50YCwgYW5kIGFzIHBhdGNoZWQgYnkgYFNlcnZpY2VgIGFuZCBgQWxlcnRgLFxuLy8gaXMgdGhlIGF1dGhvcml0YXRpdmUgZGVmaW5pdGlvbiBvZiB0aGUgcG9pbnQgcmVjb3JkLlxuXG4vLyAjIyBQb2ludCBNb2RlbCBVcmlcbi8vIFBvaW50cyBhcmUgc3RvcmVkIGluIENvdWNoREIuIENvdWNoREIgZG9jdW1lbnRzIGNhbiBoYXZlIHJpY2ggaWQgc3RyaW5nc1xuLy8gdG8gaGVscCBzdG9yZSBhbmQgYWNjZXNzIGRhdGEgd2l0aG91dCBNYXBSZWR1Y2Ugam9icy5cbi8vXG4vLyBUaGUgcG9pbnQgbW9kZWwgdXJpIGlzIGNvbXBvc2VkIG9mIGZvdXIgcGFydHM6XG4vLyAgMS4gVGhlIHN0cmluZyAncG9pbnQvJ2Bcbi8vICAyLiBUaGUgdHlwZSBvZiBwb2ludCwgZWl0aGVyICdzZXJ2aWNlJyBvciAnYWxlcnQnXG4vLyAgMy4gVGhlIG5vcm1hbGl6ZWQgbmFtZSBvZiB0aGUgcG9pbnRcbi8vICA0LiBUaGUgcG9pbnQncyBnZW9oYXNoXG5jb25zdCBwb2ludElkID0gZG9jdXJpLnJvdXRlKCAncG9pbnQvOnR5cGUvOm5hbWUvOmdlb2hhc2gnICk7XG5cbmV4cG9ydCBjb25zdCBQb2ludCA9IENvdWNoTW9kZWwuZXh0ZW5kKCB7XG4gIGlkQXR0cmlidXRlOiAnX2lkJyxcblxuICBpbml0aWFsaXplOiBmdW5jdGlvbiggYXR0cmlidXRlcywgb3B0aW9ucyApIHtcbiAgICBDb3VjaE1vZGVsLnByb3RvdHlwZS5pbml0aWFsaXplLmFwcGx5KCB0aGlzLCBhcmd1bWVudHMgKTtcbiAgICB0aGlzLnNldCggJ2NyZWF0ZWRfYXQnLCBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCkgKTtcbiAgfSxcblxuICAvLyAjIyBTcGVjaWZ5XG4gIC8vIEZpbGwgaW4gYF9pZGAgZnJvbSB0aGUgY29tcG9uZW50cyBvZiB0aGUgcG9pbnQgbW9kZWwgdXJpLlxuICAvLyBQdWxsIHZhbHVlcyBmcm9tIGBhdHRyaWJ1dGVzYCBpZiBuYW1lIGFuZCBsb2NhdGlvbiBhcmUgdW5kZWZpbmVkLlxuICBzcGVjaWZ5OiBmdW5jdGlvbiggdHlwZSwgbmFtZSwgbG9jYXRpb24gKSB7XG4gICAgaWYgKCBuYW1lICkge1xuICAgICAgY29uc3QgW2xhdCwgbG5nXSA9IGxvY2F0aW9uO1xuICAgICAgY29uc3QgX2lkID0gcG9pbnRJZCgge1xuICAgICAgICB0eXBlOiB0eXBlLFxuICAgICAgICBuYW1lOiBub3JtYWxpemUoIG5hbWUgKSxcbiAgICAgICAgZ2VvaGFzaDogbmdlb2hhc2guZW5jb2RlKCBsYXQsIGxuZyApXG4gICAgICB9ICk7XG4gICAgICB0aGlzLnNldCggeyBfaWQsIHR5cGUsIG5hbWUsIGxvY2F0aW9uIH0gKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3Qge25hbWUsIGxvY2F0aW9ufSA9IHRoaXMuYXR0cmlidXRlcztcbiAgICAgIGNvbnN0IFtsYXQsIGxuZ10gPSBsb2NhdGlvbjtcbiAgICAgIGNvbnN0IF9pZCA9IHBvaW50SWQoIHtcbiAgICAgICAgdHlwZTogdHlwZSxcbiAgICAgICAgbmFtZTogbm9ybWFsaXplKCBuYW1lICksXG4gICAgICAgIGdlb2hhc2g6IG5nZW9oYXNoLmVuY29kZSggbGF0LCBsbmcgKVxuICAgICAgfSApO1xuICAgICAgdGhpcy5zZXQoIHsgX2lkIH0gKTtcbiAgICB9XG4gIH0sXG5cbiAgc2NoZW1hOiB7XG4gICAgdHlwZTogJ29iamVjdCcsXG4gICAgYWRkaXRpb25hbFByb3BlcnRpZXM6IGZhbHNlLFxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgIG5hbWU6IHtcbiAgICAgICAgdHlwZTogJ3N0cmluZydcbiAgICAgIH0sXG4gICAgICBsb2NhdGlvbjoge1xuICAgICAgICB0eXBlOiAnYXJyYXknLFxuICAgICAgICBtaW5JdGVtczogMixcbiAgICAgICAgbWF4SXRlbXM6IDIsXG4gICAgICAgIGl0ZW1zOiB7XG4gICAgICAgICAgdHlwZTogJ251bWJlcidcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIHR5cGU6IHtcbiAgICAgICAgdHlwZTogJ3N0cmluZydcbiAgICAgIH0sXG4gICAgICBjcmVhdGVkX2F0OiB7XG4gICAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgICBmb3JtYXQ6ICdkYXRlLXRpbWUnXG4gICAgICB9LFxuICAgICAgZGVzY3JpcHRpb246IHtcbiAgICAgICAgdHlwZTogJ3N0cmluZydcbiAgICAgIH0sXG4gICAgICBmbGFnOiB7XG4gICAgICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICAgICAgZGVmYXVsdDogZmFsc2VcbiAgICAgIH1cbiAgICB9LFxuICAgIHJlcXVpcmVkOiBbXG4gICAgICAnbmFtZScsXG4gICAgICAnbG9jYXRpb24nLFxuICAgICAgJ3R5cGUnLFxuICAgICAgJ2NyZWF0ZWRfYXQnLFxuICAgICAgJ2ZsYWcnXG4gICAgXVxuICB9XG59ICk7XG5cbi8vICMgU2VydmljZSBNb2RlbFxuLy8gQSBzZXJ2aWNlIGlzIGEgYnVpc25lc3Mgb3IgcG9pbnQgb2YgaW50ZXJlc3QgdG8gYSBjeWNsaXN0LiBBIGN5Y2xpc3QgbmVlZHNcbi8vIHRvIGtub3cgd2hlcmUgdGhleSB3YW50IHRvIHN0b3Agd2VsbCBpbiBhZHZhbmNlIG9mIHRoZWlyIHRyYXZlbCB0aHJvdWdoIGFuXG4vLyBhcmVhLiBUaGUgc2VydmljZSByZWNvcmQgbXVzdCBjb250YWluIGVub3VnaCBpbmZvcm1hdGlvbiB0byBoZWxwIHRoZSBjeWNsaXN0XG4vLyBtYWtlIHN1Y2ggZGVjaXNpb25zLlxuLy9cbi8vIFRoZSByZWNvcmQgaW5jbHVkZXMgY29udGFjdCBpbmZvcm1hdGlvbiwgYW5kIGEgc2NoZWR1bGUgb2YgaG91cnMgb2Zcbi8vIG9wZXJhdGlvbi4gSXQgaXMgaW1wb3J0YW50IHRoYXQgd2Ugc3RvcmUgdGhlIHRpbWUgem9uZSBvZiBhIHNlcnZpY2UsIHNpbmNlXG4vLyB0b3VyaW5nIGN5Y2xpc3RzIHdpbGwgY3Jvc3MgdGltZSB6b25lcyBvbiB0aGVpciB0cmF2ZWxzLiBGdXJ0aGVybW9yZSxcbi8vIHNlcnZpY2VzIG9mIGludGVyZXN0IHRvIHRvdXJpbmcgY3ljbGlzdHMgbWF5IGJlIHNlYXNvbmFsOiB3ZSBzdG9yZVxuLy8gc2NoZWR1bGVzIGZvciBkaWZmZXJlbnQgc2Vhc29ucy5cblxuLy8gIyMgU2VydmljZSBUeXBlc1xuLy8gQSBTZXJ2aWNlIG1heSBoYXZlIGEgc2luZ2xlIHR5cGUsIGluZGljYXRpbmcgdGhlIHByaW1hcnkgcHVycG9zZSBvZiB0aGVcbi8vIGJ1aXNuZXNzIG9yIHBvaW50IG9mIGludGVyZXN0LiBTZXJ2aWNlIHR5cGVzIG1heSBhbHNvIGJlIGluY2x1ZGVkIGluIGFcbi8vIFNlcnZpY2UncyBhbWVuaXRpZXMgYXJyYXkuXG4vKmVzZm10LWlnbm9yZS1zdGFydCovXG5leHBvcnQgY29uc3Qgc2VydmljZVR5cGVzID0ge1xuICAnYWlycG9ydCc6ICAgICAgICAgICB7IGRpc3BsYXk6ICdBaXJwb3J0JyB9LFxuICAnYmFyJzogICAgICAgICAgICAgICB7IGRpc3BsYXk6ICdCYXInIH0sXG4gICdiZWRfYW5kX2JyZWFrZmFzdCc6IHsgZGlzcGxheTogJ0JlZCAmIEJyZWFrZmFzdCcgfSxcbiAgJ2Jpa2Vfc2hvcCc6ICAgICAgICAgeyBkaXNwbGF5OiAnQmlrZSBTaG9wJyB9LFxuICAnY2FiaW4nOiAgICAgICAgICAgICB7IGRpc3BsYXk6ICdDYWJpbicgfSxcbiAgJ2NhbXBncm91bmQnOiAgICAgICAgeyBkaXNwbGF5OiAnQ2FtcGdyb3VuZCcgfSxcbiAgJ2NvbnZlbmllbmNlX3N0b3JlJzogeyBkaXNwbGF5OiAnQ29udmVuaWVuY2UgU3RvcmUnIH0sXG4gICdjeWNsaXN0c19jYW1waW5nJzogIHsgZGlzcGxheTogJ0N5Y2xpc3RzXFwnIENhbXBpbmcnIH0sXG4gICdjeWNsaXN0c19sb2RnaW5nJzogIHsgZGlzcGxheTogJ0N5Y2xpc3RzXFwnIExvZGdpbmcnIH0sXG4gICdncm9jZXJ5JzogICAgICAgICAgIHsgZGlzcGxheTogJ0dyb2NlcnknIH0sXG4gICdob3N0ZWwnOiAgICAgICAgICAgIHsgZGlzcGxheTogJ0hvc3RlbCcgfSxcbiAgJ2hvdF9zcHJpbmcnOiAgICAgICAgeyBkaXNwbGF5OiAnSG90IFNwcmluZycgfSxcbiAgJ2hvdGVsJzogICAgICAgICAgICAgeyBkaXNwbGF5OiAnSG90ZWwnIH0sXG4gICdtb3RlbCc6ICAgICAgICAgICAgIHsgZGlzcGxheTogJ01vdGVsJyB9LFxuICAnaW5mb3JtYXRpb24nOiAgICAgICB7IGRpc3BsYXk6ICdJbmZvcm1hdGlvbicgfSxcbiAgJ2xpYnJhcnknOiAgICAgICAgICAgeyBkaXNwbGF5OiAnTGlicmFyeScgfSxcbiAgJ211c2V1bSc6ICAgICAgICAgICAgeyBkaXNwbGF5OiAnTXVzZXVtJyB9LFxuICAnb3V0ZG9vcl9zdG9yZSc6ICAgICB7IGRpc3BsYXk6ICdPdXRkb29yIFN0b3JlJyB9LFxuICAncmVzdF9hcmVhJzogICAgICAgICB7IGRpc3BsYXk6ICdSZXN0IEFyZWEnIH0sXG4gICdyZXN0YXVyYW50JzogICAgICAgIHsgZGlzcGxheTogJ1Jlc3RhdXJhbnQnIH0sXG4gICdyZXN0cm9vbSc6ICAgICAgICAgIHsgZGlzcGxheTogJ1Jlc3Ryb29tJyB9LFxuICAnc2NlbmljX2FyZWEnOiAgICAgICB7IGRpc3BsYXk6ICdTY2VuaWMgQXJlYScgfSxcbiAgJ3N0YXRlX3BhcmsnOiAgICAgICAgeyBkaXNwbGF5OiAnU3RhdGUgUGFyaycgfSxcbiAgJ290aGVyJzogICAgICAgICAgICAgeyBkaXNwbGF5OiAnT3RoZXInIH1cbn07XG4vKmVzZm10LWlnbm9yZS1lbmQqL1xuXG5leHBvcnQgY29uc3QgU2VydmljZSA9IFBvaW50LmV4dGVuZCgge1xuICBzcGVjaWZ5OiBmdW5jdGlvbiggbmFtZSwgbG9jYXRpb24gKSB7XG4gICAgUG9pbnQucHJvdG90eXBlLnNwZWNpZnkuY2FsbCggdGhpcywgJ3NlcnZpY2UnLCBuYW1lLCBsb2NhdGlvbiApO1xuICB9LFxuXG4gIHNjaGVtYTogbWVyZ2VTY2hlbWFzKCBQb2ludC5wcm90b3R5cGUuc2NoZW1hLCB7XG4gICAgcHJvcGVydGllczoge1xuICAgICAgdHlwZToge1xuICAgICAgICBlbnVtOiBrZXlzKCBzZXJ2aWNlVHlwZXMgKVxuICAgICAgfSxcbiAgICAgIGFtZW5pdGllczoge1xuICAgICAgICB0eXBlOiAnYXJyYXknLFxuICAgICAgICBpdGVtczoge1xuICAgICAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgICAgIGVudW06IGtleXMoIHNlcnZpY2VUeXBlcyApXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBhZGRyZXNzOiB7XG4gICAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgICB9LFxuICAgICAgc2NoZWR1bGU6IHtcbiAgICAgICAgdHlwZTogJ2FycmF5J1xuICAgICAgfSxcbiAgICAgIHNlYXNvbmFsOiB7XG4gICAgICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICAgICAgZGVmYXVsdDogZmFsc2VcbiAgICAgIH0sXG4gICAgICBwaG9uZToge1xuICAgICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgICAgfSxcbiAgICAgIHdlYnNpdGU6IHtcbiAgICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICAgIGZvcm1hdDogJ3VyaSdcbiAgICAgIH1cbiAgICB9LFxuICAgIHJlcXVpcmVkOiBbXG4gICAgICAnc2Vhc29uYWwnXG4gICAgXVxuICB9IClcbn0gKTtcblxuLy8gQXBwbHkgdGhlIHZhbGlkYXRpb24gbWl4aW4gdG8gdGhlIFNlcnZpY2UgbW9kZWwuIFNlZSB2YWxpZGF0aW9uLW1peGluLmpzLlxubWl4aW5WYWxpZGF0aW9uKCBTZXJ2aWNlICk7XG5cbi8vICMgQWxlcnQgTW9kZWxcbi8vIEFuIGFsZXJ0IGlzIHNvbWV0aGluZyB0aGF0IG1pZ2h0IGltcGVkZSBhIGN5Y2xpc3QncyB0b3VyLiBXaGVuIGEgY3ljbGlzdFxuLy8gc2VlcyBhbiBhbGVydCBvbiB0aGUgbWFwLCB0aGUga25vdyB0byBwbGFuIGFyb3VuZCBpdC5cblxuLyplc2ZtdC1pZ25vcmUtc3RhcnQqL1xuZXhwb3J0IGNvbnN0IGFsZXJ0VHlwZXMgPSB7XG4gICdyb2FkX2Nsb3N1cmUnOiAgICAgIHsgZGlzcGxheTogJ1JvYWQgQ2xvc3VyZScgfSxcbiAgJ2ZvcmVzdF9maXJlJzogICAgICAgeyBkaXNwbGF5OiAnRm9yZXN0IGZpcmUnIH0sXG4gICdmbG9vZGluZyc6ICAgICAgICAgIHsgZGlzcGxheTogJ0Zsb29kaW5nJyB9LFxuICAnZGV0b3VyJzogICAgICAgICAgICB7IGRpc3BsYXk6ICdEZXRvdXInIH0sXG4gICdvdGhlcic6ICAgICAgICAgICAgIHsgZGlzcGxheTogJ090aGVyJyB9XG59O1xuLyplc2ZtdC1pZ25vcmUtZW5kKi9cblxuZXhwb3J0IGNvbnN0IEFsZXJ0ID0gUG9pbnQuZXh0ZW5kKCB7XG4gIHNwZWNpZnk6IGZ1bmN0aW9uKCBuYW1lLCBsb2NhdGlvbiApIHtcbiAgICBQb2ludC5wcm90b3R5cGUuc3BlY2lmeS5jYWxsKCB0aGlzLCAnYWxlcnQnLCBuYW1lLCBsb2NhdGlvbiApO1xuICB9LFxuXG4gIHNjaGVtYTogbWVyZ2VTY2hlbWFzKCBQb2ludC5wcm90b3R5cGUuc2NoZW1hLCB7XG4gICAgcHJvcGVydGllczoge1xuICAgICAgdHlwZToge1xuICAgICAgICBlbnVtOiBrZXlzKCBhbGVydFR5cGVzIClcbiAgICAgIH1cbiAgICB9XG4gIH0gKVxufSApO1xuXG5taXhpblZhbGlkYXRpb24oIEFsZXJ0ICk7XG5cbi8vICMgUG9pbnQgQ29sbGVjdGlvblxuLy8gQSBoZXRlcm9nZW5lb3VzIGNvbGxlY3Rpb24gb2Ygc2VydmljZXMgYW5kIGFsZXJ0cy4gUG91Y2hEQiBpcyBhYmxlIHRvIGZldGNoXG4vLyB0aGlzIGNvbGxlY3Rpb24gYnkgbG9va2luZyBmb3IgYWxsIGtleXMgc3RhcnRpbmcgd2l0aCAncG9pbnQvJy5cbi8vXG4vLyBUaGlzIGFsc28gaGFzIHRoZSBlZmZlY3Qgb2YgZmV0Y2hpbmcgY29tbWVudHMgZm9yIHBvaW50cy4gVE9ETzogaGFuZGxlXG4vLyBgQ29tbWVudGAgaW4gdGhlIG1vZGVsIGZ1bmN0aW9uLlxuLy9cbi8vIEEgY29ubmVjdGVkIFBvaW50Q29sbGVjdGlvbiBtdXN0IGJlIGFibGUgdG8gZ2VuZXJhdGUgY29ubmVjdGVkIEFsZXJ0cyBvclxuLy8gU2VydmljZXMgb24gZGVtYW5kcy4gVGhlcmVmb3JlLCBpZiBQb2ludENvbGxlY3Rpb24gaXMgY29ubmVjdGVkLCBjb25uZWN0XG4vLyBtb2RlbHMgYmVmb3JlIHJldHVybmluZyB0aGVtLlxuZXhwb3J0IGNvbnN0IFBvaW50Q29sbGVjdGlvbiA9IENvdWNoQ29sbGVjdGlvbi5leHRlbmQoIHtcbiAgaW5pdGlhbGl6ZTogZnVuY3Rpb24oIG1vZGVscywgb3B0aW9ucyApIHtcbiAgICBDb3VjaENvbGxlY3Rpb24ucHJvdG90eXBlLmluaXRpYWxpemUuYXBwbHkoIHRoaXMsIGFyZ3VtZW50cyApO1xuICAgIHRoaXMucG91Y2ggPSB7XG4gICAgICBvcHRpb25zOiB7XG4gICAgICAgIGFsbERvY3M6IHsgaW5jbHVkZV9kb2NzOiB0cnVlLCAuLi5rZXlzQmV0d2VlbiggJ3BvaW50LycgKSB9XG4gICAgICB9XG4gICAgfTtcblxuICAgIGNvbnN0IHtjb25uZWN0LCBkYXRhYmFzZX0gPSB0aGlzO1xuICAgIHRoaXMuc2VydmljZSA9IGNvbm5lY3QgPyBjb25uZWN0KCBkYXRhYmFzZSwgU2VydmljZSApIDogU2VydmljZTtcbiAgICB0aGlzLmFsZXJ0ID0gY29ubmVjdCA/IGNvbm5lY3QoIGRhdGFiYXNlLCBBbGVydCApIDogQWxlcnQ7XG4gIH0sXG5cbiAgbW9kZWw6IGZ1bmN0aW9uKCBhdHRyaWJ1dGVzLCBvcHRpb25zICkge1xuICAgIGNvbnN0IHBhcnRzID0gcG9pbnRJZCggYXR0cmlidXRlcy5faWQgKTtcbiAgICBjb25zdCBtYXAgPSB7XG4gICAgICAnc2VydmljZSc6IG9wdGlvbnMuY29sbGVjdGlvbi5zZXJ2aWNlLFxuICAgICAgJ2FsZXJ0Jzogb3B0aW9ucy5jb2xsZWN0aW9uLmFsZXJ0XG4gICAgfTtcbiAgICBjb25zdCBjb25zdHJ1Y3RvciA9IG1hcFsgcGFydHMudHlwZSBdO1xuICAgIGlmICggY29uc3RydWN0b3IgKSB7XG4gICAgICByZXR1cm4gbmV3IGNvbnN0cnVjdG9yKCBhdHRyaWJ1dGVzLCBvcHRpb25zICk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93ICdBIHBvaW50IG11c3QgYmUgZWl0aGVyIGEgc2VydmljZSBvciBhbGVydCc7XG4gICAgfVxuICB9XG59ICk7XG5cbi8vICMgRGlzcGxheSBOYW1lIGZvciBUeXBlXG4vLyBHaXZlbiBhIHR5cGUga2V5IGZyb20gZWl0aGVyIHRoZSBzZXJ2aWNlIG9yIGFsZXJ0IHR5cGUgZW51bWVyYXRpb25zLFxuLy8gcmV0dXJuIHRoZSB0eXBlJ3MgZGlzcGxheSBzdHJpbmcsIG9yIG51bGwgaWYgaXQgZG9lcyBub3QgZXhpc3QuXG5leHBvcnQgZnVuY3Rpb24gZGlzcGxheSggdHlwZSApIHtcbiAgY29uc3QgdmFsdWVzID0gc2VydmljZVR5cGVzWyB0eXBlIF0gfHwgYWxlcnRUeXBlc1sgdHlwZSBdO1xuICBpZiAoIHZhbHVlcyApIHtcbiAgICByZXR1cm4gdmFsdWVzLmRpc3BsYXk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbn1cblxuLy8gIyBDb21tZW50IE1vZGVsXG4vLyBJbmZvcm1hdGlvbiBhYm91dCBhbGVydHMgYW5kIHNlcnZpY2VzIGVuY291bnRlcmVkIGJ5IGN5Y2xpc3RzIGlzIGxpa2VseVxuLy8gdG8gY2hhbmdlIHdpdGggdGhlIHNlYXNvbnMgb3Igb3RoZXIgcmVhc29ucy4gQ3ljbGlzdHMgcGxhbm5pbmcgdGhlIG5leHQgbGVnXG4vLyBvZiBhIHRvdXIgc2hvdWxkIGJlIGFibGUgdG8gcmVhZCB0aGUgZXhwZXJpZW5jZXMgb2YgY3ljbGlzdHMgYWhlYWQgb2YgdGhlbS5cbi8vXG4vLyBBIGNvbW1lbnQgbXVzdCBoYXZlIGJvdGggYSByYXRpbmcgYW5kIHRoZSB0ZXh0IG9mIHRoZSBjb21tZW50LiBDb21tZW50cyBhcmVcbi8vIGxpbWl0ZWQgdG8gMTQwIGNoYXJhY3RlcnMgdG8gZW5zdXJlIHRoZXkgZG8gbm90IGRldm9sdmUgaW50byBnZW5lcmFsIGFsZXJ0XG4vLyBvciBzZXJ2aWNlIGluZm9ybWF0aW9uIHRoYXQgc2hvdWxkIHJlYWxseSBiZSBpbiB0aGUgZGVzY3JpcHRpb24uIFdlIHJlYWxseVxuLy8gd2FudCB1c2VycyBvZiB0aGUgQmljeWNsZSBUb3VyaW5nIENvbXBhbmlvbiB0byBwcm92aWRlIGNvbW1lbnRzIHZlcmlmeWluZ1xuLy8gaW5mbyBhYm91dCBwb2ludHMsIG9yIGxldHRpbmcgb3RoZXIgY3ljbGlzdHMga25vdyBhYm91dCBjaGFuZ2VzIGluIHRoZVxuLy8gc2VydmljZSBvciBhbGVydC5cblxuLy8gIyMgQ29tbWVudCBNb2RlbCBVcmlcbi8vIENvbW1lbnRzIGFyZSBzdG9yZWQgaW4gQ291Y2hEQiBpbiB0aGUgc2FtZSBkYXRhYmFzZSBhcyBwb2ludHMuIFRoZSBjb21tZW50XG4vLyBtb2RlbCB1cmkgaXMgY29tcG9zZWQgb2YgdGhyZWUgcGFydHM6XG4vLyAgMS4gVGhlIGVudGlyZSBpZCBvZiB0aGUgcmVsYXRlZCBwb2ludFxuLy8gIDIuIFRoZSBzdHJpbmcgJ2NvbW1lbnQvJ1xuLy8gIDMuIEEgdGltZSBiYXNlZCBVVUlEIHRvIHVuaXF1ZWx5IGlkZW50aWZ5IGNvbW1lbnRzXG4vL1xuLy8gV2UgZG9uJ3QgdXNlIGBkb2N1cmlgIGZvciB0aGUgY29tbWVudCBtb2RlbCB1cmlzIGJlY2F1c2Ugd2UgZG9uJ3QgaGF2ZSB0b1xuLy8gcGFyc2UgdGhlbS5cblxuY29uc3QgQ09NTUVOVF9NQVhfTEVOR1RIID0gMTQwO1xuZXhwb3J0IGNvbnN0IENvbW1lbnQgPSBDb3VjaE1vZGVsLmV4dGVuZCgge1xuICBpZEF0dHJpYnV0ZTogJ19pZCcsXG5cbiAgLy8gIyMgQ29uc3RydWN0b3JcbiAgLy8gR2VuZXJhdGUgYF9pZGAuIGBwb2ludElkYCBtdXN0IGJlIHNwZWNpZmllZCBpbiBvcHRpb25zLlxuICBjb25zdHJ1Y3RvcjogZnVuY3Rpb24oIGF0dHJpYnV0ZXMsIG9wdGlvbnMgKSB7XG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gICAgaWYgKCAhYXR0cmlidXRlcy51dWlkICkge1xuICAgICAgYXR0cmlidXRlcy51dWlkID0gdXVpZC52MSgpO1xuICAgIH1cbiAgICBpZiAoICFhdHRyaWJ1dGVzLl9pZCAmJiBvcHRpb25zLnBvaW50SWQgKSB7XG4gICAgICBhdHRyaWJ1dGVzLl9pZCA9IG9wdGlvbnMucG9pbnRJZCArICcvY29tbWVudC8nICsgYXR0cmlidXRlcy51dWlkO1xuICAgIH1cbiAgICBDb3VjaE1vZGVsLmFwcGx5KCB0aGlzLCBhcmd1bWVudHMgKTtcbiAgfSxcblxuICBzY2hlbWE6IHtcbiAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICBhZGRpdGlvbmFsUHJvcGVydGllczogZmFsc2UsXG4gICAgcHJvcGVydGllczoge1xuICAgICAgdXNlcm5hbWU6IHtcbiAgICAgICAgJ3R5cGUnOiAnc3RyaW5nJ1xuICAgICAgfSxcbiAgICAgIHRleHQ6IHtcbiAgICAgICAgJ3R5cGUnOiAnc3RyaW5nJyxcbiAgICAgICAgJ21heExlbmd0aCc6IENPTU1FTlRfTUFYX0xFTkdUSFxuICAgICAgfSxcbiAgICAgIHJhdGluZzoge1xuICAgICAgICB0eXBlOiAnaW50ZWdlcicsXG4gICAgICAgIG1pbmltdW06IDEsXG4gICAgICAgIG1heGltdW06IDVcbiAgICAgIH0sXG4gICAgICB1dWlkOiB7XG4gICAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgICB9XG4gICAgfSxcbiAgICByZXF1aXJlZDogW1xuICAgICAgJ3VzZXJuYW1lJyxcbiAgICAgICd0ZXh0JyxcbiAgICAgICdyYXRpbmcnLFxuICAgICAgJ3V1aWQnXG4gICAgXVxuICB9XG59LCB7XG4gIE1BWF9MRU5HVEg6IENPTU1FTlRfTUFYX0xFTkdUSFxufSApO1xuXG5taXhpblZhbGlkYXRpb24oIENvbW1lbnQgKTtcblxuLy8gIyBDb21tZW50IENvbGxlY3Rpb25cbi8vIEZldGNoIG9ubHkgY29tbWVudHMgYXNzb2NpYXRlZCB3aXRoIGEgZ2l2ZW4gcG9pbnQuXG5leHBvcnQgY29uc3QgQ29tbWVudENvbGxlY3Rpb24gPSBDb3VjaENvbGxlY3Rpb24uZXh0ZW5kKCB7XG4gIGluaXRpYWxpemU6IGZ1bmN0aW9uKCBtb2RlbHMsIG9wdGlvbnMgKSB7XG4gICAgQ291Y2hDb2xsZWN0aW9uLnByb3RvdHlwZS5pbml0aWFsaXplLmFwcGx5KCB0aGlzLCBhcmd1bWVudHMgKTtcbiAgICBjb25zdCBwb2ludElkID0gdGhpcy5wb2ludElkID0gb3B0aW9ucy5wb2ludElkO1xuXG4gICAgY29uc3QgY29ubmVjdCA9IHRoaXMuY29ubmVjdDtcbiAgICBjb25zdCBkYXRhYmFzZSA9IHRoaXMuZGF0YWJhc2U7XG4gICAgdGhpcy5jb21tZW50ID0gY29ubmVjdCA/IGNvbm5lY3QoIGRhdGFiYXNlLCBDb21tZW50ICkgOiBDb21tZW50O1xuXG4gICAgdGhpcy5wb3VjaCA9IHtcbiAgICAgIG9wdGlvbnM6IHtcbiAgICAgICAgYWxsRG9jczoge1xuICAgICAgICAgIC4uLmtleXNCZXR3ZWVuKCBwb2ludElkICsgJy9jb21tZW50JyApLFxuICAgICAgICAgIGluY2x1ZGVfZG9jczogdHJ1ZVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcbiAgfSxcblxuICBtb2RlbDogZnVuY3Rpb24oIGF0dHJpYnV0ZXMsIG9wdGlvbnMgKSB7XG4gICAgY29uc3Qge2NvbW1lbnQsIHBvaW50SWR9ID0gb3B0aW9ucy5jb2xsZWN0aW9uO1xuICAgIHJldHVybiBuZXcgY29tbWVudCggYXR0cmlidXRlcywgeyBwb2ludElkLCAuLi5vcHRpb25zIH0gKTtcbiAgfVxufSApO1xuIl19