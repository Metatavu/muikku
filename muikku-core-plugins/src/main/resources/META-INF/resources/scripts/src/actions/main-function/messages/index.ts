import promisify from '~/util/promisify';
import { AnyActionType, SpecificActionType } from '~/actions';
import mApi from '~/lib/mApi';
import { StateType } from '~/reducers';
import { MessageThreadListType, MessageThreadExpandedType, MessagesStateType, MessagesPatchType, MessageThreadLabelType, MessageThreadType, MessageThreadUpdateType, MessageSignatureType, MessageType, MessagesNavigationItemListType, MessageRecepientType, MessagesNavigationItemType, LabelListType, LabelType } from '~/reducers/main-function/messages';
import { displayNotification } from '~/actions/base/notifications';
import { hexToColorInt, colorIntToHex } from '~/util/modifiers';
import { getApiId, loadMessagesHelper, setLabelStatusCurrentMessage, setLabelStatusSelectedMessages } from './helpers';
import { ContactRecepientType } from '~/reducers/main-function/user-index';
import { StatusType } from '~/reducers/base/status';

export interface UpdateMessageThreadsCountTriggerType {
  ( value?: number ): AnyActionType
}

export interface UPDATE_UNREAD_MESSAGE_THREADS_COUNT extends SpecificActionType<"UPDATE_UNREAD_MESSAGE_THREADS_COUNT", number> { }
export interface UPDATE_MESSAGE_THREADS extends SpecificActionType<"UPDATE_MESSAGE_THREADS", MessageThreadListType> { }
export interface SET_CURRENT_MESSAGE_THREAD extends SpecificActionType<"SET_CURRENT_MESSAGE_THREAD", MessageThreadExpandedType> { }
export interface UPDATE_MESSAGES_STATE extends SpecificActionType<"UPDATE_MESSAGES_STATE", MessagesStateType> { }
export interface UPDATE_MESSAGES_ALL_PROPERTIES extends SpecificActionType<"UPDATE_MESSAGES_ALL_PROPERTIES", MessagesPatchType> { }
export interface UPDATE_MESSAGE_THREAD_ADD_LABEL extends SpecificActionType<"UPDATE_MESSAGE_THREAD_ADD_LABEL", {
  communicatorMessageId: number,
  label: MessageThreadLabelType
}> { }
export interface UPDATE_MESSAGE_THREAD_DROP_LABEL extends SpecificActionType<"UPDATE_MESSAGE_THREAD_DROP_LABEL", {
  communicatorMessageId: number,
  label: MessageThreadLabelType
}> { }
export interface PUSH_ONE_MESSAGE_THREAD_FIRST extends SpecificActionType<"PUSH_ONE_MESSAGE_THREAD_FIRST", MessageThreadType> { }
export interface LOCK_TOOLBAR extends SpecificActionType<"LOCK_TOOLBAR", null> { }
export interface UNLOCK_TOOLBAR extends SpecificActionType<"UNLOCK_TOOLBAR", null> { }
export interface UPDATE_ONE_MESSAGE_THREAD extends SpecificActionType<"UPDATE_ONE_MESSAGE_THREAD", {
  thread: MessageThreadType,
  update: MessageThreadUpdateType
}> { }
export interface UPDATE_MESSAGES_SIGNATURE extends SpecificActionType<"UPDATE_MESSAGES_SIGNATURE", MessageSignatureType> { }
export interface DELETE_MESSAGE_THREAD extends SpecificActionType<"DELETE_MESSAGE_THREAD", MessageThreadType> { }
export interface UPDATE_SELECTED_MESSAGE_THREADS extends SpecificActionType<"UPDATE_SELECTED_MESSAGE_THREADS", MessageThreadListType> { }
export interface ADD_TO_MESSAGES_SELECTED_THREADS extends SpecificActionType<"ADD_TO_MESSAGES_SELECTED_THREADS", MessageThreadType> { }
export interface REMOVE_FROM_MESSAGES_SELECTED_THREADS extends SpecificActionType<"REMOVE_FROM_MESSAGES_SELECTED_THREADS", MessageThreadType> { }
export interface PUSH_MESSAGE_LAST_IN_CURRENT_THREAD extends SpecificActionType<"PUSH_MESSAGE_LAST_IN_CURRENT_THREAD", MessageType> { }
export interface UPDATE_MESSAGES_NAVIGATION_LABELS extends SpecificActionType<"UPDATE_MESSAGES_NAVIGATION_LABELS", MessagesNavigationItemListType>{}
export interface ADD_MESSAGES_NAVIGATION_LABEL extends SpecificActionType<"ADD_MESSAGES_NAVIGATION_LABEL", MessagesNavigationItemType>{}
export interface UPDATE_ONE_LABEL_FROM_ALL_MESSAGE_THREADS extends SpecificActionType<"UPDATE_ONE_LABEL_FROM_ALL_MESSAGE_THREADS", {
  labelId: number,
  update: {
    labelName: string,
    labelColor: number
  }
}>{}
export interface UPDATE_MESSAGES_NAVIGATION_LABEL extends SpecificActionType<"UPDATE_MESSAGES_NAVIGATION_LABEL", {
  labelId: number,
  update: {
    text: ()=>string,
    color: string
  }
}>{}
export interface DELETE_MESSAGE_THREADS_NAVIGATION_LABEL extends SpecificActionType<"DELETE_MESSAGE_THREADS_NAVIGATION_LABEL", {
  labelId: number
}>{}
export interface REMOVE_ONE_LABEL_FROM_ALL_MESSAGE_THREADS extends SpecificActionType<"REMOVE_ONE_LABEL_FROM_ALL_MESSAGE_THREADS", {
  labelId: number
}>{}


