import * as React from 'react';
import {connect, Dispatch} from 'react-redux';
import Link from '~/components/general/link';
import LabelUpdateDialog from './label-update-dialog';
import {CommunicatorNavigationItemListType, CommunicatorNavigationItemType} from '~/reducers/main-function/communicator/communicator-navigation';
import {i18nType} from '~/reducers/base/i18n';
import {CommunicatorMessagesType} from '~/reducers/main-function/communicator/communicator-messages';
import {StateType} from '~/reducers';

import '~/sass/elements/buttons.scss';
import '~/sass/elements/item-list.scss';

interface NavigationProps {
  i18n: i18nType,
  communicatorNavigation: CommunicatorNavigationItemListType,
  communicatorMessages: CommunicatorMessagesType
}

interface NavigationState {
  
}

class Navigation extends React.Component<NavigationProps, NavigationState> {
  render(){
    return <div className="item-list item-list--aside-navigation">
      {this.props.communicatorNavigation.map((item: CommunicatorNavigationItemType)=>{
        let style: any = {};
        if (item.color){
          style.color = item.color;
        }
        
        return <Link key={item.id} className={`item-list__item ${this.props.communicatorMessages.location === item.location ? "active" : ""}`} href={`#${item.location}`}>
          <span className={`item-list__icon icon-${item.icon}`} style={style}></span>
          <span className="item-list__text-body text">
            {item.text(this.props.i18n)}
          </span>
          {item.type === "label" ? <LabelUpdateDialog label={item}>
            <Link disablePropagation as="span" className="button-pill button-pill--navigation-edit-label">
              <span className="item-list__icon icon-edit"/>
            </Link>
          </LabelUpdateDialog> : null}
        </Link>
      })}
    </div>
  }
}

function mapStateToProps(state: StateType){
  return {
    i18n: state.i18n,
    communicatorNavigation: (state as any).communicatorNavigation,
    communicatorMessages: (state as any).communicatorMessages
  }
};

function mapDispatchToProps(dispatch: Dispatch<any>){
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Navigation);