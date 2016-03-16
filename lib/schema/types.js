'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.display = display;

/*esfmt-ignore-start*/
var serviceTypes = exports.serviceTypes = {
  'airport': { display: 'Airport' },
  'bar': { display: 'Bar' },
  'bed_and_breakfast': { display: 'Bed & Breakfast' },
  'bike_shop': { display: 'Bike Shop' },
  'cabin': { display: 'Cabin' },
  'campground': { display: 'Campground' },
  'convenience_store': { display: 'Convenience Store' },
  'cyclists_camping': { display: 'Cyclists\' Camping' },
  'cyclists_lodging': { display: 'Cyclists\' Lodging' },
  'grocery': { display: 'Grocery' },
  'hostel': { display: 'Hostel' },
  'hot_spring': { display: 'Hot Spring' },
  'hotel': { display: 'Hotel' },
  'motel': { display: 'Motel' },
  'information': { display: 'Information' },
  'library': { display: 'Library' },
  'museum': { display: 'Museum' },
  'outdoor_store': { display: 'Outdoor Store' },
  'rest_area': { display: 'Rest Area' },
  'restaurant': { display: 'Restaurant' },
  'restroom': { display: 'Restroom' },
  'scenic_area': { display: 'Scenic Area' },
  'state_park': { display: 'State Park' },
  'other': { display: 'Other' }
};

var alertTypes = exports.alertTypes = {
  'road_closure': { display: 'Road Closure' },
  'forest_fire': { display: 'Forest fire' },
  'flooding': { display: 'Flooding' },
  'detour': { display: 'Detour' },
  'other': { display: 'Other' }
};
/*esfmt-ignore-end*/

