import { sync } from 'backbone-pouch';

export function connect( database, klass ) {
  return klass.extend( {
    connect: connect,
    database: database,
    sync: sync( { db: database } )
  } );
}
