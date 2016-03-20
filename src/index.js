export { connect, connectMut } from './connect';
export { serviceTypes, alertTypes, display } from './model/point';

import { User, UserCollection, Login } from './model/user';
import { Service, Alert, PointCollection, Comment, CommentCollection } from './model/point';

/*esfmt-ignore start*/
export const models = {
  Service,
  Alert,
  PointCollection,
  Comment,
  CommentCollection,
  User,
  UserCollection,
Login };
/*esfmt-ignore end*/