function display(type) {
  var values = serviceTypes[type] || alertTypes[type];
  if (values) {
    return values.display;
  } else {
    return null;
  }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zY2hlbWEvdHlwZXMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7UUFzQ2dCOzs7QUFwQ1QsSUFBTSxzQ0FBZTtBQUMxQixhQUFxQixFQUFFLFNBQVMsU0FBVCxFQUF2QjtBQUNBLFNBQXFCLEVBQUUsU0FBUyxLQUFULEVBQXZCO0FBQ0EsdUJBQXFCLEVBQUUsU0FBUyxpQkFBVCxFQUF2QjtBQUNBLGVBQXFCLEVBQUUsU0FBUyxXQUFULEVBQXZCO0FBQ0EsV0FBcUIsRUFBRSxTQUFTLE9BQVQsRUFBdkI7QUFDQSxnQkFBcUIsRUFBRSxTQUFTLFlBQVQsRUFBdkI7QUFDQSx1QkFBcUIsRUFBRSxTQUFTLG1CQUFULEVBQXZCO0FBQ0Esc0JBQXFCLEVBQUUsU0FBUyxvQkFBVCxFQUF2QjtBQUNBLHNCQUFxQixFQUFFLFNBQVMsb0JBQVQsRUFBdkI7QUFDQSxhQUFxQixFQUFFLFNBQVMsU0FBVCxFQUF2QjtBQUNBLFlBQXFCLEVBQUUsU0FBUyxRQUFULEVBQXZCO0FBQ0EsZ0JBQXFCLEVBQUUsU0FBUyxZQUFULEVBQXZCO0FBQ0EsV0FBcUIsRUFBRSxTQUFTLE9BQVQsRUFBdkI7QUFDQSxXQUFxQixFQUFFLFNBQVMsT0FBVCxFQUF2QjtBQUNBLGlCQUFxQixFQUFFLFNBQVMsYUFBVCxFQUF2QjtBQUNBLGFBQXFCLEVBQUUsU0FBUyxTQUFULEVBQXZCO0FBQ0EsWUFBcUIsRUFBRSxTQUFTLFFBQVQsRUFBdkI7QUFDQSxtQkFBcUIsRUFBRSxTQUFTLGVBQVQsRUFBdkI7QUFDQSxlQUFxQixFQUFFLFNBQVMsV0FBVCxFQUF2QjtBQUNBLGdCQUFxQixFQUFFLFNBQVMsWUFBVCxFQUF2QjtBQUNBLGNBQXFCLEVBQUUsU0FBUyxVQUFULEVBQXZCO0FBQ0EsaUJBQXFCLEVBQUUsU0FBUyxhQUFULEVBQXZCO0FBQ0EsZ0JBQXFCLEVBQUUsU0FBUyxZQUFULEVBQXZCO0FBQ0EsV0FBcUIsRUFBRSxTQUFTLE9BQVQsRUFBdkI7Q0F4Qlc7O0FBMkJOLElBQU0sa0NBQWE7QUFDeEIsa0JBQXFCLEVBQUUsU0FBUyxjQUFULEVBQXZCO0FBQ0EsaUJBQXFCLEVBQUUsU0FBUyxhQUFULEVBQXZCO0FBQ0EsY0FBcUIsRUFBRSxTQUFTLFVBQVQsRUFBdkI7QUFDQSxZQUFxQixFQUFFLFNBQVMsUUFBVCxFQUF2QjtBQUNBLFdBQXFCLEVBQUUsU0FBUyxPQUFULEVBQXZCO0NBTFc7OztBQVNOLFNBQVMsT0FBVCxDQUFrQixJQUFsQixFQUF5QjtBQUM5QixNQUFNLFNBQVMsYUFBYyxJQUFkLEtBQXdCLFdBQVksSUFBWixDQUF4QixDQURlO0FBRTlCLE1BQUssTUFBTCxFQUFjO0FBQ1osV0FBTyxPQUFPLE9BQVAsQ0FESztHQUFkLE1BRU87QUFDTCxXQUFPLElBQVAsQ0FESztHQUZQO0NBRksiLCJmaWxlIjoidHlwZXMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcbi8qZXNmbXQtaWdub3JlLXN0YXJ0Ki9cbmV4cG9ydCBjb25zdCBzZXJ2aWNlVHlwZXMgPSB7XG4gICdhaXJwb3J0JzogICAgICAgICAgIHsgZGlzcGxheTogJ0FpcnBvcnQnIH0sXG4gICdiYXInOiAgICAgICAgICAgICAgIHsgZGlzcGxheTogJ0JhcicgfSxcbiAgJ2JlZF9hbmRfYnJlYWtmYXN0JzogeyBkaXNwbGF5OiAnQmVkICYgQnJlYWtmYXN0JyB9ICAsXG4gICdiaWtlX3Nob3AnOiAgICAgICAgIHsgZGlzcGxheTogJ0Jpa2UgU2hvcCcgfSxcbiAgJ2NhYmluJzogICAgICAgICAgICAgeyBkaXNwbGF5OiAnQ2FiaW4nIH0sXG4gICdjYW1wZ3JvdW5kJzogICAgICAgIHsgZGlzcGxheTogJ0NhbXBncm91bmQnIH0sXG4gICdjb252ZW5pZW5jZV9zdG9yZSc6IHsgZGlzcGxheTogJ0NvbnZlbmllbmNlIFN0b3JlJyB9LFxuICAnY3ljbGlzdHNfY2FtcGluZyc6ICB7IGRpc3BsYXk6ICdDeWNsaXN0c1xcJyBDYW1waW5nJyB9LFxuICAnY3ljbGlzdHNfbG9kZ2luZyc6ICB7IGRpc3BsYXk6ICdDeWNsaXN0c1xcJyBMb2RnaW5nJyB9LFxuICAnZ3JvY2VyeSc6ICAgICAgICAgICB7IGRpc3BsYXk6ICdHcm9jZXJ5JyB9LFxuICAnaG9zdGVsJzogICAgICAgICAgICB7IGRpc3BsYXk6ICdIb3N0ZWwnIH0sXG4gICdob3Rfc3ByaW5nJzogICAgICAgIHsgZGlzcGxheTogJ0hvdCBTcHJpbmcnIH0sXG4gICdob3RlbCc6ICAgICAgICAgICAgIHsgZGlzcGxheTogJ0hvdGVsJyB9LFxuICAnbW90ZWwnOiAgICAgICAgICAgICB7IGRpc3BsYXk6ICdNb3RlbCcgfSxcbiAgJ2luZm9ybWF0aW9uJzogICAgICAgeyBkaXNwbGF5OiAnSW5mb3JtYXRpb24nIH0sXG4gICdsaWJyYXJ5JzogICAgICAgICAgIHsgZGlzcGxheTogJ0xpYnJhcnknIH0sXG4gICdtdXNldW0nOiAgICAgICAgICAgIHsgZGlzcGxheTogJ011c2V1bScgfSxcbiAgJ291dGRvb3Jfc3RvcmUnOiAgICAgeyBkaXNwbGF5OiAnT3V0ZG9vciBTdG9yZScgfSxcbiAgJ3Jlc3RfYXJlYSc6ICAgICAgICAgeyBkaXNwbGF5OiAnUmVzdCBBcmVhJyB9LFxuICAncmVzdGF1cmFudCc6ICAgICAgICB7IGRpc3BsYXk6ICdSZXN0YXVyYW50JyB9LFxuICAncmVzdHJvb20nOiAgICAgICAgICB7IGRpc3BsYXk6ICdSZXN0cm9vbScgfSxcbiAgJ3NjZW5pY19hcmVhJzogICAgICAgeyBkaXNwbGF5OiAnU2NlbmljIEFyZWEnIH0sXG4gICdzdGF0ZV9wYXJrJzogICAgICAgIHsgZGlzcGxheTogJ1N0YXRlIFBhcmsnIH0sXG4gICdvdGhlcic6ICAgICAgICAgICAgIHsgZGlzcGxheTogJ090aGVyJyB9XG59O1xuXG5leHBvcnQgY29uc3QgYWxlcnRUeXBlcyA9IHtcbiAgJ3JvYWRfY2xvc3VyZSc6ICAgICAgeyBkaXNwbGF5OiAnUm9hZCBDbG9zdXJlJyB9LFxuICAnZm9yZXN0X2ZpcmUnOiAgICAgICB7IGRpc3BsYXk6ICdGb3Jlc3QgZmlyZScgfSxcbiAgJ2Zsb29kaW5nJzogICAgICAgICAgeyBkaXNwbGF5OiAnRmxvb2RpbmcnIH0sXG4gICdkZXRvdXInOiAgICAgICAgICAgIHsgZGlzcGxheTogJ0RldG91cicgfSxcbiAgJ290aGVyJzogICAgICAgICAgICAgeyBkaXNwbGF5OiAnT3RoZXInIH1cbn07XG4vKmVzZm10LWlnbm9yZS1lbmQqL1xuXG5leHBvcnQgZnVuY3Rpb24gZGlzcGxheSggdHlwZSApIHtcbiAgY29uc3QgdmFsdWVzID0gc2VydmljZVR5cGVzWyB0eXBlIF0gfHwgYWxlcnRUeXBlc1sgdHlwZSBdO1xuICBpZiAoIHZhbHVlcyApIHtcbiAgICByZXR1cm4gdmFsdWVzLmRpc3BsYXk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbn1cbiJdfQ==