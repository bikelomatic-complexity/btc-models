'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UserCollection = exports.User = undefined;

var _underscore = require('underscore');

var _underscore2 = _interopRequireDefault(_underscore);

var _validationMixin = require('./validation-mixin');

var _validationMixin2 = _interopRequireDefault(_validationMixin);

var _base = require('./base');

var _user = require('../schema/user.json');

var _user2 = _interopRequireDefault(_user);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// ## User
// We extend from `CouchModel` to ensure we don't mess with `_id` or `_rev`
// by default
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

var User = exports.User = _base.CouchModel.extend({

  // In the domain layer, we uniquely reference Users by their emails. When
  // models are serialized into Couch docs, the `_id` key will be set.
  idAttribute: 'email',

  // Reserved by documents in CouchDB's _users database
  safeguard: ['name', 'type', 'derived_key', 'iterations', 'password_scheme', 'salt'],

  // The majority of the time we are creating regular users, so we default
  // to an empty role set.
  defaults: {
    roles: [],
    verified: false
  },

  // Serialize the User object into a doc for CouchDB. CouchDB's special users
  // database has extra requirements.
  //  * `_id` must match `/org.couchdb.user:.*/`
  //  * `name` is equal to the portion after the colon
  //  * `type` must be `'user'`.
  toJSON: function toJSON(options) {
    return Object.assign({}, this.attributes, {
      _id: 'org.couchdb.user:' + this.attributes.email,
      name: this.attributes.email,
      type: 'user'
    });
  }
});

// Apply the ValidationMixin on the User schema
_underscore2.default.extend(User.prototype, (0, _validationMixin2.default)(_user2.default));

