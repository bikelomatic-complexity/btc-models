/* btc-app-server -- Server for the Bicycle Touring Companion
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

import { mixinValidation, mergeSchemas } from './validation-mixin';
import { CouchModel, CouchCollection, keysBetween } from './base';

import { keys, fromPairs, includes } from 'lodash';
import { createObjectURL } from 'blob-util';

import docuri from 'docuri';
import ngeohash from 'ngeohash';
import normalize from 'to-id';
import uuid from 'node-uuid';

const browser = ( typeof window !== 'undefined' );

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
const pointId = docuri.route( 'point/:type/:name/:geohash' );

export const Point = CouchModel.extend( {
  idAttribute: '_id',

  initialize: function( attributes, options ) {
    CouchModel.prototype.initialize.apply( this, arguments );
    this.set( 'created_at', new Date().toISOString() );
    this.coverUrl = false;
  },

  // ## Specify
  // Fill in `_id` from the components of the point model uri.
  // Pull values from `attributes` if name and location are undefined.
  specify: function( type, name, location ) {
    if ( name ) {
      const [lat, lng] = location;
      const _id = pointId( {
        type: type,
        name: normalize( name ),
        geohash: ngeohash.encode( lat, lng )
      } );
      this.set( { _id, type, name, location } );
    } else {
      const {name, location} = this.attributes;
      const [lat, lng] = location;
      const _id = pointId( {
        type: type,
        name: normalize( name ),
        geohash: ngeohash.encode( lat, lng )
      } );
      this.set( { _id } );
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
    required: [
      'name',
      'location',
      'type',
      'created_at',
      'flag'
    ]
  },

  attach: function( blob, name, type ) {
    CouchModel.prototype.attach.apply( this, arguments );
    if ( browser ) {
      this.coverUrl = createObjectURL( blob );
    }
  },

  clear: function() {
    CouchModel.prototype.clear.apply( this, arguments );
    this.coverUrl = false;
  },

  // When fetching a point, should it have a cover attachment, extend the
  // promise to fetch the attachment and set `this.coverUrl`. Regardless
  // of the existence of the cover attachment, always resolve the promise to
  // the original result.
  fetch: function() {
    let _res;
    return CouchModel.prototype.fetch.apply( this, arguments ).then( res => {
      _res = res;

      const hasCover = includes( this.attachments(), 'cover.png' );

      if ( browser && hasCover ) {
        return this.attachment( 'cover.png' );
      } else {
        return;
      }
    } ).then( blob => {
      if ( blob ) {
        this.coverUrl = createObjectURL( blob );
      }
      return _res;
    } );
  },

  store: function() {
    return { ...this.toJSON(), coverUrl: this.coverUrl };
  }
}, {
  uri: pointId,

  for: id => {
    const {type} = pointId( id );
    if ( type === 'service' ) {
      return new Service( { _id: id } );
    } else if ( type === 'alert' ) {
      return new Alert( { _id: id } );
    } else {
      throw 'A point must either be a service or alert';
    }
  }
} );

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
export const serviceTypes = {
  'airport':           { display: 'Airport' },
  'bar':               { display: 'Bar' },
  'bed_and_breakfast': { display: 'Bed & Breakfast' },
  'bike_shop':         { display: 'Bike Shop' },
  'cabin':             { display: 'Cabin' },
  'campground':        { display: 'Campground' },
  'convenience_store': { display: 'Convenience Store' },
  'cyclists_camping':  { display: 'Cyclists\' Camping' },
  'cyclists_lodging':  { display: 'Cyclists\' Lodging' },
  'grocery':           { display: 'Grocery' },
  'hostel':            { display: 'Hostel' },
  'hot_spring':        { display: 'Hot Spring' },
  'hotel':             { display: 'Hotel' },
  'motel':             { display: 'Motel' },
  'information':       { display: 'Information' },
  'library':           { display: 'Library' },
  'museum':            { display: 'Museum' },
  'outdoor_store':     { display: 'Outdoor Store' },
  'rest_area':         { display: 'Rest Area' },
  'restaurant':        { display: 'Restaurant' },
  'restroom':          { display: 'Restroom' },
  'scenic_area':       { display: 'Scenic Area' },
  'state_park':        { display: 'State Park' },
  'other':             { display: 'Other' }
};
/*esfmt-ignore-end*/

