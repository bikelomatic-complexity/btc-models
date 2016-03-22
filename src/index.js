export { connect, connectMut } from './connect';
export { serviceTypes, alertTypes, display } from './model/point';

export { Schedule, days } from './model/hours';

export { User, UserCollection, Login } from './model/user';
export { Point, Service, Alert, PointCollection, Comment, CommentCollection } from './model/point';

import { User, UserCollection, Login } from './model/user';
import { Point, Service, Alert, PointCollection, Comment, CommentCollection } from './model/point';

/*esfmt-ignore-start*/
export const models = [
  Point,
  Service,
  Alert,
  PointCollection,
  Comment,
  CommentCollection,
  User,
  UserCollection,
  Login
];
/*esfmt-ignore-end*/
