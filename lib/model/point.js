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

  constructor: function constructor(pointId, attributes, options) {
    var uuid = _nodeUuid2.default.v1();
    var commentId = pointId + '/comment/' + uuid;
    _base.CouchModel.call(this, _extends({ _id: commentId, uuid: uuid }, attributes), options);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tb2RlbC9wb2ludC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O1FBa0VnQixPQUFPLEdBQVAsT0FBTzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBcENoQixJQUFNLFlBQVksV0FBWixZQUFZLEdBQUc7QUFDMUIsV0FBUyxFQUFZLEVBQUUsT0FBTyxFQUFFLFNBQVMsRUFBRTtBQUMzQyxPQUFLLEVBQWdCLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRTtBQUN2QyxxQkFBbUIsRUFBRSxFQUFFLE9BQU8sRUFBRSxpQkFBaUIsRUFBRTtBQUNuRCxhQUFXLEVBQVUsRUFBRSxPQUFPLEVBQUUsV0FBVyxFQUFFO0FBQzdDLFNBQU8sRUFBYyxFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUU7QUFDekMsY0FBWSxFQUFTLEVBQUUsT0FBTyxFQUFFLFlBQVksRUFBRTtBQUM5QyxxQkFBbUIsRUFBRSxFQUFFLE9BQU8sRUFBRSxtQkFBbUIsRUFBRTtBQUNyRCxvQkFBa0IsRUFBRyxFQUFFLE9BQU8sRUFBRSxvQkFBb0IsRUFBRTtBQUN0RCxvQkFBa0IsRUFBRyxFQUFFLE9BQU8sRUFBRSxvQkFBb0IsRUFBRTtBQUN0RCxXQUFTLEVBQVksRUFBRSxPQUFPLEVBQUUsU0FBUyxFQUFFO0FBQzNDLFVBQVEsRUFBYSxFQUFFLE9BQU8sRUFBRSxRQUFRLEVBQUU7QUFDMUMsY0FBWSxFQUFTLEVBQUUsT0FBTyxFQUFFLFlBQVksRUFBRTtBQUM5QyxTQUFPLEVBQWMsRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFFO0FBQ3pDLFNBQU8sRUFBYyxFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUU7QUFDekMsZUFBYSxFQUFRLEVBQUUsT0FBTyxFQUFFLGFBQWEsRUFBRTtBQUMvQyxXQUFTLEVBQVksRUFBRSxPQUFPLEVBQUUsU0FBUyxFQUFFO0FBQzNDLFVBQVEsRUFBYSxFQUFFLE9BQU8sRUFBRSxRQUFRLEVBQUU7QUFD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RUFBRSxvQkFBVSxNQUFNLEVBQUUsT0FBTyxFQUFHO0FBQ3RDLDBCQUFnQixTQUFTLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBRSxJQUFJLEVBQUUsU0FBUyxDQUFFLENBQUM7QUFDOUQsUUFBSSxDQUFDLEtBQUssR0FBRztBQUNYLGFBQU8sRUFBRTtBQUNQLGVBQU8sZUFDRix1QkFBYSxJQUFJLENBQUMsT0FBTyxHQUFHLFVBQVUsQ0FBRTtBQUMzQyxzQkFBWSxFQUFFLElBQUk7VUFDbkI7T0FDRjtLQUNGLENBQUM7R0FDSDtDQUNGLENBQUUsQ0FBQyIsImZpbGUiOiJwb2ludC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIGJ0Yy1hcHAtc2VydmVyIC0tIFNlcnZlciBmb3IgdGhlIEJpY3ljbGUgVG91cmluZyBDb21wYW5pb25cbiAqIENvcHlyaWdodCDCqSAyMDE2IEFkdmVudHVyZSBDeWNsaW5nIEFzc29jaWF0aW9uXG4gKlxuICogVGhpcyBmaWxlIGlzIHBhcnQgb2YgYnRjLWFwcC1zZXJ2ZXIuXG4gKlxuICogYnRjLWFwcC1zZXJ2ZXIgaXMgZnJlZSBzb2Z0d2FyZTogeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeVxuICogaXQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBBZmZlcm8gR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgYXMgcHVibGlzaGVkIGJ5XG4gKiB0aGUgRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uLCBlaXRoZXIgdmVyc2lvbiAzIG9mIHRoZSBMaWNlbnNlLCBvclxuICogKGF0IHlvdXIgb3B0aW9uKSBhbnkgbGF0ZXIgdmVyc2lvbi5cbiAqXG4gKiBidGMtYXBwLXNlcnZlciBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLFxuICogYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2ZcbiAqIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gIFNlZSB0aGVcbiAqIEFmZmVybyBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZSBkZXRhaWxzLlxuICpcbiAqIFlvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEFmZmVybyBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuICogYWxvbmcgd2l0aCBGb29iYXIuICBJZiBub3QsIHNlZSA8aHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG4gKi9cblxuaW1wb3J0IHsgbWVyZ2UsIGtleXMgfSBmcm9tICdsb2Rhc2gnO1xuXG5pbXBvcnQgeyBtaXhpblZhbGlkYXRpb24gfSBmcm9tICcuL3ZhbGlkYXRpb24tbWl4aW4nO1xuaW1wb3J0IHsgQ291Y2hNb2RlbCwgQ291Y2hDb2xsZWN0aW9uLCBrZXlzQmV0d2VlbiB9IGZyb20gJy4vYmFzZSc7XG5cbmltcG9ydCBkb2N1cmkgZnJvbSAnZG9jdXJpJztcbmltcG9ydCBuZ2VvaGFzaCBmcm9tICduZ2VvaGFzaCc7XG5pbXBvcnQgbm9ybWFsaXplIGZyb20gJ3RvLWlkJztcbmltcG9ydCBudXVpZCBmcm9tICdub2RlLXV1aWQnO1xuXG4vKmVzZm10LWlnbm9yZS1zdGFydCovXG5leHBvcnQgY29uc3Qgc2VydmljZVR5cGVzID0ge1xuICAnYWlycG9ydCc6ICAgICAgICAgICB7IGRpc3BsYXk6ICdBaXJwb3J0JyB9LFxuICAnYmFyJzogICAgICAgICAgICAgICB7IGRpc3BsYXk6ICdCYXInIH0sXG4gICdiZWRfYW5kX2JyZWFrZmFzdCc6IHsgZGlzcGxheTogJ0JlZCAmIEJyZWFrZmFzdCcgfSxcbiAgJ2Jpa2Vfc2hvcCc6ICAgICAgICAgeyBkaXNwbGF5OiAnQmlrZSBTaG9wJyB9LFxuICAnY2FiaW4nOiAgICAgICAgICAgICB7IGRpc3BsYXk6ICdDYWJpbicgfSxcbiAgJ2NhbXBncm91bmQnOiAgICAgICAgeyBkaXNwbGF5OiAnQ2FtcGdyb3VuZCcgfSxcbiAgJ2NvbnZlbmllbmNlX3N0b3JlJzogeyBkaXNwbGF5OiAnQ29udmVuaWVuY2UgU3RvcmUnIH0sXG4gICdjeWNsaXN0c19jYW1waW5nJzogIHsgZGlzcGxheTogJ0N5Y2xpc3RzXFwnIENhbXBpbmcnIH0sXG4gICdjeWNsaXN0c19sb2RnaW5nJzogIHsgZGlzcGxheTogJ0N5Y2xpc3RzXFwnIExvZGdpbmcnIH0sXG4gICdncm9jZXJ5JzogICAgICAgICAgIHsgZGlzcGxheTogJ0dyb2NlcnknIH0sXG4gICdob3N0ZWwnOiAgICAgICAgICAgIHsgZGlzcGxheTogJ0hvc3RlbCcgfSxcbiAgJ2hvdF9zcHJpbmcnOiAgICAgICAgeyBkaXNwbGF5OiAnSG90IFNwcmluZycgfSxcbiAgJ2hvdGVsJzogICAgICAgICAgICAgeyBkaXNwbGF5OiAnSG90ZWwnIH0sXG4gICdtb3RlbCc6ICAgICAgICAgICAgIHsgZGlzcGxheTogJ01vdGVsJyB9LFxuICAnaW5mb3JtYXRpb24nOiAgICAgICB7IGRpc3BsYXk6ICdJbmZvcm1hdGlvbicgfSxcbiAgJ2xpYnJhcnknOiAgICAgICAgICAgeyBkaXNwbGF5OiAnTGlicmFyeScgfSxcbiAgJ211c2V1bSc6ICAgICAgICAgICAgeyBkaXNwbGF5OiAnTXVzZXVtJyB9LFxuICAnb3V0ZG9vcl9zdG9yZSc6ICAgICB7IGRpc3BsYXk6ICdPdXRkb29yIFN0b3JlJyB9LFxuICAncmVzdF9hcmVhJzogICAgICAgICB7IGRpc3BsYXk6ICdSZXN0IEFyZWEnIH0sXG4gICdyZXN0YXVyYW50JzogICAgICAgIHsgZGlzcGxheTogJ1Jlc3RhdXJhbnQnIH0sXG4gICdyZXN0cm9vbSc6ICAgICAgICAgIHsgZGlzcGxheTogJ1Jlc3Ryb29tJyB9LFxuICAnc2NlbmljX2FyZWEnOiAgICAgICB7IGRpc3BsYXk6ICdTY2VuaWMgQXJlYScgfSxcbiAgJ3N0YXRlX3BhcmsnOiAgICAgICAgeyBkaXNwbGF5OiAnU3RhdGUgUGFyaycgfSxcbiAgJ290aGVyJzogICAgICAgICAgICAgeyBkaXNwbGF5OiAnT3RoZXInIH1cbn07XG5cbmV4cG9ydCBjb25zdCBhbGVydFR5cGVzID0ge1xuICAncm9hZF9jbG9zdXJlJzogICAgICB7IGRpc3BsYXk6ICdSb2FkIENsb3N1cmUnIH0sXG4gICdmb3Jlc3RfZmlyZSc6ICAgICAgIHsgZGlzcGxheTogJ0ZvcmVzdCBmaXJlJyB9LFxuICAnZmxvb2RpbmcnOiAgICAgICAgICB7IGRpc3BsYXk6ICdGbG9vZGluZycgfSxcbiAgJ2RldG91cic6ICAgICAgICAgICAgeyBkaXNwbGF5OiAnRGV0b3VyJyB9LFxuICAnb3RoZXInOiAgICAgICAgICAgICB7IGRpc3BsYXk6ICdPdGhlcicgfVxufTtcbi8qZXNmbXQtaWdub3JlLWVuZCovXG5cbmV4cG9ydCBmdW5jdGlvbiBkaXNwbGF5KCB0eXBlICkge1xuICBjb25zdCB2YWx1ZXMgPSBzZXJ2aWNlVHlwZXNbIHR5cGUgXSB8fCBhbGVydFR5cGVzWyB0eXBlIF07XG4gIGlmICggdmFsdWVzICkge1xuICAgIHJldHVybiB2YWx1ZXMuZGlzcGxheTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxufVxuXG5leHBvcnQgY29uc3QgcG9pbnRJZCA9IGRvY3VyaS5yb3V0ZSggJ3BvaW50Lzp0eXBlLzpuYW1lLzpnZW9oYXNoJyApO1xuXG5leHBvcnQgY29uc3QgUG9pbnQgPSBDb3VjaE1vZGVsLmV4dGVuZCgge1xuICBpZEF0dHJpYnV0ZTogJ19pZCcsXG5cbiAgaW5pdGlhbGl6ZTogZnVuY3Rpb24oIGF0dHJpYnV0ZXMsIG9wdGlvbnMgKSB7XG4gICAgQ291Y2hNb2RlbC5wcm90b3R5cGUuaW5pdGlhbGl6ZS5hcHBseSggdGhpcywgYXJndW1lbnRzICk7XG4gICAgdGhpcy5zZXQoICdjcmVhdGVkX2F0JywgbmV3IERhdGUoKS50b0lTT1N0cmluZygpICk7XG4gIH0sXG5cbiAgc3BlY2lmeTogZnVuY3Rpb24oIHR5cGUsIG5hbWUsIGxvY2F0aW9uICkge1xuICAgIGlmICggbmFtZSApIHtcbiAgICAgIGNvbnN0IFtsYXQsIGxuZ10gPSBsb2NhdGlvbjtcbiAgICAgIGNvbnN0IF9pZCA9IHBvaW50SWQoIHtcbiAgICAgICAgdHlwZTogdHlwZSxcbiAgICAgICAgbmFtZTogbm9ybWFsaXplKCBuYW1lICksXG4gICAgICAgIGdlb2hhc2g6IG5nZW9oYXNoLmVuY29kZSggbGF0LCBsbmcgKVxuICAgICAgfSApO1xuICAgICAgdGhpcy5zZXQoIHsgX2lkLCB0eXBlLCBuYW1lLCBsb2NhdGlvbiB9ICk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IHtuYW1lLCBsb2NhdGlvbn0gPSB0aGlzLmF0dHJpYnV0ZXM7XG4gICAgICBjb25zdCBbbGF0LCBsbmddID0gbG9jYXRpb247XG4gICAgICBjb25zdCBfaWQgPSBwb2ludElkKCB7XG4gICAgICAgIHR5cGU6IHR5cGUsXG4gICAgICAgIG5hbWU6IG5vcm1hbGl6ZSggbmFtZSApLFxuICAgICAgICBnZW9oYXNoOiBuZ2VvaGFzaC5lbmNvZGUoIGxhdCwgbG5nIClcbiAgICAgIH0gKTtcbiAgICAgIHRoaXMuc2V0KCB7IF9pZCB9ICk7XG4gICAgfVxuICB9LFxuXG4gIHNjaGVtYToge1xuICAgICRzY2hlbWE6ICdodHRwOi8vanNvbi1zY2hlbWEub3JnL2RyYWZ0LTA0L3NjaGVtYSMnLFxuICAgIHR5cGU6ICdvYmplY3QnLFxuICAgIGFkZGl0aW9uYWxQcm9wZXJ0aWVzOiBmYWxzZSwgLy8gQnV0IHN1YmNsYXNzZXMgY2FuIG1lcmdlXG4gICAgcHJvcGVydGllczoge1xuICAgICAgbmFtZToge1xuICAgICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgICAgfSxcbiAgICAgIGxvY2F0aW9uOiB7XG4gICAgICAgIHR5cGU6ICdhcnJheScsXG4gICAgICAgIG1pbkl0ZW1zOiAyLFxuICAgICAgICBtYXhJdGVtczogMixcbiAgICAgICAgaXRlbXM6IHtcbiAgICAgICAgICB0eXBlOiAnbnVtYmVyJ1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgdHlwZToge1xuICAgICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgICAgfSxcbiAgICAgIGNyZWF0ZWRfYXQ6IHtcbiAgICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICAgIGZvcm1hdDogJ2RhdGUtdGltZSdcbiAgICAgIH0sXG4gICAgICBkZXNjcmlwdGlvbjoge1xuICAgICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgICAgfSxcbiAgICAgIGZsYWc6IHtcbiAgICAgICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgICAgICBkZWZhdWx0OiBmYWxzZVxuICAgICAgfVxuICAgIH0sXG4gICAgcmVxdWlyZWQ6IFtcbiAgICAgICduYW1lJyxcbiAgICAgICdsb2NhdGlvbicsXG4gICAgICAndHlwZScsXG4gICAgICAnY3JlYXRlZF9hdCcsXG4gICAgICAnZmxhZydcbiAgICBdXG4gIH1cbn0gKTtcblxuZXhwb3J0IGNvbnN0IFNlcnZpY2UgPSBQb2ludC5leHRlbmQoIHtcbiAgc3BlY2lmeTogZnVuY3Rpb24oIG5hbWUsIGxvY2F0aW9uICkge1xuICAgIFBvaW50LnByb3RvdHlwZS5zcGVjaWZ5LmNhbGwoIHRoaXMsICdzZXJ2aWNlJywgbmFtZSwgbG9jYXRpb24gKTtcbiAgfSxcblxuICBzY2hlbWE6IG1lcmdlKCB7fSwgUG9pbnQucHJvdG90eXBlLnNjaGVtYSwge1xuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgIHR5cGU6IHtcbiAgICAgICAgZW51bToga2V5cyggc2VydmljZVR5cGVzIClcbiAgICAgIH0sXG4gICAgICBhbWVuaXRpZXM6IHtcbiAgICAgICAgdHlwZTogJ2FycmF5JyxcbiAgICAgICAgaXRlbXM6IHtcbiAgICAgICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgICAgICBlbnVtOiBrZXlzKCBzZXJ2aWNlVHlwZXMgKVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgYWRkcmVzczoge1xuICAgICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgICAgfSxcbiAgICAgIHNjaGVkdWxlOiB7XG4gICAgICAgIHR5cGU6ICdhcnJheSdcbiAgICAgIH0sXG4gICAgICBzZWFzb25hbDoge1xuICAgICAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgICAgIGRlZmF1bHQ6IGZhbHNlXG4gICAgICB9LFxuICAgICAgcGhvbmU6IHtcbiAgICAgICAgdHlwZTogJ3N0cmluZydcbiAgICAgIH0sXG4gICAgICB3ZWJzaXRlOiB7XG4gICAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgICBmb3JtYXQ6ICd1cmknXG4gICAgICB9XG4gICAgfSxcbiAgICByZXF1aXJlZDogW1xuICAgICAgJ3NlYXNvbmFsJ1xuICAgIF1cbiAgfSApXG59ICk7XG5cbm1peGluVmFsaWRhdGlvbiggU2VydmljZSApO1xuXG5leHBvcnQgY29uc3QgQWxlcnQgPSBQb2ludC5leHRlbmQoIHtcbiAgc3BlY2lmeTogZnVuY3Rpb24oIG5hbWUsIGxvY2F0aW9uICkge1xuICAgIFBvaW50LnByb3RvdHlwZS5zcGVjaWZ5LmNhbGwoIHRoaXMsICdhbGVydCcsIG5hbWUsIGxvY2F0aW9uICk7XG4gIH0sXG5cbiAgc2NoZW1hOiBtZXJnZSgge30sIFBvaW50LnByb3RvdHlwZS5zY2hlbWEsIHtcbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICB0eXBlOiB7XG4gICAgICAgIGVudW06IGtleXMoIGFsZXJ0VHlwZXMgKVxuICAgICAgfVxuICAgIH1cbiAgfSApXG59ICk7XG5cbm1peGluVmFsaWRhdGlvbiggQWxlcnQgKTtcblxuZXhwb3J0IGNvbnN0IFBvaW50Q29sbGVjdGlvbiA9IENvdWNoQ29sbGVjdGlvbi5leHRlbmQoIHtcbiAgaW5pdGlhbGl6ZTogZnVuY3Rpb24oIG1vZGVscywgb3B0aW9ucyApIHtcbiAgICBDb3VjaENvbGxlY3Rpb24ucHJvdG90eXBlLmluaXRpYWxpemUuYXBwbHkoIHRoaXMsIGFyZ3VtZW50cyApO1xuXG4gICAgLy8gY29uc3QgeyBiYm94IH0gPSBvcHRpb25zOyAvLyBGb3IgbGF0ZXIsIHRvIGdldCBwb2ludHMgaW4gYSBiYm94XG4gICAgdGhpcy5wb3VjaCA9IHtcbiAgICAgIG9wdGlvbnM6IHtcbiAgICAgICAgYWxsRG9jczogeyBpbmNsdWRlX2RvY3M6IHRydWUsIC4uLmtleXNCZXR3ZWVuKCAncG9pbnQvJyApIH1cbiAgICAgIH1cbiAgICB9O1xuXG4gICAgY29uc3QgY29ubmVjdCA9IHRoaXMuY29ubmVjdDtcbiAgICBjb25zdCBkYXRhYmFzZSA9IHRoaXMuZGF0YWJhc2U7XG4gICAgdGhpcy5zZXJ2aWNlID0gY29ubmVjdCA/IGNvbm5lY3QoIGRhdGFiYXNlLCBTZXJ2aWNlICkgOiBTZXJ2aWNlO1xuICAgIHRoaXMuYWxlcnQgPSBjb25uZWN0ID8gY29ubmVjdCggZGF0YWJhc2UsIEFsZXJ0ICkgOiBBbGVydDtcbiAgfSxcblxuICBtb2RlbDogZnVuY3Rpb24oIGF0dHJpYnV0ZXMsIG9wdGlvbnMgKSB7XG4gICAgY29uc3QgcGFydHMgPSBwb2ludElkKCBhdHRyaWJ1dGVzLl9pZCApO1xuICAgIGNvbnN0IG1hcCA9IHtcbiAgICAgICdzZXJ2aWNlJzogb3B0aW9ucy5jb2xsZWN0aW9uLnNlcnZpY2UsXG4gICAgICAnYWxlcnQnOiBvcHRpb25zLmNvbGxlY3Rpb24uYWxlcnRcbiAgICB9O1xuICAgIGNvbnN0IGNvbnN0cnVjdG9yID0gbWFwWyBwYXJ0cy50eXBlIF07XG4gICAgaWYgKCBjb25zdHJ1Y3RvciApIHtcbiAgICAgIHJldHVybiBuZXcgY29uc3RydWN0b3IoIGF0dHJpYnV0ZXMsIG9wdGlvbnMgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgJ0EgcG9pbnQgbXVzdCBiZSBlaXRoZXIgYSBzZXJ2aWNlIG9yIGFsZXJ0JztcbiAgICB9XG4gIH1cbn0gKTtcblxuY29uc3QgQ09NTUVOVF9NQVhfTEVOR1RIID0gMTQwO1xuZXhwb3J0IGNvbnN0IENvbW1lbnQgPSBDb3VjaE1vZGVsLmV4dGVuZCgge1xuICBpZEF0dHJpYnV0ZTogJ19pZCcsXG5cbiAgY29uc3RydWN0b3I6IGZ1bmN0aW9uKCBwb2ludElkLCBhdHRyaWJ1dGVzLCBvcHRpb25zICkge1xuICAgIGNvbnN0IHV1aWQgPSBudXVpZC52MSgpO1xuICAgIGNvbnN0IGNvbW1lbnRJZCA9IHBvaW50SWQgKyAnL2NvbW1lbnQvJyArIHV1aWQ7XG4gICAgQ291Y2hNb2RlbC5jYWxsKCB0aGlzLCB7IF9pZDogY29tbWVudElkLCB1dWlkLCAuLi5hdHRyaWJ1dGVzIH0sIG9wdGlvbnMgKTtcbiAgfSxcblxuICBzY2hlbWE6IHtcbiAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICBhZGRpdGlvbmFsUHJvcGVydGllczogZmFsc2UsXG4gICAgcHJvcGVydGllczoge1xuICAgICAgdXNlcm5hbWU6IHtcbiAgICAgICAgJ3R5cGUnOiAnc3RyaW5nJ1xuICAgICAgfSxcbiAgICAgIHRleHQ6IHtcbiAgICAgICAgJ3R5cGUnOiAnc3RyaW5nJyxcbiAgICAgICAgJ21heExlbmd0aCc6IENPTU1FTlRfTUFYX0xFTkdUSFxuICAgICAgfSxcbiAgICAgIHJhdGluZzoge1xuICAgICAgICB0eXBlOiAnaW50ZWdlcicsXG4gICAgICAgIG1pbmltdW06IDEsXG4gICAgICAgIG1heGltdW06IDVcbiAgICAgIH0sXG4gICAgICB1dWlkOiB7XG4gICAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgICB9XG4gICAgfSxcbiAgICByZXF1aXJlZDogW1xuICAgICAgJ3VzZXJuYW1lJyxcbiAgICAgICd0ZXh0JyxcbiAgICAgICdyYXRpbmcnLFxuICAgICAgJ3V1aWQnXG4gICAgXVxuICB9XG59LCB7XG4gIE1BWF9MRU5HVEg6IENPTU1FTlRfTUFYX0xFTkdUSFxufSApO1xuXG5taXhpblZhbGlkYXRpb24oIENvbW1lbnQgKTtcblxuZXhwb3J0IGNvbnN0IENvbW1lbnRDb2xsZWN0aW9uID0gQ291Y2hDb2xsZWN0aW9uLmV4dGVuZCgge1xuICBjb25zdHJ1Y3RvcjogZnVuY3Rpb24oIHBvaW50SWQsIG1vZGVscywgb3B0aW9ucyApIHtcbiAgICB0aGlzLnBvaW50SWQgPSBwb2ludElkO1xuICAgIENvdWNoQ29sbGVjdGlvbi5hcHBseSggdGhpcywgbW9kZWxzLCBvcHRpb25zICk7XG4gIH0sXG5cbiAgaW5pdGlhbGl6ZTogZnVuY3Rpb24oIG1vZGVscywgb3B0aW9ucyApIHtcbiAgICBDb3VjaENvbGxlY3Rpb24ucHJvdG90eXBlLmluaXRpYWxpemUuYXBwbHkoIHRoaXMsIGFyZ3VtZW50cyApO1xuICAgIHRoaXMucG91Y2ggPSB7XG4gICAgICBvcHRpb25zOiB7XG4gICAgICAgIGFsbERvY3M6IHtcbiAgICAgICAgICAuLi5rZXlzQmV0d2VlbiggdGhpcy5wb2ludElkICsgJy9jb21tZW50JyApLFxuICAgICAgICAgIGluY2x1ZGVfZG9jczogdHJ1ZVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcbiAgfVxufSApO1xuIl19