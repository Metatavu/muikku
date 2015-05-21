package fi.muikku.atests;

import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.annotation.Resource;
import javax.ejb.TimerService;
import javax.inject.Inject;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Response;

import fi.muikku.model.users.UserEntity;
import fi.muikku.model.users.UserSchoolDataIdentifier;
import fi.muikku.model.workspace.WorkspaceEntity;
import fi.muikku.rest.AbstractRESTService;
import fi.muikku.schooldata.WorkspaceController;
import fi.muikku.schooldata.WorkspaceEntityController;
import fi.muikku.schooldata.entity.User;
import fi.muikku.schooldata.entity.Workspace;
import fi.muikku.search.SearchIndexer;
import fi.muikku.session.local.LocalSession;
import fi.muikku.session.local.LocalSessionController;
import fi.muikku.users.UserController;
import fi.muikku.users.UserEntityController;
import fi.muikku.users.UserSchoolDataIdentifierController;
import fi.otavanopisto.security.rest.RESTPermit;
import fi.otavanopisto.security.rest.RESTPermit.Handling;


@Path("/test")
@Produces("application/json")
public class AcceptanceTestsRESTService extends AbstractRESTService {

  @Inject
  @LocalSession
  private LocalSessionController localSessionController;
  
  @Inject
  private Logger logger;
  
  @Inject
  private WorkspaceController workspaceController;
  
  @Inject
  private WorkspaceEntityController workspaceEntityController;
  
  @Inject
  private UserController userController;

  @Inject
  private UserEntityController userEntityController;
  
  @Inject
  private UserSchoolDataIdentifierController userSchoolDataIdentifierController; 
  
  @Inject
  private SearchIndexer indexer;
   
  @GET
  @Path("/login")
  @Produces("text/plain")
  @RESTPermit (handling = Handling.UNSECURED)
  public Response test_login(@QueryParam ("role") String role) {
    System.out.println("Acceptance tests logging in with role " + role);
    
    switch (role) {
      case "ENVIRONMENT-STUDENT":
        localSessionController.login("PYRAMUS", "STUDENT-1");
      break;
      case "ENVIRONMENT-TEACHER":
        localSessionController.login("PYRAMUS", "TEACHER-2");
      break;
      case "ENVIRONMENT-MANAGER":
        localSessionController.login("PYRAMUS", "MANAGER-3");
      break;
      case "ENVIRONMENT-ADMINISTRATOR":
        localSessionController.login("PYRAMUS", "ADMINISTRATOR-4");
      break;
      
      case "PSEUDO-EVERYONE":
        // Do nothing
      break;
      
    }
    
    return Response.ok().build();
  }
  
  @GET
  @Path("/reindex")
  @Produces("text/plain")
  @RESTPermit (handling = Handling.UNSECURED)
  public Response test_reindex() {
    List<WorkspaceEntity> workspaceEntities = workspaceEntityController.listWorkspaceEntities();
    System.out.println("workspaceEntities size: " + workspaceEntities.size());
    System.out.println("-- workspaceEntity ---" + workspaceEntities.toString());
    for (int i = 0; i < workspaceEntities.size(); i++) {
      WorkspaceEntity workspaceEntity = workspaceEntities.get(i);
      System.out.println("-- workspaceEntity ---" + workspaceEntity.toString());
      Workspace workspace = workspaceController.findWorkspace(workspaceEntity);
      if (workspace != null) {
        try {
          System.out.println("-- Indexing workspace ---");
          indexer.index(Workspace.class.getSimpleName(), workspace);
          System.out.println("-- Finished indexing workspace ---");
        } catch (Exception e) {
          logger.log(Level.WARNING, "could not index WorkspaceEntity #" + workspaceEntity.getId(), e);
        }
      }
    }

    logger.log(Level.INFO, "Reindexed workspaces )");
   
    List<UserEntity> users = userEntityController.listUserEntities();
    System.out.println("users size: " + users.size());
    for (int i = 0; i < users.size(); i++) {
      UserEntity userEntity = users.get(i);
      List<UserSchoolDataIdentifier> identifiers = userSchoolDataIdentifierController.listUserSchoolDataIdentifiersByUserEntity(userEntity);

      for (UserSchoolDataIdentifier identifier : identifiers) {
        User user = userController.findUserByDataSourceAndIdentifier(identifier.getDataSource(), identifier.getIdentifier());
        try {
          System.out.println("-- Indexing users ---");
          indexer.index(User.class.getSimpleName(), user);
          System.out.println("-- Finished indexing users ---");
        } catch (Exception e) {
          logger.log(Level.WARNING, "could not index User #" + user.getSchoolDataSource() + '/' + user.getIdentifier(), e);
        }
      }
    }
    logger.log(Level.INFO, "Reindexed users");
    
   return Response.ok().build();
  }
}
