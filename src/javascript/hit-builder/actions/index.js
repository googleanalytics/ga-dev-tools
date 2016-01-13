import * as isAuthorized from './auth';
import * as hitStatus from './hit-status';
import * as params from './params';


export default {
  ...hitStatus,
  ...isAuthorized,
  ...params
};