// ## User Collection
var UserCollection = exports.UserCollection = _base.CouchCollection.extend({
  model: User,

  // Configure BackbonePouch to query all docs, but only return user documents.
  // This ignores design documents.
  //
  // *Eventually we need to setup views to increase performance!*
  pouch: {
    options: {
      allDocs: {
        include_docs: true,
        startkey: 'org.couchdb.user:',
        endkey: 'org.couchdb.user:￿'
      }
    }
  },

  // Both the query and allDocs methods return an augmented data array.
  // We are interested only in the `doc` property for each array element.
  parse: function parse(response, options) {
    return (0, _underscore2.default)(response.rows).pluck('doc');
  }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tb2RlbC91c2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQTRCTyxJQUFNLHNCQUFPLGlCQUFXLE1BQVgsQ0FBbUI7Ozs7QUFJckMsZUFBYSxPQUFiOzs7QUFHQSxhQUFXLENBQ1QsTUFEUyxFQUVULE1BRlMsRUFHVCxhQUhTLEVBSVQsWUFKUyxFQUtULGlCQUxTLEVBTVQsTUFOUyxDQUFYOzs7O0FBV0EsWUFBVTtBQUNSLFdBQU8sRUFBUDtBQUNBLGNBQVUsS0FBVjtHQUZGOzs7Ozs7O0FBVUEsVUFBUSxnQkFBVSxPQUFWLEVBQW9CO0FBQzFCLFdBQU8sT0FBTyxNQUFQLENBQWUsRUFBZixFQUFtQixLQUFLLFVBQUwsRUFBaUI7QUFDekMsaUNBQXlCLEtBQUssVUFBTCxDQUFnQixLQUFoQjtBQUN6QixZQUFNLEtBQUssVUFBTCxDQUFnQixLQUFoQjtBQUNOLFlBQU0sTUFBTjtLQUhLLENBQVAsQ0FEMEI7R0FBcEI7Q0E1QlUsQ0FBUDs7O0FBc0NiLHFCQUFFLE1BQUYsQ0FBVSxLQUFLLFNBQUwsRUFBZ0IsOENBQTFCOzs7QUFHTyxJQUFNLDBDQUFpQixzQkFBZ0IsTUFBaEIsQ0FBd0I7QUFDcEQsU0FBTyxJQUFQOzs7Ozs7QUFNQSxTQUFPO0FBQ0wsYUFBUztBQUNQLGVBQVM7QUFDUCxzQkFBYyxJQUFkO0FBQ0Esa0JBQVUsbUJBQVY7QUFDQSxnQkFBUSxvQkFBUjtPQUhGO0tBREY7R0FERjs7OztBQVlBLFNBQU8sZUFBVSxRQUFWLEVBQW9CLE9BQXBCLEVBQThCO0FBQ25DLFdBQU8sMEJBQUcsU0FBUyxJQUFULENBQUgsQ0FBbUIsS0FBbkIsQ0FBMEIsS0FBMUIsQ0FBUCxDQURtQztHQUE5QjtDQW5CcUIsQ0FBakIiLCJmaWxlIjoidXNlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIGJ0Yy1hcHAtc2VydmVyIC0tIFNlcnZlciBmb3IgdGhlIEJpY3ljbGUgVG91cmluZyBDb21wYW5pb25cbiAqIENvcHlyaWdodCDCqSAyMDE2IEFkdmVudHVyZSBDeWNsaW5nIEFzc29jaWF0aW9uXG4gKlxuICogVGhpcyBmaWxlIGlzIHBhcnQgb2YgYnRjLWFwcC1zZXJ2ZXIuXG4gKlxuICogYnRjLWFwcC1zZXJ2ZXIgaXMgZnJlZSBzb2Z0d2FyZTogeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeVxuICogaXQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBBZmZlcm8gR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgYXMgcHVibGlzaGVkIGJ5XG4gKiB0aGUgRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uLCBlaXRoZXIgdmVyc2lvbiAzIG9mIHRoZSBMaWNlbnNlLCBvclxuICogKGF0IHlvdXIgb3B0aW9uKSBhbnkgbGF0ZXIgdmVyc2lvbi5cbiAqXG4gKiBidGMtYXBwLXNlcnZlciBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLFxuICogYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2ZcbiAqIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gIFNlZSB0aGVcbiAqIEFmZmVybyBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZSBkZXRhaWxzLlxuICpcbiAqIFlvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEFmZmVybyBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuICogYWxvbmcgd2l0aCBGb29iYXIuICBJZiBub3QsIHNlZSA8aHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG4gKi9cblxuaW1wb3J0IF8gZnJvbSAndW5kZXJzY29yZSc7XG5cbmltcG9ydCBWYWxpZGF0aW9uTWl4aW4gZnJvbSAnLi92YWxpZGF0aW9uLW1peGluJztcbmltcG9ydCB7IENvdWNoTW9kZWwsIENvdWNoQ29sbGVjdGlvbiB9IGZyb20gJy4vYmFzZSc7XG5pbXBvcnQgc2NoZW1hIGZyb20gJy4uL3NjaGVtYS91c2VyLmpzb24nO1xuXG4vLyAjIyBVc2VyXG4vLyBXZSBleHRlbmQgZnJvbSBgQ291Y2hNb2RlbGAgdG8gZW5zdXJlIHdlIGRvbid0IG1lc3Mgd2l0aCBgX2lkYCBvciBgX3JldmBcbi8vIGJ5IGRlZmF1bHRcbmV4cG9ydCBjb25zdCBVc2VyID0gQ291Y2hNb2RlbC5leHRlbmQoIHtcblxuICAvLyBJbiB0aGUgZG9tYWluIGxheWVyLCB3ZSB1bmlxdWVseSByZWZlcmVuY2UgVXNlcnMgYnkgdGhlaXIgZW1haWxzLiBXaGVuXG4gIC8vIG1vZGVscyBhcmUgc2VyaWFsaXplZCBpbnRvIENvdWNoIGRvY3MsIHRoZSBgX2lkYCBrZXkgd2lsbCBiZSBzZXQuXG4gIGlkQXR0cmlidXRlOiAnZW1haWwnLFxuXG4gIC8vIFJlc2VydmVkIGJ5IGRvY3VtZW50cyBpbiBDb3VjaERCJ3MgX3VzZXJzIGRhdGFiYXNlXG4gIHNhZmVndWFyZDogW1xuICAgICduYW1lJyxcbiAgICAndHlwZScsXG4gICAgJ2Rlcml2ZWRfa2V5JyxcbiAgICAnaXRlcmF0aW9ucycsXG4gICAgJ3Bhc3N3b3JkX3NjaGVtZScsXG4gICAgJ3NhbHQnXG4gIF0sXG5cbiAgLy8gVGhlIG1ham9yaXR5IG9mIHRoZSB0aW1lIHdlIGFyZSBjcmVhdGluZyByZWd1bGFyIHVzZXJzLCBzbyB3ZSBkZWZhdWx0XG4gIC8vIHRvIGFuIGVtcHR5IHJvbGUgc2V0LlxuICBkZWZhdWx0czoge1xuICAgIHJvbGVzOiBbXSxcbiAgICB2ZXJpZmllZDogZmFsc2VcbiAgfSxcblxuICAvLyBTZXJpYWxpemUgdGhlIFVzZXIgb2JqZWN0IGludG8gYSBkb2MgZm9yIENvdWNoREIuIENvdWNoREIncyBzcGVjaWFsIHVzZXJzXG4gIC8vIGRhdGFiYXNlIGhhcyBleHRyYSByZXF1aXJlbWVudHMuXG4gIC8vICAqIGBfaWRgIG11c3QgbWF0Y2ggYC9vcmcuY291Y2hkYi51c2VyOi4qL2BcbiAgLy8gICogYG5hbWVgIGlzIGVxdWFsIHRvIHRoZSBwb3J0aW9uIGFmdGVyIHRoZSBjb2xvblxuICAvLyAgKiBgdHlwZWAgbXVzdCBiZSBgJ3VzZXInYC5cbiAgdG9KU09OOiBmdW5jdGlvbiggb3B0aW9ucyApIHtcbiAgICByZXR1cm4gT2JqZWN0LmFzc2lnbigge30sIHRoaXMuYXR0cmlidXRlcywge1xuICAgICAgX2lkOiBgb3JnLmNvdWNoZGIudXNlcjoke3RoaXMuYXR0cmlidXRlcy5lbWFpbH1gLFxuICAgICAgbmFtZTogdGhpcy5hdHRyaWJ1dGVzLmVtYWlsLFxuICAgICAgdHlwZTogJ3VzZXInXG4gICAgfSApO1xuICB9XG59ICk7XG5cbi8vIEFwcGx5IHRoZSBWYWxpZGF0aW9uTWl4aW4gb24gdGhlIFVzZXIgc2NoZW1hXG5fLmV4dGVuZCggVXNlci5wcm90b3R5cGUsIFZhbGlkYXRpb25NaXhpbiggc2NoZW1hICkgKTtcblxuLy8gIyMgVXNlciBDb2xsZWN0aW9uXG5leHBvcnQgY29uc3QgVXNlckNvbGxlY3Rpb24gPSBDb3VjaENvbGxlY3Rpb24uZXh0ZW5kKCB7XG4gIG1vZGVsOiBVc2VyLFxuXG4gIC8vIENvbmZpZ3VyZSBCYWNrYm9uZVBvdWNoIHRvIHF1ZXJ5IGFsbCBkb2NzLCBidXQgb25seSByZXR1cm4gdXNlciBkb2N1bWVudHMuXG4gIC8vIFRoaXMgaWdub3JlcyBkZXNpZ24gZG9jdW1lbnRzLlxuICAvL1xuICAvLyAqRXZlbnR1YWxseSB3ZSBuZWVkIHRvIHNldHVwIHZpZXdzIHRvIGluY3JlYXNlIHBlcmZvcm1hbmNlISpcbiAgcG91Y2g6IHtcbiAgICBvcHRpb25zOiB7XG4gICAgICBhbGxEb2NzOiB7XG4gICAgICAgIGluY2x1ZGVfZG9jczogdHJ1ZSxcbiAgICAgICAgc3RhcnRrZXk6ICdvcmcuY291Y2hkYi51c2VyOicsXG4gICAgICAgIGVuZGtleTogJ29yZy5jb3VjaGRiLnVzZXI6XFx1ZmZmZidcbiAgICAgIH1cbiAgICB9XG4gIH0sXG5cbiAgLy8gQm90aCB0aGUgcXVlcnkgYW5kIGFsbERvY3MgbWV0aG9kcyByZXR1cm4gYW4gYXVnbWVudGVkIGRhdGEgYXJyYXkuXG4gIC8vIFdlIGFyZSBpbnRlcmVzdGVkIG9ubHkgaW4gdGhlIGBkb2NgIHByb3BlcnR5IGZvciBlYWNoIGFycmF5IGVsZW1lbnQuXG4gIHBhcnNlOiBmdW5jdGlvbiggcmVzcG9uc2UsIG9wdGlvbnMgKSB7XG4gICAgcmV0dXJuIF8oIHJlc3BvbnNlLnJvd3MgKS5wbHVjayggJ2RvYycgKTtcbiAgfVxufSApO1xuIl19