const Page1 = (props) => (
  <div>
    <p>Ilmoittautuminen ylioppilaskirjoituksiin on nyt auki. Voit ilmoittautua yo-kirjoituksiin, jos täytät abistatuksen. Lue lisää tiedotteesta.</p>
    <p>Täytä puuttuvat tiedot huolellisesti ja tarkista lomake ennen sen lähettämistä.</p>
    <p>Ilmoittautuminen sulkeutuu:</p>
    <ul>
      <li>Kevään kirjoitusten osalta 20.11.</li>
      <li>Syksyn kirjoitusten osalta 20.5.</li>
    </ul>
    <p>Jos sinulla on kysyttävää, ota yhteyttä Riikka Turpeiseen (riikka.turpeinen@otavanopisto.fi)</p>
    <a href="javascript:void(0)" onClick={() => {props.setPage(2);}} className="pure-button pure-button-primary" >
      Seuraava sivu
    </a>
  </div>
);

const SubjectSelect = ({i, value, onChange}) => (
  <React.Fragment>
    {i==0 ? <label>Aine</label> : null}
    <select
        value={value}
        onChange={onChange}
        className="pure-u-23-24">
      <option value="AI">Äidinkieli</option>
      <option value="S2">Suomi toisena kielenä</option>
      <option value="ENA">Englanti, A-taso</option>
      <option value="RAA">Ranska, A-taso</option>
      <option value="ESA">Espanja, A-taso</option>
      <option value="SAA">Saksa, A-taso</option>
      <option value="VEA">Venäjä, A-taso</option>
      <option value="UE">Uskonto</option>
      <option value="ET">Elämänkatsomustieto</option>
      <option value="YO">Yhteiskuntaoppi</option>
      <option value="KE">Kemia</option>
      <option value="GE">Maantiede</option>
      <option value="TT">Terveystieto</option>
      <option value="ENC">Englanti, C-taso</option>
      <option value="RAC">Ranska, C-taso</option>
      <option value="ESC">Espanja, C-taso</option>
      <option value="SAC">Saksa, C-taso</option>
      <option value="VEC">Venäjä, C-taso</option>
      <option value="ITC">Italia, C-taso</option>
      <option value="POC">Portugali, C-taso</option>
      <option value="LAC">Latina, C-taso</option>
      <option value="SMC">Saame, C-taso</option>
      <option value="RUA">Ruotsi, A-taso</option>
      <option value="RUB">Ruotsi, B-taso</option>
      <option value="PS">Psykologia</option>
      <option value="FI">Filosofia</option>
      <option value="HI">Historia</option>
      <option value="FY">Fysiikka</option>
      <option value="BI">Biologia</option>
      <option value="MAA">Matematiikka, pitkä</option>
      <option value="MAB">Matematiikka, lyhyt</option>
    </select>
  </React.Fragment>
);

const TermSelect = ({i, value, onChange}) => (
  <React.Fragment>
    {i==0 ? <label>Ajankohta</label> : null}
    <select
        value={value}
        onChange={onChange}
        className="pure-u-23-24">
      <option value="AUTUMN2018">Syksy 2018</option>
      <option value="SPRING2019">Kevät 2019</option>
      <option value="AUTUMN2019">Syksy 2019</option>
      <option value="SPRING2020">Kevät 2020</option>
      <option value="AUTUMN2020">Syksy 2020</option>
      <option value="SPRING2021">Kevät 2021</option>
    </select>
  </React.Fragment>
);

const MandatorySelect = ({i, value, onChange}) => (
  <React.Fragment>
    {i==0 ? <label>Pakollisuus</label> : null}
    <select
        value={value}
        onChange={onChange}
        className="pure-u-23-24">
      <option value="true">Pakollinen</option>
      <option value="false">Valinnainen</option>
    </select>
  </React.Fragment>
);

const RepeatSelect = ({i, value, onChange}) => (
  <React.Fragment>
    {i==0 ? <label>Uusiminen</label> : null}
    <select
        value={value}
        onChange={onChange}
        className="pure-u-23-24">
      <option value="false">Ensimmäinen suorituskerta</option>
      <option value="true">Uusinta</option>
    </select>
  </React.Fragment>
);