let updateUnreadMessageThreadsCount: UpdateMessageThreadsCountTriggerType = function updateUnreadMessageThreadsCount( value ) {
  if ( typeof value !== "undefined" ) {
    return {
      type: "UPDATE_UNREAD_MESSAGE_THREADS_COUNT",
      payload: value
    }
  }

  return async ( dispatch: ( arg: AnyActionType ) => any, getState: () => StateType ) => {
    try {
      dispatch( {
        type: "UPDATE_UNREAD_MESSAGE_THREADS_COUNT",
        payload: <number>( await ( promisify( mApi().communicator.receiveditemscount.cacheClear().read(), 'callback' )() ) || 0 )
      } );
    } catch ( err ) {
      dispatch( displayNotification( err.message, 'error' ) );
    }
  }
}

export interface LoadLastMessageThreadsFromSeverTriggerType {
  ( maxResults: number ): AnyActionType
}

let loadLastMessageThreadsFromServer: LoadLastMessageThreadsFromSeverTriggerType = function loadLastMessageThreadsFromServer( maxResults ) {
  return async ( dispatch: ( arg: AnyActionType ) => any, getState: () => StateType ) => {
    try {
      dispatch( {
        type: 'UPDATE_MESSAGE_THREADS',
        payload: <MessageThreadListType>( await promisify( mApi().communicator.items.read( {
          'firstResult': 0,
          'maxResults': maxResults
        } ), 'callback' )() )
      } );
    } catch ( err ) {
      dispatch( displayNotification( err.message, 'error' ) );
    }
  }
}

export interface SendMessageTriggerType {
  ( message: {
    to: ContactRecepientType[],
    replyThreadId: number,
    subject: string,
    text: string,
    success?: () => any,
    fail?: () => any
  } ): AnyActionType
}

export interface LoadMessageThreadsTriggerType {
  ( location: string ): AnyActionType
}

export interface UpdateMessagesSelectedThreads {
  ( threads: MessageThreadListType ): AnyActionType
}

export interface AddToMessagesSelectedThreadsTriggerType {
  ( thread: MessageThreadType ): AnyActionType
}

export interface LoadMoreMessageThreadsTriggerType {
  (): AnyActionType
}

export interface RemoveFromMessagesSelectedThreadsTriggerType {
  ( thread: MessageThreadType ): AnyActionType
}

export interface AddLabelToSelectedMessageThreadsTriggerType {
  ( label: MessageThreadLabelType ): AnyActionType
}

export interface RemoveLabelFromSelectedMessageThreadsTriggerType {
  ( label: MessageThreadLabelType ): AnyActionType
}

