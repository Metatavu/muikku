import {ActionType} from '~/actions';
import { UserWithSchoolDataType, UserGroupListType, UserFileType } from '~/reducers/main-function/user-index';
import { WorkspaceListType } from '~/reducers/main-function/index/workspaces';

//TODO remove or comment out, this is mocking code
import hops from './mock/hops';
import vops from './mock/vops';
import { VOPSDataType } from '~/reducers/main-function/vops';
//TODO

export type GuiderStudentsStateType = "LOADING" | "LOADING_MORE" | "ERROR" | "READY";
export type GuiderCurrentStudentStateType = "LOADING" | "ERROR" | "READY";
export interface GuiderStudentsFilterType {
  workspaceFilters: Array<number>,
  labelFilters: Array<number>,
  query: string
}
export interface GuiderStudentType extends UserWithSchoolDataType {
  flags: Array<GuiderStudentUserProfileLabelType>
};
export type GuiderStudentListType = Array<GuiderStudentType>;

export interface GuiderStudentsType {
  state: GuiderStudentsStateType,
  filters: GuiderStudentsFilterType,
  students: GuiderStudentListType,
  hasMore: boolean,
  toolbarLock: boolean,
  current: GuiderStudentUserProfileType,
  selected: GuiderStudentListType,
  selectedIds: Array<string>,
  currentState: GuiderCurrentStudentStateType
}

export interface GuiderStudentsPatchType {
  state?: GuiderStudentsStateType,
  filters?: GuiderStudentsFilterType,
  students?: GuiderStudentListType,
  hasMore?: boolean,
  toolbarLock?: boolean,
  current?: GuiderStudentUserProfileType,
  selected?: GuiderStudentListType,
  selectedIds?: Array<string>,
  currentState?: GuiderCurrentStudentStateType
}

export interface GuiderStudentUserProfileLabelType {
  id: number,
  flagId: number,
  flagName: string,
  flagColor: string,
  studentIdentifier: string
}

export interface GuiderStudentUserProfileEmailType {
  studentIdentifier: string,
  type: string,
  address: string,
  defaultAddress: boolean
}

export interface GuiderStudentUserProfilePhoneType {
  studentIdentifier: string,
  type: string,
  number: string,
  defaultNumber: boolean
}

export interface GuiderStudentUserAddressType {
  identifier: string,
  studentIdentifier: string,
  street: string,
  postalCode: string,
  city: string,
  region: string,
  country: string,
  type: string,
  defaultAddress: boolean
}

export interface GuiderLastLoginStudentDataType {
  userIdentifier: string,
  authenticationProvder: string,
  address: string,
  time: string
}

//TODO hops has an enum defined structure
export interface GuiderHOPSDataType {
  goalSecondarySchoolDegree: "yes" | "no" | "maybe",
  goalMatriculationExam: "yes" | "no" | "maybe",
  vocationalYears: string,        //string wtf, but this shit is actually a number
  goalJustMatriculationExam: "yes" | "no",  //yo
  justTransferCredits: string,    //another disguised number
  transferCreditYears: string,    //disguides number
  completionYears: string,      //disguised number
  mathSyllabus: "MAA" | "MAB", 
  finnish: "AI" | "S2",
  swedish: boolean,
  english: boolean,
  german: boolean,
  french: boolean,
  italian: boolean,
  spanish: boolean,
  science: "BI" | "FY" | "KE" | "GE",
  religion: "UE" | "ET" | "UX",
  additionalInfo?: string,
  optedIn: boolean
}

//These are actually dates, might be present or not
//  studytime = Notification about study time ending
//  nopassedcourses = Notification about low number of finished courses in a year
//  assessmentrequest = Notification about inactivity in the first 2 months
export interface GuiderNotificationStudentsDataType {
  studytime?: string,
  nopassedcourses?: string,
  assessmentrequest?: string
}

export interface GuiderStudentUserProfileType {
  basic: GuiderStudentType,
  labels: Array<GuiderStudentUserProfileLabelType>,
  emails: Array<GuiderStudentUserProfileEmailType>,
  phoneNumbers: Array<GuiderStudentUserProfilePhoneType>,
  addresses: Array<GuiderStudentUserAddressType>,
  files: Array<UserFileType>,
  usergroups: UserGroupListType,
  vops: VOPSDataType,
  hops: GuiderHOPSDataType,
  lastLogin: GuiderLastLoginStudentDataType,
  notifications: GuiderNotificationStudentsDataType,
  workspaces: WorkspaceListType
}

