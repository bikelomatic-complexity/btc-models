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

    // this.pouch = {
    //   options: {
    //     allDocs: { include_docs: true, ...keysBetween( 'point/' ) }
    //   }
    // };

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tb2RlbC9wb2ludC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O1FBOGFnQixPQUFPLEdBQVAsT0FBTzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWhadkIsSUFBTSxPQUFPLEdBQUssT0FBTyxNQUFNLEtBQUssV0FBVyxBQUFFOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQyxBQWtCbEQsSUFBTSxPQUFPLEdBQUcsaUJBQU8sS0FBSyxDQUFFLDRCQUE0QixDQUFFLENBQUM7O0FBRXRELElBQU0sS0FBSyxXQUFMLEtBQUssR0FBRyxpQkFBVyxNQUFNLENBQUU7QUFDdEMsYUFBVyxFQUFFLEtBQUs7O0FBRWxCLFlBQVUsRUFBRSxvQkFBVSxVQUFVLEVBQUUsT0FBTyxFQUFHO0FBQzFDLHFCQUFXLFNBQVMsQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFFLElBQUksRUFBRSxTQUFTLENBQUUsQ0FBQzs7QUFFekQsUUFBTSxJQUFJLEdBQUcsSUFBSSxJQUFJLEVBQUUsQ0FBQyxXQUFXLEVBQUUsQ0FBQztBQUN0QyxRQUFJLENBQUMsR0FBRyxDQUFFO0FBQ1IsZ0JBQVUsRUFBRSxJQUFJO0FBQ2hCLGdCQUFVLEVBQUUsSUFBSTtLQUNqQixDQUFFLENBQUM7O0FBRUosUUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7QUFDdkIsUUFBSSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUM7R0FDdkI7O0FBRUQsUUFBTSxFQUFFLGtCQUFXO0FBQ2pCLFFBQUksQ0FBQyxHQUFHLENBQUUsWUFBWSxFQUFFLElBQUksSUFBSSxFQUFFLENBQUMsV0FBVyxFQUFFLENBQUUsQ0FBQztHQUNwRDs7Ozs7QUFLRCxTQUFPLEVBQUUsaUJBQVUsSUFBSSxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUc7QUFDeEMsUUFBSyxJQUFJLEVBQUc7cUNBQ1MsUUFBUTs7VUFBcEIsR0FBRztVQUFFLEdBQUc7O0FBQ2YsVUFBTSxHQUFHLEdBQUcsT0FBTyxDQUFFO0FBQ25CLFlBQUksRUFBRSxJQUFJO0FBQ1YsWUFBSSxFQUFFLG9CQUFXLElBQUksQ0FBRTtBQUN2QixlQUFPLEVBQUUsbUJBQVMsTUFBTSxDQUFFLEdBQUcsRUFBRSxHQUFHLENBQUU7T0FDckMsQ0FBRSxDQUFDO0FBQ0osVUFBSSxDQUFDLEdBQUcsQ0FBRSxFQUFFLEdBQUcsRUFBSCxHQUFHLEVBQUUsSUFBSSxFQUFKLElBQUksRUFBRSxJQUFJLEVBQUosSUFBSSxFQUFFLFFBQVEsRUFBUixRQUFRLEVBQUUsQ0FBRSxDQUFDO0tBQzNDLE1BQU07d0JBQ29CLElBQUksQ0FBQyxVQUFVO1VBQWpDLEtBQUksZUFBSixJQUFJO1VBQUUsVUFBUSxlQUFSLFFBQVE7O3NDQUNGLFVBQVE7O1VBQXBCLEdBQUc7VUFBRSxHQUFHOztBQUNmLFVBQU0sR0FBRyxHQUFHLE9BQU8sQ0FBRTtBQUNuQixZQUFJLEVBQUUsSUFBSTtBQUNWLFlBQUksRUFBRSxvQkFBVyxLQUFJLENBQUU7QUFDdkIsZUFBTyxFQUFFLG1CQUFTLE1BQU0sQ0FBRSxHQUFHLEVBQUUsR0FBRyxDQUFFO09BQ3JDLENBQUUsQ0FBQztBQUNKLFVBQUksQ0FBQyxHQUFHLENBQUUsRUFBRSxHQUFHLEVBQUgsR0FBRyxFQUFFLENBQUUsQ0FBQztLQUNyQjtHQUNGOzs7OztBQUtELFdBQVMsRUFBRSxDQUNULGNBQWMsQ0FDZjs7QUFFRCxVQUFRLEVBQUUsb0JBQVc7QUFDbkIsV0FBTztBQUNMLFVBQUksRUFBRSxLQUFLO0tBQ1osQ0FBQztHQUNIOztBQUVELFFBQU0sRUFBRTtBQUNOLFFBQUksRUFBRSxRQUFRO0FBQ2Qsd0JBQW9CLEVBQUUsS0FBSztBQUMzQixjQUFVLEVBQUU7QUFDVixVQUFJLEVBQUU7QUFDSixZQUFJLEVBQUUsUUFBUTtPQUNmO0FBQ0QsY0FBUSxFQUFFO0FBQ1IsWUFBSSxFQUFFLE9BQU87QUFDYixnQkFBUSxFQUFFLENBQUM7QUFDWCxnQkFBUSxFQUFFLENBQUM7QUFDWCxhQUFLLEVBQUU7QUFDTCxjQUFJLEVBQUUsUUFBUTtTQUNmO09BQ0Y7QUFDRCxVQUFJLEVBQUU7QUFDSixZQUFJLEVBQUUsUUFBUTtPQUNmO0FBQ0QsZ0JBQVUsRUFBRTtBQUNWLFlBQUksRUFBRSxRQUFRO0FBQ2QsY0FBTSxFQUFFLFdBQVc7T0FDcEI7QUFDRCxnQkFBVSxFQUFFO0FBQ1YsWUFBSSxFQUFFLFFBQVE7QUFDZCxjQUFNLEVBQUUsV0FBVztPQUNwQjtBQUNELGlCQUFXLEVBQUU7QUFDWCxZQUFJLEVBQUUsUUFBUTtPQUNmO0FBQ0QsVUFBSSxFQUFFO0FBQ0osWUFBSSxFQUFFLFNBQVM7T0FDaEI7S0FDRjtBQUNELFlBQVEsRUFBRSxDQUNSLE1BQU0sRUFDTixVQUFVLEVBQ1YsTUFBTSxFQUNOLFlBQVksRUFDWixZQUFZLEVBQ1osTUFBTSxDQUNQO0dBQ0Y7O0FBRUQsT0FBSyxFQUFFLGlCQUFXO0FBQ2hCLHFCQUFXLFNBQVMsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFFLElBQUksRUFBRSxTQUFTLENBQUUsQ0FBQztBQUNwRCxRQUFJLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQztHQUN2Qjs7Ozs7QUFLRCxPQUFLLEVBQUUsaUJBQVc7OztBQUNoQixXQUFPLGlCQUFXLFNBQVMsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFFLElBQUksRUFBRSxTQUFTLENBQUUsQ0FBQyxJQUFJLENBQUUsVUFBQSxHQUFHLEVBQUk7QUFDdEUsYUFBTyxNQUFLLFFBQVEsQ0FBRSxHQUFHLENBQUUsQ0FBQztLQUM3QixDQUFFLENBQUM7R0FDTDs7Ozs7Ozs7QUFRRCxVQUFRLEVBQUUsa0JBQVUsR0FBRyxFQUFHOzs7QUFDeEIsV0FBTyxPQUFPLENBQUMsT0FBTyxFQUFFLENBQUMsSUFBSSxDQUFFLFlBQU87QUFDcEMsVUFBTSxRQUFRLEdBQUcsc0JBQVUsT0FBSyxXQUFXLEVBQUUsRUFBRSxXQUFXLENBQUUsQ0FBQztBQUM3RCxVQUFLLE9BQU8sSUFBSSxRQUFRLEVBQUc7QUFDekIsZUFBTyxPQUFLLFVBQVUsQ0FBRSxXQUFXLENBQUUsQ0FBQztPQUN2QyxNQUFNO0FBQ0wsZUFBTztPQUNSO0tBQ0YsQ0FBRSxDQUFDLElBQUksQ0FBRSxVQUFBLElBQUksRUFBSTtBQUNoQixVQUFLLElBQUksRUFBRztBQUNWLGVBQUssU0FBUyxHQUFHLElBQUksQ0FBQztBQUN0QixlQUFLLFFBQVEsR0FBRywrQkFBaUIsSUFBSSxDQUFFLENBQUM7T0FDekM7S0FDRixDQUFFLENBQUMsSUFBSSxDQUFFLFlBQU87QUFDZixhQUFPLEdBQUcsQ0FBQztLQUNaLENBQUUsQ0FBQztHQUNMOzs7Ozs7Ozs7QUFTRCxVQUFRLEVBQUUsa0JBQVUsSUFBSSxFQUFHO0FBQ3pCLFFBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO0FBQ3RCLFFBQUssT0FBTyxFQUFHO0FBQ2IsVUFBSSxDQUFDLFFBQVEsR0FBRywrQkFBaUIsSUFBSSxDQUFFLENBQUM7S0FDekM7R0FDRjs7Ozs7QUFLRCxPQUFLLEVBQUUsaUJBQVc7QUFDaEIsd0JBQVksSUFBSSxDQUFDLE1BQU0sRUFBRSxJQUFFLFFBQVEsRUFBRSxJQUFJLENBQUMsUUFBUSxJQUFHO0dBQ3REO0NBQ0YsRUFBRTtBQUNELEtBQUcsRUFBRSxPQUFPOztBQUVaLEtBQUcsRUFBRSxjQUFBLEVBQUUsRUFBSTttQkFDTSxPQUFPLENBQUUsRUFBRSxDQUFFOztRQUFyQixJQUFJLFlBQUosSUFBSTs7QUFDWCxRQUFLLElBQUksS0FBSyxTQUFTLEVBQUc7QUFDeEIsYUFBTyxJQUFJLE9BQU8sQ0FBRSxFQUFFLEdBQUcsRUFBRSxFQUFFLEVBQUUsQ0FBRSxDQUFDO0tBQ25DLE1BQU0sSUFBSyxJQUFJLEtBQUssT0FBTyxFQUFHO0FBQzdCLGFBQU8sSUFBSSxLQUFLLENBQUUsRUFBRSxHQUFHLEVBQUUsRUFBRSxFQUFFLENBQUUsQ0FBQztLQUNqQyxNQUFNO0FBQ0wsWUFBTSwyQ0FBMkMsQ0FBQztLQUNuRDtHQUNGO0NBQ0YsQ0FBRTs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFDLEFBbUJHLElBQU0sWUFBWSxXQUFaLFlBQVksR0FBRztBQUMxQixXQUFTLEVBQVksRUFBRSxPQUFPLEVBQUUsU0FBUyxFQUFFO0FBQzNDLE9BQUssRUFBZ0IsRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFO0FBQ3ZDLHFCQUFtQixFQUFFLEVBQUUsT0FBTyxFQUFFLGlCQUFpQixFQUFFO0FBQ25ELGFBQVcsRUFBVSxFQUFFLE9BQU8sRUFBRSxXQUFXLEVBQUU7QUFDN0MsU0FBTyxFQUFjLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRTtBQUN6QyxjQUFZLEVBQVMsRUFBRSxPQUFPLEVBQUUsWUFBWSxFQUFFO0FBQzlDLHFCQUFtQixFQUFFLEVBQUUsT0FBTyxFQUFFLG1CQUFtQixFQUFFO0FBQ3JELG9CQUFrQixFQUFHLEVBQUUsT0FBTyxFQUFFLG9CQUFvQixFQUFFO0FBQ3RELG9CQUFrQixFQUFHLEVBQUUsT0FBTyxFQUFFLG9CQUFvQixFQUFFO0FBQ3RELFdBQVMsRUFBWSxFQUFFLE9BQU8sRUFBRSxTQUFTLEVBQUU7QUFDM0MsVUFBUSxFQUFhLEVBQUUsT0FBTyxFQUFFLFFBQVEsRUFBRTtBQUMxQyxjQUFZLEVBQVMsRUFBRSxPQUFPLEVBQUUsWUFBWSxFQUFFO0FBQzlDLFNBQU8sRUFBYyxFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUU7QUFDekMsU0FBTyxFQUFjLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRTtBQUN6QyxlQUFhLEVBQVEsRUFBRSxPQUFPLEVBQUUsYUFBYSxFQUFFO0FBQy9DLFdBQVMsRUFBWSxFQUFFLE9BQU8sRUFBRSxTQUFTLEVBQUU7QUFDM0MsVUFBUSxFQUFhLEVBQUUsT0FBTyxFQUFFLFFBQVEsRUFBRTtBQUMxQyxpQkFBZSxFQUFNLEVBQUUsT0FBTyxFQUFFLGVBQWUsRUFBRTtBQUNqRCxhQUFXLEVBQVUsRUFBRSxPQUFPLEVBQUUsV0FBVyxFQUFFO0FBQzdDLGNBQVksRUFBUyxFQUFFLE9BQU8sRUFBRSxZQUFZLEVBQUU7QUFDOUMsWUFBVSxFQUFXLEVBQUUsT0FBTyxFQUFFLFVBQVUsRUFBRTtBQUM1QyxlQUFhLEVBQVEsRUFBRSxPQUFPLEVBQUUsYUFBYSxFQUFFO0FBQy9DLGNBQVksRUFBUyxFQUFFLE9BQU8sRUFBRSxZQUFZLEVBQUU7QUFDOUMsU0FBTyxFQUFjLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRTtDQUMxQzs7O0FBQUMsQUFHSyxJQUFNLE9BQU8sV0FBUCxPQUFPLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBRTtBQUNuQyxTQUFPLEVBQUUsaUJBQVUsSUFBSSxFQUFFLFFBQVEsRUFBRztBQUNsQyxTQUFLLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsUUFBUSxDQUFFLENBQUM7R0FDakU7O0FBRUQsVUFBUSxFQUFFLG9CQUFXO0FBQ25CLHdCQUNLLEtBQUssQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBRSxJQUFJLEVBQUUsU0FBUyxDQUFFO0FBQ3BELGVBQVMsRUFBRSxFQUFFO0FBQ2IsY0FBUSxFQUFFLEVBQUUsU0FBUyxFQUFFLEVBQUUsRUFBRTtBQUMzQixjQUFRLEVBQUUsS0FBSztPQUNmO0dBQ0g7O0FBRUQsUUFBTSxFQUFFLG1DQUFjLEtBQUssQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFO0FBQzVDLGNBQVUsRUFBRTtBQUNWLFVBQUksRUFBRTtBQUNKLFlBQUksRUFBRSxrQkFBTSxZQUFZLENBQUU7T0FDM0I7QUFDRCxlQUFTLEVBQUU7QUFDVCxZQUFJLEVBQUUsT0FBTztBQUNiLGFBQUssRUFBRTtBQUNMLGNBQUksRUFBRSxRQUFRO0FBQ2QsY0FBSSxFQUFFLGtCQUFNLFlBQVksQ0FBRTtTQUMzQjtPQUNGO0FBQ0QsYUFBTyxFQUFFO0FBQ1AsWUFBSSxFQUFFLFFBQVE7T0FDZjtBQUNELGNBQVEsRUFBRTtBQUNSLFlBQUksRUFBRSxRQUFRO09BQ2Y7QUFDRCxjQUFRLEVBQUU7QUFDUixZQUFJLEVBQUUsU0FBUztPQUNoQjtBQUNELFdBQUssRUFBRTtBQUNMLFlBQUksRUFBRSxRQUFRO09BQ2Y7QUFDRCxhQUFPLEVBQUU7QUFDUCxZQUFJLEVBQUUsUUFBUTtBQUNkLGNBQU0sRUFBRSxLQUFLO09BQ2Q7QUFDRCxhQUFPLEVBQUU7QUFDUCxZQUFJLEVBQUUsU0FBUztBQUFBLE9BQ2hCO0tBQ0Y7QUFDRCxZQUFRLEVBQUUsQ0FDUixVQUFVLENBQ1g7R0FDRixDQUFFO0NBQ0osQ0FBRTs7O0FBQUMsQUFHSixzQ0FBaUIsT0FBTyxDQUFFOzs7Ozs7O0FBQUMsQUFPcEIsSUFBTSxVQUFVLFdBQVYsVUFBVSxHQUFHO0FBQ3hCLGdCQUFjLEVBQU8sRUFBRSxPQUFPLEVBQUUsY0FBYyxFQUFFO0FBQ2hELGVBQWEsRUFBUSxFQUFFLE9BQU8sRUFBRSxhQUFhLEVBQUU7QUFDL0MsWUFBVSxFQUFXLEVBQUUsT0FBTyxFQUFFLFVBQVUsRUFBRTtBQUM1QyxVQUFRLEVBQWEsRUFBRSxPQUFPLEVBQUUsUUFBUSxFQUFFO0FBQzFDLFNBQU8sRUFBYyxFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUU7Q0FDMUM7OztBQUFDLEFBR0ssSUFBTSxLQUFLLFdBQUwsS0FBSyxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUU7QUFDakMsU0FBTyxFQUFFLGlCQUFVLElBQUksRUFBRSxRQUFRLEVBQUc7QUFDbEMsU0FBSyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLFFBQVEsQ0FBRSxDQUFDO0dBQy9EOztBQUVELFFBQU0sRUFBRSxtQ0FBYyxLQUFLLENBQUMsU0FBUyxDQUFDLE1BQU0sRUFBRTtBQUM1QyxjQUFVLEVBQUU7QUFDVixVQUFJLEVBQUU7QUFDSixZQUFJLEVBQUUsa0JBQU0sVUFBVSxDQUFFO09BQ3pCO0tBQ0Y7R0FDRixDQUFFO0NBQ0osQ0FBRSxDQUFDOztBQUVKLHNDQUFpQixLQUFLLENBQUU7Ozs7Ozs7Ozs7OztBQUFDLEFBWWxCLElBQU0sZUFBZSxXQUFmLGVBQWUsR0FBRyxzQkFBZ0IsTUFBTSxDQUFFO0FBQ3JELFlBQVUsRUFBRSxvQkFBVSxNQUFNLEVBQUUsT0FBTyxFQUFHO0FBQ3RDLDBCQUFnQixTQUFTLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBRSxJQUFJLEVBQUUsU0FBUyxDQUFFLENBQUM7QUFDOUQsV0FBTyxHQUFHLE9BQU8sSUFBSSxFQUFFLENBQUM7O0FBRXhCLFFBQUksQ0FBQyxLQUFLLEdBQUc7QUFDWCxhQUFPLEVBQUU7QUFDUCxlQUFPLEVBQUUsb0JBQ1AsRUFBRSxZQUFZLEVBQUUsSUFBSSxFQUFFLEVBQ3RCLE9BQU8sQ0FBQyxJQUFJLEdBQUcsRUFBRSxJQUFJLEVBQUUsT0FBTyxDQUFDLElBQUksRUFBRSxHQUFHLHVCQUFhLFFBQVEsQ0FBRSxDQUNoRTtPQUNGO0tBQ0Y7Ozs7Ozs7O0FBQUEsUUFRTSxPQUFPLEdBQWMsSUFBSSxDQUF6QixPQUFPO1FBQUUsUUFBUSxHQUFJLElBQUksQ0FBaEIsUUFBUTs7QUFDeEIsUUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLEdBQUcsT0FBTyxDQUFFLFFBQVEsRUFBRSxPQUFPLENBQUUsR0FBRyxPQUFPLENBQUM7QUFDaEUsUUFBSSxDQUFDLEtBQUssR0FBRyxPQUFPLEdBQUcsT0FBTyxDQUFFLFFBQVEsRUFBRSxLQUFLLENBQUUsR0FBRyxLQUFLLENBQUM7R0FDM0Q7Ozs7QUFJRCxPQUFLLEVBQUUsZUFBVSxRQUFRLEVBQUUsT0FBTyxFQUFHO0FBQ25DLFdBQU8sUUFBUSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQ3pCLFVBQUEsR0FBRzthQUFJLEVBQUcsR0FBRyxDQUFDLE9BQU8sSUFBSSxHQUFHLENBQUMsS0FBSyxDQUFBLEFBQUU7S0FBQSxDQUNyQyxDQUFDLEdBQUcsQ0FDSCxVQUFBLEdBQUc7YUFBSSxHQUFHLENBQUMsR0FBRztLQUFBLENBQ2YsQ0FBQTtHQUNGOztBQUVELE9BQUssRUFBRSxlQUFVLFVBQVUsRUFBRSxPQUFPLEVBQUc7QUFDckMsUUFBTSxLQUFLLEdBQUcsT0FBTyxDQUFFLFVBQVUsQ0FBQyxHQUFHLENBQUUsQ0FBQztBQUN4QyxRQUFNLEdBQUcsR0FBRztBQUNWLGVBQVMsRUFBRSxPQUFPLENBQUMsVUFBVSxDQUFDLE9BQU87QUFDckMsYUFBTyxFQUFFLE9BQU8sQ0FBQyxVQUFVLENBQUMsS0FBSztLQUNsQyxDQUFDO0FBQ0YsUUFBTSxXQUFXLEdBQUcsR0FBRyxDQUFFLEtBQUssQ0FBQyxJQUFJLENBQUUsQ0FBQztBQUN0QyxRQUFLLFdBQVcsRUFBRztBQUNqQixhQUFPLElBQUksV0FBVyxDQUFFLFVBQVUsRUFBRSxPQUFPLENBQUUsQ0FBQztLQUMvQyxNQUFNO0FBQ0wsWUFBTSwyQ0FBMkMsQ0FBQztLQUNuRDtHQUNGOzs7OztBQUtELFdBQVMsRUFBRSxxQkFBVztBQUNwQixXQUFPLE9BQU8sQ0FBQyxHQUFHLENBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUUsVUFBQSxLQUFLO2FBQUksS0FBSyxDQUFDLFFBQVEsRUFBRTtLQUFBLENBQUUsQ0FBRSxDQUFDO0dBQ3BFOzs7OztBQUtELE9BQUssRUFBRSxpQkFBVztBQUNoQixXQUFPLHVCQUFXLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFFLFVBQUEsS0FBSzthQUFJLENBQUUsS0FBSyxDQUFDLEVBQUUsRUFBRSxLQUFLLENBQUMsS0FBSyxFQUFFLENBQUU7S0FBQSxDQUFFLENBQUUsQ0FBQztHQUM3RTtDQUNGLENBQUU7Ozs7O0FBQUMsQUFLRyxTQUFTLE9BQU8sQ0FBRSxJQUFJLEVBQUc7QUFDOUIsTUFBTSxNQUFNLEdBQUcsWUFBWSxDQUFFLElBQUksQ0FBRSxJQUFJLFVBQVUsQ0FBRSxJQUFJLENBQUUsQ0FBQztBQUMxRCxNQUFLLE1BQU0sRUFBRztBQUNaLFdBQU8sTUFBTSxDQUFDLE9BQU8sQ0FBQztHQUN2QixNQUFNO0FBQ0wsV0FBTyxJQUFJLENBQUM7R0FDYjtDQUNGOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxBQXdCRCxJQUFNLGtCQUFrQixHQUFHLEdBQUcsQ0FBQztBQUN4QixJQUFNLE9BQU8sV0FBUCxPQUFPLEdBQUcsaUJBQVcsTUFBTSxDQUFFO0FBQ3hDLGFBQVcsRUFBRSxLQUFLOzs7O0FBSWxCLGFBQVcsRUFBRSxxQkFBVSxVQUFVLEVBQUUsT0FBTyxFQUFHO0FBQzNDLFdBQU8sR0FBRyxPQUFPLElBQUksRUFBRSxDQUFDO0FBQ3hCLFFBQUssQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFHO0FBQ3RCLGdCQUFVLENBQUMsSUFBSSxHQUFHLG1CQUFLLEVBQUUsRUFBRSxDQUFDO0tBQzdCO0FBQ0QsUUFBSyxDQUFDLFVBQVUsQ0FBQyxHQUFHLElBQUksT0FBTyxDQUFDLE9BQU8sRUFBRztBQUN4QyxnQkFBVSxDQUFDLEdBQUcsR0FBRyxPQUFPLENBQUMsT0FBTyxHQUFHLFdBQVcsR0FBRyxVQUFVLENBQUMsSUFBSSxDQUFDO0tBQ2xFO0FBQ0QscUJBQVcsS0FBSyxDQUFFLElBQUksRUFBRSxTQUFTLENBQUUsQ0FBQztHQUNyQzs7QUFFRCxRQUFNLEVBQUU7QUFDTixRQUFJLEVBQUUsUUFBUTtBQUNkLHdCQUFvQixFQUFFLEtBQUs7QUFDM0IsY0FBVSxFQUFFO0FBQ1YsY0FBUSxFQUFFO0FBQ1IsY0FBTSxFQUFFLFFBQVE7T0FDakI7QUFDRCxVQUFJLEVBQUU7QUFDSixjQUFNLEVBQUUsUUFBUTtBQUNoQixtQkFBVyxFQUFFLGtCQUFrQjtPQUNoQztBQUNELFlBQU0sRUFBRTtBQUNOLFlBQUksRUFBRSxTQUFTO0FBQ2YsZUFBTyxFQUFFLENBQUM7QUFDVixlQUFPLEVBQUUsQ0FBQztPQUNYO0FBQ0QsVUFBSSxFQUFFO0FBQ0osWUFBSSxFQUFFLFFBQVE7T0FDZjtLQUNGO0FBQ0QsWUFBUSxFQUFFLENBQ1IsVUFBVSxFQUNWLE1BQU0sRUFDTixRQUFRLEVBQ1IsTUFBTSxDQUNQO0dBQ0Y7Q0FDRixFQUFFO0FBQ0QsWUFBVSxFQUFFLGtCQUFrQjtDQUMvQixDQUFFLENBQUM7O0FBRUosc0NBQWlCLE9BQU8sQ0FBRTs7OztBQUFDLEFBSXBCLElBQU0saUJBQWlCLFdBQWpCLGlCQUFpQixHQUFHLHNCQUFnQixNQUFNLENBQUU7QUFDdkQsWUFBVSxFQUFFLG9CQUFVLE1BQU0sRUFBRSxPQUFPLEVBQUc7QUFDdEMsMEJBQWdCLFNBQVMsQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFFLElBQUksRUFBRSxTQUFTLENBQUUsQ0FBQztBQUM5RCxRQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUM7O0FBRS9DLFFBQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUM7QUFDN0IsUUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQztBQUMvQixRQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sR0FBRyxPQUFPLENBQUUsUUFBUSxFQUFFLE9BQU8sQ0FBRSxHQUFHLE9BQU8sQ0FBQzs7QUFFaEUsUUFBSSxDQUFDLEtBQUssR0FBRztBQUNYLGFBQU8sRUFBRTtBQUNQLGVBQU8sZUFDRix1QkFBYSxPQUFPLEdBQUcsVUFBVSxDQUFFO0FBQ3RDLHNCQUFZLEVBQUUsSUFBSTtVQUNuQjtPQUNGO0tBQ0YsQ0FBQztHQUNIOztBQUVELE9BQUssRUFBRSxlQUFVLFVBQVUsRUFBRSxPQUFPLEVBQUc7OEJBQ1YsT0FBTyxDQUFDLFVBQVU7UUFBdEMsT0FBTyx1QkFBUCxPQUFPO1FBQUUsT0FBTyx1QkFBUCxPQUFPOztBQUN2QixXQUFPLElBQUksT0FBTyxDQUFFLFVBQVUsYUFBSSxPQUFPLEVBQVAsT0FBTyxJQUFLLE9BQU8sRUFBSSxDQUFDO0dBQzNEO0NBQ0YsQ0FBRSxDQUFDIiwiZmlsZSI6InBvaW50LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogYnRjLWFwcC1zZXJ2ZXIgLS0gU2VydmVyIGZvciB0aGUgQmljeWNsZSBUb3VyaW5nIENvbXBhbmlvblxuICogQ29weXJpZ2h0IMKpIDIwMTYgQWR2ZW50dXJlIEN5Y2xpbmcgQXNzb2NpYXRpb25cbiAqXG4gKiBUaGlzIGZpbGUgaXMgcGFydCBvZiBidGMtYXBwLXNlcnZlci5cbiAqXG4gKiBidGMtYXBwLXNlcnZlciBpcyBmcmVlIHNvZnR3YXJlOiB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5XG4gKiBpdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEFmZmVybyBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBhcyBwdWJsaXNoZWQgYnlcbiAqIHRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24sIGVpdGhlciB2ZXJzaW9uIDMgb2YgdGhlIExpY2Vuc2UsIG9yXG4gKiAoYXQgeW91ciBvcHRpb24pIGFueSBsYXRlciB2ZXJzaW9uLlxuICpcbiAqIGJ0Yy1hcHAtc2VydmVyIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXG4gKiBidXQgV0lUSE9VVCBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZlxuICogTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiAgU2VlIHRoZVxuICogQWZmZXJvIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXG4gKlxuICogWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgQWZmZXJvIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4gKiBhbG9uZyB3aXRoIEZvb2Jhci4gIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cbiAqL1xuXG5pbXBvcnQgeyBtaXhpblZhbGlkYXRpb24sIG1lcmdlU2NoZW1hcyB9IGZyb20gJy4vdmFsaWRhdGlvbi1taXhpbic7XG5pbXBvcnQgeyBDb3VjaE1vZGVsLCBDb3VjaENvbGxlY3Rpb24sIGtleXNCZXR3ZWVuIH0gZnJvbSAnLi9iYXNlJztcblxuaW1wb3J0IHsga2V5cywgZnJvbVBhaXJzLCBpbmNsdWRlcywgYXNzaWduIH0gZnJvbSAnbG9kYXNoJztcbmltcG9ydCB7IGNyZWF0ZU9iamVjdFVSTCB9IGZyb20gJ2Jsb2ItdXRpbCc7XG5cbmltcG9ydCBkb2N1cmkgZnJvbSAnZG9jdXJpJztcbmltcG9ydCBuZ2VvaGFzaCBmcm9tICduZ2VvaGFzaCc7XG5pbXBvcnQgbm9ybWFsaXplIGZyb20gJ3RvLWlkJztcbmltcG9ydCB1dWlkIGZyb20gJ25vZGUtdXVpZCc7XG5cbmNvbnN0IGJyb3dzZXIgPSAoIHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICk7XG5cbi8vICMgUG9pbnQgTW9kZWxcbi8vIFRoZSBwb2ludCByZXByZXNlbnRzIGEgbG9jYXRpb24gb24gdGhlIG1hcCB3aXRoIGFzc29jaWF0ZWQgbWV0YWRhdGEsIGdlb2RhdGEsXG4vLyBhbmQgdXNlciBwcm92aWRlZCBkYXRhLiBUaGUgcG9pbnQgaXMgdGhlIGJhc2Ugc2hhcmVkIGJ5IHNlcnZpY2VzIGFuZCBhbGVydHMuXG4vL1xuLy8gVGhlIEpTT04gc2NoZW1hIHN0b3JlZCBpbiBgUG9pbnRgLCBhbmQgYXMgcGF0Y2hlZCBieSBgU2VydmljZWAgYW5kIGBBbGVydGAsXG4vLyBpcyB0aGUgYXV0aG9yaXRhdGl2ZSBkZWZpbml0aW9uIG9mIHRoZSBwb2ludCByZWNvcmQuXG5cbi8vICMjIFBvaW50IE1vZGVsIFVyaVxuLy8gUG9pbnRzIGFyZSBzdG9yZWQgaW4gQ291Y2hEQi4gQ291Y2hEQiBkb2N1bWVudHMgY2FuIGhhdmUgcmljaCBpZCBzdHJpbmdzXG4vLyB0byBoZWxwIHN0b3JlIGFuZCBhY2Nlc3MgZGF0YSB3aXRob3V0IE1hcFJlZHVjZSBqb2JzLlxuLy9cbi8vIFRoZSBwb2ludCBtb2RlbCB1cmkgaXMgY29tcG9zZWQgb2YgZm91ciBwYXJ0czpcbi8vICAxLiBUaGUgc3RyaW5nICdwb2ludC8nYFxuLy8gIDIuIFRoZSB0eXBlIG9mIHBvaW50LCBlaXRoZXIgJ3NlcnZpY2UnIG9yICdhbGVydCdcbi8vICAzLiBUaGUgbm9ybWFsaXplZCBuYW1lIG9mIHRoZSBwb2ludFxuLy8gIDQuIFRoZSBwb2ludCdzIGdlb2hhc2hcbmNvbnN0IHBvaW50SWQgPSBkb2N1cmkucm91dGUoICdwb2ludC86dHlwZS86bmFtZS86Z2VvaGFzaCcgKTtcblxuZXhwb3J0IGNvbnN0IFBvaW50ID0gQ291Y2hNb2RlbC5leHRlbmQoIHtcbiAgaWRBdHRyaWJ1dGU6ICdfaWQnLFxuXG4gIGluaXRpYWxpemU6IGZ1bmN0aW9uKCBhdHRyaWJ1dGVzLCBvcHRpb25zICkge1xuICAgIENvdWNoTW9kZWwucHJvdG90eXBlLmluaXRpYWxpemUuYXBwbHkoIHRoaXMsIGFyZ3VtZW50cyApO1xuXG4gICAgY29uc3QgZGF0ZSA9IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKTtcbiAgICB0aGlzLnNldCgge1xuICAgICAgY3JlYXRlZF9hdDogZGF0ZSxcbiAgICAgIHVwZGF0ZWRfYXQ6IGRhdGVcbiAgICB9ICk7XG5cbiAgICB0aGlzLmNvdmVyQmxvYiA9IGZhbHNlO1xuICAgIHRoaXMuY292ZXJVcmwgPSBmYWxzZTtcbiAgfSxcblxuICB1cGRhdGU6IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuc2V0KCAndXBkYXRlZF9hdCcsIG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSApO1xuICB9LFxuXG4gIC8vICMjIFNwZWNpZnlcbiAgLy8gRmlsbCBpbiBgX2lkYCBmcm9tIHRoZSBjb21wb25lbnRzIG9mIHRoZSBwb2ludCBtb2RlbCB1cmkuXG4gIC8vIFB1bGwgdmFsdWVzIGZyb20gYGF0dHJpYnV0ZXNgIGlmIG5hbWUgYW5kIGxvY2F0aW9uIGFyZSB1bmRlZmluZWQuXG4gIHNwZWNpZnk6IGZ1bmN0aW9uKCB0eXBlLCBuYW1lLCBsb2NhdGlvbiApIHtcbiAgICBpZiAoIG5hbWUgKSB7XG4gICAgICBjb25zdCBbbGF0LCBsbmddID0gbG9jYXRpb247XG4gICAgICBjb25zdCBfaWQgPSBwb2ludElkKCB7XG4gICAgICAgIHR5cGU6IHR5cGUsXG4gICAgICAgIG5hbWU6IG5vcm1hbGl6ZSggbmFtZSApLFxuICAgICAgICBnZW9oYXNoOiBuZ2VvaGFzaC5lbmNvZGUoIGxhdCwgbG5nIClcbiAgICAgIH0gKTtcbiAgICAgIHRoaXMuc2V0KCB7IF9pZCwgdHlwZSwgbmFtZSwgbG9jYXRpb24gfSApO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCB7bmFtZSwgbG9jYXRpb259ID0gdGhpcy5hdHRyaWJ1dGVzO1xuICAgICAgY29uc3QgW2xhdCwgbG5nXSA9IGxvY2F0aW9uO1xuICAgICAgY29uc3QgX2lkID0gcG9pbnRJZCgge1xuICAgICAgICB0eXBlOiB0eXBlLFxuICAgICAgICBuYW1lOiBub3JtYWxpemUoIG5hbWUgKSxcbiAgICAgICAgZ2VvaGFzaDogbmdlb2hhc2guZW5jb2RlKCBsYXQsIGxuZyApXG4gICAgICB9ICk7XG4gICAgICB0aGlzLnNldCggeyBfaWQgfSApO1xuICAgIH1cbiAgfSxcblxuICAvLyAjIyBTYWZlZ3VhcmQgZm9yIFBvaW50c1xuICAvLyBQb2ludHMgaGF2ZSBpbWFnZSBhdHRhY2htZW50cywgc28gd2Ugc2hvdWxkIGxldCBiYWNrYm9uZSBwb3VjaCBoYW5kbGVcbiAgLy8gdGhvc2UgYW5kIHdlIHNob3VsZCBub3QgdmFsaWRhdGUgdGhlIF9hdHRhY2htZW50cyBrZXlcbiAgc2FmZWd1YXJkOiBbXG4gICAgJ19hdHRhY2htZW50cydcbiAgXSxcblxuICBkZWZhdWx0czogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGZsYWc6IGZhbHNlXG4gICAgfTtcbiAgfSxcblxuICBzY2hlbWE6IHtcbiAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICBhZGRpdGlvbmFsUHJvcGVydGllczogZmFsc2UsXG4gICAgcHJvcGVydGllczoge1xuICAgICAgbmFtZToge1xuICAgICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgICAgfSxcbiAgICAgIGxvY2F0aW9uOiB7XG4gICAgICAgIHR5cGU6ICdhcnJheScsXG4gICAgICAgIG1pbkl0ZW1zOiAyLFxuICAgICAgICBtYXhJdGVtczogMixcbiAgICAgICAgaXRlbXM6IHtcbiAgICAgICAgICB0eXBlOiAnbnVtYmVyJ1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgdHlwZToge1xuICAgICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgICAgfSxcbiAgICAgIGNyZWF0ZWRfYXQ6IHtcbiAgICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICAgIGZvcm1hdDogJ2RhdGUtdGltZSdcbiAgICAgIH0sXG4gICAgICB1cGRhdGVkX2F0OiB7XG4gICAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgICBmb3JtYXQ6ICdkYXRlLXRpbWUnXG4gICAgICB9LFxuICAgICAgZGVzY3JpcHRpb246IHtcbiAgICAgICAgdHlwZTogJ3N0cmluZydcbiAgICAgIH0sXG4gICAgICBmbGFnOiB7XG4gICAgICAgIHR5cGU6ICdib29sZWFuJ1xuICAgICAgfVxuICAgIH0sXG4gICAgcmVxdWlyZWQ6IFtcbiAgICAgICduYW1lJyxcbiAgICAgICdsb2NhdGlvbicsXG4gICAgICAndHlwZScsXG4gICAgICAnY3JlYXRlZF9hdCcsXG4gICAgICAndXBkYXRlZF9hdCcsXG4gICAgICAnZmxhZydcbiAgICBdXG4gIH0sXG5cbiAgY2xlYXI6IGZ1bmN0aW9uKCkge1xuICAgIENvdWNoTW9kZWwucHJvdG90eXBlLmNsZWFyLmFwcGx5KCB0aGlzLCBhcmd1bWVudHMgKTtcbiAgICB0aGlzLmNvdmVyVXJsID0gZmFsc2U7XG4gIH0sXG5cbiAgLy8gIyMgRmV0Y2hcbiAgLy8gV2hlbiBmZXRjaGluZyBhIHBvaW50LCBzaG91bGQgaXQgaGF2ZSBhIGNvdmVyIGF0dGFjaG1lbnQsIGV4dGVuZCB0aGVcbiAgLy8gcHJvbWlzZSB0byBmZXRjaCB0aGUgYXR0YWNobWVudCBhbmQgc2V0IGB0aGlzLmNvdmVyVXJsYC5cbiAgZmV0Y2g6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBDb3VjaE1vZGVsLnByb3RvdHlwZS5mZXRjaC5hcHBseSggdGhpcywgYXJndW1lbnRzICkudGhlbiggcmVzID0+IHtcbiAgICAgIHJldHVybiB0aGlzLmdldENvdmVyKCByZXMgKTtcbiAgICB9ICk7XG4gIH0sXG5cbiAgLy8gIyBHZXQgQ292ZXJcbiAgLy8gU2hvdWxkIGEgcG9pbnQgKGFscmVhZHkgZmV0Y2hlZCkgaGF2ZSBhIGNvdmVyIGF0dGFjaG1lbnQsIGdldCB0aGVcbiAgLy8gYXR0YWNobWVudCdzIGRhdGEgYW5kIHN0b3JlIGFuIG9iamVjdCB1cmwgZm9yIGl0IGluIGB0aGlzLmNvdmVyVXJsYFxuICAvL1xuICAvLyBBcyBhIHV0aWxpdHkgdG8gY2xpZW50IGZ1bmN0aW9ucywgcmVzb2x2ZSB0aGUgcmV0dXJuZWQgcHJvbWlzZSB0byB0aGVcbiAgLy8gc2luZ2xlIGFyZ3VtZW50IHBhc3NlZCB0byBgZ2V0Q292ZXJgLlxuICBnZXRDb3ZlcjogZnVuY3Rpb24oIHJldCApIHtcbiAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCkudGhlbiggKCApID0+IHtcbiAgICAgIGNvbnN0IGhhc0NvdmVyID0gaW5jbHVkZXMoIHRoaXMuYXR0YWNobWVudHMoKSwgJ2NvdmVyLnBuZycgKTtcbiAgICAgIGlmICggYnJvd3NlciAmJiBoYXNDb3ZlciApIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYXR0YWNobWVudCggJ2NvdmVyLnBuZycgKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICB9ICkudGhlbiggYmxvYiA9PiB7XG4gICAgICBpZiAoIGJsb2IgKSB7XG4gICAgICAgIHRoaXMuY292ZXJCbG9iID0gYmxvYjtcbiAgICAgICAgdGhpcy5jb3ZlclVybCA9IGNyZWF0ZU9iamVjdFVSTCggYmxvYiApO1xuICAgICAgfVxuICAgIH0gKS50aGVuKCAoICkgPT4ge1xuICAgICAgcmV0dXJuIHJldDtcbiAgICB9ICk7XG4gIH0sXG5cbiAgLy8gIyMgU2V0IENvdmVyXG4gIC8vIElmIHRoZSB1c2VyIGFscmVhZHkgaGFzIGEgY292ZXIgYmxvYiBhbmQgdGhleSB3YW50IHRvIHVzZSBpdCB3aXRoIHRoZVxuICAvLyBtb2RlbCBiZWZvcmUgYXR0YWNoKCkgY2FuIGZpbmlzaCBzdG9yaW5nIGl0IHRvIFBvdWNoREIsIHRoZXkgY2FuIHVzZVxuICAvLyB0aGlzIG1ldGhvZCB0byBtYW51YWxseSBpbnNlcnQgaXQuXG4gIC8vXG4gIC8vIFRoZSBhc3NvY2lhdGVkIG9iamVjdCB1cmwgZm9yIHRoZSBibG9iIHdpbGwgdGhlbiBiZSBhdmFpbGFibGUgdG8gb3RoZXJcbiAgLy8gZnVuY3Rpb25zIGxpa2Ugc3RvcmUoKS5cbiAgc2V0Q292ZXI6IGZ1bmN0aW9uKCBibG9iICkge1xuICAgIHRoaXMuY292ZXJCbG9iID0gYmxvYjtcbiAgICBpZiAoIGJyb3dzZXIgKSB7XG4gICAgICB0aGlzLmNvdmVyVXJsID0gY3JlYXRlT2JqZWN0VVJMKCBibG9iICk7XG4gICAgfVxuICB9LFxuXG4gIC8vICMjIEdldCBSZWR1eCBSZXByZXNlbnRhdGlvblxuICAvLyBSZXR1cm4gYSBuZXN0ZWQgb2JqZWN0L2FyYXJ5IHJlcHJlc2VudGF0aW9uIG9mIHRoZSBtb2RlbCBzdWl0YWJsZSBmb3JcbiAgLy8gdXNlIHdpdGggcmVkdXguXG4gIHN0b3JlOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4geyAuLi50aGlzLnRvSlNPTigpLCBjb3ZlclVybDogdGhpcy5jb3ZlclVybCB9O1xuICB9XG59LCB7XG4gIHVyaTogcG9pbnRJZCxcblxuICBmb3I6IGlkID0+IHtcbiAgICBjb25zdCB7dHlwZX0gPSBwb2ludElkKCBpZCApO1xuICAgIGlmICggdHlwZSA9PT0gJ3NlcnZpY2UnICkge1xuICAgICAgcmV0dXJuIG5ldyBTZXJ2aWNlKCB7IF9pZDogaWQgfSApO1xuICAgIH0gZWxzZSBpZiAoIHR5cGUgPT09ICdhbGVydCcgKSB7XG4gICAgICByZXR1cm4gbmV3IEFsZXJ0KCB7IF9pZDogaWQgfSApO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyAnQSBwb2ludCBtdXN0IGVpdGhlciBiZSBhIHNlcnZpY2Ugb3IgYWxlcnQnO1xuICAgIH1cbiAgfVxufSApO1xuXG4vLyAjIFNlcnZpY2UgTW9kZWxcbi8vIEEgc2VydmljZSBpcyBhIGJ1aXNuZXNzIG9yIHBvaW50IG9mIGludGVyZXN0IHRvIGEgY3ljbGlzdC4gQSBjeWNsaXN0IG5lZWRzXG4vLyB0byBrbm93IHdoZXJlIHRoZXkgd2FudCB0byBzdG9wIHdlbGwgaW4gYWR2YW5jZSBvZiB0aGVpciB0cmF2ZWwgdGhyb3VnaCBhblxuLy8gYXJlYS4gVGhlIHNlcnZpY2UgcmVjb3JkIG11c3QgY29udGFpbiBlbm91Z2ggaW5mb3JtYXRpb24gdG8gaGVscCB0aGUgY3ljbGlzdFxuLy8gbWFrZSBzdWNoIGRlY2lzaW9ucy5cbi8vXG4vLyBUaGUgcmVjb3JkIGluY2x1ZGVzIGNvbnRhY3QgaW5mb3JtYXRpb24sIGFuZCBhIHNjaGVkdWxlIG9mIGhvdXJzIG9mXG4vLyBvcGVyYXRpb24uIEl0IGlzIGltcG9ydGFudCB0aGF0IHdlIHN0b3JlIHRoZSB0aW1lIHpvbmUgb2YgYSBzZXJ2aWNlLCBzaW5jZVxuLy8gdG91cmluZyBjeWNsaXN0cyB3aWxsIGNyb3NzIHRpbWUgem9uZXMgb24gdGhlaXIgdHJhdmVscy4gRnVydGhlcm1vcmUsXG4vLyBzZXJ2aWNlcyBvZiBpbnRlcmVzdCB0byB0b3VyaW5nIGN5Y2xpc3RzIG1heSBiZSBzZWFzb25hbDogd2Ugc3RvcmVcbi8vIHNjaGVkdWxlcyBmb3IgZGlmZmVyZW50IHNlYXNvbnMuXG5cbi8vICMjIFNlcnZpY2UgVHlwZXNcbi8vIEEgU2VydmljZSBtYXkgaGF2ZSBhIHNpbmdsZSB0eXBlLCBpbmRpY2F0aW5nIHRoZSBwcmltYXJ5IHB1cnBvc2Ugb2YgdGhlXG4vLyBidWlzbmVzcyBvciBwb2ludCBvZiBpbnRlcmVzdC4gU2VydmljZSB0eXBlcyBtYXkgYWxzbyBiZSBpbmNsdWRlZCBpbiBhXG4vLyBTZXJ2aWNlJ3MgYW1lbml0aWVzIGFycmF5LlxuLyplc2ZtdC1pZ25vcmUtc3RhcnQqL1xuZXhwb3J0IGNvbnN0IHNlcnZpY2VUeXBlcyA9IHtcbiAgJ2FpcnBvcnQnOiAgICAgICAgICAgeyBkaXNwbGF5OiAnQWlycG9ydCcgfSxcbiAgJ2Jhcic6ICAgICAgICAgICAgICAgeyBkaXNwbGF5OiAnQmFyJyB9LFxuICAnYmVkX2FuZF9icmVha2Zhc3QnOiB7IGRpc3BsYXk6ICdCZWQgJiBCcmVha2Zhc3QnIH0sXG4gICdiaWtlX3Nob3AnOiAgICAgICAgIHsgZGlzcGxheTogJ0Jpa2UgU2hvcCcgfSxcbiAgJ2NhYmluJzogICAgICAgICAgICAgeyBkaXNwbGF5OiAnQ2FiaW4nIH0sXG4gICdjYW1wZ3JvdW5kJzogICAgICAgIHsgZGlzcGxheTogJ0NhbXBncm91bmQnIH0sXG4gICdjb252ZW5pZW5jZV9zdG9yZSc6IHsgZGlzcGxheTogJ0NvbnZlbmllbmNlIFN0b3JlJyB9LFxuICAnY3ljbGlzdHNfY2FtcGluZyc6ICB7IGRpc3BsYXk6ICdDeWNsaXN0c1xcJyBDYW1waW5nJyB9LFxuICAnY3ljbGlzdHNfbG9kZ2luZyc6ICB7IGRpc3BsYXk6ICdDeWNsaXN0c1xcJyBMb2RnaW5nJyB9LFxuICAnZ3JvY2VyeSc6ICAgICAgICAgICB7IGRpc3BsYXk6ICdHcm9jZXJ5JyB9LFxuICAnaG9zdGVsJzogICAgICAgICAgICB7IGRpc3BsYXk6ICdIb3N0ZWwnIH0sXG4gICdob3Rfc3ByaW5nJzogICAgICAgIHsgZGlzcGxheTogJ0hvdCBTcHJpbmcnIH0sXG4gICdob3RlbCc6ICAgICAgICAgICAgIHsgZGlzcGxheTogJ0hvdGVsJyB9LFxuICAnbW90ZWwnOiAgICAgICAgICAgICB7IGRpc3BsYXk6ICdNb3RlbCcgfSxcbiAgJ2luZm9ybWF0aW9uJzogICAgICAgeyBkaXNwbGF5OiAnSW5mb3JtYXRpb24nIH0sXG4gICdsaWJyYXJ5JzogICAgICAgICAgIHsgZGlzcGxheTogJ0xpYnJhcnknIH0sXG4gICdtdXNldW0nOiAgICAgICAgICAgIHsgZGlzcGxheTogJ011c2V1bScgfSxcbiAgJ291dGRvb3Jfc3RvcmUnOiAgICAgeyBkaXNwbGF5OiAnT3V0ZG9vciBTdG9yZScgfSxcbiAgJ3Jlc3RfYXJlYSc6ICAgICAgICAgeyBkaXNwbGF5OiAnUmVzdCBBcmVhJyB9LFxuICAncmVzdGF1cmFudCc6ICAgICAgICB7IGRpc3BsYXk6ICdSZXN0YXVyYW50JyB9LFxuICAncmVzdHJvb20nOiAgICAgICAgICB7IGRpc3BsYXk6ICdSZXN0cm9vbScgfSxcbiAgJ3NjZW5pY19hcmVhJzogICAgICAgeyBkaXNwbGF5OiAnU2NlbmljIEFyZWEnIH0sXG4gICdzdGF0ZV9wYXJrJzogICAgICAgIHsgZGlzcGxheTogJ1N0YXRlIFBhcmsnIH0sXG4gICdvdGhlcic6ICAgICAgICAgICAgIHsgZGlzcGxheTogJ090aGVyJyB9XG59O1xuLyplc2ZtdC1pZ25vcmUtZW5kKi9cblxuZXhwb3J0IGNvbnN0IFNlcnZpY2UgPSBQb2ludC5leHRlbmQoIHtcbiAgc3BlY2lmeTogZnVuY3Rpb24oIG5hbWUsIGxvY2F0aW9uICkge1xuICAgIFBvaW50LnByb3RvdHlwZS5zcGVjaWZ5LmNhbGwoIHRoaXMsICdzZXJ2aWNlJywgbmFtZSwgbG9jYXRpb24gKTtcbiAgfSxcblxuICBkZWZhdWx0czogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIC4uLlBvaW50LnByb3RvdHlwZS5kZWZhdWx0cy5hcHBseSggdGhpcywgYXJndW1lbnRzICksXG4gICAgICBhbWVuaXRpZXM6IFtdLFxuICAgICAgc2NoZWR1bGU6IHsgJ2RlZmF1bHQnOiBbXSB9LFxuICAgICAgc2Vhc29uYWw6IGZhbHNlXG4gICAgfTtcbiAgfSxcblxuICBzY2hlbWE6IG1lcmdlU2NoZW1hcyggUG9pbnQucHJvdG90eXBlLnNjaGVtYSwge1xuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgIHR5cGU6IHtcbiAgICAgICAgZW51bToga2V5cyggc2VydmljZVR5cGVzIClcbiAgICAgIH0sXG4gICAgICBhbWVuaXRpZXM6IHtcbiAgICAgICAgdHlwZTogJ2FycmF5JyxcbiAgICAgICAgaXRlbXM6IHtcbiAgICAgICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgICAgICBlbnVtOiBrZXlzKCBzZXJ2aWNlVHlwZXMgKVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgYWRkcmVzczoge1xuICAgICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgICAgfSxcbiAgICAgIHNjaGVkdWxlOiB7XG4gICAgICAgIHR5cGU6ICdvYmplY3QnXG4gICAgICB9LFxuICAgICAgc2Vhc29uYWw6IHtcbiAgICAgICAgdHlwZTogJ2Jvb2xlYW4nXG4gICAgICB9LFxuICAgICAgcGhvbmU6IHtcbiAgICAgICAgdHlwZTogJ3N0cmluZydcbiAgICAgIH0sXG4gICAgICB3ZWJzaXRlOiB7XG4gICAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgICBmb3JtYXQ6ICd1cmknXG4gICAgICB9LFxuICAgICAgdXBkYXRlZDoge1xuICAgICAgICB0eXBlOiAnYm9vbGVhbicgIC8vIHRoZSB1cGRhdGVkIGF0dHJpYnV0ZSBpcyBub3QgcmVxdWlyZWRcbiAgICAgIH1cbiAgICB9LFxuICAgIHJlcXVpcmVkOiBbXG4gICAgICAnc2Vhc29uYWwnXG4gICAgXVxuICB9IClcbn0gKTtcblxuLy8gQXBwbHkgdGhlIHZhbGlkYXRpb24gbWl4aW4gdG8gdGhlIFNlcnZpY2UgbW9kZWwuIFNlZSB2YWxpZGF0aW9uLW1peGluLmpzLlxubWl4aW5WYWxpZGF0aW9uKCBTZXJ2aWNlICk7XG5cbi8vICMgQWxlcnQgTW9kZWxcbi8vIEFuIGFsZXJ0IGlzIHNvbWV0aGluZyB0aGF0IG1pZ2h0IGltcGVkZSBhIGN5Y2xpc3QncyB0b3VyLiBXaGVuIGEgY3ljbGlzdFxuLy8gc2VlcyBhbiBhbGVydCBvbiB0aGUgbWFwLCB0aGUga25vdyB0byBwbGFuIGFyb3VuZCBpdC5cblxuLyplc2ZtdC1pZ25vcmUtc3RhcnQqL1xuZXhwb3J0IGNvbnN0IGFsZXJ0VHlwZXMgPSB7XG4gICdyb2FkX2Nsb3N1cmUnOiAgICAgIHsgZGlzcGxheTogJ1JvYWQgQ2xvc3VyZScgfSxcbiAgJ2ZvcmVzdF9maXJlJzogICAgICAgeyBkaXNwbGF5OiAnRm9yZXN0IGZpcmUnIH0sXG4gICdmbG9vZGluZyc6ICAgICAgICAgIHsgZGlzcGxheTogJ0Zsb29kaW5nJyB9LFxuICAnZGV0b3VyJzogICAgICAgICAgICB7IGRpc3BsYXk6ICdEZXRvdXInIH0sXG4gICdvdGhlcic6ICAgICAgICAgICAgIHsgZGlzcGxheTogJ090aGVyJyB9XG59O1xuLyplc2ZtdC1pZ25vcmUtZW5kKi9cblxuZXhwb3J0IGNvbnN0IEFsZXJ0ID0gUG9pbnQuZXh0ZW5kKCB7XG4gIHNwZWNpZnk6IGZ1bmN0aW9uKCBuYW1lLCBsb2NhdGlvbiApIHtcbiAgICBQb2ludC5wcm90b3R5cGUuc3BlY2lmeS5jYWxsKCB0aGlzLCAnYWxlcnQnLCBuYW1lLCBsb2NhdGlvbiApO1xuICB9LFxuXG4gIHNjaGVtYTogbWVyZ2VTY2hlbWFzKCBQb2ludC5wcm90b3R5cGUuc2NoZW1hLCB7XG4gICAgcHJvcGVydGllczoge1xuICAgICAgdHlwZToge1xuICAgICAgICBlbnVtOiBrZXlzKCBhbGVydFR5cGVzIClcbiAgICAgIH1cbiAgICB9XG4gIH0gKVxufSApO1xuXG5taXhpblZhbGlkYXRpb24oIEFsZXJ0ICk7XG5cbi8vICMgUG9pbnQgQ29sbGVjdGlvblxuLy8gQSBoZXRlcm9nZW5lb3VzIGNvbGxlY3Rpb24gb2Ygc2VydmljZXMgYW5kIGFsZXJ0cy4gUG91Y2hEQiBpcyBhYmxlIHRvIGZldGNoXG4vLyB0aGlzIGNvbGxlY3Rpb24gYnkgbG9va2luZyBmb3IgYWxsIGtleXMgc3RhcnRpbmcgd2l0aCAncG9pbnQvJy5cbi8vXG4vLyBUaGlzIGFsc28gaGFzIHRoZSBlZmZlY3Qgb2YgZmV0Y2hpbmcgY29tbWVudHMgZm9yIHBvaW50cy4gVE9ETzogaGFuZGxlXG4vLyBgQ29tbWVudGAgaW4gdGhlIG1vZGVsIGZ1bmN0aW9uLlxuLy9cbi8vIEEgY29ubmVjdGVkIFBvaW50Q29sbGVjdGlvbiBtdXN0IGJlIGFibGUgdG8gZ2VuZXJhdGUgY29ubmVjdGVkIEFsZXJ0cyBvclxuLy8gU2VydmljZXMgb24gZGVtYW5kcy4gVGhlcmVmb3JlLCBpZiBQb2ludENvbGxlY3Rpb24gaXMgY29ubmVjdGVkLCBjb25uZWN0XG4vLyBtb2RlbHMgYmVmb3JlIHJldHVybmluZyB0aGVtLlxuZXhwb3J0IGNvbnN0IFBvaW50Q29sbGVjdGlvbiA9IENvdWNoQ29sbGVjdGlvbi5leHRlbmQoIHtcbiAgaW5pdGlhbGl6ZTogZnVuY3Rpb24oIG1vZGVscywgb3B0aW9ucyApIHtcbiAgICBDb3VjaENvbGxlY3Rpb24ucHJvdG90eXBlLmluaXRpYWxpemUuYXBwbHkoIHRoaXMsIGFyZ3VtZW50cyApO1xuICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXG4gICAgdGhpcy5wb3VjaCA9IHtcbiAgICAgIG9wdGlvbnM6IHtcbiAgICAgICAgYWxsRG9jczogYXNzaWduKFxuICAgICAgICAgIHsgaW5jbHVkZV9kb2NzOiB0cnVlIH0sXG4gICAgICAgICAgb3B0aW9ucy5rZXlzID8geyBrZXlzOiBvcHRpb25zLmtleXMgfSA6IGtleXNCZXR3ZWVuKCAncG9pbnQvJyApXG4gICAgICAgIClcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyB0aGlzLnBvdWNoID0ge1xuICAgIC8vICAgb3B0aW9uczoge1xuICAgIC8vICAgICBhbGxEb2NzOiB7IGluY2x1ZGVfZG9jczogdHJ1ZSwgLi4ua2V5c0JldHdlZW4oICdwb2ludC8nICkgfVxuICAgIC8vICAgfVxuICAgIC8vIH07XG5cbiAgICBjb25zdCB7Y29ubmVjdCwgZGF0YWJhc2V9ID0gdGhpcztcbiAgICB0aGlzLnNlcnZpY2UgPSBjb25uZWN0ID8gY29ubmVjdCggZGF0YWJhc2UsIFNlcnZpY2UgKSA6IFNlcnZpY2U7XG4gICAgdGhpcy5hbGVydCA9IGNvbm5lY3QgPyBjb25uZWN0KCBkYXRhYmFzZSwgQWxlcnQgKSA6IEFsZXJ0O1xuICB9LFxuXG4gIC8vIFRoaXMgaGFuZGxlcyB0aGUgYG9wdGlvbnMua2V5c2AgZWRnZSBjYXNlcyBsaXN0ZWQgaW4gdGhlXG4gIC8vIFtQb3VjaERCIGFwaV0oaHR0cHM6Ly9wb3VjaGRiLmNvbS9hcGkuaHRtbCNiYXRjaF9mZXRjaClcbiAgcGFyc2U6IGZ1bmN0aW9uKCByZXNwb25zZSwgb3B0aW9ucyApIHtcbiAgICByZXR1cm4gcmVzcG9uc2Uucm93cy5maWx0ZXIoXG4gICAgICByb3cgPT4gISggcm93LmRlbGV0ZWQgfHwgcm93LmVycm9yIClcbiAgICApLm1hcChcbiAgICAgIHJvdyA9PiByb3cuZG9jXG4gICAgKVxuICB9LFxuXG4gIG1vZGVsOiBmdW5jdGlvbiggYXR0cmlidXRlcywgb3B0aW9ucyApIHtcbiAgICBjb25zdCBwYXJ0cyA9IHBvaW50SWQoIGF0dHJpYnV0ZXMuX2lkICk7XG4gICAgY29uc3QgbWFwID0ge1xuICAgICAgJ3NlcnZpY2UnOiBvcHRpb25zLmNvbGxlY3Rpb24uc2VydmljZSxcbiAgICAgICdhbGVydCc6IG9wdGlvbnMuY29sbGVjdGlvbi5hbGVydFxuICAgIH07XG4gICAgY29uc3QgY29uc3RydWN0b3IgPSBtYXBbIHBhcnRzLnR5cGUgXTtcbiAgICBpZiAoIGNvbnN0cnVjdG9yICkge1xuICAgICAgcmV0dXJuIG5ldyBjb25zdHJ1Y3RvciggYXR0cmlidXRlcywgb3B0aW9ucyApO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyAnQSBwb2ludCBtdXN0IGJlIGVpdGhlciBhIHNlcnZpY2Ugb3IgYWxlcnQnO1xuICAgIH1cbiAgfSxcblxuICAvLyAjIyBGZXRjaCBDb3ZlciBJbWFnZXMgZm9yIGFsbCBQb2ludHNcbiAgLy8gUmV0dXJucyBhIHByb21pc2UgdGhhdCByZXNvbHZlcyB3aGVuIGFsbCBwb2ludHMgaW4gdGhlIGFycmF5IGhhdmVcbiAgLy8gdGhlaXIgY292ZXIgaW1hZ2VzIGF2YWlsYWJsZS5cbiAgZ2V0Q292ZXJzOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gUHJvbWlzZS5hbGwoIHRoaXMubW9kZWxzLm1hcCggcG9pbnQgPT4gcG9pbnQuZ2V0Q292ZXIoKSApICk7XG4gIH0sXG5cbiAgLy8gIyMgR2V0IFJlZHV4IFJlcHJlc2VudGF0aW9uXG4gIC8vIFJldHVybiBhIG5lc3RlZCBvYmplY3QvYXJhcnkgcmVwcmVzZW50YXRpb24gb2YgdGhlIGNvbGxlY3Rpb24gc3VpdGFibGUgZm9yXG4gIC8vIHVzZSB3aXRoIHJlZHV4LlxuICBzdG9yZTogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIGZyb21QYWlycyggdGhpcy5tb2RlbHMubWFwKCBwb2ludCA9PiBbIHBvaW50LmlkLCBwb2ludC5zdG9yZSgpIF0gKSApO1xuICB9XG59ICk7XG5cbi8vICMgRGlzcGxheSBOYW1lIGZvciBUeXBlXG4vLyBHaXZlbiBhIHR5cGUga2V5IGZyb20gZWl0aGVyIHRoZSBzZXJ2aWNlIG9yIGFsZXJ0IHR5cGUgZW51bWVyYXRpb25zLFxuLy8gcmV0dXJuIHRoZSB0eXBlJ3MgZGlzcGxheSBzdHJpbmcsIG9yIG51bGwgaWYgaXQgZG9lcyBub3QgZXhpc3QuXG5leHBvcnQgZnVuY3Rpb24gZGlzcGxheSggdHlwZSApIHtcbiAgY29uc3QgdmFsdWVzID0gc2VydmljZVR5cGVzWyB0eXBlIF0gfHwgYWxlcnRUeXBlc1sgdHlwZSBdO1xuICBpZiAoIHZhbHVlcyApIHtcbiAgICByZXR1cm4gdmFsdWVzLmRpc3BsYXk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbn1cblxuLy8gIyBDb21tZW50IE1vZGVsXG4vLyBJbmZvcm1hdGlvbiBhYm91dCBhbGVydHMgYW5kIHNlcnZpY2VzIGVuY291bnRlcmVkIGJ5IGN5Y2xpc3RzIGlzIGxpa2VseVxuLy8gdG8gY2hhbmdlIHdpdGggdGhlIHNlYXNvbnMgb3Igb3RoZXIgcmVhc29ucy4gQ3ljbGlzdHMgcGxhbm5pbmcgdGhlIG5leHQgbGVnXG4vLyBvZiBhIHRvdXIgc2hvdWxkIGJlIGFibGUgdG8gcmVhZCB0aGUgZXhwZXJpZW5jZXMgb2YgY3ljbGlzdHMgYWhlYWQgb2YgdGhlbS5cbi8vXG4vLyBBIGNvbW1lbnQgbXVzdCBoYXZlIGJvdGggYSByYXRpbmcgYW5kIHRoZSB0ZXh0IG9mIHRoZSBjb21tZW50LiBDb21tZW50cyBhcmVcbi8vIGxpbWl0ZWQgdG8gMTQwIGNoYXJhY3RlcnMgdG8gZW5zdXJlIHRoZXkgZG8gbm90IGRldm9sdmUgaW50byBnZW5lcmFsIGFsZXJ0XG4vLyBvciBzZXJ2aWNlIGluZm9ybWF0aW9uIHRoYXQgc2hvdWxkIHJlYWxseSBiZSBpbiB0aGUgZGVzY3JpcHRpb24uIFdlIHJlYWxseVxuLy8gd2FudCB1c2VycyBvZiB0aGUgQmljeWNsZSBUb3VyaW5nIENvbXBhbmlvbiB0byBwcm92aWRlIGNvbW1lbnRzIHZlcmlmeWluZ1xuLy8gaW5mbyBhYm91dCBwb2ludHMsIG9yIGxldHRpbmcgb3RoZXIgY3ljbGlzdHMga25vdyBhYm91dCBjaGFuZ2VzIGluIHRoZVxuLy8gc2VydmljZSBvciBhbGVydC5cblxuLy8gIyMgQ29tbWVudCBNb2RlbCBVcmlcbi8vIENvbW1lbnRzIGFyZSBzdG9yZWQgaW4gQ291Y2hEQiBpbiB0aGUgc2FtZSBkYXRhYmFzZSBhcyBwb2ludHMuIFRoZSBjb21tZW50XG4vLyBtb2RlbCB1cmkgaXMgY29tcG9zZWQgb2YgdGhyZWUgcGFydHM6XG4vLyAgMS4gVGhlIGVudGlyZSBpZCBvZiB0aGUgcmVsYXRlZCBwb2ludFxuLy8gIDIuIFRoZSBzdHJpbmcgJ2NvbW1lbnQvJ1xuLy8gIDMuIEEgdGltZSBiYXNlZCBVVUlEIHRvIHVuaXF1ZWx5IGlkZW50aWZ5IGNvbW1lbnRzXG4vL1xuLy8gV2UgZG9uJ3QgdXNlIGBkb2N1cmlgIGZvciB0aGUgY29tbWVudCBtb2RlbCB1cmlzIGJlY2F1c2Ugd2UgZG9uJ3QgaGF2ZSB0b1xuLy8gcGFyc2UgdGhlbS5cblxuY29uc3QgQ09NTUVOVF9NQVhfTEVOR1RIID0gMTQwO1xuZXhwb3J0IGNvbnN0IENvbW1lbnQgPSBDb3VjaE1vZGVsLmV4dGVuZCgge1xuICBpZEF0dHJpYnV0ZTogJ19pZCcsXG5cbiAgLy8gIyMgQ29uc3RydWN0b3JcbiAgLy8gR2VuZXJhdGUgYF9pZGAuIGBwb2ludElkYCBtdXN0IGJlIHNwZWNpZmllZCBpbiBvcHRpb25zLlxuICBjb25zdHJ1Y3RvcjogZnVuY3Rpb24oIGF0dHJpYnV0ZXMsIG9wdGlvbnMgKSB7XG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gICAgaWYgKCAhYXR0cmlidXRlcy51dWlkICkge1xuICAgICAgYXR0cmlidXRlcy51dWlkID0gdXVpZC52MSgpO1xuICAgIH1cbiAgICBpZiAoICFhdHRyaWJ1dGVzLl9pZCAmJiBvcHRpb25zLnBvaW50SWQgKSB7XG4gICAgICBhdHRyaWJ1dGVzLl9pZCA9IG9wdGlvbnMucG9pbnRJZCArICcvY29tbWVudC8nICsgYXR0cmlidXRlcy51dWlkO1xuICAgIH1cbiAgICBDb3VjaE1vZGVsLmFwcGx5KCB0aGlzLCBhcmd1bWVudHMgKTtcbiAgfSxcblxuICBzY2hlbWE6IHtcbiAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICBhZGRpdGlvbmFsUHJvcGVydGllczogZmFsc2UsXG4gICAgcHJvcGVydGllczoge1xuICAgICAgdXNlcm5hbWU6IHtcbiAgICAgICAgJ3R5cGUnOiAnc3RyaW5nJ1xuICAgICAgfSxcbiAgICAgIHRleHQ6IHtcbiAgICAgICAgJ3R5cGUnOiAnc3RyaW5nJyxcbiAgICAgICAgJ21heExlbmd0aCc6IENPTU1FTlRfTUFYX0xFTkdUSFxuICAgICAgfSxcbiAgICAgIHJhdGluZzoge1xuICAgICAgICB0eXBlOiAnaW50ZWdlcicsXG4gICAgICAgIG1pbmltdW06IDEsXG4gICAgICAgIG1heGltdW06IDVcbiAgICAgIH0sXG4gICAgICB1dWlkOiB7XG4gICAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgICB9XG4gICAgfSxcbiAgICByZXF1aXJlZDogW1xuICAgICAgJ3VzZXJuYW1lJyxcbiAgICAgICd0ZXh0JyxcbiAgICAgICdyYXRpbmcnLFxuICAgICAgJ3V1aWQnXG4gICAgXVxuICB9XG59LCB7XG4gIE1BWF9MRU5HVEg6IENPTU1FTlRfTUFYX0xFTkdUSFxufSApO1xuXG5taXhpblZhbGlkYXRpb24oIENvbW1lbnQgKTtcblxuLy8gIyBDb21tZW50IENvbGxlY3Rpb25cbi8vIEZldGNoIG9ubHkgY29tbWVudHMgYXNzb2NpYXRlZCB3aXRoIGEgZ2l2ZW4gcG9pbnQuXG5leHBvcnQgY29uc3QgQ29tbWVudENvbGxlY3Rpb24gPSBDb3VjaENvbGxlY3Rpb24uZXh0ZW5kKCB7XG4gIGluaXRpYWxpemU6IGZ1bmN0aW9uKCBtb2RlbHMsIG9wdGlvbnMgKSB7XG4gICAgQ291Y2hDb2xsZWN0aW9uLnByb3RvdHlwZS5pbml0aWFsaXplLmFwcGx5KCB0aGlzLCBhcmd1bWVudHMgKTtcbiAgICBjb25zdCBwb2ludElkID0gdGhpcy5wb2ludElkID0gb3B0aW9ucy5wb2ludElkO1xuXG4gICAgY29uc3QgY29ubmVjdCA9IHRoaXMuY29ubmVjdDtcbiAgICBjb25zdCBkYXRhYmFzZSA9IHRoaXMuZGF0YWJhc2U7XG4gICAgdGhpcy5jb21tZW50ID0gY29ubmVjdCA/IGNvbm5lY3QoIGRhdGFiYXNlLCBDb21tZW50ICkgOiBDb21tZW50O1xuXG4gICAgdGhpcy5wb3VjaCA9IHtcbiAgICAgIG9wdGlvbnM6IHtcbiAgICAgICAgYWxsRG9jczoge1xuICAgICAgICAgIC4uLmtleXNCZXR3ZWVuKCBwb2ludElkICsgJy9jb21tZW50JyApLFxuICAgICAgICAgIGluY2x1ZGVfZG9jczogdHJ1ZVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcbiAgfSxcblxuICBtb2RlbDogZnVuY3Rpb24oIGF0dHJpYnV0ZXMsIG9wdGlvbnMgKSB7XG4gICAgY29uc3Qge2NvbW1lbnQsIHBvaW50SWR9ID0gb3B0aW9ucy5jb2xsZWN0aW9uO1xuICAgIHJldHVybiBuZXcgY29tbWVudCggYXR0cmlidXRlcywgeyBwb2ludElkLCAuLi5vcHRpb25zIH0gKTtcbiAgfVxufSApO1xuIl19