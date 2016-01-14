import * as isAuthorized from './auth';
import * as hitStatus from './hit-status';
import * as params from './params';
import * as validationMessages from './validation-messages';

export default {
  ...hitStatus,
  ...isAuthorized,
  ...params,
  ...validationMessages
};