export interface AddLabelToCurrentMessageThreadTriggerType {
  ( label: MessageThreadLabelType ): AnyActionType
}

export interface RemoveLabelFromCurrentMessageThreadTriggerType {
  ( label: MessageThreadLabelType ): AnyActionType
}

export interface ToggleMessageThreadReadStatusTriggerType {
  ( thread: MessageThreadType ): AnyActionType
}

export interface DeleteSelectedMessageThreadsTriggerType {
  (): AnyActionType
}

export interface DeleteCurrentMessageThreadTriggerType {
  (): AnyActionType
}

export interface LoadMessageThreadTriggerType {
  ( location: string, messageId: number ): AnyActionType
}

export interface LoadNewlyReceivedMessageTriggerType {
  (): AnyActionType
}

export interface LoadSignatureTriggerType {
  (): AnyActionType
}

export interface UpdateSignatureTriggerType {
  ( newSignature: string ): AnyActionType
}

/////////////////// ACTUAL DEFINITIONS
let sendMessage: SendMessageTriggerType = function sendMessage( message ) {
  let recepientWorkspaces = message.to.filter( x => x.type === "workspace" ).map( x => x.value.id )
  let data = {
    caption: message.subject,
    content: message.text,
    categoryName: "message",
    recipientIds: message.to.filter( x => x.type === "user" ).map( x => x.value.id ),
    recipientGroupIds: message.to.filter( x => x.type === "usergroup" ).map( x => x.value.id ),
    recipientStudentsWorkspaceIds: recepientWorkspaces,
    recipientTeachersWorkspaceIds: recepientWorkspaces
  };

  return async ( dispatch: ( arg: AnyActionType ) => any, getState: () => StateType ) => {
    try {
      let result: MessageType;
      if ( message.replyThreadId ) {
        result = <MessageType>await promisify( mApi().communicator.messages.create( message.replyThreadId, data ), 'callback' )();
      } else {
        result = <MessageType>await promisify( mApi().communicator.messages.create( data ), 'callback' )();
      }

      mApi().communicator.sentitems.cacheClear();
      message.success && message.success();

      let state = getState();
      let status: StatusType = state.status;

      const isInboxOrUnread = state.messages.location === "inbox" || state.messages.location === "unread"
      if ( state.messages.location === "sent" || ( isInboxOrUnread && result.recipients
          .find( ( recipient: MessageRecepientType ) => {return recipient.userId === status.userId} ) ) ) {
        let item = state.messages.navigation.find((item)=>{
          return item.location === state.messages.location;
        } );
        if ( !item ) {
          return;
        }
        let params = {
          firstResult: 0,
          maxResults: 1,
        }

        try {
          let threads: MessageThreadListType = <MessageThreadListType>await promisify( mApi().communicator[getApiId( item )].read( params ), 'callback' )();
          if ( threads[0] ) {
            dispatch( {
              type: "PUSH_ONE_MESSAGE_THREAD_FIRST",
              payload: threads[0]
            } );
            if ( state.messages.location !== "sent" ) {
              dispatch( updateUnreadMessageThreadsCount( state.messages.unreadThreadCount + 1 ) );
            }

            if ( state.messages.currentThread && state.messages.currentThread.messages[0].communicatorMessageId === result.communicatorMessageId ) {
              dispatch({
                type: "PUSH_MESSAGE_LAST_IN_CURRENT_THREAD",
                payload: result
              });
              if ( state.messages.location !== "sent" ) {
                dispatch( toggleMessageThreadReadStatus( threads[0] ) );
              }
            }

          }
        } catch ( err ) { }
      }
    } catch ( err ) {
      dispatch( displayNotification( err.message, 'error' ) );
      message.fail && message.fail();
    }
  }
}

let loadMessageThreads: LoadMessageThreadsTriggerType = function loadMessageThreads( location ) {
  return loadMessagesHelper.bind( this, location, true );
}

let updateMessagesSelectedThreads: UpdateMessagesSelectedThreads = function updateMessagesSelectedThreads( threads ) {
  return {
    type: "UPDATE_SELECTED_MESSAGE_THREADS",
    payload: threads
  };
}

