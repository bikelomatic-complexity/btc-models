'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PromiseCollection = exports.PromiseModel = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _backbone = require('backbone');

var _lodash = require('lodash');

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
    var opts = void 0,
        args = void 0;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tb2RlbC9wcm9taXNlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBOztBQUNBOzs7Ozs7Ozs7Ozs7O0FBYUEsSUFBTSxXQUFXLFNBQVgsUUFBVztTQUFZLFVBQUUsTUFBRixFQUFVLFFBQVYsRUFBb0IsT0FBcEIsRUFBaUM7QUFDNUQsUUFBSyxzQ0FBTCxFQUFvQztBQUNsQyxlQUFVLEVBQUUsWUFBWSxNQUFaLEVBQW9CLGtCQUF0QixFQUFnQyxnQkFBaEMsRUFBVixFQURrQztLQUFwQyxNQUVPO0FBQ0wsZUFBVSxFQUFFLE9BQU8sTUFBUCxFQUFlLGtCQUFqQixFQUEyQixnQkFBM0IsRUFBVixFQURLO0tBRlA7R0FEMkI7Q0FBWjs7Ozs7OztBQWFqQixJQUFNLFVBQVUsU0FBVixPQUFVLENBQUUsT0FBRixFQUFXLE1BQVgsRUFBbUIsT0FBbkIsRUFBNEIsSUFBNUIsRUFBc0M7QUFDcEQsTUFBTSxPQUFPLGdGQUFQLENBRDhDO0FBRXBELE1BQU0sT0FBTyxLQUFLLFNBQUwsQ0FBZ0IsTUFBaEIsQ0FBUCxDQUY4QztBQUdwRCxNQUFLLFFBQVEsT0FBUixJQUFtQixRQUFRLEtBQVIsRUFBZ0I7QUFDdEMsV0FBTyxLQUFLLEtBQUwsQ0FBWSxPQUFaLEVBQXFCLElBQXJCLENBQVAsQ0FEc0M7R0FBeEMsTUFFTztBQUNMLFdBQU8sSUFBSSxPQUFKLENBQWEsVUFBRSxPQUFGLEVBQVcsTUFBWCxFQUF1QjtBQUN6QywwQkFBUSxPQUFSLEVBQWlCO0FBQ2YsaUJBQVMsU0FBVSxPQUFWLENBQVQ7QUFDQSxlQUFPLFNBQVUsTUFBVixDQUFQO09BRkYsRUFEeUM7QUFLekMsV0FBSyxLQUFMLENBQVksT0FBWixFQUFxQixJQUFyQixFQUx5QztLQUF2QixDQUFwQixDQURLO0dBRlA7Q0FIYzs7Ozs7QUFtQlQsSUFBTSxzQ0FBZSxnQkFBTSxNQUFOLENBQWM7QUFDeEMsUUFBTSxjQUFVLEdBQVYsRUFBZSxHQUFmLEVBQW9CLE9BQXBCLEVBQThCO0FBQ2xDLFFBQUksYUFBSjtRQUFVLGFBQVYsQ0FEa0M7QUFFbEMsUUFBSyxPQUFPLElBQVAsSUFBZSxRQUFPLGlEQUFQLEtBQWUsUUFBZixFQUEwQjtBQUM1QyxhQUFPLE9BQU8sRUFBUCxDQURxQztBQUU1QyxhQUFPLENBQUUsR0FBRixFQUFPLElBQVAsQ0FBUCxDQUY0QztLQUE5QyxNQUdPO0FBQ0wsYUFBTyxXQUFXLEVBQVgsQ0FERjtBQUVMLGFBQU8sQ0FBRSxHQUFGLEVBQU8sR0FBUCxFQUFZLElBQVosQ0FBUCxDQUZLO0tBSFA7O0FBUUEsV0FBTyxRQUFTLElBQVQsRUFBZSxNQUFmLEVBQXVCLElBQXZCLEVBQTZCLElBQTdCLENBQVAsQ0FWa0M7R0FBOUI7O0FBYU4sV0FBUyxtQkFBeUI7UUFBZixnRUFBVSxrQkFBSzs7QUFDaEMsV0FBTyxRQUFTLElBQVQsRUFBZSxTQUFmLEVBQTBCLE9BQTFCLEVBQW1DLENBQUUsT0FBRixDQUFuQyxDQUFQLENBRGdDO0dBQXpCOztBQUlULFNBQU8saUJBQXlCO1FBQWYsZ0VBQVUsa0JBQUs7O0FBQzlCLFdBQU8sUUFBUyxJQUFULEVBQWUsT0FBZixFQUF3QixPQUF4QixFQUFpQyxDQUFFLE9BQUYsQ0FBakMsQ0FBUCxDQUQ4QjtHQUF6QjtDQWxCbUIsQ0FBZjs7OztBQXlCTixJQUFNLGdEQUFvQixxQkFBVyxNQUFYLENBQW1CO0FBQ2xELFNBQU8saUJBQXlCO1FBQWYsZ0VBQVUsa0JBQUs7O0FBQzlCLFdBQU8sUUFBUyxJQUFULEVBQWUsT0FBZixFQUF3QixPQUF4QixFQUFpQyxDQUFFLE9BQUYsQ0FBakMsQ0FBUCxDQUQ4QjtHQUF6QjtDQUR3QixDQUFwQiIsImZpbGUiOiJwcm9taXNlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTW9kZWwsIENvbGxlY3Rpb24gfSBmcm9tICdiYWNrYm9uZSc7XG5pbXBvcnQgeyBhc3NpZ24gfSBmcm9tICdsb2Rhc2gnO1xuXG4vLyAjIEJhY2tib25lIFByb21pc2VzXG4vLyBUaGlzIGZpbGUgcHJvdmlkZXMgTW9kZWwgYW5kIENvbGxlY3Rpb24gYmFzZSBjbGFzc2VzIHRoYXQgb3ZlcnJpZGVcbi8vIGJhY2tib25lJ3MgY2FsbGJhY2sgYXBpIHdpdGggYSBwcm9taXNlIGJhc2VkIGFwaS4gV2Ugb3ZlcnJpZGUgc2F2ZSwgZGVzdHJveSxcbi8vIGFuZCBmZXRjaC4gQnV0IHdlIGNhbm5vdCBvdmVycmlkZSBDb2xsZWN0aW9uLmNyZWF0ZS4gVGhhdCBtZXRob2QgZG9lcyBub3Rcbi8vIGFjY2VwdCBzdWNjZXNzIGFuZCBlcnJvciBjYWxsYmFja3MgYW55d2F5cy5cblxuLy8gIyMgQmFrY2JvbmUgQ2FsbGJhY2sgRmFjdG9yeVxuLy8gVGhpcyBmdW5jdGlvbiB0YWtlcyBlaXRoZXIgUHJvbWlzZS5yZXNvbHZlIG9yIFByb21pc2UucmVqZWN0LCBhbmQgcmV0dXJuc1xuLy8gYSBuZXcgZnVuY3Rpb24gdGhhdCB3aWxsIGNhbGwgUHJvbWlzZS5yZXNvbHZlIG9yIFByb21pc2UucmVqZWN0IHdpdGggdGhlXG4vLyBhcHByb3ByaWF0ZSByZXNvbHZlZCBvYmplY3QuIFRoZSByZXNvbHZlZCBvYmplY3QgZWl0aGVyIGhhcyBhXG4vLyBjb2xsZWN0aW9uIGtleSBvciBhIG1vZGVsIGtleSBkZXBlbmRpbmcgb24gdGhlIHJldHVybmVkIGVudGl0eSB0eXBlLlxuY29uc3QgY2FsbGJhY2sgPSBmaW5hbGl6ZSA9PiAoIGVudGl0eSwgcmVzcG9uc2UsIG9wdGlvbnMgKSA9PiB7XG4gIGlmICggZW50aXR5IGluc3RhbmNlb2YgQ29sbGVjdGlvbiApIHtcbiAgICBmaW5hbGl6ZSggeyBjb2xsZWN0aW9uOiBlbnRpdHksIHJlc3BvbnNlLCBvcHRpb25zIH0gKTtcbiAgfSBlbHNlIHtcbiAgICBmaW5hbGl6ZSggeyBtb2RlbDogZW50aXR5LCByZXNwb25zZSwgb3B0aW9ucyB9ICk7XG4gIH1cbn07XG5cbi8vICMjIFByb21pc2UgRmFjdG9yeVxuLy8gVGhpcyBmdW5jdGlvbiByZXR1cm5zIGEgcHJvbWlzZSB0aGF0IGFkYXB0cyBiYWNrYm9uZSdzIHN1Y2Nlc3MgYW5kIGVycm9yXG4vLyBjYWxsYmFja3MgdG8gUHJvbWlzZSdzIHJlamVjdCBhbmQgcmVzb2x2ZSBtZXRob2RzLiBIb3dldmVyLCBpZiB0aGUgY2xpZW50XG4vLyBwYXNzZXMgaW4gc3VjY2VzcyBhbmQgZXJyb3IgY2FsbGJhY2tzIHRoZW1zZWx2ZXMsIHRoZXkgZXhwZWN0IHRvIHVzZVxuLy8gdGhlIGRlZmF1bHQgY2FsbGJhY2sgYXBpLlxuY29uc3QgcHJvbWlzZSA9ICggY29udGV4dCwgbWV0aG9kLCBvcHRpb25zLCBhcmdzICkgPT4ge1xuICBjb25zdCBiYXNlID0gY29udGV4dCBpbnN0YW5jZW9mIENvbGxlY3Rpb24gPyBDb2xsZWN0aW9uIDogTW9kZWw7XG4gIGNvbnN0IGZ1bmMgPSBiYXNlLnByb3RvdHlwZVsgbWV0aG9kIF07XG4gIGlmICggb3B0aW9ucy5zdWNjZXNzIHx8IG9wdGlvbnMuZXJyb3IgKSB7XG4gICAgcmV0dXJuIGZ1bmMuYXBwbHkoIGNvbnRleHQsIGFyZ3MgKTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoICggcmVzb2x2ZSwgcmVqZWN0ICkgPT4ge1xuICAgICAgYXNzaWduKCBvcHRpb25zLCB7XG4gICAgICAgIHN1Y2Nlc3M6IGNhbGxiYWNrKCByZXNvbHZlICksXG4gICAgICAgIGVycm9yOiBjYWxsYmFjayggcmVqZWN0IClcbiAgICAgIH0gKTtcbiAgICAgIGZ1bmMuYXBwbHkoIGNvbnRleHQsIGFyZ3MgKTtcbiAgICB9ICk7XG4gIH1cbn07XG5cbi8vICMgUHJvbWlzZSBNb2RlbFxuLy8gT3ZlcnJpZGVzIE1vZGVsJ3Mgc2F2ZSwgZGVzdHJveSwgYW5kIGZldGNoIGZ1bmN0aW9ucyB3aXRoIHZlcnNpb25zIHRoYXRcbi8vIHJldHVybiBwcm9taXNlcy5cbmV4cG9ydCBjb25zdCBQcm9taXNlTW9kZWwgPSBNb2RlbC5leHRlbmQoIHtcbiAgc2F2ZTogZnVuY3Rpb24oIGtleSwgdmFsLCBvcHRpb25zICkge1xuICAgIGxldCBvcHRzLCBhcmdzO1xuICAgIGlmICgga2V5ID09IG51bGwgfHwgdHlwZW9mIGtleSA9PT0gJ29iamVjdCcgKSB7XG4gICAgICBvcHRzID0gdmFsIHx8IHt9O1xuICAgICAgYXJncyA9IFsga2V5LCBvcHRzIF07XG4gICAgfSBlbHNlIHtcbiAgICAgIG9wdHMgPSBvcHRpb25zIHx8IHt9O1xuICAgICAgYXJncyA9IFsga2V5LCB2YWwsIG9wdHMgXTtcbiAgICB9XG5cbiAgICByZXR1cm4gcHJvbWlzZSggdGhpcywgJ3NhdmUnLCBvcHRzLCBhcmdzICk7XG4gIH0sXG5cbiAgZGVzdHJveTogZnVuY3Rpb24oIG9wdGlvbnMgPSB7fSApIHtcbiAgICByZXR1cm4gcHJvbWlzZSggdGhpcywgJ2Rlc3Ryb3knLCBvcHRpb25zLCBbIG9wdGlvbnMgXSApO1xuICB9LFxuXG4gIGZldGNoOiBmdW5jdGlvbiggb3B0aW9ucyA9IHt9ICkge1xuICAgIHJldHVybiBwcm9taXNlKCB0aGlzLCAnZmV0Y2gnLCBvcHRpb25zLCBbIG9wdGlvbnMgXSApO1xuICB9XG59ICk7XG5cbi8vICMgUHJvbWlzZUNvbGxlY3Rpb25cbi8vIE92ZXJyaWRlcyBDb2xsZWN0aW9uJ3MgZmV0Y2ggZnVuY3Rpb24gd2l0aCBhIHZlcnNpb24gdGhhdCByZXR1cm5zIGEgcHJvbWlzZS5cbmV4cG9ydCBjb25zdCBQcm9taXNlQ29sbGVjdGlvbiA9IENvbGxlY3Rpb24uZXh0ZW5kKCB7XG4gIGZldGNoOiBmdW5jdGlvbiggb3B0aW9ucyA9IHt9ICkge1xuICAgIHJldHVybiBwcm9taXNlKCB0aGlzLCAnZmV0Y2gnLCBvcHRpb25zLCBbIG9wdGlvbnMgXSApO1xuICB9XG59ICk7XG4iXX0=