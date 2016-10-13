package fi.otavanopisto.muikku.schooldata.entity;

import java.util.Date;

public interface CompositeAssessmentRequest extends SchoolDataEntity {
	
  public String getUserIdentifier();
  public String getFirstName();
  public String getLastName();
  public String getStudyProgramme();
  public String getCourseIdentifier();
  public String getCourseName();
  public String getCourseNameExtension();
  public Date getCourseEnrollmentDate();
  public Date getAssessmentRequestDate();
  public Date getEvaluationDate();
  public Boolean getPassing();

}