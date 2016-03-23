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
  // those. We should not validate the _attachments key.
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

var defaultSchedule = { 'default': [] };

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

  getCovers: function getCovers() {
    return Promise.all(this.models.map(function (point) {
      return point.getCover();
    }));
  },

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tb2RlbC9wb2ludC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O1FBZ1lnQixPQUFPLEdBQVAsT0FBTzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWxXdkIsSUFBTSxPQUFPLEdBQUssT0FBTyxNQUFNLEtBQUssV0FBVyxBQUFFOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQyxBQWtCbEQsSUFBTSxPQUFPLEdBQUcsaUJBQU8sS0FBSyxDQUFFLDRCQUE0QixDQUFFLENBQUM7O0FBRXRELElBQU0sS0FBSyxXQUFMLEtBQUssR0FBRyxpQkFBVyxNQUFNLENBQUU7QUFDdEMsYUFBVyxFQUFFLEtBQUs7O0FBRWxCLFlBQVUsRUFBRSxvQkFBVSxVQUFVLEVBQUUsT0FBTyxFQUFHO0FBQzFDLHFCQUFXLFNBQVMsQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFFLElBQUksRUFBRSxTQUFTLENBQUUsQ0FBQztBQUN6RCxRQUFJLENBQUMsR0FBRyxDQUFFLFlBQVksRUFBRSxJQUFJLElBQUksRUFBRSxDQUFDLFdBQVcsRUFBRSxDQUFFLENBQUM7QUFDbkQsUUFBSSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUM7R0FDdkI7Ozs7O0FBS0QsU0FBTyxFQUFFLGlCQUFVLElBQUksRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFHO0FBQ3hDLFFBQUssSUFBSSxFQUFHO3FDQUNTLFFBQVE7O1VBQXBCLEdBQUc7VUFBRSxHQUFHOztBQUNmLFVBQU0sR0FBRyxHQUFHLE9BQU8sQ0FBRTtBQUNuQixZQUFJLEVBQUUsSUFBSTtBQUNWLFlBQUksRUFBRSxvQkFBVyxJQUFJLENBQUU7QUFDdkIsZUFBTyxFQUFFLG1CQUFTLE1BQU0sQ0FBRSxHQUFHLEVBQUUsR0FBRyxDQUFFO09BQ3JDLENBQUUsQ0FBQztBQUNKLFVBQUksQ0FBQyxHQUFHLENBQUUsRUFBRSxHQUFHLEVBQUgsR0FBRyxFQUFFLElBQUksRUFBSixJQUFJLEVBQUUsSUFBSSxFQUFKLElBQUksRUFBRSxRQUFRLEVBQVIsUUFBUSxFQUFFLENBQUUsQ0FBQztLQUMzQyxNQUFNO3dCQUNvQixJQUFJLENBQUMsVUFBVTtVQUFqQyxLQUFJLGVBQUosSUFBSTtVQUFFLFVBQVEsZUFBUixRQUFROztzQ0FDRixVQUFROztVQUFwQixHQUFHO1VBQUUsR0FBRzs7QUFDZixVQUFNLEdBQUcsR0FBRyxPQUFPLENBQUU7QUFDbkIsWUFBSSxFQUFFLElBQUk7QUFDVixZQUFJLEVBQUUsb0JBQVcsS0FBSSxDQUFFO0FBQ3ZCLGVBQU8sRUFBRSxtQkFBUyxNQUFNLENBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBRTtPQUNyQyxDQUFFLENBQUM7QUFDSixVQUFJLENBQUMsR0FBRyxDQUFFLEVBQUUsR0FBRyxFQUFILEdBQUcsRUFBRSxDQUFFLENBQUM7S0FDckI7R0FDRjs7Ozs7QUFLRCxXQUFTLEVBQUUsQ0FDVCxjQUFjLENBQ2Y7O0FBRUQsVUFBUSxFQUFFLG9CQUFXO0FBQ25CLFdBQU87QUFDTCxVQUFJLEVBQUUsS0FBSztLQUNaLENBQUM7R0FDSDs7QUFFRCxRQUFNLEVBQUU7QUFDTixRQUFJLEVBQUUsUUFBUTtBQUNkLHdCQUFvQixFQUFFLEtBQUs7QUFDM0IsY0FBVSxFQUFFO0FBQ1YsVUFBSSxFQUFFO0FBQ0osWUFBSSxFQUFFLFFBQVE7T0FDZjtBQUNELGNBQVEsRUFBRTtBQUNSLFlBQUksRUFBRSxPQUFPO0FBQ2IsZ0JBQVEsRUFBRSxDQUFDO0FBQ1gsZ0JBQVEsRUFBRSxDQUFDO0FBQ1gsYUFBSyxFQUFFO0FBQ0wsY0FBSSxFQUFFLFFBQVE7U0FDZjtPQUNGO0FBQ0QsVUFBSSxFQUFFO0FBQ0osWUFBSSxFQUFFLFFBQVE7T0FDZjtBQUNELGdCQUFVLEVBQUU7QUFDVixZQUFJLEVBQUUsUUFBUTtBQUNkLGNBQU0sRUFBRSxXQUFXO09BQ3BCO0FBQ0QsaUJBQVcsRUFBRTtBQUNYLFlBQUksRUFBRSxRQUFRO09BQ2Y7QUFDRCxVQUFJLEVBQUU7QUFDSixZQUFJLEVBQUUsU0FBUztPQUNoQjtLQUNGO0FBQ0QsWUFBUSxFQUFFLENBQ1IsTUFBTSxFQUNOLFVBQVUsRUFDVixNQUFNLEVBQ04sWUFBWSxFQUNaLE1BQU0sQ0FDUDtHQUNGOztBQUVELE9BQUssRUFBRSxpQkFBVztBQUNoQixxQkFBVyxTQUFTLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBRSxJQUFJLEVBQUUsU0FBUyxDQUFFLENBQUM7QUFDcEQsUUFBSSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUM7R0FDdkI7Ozs7O0FBS0QsT0FBSyxFQUFFLGlCQUFXOzs7QUFDaEIsV0FBTyxpQkFBVyxTQUFTLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBRSxJQUFJLEVBQUUsU0FBUyxDQUFFLENBQUMsSUFBSSxDQUFFLFVBQUEsR0FBRyxFQUFJO0FBQ3RFLGFBQU8sTUFBSyxRQUFRLENBQUUsR0FBRyxDQUFFLENBQUM7S0FDN0IsQ0FBRSxDQUFDO0dBQ0w7Ozs7Ozs7O0FBUUQsVUFBUSxFQUFFLGtCQUFVLEdBQUcsRUFBRzs7O0FBQ3hCLFdBQU8sT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDLElBQUksQ0FBRSxZQUFNO0FBQ25DLFVBQU0sUUFBUSxHQUFHLHNCQUFVLE9BQUssV0FBVyxFQUFFLEVBQUUsV0FBVyxDQUFFLENBQUM7QUFDN0QsVUFBSyxPQUFPLElBQUksUUFBUSxFQUFHO0FBQ3pCLGVBQU8sT0FBSyxVQUFVLENBQUUsV0FBVyxDQUFFLENBQUM7T0FDdkMsTUFBTTtBQUNMLGVBQU87T0FDUjtLQUNGLENBQUUsQ0FBQyxJQUFJLENBQUUsVUFBQSxJQUFJLEVBQUk7QUFDaEIsVUFBSSxJQUFJLEVBQUc7QUFDVCxlQUFLLFFBQVEsR0FBRywrQkFBaUIsSUFBSSxDQUFFLENBQUM7T0FDekM7S0FDRixDQUFFLENBQUMsSUFBSSxDQUFFLFlBQU07QUFDZCxhQUFPLEdBQUcsQ0FBQztLQUNaLENBQUUsQ0FBQztHQUNMOzs7Ozs7Ozs7QUFTRCxVQUFRLEVBQUUsa0JBQVUsSUFBSSxFQUFHO0FBQ3pCLFFBQUksT0FBTyxFQUFHO0FBQ1osVUFBSSxDQUFDLFFBQVEsR0FBRywrQkFBaUIsSUFBSSxDQUFFLENBQUM7S0FDekM7R0FDRjs7Ozs7QUFLRCxPQUFLLEVBQUUsaUJBQVc7QUFDaEIsd0JBQVksSUFBSSxDQUFDLE1BQU0sRUFBRSxJQUFFLFFBQVEsRUFBRSxJQUFJLENBQUMsUUFBUSxJQUFHO0dBQ3REO0NBQ0YsRUFBRTtBQUNELEtBQUcsRUFBRSxPQUFPOztBQUVaLEtBQUcsRUFBRSxjQUFBLEVBQUUsRUFBSTttQkFDTSxPQUFPLENBQUUsRUFBRSxDQUFFOztRQUFyQixJQUFJLFlBQUosSUFBSTs7QUFDWCxRQUFLLElBQUksS0FBSyxTQUFTLEVBQUc7QUFDeEIsYUFBTyxJQUFJLE9BQU8sQ0FBRSxFQUFFLEdBQUcsRUFBRSxFQUFFLEVBQUUsQ0FBRSxDQUFDO0tBQ25DLE1BQU0sSUFBSyxJQUFJLEtBQUssT0FBTyxFQUFHO0FBQzdCLGFBQU8sSUFBSSxLQUFLLENBQUUsRUFBRSxHQUFHLEVBQUUsRUFBRSxFQUFFLENBQUUsQ0FBQztLQUNqQyxNQUFNO0FBQ0wsWUFBTSwyQ0FBMkMsQ0FBQztLQUNuRDtHQUNGO0NBQ0YsQ0FBRTs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFDLEFBbUJHLElBQU0sWUFBWSxXQUFaLFlBQVksR0FBRztBQUMxQixXQUFTLEVBQVksRUFBRSxPQUFPLEVBQUUsU0FBUyxFQUFFO0FBQzNDLE9BQUssRUFBZ0IsRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFO0FBQ3ZDLHFCQUFtQixFQUFFLEVBQUUsT0FBTyxFQUFFLGlCQUFpQixFQUFFO0FBQ25ELGFBQVcsRUFBVSxFQUFFLE9BQU8sRUFBRSxXQUFXLEVBQUU7QUFDN0MsU0FBTyxFQUFjLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRTtBQUN6QyxjQUFZLEVBQVMsRUFBRSxPQUFPLEVBQUUsWUFBWSxFQUFFO0FBQzlDLHFCQUFtQixFQUFFLEVBQUUsT0FBTyxFQUFFLG1CQUFtQixFQUFFO0FBQ3JELG9CQUFrQixFQUFHLEVBQUUsT0FBTyxFQUFFLG9CQUFvQixFQUFFO0FBQ3RELG9CQUFrQixFQUFHLEVBQUUsT0FBTyxFQUFFLG9CQUFvQixFQUFFO0FBQ3RELFdBQVMsRUFBWSxFQUFFLE9BQU8sRUFBRSxTQUFTLEVBQUU7QUFDM0MsVUFBUSxFQUFhLEVBQUUsT0FBTyxFQUFFLFFBQVEsRUFBRTtBQUMxQyxjQUFZLEVBQVMsRUFBRSxPQUFPLEVBQUUsWUFBWSxFQUFFO0FBQzlDLFNBQU8sRUFBYyxFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUU7QUFDekMsU0FBTyxFQUFjLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRTtBQUN6QyxlQUFhLEVBQVEsRUFBRSxPQUFPLEVBQUUsYUFBYSxFQUFFO0FBQy9DLFdBQVMsRUFBWSxFQUFFLE9BQU8sRUFBRSxTQUFTLEVBQUU7QUFDM0MsVUFBUSxFQUFhLEVBQUUsT0FBTyxFQUFFLFFBQVEsRUFBRTtBQUMxQyxpQkFBZSxFQUFNLEVBQUUsT0FBTyxFQUFFLGVBQWUsRUFBRTtBQUNqRCxhQUFXLEVBQVUsRUFBRSxPQUFPLEVBQUUsV0FBVyxFQUFFO0FBQzdDLGNBQVksRUFBUyxFQUFFLE9BQU8sRUFBRSxZQUFZLEVBQUU7QUFDOUMsWUFBVSxFQUFXLEVBQUUsT0FBTyxFQUFFLFVBQVUsRUFBRTtBQUM1QyxlQUFhLEVBQVEsRUFBRSxPQUFPLEVBQUUsYUFBYSxFQUFFO0FBQy9DLGNBQVksRUFBUyxFQUFFLE9BQU8sRUFBRSxZQUFZLEVBQUU7QUFDOUMsU0FBTyxFQUFjLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRTtDQUMxQzs7O0FBQUMsQUFHRixJQUFNLGVBQWUsR0FBRyxFQUFFLFNBQVMsRUFBRSxFQUFFLEVBQUUsQ0FBQzs7QUFFbkMsSUFBTSxPQUFPLFdBQVAsT0FBTyxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUU7QUFDbkMsU0FBTyxFQUFFLGlCQUFVLElBQUksRUFBRSxRQUFRLEVBQUc7QUFDbEMsU0FBSyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLFFBQVEsQ0FBRSxDQUFDO0dBQ2pFOztBQUVELFVBQVEsRUFBRSxvQkFBVztBQUNuQix3QkFDSyxLQUFLLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQztBQUNsRCxlQUFTLEVBQUUsRUFBRTtBQUNiLGNBQVEsRUFBRSxFQUFFLFNBQVMsRUFBRSxFQUFFLEVBQUU7QUFDM0IsY0FBUSxFQUFFLEtBQUs7T0FDZjtHQUNIOztBQUVELFFBQU0sRUFBRSxtQ0FBYyxLQUFLLENBQUMsU0FBUyxDQUFDLE1BQU0sRUFBRTtBQUM1QyxjQUFVLEVBQUU7QUFDVixVQUFJLEVBQUU7QUFDSixZQUFJLEVBQUUsa0JBQU0sWUFBWSxDQUFFO09BQzNCO0FBQ0QsZUFBUyxFQUFFO0FBQ1QsWUFBSSxFQUFFLE9BQU87QUFDYixhQUFLLEVBQUU7QUFDTCxjQUFJLEVBQUUsUUFBUTtBQUNkLGNBQUksRUFBRSxrQkFBTSxZQUFZLENBQUU7U0FDM0I7T0FDRjtBQUNELGFBQU8sRUFBRTtBQUNQLFlBQUksRUFBRSxRQUFRO09BQ2Y7QUFDRCxjQUFRLEVBQUU7QUFDUixZQUFJLEVBQUUsUUFBUTtPQUNmO0FBQ0QsY0FBUSxFQUFFO0FBQ1IsWUFBSSxFQUFFLFNBQVM7T0FDaEI7QUFDRCxXQUFLLEVBQUU7QUFDTCxZQUFJLEVBQUUsUUFBUTtPQUNmO0FBQ0QsYUFBTyxFQUFFO0FBQ1AsWUFBSSxFQUFFLFFBQVE7QUFDZCxjQUFNLEVBQUUsS0FBSztPQUNkO0tBQ0Y7QUFDRCxZQUFRLEVBQUUsQ0FDUixVQUFVLENBQ1g7R0FDRixDQUFFO0NBQ0osQ0FBRTs7O0FBQUMsQUFHSixzQ0FBaUIsT0FBTyxDQUFFOzs7Ozs7O0FBQUMsQUFPcEIsSUFBTSxVQUFVLFdBQVYsVUFBVSxHQUFHO0FBQ3hCLGdCQUFjLEVBQU8sRUFBRSxPQUFPLEVBQUUsY0FBYyxFQUFFO0FBQ2hELGVBQWEsRUFBUSxFQUFFLE9BQU8sRUFBRSxhQUFhLEVBQUU7QUFDL0MsWUFBVSxFQUFXLEVBQUUsT0FBTyxFQUFFLFVBQVUsRUFBRTtBQUM1QyxVQUFRLEVBQWEsRUFBRSxPQUFPLEVBQUUsUUFBUSxFQUFFO0FBQzFDLFNBQU8sRUFBYyxFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUU7Q0FDMUM7OztBQUFDLEFBR0ssSUFBTSxLQUFLLFdBQUwsS0FBSyxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUU7QUFDakMsU0FBTyxFQUFFLGlCQUFVLElBQUksRUFBRSxRQUFRLEVBQUc7QUFDbEMsU0FBSyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLFFBQVEsQ0FBRSxDQUFDO0dBQy9EOztBQUVELFFBQU0sRUFBRSxtQ0FBYyxLQUFLLENBQUMsU0FBUyxDQUFDLE1BQU0sRUFBRTtBQUM1QyxjQUFVLEVBQUU7QUFDVixVQUFJLEVBQUU7QUFDSixZQUFJLEVBQUUsa0JBQU0sVUFBVSxDQUFFO09BQ3pCO0tBQ0Y7R0FDRixDQUFFO0NBQ0osQ0FBRSxDQUFDOztBQUVKLHNDQUFpQixLQUFLLENBQUU7Ozs7Ozs7Ozs7OztBQUFDLEFBWWxCLElBQU0sZUFBZSxXQUFmLGVBQWUsR0FBRyxzQkFBZ0IsTUFBTSxDQUFFO0FBQ3JELFlBQVUsRUFBRSxvQkFBVSxNQUFNLEVBQUUsT0FBTyxFQUFHO0FBQ3RDLDBCQUFnQixTQUFTLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBRSxJQUFJLEVBQUUsU0FBUyxDQUFFLENBQUM7QUFDOUQsUUFBSSxDQUFDLEtBQUssR0FBRztBQUNYLGFBQU8sRUFBRTtBQUNQLGVBQU8sYUFBSSxZQUFZLEVBQUUsSUFBSSxJQUFLLHVCQUFhLFFBQVEsQ0FBRSxDQUFFO09BQzVEO0tBQ0YsQ0FBQzs7UUFFSyxPQUFPLEdBQWMsSUFBSSxDQUF6QixPQUFPO1FBQUUsUUFBUSxHQUFJLElBQUksQ0FBaEIsUUFBUTs7QUFDeEIsUUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLEdBQUcsT0FBTyxDQUFFLFFBQVEsRUFBRSxPQUFPLENBQUUsR0FBRyxPQUFPLENBQUM7QUFDaEUsUUFBSSxDQUFDLEtBQUssR0FBRyxPQUFPLEdBQUcsT0FBTyxDQUFFLFFBQVEsRUFBRSxLQUFLLENBQUUsR0FBRyxLQUFLLENBQUM7R0FDM0Q7O0FBRUQsT0FBSyxFQUFFLGVBQVUsVUFBVSxFQUFFLE9BQU8sRUFBRztBQUNyQyxRQUFNLEtBQUssR0FBRyxPQUFPLENBQUUsVUFBVSxDQUFDLEdBQUcsQ0FBRSxDQUFDO0FBQ3hDLFFBQU0sR0FBRyxHQUFHO0FBQ1YsZUFBUyxFQUFFLE9BQU8sQ0FBQyxVQUFVLENBQUMsT0FBTztBQUNyQyxhQUFPLEVBQUUsT0FBTyxDQUFDLFVBQVUsQ0FBQyxLQUFLO0tBQ2xDLENBQUM7QUFDRixRQUFNLFdBQVcsR0FBRyxHQUFHLENBQUUsS0FBSyxDQUFDLElBQUksQ0FBRSxDQUFDO0FBQ3RDLFFBQUssV0FBVyxFQUFHO0FBQ2pCLGFBQU8sSUFBSSxXQUFXLENBQUUsVUFBVSxFQUFFLE9BQU8sQ0FBRSxDQUFDO0tBQy9DLE1BQU07QUFDTCxZQUFNLDJDQUEyQyxDQUFDO0tBQ25EO0dBQ0Y7O0FBRUQsV0FBUyxFQUFFLHFCQUFXO0FBQ3BCLFdBQU8sT0FBTyxDQUFDLEdBQUcsQ0FBRSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBRSxVQUFBLEtBQUs7YUFBSSxLQUFLLENBQUMsUUFBUSxFQUFFO0tBQUEsQ0FBRSxDQUFFLENBQUM7R0FDcEU7O0FBRUQsT0FBSyxFQUFFLGlCQUFXO0FBQ2hCLFdBQU8sdUJBQVcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUUsVUFBQSxLQUFLO2FBQUksQ0FBRSxLQUFLLENBQUMsRUFBRSxFQUFFLEtBQUssQ0FBQyxLQUFLLEVBQUUsQ0FBRTtLQUFBLENBQUUsQ0FBRSxDQUFDO0dBQzdFO0NBQ0YsQ0FBRTs7Ozs7QUFBQyxBQUtHLFNBQVMsT0FBTyxDQUFFLElBQUksRUFBRztBQUM5QixNQUFNLE1BQU0sR0FBRyxZQUFZLENBQUUsSUFBSSxDQUFFLElBQUksVUFBVSxDQUFFLElBQUksQ0FBRSxDQUFDO0FBQzFELE1BQUssTUFBTSxFQUFHO0FBQ1osV0FBTyxNQUFNLENBQUMsT0FBTyxDQUFDO0dBQ3ZCLE1BQU07QUFDTCxXQUFPLElBQUksQ0FBQztHQUNiO0NBQ0Y7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLEFBd0JELElBQU0sa0JBQWtCLEdBQUcsR0FBRyxDQUFDO0FBQ3hCLElBQU0sT0FBTyxXQUFQLE9BQU8sR0FBRyxpQkFBVyxNQUFNLENBQUU7QUFDeEMsYUFBVyxFQUFFLEtBQUs7Ozs7QUFJbEIsYUFBVyxFQUFFLHFCQUFVLFVBQVUsRUFBRSxPQUFPLEVBQUc7QUFDM0MsV0FBTyxHQUFHLE9BQU8sSUFBSSxFQUFFLENBQUM7QUFDeEIsUUFBSyxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUc7QUFDdEIsZ0JBQVUsQ0FBQyxJQUFJLEdBQUcsbUJBQUssRUFBRSxFQUFFLENBQUM7S0FDN0I7QUFDRCxRQUFLLENBQUMsVUFBVSxDQUFDLEdBQUcsSUFBSSxPQUFPLENBQUMsT0FBTyxFQUFHO0FBQ3hDLGdCQUFVLENBQUMsR0FBRyxHQUFHLE9BQU8sQ0FBQyxPQUFPLEdBQUcsV0FBVyxHQUFHLFVBQVUsQ0FBQyxJQUFJLENBQUM7S0FDbEU7QUFDRCxxQkFBVyxLQUFLLENBQUUsSUFBSSxFQUFFLFNBQVMsQ0FBRSxDQUFDO0dBQ3JDOztBQUVELFFBQU0sRUFBRTtBQUNOLFFBQUksRUFBRSxRQUFRO0FBQ2Qsd0JBQW9CLEVBQUUsS0FBSztBQUMzQixjQUFVLEVBQUU7QUFDVixjQUFRLEVBQUU7QUFDUixjQUFNLEVBQUUsUUFBUTtPQUNqQjtBQUNELFVBQUksRUFBRTtBQUNKLGNBQU0sRUFBRSxRQUFRO0FBQ2hCLG1CQUFXLEVBQUUsa0JBQWtCO09BQ2hDO0FBQ0QsWUFBTSxFQUFFO0FBQ04sWUFBSSxFQUFFLFNBQVM7QUFDZixlQUFPLEVBQUUsQ0FBQztBQUNWLGVBQU8sRUFBRSxDQUFDO09BQ1g7QUFDRCxVQUFJLEVBQUU7QUFDSixZQUFJLEVBQUUsUUFBUTtPQUNmO0tBQ0Y7QUFDRCxZQUFRLEVBQUUsQ0FDUixVQUFVLEVBQ1YsTUFBTSxFQUNOLFFBQVEsRUFDUixNQUFNLENBQ1A7R0FDRjtDQUNGLEVBQUU7QUFDRCxZQUFVLEVBQUUsa0JBQWtCO0NBQy9CLENBQUUsQ0FBQzs7QUFFSixzQ0FBaUIsT0FBTyxDQUFFOzs7O0FBQUMsQUFJcEIsSUFBTSxpQkFBaUIsV0FBakIsaUJBQWlCLEdBQUcsc0JBQWdCLE1BQU0sQ0FBRTtBQUN2RCxZQUFVLEVBQUUsb0JBQVUsTUFBTSxFQUFFLE9BQU8sRUFBRztBQUN0QywwQkFBZ0IsU0FBUyxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUUsSUFBSSxFQUFFLFNBQVMsQ0FBRSxDQUFDO0FBQzlELFFBQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQzs7QUFFL0MsUUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQztBQUM3QixRQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDO0FBQy9CLFFBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxHQUFHLE9BQU8sQ0FBRSxRQUFRLEVBQUUsT0FBTyxDQUFFLEdBQUcsT0FBTyxDQUFDOztBQUVoRSxRQUFJLENBQUMsS0FBSyxHQUFHO0FBQ1gsYUFBTyxFQUFFO0FBQ1AsZUFBTyxlQUNGLHVCQUFhLE9BQU8sR0FBRyxVQUFVLENBQUU7QUFDdEMsc0JBQVksRUFBRSxJQUFJO1VBQ25CO09BQ0Y7S0FDRixDQUFDO0dBQ0g7O0FBRUQsT0FBSyxFQUFFLGVBQVUsVUFBVSxFQUFFLE9BQU8sRUFBRzs4QkFDVixPQUFPLENBQUMsVUFBVTtRQUF0QyxPQUFPLHVCQUFQLE9BQU87UUFBRSxPQUFPLHVCQUFQLE9BQU87O0FBQ3ZCLFdBQU8sSUFBSSxPQUFPLENBQUUsVUFBVSxhQUFJLE9BQU8sRUFBUCxPQUFPLElBQUssT0FBTyxFQUFJLENBQUM7R0FDM0Q7Q0FDRixDQUFFLENBQUMiLCJmaWxlIjoicG9pbnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBidGMtYXBwLXNlcnZlciAtLSBTZXJ2ZXIgZm9yIHRoZSBCaWN5Y2xlIFRvdXJpbmcgQ29tcGFuaW9uXG4gKiBDb3B5cmlnaHQgwqkgMjAxNiBBZHZlbnR1cmUgQ3ljbGluZyBBc3NvY2lhdGlvblxuICpcbiAqIFRoaXMgZmlsZSBpcyBwYXJ0IG9mIGJ0Yy1hcHAtc2VydmVyLlxuICpcbiAqIGJ0Yy1hcHAtc2VydmVyIGlzIGZyZWUgc29mdHdhcmU6IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnlcbiAqIGl0IHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgQWZmZXJvIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGFzIHB1Ymxpc2hlZCBieVxuICogdGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiwgZWl0aGVyIHZlcnNpb24gMyBvZiB0aGUgTGljZW5zZSwgb3JcbiAqIChhdCB5b3VyIG9wdGlvbikgYW55IGxhdGVyIHZlcnNpb24uXG4gKlxuICogYnRjLWFwcC1zZXJ2ZXIgaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCxcbiAqIGJ1dCBXSVRIT1VUIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mXG4gKiBNRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuICBTZWUgdGhlXG4gKiBBZmZlcm8gR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmUgZGV0YWlscy5cbiAqXG4gKiBZb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBBZmZlcm8gR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbiAqIGFsb25nIHdpdGggRm9vYmFyLiAgSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuICovXG5cbmltcG9ydCB7IG1peGluVmFsaWRhdGlvbiwgbWVyZ2VTY2hlbWFzIH0gZnJvbSAnLi92YWxpZGF0aW9uLW1peGluJztcbmltcG9ydCB7IENvdWNoTW9kZWwsIENvdWNoQ29sbGVjdGlvbiwga2V5c0JldHdlZW4gfSBmcm9tICcuL2Jhc2UnO1xuXG5pbXBvcnQgeyBrZXlzLCBmcm9tUGFpcnMsIGluY2x1ZGVzIH0gZnJvbSAnbG9kYXNoJztcbmltcG9ydCB7IGNyZWF0ZU9iamVjdFVSTCB9IGZyb20gJ2Jsb2ItdXRpbCc7XG5cbmltcG9ydCBkb2N1cmkgZnJvbSAnZG9jdXJpJztcbmltcG9ydCBuZ2VvaGFzaCBmcm9tICduZ2VvaGFzaCc7XG5pbXBvcnQgbm9ybWFsaXplIGZyb20gJ3RvLWlkJztcbmltcG9ydCB1dWlkIGZyb20gJ25vZGUtdXVpZCc7XG5cbmNvbnN0IGJyb3dzZXIgPSAoIHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICk7XG5cbi8vICMgUG9pbnQgTW9kZWxcbi8vIFRoZSBwb2ludCByZXByZXNlbnRzIGEgbG9jYXRpb24gb24gdGhlIG1hcCB3aXRoIGFzc29jaWF0ZWQgbWV0YWRhdGEsIGdlb2RhdGEsXG4vLyBhbmQgdXNlciBwcm92aWRlZCBkYXRhLiBUaGUgcG9pbnQgaXMgdGhlIGJhc2Ugc2hhcmVkIGJ5IHNlcnZpY2VzIGFuZCBhbGVydHMuXG4vL1xuLy8gVGhlIEpTT04gc2NoZW1hIHN0b3JlZCBpbiBgUG9pbnRgLCBhbmQgYXMgcGF0Y2hlZCBieSBgU2VydmljZWAgYW5kIGBBbGVydGAsXG4vLyBpcyB0aGUgYXV0aG9yaXRhdGl2ZSBkZWZpbml0aW9uIG9mIHRoZSBwb2ludCByZWNvcmQuXG5cbi8vICMjIFBvaW50IE1vZGVsIFVyaVxuLy8gUG9pbnRzIGFyZSBzdG9yZWQgaW4gQ291Y2hEQi4gQ291Y2hEQiBkb2N1bWVudHMgY2FuIGhhdmUgcmljaCBpZCBzdHJpbmdzXG4vLyB0byBoZWxwIHN0b3JlIGFuZCBhY2Nlc3MgZGF0YSB3aXRob3V0IE1hcFJlZHVjZSBqb2JzLlxuLy9cbi8vIFRoZSBwb2ludCBtb2RlbCB1cmkgaXMgY29tcG9zZWQgb2YgZm91ciBwYXJ0czpcbi8vICAxLiBUaGUgc3RyaW5nICdwb2ludC8nYFxuLy8gIDIuIFRoZSB0eXBlIG9mIHBvaW50LCBlaXRoZXIgJ3NlcnZpY2UnIG9yICdhbGVydCdcbi8vICAzLiBUaGUgbm9ybWFsaXplZCBuYW1lIG9mIHRoZSBwb2ludFxuLy8gIDQuIFRoZSBwb2ludCdzIGdlb2hhc2hcbmNvbnN0IHBvaW50SWQgPSBkb2N1cmkucm91dGUoICdwb2ludC86dHlwZS86bmFtZS86Z2VvaGFzaCcgKTtcblxuZXhwb3J0IGNvbnN0IFBvaW50ID0gQ291Y2hNb2RlbC5leHRlbmQoIHtcbiAgaWRBdHRyaWJ1dGU6ICdfaWQnLFxuXG4gIGluaXRpYWxpemU6IGZ1bmN0aW9uKCBhdHRyaWJ1dGVzLCBvcHRpb25zICkge1xuICAgIENvdWNoTW9kZWwucHJvdG90eXBlLmluaXRpYWxpemUuYXBwbHkoIHRoaXMsIGFyZ3VtZW50cyApO1xuICAgIHRoaXMuc2V0KCAnY3JlYXRlZF9hdCcsIG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSApO1xuICAgIHRoaXMuY292ZXJVcmwgPSBmYWxzZTtcbiAgfSxcblxuICAvLyAjIyBTcGVjaWZ5XG4gIC8vIEZpbGwgaW4gYF9pZGAgZnJvbSB0aGUgY29tcG9uZW50cyBvZiB0aGUgcG9pbnQgbW9kZWwgdXJpLlxuICAvLyBQdWxsIHZhbHVlcyBmcm9tIGBhdHRyaWJ1dGVzYCBpZiBuYW1lIGFuZCBsb2NhdGlvbiBhcmUgdW5kZWZpbmVkLlxuICBzcGVjaWZ5OiBmdW5jdGlvbiggdHlwZSwgbmFtZSwgbG9jYXRpb24gKSB7XG4gICAgaWYgKCBuYW1lICkge1xuICAgICAgY29uc3QgW2xhdCwgbG5nXSA9IGxvY2F0aW9uO1xuICAgICAgY29uc3QgX2lkID0gcG9pbnRJZCgge1xuICAgICAgICB0eXBlOiB0eXBlLFxuICAgICAgICBuYW1lOiBub3JtYWxpemUoIG5hbWUgKSxcbiAgICAgICAgZ2VvaGFzaDogbmdlb2hhc2guZW5jb2RlKCBsYXQsIGxuZyApXG4gICAgICB9ICk7XG4gICAgICB0aGlzLnNldCggeyBfaWQsIHR5cGUsIG5hbWUsIGxvY2F0aW9uIH0gKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3Qge25hbWUsIGxvY2F0aW9ufSA9IHRoaXMuYXR0cmlidXRlcztcbiAgICAgIGNvbnN0IFtsYXQsIGxuZ10gPSBsb2NhdGlvbjtcbiAgICAgIGNvbnN0IF9pZCA9IHBvaW50SWQoIHtcbiAgICAgICAgdHlwZTogdHlwZSxcbiAgICAgICAgbmFtZTogbm9ybWFsaXplKCBuYW1lICksXG4gICAgICAgIGdlb2hhc2g6IG5nZW9oYXNoLmVuY29kZSggbGF0LCBsbmcgKVxuICAgICAgfSApO1xuICAgICAgdGhpcy5zZXQoIHsgX2lkIH0gKTtcbiAgICB9XG4gIH0sXG5cbiAgLy8gIyMgU2FmZWd1YXJkIGZvciBQb2ludHNcbiAgLy8gUG9pbnRzIGhhdmUgaW1hZ2UgYXR0YWNobWVudHMsIHNvIHdlIHNob3VsZCBsZXQgYmFja2JvbmUgcG91Y2ggaGFuZGxlXG4gIC8vIHRob3NlLiBXZSBzaG91bGQgbm90IHZhbGlkYXRlIHRoZSBfYXR0YWNobWVudHMga2V5LlxuICBzYWZlZ3VhcmQ6IFtcbiAgICAnX2F0dGFjaG1lbnRzJ1xuICBdLFxuXG4gIGRlZmF1bHRzOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4ge1xuICAgICAgZmxhZzogZmFsc2VcbiAgICB9O1xuICB9LFxuXG4gIHNjaGVtYToge1xuICAgIHR5cGU6ICdvYmplY3QnLFxuICAgIGFkZGl0aW9uYWxQcm9wZXJ0aWVzOiBmYWxzZSxcbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICBuYW1lOiB7XG4gICAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgICB9LFxuICAgICAgbG9jYXRpb246IHtcbiAgICAgICAgdHlwZTogJ2FycmF5JyxcbiAgICAgICAgbWluSXRlbXM6IDIsXG4gICAgICAgIG1heEl0ZW1zOiAyLFxuICAgICAgICBpdGVtczoge1xuICAgICAgICAgIHR5cGU6ICdudW1iZXInXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICB0eXBlOiB7XG4gICAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgICB9LFxuICAgICAgY3JlYXRlZF9hdDoge1xuICAgICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgICAgZm9ybWF0OiAnZGF0ZS10aW1lJ1xuICAgICAgfSxcbiAgICAgIGRlc2NyaXB0aW9uOiB7XG4gICAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgICB9LFxuICAgICAgZmxhZzoge1xuICAgICAgICB0eXBlOiAnYm9vbGVhbidcbiAgICAgIH1cbiAgICB9LFxuICAgIHJlcXVpcmVkOiBbXG4gICAgICAnbmFtZScsXG4gICAgICAnbG9jYXRpb24nLFxuICAgICAgJ3R5cGUnLFxuICAgICAgJ2NyZWF0ZWRfYXQnLFxuICAgICAgJ2ZsYWcnXG4gICAgXVxuICB9LFxuXG4gIGNsZWFyOiBmdW5jdGlvbigpIHtcbiAgICBDb3VjaE1vZGVsLnByb3RvdHlwZS5jbGVhci5hcHBseSggdGhpcywgYXJndW1lbnRzICk7XG4gICAgdGhpcy5jb3ZlclVybCA9IGZhbHNlO1xuICB9LFxuXG4gIC8vICMjIEZldGNoXG4gIC8vIFdoZW4gZmV0Y2hpbmcgYSBwb2ludCwgc2hvdWxkIGl0IGhhdmUgYSBjb3ZlciBhdHRhY2htZW50LCBleHRlbmQgdGhlXG4gIC8vIHByb21pc2UgdG8gZmV0Y2ggdGhlIGF0dGFjaG1lbnQgYW5kIHNldCBgdGhpcy5jb3ZlclVybGAuXG4gIGZldGNoOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gQ291Y2hNb2RlbC5wcm90b3R5cGUuZmV0Y2guYXBwbHkoIHRoaXMsIGFyZ3VtZW50cyApLnRoZW4oIHJlcyA9PiB7XG4gICAgICByZXR1cm4gdGhpcy5nZXRDb3ZlciggcmVzICk7XG4gICAgfSApO1xuICB9LFxuXG4gIC8vICMgR2V0IENvdmVyXG4gIC8vIFNob3VsZCBhIHBvaW50IChhbHJlYWR5IGZldGNoZWQpIGhhdmUgYSBjb3ZlciBhdHRhY2htZW50LCBnZXQgdGhlXG4gIC8vIGF0dGFjaG1lbnQncyBkYXRhIGFuZCBzdG9yZSBhbiBvYmplY3QgdXJsIGZvciBpdCBpbiBgdGhpcy5jb3ZlclVybGBcbiAgLy9cbiAgLy8gQXMgYSB1dGlsaXR5IHRvIGNsaWVudCBmdW5jdGlvbnMsIHJlc29sdmUgdGhlIHJldHVybmVkIHByb21pc2UgdG8gdGhlXG4gIC8vIHNpbmdsZSBhcmd1bWVudCBwYXNzZWQgdG8gYGdldENvdmVyYC5cbiAgZ2V0Q292ZXI6IGZ1bmN0aW9uKCByZXQgKSB7XG4gICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpLnRoZW4oICgpID0+IHtcbiAgICAgIGNvbnN0IGhhc0NvdmVyID0gaW5jbHVkZXMoIHRoaXMuYXR0YWNobWVudHMoKSwgJ2NvdmVyLnBuZycgKTtcbiAgICAgIGlmICggYnJvd3NlciAmJiBoYXNDb3ZlciApIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYXR0YWNobWVudCggJ2NvdmVyLnBuZycgKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICB9ICkudGhlbiggYmxvYiA9PiB7XG4gICAgICBpZiggYmxvYiApIHtcbiAgICAgICAgdGhpcy5jb3ZlclVybCA9IGNyZWF0ZU9iamVjdFVSTCggYmxvYiApO1xuICAgICAgfVxuICAgIH0gKS50aGVuKCAoKSA9PiB7XG4gICAgICByZXR1cm4gcmV0O1xuICAgIH0gKTtcbiAgfSxcblxuICAvLyAjIyBTZXQgQ292ZXJcbiAgLy8gSWYgdGhlIHVzZXIgYWxyZWFkeSBoYXMgYSBjb3ZlciBibG9iIGFuZCB0aGV5IHdhbnQgdG8gdXNlIGl0IHdpdGggdGhlXG4gIC8vIG1vZGVsIGJlZm9yZSBhdHRhY2goKSBjYW4gZmluaXNoIHN0b3JpbmcgaXQgdG8gUG91Y2hEQiwgdGhleSBjYW4gdXNlXG4gIC8vIHRoaXMgbWV0aG9kIHRvIG1hbnVhbGx5IGluc2VydCBpdC5cbiAgLy9cbiAgLy8gVGhlIGFzc29jaWF0ZWQgb2JqZWN0IHVybCBmb3IgdGhlIGJsb2Igd2lsbCB0aGVuIGJlIGF2YWlsYWJsZSB0byBvdGhlclxuICAvLyBmdW5jdGlvbnMgbGlrZSBzdG9yZSgpLlxuICBzZXRDb3ZlcjogZnVuY3Rpb24oIGJsb2IgKSB7XG4gICAgaWYoIGJyb3dzZXIgKSB7XG4gICAgICB0aGlzLmNvdmVyVXJsID0gY3JlYXRlT2JqZWN0VVJMKCBibG9iICk7XG4gICAgfVxuICB9LFxuXG4gIC8vICMjIEdldCBSZWR1eCBSZXByZXNlbnRhdGlvblxuICAvLyBSZXR1cm4gYSBuZXN0ZWQgb2JqZWN0L2FyYXJ5IHJlcHJlc2VudGF0aW9uIG9mIHRoZSBtb2RlbCBzdWl0YWJsZSBmb3JcbiAgLy8gdXNlIHdpdGggcmVkdXguXG4gIHN0b3JlOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4geyAuLi50aGlzLnRvSlNPTigpLCBjb3ZlclVybDogdGhpcy5jb3ZlclVybCB9O1xuICB9XG59LCB7XG4gIHVyaTogcG9pbnRJZCxcblxuICBmb3I6IGlkID0+IHtcbiAgICBjb25zdCB7dHlwZX0gPSBwb2ludElkKCBpZCApO1xuICAgIGlmICggdHlwZSA9PT0gJ3NlcnZpY2UnICkge1xuICAgICAgcmV0dXJuIG5ldyBTZXJ2aWNlKCB7IF9pZDogaWQgfSApO1xuICAgIH0gZWxzZSBpZiAoIHR5cGUgPT09ICdhbGVydCcgKSB7XG4gICAgICByZXR1cm4gbmV3IEFsZXJ0KCB7IF9pZDogaWQgfSApO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyAnQSBwb2ludCBtdXN0IGVpdGhlciBiZSBhIHNlcnZpY2Ugb3IgYWxlcnQnO1xuICAgIH1cbiAgfVxufSApO1xuXG4vLyAjIFNlcnZpY2UgTW9kZWxcbi8vIEEgc2VydmljZSBpcyBhIGJ1aXNuZXNzIG9yIHBvaW50IG9mIGludGVyZXN0IHRvIGEgY3ljbGlzdC4gQSBjeWNsaXN0IG5lZWRzXG4vLyB0byBrbm93IHdoZXJlIHRoZXkgd2FudCB0byBzdG9wIHdlbGwgaW4gYWR2YW5jZSBvZiB0aGVpciB0cmF2ZWwgdGhyb3VnaCBhblxuLy8gYXJlYS4gVGhlIHNlcnZpY2UgcmVjb3JkIG11c3QgY29udGFpbiBlbm91Z2ggaW5mb3JtYXRpb24gdG8gaGVscCB0aGUgY3ljbGlzdFxuLy8gbWFrZSBzdWNoIGRlY2lzaW9ucy5cbi8vXG4vLyBUaGUgcmVjb3JkIGluY2x1ZGVzIGNvbnRhY3QgaW5mb3JtYXRpb24sIGFuZCBhIHNjaGVkdWxlIG9mIGhvdXJzIG9mXG4vLyBvcGVyYXRpb24uIEl0IGlzIGltcG9ydGFudCB0aGF0IHdlIHN0b3JlIHRoZSB0aW1lIHpvbmUgb2YgYSBzZXJ2aWNlLCBzaW5jZVxuLy8gdG91cmluZyBjeWNsaXN0cyB3aWxsIGNyb3NzIHRpbWUgem9uZXMgb24gdGhlaXIgdHJhdmVscy4gRnVydGhlcm1vcmUsXG4vLyBzZXJ2aWNlcyBvZiBpbnRlcmVzdCB0byB0b3VyaW5nIGN5Y2xpc3RzIG1heSBiZSBzZWFzb25hbDogd2Ugc3RvcmVcbi8vIHNjaGVkdWxlcyBmb3IgZGlmZmVyZW50IHNlYXNvbnMuXG5cbi8vICMjIFNlcnZpY2UgVHlwZXNcbi8vIEEgU2VydmljZSBtYXkgaGF2ZSBhIHNpbmdsZSB0eXBlLCBpbmRpY2F0aW5nIHRoZSBwcmltYXJ5IHB1cnBvc2Ugb2YgdGhlXG4vLyBidWlzbmVzcyBvciBwb2ludCBvZiBpbnRlcmVzdC4gU2VydmljZSB0eXBlcyBtYXkgYWxzbyBiZSBpbmNsdWRlZCBpbiBhXG4vLyBTZXJ2aWNlJ3MgYW1lbml0aWVzIGFycmF5LlxuLyplc2ZtdC1pZ25vcmUtc3RhcnQqL1xuZXhwb3J0IGNvbnN0IHNlcnZpY2VUeXBlcyA9IHtcbiAgJ2FpcnBvcnQnOiAgICAgICAgICAgeyBkaXNwbGF5OiAnQWlycG9ydCcgfSxcbiAgJ2Jhcic6ICAgICAgICAgICAgICAgeyBkaXNwbGF5OiAnQmFyJyB9LFxuICAnYmVkX2FuZF9icmVha2Zhc3QnOiB7IGRpc3BsYXk6ICdCZWQgJiBCcmVha2Zhc3QnIH0sXG4gICdiaWtlX3Nob3AnOiAgICAgICAgIHsgZGlzcGxheTogJ0Jpa2UgU2hvcCcgfSxcbiAgJ2NhYmluJzogICAgICAgICAgICAgeyBkaXNwbGF5OiAnQ2FiaW4nIH0sXG4gICdjYW1wZ3JvdW5kJzogICAgICAgIHsgZGlzcGxheTogJ0NhbXBncm91bmQnIH0sXG4gICdjb252ZW5pZW5jZV9zdG9yZSc6IHsgZGlzcGxheTogJ0NvbnZlbmllbmNlIFN0b3JlJyB9LFxuICAnY3ljbGlzdHNfY2FtcGluZyc6ICB7IGRpc3BsYXk6ICdDeWNsaXN0c1xcJyBDYW1waW5nJyB9LFxuICAnY3ljbGlzdHNfbG9kZ2luZyc6ICB7IGRpc3BsYXk6ICdDeWNsaXN0c1xcJyBMb2RnaW5nJyB9LFxuICAnZ3JvY2VyeSc6ICAgICAgICAgICB7IGRpc3BsYXk6ICdHcm9jZXJ5JyB9LFxuICAnaG9zdGVsJzogICAgICAgICAgICB7IGRpc3BsYXk6ICdIb3N0ZWwnIH0sXG4gICdob3Rfc3ByaW5nJzogICAgICAgIHsgZGlzcGxheTogJ0hvdCBTcHJpbmcnIH0sXG4gICdob3RlbCc6ICAgICAgICAgICAgIHsgZGlzcGxheTogJ0hvdGVsJyB9LFxuICAnbW90ZWwnOiAgICAgICAgICAgICB7IGRpc3BsYXk6ICdNb3RlbCcgfSxcbiAgJ2luZm9ybWF0aW9uJzogICAgICAgeyBkaXNwbGF5OiAnSW5mb3JtYXRpb24nIH0sXG4gICdsaWJyYXJ5JzogICAgICAgICAgIHsgZGlzcGxheTogJ0xpYnJhcnknIH0sXG4gICdtdXNldW0nOiAgICAgICAgICAgIHsgZGlzcGxheTogJ011c2V1bScgfSxcbiAgJ291dGRvb3Jfc3RvcmUnOiAgICAgeyBkaXNwbGF5OiAnT3V0ZG9vciBTdG9yZScgfSxcbiAgJ3Jlc3RfYXJlYSc6ICAgICAgICAgeyBkaXNwbGF5OiAnUmVzdCBBcmVhJyB9LFxuICAncmVzdGF1cmFudCc6ICAgICAgICB7IGRpc3BsYXk6ICdSZXN0YXVyYW50JyB9LFxuICAncmVzdHJvb20nOiAgICAgICAgICB7IGRpc3BsYXk6ICdSZXN0cm9vbScgfSxcbiAgJ3NjZW5pY19hcmVhJzogICAgICAgeyBkaXNwbGF5OiAnU2NlbmljIEFyZWEnIH0sXG4gICdzdGF0ZV9wYXJrJzogICAgICAgIHsgZGlzcGxheTogJ1N0YXRlIFBhcmsnIH0sXG4gICdvdGhlcic6ICAgICAgICAgICAgIHsgZGlzcGxheTogJ090aGVyJyB9XG59O1xuLyplc2ZtdC1pZ25vcmUtZW5kKi9cblxuY29uc3QgZGVmYXVsdFNjaGVkdWxlID0geyAnZGVmYXVsdCc6IFtdIH07XG5cbmV4cG9ydCBjb25zdCBTZXJ2aWNlID0gUG9pbnQuZXh0ZW5kKCB7XG4gIHNwZWNpZnk6IGZ1bmN0aW9uKCBuYW1lLCBsb2NhdGlvbiApIHtcbiAgICBQb2ludC5wcm90b3R5cGUuc3BlY2lmeS5jYWxsKCB0aGlzLCAnc2VydmljZScsIG5hbWUsIGxvY2F0aW9uICk7XG4gIH0sXG5cbiAgZGVmYXVsdHM6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB7XG4gICAgICAuLi5Qb2ludC5wcm90b3R5cGUuZGVmYXVsdHMuYXBwbHkodGhpcywgYXJndW1lbnRzKSxcbiAgICAgIGFtZW5pdGllczogW10sXG4gICAgICBzY2hlZHVsZTogeyAnZGVmYXVsdCc6IFtdIH0sXG4gICAgICBzZWFzb25hbDogZmFsc2VcbiAgICB9O1xuICB9LFxuXG4gIHNjaGVtYTogbWVyZ2VTY2hlbWFzKCBQb2ludC5wcm90b3R5cGUuc2NoZW1hLCB7XG4gICAgcHJvcGVydGllczoge1xuICAgICAgdHlwZToge1xuICAgICAgICBlbnVtOiBrZXlzKCBzZXJ2aWNlVHlwZXMgKVxuICAgICAgfSxcbiAgICAgIGFtZW5pdGllczoge1xuICAgICAgICB0eXBlOiAnYXJyYXknLFxuICAgICAgICBpdGVtczoge1xuICAgICAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgICAgIGVudW06IGtleXMoIHNlcnZpY2VUeXBlcyApXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBhZGRyZXNzOiB7XG4gICAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgICB9LFxuICAgICAgc2NoZWR1bGU6IHtcbiAgICAgICAgdHlwZTogJ29iamVjdCcsXG4gICAgICB9LFxuICAgICAgc2Vhc29uYWw6IHtcbiAgICAgICAgdHlwZTogJ2Jvb2xlYW4nXG4gICAgICB9LFxuICAgICAgcGhvbmU6IHtcbiAgICAgICAgdHlwZTogJ3N0cmluZydcbiAgICAgIH0sXG4gICAgICB3ZWJzaXRlOiB7XG4gICAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgICBmb3JtYXQ6ICd1cmknXG4gICAgICB9XG4gICAgfSxcbiAgICByZXF1aXJlZDogW1xuICAgICAgJ3NlYXNvbmFsJ1xuICAgIF1cbiAgfSApXG59ICk7XG5cbi8vIEFwcGx5IHRoZSB2YWxpZGF0aW9uIG1peGluIHRvIHRoZSBTZXJ2aWNlIG1vZGVsLiBTZWUgdmFsaWRhdGlvbi1taXhpbi5qcy5cbm1peGluVmFsaWRhdGlvbiggU2VydmljZSApO1xuXG4vLyAjIEFsZXJ0IE1vZGVsXG4vLyBBbiBhbGVydCBpcyBzb21ldGhpbmcgdGhhdCBtaWdodCBpbXBlZGUgYSBjeWNsaXN0J3MgdG91ci4gV2hlbiBhIGN5Y2xpc3Rcbi8vIHNlZXMgYW4gYWxlcnQgb24gdGhlIG1hcCwgdGhlIGtub3cgdG8gcGxhbiBhcm91bmQgaXQuXG5cbi8qZXNmbXQtaWdub3JlLXN0YXJ0Ki9cbmV4cG9ydCBjb25zdCBhbGVydFR5cGVzID0ge1xuICAncm9hZF9jbG9zdXJlJzogICAgICB7IGRpc3BsYXk6ICdSb2FkIENsb3N1cmUnIH0sXG4gICdmb3Jlc3RfZmlyZSc6ICAgICAgIHsgZGlzcGxheTogJ0ZvcmVzdCBmaXJlJyB9LFxuICAnZmxvb2RpbmcnOiAgICAgICAgICB7IGRpc3BsYXk6ICdGbG9vZGluZycgfSxcbiAgJ2RldG91cic6ICAgICAgICAgICAgeyBkaXNwbGF5OiAnRGV0b3VyJyB9LFxuICAnb3RoZXInOiAgICAgICAgICAgICB7IGRpc3BsYXk6ICdPdGhlcicgfVxufTtcbi8qZXNmbXQtaWdub3JlLWVuZCovXG5cbmV4cG9ydCBjb25zdCBBbGVydCA9IFBvaW50LmV4dGVuZCgge1xuICBzcGVjaWZ5OiBmdW5jdGlvbiggbmFtZSwgbG9jYXRpb24gKSB7XG4gICAgUG9pbnQucHJvdG90eXBlLnNwZWNpZnkuY2FsbCggdGhpcywgJ2FsZXJ0JywgbmFtZSwgbG9jYXRpb24gKTtcbiAgfSxcblxuICBzY2hlbWE6IG1lcmdlU2NoZW1hcyggUG9pbnQucHJvdG90eXBlLnNjaGVtYSwge1xuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgIHR5cGU6IHtcbiAgICAgICAgZW51bToga2V5cyggYWxlcnRUeXBlcyApXG4gICAgICB9XG4gICAgfVxuICB9IClcbn0gKTtcblxubWl4aW5WYWxpZGF0aW9uKCBBbGVydCApO1xuXG4vLyAjIFBvaW50IENvbGxlY3Rpb25cbi8vIEEgaGV0ZXJvZ2VuZW91cyBjb2xsZWN0aW9uIG9mIHNlcnZpY2VzIGFuZCBhbGVydHMuIFBvdWNoREIgaXMgYWJsZSB0byBmZXRjaFxuLy8gdGhpcyBjb2xsZWN0aW9uIGJ5IGxvb2tpbmcgZm9yIGFsbCBrZXlzIHN0YXJ0aW5nIHdpdGggJ3BvaW50LycuXG4vL1xuLy8gVGhpcyBhbHNvIGhhcyB0aGUgZWZmZWN0IG9mIGZldGNoaW5nIGNvbW1lbnRzIGZvciBwb2ludHMuIFRPRE86IGhhbmRsZVxuLy8gYENvbW1lbnRgIGluIHRoZSBtb2RlbCBmdW5jdGlvbi5cbi8vXG4vLyBBIGNvbm5lY3RlZCBQb2ludENvbGxlY3Rpb24gbXVzdCBiZSBhYmxlIHRvIGdlbmVyYXRlIGNvbm5lY3RlZCBBbGVydHMgb3Jcbi8vIFNlcnZpY2VzIG9uIGRlbWFuZHMuIFRoZXJlZm9yZSwgaWYgUG9pbnRDb2xsZWN0aW9uIGlzIGNvbm5lY3RlZCwgY29ubmVjdFxuLy8gbW9kZWxzIGJlZm9yZSByZXR1cm5pbmcgdGhlbS5cbmV4cG9ydCBjb25zdCBQb2ludENvbGxlY3Rpb24gPSBDb3VjaENvbGxlY3Rpb24uZXh0ZW5kKCB7XG4gIGluaXRpYWxpemU6IGZ1bmN0aW9uKCBtb2RlbHMsIG9wdGlvbnMgKSB7XG4gICAgQ291Y2hDb2xsZWN0aW9uLnByb3RvdHlwZS5pbml0aWFsaXplLmFwcGx5KCB0aGlzLCBhcmd1bWVudHMgKTtcbiAgICB0aGlzLnBvdWNoID0ge1xuICAgICAgb3B0aW9uczoge1xuICAgICAgICBhbGxEb2NzOiB7IGluY2x1ZGVfZG9jczogdHJ1ZSwgLi4ua2V5c0JldHdlZW4oICdwb2ludC8nICkgfVxuICAgICAgfVxuICAgIH07XG5cbiAgICBjb25zdCB7Y29ubmVjdCwgZGF0YWJhc2V9ID0gdGhpcztcbiAgICB0aGlzLnNlcnZpY2UgPSBjb25uZWN0ID8gY29ubmVjdCggZGF0YWJhc2UsIFNlcnZpY2UgKSA6IFNlcnZpY2U7XG4gICAgdGhpcy5hbGVydCA9IGNvbm5lY3QgPyBjb25uZWN0KCBkYXRhYmFzZSwgQWxlcnQgKSA6IEFsZXJ0O1xuICB9LFxuXG4gIG1vZGVsOiBmdW5jdGlvbiggYXR0cmlidXRlcywgb3B0aW9ucyApIHtcbiAgICBjb25zdCBwYXJ0cyA9IHBvaW50SWQoIGF0dHJpYnV0ZXMuX2lkICk7XG4gICAgY29uc3QgbWFwID0ge1xuICAgICAgJ3NlcnZpY2UnOiBvcHRpb25zLmNvbGxlY3Rpb24uc2VydmljZSxcbiAgICAgICdhbGVydCc6IG9wdGlvbnMuY29sbGVjdGlvbi5hbGVydFxuICAgIH07XG4gICAgY29uc3QgY29uc3RydWN0b3IgPSBtYXBbIHBhcnRzLnR5cGUgXTtcbiAgICBpZiAoIGNvbnN0cnVjdG9yICkge1xuICAgICAgcmV0dXJuIG5ldyBjb25zdHJ1Y3RvciggYXR0cmlidXRlcywgb3B0aW9ucyApO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyAnQSBwb2ludCBtdXN0IGJlIGVpdGhlciBhIHNlcnZpY2Ugb3IgYWxlcnQnO1xuICAgIH1cbiAgfSxcblxuICBnZXRDb3ZlcnM6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBQcm9taXNlLmFsbCggdGhpcy5tb2RlbHMubWFwKCBwb2ludCA9PiBwb2ludC5nZXRDb3ZlcigpICkgKTtcbiAgfSxcblxuICBzdG9yZTogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIGZyb21QYWlycyggdGhpcy5tb2RlbHMubWFwKCBwb2ludCA9PiBbIHBvaW50LmlkLCBwb2ludC5zdG9yZSgpIF0gKSApO1xuICB9XG59ICk7XG5cbi8vICMgRGlzcGxheSBOYW1lIGZvciBUeXBlXG4vLyBHaXZlbiBhIHR5cGUga2V5IGZyb20gZWl0aGVyIHRoZSBzZXJ2aWNlIG9yIGFsZXJ0IHR5cGUgZW51bWVyYXRpb25zLFxuLy8gcmV0dXJuIHRoZSB0eXBlJ3MgZGlzcGxheSBzdHJpbmcsIG9yIG51bGwgaWYgaXQgZG9lcyBub3QgZXhpc3QuXG5leHBvcnQgZnVuY3Rpb24gZGlzcGxheSggdHlwZSApIHtcbiAgY29uc3QgdmFsdWVzID0gc2VydmljZVR5cGVzWyB0eXBlIF0gfHwgYWxlcnRUeXBlc1sgdHlwZSBdO1xuICBpZiAoIHZhbHVlcyApIHtcbiAgICByZXR1cm4gdmFsdWVzLmRpc3BsYXk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbn1cblxuLy8gIyBDb21tZW50IE1vZGVsXG4vLyBJbmZvcm1hdGlvbiBhYm91dCBhbGVydHMgYW5kIHNlcnZpY2VzIGVuY291bnRlcmVkIGJ5IGN5Y2xpc3RzIGlzIGxpa2VseVxuLy8gdG8gY2hhbmdlIHdpdGggdGhlIHNlYXNvbnMgb3Igb3RoZXIgcmVhc29ucy4gQ3ljbGlzdHMgcGxhbm5pbmcgdGhlIG5leHQgbGVnXG4vLyBvZiBhIHRvdXIgc2hvdWxkIGJlIGFibGUgdG8gcmVhZCB0aGUgZXhwZXJpZW5jZXMgb2YgY3ljbGlzdHMgYWhlYWQgb2YgdGhlbS5cbi8vXG4vLyBBIGNvbW1lbnQgbXVzdCBoYXZlIGJvdGggYSByYXRpbmcgYW5kIHRoZSB0ZXh0IG9mIHRoZSBjb21tZW50LiBDb21tZW50cyBhcmVcbi8vIGxpbWl0ZWQgdG8gMTQwIGNoYXJhY3RlcnMgdG8gZW5zdXJlIHRoZXkgZG8gbm90IGRldm9sdmUgaW50byBnZW5lcmFsIGFsZXJ0XG4vLyBvciBzZXJ2aWNlIGluZm9ybWF0aW9uIHRoYXQgc2hvdWxkIHJlYWxseSBiZSBpbiB0aGUgZGVzY3JpcHRpb24uIFdlIHJlYWxseVxuLy8gd2FudCB1c2VycyBvZiB0aGUgQmljeWNsZSBUb3VyaW5nIENvbXBhbmlvbiB0byBwcm92aWRlIGNvbW1lbnRzIHZlcmlmeWluZ1xuLy8gaW5mbyBhYm91dCBwb2ludHMsIG9yIGxldHRpbmcgb3RoZXIgY3ljbGlzdHMga25vdyBhYm91dCBjaGFuZ2VzIGluIHRoZVxuLy8gc2VydmljZSBvciBhbGVydC5cblxuLy8gIyMgQ29tbWVudCBNb2RlbCBVcmlcbi8vIENvbW1lbnRzIGFyZSBzdG9yZWQgaW4gQ291Y2hEQiBpbiB0aGUgc2FtZSBkYXRhYmFzZSBhcyBwb2ludHMuIFRoZSBjb21tZW50XG4vLyBtb2RlbCB1cmkgaXMgY29tcG9zZWQgb2YgdGhyZWUgcGFydHM6XG4vLyAgMS4gVGhlIGVudGlyZSBpZCBvZiB0aGUgcmVsYXRlZCBwb2ludFxuLy8gIDIuIFRoZSBzdHJpbmcgJ2NvbW1lbnQvJ1xuLy8gIDMuIEEgdGltZSBiYXNlZCBVVUlEIHRvIHVuaXF1ZWx5IGlkZW50aWZ5IGNvbW1lbnRzXG4vL1xuLy8gV2UgZG9uJ3QgdXNlIGBkb2N1cmlgIGZvciB0aGUgY29tbWVudCBtb2RlbCB1cmlzIGJlY2F1c2Ugd2UgZG9uJ3QgaGF2ZSB0b1xuLy8gcGFyc2UgdGhlbS5cblxuY29uc3QgQ09NTUVOVF9NQVhfTEVOR1RIID0gMTQwO1xuZXhwb3J0IGNvbnN0IENvbW1lbnQgPSBDb3VjaE1vZGVsLmV4dGVuZCgge1xuICBpZEF0dHJpYnV0ZTogJ19pZCcsXG5cbiAgLy8gIyMgQ29uc3RydWN0b3JcbiAgLy8gR2VuZXJhdGUgYF9pZGAuIGBwb2ludElkYCBtdXN0IGJlIHNwZWNpZmllZCBpbiBvcHRpb25zLlxuICBjb25zdHJ1Y3RvcjogZnVuY3Rpb24oIGF0dHJpYnV0ZXMsIG9wdGlvbnMgKSB7XG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gICAgaWYgKCAhYXR0cmlidXRlcy51dWlkICkge1xuICAgICAgYXR0cmlidXRlcy51dWlkID0gdXVpZC52MSgpO1xuICAgIH1cbiAgICBpZiAoICFhdHRyaWJ1dGVzLl9pZCAmJiBvcHRpb25zLnBvaW50SWQgKSB7XG4gICAgICBhdHRyaWJ1dGVzLl9pZCA9IG9wdGlvbnMucG9pbnRJZCArICcvY29tbWVudC8nICsgYXR0cmlidXRlcy51dWlkO1xuICAgIH1cbiAgICBDb3VjaE1vZGVsLmFwcGx5KCB0aGlzLCBhcmd1bWVudHMgKTtcbiAgfSxcblxuICBzY2hlbWE6IHtcbiAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICBhZGRpdGlvbmFsUHJvcGVydGllczogZmFsc2UsXG4gICAgcHJvcGVydGllczoge1xuICAgICAgdXNlcm5hbWU6IHtcbiAgICAgICAgJ3R5cGUnOiAnc3RyaW5nJ1xuICAgICAgfSxcbiAgICAgIHRleHQ6IHtcbiAgICAgICAgJ3R5cGUnOiAnc3RyaW5nJyxcbiAgICAgICAgJ21heExlbmd0aCc6IENPTU1FTlRfTUFYX0xFTkdUSFxuICAgICAgfSxcbiAgICAgIHJhdGluZzoge1xuICAgICAgICB0eXBlOiAnaW50ZWdlcicsXG4gICAgICAgIG1pbmltdW06IDEsXG4gICAgICAgIG1heGltdW06IDVcbiAgICAgIH0sXG4gICAgICB1dWlkOiB7XG4gICAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgICB9XG4gICAgfSxcbiAgICByZXF1aXJlZDogW1xuICAgICAgJ3VzZXJuYW1lJyxcbiAgICAgICd0ZXh0JyxcbiAgICAgICdyYXRpbmcnLFxuICAgICAgJ3V1aWQnXG4gICAgXVxuICB9XG59LCB7XG4gIE1BWF9MRU5HVEg6IENPTU1FTlRfTUFYX0xFTkdUSFxufSApO1xuXG5taXhpblZhbGlkYXRpb24oIENvbW1lbnQgKTtcblxuLy8gIyBDb21tZW50IENvbGxlY3Rpb25cbi8vIEZldGNoIG9ubHkgY29tbWVudHMgYXNzb2NpYXRlZCB3aXRoIGEgZ2l2ZW4gcG9pbnQuXG5leHBvcnQgY29uc3QgQ29tbWVudENvbGxlY3Rpb24gPSBDb3VjaENvbGxlY3Rpb24uZXh0ZW5kKCB7XG4gIGluaXRpYWxpemU6IGZ1bmN0aW9uKCBtb2RlbHMsIG9wdGlvbnMgKSB7XG4gICAgQ291Y2hDb2xsZWN0aW9uLnByb3RvdHlwZS5pbml0aWFsaXplLmFwcGx5KCB0aGlzLCBhcmd1bWVudHMgKTtcbiAgICBjb25zdCBwb2ludElkID0gdGhpcy5wb2ludElkID0gb3B0aW9ucy5wb2ludElkO1xuXG4gICAgY29uc3QgY29ubmVjdCA9IHRoaXMuY29ubmVjdDtcbiAgICBjb25zdCBkYXRhYmFzZSA9IHRoaXMuZGF0YWJhc2U7XG4gICAgdGhpcy5jb21tZW50ID0gY29ubmVjdCA/IGNvbm5lY3QoIGRhdGFiYXNlLCBDb21tZW50ICkgOiBDb21tZW50O1xuXG4gICAgdGhpcy5wb3VjaCA9IHtcbiAgICAgIG9wdGlvbnM6IHtcbiAgICAgICAgYWxsRG9jczoge1xuICAgICAgICAgIC4uLmtleXNCZXR3ZWVuKCBwb2ludElkICsgJy9jb21tZW50JyApLFxuICAgICAgICAgIGluY2x1ZGVfZG9jczogdHJ1ZVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcbiAgfSxcblxuICBtb2RlbDogZnVuY3Rpb24oIGF0dHJpYnV0ZXMsIG9wdGlvbnMgKSB7XG4gICAgY29uc3Qge2NvbW1lbnQsIHBvaW50SWR9ID0gb3B0aW9ucy5jb2xsZWN0aW9uO1xuICAgIHJldHVybiBuZXcgY29tbWVudCggYXR0cmlidXRlcywgeyBwb2ludElkLCAuLi5vcHRpb25zIH0gKTtcbiAgfVxufSApO1xuIl19