let addToMessagesSelectedThreads: AddToMessagesSelectedThreadsTriggerType = function addToMessagesSelectedThreads( thread ) {
  return {
    type: "ADD_TO_MESSAGES_SELECTED_THREADS",
    payload: thread
  };
}

let removeFromMessagesSelectedThreads: RemoveFromMessagesSelectedThreadsTriggerType = function removeFromMessagesSelectedThreads( thread ) {
  return {
    type: "REMOVE_FROM_MESSAGES_SELECTED_THREADS",
    payload: thread
  };
}

let loadMoreMessageThreads: LoadMoreMessageThreadsTriggerType = function loadMoreMessageThreads() {
  return loadMessagesHelper.bind( this, null, false );
}

let addLabelToSelectedMessageThreads: AddLabelToSelectedMessageThreadsTriggerType = function addLabelToSelectedMessageThreads( label ) {
  return setLabelStatusSelectedMessages.bind( this, label, true );
}

let removeLabelFromSelectedMessageThreads: RemoveLabelFromSelectedMessageThreadsTriggerType = function removeLabelFromSelectedMessageThreads( label ) {
  return setLabelStatusSelectedMessages.bind( this, label, false );
}

let addLabelToCurrentMessageThread: AddLabelToCurrentMessageThreadTriggerType = function addLabelToCurrentMessageThread( label ) {
  return setLabelStatusCurrentMessage.bind( this, label, true );
}

let removeLabelFromCurrentMessageThread: RemoveLabelFromCurrentMessageThreadTriggerType = function removeLabelFromCurrentMessageThread( label ) {
  return setLabelStatusCurrentMessage.bind( this, label, false );
}

let toggleMessageThreadReadStatus: ToggleMessageThreadReadStatusTriggerType = function toggleMessageThreadReadStatus( thread ) {
  return async ( dispatch: ( arg: AnyActionType ) => any, getState: () => StateType ) => {
    dispatch( {
      type: "LOCK_TOOLBAR",
      payload: null
    } );

    let state = getState();

    let item = state.messages.navigation.find((item) => {
      return item.location === state.messages.location;
    } );
    if ( !item ) {
      //TODO translate this
      dispatch(displayNotification("Invalid navigation location",'error'));
      dispatch({
        type: "UNLOCK_TOOLBAR",
        payload: null
      });
      return;
    }

    dispatch( {
      type: "UPDATE_ONE_MESSAGE_THREAD",
      payload: {
        thread,
        update: {
          unreadMessagesInThread: !thread.unreadMessagesInThread
        }
      }
    });

    try {
      if ( thread.unreadMessagesInThread ) {
        dispatch( updateUnreadMessageThreadsCount( state.messages.unreadThreadCount - 1 ) );
        await promisify( mApi().communicator[getApiId( item )].markasread.create( thread.communicatorMessageId ), 'callback' )();
      } else {
        dispatch( updateUnreadMessageThreadsCount( state.messages.unreadThreadCount + 1 ) );
        await promisify( mApi().communicator[getApiId( item )].markasunread.create( thread.communicatorMessageId ), 'callback' )();
      }
    } catch ( err ) {
      dispatch( displayNotification( err.message, 'error' ) );
      dispatch( {
        type: "UPDATE_ONE_MESSAGE_THREAD",
        payload: {
          thread,
          update: {
            unreadMessagesInThread: thread.unreadMessagesInThread
          }
        }
      } );
      dispatch( updateUnreadMessageThreadsCount( state.messages.unreadThreadCount ) );
    }

    mApi().communicator[getApiId( item )].cacheClear();
    dispatch( {
      type: "UNLOCK_TOOLBAR",
      payload: null
    } );
  }
}

