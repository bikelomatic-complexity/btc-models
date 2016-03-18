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

import { Model, Collection } from 'backbone';
import { union, isArray } from 'underscore';

import { map } from 'lodash';

export function keysBetween( base ) {
  return {
    startkey: base,
    endkey: base + '\uffff'
  };
}

// Special keys that are reserved by serialized CouchDB documents
const baseSafeguard = [ '_id', '_rev' ];

// ## Couch Model
// This base class ensures the client will not unknowingly modify the special
// keys of a CouchDB document.
export const CouchModel = Model.extend( {
  // By default, `CouchModel` safeguards `_id` and `_rev`. You can extend
  // this list of safeguarded keys by passing an array in `options.special`.
  initialize: function( attributes, options ) {
    Model.prototype.initialize.apply( this, arguments );

    if ( this.safeguard && isArray( this.safeguard ) ) {
      this.safeguard = union( baseSafeguard, this.safeguard );
    } else {
      this.safeguard = baseSafeguard;
    }
  }
} );

// ## Couch Collection
// This base collection class helps the CouchModel to prevent the client
// from unknowingly modifying the special keys of a CouchDB document.
export const CouchCollection = Collection.extend( {
  parse: function( response, options ) {
    return map( response.rows, 'doc' );
  }
} );
