'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PromiseCollection = exports.PromiseModel = undefined;

var _backbone = require('backbone');

var _lodash = require('lodash');

function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

// # Backbone Promises
// This file provides Model and Collection base classes that override
// backbone's callback api with a promise based api. We override save, destroy,
// and fetch. But we cannot override Collection.create. That method does not
// accept success and error callbacks anyways.

// ## Bakcbone Callback Factory
// This function takes either Promise.resolve or Promise.reject, and returns
// a new function that will call Promise.resolve or Promise.reject with the
// appropriate resolved object. The resolved object either has a
// collection key or a model key depending on the returned entity type.
var callback = function callback(finalize) {
  return function (entity, response, options) {
    if (entity instanceof _backbone.Collection) {
      finalize({ collection: entity, response: response, options: options });
    } else {
      finalize({ model: entity, response: response, options: options });
    }
  };
};

// ## Promise Factory
// This function returns a promise that adapts backbone's success and error
// callbacks to Promise's reject and resolve methods. However, if the client
// passes in success and error callbacks themselves, they expect to use
// the default callback api.
var promise = function promise(context, method, options, args) {
  var base = context instanceof _backbone.Collection ? _backbone.Collection : _backbone.Model;
  var func = base.prototype[method];
  if (options.success || options.error) {
    return func.apply(context, args);
  } else {
    return new Promise(function (resolve, reject) {
      (0, _lodash.assign)(options, {
        success: callback(resolve),
        error: callback(reject)
      });
      func.apply(context, args);
    });
  }
};

// # Promise Model
// Overrides Model's save, destroy, and fetch functions with versions that
// return promises.
var PromiseModel = exports.PromiseModel = _backbone.Model.extend({
  save: function save(key, val, options) {
    var opts = undefined,
        args = undefined;
    if (key == null || (typeof key === 'undefined' ? 'undefined' : _typeof(key)) === 'object') {
      opts = val || {};
      args = [key, opts];
    } else {
      opts = options || {};
      args = [key, val, opts];
    }

    return promise(this, 'save', opts, args);
  },

  destroy: function destroy() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    return promise(this, 'destroy', options, [options]);
  },

  fetch: function fetch() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    return promise(this, 'fetch', options, [options]);
  }
});

