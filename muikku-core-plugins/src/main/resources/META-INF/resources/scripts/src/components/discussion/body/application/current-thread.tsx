import { UserIndexType } from "~/reducers/main-function/user-index";
import * as React from "react";
import { i18nType } from "~/reducers/base/i18n";
import { DiscussionType, DiscussionThreadReplyType } from "~/reducers/main-function/discussion/discussion-threads";
import { Dispatch, connect } from "react-redux";
import Pager from "~/components/general/pager";
import Link from "~/components/general/link";
import ReplyThread from './reply-thread-dialog';
import ModifyThread from './modify-thread-dialog';
import DeleteThreadComponent from './delete-thread-component-dialog';
import ModifyThreadReply from './modify-thread-reply-dialog';
import '~/sass/elements/application-list.scss';
import '~/sass/elements/text.scss';
import '~/sass/elements/container.scss';
import '~/sass/elements/message.scss';
import '~/sass/elements/avatar.scss';
import { getName, getUserImageUrl } from "~/util/modifiers";
import {StateType} from '~/reducers';

interface CurrentThreadProps {
  discussionThreads: DiscussionType,
  i18n: i18nType,
  userIndex: UserIndexType,
  userId: number,
  permissions: any
}

interface CurrentThreadState {
  
}

class CurrentThread extends React.Component<CurrentThreadProps, CurrentThreadState> {
  getToPage(n: number){
    if (this.props.discussionThreads.areaId === this.props.discussionThreads.current.forumAreaId){
      window.location.hash = this.props.discussionThreads.current.forumAreaId + "/" + this.props.discussionThreads.page +
      "/" + this.props.discussionThreads.current.id + "/" + n;
    }
    window.location.hash = this.props.discussionThreads.current.forumAreaId + "/1" +
      "/" + this.props.discussionThreads.current.id + "/" + n;
  }
  
