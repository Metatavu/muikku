package fi.otavanopisto.muikku.plugins.schooldatapyramus.entities;

import java.util.Date;

import fi.otavanopisto.muikku.plugins.schooldatapyramus.SchoolDataPyramusPluginDescriptor;
import fi.otavanopisto.muikku.schooldata.entity.CompositeAssessmentRequest;

public class PyramusCompositeAssessmentRequest implements CompositeAssessmentRequest {
  
  public PyramusCompositeAssessmentRequest(String userIdentifier, String firstName, String lastName, String studyProgramme,
      String courseIdentifier, String courseName, String courseNameExtension, Date courseEnrollmentDate, Date assessmentRequestDate,
      Date evaluationDate) {
    this.userIdentifier = userIdentifier;
    this.firstName = firstName;
    this.lastName = lastName;
    this.studyProgramme = studyProgramme;
    this.courseIdentifier = courseIdentifier;
    this.courseName = courseName;
    this.courseNameExtension = courseNameExtension;
    this.courseEnrollmentDate = courseEnrollmentDate;
    this.assessmentRequestDate = assessmentRequestDate;
    this.evaluationDate = evaluationDate;
  }

  @Override
  public String getSchoolDataSource() {
    return SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE;
  }

  @Override
  public String getUserIdentifier() {
    return userIdentifier;
  }

  @Override
  public String getFirstName() {
    return firstName;
  }

  @Override
  public String getLastName() {
    return lastName;
  }

  @Override
  public String getStudyProgramme() {
    return studyProgramme;
  }

  @Override
  public String getCourseIdentifier() {
    return courseIdentifier;
  }

  @Override
  public String getCourseName() {
    return courseName;
  }

  @Override
  public String getCourseNameExtension() {
    return courseNameExtension;
  }

  @Override
  public Date getCourseEnrollmentDate() {
    return courseEnrollmentDate;
  }

  @Override
  public Date getAssessmentRequestDate() {
    return assessmentRequestDate;
  }

  @Override
  public Date getEvaluationDate() {
    return evaluationDate;
  }

  private final String userIdentifier;
  private final String firstName;
  private final String lastName;
  private final String studyProgramme;
  private final String courseIdentifier;
  private final String courseName;
  private final String courseNameExtension;
  private final Date courseEnrollmentDate;
  private final Date assessmentRequestDate;
  private final Date evaluationDate;

}
