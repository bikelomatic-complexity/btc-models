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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tb2RlbC91c2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQTRCTyxJQUFNLElBQUksV0FBSixJQUFJLEdBQUcsaUJBQVcsTUFBTSxDQUFFOzs7O0FBSXJDLGFBQVcsRUFBRSxPQUFPOzs7QUFHcEIsV0FBUyxFQUFFLENBQ1QsTUFBTSxFQUNOLE1BQU0sRUFDTixhQUFhLEVBQ2IsWUFBWSxFQUNaLGlCQUFpQixFQUNqQixNQUFNLENBQ1A7Ozs7QUFJRCxVQUFRLEVBQUU7QUFDUixTQUFLLEVBQUUsRUFBRTtBQUNULFlBQVEsRUFBRSxLQUFLO0dBQ2hCOzs7Ozs7O0FBT0QsUUFBTSxFQUFFLGdCQUFVLE9BQU8sRUFBRztBQUMxQixXQUFPLE1BQU0sQ0FBQyxNQUFNLENBQUUsRUFBRSxFQUFFLElBQUksQ0FBQyxVQUFVLEVBQUU7QUFDekMsU0FBRyx3QkFBc0IsSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLEFBQUU7QUFDaEQsVUFBSSxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSztBQUMzQixVQUFJLEVBQUUsTUFBTTtLQUNiLENBQUUsQ0FBQztHQUNMO0NBQ0YsQ0FBRTs7O0FBQUMsQUFHSixxQkFBRSxNQUFNLENBQUUsSUFBSSxDQUFDLFNBQVMsRUFBRSw4Q0FBeUIsQ0FBRTs7O0FBQUMsQUFHL0MsSUFBTSxjQUFjLFdBQWQsY0FBYyxHQUFHLHNCQUFnQixNQUFNLENBQUU7QUFDcEQsT0FBSyxFQUFFLElBQUk7Ozs7OztBQU1YLE9BQUssRUFBRTtBQUNMLFdBQU8sRUFBRTtBQUNQLGFBQU8sRUFBRTtBQUNQLG9CQUFZLEVBQUUsSUFBSTtBQUNsQixnQkFBUSxFQUFFLG1CQUFtQjtBQUM3QixjQUFNLEVBQUUsb0JBQXlCO09BQ2xDO0tBQ0Y7R0FDRjs7OztBQUlELE9BQUssRUFBRSxlQUFVLFFBQVEsRUFBRSxPQUFPLEVBQUc7QUFDbkMsV0FBTywwQkFBRyxRQUFRLENBQUMsSUFBSSxDQUFFLENBQUMsS0FBSyxDQUFFLEtBQUssQ0FBRSxDQUFDO0dBQzFDO0NBQ0YsQ0FBRSxDQUFDIiwiZmlsZSI6InVzZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBidGMtYXBwLXNlcnZlciAtLSBTZXJ2ZXIgZm9yIHRoZSBCaWN5Y2xlIFRvdXJpbmcgQ29tcGFuaW9uXG4gKiBDb3B5cmlnaHQgwqkgMjAxNiBBZHZlbnR1cmUgQ3ljbGluZyBBc3NvY2lhdGlvblxuICpcbiAqIFRoaXMgZmlsZSBpcyBwYXJ0IG9mIGJ0Yy1hcHAtc2VydmVyLlxuICpcbiAqIGJ0Yy1hcHAtc2VydmVyIGlzIGZyZWUgc29mdHdhcmU6IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnlcbiAqIGl0IHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgQWZmZXJvIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGFzIHB1Ymxpc2hlZCBieVxuICogdGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiwgZWl0aGVyIHZlcnNpb24gMyBvZiB0aGUgTGljZW5zZSwgb3JcbiAqIChhdCB5b3VyIG9wdGlvbikgYW55IGxhdGVyIHZlcnNpb24uXG4gKlxuICogYnRjLWFwcC1zZXJ2ZXIgaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCxcbiAqIGJ1dCBXSVRIT1VUIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mXG4gKiBNRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuICBTZWUgdGhlXG4gKiBBZmZlcm8gR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmUgZGV0YWlscy5cbiAqXG4gKiBZb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBBZmZlcm8gR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbiAqIGFsb25nIHdpdGggRm9vYmFyLiAgSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuICovXG5cbmltcG9ydCBfIGZyb20gJ3VuZGVyc2NvcmUnO1xuXG5pbXBvcnQgVmFsaWRhdGlvbk1peGluIGZyb20gJy4vdmFsaWRhdGlvbi1taXhpbic7XG5pbXBvcnQgeyBDb3VjaE1vZGVsLCBDb3VjaENvbGxlY3Rpb24gfSBmcm9tICcuL2Jhc2UnO1xuaW1wb3J0IHNjaGVtYSBmcm9tICcuLi9zY2hlbWEvdXNlci5qc29uJztcblxuLy8gIyMgVXNlclxuLy8gV2UgZXh0ZW5kIGZyb20gYENvdWNoTW9kZWxgIHRvIGVuc3VyZSB3ZSBkb24ndCBtZXNzIHdpdGggYF9pZGAgb3IgYF9yZXZgXG4vLyBieSBkZWZhdWx0XG5leHBvcnQgY29uc3QgVXNlciA9IENvdWNoTW9kZWwuZXh0ZW5kKCB7XG5cbiAgLy8gSW4gdGhlIGRvbWFpbiBsYXllciwgd2UgdW5pcXVlbHkgcmVmZXJlbmNlIFVzZXJzIGJ5IHRoZWlyIGVtYWlscy4gV2hlblxuICAvLyBtb2RlbHMgYXJlIHNlcmlhbGl6ZWQgaW50byBDb3VjaCBkb2NzLCB0aGUgYF9pZGAga2V5IHdpbGwgYmUgc2V0LlxuICBpZEF0dHJpYnV0ZTogJ2VtYWlsJyxcblxuICAvLyBSZXNlcnZlZCBieSBkb2N1bWVudHMgaW4gQ291Y2hEQidzIF91c2VycyBkYXRhYmFzZVxuICBzYWZlZ3VhcmQ6IFtcbiAgICAnbmFtZScsXG4gICAgJ3R5cGUnLFxuICAgICdkZXJpdmVkX2tleScsXG4gICAgJ2l0ZXJhdGlvbnMnLFxuICAgICdwYXNzd29yZF9zY2hlbWUnLFxuICAgICdzYWx0J1xuICBdLFxuXG4gIC8vIFRoZSBtYWpvcml0eSBvZiB0aGUgdGltZSB3ZSBhcmUgY3JlYXRpbmcgcmVndWxhciB1c2Vycywgc28gd2UgZGVmYXVsdFxuICAvLyB0byBhbiBlbXB0eSByb2xlIHNldC5cbiAgZGVmYXVsdHM6IHtcbiAgICByb2xlczogW10sXG4gICAgdmVyaWZpZWQ6IGZhbHNlXG4gIH0sXG5cbiAgLy8gU2VyaWFsaXplIHRoZSBVc2VyIG9iamVjdCBpbnRvIGEgZG9jIGZvciBDb3VjaERCLiBDb3VjaERCJ3Mgc3BlY2lhbCB1c2Vyc1xuICAvLyBkYXRhYmFzZSBoYXMgZXh0cmEgcmVxdWlyZW1lbnRzLlxuICAvLyAgKiBgX2lkYCBtdXN0IG1hdGNoIGAvb3JnLmNvdWNoZGIudXNlcjouKi9gXG4gIC8vICAqIGBuYW1lYCBpcyBlcXVhbCB0byB0aGUgcG9ydGlvbiBhZnRlciB0aGUgY29sb25cbiAgLy8gICogYHR5cGVgIG11c3QgYmUgYCd1c2VyJ2AuXG4gIHRvSlNPTjogZnVuY3Rpb24oIG9wdGlvbnMgKSB7XG4gICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oIHt9LCB0aGlzLmF0dHJpYnV0ZXMsIHtcbiAgICAgIF9pZDogYG9yZy5jb3VjaGRiLnVzZXI6JHt0aGlzLmF0dHJpYnV0ZXMuZW1haWx9YCxcbiAgICAgIG5hbWU6IHRoaXMuYXR0cmlidXRlcy5lbWFpbCxcbiAgICAgIHR5cGU6ICd1c2VyJ1xuICAgIH0gKTtcbiAgfVxufSApO1xuXG4vLyBBcHBseSB0aGUgVmFsaWRhdGlvbk1peGluIG9uIHRoZSBVc2VyIHNjaGVtYVxuXy5leHRlbmQoIFVzZXIucHJvdG90eXBlLCBWYWxpZGF0aW9uTWl4aW4oIHNjaGVtYSApICk7XG5cbi8vICMjIFVzZXIgQ29sbGVjdGlvblxuZXhwb3J0IGNvbnN0IFVzZXJDb2xsZWN0aW9uID0gQ291Y2hDb2xsZWN0aW9uLmV4dGVuZCgge1xuICBtb2RlbDogVXNlcixcblxuICAvLyBDb25maWd1cmUgQmFja2JvbmVQb3VjaCB0byBxdWVyeSBhbGwgZG9jcywgYnV0IG9ubHkgcmV0dXJuIHVzZXIgZG9jdW1lbnRzLlxuICAvLyBUaGlzIGlnbm9yZXMgZGVzaWduIGRvY3VtZW50cy5cbiAgLy9cbiAgLy8gKkV2ZW50dWFsbHkgd2UgbmVlZCB0byBzZXR1cCB2aWV3cyB0byBpbmNyZWFzZSBwZXJmb3JtYW5jZSEqXG4gIHBvdWNoOiB7XG4gICAgb3B0aW9uczoge1xuICAgICAgYWxsRG9jczoge1xuICAgICAgICBpbmNsdWRlX2RvY3M6IHRydWUsXG4gICAgICAgIHN0YXJ0a2V5OiAnb3JnLmNvdWNoZGIudXNlcjonLFxuICAgICAgICBlbmRrZXk6ICdvcmcuY291Y2hkYi51c2VyOlxcdWZmZmYnXG4gICAgICB9XG4gICAgfVxuICB9LFxuXG4gIC8vIEJvdGggdGhlIHF1ZXJ5IGFuZCBhbGxEb2NzIG1ldGhvZHMgcmV0dXJuIGFuIGF1Z21lbnRlZCBkYXRhIGFycmF5LlxuICAvLyBXZSBhcmUgaW50ZXJlc3RlZCBvbmx5IGluIHRoZSBgZG9jYCBwcm9wZXJ0eSBmb3IgZWFjaCBhcnJheSBlbGVtZW50LlxuICBwYXJzZTogZnVuY3Rpb24oIHJlc3BvbnNlLCBvcHRpb25zICkge1xuICAgIHJldHVybiBfKCByZXNwb25zZS5yb3dzICkucGx1Y2soICdkb2MnICk7XG4gIH1cbn0gKTtcbiJdfQ==