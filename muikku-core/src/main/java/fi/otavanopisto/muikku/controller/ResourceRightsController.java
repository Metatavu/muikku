package fi.otavanopisto.muikku.controller;

import java.util.List;
import java.util.logging.Logger;

import javax.enterprise.inject.Model;
import javax.inject.Inject;

import fi.otavanopisto.muikku.dao.security.PermissionDAO;
import fi.otavanopisto.muikku.dao.security.ResourceRightsDAO;
import fi.otavanopisto.muikku.dao.security.ResourceRolePermissionDAO;
import fi.otavanopisto.muikku.model.security.Permission;
import fi.otavanopisto.muikku.model.security.ResourceRights;
import fi.otavanopisto.muikku.model.security.ResourceRolePermission;
import fi.otavanopisto.muikku.model.users.RoleEntity;
import fi.otavanopisto.muikku.security.PermissionScope;

@Model
public class ResourceRightsController {

  @Inject
  private Logger logger;

  @Inject
  private PermissionDAO permissionDAO;
  
  @Inject
  private ResourceRolePermissionDAO resourceRolePermissionDAO;
  
  @Inject
  private ResourceRightsDAO resourceRightsDAO;
  

  public ResourceRights findResourceRightsById(Long id) {
    return resourceRightsDAO.findById(id);
  }
  
  public List<Permission> listResourcePermissions() {
    return permissionDAO.listByScope(PermissionScope.RESOURCE);
  }
  
  public ResourceRights create() {
    return resourceRightsDAO.create();
  }
  
  public boolean hasResourceRolePermission(ResourceRights resourceRights, RoleEntity role, Permission permission) {
    return resourceRolePermissionDAO.hasResourcePermissionAccess(resourceRights, role, permission);
  }
  
  public ResourceRolePermission addResourceUserRolePermission(ResourceRights resourceRights, RoleEntity role, Permission permission) {
    return resourceRolePermissionDAO.create(resourceRights, role, permission);
  }
  
  public void deleteByResourceRights(ResourceRights resourceRights) {
    List<ResourceRolePermission> resourceRolePermissions = resourceRolePermissionDAO.listByResourceRights(resourceRights);
    logger.info(String.format("Deleting %d permissions of ResourceRights %d", resourceRolePermissions.size(), resourceRights.getId()));
    for (ResourceRolePermission resourceRolePermission : resourceRolePermissions) {
      resourceRolePermissionDAO.delete(resourceRolePermission);
    }
  }
  
  public void deleteResourceUserRolePermission(ResourceRolePermission resourceRolePermission) {
    resourceRolePermissionDAO.delete(resourceRolePermission);
  }

}
