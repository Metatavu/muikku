package fi.muikku.plugins.workspace;

import java.util.Arrays;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.inject.Named;

import org.apache.commons.lang3.StringUtils;
import org.ocpsoft.rewrite.annotation.Join;
import org.ocpsoft.rewrite.annotation.Parameter;
import org.ocpsoft.rewrite.annotation.RequestAction;

import fi.muikku.jsf.NavigationRules;
import fi.muikku.model.workspace.WorkspaceEntity;
import fi.muikku.plugins.material.HtmlMaterialController;
import fi.muikku.plugins.material.model.HtmlMaterial;
import fi.muikku.plugins.workspace.model.WorkspaceFolder;
import fi.muikku.plugins.workspace.model.WorkspaceFolderType;
import fi.muikku.plugins.workspace.model.WorkspaceMaterial;
import fi.muikku.plugins.workspace.model.WorkspaceNode;
import fi.muikku.plugins.workspace.model.WorkspaceRootFolder;
import fi.muikku.schooldata.WorkspaceController;
import fi.muikku.schooldata.entity.Workspace;
import fi.otavanopisto.security.LoggedIn;

@Named
@Stateful
@RequestScoped
@Join(path = "/workspace/{workspaceUrlName}/helppage-management", to = "/jsf/workspace/helppage-management.jsf")
@LoggedIn
public class WorkspaceHelpPageManagementBackingBean {

  @Inject
  private Logger logger;

  @Parameter
  private String workspaceUrlName;

  @Inject
  private WorkspaceController workspaceController;
  
  @Inject
  private HtmlMaterialController htmlMaterialController;

  @Inject
  private WorkspaceMaterialController workspaceMaterialController;

  @Inject
  @Named
  private WorkspaceBackingBean workspaceBackingBean;

  @RequestAction
  public String init() {
    String urlName = getWorkspaceUrlName();

    if (StringUtils.isBlank(urlName)) {
      return NavigationRules.NOT_FOUND;
    }

    WorkspaceEntity workspaceEntity = workspaceController.findWorkspaceEntityByUrlName(urlName);
    if (workspaceEntity == null) {
      return NavigationRules.NOT_FOUND;
    }

    rootFolder = workspaceMaterialController.findWorkspaceRootFolderByWorkspaceEntity(workspaceEntity);
    workspaceEntityId = workspaceEntity.getId();
    workspaceBackingBean.setWorkspaceUrlName(urlName);
    Workspace workspace = workspaceController.findWorkspace(workspaceEntity);
    workspaceName = workspace.getName();
    
    List<WorkspaceFolder> folders = workspaceMaterialController.listWorkspaceFoldersByParentAndFolderTypeSortByOrderNumber(
        rootFolder,
        WorkspaceFolderType.HELP_PAGE); 
    
    if (folders.isEmpty()) {
      folders = Arrays.asList((WorkspaceFolder)workspaceMaterialController.createWorkspaceHelpPageFolder(workspaceEntity));
    }
    
    WorkspaceFolder helpPageFolder = (WorkspaceFolder)folders.get(0);
    
    if (helpPageFolder.getDefaultMaterial() == null) {
      HtmlMaterial htmlMaterial = htmlMaterialController.createHtmlMaterial("Help page", "", "text/html", 0l);
      WorkspaceMaterial workspaceMaterial = workspaceMaterialController.createWorkspaceMaterial(helpPageFolder, htmlMaterial);
      workspaceMaterialController.updateDefaultMaterial(helpPageFolder, workspaceMaterial);
    }

    try {
      contentNodes = workspaceMaterialController.listWorkspaceHelpPagesAsContentNodes(workspaceEntity);
    } catch (WorkspaceMaterialException e) {
      logger.log(Level.SEVERE, "Error loading materials", e);
      return NavigationRules.INTERNAL_ERROR;
    }

    return null;
  }

  public WorkspaceRootFolder getRootFolder() {
    return rootFolder;
  }

  public void setRootFolder(WorkspaceRootFolder rootFolder) {
    this.rootFolder = rootFolder;
  }

  public String getWorkspaceUrlName() {
    return workspaceUrlName;
  }

  public void setWorkspaceUrlName(String workspaceUrlName) {
    this.workspaceUrlName = workspaceUrlName;
  }

  public String getWorkspaceName() {
    return workspaceName;
  }

  public Long getWorkspaceEntityId() {
    return workspaceEntityId;
  }

  public List<ContentNode> getContentNodes() {
    return contentNodes;
  }

  private WorkspaceRootFolder rootFolder;
  private String workspaceName;
  private Long workspaceEntityId;
  private List<ContentNode> contentNodes;
}