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

import { merge, keys } from 'lodash';

import { mixinValidation } from './validation-mixin';
import { CouchModel, CouchCollection, keysBetween } from './base';

import docuri from 'docuri';
import ngeohash from 'ngeohash';
import normalize from 'to-id';
import uuid from 'node-uuid';

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

export const alertTypes = {
  'road_closure':      { display: 'Road Closure' },
  'forest_fire':       { display: 'Forest fire' },
  'flooding':          { display: 'Flooding' },
  'detour':            { display: 'Detour' },
  'other':             { display: 'Other' }
};
/*esfmt-ignore-end*/

export function display( type ) {
  const values = serviceTypes[ type ] || alertTypes[ type ];
  if ( values ) {
    return values.display;
  } else {
    return null;
  }
}

export const pointId = docuri.route( 'point/:type/:name/:geohash' );

export const Point = CouchModel.extend( {
  idAttribute: '_id',

  initialize: function( attributes, options ) {
    CouchModel.prototype.initialize.apply( this, arguments );
    this.set( 'created_at', new Date().toISOString() );
  },

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
    required: [
      'name',
      'location',
      'type',
      'created_at',
      'flag'
    ]
  }
} );

export const Service = Point.extend( {
  specify: function( name, location ) {
    Point.prototype.specify.call( this, 'service', name, location );
  },

  schema: merge( {}, Point.prototype.schema, {
    properties: {
      type: {
        enum: keys( serviceTypes )
      },
      amenities: {
        type: 'array',
        items: {
          type: 'string',
          enum: keys( serviceTypes )
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
    required: [
      'seasonal'
    ]
  } )
} );

mixinValidation( Service );

export const Alert = Point.extend( {
  specify: function( name, location ) {
    Point.prototype.specify.call( this, 'alert', name, location );
  },

  schema: merge( {}, Point.prototype.schema, {
    properties: {
      type: {
        enum: keys( alertTypes )
      }
    }
  } )
} );

mixinValidation( Alert );

export const PointCollection = CouchCollection.extend( {
  initialize: function( models, options ) {
    CouchCollection.prototype.initialize.apply( this, arguments );

    // const { bbox } = options; // For later, to get points in a bbox
    this.pouch = {
      options: {
        allDocs: { include_docs: true, ...keysBetween( 'point/' ) }
      }
    };

    const connect = this.connect;
    const database = this.database;
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
  }
} );

const COMMENT_MAX_LENGTH = 140;
export const Comment = CouchModel.extend( {
  idAttribute: '_id',

  constructor: function( attributes, options ) {
    options = options || {};
    if ( !attributes.uuid ) {
      attributes.uuid = uuid.v1();
    }
    if ( !attributes._id ) {
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
    const pointId = options.collection.pointId;
    return new ( this.comment) (attributes, { pointId, ...options } );
  }
} );