const GradeSelect = ({i, value, onChange}) => (
  <React.Fragment>
    {i==0 ? <label>Arvosana</label> : null}
    <select
        value={value}
        onChange={onChange}
        className="pure-u-23-24">
      <option value="IMPROBATUR">I (Improbatur)</option>
      <option value="APPROBATUR">A (Approbatur)</option>
      <option value="LUBENTER_APPROBATUR">B (Lubenter approbatur)</option>
      <option value="CUM_LAUDE_APPROBATUR">C (Cum laude approbatur)</option>
      <option value="MAGNA_CUM_LAUDE_APPROBATUR">M (Magna cum laude approbatur)</option>
      <option value="EXIMIA_CUM_LAUDE_APPROBATUR">E (Eximia cum laude approbatur)</option>
      <option value="LAUDATUR">L (Laudatur)</option>
      <option value="UNKNOWN">Ei vielä tiedossa</option>
    </select>
  </React.Fragment>
);

const Page2 = (props) => (
  <React.Fragment>
    <fieldset>
      <legend>Perustiedot</legend>
      <div className="pure-g">
        <div className="pure-u-1-2">
          <label>Nimi</label>
          <input className="pure-u-23-24" 
            readOnly
            type="text" 
            value={props.name}/>
        </div>
        <div className="pure-u-1-2">
          <label>Henkilötunnus</label>
          <input className="pure-u-1" 
            readOnly
            type="text" 
            value={props.ssn} />
        </div>
        <div className="pure-u-1-2">
          <label>Sähköpostiosoite</label>
          <input className="pure-u-23-24" 
            readOnly
            type="text" 
            value={props.email} />
        </div>
        <div className="pure-u-1-2">
          <label>Puhelinnumero</label>
          <input className="pure-u-1" 
            readOnly
            type="text" 
            value={props.phone} />
        </div>
        <div className="pure-u-1-1">
          <label>Osoite</label>
          <input className="pure-u-1-1" 
            readOnly
            type="text" 
            value={props.address} />
        </div>
        <div className="pure-u-1-2">
          <label>Postinumero</label>
          <input className="pure-u-23-24" 
            readOnly
            type="text" 
            value={props.postalCode} />
        </div>
        <div className="pure-u-1-2">
          <label>Postitoimipaikka</label>
          <input className="pure-u-1" 
            readOnly
            type="text" 
            value={props.locality} />
        </div>
      </div>
    </fieldset>
    <fieldset>
      <legend>Opiskelijatiedot</legend>
      <div>
        <div className="pure-u-1-1">
          <label>Ohjaaja</label>
          <input className="pure-u-1"
            type="text"
            onChange={({target}) => {props.setGuider(target.value);}}
            value={props.guider} />
        </div>

        <div className="pure-u-1-2">
          <label>Ilmoittautuminen</label>
          <select onChange={(ev) => {props.setSchoolType(ev.target.value);}}
                  value={props.enrollAs} className="pure-u-23-24">
            <option value="UPPERSECONDARY">Lukion opiskelijana</option>
            <option value="VOCATIONAL">Ammatillisten opintojen perusteella</option>
          </select>
        </div>
        <div className="pure-u-1-2">
          { props.enrollAs === "UPPERSECONDARY" ?
          <React.Fragment>
            <label>Pakollisia kursseja suoritettuna</label>
            <input className="pure-u-1" type="text" readOnly value={props.mandatoryCourses} />
          </React.Fragment> : null }
        </div>
        {props.enrollAs === "UPPERSECONDARY" && props.mandatoryCourses < 44 ?
          <div style={{margin: "1rem", padding: "0.5rem", border: "1px solid red", backgroundColor: "pink"}} className="pure-u-22-24">
           Sinulla ei ole tarpeeksi pakollisia kursseja suoritettuna. Jos haluat
           silti ilmoittautua ylioppilaskokeeseen, ota yhteyttä ohjaajaan.
          </div>: null}
        <div className="pure-u-1-2">
          <label style={{paddingTop: "0.7rem"}} >Aloitan tutkinnon suorittamisen uudelleen&nbsp;
            <input type="checkbox" />
          </label>
        </div>
      </div>
    </fieldset>
    <fieldset>
      <legend>Ilmoittaudun suorittamaan kokeen seuraavissa aineissa <b>Syksyllä 2018</b></legend>
      <div className="pure-g">
      {props.enrolledAttendances.map((attendance, i) =>
      <React.Fragment key={i}>
        <div className="pure-u-1-4">
          <SubjectSelect
            i={i}
            value={attendance.subject}
            onChange={({target}) => {props.modifyEnrolledAttendance(i, "subject", target.value);}}
            />
        </div>
        <div className="pure-u-1-4">
          <MandatorySelect
            i={i}
            value={attendance.mandatory}
            onChange={({target}) => {props.modifyEnrolledAttendance(i, "mandatory", target.value);}}
          />
        </div>
        <div className="pure-u-1-4">
          <RepeatSelect
            i={i}
            value={attendance.repeat}
            onChange={({target}) => {props.modifyEnrolledAttendance(i, "repeat", target.value);}}
          />
        </div>
        <div className="pure-u-1-4">
          <button style={{marginTop: i==0 ? "1.7rem" : "0.3rem"}}  class="pure-button" onClick={() => {props.deleteEnrolledAttendance(i);}}>
            Poista
          </button>
        </div>
      </React.Fragment>
      )}
      </div>
      <button className="pure-button" onClick={props.newEnrolledAttendance}>
        Lisää uusi rivi
      </button>
    </fieldset>
    <fieldset>
      <legend>Olen jo suorittanut seuraavat ylioppilaskokeet</legend>
      <div className="pure-g">
      {props.finishedAttendances.map((attendance, i) =>
      <React.Fragment key={i}>
        <div className="pure-u-1-5">
          <TermSelect
            i={i}
            value={attendance.term} 
            onChange={({target}) => {props.modifyFinishedAttendance(i, "term", target.value);}}
          />
        </div>
        <div className="pure-u-1-5">
          <SubjectSelect 
            i={i} 
            value={attendance.subject} 
            onChange={({target}) => {props.modifyFinishedAttendance(i, "subject", target.value);}}
          />
        </div>
        <div className="pure-u-1-5">
          <MandatorySelect 
            i={i} 
            value={attendance.mandatory} 
            onChange={({target}) => {props.modifyFinishedAttendance(i, "mandatory", target.value);}}
          />
        </div>
        <div className="pure-u-1-5">
          <GradeSelect 
            i={i} 
            value={attendance.grade} 
            onChange={({target}) => {props.modifyFinishedAttendance(i, "grade", target.value);}}
          />
        </div>
        <div className="pure-u-1-5">
          <button style={{marginTop: i==0 ? "1.7rem" : "0.3rem"}}  class="pure-button" onClick={() => {props.deleteFinishedAttendance(i);}}>
            Poista
          </button>
        </div>
      </React.Fragment>
      )}
      </div>
      <button className="pure-button" onClick={props.newFinishedAttendance}>
        Lisää uusi rivi
      </button>
    </fieldset>
    <fieldset>
      <legend>Aion suorittaa seuraavat ylioppilaskokeet tulevaisuudessa</legend>
      <div className="pure-g">
      {props.plannedAttendances.map((attendance, i) =>
      <React.Fragment key={i}>
        <div className="pure-u-1-4">
          <TermSelect 
          i={i} 
          onChange={({target}) => {props.modifyPlannedAttendance(i, "term", target.value);}}
          value={attendance.term} 
          />
        </div>
        <div className="pure-u-1-4">
          <SubjectSelect 
            i={i} 
            onChange={({target}) => {props.modifyPlannedAttendance(i, "subject", target.value);}}
            value={attendance.subject} 
          />
        </div>
        <div className="pure-u-1-4">
          <MandatorySelect 
            i={i} 
            onChange={({target}) => {props.modifyPlannedAttendance(i, "mandatory", target.value);}}
            value={attendance.mandatory} 
          />
        </div>
        <div className="pure-u-1-4">
          <button style={{marginTop: i==0 ? "1.7rem" : "0.3rem"}} class="pure-button" onClick={() => {props.deletePlannedAttendance(i);}}>
            Poista
          </button>
        </div>
      </React.Fragment>
      )}
      </div>
      <button className="pure-button" onClick={props.newPlannedAttendance}>
        Lisää uusi rivi
      </button>
    </fieldset>
    {props.conflictingAttendances ?
      <div style={{margin: "1rem", padding: "0.5rem", border: "1px solid red", backgroundColor: "pink"}} >
      Olet valinnut aineet, joita ei voi valita samanaikaisesti. Jos siitä huolimatta haluat osallistua näihin aineisiin, ota yhteyttä ohjaajaan.
      </div>: null}
    <a href="javascript:void(0)" onClick={() => {props.setPage(1);}} className="pure-button" >
      Edellinen sivu
    </a>
    <a style={{marginLeft: "1rem"}} href="javascript:void(0)" onClick={() => {props.setPage(3);}} className="pure-button pure-button-primary" disabled={props.conflictingAttendances} >
      Seuraava sivu
    </a>
  </React.Fragment>
);

