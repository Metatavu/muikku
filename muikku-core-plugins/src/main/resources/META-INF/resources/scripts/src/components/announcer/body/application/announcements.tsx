import * as React from 'react';
import {connect, Dispatch} from 'react-redux';
import {bindActionCreators} from 'redux';
import {colorIntToHex} from '~/util/modifiers';
import equals = require("deep-equal");
import {StateType} from '~/reducers';

import NewEditAnnouncement from './new-edit-announcement';

import {i18nType} from '~/reducers/base/i18n';

import '~/sass/elements/empty.scss';
import '~/sass/elements/loaders.scss';
import '~/sass/elements/application-list.scss';
import '~/sass/elements/text.scss';
import '~/sass/elements/announcement.scss';

import { AnnouncementsType, AnnouncementType } from '~/reducers/main-function/announcer/announcements';
import BodyScrollKeeper from '~/components/general/body-scroll-keeper';
import SelectableList from '~/components/general/selectable-list';
import Link from '~/components/general/link';
import { AddToAnnouncementsSelectedTriggerType, RemoveFromAnnouncementsSelectedTriggerType,
  removeFromAnnouncementsSelected, addToAnnouncementsSelected } from '~/actions/main-function/announcer/announcements';
import DeleteAnnouncementDialog from '../delete-announcement-dialog';

interface AnnouncementsProps {
  i18n: i18nType,
  announcements: AnnouncementsType,
  addToAnnouncementsSelected: AddToAnnouncementsSelectedTriggerType,
  removeFromAnnouncementsSelected: RemoveFromAnnouncementsSelectedTriggerType
}

interface AnnouncementsState {

}

class Announcements extends React.Component<AnnouncementsProps, AnnouncementsState> {
  setCurrentAnnouncement(announcement: AnnouncementType){
    window.location.hash = window.location.hash.split("/")[0] + "/" + announcement.id;
  }
  render(){
    return (<BodyScrollKeeper hidden={!!this.props.announcements.current}>
        <SelectableList className="application-list"
          selectModeClassAddition="application-list--select-mode" dataState={this.props.announcements.state}>
          {this.props.announcements.announcements.map((announcement: AnnouncementType)=>{
            let className = announcement.workspaces.length ? 
                'application-list__item announcement announcement--workspace' :
                'application-list__item announcement announcement--environment';
            return {
              className,
              onSelect: this.props.addToAnnouncementsSelected.bind(null, announcement),
              onDeselect: this.props.removeFromAnnouncementsSelected.bind(null, announcement),
              onEnter: this.setCurrentAnnouncement.bind(this, announcement),
              isSelected: this.props.announcements.selectedIds.includes(announcement.id),
              key: announcement.id,
              notSelectable: announcement.archived,
              notSelectableModifier: "archived",
              contents: (checkbox: React.ReactElement<any>)=>{
                return <div className="application-list__item-content-wrapper announcement__content">
                  <div className="application-list__item-content application-list__item-content--aside">
                    <div className="announcement__select-container">
                      {checkbox}
                    </div>
                  </div>
                  <div className="application-list__item-content application-list__item-content--main">
                    <div className="application-list__item-header">
                      <div className="text text--announcer-announcement-header">
                        <span className="text__icon icon-clock"></span>
                        <span className="text text--announcer-times">
                          {this.props.i18n.time.format(announcement.startDate)} - {this.props.i18n.time.format(announcement.endDate)}
                        </span>
                      </div> 
                    </div>                  
                    <div className="application-list__item-body">
                      <article className="text text--item-article">
                        <header className="text text--item-article-header">{announcement.caption}</header>
                        <p dangerouslySetInnerHTML={{__html:announcement.content}}></p>
                      </article>
                    </div>
                    {/* This should be shown only if announcement has workspaces set */}    
                    {announcement.workspaces ? <div className="application-list__item-meta">
                      {announcement.workspaces.map((workspace)=>{
                      return <div className="text text--announcement-workspace" key={workspace.id}> 
                        <span className="text__icon text__icon--announcement-workspace icon-books"></span>
                        <span className="text text--announcement-workspace-name">
                          {workspace.name}
                        </span>
                      </div>
                      })}    
                    </div> : null}
                    <div className="application-list__item-footer">  
                      <NewEditAnnouncement announcement={announcement}>
                        <Link className="link link--application-list-item-footer">{this.props.i18n.text.get('plugin.announcer.link.edit')}</Link>
                      </NewEditAnnouncement>
                      <DeleteAnnouncementDialog announcement={announcement}>
                        <Link className="link link--application-list-item-footer">{this.props.i18n.text.get('plugin.announcer.link.delete')}</Link>
                      </DeleteAnnouncementDialog>
                    </div>
                  </div>
                </div>
             }
            }
          })}
        </SelectableList>
    </BodyScrollKeeper>);
  }
}

//TODO yet another one with the different version
function mapStateToProps(state: StateType){
  return {
    i18n: state.i18n,
    announcements: (state as any).announcements
  }
};

function mapDispatchToProps(dispatch: Dispatch<any>){
  return bindActionCreators({
    addToAnnouncementsSelected,
    removeFromAnnouncementsSelected
  }, dispatch);
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Announcements);