export const Service = Point.extend( {
  specify: function( name, location ) {
    Point.prototype.specify.call( this, 'service', name, location );
  },

  schema: mergeSchemas( Point.prototype.schema, {
    properties: {
      type: {
        enum: keys( serviceTypes )
      },
      amenities: {
        type: 'array',
        items: {
          type: 'string',
          enum: keys( serviceTypes )
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
    required: [
      'seasonal'
    ]
  } )
} );

// Apply the validation mixin to the Service model. See validation-mixin.js.
mixinValidation( Service );

// # Alert Model
// An alert is something that might impede a cyclist's tour. When a cyclist
// sees an alert on the map, the know to plan around it.

/*esfmt-ignore-start*/
export const alertTypes = {
  'road_closure':      { display: 'Road Closure' },
  'forest_fire':       { display: 'Forest fire' },
  'flooding':          { display: 'Flooding' },
  'detour':            { display: 'Detour' },
  'other':             { display: 'Other' }
};
/*esfmt-ignore-end*/

export const Alert = Point.extend( {
  specify: function( name, location ) {
    Point.prototype.specify.call( this, 'alert', name, location );
  },

  schema: mergeSchemas( Point.prototype.schema, {
    properties: {
      type: {
        enum: keys( alertTypes )
      }
    }
  } )
} );

mixinValidation( Alert );

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
export const PointCollection = CouchCollection.extend( {
  initialize: function( models, options ) {
    CouchCollection.prototype.initialize.apply( this, arguments );
    this.pouch = {
      options: {
        allDocs: { include_docs: true, ...keysBetween( 'point/' ) }
      }
    };

    const {connect, database} = this;
    this.service = connect ? connect( database, Service ) : Service;
    this.alert = connect ? connect( database, Alert ) : Alert;
  },

  model: function( attributes, options ) {
    const parts = pointId( attributes._id );
    const map = {
      'service': options.collection.service,
      'alert': options.collection.alert
    };
    const constructor = map[ parts.type ];
    if ( constructor ) {
      return new constructor( attributes, options );
    } else {
      throw 'A point must be either a service or alert';
    }
  },

  store: function() {
    return fromPairs( this.models, point => [ point.id, point.store() ] );
  }
} );

// # Display Name for Type
// Given a type key from either the service or alert type enumerations,
// return the type's display string, or null if it does not exist.
export function display( type ) {
  const values = serviceTypes[ type ] || alertTypes[ type ];
  if ( values ) {
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

const COMMENT_MAX_LENGTH = 140;
export const Comment = CouchModel.extend( {
  idAttribute: '_id',

  // ## Constructor
  // Generate `_id`. `pointId` must be specified in options.
  constructor: function( attributes, options ) {
    options = options || {};
    if ( !attributes.uuid ) {
      attributes.uuid = uuid.v1();
    }
    if ( !attributes._id && options.pointId ) {
      attributes._id = options.pointId + '/comment/' + attributes.uuid;
    }
    CouchModel.apply( this, arguments );
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
    required: [
      'username',
      'text',
      'rating',
      'uuid'
    ]
  }
}, {
  MAX_LENGTH: COMMENT_MAX_LENGTH
} );

mixinValidation( Comment );

// # Comment Collection
// Fetch only comments associated with a given point.
export const CommentCollection = CouchCollection.extend( {
  initialize: function( models, options ) {
    CouchCollection.prototype.initialize.apply( this, arguments );
    const pointId = this.pointId = options.pointId;

    const connect = this.connect;
    const database = this.database;
    this.comment = connect ? connect( database, Comment ) : Comment;

    this.pouch = {
      options: {
        allDocs: {
          ...keysBetween( pointId + '/comment' ),
          include_docs: true
        }
      }
    };
  },

  model: function( attributes, options ) {
    const {comment, pointId} = options.collection;
    return new comment( attributes, { pointId, ...options } );
  }
} );
