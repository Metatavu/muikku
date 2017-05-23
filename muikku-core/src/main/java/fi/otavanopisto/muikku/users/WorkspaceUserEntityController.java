package fi.otavanopisto.muikku.users;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.logging.Logger;

import javax.enterprise.event.Observes;
import javax.inject.Inject;

import fi.otavanopisto.muikku.dao.workspace.WorkspaceUserEntityDAO;
import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.model.users.UserSchoolDataIdentifier;
import fi.otavanopisto.muikku.model.workspace.WorkspaceEntity;
import fi.otavanopisto.muikku.model.workspace.WorkspaceRoleArchetype;
import fi.otavanopisto.muikku.model.workspace.WorkspaceRoleEntity;
import fi.otavanopisto.muikku.model.workspace.WorkspaceUserEntity;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.schooldata.events.SchoolDataUserInactiveEvent;

public class WorkspaceUserEntityController {

  @Inject
  private Logger logger;

  @Inject
  private UserSchoolDataIdentifierController userSchoolDataIdentifierController;
  
  @Inject
  private WorkspaceUserEntityDAO workspaceUserEntityDAO;
  
  public void onSchoolDataUserInactiveEvent(@Observes SchoolDataUserInactiveEvent event) {
    UserSchoolDataIdentifier userSchoolDataIdentifier = userSchoolDataIdentifierController.findUserSchoolDataIdentifierByDataSourceAndIdentifier(event.getDataSource(), event.getIdentifier());
    if (userSchoolDataIdentifier != null) {
      List<WorkspaceUserEntity> workspaceUserEntities = workspaceUserEntityDAO.listByUserSchoolDataIdentifierAndActiveAndArchived(userSchoolDataIdentifier, Boolean.TRUE, Boolean.FALSE);
      for (WorkspaceUserEntity workspaceUserEntity : workspaceUserEntities) {
        workspaceUserEntityDAO.updateActive(workspaceUserEntity, Boolean.FALSE);
      }
      // TODO userIndexer.indexUser because active workspaces have changed? 
    }
  }

  public WorkspaceUserEntity createWorkspaceUserEntity(UserSchoolDataIdentifier userSchoolDataIdentifier, WorkspaceEntity workspaceEntity, String identifier, WorkspaceRoleEntity workspaceUserRole) {
    return workspaceUserEntityDAO.create(userSchoolDataIdentifier, workspaceEntity, workspaceUserRole, identifier, Boolean.TRUE, Boolean.FALSE);
  }

  public WorkspaceUserEntity findWorkspaceUserEntityById(Long id) {
    return workspaceUserEntityDAO.findById(id);
  }

  public WorkspaceUserEntity findWorkspaceUserEntityByWorkspaceUserIdentifier(SchoolDataIdentifier workspaceUserIdentifier) {
    return workspaceUserEntityDAO.findByIdentifierAndArchived(workspaceUserIdentifier.getIdentifier(), Boolean.FALSE);
  }

  public WorkspaceUserEntity findWorkspaceUserEntityByWorkspaceUserIdentifierAndArchived(SchoolDataIdentifier workspaceUserIdentifier, Boolean archived) {
    return workspaceUserEntityDAO.findByIdentifierAndArchived(workspaceUserIdentifier.getIdentifier(), archived);
  }

  public WorkspaceUserEntity findWorkspaceUserEntityByWorkspaceUserIdentifierIncludeArchived(SchoolDataIdentifier workspaceUserIdentifier) {
    return workspaceUserEntityDAO.findByIdentifier(workspaceUserIdentifier.getIdentifier());
  }

  public WorkspaceUserEntity findWorkspaceUserEntityByWorkspaceAndUserIdentifier(WorkspaceEntity workspaceEntity, SchoolDataIdentifier userIdentifier) {
    UserSchoolDataIdentifier userSchoolDataIdentifier = userSchoolDataIdentifierController.
        findUserSchoolDataIdentifierByDataSourceAndIdentifier(userIdentifier.getDataSource(), userIdentifier.getIdentifier());
    if (userSchoolDataIdentifier != null) {
      return findWorkspaceUserEntityByWorkspaceAndUserSchoolDataIdentifier(workspaceEntity, userSchoolDataIdentifier);
    }
    else {
      logger.severe(String.format("Could not find UserSchoolDataIdentifier by %s", userIdentifier));
      return null;
    }
  }

