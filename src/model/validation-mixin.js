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

import Ajv from 'ajv';
import { assign, omit, merge, union } from 'lodash';

// # Validation Mixin Factory
// A function to generate a mixin that may be applied to a backbone model.
// To generate the mixin, you must supply a conformant JSON schema as JSON.
//
// We are using [ajv](https://github.com/epoberezkin/ajv) to validate models.
// Some notable configuration pieces:
//  - allErrors: report all errors encountered instead of failing fast
//  - useDefaults: if a default is provided, inject that into the model
//
// The ajv instance will be closed over by the `validate` function mixed into
// the backbone model.
export default function ValidationMixin( schema ) {
  const ajv = Ajv( {
    removeAdditional: true,
    allErrors: true,
    useDefaults: true
  } );

  return {
    // ## Validate
    // Validate model attributes with ajv. Exclude safeguarded keys before
    // validation (see CouchModel). Returns either an array of errors or
    // undefined.
    validate: function( attributes, options ) {
      let attrs;
      if ( this.safeguard ) {
        attrs = omit( attributes, this.safeguard );
      } else {
        attrs = attributes;
      }

      const valid = ajv.validate( schema, attrs );
      if ( !valid ) {
        return ajv.errors;
      }
    }
  };
}

// # mixinValidation
// Given a backbone model or collection, mix in the validation function,
// prepared for a JSON schema. This schema must be available as JSON
// in the model or collection's prototype.
export function mixinValidation( modelWithSchema ) {
  const mixin = ValidationMixin( modelWithSchema.prototype.schema );
  assign( modelWithSchema.prototype, mixin );
}

// # mergeSchemas
// In ineritance hierarchies, JSON schemas must be merged.
// This function merges schema JSON just like lodash.merge, except we union
// arrays together (for use with the `required` field for instance).
export function mergeSchemas( parent, mine ) {
  const intermediate = merge( {}, parent, mine );
  const required = union( parent.required, mine.required );

  return assign( {}, intermediate, { required } );
}