// # PromiseCollection
// Overrides Collection's fetch function with a version that returns a promise.
var PromiseCollection = exports.PromiseCollection = _backbone.Collection.extend({
  fetch: function fetch() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    return promise(this, 'fetch', options, [options]);
  }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tb2RlbC9wcm9taXNlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWNBLElBQU0sUUFBUSxHQUFHLFNBQVgsUUFBUSxDQUFHLFFBQVE7U0FBSSxVQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUUsT0FBTyxFQUFNO0FBQzVELFFBQUssTUFBTSxnQ0FBc0IsRUFBRztBQUNsQyxjQUFRLENBQUUsRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBUixRQUFRLEVBQUUsT0FBTyxFQUFQLE9BQU8sRUFBRSxDQUFFLENBQUM7S0FDdkQsTUFBTTtBQUNMLGNBQVEsQ0FBRSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFSLFFBQVEsRUFBRSxPQUFPLEVBQVAsT0FBTyxFQUFFLENBQUUsQ0FBQztLQUNsRDtHQUNGO0NBQUE7Ozs7Ozs7QUFBQyxBQU9GLElBQU0sT0FBTyxHQUFHLFNBQVYsT0FBTyxDQUFLLE9BQU8sRUFBRSxNQUFNLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBTTtBQUNwRCxNQUFNLElBQUksR0FBRyxPQUFPLGdDQUFzQix5Q0FBcUIsQ0FBQztBQUNoRSxNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFFLE1BQU0sQ0FBRSxDQUFDO0FBQ3RDLE1BQUssT0FBTyxDQUFDLE9BQU8sSUFBSSxPQUFPLENBQUMsS0FBSyxFQUFHO0FBQ3RDLFdBQU8sSUFBSSxDQUFDLEtBQUssQ0FBRSxPQUFPLEVBQUUsSUFBSSxDQUFFLENBQUM7R0FDcEMsTUFBTTtBQUNMLFdBQU8sSUFBSSxPQUFPLENBQUUsVUFBRSxPQUFPLEVBQUUsTUFBTSxFQUFNO0FBQ3pDLDBCQUFRLE9BQU8sRUFBRTtBQUNmLGVBQU8sRUFBRSxRQUFRLENBQUUsT0FBTyxDQUFFO0FBQzVCLGFBQUssRUFBRSxRQUFRLENBQUUsTUFBTSxDQUFFO09BQzFCLENBQUUsQ0FBQztBQUNKLFVBQUksQ0FBQyxLQUFLLENBQUUsT0FBTyxFQUFFLElBQUksQ0FBRSxDQUFDO0tBQzdCLENBQUUsQ0FBQztHQUNMO0NBQ0Y7Ozs7O0FBQUMsQUFLSyxJQUFNLFlBQVksV0FBWixZQUFZLEdBQUcsZ0JBQU0sTUFBTSxDQUFFO0FBQ3hDLE1BQUksRUFBRSxjQUFVLEdBQUcsRUFBRSxHQUFHLEVBQUUsT0FBTyxFQUFHO0FBQ2xDLFFBQUksSUFBSSxZQUFBO1FBQUUsSUFBSSxZQUFBLENBQUM7QUFDZixRQUFLLEdBQUcsSUFBSSxJQUFJLElBQUksUUFBTyxHQUFHLHlDQUFILEdBQUcsT0FBSyxRQUFRLEVBQUc7QUFDNUMsVUFBSSxHQUFHLEdBQUcsSUFBSSxFQUFFLENBQUM7QUFDakIsVUFBSSxHQUFHLENBQUUsR0FBRyxFQUFFLElBQUksQ0FBRSxDQUFDO0tBQ3RCLE1BQU07QUFDTCxVQUFJLEdBQUcsT0FBTyxJQUFJLEVBQUUsQ0FBQztBQUNyQixVQUFJLEdBQUcsQ0FBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLElBQUksQ0FBRSxDQUFDO0tBQzNCOztBQUVELFdBQU8sT0FBTyxDQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBRSxDQUFDO0dBQzVDOztBQUVELFNBQU8sRUFBRSxtQkFBeUI7UUFBZixPQUFPLHlEQUFHLEVBQUU7O0FBQzdCLFdBQU8sT0FBTyxDQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsT0FBTyxFQUFFLENBQUUsT0FBTyxDQUFFLENBQUUsQ0FBQztHQUN6RDs7QUFFRCxPQUFLLEVBQUUsaUJBQXlCO1FBQWYsT0FBTyx5REFBRyxFQUFFOztBQUMzQixXQUFPLE9BQU8sQ0FBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRSxDQUFFLE9BQU8sQ0FBRSxDQUFFLENBQUM7R0FDdkQ7Q0FDRixDQUFFOzs7O0FBQUMsQUFJRyxJQUFNLGlCQUFpQixXQUFqQixpQkFBaUIsR0FBRyxxQkFBVyxNQUFNLENBQUU7QUFDbEQsT0FBSyxFQUFFLGlCQUF5QjtRQUFmLE9BQU8seURBQUcsRUFBRTs7QUFDM0IsV0FBTyxPQUFPLENBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUUsQ0FBRSxPQUFPLENBQUUsQ0FBRSxDQUFDO0dBQ3ZEO0NBQ0YsQ0FBRSxDQUFDIiwiZmlsZSI6InByb21pc2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBNb2RlbCwgQ29sbGVjdGlvbiB9IGZyb20gJ2JhY2tib25lJztcbmltcG9ydCB7IGFzc2lnbiB9IGZyb20gJ2xvZGFzaCc7XG5cbi8vICMgQmFja2JvbmUgUHJvbWlzZXNcbi8vIFRoaXMgZmlsZSBwcm92aWRlcyBNb2RlbCBhbmQgQ29sbGVjdGlvbiBiYXNlIGNsYXNzZXMgdGhhdCBvdmVycmlkZVxuLy8gYmFja2JvbmUncyBjYWxsYmFjayBhcGkgd2l0aCBhIHByb21pc2UgYmFzZWQgYXBpLiBXZSBvdmVycmlkZSBzYXZlLCBkZXN0cm95LFxuLy8gYW5kIGZldGNoLiBCdXQgd2UgY2Fubm90IG92ZXJyaWRlIENvbGxlY3Rpb24uY3JlYXRlLiBUaGF0IG1ldGhvZCBkb2VzIG5vdFxuLy8gYWNjZXB0IHN1Y2Nlc3MgYW5kIGVycm9yIGNhbGxiYWNrcyBhbnl3YXlzLlxuXG4vLyAjIyBCYWtjYm9uZSBDYWxsYmFjayBGYWN0b3J5XG4vLyBUaGlzIGZ1bmN0aW9uIHRha2VzIGVpdGhlciBQcm9taXNlLnJlc29sdmUgb3IgUHJvbWlzZS5yZWplY3QsIGFuZCByZXR1cm5zXG4vLyBhIG5ldyBmdW5jdGlvbiB0aGF0IHdpbGwgY2FsbCBQcm9taXNlLnJlc29sdmUgb3IgUHJvbWlzZS5yZWplY3Qgd2l0aCB0aGVcbi8vIGFwcHJvcHJpYXRlIHJlc29sdmVkIG9iamVjdC4gVGhlIHJlc29sdmVkIG9iamVjdCBlaXRoZXIgaGFzIGFcbi8vIGNvbGxlY3Rpb24ga2V5IG9yIGEgbW9kZWwga2V5IGRlcGVuZGluZyBvbiB0aGUgcmV0dXJuZWQgZW50aXR5IHR5cGUuXG5jb25zdCBjYWxsYmFjayA9IGZpbmFsaXplID0+ICggZW50aXR5LCByZXNwb25zZSwgb3B0aW9ucyApID0+IHtcbiAgaWYgKCBlbnRpdHkgaW5zdGFuY2VvZiBDb2xsZWN0aW9uICkge1xuICAgIGZpbmFsaXplKCB7IGNvbGxlY3Rpb246IGVudGl0eSwgcmVzcG9uc2UsIG9wdGlvbnMgfSApO1xuICB9IGVsc2Uge1xuICAgIGZpbmFsaXplKCB7IG1vZGVsOiBlbnRpdHksIHJlc3BvbnNlLCBvcHRpb25zIH0gKTtcbiAgfVxufTtcblxuLy8gIyMgUHJvbWlzZSBGYWN0b3J5XG4vLyBUaGlzIGZ1bmN0aW9uIHJldHVybnMgYSBwcm9taXNlIHRoYXQgYWRhcHRzIGJhY2tib25lJ3Mgc3VjY2VzcyBhbmQgZXJyb3Jcbi8vIGNhbGxiYWNrcyB0byBQcm9taXNlJ3MgcmVqZWN0IGFuZCByZXNvbHZlIG1ldGhvZHMuIEhvd2V2ZXIsIGlmIHRoZSBjbGllbnRcbi8vIHBhc3NlcyBpbiBzdWNjZXNzIGFuZCBlcnJvciBjYWxsYmFja3MgdGhlbXNlbHZlcywgdGhleSBleHBlY3QgdG8gdXNlXG4vLyB0aGUgZGVmYXVsdCBjYWxsYmFjayBhcGkuXG5jb25zdCBwcm9taXNlID0gKCBjb250ZXh0LCBtZXRob2QsIG9wdGlvbnMsIGFyZ3MgKSA9PiB7XG4gIGNvbnN0IGJhc2UgPSBjb250ZXh0IGluc3RhbmNlb2YgQ29sbGVjdGlvbiA/IENvbGxlY3Rpb24gOiBNb2RlbDtcbiAgY29uc3QgZnVuYyA9IGJhc2UucHJvdG90eXBlWyBtZXRob2QgXTtcbiAgaWYgKCBvcHRpb25zLnN1Y2Nlc3MgfHwgb3B0aW9ucy5lcnJvciApIHtcbiAgICByZXR1cm4gZnVuYy5hcHBseSggY29udGV4dCwgYXJncyApO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSggKCByZXNvbHZlLCByZWplY3QgKSA9PiB7XG4gICAgICBhc3NpZ24oIG9wdGlvbnMsIHtcbiAgICAgICAgc3VjY2VzczogY2FsbGJhY2soIHJlc29sdmUgKSxcbiAgICAgICAgZXJyb3I6IGNhbGxiYWNrKCByZWplY3QgKVxuICAgICAgfSApO1xuICAgICAgZnVuYy5hcHBseSggY29udGV4dCwgYXJncyApO1xuICAgIH0gKTtcbiAgfVxufTtcblxuLy8gIyBQcm9taXNlIE1vZGVsXG4vLyBPdmVycmlkZXMgTW9kZWwncyBzYXZlLCBkZXN0cm95LCBhbmQgZmV0Y2ggZnVuY3Rpb25zIHdpdGggdmVyc2lvbnMgdGhhdFxuLy8gcmV0dXJuIHByb21pc2VzLlxuZXhwb3J0IGNvbnN0IFByb21pc2VNb2RlbCA9IE1vZGVsLmV4dGVuZCgge1xuICBzYXZlOiBmdW5jdGlvbigga2V5LCB2YWwsIG9wdGlvbnMgKSB7XG4gICAgbGV0IG9wdHMsIGFyZ3M7XG4gICAgaWYgKCBrZXkgPT0gbnVsbCB8fCB0eXBlb2Yga2V5ID09PSAnb2JqZWN0JyApIHtcbiAgICAgIG9wdHMgPSB2YWwgfHwge307XG4gICAgICBhcmdzID0gWyBrZXksIG9wdHMgXTtcbiAgICB9IGVsc2Uge1xuICAgICAgb3B0cyA9IG9wdGlvbnMgfHwge307XG4gICAgICBhcmdzID0gWyBrZXksIHZhbCwgb3B0cyBdO1xuICAgIH1cblxuICAgIHJldHVybiBwcm9taXNlKCB0aGlzLCAnc2F2ZScsIG9wdHMsIGFyZ3MgKTtcbiAgfSxcblxuICBkZXN0cm95OiBmdW5jdGlvbiggb3B0aW9ucyA9IHt9ICkge1xuICAgIHJldHVybiBwcm9taXNlKCB0aGlzLCAnZGVzdHJveScsIG9wdGlvbnMsIFsgb3B0aW9ucyBdICk7XG4gIH0sXG5cbiAgZmV0Y2g6IGZ1bmN0aW9uKCBvcHRpb25zID0ge30gKSB7XG4gICAgcmV0dXJuIHByb21pc2UoIHRoaXMsICdmZXRjaCcsIG9wdGlvbnMsIFsgb3B0aW9ucyBdICk7XG4gIH1cbn0gKTtcblxuLy8gIyBQcm9taXNlQ29sbGVjdGlvblxuLy8gT3ZlcnJpZGVzIENvbGxlY3Rpb24ncyBmZXRjaCBmdW5jdGlvbiB3aXRoIGEgdmVyc2lvbiB0aGF0IHJldHVybnMgYSBwcm9taXNlLlxuZXhwb3J0IGNvbnN0IFByb21pc2VDb2xsZWN0aW9uID0gQ29sbGVjdGlvbi5leHRlbmQoIHtcbiAgZmV0Y2g6IGZ1bmN0aW9uKCBvcHRpb25zID0ge30gKSB7XG4gICAgcmV0dXJuIHByb21pc2UoIHRoaXMsICdmZXRjaCcsIG9wdGlvbnMsIFsgb3B0aW9ucyBdICk7XG4gIH1cbn0gKTtcbiJdfQ==