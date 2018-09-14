import { i18nType } from "~/reducers/base/i18n";
import * as React from "react";
import { WorkspaceType } from "~/reducers/main-function/workspaces";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import {StateType} from '~/reducers';
import Dropdown from '~/components/general/dropdown';
import WorkspaceChart from './workspace/workspace-chart';

import '~/sass/elements/application-list.scss';
import '~/sass/elements/application-sub-panel.scss';
import '~/sass/elements/text.scss';
import '~/sass/elements/course.scss';
import '~/sass/elements/workspace-activity.scss';
import { ApplicationListItem, ApplicationListItemHeader } from "~/components/general/application-list";

interface StudentWorkspaceProps {
  i18n: i18nType,
  workspace: WorkspaceType
}

interface StudentWorkspaceState {
  activitiesVisible: boolean
}

function CourseActivityRow(props: {
  i18n: i18nType,  
  workspace: WorkspaceType,
  labelTranslationString: string,
  conditionalAttribute: string,
  conditionalAttributeLocale?: string,
  givenDateAttribute?: string,
  givenDateAttributeLocale?: string,
  mainAttribute: string
}){
  let output = "-";
  if (((props.workspace as any)[props.mainAttribute][props.conditionalAttribute] as number) > 0) {
    if (props.conditionalAttributeLocale){
      output = props.i18n.text.get(props.conditionalAttributeLocale, (props.workspace as any)[props.mainAttribute][props.conditionalAttribute]);
    } else {
      output = (props.workspace as any)[props.mainAttribute][props.conditionalAttribute];
    }
    
    if (props.givenDateAttribute){
      output += ", ";
      
      if (props.givenDateAttributeLocale){
        output += props.i18n.text.get(props.givenDateAttributeLocale, props.i18n.time.format((props.workspace as any)[props.mainAttribute][props.givenDateAttribute]));
      } else {
        output += props.i18n.time.format((props.workspace as any)[props.mainAttribute][props.givenDateAttribute]);
      }
    }
  }
  return <div className="application-sub-panel__item application-sub-panel__item--course-activity">
    <div className="application-sub-panel__item-title">{props.i18n.text.get(props.labelTranslationString)}</div>
    <div className="application-sub-panel__item-data">
      <span className="text text--guider-profile-value">{output}</span>
    </div>
  </div>
}