let deleteSelectedMessageThreads: DeleteSelectedMessageThreadsTriggerType = function deleteSelectedMessageThreads() {
  return async ( dispatch: ( arg: AnyActionType ) => any, getState: () => StateType ) => {
    dispatch({
      type: "LOCK_TOOLBAR",
      payload: null
    });

    let state = getState();

    let item = state.messages.navigation.find((item)=>{
      return item.location === state.messages.location;
    });
    if ( !item ) {
      //TODO translate this
      dispatch(displayNotification("Invalid navigation location",'error'));
      dispatch( {
        type: "UNLOCK_TOOLBAR",
        payload: null
      } );
      return;
    }
    
    let messageUnreadThreadCount:number = state.messages.unreadThreadCount;
    
    await Promise.all(state.messages.selectedThreads.map(async( thread) => {
      try {
        await promisify( mApi().communicator[getApiId( item )].del( thread.communicatorMessageId ), 'callback' )();
        if ( thread.unreadMessagesInThread ) {
          messageUnreadThreadCount--;
        }
        dispatch( {
          type: "DELETE_MESSAGE_THREAD",
          payload: thread
        } );
      } catch ( err ) {
        dispatch(displayNotification( err.message, 'error' ) );
      }
    }));

    mApi().communicator[getApiId( item )].cacheClear();
    dispatch( {
      type: "UNLOCK_TOOLBAR",
      payload: null
    });
    dispatch(updateUnreadMessageThreadsCount(messageUnreadThreadCount));
  }
}

let deleteCurrentMessageThread: DeleteCurrentMessageThreadTriggerType = function deleteCurrentMessageThread() {
  return async ( dispatch: ( arg: AnyActionType ) => any, getState: () => StateType ) => {
    dispatch({
      type: "LOCK_TOOLBAR",
      payload: null
    });

    let state = getState();
    
    let item = state.messages.navigation.find((item)=>{
      return item.location === state.messages.location;
    });
    if ( !item ) {
      //TODO translate this
      dispatch(displayNotification( "Invalid navigation location", 'error' ) );
      dispatch( {
        type: "UNLOCK_TOOLBAR",
        payload: null
      } );
      return;
    }

    let communicatorMessageId = state.messages.currentThread.messages[0].communicatorMessageId;

    try {
      await promisify( mApi().communicator[getApiId( item )].del( communicatorMessageId ), 'callback' )();
      let toDeleteMessageThread:MessageThreadType = state.messages.threads.find((message) => message.communicatorMessageId === communicatorMessageId );
      if (toDeleteMessageThread){
        dispatch({
          type: "DELETE_MESSAGE_THREAD",
          payload: toDeleteMessageThread
        });
      }
    } catch ( err ) {
      dispatch(displayNotification( err.message, 'error' ) );
    }

    mApi().communicator[getApiId(item)].cacheClear();
    dispatch({
      type: "UNLOCK_TOOLBAR",
      payload: null
    });

    //SADLY the current message doesn't have a mention on wheter
    //The message is read or unread so the message count has to be recalculated
    //by server logic
    dispatch(updateUnreadMessageThreadsCount());

    location.hash = "#" + item.location;
  }
}

let loadMessageThread: LoadMessageThreadTriggerType = function loadMessageThread( location, messageId ) {
  return async ( dispatch: ( arg: AnyActionType ) => any, getState: () => StateType ) => {

    let state = getState();

    let item = state.messages.navigation.find((item)=>{
      return item.location === location;
    });
    if ( !item ) {
      //TODO translate this
      dispatch(displayNotification("Invalid navigation location", 'error'));
      return;
    }

    let currentThread: MessageThreadExpandedType;
    try {
      currentThread = <MessageThreadExpandedType>await promisify( mApi().communicator[getApiId( item, true )].read( messageId ), 'callback' )();
      dispatch({
        type: "UPDATE_MESSAGES_ALL_PROPERTIES",
        payload: {
          currentThread: currentThread,
          location
        }
      });
    } catch ( err ) {
      dispatch(displayNotification(err.message,'error'));
    }

    let existantMessage:MessageThreadType = state.messages.threads.find((message)=>{
      return message.communicatorMessageId === currentThread.messages[0].communicatorMessageId;
    });

    if ( existantMessage && existantMessage.unreadMessagesInThread ) {
      dispatch( toggleMessageThreadReadStatus( existantMessage ) );
    } else if ( !existantMessage ) {
      try {
        await promisify( mApi().communicator[getApiId( item )].markasread.create( currentThread.messages[0].communicatorMessageId ), 'callback' )();
      } catch ( err ) {
      }
    }
  }
}

