import * as React from 'react';
import {connect, Dispatch} from 'react-redux';

import ApplicationPanel from '~/components/general/application-panel';
import Dropdown from '~/components/general/dropdown';
import Link from '~/components/general/link';
import { i18nType } from 'reducers/base/i18n';

import Students from './application/students';
import Toolbar from './application/toolbar';
import CurrentStudent from './application/current-student';
import {StateType} from '~/reducers';

interface GuiderApplicationProps {
  aside: React.ReactElement<any>,
  i18n: i18nType
}

interface GuiderApplicationState {
}

class GuiderApplication extends React.Component<GuiderApplicationProps, GuiderApplicationState> {
  constructor(props: GuiderApplicationProps){
    super(props);
  }
  
  render(){
    let title = <h2 className="text text--application-title">{this.props.i18n.text.get('plugin.guider.guider')}</h2>
    let toolbar = <Toolbar/>
    let primaryOption = <div className="form-element"><select className="form-element__select form-element__select--main-action" disabled>
      <option>{this.props.i18n.text.get("plugin.guider.students.all")}</option>
      </select>
    </div>
    return (<div className="container container--full">
      <ApplicationPanel modifier="coursepicker" primaryOption={primaryOption} toolbar={toolbar} title={title} asideBefore={this.props.aside}>
        <Students/>
        <CurrentStudent/>
      </ApplicationPanel>
    </div>);
  }
}

function mapStateToProps(state: StateType){
  return {
    i18n: state.i18n
  }
};

function mapDispatchToProps(dispatch: Dispatch<any>){
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GuiderApplication);