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

var _blobUtil = require('blob-util');

var _docuri = require('docuri');

var _docuri2 = _interopRequireDefault(_docuri);

var _ngeohash = require('ngeohash');

var _ngeohash2 = _interopRequireDefault(_ngeohash);

var _toId = require('to-id');

var _toId2 = _interopRequireDefault(_toId);

var _nodeUuid = require('node-uuid');

var _nodeUuid2 = _interopRequireDefault(_nodeUuid);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var browser = typeof window !== 'undefined';

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
    this.coverUrl = false;
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
  },

  attach: function attach(blob, name, type) {
    _base.CouchModel.prototype.attach.apply(this, arguments);
    if (browser) {
      this.coverUrl = (0, _blobUtil.createObjectURL)(blob);
    }
  },

  clear: function clear() {
    _base.CouchModel.prototype.clear.apply(this, arguments);
    this.coverUrl = false;
  },

  // When fetching a point, should it have a cover attachment, extend the
  // promise to fetch the attachment and set `this.coverUrl`. Regardless
  // of the existence of the cover attachment, always resolve the promise to
  // the original result.
  fetch: function fetch() {
    var _this = this;

    var _res = undefined;
    return _base.CouchModel.prototype.fetch.apply(this, arguments).then(function (res) {
      _res = res;

      var hasCover = (0, _lodash.includes)(_this.attachments(), 'cover.png');

      if (browser && hasCover) {
        return _this.attachment('cover.png');
      } else {
        return;
      }
    }).then(function (blob) {
      if (blob) {
        _this.coverUrl = (0, _blobUtil.createObjectURL)(blob);
      }
      return _res;
    });
  },

  store: function store() {
    return _extends({}, this.toJSON(), { coverUrl: this.coverUrl });
  }
}, {
  uri: pointId,

  for: function _for(id) {
    var _pointId = pointId(id);

    var type = _pointId.type;

    if (type === 'service') {
      return new Service({ _id: id });
    } else if (type === 'alert') {
      return new Alert({ _id: id });
    } else {
      throw 'A point must either be a service or alert';
    }
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
        },
        default: []
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
  },

  store: function store() {
    return (0, _lodash.fromPairs)(this.models, function (point) {
      return [point.id, point.store()];
    });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tb2RlbC9wb2ludC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O1FBc1ZnQixPQUFPLEdBQVAsT0FBTzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXhUdkIsSUFBTSxPQUFPLEdBQUssT0FBTyxNQUFNLEtBQUssV0FBVyxBQUFFOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQyxBQWtCbEQsSUFBTSxPQUFPLEdBQUcsaUJBQU8sS0FBSyxDQUFFLDRCQUE0QixDQUFFLENBQUM7O0FBRXRELElBQU0sS0FBSyxXQUFMLEtBQUssR0FBRyxpQkFBVyxNQUFNLENBQUU7QUFDdEMsYUFBVyxFQUFFLEtBQUs7O0FBRWxCLFlBQVUsRUFBRSxvQkFBVSxVQUFVLEVBQUUsT0FBTyxFQUFHO0FBQzFDLHFCQUFXLFNBQVMsQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFFLElBQUksRUFBRSxTQUFTLENBQUUsQ0FBQztBQUN6RCxRQUFJLENBQUMsR0FBRyxDQUFFLFlBQVksRUFBRSxJQUFJLElBQUksRUFBRSxDQUFDLFdBQVcsRUFBRSxDQUFFLENBQUM7QUFDbkQsUUFBSSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUM7R0FDdkI7Ozs7O0FBS0QsU0FBTyxFQUFFLGlCQUFVLElBQUksRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFHO0FBQ3hDLFFBQUssSUFBSSxFQUFHO3FDQUNTLFFBQVE7O1VBQXBCLEdBQUc7VUFBRSxHQUFHOztBQUNmLFVBQU0sR0FBRyxHQUFHLE9BQU8sQ0FBRTtBQUNuQixZQUFJLEVBQUUsSUFBSTtBQUNWLFlBQUksRUFBRSxvQkFBVyxJQUFJLENBQUU7QUFDdkIsZUFBTyxFQUFFLG1CQUFTLE1BQU0sQ0FBRSxHQUFHLEVBQUUsR0FBRyxDQUFFO09BQ3JDLENBQUUsQ0FBQztBQUNKLFVBQUksQ0FBQyxHQUFHLENBQUUsRUFBRSxHQUFHLEVBQUgsR0FBRyxFQUFFLElBQUksRUFBSixJQUFJLEVB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Q0FBQzs7QUFFaEUsUUFBSSxDQUFDLEtBQUssR0FBRztBQUNYLGFBQU8sRUFBRTtBQUNQLGVBQU8sZUFDRix1QkFBYSxPQUFPLEdBQUcsVUFBVSxDQUFFO0FBQ3RDLHNCQUFZLEVBQUUsSUFBSTtVQUNuQjtPQUNGO0tBQ0YsQ0FBQztHQUNIOztBQUVELE9BQUssRUFBRSxlQUFVLFVBQVUsRUFBRSxPQUFPLEVBQUc7OEJBQ1YsT0FBTyxDQUFDLFVBQVU7UUFBdEMsT0FBTyx1QkFBUCxPQUFPO1FBQUUsT0FBTyx1QkFBUCxPQUFPOztBQUN2QixXQUFPLElBQUksT0FBTyxDQUFFLFVBQVUsYUFBSSxPQUFPLEVBQVAsT0FBTyxJQUFLLE9BQU8sRUFBSSxDQUFDO0dBQzNEO0NBQ0YsQ0FBRSxDQUFDIiwiZmlsZSI6InBvaW50LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogYnRjLWFwcC1zZXJ2ZXIgLS0gU2VydmVyIGZvciB0aGUgQmljeWNsZSBUb3VyaW5nIENvbXBhbmlvblxuICogQ29weXJpZ2h0IMKpIDIwMTYgQWR2ZW50dXJlIEN5Y2xpbmcgQXNzb2NpYXRpb25cbiAqXG4gKiBUaGlzIGZpbGUgaXMgcGFydCBvZiBidGMtYXBwLXNlcnZlci5cbiAqXG4gKiBidGMtYXBwLXNlcnZlciBpcyBmcmVlIHNvZnR3YXJlOiB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5XG4gKiBpdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEFmZmVybyBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBhcyBwdWJsaXNoZWQgYnlcbiAqIHRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24sIGVpdGhlciB2ZXJzaW9uIDMgb2YgdGhlIExpY2Vuc2UsIG9yXG4gKiAoYXQgeW91ciBvcHRpb24pIGFueSBsYXRlciB2ZXJzaW9uLlxuICpcbiAqIGJ0Yy1hcHAtc2VydmVyIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXG4gKiBidXQgV0lUSE9VVCBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZlxuICogTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiAgU2VlIHRoZVxuICogQWZmZXJvIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXG4gKlxuICogWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgQWZmZXJvIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4gKiBhbG9uZyB3aXRoIEZvb2Jhci4gIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cbiAqL1xuXG5pbXBvcnQgeyBtaXhpblZhbGlkYXRpb24sIG1lcmdlU2NoZW1hcyB9IGZyb20gJy4vdmFsaWRhdGlvbi1taXhpbic7XG5pbXBvcnQgeyBDb3VjaE1vZGVsLCBDb3VjaENvbGxlY3Rpb24sIGtleXNCZXR3ZWVuIH0gZnJvbSAnLi9iYXNlJztcblxuaW1wb3J0IHsga2V5cywgZnJvbVBhaXJzLCBpbmNsdWRlcyB9IGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgeyBjcmVhdGVPYmplY3RVUkwgfSBmcm9tICdibG9iLXV0aWwnO1xuXG5pbXBvcnQgZG9jdXJpIGZyb20gJ2RvY3VyaSc7XG5pbXBvcnQgbmdlb2hhc2ggZnJvbSAnbmdlb2hhc2gnO1xuaW1wb3J0IG5vcm1hbGl6ZSBmcm9tICd0by1pZCc7XG5pbXBvcnQgdXVpZCBmcm9tICdub2RlLXV1aWQnO1xuXG5jb25zdCBicm93c2VyID0gKCB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyApO1xuXG4vLyAjIFBvaW50IE1vZGVsXG4vLyBUaGUgcG9pbnQgcmVwcmVzZW50cyBhIGxvY2F0aW9uIG9uIHRoZSBtYXAgd2l0aCBhc3NvY2lhdGVkIG1ldGFkYXRhLCBnZW9kYXRhLFxuLy8gYW5kIHVzZXIgcHJvdmlkZWQgZGF0YS4gVGhlIHBvaW50IGlzIHRoZSBiYXNlIHNoYXJlZCBieSBzZXJ2aWNlcyBhbmQgYWxlcnRzLlxuLy9cbi8vIFRoZSBKU09OIHNjaGVtYSBzdG9yZWQgaW4gYFBvaW50YCwgYW5kIGFzIHBhdGNoZWQgYnkgYFNlcnZpY2VgIGFuZCBgQWxlcnRgLFxuLy8gaXMgdGhlIGF1dGhvcml0YXRpdmUgZGVmaW5pdGlvbiBvZiB0aGUgcG9pbnQgcmVjb3JkLlxuXG4vLyAjIyBQb2ludCBNb2RlbCBVcmlcbi8vIFBvaW50cyBhcmUgc3RvcmVkIGluIENvdWNoREIuIENvdWNoREIgZG9jdW1lbnRzIGNhbiBoYXZlIHJpY2ggaWQgc3RyaW5nc1xuLy8gdG8gaGVscCBzdG9yZSBhbmQgYWNjZXNzIGRhdGEgd2l0aG91dCBNYXBSZWR1Y2Ugam9icy5cbi8vXG4vLyBUaGUgcG9pbnQgbW9kZWwgdXJpIGlzIGNvbXBvc2VkIG9mIGZvdXIgcGFydHM6XG4vLyAgMS4gVGhlIHN0cmluZyAncG9pbnQvJ2Bcbi8vICAyLiBUaGUgdHlwZSBvZiBwb2ludCwgZWl0aGVyICdzZXJ2aWNlJyBvciAnYWxlcnQnXG4vLyAgMy4gVGhlIG5vcm1hbGl6ZWQgbmFtZSBvZiB0aGUgcG9pbnRcbi8vICA0LiBUaGUgcG9pbnQncyBnZW9oYXNoXG5jb25zdCBwb2ludElkID0gZG9jdXJpLnJvdXRlKCAncG9pbnQvOnR5cGUvOm5hbWUvOmdlb2hhc2gnICk7XG5cbmV4cG9ydCBjb25zdCBQb2ludCA9IENvdWNoTW9kZWwuZXh0ZW5kKCB7XG4gIGlkQXR0cmlidXRlOiAnX2lkJyxcblxuICBpbml0aWFsaXplOiBmdW5jdGlvbiggYXR0cmlidXRlcywgb3B0aW9ucyApIHtcbiAgICBDb3VjaE1vZGVsLnByb3RvdHlwZS5pbml0aWFsaXplLmFwcGx5KCB0aGlzLCBhcmd1bWVudHMgKTtcbiAgICB0aGlzLnNldCggJ2NyZWF0ZWRfYXQnLCBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCkgKTtcbiAgICB0aGlzLmNvdmVyVXJsID0gZmFsc2U7XG4gIH0sXG5cbiAgLy8gIyMgU3BlY2lmeVxuICAvLyBGaWxsIGluIGBfaWRgIGZyb20gdGhlIGNvbXBvbmVudHMgb2YgdGhlIHBvaW50IG1vZGVsIHVyaS5cbiAgLy8gUHVsbCB2YWx1ZXMgZnJvbSBgYXR0cmlidXRlc2AgaWYgbmFtZSBhbmQgbG9jYXRpb24gYXJlIHVuZGVmaW5lZC5cbiAgc3BlY2lmeTogZnVuY3Rpb24oIHR5cGUsIG5hbWUsIGxvY2F0aW9uICkge1xuICAgIGlmICggbmFtZSApIHtcbiAgICAgIGNvbnN0IFtsYXQsIGxuZ10gPSBsb2NhdGlvbjtcbiAgICAgIGNvbnN0IF9pZCA9IHBvaW50SWQoIHtcbiAgICAgICAgdHlwZTogdHlwZSxcbiAgICAgICAgbmFtZTogbm9ybWFsaXplKCBuYW1lICksXG4gICAgICAgIGdlb2hhc2g6IG5nZW9oYXNoLmVuY29kZSggbGF0LCBsbmcgKVxuICAgICAgfSApO1xuICAgICAgdGhpcy5zZXQoIHsgX2lkLCB0eXBlLCBuYW1lLCBsb2NhdGlvbiB9ICk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IHtuYW1lLCBsb2NhdGlvbn0gPSB0aGlzLmF0dHJpYnV0ZXM7XG4gICAgICBjb25zdCBbbGF0LCBsbmddID0gbG9jYXRpb247XG4gICAgICBjb25zdCBfaWQgPSBwb2ludElkKCB7XG4gICAgICAgIHR5cGU6IHR5cGUsXG4gICAgICAgIG5hbWU6IG5vcm1hbGl6ZSggbmFtZSApLFxuICAgICAgICBnZW9oYXNoOiBuZ2VvaGFzaC5lbmNvZGUoIGxhdCwgbG5nIClcbiAgICAgIH0gKTtcbiAgICAgIHRoaXMuc2V0KCB7IF9pZCB9ICk7XG4gICAgfVxuICB9LFxuXG4gIHNjaGVtYToge1xuICAgIHR5cGU6ICdvYmplY3QnLFxuICAgIGFkZGl0aW9uYWxQcm9wZXJ0aWVzOiBmYWxzZSxcbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICBuYW1lOiB7XG4gICAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgICB9LFxuICAgICAgbG9jYXRpb246IHtcbiAgICAgICAgdHlwZTogJ2FycmF5JyxcbiAgICAgICAgbWluSXRlbXM6IDIsXG4gICAgICAgIG1heEl0ZW1zOiAyLFxuICAgICAgICBpdGVtczoge1xuICAgICAgICAgIHR5cGU6ICdudW1iZXInXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICB0eXBlOiB7XG4gICAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgICB9LFxuICAgICAgY3JlYXRlZF9hdDoge1xuICAgICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgICAgZm9ybWF0OiAnZGF0ZS10aW1lJ1xuICAgICAgfSxcbiAgICAgIGRlc2NyaXB0aW9uOiB7XG4gICAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgICB9LFxuICAgICAgZmxhZzoge1xuICAgICAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgICAgIGRlZmF1bHQ6IGZhbHNlXG4gICAgICB9XG4gICAgfSxcbiAgICByZXF1aXJlZDogW1xuICAgICAgJ25hbWUnLFxuICAgICAgJ2xvY2F0aW9uJyxcbiAgICAgICd0eXBlJyxcbiAgICAgICdjcmVhdGVkX2F0JyxcbiAgICAgICdmbGFnJ1xuICAgIF1cbiAgfSxcblxuICBhdHRhY2g6IGZ1bmN0aW9uKCBibG9iLCBuYW1lLCB0eXBlICkge1xuICAgIENvdWNoTW9kZWwucHJvdG90eXBlLmF0dGFjaC5hcHBseSggdGhpcywgYXJndW1lbnRzICk7XG4gICAgaWYgKCBicm93c2VyICkge1xuICAgICAgdGhpcy5jb3ZlclVybCA9IGNyZWF0ZU9iamVjdFVSTCggYmxvYiApO1xuICAgIH1cbiAgfSxcblxuICBjbGVhcjogZnVuY3Rpb24oKSB7XG4gICAgQ291Y2hNb2RlbC5wcm90b3R5cGUuY2xlYXIuYXBwbHkoIHRoaXMsIGFyZ3VtZW50cyApO1xuICAgIHRoaXMuY292ZXJVcmwgPSBmYWxzZTtcbiAgfSxcblxuICAvLyBXaGVuIGZldGNoaW5nIGEgcG9pbnQsIHNob3VsZCBpdCBoYXZlIGEgY292ZXIgYXR0YWNobWVudCwgZXh0ZW5kIHRoZVxuICAvLyBwcm9taXNlIHRvIGZldGNoIHRoZSBhdHRhY2htZW50IGFuZCBzZXQgYHRoaXMuY292ZXJVcmxgLiBSZWdhcmRsZXNzXG4gIC8vIG9mIHRoZSBleGlzdGVuY2Ugb2YgdGhlIGNvdmVyIGF0dGFjaG1lbnQsIGFsd2F5cyByZXNvbHZlIHRoZSBwcm9taXNlIHRvXG4gIC8vIHRoZSBvcmlnaW5hbCByZXN1bHQuXG4gIGZldGNoOiBmdW5jdGlvbigpIHtcbiAgICBsZXQgX3JlcztcbiAgICByZXR1cm4gQ291Y2hNb2RlbC5wcm90b3R5cGUuZmV0Y2guYXBwbHkoIHRoaXMsIGFyZ3VtZW50cyApLnRoZW4oIHJlcyA9PiB7XG4gICAgICBfcmVzID0gcmVzO1xuXG4gICAgICBjb25zdCBoYXNDb3ZlciA9IGluY2x1ZGVzKCB0aGlzLmF0dGFjaG1lbnRzKCksICdjb3Zlci5wbmcnICk7XG5cbiAgICAgIGlmICggYnJvd3NlciAmJiBoYXNDb3ZlciApIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYXR0YWNobWVudCggJ2NvdmVyLnBuZycgKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICB9ICkudGhlbiggYmxvYiA9PiB7XG4gICAgICBpZiAoIGJsb2IgKSB7XG4gICAgICAgIHRoaXMuY292ZXJVcmwgPSBjcmVhdGVPYmplY3RVUkwoIGJsb2IgKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBfcmVzO1xuICAgIH0gKTtcbiAgfSxcblxuICBzdG9yZTogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHsgLi4udGhpcy50b0pTT04oKSwgY292ZXJVcmw6IHRoaXMuY292ZXJVcmwgfTtcbiAgfVxufSwge1xuICB1cmk6IHBvaW50SWQsXG5cbiAgZm9yOiBpZCA9PiB7XG4gICAgY29uc3Qge3R5cGV9ID0gcG9pbnRJZCggaWQgKTtcbiAgICBpZiAoIHR5cGUgPT09ICdzZXJ2aWNlJyApIHtcbiAgICAgIHJldHVybiBuZXcgU2VydmljZSggeyBfaWQ6IGlkIH0gKTtcbiAgICB9IGVsc2UgaWYgKCB0eXBlID09PSAnYWxlcnQnICkge1xuICAgICAgcmV0dXJuIG5ldyBBbGVydCggeyBfaWQ6IGlkIH0gKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgJ0EgcG9pbnQgbXVzdCBlaXRoZXIgYmUgYSBzZXJ2aWNlIG9yIGFsZXJ0JztcbiAgICB9XG4gIH1cbn0gKTtcblxuLy8gIyBTZXJ2aWNlIE1vZGVsXG4vLyBBIHNlcnZpY2UgaXMgYSBidWlzbmVzcyBvciBwb2ludCBvZiBpbnRlcmVzdCB0byBhIGN5Y2xpc3QuIEEgY3ljbGlzdCBuZWVkc1xuLy8gdG8ga25vdyB3aGVyZSB0aGV5IHdhbnQgdG8gc3RvcCB3ZWxsIGluIGFkdmFuY2Ugb2YgdGhlaXIgdHJhdmVsIHRocm91Z2ggYW5cbi8vIGFyZWEuIFRoZSBzZXJ2aWNlIHJlY29yZCBtdXN0IGNvbnRhaW4gZW5vdWdoIGluZm9ybWF0aW9uIHRvIGhlbHAgdGhlIGN5Y2xpc3Rcbi8vIG1ha2Ugc3VjaCBkZWNpc2lvbnMuXG4vL1xuLy8gVGhlIHJlY29yZCBpbmNsdWRlcyBjb250YWN0IGluZm9ybWF0aW9uLCBhbmQgYSBzY2hlZHVsZSBvZiBob3VycyBvZlxuLy8gb3BlcmF0aW9uLiBJdCBpcyBpbXBvcnRhbnQgdGhhdCB3ZSBzdG9yZSB0aGUgdGltZSB6b25lIG9mIGEgc2VydmljZSwgc2luY2Vcbi8vIHRvdXJpbmcgY3ljbGlzdHMgd2lsbCBjcm9zcyB0aW1lIHpvbmVzIG9uIHRoZWlyIHRyYXZlbHMuIEZ1cnRoZXJtb3JlLFxuLy8gc2VydmljZXMgb2YgaW50ZXJlc3QgdG8gdG91cmluZyBjeWNsaXN0cyBtYXkgYmUgc2Vhc29uYWw6IHdlIHN0b3JlXG4vLyBzY2hlZHVsZXMgZm9yIGRpZmZlcmVudCBzZWFzb25zLlxuXG4vLyAjIyBTZXJ2aWNlIFR5cGVzXG4vLyBBIFNlcnZpY2UgbWF5IGhhdmUgYSBzaW5nbGUgdHlwZSwgaW5kaWNhdGluZyB0aGUgcHJpbWFyeSBwdXJwb3NlIG9mIHRoZVxuLy8gYnVpc25lc3Mgb3IgcG9pbnQgb2YgaW50ZXJlc3QuIFNlcnZpY2UgdHlwZXMgbWF5IGFsc28gYmUgaW5jbHVkZWQgaW4gYVxuLy8gU2VydmljZSdzIGFtZW5pdGllcyBhcnJheS5cbi8qZXNmbXQtaWdub3JlLXN0YXJ0Ki9cbmV4cG9ydCBjb25zdCBzZXJ2aWNlVHlwZXMgPSB7XG4gICdhaXJwb3J0JzogICAgICAgICAgIHsgZGlzcGxheTogJ0FpcnBvcnQnIH0sXG4gICdiYXInOiAgICAgICAgICAgICAgIHsgZGlzcGxheTogJ0JhcicgfSxcbiAgJ2JlZF9hbmRfYnJlYWtmYXN0JzogeyBkaXNwbGF5OiAnQmVkICYgQnJlYWtmYXN0JyB9LFxuICAnYmlrZV9zaG9wJzogICAgICAgICB7IGRpc3BsYXk6ICdCaWtlIFNob3AnIH0sXG4gICdjYWJpbic6ICAgICAgICAgICAgIHsgZGlzcGxheTogJ0NhYmluJyB9LFxuICAnY2FtcGdyb3VuZCc6ICAgICAgICB7IGRpc3BsYXk6ICdDYW1wZ3JvdW5kJyB9LFxuICAnY29udmVuaWVuY2Vfc3RvcmUnOiB7IGRpc3BsYXk6ICdDb252ZW5pZW5jZSBTdG9yZScgfSxcbiAgJ2N5Y2xpc3RzX2NhbXBpbmcnOiAgeyBkaXNwbGF5OiAnQ3ljbGlzdHNcXCcgQ2FtcGluZycgfSxcbiAgJ2N5Y2xpc3RzX2xvZGdpbmcnOiAgeyBkaXNwbGF5OiAnQ3ljbGlzdHNcXCcgTG9kZ2luZycgfSxcbiAgJ2dyb2NlcnknOiAgICAgICAgICAgeyBkaXNwbGF5OiAnR3JvY2VyeScgfSxcbiAgJ2hvc3RlbCc6ICAgICAgICAgICAgeyBkaXNwbGF5OiAnSG9zdGVsJyB9LFxuICAnaG90X3NwcmluZyc6ICAgICAgICB7IGRpc3BsYXk6ICdIb3QgU3ByaW5nJyB9LFxuICAnaG90ZWwnOiAgICAgICAgICAgICB7IGRpc3BsYXk6ICdIb3RlbCcgfSxcbiAgJ21vdGVsJzogICAgICAgICAgICAgeyBkaXNwbGF5OiAnTW90ZWwnIH0sXG4gICdpbmZvcm1hdGlvbic6ICAgICAgIHsgZGlzcGxheTogJ0luZm9ybWF0aW9uJyB9LFxuICAnbGlicmFyeSc6ICAgICAgICAgICB7IGRpc3BsYXk6ICdMaWJyYXJ5JyB9LFxuICAnbXVzZXVtJzogICAgICAgICAgICB7IGRpc3BsYXk6ICdNdXNldW0nIH0sXG4gICdvdXRkb29yX3N0b3JlJzogICAgIHsgZGlzcGxheTogJ091dGRvb3IgU3RvcmUnIH0sXG4gICdyZXN0X2FyZWEnOiAgICAgICAgIHsgZGlzcGxheTogJ1Jlc3QgQXJlYScgfSxcbiAgJ3Jlc3RhdXJhbnQnOiAgICAgICAgeyBkaXNwbGF5OiAnUmVzdGF1cmFudCcgfSxcbiAgJ3Jlc3Ryb29tJzogICAgICAgICAgeyBkaXNwbGF5OiAnUmVzdHJvb20nIH0sXG4gICdzY2VuaWNfYXJlYSc6ICAgICAgIHsgZGlzcGxheTogJ1NjZW5pYyBBcmVhJyB9LFxuICAnc3RhdGVfcGFyayc6ICAgICAgICB7IGRpc3BsYXk6ICdTdGF0ZSBQYXJrJyB9LFxuICAnb3RoZXInOiAgICAgICAgICAgICB7IGRpc3BsYXk6ICdPdGhlcicgfVxufTtcbi8qZXNmbXQtaWdub3JlLWVuZCovXG5cbmV4cG9ydCBjb25zdCBTZXJ2aWNlID0gUG9pbnQuZXh0ZW5kKCB7XG4gIHNwZWNpZnk6IGZ1bmN0aW9uKCBuYW1lLCBsb2NhdGlvbiApIHtcbiAgICBQb2ludC5wcm90b3R5cGUuc3BlY2lmeS5jYWxsKCB0aGlzLCAnc2VydmljZScsIG5hbWUsIGxvY2F0aW9uICk7XG4gIH0sXG5cbiAgc2NoZW1hOiBtZXJnZVNjaGVtYXMoIFBvaW50LnByb3RvdHlwZS5zY2hlbWEsIHtcbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICB0eXBlOiB7XG4gICAgICAgIGVudW06IGtleXMoIHNlcnZpY2VUeXBlcyApXG4gICAgICB9LFxuICAgICAgYW1lbml0aWVzOiB7XG4gICAgICAgIHR5cGU6ICdhcnJheScsXG4gICAgICAgIGl0ZW1zOiB7XG4gICAgICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICAgICAgZW51bToga2V5cyggc2VydmljZVR5cGVzIClcbiAgICAgICAgfSxcbiAgICAgICAgZGVmYXVsdDogW11cbiAgICAgIH0sXG4gICAgICBhZGRyZXNzOiB7XG4gICAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgICB9LFxuICAgICAgc2NoZWR1bGU6IHtcbiAgICAgICAgdHlwZTogJ2FycmF5J1xuICAgICAgfSxcbiAgICAgIHNlYXNvbmFsOiB7XG4gICAgICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICAgICAgZGVmYXVsdDogZmFsc2VcbiAgICAgIH0sXG4gICAgICBwaG9uZToge1xuICAgICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgICAgfSxcbiAgICAgIHdlYnNpdGU6IHtcbiAgICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICAgIGZvcm1hdDogJ3VyaSdcbiAgICAgIH1cbiAgICB9LFxuICAgIHJlcXVpcmVkOiBbXG4gICAgICAnc2Vhc29uYWwnXG4gICAgXVxuICB9IClcbn0gKTtcblxuLy8gQXBwbHkgdGhlIHZhbGlkYXRpb24gbWl4aW4gdG8gdGhlIFNlcnZpY2UgbW9kZWwuIFNlZSB2YWxpZGF0aW9uLW1peGluLmpzLlxubWl4aW5WYWxpZGF0aW9uKCBTZXJ2aWNlICk7XG5cbi8vICMgQWxlcnQgTW9kZWxcbi8vIEFuIGFsZXJ0IGlzIHNvbWV0aGluZyB0aGF0IG1pZ2h0IGltcGVkZSBhIGN5Y2xpc3QncyB0b3VyLiBXaGVuIGEgY3ljbGlzdFxuLy8gc2VlcyBhbiBhbGVydCBvbiB0aGUgbWFwLCB0aGUga25vdyB0byBwbGFuIGFyb3VuZCBpdC5cblxuLyplc2ZtdC1pZ25vcmUtc3RhcnQqL1xuZXhwb3J0IGNvbnN0IGFsZXJ0VHlwZXMgPSB7XG4gICdyb2FkX2Nsb3N1cmUnOiAgICAgIHsgZGlzcGxheTogJ1JvYWQgQ2xvc3VyZScgfSxcbiAgJ2ZvcmVzdF9maXJlJzogICAgICAgeyBkaXNwbGF5OiAnRm9yZXN0IGZpcmUnIH0sXG4gICdmbG9vZGluZyc6ICAgICAgICAgIHsgZGlzcGxheTogJ0Zsb29kaW5nJyB9LFxuICAnZGV0b3VyJzogICAgICAgICAgICB7IGRpc3BsYXk6ICdEZXRvdXInIH0sXG4gICdvdGhlcic6ICAgICAgICAgICAgIHsgZGlzcGxheTogJ090aGVyJyB9XG59O1xuLyplc2ZtdC1pZ25vcmUtZW5kKi9cblxuZXhwb3J0IGNvbnN0IEFsZXJ0ID0gUG9pbnQuZXh0ZW5kKCB7XG4gIHNwZWNpZnk6IGZ1bmN0aW9uKCBuYW1lLCBsb2NhdGlvbiApIHtcbiAgICBQb2ludC5wcm90b3R5cGUuc3BlY2lmeS5jYWxsKCB0aGlzLCAnYWxlcnQnLCBuYW1lLCBsb2NhdGlvbiApO1xuICB9LFxuXG4gIHNjaGVtYTogbWVyZ2VTY2hlbWFzKCBQb2ludC5wcm90b3R5cGUuc2NoZW1hLCB7XG4gICAgcHJvcGVydGllczoge1xuICAgICAgdHlwZToge1xuICAgICAgICBlbnVtOiBrZXlzKCBhbGVydFR5cGVzIClcbiAgICAgIH1cbiAgICB9XG4gIH0gKVxufSApO1xuXG5taXhpblZhbGlkYXRpb24oIEFsZXJ0ICk7XG5cbi8vICMgUG9pbnQgQ29sbGVjdGlvblxuLy8gQSBoZXRlcm9nZW5lb3VzIGNvbGxlY3Rpb24gb2Ygc2VydmljZXMgYW5kIGFsZXJ0cy4gUG91Y2hEQiBpcyBhYmxlIHRvIGZldGNoXG4vLyB0aGlzIGNvbGxlY3Rpb24gYnkgbG9va2luZyBmb3IgYWxsIGtleXMgc3RhcnRpbmcgd2l0aCAncG9pbnQvJy5cbi8vXG4vLyBUaGlzIGFsc28gaGFzIHRoZSBlZmZlY3Qgb2YgZmV0Y2hpbmcgY29tbWVudHMgZm9yIHBvaW50cy4gVE9ETzogaGFuZGxlXG4vLyBgQ29tbWVudGAgaW4gdGhlIG1vZGVsIGZ1bmN0aW9uLlxuLy9cbi8vIEEgY29ubmVjdGVkIFBvaW50Q29sbGVjdGlvbiBtdXN0IGJlIGFibGUgdG8gZ2VuZXJhdGUgY29ubmVjdGVkIEFsZXJ0cyBvclxuLy8gU2VydmljZXMgb24gZGVtYW5kcy4gVGhlcmVmb3JlLCBpZiBQb2ludENvbGxlY3Rpb24gaXMgY29ubmVjdGVkLCBjb25uZWN0XG4vLyBtb2RlbHMgYmVmb3JlIHJldHVybmluZyB0aGVtLlxuZXhwb3J0IGNvbnN0IFBvaW50Q29sbGVjdGlvbiA9IENvdWNoQ29sbGVjdGlvbi5leHRlbmQoIHtcbiAgaW5pdGlhbGl6ZTogZnVuY3Rpb24oIG1vZGVscywgb3B0aW9ucyApIHtcbiAgICBDb3VjaENvbGxlY3Rpb24ucHJvdG90eXBlLmluaXRpYWxpemUuYXBwbHkoIHRoaXMsIGFyZ3VtZW50cyApO1xuICAgIHRoaXMucG91Y2ggPSB7XG4gICAgICBvcHRpb25zOiB7XG4gICAgICAgIGFsbERvY3M6IHsgaW5jbHVkZV9kb2NzOiB0cnVlLCAuLi5rZXlzQmV0d2VlbiggJ3BvaW50LycgKSB9XG4gICAgICB9XG4gICAgfTtcblxuICAgIGNvbnN0IHtjb25uZWN0LCBkYXRhYmFzZX0gPSB0aGlzO1xuICAgIHRoaXMuc2VydmljZSA9IGNvbm5lY3QgPyBjb25uZWN0KCBkYXRhYmFzZSwgU2VydmljZSApIDogU2VydmljZTtcbiAgICB0aGlzLmFsZXJ0ID0gY29ubmVjdCA/IGNvbm5lY3QoIGRhdGFiYXNlLCBBbGVydCApIDogQWxlcnQ7XG4gIH0sXG5cbiAgbW9kZWw6IGZ1bmN0aW9uKCBhdHRyaWJ1dGVzLCBvcHRpb25zICkge1xuICAgIGNvbnN0IHBhcnRzID0gcG9pbnRJZCggYXR0cmlidXRlcy5faWQgKTtcbiAgICBjb25zdCBtYXAgPSB7XG4gICAgICAnc2VydmljZSc6IG9wdGlvbnMuY29sbGVjdGlvbi5zZXJ2aWNlLFxuICAgICAgJ2FsZXJ0Jzogb3B0aW9ucy5jb2xsZWN0aW9uLmFsZXJ0XG4gICAgfTtcbiAgICBjb25zdCBjb25zdHJ1Y3RvciA9IG1hcFsgcGFydHMudHlwZSBdO1xuICAgIGlmICggY29uc3RydWN0b3IgKSB7XG4gICAgICByZXR1cm4gbmV3IGNvbnN0cnVjdG9yKCBhdHRyaWJ1dGVzLCBvcHRpb25zICk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93ICdBIHBvaW50IG11c3QgYmUgZWl0aGVyIGEgc2VydmljZSBvciBhbGVydCc7XG4gICAgfVxuICB9LFxuXG4gIHN0b3JlOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gZnJvbVBhaXJzKCB0aGlzLm1vZGVscywgcG9pbnQgPT4gWyBwb2ludC5pZCwgcG9pbnQuc3RvcmUoKSBdICk7XG4gIH1cbn0gKTtcblxuLy8gIyBEaXNwbGF5IE5hbWUgZm9yIFR5cGVcbi8vIEdpdmVuIGEgdHlwZSBrZXkgZnJvbSBlaXRoZXIgdGhlIHNlcnZpY2Ugb3IgYWxlcnQgdHlwZSBlbnVtZXJhdGlvbnMsXG4vLyByZXR1cm4gdGhlIHR5cGUncyBkaXNwbGF5IHN0cmluZywgb3IgbnVsbCBpZiBpdCBkb2VzIG5vdCBleGlzdC5cbmV4cG9ydCBmdW5jdGlvbiBkaXNwbGF5KCB0eXBlICkge1xuICBjb25zdCB2YWx1ZXMgPSBzZXJ2aWNlVHlwZXNbIHR5cGUgXSB8fCBhbGVydFR5cGVzWyB0eXBlIF07XG4gIGlmICggdmFsdWVzICkge1xuICAgIHJldHVybiB2YWx1ZXMuZGlzcGxheTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxufVxuXG4vLyAjIENvbW1lbnQgTW9kZWxcbi8vIEluZm9ybWF0aW9uIGFib3V0IGFsZXJ0cyBhbmQgc2VydmljZXMgZW5jb3VudGVyZWQgYnkgY3ljbGlzdHMgaXMgbGlrZWx5XG4vLyB0byBjaGFuZ2Ugd2l0aCB0aGUgc2Vhc29ucyBvciBvdGhlciByZWFzb25zLiBDeWNsaXN0cyBwbGFubmluZyB0aGUgbmV4dCBsZWdcbi8vIG9mIGEgdG91ciBzaG91bGQgYmUgYWJsZSB0byByZWFkIHRoZSBleHBlcmllbmNlcyBvZiBjeWNsaXN0cyBhaGVhZCBvZiB0aGVtLlxuLy9cbi8vIEEgY29tbWVudCBtdXN0IGhhdmUgYm90aCBhIHJhdGluZyBhbmQgdGhlIHRleHQgb2YgdGhlIGNvbW1lbnQuIENvbW1lbnRzIGFyZVxuLy8gbGltaXRlZCB0byAxNDAgY2hhcmFjdGVycyB0byBlbnN1cmUgdGhleSBkbyBub3QgZGV2b2x2ZSBpbnRvIGdlbmVyYWwgYWxlcnRcbi8vIG9yIHNlcnZpY2UgaW5mb3JtYXRpb24gdGhhdCBzaG91bGQgcmVhbGx5IGJlIGluIHRoZSBkZXNjcmlwdGlvbi4gV2UgcmVhbGx5XG4vLyB3YW50IHVzZXJzIG9mIHRoZSBCaWN5Y2xlIFRvdXJpbmcgQ29tcGFuaW9uIHRvIHByb3ZpZGUgY29tbWVudHMgdmVyaWZ5aW5nXG4vLyBpbmZvIGFib3V0IHBvaW50cywgb3IgbGV0dGluZyBvdGhlciBjeWNsaXN0cyBrbm93IGFib3V0IGNoYW5nZXMgaW4gdGhlXG4vLyBzZXJ2aWNlIG9yIGFsZXJ0LlxuXG4vLyAjIyBDb21tZW50IE1vZGVsIFVyaVxuLy8gQ29tbWVudHMgYXJlIHN0b3JlZCBpbiBDb3VjaERCIGluIHRoZSBzYW1lIGRhdGFiYXNlIGFzIHBvaW50cy4gVGhlIGNvbW1lbnRcbi8vIG1vZGVsIHVyaSBpcyBjb21wb3NlZCBvZiB0aHJlZSBwYXJ0czpcbi8vICAxLiBUaGUgZW50aXJlIGlkIG9mIHRoZSByZWxhdGVkIHBvaW50XG4vLyAgMi4gVGhlIHN0cmluZyAnY29tbWVudC8nXG4vLyAgMy4gQSB0aW1lIGJhc2VkIFVVSUQgdG8gdW5pcXVlbHkgaWRlbnRpZnkgY29tbWVudHNcbi8vXG4vLyBXZSBkb24ndCB1c2UgYGRvY3VyaWAgZm9yIHRoZSBjb21tZW50IG1vZGVsIHVyaXMgYmVjYXVzZSB3ZSBkb24ndCBoYXZlIHRvXG4vLyBwYXJzZSB0aGVtLlxuXG5jb25zdCBDT01NRU5UX01BWF9MRU5HVEggPSAxNDA7XG5leHBvcnQgY29uc3QgQ29tbWVudCA9IENvdWNoTW9kZWwuZXh0ZW5kKCB7XG4gIGlkQXR0cmlidXRlOiAnX2lkJyxcblxuICAvLyAjIyBDb25zdHJ1Y3RvclxuICAvLyBHZW5lcmF0ZSBgX2lkYC4gYHBvaW50SWRgIG11c3QgYmUgc3BlY2lmaWVkIGluIG9wdGlvbnMuXG4gIGNvbnN0cnVjdG9yOiBmdW5jdGlvbiggYXR0cmlidXRlcywgb3B0aW9ucyApIHtcbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgICBpZiAoICFhdHRyaWJ1dGVzLnV1aWQgKSB7XG4gICAgICBhdHRyaWJ1dGVzLnV1aWQgPSB1dWlkLnYxKCk7XG4gICAgfVxuICAgIGlmICggIWF0dHJpYnV0ZXMuX2lkICYmIG9wdGlvbnMucG9pbnRJZCApIHtcbiAgICAgIGF0dHJpYnV0ZXMuX2lkID0gb3B0aW9ucy5wb2ludElkICsgJy9jb21tZW50LycgKyBhdHRyaWJ1dGVzLnV1aWQ7XG4gICAgfVxuICAgIENvdWNoTW9kZWwuYXBwbHkoIHRoaXMsIGFyZ3VtZW50cyApO1xuICB9LFxuXG4gIHNjaGVtYToge1xuICAgIHR5cGU6ICdvYmplY3QnLFxuICAgIGFkZGl0aW9uYWxQcm9wZXJ0aWVzOiBmYWxzZSxcbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICB1c2VybmFtZToge1xuICAgICAgICAndHlwZSc6ICdzdHJpbmcnXG4gICAgICB9LFxuICAgICAgdGV4dDoge1xuICAgICAgICAndHlwZSc6ICdzdHJpbmcnLFxuICAgICAgICAnbWF4TGVuZ3RoJzogQ09NTUVOVF9NQVhfTEVOR1RIXG4gICAgICB9LFxuICAgICAgcmF0aW5nOiB7XG4gICAgICAgIHR5cGU6ICdpbnRlZ2VyJyxcbiAgICAgICAgbWluaW11bTogMSxcbiAgICAgICAgbWF4aW11bTogNVxuICAgICAgfSxcbiAgICAgIHV1aWQ6IHtcbiAgICAgICAgdHlwZTogJ3N0cmluZydcbiAgICAgIH1cbiAgICB9LFxuICAgIHJlcXVpcmVkOiBbXG4gICAgICAndXNlcm5hbWUnLFxuICAgICAgJ3RleHQnLFxuICAgICAgJ3JhdGluZycsXG4gICAgICAndXVpZCdcbiAgICBdXG4gIH1cbn0sIHtcbiAgTUFYX0xFTkdUSDogQ09NTUVOVF9NQVhfTEVOR1RIXG59ICk7XG5cbm1peGluVmFsaWRhdGlvbiggQ29tbWVudCApO1xuXG4vLyAjIENvbW1lbnQgQ29sbGVjdGlvblxuLy8gRmV0Y2ggb25seSBjb21tZW50cyBhc3NvY2lhdGVkIHdpdGggYSBnaXZlbiBwb2ludC5cbmV4cG9ydCBjb25zdCBDb21tZW50Q29sbGVjdGlvbiA9IENvdWNoQ29sbGVjdGlvbi5leHRlbmQoIHtcbiAgaW5pdGlhbGl6ZTogZnVuY3Rpb24oIG1vZGVscywgb3B0aW9ucyApIHtcbiAgICBDb3VjaENvbGxlY3Rpb24ucHJvdG90eXBlLmluaXRpYWxpemUuYXBwbHkoIHRoaXMsIGFyZ3VtZW50cyApO1xuICAgIGNvbnN0IHBvaW50SWQgPSB0aGlzLnBvaW50SWQgPSBvcHRpb25zLnBvaW50SWQ7XG5cbiAgICBjb25zdCBjb25uZWN0ID0gdGhpcy5jb25uZWN0O1xuICAgIGNvbnN0IGRhdGFiYXNlID0gdGhpcy5kYXRhYmFzZTtcbiAgICB0aGlzLmNvbW1lbnQgPSBjb25uZWN0ID8gY29ubmVjdCggZGF0YWJhc2UsIENvbW1lbnQgKSA6IENvbW1lbnQ7XG5cbiAgICB0aGlzLnBvdWNoID0ge1xuICAgICAgb3B0aW9uczoge1xuICAgICAgICBhbGxEb2NzOiB7XG4gICAgICAgICAgLi4ua2V5c0JldHdlZW4oIHBvaW50SWQgKyAnL2NvbW1lbnQnICksXG4gICAgICAgICAgaW5jbHVkZV9kb2NzOiB0cnVlXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuICB9LFxuXG4gIG1vZGVsOiBmdW5jdGlvbiggYXR0cmlidXRlcywgb3B0aW9ucyApIHtcbiAgICBjb25zdCB7Y29tbWVudCwgcG9pbnRJZH0gPSBvcHRpb25zLmNvbGxlY3Rpb247XG4gICAgcmV0dXJuIG5ldyBjb21tZW50KCBhdHRyaWJ1dGVzLCB7IHBvaW50SWQsIC4uLm9wdGlvbnMgfSApO1xuICB9XG59ICk7XG4iXX0=