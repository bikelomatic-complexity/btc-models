import { sync } from 'backbone-pouch';

// Connect multiple Backbone classes (Models and Collections) to the database.
//
//  * In production, `database` is appended to CouchDB's root url
//  * In test, `database` is used as the name of a local database
// export function connect( pouch, ...klasses ) {
//   klasses.forEach( klass => {
//     klass.prototype.sync = sync( { db: pouch } );
//   } );
// }
//
// export function connectOne( pouch, klass ) {
//   klass.prototype.sync = sync( { db: pouch } );
//   return klass;
// }

export function connect( database, klass ) {
  return klass.extend( {
    connect: connect,
    database: database,
    sync: sync( { db: database } )
  } );
}
