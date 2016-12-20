package fi.otavanopisto.muikku.plugins.announcer.rest;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Calendar;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.logging.Logger;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.ws.rs.DELETE;
import javax.ws.rs.DefaultValue;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.model.users.UserGroupEntity;
import fi.otavanopisto.muikku.model.workspace.WorkspaceEntity;
import fi.otavanopisto.muikku.plugin.PluginRESTService;
import fi.otavanopisto.muikku.plugins.announcer.AnnouncementController;
import fi.otavanopisto.muikku.plugins.announcer.AnnouncerPermissions;
import fi.otavanopisto.muikku.plugins.announcer.model.Announcement;
import fi.otavanopisto.muikku.plugins.announcer.model.AnnouncementUserGroup;
import fi.otavanopisto.muikku.plugins.announcer.workspace.model.AnnouncementWorkspace;
import fi.otavanopisto.muikku.plugins.workspace.rest.model.WorkspaceBasicInfo;
import fi.otavanopisto.muikku.plugins.workspace.rest.model.WorkspaceRESTModelController;
import fi.otavanopisto.muikku.schooldata.WorkspaceEntityController;
import fi.otavanopisto.muikku.session.SessionController;
import fi.otavanopisto.muikku.session.local.LocalSession;
import fi.otavanopisto.muikku.users.UserGroupEntityController;
import fi.otavanopisto.security.rest.RESTPermit;
import fi.otavanopisto.security.rest.RESTPermit.Handling;

@RequestScoped
@Stateful
@Path("/announcer")
@Produces("application/json")
public class AnnouncerRESTService extends PluginRESTService {
  
  private static final long serialVersionUID = 1L;

  @Inject
  private Logger logger;

  @Inject
  private AnnouncementController announcementController;
  
  @Inject
  @LocalSession
  private SessionController sessionController;
  
  @Inject
  private UserGroupEntityController userGroupEntityController;
  
  @Inject
  private WorkspaceEntityController workspaceEntityController;

  @Inject
  private WorkspaceRESTModelController workspaceRESTModelController;
  
  private Date currentDate() {
    Calendar cal = Calendar.getInstance();
    cal.setTime(new Date());
    cal.set(Calendar.HOUR_OF_DAY, 0);
    cal.set(Calendar.MINUTE, 0);
    cal.set(Calendar.SECOND, 0);
    cal.set(Calendar.MILLISECOND, 0);
    return cal.getTime();
  }
  
  @POST
  @Path("/announcements")
  @RESTPermit(handling = Handling.INLINE)
  public Response createAnnouncement(AnnouncementRESTModel restModel) {
    UserEntity userEntity = sessionController.getLoggedUserEntity();
    
    List<Long> workspaceEntityIds = restModel.getWorkspaceEntityIds();
    if (workspaceEntityIds == null) {
      workspaceEntityIds = Collections.emptyList();
    }
    
    List<Long> userGroupEntityIds = restModel.getUserGroupEntityIds();
    if (userGroupEntityIds == null) {
      userGroupEntityIds = Collections.emptyList();
    }
    
    if (workspaceEntityIds.isEmpty() && !sessionController.hasEnvironmentPermission(AnnouncerPermissions.CREATE_ANNOUNCEMENT)) {
      return Response.status(Status.FORBIDDEN).entity("You don't have the permission to create environment announcements").build();
    }

    for (Long workspaceEntityId : workspaceEntityIds) {
      WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceEntityById(workspaceEntityId);

      if (workspaceEntity == null) {
        return Response.status(Status.BAD_REQUEST).entity("Invalid workspaceEntityId").build();
      }

      if (!sessionController.hasWorkspacePermission(AnnouncerPermissions.CREATE_WORKSPACE_ANNOUNCEMENT, workspaceEntity)) {
        return Response.status(Status.FORBIDDEN).entity("You don't have the permission to create workspace announcement").build();
      }
    }
    
    Announcement announcement = announcementController.createAnnouncement(
        userEntity,
        restModel.getCaption(),
        restModel.getContent(),
        restModel.getStartDate(),
        restModel.getEndDate(),
        restModel.getPubliclyVisible());
    
    for (Long userGroupEntityId : userGroupEntityIds) {
      UserGroupEntity userGroupEntity = userGroupEntityController.findUserGroupEntityById(userGroupEntityId);

      if (userGroupEntity == null) {
        return Response.status(Status.BAD_REQUEST).entity("Invalid userGroupEntityId").build();
      }

      announcementController.addAnnouncementTargetGroup(announcement, userGroupEntity);
    }

    for (Long workspaceEntityId : workspaceEntityIds) {
      WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceEntityById(workspaceEntityId);

      if (workspaceEntity == null) {
        return Response.status(Status.BAD_REQUEST).entity("Invalid workspaceEntityId").build();
      }

      announcementController.addAnnouncementWorkspace(announcement, workspaceEntity);
    }
    
    return Response.noContent().build();
  }

