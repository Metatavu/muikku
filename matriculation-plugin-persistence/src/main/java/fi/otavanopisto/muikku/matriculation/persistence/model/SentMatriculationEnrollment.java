package fi.otavanopisto.muikku.matriculation.persistence.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.validation.constraints.NotNull;

import org.hibernate.validator.constraints.NotEmpty;

import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;

@Entity
public class SentMatriculationEnrollment {

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }
  
  public SchoolDataIdentifier getUserIdentifier() {
    return SchoolDataIdentifier.fromId(userIdentifier);
  }

  public void setUserIdentifier(SchoolDataIdentifier userIdentifier) {
    this.userIdentifier = userIdentifier.toId();
  }

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @NotNull
  @NotEmpty
  @Column(nullable = false, unique = true)
  private String userIdentifier;
}