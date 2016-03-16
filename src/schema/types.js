
/*esfmt-ignore-start*/
export const serviceTypes = {
  'airport':           { display: 'Airport' },
  'bar':               { display: 'Bar' },
  'bed_and_breakfast': { display: 'Bed & Breakfast' }  ,
  'bike_shop':         { display: 'Bike Shop' },
  'cabin':             { display: 'Cabin' },
  'campground':        { display: 'Campground' },
  'convenience_store': { display: 'Convenience Store' },
  'cyclists_camping':  { display: 'Cyclists\' Camping' },
  'cyclists_lodging':  { display: 'Cyclists\' Lodging' },
  'grocery':           { display: 'Grocery' },
  'hostel':            { display: 'Hostel' },
  'hot_spring':        { display: 'Hot Spring' },
  'hotel':             { display: 'Hotel' },
  'motel':             { display: 'Motel' },
  'information':       { display: 'Information' },
  'library':           { display: 'Library' },
  'museum':            { display: 'Museum' },
  'outdoor_store':     { display: 'Outdoor Store' },
  'rest_area':         { display: 'Rest Area' },
  'restaurant':        { display: 'Restaurant' },
  'restroom':          { display: 'Restroom' },
  'scenic_area':       { display: 'Scenic Area' },
  'state_park':        { display: 'State Park' },
  'other':             { display: 'Other' }
};

export const alertTypes = {
  'road_closure':      { display: 'Road Closure' },
  'forest_fire':       { display: 'Forest fire' },
  'flooding':          { display: 'Flooding' },
  'detour':            { display: 'Detour' },
  'other':             { display: 'Other' }
};
/*esfmt-ignore-end*/

export function display( type ) {
  const values = serviceTypes[ type ] || alertTypes[ type ];
  if ( values ) {
    return values.display;
  } else {
    return null;
  }
}
