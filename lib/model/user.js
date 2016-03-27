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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tb2RlbC91c2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXlCQSxJQUFNLFdBQVcsR0FBRztBQUNsQixNQUFJLEVBQUUsUUFBUTtBQUNkLHNCQUFvQixFQUFFLEtBQUs7QUFDM0IsWUFBVSxFQUFFO0FBQ1YsU0FBSyxFQUFFO0FBQ0wsVUFBSSxFQUFFLFFBQVE7QUFDZCxZQUFNLEVBQUUsT0FBTztLQUNoQjtBQUNELFlBQVEsRUFBRTtBQUNSLFVBQUksRUFBRSxRQUFRO0FBQ2QsZUFBUyxFQUFFLENBQUM7S0FDYjtHQUNGO0FBQ0QsVUFBUSxFQUFFLENBQ1IsT0FBTyxFQUNQLFVBQVUsQ0FDWDtDQUNGOzs7OztBQUFDLEFBS0ssSUFBTSxJQUFJLFdBQUosSUFBSSxHQUFHLGlCQUFXLE1BQU0sQ0FBRTtBQUNyQyxhQUFXLEVBQUUsT0FBTzs7QUFFcEIsV0FBUyxFQUFFLENBQ1QsTUFBTSxFQUNOLE1BQU0sRUFDTixhQUFhLEVBQ2IsWUFBWSxFQUNaLGlCQUFpQixFQUNqQixNQUFNLENBQ1A7O0FBRUQsUUFBTSxFQUFFLG1DQUFjLEVBQUUsRUFBRSxXQUFXLEVBQUU7QUFDckMsY0FBVSxFQUFFO0FBQ1YsV0FBSyxFQUFFO0FBQ0wsWUFBSSxFQUFFLFFBQVE7QUFDZCxpQkFBUyxFQUFFLENBQUM7T0FDYjtBQUNELFVBQUksRUFBRTtBQUNKLFlBQUksRUFBRSxRQUFRO0FBQ2QsaUJBQVMsRUFBRSxDQUFDO09BQ2I7QUFDRCxjQUFRLEVBQUU7QUFDUixZQUFJLEVBQUUsUUFBUTtBQUNkLGlCQUFTLEVBQUUsQ0FBQztPQUNiO0FBQ0Qsa0JBQVksRUFBRTtBQUNaLFlBQUksRUFBRSxRQUFRO09BQ2Y7QUFDRCxjQUFRLEVBQUU7QUFDUixZQUFJLEVBQUUsU0FBUztBQUNmLGVBQU8sRUFBRSxLQUFLO09BQ2Y7QUFDRCxXQUFLLEVBQUU7QUFDTCxZQUFJLEVBQUUsT0FBTztBQUNiLGVBQU8sRUFBRSxFQUFFO09BQ1o7S0FDRjtBQUNELFlBQVEsRUFBRSxDQUNSLE9BQU8sRUFDUCxNQUFNLEVBQ04sVUFBVSxFQUNWLFVBQVUsRUFDVixPQUFPLENBQ1I7R0FDRixDQUFFOzs7Ozs7Ozs7QUFTSCxRQUFNLEVBQUUsZ0JBQVUsT0FBTyxFQUFHO0FBQzFCLFdBQU8sTUFBTSxDQUFDLE1BQU0sQ0FBRSxFQUFFLEVBQUUsSUFBSSxDQUFDLFVBQVUsRUFBRTtBQUN6QyxTQUFHLHdCQUFzQixJQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssQUFBRTtBQUNoRCxVQUFJLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLO0FBQzNCLFVBQUksRUFBRSxNQUFNO0tBQ2IsQ0FBRSxDQUFDO0dBQ0w7Q0FDRixDQUFFLENBQUM7QUFDSixzQ0FBaUIsSUFBSSxDQUFFOzs7O0FBQUMsQUFJakIsSUFBTSxjQUFjLFdBQWQsY0FBYyxHQUFHLHNCQUFnQixNQUFNLENBQUU7QUFDcEQsT0FBSyxFQUFFLElBQUk7O0FBRVgsT0FBSyxFQUFFO0FBQ0wsV0FBTyxFQUFFO0FBQ1AsYUFBTyxFQUFFO0FBQ1Asb0JBQVksRUFBRSxJQUFJO0FBQ2xCLGdCQUFRLEVBQUUsbUJBQW1CO0FBQzdCLGNBQU0sRUFBRSxvQkFBeUI7T0FDbEM7S0FDRjtHQUNGO0NBQ0YsQ0FBRTs7OztBQUFDLEFBSUcsSUFBTSxLQUFLLFdBQUwsS0FBSyxHQUFHLGlCQUFXLE1BQU0sQ0FBRSxFQUFFLE1BQU0sRUFBRSxXQUFXLEVBQUUsQ0FBRSxDQUFDO0FBQ2xFLHNDQUFpQixLQUFLLENBQUUsQ0FBQyIsImZpbGUiOiJ1c2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogYnRjLWFwcC1zZXJ2ZXIgLS0gU2VydmVyIGZvciB0aGUgQmljeWNsZSBUb3VyaW5nIENvbXBhbmlvblxuICogQ29weXJpZ2h0IMKpIDIwMTYgQWR2ZW50dXJlIEN5Y2xpbmcgQXNzb2NpYXRpb25cbiAqXG4gKiBUaGlzIGZpbGUgaXMgcGFydCBvZiBidGMtYXBwLXNlcnZlci5cbiAqXG4gKiBidGMtYXBwLXNlcnZlciBpcyBmcmVlIHNvZnR3YXJlOiB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5XG4gKiBpdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEFmZmVybyBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBhcyBwdWJsaXNoZWQgYnlcbiAqIHRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24sIGVpdGhlciB2ZXJzaW9uIDMgb2YgdGhlIExpY2Vuc2UsIG9yXG4gKiAoYXQgeW91ciBvcHRpb24pIGFueSBsYXRlciB2ZXJzaW9uLlxuICpcbiAqIGJ0Yy1hcHAtc2VydmVyIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXG4gKiBidXQgV0lUSE9VVCBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZlxuICogTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiAgU2VlIHRoZVxuICogQWZmZXJvIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXG4gKlxuICogWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgQWZmZXJvIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4gKiBhbG9uZyB3aXRoIEZvb2Jhci4gIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cbiAqL1xuXG5pbXBvcnQgeyBDb3VjaE1vZGVsLCBDb3VjaENvbGxlY3Rpb24gfSBmcm9tICcuL2Jhc2UnO1xuaW1wb3J0IHsgbWl4aW5WYWxpZGF0aW9uLCBtZXJnZVNjaGVtYXMgfSBmcm9tICcuL3ZhbGlkYXRpb24tbWl4aW4nO1xuXG4vLyAjIENyZWRlbnRpYWxzIFNlZ21lbnRcbi8vIFRoaXMgc2NoZW1hIHZhbGlkYXRlcyBhIHVzZXIncyBlbWFpbCBhbmQgcGFzc3dvcmQuIEJvdGggdGhlIFVzZXIgYW5kIExvZ2luXG4vLyBtb2RlbHMgc2hhcmUgdGhpcyBzY2hlbWEgc2VnbWVudC5cbmNvbnN0IGNyZWRlbnRpYWxzID0ge1xuICB0eXBlOiAnb2JqZWN0JyxcbiAgYWRkaXRpb25hbFByb3BlcnRpZXM6IGZhbHNlLFxuICBwcm9wZXJ0aWVzOiB7XG4gICAgZW1haWw6IHtcbiAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgZm9ybWF0OiAnZW1haWwnXG4gICAgfSxcbiAgICBwYXNzd29yZDoge1xuICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICBtaW5MZW5ndGg6IDhcbiAgICB9XG4gIH0sXG4gIHJlcXVpcmVkOiBbXG4gICAgJ2VtYWlsJyxcbiAgICAncGFzc3dvcmQnXG4gIF1cbn07XG5cbi8vICMgVXNlciBNb2RlbFxuLy8gSW4gdGhlIGRvbWFpbiBsYXllciwgd2UgdW5pcXVlbHkgcmVmZXJlbmNlIFVzZXJzIGJ5IHRoZWlyIGVtYWlscy4gV2hlblxuLy8gbW9kZWxzIGFyZSBzZXJpYWxpemVkIGludG8gQ291Y2ggZG9jcywgdGhlIGBfaWRgIGtleSB3aWxsIGJlIHNldC5cbmV4cG9ydCBjb25zdCBVc2VyID0gQ291Y2hNb2RlbC5leHRlbmQoIHtcbiAgaWRBdHRyaWJ1dGU6ICdlbWFpbCcsXG5cbiAgc2FmZWd1YXJkOiBbXG4gICAgJ25hbWUnLFxuICAgICd0eXBlJyxcbiAgICAnZGVyaXZlZF9rZXknLFxuICAgICdpdGVyYXRpb25zJyxcbiAgICAncGFzc3dvcmRfc2NoZW1lJyxcbiAgICAnc2FsdCdcbiAgXSxcblxuICBzY2hlbWE6IG1lcmdlU2NoZW1hcygge30sIGNyZWRlbnRpYWxzLCB7XG4gICAgcHJvcGVydGllczoge1xuICAgICAgZmlyc3Q6IHtcbiAgICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICAgIG1pbkxlbmd0aDogMVxuICAgICAgfSxcbiAgICAgIGxhc3Q6IHtcbiAgICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICAgIG1pbkxlbmd0aDogMVxuICAgICAgfSxcbiAgICAgIHVzZXJuYW1lOiB7XG4gICAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgICBtaW5MZW5ndGg6IDNcbiAgICAgIH0sXG4gICAgICB2ZXJpZmljYXRpb246IHtcbiAgICAgICAgdHlwZTogJ3N0cmluZydcbiAgICAgIH0sXG4gICAgICB2ZXJpZmllZDoge1xuICAgICAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgICAgIGRlZmF1bHQ6IGZhbHNlXG4gICAgICB9LFxuICAgICAgcm9sZXM6IHtcbiAgICAgICAgdHlwZTogJ2FycmF5JyxcbiAgICAgICAgZGVmYXVsdDogW11cbiAgICAgIH1cbiAgICB9LFxuICAgIHJlcXVpcmVkOiBbXG4gICAgICAnZmlyc3QnLFxuICAgICAgJ2xhc3QnLFxuICAgICAgJ3VzZXJuYW1lJyxcbiAgICAgICd2ZXJpZmllZCcsXG4gICAgICAncm9sZXMnXG4gICAgXVxuICB9ICksXG5cbiAgLy8gIyB0b0pTT05cbiAgLy8gU2VyaWFsaXplIHRoZSBVc2VyIG9iamVjdCBpbnRvIGEgZG9jIGZvciBDb3VjaERCLlxuICAvL1xuICAvLyBDb3VjaERCJ3Mgc3BlY2lhbCB1c2VycyBkYXRhYmFzZSBoYXMgZXh0cmEgcmVxdWlyZW1lbnRzLlxuICAvLyAgLSBfaWQgbXVzdCBtYXRjaCBgL29yZy5jb3VjaGRiLnVzZXI6L2BgXG4gIC8vICAtIG5hbWUgaXMgZXF1YWwgdG8gdGhlIHBvcnRpb24gYWZ0ZXIgdGhlIGNvbG9uXG4gIC8vICAtIHR5cGUgbXVzdCBiZSAndXNlcicuXG4gIHRvSlNPTjogZnVuY3Rpb24oIG9wdGlvbnMgKSB7XG4gICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oIHt9LCB0aGlzLmF0dHJpYnV0ZXMsIHtcbiAgICAgIF9pZDogYG9yZy5jb3VjaGRiLnVzZXI6JHt0aGlzLmF0dHJpYnV0ZXMuZW1haWx9YCxcbiAgICAgIG5hbWU6IHRoaXMuYXR0cmlidXRlcy5lbWFpbCxcbiAgICAgIHR5cGU6ICd1c2VyJ1xuICAgIH0gKTtcbiAgfVxufSApO1xubWl4aW5WYWxpZGF0aW9uKCBVc2VyICk7XG5cbi8vICMgVXNlciBDb2xsZWN0aW9uXG4vLyBHZXQgYWxsIENvdWNoREIgdXNlcnMsIHByZWZpeGVkIGJ5ICdvcmcuY291Y2hkYi51c2VyOicuXG5leHBvcnQgY29uc3QgVXNlckNvbGxlY3Rpb24gPSBDb3VjaENvbGxlY3Rpb24uZXh0ZW5kKCB7XG4gIG1vZGVsOiBVc2VyLFxuXG4gIHBvdWNoOiB7XG4gICAgb3B0aW9uczoge1xuICAgICAgYWxsRG9jczoge1xuICAgICAgICBpbmNsdWRlX2RvY3M6IHRydWUsXG4gICAgICAgIHN0YXJ0a2V5OiAnb3JnLmNvdWNoZGIudXNlcjonLFxuICAgICAgICBlbmRrZXk6ICdvcmcuY291Y2hkYi51c2VyOlxcdWZmZmYnXG4gICAgICB9XG4gICAgfVxuICB9XG59ICk7XG5cbi8vICMgTG9naW4gbW9kZWxcbi8vIEp1c3QgYSB1c2VyJ3MgZW1haWwgYW5kIHBhc3N3b3JkXG5leHBvcnQgY29uc3QgTG9naW4gPSBDb3VjaE1vZGVsLmV4dGVuZCggeyBzY2hlbWE6IGNyZWRlbnRpYWxzIH0gKTtcbm1peGluVmFsaWRhdGlvbiggTG9naW4gKTtcbiJdfQ==