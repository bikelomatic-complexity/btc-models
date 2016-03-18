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
  var ajv = (0, _ajv2.default)({ allErrors: true });

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tb2RlbC92YWxpZGF0aW9uLW1peGluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O1FBMEJnQixlQUFlLEdBQWYsZUFBZTtRQTRCZixlQUFlLEdBQWYsZUFBZTs7Ozs7Ozs7Ozs7Ozs7O0FBNUJ4QixTQUFTLGVBQWUsQ0FBRSxNQUFNLEVBQUc7Ozs7QUFJeEMsTUFBTSxHQUFHLEdBQUcsbUJBQUssRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLENBQUUsQ0FBQzs7QUFFdkMsU0FBTztBQUNMLFlBQVEsRUFBRSxrQkFBVSxVQUFVLEVBQUUsT0FBTyxFQUFHOzs7QUFHeEMsVUFBSSxLQUFLLFlBQUEsQ0FBQztBQUNWLFVBQUssSUFBSSxDQUFDLFNBQVMsRUFBRztBQUNwQixhQUFLLEdBQUcsc0JBQU0sVUFBVSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUUsQ0FBQztPQUM1QyxNQUFNO0FBQ0wsYUFBSyxHQUFHLFVBQVUsQ0FBQztPQUNwQjs7O0FBQUEsQUFHRCxVQUFNLEtBQUssR0FBRyxHQUFHLENBQUMsUUFBUSxDQUFFLE1BQU0sRUFBRSxLQUFLLENBQUUsQ0FBQztBQUM1QyxVQUFLLENBQUMsS0FBSyxFQUFHO0FBQ1osZUFBTyxHQUFHLENBQUMsTUFBTSxDQUFDO09BQ25CO0tBQ0Y7R0FDRixDQUFDO0NBQ0g7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxrQkFFYyxlQUFlO0FBRXZCLFNBQVMsZUFBZSxDQUFFLGVBQWUsRUFBRztBQUNqRCxNQUFNLEtBQUssR0FBRyxlQUFlLENBQUUsZUFBZSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUUsQ0FBQztBQUNsRSxzQkFBUSxlQUFlLENBQUMsU0FBUyxFQUFFLEtBQUssQ0FBRSxDQUFDO0NBQzVDIiwiZmlsZSI6InZhbGlkYXRpb24tbWl4aW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBidGMtYXBwLXNlcnZlciAtLSBTZXJ2ZXIgZm9yIHRoZSBCaWN5Y2xlIFRvdXJpbmcgQ29tcGFuaW9uXG4gKiBDb3B5cmlnaHQgwqkgMjAxNiBBZHZlbnR1cmUgQ3ljbGluZyBBc3NvY2lhdGlvblxuICpcbiAqIFRoaXMgZmlsZSBpcyBwYXJ0IG9mIGJ0Yy1hcHAtc2VydmVyLlxuICpcbiAqIGJ0Yy1hcHAtc2VydmVyIGlzIGZyZWUgc29mdHdhcmU6IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnlcbiAqIGl0IHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgQWZmZXJvIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGFzIHB1Ymxpc2hlZCBieVxuICogdGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiwgZWl0aGVyIHZlcnNpb24gMyBvZiB0aGUgTGljZW5zZSwgb3JcbiAqIChhdCB5b3VyIG9wdGlvbikgYW55IGxhdGVyIHZlcnNpb24uXG4gKlxuICogYnRjLWFwcC1zZXJ2ZXIgaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCxcbiAqIGJ1dCBXSVRIT1VUIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mXG4gKiBNRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuICBTZWUgdGhlXG4gKiBBZmZlcm8gR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmUgZGV0YWlscy5cbiAqXG4gKiBZb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBBZmZlcm8gR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbiAqIGFsb25nIHdpdGggRm9vYmFyLiAgSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuICovXG5cbmltcG9ydCBBanYgZnJvbSAnYWp2JztcbmltcG9ydCB7IG9taXQgfSBmcm9tICd1bmRlcnNjb3JlJztcbmltcG9ydCB7IGFzc2lnbiB9IGZyb20gJ2xvZGFzaCc7XG5cbi8vICMgVmFsaWRhdGlvbiBNaXhpbiBGYWN0b3J5XG4vLyBBIGZ1bmN0aW9uIHRvIGdlbmVyYXRlIGEgbWl4aW4gdGhhdCBtYXkgYmUgYXBwbGllZCB0byBhIEJhY2tib25lIE1vZGVsLlxuLy8gVG8gZ2VuZXJhdGUgdGhlIG1peGluLCB5b3UgbXVzdCBzdXBwbHkgYSBjb25mb3JtYW50IEpTT04gc2NoZW1hIGFzIEpTT04uXG5leHBvcnQgZnVuY3Rpb24gVmFsaWRhdGlvbk1peGluKCBzY2hlbWEgKSB7XG5cbiAgLy8gSW5zdGFudGlhdGUgYSBuZXcgc2NoZW1hIGNvbXBpbGVyIHBlciBtaXhpbi4gSXQgd2lsbCBiZSBjbG9zZWQgb3ZlciBieVxuICAvLyB0aGUgdmFsaWRhdGUgZnVuY3Rpb24gaW4gdGhlIG1peGluLlxuICBjb25zdCBhanYgPSBBanYoIHsgYWxsRXJyb3JzOiB0cnVlIH0gKTtcblxuICByZXR1cm4ge1xuICAgIHZhbGlkYXRlOiBmdW5jdGlvbiggYXR0cmlidXRlcywgb3B0aW9ucyApIHtcblxuICAgICAgLy8gRG9uJ3QgdmFsaWRhdGUgc2FmZWd1YXJkZWQga2V5cywgaWYgYW55IVxuICAgICAgbGV0IGF0dHJzO1xuICAgICAgaWYgKCB0aGlzLnNhZmVndWFyZCApIHtcbiAgICAgICAgYXR0cnMgPSBvbWl0KCBhdHRyaWJ1dGVzLCB0aGlzLnNhZmVndWFyZCApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYXR0cnMgPSBhdHRyaWJ1dGVzO1xuICAgICAgfVxuXG4gICAgICAvLyBJbnZlc3RpZ2F0ZSBmaWx0ZXJpbmcgc2FmZWd1YXJkZWQga2V5cy5cbiAgICAgIGNvbnN0IHZhbGlkID0gYWp2LnZhbGlkYXRlKCBzY2hlbWEsIGF0dHJzICk7XG4gICAgICBpZiAoICF2YWxpZCApIHtcbiAgICAgICAgcmV0dXJuIGFqdi5lcnJvcnM7XG4gICAgICB9XG4gICAgfVxuICB9O1xufVxuXG5leHBvcnQgZGVmYXVsdCBWYWxpZGF0aW9uTWl4aW47XG5cbmV4cG9ydCBmdW5jdGlvbiBtaXhpblZhbGlkYXRpb24oIG1vZGVsV2l0aFNjaGVtYSApIHtcbiAgY29uc3QgbWl4aW4gPSBWYWxpZGF0aW9uTWl4aW4oIG1vZGVsV2l0aFNjaGVtYS5wcm90b3R5cGUuc2NoZW1hICk7XG4gIGFzc2lnbiggbW9kZWxXaXRoU2NoZW1hLnByb3RvdHlwZSwgbWl4aW4gKTtcbn1cbiJdfQ==