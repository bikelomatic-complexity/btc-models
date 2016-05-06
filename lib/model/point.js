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

    var date = new Date().toISOString();
    this.set({
      created_at: date,
      updated_at: date
    });

    this.coverBlob = false;
    this.coverUrl = false;
  },

  update: function update() {
    this.set('updated_at', new Date().toISOString());
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
      updated_at: {
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
    required: ['name', 'location', 'type', 'created_at', 'updated_at', 'flag']
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
        _this2.coverBlob = blob;
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
    this.coverBlob = blob;
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
      },
      updated: {
        type: 'boolean' // the updated attribute is not required
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
    options = options || {};

    this.pouch = {
      options: {
        allDocs: (0, _lodash.assign)({ include_docs: true }, options.keys ? { keys: options.keys } : (0, _base.keysBetween)('point/'))
      }
    };

    var connect = this.connect;
    var database = this.database;

    this.service = connect ? connect(database, Service) : Service;
    this.alert = connect ? connect(database, Alert) : Alert;
  },

  // This handles the `options.keys` edge cases listed in the
  // [PouchDB api](https://pouchdb.com/api.html#batch_fetch)
  parse: function parse(response, options) {
    return response.rows.filter(function (row) {
      return !(row.deleted || row.error);
    }).map(function (row) {
      return row.doc;
    });
  },

  model: function model(attributes, options) {
    var parts = pointId(attributes._id);
    var map = {
      'service': options.collection.service,
      'alert': options.collection.alert
    };
    var constructor = map[parts.type];
    if (constructor) {
      var instance = new constructor(attributes, options);

      if (options.deindex && instance.has('index')) {
        instance.index = instance.get('index');
        instance.omit('index ');
      }

      return instance;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tb2RlbC9wb2ludC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O1FBK2FnQixPQUFPLEdBQVAsT0FBTzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWpadkIsSUFBTSxPQUFPLEdBQUssT0FBTyxNQUFNLEtBQUssV0FBVyxBQUFFOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQyxBQWtCbEQsSUFBTSxPQUFPLEdBQUcsaUJBQU8sS0FBSyxDQUFFLDRCQUE0QixDQUFFLENBQUM7O0FBRXRELElBQU0sS0FBSyxXQUFMLEtBQUssR0FBRyxpQkFBVyxNQUFNLENBQUU7QUFDdEMsYUFBVyxFQUFFLEtBQUs7O0FBRWxCLFlBQVUsRUFBRSxvQkFBVSxVQUFVLEVBQUUsT0FBTyxFQUFHO0FBQzFDLHFCQUFXLFNBQVMsQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFFLElBQUksRUFBRSxTQUFTLENBQUUsQ0FBQzs7QUFFekQsUUFBTSxJQUFJLEdBQUcsSUFBSSxJQUFJLEVBQUUsQ0FBQyxXQUFXLEVBQUUsQ0FBQztBQUN0QyxRQUFJLENBQUMsR0FBRyxDQUFFO0FBQ1IsZ0JBQVUsRUFBRSxJQUFJO0FBQ2hCLGdCQUFVLEVBQUUsSUFBSTtLQUNqQixDQUFFLENBQUM7O0FBRUosUUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7QUFDdkIsUUFBSSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUM7R0FDdkI7O0FBRUQsUUFBTSxFQUFFLGtCQUFXO0FBQ2pCLFFBQUksQ0FBQyxHQUFHLENBQUUsWUFBWSxFQUFFLElBQUksSUFBSSxFQUFFLENBQUMsV0FBVyxFQUFFLENBQUUsQ0FBQztHQUNwRDs7Ozs7QUFLRCxTQUFPLEVBQUUsaUJBQVUsSUFBSSxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUc7QUFDeEMsUUFBSyxJQUFJLEVBQUc7cUNBQ1MsUUFBUTs7VUFBcEIsR0FBRztVQUFFLEdBQUc7O0FBQ2YsVUFBTSxHQUFHLEdBQUcsT0FBTyxDQUFFO0FBQ25CLFlBQUksRUFBRSxJQUFJO0FBQ1YsWUFBSSxFQUFFLG9CQUFXLElBQUksQ0FBRTtBQUN2QixlQUFPLEVBQUUsbUJBQVMsTUFBTSxDQUFFLEdBQUcsRUFBRSxHQUFHLENBQUU7T0FDckMsQ0FBRSxDQUFDO0FBQ0osVUFBSSxDQUFDLEdBQUcsQ0FBRSxFQUFFLEdBQUcsRUFBSCxHQUFHLEVBQUUsSUFBSSxFQUFKLElBQUksRUFBRSxJQUFJLEVBQUosSUFBSSxFQUFFLFFBQVEsRUFBUixRQUFRLEVBQUUsQ0FBRSxDQUFDO0tBQzNDLE1BQU07d0JBQ29CLElBQUksQ0FBQyxVQUFVO1VBQWpDLEtBQUksZUFBSixJQUFJO1VBQUUsVUFBUSxlQUFSLFFBQVE7O3NDQUNGLFVBQVE7O1VBQXBCLEdBQUc7VUFBRSxHQUFHOztBQUNmLFVBQU0sR0FBRyxHQUFHLE9BQU8sQ0FBRTtBQUNuQixZQUFJLEVBQUUsSUFBSTtBQUNWLFlBQUksRUFBRSxvQkFBVyxLQUFJLENBQUU7QUFDdkIsZUFBTyxFQUFFLG1CQUFTLE1BQU0sQ0FBRSxHQUFHLEVBQUUsR0FBRyxDQUFFO09BQ3JDLENBQUUsQ0FBQztBQUNKLFVBQUksQ0FBQyxHQUFHLENBQUUsRUFBRSxHQUFHLEVBQUgsR0FBRyxFQUFFLENBQUUsQ0FBQztLQUNyQjtHQUNGOzs7OztBQUtELFdBQVMsRUFBRSxDQUNULGNBQWMsQ0FDZjs7QUFFRCxVQUFRLEVBQUUsb0JBQVc7QUFDbkIsV0FBTztBQUNMLFVBQUksRUFBRSxLQUFLO0tBQ1osQ0FBQztHQUNIOztBQUVELFFBQU0sRUFBRTtBQUNOLFFBQUksRUFBRSxRQUFRO0FBQ2Qsd0JBQW9CLEVBQUUsS0FBSztBQUMzQixjQUFVLEVBQUU7QUFDVixVQUFJLEVBQUU7QUFDSixZQUFJLEVBQUUsUUFBUTtPQUNmO0FBQ0QsY0FBUSxFQUFFO0FBQ1IsWUFBSSxFQUFFLE9BQU87QUFDYixnQkFBUSxFQUFFLENBQUM7QUFDWCxnQkFBUSxFQUFFLENBQUM7QUFDWCxhQUFLLEVBQUU7QUFDTCxjQUFJLEVBQUUsUUFBUTtTQUNmO09BQ0Y7QUFDRCxVQUFJLEVBQUU7QUFDSixZQUFJLEVBQUUsUUFBUTtPQUNmO0FBQ0QsZ0JBQVUsRUFBRTtBQUNWLFlBQUksRUFBRSxRQUFRO0FBQ2QsY0FBTSxFQUFFLFdBQVc7T0FDcEI7QUFDRCxnQkFBVSxFQUFFO0FBQ1YsWUFBSSxFQUFFLFFBQVE7QUFDZCxjQUFNLEVBQUUsV0FBVztPQUNwQjtBQUNELGlCQUFXLEVBQUU7QUFDWCxZQUFJLEVBQUUsUUFBUTtPQUNmO0FBQ0QsVUFBSSxFQUFFO0FBQ0osWUFBSSxFQUFFLFNBQVM7T0FDaEI7S0FDRjtBQUNELFlBQVEsRUFBRSxDQUNSLE1BQU0sRUFDTixVQUFVLEVBQ1YsTUFBTSxFQUNOLFlBQVksRUFDWixZQUFZLEVBQ1osTUFBTSxDQUNQO0dBQ0Y7O0FBRUQsT0FBSyxFQUFFLGlCQUFXO0FBQ2hCLHFCQUFXLFNBQVMsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFFLElBQUksRUFBRSxTQUFTLENBQUUsQ0FBQztBQUNwRCxRQUFJLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQztHQUN2Qjs7Ozs7QUFLRCxPQUFLLEVBQUUsaUJBQVc7OztBQUNoQixXQUFPLGlCQUFXLFNBQVMsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFFLElBQUksRUFBRSxTQUFTLENBQUUsQ0FBQyxJQUFJLENBQUUsVUFBQSxHQUFHLEVBQUk7QUFDdEUsYUFBTyxNQUFLLFFBQVEsQ0FBRSxHQUFHLENBQUUsQ0FBQztLQUM3QixDQUFFLENBQUM7R0FDTDs7Ozs7Ozs7QUFRRCxVQUFRLEVBQUUsa0JBQVUsR0FBRyxFQUFHOzs7QUFDeEIsV0FBTyxPQUFPLENBQUMsT0FBTyxFQUFFLENBQUMsSUFBSSxDQUFFLFlBQU87QUFDcEMsVUFBTSxRQUFRLEdBQUcsc0JBQVUsT0FBSyxXQUFXLEVBQUUsRUFBRSxXQUFXLENBQUUsQ0FBQztBQUM3RCxVQUFLLE9BQU8sSUFBSSxRQUFRLEVBQUc7QUFDekIsZUFBTyxPQUFLLFVBQVUsQ0FBRSxXQUFXLENBQUUsQ0FBQztPQUN2QyxNQUFNO0FBQ0wsZUFBTztPQUNSO0tBQ0YsQ0FBRSxDQUFDLElBQUksQ0FBRSxVQUFBLElBQUksRUFBSTtBQUNoQixVQUFLLElBQUksRUFBRztBQUNWLGVBQUssU0FBUyxHQUFHLElBQUksQ0FBQztBQUN0QixlQUFLLFFBQVEsR0FBRywrQkFBaUIsSUFBSSxDQUFFLENBQUM7T0FDekM7S0FDRixDQUFFLENBQUMsSUFBSSxDQUFFLFlBQU87QUFDZixhQUFPLEdBQUcsQ0FBQztLQUNaLENBQUUsQ0FBQztHQUNMOzs7Ozs7Ozs7QUFTRCxVQUFRLEVBQUUsa0JBQVUsSUFBSSxFQUFHO0FBQ3pCLFFBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO0FBQ3RCLFFBQUssT0FBTyxFQUFHO0FBQ2IsVUFBSSxDQUFDLFFBQVEsR0FBRywrQkFBaUIsSUFBSSxDQUFFLENBQUM7S0FDekM7R0FDRjs7Ozs7QUFLRCxPQUFLLEVBQUUsaUJBQVc7QUFDaEIsd0JBQVksSUFBSSxDQUFDLE1BQU0sRUFBRSxJQUFFLFFBQVEsRUFBRSxJQUFJLENBQUMsUUFBUSxJQUFHO0dBQ3REO0NBQ0YsRUFBRTtBQUNELEtBQUcsRUFBRSxPQUFPOztBQUVaLEtBQUcsRUFBRSxjQUFBLEVBQUUsRUFBSTttQkFDTSxPQUFPLENBQUUsRUFBRSxDQUFFOztRQUFyQixJQUFJLFlBQUosSUFBSTs7QUFDWCxRQUFLLElBQUksS0FBSyxTQUFTLEVBQUc7QUFDeEIsYUFBTyxJQUFJLE9BQU8sQ0FBRSxFQUFFLEdBQUcsRUFBRSxFQUFFLEVBQUUsQ0FBRSxDQUFDO0tBQ25DLE1BQU0sSUFBSyxJQUFJLEtBQUssT0FBTyxFQUFHO0FBQzdCLGFBQU8sSUFBSSxLQUFLLENBQUUsRUFBRSxHQUFHLEVBQUUsRUFBRSxFQUFFLENBQUUsQ0FBQztLQUNqQyxNQUFNO0FBQ0wsWUFBTSwyQ0FBMkMsQ0FBQztLQUNuRDtHQUNGO0NBQ0YsQ0FBRTs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFDLEFBbUJHLElBQU0sWUFBWSxXQUFaLFlBQVksR0FBRztBQUMxQixXQUFTLEVBQVksRUFBRSxPQUFPLEVBQUUsU0FBUyxFQUFFO0FBQzNDLE9BQUssRUFBZ0IsRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFO0FBQ3ZDLHFCQUFtQixFQUFFLEVBQUUsT0FBTyxFQUFFLGlCQUFpQixFQUFFO0FBQ25ELGFBQVcsRUFBVSxFQUFFLE9BQU8sRUFBRSxXQUFXLEVBQUU7QUFDN0MsU0FBTyxFQUFjLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRTtBQUN6QyxjQUFZLEVBQVMsRUFBRSxPQUFPLEVBQUUsWUFBWSxFQUFFO0FBQzlDLHFCQUFtQixFQUFFLEVBQUUsT0FBTyxFQUFFLG1CQUFtQixFQUFFO0FBQ3JELG9CQUFrQixFQUFHLEVBQUUsT0FBTyxFQUFFLG9CQUFvQixFQUFFO0FBQ3RELG9CQUFrQixFQUFHLEVBQUUsT0FBTyxFQUFFLG9CQUFvQixFQUFFO0FBQ3RELFdBQVMsRUFBWSxFQUFFLE9BQU8sRUFBRSxTQUFTLEVBQUU7QUFDM0MsVUFBUSxFQUFhLEVBQUUsT0FBTyxFQUFFLFFBQVEsRUFBRTtBQUMxQyxjQUFZLEVBQVMsRUFBRSxPQUFPLEVBQUUsWUFBWSxFQUFFO0FBQzlDLFNBQU8sRUFBYyxFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUU7QUFDekMsU0FBTyxFQUFjLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRTtBQUN6QyxlQUFhLEVBQVEsRUFBRSxPQUFPLEVBQUUsYUFBYSxFQUFFO0FBQy9DLFdBQVMsRUFBWSxFQUFFLE9BQU8sRUFBRSxTQUFTLEVBQUU7QUFDM0MsVUFBUSxFQUFhLEVBQUUsT0FBTyxFQUFFLFFBQVEsRUFBRTtBQUMxQyxpQkFBZSxFQUFNLEVBQUUsT0FBTyxFQUFFLGVBQWUsRUFBRTtBQUNqRCxhQUFXLEVBQVUsRUFBRSxPQUFPLEVBQUUsV0FBVyxFQUFFO0FBQzdDLGNBQVksRUFBUyxFQUFFLE9BQU8sRUFBRSxZQUFZLEVBQUU7QUFDOUMsWUFBVSxFQUFXLEVBQUUsT0FBTyxFQUFFLFVBQVUsRUFBRTtBQUM1QyxlQUFhLEVBQVEsRUFBRSxPQUFPLEVBQUUsYUFBYSxFQUFFO0FBQy9DLGNBQVksRUFBUyxFQUFFLE9BQU8sRUFBRSxZQUFZLEVBQUU7QUFDOUMsU0FBTyxFQUFjLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRTtDQUMxQzs7O0FBQUMsQUFHSyxJQUFNLE9BQU8sV0FBUCxPQUFPLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBRTtBQUNuQyxTQUFPLEVBQUUsaUJBQVUsSUFBSSxFQUFFLFFBQVEsRUFBRztBQUNsQyxTQUFLLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsUUFBUSxDQUFFLENBQUM7R0FDakU7O0FBRUQsVUFBUSxFQUFFLG9CQUFXO0FBQ25CLHdCQUNLLEtBQUssQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBRSxJQUFJLEVBQUUsU0FBUyxDQUFFO0FBQ3BELGVBQVMsRUFBRSxFQUFFO0FBQ2IsY0FBUSxFQUFFLEVBQUUsU0FBUyxFQUFFLEVBQUUsRUFBRTtBQUMzQixjQUFRLEVBQUUsS0FBSztPQUNmO0dBQ0g7O0FBRUQsUUFBTSxFQUFFLG1DQUFjLEtBQUssQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFO0FBQzVDLGNBQVUsRUFBRTtBQUNWLFVBQUksRUFBRTtBQUNKLFlBQUksRUFBRSxrQkFBTSxZQUFZLENBQUU7T0FDM0I7QUFDRCxlQUFTLEVBQUU7QUFDVCxZQUFJLEVBQUUsT0FBTztBQUNiLGFBQUssRUFBRTtBQUNMLGNBQUksRUFBRSxRQUFRO0FBQ2QsY0FBSSxFQUFFLGtCQUFNLFlBQVksQ0FBRTtTQUMzQjtPQUNGO0FBQ0QsYUFBTyxFQUFFO0FBQ1AsWUFBSSxFQUFFLFFBQVE7T0FDZjtBQUNELGNBQVEsRUFBRTtBQUNSLFlBQUksRUFBRSxRQUFRO09BQ2Y7QUFDRCxjQUFRLEVBQUU7QUFDUixZQUFJLEVBQUUsU0FBUztPQUNoQjtBQUNELFdBQUssRUFBRTtBQUNMLFlBQUksRUFBRSxRQUFRO09BQ2Y7QUFDRCxhQUFPLEVBQUU7QUFDUCxZQUFJLEVBQUUsUUFBUTtBQUNkLGNBQU0sRUFBRSxLQUFLO09BQ2Q7QUFDRCxhQUFPLEVBQUU7QUFDUCxZQUFJLEVBQUUsU0FBUztBQUFBLE9BQ2hCO0tBQ0Y7QUFDRCxZQUFRLEVBQUUsQ0FDUixVQUFVLENBQ1g7R0FDRixDQUFFO0NBQ0osQ0FBRTs7O0FBQUMsQUFHSixzQ0FBaUIsT0FBTyxDQUFFOzs7Ozs7O0FBQUMsQUFPcEIsSUFBTSxVQUFVLFdBQVYsVUFBVSxHQUFHO0FBQ3hCLGdCQUFjLEVBQU8sRUFBRSxPQUFPLEVBQUUsY0FBYyxFQUFFO0FBQ2hELGVBQWEsRUFBUSxFQUFFLE9BQU8sRUFBRSxhQUFhLEVBQUU7QUFDL0MsWUFBVSxFQUFXLEVBQUUsT0FBTyxFQUFFLFVBQVUsRUFBRTtBQUM1QyxVQUFRLEVBQWEsRUFBRSxPQUFPLEVBQUUsUUFBUSxFQUFFO0FBQzFDLFNBQU8sRUFBYyxFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUU7Q0FDMUM7OztBQUFDLEFBR0ssSUFBTSxLQUFLLFdBQUwsS0FBSyxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUU7QUFDakMsU0FBTyxFQUFFLGlCQUFVLElBQUksRUFBRSxRQUFRLEVBQUc7QUFDbEMsU0FBSyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLFFBQVEsQ0FBRSxDQUFDO0dBQy9EOztBQUVELFFBQU0sRUFBRSxtQ0FBYyxLQUFLLENBQUMsU0FBUyxDQUFDLE1BQU0sRUFBRTtBQUM1QyxjQUFVLEVBQUU7QUFDVixVQUFJLEVBQUU7QUFDSixZQUFJLEVBQUUsa0JBQU0sVUFBVSxDQUFFO09BQ3pCO0tBQ0Y7R0FDRixDQUFFO0NBQ0osQ0FBRSxDQUFDOztBQUVKLHNDQUFpQixLQUFLLENBQUU7Ozs7Ozs7Ozs7OztBQUFDLEFBWWxCLElBQU0sZUFBZSxXQUFmLGVBQWUsR0FBRyxzQkFBZ0IsTUFBTSxDQUFFO0FBQ3JELFlBQVUsRUFBRSxvQkFBVSxNQUFNLEVBQUUsT0FBTyxFQUFHO0FBQ3RDLDBCQUFnQixTQUFTLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBRSxJQUFJLEVBQUUsU0FBUyxDQUFFLENBQUM7QUFDOUQsV0FBTyxHQUFHLE9BQU8sSUFBSSxFQUFFLENBQUM7O0FBRXhCLFFBQUksQ0FBQyxLQUFLLEdBQUc7QUFDWCxhQUFPLEVBQUU7QUFDUCxlQUFPLEVBQUUsb0JBQ1AsRUFBRSxZQUFZLEVBQUUsSUFBSSxFQUFFLEVBQ3RCLE9BQU8sQ0FBQyxJQUFJLEdBQUcsRUFBRSxJQUFJLEVBQUUsT0FBTyxDQUFDLElBQUksRUFBRSxHQUFHLHVCQUFhLFFBQVEsQ0FBRSxDQUNoRTtPQUNGO0tBQ0YsQ0FBQzs7UUFFSyxPQUFPLEdBQWMsSUFBSSxDQUF6QixPQUFPO1FBQUUsUUFBUSxHQUFJLElBQUksQ0FBaEIsUUFBUTs7QUFDeEIsUUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLEdBQUcsT0FBTyxDQUFFLFFBQVEsRUFBRSxPQUFPLENBQUUsR0FBRyxPQUFPLENBQUM7QUFDaEUsUUFBSSxDQUFDLEtBQUssR0FBRyxPQUFPLEdBQUcsT0FBTyxDQUFFLFFBQVEsRUFBRSxLQUFLLENBQUUsR0FBRyxLQUFLLENBQUM7R0FDM0Q7Ozs7QUFJRCxPQUFLLEVBQUUsZUFBVSxRQUFRLEVBQUUsT0FBTyxFQUFHO0FBQ25DLFdBQU8sUUFBUSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQ3pCLFVBQUEsR0FBRzthQUFJLEVBQUcsR0FBRyxDQUFDLE9BQU8sSUFBSSxHQUFHLENBQUMsS0FBSyxDQUFBLEFBQUU7S0FBQSxDQUNyQyxDQUFDLEdBQUcsQ0FDSCxVQUFBLEdBQUc7YUFBSSxHQUFHLENBQUMsR0FBRztLQUFBLENBQ2YsQ0FBQztHQUNIOztBQUVELE9BQUssRUFBRSxlQUFVLFVBQVUsRUFBRSxPQUFPLEVBQUc7QUFDckMsUUFBTSxLQUFLLEdBQUcsT0FBTyxDQUFFLFVBQVUsQ0FBQyxHQUFHLENBQUUsQ0FBQztBQUN4QyxRQUFNLEdBQUcsR0FBRztBQUNWLGVBQVMsRUFBRSxPQUFPLENBQUMsVUFBVSxDQUFDLE9BQU87QUFDckMsYUFBTyxFQUFFLE9BQU8sQ0FBQyxVQUFVLENBQUMsS0FBSztLQUNsQyxDQUFDO0FBQ0YsUUFBTSxXQUFXLEdBQUcsR0FBRyxDQUFFLEtBQUssQ0FBQyxJQUFJLENBQUUsQ0FBQztBQUN0QyxRQUFLLFdBQVcsRUFBRztBQUNqQixVQUFNLFFBQVEsR0FBRyxJQUFJLFdBQVcsQ0FBRSxVQUFVLEVBQUUsT0FBTyxDQUFFLENBQUM7O0FBRXhELFVBQUksT0FBTyxDQUFDLE9BQU8sSUFBSSxRQUFRLENBQUMsR0FBRyxDQUFFLE9BQU8sQ0FBRSxFQUFHO0FBQy9DLGdCQUFRLENBQUMsS0FBSyxHQUFHLFFBQVEsQ0FBQyxHQUFHLENBQUUsT0FBTyxDQUFFLENBQUM7QUFDekMsZ0JBQVEsQ0FBQyxJQUFJLENBQUUsUUFBUSxDQUFDLENBQUM7T0FDMUI7O0FBRUQsYUFBTyxRQUFRLENBQUM7S0FDakIsTUFBTTtBQUNMLFlBQU0sMkNBQTJDLENBQUM7S0FDbkQ7R0FDRjs7Ozs7QUFLRCxXQUFTLEVBQUUscUJBQVc7QUFDcEIsV0FBTyxPQUFPLENBQUMsR0FBRyxDQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFFLFVBQUEsS0FBSzthQUFJLEtBQUssQ0FBQyxRQUFRLEVBQUU7S0FBQSxDQUFFLENBQUUsQ0FBQztHQUNwRTs7Ozs7QUFLRCxPQUFLLEVBQUUsaUJBQVc7QUFDaEIsV0FBTyx1QkFBVyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBRSxVQUFBLEtBQUs7YUFBSSxDQUFFLEtBQUssQ0FBQyxFQUFFLEVBQUUsS0FBSyxDQUFDLEtBQUssRUFBRSxDQUFFO0tBQUEsQ0FBRSxDQUFFLENBQUM7R0FDN0U7Q0FDRixDQUFFOzs7OztBQUFDLEFBS0csU0FBUyxPQUFPLENBQUUsSUFBSSxFQUFHO0FBQzlCLE1BQU0sTUFBTSxHQUFHLFlBQVksQ0FBRSxJQUFJLENBQUUsSUFBSSxVQUFVLENBQUUsSUFBSSxDQUFFLENBQUM7QUFDMUQsTUFBSyxNQUFNLEVBQUc7QUFDWixXQUFPLE1BQU0sQ0FBQyxPQUFPLENBQUM7R0FDdkIsTUFBTTtBQUNMLFdBQU8sSUFBSSxDQUFDO0dBQ2I7Q0FDRjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsQUF3QkQsSUFBTSxrQkFBa0IsR0FBRyxHQUFHLENBQUM7QUFDeEIsSUFBTSxPQUFPLFdBQVAsT0FBTyxHQUFHLGlCQUFXLE1BQU0sQ0FBRTtBQUN4QyxhQUFXLEVBQUUsS0FBSzs7OztBQUlsQixhQUFXLEVBQUUscUJBQVUsVUFBVSxFQUFFLE9BQU8sRUFBRztBQUMzQyxXQUFPLEdBQUcsT0FBTyxJQUFJLEVBQUUsQ0FBQztBQUN4QixRQUFLLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRztBQUN0QixnQkFBVSxDQUFDLElBQUksR0FBRyxtQkFBSyxFQUFFLEVBQUUsQ0FBQztLQUM3QjtBQUNELFFBQUssQ0FBQyxVQUFVLENBQUMsR0FBRyxJQUFJLE9BQU8sQ0FBQyxPQUFPLEVBQUc7QUFDeEMsZ0JBQVUsQ0FBQyxHQUFHLEdBQUcsT0FBTyxDQUFDLE9BQU8sR0FBRyxXQUFXLEdBQUcsVUFBVSxDQUFDLElBQUksQ0FBQztLQUNsRTtBQUNELHFCQUFXLEtBQUssQ0FBRSxJQUFJLEVBQUUsU0FBUyxDQUFFLENBQUM7R0FDckM7O0FBRUQsUUFBTSxFQUFFO0FBQ04sUUFBSSxFQUFFLFFBQVE7QUFDZCx3QkFBb0IsRUFBRSxLQUFLO0FBQzNCLGNBQVUsRUFBRTtBQUNWLGNBQVEsRUFBRTtBQUNSLGNBQU0sRUFBRSxRQUFRO09BQ2pCO0FBQ0QsVUFBSSxFQUFFO0FBQ0osY0FBTSxFQUFFLFFBQVE7QUFDaEIsbUJBQVcsRUFBRSxrQkFBa0I7T0FDaEM7QUFDRCxZQUFNLEVBQUU7QUFDTixZQUFJLEVBQUUsU0FBUztBQUNmLGVBQU8sRUFBRSxDQUFDO0FBQ1YsZUFBTyxFQUFFLENBQUM7T0FDWDtBQUNELFVBQUksRUFBRTtBQUNKLFlBQUksRUFBRSxRQUFRO09BQ2Y7S0FDRjtBQUNELFlBQVEsRUFBRSxDQUNSLFVBQVUsRUFDVixNQUFNLEVBQ04sUUFBUSxFQUNSLE1BQU0sQ0FDUDtHQUNGO0NBQ0YsRUFBRTtBQUNELFlBQVUsRUFBRSxrQkFBa0I7Q0FDL0IsQ0FBRSxDQUFDOztBQUVKLHNDQUFpQixPQUFPLENBQUU7Ozs7QUFBQyxBQUlwQixJQUFNLGlCQUFpQixXQUFqQixpQkFBaUIsR0FBRyxzQkFBZ0IsTUFBTSxDQUFFO0FBQ3ZELFlBQVUsRUFBRSxvQkFBVSxNQUFNLEVBQUUsT0FBTyxFQUFHO0FBQ3RDLDBCQUFnQixTQUFTLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBRSxJQUFJLEVBQUUsU0FBUyxDQUFFLENBQUM7QUFDOUQsUUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDOztBQUUvQyxRQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDO0FBQzdCLFFBQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUM7QUFDL0IsUUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLEdBQUcsT0FBTyxDQUFFLFFBQVEsRUFBRSxPQUFPLENBQUUsR0FBRyxPQUFPLENBQUM7O0FBRWhFLFFBQUksQ0FBQyxLQUFLLEdBQUc7QUFDWCxhQUFPLEVBQUU7QUFDUCxlQUFPLGVBQ0YsdUJBQWEsT0FBTyxHQUFHLFVBQVUsQ0FBRTtBQUN0QyxzQkFBWSxFQUFFLElBQUk7VUFDbkI7T0FDRjtLQUNGLENBQUM7R0FDSDs7QUFFRCxPQUFLLEVBQUUsZUFBVSxVQUFVLEVBQUUsT0FBTyxFQUFHOzhCQUNWLE9BQU8sQ0FBQyxVQUFVO1FBQXRDLE9BQU8sdUJBQVAsT0FBTztRQUFFLE9BQU8sdUJBQVAsT0FBTzs7QUFDdkIsV0FBTyxJQUFJLE9BQU8sQ0FBRSxVQUFVLGFBQUksT0FBTyxFQUFQLE9BQU8sSUFBSyxPQUFPLEVBQUksQ0FBQztHQUMzRDtDQUNGLENBQUUsQ0FBQyIsImZpbGUiOiJwb2ludC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIGJ0Yy1hcHAtc2VydmVyIC0tIFNlcnZlciBmb3IgdGhlIEJpY3ljbGUgVG91cmluZyBDb21wYW5pb25cbiAqIENvcHlyaWdodCDCqSAyMDE2IEFkdmVudHVyZSBDeWNsaW5nIEFzc29jaWF0aW9uXG4gKlxuICogVGhpcyBmaWxlIGlzIHBhcnQgb2YgYnRjLWFwcC1zZXJ2ZXIuXG4gKlxuICogYnRjLWFwcC1zZXJ2ZXIgaXMgZnJlZSBzb2Z0d2FyZTogeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeVxuICogaXQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBBZmZlcm8gR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgYXMgcHVibGlzaGVkIGJ5XG4gKiB0aGUgRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uLCBlaXRoZXIgdmVyc2lvbiAzIG9mIHRoZSBMaWNlbnNlLCBvclxuICogKGF0IHlvdXIgb3B0aW9uKSBhbnkgbGF0ZXIgdmVyc2lvbi5cbiAqXG4gKiBidGMtYXBwLXNlcnZlciBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLFxuICogYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2ZcbiAqIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gIFNlZSB0aGVcbiAqIEFmZmVybyBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZSBkZXRhaWxzLlxuICpcbiAqIFlvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEFmZmVybyBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuICogYWxvbmcgd2l0aCBGb29iYXIuICBJZiBub3QsIHNlZSA8aHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG4gKi9cblxuaW1wb3J0IHsgbWl4aW5WYWxpZGF0aW9uLCBtZXJnZVNjaGVtYXMgfSBmcm9tICcuL3ZhbGlkYXRpb24tbWl4aW4nO1xuaW1wb3J0IHsgQ291Y2hNb2RlbCwgQ291Y2hDb2xsZWN0aW9uLCBrZXlzQmV0d2VlbiB9IGZyb20gJy4vYmFzZSc7XG5cbmltcG9ydCB7IGtleXMsIGZyb21QYWlycywgaW5jbHVkZXMsIGFzc2lnbiB9IGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgeyBjcmVhdGVPYmplY3RVUkwgfSBmcm9tICdibG9iLXV0aWwnO1xuXG5pbXBvcnQgZG9jdXJpIGZyb20gJ2RvY3VyaSc7XG5pbXBvcnQgbmdlb2hhc2ggZnJvbSAnbmdlb2hhc2gnO1xuaW1wb3J0IG5vcm1hbGl6ZSBmcm9tICd0by1pZCc7XG5pbXBvcnQgdXVpZCBmcm9tICdub2RlLXV1aWQnO1xuXG5jb25zdCBicm93c2VyID0gKCB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyApO1xuXG4vLyAjIFBvaW50IE1vZGVsXG4vLyBUaGUgcG9pbnQgcmVwcmVzZW50cyBhIGxvY2F0aW9uIG9uIHRoZSBtYXAgd2l0aCBhc3NvY2lhdGVkIG1ldGFkYXRhLCBnZW9kYXRhLFxuLy8gYW5kIHVzZXIgcHJvdmlkZWQgZGF0YS4gVGhlIHBvaW50IGlzIHRoZSBiYXNlIHNoYXJlZCBieSBzZXJ2aWNlcyBhbmQgYWxlcnRzLlxuLy9cbi8vIFRoZSBKU09OIHNjaGVtYSBzdG9yZWQgaW4gYFBvaW50YCwgYW5kIGFzIHBhdGNoZWQgYnkgYFNlcnZpY2VgIGFuZCBgQWxlcnRgLFxuLy8gaXMgdGhlIGF1dGhvcml0YXRpdmUgZGVmaW5pdGlvbiBvZiB0aGUgcG9pbnQgcmVjb3JkLlxuXG4vLyAjIyBQb2ludCBNb2RlbCBVcmlcbi8vIFBvaW50cyBhcmUgc3RvcmVkIGluIENvdWNoREIuIENvdWNoREIgZG9jdW1lbnRzIGNhbiBoYXZlIHJpY2ggaWQgc3RyaW5nc1xuLy8gdG8gaGVscCBzdG9yZSBhbmQgYWNjZXNzIGRhdGEgd2l0aG91dCBNYXBSZWR1Y2Ugam9icy5cbi8vXG4vLyBUaGUgcG9pbnQgbW9kZWwgdXJpIGlzIGNvbXBvc2VkIG9mIGZvdXIgcGFydHM6XG4vLyAgMS4gVGhlIHN0cmluZyAncG9pbnQvJ2Bcbi8vICAyLiBUaGUgdHlwZSBvZiBwb2ludCwgZWl0aGVyICdzZXJ2aWNlJyBvciAnYWxlcnQnXG4vLyAgMy4gVGhlIG5vcm1hbGl6ZWQgbmFtZSBvZiB0aGUgcG9pbnRcbi8vICA0LiBUaGUgcG9pbnQncyBnZW9oYXNoXG5jb25zdCBwb2ludElkID0gZG9jdXJpLnJvdXRlKCAncG9pbnQvOnR5cGUvOm5hbWUvOmdlb2hhc2gnICk7XG5cbmV4cG9ydCBjb25zdCBQb2ludCA9IENvdWNoTW9kZWwuZXh0ZW5kKCB7XG4gIGlkQXR0cmlidXRlOiAnX2lkJyxcblxuICBpbml0aWFsaXplOiBmdW5jdGlvbiggYXR0cmlidXRlcywgb3B0aW9ucyApIHtcbiAgICBDb3VjaE1vZGVsLnByb3RvdHlwZS5pbml0aWFsaXplLmFwcGx5KCB0aGlzLCBhcmd1bWVudHMgKTtcblxuICAgIGNvbnN0IGRhdGUgPSBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCk7XG4gICAgdGhpcy5zZXQoIHtcbiAgICAgIGNyZWF0ZWRfYXQ6IGRhdGUsXG4gICAgICB1cGRhdGVkX2F0OiBkYXRlXG4gICAgfSApO1xuXG4gICAgdGhpcy5jb3ZlckJsb2IgPSBmYWxzZTtcbiAgICB0aGlzLmNvdmVyVXJsID0gZmFsc2U7XG4gIH0sXG5cbiAgdXBkYXRlOiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnNldCggJ3VwZGF0ZWRfYXQnLCBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCkgKTtcbiAgfSxcblxuICAvLyAjIyBTcGVjaWZ5XG4gIC8vIEZpbGwgaW4gYF9pZGAgZnJvbSB0aGUgY29tcG9uZW50cyBvZiB0aGUgcG9pbnQgbW9kZWwgdXJpLlxuICAvLyBQdWxsIHZhbHVlcyBmcm9tIGBhdHRyaWJ1dGVzYCBpZiBuYW1lIGFuZCBsb2NhdGlvbiBhcmUgdW5kZWZpbmVkLlxuICBzcGVjaWZ5OiBmdW5jdGlvbiggdHlwZSwgbmFtZSwgbG9jYXRpb24gKSB7XG4gICAgaWYgKCBuYW1lICkge1xuICAgICAgY29uc3QgW2xhdCwgbG5nXSA9IGxvY2F0aW9uO1xuICAgICAgY29uc3QgX2lkID0gcG9pbnRJZCgge1xuICAgICAgICB0eXBlOiB0eXBlLFxuICAgICAgICBuYW1lOiBub3JtYWxpemUoIG5hbWUgKSxcbiAgICAgICAgZ2VvaGFzaDogbmdlb2hhc2guZW5jb2RlKCBsYXQsIGxuZyApXG4gICAgICB9ICk7XG4gICAgICB0aGlzLnNldCggeyBfaWQsIHR5cGUsIG5hbWUsIGxvY2F0aW9uIH0gKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3Qge25hbWUsIGxvY2F0aW9ufSA9IHRoaXMuYXR0cmlidXRlcztcbiAgICAgIGNvbnN0IFtsYXQsIGxuZ10gPSBsb2NhdGlvbjtcbiAgICAgIGNvbnN0IF9pZCA9IHBvaW50SWQoIHtcbiAgICAgICAgdHlwZTogdHlwZSxcbiAgICAgICAgbmFtZTogbm9ybWFsaXplKCBuYW1lICksXG4gICAgICAgIGdlb2hhc2g6IG5nZW9oYXNoLmVuY29kZSggbGF0LCBsbmcgKVxuICAgICAgfSApO1xuICAgICAgdGhpcy5zZXQoIHsgX2lkIH0gKTtcbiAgICB9XG4gIH0sXG5cbiAgLy8gIyMgU2FmZWd1YXJkIGZvciBQb2ludHNcbiAgLy8gUG9pbnRzIGhhdmUgaW1hZ2UgYXR0YWNobWVudHMsIHNvIHdlIHNob3VsZCBsZXQgYmFja2JvbmUgcG91Y2ggaGFuZGxlXG4gIC8vIHRob3NlIGFuZCB3ZSBzaG91bGQgbm90IHZhbGlkYXRlIHRoZSBfYXR0YWNobWVudHMga2V5XG4gIHNhZmVndWFyZDogW1xuICAgICdfYXR0YWNobWVudHMnXG4gIF0sXG5cbiAgZGVmYXVsdHM6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB7XG4gICAgICBmbGFnOiBmYWxzZVxuICAgIH07XG4gIH0sXG5cbiAgc2NoZW1hOiB7XG4gICAgdHlwZTogJ29iamVjdCcsXG4gICAgYWRkaXRpb25hbFByb3BlcnRpZXM6IGZhbHNlLFxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgIG5hbWU6IHtcbiAgICAgICAgdHlwZTogJ3N0cmluZydcbiAgICAgIH0sXG4gICAgICBsb2NhdGlvbjoge1xuICAgICAgICB0eXBlOiAnYXJyYXknLFxuICAgICAgICBtaW5JdGVtczogMixcbiAgICAgICAgbWF4SXRlbXM6IDIsXG4gICAgICAgIGl0ZW1zOiB7XG4gICAgICAgICAgdHlwZTogJ251bWJlcidcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIHR5cGU6IHtcbiAgICAgICAgdHlwZTogJ3N0cmluZydcbiAgICAgIH0sXG4gICAgICBjcmVhdGVkX2F0OiB7XG4gICAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgICBmb3JtYXQ6ICdkYXRlLXRpbWUnXG4gICAgICB9LFxuICAgICAgdXBkYXRlZF9hdDoge1xuICAgICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgICAgZm9ybWF0OiAnZGF0ZS10aW1lJ1xuICAgICAgfSxcbiAgICAgIGRlc2NyaXB0aW9uOiB7XG4gICAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgICB9LFxuICAgICAgZmxhZzoge1xuICAgICAgICB0eXBlOiAnYm9vbGVhbidcbiAgICAgIH1cbiAgICB9LFxuICAgIHJlcXVpcmVkOiBbXG4gICAgICAnbmFtZScsXG4gICAgICAnbG9jYXRpb24nLFxuICAgICAgJ3R5cGUnLFxuICAgICAgJ2NyZWF0ZWRfYXQnLFxuICAgICAgJ3VwZGF0ZWRfYXQnLFxuICAgICAgJ2ZsYWcnXG4gICAgXVxuICB9LFxuXG4gIGNsZWFyOiBmdW5jdGlvbigpIHtcbiAgICBDb3VjaE1vZGVsLnByb3RvdHlwZS5jbGVhci5hcHBseSggdGhpcywgYXJndW1lbnRzICk7XG4gICAgdGhpcy5jb3ZlclVybCA9IGZhbHNlO1xuICB9LFxuXG4gIC8vICMjIEZldGNoXG4gIC8vIFdoZW4gZmV0Y2hpbmcgYSBwb2ludCwgc2hvdWxkIGl0IGhhdmUgYSBjb3ZlciBhdHRhY2htZW50LCBleHRlbmQgdGhlXG4gIC8vIHByb21pc2UgdG8gZmV0Y2ggdGhlIGF0dGFjaG1lbnQgYW5kIHNldCBgdGhpcy5jb3ZlclVybGAuXG4gIGZldGNoOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gQ291Y2hNb2RlbC5wcm90b3R5cGUuZmV0Y2guYXBwbHkoIHRoaXMsIGFyZ3VtZW50cyApLnRoZW4oIHJlcyA9PiB7XG4gICAgICByZXR1cm4gdGhpcy5nZXRDb3ZlciggcmVzICk7XG4gICAgfSApO1xuICB9LFxuXG4gIC8vICMgR2V0IENvdmVyXG4gIC8vIFNob3VsZCBhIHBvaW50IChhbHJlYWR5IGZldGNoZWQpIGhhdmUgYSBjb3ZlciBhdHRhY2htZW50LCBnZXQgdGhlXG4gIC8vIGF0dGFjaG1lbnQncyBkYXRhIGFuZCBzdG9yZSBhbiBvYmplY3QgdXJsIGZvciBpdCBpbiBgdGhpcy5jb3ZlclVybGBcbiAgLy9cbiAgLy8gQXMgYSB1dGlsaXR5IHRvIGNsaWVudCBmdW5jdGlvbnMsIHJlc29sdmUgdGhlIHJldHVybmVkIHByb21pc2UgdG8gdGhlXG4gIC8vIHNpbmdsZSBhcmd1bWVudCBwYXNzZWQgdG8gYGdldENvdmVyYC5cbiAgZ2V0Q292ZXI6IGZ1bmN0aW9uKCByZXQgKSB7XG4gICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpLnRoZW4oICggKSA9PiB7XG4gICAgICBjb25zdCBoYXNDb3ZlciA9IGluY2x1ZGVzKCB0aGlzLmF0dGFjaG1lbnRzKCksICdjb3Zlci5wbmcnICk7XG4gICAgICBpZiAoIGJyb3dzZXIgJiYgaGFzQ292ZXIgKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmF0dGFjaG1lbnQoICdjb3Zlci5wbmcnICk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgfSApLnRoZW4oIGJsb2IgPT4ge1xuICAgICAgaWYgKCBibG9iICkge1xuICAgICAgICB0aGlzLmNvdmVyQmxvYiA9IGJsb2I7XG4gICAgICAgIHRoaXMuY292ZXJVcmwgPSBjcmVhdGVPYmplY3RVUkwoIGJsb2IgKTtcbiAgICAgIH1cbiAgICB9ICkudGhlbiggKCApID0+IHtcbiAgICAgIHJldHVybiByZXQ7XG4gICAgfSApO1xuICB9LFxuXG4gIC8vICMjIFNldCBDb3ZlclxuICAvLyBJZiB0aGUgdXNlciBhbHJlYWR5IGhhcyBhIGNvdmVyIGJsb2IgYW5kIHRoZXkgd2FudCB0byB1c2UgaXQgd2l0aCB0aGVcbiAgLy8gbW9kZWwgYmVmb3JlIGF0dGFjaCgpIGNhbiBmaW5pc2ggc3RvcmluZyBpdCB0byBQb3VjaERCLCB0aGV5IGNhbiB1c2VcbiAgLy8gdGhpcyBtZXRob2QgdG8gbWFudWFsbHkgaW5zZXJ0IGl0LlxuICAvL1xuICAvLyBUaGUgYXNzb2NpYXRlZCBvYmplY3QgdXJsIGZvciB0aGUgYmxvYiB3aWxsIHRoZW4gYmUgYXZhaWxhYmxlIHRvIG90aGVyXG4gIC8vIGZ1bmN0aW9ucyBsaWtlIHN0b3JlKCkuXG4gIHNldENvdmVyOiBmdW5jdGlvbiggYmxvYiApIHtcbiAgICB0aGlzLmNvdmVyQmxvYiA9IGJsb2I7XG4gICAgaWYgKCBicm93c2VyICkge1xuICAgICAgdGhpcy5jb3ZlclVybCA9IGNyZWF0ZU9iamVjdFVSTCggYmxvYiApO1xuICAgIH1cbiAgfSxcblxuICAvLyAjIyBHZXQgUmVkdXggUmVwcmVzZW50YXRpb25cbiAgLy8gUmV0dXJuIGEgbmVzdGVkIG9iamVjdC9hcmFyeSByZXByZXNlbnRhdGlvbiBvZiB0aGUgbW9kZWwgc3VpdGFibGUgZm9yXG4gIC8vIHVzZSB3aXRoIHJlZHV4LlxuICBzdG9yZTogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHsgLi4udGhpcy50b0pTT04oKSwgY292ZXJVcmw6IHRoaXMuY292ZXJVcmwgfTtcbiAgfVxufSwge1xuICB1cmk6IHBvaW50SWQsXG5cbiAgZm9yOiBpZCA9PiB7XG4gICAgY29uc3Qge3R5cGV9ID0gcG9pbnRJZCggaWQgKTtcbiAgICBpZiAoIHR5cGUgPT09ICdzZXJ2aWNlJyApIHtcbiAgICAgIHJldHVybiBuZXcgU2VydmljZSggeyBfaWQ6IGlkIH0gKTtcbiAgICB9IGVsc2UgaWYgKCB0eXBlID09PSAnYWxlcnQnICkge1xuICAgICAgcmV0dXJuIG5ldyBBbGVydCggeyBfaWQ6IGlkIH0gKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgJ0EgcG9pbnQgbXVzdCBlaXRoZXIgYmUgYSBzZXJ2aWNlIG9yIGFsZXJ0JztcbiAgICB9XG4gIH1cbn0gKTtcblxuLy8gIyBTZXJ2aWNlIE1vZGVsXG4vLyBBIHNlcnZpY2UgaXMgYSBidWlzbmVzcyBvciBwb2ludCBvZiBpbnRlcmVzdCB0byBhIGN5Y2xpc3QuIEEgY3ljbGlzdCBuZWVkc1xuLy8gdG8ga25vdyB3aGVyZSB0aGV5IHdhbnQgdG8gc3RvcCB3ZWxsIGluIGFkdmFuY2Ugb2YgdGhlaXIgdHJhdmVsIHRocm91Z2ggYW5cbi8vIGFyZWEuIFRoZSBzZXJ2aWNlIHJlY29yZCBtdXN0IGNvbnRhaW4gZW5vdWdoIGluZm9ybWF0aW9uIHRvIGhlbHAgdGhlIGN5Y2xpc3Rcbi8vIG1ha2Ugc3VjaCBkZWNpc2lvbnMuXG4vL1xuLy8gVGhlIHJlY29yZCBpbmNsdWRlcyBjb250YWN0IGluZm9ybWF0aW9uLCBhbmQgYSBzY2hlZHVsZSBvZiBob3VycyBvZlxuLy8gb3BlcmF0aW9uLiBJdCBpcyBpbXBvcnRhbnQgdGhhdCB3ZSBzdG9yZSB0aGUgdGltZSB6b25lIG9mIGEgc2VydmljZSwgc2luY2Vcbi8vIHRvdXJpbmcgY3ljbGlzdHMgd2lsbCBjcm9zcyB0aW1lIHpvbmVzIG9uIHRoZWlyIHRyYXZlbHMuIEZ1cnRoZXJtb3JlLFxuLy8gc2VydmljZXMgb2YgaW50ZXJlc3QgdG8gdG91cmluZyBjeWNsaXN0cyBtYXkgYmUgc2Vhc29uYWw6IHdlIHN0b3JlXG4vLyBzY2hlZHVsZXMgZm9yIGRpZmZlcmVudCBzZWFzb25zLlxuXG4vLyAjIyBTZXJ2aWNlIFR5cGVzXG4vLyBBIFNlcnZpY2UgbWF5IGhhdmUgYSBzaW5nbGUgdHlwZSwgaW5kaWNhdGluZyB0aGUgcHJpbWFyeSBwdXJwb3NlIG9mIHRoZVxuLy8gYnVpc25lc3Mgb3IgcG9pbnQgb2YgaW50ZXJlc3QuIFNlcnZpY2UgdHlwZXMgbWF5IGFsc28gYmUgaW5jbHVkZWQgaW4gYVxuLy8gU2VydmljZSdzIGFtZW5pdGllcyBhcnJheS5cbi8qZXNmbXQtaWdub3JlLXN0YXJ0Ki9cbmV4cG9ydCBjb25zdCBzZXJ2aWNlVHlwZXMgPSB7XG4gICdhaXJwb3J0JzogICAgICAgICAgIHsgZGlzcGxheTogJ0FpcnBvcnQnIH0sXG4gICdiYXInOiAgICAgICAgICAgICAgIHsgZGlzcGxheTogJ0JhcicgfSxcbiAgJ2JlZF9hbmRfYnJlYWtmYXN0JzogeyBkaXNwbGF5OiAnQmVkICYgQnJlYWtmYXN0JyB9LFxuICAnYmlrZV9zaG9wJzogICAgICAgICB7IGRpc3BsYXk6ICdCaWtlIFNob3AnIH0sXG4gICdjYWJpbic6ICAgICAgICAgICAgIHsgZGlzcGxheTogJ0NhYmluJyB9LFxuICAnY2FtcGdyb3VuZCc6ICAgICAgICB7IGRpc3BsYXk6ICdDYW1wZ3JvdW5kJyB9LFxuICAnY29udmVuaWVuY2Vfc3RvcmUnOiB7IGRpc3BsYXk6ICdDb252ZW5pZW5jZSBTdG9yZScgfSxcbiAgJ2N5Y2xpc3RzX2NhbXBpbmcnOiAgeyBkaXNwbGF5OiAnQ3ljbGlzdHNcXCcgQ2FtcGluZycgfSxcbiAgJ2N5Y2xpc3RzX2xvZGdpbmcnOiAgeyBkaXNwbGF5OiAnQ3ljbGlzdHNcXCcgTG9kZ2luZycgfSxcbiAgJ2dyb2NlcnknOiAgICAgICAgICAgeyBkaXNwbGF5OiAnR3JvY2VyeScgfSxcbiAgJ2hvc3RlbCc6ICAgICAgICAgICAgeyBkaXNwbGF5OiAnSG9zdGVsJyB9LFxuICAnaG90X3NwcmluZyc6ICAgICAgICB7IGRpc3BsYXk6ICdIb3QgU3ByaW5nJyB9LFxuICAnaG90ZWwnOiAgICAgICAgICAgICB7IGRpc3BsYXk6ICdIb3RlbCcgfSxcbiAgJ21vdGVsJzogICAgICAgICAgICAgeyBkaXNwbGF5OiAnTW90ZWwnIH0sXG4gICdpbmZvcm1hdGlvbic6ICAgICAgIHsgZGlzcGxheTogJ0luZm9ybWF0aW9uJyB9LFxuICAnbGlicmFyeSc6ICAgICAgICAgICB7IGRpc3BsYXk6ICdMaWJyYXJ5JyB9LFxuICAnbXVzZXVtJzogICAgICAgICAgICB7IGRpc3BsYXk6ICdNdXNldW0nIH0sXG4gICdvdXRkb29yX3N0b3JlJzogICAgIHsgZGlzcGxheTogJ091dGRvb3IgU3RvcmUnIH0sXG4gICdyZXN0X2FyZWEnOiAgICAgICAgIHsgZGlzcGxheTogJ1Jlc3QgQXJlYScgfSxcbiAgJ3Jlc3RhdXJhbnQnOiAgICAgICAgeyBkaXNwbGF5OiAnUmVzdGF1cmFudCcgfSxcbiAgJ3Jlc3Ryb29tJzogICAgICAgICAgeyBkaXNwbGF5OiAnUmVzdHJvb20nIH0sXG4gICdzY2VuaWNfYXJlYSc6ICAgICAgIHsgZGlzcGxheTogJ1NjZW5pYyBBcmVhJyB9LFxuICAnc3RhdGVfcGFyayc6ICAgICAgICB7IGRpc3BsYXk6ICdTdGF0ZSBQYXJrJyB9LFxuICAnb3RoZXInOiAgICAgICAgICAgICB7IGRpc3BsYXk6ICdPdGhlcicgfVxufTtcbi8qZXNmbXQtaWdub3JlLWVuZCovXG5cbmV4cG9ydCBjb25zdCBTZXJ2aWNlID0gUG9pbnQuZXh0ZW5kKCB7XG4gIHNwZWNpZnk6IGZ1bmN0aW9uKCBuYW1lLCBsb2NhdGlvbiApIHtcbiAgICBQb2ludC5wcm90b3R5cGUuc3BlY2lmeS5jYWxsKCB0aGlzLCAnc2VydmljZScsIG5hbWUsIGxvY2F0aW9uICk7XG4gIH0sXG5cbiAgZGVmYXVsdHM6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB7XG4gICAgICAuLi5Qb2ludC5wcm90b3R5cGUuZGVmYXVsdHMuYXBwbHkoIHRoaXMsIGFyZ3VtZW50cyApLFxuICAgICAgYW1lbml0aWVzOiBbXSxcbiAgICAgIHNjaGVkdWxlOiB7ICdkZWZhdWx0JzogW10gfSxcbiAgICAgIHNlYXNvbmFsOiBmYWxzZVxuICAgIH07XG4gIH0sXG5cbiAgc2NoZW1hOiBtZXJnZVNjaGVtYXMoIFBvaW50LnByb3RvdHlwZS5zY2hlbWEsIHtcbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICB0eXBlOiB7XG4gICAgICAgIGVudW06IGtleXMoIHNlcnZpY2VUeXBlcyApXG4gICAgICB9LFxuICAgICAgYW1lbml0aWVzOiB7XG4gICAgICAgIHR5cGU6ICdhcnJheScsXG4gICAgICAgIGl0ZW1zOiB7XG4gICAgICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICAgICAgZW51bToga2V5cyggc2VydmljZVR5cGVzIClcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIGFkZHJlc3M6IHtcbiAgICAgICAgdHlwZTogJ3N0cmluZydcbiAgICAgIH0sXG4gICAgICBzY2hlZHVsZToge1xuICAgICAgICB0eXBlOiAnb2JqZWN0J1xuICAgICAgfSxcbiAgICAgIHNlYXNvbmFsOiB7XG4gICAgICAgIHR5cGU6ICdib29sZWFuJ1xuICAgICAgfSxcbiAgICAgIHBob25lOiB7XG4gICAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgICB9LFxuICAgICAgd2Vic2l0ZToge1xuICAgICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgICAgZm9ybWF0OiAndXJpJ1xuICAgICAgfSxcbiAgICAgIHVwZGF0ZWQ6IHtcbiAgICAgICAgdHlwZTogJ2Jvb2xlYW4nIC8vIHRoZSB1cGRhdGVkIGF0dHJpYnV0ZSBpcyBub3QgcmVxdWlyZWRcbiAgICAgIH1cbiAgICB9LFxuICAgIHJlcXVpcmVkOiBbXG4gICAgICAnc2Vhc29uYWwnXG4gICAgXVxuICB9IClcbn0gKTtcblxuLy8gQXBwbHkgdGhlIHZhbGlkYXRpb24gbWl4aW4gdG8gdGhlIFNlcnZpY2UgbW9kZWwuIFNlZSB2YWxpZGF0aW9uLW1peGluLmpzLlxubWl4aW5WYWxpZGF0aW9uKCBTZXJ2aWNlICk7XG5cbi8vICMgQWxlcnQgTW9kZWxcbi8vIEFuIGFsZXJ0IGlzIHNvbWV0aGluZyB0aGF0IG1pZ2h0IGltcGVkZSBhIGN5Y2xpc3QncyB0b3VyLiBXaGVuIGEgY3ljbGlzdFxuLy8gc2VlcyBhbiBhbGVydCBvbiB0aGUgbWFwLCB0aGUga25vdyB0byBwbGFuIGFyb3VuZCBpdC5cblxuLyplc2ZtdC1pZ25vcmUtc3RhcnQqL1xuZXhwb3J0IGNvbnN0IGFsZXJ0VHlwZXMgPSB7XG4gICdyb2FkX2Nsb3N1cmUnOiAgICAgIHsgZGlzcGxheTogJ1JvYWQgQ2xvc3VyZScgfSxcbiAgJ2ZvcmVzdF9maXJlJzogICAgICAgeyBkaXNwbGF5OiAnRm9yZXN0IGZpcmUnIH0sXG4gICdmbG9vZGluZyc6ICAgICAgICAgIHsgZGlzcGxheTogJ0Zsb29kaW5nJyB9LFxuICAnZGV0b3VyJzogICAgICAgICAgICB7IGRpc3BsYXk6ICdEZXRvdXInIH0sXG4gICdvdGhlcic6ICAgICAgICAgICAgIHsgZGlzcGxheTogJ090aGVyJyB9XG59O1xuLyplc2ZtdC1pZ25vcmUtZW5kKi9cblxuZXhwb3J0IGNvbnN0IEFsZXJ0ID0gUG9pbnQuZXh0ZW5kKCB7XG4gIHNwZWNpZnk6IGZ1bmN0aW9uKCBuYW1lLCBsb2NhdGlvbiApIHtcbiAgICBQb2ludC5wcm90b3R5cGUuc3BlY2lmeS5jYWxsKCB0aGlzLCAnYWxlcnQnLCBuYW1lLCBsb2NhdGlvbiApO1xuICB9LFxuXG4gIHNjaGVtYTogbWVyZ2VTY2hlbWFzKCBQb2ludC5wcm90b3R5cGUuc2NoZW1hLCB7XG4gICAgcHJvcGVydGllczoge1xuICAgICAgdHlwZToge1xuICAgICAgICBlbnVtOiBrZXlzKCBhbGVydFR5cGVzIClcbiAgICAgIH1cbiAgICB9XG4gIH0gKVxufSApO1xuXG5taXhpblZhbGlkYXRpb24oIEFsZXJ0ICk7XG5cbi8vICMgUG9pbnQgQ29sbGVjdGlvblxuLy8gQSBoZXRlcm9nZW5lb3VzIGNvbGxlY3Rpb24gb2Ygc2VydmljZXMgYW5kIGFsZXJ0cy4gUG91Y2hEQiBpcyBhYmxlIHRvIGZldGNoXG4vLyB0aGlzIGNvbGxlY3Rpb24gYnkgbG9va2luZyBmb3IgYWxsIGtleXMgc3RhcnRpbmcgd2l0aCAncG9pbnQvJy5cbi8vXG4vLyBUaGlzIGFsc28gaGFzIHRoZSBlZmZlY3Qgb2YgZmV0Y2hpbmcgY29tbWVudHMgZm9yIHBvaW50cy4gVE9ETzogaGFuZGxlXG4vLyBgQ29tbWVudGAgaW4gdGhlIG1vZGVsIGZ1bmN0aW9uLlxuLy9cbi8vIEEgY29ubmVjdGVkIFBvaW50Q29sbGVjdGlvbiBtdXN0IGJlIGFibGUgdG8gZ2VuZXJhdGUgY29ubmVjdGVkIEFsZXJ0cyBvclxuLy8gU2VydmljZXMgb24gZGVtYW5kcy4gVGhlcmVmb3JlLCBpZiBQb2ludENvbGxlY3Rpb24gaXMgY29ubmVjdGVkLCBjb25uZWN0XG4vLyBtb2RlbHMgYmVmb3JlIHJldHVybmluZyB0aGVtLlxuZXhwb3J0IGNvbnN0IFBvaW50Q29sbGVjdGlvbiA9IENvdWNoQ29sbGVjdGlvbi5leHRlbmQoIHtcbiAgaW5pdGlhbGl6ZTogZnVuY3Rpb24oIG1vZGVscywgb3B0aW9ucyApIHtcbiAgICBDb3VjaENvbGxlY3Rpb24ucHJvdG90eXBlLmluaXRpYWxpemUuYXBwbHkoIHRoaXMsIGFyZ3VtZW50cyApO1xuICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXG4gICAgdGhpcy5wb3VjaCA9IHtcbiAgICAgIG9wdGlvbnM6IHtcbiAgICAgICAgYWxsRG9jczogYXNzaWduKFxuICAgICAgICAgIHsgaW5jbHVkZV9kb2NzOiB0cnVlIH0sXG4gICAgICAgICAgb3B0aW9ucy5rZXlzID8geyBrZXlzOiBvcHRpb25zLmtleXMgfSA6IGtleXNCZXR3ZWVuKCAncG9pbnQvJyApXG4gICAgICAgIClcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgY29uc3Qge2Nvbm5lY3QsIGRhdGFiYXNlfSA9IHRoaXM7XG4gICAgdGhpcy5zZXJ2aWNlID0gY29ubmVjdCA/IGNvbm5lY3QoIGRhdGFiYXNlLCBTZXJ2aWNlICkgOiBTZXJ2aWNlO1xuICAgIHRoaXMuYWxlcnQgPSBjb25uZWN0ID8gY29ubmVjdCggZGF0YWJhc2UsIEFsZXJ0ICkgOiBBbGVydDtcbiAgfSxcblxuICAvLyBUaGlzIGhhbmRsZXMgdGhlIGBvcHRpb25zLmtleXNgIGVkZ2UgY2FzZXMgbGlzdGVkIGluIHRoZVxuICAvLyBbUG91Y2hEQiBhcGldKGh0dHBzOi8vcG91Y2hkYi5jb20vYXBpLmh0bWwjYmF0Y2hfZmV0Y2gpXG4gIHBhcnNlOiBmdW5jdGlvbiggcmVzcG9uc2UsIG9wdGlvbnMgKSB7XG4gICAgcmV0dXJuIHJlc3BvbnNlLnJvd3MuZmlsdGVyKFxuICAgICAgcm93ID0+ICEoIHJvdy5kZWxldGVkIHx8IHJvdy5lcnJvciApXG4gICAgKS5tYXAoXG4gICAgICByb3cgPT4gcm93LmRvY1xuICAgICk7XG4gIH0sXG5cbiAgbW9kZWw6IGZ1bmN0aW9uKCBhdHRyaWJ1dGVzLCBvcHRpb25zICkge1xuICAgIGNvbnN0IHBhcnRzID0gcG9pbnRJZCggYXR0cmlidXRlcy5faWQgKTtcbiAgICBjb25zdCBtYXAgPSB7XG4gICAgICAnc2VydmljZSc6IG9wdGlvbnMuY29sbGVjdGlvbi5zZXJ2aWNlLFxuICAgICAgJ2FsZXJ0Jzogb3B0aW9ucy5jb2xsZWN0aW9uLmFsZXJ0XG4gICAgfTtcbiAgICBjb25zdCBjb25zdHJ1Y3RvciA9IG1hcFsgcGFydHMudHlwZSBdO1xuICAgIGlmICggY29uc3RydWN0b3IgKSB7XG4gICAgICBjb25zdCBpbnN0YW5jZSA9IG5ldyBjb25zdHJ1Y3RvciggYXR0cmlidXRlcywgb3B0aW9ucyApO1xuXG4gICAgICBpZiggb3B0aW9ucy5kZWluZGV4ICYmIGluc3RhbmNlLmhhcyggJ2luZGV4JyApICkge1xuICAgICAgICBpbnN0YW5jZS5pbmRleCA9IGluc3RhbmNlLmdldCggJ2luZGV4JyApO1xuICAgICAgICBpbnN0YW5jZS5vbWl0KCAnaW5kZXggJyk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBpbnN0YW5jZTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgJ0EgcG9pbnQgbXVzdCBiZSBlaXRoZXIgYSBzZXJ2aWNlIG9yIGFsZXJ0JztcbiAgICB9XG4gIH0sXG5cbiAgLy8gIyMgRmV0Y2ggQ292ZXIgSW1hZ2VzIGZvciBhbGwgUG9pbnRzXG4gIC8vIFJldHVybnMgYSBwcm9taXNlIHRoYXQgcmVzb2x2ZXMgd2hlbiBhbGwgcG9pbnRzIGluIHRoZSBhcnJheSBoYXZlXG4gIC8vIHRoZWlyIGNvdmVyIGltYWdlcyBhdmFpbGFibGUuXG4gIGdldENvdmVyczogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIFByb21pc2UuYWxsKCB0aGlzLm1vZGVscy5tYXAoIHBvaW50ID0+IHBvaW50LmdldENvdmVyKCkgKSApO1xuICB9LFxuXG4gIC8vICMjIEdldCBSZWR1eCBSZXByZXNlbnRhdGlvblxuICAvLyBSZXR1cm4gYSBuZXN0ZWQgb2JqZWN0L2FyYXJ5IHJlcHJlc2VudGF0aW9uIG9mIHRoZSBjb2xsZWN0aW9uIHN1aXRhYmxlIGZvclxuICAvLyB1c2Ugd2l0aCByZWR1eC5cbiAgc3RvcmU6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBmcm9tUGFpcnMoIHRoaXMubW9kZWxzLm1hcCggcG9pbnQgPT4gWyBwb2ludC5pZCwgcG9pbnQuc3RvcmUoKSBdICkgKTtcbiAgfVxufSApO1xuXG4vLyAjIERpc3BsYXkgTmFtZSBmb3IgVHlwZVxuLy8gR2l2ZW4gYSB0eXBlIGtleSBmcm9tIGVpdGhlciB0aGUgc2VydmljZSBvciBhbGVydCB0eXBlIGVudW1lcmF0aW9ucyxcbi8vIHJldHVybiB0aGUgdHlwZSdzIGRpc3BsYXkgc3RyaW5nLCBvciBudWxsIGlmIGl0IGRvZXMgbm90IGV4aXN0LlxuZXhwb3J0IGZ1bmN0aW9uIGRpc3BsYXkoIHR5cGUgKSB7XG4gIGNvbnN0IHZhbHVlcyA9IHNlcnZpY2VUeXBlc1sgdHlwZSBdIHx8IGFsZXJ0VHlwZXNbIHR5cGUgXTtcbiAgaWYgKCB2YWx1ZXMgKSB7XG4gICAgcmV0dXJuIHZhbHVlcy5kaXNwbGF5O1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBudWxsO1xuICB9XG59XG5cbi8vICMgQ29tbWVudCBNb2RlbFxuLy8gSW5mb3JtYXRpb24gYWJvdXQgYWxlcnRzIGFuZCBzZXJ2aWNlcyBlbmNvdW50ZXJlZCBieSBjeWNsaXN0cyBpcyBsaWtlbHlcbi8vIHRvIGNoYW5nZSB3aXRoIHRoZSBzZWFzb25zIG9yIG90aGVyIHJlYXNvbnMuIEN5Y2xpc3RzIHBsYW5uaW5nIHRoZSBuZXh0IGxlZ1xuLy8gb2YgYSB0b3VyIHNob3VsZCBiZSBhYmxlIHRvIHJlYWQgdGhlIGV4cGVyaWVuY2VzIG9mIGN5Y2xpc3RzIGFoZWFkIG9mIHRoZW0uXG4vL1xuLy8gQSBjb21tZW50IG11c3QgaGF2ZSBib3RoIGEgcmF0aW5nIGFuZCB0aGUgdGV4dCBvZiB0aGUgY29tbWVudC4gQ29tbWVudHMgYXJlXG4vLyBsaW1pdGVkIHRvIDE0MCBjaGFyYWN0ZXJzIHRvIGVuc3VyZSB0aGV5IGRvIG5vdCBkZXZvbHZlIGludG8gZ2VuZXJhbCBhbGVydFxuLy8gb3Igc2VydmljZSBpbmZvcm1hdGlvbiB0aGF0IHNob3VsZCByZWFsbHkgYmUgaW4gdGhlIGRlc2NyaXB0aW9uLiBXZSByZWFsbHlcbi8vIHdhbnQgdXNlcnMgb2YgdGhlIEJpY3ljbGUgVG91cmluZyBDb21wYW5pb24gdG8gcHJvdmlkZSBjb21tZW50cyB2ZXJpZnlpbmdcbi8vIGluZm8gYWJvdXQgcG9pbnRzLCBvciBsZXR0aW5nIG90aGVyIGN5Y2xpc3RzIGtub3cgYWJvdXQgY2hhbmdlcyBpbiB0aGVcbi8vIHNlcnZpY2Ugb3IgYWxlcnQuXG5cbi8vICMjIENvbW1lbnQgTW9kZWwgVXJpXG4vLyBDb21tZW50cyBhcmUgc3RvcmVkIGluIENvdWNoREIgaW4gdGhlIHNhbWUgZGF0YWJhc2UgYXMgcG9pbnRzLiBUaGUgY29tbWVudFxuLy8gbW9kZWwgdXJpIGlzIGNvbXBvc2VkIG9mIHRocmVlIHBhcnRzOlxuLy8gIDEuIFRoZSBlbnRpcmUgaWQgb2YgdGhlIHJlbGF0ZWQgcG9pbnRcbi8vICAyLiBUaGUgc3RyaW5nICdjb21tZW50Lydcbi8vICAzLiBBIHRpbWUgYmFzZWQgVVVJRCB0byB1bmlxdWVseSBpZGVudGlmeSBjb21tZW50c1xuLy9cbi8vIFdlIGRvbid0IHVzZSBgZG9jdXJpYCBmb3IgdGhlIGNvbW1lbnQgbW9kZWwgdXJpcyBiZWNhdXNlIHdlIGRvbid0IGhhdmUgdG9cbi8vIHBhcnNlIHRoZW0uXG5cbmNvbnN0IENPTU1FTlRfTUFYX0xFTkdUSCA9IDE0MDtcbmV4cG9ydCBjb25zdCBDb21tZW50ID0gQ291Y2hNb2RlbC5leHRlbmQoIHtcbiAgaWRBdHRyaWJ1dGU6ICdfaWQnLFxuXG4gIC8vICMjIENvbnN0cnVjdG9yXG4gIC8vIEdlbmVyYXRlIGBfaWRgLiBgcG9pbnRJZGAgbXVzdCBiZSBzcGVjaWZpZWQgaW4gb3B0aW9ucy5cbiAgY29uc3RydWN0b3I6IGZ1bmN0aW9uKCBhdHRyaWJ1dGVzLCBvcHRpb25zICkge1xuICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICAgIGlmICggIWF0dHJpYnV0ZXMudXVpZCApIHtcbiAgICAgIGF0dHJpYnV0ZXMudXVpZCA9IHV1aWQudjEoKTtcbiAgICB9XG4gICAgaWYgKCAhYXR0cmlidXRlcy5faWQgJiYgb3B0aW9ucy5wb2ludElkICkge1xuICAgICAgYXR0cmlidXRlcy5faWQgPSBvcHRpb25zLnBvaW50SWQgKyAnL2NvbW1lbnQvJyArIGF0dHJpYnV0ZXMudXVpZDtcbiAgICB9XG4gICAgQ291Y2hNb2RlbC5hcHBseSggdGhpcywgYXJndW1lbnRzICk7XG4gIH0sXG5cbiAgc2NoZW1hOiB7XG4gICAgdHlwZTogJ29iamVjdCcsXG4gICAgYWRkaXRpb25hbFByb3BlcnRpZXM6IGZhbHNlLFxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgIHVzZXJuYW1lOiB7XG4gICAgICAgICd0eXBlJzogJ3N0cmluZydcbiAgICAgIH0sXG4gICAgICB0ZXh0OiB7XG4gICAgICAgICd0eXBlJzogJ3N0cmluZycsXG4gICAgICAgICdtYXhMZW5ndGgnOiBDT01NRU5UX01BWF9MRU5HVEhcbiAgICAgIH0sXG4gICAgICByYXRpbmc6IHtcbiAgICAgICAgdHlwZTogJ2ludGVnZXInLFxuICAgICAgICBtaW5pbXVtOiAxLFxuICAgICAgICBtYXhpbXVtOiA1XG4gICAgICB9LFxuICAgICAgdXVpZDoge1xuICAgICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgICAgfVxuICAgIH0sXG4gICAgcmVxdWlyZWQ6IFtcbiAgICAgICd1c2VybmFtZScsXG4gICAgICAndGV4dCcsXG4gICAgICAncmF0aW5nJyxcbiAgICAgICd1dWlkJ1xuICAgIF1cbiAgfVxufSwge1xuICBNQVhfTEVOR1RIOiBDT01NRU5UX01BWF9MRU5HVEhcbn0gKTtcblxubWl4aW5WYWxpZGF0aW9uKCBDb21tZW50ICk7XG5cbi8vICMgQ29tbWVudCBDb2xsZWN0aW9uXG4vLyBGZXRjaCBvbmx5IGNvbW1lbnRzIGFzc29jaWF0ZWQgd2l0aCBhIGdpdmVuIHBvaW50LlxuZXhwb3J0IGNvbnN0IENvbW1lbnRDb2xsZWN0aW9uID0gQ291Y2hDb2xsZWN0aW9uLmV4dGVuZCgge1xuICBpbml0aWFsaXplOiBmdW5jdGlvbiggbW9kZWxzLCBvcHRpb25zICkge1xuICAgIENvdWNoQ29sbGVjdGlvbi5wcm90b3R5cGUuaW5pdGlhbGl6ZS5hcHBseSggdGhpcywgYXJndW1lbnRzICk7XG4gICAgY29uc3QgcG9pbnRJZCA9IHRoaXMucG9pbnRJZCA9IG9wdGlvbnMucG9pbnRJZDtcblxuICAgIGNvbnN0IGNvbm5lY3QgPSB0aGlzLmNvbm5lY3Q7XG4gICAgY29uc3QgZGF0YWJhc2UgPSB0aGlzLmRhdGFiYXNlO1xuICAgIHRoaXMuY29tbWVudCA9IGNvbm5lY3QgPyBjb25uZWN0KCBkYXRhYmFzZSwgQ29tbWVudCApIDogQ29tbWVudDtcblxuICAgIHRoaXMucG91Y2ggPSB7XG4gICAgICBvcHRpb25zOiB7XG4gICAgICAgIGFsbERvY3M6IHtcbiAgICAgICAgICAuLi5rZXlzQmV0d2VlbiggcG9pbnRJZCArICcvY29tbWVudCcgKSxcbiAgICAgICAgICBpbmNsdWRlX2RvY3M6IHRydWVcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG4gIH0sXG5cbiAgbW9kZWw6IGZ1bmN0aW9uKCBhdHRyaWJ1dGVzLCBvcHRpb25zICkge1xuICAgIGNvbnN0IHtjb21tZW50LCBwb2ludElkfSA9IG9wdGlvbnMuY29sbGVjdGlvbjtcbiAgICByZXR1cm4gbmV3IGNvbW1lbnQoIGF0dHJpYnV0ZXMsIHsgcG9pbnRJZCwgLi4ub3B0aW9ucyB9ICk7XG4gIH1cbn0gKTtcbiJdfQ==