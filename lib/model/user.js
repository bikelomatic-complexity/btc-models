'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Login = exports.UserCollection = exports.User = undefined;

var _base = require('./base');

var _validationMixin = require('./validation-mixin');

// # Credentials Segment
// This schema validates a user's email and password. Both the User and Login
// models share this schema segment.
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

var credentials = {
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
  required: ['email', 'password']
};

// # User Model
// In the domain layer, we uniquely reference Users by their emails. When
// models are serialized into Couch docs, the `_id` key will be set.
var User = exports.User = _base.CouchModel.extend({
  idAttribute: 'email',

  safeguard: ['name', 'type', 'derived_key', 'iterations', 'password_scheme', 'salt'],

  schema: (0, _validationMixin.mergeSchemas)({}, credentials, {
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
    required: ['first', 'last', 'username', 'verified', 'roles']
  }),

  // # toJSON
  // Serialize the User object into a doc for CouchDB.
  //
  // CouchDB's special users database has extra requirements.
  //  - _id must match `/org.couchdb.user:/``
  //  - name is equal to the portion after the colon
  //  - type must be 'user'.
  toJSON: function toJSON(options) {
    return Object.assign({}, this.attributes, {
      _id: 'org.couchdb.user:' + this.attributes.email,
      name: this.attributes.email,
      type: 'user'
    });
  }
});
(0, _validationMixin.mixinValidation)(User);

// # User Collection
// Get all CouchDB users, prefixed by 'org.couchdb.user:'.
var UserCollection = exports.UserCollection = _base.CouchCollection.extend({
  model: User,

  pouch: {
    options: {
      allDocs: {
        include_docs: true,
        startkey: 'org.couchdb.user:',
        endkey: 'org.couchdb.user:￿'
      }
    }
  }
});