class StudentWorkspace extends React.Component<StudentWorkspaceProps, StudentWorkspaceState>{
  constructor(props: StudentWorkspaceProps){
    super(props);
    
    this.state = {
      activitiesVisible: false
    }
    
    this.toggleActivitiesVisible = this.toggleActivitiesVisible.bind(this);
  }
  toggleActivitiesVisible(){
    this.setState({
      activitiesVisible: !this.state.activitiesVisible
    })
  }
  render(){
    let workspace = this.props.workspace;
    
    let stateText;
    let extraClasses = "";
    switch (workspace.studentActivity.assessmentState.state){
      case "pending":
      case "pending_pass":
      case "pending_fail":
        stateText = "plugin.guider.assessmentState.PENDING";
        extraClasses = "state-PENDING";
        break;
      case "pass":
        stateText = "plugin.guider.assessmentState.PASS";
        extraClasses = "state-PASSED";
        break;
      case "fail":
        stateText = "plugin.guider.assessmentState.FAIL";
        extraClasses = "state-FAILED";
        break;
      case "incomplete":
        stateText = "plugin.guider.assessmentState.INCOMPLETE";
        extraClasses = "course--assessment-incomplete";
        break;
      default:
        stateText = "plugin.guider.assessmentState.UNASSESSED";
        break;
    }
    let resultingStateText = this.props.i18n.text.get(stateText);
    if (workspace.studentActivity.assessmentState.date){
      resultingStateText += " - " + this.props.i18n.time.format(workspace.studentActivity.assessmentState.date);
    }
    
    return <ApplicationListItem className={`course ${this.state.activitiesVisible ? "course--open" : ""} ${extraClasses}`}>
        <ApplicationListItemHeader modifiers="course" onClick={this.toggleActivitiesVisible}>
          <span className="text text--course-icon icon-books"></span>
          <span className="text text--list-item-title">{workspace.name} {workspace.nameExtension ? "(" + workspace.nameExtension + ")" : null}</span> 
          <span className="text text--list-item-type-title workspace-activity">
            <span className="workspace-activity__assignment-done-percent" title={this.props.i18n.text.get("plugin.guider.headerEvaluatedTitle", workspace.studentActivity.evaluablesDonePercent)}>{
              workspace.studentActivity.evaluablesDonePercent}%
            </span>
            <span> / </span>
            <span className="workspace-activity__exercise-done-percent" title={this.props.i18n.text.get("plugin.guider.headerExercisesTitle",workspace.studentActivity.exercisesDonePercent)}>{
              workspace.studentActivity.exercisesDonePercent}%
            </span>
          </span>
          <Dropdown modifier={"workspace-chart workspace-" + workspace.id} persistant={true} items={[<WorkspaceChart workspace={workspace}/>]}>
            <span className="icon-statistics chart__activator chart__activator--workspace-chart"></span>
          </Dropdown>
        </ApplicationListItemHeader>
        
        {this.state.activitiesVisible ? <div className="application-sub-panel text">      
          <div className="application-sub-panel__body">  
            <div className="application-sub-panel__item application-sub-panel__item--course-activity">
              <div className="application-sub-panel__item-title"> {this.props.i18n.text.get("plugin.guider.assessmentStateLabel")}</div>        
              <div className="application-sub-panel__item-data">
                <span className="text text--guider-profile-value">{resultingStateText}</span></div>
              </div>              
                
            <CourseActivityRow conditionalAttributeLocale="plugin.guider.user.details.numberOfVisits" givenDateAttributeLocale="plugin.guider.user.details.lastVisit" labelTranslationString="plugin.guider.visitedLabel" conditionalAttribute="numVisits"
              givenDateAttribute="lastVisit" mainAttribute="studentActivity" {...this.props}/>  
            
            <CourseActivityRow conditionalAttributeLocale="plugin.guider.user.details.numberOfJournalEntries" givenDateAttributeLocale="plugin.guider.user.details.lastJournalEntry" labelTranslationString="plugin.guider.journalEntriesLabel" conditionalAttribute="journalEntryCount"
              givenDateAttribute="lastJournalEntry" mainAttribute="studentActivity" {...this.props}/>
                      
            <CourseActivityRow conditionalAttributeLocale="plugin.guider.user.details.numberOfMessages" givenDateAttributeLocale="plugin.guider.user.details.lastMessage" labelTranslationString="plugin.guider.discussionMessagesLabel" conditionalAttribute="messageCount"
              givenDateAttribute="latestMessage" mainAttribute="forumStatistics" {...this.props}/>
            
            <h4 className="application-sub-panel__item-header">{this.props.i18n.text.get("plugin.guider.assignmentsTitle")}</h4>  
            
            <CourseActivityRow labelTranslationString="plugin.guider.unansweredAssignmentsLabel" conditionalAttribute="evaluablesUnanswered"
              mainAttribute="studentActivity" {...this.props}/>
            
            <CourseActivityRow conditionalAttributeLocale="plugin.guider.user.details.numberOfAnsweredAssignments" givenDateAttributeLocale="plugin.guider.user.details.lastAnsweredAssignment" labelTranslationString="plugin.guider.answeredAssignmentsLabel" conditionalAttribute="evaluablesAnswered"
              givenDateAttribute="evaluablesAnsweredLastDate" mainAttribute="studentActivity" {...this.props}/>
            
            <CourseActivityRow conditionalAttributeLocale="plugin.guider.user.details.numberOfSubmittedAssignments" givenDateAttributeLocale="plugin.guider.user.details.lastSubmittedAssignment" labelTranslationString="plugin.guider.submittedAssignmentsLabel" conditionalAttribute="evaluablesSubmitted"
              givenDateAttribute="evaluablesSubmittedLastDate" mainAttribute="studentActivity" {...this.props}/>
            
            <CourseActivityRow conditionalAttributeLocale="plugin.guider.user.details.numberOfEvaluationFailed" givenDateAttributeLocale="plugin.guider.user.details.lastEvaluationFailed" labelTranslationString="plugin.guider.failedAssingmentsLabel" conditionalAttribute="evaluablesFailed"
              givenDateAttribute="evaluablesFailedLastDate" mainAttribute="studentActivity" {...this.props}/>
            
            <CourseActivityRow conditionalAttributeLocale="plugin.guider.user.details.numberOfEvaluationPassed" givenDateAttributeLocale="plugin.guider.user.details.lastEvaluationPassed" labelTranslationString="plugin.guider.passedAssingmentsLabel" conditionalAttribute="evaluablesPassed"
              givenDateAttribute="evaluablesPassedLastDate" mainAttribute="studentActivity" {...this.props}/>
            
            <h4 className="application-sub-panel__item-header">{this.props.i18n.text.get("plugin.guider.exercisesTitle")}</h4>
            
            <CourseActivityRow labelTranslationString="plugin.guider.unansweredExercisesLabel" conditionalAttribute="exercisesUnanswered"
              mainAttribute="studentActivity" {...this.props}/>
            
            <CourseActivityRow conditionalAttributeLocale="plugin.guider.user.details.numberOfAnsweredExercises" givenDateAttributeLocale="plugin.guider.user.details.lastAnsweredExercise" labelTranslationString="plugin.guider.answeredExercisesLabel" conditionalAttribute="exercisesAnswered"
            givenDateAttribute="exercisesAnsweredLastDate" mainAttribute="studentActivity" {...this.props}/>

          </div>
        </div> : null }
    </ApplicationListItem>
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
)(StudentWorkspace);