let loadNewlyReceivedMessage: LoadNewlyReceivedMessageTriggerType = function loadNewlyReceivedMessage() {
  return async ( dispatch: ( arg: AnyActionType ) => any, getState: () => StateType ) => {

    let state = getState();

    if ( state.messages.location === "unread" || state.messages.location === "inbox" ) {
      let item = state.messages.navigation.find((item)=>{
        return item.location === state.messages.location;
      } );

      if ( !item ) {
        return;
      }

      let params = {
        firstResult: 0,
        maxResults: 1,
        onlyUnread: true
      }

      try {
        let threads: MessageThreadListType = <MessageThreadListType>await promisify( mApi().communicator[getApiId( item )].read( params ), 'callback' )();
        if ( threads[0] ) {
          let result: MessageThreadExpandedType = <MessageThreadExpandedType>await promisify( mApi().communicator.communicatormessages.read( threads[0].id, params ), 'callback' )();
          dispatch({
            type: "PUSH_ONE_MESSAGE_THREAD_FIRST",
            payload: threads[0]
          });
          if (state.messages.currentThread && state.messages.currentThread.messages[0].communicatorMessageId === threads[0].communicatorMessageId ) {
            dispatch({
              type: "PUSH_MESSAGE_LAST_IN_CURRENT_THREAD",
              payload: result.messages[0]
            });
            dispatch(toggleMessageThreadReadStatus(threads[0]));
          }
        }
      } catch ( err ) { }
    }
  }
}

let loadSignature: LoadSignatureTriggerType = function loadSignature() {
  return async ( dispatch: ( arg: AnyActionType ) => any, getState: () => StateType ) => {
    try {
      let signatures: Array<MessageSignatureType> = <Array<MessageSignatureType>>await promisify( mApi().communicator.signatures.read(), 'callback' )();
      if ( signatures.length > 0 ) {
        dispatch( {
          type: "UPDATE_MESSAGES_SIGNATURE",
          payload: signatures[0]
        } );
      }
    } catch ( err ) {
      dispatch(displayNotification( err.message, 'error' ) );
    }
  }
}

let updateSignature: UpdateSignatureTriggerType = function updateSignature( newSignature ) {
  return async ( dispatch: ( arg: AnyActionType ) => any, getState: () => any ) => {
    let state = getState();

    try {
      if ( newSignature && state.messages.signature ) {
        let nSignatureShape: MessageSignatureType = <MessageSignatureType>{ id: state.messages.signature.id, name: state.messages.signature.name, signature: newSignature };
        let payload: MessageSignatureType = <MessageSignatureType>await promisify( mApi().communicator.signatures.update( state.messages.signature.id, nSignatureShape ), 'callback' )();
        dispatch( {
          type: "UPDATE_MESSAGES_SIGNATURE",
          payload
        } );
      } else if ( newSignature ) {
        let payload: MessageSignatureType = <MessageSignatureType>await promisify( mApi().communicator.signatures.create( { name: "standard", signature: newSignature } ), 'callback' )();
        dispatch( {
          type: "UPDATE_MESSAGES_SIGNATURE",
          payload
        } );
      } else {
        await promisify( mApi().communicator.signatures.del( state.messages.signature.id ), 'callback' )();
        dispatch( {
          type: "UPDATE_MESSAGES_SIGNATURE",
          payload: null
        } );
      }
    } catch ( err ) {
      dispatch( displayNotification( err.message, 'error' ) );
    }
  }
}

export interface LoadMessagesNavigationLabelsTriggerType {
  (callback: ()=>any):AnyActionType
}

export interface AddMessagesNavigationLabelTriggerType {
  (name: string):AnyActionType
}

export interface UpdateMessagesNavigationLabelTriggerType {
  (label:MessagesNavigationItemType, newName:string, newColor:string):AnyActionType
}

export interface RemoveMessagesNavigationLabelTriggerType {
  (label: MessagesNavigationItemType):AnyActionType
}

