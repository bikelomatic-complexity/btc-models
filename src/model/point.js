
import docuri from 'docuri';
import ngeohash from 'ngeohash';
import normalize from 'to-id';

export const pointId = docuri.route( 'point/:type/:name/:geohash' );
export function pointIdFromRaw( type, name, latlng ) {
  const [lat, lng] = latlng;
  return pointId( {
    type: type,
    name: normalize( name ),
    geohash: ngeohash.encode( lat, lng )
  } );
}