  @PUT
  @Path("/announcements/{ID}")
  @RESTPermit(handling = Handling.INLINE)
  public Response updateAnnouncement(@PathParam("ID") Long announcementId, AnnouncementRESTModel restModel) {
    List<Long> workspaceEntityIds = restModel.getWorkspaceEntityIds();
    if (workspaceEntityIds == null) {
      workspaceEntityIds = Collections.emptyList();
    }
    
    List<Long> userGroupEntityIds = restModel.getUserGroupEntityIds();
    if (userGroupEntityIds == null) {
      userGroupEntityIds = Collections.emptyList();
    }
    
    if (workspaceEntityIds.isEmpty() && !sessionController.hasEnvironmentPermission(AnnouncerPermissions.UPDATE_ANNOUNCEMENT)) {
      return Response.status(Status.FORBIDDEN).entity("You don't have the permission to update environment announcements").build();
    }

    for (Long workspaceEntityId : workspaceEntityIds) {
      WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceEntityById(workspaceEntityId);

      if (workspaceEntity == null) {
        return Response.status(Status.BAD_REQUEST).entity("Invalid workspaceEntityId").build();
      }

      if (!sessionController.hasWorkspacePermission(AnnouncerPermissions.UPDATE_WORKSPACE_ANNOUNCEMENT, workspaceEntity)) {
        return Response.status(Status.FORBIDDEN).entity("You don't have the permission to update workspace announcement").build();
      }
    }

    if (announcementId == null) {
      return Response.status(Status.BAD_REQUEST).build();
    }
    
    Announcement oldAnnouncement = announcementController.findById(announcementId);
    
    if (oldAnnouncement == null) {
      return Response.status(Status.NOT_FOUND).build();
    }
    
    Announcement newAnnouncement = announcementController.updateAnnouncement(
        oldAnnouncement,
        restModel.getCaption(),
        restModel.getContent(),
        restModel.getStartDate(),
        restModel.getEndDate(),
        restModel.getPubliclyVisible());

    announcementController.clearAnnouncementTargetGroups(newAnnouncement);
    for (Long userGroupEntityId : userGroupEntityIds) {
      UserGroupEntity userGroupEntity = userGroupEntityController.findUserGroupEntityById(userGroupEntityId);
      
      if (userGroupEntity == null) {
        return Response.status(Status.BAD_REQUEST).entity("Invalid userGroupEntityId").build();
      }
      
      announcementController.addAnnouncementTargetGroup(newAnnouncement, userGroupEntity);
    }

    announcementController.clearAnnouncementWorkspaces(newAnnouncement);
    for (Long workspaceEntityId : workspaceEntityIds) {
      WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceEntityById(workspaceEntityId);

      if (workspaceEntity == null) {
        return Response.status(Status.BAD_REQUEST).entity("Invalid workspaceEntityId").build();
      }

      announcementController.addAnnouncementWorkspace(newAnnouncement, workspaceEntity);
    }
    
    return Response
        .ok(createRESTModel(newAnnouncement))
        .build();
  }
  
  @GET
  @Path("/announcements")
  @RESTPermit(handling=Handling.INLINE)
  public Response listAnnouncements(
      @QueryParam("hideEnvironmentAnnouncements") @DefaultValue("false") boolean hideEnvironmentAnnouncements,
      @QueryParam("hideWorkspaceAnnouncements") @DefaultValue("false") boolean hideWorkspaceAnnouncements,
      @QueryParam("workspaceEntityId") Long workspaceEntityId,
      @QueryParam("onlyMine") @DefaultValue("false") boolean onlyMine,
      @QueryParam("showExpired") @DefaultValue("false") boolean showExpired      
  ) {
    UserEntity currentUserEntity = sessionController.getLoggedUserEntity();
    List<Announcement> announcements = null;

    // List announcements from environment level, including environment announcements and optionally workspace announcements
    
    if (workspaceEntityId == null) {
      // If expired announcements are requested, the user needs permission to do so.
      if (showExpired && !sessionController.hasEnvironmentPermission(AnnouncerPermissions.LIST_ALL_ANNOUNCEMENTS)) {
        return Response.status(Status.FORBIDDEN).entity("You're not allowed to list expired announcements").build();
      }
      
      boolean includeGroups = true;
      boolean includeWorkspaces = !hideWorkspaceAnnouncements;
      boolean includeEnvironment = !hideEnvironmentAnnouncements;
      announcements = announcementController.listAnnouncements(
          includeGroups, includeWorkspaces, includeEnvironment, showExpired, currentUserEntity, onlyMine);
    }

    if (workspaceEntityId != null) {
      WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceEntityById(workspaceEntityId);
      if (workspaceEntity == null) {
        return Response.status(Status.BAD_REQUEST).entity("Workspace entity with given ID not found").build();
      }

      if (!sessionController.hasWorkspacePermission(AnnouncerPermissions.LIST_WORKSPACE_ANNOUNCEMENTS, workspaceEntity)) {
        return Response.status(Status.FORBIDDEN).entity("You don't have the permission to list workspace announcements").build();
      }
      
      boolean includeEnvironment = !hideEnvironmentAnnouncements;
      List<WorkspaceEntity> workspaceEntities = Arrays.asList(workspaceEntity);
      announcements = announcementController.listAnnouncements(
          workspaceEntities, includeEnvironment, showExpired, currentUserEntity, onlyMine);
    }

    List<AnnouncementRESTModel> restModels = new ArrayList<>();
    for (Announcement announcement : announcements) {
      AnnouncementRESTModel restModel = createRESTModel(announcement);
      restModels.add(restModel);
    }

    return Response.ok(restModels).build();
  }
  
