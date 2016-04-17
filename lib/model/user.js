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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tb2RlbC91c2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFtQkE7O0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUtBLElBQU0sY0FBYztBQUNsQixRQUFNLFFBQU47QUFDQSx3QkFBc0IsS0FBdEI7QUFDQSxjQUFZO0FBQ1YsV0FBTztBQUNMLFlBQU0sUUFBTjtBQUNBLGNBQVEsT0FBUjtLQUZGO0FBSUEsY0FBVTtBQUNSLFlBQU0sUUFBTjtBQUNBLGlCQUFXLENBQVg7S0FGRjtHQUxGO0FBVUEsWUFBVSxDQUNSLE9BRFEsRUFFUixVQUZRLENBQVY7Q0FiSTs7Ozs7QUFzQkMsSUFBTSxzQkFBTyxpQkFBVyxNQUFYLENBQW1CO0FBQ3JDLGVBQWEsT0FBYjs7QUFFQSxhQUFXLENBQ1QsTUFEUyxFQUVULE1BRlMsRUFHVCxhQUhTLEVBSVQsWUFKUyxFQUtULGlCQUxTLEVBTVQsTUFOUyxDQUFYOztBQVNBLFVBQVEsbUNBQWMsRUFBZCxFQUFrQixXQUFsQixFQUErQjtBQUNyQyxnQkFBWTtBQUNWLGFBQU87QUFDTCxjQUFNLFFBQU47QUFDQSxtQkFBVyxDQUFYO09BRkY7QUFJQSxZQUFNO0FBQ0osY0FBTSxRQUFOO0FBQ0EsbUJBQVcsQ0FBWDtPQUZGO0FBSUEsZ0JBQVU7QUFDUixjQUFNLFFBQU47QUFDQSxtQkFBVyxDQUFYO09BRkY7QUFJQSxvQkFBYztBQUNaLGNBQU0sUUFBTjtPQURGO0FBR0EsZ0JBQVU7QUFDUixjQUFNLFNBQU47QUFDQSxpQkFBUyxLQUFUO09BRkY7QUFJQSxhQUFPO0FBQ0wsY0FBTSxPQUFOO0FBQ0EsaUJBQVMsRUFBVDtPQUZGO0tBcEJGO0FBeUJBLGNBQVUsQ0FDUixPQURRLEVBRVIsTUFGUSxFQUdSLFVBSFEsRUFJUixVQUpRLEVBS1IsT0FMUSxDQUFWO0dBMUJNLENBQVI7Ozs7Ozs7OztBQTBDQSxVQUFRLGdCQUFVLE9BQVYsRUFBb0I7QUFDMUIsV0FBTyxPQUFPLE1BQVAsQ0FBZSxFQUFmLEVBQW1CLEtBQUssVUFBTCxFQUFpQjtBQUN6QyxpQ0FBeUIsS0FBSyxVQUFMLENBQWdCLEtBQWhCO0FBQ3pCLFlBQU0sS0FBSyxVQUFMLENBQWdCLEtBQWhCO0FBQ04sWUFBTSxNQUFOO0tBSEssQ0FBUCxDQUQwQjtHQUFwQjtDQXREVSxDQUFQO0FBOERiLHNDQUFpQixJQUFqQjs7OztBQUlPLElBQU0sMENBQWlCLHNCQUFnQixNQUFoQixDQUF3QjtBQUNwRCxTQUFPLElBQVA7O0FBRUEsU0FBTztBQUNMLGFBQVM7QUFDUCxlQUFTO0FBQ1Asc0JBQWMsSUFBZDtBQUNBLGtCQUFVLG1CQUFWO0FBQ0EsZ0JBQVEsb0JBQVI7T0FIRjtLQURGO0dBREY7Q0FINEIsQ0FBakI7Ozs7QUFnQk4sSUFBTSx3QkFBUSxpQkFBVyxNQUFYLENBQW1CLEVBQUUsUUFBUSxXQUFSLEVBQXJCLENBQVI7QUFDYixzQ0FBaUIsS0FBakIiLCJmaWxlIjoidXNlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIGJ0Yy1hcHAtc2VydmVyIC0tIFNlcnZlciBmb3IgdGhlIEJpY3ljbGUgVG91cmluZyBDb21wYW5pb25cclxuICogQ29weXJpZ2h0IMKpIDIwMTYgQWR2ZW50dXJlIEN5Y2xpbmcgQXNzb2NpYXRpb25cclxuICpcclxuICogVGhpcyBmaWxlIGlzIHBhcnQgb2YgYnRjLWFwcC1zZXJ2ZXIuXHJcbiAqXHJcbiAqIGJ0Yy1hcHAtc2VydmVyIGlzIGZyZWUgc29mdHdhcmU6IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnlcclxuICogaXQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBBZmZlcm8gR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgYXMgcHVibGlzaGVkIGJ5XHJcbiAqIHRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24sIGVpdGhlciB2ZXJzaW9uIDMgb2YgdGhlIExpY2Vuc2UsIG9yXHJcbiAqIChhdCB5b3VyIG9wdGlvbikgYW55IGxhdGVyIHZlcnNpb24uXHJcbiAqXHJcbiAqIGJ0Yy1hcHAtc2VydmVyIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXHJcbiAqIGJ1dCBXSVRIT1VUIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mXHJcbiAqIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gIFNlZSB0aGVcclxuICogQWZmZXJvIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXHJcbiAqXHJcbiAqIFlvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEFmZmVybyBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxyXG4gKiBhbG9uZyB3aXRoIEZvb2Jhci4gIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cclxuICovXHJcblxyXG5pbXBvcnQgeyBDb3VjaE1vZGVsLCBDb3VjaENvbGxlY3Rpb24gfSBmcm9tICcuL2Jhc2UnO1xyXG5pbXBvcnQgeyBtaXhpblZhbGlkYXRpb24sIG1lcmdlU2NoZW1hcyB9IGZyb20gJy4vdmFsaWRhdGlvbi1taXhpbic7XHJcblxyXG4vLyAjIENyZWRlbnRpYWxzIFNlZ21lbnRcclxuLy8gVGhpcyBzY2hlbWEgdmFsaWRhdGVzIGEgdXNlcidzIGVtYWlsIGFuZCBwYXNzd29yZC4gQm90aCB0aGUgVXNlciBhbmQgTG9naW5cclxuLy8gbW9kZWxzIHNoYXJlIHRoaXMgc2NoZW1hIHNlZ21lbnQuXHJcbmNvbnN0IGNyZWRlbnRpYWxzID0ge1xyXG4gIHR5cGU6ICdvYmplY3QnLFxyXG4gIGFkZGl0aW9uYWxQcm9wZXJ0aWVzOiBmYWxzZSxcclxuICBwcm9wZXJ0aWVzOiB7XHJcbiAgICBlbWFpbDoge1xyXG4gICAgICB0eXBlOiAnc3RyaW5nJyxcclxuICAgICAgZm9ybWF0OiAnZW1haWwnXHJcbiAgICB9LFxyXG4gICAgcGFzc3dvcmQ6IHtcclxuICAgICAgdHlwZTogJ3N0cmluZycsXHJcbiAgICAgIG1pbkxlbmd0aDogOFxyXG4gICAgfVxyXG4gIH0sXHJcbiAgcmVxdWlyZWQ6IFtcclxuICAgICdlbWFpbCcsXHJcbiAgICAncGFzc3dvcmQnXHJcbiAgXVxyXG59O1xyXG5cclxuLy8gIyBVc2VyIE1vZGVsXHJcbi8vIEluIHRoZSBkb21haW4gbGF5ZXIsIHdlIHVuaXF1ZWx5IHJlZmVyZW5jZSBVc2VycyBieSB0aGVpciBlbWFpbHMuIFdoZW5cclxuLy8gbW9kZWxzIGFyZSBzZXJpYWxpemVkIGludG8gQ291Y2ggZG9jcywgdGhlIGBfaWRgIGtleSB3aWxsIGJlIHNldC5cclxuZXhwb3J0IGNvbnN0IFVzZXIgPSBDb3VjaE1vZGVsLmV4dGVuZCgge1xyXG4gIGlkQXR0cmlidXRlOiAnZW1haWwnLFxyXG5cclxuICBzYWZlZ3VhcmQ6IFtcclxuICAgICduYW1lJyxcclxuICAgICd0eXBlJyxcclxuICAgICdkZXJpdmVkX2tleScsXHJcbiAgICAnaXRlcmF0aW9ucycsXHJcbiAgICAncGFzc3dvcmRfc2NoZW1lJyxcclxuICAgICdzYWx0J1xyXG4gIF0sXHJcblxyXG4gIHNjaGVtYTogbWVyZ2VTY2hlbWFzKCB7fSwgY3JlZGVudGlhbHMsIHtcclxuICAgIHByb3BlcnRpZXM6IHtcclxuICAgICAgZmlyc3Q6IHtcclxuICAgICAgICB0eXBlOiAnc3RyaW5nJyxcclxuICAgICAgICBtaW5MZW5ndGg6IDFcclxuICAgICAgfSxcclxuICAgICAgbGFzdDoge1xyXG4gICAgICAgIHR5cGU6ICdzdHJpbmcnLFxyXG4gICAgICAgIG1pbkxlbmd0aDogMVxyXG4gICAgICB9LFxyXG4gICAgICB1c2VybmFtZToge1xyXG4gICAgICAgIHR5cGU6ICdzdHJpbmcnLFxyXG4gICAgICAgIG1pbkxlbmd0aDogM1xyXG4gICAgICB9LFxyXG4gICAgICB2ZXJpZmljYXRpb246IHtcclxuICAgICAgICB0eXBlOiAnc3RyaW5nJ1xyXG4gICAgICB9LFxyXG4gICAgICB2ZXJpZmllZDoge1xyXG4gICAgICAgIHR5cGU6ICdib29sZWFuJyxcclxuICAgICAgICBkZWZhdWx0OiBmYWxzZVxyXG4gICAgICB9LFxyXG4gICAgICByb2xlczoge1xyXG4gICAgICAgIHR5cGU6ICdhcnJheScsXHJcbiAgICAgICAgZGVmYXVsdDogW11cclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIHJlcXVpcmVkOiBbXHJcbiAgICAgICdmaXJzdCcsXHJcbiAgICAgICdsYXN0JyxcclxuICAgICAgJ3VzZXJuYW1lJyxcclxuICAgICAgJ3ZlcmlmaWVkJyxcclxuICAgICAgJ3JvbGVzJ1xyXG4gICAgXVxyXG4gIH0gKSxcclxuXHJcbiAgLy8gIyB0b0pTT05cclxuICAvLyBTZXJpYWxpemUgdGhlIFVzZXIgb2JqZWN0IGludG8gYSBkb2MgZm9yIENvdWNoREIuXHJcbiAgLy9cclxuICAvLyBDb3VjaERCJ3Mgc3BlY2lhbCB1c2VycyBkYXRhYmFzZSBoYXMgZXh0cmEgcmVxdWlyZW1lbnRzLlxyXG4gIC8vICAtIF9pZCBtdXN0IG1hdGNoIGAvb3JnLmNvdWNoZGIudXNlcjovYGBcclxuICAvLyAgLSBuYW1lIGlzIGVxdWFsIHRvIHRoZSBwb3J0aW9uIGFmdGVyIHRoZSBjb2xvblxyXG4gIC8vICAtIHR5cGUgbXVzdCBiZSAndXNlcicuXHJcbiAgdG9KU09OOiBmdW5jdGlvbiggb3B0aW9ucyApIHtcclxuICAgIHJldHVybiBPYmplY3QuYXNzaWduKCB7fSwgdGhpcy5hdHRyaWJ1dGVzLCB7XHJcbiAgICAgIF9pZDogYG9yZy5jb3VjaGRiLnVzZXI6JHt0aGlzLmF0dHJpYnV0ZXMuZW1haWx9YCxcclxuICAgICAgbmFtZTogdGhpcy5hdHRyaWJ1dGVzLmVtYWlsLFxyXG4gICAgICB0eXBlOiAndXNlcidcclxuICAgIH0gKTtcclxuICB9XHJcbn0gKTtcclxubWl4aW5WYWxpZGF0aW9uKCBVc2VyICk7XHJcblxyXG4vLyAjIFVzZXIgQ29sbGVjdGlvblxyXG4vLyBHZXQgYWxsIENvdWNoREIgdXNlcnMsIHByZWZpeGVkIGJ5ICdvcmcuY291Y2hkYi51c2VyOicuXHJcbmV4cG9ydCBjb25zdCBVc2VyQ29sbGVjdGlvbiA9IENvdWNoQ29sbGVjdGlvbi5leHRlbmQoIHtcclxuICBtb2RlbDogVXNlcixcclxuXHJcbiAgcG91Y2g6IHtcclxuICAgIG9wdGlvbnM6IHtcclxuICAgICAgYWxsRG9jczoge1xyXG4gICAgICAgIGluY2x1ZGVfZG9jczogdHJ1ZSxcclxuICAgICAgICBzdGFydGtleTogJ29yZy5jb3VjaGRiLnVzZXI6JyxcclxuICAgICAgICBlbmRrZXk6ICdvcmcuY291Y2hkYi51c2VyOlxcdWZmZmYnXHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbn0gKTtcclxuXHJcbi8vICMgTG9naW4gbW9kZWxcclxuLy8gSnVzdCBhIHVzZXIncyBlbWFpbCBhbmQgcGFzc3dvcmRcclxuZXhwb3J0IGNvbnN0IExvZ2luID0gQ291Y2hNb2RlbC5leHRlbmQoIHsgc2NoZW1hOiBjcmVkZW50aWFscyB9ICk7XHJcbm1peGluVmFsaWRhdGlvbiggTG9naW4gKTtcclxuIl19