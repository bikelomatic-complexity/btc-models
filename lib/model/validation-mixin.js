'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ValidationMixin = ValidationMixin;
exports.mixinValidation = mixinValidation;

var _ajv = require('ajv');

var _ajv2 = _interopRequireDefault(_ajv);

var _underscore = require('underscore');

var _lodash = require('lodash');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// # Validation Mixin Factory
// A function to generate a mixin that may be applied to a Backbone Model.
// To generate the mixin, you must supply a conformant JSON schema as JSON.
function ValidationMixin(schema) {

  // Instantiate a new schema compiler per mixin. It will be closed over by
  // the validate function in the mixin.
  var ajv = (0, _ajv2.default)({ allErrors: true, useDefaults: true });

  return {
    validate: function validate(attributes, options) {
      // Don't validate safeguarded keys, if any!
      var attrs = undefined;
      if (this.safeguard) {
        attrs = (0, _underscore.omit)(attributes, this.safeguard);
      } else {
        attrs = attributes;
      }

      // Investigate filtering safeguarded keys.
      var valid = ajv.validate(schema, attrs);
      if (!valid) {
        return ajv.errors;
      }
    }
  };
} /* btc-app-server -- Server for the Bicycle Touring Companion
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

exports.default = ValidationMixin;
function mixinValidation(modelWithSchema) {
  var mixin = ValidationMixin(modelWithSchema.prototype.schema);
  (0, _lodash.assign)(modelWithSchema.prototype, mixin);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tb2RlbC92YWxpZGF0aW9uLW1peGluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O1FBMEJnQixlQUFlLEdBQWYsZUFBZTtRQTJCZixlQUFlLEdBQWYsZUFBZTs7Ozs7Ozs7Ozs7Ozs7O0FBM0J4QixTQUFTLGVBQWUsQ0FBRSxNQUFNLEVBQUc7Ozs7QUFJeEMsTUFBTSxHQUFHLEdBQUcsbUJBQUssRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRSxJQUFJLEVBQUUsQ0FBRSxDQUFDOztBQUUxRCxTQUFPO0FBQ0wsWUFBUSxFQUFFLGtCQUFVLFVBQVUsRUFBRSxPQUFPLEVBQUc7O0FBRXhDLFVBQUksS0FBSyxZQUFBLENBQUM7QUFDVixVQUFLLElBQUksQ0FBQyxTQUFTLEVBQUc7QUFDcEIsYUFBSyxHQUFHLHNCQUFNLFVBQVUsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFFLENBQUM7T0FDNUMsTUFBTTtBQUNMLGFBQUssR0FBRyxVQUFVLENBQUM7T0FDcEI7OztBQUFBLEFBR0QsVUFBTSxLQUFLLEdBQUcsR0FBRyxDQUFDLFFBQVEsQ0FBRSxNQUFNLEVBQUUsS0FBSyxDQUFFLENBQUM7QUFDNUMsVUFBSyxDQUFDLEtBQUssRUFBRztBQUNaLGVBQU8sR0FBRyxDQUFDLE1BQU0sQ0FBQztPQUNuQjtLQUNGO0dBQ0YsQ0FBQztDQUNIOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsa0JBRWMsZUFBZTtBQUV2QixTQUFTLGVBQWUsQ0FBRSxlQUFlLEVBQUc7QUFDakQsTUFBTSxLQUFLLEdBQUcsZUFBZSxDQUFFLGVBQWUsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFFLENBQUM7QUFDbEUsc0JBQVEsZUFBZSxDQUFDLFNBQVMsRUFBRSxLQUFLLENBQUUsQ0FBQztDQUM1QyIsImZpbGUiOiJ2YWxpZGF0aW9uLW1peGluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogYnRjLWFwcC1zZXJ2ZXIgLS0gU2VydmVyIGZvciB0aGUgQmljeWNsZSBUb3VyaW5nIENvbXBhbmlvblxuICogQ29weXJpZ2h0IMKpIDIwMTYgQWR2ZW50dXJlIEN5Y2xpbmcgQXNzb2NpYXRpb25cbiAqXG4gKiBUaGlzIGZpbGUgaXMgcGFydCBvZiBidGMtYXBwLXNlcnZlci5cbiAqXG4gKiBidGMtYXBwLXNlcnZlciBpcyBmcmVlIHNvZnR3YXJlOiB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5XG4gKiBpdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEFmZmVybyBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBhcyBwdWJsaXNoZWQgYnlcbiAqIHRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24sIGVpdGhlciB2ZXJzaW9uIDMgb2YgdGhlIExpY2Vuc2UsIG9yXG4gKiAoYXQgeW91ciBvcHRpb24pIGFueSBsYXRlciB2ZXJzaW9uLlxuICpcbiAqIGJ0Yy1hcHAtc2VydmVyIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXG4gKiBidXQgV0lUSE9VVCBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZlxuICogTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiAgU2VlIHRoZVxuICogQWZmZXJvIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXG4gKlxuICogWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgQWZmZXJvIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4gKiBhbG9uZyB3aXRoIEZvb2Jhci4gIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cbiAqL1xuXG5pbXBvcnQgQWp2IGZyb20gJ2Fqdic7XG5pbXBvcnQgeyBvbWl0IH0gZnJvbSAndW5kZXJzY29yZSc7XG5pbXBvcnQgeyBhc3NpZ24gfSBmcm9tICdsb2Rhc2gnO1xuXG4vLyAjIFZhbGlkYXRpb24gTWl4aW4gRmFjdG9yeVxuLy8gQSBmdW5jdGlvbiB0byBnZW5lcmF0ZSBhIG1peGluIHRoYXQgbWF5IGJlIGFwcGxpZWQgdG8gYSBCYWNrYm9uZSBNb2RlbC5cbi8vIFRvIGdlbmVyYXRlIHRoZSBtaXhpbiwgeW91IG11c3Qgc3VwcGx5IGEgY29uZm9ybWFudCBKU09OIHNjaGVtYSBhcyBKU09OLlxuZXhwb3J0IGZ1bmN0aW9uIFZhbGlkYXRpb25NaXhpbiggc2NoZW1hICkge1xuXG4gIC8vIEluc3RhbnRpYXRlIGEgbmV3IHNjaGVtYSBjb21waWxlciBwZXIgbWl4aW4uIEl0IHdpbGwgYmUgY2xvc2VkIG92ZXIgYnlcbiAgLy8gdGhlIHZhbGlkYXRlIGZ1bmN0aW9uIGluIHRoZSBtaXhpbi5cbiAgY29uc3QgYWp2ID0gQWp2KCB7IGFsbEVycm9yczogdHJ1ZSwgdXNlRGVmYXVsdHM6IHRydWUgfSApO1xuXG4gIHJldHVybiB7XG4gICAgdmFsaWRhdGU6IGZ1bmN0aW9uKCBhdHRyaWJ1dGVzLCBvcHRpb25zICkge1xuICAgICAgLy8gRG9uJ3QgdmFsaWRhdGUgc2FmZWd1YXJkZWQga2V5cywgaWYgYW55IVxuICAgICAgbGV0IGF0dHJzO1xuICAgICAgaWYgKCB0aGlzLnNhZmVndWFyZCApIHtcbiAgICAgICAgYXR0cnMgPSBvbWl0KCBhdHRyaWJ1dGVzLCB0aGlzLnNhZmVndWFyZCApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYXR0cnMgPSBhdHRyaWJ1dGVzO1xuICAgICAgfVxuXG4gICAgICAvLyBJbnZlc3RpZ2F0ZSBmaWx0ZXJpbmcgc2FmZWd1YXJkZWQga2V5cy5cbiAgICAgIGNvbnN0IHZhbGlkID0gYWp2LnZhbGlkYXRlKCBzY2hlbWEsIGF0dHJzICk7XG4gICAgICBpZiAoICF2YWxpZCApIHtcbiAgICAgICAgcmV0dXJuIGFqdi5lcnJvcnM7XG4gICAgICB9XG4gICAgfVxuICB9O1xufVxuXG5leHBvcnQgZGVmYXVsdCBWYWxpZGF0aW9uTWl4aW47XG5cbmV4cG9ydCBmdW5jdGlvbiBtaXhpblZhbGlkYXRpb24oIG1vZGVsV2l0aFNjaGVtYSApIHtcbiAgY29uc3QgbWl4aW4gPSBWYWxpZGF0aW9uTWl4aW4oIG1vZGVsV2l0aFNjaGVtYS5wcm90b3R5cGUuc2NoZW1hICk7XG4gIGFzc2lnbiggbW9kZWxXaXRoU2NoZW1hLnByb3RvdHlwZSwgbWl4aW4gKTtcbn1cbiJdfQ==