  @GET
  @Path("/announcements/{ID}")
  @RESTPermit(AnnouncerPermissions.FIND_ANNOUNCEMENT)
  public Response findAnnouncementById(@PathParam("ID") Long announcementId) {
    Announcement announcement = announcementController.findById(announcementId);
    if (announcement == null) {
      return Response.status(Status.NOT_FOUND).entity("Announcement not found").build();
    }
    
    return Response.ok(createRESTModel(announcement)).build();
  }

  private AnnouncementRESTModel createRESTModel(Announcement announcement) {
    List<AnnouncementUserGroup> announcementUserGroups = announcementController.listAnnouncementUserGroups(announcement);
    List<AnnouncementWorkspace> announcementWorkspaces = announcementController.listAnnouncementWorkspaces(announcement);
      
    AnnouncementRESTModel restModel = new AnnouncementRESTModel();
    restModel.setPublisherUserEntityId(announcement.getPublisherUserEntityId());
    restModel.setCaption(announcement.getCaption());
    restModel.setContent(announcement.getContent());
    restModel.setCreated(announcement.getCreated());
    restModel.setStartDate(announcement.getStartDate());
    restModel.setEndDate(announcement.getEndDate());
    restModel.setId(announcement.getId());
    restModel.setPubliclyVisible(announcement.getPubliclyVisible());

    List<Long> userGroupEntityIds = new ArrayList<>();
    for (AnnouncementUserGroup announcementUserGroup : announcementUserGroups) {
      userGroupEntityIds.add(announcementUserGroup.getUserGroupEntityId());
    }
    restModel.setUserGroupEntityIds(userGroupEntityIds);

    List<Long> workspaceEntityIds = new ArrayList<>();
    List<WorkspaceBasicInfo> workspaceBasicInfos = new ArrayList<>();
    for (AnnouncementWorkspace announcementWorkspace : announcementWorkspaces) {
      workspaceEntityIds.add(announcementWorkspace.getWorkspaceEntityId());
      
      WorkspaceBasicInfo workspaceBasicInfo = workspaceRESTModelController.workspaceBasicInfo(announcementWorkspace.getWorkspaceEntityId());
      if (workspaceBasicInfo != null)
        workspaceBasicInfos.add(workspaceBasicInfo);
      else
        logger.warning(String.format("Logged user couldn't find workspace basic info for workspace"));
    }
    restModel.setWorkspaceEntityIds(workspaceEntityIds);
    restModel.setWorkspaces(workspaceBasicInfos);
    
    Date date = currentDate();
    if (date.before(announcement.getStartDate())) {
      restModel.setTemporalStatus(AnnouncementTemporalStatus.UPCOMING);
    } else if (date.after(announcement.getEndDate())) {
      restModel.setTemporalStatus(AnnouncementTemporalStatus.ENDED);
    } else {
      restModel.setTemporalStatus(AnnouncementTemporalStatus.ACTIVE);
    }

    return restModel;
  }

  @DELETE
  @Path("/announcements/{ID}")
  @RESTPermit(handling = Handling.INLINE)
  public Response deleteAnnouncement(@PathParam("ID") Long announcementId) {
    Announcement announcement = announcementController.findById(announcementId);
    if (announcement == null) {
      return Response.status(Status.NOT_FOUND).build();
    }

    List<AnnouncementWorkspace> announcementWorkspaces = announcementController.listAnnouncementWorkspaces(announcement);

    if (announcementWorkspaces.isEmpty() && !sessionController.hasEnvironmentPermission(AnnouncerPermissions.DELETE_ANNOUNCEMENT)) {
      return Response.status(Status.FORBIDDEN).entity("You don't have the permission to update environment announcements").build();
    }

    for (AnnouncementWorkspace announcementWorkspace : announcementWorkspaces) {
      WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceEntityById(announcementWorkspace.getWorkspaceEntityId());

      if (workspaceEntity == null) {
        return Response.status(Status.BAD_REQUEST).entity("Invalid workspaceEntityId").build();
      }

      if (!sessionController.hasWorkspacePermission(AnnouncerPermissions.DELETE_WORKSPACE_ANNOUNCEMENT, workspaceEntity)) {
        return Response.status(Status.FORBIDDEN).entity("You don't have the permission to update workspace announcement").build();
      }
    }

    announcementController.archive(announcement);
    return Response.noContent().build();
  }
}