// # Login model
// Just a user's email and password
var Login = exports.Login = _base.CouchModel.extend({ schema: credentials });
(0, _validationMixin.mixinValidation)(Login);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tb2RlbC91c2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFtQkE7O0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUtBLElBQU0sY0FBYztBQUNsQixRQUFNLFFBQU47QUFDQSx3QkFBc0IsS0FBdEI7QUFDQSxjQUFZO0FBQ1YsV0FBTztBQUNMLFlBQU0sUUFBTjtBQUNBLGNBQVEsT0FBUjtLQUZGO0FBSUEsY0FBVTtBQUNSLFlBQU0sUUFBTjtBQUNBLGlCQUFXLENBQVg7S0FGRjtHQUxGO0FBVUEsWUFBVSxDQUNSLE9BRFEsRUFFUixVQUZRLENBQVY7Q0FiSTs7Ozs7QUFzQkMsSUFBTSxzQkFBTyxpQkFBVyxNQUFYLENBQW1CO0FBQ3JDLGVBQWEsT0FBYjs7QUFFQSxhQUFXLENBQ1QsTUFEUyxFQUVULE1BRlMsRUFHVCxhQUhTLEVBSVQsWUFKUyxFQUtULGlCQUxTLEVBTVQsTUFOUyxDQUFYOztBQVNBLFVBQVEsbUNBQWMsRUFBZCxFQUFrQixXQUFsQixFQUErQjtBQUNyQyxnQkFBWTtBQUNWLGFBQU87QUFDTCxjQUFNLFFBQU47QUFDQSxtQkFBVyxDQUFYO09BRkY7QUFJQSxZQUFNO0FBQ0osY0FBTSxRQUFOO0FBQ0EsbUJBQVcsQ0FBWDtPQUZGO0FBSUEsZ0JBQVU7QUFDUixjQUFNLFFBQU47QUFDQSxtQkFBVyxDQUFYO09BRkY7QUFJQSxvQkFBYztBQUNaLGNBQU0sUUFBTjtPQURGO0FBR0EsZ0JBQVU7QUFDUixjQUFNLFNBQU47QUFDQSxpQkFBUyxLQUFUO09BRkY7QUFJQSxhQUFPO0FBQ0wsY0FBTSxPQUFOO0FBQ0EsaUJBQVMsRUFBVDtPQUZGO0tBcEJGO0FBeUJBLGNBQVUsQ0FDUixPQURRLEVBRVIsTUFGUSxFQUdSLFVBSFEsRUFJUixVQUpRLEVBS1IsT0FMUSxDQUFWO0dBMUJNLENBQVI7Ozs7Ozs7OztBQTBDQSxVQUFRLGdCQUFVLE9BQVYsRUFBb0I7QUFDMUIsV0FBTyxPQUFPLE1BQVAsQ0FBZSxFQUFmLEVBQW1CLEtBQUssVUFBTCxFQUFpQjtBQUN6QyxpQ0FBeUIsS0FBSyxVQUFMLENBQWdCLEtBQWhCO0FBQ3pCLFlBQU0sS0FBSyxVQUFMLENBQWdCLEtBQWhCO0FBQ04sWUFBTSxNQUFOO0tBSEssQ0FBUCxDQUQwQjtHQUFwQjtDQXREVSxDQUFQO0FBOERiLHNDQUFpQixJQUFqQjs7OztBQUlPLElBQU0sMENBQWlCLHNCQUFnQixNQUFoQixDQUF3QjtBQUNwRCxTQUFPLElBQVA7O0FBRUEsU0FBTztBQUNMLGFBQVM7QUFDUCxlQUFTO0FBQ1Asc0JBQWMsSUFBZDtBQUNBLGtCQUFVLG1CQUFWO0FBQ0EsZ0JBQVEsb0JBQVI7T0FIRjtLQURGO0dBREY7Q0FINEIsQ0FBakI7Ozs7QUFnQk4sSUFBTSx3QkFBUSxpQkFBVyxNQUFYLENBQW1CLEVBQUUsUUFBUSxXQUFSLEVBQXJCLENBQVI7QUFDYixzQ0FBaUIsS0FBakIiLCJmaWxlIjoidXNlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIGJ0Yy1hcHAtc2VydmVyIC0tIFNlcnZlciBmb3IgdGhlIEJpY3ljbGUgVG91cmluZyBDb21wYW5pb25cbiAqIENvcHlyaWdodCDCqSAyMDE2IEFkdmVudHVyZSBDeWNsaW5nIEFzc29jaWF0aW9uXG4gKlxuICogVGhpcyBmaWxlIGlzIHBhcnQgb2YgYnRjLWFwcC1zZXJ2ZXIuXG4gKlxuICogYnRjLWFwcC1zZXJ2ZXIgaXMgZnJlZSBzb2Z0d2FyZTogeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeVxuICogaXQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBBZmZlcm8gR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgYXMgcHVibGlzaGVkIGJ5XG4gKiB0aGUgRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uLCBlaXRoZXIgdmVyc2lvbiAzIG9mIHRoZSBMaWNlbnNlLCBvclxuICogKGF0IHlvdXIgb3B0aW9uKSBhbnkgbGF0ZXIgdmVyc2lvbi5cbiAqXG4gKiBidGMtYXBwLXNlcnZlciBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLFxuICogYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2ZcbiAqIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gIFNlZSB0aGVcbiAqIEFmZmVybyBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZSBkZXRhaWxzLlxuICpcbiAqIFlvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEFmZmVybyBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuICogYWxvbmcgd2l0aCBGb29iYXIuICBJZiBub3QsIHNlZSA8aHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG4gKi9cblxuaW1wb3J0IHsgQ291Y2hNb2RlbCwgQ291Y2hDb2xsZWN0aW9uIH0gZnJvbSAnLi9iYXNlJztcbmltcG9ydCB7IG1peGluVmFsaWRhdGlvbiwgbWVyZ2VTY2hlbWFzIH0gZnJvbSAnLi92YWxpZGF0aW9uLW1peGluJztcblxuLy8gIyBDcmVkZW50aWFscyBTZWdtZW50XG4vLyBUaGlzIHNjaGVtYSB2YWxpZGF0ZXMgYSB1c2VyJ3MgZW1haWwgYW5kIHBhc3N3b3JkLiBCb3RoIHRoZSBVc2VyIGFuZCBMb2dpblxuLy8gbW9kZWxzIHNoYXJlIHRoaXMgc2NoZW1hIHNlZ21lbnQuXG5jb25zdCBjcmVkZW50aWFscyA9IHtcbiAgdHlwZTogJ29iamVjdCcsXG4gIGFkZGl0aW9uYWxQcm9wZXJ0aWVzOiBmYWxzZSxcbiAgcHJvcGVydGllczoge1xuICAgIGVtYWlsOiB7XG4gICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgIGZvcm1hdDogJ2VtYWlsJ1xuICAgIH0sXG4gICAgcGFzc3dvcmQ6IHtcbiAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgbWluTGVuZ3RoOiA4XG4gICAgfVxuICB9LFxuICByZXF1aXJlZDogW1xuICAgICdlbWFpbCcsXG4gICAgJ3Bhc3N3b3JkJ1xuICBdXG59O1xuXG4vLyAjIFVzZXIgTW9kZWxcbi8vIEluIHRoZSBkb21haW4gbGF5ZXIsIHdlIHVuaXF1ZWx5IHJlZmVyZW5jZSBVc2VycyBieSB0aGVpciBlbWFpbHMuIFdoZW5cbi8vIG1vZGVscyBhcmUgc2VyaWFsaXplZCBpbnRvIENvdWNoIGRvY3MsIHRoZSBgX2lkYCBrZXkgd2lsbCBiZSBzZXQuXG5leHBvcnQgY29uc3QgVXNlciA9IENvdWNoTW9kZWwuZXh0ZW5kKCB7XG4gIGlkQXR0cmlidXRlOiAnZW1haWwnLFxuXG4gIHNhZmVndWFyZDogW1xuICAgICduYW1lJyxcbiAgICAndHlwZScsXG4gICAgJ2Rlcml2ZWRfa2V5JyxcbiAgICAnaXRlcmF0aW9ucycsXG4gICAgJ3Bhc3N3b3JkX3NjaGVtZScsXG4gICAgJ3NhbHQnXG4gIF0sXG5cbiAgc2NoZW1hOiBtZXJnZVNjaGVtYXMoIHt9LCBjcmVkZW50aWFscywge1xuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgIGZpcnN0OiB7XG4gICAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgICBtaW5MZW5ndGg6IDFcbiAgICAgIH0sXG4gICAgICBsYXN0OiB7XG4gICAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgICBtaW5MZW5ndGg6IDFcbiAgICAgIH0sXG4gICAgICB1c2VybmFtZToge1xuICAgICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgICAgbWluTGVuZ3RoOiAzXG4gICAgICB9LFxuICAgICAgdmVyaWZpY2F0aW9uOiB7XG4gICAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgICB9LFxuICAgICAgdmVyaWZpZWQ6IHtcbiAgICAgICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgICAgICBkZWZhdWx0OiBmYWxzZVxuICAgICAgfSxcbiAgICAgIHJvbGVzOiB7XG4gICAgICAgIHR5cGU6ICdhcnJheScsXG4gICAgICAgIGRlZmF1bHQ6IFtdXG4gICAgICB9XG4gICAgfSxcbiAgICByZXF1aXJlZDogW1xuICAgICAgJ2ZpcnN0JyxcbiAgICAgICdsYXN0JyxcbiAgICAgICd1c2VybmFtZScsXG4gICAgICAndmVyaWZpZWQnLFxuICAgICAgJ3JvbGVzJ1xuICAgIF1cbiAgfSApLFxuXG4gIC8vICMgdG9KU09OXG4gIC8vIFNlcmlhbGl6ZSB0aGUgVXNlciBvYmplY3QgaW50byBhIGRvYyBmb3IgQ291Y2hEQi5cbiAgLy9cbiAgLy8gQ291Y2hEQidzIHNwZWNpYWwgdXNlcnMgZGF0YWJhc2UgaGFzIGV4dHJhIHJlcXVpcmVtZW50cy5cbiAgLy8gIC0gX2lkIG11c3QgbWF0Y2ggYC9vcmcuY291Y2hkYi51c2VyOi9gYFxuICAvLyAgLSBuYW1lIGlzIGVxdWFsIHRvIHRoZSBwb3J0aW9uIGFmdGVyIHRoZSBjb2xvblxuICAvLyAgLSB0eXBlIG11c3QgYmUgJ3VzZXInLlxuICB0b0pTT046IGZ1bmN0aW9uKCBvcHRpb25zICkge1xuICAgIHJldHVybiBPYmplY3QuYXNzaWduKCB7fSwgdGhpcy5hdHRyaWJ1dGVzLCB7XG4gICAgICBfaWQ6IGBvcmcuY291Y2hkYi51c2VyOiR7dGhpcy5hdHRyaWJ1dGVzLmVtYWlsfWAsXG4gICAgICBuYW1lOiB0aGlzLmF0dHJpYnV0ZXMuZW1haWwsXG4gICAgICB0eXBlOiAndXNlcidcbiAgICB9ICk7XG4gIH1cbn0gKTtcbm1peGluVmFsaWRhdGlvbiggVXNlciApO1xuXG4vLyAjIFVzZXIgQ29sbGVjdGlvblxuLy8gR2V0IGFsbCBDb3VjaERCIHVzZXJzLCBwcmVmaXhlZCBieSAnb3JnLmNvdWNoZGIudXNlcjonLlxuZXhwb3J0IGNvbnN0IFVzZXJDb2xsZWN0aW9uID0gQ291Y2hDb2xsZWN0aW9uLmV4dGVuZCgge1xuICBtb2RlbDogVXNlcixcblxuICBwb3VjaDoge1xuICAgIG9wdGlvbnM6IHtcbiAgICAgIGFsbERvY3M6IHtcbiAgICAgICAgaW5jbHVkZV9kb2NzOiB0cnVlLFxuICAgICAgICBzdGFydGtleTogJ29yZy5jb3VjaGRiLnVzZXI6JyxcbiAgICAgICAgZW5ka2V5OiAnb3JnLmNvdWNoZGIudXNlcjpcXHVmZmZmJ1xuICAgICAgfVxuICAgIH1cbiAgfVxufSApO1xuXG4vLyAjIExvZ2luIG1vZGVsXG4vLyBKdXN0IGEgdXNlcidzIGVtYWlsIGFuZCBwYXNzd29yZFxuZXhwb3J0IGNvbnN0IExvZ2luID0gQ291Y2hNb2RlbC5leHRlbmQoIHsgc2NoZW1hOiBjcmVkZW50aWFscyB9ICk7XG5taXhpblZhbGlkYXRpb24oIExvZ2luICk7XG4iXX0=