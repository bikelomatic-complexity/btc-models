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

import { PromiseModel, PromiseCollection } from './promise';
import { union, map } from 'lodash';

// # keysBetween
// A common CouchDB pattern is querying documents by keys in a range.
// Use within a pouch config object like: `...keysBetween( 'points/' )`
export function keysBetween( base ) {
  return {
    startkey: base,
    endkey: base + '\uffff'
  };
}

// # CouchModel
// This is a base class for backbone models that use backbone pouch. CouchDB
// documents contain keys that you need to work with the database, but are
// irrelevant to the domain purpose of the model.
//
// It stores an array of these document keys in `this.safeguard`. By default,
// the array includes `_id` and `_rev`. However, subclasses of CouchModel
// may specify more.
//
// Other functions may use `this.safeguard` in their logic. For instance,
// the validation mixin does not consider safeguarded keys in model validation.
// (otherwise you would have to include _id and _rev in the schema for all
// models)
const safeguard = [ '_id', '_rev' ];

export const CouchModel = PromiseModel.extend( {
  initialize: function( attributes, options ) {
    PromiseModel.prototype.initialize.apply( this, arguments );
    this.safeguard = union( safeguard, this.safeguard );
  }
} );

// ## Couch Collection
// By default, btc-models use the allDocs method with include_docs = true.
// Therefore, we need to pick the document objects in the response array.
export const CouchCollection = PromiseCollection.extend( {
  parse: function( response, options ) {
    return map( response.rows, 'doc' );
  }
} );
