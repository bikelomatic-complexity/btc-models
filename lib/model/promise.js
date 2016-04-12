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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tb2RlbC9wcm9taXNlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBOztBQUNBOzs7Ozs7Ozs7Ozs7O0FBYUEsSUFBTSxXQUFXLFNBQVgsUUFBVztTQUFZLFVBQUUsTUFBRixFQUFVLFFBQVYsRUFBb0IsT0FBcEIsRUFBaUM7QUFDNUQsUUFBSyxzQ0FBTCxFQUFvQztBQUNsQyxlQUFVLEVBQUUsWUFBWSxNQUFaLEVBQW9CLGtCQUF0QixFQUFnQyxnQkFBaEMsRUFBVixFQURrQztLQUFwQyxNQUVPO0FBQ0wsZUFBVSxFQUFFLE9BQU8sTUFBUCxFQUFlLGtCQUFqQixFQUEyQixnQkFBM0IsRUFBVixFQURLO0tBRlA7R0FEMkI7Q0FBWjs7Ozs7OztBQWFqQixJQUFNLFVBQVUsU0FBVixPQUFVLENBQUUsT0FBRixFQUFXLE1BQVgsRUFBbUIsT0FBbkIsRUFBNEIsSUFBNUIsRUFBc0M7QUFDcEQsTUFBTSxPQUFPLGdGQUFQLENBRDhDO0FBRXBELE1BQU0sT0FBTyxLQUFLLFNBQUwsQ0FBZ0IsTUFBaEIsQ0FBUCxDQUY4QztBQUdwRCxNQUFLLFFBQVEsT0FBUixJQUFtQixRQUFRLEtBQVIsRUFBZ0I7QUFDdEMsV0FBTyxLQUFLLEtBQUwsQ0FBWSxPQUFaLEVBQXFCLElBQXJCLENBQVAsQ0FEc0M7R0FBeEMsTUFFTztBQUNMLFdBQU8sSUFBSSxPQUFKLENBQWEsVUFBRSxPQUFGLEVBQVcsTUFBWCxFQUF1QjtBQUN6QywwQkFBUSxPQUFSLEVBQWlCO0FBQ2YsaUJBQVMsU0FBVSxPQUFWLENBQVQ7QUFDQSxlQUFPLFNBQVUsTUFBVixDQUFQO09BRkYsRUFEeUM7QUFLekMsV0FBSyxLQUFMLENBQVksT0FBWixFQUFxQixJQUFyQixFQUx5QztLQUF2QixDQUFwQixDQURLO0dBRlA7Q0FIYzs7Ozs7QUFtQlQsSUFBTSxzQ0FBZSxnQkFBTSxNQUFOLENBQWM7QUFDeEMsUUFBTSxjQUFVLEdBQVYsRUFBZSxHQUFmLEVBQW9CLE9BQXBCLEVBQThCO0FBQ2xDLFFBQUksYUFBSjtRQUFVLGFBQVYsQ0FEa0M7QUFFbEMsUUFBSyxPQUFPLElBQVAsSUFBZSxRQUFPLGlEQUFQLEtBQWUsUUFBZixFQUEwQjtBQUM1QyxhQUFPLE9BQU8sRUFBUCxDQURxQztBQUU1QyxhQUFPLENBQUUsR0FBRixFQUFPLElBQVAsQ0FBUCxDQUY0QztLQUE5QyxNQUdPO0FBQ0wsYUFBTyxXQUFXLEVBQVgsQ0FERjtBQUVMLGFBQU8sQ0FBRSxHQUFGLEVBQU8sR0FBUCxFQUFZLElBQVosQ0FBUCxDQUZLO0tBSFA7O0FBUUEsV0FBTyxRQUFTLElBQVQsRUFBZSxNQUFmLEVBQXVCLElBQXZCLEVBQTZCLElBQTdCLENBQVAsQ0FWa0M7R0FBOUI7O0FBYU4sV0FBUyxtQkFBeUI7UUFBZixnRUFBVSxrQkFBSzs7QUFDaEMsV0FBTyxRQUFTLElBQVQsRUFBZSxTQUFmLEVBQTBCLE9BQTFCLEVBQW1DLENBQUUsT0FBRixDQUFuQyxDQUFQLENBRGdDO0dBQXpCOztBQUlULFNBQU8saUJBQXlCO1FBQWYsZ0VBQVUsa0JBQUs7O0FBQzlCLFdBQU8sUUFBUyxJQUFULEVBQWUsT0FBZixFQUF3QixPQUF4QixFQUFpQyxDQUFFLE9BQUYsQ0FBakMsQ0FBUCxDQUQ4QjtHQUF6QjtDQWxCbUIsQ0FBZjs7OztBQXlCTixJQUFNLGdEQUFvQixxQkFBVyxNQUFYLENBQW1CO0FBQ2xELFNBQU8saUJBQXlCO1FBQWYsZ0VBQVUsa0JBQUs7O0FBQzlCLFdBQU8sUUFBUyxJQUFULEVBQWUsT0FBZixFQUF3QixPQUF4QixFQUFpQyxDQUFFLE9BQUYsQ0FBakMsQ0FBUCxDQUQ4QjtHQUF6QjtDQUR3QixDQUFwQiIsImZpbGUiOiJwcm9taXNlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTW9kZWwsIENvbGxlY3Rpb24gfSBmcm9tICdiYWNrYm9uZSc7XHJcbmltcG9ydCB7IGFzc2lnbiB9IGZyb20gJ2xvZGFzaCc7XHJcblxyXG4vLyAjIEJhY2tib25lIFByb21pc2VzXHJcbi8vIFRoaXMgZmlsZSBwcm92aWRlcyBNb2RlbCBhbmQgQ29sbGVjdGlvbiBiYXNlIGNsYXNzZXMgdGhhdCBvdmVycmlkZVxyXG4vLyBiYWNrYm9uZSdzIGNhbGxiYWNrIGFwaSB3aXRoIGEgcHJvbWlzZSBiYXNlZCBhcGkuIFdlIG92ZXJyaWRlIHNhdmUsIGRlc3Ryb3ksXHJcbi8vIGFuZCBmZXRjaC4gQnV0IHdlIGNhbm5vdCBvdmVycmlkZSBDb2xsZWN0aW9uLmNyZWF0ZS4gVGhhdCBtZXRob2QgZG9lcyBub3RcclxuLy8gYWNjZXB0IHN1Y2Nlc3MgYW5kIGVycm9yIGNhbGxiYWNrcyBhbnl3YXlzLlxyXG5cclxuLy8gIyMgQmFrY2JvbmUgQ2FsbGJhY2sgRmFjdG9yeVxyXG4vLyBUaGlzIGZ1bmN0aW9uIHRha2VzIGVpdGhlciBQcm9taXNlLnJlc29sdmUgb3IgUHJvbWlzZS5yZWplY3QsIGFuZCByZXR1cm5zXHJcbi8vIGEgbmV3IGZ1bmN0aW9uIHRoYXQgd2lsbCBjYWxsIFByb21pc2UucmVzb2x2ZSBvciBQcm9taXNlLnJlamVjdCB3aXRoIHRoZVxyXG4vLyBhcHByb3ByaWF0ZSByZXNvbHZlZCBvYmplY3QuIFRoZSByZXNvbHZlZCBvYmplY3QgZWl0aGVyIGhhcyBhXHJcbi8vIGNvbGxlY3Rpb24ga2V5IG9yIGEgbW9kZWwga2V5IGRlcGVuZGluZyBvbiB0aGUgcmV0dXJuZWQgZW50aXR5IHR5cGUuXHJcbmNvbnN0IGNhbGxiYWNrID0gZmluYWxpemUgPT4gKCBlbnRpdHksIHJlc3BvbnNlLCBvcHRpb25zICkgPT4ge1xyXG4gIGlmICggZW50aXR5IGluc3RhbmNlb2YgQ29sbGVjdGlvbiApIHtcclxuICAgIGZpbmFsaXplKCB7IGNvbGxlY3Rpb246IGVudGl0eSwgcmVzcG9uc2UsIG9wdGlvbnMgfSApO1xyXG4gIH0gZWxzZSB7XHJcbiAgICBmaW5hbGl6ZSggeyBtb2RlbDogZW50aXR5LCByZXNwb25zZSwgb3B0aW9ucyB9ICk7XHJcbiAgfVxyXG59O1xyXG5cclxuLy8gIyMgUHJvbWlzZSBGYWN0b3J5XHJcbi8vIFRoaXMgZnVuY3Rpb24gcmV0dXJucyBhIHByb21pc2UgdGhhdCBhZGFwdHMgYmFja2JvbmUncyBzdWNjZXNzIGFuZCBlcnJvclxyXG4vLyBjYWxsYmFja3MgdG8gUHJvbWlzZSdzIHJlamVjdCBhbmQgcmVzb2x2ZSBtZXRob2RzLiBIb3dldmVyLCBpZiB0aGUgY2xpZW50XHJcbi8vIHBhc3NlcyBpbiBzdWNjZXNzIGFuZCBlcnJvciBjYWxsYmFja3MgdGhlbXNlbHZlcywgdGhleSBleHBlY3QgdG8gdXNlXHJcbi8vIHRoZSBkZWZhdWx0IGNhbGxiYWNrIGFwaS5cclxuY29uc3QgcHJvbWlzZSA9ICggY29udGV4dCwgbWV0aG9kLCBvcHRpb25zLCBhcmdzICkgPT4ge1xyXG4gIGNvbnN0IGJhc2UgPSBjb250ZXh0IGluc3RhbmNlb2YgQ29sbGVjdGlvbiA/IENvbGxlY3Rpb24gOiBNb2RlbDtcclxuICBjb25zdCBmdW5jID0gYmFzZS5wcm90b3R5cGVbIG1ldGhvZCBdO1xyXG4gIGlmICggb3B0aW9ucy5zdWNjZXNzIHx8IG9wdGlvbnMuZXJyb3IgKSB7XHJcbiAgICByZXR1cm4gZnVuYy5hcHBseSggY29udGV4dCwgYXJncyApO1xyXG4gIH0gZWxzZSB7XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoICggcmVzb2x2ZSwgcmVqZWN0ICkgPT4ge1xyXG4gICAgICBhc3NpZ24oIG9wdGlvbnMsIHtcclxuICAgICAgICBzdWNjZXNzOiBjYWxsYmFjayggcmVzb2x2ZSApLFxyXG4gICAgICAgIGVycm9yOiBjYWxsYmFjayggcmVqZWN0IClcclxuICAgICAgfSApO1xyXG4gICAgICBmdW5jLmFwcGx5KCBjb250ZXh0LCBhcmdzICk7XHJcbiAgICB9ICk7XHJcbiAgfVxyXG59O1xyXG5cclxuLy8gIyBQcm9taXNlIE1vZGVsXHJcbi8vIE92ZXJyaWRlcyBNb2RlbCdzIHNhdmUsIGRlc3Ryb3ksIGFuZCBmZXRjaCBmdW5jdGlvbnMgd2l0aCB2ZXJzaW9ucyB0aGF0XHJcbi8vIHJldHVybiBwcm9taXNlcy5cclxuZXhwb3J0IGNvbnN0IFByb21pc2VNb2RlbCA9IE1vZGVsLmV4dGVuZCgge1xyXG4gIHNhdmU6IGZ1bmN0aW9uKCBrZXksIHZhbCwgb3B0aW9ucyApIHtcclxuICAgIGxldCBvcHRzLCBhcmdzO1xyXG4gICAgaWYgKCBrZXkgPT0gbnVsbCB8fCB0eXBlb2Yga2V5ID09PSAnb2JqZWN0JyApIHtcclxuICAgICAgb3B0cyA9IHZhbCB8fCB7fTtcclxuICAgICAgYXJncyA9IFsga2V5LCBvcHRzIF07XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBvcHRzID0gb3B0aW9ucyB8fCB7fTtcclxuICAgICAgYXJncyA9IFsga2V5LCB2YWwsIG9wdHMgXTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gcHJvbWlzZSggdGhpcywgJ3NhdmUnLCBvcHRzLCBhcmdzICk7XHJcbiAgfSxcclxuXHJcbiAgZGVzdHJveTogZnVuY3Rpb24oIG9wdGlvbnMgPSB7fSApIHtcclxuICAgIHJldHVybiBwcm9taXNlKCB0aGlzLCAnZGVzdHJveScsIG9wdGlvbnMsIFsgb3B0aW9ucyBdICk7XHJcbiAgfSxcclxuXHJcbiAgZmV0Y2g6IGZ1bmN0aW9uKCBvcHRpb25zID0ge30gKSB7XHJcbiAgICByZXR1cm4gcHJvbWlzZSggdGhpcywgJ2ZldGNoJywgb3B0aW9ucywgWyBvcHRpb25zIF0gKTtcclxuICB9XHJcbn0gKTtcclxuXHJcbi8vICMgUHJvbWlzZUNvbGxlY3Rpb25cclxuLy8gT3ZlcnJpZGVzIENvbGxlY3Rpb24ncyBmZXRjaCBmdW5jdGlvbiB3aXRoIGEgdmVyc2lvbiB0aGF0IHJldHVybnMgYSBwcm9taXNlLlxyXG5leHBvcnQgY29uc3QgUHJvbWlzZUNvbGxlY3Rpb24gPSBDb2xsZWN0aW9uLmV4dGVuZCgge1xyXG4gIGZldGNoOiBmdW5jdGlvbiggb3B0aW9ucyA9IHt9ICkge1xyXG4gICAgcmV0dXJuIHByb21pc2UoIHRoaXMsICdmZXRjaCcsIG9wdGlvbnMsIFsgb3B0aW9ucyBdICk7XHJcbiAgfVxyXG59ICk7XHJcbiJdfQ==