package fi.otavanopisto.muikku.plugins.workspace;

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

import fi.otavanopisto.muikku.jsf.NavigationRules;
import fi.otavanopisto.muikku.model.workspace.WorkspaceEntity;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceRootFolder;
import fi.otavanopisto.muikku.schooldata.WorkspaceController;
import fi.otavanopisto.muikku.security.MuikkuPermissions;
import fi.otavanopisto.muikku.session.SessionController;
import fi.otavanopisto.muikku.session.local.LocalSession;
import fi.otavanopisto.security.LoggedIn;

@Named
@Stateful
@RequestScoped
@Join(path = "/workspace/{workspaceUrlName}/materials-management", to = "/jsf/workspace/materials-management.jsf")
@LoggedIn
public class WorkspaceMaterialsManagementBackingBean extends AbstractWorkspaceBackingBean {

  @Inject
  private Logger logger;

  @Parameter
  private String workspaceUrlName;
  
  @LocalSession
  @Inject
  private SessionController sessionController;

  @Inject
  private WorkspaceController workspaceController;

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
    
    if (!sessionController.hasWorkspacePermission(MuikkuPermissions.MANAGE_WORKSPACE_MATERIALS, workspaceEntity)) {
      return NavigationRules.ACCESS_DENIED;
    }

    rootFolder = workspaceMaterialController.findWorkspaceRootFolderByWorkspaceEntity(workspaceEntity);
    workspaceEntityId = workspaceEntity.getId();
    workspaceBackingBean.setWorkspaceUrlName(urlName);
    workspaceName = workspaceBackingBean.getWorkspaceName();

    try {
      contentNodes = workspaceMaterialController.listWorkspaceMaterialsAsContentNodes(workspaceEntity, true);
    } catch (WorkspaceMaterialException e) {
      logger.log(Level.SEVERE, "Error loading materials", e);
      return NavigationRules.INTERNAL_ERROR;
    }
    
    materialsBaseUrl = String.format("/workspace/%s/materials", workspaceUrlName);
    
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

  public String getMaterialsBaseUrl() {
    return materialsBaseUrl;
  }
  
  private WorkspaceRootFolder rootFolder;
  private String workspaceName;
  private Long workspaceEntityId;
  private List<ContentNode> contentNodes;
  private String materialsBaseUrl;
}