export default function guiderStudents(state: GuiderStudentsType={
  state: "LOADING",
  currentState: "READY",
  filters: {
    workspaceFilters: [],
    labelFilters: [],
    query: ""
  },
  students: [],
  hasMore: false,
  toolbarLock: false,
  selected: [],
  selectedIds: [],
  current: null
}, action: ActionType): GuiderStudentsType {
  if (action.type === "UPDATE_GUIDER_STUDENTS_FILTERS"){
    return Object.assign({}, state, {
      filters: action.payload
    });
  } else if (action.type === "UPDATE_GUIDER_STUDENTS_ALL_PROPS"){
    return Object.assign({}, state, action.payload);
  } else if (action.type === "UPDATE_GUIDER_STUDENTS_STATE"){
    return Object.assign({}, state, {
      state: action.payload
    });
  } else if (action.type === "ADD_TO_GUIDER_SELECTED_STUDENTS"){
    let student:GuiderStudentType = action.payload;
    return Object.assign({}, state, {
      selected: state.selected.concat([student]),
      selectedIds: state.selectedIds.concat([student.id])
    });
  } else if (action.type === "REMOVE_FROM_GUIDER_SELECTED_STUDENTS"){
    let student:GuiderStudentType = action.payload;
    return Object.assign({}, state, {
      selected: state.selected.filter(s=>s.id!==student.id),
      selectedIds: state.selectedIds.filter(id=>id!==student.id)
    });
  } else if (action.type === "SET_CURRENT_GUIDER_STUDENT"){
    return Object.assign({}, state, {
      current: action.payload
    });
  } else if (action.type === "SET_CURRENT_GUIDER_STUDENT_EMPTY_LOAD"){
    return Object.assign({}, state, {
      current: {},
      currentState: "LOADING"
    });
  } else if (action.type === "SET_CURRENT_GUIDER_STUDENT_PROP"){
    let obj:any = {};
    obj[action.payload.property] = action.payload.value;
    
    //TODO remove or comment out, this is mocking code
    if (action.payload.property === "vops"){
      obj[action.payload.property] = vops;
    } else if (action.payload.property === "hops"){
      obj[action.payload.property] = hops;
    }
    //TODO
    
    return Object.assign({}, state, {
      current: Object.assign({}, state.current, obj)
    });
  } else if (action.type === "UPDATE_CURRENT_GUIDER_STUDENT_STATE"){
    return Object.assign({}, state, {
      currentState: action.payload
    });
  } else if (action.type === "ADD_GUIDER_LABEL_TO_USER" || action.type === "REMOVE_GUIDER_LABEL_FROM_USER"){
    let newCurrent:GuiderStudentUserProfileType;
  
    if (action.type === "ADD_GUIDER_LABEL_TO_USER") {
      newCurrent = state.current && Object.assign({}, state.current);
      if (newCurrent && newCurrent.labels){
        newCurrent.labels = newCurrent.labels.concat([action.payload.label]);
      }
    } else {
      newCurrent = state.current && Object.assign({}, state.current);
      if (newCurrent && newCurrent.labels){
        newCurrent.labels = newCurrent.labels.filter((label)=>{
          return label.id !== action.payload.label.id;
        })
      }
    }
    
    let mapFn = function(student:GuiderStudentType){
      if (student.id === action.payload.studentId){
        if (action.type === "ADD_GUIDER_LABEL_TO_USER") {
          return Object.assign({}, student, {
            flags: student.flags.concat([action.payload.label])
          });
        } else {
          return Object.assign({}, student, {
            flags: student.flags.filter((label)=>{
              return label.id !== action.payload.label.id;
            })
          });
        }
      }
      return student;
    }
    
    return Object.assign({}, state, {
      students: state.students.map(mapFn),
      selected: state.selected.map(mapFn),
      current: newCurrent
    });
  } else if (action.type === "UPDATE_ONE_GUIDER_LABEL_FROM_ALL_STUDENTS"){
    let mapFnStudentLabel = function(label:GuiderStudentUserProfileLabelType){
      if (label.flagId === action.payload.labelId){
        return Object.assign({}, label, action.payload.update);
      }
      return label;
    }
    let mapFn = function(student:GuiderStudentType){
      return Object.assign({}, student, {
        flags: student.flags.map(mapFnStudentLabel)
      });
    }
    
    let newCurrent = state.current;
    if (newCurrent){
      newCurrent = Object.assign({}, state.current, {
        labels: state.current.labels.map(mapFnStudentLabel)
      });
    }
    
    return Object.assign({}, state, {
      students: state.students.map(mapFn),
      selected: state.selected.map(mapFn),
      current: newCurrent
    });
  } else if (action.type === "DELETE_ONE_GUIDER_LABEL_FROM_ALL_STUDENTS"){
    let filterFnStudentLabel = function(label:GuiderStudentUserProfileLabelType){
      return (label.flagId !== action.payload);
    }
    let mapFn = function(student:GuiderStudentType){
      return Object.assign({}, student, {
        flags: student.flags.filter(filterFnStudentLabel)
      });
    }
    
    let newCurrent = state.current;
    if (newCurrent){
      newCurrent = Object.assign({}, state.current, {
        labels: state.current.labels.filter(filterFnStudentLabel)
      });
    }
    
    return Object.assign({}, state, {
      students: state.students.map(mapFn),
      selected: state.selected.map(mapFn),
      current: newCurrent
    });
  } else if (action.type === "ADD_FILE_TO_CURRENT_STUDENT"){
    return Object.assign({}, state, {
      current: Object.assign({}, state.current, {
        files: state.current.files.concat([action.payload])
      })
    });
  } else if (action.type === "REMOVE_FILE_FROM_CURRENT_STUDENT"){
    return Object.assign({}, state, {
      current: Object.assign({}, state.current, {
        files: state.current.files.filter((f)=>f.id !== action.payload.id)
      })
    });
  }
  return state;
}