export { connect, connectMut } from './connect';
export { serviceTypes, alertTypes, display } from './model/point';

export { Schedule, days, nextDay, timezones } from './model/hours';

export { User, UserCollection, UserRef, UserRefCollection, Login } from './model/user';
export { Point, Service, Alert, PointCollection, Comment, CommentCollection } from './model/point';

import { Point, Service, Alert, PointCollection, Comment, CommentCollection } from './model/point';

/*esfmt-ignore-start*/
export const models = [
  Point,
  Service,
  Alert,
  PointCollection,
  Comment,
  CommentCollection
];
/*esfmt-ignore-end*/

import { connectMut } from './connect';
export default function connectModels( database ) {
  connectMut( database, models );
}
