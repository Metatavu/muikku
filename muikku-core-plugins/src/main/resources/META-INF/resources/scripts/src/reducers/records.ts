import notifications from './base/notifications';
import locales from './base/locales';
import status from './base/status';
import i18n from './base/i18n';
import title from './base/title';
import websocket from './util/websocket';
import messageCount from './main-function/message-count';

import {combineReducers} from 'redux';
import records from '~/reducers/main-function/records/records';

export default combineReducers({
  records,
  
  notifications,
  i18n,
  locales,
  status,
  websocket,
  messageCount,
  title
});