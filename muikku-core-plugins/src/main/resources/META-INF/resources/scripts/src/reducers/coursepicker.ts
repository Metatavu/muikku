import notifications from './base/notifications';
import locales from './base/locales';
import status from './base/status';
import i18n from './base/i18n';
import title from './base/title';
import websocket from './util/websocket';
import messageCount from './main-function/message-count';

import coursepickerFilters from './main-function/coursepicker/coursepicker-filters';
import coursepickerCourses from './main-function/coursepicker/coursepicker-courses';

import {combineReducers} from 'redux';
import userIndex from './main-function/user-index';

export default combineReducers({
  notifications,
  i18n,
  locales,
  status,
  websocket,
  messageCount,
  title,
  coursepickerFilters,
  userIndex,
  coursepickerCourses
});