  render(){
    if (!this.props.discussionThreads.current){
      return null;
    }
    let areaPermissions = this.props.permissions.AREA_PERMISSIONS[this.props.discussionThreads.current.forumAreaId] || {};
    
    //Again note that the user might not be ready
    let userCreator = this.props.userIndex.users[this.props.discussionThreads.current.creator];
    let userCategory = this.props.discussionThreads.current.creator > 10 ? this.props.discussionThreads.current.creator % 10 + 1 : this.props.discussionThreads.current.creator;
    let avatar;
    if (!userCreator){
      //This is what it shows when the user is not ready
      avatar = <div className="avatar avatar--category-1"></div>;
    } else {
      //This is what it shows when the user is ready
      avatar = <object className="container container--discussion-profile-image"
        data={getUserImageUrl(userCreator)}
        type="image/jpeg">
          <div className={`avatar avatar--category-${userCategory}`}>{userCreator.firstName[0]}</div>
       </object>;
    }
    
    let canRemoveThread = this.props.userId === this.props.discussionThreads.current.creator || areaPermissions.removeThread;
    let canEditThread = this.props.userId === this.props.discussionThreads.current.creator || areaPermissions.editMessage;

        
    return <div className="application-list application-list--open ">
        <div className="application-list__item-header">
          <h3 className="text text--discussion-current-thread-title">{this.props.discussionThreads.current.title}</h3>
        </div>
        <div className="application-list__item--discussion-current-thread">
          <div className="application-list__item-content-container message message--discussion message--discussion-thread-op">
            <div className="application-list__item-content-wrapper message__content">       
              <div className="application-list__item-content--aside message__content-aside--discussion">
                <div className="avatar avatar--category-1">{avatar}</div>
              </div>
              <div className="application-list__item-content--main">
                <div className="application-list__item-header">    
                  <div className="application-list__item-header-main">
                    <span className="text text--discussion-message-creator">{getName(userCreator)}</span> 
                  </div>                  
                  <div className="application-list__item-header-aside">
                    <span className="text">{this.props.i18n.time.format(this.props.discussionThreads.current.created)}</span>
                  </div>              
                </div>                        
                <div className="application-list__item-body">
                  <article className="text text--item-article" dangerouslySetInnerHTML={{__html: this.props.discussionThreads.current.message}}></article>
                </div>
                <div className="application-list__item-footer application-list__item-footer--discussion container container--message-actions">
                  <ReplyThread>
                    <Link as="span" className="link link--application-list-item-footer">{this.props.i18n.text.get("plugin.discussion.reply.message")}</Link>
                  </ReplyThread>              
                  <ReplyThread quote={this.props.discussionThreads.current.message} quoteAuthor={getName(userCreator)}>
                    <Link as="span" className="link link--application-list-item-footer">{this.props.i18n.text.get("plugin.discussion.reply.quote")}</Link>
                  </ReplyThread>                
                  {canEditThread ? <ModifyThread thread={this.props.discussionThreads.current}><Link as="span" className="link link--application-list-item-footer">{this.props.i18n.text.get("plugin.discussion.reply.edit")}</Link></ModifyThread> : null}
                  {canRemoveThread ? 
                  <DeleteThreadComponent>
                    <Link as="span" className="link link--application-list-item-footer">{this.props.i18n.text.get("plugin.discussion.reply.delete")}</Link>            
                  </DeleteThreadComponent> : null}
                </div>              
              </div>
            </div>
          </div>
        </div>
            
      {
        
        this.props.discussionThreads.currentReplies.map((reply: DiscussionThreadReplyType)=>{
          //Again note that the user might not be ready
          let user = this.props.userIndex.users[reply.creator];
          let userCategory = reply.creator > 10 ? reply.creator % 10 + 1 : reply.creator;                    
          let canRemoveMessage = this.props.userId === reply.creator || areaPermissions.removeThread;
          let canEditMessage = this.props.userId === reply.creator || areaPermissions.editMessages;
          
          let avatar;
          if (!user){
            //This is what it shows when the user is not ready
            avatar = <div className="avatar avatar--category-1"></div>;
          } else {
            //This is what it shows when the user is ready
            avatar = <object className="container container--discussion-profile-image"
              data={getUserImageUrl(user)}
              type="image/jpeg">
                <div className={`avatar  avatar--category-${userCategory}`}>{user.firstName[0]}</div>
             </object>;
          }          
          
          return ( 
            <div key={reply.id} className="application-list--open application-list__item--discussion-reply">
              <div className={`application-list__item-content-container message message--discussion ${reply.parentReplyId ? "message--discussion-reply-of-reply" : "message--discussion-reply-of-op"}`}>
                <div className="application-list__item-content-wrapper message__content">              
                  <div className="application-list__item-content--aside message__content-aside--discussion">
                    {avatar}
                  </div>            
                  <div className="application-list__item-content--main">                        
                    <div className="application-list__item-header">       
                      <div className="application-list__item-header-main">
                        <span className="text text--discussion-message-creator">{getName(user)}</span> 
                      </div>
                      <div className="application-list__item-header-aside">
                        <span className="text">{this.props.i18n.time.format(reply.created)}</span>
                      </div>
                    </div>                   
                    <div className="application-list__item__body">
                      {reply.deleted ? 
                        <article className="text text--item-article">[{this.props.i18n.text.get("plugin.discussion.reply.deleted")}]</article> :
                        <article className="text text--item-article" dangerouslySetInnerHTML={{__html: reply.message}}></article>}
                    </div>
                    <div className="application-list__item-footer application-list__item-footer--discussion container container--message-actions">
                      <ReplyThread reply={reply}>
                        <Link as="span" className="link link--application-list-item-footer">{this.props.i18n.text.get("plugin.discussion.reply.message")}</Link>
                      </ReplyThread>
                      <ReplyThread reply={reply}
                       quote={reply.message} quoteAuthor={getName(user)}>
                        <Link as="span" className="link link--application-list-item-footer">{this.props.i18n.text.get("plugin.discussion.reply.quote")}</Link>
                      </ReplyThread>
                      {canEditMessage ? <ModifyThreadReply reply={reply}>
                          <Link as="span" className="link link--application-list-item-footer">{this.props.i18n.text.get("plugin.discussion.reply.edit")}</Link>
                      </ModifyThreadReply> : null}
                      {canRemoveMessage ? <DeleteThreadComponent reply={reply}>
                        <Link as="span" className="link link--application-list-item-footer">{this.props.i18n.text.get("plugin.discussion.reply.delete")}</Link>
                      </DeleteThreadComponent> : null}
                    </div>                  
                  </div>
                </div>
              </div>
            </div>                    
          )})
      }
      <Pager onClick={this.getToPage} current={this.props.discussionThreads.currentPage} pages={this.props.discussionThreads.currentTotalPages}/>
    </div>
  }
}

function mapStateToProps(state: StateType){
  return {
    i18n: state.i18n,
    discussionThreads: (state as any).discussionThreads,
    userIndex: state.userIndex,
    userId: state.status.userId,
    permissions: state.status.permissions
  }
};

function mapDispatchToProps(dispatch: Dispatch<any>){
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CurrentThread);