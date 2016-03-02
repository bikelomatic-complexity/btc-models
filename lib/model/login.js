'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Login = undefined;

var _backbone = require('backbone');

var _underscore = require('underscore');

var _underscore2 = _interopRequireDefault(_underscore);

var _validationMixin = require('./validation-mixin');

var _validationMixin2 = _interopRequireDefault(_validationMixin);

var _login = require('../schema/login.json');

var _login2 = _interopRequireDefault(_login);

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

var Login = exports.Login = _backbone.Model.extend();

_underscore2.default.extend(Login.prototype, (0, _validationMixin2.default)(_login2.default));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tb2RlbC9sb2dpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUE0Qk8sSUFBTSx3QkFBUSxnQkFBTSxNQUFOLEVBQVI7O0FBRWIscUJBQUUsTUFBRixDQUFVLE1BQU0sU0FBTixFQUFpQiwrQ0FBM0IiLCJmaWxlIjoibG9naW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBidGMtYXBwLXNlcnZlciAtLSBTZXJ2ZXIgZm9yIHRoZSBCaWN5Y2xlIFRvdXJpbmcgQ29tcGFuaW9uXG4gKiBDb3B5cmlnaHQgwqkgMjAxNiBBZHZlbnR1cmUgQ3ljbGluZyBBc3NvY2lhdGlvblxuICpcbiAqIFRoaXMgZmlsZSBpcyBwYXJ0IG9mIGJ0Yy1hcHAtc2VydmVyLlxuICpcbiAqIGJ0Yy1hcHAtc2VydmVyIGlzIGZyZWUgc29mdHdhcmU6IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnlcbiAqIGl0IHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgQWZmZXJvIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGFzIHB1Ymxpc2hlZCBieVxuICogdGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiwgZWl0aGVyIHZlcnNpb24gMyBvZiB0aGUgTGljZW5zZSwgb3JcbiAqIChhdCB5b3VyIG9wdGlvbikgYW55IGxhdGVyIHZlcnNpb24uXG4gKlxuICogYnRjLWFwcC1zZXJ2ZXIgaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCxcbiAqIGJ1dCBXSVRIT1VUIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mXG4gKiBNRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuICBTZWUgdGhlXG4gKiBBZmZlcm8gR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmUgZGV0YWlscy5cbiAqXG4gKiBZb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBBZmZlcm8gR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbiAqIGFsb25nIHdpdGggRm9vYmFyLiAgSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuICovXG5cbmltcG9ydCB7IE1vZGVsIH0gZnJvbSAnYmFja2JvbmUnO1xuaW1wb3J0IF8gZnJvbSAndW5kZXJzY29yZSc7XG5cbmltcG9ydCBWYWxpZGF0aW9uTWl4aW4gZnJvbSAnLi92YWxpZGF0aW9uLW1peGluJztcbmltcG9ydCBzY2hlbWEgZnJvbSAnLi4vc2NoZW1hL2xvZ2luLmpzb24nO1xuXG4vLyAjIyBVc2VyXG4vLyBXZSBleHRlbmQgZnJvbSBgQ291Y2hNb2RlbGAgdG8gZW5zdXJlIHdlIGRvbid0IG1lc3Mgd2l0aCBgX2lkYCBvciBgX3JldmBcbi8vIGJ5IGRlZmF1bHRcbmV4cG9ydCBjb25zdCBMb2dpbiA9IE1vZGVsLmV4dGVuZCgpO1xuXG5fLmV4dGVuZCggTG9naW4ucHJvdG90eXBlLCBWYWxpZGF0aW9uTWl4aW4oIHNjaGVtYSApICk7XG4iXX0=