let loadMessagesNavigationLabels:LoadMessagesNavigationLabelsTriggerType = function loadMessagesNavigationLabels(callback){
  return async (dispatch:(arg:AnyActionType)=>any, getState:()=>any)=>{
    try {
      let labels:LabelListType = <LabelListType>await promisify(mApi().communicator.userLabels.read(), 'callback')();
      dispatch({
        type: 'UPDATE_MESSAGES_NAVIGATION_LABELS',
        payload: labels.map((label: LabelType)=>{
          return {
            location: "label-" + label.id,
            id: label.id,
            type: "label",
            icon: "tag",
            text(){return label.name},
            color: colorIntToHex(label.color)
          }
        })
      });
      callback && callback();
    } catch (err) {
      dispatch(displayNotification(err.message, 'error'));
    }
  }
}

let addMessagesNavigationLabel:AddMessagesNavigationLabelTriggerType = function addMessagesNavigationLabel(name){
  return async (dispatch:(arg:AnyActionType)=>any, getState:()=>any)=>{
    let color = Math.round(Math.random() * 16777215);
    let label = {
      name,
      color
    };
    
    try {
      let newLabel:LabelType = <LabelType>await promisify(mApi().communicator.userLabels.create(label), 'callback')();
      dispatch({
        type: "ADD_MESSAGES_NAVIGATION_LABEL",
        payload: {
          location: "label-" + newLabel.id,
          id: newLabel.id,
          type: "label",
          icon: "tag",
          text(){return newLabel.name},
          color: colorIntToHex(newLabel.color)
        }
      });
    } catch (err){
      dispatch(displayNotification(err.message, 'error'));
    }
  }
}

let updateMessagesNavigationLabel:UpdateMessagesNavigationLabelTriggerType = function updateMessagesNavigationLabel(label, newName, newColor){
  return async (dispatch:(arg:AnyActionType)=>any, getState:()=>any)=>{
    let newLabelData = {
      name: newName,
      color: hexToColorInt(newColor),
      id: label.id
    };
    
    try {
      await promisify(mApi().communicator.userLabels.update(label.id, newLabelData), 'callback')();
      dispatch({
        type: "UPDATE_ONE_LABEL_FROM_ALL_MESSAGE_THREADS",
        payload: {
          labelId: <number>label.id,
          update: {
            labelName: newLabelData.name,
            labelColor: newLabelData.color
          }
        }
      });
      dispatch({
        type: "UPDATE_MESSAGES_NAVIGATION_LABEL",
        payload: {
          labelId: <number>label.id,
          update: {
            text: ()=>newLabelData.name,
            color: newColor
          }
        }
      });
    } catch(err){
      dispatch(displayNotification(err.message, 'error'));
    }
  }
}

let removeMessagesNavigationLabel:RemoveMessagesNavigationLabelTriggerType = function removeMessagesNavigationLabel(label){
  return async (dispatch:(arg:AnyActionType)=>any, getState:()=>StateType)=>{
    try {
      await promisify(mApi().communicator.userLabels.del(label.id), 'callback')();
      let {messages} = getState();
      
      //Notice this is an external trigger, not the nicest thing, but as long as we use hash navigation, meh
      if (messages.location === label.location){
        location.hash = "#inbox";
      }
      
      dispatch({
        type: "DELETE_MESSAGE_THREADS_NAVIGATION_LABEL",
        payload: {
          labelId: <number>label.id
        }
      });
      dispatch({
        type: "REMOVE_ONE_LABEL_FROM_ALL_MESSAGE_THREADS",
        payload: {
          labelId: <number>label.id
        }
      });
    } catch (err){
      dispatch(displayNotification(err.message, 'error'));
    }
  }
}

export {
  sendMessage, loadMessageThreads, updateMessagesSelectedThreads,
  addToMessagesSelectedThreads, removeFromMessagesSelectedThreads,
  loadMoreMessageThreads, addLabelToSelectedMessageThreads, removeLabelFromSelectedMessageThreads,
  addLabelToCurrentMessageThread, removeLabelFromCurrentMessageThread, toggleMessageThreadReadStatus,
  deleteSelectedMessageThreads, deleteCurrentMessageThread, loadMessageThread, loadNewlyReceivedMessage,
  loadSignature, updateSignature, updateUnreadMessageThreadsCount, loadLastMessageThreadsFromServer,
  loadMessagesNavigationLabels, addMessagesNavigationLabel, updateMessagesNavigationLabel, removeMessagesNavigationLabel
}