  public WorkspaceUserEntity findWorkspaceUserEntityByWorkspaceAndUserIdentifierIncludeArchived(WorkspaceEntity workspaceEntity, SchoolDataIdentifier userIdentifier) {
    UserSchoolDataIdentifier userSchoolDataIdentifier = userSchoolDataIdentifierController.
        findUserSchoolDataIdentifierByDataSourceAndIdentifier(userIdentifier.getDataSource(), userIdentifier.getIdentifier());
    if (userSchoolDataIdentifier != null) {
      return findWorkspaceUserEntityByWorkspaceAndUserSchoolDataIdentifierIncludeArchived(workspaceEntity, userSchoolDataIdentifier);
    }
    else {
      logger.severe(String.format("Could not find UserSchoolDataIdentifier by %s", userIdentifier));
      return null;
    }
  }

  public WorkspaceUserEntity findWorkspaceUserEntityByWorkspaceAndUserSchoolDataIdentifier(WorkspaceEntity workspaceEntity, UserSchoolDataIdentifier userSchoolDataIdentifier) {
    return workspaceUserEntityDAO.findByWorkspaceEntityAndUserSchoolDataIdentifierAndArchived(workspaceEntity, userSchoolDataIdentifier, Boolean.FALSE);
  }

  public WorkspaceUserEntity findWorkspaceUserEntityByWorkspaceAndUserSchoolDataIdentifierIncludeArchived(WorkspaceEntity workspaceEntity, UserSchoolDataIdentifier userSchoolDataIdentifier) {
    return workspaceUserEntityDAO.findByWorkspaceEntityAndUserSchoolDataIdentifier(workspaceEntity, userSchoolDataIdentifier);
  }

  public List<WorkspaceUserEntity> listWorkspaceUserEntities(WorkspaceEntity workspaceEntity) {
    return workspaceUserEntityDAO.listByWorkspaceEntityAndArchived(workspaceEntity, Boolean.FALSE);
  }

  public List<WorkspaceUserEntity> listWorkspaceUserEntitiesIncludeArchived(WorkspaceEntity workspaceEntity) {
    return workspaceUserEntityDAO.listByWorkspaceEntity(workspaceEntity);
  }

  public List<WorkspaceUserEntity> listWorkspaceStaffMembers(WorkspaceEntity workspaceEntity) {
    return workspaceUserEntityDAO.listByWorkspaceEntityAndRoleArchetypeAndArchived(workspaceEntity, WorkspaceRoleArchetype.TEACHER, Boolean.FALSE);
  }

  public List<WorkspaceUserEntity> listActiveWorkspaceStaffMembers(WorkspaceEntity workspaceEntity) {
    return workspaceUserEntityDAO.listByWorkspaceEntityAndRoleArchetypeAndActiveAndArchived(workspaceEntity, WorkspaceRoleArchetype.TEACHER, Boolean.TRUE, Boolean.FALSE);
  }

  public List<WorkspaceUserEntity> listActiveWorkspaceStudents(WorkspaceEntity workspaceEntity) {
    return workspaceUserEntityDAO.listByWorkspaceEntityAndRoleArchetypeAndActiveAndArchived(workspaceEntity, WorkspaceRoleArchetype.STUDENT, Boolean.TRUE, Boolean.FALSE);
  }

  public List<WorkspaceUserEntity> listWorkspaceUserEntitiesByRole(WorkspaceEntity workspaceEntity, WorkspaceRoleEntity role) {
    return workspaceUserEntityDAO.listByWorkspaceEntityAndRoleAndArchived(workspaceEntity, role, Boolean.FALSE);
  }

  public List<WorkspaceUserEntity> listActiveWorkspaceUserEntitiesByRoleArchetype(WorkspaceEntity workspaceEntity, WorkspaceRoleArchetype archetype) {
    return workspaceUserEntityDAO.listByWorkspaceEntityAndRoleArchetypeAndActiveAndArchived(workspaceEntity, archetype, Boolean.TRUE, Boolean.FALSE);
  }

