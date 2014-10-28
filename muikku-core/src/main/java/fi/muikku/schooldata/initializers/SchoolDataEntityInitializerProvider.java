package fi.muikku.schooldata.initializers;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.Iterator;
import java.util.List;

import javax.enterprise.inject.Instance;
import javax.inject.Inject;

import fi.muikku.schooldata.entity.EnvironmentRole;
import fi.muikku.schooldata.entity.UserRole;
import fi.muikku.schooldata.entity.Workspace;
import fi.muikku.schooldata.entity.WorkspaceRole;
import fi.muikku.schooldata.entity.WorkspaceUser;

public class SchoolDataEntityInitializerProvider {

  @Inject
  private Instance<SchoolDataWorkspaceInitializer> workspaceInitializers;
  
  @Inject
  private Instance<SchoolDataEnvironmentRoleInitializer> environmentRoleInitializers;
  
  @Inject
  private Instance<SchoolDataWorkspaceRoleInitializer> workspaceRoleInitializers;

  @Inject
  private Instance<SchoolDataUserRoleInitializer> userRoleInitializers;

  @Inject
  private Instance<SchoolDataWorkspaceUserInitializer> workspaceUserInitializers;
  
  public List<Workspace> initWorkspaces(List<Workspace> workspaces) {
    if (!workspaces.isEmpty()) {
      for (SchoolDataEntityInitializer initializer : getSortedInitializers(workspaceInitializers.iterator())) {
        ((SchoolDataWorkspaceInitializer) initializer).init(workspaces);
      }
    }
    
    return workspaces;
  }

  public List<WorkspaceRole> initWorkspaceRoles(List<WorkspaceRole> workspaceRoles) {
    if (!workspaceRoles.isEmpty()) {
      for (SchoolDataEntityInitializer initializer : getSortedInitializers(workspaceRoleInitializers.iterator())) {
        ((SchoolDataWorkspaceRoleInitializer) initializer).init(workspaceRoles);
      }
    }
    
    return workspaceRoles;
  }

  public List<EnvironmentRole> initEnvironmentRoles(List<EnvironmentRole> environmentRoles) {
    if (!environmentRoles.isEmpty()) {
      for (SchoolDataEntityInitializer initializer : getSortedInitializers(environmentRoleInitializers.iterator())) {
        ((SchoolDataEnvironmentRoleInitializer) initializer).init(environmentRoles);
      }
    }
    
    return environmentRoles;
  }

  public List<UserRole> initUserRoles(List<UserRole> userRoles) {
    if (!userRoles.isEmpty()) {
      for (SchoolDataEntityInitializer initializer : getSortedInitializers(userRoleInitializers.iterator())) {
        ((SchoolDataUserRoleInitializer) initializer).init(userRoles);
      }
    }
    
    return userRoles;
  }

  public List<WorkspaceUser> initWorkspaceUsers(List<WorkspaceUser> workspaceUsers) {
    if (!workspaceUsers.isEmpty()) {
      for (SchoolDataEntityInitializer initializer : getSortedInitializers(workspaceUserInitializers.iterator())) {
        ((SchoolDataWorkspaceUserInitializer) initializer).init(workspaceUsers);
      }
    }
    
    return workspaceUsers;
  }
  
  private List<? extends SchoolDataEntityInitializer> getSortedInitializers(Iterator<? extends SchoolDataEntityInitializer> iterator) {
    List<SchoolDataEntityInitializer> initializers = new ArrayList<>();
    
    while (iterator.hasNext()) {
      initializers.add(iterator.next());
    }
    
    return sortInitializers(initializers);
  }

  private List<SchoolDataEntityInitializer> sortInitializers(List<SchoolDataEntityInitializer> initializers) {
    Collections.sort(initializers, new Comparator<SchoolDataEntityInitializer>() {
      
      @Override
      public int compare(SchoolDataEntityInitializer o1, SchoolDataEntityInitializer o2) {
        return o1.getPriority() - o2.getPriority();
      }
    });
    
    return initializers;
  } 
  
}