const Page3 = (props) => (
  <div>
    <fieldset>
      <legend>Kokeen suorittaminen</legend>
      <div className="pure-g">
        <div className="pure-u-1-2">
          <label>Suorituspaikka</label>
          <select onChange={(ev) => {props.setLocation(ev.target.value);}}
                  value={props.location == 'Otavan Opisto'
                         ? 'Otavan Opisto'
                         : ''}
                  className="pure-u-23-24">
            <option>Otavan Opisto</option>
            <option value="">Muu</option>
          </select>
        </div>
        <div className="pure-u-1-2">
          {props.location !== "Otavan Opisto" ?
          <React.Fragment>
            <label>&nbsp;</label>
            <input type="text" placeholder="Kirjoita tähän oppilaitoksen nimi" value={props.location} onChange={(ev) => {props.setLocation(ev.target.value);}}className="pure-u-1" />
          </React.Fragment>: null}
        </div>
        {props.location !== "Otavan Opisto" ?
          <div style={{margin: "1rem", padding: "0.5rem", border: "1px solid burlywood", backgroundColor: "beige"}} className="pure-u-1-1">
            Jos haluat suorittaa kokeen muualla, siitä on sovittava ensin kyseisen
            oppilaitoksen kanssa.
          </div>: null}
        <div className="pure-u-1-1">
          <label>Lisätietoa ohjaajalle</label>
          <textarea
            value={props.message}
            onChange={({target}) => {props.setMessage(target.value);}}
            rows={5}
            className="pure-u-1-1" />
        </div>
        <div className="pure-u-1-1">
          <label>Julkaisulupa</label>
          <select
            value={props.canPublishName}
            onChange={({target}) => {props.setCanPublishName(target.value);}}
            className="pure-u-1">
            <option value="true">Haluan nimeni julkaistavan valmistujalistauksissa</option>
            <option value="false">En halua nimeäni julkaistavan valmistujaislistauksissa</option>
          </select>
        </div>
        <div className="pure-u-1-2">
          <label>Nimi</label>
          <input readOnly={true} className="pure-u-23-24" type="text" value={props.name} />
        </div>
        <div className="pure-u-1-2">
          <label>Päivämäärä</label>
          <input readOnly={true} className="pure-u-1" type="text" value={props.date} />
        </div>
      </div>
    </fieldset>
    <a href="javascript:void(0)" onClick={() => {props.setPage(2);}} className="pure-button" >
      Edellinen sivu
    </a>
    <a style={{marginLeft: "1rem"}}
      onClick={() => {props.submit(); props.setPage(4);}}
      className="pure-button pure-button-primary">
      Hyväksy ilmoittautuminen
    </a>
  </div>
);