  public List<WorkspaceUserEntity> listWorkspaceUserEntitiesByUserIdentifier(SchoolDataIdentifier userIdentifier) {
    UserSchoolDataIdentifier userSchoolDataIdentifier = userSchoolDataIdentifierController.
        findUserSchoolDataIdentifierByDataSourceAndIdentifier(userIdentifier.getDataSource(), userIdentifier.getIdentifier());
    
    if (userSchoolDataIdentifier != null) {
      return workspaceUserEntityDAO.listByUserSchoolDataIdentifierAndArchived(userSchoolDataIdentifier, Boolean.FALSE);
    }
    else {
      logger.severe(String.format("Could not find UserSchoolDataIdentifier by %s", userIdentifier));
      return Collections.emptyList();
    }
  }

  public List<WorkspaceUserEntity> listActiveWorkspaceUserEntitiesByUserIdentifier(SchoolDataIdentifier userIdentifier) {
    UserSchoolDataIdentifier userSchoolDataIdentifier = userSchoolDataIdentifierController.
        findUserSchoolDataIdentifierByDataSourceAndIdentifier(userIdentifier.getDataSource(), userIdentifier.getIdentifier());
    
    if (userSchoolDataIdentifier != null) {
      return workspaceUserEntityDAO.listByUserSchoolDataIdentifierAndActiveAndArchived(userSchoolDataIdentifier, Boolean.TRUE, Boolean.FALSE);
    }
    else {
      logger.severe(String.format("Could not find UserSchoolDataIdentifier by %s", userIdentifier));
      return Collections.emptyList();
    }
  }
  
  public List<WorkspaceUserEntity> listActiveWorkspaceUserEntitiesByUserEntity(UserEntity userEntity) {
    return workspaceUserEntityDAO.listByUserEntityAndActiveAndArchived(userEntity, Boolean.TRUE, Boolean.FALSE);
  }

  public List<WorkspaceUserEntity> listWorkspaceUserEntitiesByUserEntity(UserEntity userEntity) {
    return workspaceUserEntityDAO.listByUserEntityAndArchived(userEntity, Boolean.FALSE);
  }

  public List<WorkspaceUserEntity> listWorkspaceUserEntitiesByWorkspaceAndUser(WorkspaceEntity workspaceEntity, UserEntity userEntity) {
    return workspaceUserEntityDAO.listByWorkspaceEntityAndUserEntityAndArchived(workspaceEntity, userEntity, Boolean.FALSE);
  }
  
  public WorkspaceUserEntity archiveWorkspaceUserEntity(WorkspaceUserEntity workspaceUserEntity) {
    return workspaceUserEntityDAO.updateArchived(workspaceUserEntity, Boolean.TRUE);
  }

  public WorkspaceUserEntity unarchiveWorkspaceUserEntity(WorkspaceUserEntity workspaceUserEntity) {
    return workspaceUserEntityDAO.updateArchived(workspaceUserEntity, Boolean.FALSE);
  }
  
  public WorkspaceUserEntity updateUserSchoolDataIdentifier(WorkspaceUserEntity workspaceUserEntity, UserSchoolDataIdentifier userSchoolDataIdentifier) {
    return workspaceUserEntityDAO.updateUserSchoolDataIdentifier(workspaceUserEntity, userSchoolDataIdentifier);
  }

  public WorkspaceUserEntity updateIdentifier(WorkspaceUserEntity workspaceUserEntity, String identifier) {
    return workspaceUserEntityDAO.updateIdentifier(workspaceUserEntity, identifier);
  }

  public WorkspaceUserEntity updateActive(WorkspaceUserEntity workspaceUserEntity, Boolean active) {
    return workspaceUserEntityDAO.updateActive(workspaceUserEntity, active);
  }

  public WorkspaceUserEntity updateWorkspaceUserRole(WorkspaceUserEntity workspaceUserEntity, WorkspaceRoleEntity workspaceUserRole) {
    return workspaceUserEntityDAO.updateWorkspaceUserRole(workspaceUserEntity, workspaceUserRole);
  }

  public WorkspaceUserEntity findWorkspaceUserByWorkspaceEntityAndUserIdentifier(WorkspaceEntity workspaceEntity, SchoolDataIdentifier userIdentifier) {
    UserSchoolDataIdentifier userSchoolDataIdentifier = userSchoolDataIdentifierController.findUserSchoolDataIdentifierByDataSourceAndIdentifier(userIdentifier.getDataSource(), userIdentifier.getIdentifier());
    if (userSchoolDataIdentifier == null) {
      return null;
    }
    return workspaceUserEntityDAO.findByWorkspaceEntityAndUserSchoolDataIdentifierAndArchived(workspaceEntity, userSchoolDataIdentifier, Boolean.FALSE);
  }

