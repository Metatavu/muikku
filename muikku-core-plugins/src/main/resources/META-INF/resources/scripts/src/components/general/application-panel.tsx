import * as React from 'react';

import '~/sass/elements/application-panel.scss';
import '~/sass/elements/loaders.scss';

interface ApplicationPanelProps {
  modifier: string,
  title: React.ReactElement<any> | string,
  icon?: React.ReactElement<any> | string,
  primaryOption?: React.ReactElement<any>,
  toolbar: React.ReactElement<any>,
  aside?: React.ReactElement<any>,
  children?: React.ReactElement<any> | Array<React.ReactElement<any>>
}

interface ApplicationPanelState {
  sticky: boolean,
  remainingHeight: number
}

export default class ApplicationPanel extends React.Component<ApplicationPanelProps, ApplicationPanelState> {
  private maxTop:number;
  private stickyHeight:number;
  
  constructor(props: ApplicationPanelProps){
    super(props);
    
    this.state = {
      sticky: false,
      remainingHeight: null
    }
    
    this.maxTop = null;
    this.stickyHeight = null;
    this.onScroll = this.onScroll.bind(this);
  }
  componentDidMount(){
    window.addEventListener("scroll", this.onScroll);
    this.maxTop = (this.refs["top-reference"] as HTMLElement).offsetTop;
    
//    let computedStyle = document.defaultView.getComputedStyle(this.refs["sticky"] as HTMLElement);
//    this.stickyHeight = (this.refs["sticky"] as HTMLElement).offsetTop +
//        parseInt(computedStyle.getPropertyValue("border-top")) + parseInt(computedStyle.getPropertyValue("border-top"))
//    this.setRemainingHeight();
  }
  componentWillUnmount(){
    window.removeEventListener("scroll", this.onScroll);
  }
  setRemainingHeight(){
//    if (!this.props.aside){
//      return;
//    }
//    let top = (document.documentElement.scrollTop || document.body.scrollTop);
//    let height = (document.documentElement.offsetHeight || document.body.offsetHeight);
//    
//    if (top > 70){
//      let height = (document.documentElement.offsetHeight || document.body.offsetHeight);
//      //sticky thing height 55
//      //navbar height 70
//      //other tooblar thingy height 54
//      let nRemainingHeight = height - 55 - 70 - 54 + top;
//      console.log(nRemainingHeight);
//      this.setState({remainingHeight: nRemainingHeight});
//    } else {
//      this.setState({remainingHeight: null});
//    }
  }
  onScroll(e: Event){
//    let top = (document.documentElement.scrollTop || document.body.scrollTop);
//    let diff = this.offsetTop - top;
//    let nDiff = (diff < 70);
//    if (nDiff !== this.state.sticky){
//      this.setState({sticky: nDiff});
//    }
//    this.setRemainingHeight();
  }
  render(){
    return (        
    <div className={`application-panel application-panel--${this.props.modifier}`} ref="top-reference">
      <div className="application-panel__container">                
        <div className="application-panel__header">
          <div className="application-panel__header-wrapper">
            <div className="application-panel__helper-container application-panel_helper-container--header">{this.props.title}</div>
            <div className="application-panel__main-container application-panel__main-container--header">{this.props.icon}</div>
          </div>
        </div>
        <div className="application-panel__body">
          <div style={{display: this.state.sticky ? "block" : "none"}}></div>
          <div className="application-panel__actions" ref="sticky">
            <div className="application-panel__actions__wrapper">
              {this.props.primaryOption ? <div className="application-panel__helper-container">{this.props.primaryOption}</div> : null}
              <div className="application-panel__main-container application-panel__main-container--actions">{this.props.toolbar}</div>
            </div>
          </div>              
          <div ref="damn" className="application-panel__content">
            {this.props.aside ? <div className="application-panel__helper-container application-panel__helper-container--content" style={{height: this.state.remainingHeight}}>{this.props.aside}</div> : null}
            <div className={`application-panel__main-container ${this.props.aside ? "application-panel__main-container--content-aside" : 'application-panel__main-container--content-full'} loader-empty`}>{this.props.children}</div>
          </div>
        </div>
      </div>
    </div>);
  }
}

