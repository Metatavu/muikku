import App from '~/containers/index';
import reducer from '~/reducers/index';
import runApp from '~/run';
import Websocket from '~/util/websocket';

import actions from '~/actions/main-function';
import titleActions from '~/actions/base/title';

let store = runApp(reducer, App);
let websocket = new Websocket(store, {
  "Communicator:newmessagereceived": [actions.updateMessageCount, actions.lastMessages.updateLastMessages.bind(null, 6)],
  "Communicator:messageread": [actions.updateMessageCount, actions.lastMessages.updateLastMessages.bind(null, 6)],
  "Communicator:threaddeleted": [actions.updateMessageCount, actions.lastMessages.updateLastMessages.bind(null, 6)]
});
store.dispatch(actions.messageCount.updateMessageCount());
store.dispatch(actions.announcements.updateAnnouncements());
store.dispatch(actions.lastWorkspace.updateLastWorkspace());
store.dispatch(actions.workspaces.updateWorkspaces());
store.dispatch(actions.lastMessages.updateLastMessages(6));

store.dispatch(titleActions.updateTitle(store.getState().i18n.text.get('plugin.site.title')));