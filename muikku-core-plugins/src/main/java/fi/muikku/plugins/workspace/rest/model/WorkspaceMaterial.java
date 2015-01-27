package fi.muikku.plugins.workspace.rest.model;

import fi.muikku.plugins.workspace.model.WorkspaceMaterialAssignmentType;

public class WorkspaceMaterial {

  public WorkspaceMaterial() {
  }

  public WorkspaceMaterial(Long id, Long materialId, Long parentId, Long nextSiblingId, Boolean hidden, WorkspaceMaterialAssignmentType assignmentType) {
    super();
    this.id = id;
    this.materialId = materialId;
    this.parentId = parentId;
    this.nextSiblingId = nextSiblingId;
    this.hidden = hidden;
    this.assignmentType = assignmentType;
  }
  
  public Long getId() {
    return id;
  }
  
  public void setId(Long id) {
    this.id = id;
  }

  public Long getMaterialId() {
    return materialId;
  }

  public void setMaterialId(Long materialId) {
    this.materialId = materialId;
  }

  public Long getParentId() {
    return parentId;
  }

  public void setParentId(Long parentId) {
    this.parentId = parentId;
  }

  public Long getNextSiblingId() {
    return nextSiblingId;
  }
  
  public void setNextSiblingId(Long nextSiblingId) {
    this.nextSiblingId = nextSiblingId;
  }
  
  public Boolean getHidden() {
    return hidden;
  }

  public void setHidden(Boolean hidden) {
    this.hidden = hidden;
  }
  
  public WorkspaceMaterialAssignmentType getAssignmentType() {
    return assignmentType;
  }
  
  public void setAssignmentType(WorkspaceMaterialAssignmentType assignmentType) {
    this.assignmentType = assignmentType;
  }

  private Long id;
  private Long materialId;
  private Long parentId;
  private Long nextSiblingId;
  private Boolean hidden;
  private WorkspaceMaterialAssignmentType assignmentType;
}