  public WorkspaceUserEntity findWorkspaceUserByWorkspaceEntityAndUserIdentifierIncludeArchived(WorkspaceEntity workspaceEntity, SchoolDataIdentifier userIdentifier) {
    UserSchoolDataIdentifier userSchoolDataIdentifier = userSchoolDataIdentifierController.findUserSchoolDataIdentifierByDataSourceAndIdentifier(userIdentifier.getDataSource(), userIdentifier.getIdentifier());
    if (userSchoolDataIdentifier == null) {
      return null;
    }
    return workspaceUserEntityDAO.findByWorkspaceEntityAndUserSchoolDataIdentifier(workspaceEntity, userSchoolDataIdentifier);
  }

  public WorkspaceUserEntity findWorkspaceUserByWorkspaceEntityAndUserEntity(WorkspaceEntity workspaceEntity, UserEntity userEntity) {
    UserSchoolDataIdentifier userSchoolDataIdentifier = userSchoolDataIdentifierController.findUserSchoolDataIdentifierByDataSourceAndIdentifier(userEntity.getDefaultSchoolDataSource(), userEntity.getDefaultIdentifier());
    if (userSchoolDataIdentifier == null) {
      return null;
    }
    
    return workspaceUserEntityDAO.findByWorkspaceEntityAndUserSchoolDataIdentifierAndArchived(workspaceEntity, userSchoolDataIdentifier, Boolean.FALSE);
  }
  
  public WorkspaceRoleEntity findWorkspaceUserRoleByWorkspaceEntityAndUserEntity(WorkspaceEntity workspaceEntity, UserEntity userEntity) {
    WorkspaceUserEntity workspaceUserEntity = findWorkspaceUserByWorkspaceEntityAndUserEntity(workspaceEntity, userEntity);
    if (workspaceUserEntity != null) {
      return workspaceUserEntity.getWorkspaceUserRole();
    }
    
    return null;
  }

  public List<WorkspaceEntity> listActiveWorkspaceEntitiesByUserEntity(UserEntity userEntity) {
    List<WorkspaceEntity> result = new ArrayList<>();
    
    List<WorkspaceUserEntity> workspaceUserEntities = listActiveWorkspaceUserEntitiesByUserEntity(userEntity);
    for (WorkspaceUserEntity workspaceUserEntity : workspaceUserEntities) {
      result.add(workspaceUserEntity.getWorkspaceEntity());
    }
    
    return result;
  }

  public List<WorkspaceEntity> listWorkspaceEntitiesByUserEntity(UserEntity userEntity) {
    List<WorkspaceEntity> result = new ArrayList<>();
    
    List<WorkspaceUserEntity> workspaceUserEntities = listWorkspaceUserEntitiesByUserEntity(userEntity);
    for (WorkspaceUserEntity workspaceUserEntity : workspaceUserEntities) {
      result.add(workspaceUserEntity.getWorkspaceEntity());
    }
    
    return result;
  }
  
  public List<WorkspaceEntity> listWorkspaceEntitiesByUserIdentifier(SchoolDataIdentifier userIdentifier) {
    List<WorkspaceEntity> result = new ArrayList<>();
    
    List<WorkspaceUserEntity> workspaceUserEntities = listWorkspaceUserEntitiesByUserIdentifier(userIdentifier);

    for (WorkspaceUserEntity workspaceUserEntity : workspaceUserEntities) {
      result.add(workspaceUserEntity.getWorkspaceEntity());
    }
    
    return result;
  }

  public List<WorkspaceEntity> listActiveWorkspaceEntitiesByUserIdentifier(SchoolDataIdentifier userIdentifier) {
    List<WorkspaceEntity> result = new ArrayList<>();
    List<WorkspaceUserEntity> workspaceUserEntities = listActiveWorkspaceUserEntitiesByUserIdentifier(userIdentifier);
    for (WorkspaceUserEntity workspaceUserEntity : workspaceUserEntities) {
      result.add(workspaceUserEntity.getWorkspaceEntity());
    }
    return result;
  }
  
  public void deleteWorkspaceUserEntity(WorkspaceUserEntity workspaceUserEntity) {
    workspaceUserEntityDAO.delete(workspaceUserEntity);
  }  

}
