package fi.otavanopisto.muikku.plugins.transcriptofrecords;

import java.util.Objects;
import java.util.regex.Pattern;

import javax.inject.Inject;

import fi.otavanopisto.muikku.schooldata.UserSchoolDataController;
import fi.otavanopisto.muikku.schooldata.entity.Subject;
import fi.otavanopisto.muikku.schooldata.entity.User;
import fi.otavanopisto.muikku.schooldata.entity.UserProperty;

public class TranscriptOfRecordsController {

  @Inject
  private UserSchoolDataController userSchoolDataController;
  
  private Pattern UPPER_SECONDARY_SCHOOL_SUBJECT_PATTERN = Pattern.compile("^[A-ZÅÄÖ0-9]+$");

  public boolean subjectAppliesToStudent(User student, Subject subject) {
    if (subject.getCode() == null) {
      return false;
    }
    
    if (!UPPER_SECONDARY_SCHOOL_SUBJECT_PATTERN.matcher(subject.getCode()).matches()) {
      return false;
    }

    if (subject.getCode().startsWith("RU")) {
      return true;
    }

    if (subject.getCode().startsWith("EN")) {
      return true;
    }

    String mathSyllabus = loadStringProperty(student, "mathSyllabus");
    String finnish = loadStringProperty(student, "finnish");
    boolean german = loadBoolProperty(student, "german");
    boolean french = loadBoolProperty(student, "french");
    boolean italian = loadBoolProperty(student, "italian");
    boolean spanish = loadBoolProperty(student, "spanish");
    String science = loadStringProperty(student, "science");
    String religion = loadStringProperty(student, "religion");

    if (Objects.equals(subject.getCode(), mathSyllabus)) {
      return true;
    }

    if (Objects.equals(subject.getCode(), finnish)) {
      return true;
    }

    if (german && subject.getCode().startsWith("SA")) {
      return true;
    }

    if (french && subject.getCode().startsWith("RA")) {
      return true;
    }

    if (italian && subject.getCode().startsWith("IT")) {
      return true;
    }

    if (spanish && subject.getCode().startsWith("ES")) {
      return true;
    }

    if (Objects.equals(subject.getCode(), religion)) {
      return true;
    }

    return false;
  }

  public String loadStringProperty(User user, String propertyName) {
    UserProperty property = userSchoolDataController.getUserProperty(user, "hops." + propertyName);
    if (property != null) {
      return property.getValue();
    } else {
      return null;
    }
  }

  public boolean loadBoolProperty(User user, String propertyName) {
    UserProperty property = userSchoolDataController.getUserProperty(user, "hops." + propertyName);
    if (property != null) {
      return "yes".equals(property.getValue());
    } else {
      return false;
    }
  }


  public void saveStringProperty(User user, String propertyName, String value) {
    if (value != null && !"".equals(value)) {
      userSchoolDataController.setUserProperty(user, "hops." + propertyName, value);
    }
  }

  public void saveBoolProperty(User user, String propertyName, boolean value) {
    userSchoolDataController.setUserProperty(user, "hops." + propertyName, value ? "yes" : "no");
  }


}