const Page4 = ({}) => (
  <div>
    <p>Ilmoittautumisesi ylioppilaskirjoituksiin on lähetetty onnistuneesti. Saat lomakkeesta kopion sähköpostiisi.</p>
    <p>Tarkistamme lomakkeen tiedot, ja otamme sinuun yhteyttä.</p>
  </div>
);

class App extends React.Component {

  constructor() {
    super({});
    const date = new Date();
    // Use strings for boolean choices because they work well with <select>s
    this.state = {
      page: 1,
      name: "",
      ssn: "",
      email: "",
      phone: "",
      address: "",
      postalCode: "",
      city: "",
      nationalStudentNumber: "",
      guider: "",
      enrollAs: "UPPERSECONDARY",
      numMandatoryCourses: 0,
      location: "Otavan Opisto",
      message: "",
      studentIdentifier: "",
      initialized: false,
      enrolledAttendances: [],
      plannedAttendances: [],
      finishedAttendances: [],
      canPublishName: "true",
      date: date.getDate() + "."
            + date.getMonth() + "."
            + date.getFullYear()
    };
  }

  componentDidMount() {
    fetch(`/rest/matriculation/initialData/${MUIKKU_LOGGED_USER}`)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        this.setState(data);
        this.setState({initialized: true});
      });
  }

  newEnrolledAttendance() {
    const enrolledAttendances = this.state.enrolledAttendances;
    enrolledAttendances.push({
      subject: "AI",
      mandatory: false,
      repeat: false,
      status: "ENROLLED"
    });
    this.setState({enrolledAttendances});
  }

  modifyEnrolledAttendance(i, param, value) {
    const enrolledAttendances = this.state.enrolledAttendances;
    enrolledAttendances[i][param] = value;
    this.setState({enrolledAttendances});
  }

  deleteEnrolledAttendance(i) {
    const enrolledAttendances = this.state.enrolledAttendances;
    enrolledAttendances.splice(i, 1);
    this.setState({enrolledAttendances});
  }

  newFinishedAttendance() {
    const finishedAttendances = this.state.finishedAttendances;
    finishedAttendances.push({
      term: "SPRING2018",
      subject: "AI",
      mandatory: false,
      grade: "APPROBATUR",
      status: "FINISHED"
    });
    this.setState({finishedAttendances});
  }

  modifyFinishedAttendance(i, param, value) {
    const finishedAttendances = this.state.finishedAttendances;
    finishedAttendances[i][param] = value;
    this.setState({finishedAttendances});
  }

  deleteFinishedAttendance(i) {
    const finishedAttendances = this.state.finishedAttendances;
    finishedAttendances.splice(i, 1);
    this.setState({finishedAttendances});
  }

  newPlannedAttendance() {
    const plannedAttendances = this.state.plannedAttendances;
    plannedAttendances.push({
      term: "SPRING2018",
      subject: "AI",
      mandatory: false,
      status: "PLANNED"
    });
    this.setState({plannedAttendances});
  }

  modifyPlannedAttendance(i, param, value) {
    const plannedAttendances = this.state.plannedAttendances;
    plannedAttendances[i][param] = value;
    this.setState({plannedAttendances});
  }

  deletePlannedAttendance(i) {
    const plannedAttendances = this.state.plannedAttendances;
    plannedAttendances.splice(i, 1);
    this.setState({plannedAttendances});
  }

  isConflictingAttendances() {
    // Can't enroll to two subjects that are in the same group
    const conflictingGroups = [
      ['AI', 'S2'],
      ['UE', 'ET', 'YO', 'KE', 'GE', 'TT'],
      ['RUA', 'RUB'],
      ['PS', 'FI', 'HI', 'FY', 'BI'],
      ['MAA', 'MAB']
    ];
    const subjects = [];
    for (let attendance of this.state.enrolledAttendances) {
      subjects.push(attendance.subject);
    }

    for (let group of conflictingGroups) {
      for (let subject1 of subjects) {
        for (let subject2 of subjects) {
          if (subject1 !== subject2
                && group.includes(subject1)
                && group.includes(subject2)) {
              return true;
          }
        }
      }
    }

    // can't have duplicate subjects
    for (let i=0; i<subjects.length; i++) {
      for (let j=0; j<i; j++) {
        if (subjects[i] == subjects[j]) {
          return true;
        }
      }
    }

    return false;
  }

  submit() {
    fetch("/rest/matriculation/enrollments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      },
      body: JSON.stringify(
        {
          name: this.state.name,
          ssn: this.state.ssn,
          email: this.state.email,
          phone: this.state.phone,
          address: this.state.address,
          postalCode: this.state.postalCode,
          city: this.state.locality,
          guider: this.state.guider,
          enrollAs: this.state.enrollAs,
          numMandatoryCourses: this.state.numMandatoryCourses,
          location: this.state.location,
          message: this.state.message,
          studentIdentifier: this.state.studentIdentifier,
          canPublishName: this.state.canPublishName === 'true',
          attendances: ([
            ...this.state.enrolledAttendances,
            ...this.state.plannedAttendances,
            ...this.state.finishedAttendances
          ]).map((attendance) => ({
            subject: attendance.subject,
            mandatory: attendance.mandatory === 'true',
            repeat: attendance.repeat === 'true',
            year: attendance.term ? Number(attendance.term.substring(6)) : null,
            term: attendance.term ? attendance.term.substring(0,6) : null,
            status: attendance.status,
            grade: attendance.grade
          })),
          state: null
        }
      )
    }).then(function (response) {
      if (!response.ok) {
        this.setState({error: response.text()});
      }
    });
  }

  render() {
    if (!this.state.initialized) {
      return <React.Fragment />;
    }
    return (
      <React.Fragment>
        <div className="header">
          <a href="/">Takaisin etusivulle</a>
        </div>
        {this.state.error
          ? <div class="error">{this.state.error}</div>
          : null}
        <form className="pure-form pure-form-stacked matriculation-form" onSubmit={(e) => {e.preventDefault();}}>
          {/* Page 1 of the wizard contains an introductory text */}
          { this.state.page === 1
              ? <Page1
                setPage={(page) => {this.setState({page});}}
                />
              : null }
          {/* Page 2 contains basic contact information and input for the exams the student enrolls into */}
          { this.state.page === 2
              ? <Page2 {...this.state}
                  setGuider={(value) => { this.setState({guider : value}); }}
                  setEnrollAs={(value) => { this.setState({enrollAs : value}); }}
                  setPage={(page) => {this.setState({page});}}
                  newEnrolledAttendance={() => {this.newEnrolledAttendance();}}
                  newPlannedAttendance={() => {this.newPlannedAttendance();}}
                  newFinishedAttendance={() => {this.newFinishedAttendance();}}
                  deleteEnrolledAttendance={(i) => {this.deleteEnrolledAttendance(i);}}
                  deletePlannedAttendance={(i) => {this.deletePlannedAttendance(i);}}
                  deleteFinishedAttendance={(i) => {this.deleteFinishedAttendance(i);}}
                  modifyEnrolledAttendance={(i, param, value) => {this.modifyEnrolledAttendance(i, param, value);}}
                  modifyPlannedAttendance={(i, param, value) => {this.modifyPlannedAttendance(i, param, value);}}
                  modifyFinishedAttendance={(i, param, value) => {this.modifyFinishedAttendance(i, param, value);}}
                  conflictingAttendances={this.isConflictingAttendances()}
                />
              : null }
          {/* Page 3 contains practical choices for doing the exam (location, extra info etc) */}
          { this.state.page === 3
              ? <Page3 {...this.state}
                setLocation={(location) => {this.setState({location});}}
                setMessage={(message) => {this.setState({message});}}
                setCanPublishName={(canPublishName) => {this.setState({canPublishName});}}
                submit={() => {this.submit();}}
                setPage={(page) => {this.setState({page});}}
                />
              : null }
          { this.state.page === 4
              ? <Page4
                />
              : null }
        </form>
      </React.Fragment>
    );
  }

}

ReactDOM.render(<App />, document.getElementById("react-root"));