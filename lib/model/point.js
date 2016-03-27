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

  // ## Safeguard for Points
  // Points have image attachments, so we should let backbone pouch handle
  // those and we should not validate the _attachments key
  safeguard: ['_attachments'],

  defaults: function defaults() {
    return {
      flag: false
    };
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
        type: 'boolean'
      }
    },
    required: ['name', 'location', 'type', 'created_at', 'flag']
  },

  clear: function clear() {
    _base.CouchModel.prototype.clear.apply(this, arguments);
    this.coverUrl = false;
  },

  // ## Fetch
  // When fetching a point, should it have a cover attachment, extend the
  // promise to fetch the attachment and set `this.coverUrl`.
  fetch: function fetch() {
    var _this = this;

    return _base.CouchModel.prototype.fetch.apply(this, arguments).then(function (res) {
      return _this.getCover(res);
    });
  },

  // # Get Cover
  // Should a point (already fetched) have a cover attachment, get the
  // attachment's data and store an object url for it in `this.coverUrl`
  //
  // As a utility to client functions, resolve the returned promise to the
  // single argument passed to `getCover`.
  getCover: function getCover(ret) {
    var _this2 = this;

    return Promise.resolve().then(function () {
      var hasCover = (0, _lodash.includes)(_this2.attachments(), 'cover.png');
      if (browser && hasCover) {
        return _this2.attachment('cover.png');
      } else {
        return;
      }
    }).then(function (blob) {
      if (blob) {
        _this2.coverUrl = (0, _blobUtil.createObjectURL)(blob);
      }
    }).then(function () {
      return ret;
    });
  },

  // ## Set Cover
  // If the user already has a cover blob and they want to use it with the
  // model before attach() can finish storing it to PouchDB, they can use
  // this method to manually insert it.
  //
  // The associated object url for the blob will then be available to other
  // functions like store().
  setCover: function setCover(blob) {
    if (browser) {
      this.coverUrl = (0, _blobUtil.createObjectURL)(blob);
    }
  },

  // ## Get Redux Representation
  // Return a nested object/arary representation of the model suitable for
  // use with redux.
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

  defaults: function defaults() {
    return _extends({}, Point.prototype.defaults.apply(this, arguments), {
      amenities: [],
      schedule: { 'default': [] },
      seasonal: false
    });
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
        type: 'object'
      },
      seasonal: {
        type: 'boolean'
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

  // ## Fetch Cover Images for all Points
  // Returns a promise that resolves when all points in the array have
  // their cover images available.
  getCovers: function getCovers() {
    return Promise.all(this.models.map(function (point) {
      return point.getCover();
    }));
  },

  // ## Get Redux Representation
  // Return a nested object/arary representation of the collection suitable for
  // use with redux.
  store: function store() {
    return (0, _lodash.fromPairs)(this.models.map(function (point) {
      return [point.id, point.store()];
    }));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tb2RlbC9wb2ludC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O1FBb1lnQixPQUFPLEdBQVAsT0FBTzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXRXdkIsSUFBTSxPQUFPLEdBQUssT0FBTyxNQUFNLEtBQUssV0FBVyxBQUFFOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQyxBQWtCbEQsSUFBTSxPQUFPLEdBQUcsaUJBQU8sS0FBSyxDQUFFLDRCQUE0QixDQUFFLENBQUM7O0FBRXRELElBQU0sS0FBSyxXQUFMLEtBQUssR0FBRyxpQkFBVyxNQUFNLENBQUU7QUFDdEMsYUFBVyxFQUFFLEtBQUs7O0FBRWxCLFlBQVUsRUFBRSxvQkFBVSxVQUFVLEVBQUUsT0FBTyxFQUFHO0FBQzFDLHFCQUFXLFNBQVMsQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFFLElBQUksRUFBRSxTQUFTLENBQUUsQ0FBQztBQUN6RCxRQUFJLENBQUMsR0FBRyxDQUFFLFlBQVksRUFBRSxJQUFJLElBQUksRUFBRSxDQUFDLFdBQVcsRUFBRSxDQUFFLENBQUM7QUFDbkQsUUFBSSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUM7R0FDdkI7Ozs7O0FBS0QsU0FBTyxFQUFFLGlCQUFVLElBQUksRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFHO0FBQ3hDLFFBQUssSUFBSSxFQUFHO3FDQUNTLFFBQVE7O1VBQXBCLEdBQUc7VUFBRSxHQUFHOztBQUNmLFVBQU0sR0FBRyxHQUFHLE9BQU8sQ0FBRTtBQUNuQixZQUFJLEVBQUUsSUFBSTtBQUNWLFlBQUksRUFBRSxvQkFBVyxJQUFJLENBQUU7QUFDdkIsZUFBTyxFQUFFLG1CQUFTLE1BQU0sQ0FBRSxHQUFHLEVBQUUsR0FBRyxDQUFFO09BQ3JDLENBQUUsQ0FBQztBQUNKLFVBQUksQ0FBQyxHQUFHLENBQUUsRUFBRSxHQUFHLEVBQUgsR0FBRyxFQUFFLElBQUksRUFBSixJQUFJLEVB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LFlBQVUsRUFBRSxrQkFBa0I7Q0FDL0IsQ0FBRSxDQUFDOztBQUVKLHNDQUFpQixPQUFPLENBQUU7Ozs7QUFBQyxBQUlwQixJQUFNLGlCQUFpQixXQUFqQixpQkFBaUIsR0FBRyxzQkFBZ0IsTUFBTSxDQUFFO0FBQ3ZELFlBQVUsRUFBRSxvQkFBVSxNQUFNLEVBQUUsT0FBTyxFQUFHO0FBQ3RDLDBCQUFnQixTQUFTLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBRSxJQUFJLEVBQUUsU0FBUyxDQUFFLENBQUM7QUFDOUQsUUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDOztBQUUvQyxRQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDO0FBQzdCLFFBQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUM7QUFDL0IsUUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLEdBQUcsT0FBTyxDQUFFLFFBQVEsRUFBRSxPQUFPLENBQUUsR0FBRyxPQUFPLENBQUM7O0FBRWhFLFFBQUksQ0FBQyxLQUFLLEdBQUc7QUFDWCxhQUFPLEVBQUU7QUFDUCxlQUFPLGVBQ0YsdUJBQWEsT0FBTyxHQUFHLFVBQVUsQ0FBRTtBQUN0QyxzQkFBWSxFQUFFLElBQUk7VUFDbkI7T0FDRjtLQUNGLENBQUM7R0FDSDs7QUFFRCxPQUFLLEVBQUUsZUFBVSxVQUFVLEVBQUUsT0FBTyxFQUFHOzhCQUNWLE9BQU8sQ0FBQyxVQUFVO1FBQXRDLE9BQU8sdUJBQVAsT0FBTztRQUFFLE9BQU8sdUJBQVAsT0FBTzs7QUFDdkIsV0FBTyxJQUFJLE9BQU8sQ0FBRSxVQUFVLGFBQUksT0FBTyxFQUFQLE9BQU8sSUFBSyxPQUFPLEVBQUksQ0FBQztHQUMzRDtDQUNGLENBQUUsQ0FBQyIsImZpbGUiOiJwb2ludC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIGJ0Yy1hcHAtc2VydmVyIC0tIFNlcnZlciBmb3IgdGhlIEJpY3ljbGUgVG91cmluZyBDb21wYW5pb25cbiAqIENvcHlyaWdodCDCqSAyMDE2IEFkdmVudHVyZSBDeWNsaW5nIEFzc29jaWF0aW9uXG4gKlxuICogVGhpcyBmaWxlIGlzIHBhcnQgb2YgYnRjLWFwcC1zZXJ2ZXIuXG4gKlxuICogYnRjLWFwcC1zZXJ2ZXIgaXMgZnJlZSBzb2Z0d2FyZTogeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeVxuICogaXQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBBZmZlcm8gR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgYXMgcHVibGlzaGVkIGJ5XG4gKiB0aGUgRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uLCBlaXRoZXIgdmVyc2lvbiAzIG9mIHRoZSBMaWNlbnNlLCBvclxuICogKGF0IHlvdXIgb3B0aW9uKSBhbnkgbGF0ZXIgdmVyc2lvbi5cbiAqXG4gKiBidGMtYXBwLXNlcnZlciBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLFxuICogYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2ZcbiAqIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gIFNlZSB0aGVcbiAqIEFmZmVybyBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZSBkZXRhaWxzLlxuICpcbiAqIFlvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEFmZmVybyBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuICogYWxvbmcgd2l0aCBGb29iYXIuICBJZiBub3QsIHNlZSA8aHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG4gKi9cblxuaW1wb3J0IHsgbWl4aW5WYWxpZGF0aW9uLCBtZXJnZVNjaGVtYXMgfSBmcm9tICcuL3ZhbGlkYXRpb24tbWl4aW4nO1xuaW1wb3J0IHsgQ291Y2hNb2RlbCwgQ291Y2hDb2xsZWN0aW9uLCBrZXlzQmV0d2VlbiB9IGZyb20gJy4vYmFzZSc7XG5cbmltcG9ydCB7IGtleXMsIGZyb21QYWlycywgaW5jbHVkZXMgfSBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IHsgY3JlYXRlT2JqZWN0VVJMIH0gZnJvbSAnYmxvYi11dGlsJztcblxuaW1wb3J0IGRvY3VyaSBmcm9tICdkb2N1cmknO1xuaW1wb3J0IG5nZW9oYXNoIGZyb20gJ25nZW9oYXNoJztcbmltcG9ydCBub3JtYWxpemUgZnJvbSAndG8taWQnO1xuaW1wb3J0IHV1aWQgZnJvbSAnbm9kZS11dWlkJztcblxuY29uc3QgYnJvd3NlciA9ICggdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgKTtcblxuLy8gIyBQb2ludCBNb2RlbFxuLy8gVGhlIHBvaW50IHJlcHJlc2VudHMgYSBsb2NhdGlvbiBvbiB0aGUgbWFwIHdpdGggYXNzb2NpYXRlZCBtZXRhZGF0YSwgZ2VvZGF0YSxcbi8vIGFuZCB1c2VyIHByb3ZpZGVkIGRhdGEuIFRoZSBwb2ludCBpcyB0aGUgYmFzZSBzaGFyZWQgYnkgc2VydmljZXMgYW5kIGFsZXJ0cy5cbi8vXG4vLyBUaGUgSlNPTiBzY2hlbWEgc3RvcmVkIGluIGBQb2ludGAsIGFuZCBhcyBwYXRjaGVkIGJ5IGBTZXJ2aWNlYCBhbmQgYEFsZXJ0YCxcbi8vIGlzIHRoZSBhdXRob3JpdGF0aXZlIGRlZmluaXRpb24gb2YgdGhlIHBvaW50IHJlY29yZC5cblxuLy8gIyMgUG9pbnQgTW9kZWwgVXJpXG4vLyBQb2ludHMgYXJlIHN0b3JlZCBpbiBDb3VjaERCLiBDb3VjaERCIGRvY3VtZW50cyBjYW4gaGF2ZSByaWNoIGlkIHN0cmluZ3Ncbi8vIHRvIGhlbHAgc3RvcmUgYW5kIGFjY2VzcyBkYXRhIHdpdGhvdXQgTWFwUmVkdWNlIGpvYnMuXG4vL1xuLy8gVGhlIHBvaW50IG1vZGVsIHVyaSBpcyBjb21wb3NlZCBvZiBmb3VyIHBhcnRzOlxuLy8gIDEuIFRoZSBzdHJpbmcgJ3BvaW50LydgXG4vLyAgMi4gVGhlIHR5cGUgb2YgcG9pbnQsIGVpdGhlciAnc2VydmljZScgb3IgJ2FsZXJ0J1xuLy8gIDMuIFRoZSBub3JtYWxpemVkIG5hbWUgb2YgdGhlIHBvaW50XG4vLyAgNC4gVGhlIHBvaW50J3MgZ2VvaGFzaFxuY29uc3QgcG9pbnRJZCA9IGRvY3VyaS5yb3V0ZSggJ3BvaW50Lzp0eXBlLzpuYW1lLzpnZW9oYXNoJyApO1xuXG5leHBvcnQgY29uc3QgUG9pbnQgPSBDb3VjaE1vZGVsLmV4dGVuZCgge1xuICBpZEF0dHJpYnV0ZTogJ19pZCcsXG5cbiAgaW5pdGlhbGl6ZTogZnVuY3Rpb24oIGF0dHJpYnV0ZXMsIG9wdGlvbnMgKSB7XG4gICAgQ291Y2hNb2RlbC5wcm90b3R5cGUuaW5pdGlhbGl6ZS5hcHBseSggdGhpcywgYXJndW1lbnRzICk7XG4gICAgdGhpcy5zZXQoICdjcmVhdGVkX2F0JywgbmV3IERhdGUoKS50b0lTT1N0cmluZygpICk7XG4gICAgdGhpcy5jb3ZlclVybCA9IGZhbHNlO1xuICB9LFxuXG4gIC8vICMjIFNwZWNpZnlcbiAgLy8gRmlsbCBpbiBgX2lkYCBmcm9tIHRoZSBjb21wb25lbnRzIG9mIHRoZSBwb2ludCBtb2RlbCB1cmkuXG4gIC8vIFB1bGwgdmFsdWVzIGZyb20gYGF0dHJpYnV0ZXNgIGlmIG5hbWUgYW5kIGxvY2F0aW9uIGFyZSB1bmRlZmluZWQuXG4gIHNwZWNpZnk6IGZ1bmN0aW9uKCB0eXBlLCBuYW1lLCBsb2NhdGlvbiApIHtcbiAgICBpZiAoIG5hbWUgKSB7XG4gICAgICBjb25zdCBbbGF0LCBsbmddID0gbG9jYXRpb247XG4gICAgICBjb25zdCBfaWQgPSBwb2ludElkKCB7XG4gICAgICAgIHR5cGU6IHR5cGUsXG4gICAgICAgIG5hbWU6IG5vcm1hbGl6ZSggbmFtZSApLFxuICAgICAgICBnZW9oYXNoOiBuZ2VvaGFzaC5lbmNvZGUoIGxhdCwgbG5nIClcbiAgICAgIH0gKTtcbiAgICAgIHRoaXMuc2V0KCB7IF9pZCwgdHlwZSwgbmFtZSwgbG9jYXRpb24gfSApO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCB7bmFtZSwgbG9jYXRpb259ID0gdGhpcy5hdHRyaWJ1dGVzO1xuICAgICAgY29uc3QgW2xhdCwgbG5nXSA9IGxvY2F0aW9uO1xuICAgICAgY29uc3QgX2lkID0gcG9pbnRJZCgge1xuICAgICAgICB0eXBlOiB0eXBlLFxuICAgICAgICBuYW1lOiBub3JtYWxpemUoIG5hbWUgKSxcbiAgICAgICAgZ2VvaGFzaDogbmdlb2hhc2guZW5jb2RlKCBsYXQsIGxuZyApXG4gICAgICB9ICk7XG4gICAgICB0aGlzLnNldCggeyBfaWQgfSApO1xuICAgIH1cbiAgfSxcblxuICAvLyAjIyBTYWZlZ3VhcmQgZm9yIFBvaW50c1xuICAvLyBQb2ludHMgaGF2ZSBpbWFnZSBhdHRhY2htZW50cywgc28gd2Ugc2hvdWxkIGxldCBiYWNrYm9uZSBwb3VjaCBoYW5kbGVcbiAgLy8gdGhvc2UgYW5kIHdlIHNob3VsZCBub3QgdmFsaWRhdGUgdGhlIF9hdHRhY2htZW50cyBrZXlcbiAgc2FmZWd1YXJkOiBbXG4gICAgJ19hdHRhY2htZW50cydcbiAgXSxcblxuICBkZWZhdWx0czogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGZsYWc6IGZhbHNlXG4gICAgfTtcbiAgfSxcblxuICBzY2hlbWE6IHtcbiAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICBhZGRpdGlvbmFsUHJvcGVydGllczogZmFsc2UsXG4gICAgcHJvcGVydGllczoge1xuICAgICAgbmFtZToge1xuICAgICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgICAgfSxcbiAgICAgIGxvY2F0aW9uOiB7XG4gICAgICAgIHR5cGU6ICdhcnJheScsXG4gICAgICAgIG1pbkl0ZW1zOiAyLFxuICAgICAgICBtYXhJdGVtczogMixcbiAgICAgICAgaXRlbXM6IHtcbiAgICAgICAgICB0eXBlOiAnbnVtYmVyJ1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgdHlwZToge1xuICAgICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgICAgfSxcbiAgICAgIGNyZWF0ZWRfYXQ6IHtcbiAgICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICAgIGZvcm1hdDogJ2RhdGUtdGltZSdcbiAgICAgIH0sXG4gICAgICBkZXNjcmlwdGlvbjoge1xuICAgICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgICAgfSxcbiAgICAgIGZsYWc6IHtcbiAgICAgICAgdHlwZTogJ2Jvb2xlYW4nXG4gICAgICB9XG4gICAgfSxcbiAgICByZXF1aXJlZDogW1xuICAgICAgJ25hbWUnLFxuICAgICAgJ2xvY2F0aW9uJyxcbiAgICAgICd0eXBlJyxcbiAgICAgICdjcmVhdGVkX2F0JyxcbiAgICAgICdmbGFnJ1xuICAgIF1cbiAgfSxcblxuICBjbGVhcjogZnVuY3Rpb24oKSB7XG4gICAgQ291Y2hNb2RlbC5wcm90b3R5cGUuY2xlYXIuYXBwbHkoIHRoaXMsIGFyZ3VtZW50cyApO1xuICAgIHRoaXMuY292ZXJVcmwgPSBmYWxzZTtcbiAgfSxcblxuICAvLyAjIyBGZXRjaFxuICAvLyBXaGVuIGZldGNoaW5nIGEgcG9pbnQsIHNob3VsZCBpdCBoYXZlIGEgY292ZXIgYXR0YWNobWVudCwgZXh0ZW5kIHRoZVxuICAvLyBwcm9taXNlIHRvIGZldGNoIHRoZSBhdHRhY2htZW50IGFuZCBzZXQgYHRoaXMuY292ZXJVcmxgLlxuICBmZXRjaDogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIENvdWNoTW9kZWwucHJvdG90eXBlLmZldGNoLmFwcGx5KCB0aGlzLCBhcmd1bWVudHMgKS50aGVuKCByZXMgPT4ge1xuICAgICAgcmV0dXJuIHRoaXMuZ2V0Q292ZXIoIHJlcyApO1xuICAgIH0gKTtcbiAgfSxcblxuICAvLyAjIEdldCBDb3ZlclxuICAvLyBTaG91bGQgYSBwb2ludCAoYWxyZWFkeSBmZXRjaGVkKSBoYXZlIGEgY292ZXIgYXR0YWNobWVudCwgZ2V0IHRoZVxuICAvLyBhdHRhY2htZW50J3MgZGF0YSBhbmQgc3RvcmUgYW4gb2JqZWN0IHVybCBmb3IgaXQgaW4gYHRoaXMuY292ZXJVcmxgXG4gIC8vXG4gIC8vIEFzIGEgdXRpbGl0eSB0byBjbGllbnQgZnVuY3Rpb25zLCByZXNvbHZlIHRoZSByZXR1cm5lZCBwcm9taXNlIHRvIHRoZVxuICAvLyBzaW5nbGUgYXJndW1lbnQgcGFzc2VkIHRvIGBnZXRDb3ZlcmAuXG4gIGdldENvdmVyOiBmdW5jdGlvbiggcmV0ICkge1xuICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKS50aGVuKCAoICkgPT4ge1xuICAgICAgY29uc3QgaGFzQ292ZXIgPSBpbmNsdWRlcyggdGhpcy5hdHRhY2htZW50cygpLCAnY292ZXIucG5nJyApO1xuICAgICAgaWYgKCBicm93c2VyICYmIGhhc0NvdmVyICkge1xuICAgICAgICByZXR1cm4gdGhpcy5hdHRhY2htZW50KCAnY292ZXIucG5nJyApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgIH0gKS50aGVuKCBibG9iID0+IHtcbiAgICAgIGlmICggYmxvYiApIHtcbiAgICAgICAgdGhpcy5jb3ZlclVybCA9IGNyZWF0ZU9iamVjdFVSTCggYmxvYiApO1xuICAgICAgfVxuICAgIH0gKS50aGVuKCAoICkgPT4ge1xuICAgICAgcmV0dXJuIHJldDtcbiAgICB9ICk7XG4gIH0sXG5cbiAgLy8gIyMgU2V0IENvdmVyXG4gIC8vIElmIHRoZSB1c2VyIGFscmVhZHkgaGFzIGEgY292ZXIgYmxvYiBhbmQgdGhleSB3YW50IHRvIHVzZSBpdCB3aXRoIHRoZVxuICAvLyBtb2RlbCBiZWZvcmUgYXR0YWNoKCkgY2FuIGZpbmlzaCBzdG9yaW5nIGl0IHRvIFBvdWNoREIsIHRoZXkgY2FuIHVzZVxuICAvLyB0aGlzIG1ldGhvZCB0byBtYW51YWxseSBpbnNlcnQgaXQuXG4gIC8vXG4gIC8vIFRoZSBhc3NvY2lhdGVkIG9iamVjdCB1cmwgZm9yIHRoZSBibG9iIHdpbGwgdGhlbiBiZSBhdmFpbGFibGUgdG8gb3RoZXJcbiAgLy8gZnVuY3Rpb25zIGxpa2Ugc3RvcmUoKS5cbiAgc2V0Q292ZXI6IGZ1bmN0aW9uKCBibG9iICkge1xuICAgIGlmICggYnJvd3NlciApIHtcbiAgICAgIHRoaXMuY292ZXJVcmwgPSBjcmVhdGVPYmplY3RVUkwoIGJsb2IgKTtcbiAgICB9XG4gIH0sXG5cbiAgLy8gIyMgR2V0IFJlZHV4IFJlcHJlc2VudGF0aW9uXG4gIC8vIFJldHVybiBhIG5lc3RlZCBvYmplY3QvYXJhcnkgcmVwcmVzZW50YXRpb24gb2YgdGhlIG1vZGVsIHN1aXRhYmxlIGZvclxuICAvLyB1c2Ugd2l0aCByZWR1eC5cbiAgc3RvcmU6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB7IC4uLnRoaXMudG9KU09OKCksIGNvdmVyVXJsOiB0aGlzLmNvdmVyVXJsIH07XG4gIH1cbn0sIHtcbiAgdXJpOiBwb2ludElkLFxuXG4gIGZvcjogaWQgPT4ge1xuICAgIGNvbnN0IHt0eXBlfSA9IHBvaW50SWQoIGlkICk7XG4gICAgaWYgKCB0eXBlID09PSAnc2VydmljZScgKSB7XG4gICAgICByZXR1cm4gbmV3IFNlcnZpY2UoIHsgX2lkOiBpZCB9ICk7XG4gICAgfSBlbHNlIGlmICggdHlwZSA9PT0gJ2FsZXJ0JyApIHtcbiAgICAgIHJldHVybiBuZXcgQWxlcnQoIHsgX2lkOiBpZCB9ICk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93ICdBIHBvaW50IG11c3QgZWl0aGVyIGJlIGEgc2VydmljZSBvciBhbGVydCc7XG4gICAgfVxuICB9XG59ICk7XG5cbi8vICMgU2VydmljZSBNb2RlbFxuLy8gQSBzZXJ2aWNlIGlzIGEgYnVpc25lc3Mgb3IgcG9pbnQgb2YgaW50ZXJlc3QgdG8gYSBjeWNsaXN0LiBBIGN5Y2xpc3QgbmVlZHNcbi8vIHRvIGtub3cgd2hlcmUgdGhleSB3YW50IHRvIHN0b3Agd2VsbCBpbiBhZHZhbmNlIG9mIHRoZWlyIHRyYXZlbCB0aHJvdWdoIGFuXG4vLyBhcmVhLiBUaGUgc2VydmljZSByZWNvcmQgbXVzdCBjb250YWluIGVub3VnaCBpbmZvcm1hdGlvbiB0byBoZWxwIHRoZSBjeWNsaXN0XG4vLyBtYWtlIHN1Y2ggZGVjaXNpb25zLlxuLy9cbi8vIFRoZSByZWNvcmQgaW5jbHVkZXMgY29udGFjdCBpbmZvcm1hdGlvbiwgYW5kIGEgc2NoZWR1bGUgb2YgaG91cnMgb2Zcbi8vIG9wZXJhdGlvbi4gSXQgaXMgaW1wb3J0YW50IHRoYXQgd2Ugc3RvcmUgdGhlIHRpbWUgem9uZSBvZiBhIHNlcnZpY2UsIHNpbmNlXG4vLyB0b3VyaW5nIGN5Y2xpc3RzIHdpbGwgY3Jvc3MgdGltZSB6b25lcyBvbiB0aGVpciB0cmF2ZWxzLiBGdXJ0aGVybW9yZSxcbi8vIHNlcnZpY2VzIG9mIGludGVyZXN0IHRvIHRvdXJpbmcgY3ljbGlzdHMgbWF5IGJlIHNlYXNvbmFsOiB3ZSBzdG9yZVxuLy8gc2NoZWR1bGVzIGZvciBkaWZmZXJlbnQgc2Vhc29ucy5cblxuLy8gIyMgU2VydmljZSBUeXBlc1xuLy8gQSBTZXJ2aWNlIG1heSBoYXZlIGEgc2luZ2xlIHR5cGUsIGluZGljYXRpbmcgdGhlIHByaW1hcnkgcHVycG9zZSBvZiB0aGVcbi8vIGJ1aXNuZXNzIG9yIHBvaW50IG9mIGludGVyZXN0LiBTZXJ2aWNlIHR5cGVzIG1heSBhbHNvIGJlIGluY2x1ZGVkIGluIGFcbi8vIFNlcnZpY2UncyBhbWVuaXRpZXMgYXJyYXkuXG4vKmVzZm10LWlnbm9yZS1zdGFydCovXG5leHBvcnQgY29uc3Qgc2VydmljZVR5cGVzID0ge1xuICAnYWlycG9ydCc6ICAgICAgICAgICB7IGRpc3BsYXk6ICdBaXJwb3J0JyB9LFxuICAnYmFyJzogICAgICAgICAgICAgICB7IGRpc3BsYXk6ICdCYXInIH0sXG4gICdiZWRfYW5kX2JyZWFrZmFzdCc6IHsgZGlzcGxheTogJ0JlZCAmIEJyZWFrZmFzdCcgfSxcbiAgJ2Jpa2Vfc2hvcCc6ICAgICAgICAgeyBkaXNwbGF5OiAnQmlrZSBTaG9wJyB9LFxuICAnY2FiaW4nOiAgICAgICAgICAgICB7IGRpc3BsYXk6ICdDYWJpbicgfSxcbiAgJ2NhbXBncm91bmQnOiAgICAgICAgeyBkaXNwbGF5OiAnQ2FtcGdyb3VuZCcgfSxcbiAgJ2NvbnZlbmllbmNlX3N0b3JlJzogeyBkaXNwbGF5OiAnQ29udmVuaWVuY2UgU3RvcmUnIH0sXG4gICdjeWNsaXN0c19jYW1waW5nJzogIHsgZGlzcGxheTogJ0N5Y2xpc3RzXFwnIENhbXBpbmcnIH0sXG4gICdjeWNsaXN0c19sb2RnaW5nJzogIHsgZGlzcGxheTogJ0N5Y2xpc3RzXFwnIExvZGdpbmcnIH0sXG4gICdncm9jZXJ5JzogICAgICAgICAgIHsgZGlzcGxheTogJ0dyb2NlcnknIH0sXG4gICdob3N0ZWwnOiAgICAgICAgICAgIHsgZGlzcGxheTogJ0hvc3RlbCcgfSxcbiAgJ2hvdF9zcHJpbmcnOiAgICAgICAgeyBkaXNwbGF5OiAnSG90IFNwcmluZycgfSxcbiAgJ2hvdGVsJzogICAgICAgICAgICAgeyBkaXNwbGF5OiAnSG90ZWwnIH0sXG4gICdtb3RlbCc6ICAgICAgICAgICAgIHsgZGlzcGxheTogJ01vdGVsJyB9LFxuICAnaW5mb3JtYXRpb24nOiAgICAgICB7IGRpc3BsYXk6ICdJbmZvcm1hdGlvbicgfSxcbiAgJ2xpYnJhcnknOiAgICAgICAgICAgeyBkaXNwbGF5OiAnTGlicmFyeScgfSxcbiAgJ211c2V1bSc6ICAgICAgICAgICAgeyBkaXNwbGF5OiAnTXVzZXVtJyB9LFxuICAnb3V0ZG9vcl9zdG9yZSc6ICAgICB7IGRpc3BsYXk6ICdPdXRkb29yIFN0b3JlJyB9LFxuICAncmVzdF9hcmVhJzogICAgICAgICB7IGRpc3BsYXk6ICdSZXN0IEFyZWEnIH0sXG4gICdyZXN0YXVyYW50JzogICAgICAgIHsgZGlzcGxheTogJ1Jlc3RhdXJhbnQnIH0sXG4gICdyZXN0cm9vbSc6ICAgICAgICAgIHsgZGlzcGxheTogJ1Jlc3Ryb29tJyB9LFxuICAnc2NlbmljX2FyZWEnOiAgICAgICB7IGRpc3BsYXk6ICdTY2VuaWMgQXJlYScgfSxcbiAgJ3N0YXRlX3BhcmsnOiAgICAgICAgeyBkaXNwbGF5OiAnU3RhdGUgUGFyaycgfSxcbiAgJ290aGVyJzogICAgICAgICAgICAgeyBkaXNwbGF5OiAnT3RoZXInIH1cbn07XG4vKmVzZm10LWlnbm9yZS1lbmQqL1xuXG5leHBvcnQgY29uc3QgU2VydmljZSA9IFBvaW50LmV4dGVuZCgge1xuICBzcGVjaWZ5OiBmdW5jdGlvbiggbmFtZSwgbG9jYXRpb24gKSB7XG4gICAgUG9pbnQucHJvdG90eXBlLnNwZWNpZnkuY2FsbCggdGhpcywgJ3NlcnZpY2UnLCBuYW1lLCBsb2NhdGlvbiApO1xuICB9LFxuXG4gIGRlZmF1bHRzOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4ge1xuICAgICAgLi4uUG9pbnQucHJvdG90eXBlLmRlZmF1bHRzLmFwcGx5KCB0aGlzLCBhcmd1bWVudHMgKSxcbiAgICAgIGFtZW5pdGllczogW10sXG4gICAgICBzY2hlZHVsZTogeyAnZGVmYXVsdCc6IFtdIH0sXG4gICAgICBzZWFzb25hbDogZmFsc2VcbiAgICB9O1xuICB9LFxuXG4gIHNjaGVtYTogbWVyZ2VTY2hlbWFzKCBQb2ludC5wcm90b3R5cGUuc2NoZW1hLCB7XG4gICAgcHJvcGVydGllczoge1xuICAgICAgdHlwZToge1xuICAgICAgICBlbnVtOiBrZXlzKCBzZXJ2aWNlVHlwZXMgKVxuICAgICAgfSxcbiAgICAgIGFtZW5pdGllczoge1xuICAgICAgICB0eXBlOiAnYXJyYXknLFxuICAgICAgICBpdGVtczoge1xuICAgICAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgICAgIGVudW06IGtleXMoIHNlcnZpY2VUeXBlcyApXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBhZGRyZXNzOiB7XG4gICAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgICB9LFxuICAgICAgc2NoZWR1bGU6IHtcbiAgICAgICAgdHlwZTogJ29iamVjdCdcbiAgICAgIH0sXG4gICAgICBzZWFzb25hbDoge1xuICAgICAgICB0eXBlOiAnYm9vbGVhbidcbiAgICAgIH0sXG4gICAgICBwaG9uZToge1xuICAgICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgICAgfSxcbiAgICAgIHdlYnNpdGU6IHtcbiAgICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICAgIGZvcm1hdDogJ3VyaSdcbiAgICAgIH1cbiAgICB9LFxuICAgIHJlcXVpcmVkOiBbXG4gICAgICAnc2Vhc29uYWwnXG4gICAgXVxuICB9IClcbn0gKTtcblxuLy8gQXBwbHkgdGhlIHZhbGlkYXRpb24gbWl4aW4gdG8gdGhlIFNlcnZpY2UgbW9kZWwuIFNlZSB2YWxpZGF0aW9uLW1peGluLmpzLlxubWl4aW5WYWxpZGF0aW9uKCBTZXJ2aWNlICk7XG5cbi8vICMgQWxlcnQgTW9kZWxcbi8vIEFuIGFsZXJ0IGlzIHNvbWV0aGluZyB0aGF0IG1pZ2h0IGltcGVkZSBhIGN5Y2xpc3QncyB0b3VyLiBXaGVuIGEgY3ljbGlzdFxuLy8gc2VlcyBhbiBhbGVydCBvbiB0aGUgbWFwLCB0aGUga25vdyB0byBwbGFuIGFyb3VuZCBpdC5cblxuLyplc2ZtdC1pZ25vcmUtc3RhcnQqL1xuZXhwb3J0IGNvbnN0IGFsZXJ0VHlwZXMgPSB7XG4gICdyb2FkX2Nsb3N1cmUnOiAgICAgIHsgZGlzcGxheTogJ1JvYWQgQ2xvc3VyZScgfSxcbiAgJ2ZvcmVzdF9maXJlJzogICAgICAgeyBkaXNwbGF5OiAnRm9yZXN0IGZpcmUnIH0sXG4gICdmbG9vZGluZyc6ICAgICAgICAgIHsgZGlzcGxheTogJ0Zsb29kaW5nJyB9LFxuICAnZGV0b3VyJzogICAgICAgICAgICB7IGRpc3BsYXk6ICdEZXRvdXInIH0sXG4gICdvdGhlcic6ICAgICAgICAgICAgIHsgZGlzcGxheTogJ090aGVyJyB9XG59O1xuLyplc2ZtdC1pZ25vcmUtZW5kKi9cblxuZXhwb3J0IGNvbnN0IEFsZXJ0ID0gUG9pbnQuZXh0ZW5kKCB7XG4gIHNwZWNpZnk6IGZ1bmN0aW9uKCBuYW1lLCBsb2NhdGlvbiApIHtcbiAgICBQb2ludC5wcm90b3R5cGUuc3BlY2lmeS5jYWxsKCB0aGlzLCAnYWxlcnQnLCBuYW1lLCBsb2NhdGlvbiApO1xuICB9LFxuXG4gIHNjaGVtYTogbWVyZ2VTY2hlbWFzKCBQb2ludC5wcm90b3R5cGUuc2NoZW1hLCB7XG4gICAgcHJvcGVydGllczoge1xuICAgICAgdHlwZToge1xuICAgICAgICBlbnVtOiBrZXlzKCBhbGVydFR5cGVzIClcbiAgICAgIH1cbiAgICB9XG4gIH0gKVxufSApO1xuXG5taXhpblZhbGlkYXRpb24oIEFsZXJ0ICk7XG5cbi8vICMgUG9pbnQgQ29sbGVjdGlvblxuLy8gQSBoZXRlcm9nZW5lb3VzIGNvbGxlY3Rpb24gb2Ygc2VydmljZXMgYW5kIGFsZXJ0cy4gUG91Y2hEQiBpcyBhYmxlIHRvIGZldGNoXG4vLyB0aGlzIGNvbGxlY3Rpb24gYnkgbG9va2luZyBmb3IgYWxsIGtleXMgc3RhcnRpbmcgd2l0aCAncG9pbnQvJy5cbi8vXG4vLyBUaGlzIGFsc28gaGFzIHRoZSBlZmZlY3Qgb2YgZmV0Y2hpbmcgY29tbWVudHMgZm9yIHBvaW50cy4gVE9ETzogaGFuZGxlXG4vLyBgQ29tbWVudGAgaW4gdGhlIG1vZGVsIGZ1bmN0aW9uLlxuLy9cbi8vIEEgY29ubmVjdGVkIFBvaW50Q29sbGVjdGlvbiBtdXN0IGJlIGFibGUgdG8gZ2VuZXJhdGUgY29ubmVjdGVkIEFsZXJ0cyBvclxuLy8gU2VydmljZXMgb24gZGVtYW5kcy4gVGhlcmVmb3JlLCBpZiBQb2ludENvbGxlY3Rpb24gaXMgY29ubmVjdGVkLCBjb25uZWN0XG4vLyBtb2RlbHMgYmVmb3JlIHJldHVybmluZyB0aGVtLlxuZXhwb3J0IGNvbnN0IFBvaW50Q29sbGVjdGlvbiA9IENvdWNoQ29sbGVjdGlvbi5leHRlbmQoIHtcbiAgaW5pdGlhbGl6ZTogZnVuY3Rpb24oIG1vZGVscywgb3B0aW9ucyApIHtcbiAgICBDb3VjaENvbGxlY3Rpb24ucHJvdG90eXBlLmluaXRpYWxpemUuYXBwbHkoIHRoaXMsIGFyZ3VtZW50cyApO1xuICAgIHRoaXMucG91Y2ggPSB7XG4gICAgICBvcHRpb25zOiB7XG4gICAgICAgIGFsbERvY3M6IHsgaW5jbHVkZV9kb2NzOiB0cnVlLCAuLi5rZXlzQmV0d2VlbiggJ3BvaW50LycgKSB9XG4gICAgICB9XG4gICAgfTtcblxuICAgIGNvbnN0IHtjb25uZWN0LCBkYXRhYmFzZX0gPSB0aGlzO1xuICAgIHRoaXMuc2VydmljZSA9IGNvbm5lY3QgPyBjb25uZWN0KCBkYXRhYmFzZSwgU2VydmljZSApIDogU2VydmljZTtcbiAgICB0aGlzLmFsZXJ0ID0gY29ubmVjdCA/IGNvbm5lY3QoIGRhdGFiYXNlLCBBbGVydCApIDogQWxlcnQ7XG4gIH0sXG5cbiAgbW9kZWw6IGZ1bmN0aW9uKCBhdHRyaWJ1dGVzLCBvcHRpb25zICkge1xuICAgIGNvbnN0IHBhcnRzID0gcG9pbnRJZCggYXR0cmlidXRlcy5faWQgKTtcbiAgICBjb25zdCBtYXAgPSB7XG4gICAgICAnc2VydmljZSc6IG9wdGlvbnMuY29sbGVjdGlvbi5zZXJ2aWNlLFxuICAgICAgJ2FsZXJ0Jzogb3B0aW9ucy5jb2xsZWN0aW9uLmFsZXJ0XG4gICAgfTtcbiAgICBjb25zdCBjb25zdHJ1Y3RvciA9IG1hcFsgcGFydHMudHlwZSBdO1xuICAgIGlmICggY29uc3RydWN0b3IgKSB7XG4gICAgICByZXR1cm4gbmV3IGNvbnN0cnVjdG9yKCBhdHRyaWJ1dGVzLCBvcHRpb25zICk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93ICdBIHBvaW50IG11c3QgYmUgZWl0aGVyIGEgc2VydmljZSBvciBhbGVydCc7XG4gICAgfVxuICB9LFxuXG4gIC8vICMjIEZldGNoIENvdmVyIEltYWdlcyBmb3IgYWxsIFBvaW50c1xuICAvLyBSZXR1cm5zIGEgcHJvbWlzZSB0aGF0IHJlc29sdmVzIHdoZW4gYWxsIHBvaW50cyBpbiB0aGUgYXJyYXkgaGF2ZVxuICAvLyB0aGVpciBjb3ZlciBpbWFnZXMgYXZhaWxhYmxlLlxuICBnZXRDb3ZlcnM6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBQcm9taXNlLmFsbCggdGhpcy5tb2RlbHMubWFwKCBwb2ludCA9PiBwb2ludC5nZXRDb3ZlcigpICkgKTtcbiAgfSxcblxuICAvLyAjIyBHZXQgUmVkdXggUmVwcmVzZW50YXRpb25cbiAgLy8gUmV0dXJuIGEgbmVzdGVkIG9iamVjdC9hcmFyeSByZXByZXNlbnRhdGlvbiBvZiB0aGUgY29sbGVjdGlvbiBzdWl0YWJsZSBmb3JcbiAgLy8gdXNlIHdpdGggcmVkdXguXG4gIHN0b3JlOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gZnJvbVBhaXJzKCB0aGlzLm1vZGVscy5tYXAoIHBvaW50ID0+IFsgcG9pbnQuaWQsIHBvaW50LnN0b3JlKCkgXSApICk7XG4gIH1cbn0gKTtcblxuLy8gIyBEaXNwbGF5IE5hbWUgZm9yIFR5cGVcbi8vIEdpdmVuIGEgdHlwZSBrZXkgZnJvbSBlaXRoZXIgdGhlIHNlcnZpY2Ugb3IgYWxlcnQgdHlwZSBlbnVtZXJhdGlvbnMsXG4vLyByZXR1cm4gdGhlIHR5cGUncyBkaXNwbGF5IHN0cmluZywgb3IgbnVsbCBpZiBpdCBkb2VzIG5vdCBleGlzdC5cbmV4cG9ydCBmdW5jdGlvbiBkaXNwbGF5KCB0eXBlICkge1xuICBjb25zdCB2YWx1ZXMgPSBzZXJ2aWNlVHlwZXNbIHR5cGUgXSB8fCBhbGVydFR5cGVzWyB0eXBlIF07XG4gIGlmICggdmFsdWVzICkge1xuICAgIHJldHVybiB2YWx1ZXMuZGlzcGxheTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxufVxuXG4vLyAjIENvbW1lbnQgTW9kZWxcbi8vIEluZm9ybWF0aW9uIGFib3V0IGFsZXJ0cyBhbmQgc2VydmljZXMgZW5jb3VudGVyZWQgYnkgY3ljbGlzdHMgaXMgbGlrZWx5XG4vLyB0byBjaGFuZ2Ugd2l0aCB0aGUgc2Vhc29ucyBvciBvdGhlciByZWFzb25zLiBDeWNsaXN0cyBwbGFubmluZyB0aGUgbmV4dCBsZWdcbi8vIG9mIGEgdG91ciBzaG91bGQgYmUgYWJsZSB0byByZWFkIHRoZSBleHBlcmllbmNlcyBvZiBjeWNsaXN0cyBhaGVhZCBvZiB0aGVtLlxuLy9cbi8vIEEgY29tbWVudCBtdXN0IGhhdmUgYm90aCBhIHJhdGluZyBhbmQgdGhlIHRleHQgb2YgdGhlIGNvbW1lbnQuIENvbW1lbnRzIGFyZVxuLy8gbGltaXRlZCB0byAxNDAgY2hhcmFjdGVycyB0byBlbnN1cmUgdGhleSBkbyBub3QgZGV2b2x2ZSBpbnRvIGdlbmVyYWwgYWxlcnRcbi8vIG9yIHNlcnZpY2UgaW5mb3JtYXRpb24gdGhhdCBzaG91bGQgcmVhbGx5IGJlIGluIHRoZSBkZXNjcmlwdGlvbi4gV2UgcmVhbGx5XG4vLyB3YW50IHVzZXJzIG9mIHRoZSBCaWN5Y2xlIFRvdXJpbmcgQ29tcGFuaW9uIHRvIHByb3ZpZGUgY29tbWVudHMgdmVyaWZ5aW5nXG4vLyBpbmZvIGFib3V0IHBvaW50cywgb3IgbGV0dGluZyBvdGhlciBjeWNsaXN0cyBrbm93IGFib3V0IGNoYW5nZXMgaW4gdGhlXG4vLyBzZXJ2aWNlIG9yIGFsZXJ0LlxuXG4vLyAjIyBDb21tZW50IE1vZGVsIFVyaVxuLy8gQ29tbWVudHMgYXJlIHN0b3JlZCBpbiBDb3VjaERCIGluIHRoZSBzYW1lIGRhdGFiYXNlIGFzIHBvaW50cy4gVGhlIGNvbW1lbnRcbi8vIG1vZGVsIHVyaSBpcyBjb21wb3NlZCBvZiB0aHJlZSBwYXJ0czpcbi8vICAxLiBUaGUgZW50aXJlIGlkIG9mIHRoZSByZWxhdGVkIHBvaW50XG4vLyAgMi4gVGhlIHN0cmluZyAnY29tbWVudC8nXG4vLyAgMy4gQSB0aW1lIGJhc2VkIFVVSUQgdG8gdW5pcXVlbHkgaWRlbnRpZnkgY29tbWVudHNcbi8vXG4vLyBXZSBkb24ndCB1c2UgYGRvY3VyaWAgZm9yIHRoZSBjb21tZW50IG1vZGVsIHVyaXMgYmVjYXVzZSB3ZSBkb24ndCBoYXZlIHRvXG4vLyBwYXJzZSB0aGVtLlxuXG5jb25zdCBDT01NRU5UX01BWF9MRU5HVEggPSAxNDA7XG5leHBvcnQgY29uc3QgQ29tbWVudCA9IENvdWNoTW9kZWwuZXh0ZW5kKCB7XG4gIGlkQXR0cmlidXRlOiAnX2lkJyxcblxuICAvLyAjIyBDb25zdHJ1Y3RvclxuICAvLyBHZW5lcmF0ZSBgX2lkYC4gYHBvaW50SWRgIG11c3QgYmUgc3BlY2lmaWVkIGluIG9wdGlvbnMuXG4gIGNvbnN0cnVjdG9yOiBmdW5jdGlvbiggYXR0cmlidXRlcywgb3B0aW9ucyApIHtcbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgICBpZiAoICFhdHRyaWJ1dGVzLnV1aWQgKSB7XG4gICAgICBhdHRyaWJ1dGVzLnV1aWQgPSB1dWlkLnYxKCk7XG4gICAgfVxuICAgIGlmICggIWF0dHJpYnV0ZXMuX2lkICYmIG9wdGlvbnMucG9pbnRJZCApIHtcbiAgICAgIGF0dHJpYnV0ZXMuX2lkID0gb3B0aW9ucy5wb2ludElkICsgJy9jb21tZW50LycgKyBhdHRyaWJ1dGVzLnV1aWQ7XG4gICAgfVxuICAgIENvdWNoTW9kZWwuYXBwbHkoIHRoaXMsIGFyZ3VtZW50cyApO1xuICB9LFxuXG4gIHNjaGVtYToge1xuICAgIHR5cGU6ICdvYmplY3QnLFxuICAgIGFkZGl0aW9uYWxQcm9wZXJ0aWVzOiBmYWxzZSxcbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICB1c2VybmFtZToge1xuICAgICAgICAndHlwZSc6ICdzdHJpbmcnXG4gICAgICB9LFxuICAgICAgdGV4dDoge1xuICAgICAgICAndHlwZSc6ICdzdHJpbmcnLFxuICAgICAgICAnbWF4TGVuZ3RoJzogQ09NTUVOVF9NQVhfTEVOR1RIXG4gICAgICB9LFxuICAgICAgcmF0aW5nOiB7XG4gICAgICAgIHR5cGU6ICdpbnRlZ2VyJyxcbiAgICAgICAgbWluaW11bTogMSxcbiAgICAgICAgbWF4aW11bTogNVxuICAgICAgfSxcbiAgICAgIHV1aWQ6IHtcbiAgICAgICAgdHlwZTogJ3N0cmluZydcbiAgICAgIH1cbiAgICB9LFxuICAgIHJlcXVpcmVkOiBbXG4gICAgICAndXNlcm5hbWUnLFxuICAgICAgJ3RleHQnLFxuICAgICAgJ3JhdGluZycsXG4gICAgICAndXVpZCdcbiAgICBdXG4gIH1cbn0sIHtcbiAgTUFYX0xFTkdUSDogQ09NTUVOVF9NQVhfTEVOR1RIXG59ICk7XG5cbm1peGluVmFsaWRhdGlvbiggQ29tbWVudCApO1xuXG4vLyAjIENvbW1lbnQgQ29sbGVjdGlvblxuLy8gRmV0Y2ggb25seSBjb21tZW50cyBhc3NvY2lhdGVkIHdpdGggYSBnaXZlbiBwb2ludC5cbmV4cG9ydCBjb25zdCBDb21tZW50Q29sbGVjdGlvbiA9IENvdWNoQ29sbGVjdGlvbi5leHRlbmQoIHtcbiAgaW5pdGlhbGl6ZTogZnVuY3Rpb24oIG1vZGVscywgb3B0aW9ucyApIHtcbiAgICBDb3VjaENvbGxlY3Rpb24ucHJvdG90eXBlLmluaXRpYWxpemUuYXBwbHkoIHRoaXMsIGFyZ3VtZW50cyApO1xuICAgIGNvbnN0IHBvaW50SWQgPSB0aGlzLnBvaW50SWQgPSBvcHRpb25zLnBvaW50SWQ7XG5cbiAgICBjb25zdCBjb25uZWN0ID0gdGhpcy5jb25uZWN0O1xuICAgIGNvbnN0IGRhdGFiYXNlID0gdGhpcy5kYXRhYmFzZTtcbiAgICB0aGlzLmNvbW1lbnQgPSBjb25uZWN0ID8gY29ubmVjdCggZGF0YWJhc2UsIENvbW1lbnQgKSA6IENvbW1lbnQ7XG5cbiAgICB0aGlzLnBvdWNoID0ge1xuICAgICAgb3B0aW9uczoge1xuICAgICAgICBhbGxEb2NzOiB7XG4gICAgICAgICAgLi4ua2V5c0JldHdlZW4oIHBvaW50SWQgKyAnL2NvbW1lbnQnICksXG4gICAgICAgICAgaW5jbHVkZV9kb2NzOiB0cnVlXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuICB9LFxuXG4gIG1vZGVsOiBmdW5jdGlvbiggYXR0cmlidXRlcywgb3B0aW9ucyApIHtcbiAgICBjb25zdCB7Y29tbWVudCwgcG9pbnRJZH0gPSBvcHRpb25zLmNvbGxlY3Rpb247XG4gICAgcmV0dXJuIG5ldyBjb21tZW50KCBhdHRyaWJ1dGVzLCB7IHBvaW50SWQsIC4uLm9wdGlvbnMgfSApO1xuICB9XG59ICk7XG4iXX0=