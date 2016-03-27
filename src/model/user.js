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

import { CouchModel, CouchCollection } from './base';
import { mixinValidation, mergeSchemas } from './validation-mixin';

// # Credentials Segment
// This schema validates a user's email and password. Both the User and Login
// models share this schema segment.
const credentials = {
  type: 'object',
  additionalProperties: false,
  properties: {
    email: {
      type: 'string',
      format: 'email'
    },
    password: {
      type: 'string',
      minLength: 8
    }
  },
  required: [
    'email',
    'password'
  ]
};

// # User Model
// In the domain layer, we uniquely reference Users by their emails. When
// models are serialized into Couch docs, the `_id` key will be set.
export const User = CouchModel.extend( {
  idAttribute: 'email',

  safeguard: [
    'name',
    'type',
    'derived_key',
    'iterations',
    'password_scheme',
    'salt'
  ],

  schema: mergeSchemas( {}, credentials, {
    properties: {
      first: {
        type: 'string',
        minLength: 1
      },
      last: {
        type: 'string',
        minLength: 1
      },
      username: {
        type: 'string',
        minLength: 3
      },
      verification: {
        type: 'string'
      },
      verified: {
        type: 'boolean',
        default: false
      },
      roles: {
        type: 'array',
        default: []
      }
    },
    required: [
      'first',
      'last',
      'username',
      'verified',
      'roles'
    ]
  } ),

  // # toJSON
  // Serialize the User object into a doc for CouchDB.
  //
  // CouchDB's special users database has extra requirements.
  //  - _id must match `/org.couchdb.user:/``
  //  - name is equal to the portion after the colon
  //  - type must be 'user'.
  toJSON: function( options ) {
    return Object.assign( {}, this.attributes, {
      _id: `org.couchdb.user:${this.attributes.email}`,
      name: this.attributes.email,
      type: 'user'
    } );
  }
} );
mixinValidation( User );

// # User Collection
// Get all CouchDB users, prefixed by 'org.couchdb.user:'.
export const UserCollection = CouchCollection.extend( {
  model: User,

  pouch: {
    options: {
      allDocs: {
        include_docs: true,
        startkey: 'org.couchdb.user:',
        endkey: 'org.couchdb.user:\uffff'
      }
    }
  }
} );

// # Login model
// Just a user's email and password
export const Login = CouchModel.extend( { schema: credentials } );
mixinValidation( Login );
