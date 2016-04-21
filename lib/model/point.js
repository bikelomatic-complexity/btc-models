'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CommentCollection = exports.Comment = exports.PointCollection = exports.Alert = exports.alertTypes = exports.Service = exports.serviceTypes = exports.Point = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }(); /* btc-app-server -- Server for the Bicycle Touring Companion
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

      var _lat = _location3[0];
      var _lng = _location3[1];

      var _id2 = pointId({
        type: type,
        name: (0, _toId2.default)(_name),
        geohash: _ngeohash2.default.encode(_lat, _lng)
      });
      this.set({ _id: _id2 });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tb2RlbC9wb2ludC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O1FBb1lnQjs7QUFqWGhCOztBQUNBOztBQUVBOztBQUNBOztBQUVBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7QUFFQSxJQUFNLFVBQVksT0FBTyxNQUFQLEtBQWtCLFdBQWxCOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFrQmxCLElBQU0sVUFBVSxpQkFBTyxLQUFQLENBQWMsNEJBQWQsQ0FBVjs7QUFFQyxJQUFNLHdCQUFRLGlCQUFXLE1BQVgsQ0FBbUI7QUFDdEMsZUFBYSxLQUFiOztBQUVBLGNBQVksb0JBQVUsVUFBVixFQUFzQixPQUF0QixFQUFnQztBQUMxQyxxQkFBVyxTQUFYLENBQXFCLFVBQXJCLENBQWdDLEtBQWhDLENBQXVDLElBQXZDLEVBQTZDLFNBQTdDLEVBRDBDO0FBRTFDLFNBQUssR0FBTCxDQUFVLFlBQVYsRUFBd0IsSUFBSSxJQUFKLEdBQVcsV0FBWCxFQUF4QixFQUYwQztBQUcxQyxTQUFLLFFBQUwsR0FBZ0IsS0FBaEIsQ0FIMEM7R0FBaEM7Ozs7O0FBU1osV0FBUyxpQkFBVSxJQUFWLEVBQWdCLElBQWhCLEVBQXNCLFFBQXRCLEVBQWlDO0FBQ3hDLFFBQUssSUFBTCxFQUFZO3FDQUNTLGFBRFQ7O1VBQ0gsbUJBREc7VUFDRSxtQkFERjs7QUFFVixVQUFNLE1BQU0sUUFBUztBQUNuQixjQUFNLElBQU47QUFDQSxjQUFNLG9CQUFXLElBQVgsQ0FBTjtBQUNBLGlCQUFTLG1CQUFTLE1BQVQsQ0FBaUIsR0FBakIsRUFBc0IsR0FBdEIsQ0FBVDtPQUhVLENBQU4sQ0FGSTtBQU9WLFdBQUssR0FBTCxDQUFVLEVBQUUsUUFBRixFQUFPLFVBQVAsRUFBYSxVQUFiLEVBQW1CLGtCQUFuQixFQUFWLEVBUFU7S0FBWixNQVFPO3dCQUNvQixLQUFLLFVBQUwsQ0FEcEI7VUFDRSx5QkFERjtVQUNRLGtDQURS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QUFTLFFBQVQsRUFBbUIsT0FBbkIsQ0FBVixHQUF5QyxPQUF6QyxDQU51Qjs7QUFRdEMsU0FBSyxLQUFMLEdBQWE7QUFDWCxlQUFTO0FBQ1AsOEJBQ0ssdUJBQWEsVUFBVSxVQUFWO0FBQ2hCLHdCQUFjLElBQWQ7VUFGRjtPQURGO0tBREYsQ0FSc0M7R0FBNUI7O0FBa0JaLFNBQU8sZUFBVSxVQUFWLEVBQXNCLE9BQXRCLEVBQWdDOzhCQUNWLFFBQVEsVUFBUixDQURVO1FBQzlCLHNDQUQ4QjtRQUNyQixzQ0FEcUI7O0FBRXJDLFdBQU8sSUFBSSxPQUFKLENBQWEsVUFBYixhQUEyQixvQkFBWSxRQUF2QyxDQUFQLENBRnFDO0dBQWhDO0NBbkJ3QixDQUFwQiIsImZpbGUiOiJwb2ludC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIGJ0Yy1hcHAtc2VydmVyIC0tIFNlcnZlciBmb3IgdGhlIEJpY3ljbGUgVG91cmluZyBDb21wYW5pb25cclxuICogQ29weXJpZ2h0IMKpIDIwMTYgQWR2ZW50dXJlIEN5Y2xpbmcgQXNzb2NpYXRpb25cclxuICpcclxuICogVGhpcyBmaWxlIGlzIHBhcnQgb2YgYnRjLWFwcC1zZXJ2ZXIuXHJcbiAqXHJcbiAqIGJ0Yy1hcHAtc2VydmVyIGlzIGZyZWUgc29mdHdhcmU6IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnlcclxuICogaXQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBBZmZlcm8gR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgYXMgcHVibGlzaGVkIGJ5XHJcbiAqIHRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24sIGVpdGhlciB2ZXJzaW9uIDMgb2YgdGhlIExpY2Vuc2UsIG9yXHJcbiAqIChhdCB5b3VyIG9wdGlvbikgYW55IGxhdGVyIHZlcnNpb24uXHJcbiAqXHJcbiAqIGJ0Yy1hcHAtc2VydmVyIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXHJcbiAqIGJ1dCBXSVRIT1VUIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mXHJcbiAqIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gIFNlZSB0aGVcclxuICogQWZmZXJvIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXHJcbiAqXHJcbiAqIFlvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEFmZmVybyBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxyXG4gKiBhbG9uZyB3aXRoIEZvb2Jhci4gIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cclxuICovXHJcblxyXG5pbXBvcnQgeyBtaXhpblZhbGlkYXRpb24sIG1lcmdlU2NoZW1hcyB9IGZyb20gJy4vdmFsaWRhdGlvbi1taXhpbic7XHJcbmltcG9ydCB7IENvdWNoTW9kZWwsIENvdWNoQ29sbGVjdGlvbiwga2V5c0JldHdlZW4gfSBmcm9tICcuL2Jhc2UnO1xyXG5cclxuaW1wb3J0IHsga2V5cywgZnJvbVBhaXJzLCBpbmNsdWRlcyB9IGZyb20gJ2xvZGFzaCc7XHJcbmltcG9ydCB7IGNyZWF0ZU9iamVjdFVSTCB9IGZyb20gJ2Jsb2ItdXRpbCc7XHJcblxyXG5pbXBvcnQgZG9jdXJpIGZyb20gJ2RvY3VyaSc7XHJcbmltcG9ydCBuZ2VvaGFzaCBmcm9tICduZ2VvaGFzaCc7XHJcbmltcG9ydCBub3JtYWxpemUgZnJvbSAndG8taWQnO1xyXG5pbXBvcnQgdXVpZCBmcm9tICdub2RlLXV1aWQnO1xyXG5cclxuY29uc3QgYnJvd3NlciA9ICggdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgKTtcclxuXHJcbi8vICMgUG9pbnQgTW9kZWxcclxuLy8gVGhlIHBvaW50IHJlcHJlc2VudHMgYSBsb2NhdGlvbiBvbiB0aGUgbWFwIHdpdGggYXNzb2NpYXRlZCBtZXRhZGF0YSwgZ2VvZGF0YSxcclxuLy8gYW5kIHVzZXIgcHJvdmlkZWQgZGF0YS4gVGhlIHBvaW50IGlzIHRoZSBiYXNlIHNoYXJlZCBieSBzZXJ2aWNlcyBhbmQgYWxlcnRzLlxyXG4vL1xyXG4vLyBUaGUgSlNPTiBzY2hlbWEgc3RvcmVkIGluIGBQb2ludGAsIGFuZCBhcyBwYXRjaGVkIGJ5IGBTZXJ2aWNlYCBhbmQgYEFsZXJ0YCxcclxuLy8gaXMgdGhlIGF1dGhvcml0YXRpdmUgZGVmaW5pdGlvbiBvZiB0aGUgcG9pbnQgcmVjb3JkLlxyXG5cclxuLy8gIyMgUG9pbnQgTW9kZWwgVXJpXHJcbi8vIFBvaW50cyBhcmUgc3RvcmVkIGluIENvdWNoREIuIENvdWNoREIgZG9jdW1lbnRzIGNhbiBoYXZlIHJpY2ggaWQgc3RyaW5nc1xyXG4vLyB0byBoZWxwIHN0b3JlIGFuZCBhY2Nlc3MgZGF0YSB3aXRob3V0IE1hcFJlZHVjZSBqb2JzLlxyXG4vL1xyXG4vLyBUaGUgcG9pbnQgbW9kZWwgdXJpIGlzIGNvbXBvc2VkIG9mIGZvdXIgcGFydHM6XHJcbi8vICAxLiBUaGUgc3RyaW5nICdwb2ludC8nYFxyXG4vLyAgMi4gVGhlIHR5cGUgb2YgcG9pbnQsIGVpdGhlciAnc2VydmljZScgb3IgJ2FsZXJ0J1xyXG4vLyAgMy4gVGhlIG5vcm1hbGl6ZWQgbmFtZSBvZiB0aGUgcG9pbnRcclxuLy8gIDQuIFRoZSBwb2ludCdzIGdlb2hhc2hcclxuY29uc3QgcG9pbnRJZCA9IGRvY3VyaS5yb3V0ZSggJ3BvaW50Lzp0eXBlLzpuYW1lLzpnZW9oYXNoJyApO1xyXG5cclxuZXhwb3J0IGNvbnN0IFBvaW50ID0gQ291Y2hNb2RlbC5leHRlbmQoIHtcclxuICBpZEF0dHJpYnV0ZTogJ19pZCcsXHJcblxyXG4gIGluaXRpYWxpemU6IGZ1bmN0aW9uKCBhdHRyaWJ1dGVzLCBvcHRpb25zICkge1xyXG4gICAgQ291Y2hNb2RlbC5wcm90b3R5cGUuaW5pdGlhbGl6ZS5hcHBseSggdGhpcywgYXJndW1lbnRzICk7XHJcbiAgICB0aGlzLnNldCggJ2NyZWF0ZWRfYXQnLCBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCkgKTtcclxuICAgIHRoaXMuY292ZXJVcmwgPSBmYWxzZTtcclxuICB9LFxyXG5cclxuICAvLyAjIyBTcGVjaWZ5XHJcbiAgLy8gRmlsbCBpbiBgX2lkYCBmcm9tIHRoZSBjb21wb25lbnRzIG9mIHRoZSBwb2ludCBtb2RlbCB1cmkuXHJcbiAgLy8gUHVsbCB2YWx1ZXMgZnJvbSBgYXR0cmlidXRlc2AgaWYgbmFtZSBhbmQgbG9jYXRpb24gYXJlIHVuZGVmaW5lZC5cclxuICBzcGVjaWZ5OiBmdW5jdGlvbiggdHlwZSwgbmFtZSwgbG9jYXRpb24gKSB7XHJcbiAgICBpZiAoIG5hbWUgKSB7XHJcbiAgICAgIGNvbnN0IFtsYXQsIGxuZ10gPSBsb2NhdGlvbjtcclxuICAgICAgY29uc3QgX2lkID0gcG9pbnRJZCgge1xyXG4gICAgICAgIHR5cGU6IHR5cGUsXHJcbiAgICAgICAgbmFtZTogbm9ybWFsaXplKCBuYW1lICksXHJcbiAgICAgICAgZ2VvaGFzaDogbmdlb2hhc2guZW5jb2RlKCBsYXQsIGxuZyApXHJcbiAgICAgIH0gKTtcclxuICAgICAgdGhpcy5zZXQoIHsgX2lkLCB0eXBlLCBuYW1lLCBsb2NhdGlvbiB9ICk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBjb25zdCB7bmFtZSwgbG9jYXRpb259ID0gdGhpcy5hdHRyaWJ1dGVzO1xyXG4gICAgICBjb25zdCBbbGF0LCBsbmddID0gbG9jYXRpb247XHJcbiAgICAgIGNvbnN0IF9pZCA9IHBvaW50SWQoIHtcclxuICAgICAgICB0eXBlOiB0eXBlLFxyXG4gICAgICAgIG5hbWU6IG5vcm1hbGl6ZSggbmFtZSApLFxyXG4gICAgICAgIGdlb2hhc2g6IG5nZW9oYXNoLmVuY29kZSggbGF0LCBsbmcgKVxyXG4gICAgICB9ICk7XHJcbiAgICAgIHRoaXMuc2V0KCB7IF9pZCB9ICk7XHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgLy8gIyMgU2FmZWd1YXJkIGZvciBQb2ludHNcclxuICAvLyBQb2ludHMgaGF2ZSBpbWFnZSBhdHRhY2htZW50cywgc28gd2Ugc2hvdWxkIGxldCBiYWNrYm9uZSBwb3VjaCBoYW5kbGVcclxuICAvLyB0aG9zZSBhbmQgd2Ugc2hvdWxkIG5vdCB2YWxpZGF0ZSB0aGUgX2F0dGFjaG1lbnRzIGtleVxyXG4gIHNhZmVndWFyZDogW1xyXG4gICAgJ19hdHRhY2htZW50cydcclxuICBdLFxyXG5cclxuICBkZWZhdWx0czogZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBmbGFnOiBmYWxzZVxyXG4gICAgfTtcclxuICB9LFxyXG5cclxuICBzY2hlbWE6IHtcclxuICAgIHR5cGU6ICdvYmplY3QnLFxyXG4gICAgYWRkaXRpb25hbFByb3BlcnRpZXM6IGZhbHNlLFxyXG4gICAgcHJvcGVydGllczoge1xyXG4gICAgICBuYW1lOiB7XHJcbiAgICAgICAgdHlwZTogJ3N0cmluZydcclxuICAgICAgfSxcclxuICAgICAgbG9jYXRpb246IHtcclxuICAgICAgICB0eXBlOiAnYXJyYXknLFxyXG4gICAgICAgIG1pbkl0ZW1zOiAyLFxyXG4gICAgICAgIG1heEl0ZW1zOiAyLFxyXG4gICAgICAgIGl0ZW1zOiB7XHJcbiAgICAgICAgICB0eXBlOiAnbnVtYmVyJ1xyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuICAgICAgdHlwZToge1xyXG4gICAgICAgIHR5cGU6ICdzdHJpbmcnXHJcbiAgICAgIH0sXHJcbiAgICAgIGNyZWF0ZWRfYXQ6IHtcclxuICAgICAgICB0eXBlOiAnc3RyaW5nJyxcclxuICAgICAgICBmb3JtYXQ6ICdkYXRlLXRpbWUnXHJcbiAgICAgIH0sXHJcbiAgICAgIGRlc2NyaXB0aW9uOiB7XHJcbiAgICAgICAgdHlwZTogJ3N0cmluZydcclxuICAgICAgfSxcclxuICAgICAgZmxhZzoge1xyXG4gICAgICAgIHR5cGU6ICdib29sZWFuJ1xyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgcmVxdWlyZWQ6IFtcclxuICAgICAgJ25hbWUnLFxyXG4gICAgICAnbG9jYXRpb24nLFxyXG4gICAgICAndHlwZScsXHJcbiAgICAgICdjcmVhdGVkX2F0JyxcclxuICAgICAgJ2ZsYWcnXHJcbiAgICBdXHJcbiAgfSxcclxuXHJcbiAgY2xlYXI6IGZ1bmN0aW9uKCkge1xyXG4gICAgQ291Y2hNb2RlbC5wcm90b3R5cGUuY2xlYXIuYXBwbHkoIHRoaXMsIGFyZ3VtZW50cyApO1xyXG4gICAgdGhpcy5jb3ZlclVybCA9IGZhbHNlO1xyXG4gIH0sXHJcblxyXG4gIC8vICMjIEZldGNoXHJcbiAgLy8gV2hlbiBmZXRjaGluZyBhIHBvaW50LCBzaG91bGQgaXQgaGF2ZSBhIGNvdmVyIGF0dGFjaG1lbnQsIGV4dGVuZCB0aGVcclxuICAvLyBwcm9taXNlIHRvIGZldGNoIHRoZSBhdHRhY2htZW50IGFuZCBzZXQgYHRoaXMuY292ZXJVcmxgLlxyXG4gIGZldGNoOiBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiBDb3VjaE1vZGVsLnByb3RvdHlwZS5mZXRjaC5hcHBseSggdGhpcywgYXJndW1lbnRzICkudGhlbiggcmVzID0+IHtcclxuICAgICAgcmV0dXJuIHRoaXMuZ2V0Q292ZXIoIHJlcyApO1xyXG4gICAgfSApO1xyXG4gIH0sXHJcblxyXG4gIC8vICMgR2V0IENvdmVyXHJcbiAgLy8gU2hvdWxkIGEgcG9pbnQgKGFscmVhZHkgZmV0Y2hlZCkgaGF2ZSBhIGNvdmVyIGF0dGFjaG1lbnQsIGdldCB0aGVcclxuICAvLyBhdHRhY2htZW50J3MgZGF0YSBhbmQgc3RvcmUgYW4gb2JqZWN0IHVybCBmb3IgaXQgaW4gYHRoaXMuY292ZXJVcmxgXHJcbiAgLy9cclxuICAvLyBBcyBhIHV0aWxpdHkgdG8gY2xpZW50IGZ1bmN0aW9ucywgcmVzb2x2ZSB0aGUgcmV0dXJuZWQgcHJvbWlzZSB0byB0aGVcclxuICAvLyBzaW5nbGUgYXJndW1lbnQgcGFzc2VkIHRvIGBnZXRDb3ZlcmAuXHJcbiAgZ2V0Q292ZXI6IGZ1bmN0aW9uKCByZXQgKSB7XHJcbiAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCkudGhlbiggKCApID0+IHtcclxuICAgICAgY29uc3QgaGFzQ292ZXIgPSBpbmNsdWRlcyggdGhpcy5hdHRhY2htZW50cygpLCAnY292ZXIucG5nJyApO1xyXG4gICAgICBpZiAoIGJyb3dzZXIgJiYgaGFzQ292ZXIgKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuYXR0YWNobWVudCggJ2NvdmVyLnBuZycgKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuICAgIH0gKS50aGVuKCBibG9iID0+IHtcclxuICAgICAgaWYgKCBibG9iICkge1xyXG4gICAgICAgIHRoaXMuY292ZXJVcmwgPSBjcmVhdGVPYmplY3RVUkwoIGJsb2IgKTtcclxuICAgICAgfVxyXG4gICAgfSApLnRoZW4oICggKSA9PiB7XHJcbiAgICAgIHJldHVybiByZXQ7XHJcbiAgICB9ICk7XHJcbiAgfSxcclxuXHJcbiAgLy8gIyMgU2V0IENvdmVyXHJcbiAgLy8gSWYgdGhlIHVzZXIgYWxyZWFkeSBoYXMgYSBjb3ZlciBibG9iIGFuZCB0aGV5IHdhbnQgdG8gdXNlIGl0IHdpdGggdGhlXHJcbiAgLy8gbW9kZWwgYmVmb3JlIGF0dGFjaCgpIGNhbiBmaW5pc2ggc3RvcmluZyBpdCB0byBQb3VjaERCLCB0aGV5IGNhbiB1c2VcclxuICAvLyB0aGlzIG1ldGhvZCB0byBtYW51YWxseSBpbnNlcnQgaXQuXHJcbiAgLy9cclxuICAvLyBUaGUgYXNzb2NpYXRlZCBvYmplY3QgdXJsIGZvciB0aGUgYmxvYiB3aWxsIHRoZW4gYmUgYXZhaWxhYmxlIHRvIG90aGVyXHJcbiAgLy8gZnVuY3Rpb25zIGxpa2Ugc3RvcmUoKS5cclxuICBzZXRDb3ZlcjogZnVuY3Rpb24oIGJsb2IgKSB7XHJcbiAgICBpZiAoIGJyb3dzZXIgKSB7XHJcbiAgICAgIHRoaXMuY292ZXJVcmwgPSBjcmVhdGVPYmplY3RVUkwoIGJsb2IgKTtcclxuICAgIH1cclxuICB9LFxyXG5cclxuICAvLyAjIyBHZXQgUmVkdXggUmVwcmVzZW50YXRpb25cclxuICAvLyBSZXR1cm4gYSBuZXN0ZWQgb2JqZWN0L2FyYXJ5IHJlcHJlc2VudGF0aW9uIG9mIHRoZSBtb2RlbCBzdWl0YWJsZSBmb3JcclxuICAvLyB1c2Ugd2l0aCByZWR1eC5cclxuICBzdG9yZTogZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4geyAuLi50aGlzLnRvSlNPTigpLCBjb3ZlclVybDogdGhpcy5jb3ZlclVybCB9O1xyXG4gIH1cclxufSwge1xyXG4gIHVyaTogcG9pbnRJZCxcclxuXHJcbiAgZm9yOiBpZCA9PiB7XHJcbiAgICBjb25zdCB7dHlwZX0gPSBwb2ludElkKCBpZCApO1xyXG4gICAgaWYgKCB0eXBlID09PSAnc2VydmljZScgKSB7XHJcbiAgICAgIHJldHVybiBuZXcgU2VydmljZSggeyBfaWQ6IGlkIH0gKTtcclxuICAgIH0gZWxzZSBpZiAoIHR5cGUgPT09ICdhbGVydCcgKSB7XHJcbiAgICAgIHJldHVybiBuZXcgQWxlcnQoIHsgX2lkOiBpZCB9ICk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aHJvdyAnQSBwb2ludCBtdXN0IGVpdGhlciBiZSBhIHNlcnZpY2Ugb3IgYWxlcnQnO1xyXG4gICAgfVxyXG4gIH1cclxufSApO1xyXG5cclxuLy8gIyBTZXJ2aWNlIE1vZGVsXHJcbi8vIEEgc2VydmljZSBpcyBhIGJ1aXNuZXNzIG9yIHBvaW50IG9mIGludGVyZXN0IHRvIGEgY3ljbGlzdC4gQSBjeWNsaXN0IG5lZWRzXHJcbi8vIHRvIGtub3cgd2hlcmUgdGhleSB3YW50IHRvIHN0b3Agd2VsbCBpbiBhZHZhbmNlIG9mIHRoZWlyIHRyYXZlbCB0aHJvdWdoIGFuXHJcbi8vIGFyZWEuIFRoZSBzZXJ2aWNlIHJlY29yZCBtdXN0IGNvbnRhaW4gZW5vdWdoIGluZm9ybWF0aW9uIHRvIGhlbHAgdGhlIGN5Y2xpc3RcclxuLy8gbWFrZSBzdWNoIGRlY2lzaW9ucy5cclxuLy9cclxuLy8gVGhlIHJlY29yZCBpbmNsdWRlcyBjb250YWN0IGluZm9ybWF0aW9uLCBhbmQgYSBzY2hlZHVsZSBvZiBob3VycyBvZlxyXG4vLyBvcGVyYXRpb24uIEl0IGlzIGltcG9ydGFudCB0aGF0IHdlIHN0b3JlIHRoZSB0aW1lIHpvbmUgb2YgYSBzZXJ2aWNlLCBzaW5jZVxyXG4vLyB0b3VyaW5nIGN5Y2xpc3RzIHdpbGwgY3Jvc3MgdGltZSB6b25lcyBvbiB0aGVpciB0cmF2ZWxzLiBGdXJ0aGVybW9yZSxcclxuLy8gc2VydmljZXMgb2YgaW50ZXJlc3QgdG8gdG91cmluZyBjeWNsaXN0cyBtYXkgYmUgc2Vhc29uYWw6IHdlIHN0b3JlXHJcbi8vIHNjaGVkdWxlcyBmb3IgZGlmZmVyZW50IHNlYXNvbnMuXHJcblxyXG4vLyAjIyBTZXJ2aWNlIFR5cGVzXHJcbi8vIEEgU2VydmljZSBtYXkgaGF2ZSBhIHNpbmdsZSB0eXBlLCBpbmRpY2F0aW5nIHRoZSBwcmltYXJ5IHB1cnBvc2Ugb2YgdGhlXHJcbi8vIGJ1aXNuZXNzIG9yIHBvaW50IG9mIGludGVyZXN0LiBTZXJ2aWNlIHR5cGVzIG1heSBhbHNvIGJlIGluY2x1ZGVkIGluIGFcclxuLy8gU2VydmljZSdzIGFtZW5pdGllcyBhcnJheS5cclxuLyplc2ZtdC1pZ25vcmUtc3RhcnQqL1xyXG5leHBvcnQgY29uc3Qgc2VydmljZVR5cGVzID0ge1xyXG4gICdhaXJwb3J0JzogICAgICAgICAgIHsgZGlzcGxheTogJ0FpcnBvcnQnIH0sXHJcbiAgJ2Jhcic6ICAgICAgICAgICAgICAgeyBkaXNwbGF5OiAnQmFyJyB9LFxyXG4gICdiZWRfYW5kX2JyZWFrZmFzdCc6IHsgZGlzcGxheTogJ0JlZCAmIEJyZWFrZmFzdCcgfSxcclxuICAnYmlrZV9zaG9wJzogICAgICAgICB7IGRpc3BsYXk6ICdCaWtlIFNob3AnIH0sXHJcbiAgJ2NhYmluJzogICAgICAgICAgICAgeyBkaXNwbGF5OiAnQ2FiaW4nIH0sXHJcbiAgJ2NhbXBncm91bmQnOiAgICAgICAgeyBkaXNwbGF5OiAnQ2FtcGdyb3VuZCcgfSxcclxuICAnY29udmVuaWVuY2Vfc3RvcmUnOiB7IGRpc3BsYXk6ICdDb252ZW5pZW5jZSBTdG9yZScgfSxcclxuICAnY3ljbGlzdHNfY2FtcGluZyc6ICB7IGRpc3BsYXk6ICdDeWNsaXN0c1xcJyBDYW1waW5nJyB9LFxyXG4gICdjeWNsaXN0c19sb2RnaW5nJzogIHsgZGlzcGxheTogJ0N5Y2xpc3RzXFwnIExvZGdpbmcnIH0sXHJcbiAgJ2dyb2NlcnknOiAgICAgICAgICAgeyBkaXNwbGF5OiAnR3JvY2VyeScgfSxcclxuICAnaG9zdGVsJzogICAgICAgICAgICB7IGRpc3BsYXk6ICdIb3N0ZWwnIH0sXHJcbiAgJ2hvdF9zcHJpbmcnOiAgICAgICAgeyBkaXNwbGF5OiAnSG90IFNwcmluZycgfSxcclxuICAnaG90ZWwnOiAgICAgICAgICAgICB7IGRpc3BsYXk6ICdIb3RlbCcgfSxcclxuICAnbW90ZWwnOiAgICAgICAgICAgICB7IGRpc3BsYXk6ICdNb3RlbCcgfSxcclxuICAnaW5mb3JtYXRpb24nOiAgICAgICB7IGRpc3BsYXk6ICdJbmZvcm1hdGlvbicgfSxcclxuICAnbGlicmFyeSc6ICAgICAgICAgICB7IGRpc3BsYXk6ICdMaWJyYXJ5JyB9LFxyXG4gICdtdXNldW0nOiAgICAgICAgICAgIHsgZGlzcGxheTogJ011c2V1bScgfSxcclxuICAnb3V0ZG9vcl9zdG9yZSc6ICAgICB7IGRpc3BsYXk6ICdPdXRkb29yIFN0b3JlJyB9LFxyXG4gICdyZXN0X2FyZWEnOiAgICAgICAgIHsgZGlzcGxheTogJ1Jlc3QgQXJlYScgfSxcclxuICAncmVzdGF1cmFudCc6ICAgICAgICB7IGRpc3BsYXk6ICdSZXN0YXVyYW50JyB9LFxyXG4gICdyZXN0cm9vbSc6ICAgICAgICAgIHsgZGlzcGxheTogJ1Jlc3Ryb29tJyB9LFxyXG4gICdzY2VuaWNfYXJlYSc6ICAgICAgIHsgZGlzcGxheTogJ1NjZW5pYyBBcmVhJyB9LFxyXG4gICdzdGF0ZV9wYXJrJzogICAgICAgIHsgZGlzcGxheTogJ1N0YXRlIFBhcmsnIH0sXHJcbiAgJ290aGVyJzogICAgICAgICAgICAgeyBkaXNwbGF5OiAnT3RoZXInIH1cclxufTtcclxuLyplc2ZtdC1pZ25vcmUtZW5kKi9cclxuXHJcbmV4cG9ydCBjb25zdCBTZXJ2aWNlID0gUG9pbnQuZXh0ZW5kKCB7XHJcbiAgc3BlY2lmeTogZnVuY3Rpb24oIG5hbWUsIGxvY2F0aW9uICkge1xyXG4gICAgUG9pbnQucHJvdG90eXBlLnNwZWNpZnkuY2FsbCggdGhpcywgJ3NlcnZpY2UnLCBuYW1lLCBsb2NhdGlvbiApO1xyXG4gIH0sXHJcblxyXG4gIGRlZmF1bHRzOiBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIC4uLlBvaW50LnByb3RvdHlwZS5kZWZhdWx0cy5hcHBseSggdGhpcywgYXJndW1lbnRzICksXHJcbiAgICAgIGFtZW5pdGllczogW10sXHJcbiAgICAgIHNjaGVkdWxlOiB7ICdkZWZhdWx0JzogW10gfSxcclxuICAgICAgc2Vhc29uYWw6IGZhbHNlXHJcbiAgICB9O1xyXG4gIH0sXHJcblxyXG4gIHNjaGVtYTogbWVyZ2VTY2hlbWFzKCBQb2ludC5wcm90b3R5cGUuc2NoZW1hLCB7XHJcbiAgICBwcm9wZXJ0aWVzOiB7XHJcbiAgICAgIHR5cGU6IHtcclxuICAgICAgICBlbnVtOiBrZXlzKCBzZXJ2aWNlVHlwZXMgKVxyXG4gICAgICB9LFxyXG4gICAgICBhbWVuaXRpZXM6IHtcclxuICAgICAgICB0eXBlOiAnYXJyYXknLFxyXG4gICAgICAgIGl0ZW1zOiB7XHJcbiAgICAgICAgICB0eXBlOiAnc3RyaW5nJyxcclxuICAgICAgICAgIGVudW06IGtleXMoIHNlcnZpY2VUeXBlcyApXHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG4gICAgICBhZGRyZXNzOiB7XHJcbiAgICAgICAgdHlwZTogJ3N0cmluZydcclxuICAgICAgfSxcclxuICAgICAgc2NoZWR1bGU6IHtcclxuICAgICAgICB0eXBlOiAnb2JqZWN0J1xyXG4gICAgICB9LFxyXG4gICAgICBzZWFzb25hbDoge1xyXG4gICAgICAgIHR5cGU6ICdib29sZWFuJ1xyXG4gICAgICB9LFxyXG4gICAgICBwaG9uZToge1xyXG4gICAgICAgIHR5cGU6ICdzdHJpbmcnXHJcbiAgICAgIH0sXHJcbiAgICAgIHdlYnNpdGU6IHtcclxuICAgICAgICB0eXBlOiAnc3RyaW5nJyxcclxuICAgICAgICBmb3JtYXQ6ICd1cmknXHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICByZXF1aXJlZDogW1xyXG4gICAgICAnc2Vhc29uYWwnXHJcbiAgICBdXHJcbiAgfSApXHJcbn0gKTtcclxuXHJcbi8vIEFwcGx5IHRoZSB2YWxpZGF0aW9uIG1peGluIHRvIHRoZSBTZXJ2aWNlIG1vZGVsLiBTZWUgdmFsaWRhdGlvbi1taXhpbi5qcy5cclxubWl4aW5WYWxpZGF0aW9uKCBTZXJ2aWNlICk7XHJcblxyXG4vLyAjIEFsZXJ0IE1vZGVsXHJcbi8vIEFuIGFsZXJ0IGlzIHNvbWV0aGluZyB0aGF0IG1pZ2h0IGltcGVkZSBhIGN5Y2xpc3QncyB0b3VyLiBXaGVuIGEgY3ljbGlzdFxyXG4vLyBzZWVzIGFuIGFsZXJ0IG9uIHRoZSBtYXAsIHRoZSBrbm93IHRvIHBsYW4gYXJvdW5kIGl0LlxyXG5cclxuLyplc2ZtdC1pZ25vcmUtc3RhcnQqL1xyXG5leHBvcnQgY29uc3QgYWxlcnRUeXBlcyA9IHtcclxuICAncm9hZF9jbG9zdXJlJzogICAgICB7IGRpc3BsYXk6ICdSb2FkIENsb3N1cmUnIH0sXHJcbiAgJ2ZvcmVzdF9maXJlJzogICAgICAgeyBkaXNwbGF5OiAnRm9yZXN0IGZpcmUnIH0sXHJcbiAgJ2Zsb29kaW5nJzogICAgICAgICAgeyBkaXNwbGF5OiAnRmxvb2RpbmcnIH0sXHJcbiAgJ2RldG91cic6ICAgICAgICAgICAgeyBkaXNwbGF5OiAnRGV0b3VyJyB9LFxyXG4gICdvdGhlcic6ICAgICAgICAgICAgIHsgZGlzcGxheTogJ090aGVyJyB9XHJcbn07XHJcbi8qZXNmbXQtaWdub3JlLWVuZCovXHJcblxyXG5leHBvcnQgY29uc3QgQWxlcnQgPSBQb2ludC5leHRlbmQoIHtcclxuICBzcGVjaWZ5OiBmdW5jdGlvbiggbmFtZSwgbG9jYXRpb24gKSB7XHJcbiAgICBQb2ludC5wcm90b3R5cGUuc3BlY2lmeS5jYWxsKCB0aGlzLCAnYWxlcnQnLCBuYW1lLCBsb2NhdGlvbiApO1xyXG4gIH0sXHJcblxyXG4gIHNjaGVtYTogbWVyZ2VTY2hlbWFzKCBQb2ludC5wcm90b3R5cGUuc2NoZW1hLCB7XHJcbiAgICBwcm9wZXJ0aWVzOiB7XHJcbiAgICAgIHR5cGU6IHtcclxuICAgICAgICBlbnVtOiBrZXlzKCBhbGVydFR5cGVzIClcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0gKVxyXG59ICk7XHJcblxyXG5taXhpblZhbGlkYXRpb24oIEFsZXJ0ICk7XHJcblxyXG4vLyAjIFBvaW50IENvbGxlY3Rpb25cclxuLy8gQSBoZXRlcm9nZW5lb3VzIGNvbGxlY3Rpb24gb2Ygc2VydmljZXMgYW5kIGFsZXJ0cy4gUG91Y2hEQiBpcyBhYmxlIHRvIGZldGNoXHJcbi8vIHRoaXMgY29sbGVjdGlvbiBieSBsb29raW5nIGZvciBhbGwga2V5cyBzdGFydGluZyB3aXRoICdwb2ludC8nLlxyXG4vL1xyXG4vLyBUaGlzIGFsc28gaGFzIHRoZSBlZmZlY3Qgb2YgZmV0Y2hpbmcgY29tbWVudHMgZm9yIHBvaW50cy4gVE9ETzogaGFuZGxlXHJcbi8vIGBDb21tZW50YCBpbiB0aGUgbW9kZWwgZnVuY3Rpb24uXHJcbi8vXHJcbi8vIEEgY29ubmVjdGVkIFBvaW50Q29sbGVjdGlvbiBtdXN0IGJlIGFibGUgdG8gZ2VuZXJhdGUgY29ubmVjdGVkIEFsZXJ0cyBvclxyXG4vLyBTZXJ2aWNlcyBvbiBkZW1hbmRzLiBUaGVyZWZvcmUsIGlmIFBvaW50Q29sbGVjdGlvbiBpcyBjb25uZWN0ZWQsIGNvbm5lY3RcclxuLy8gbW9kZWxzIGJlZm9yZSByZXR1cm5pbmcgdGhlbS5cclxuZXhwb3J0IGNvbnN0IFBvaW50Q29sbGVjdGlvbiA9IENvdWNoQ29sbGVjdGlvbi5leHRlbmQoIHtcclxuICBpbml0aWFsaXplOiBmdW5jdGlvbiggbW9kZWxzLCBvcHRpb25zICkge1xyXG4gICAgQ291Y2hDb2xsZWN0aW9uLnByb3RvdHlwZS5pbml0aWFsaXplLmFwcGx5KCB0aGlzLCBhcmd1bWVudHMgKTtcclxuICAgIHRoaXMucG91Y2ggPSB7XHJcbiAgICAgIG9wdGlvbnM6IHtcclxuICAgICAgICBhbGxEb2NzOiB7IGluY2x1ZGVfZG9jczogdHJ1ZSwgLi4ua2V5c0JldHdlZW4oICdwb2ludC8nICkgfVxyXG4gICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIGNvbnN0IHtjb25uZWN0LCBkYXRhYmFzZX0gPSB0aGlzO1xyXG4gICAgdGhpcy5zZXJ2aWNlID0gY29ubmVjdCA/IGNvbm5lY3QoIGRhdGFiYXNlLCBTZXJ2aWNlICkgOiBTZXJ2aWNlO1xyXG4gICAgdGhpcy5hbGVydCA9IGNvbm5lY3QgPyBjb25uZWN0KCBkYXRhYmFzZSwgQWxlcnQgKSA6IEFsZXJ0O1xyXG4gIH0sXHJcblxyXG4gIG1vZGVsOiBmdW5jdGlvbiggYXR0cmlidXRlcywgb3B0aW9ucyApIHtcclxuICAgIGNvbnN0IHBhcnRzID0gcG9pbnRJZCggYXR0cmlidXRlcy5faWQgKTtcclxuICAgIGNvbnN0IG1hcCA9IHtcclxuICAgICAgJ3NlcnZpY2UnOiBvcHRpb25zLmNvbGxlY3Rpb24uc2VydmljZSxcclxuICAgICAgJ2FsZXJ0Jzogb3B0aW9ucy5jb2xsZWN0aW9uLmFsZXJ0XHJcbiAgICB9O1xyXG4gICAgY29uc3QgY29uc3RydWN0b3IgPSBtYXBbIHBhcnRzLnR5cGUgXTtcclxuICAgIGlmICggY29uc3RydWN0b3IgKSB7XHJcbiAgICAgIHJldHVybiBuZXcgY29uc3RydWN0b3IoIGF0dHJpYnV0ZXMsIG9wdGlvbnMgKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRocm93ICdBIHBvaW50IG11c3QgYmUgZWl0aGVyIGEgc2VydmljZSBvciBhbGVydCc7XHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgLy8gIyMgRmV0Y2ggQ292ZXIgSW1hZ2VzIGZvciBhbGwgUG9pbnRzXHJcbiAgLy8gUmV0dXJucyBhIHByb21pc2UgdGhhdCByZXNvbHZlcyB3aGVuIGFsbCBwb2ludHMgaW4gdGhlIGFycmF5IGhhdmVcclxuICAvLyB0aGVpciBjb3ZlciBpbWFnZXMgYXZhaWxhYmxlLlxyXG4gIGdldENvdmVyczogZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gUHJvbWlzZS5hbGwoIHRoaXMubW9kZWxzLm1hcCggcG9pbnQgPT4gcG9pbnQuZ2V0Q292ZXIoKSApICk7XHJcbiAgfSxcclxuXHJcbiAgLy8gIyMgR2V0IFJlZHV4IFJlcHJlc2VudGF0aW9uXHJcbiAgLy8gUmV0dXJuIGEgbmVzdGVkIG9iamVjdC9hcmFyeSByZXByZXNlbnRhdGlvbiBvZiB0aGUgY29sbGVjdGlvbiBzdWl0YWJsZSBmb3JcclxuICAvLyB1c2Ugd2l0aCByZWR1eC5cclxuICBzdG9yZTogZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gZnJvbVBhaXJzKCB0aGlzLm1vZGVscy5tYXAoIHBvaW50ID0+IFsgcG9pbnQuaWQsIHBvaW50LnN0b3JlKCkgXSApICk7XHJcbiAgfVxyXG59ICk7XHJcblxyXG4vLyAjIERpc3BsYXkgTmFtZSBmb3IgVHlwZVxyXG4vLyBHaXZlbiBhIHR5cGUga2V5IGZyb20gZWl0aGVyIHRoZSBzZXJ2aWNlIG9yIGFsZXJ0IHR5cGUgZW51bWVyYXRpb25zLFxyXG4vLyByZXR1cm4gdGhlIHR5cGUncyBkaXNwbGF5IHN0cmluZywgb3IgbnVsbCBpZiBpdCBkb2VzIG5vdCBleGlzdC5cclxuZXhwb3J0IGZ1bmN0aW9uIGRpc3BsYXkoIHR5cGUgKSB7XHJcbiAgY29uc3QgdmFsdWVzID0gc2VydmljZVR5cGVzWyB0eXBlIF0gfHwgYWxlcnRUeXBlc1sgdHlwZSBdO1xyXG4gIGlmICggdmFsdWVzICkge1xyXG4gICAgcmV0dXJuIHZhbHVlcy5kaXNwbGF5O1xyXG4gIH0gZWxzZSB7XHJcbiAgICByZXR1cm4gbnVsbDtcclxuICB9XHJcbn1cclxuXHJcbi8vICMgQ29tbWVudCBNb2RlbFxyXG4vLyBJbmZvcm1hdGlvbiBhYm91dCBhbGVydHMgYW5kIHNlcnZpY2VzIGVuY291bnRlcmVkIGJ5IGN5Y2xpc3RzIGlzIGxpa2VseVxyXG4vLyB0byBjaGFuZ2Ugd2l0aCB0aGUgc2Vhc29ucyBvciBvdGhlciByZWFzb25zLiBDeWNsaXN0cyBwbGFubmluZyB0aGUgbmV4dCBsZWdcclxuLy8gb2YgYSB0b3VyIHNob3VsZCBiZSBhYmxlIHRvIHJlYWQgdGhlIGV4cGVyaWVuY2VzIG9mIGN5Y2xpc3RzIGFoZWFkIG9mIHRoZW0uXHJcbi8vXHJcbi8vIEEgY29tbWVudCBtdXN0IGhhdmUgYm90aCBhIHJhdGluZyBhbmQgdGhlIHRleHQgb2YgdGhlIGNvbW1lbnQuIENvbW1lbnRzIGFyZVxyXG4vLyBsaW1pdGVkIHRvIDE0MCBjaGFyYWN0ZXJzIHRvIGVuc3VyZSB0aGV5IGRvIG5vdCBkZXZvbHZlIGludG8gZ2VuZXJhbCBhbGVydFxyXG4vLyBvciBzZXJ2aWNlIGluZm9ybWF0aW9uIHRoYXQgc2hvdWxkIHJlYWxseSBiZSBpbiB0aGUgZGVzY3JpcHRpb24uIFdlIHJlYWxseVxyXG4vLyB3YW50IHVzZXJzIG9mIHRoZSBCaWN5Y2xlIFRvdXJpbmcgQ29tcGFuaW9uIHRvIHByb3ZpZGUgY29tbWVudHMgdmVyaWZ5aW5nXHJcbi8vIGluZm8gYWJvdXQgcG9pbnRzLCBvciBsZXR0aW5nIG90aGVyIGN5Y2xpc3RzIGtub3cgYWJvdXQgY2hhbmdlcyBpbiB0aGVcclxuLy8gc2VydmljZSBvciBhbGVydC5cclxuXHJcbi8vICMjIENvbW1lbnQgTW9kZWwgVXJpXHJcbi8vIENvbW1lbnRzIGFyZSBzdG9yZWQgaW4gQ291Y2hEQiBpbiB0aGUgc2FtZSBkYXRhYmFzZSBhcyBwb2ludHMuIFRoZSBjb21tZW50XHJcbi8vIG1vZGVsIHVyaSBpcyBjb21wb3NlZCBvZiB0aHJlZSBwYXJ0czpcclxuLy8gIDEuIFRoZSBlbnRpcmUgaWQgb2YgdGhlIHJlbGF0ZWQgcG9pbnRcclxuLy8gIDIuIFRoZSBzdHJpbmcgJ2NvbW1lbnQvJ1xyXG4vLyAgMy4gQSB0aW1lIGJhc2VkIFVVSUQgdG8gdW5pcXVlbHkgaWRlbnRpZnkgY29tbWVudHNcclxuLy9cclxuLy8gV2UgZG9uJ3QgdXNlIGBkb2N1cmlgIGZvciB0aGUgY29tbWVudCBtb2RlbCB1cmlzIGJlY2F1c2Ugd2UgZG9uJ3QgaGF2ZSB0b1xyXG4vLyBwYXJzZSB0aGVtLlxyXG5cclxuY29uc3QgQ09NTUVOVF9NQVhfTEVOR1RIID0gMTQwO1xyXG5leHBvcnQgY29uc3QgQ29tbWVudCA9IENvdWNoTW9kZWwuZXh0ZW5kKCB7XHJcbiAgaWRBdHRyaWJ1dGU6ICdfaWQnLFxyXG5cclxuICAvLyAjIyBDb25zdHJ1Y3RvclxyXG4gIC8vIEdlbmVyYXRlIGBfaWRgLiBgcG9pbnRJZGAgbXVzdCBiZSBzcGVjaWZpZWQgaW4gb3B0aW9ucy5cclxuICBjb25zdHJ1Y3RvcjogZnVuY3Rpb24oIGF0dHJpYnV0ZXMsIG9wdGlvbnMgKSB7XHJcbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcclxuICAgIGlmICggIWF0dHJpYnV0ZXMudXVpZCApIHtcclxuICAgICAgYXR0cmlidXRlcy51dWlkID0gdXVpZC52MSgpO1xyXG4gICAgfVxyXG4gICAgaWYgKCAhYXR0cmlidXRlcy5faWQgJiYgb3B0aW9ucy5wb2ludElkICkge1xyXG4gICAgICBhdHRyaWJ1dGVzLl9pZCA9IG9wdGlvbnMucG9pbnRJZCArICcvY29tbWVudC8nICsgYXR0cmlidXRlcy51dWlkO1xyXG4gICAgfVxyXG4gICAgQ291Y2hNb2RlbC5hcHBseSggdGhpcywgYXJndW1lbnRzICk7XHJcbiAgfSxcclxuXHJcbiAgc2NoZW1hOiB7XHJcbiAgICB0eXBlOiAnb2JqZWN0JyxcclxuICAgIGFkZGl0aW9uYWxQcm9wZXJ0aWVzOiBmYWxzZSxcclxuICAgIHByb3BlcnRpZXM6IHtcclxuICAgICAgdXNlcm5hbWU6IHtcclxuICAgICAgICAndHlwZSc6ICdzdHJpbmcnXHJcbiAgICAgIH0sXHJcbiAgICAgIHRleHQ6IHtcclxuICAgICAgICAndHlwZSc6ICdzdHJpbmcnLFxyXG4gICAgICAgICdtYXhMZW5ndGgnOiBDT01NRU5UX01BWF9MRU5HVEhcclxuICAgICAgfSxcclxuICAgICAgcmF0aW5nOiB7XHJcbiAgICAgICAgdHlwZTogJ2ludGVnZXInLFxyXG4gICAgICAgIG1pbmltdW06IDEsXHJcbiAgICAgICAgbWF4aW11bTogNVxyXG4gICAgICB9LFxyXG4gICAgICB1dWlkOiB7XHJcbiAgICAgICAgdHlwZTogJ3N0cmluZydcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIHJlcXVpcmVkOiBbXHJcbiAgICAgICd1c2VybmFtZScsXHJcbiAgICAgICd0ZXh0JyxcclxuICAgICAgJ3JhdGluZycsXHJcbiAgICAgICd1dWlkJ1xyXG4gICAgXVxyXG4gIH1cclxufSwge1xyXG4gIE1BWF9MRU5HVEg6IENPTU1FTlRfTUFYX0xFTkdUSFxyXG59ICk7XHJcblxyXG5taXhpblZhbGlkYXRpb24oIENvbW1lbnQgKTtcclxuXHJcbi8vICMgQ29tbWVudCBDb2xsZWN0aW9uXHJcbi8vIEZldGNoIG9ubHkgY29tbWVudHMgYXNzb2NpYXRlZCB3aXRoIGEgZ2l2ZW4gcG9pbnQuXHJcbmV4cG9ydCBjb25zdCBDb21tZW50Q29sbGVjdGlvbiA9IENvdWNoQ29sbGVjdGlvbi5leHRlbmQoIHtcclxuICBpbml0aWFsaXplOiBmdW5jdGlvbiggbW9kZWxzLCBvcHRpb25zICkge1xyXG4gICAgQ291Y2hDb2xsZWN0aW9uLnByb3RvdHlwZS5pbml0aWFsaXplLmFwcGx5KCB0aGlzLCBhcmd1bWVudHMgKTtcclxuICAgIGNvbnN0IHBvaW50SWQgPSB0aGlzLnBvaW50SWQgPSBvcHRpb25zLnBvaW50SWQ7XHJcblxyXG4gICAgY29uc3QgY29ubmVjdCA9IHRoaXMuY29ubmVjdDtcclxuICAgIGNvbnN0IGRhdGFiYXNlID0gdGhpcy5kYXRhYmFzZTtcclxuICAgIHRoaXMuY29tbWVudCA9IGNvbm5lY3QgPyBjb25uZWN0KCBkYXRhYmFzZSwgQ29tbWVudCApIDogQ29tbWVudDtcclxuXHJcbiAgICB0aGlzLnBvdWNoID0ge1xyXG4gICAgICBvcHRpb25zOiB7XHJcbiAgICAgICAgYWxsRG9jczoge1xyXG4gICAgICAgICAgLi4ua2V5c0JldHdlZW4oIHBvaW50SWQgKyAnL2NvbW1lbnQnICksXHJcbiAgICAgICAgICBpbmNsdWRlX2RvY3M6IHRydWVcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH07XHJcbiAgfSxcclxuXHJcbiAgbW9kZWw6IGZ1bmN0aW9uKCBhdHRyaWJ1dGVzLCBvcHRpb25zICkge1xyXG4gICAgY29uc3Qge2NvbW1lbnQsIHBvaW50SWR9ID0gb3B0aW9ucy5jb2xsZWN0aW9uO1xyXG4gICAgcmV0dXJuIG5ldyBjb21tZW50KCBhdHRyaWJ1dGVzLCB7IHBvaW50SWQsIC4uLm9wdGlvbnMgfSApO1xyXG4gIH1cclxufSApO1xyXG4iXX0=