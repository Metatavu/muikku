package fi.otavanopisto.muikku.plugins.workspace;

import java.util.Date;

import javax.inject.Inject;

import fi.otavanopisto.muikku.model.workspace.WorkspaceEntity;
import fi.otavanopisto.muikku.plugins.workspace.dao.WorkspaceEntityFileDAO;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceEntityFile;

public class WorkspaceEntityFileController {

  @Inject
  private WorkspaceEntityFileDAO workspaceEntityFileDAO;
  
  public WorkspaceEntityFile createWorkspaceEntityFile(WorkspaceEntity workspaceEntity, String fileIdentifier, String diskName, String contentType, Date lastModified) {
    return workspaceEntityFileDAO.create(workspaceEntity, fileIdentifier, diskName, contentType, lastModified);
  }

  public WorkspaceEntityFile findWorkspaceEntityFile(WorkspaceEntity workspaceEntity, String identifier) {
    return workspaceEntityFileDAO.findByWorkspaceAndIdentifier(workspaceEntity, identifier);
  }

  public WorkspaceEntityFile updateWorkspaceEntityFile(WorkspaceEntityFile workspaceEntityFile, 
      String contentType, Date lastModified) {
    return workspaceEntityFileDAO.update(workspaceEntityFile, contentType, lastModified);
  }
}
