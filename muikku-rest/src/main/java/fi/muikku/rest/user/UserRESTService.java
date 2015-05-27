package fi.muikku.rest.user;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.enterprise.inject.Any;
import javax.enterprise.inject.Instance;
import javax.inject.Inject;
import javax.ws.rs.Consumes;
import javax.ws.rs.DefaultValue;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import org.apache.commons.lang3.StringUtils;

import fi.muikku.model.users.EnvironmentRoleArchetype;
import fi.muikku.model.users.EnvironmentRoleEntity;
import fi.muikku.model.users.EnvironmentUser;
import fi.muikku.model.users.UserEntity;
import fi.muikku.rest.AbstractRESTService;
import fi.muikku.rest.RESTPermitUnimplemented;
import fi.muikku.schooldata.entity.User;
import fi.muikku.search.SearchProvider;
import fi.muikku.search.SearchResult;
import fi.muikku.session.SessionController;
import fi.muikku.users.EnvironmentUserController;
import fi.muikku.users.UserController;
import fi.muikku.users.UserEntityController;

@Path("/user")
@Produces("application/json")
@Consumes("application/json")
public class UserRESTService extends AbstractRESTService {

	@Inject
	private UserController userController;

	@Inject
	private UserEntityController userEntityController;

	@Inject
	private EnvironmentUserController environmentUserController;

	@Inject
	private SessionController sessionController;
	
	@Inject
	@Any
	private Instance<SearchProvider> searchProviders;

	@GET
	@Path("/users")
	@RESTPermitUnimplemented
	public Response searchUsers(
			@QueryParam("searchString") String searchString,
			@QueryParam("firstResult") @DefaultValue("0") Integer firstResult,
			@QueryParam("maxResults") @DefaultValue("10") Integer maxResults,
			@QueryParam("archetype") String archetype) {
	  
	  if (!sessionController.isLoggedIn()) {
	    return Response.status(Status.FORBIDDEN).build();
	  }
	  
		SearchProvider elasticSearchProvider = getProvider("elastic-search");
		if (elasticSearchProvider != null) {
			String[] fields = new String[] { "firstName", "lastName" };
			SearchResult result = null;

			if (StringUtils.isBlank(searchString)) {
				result = elasticSearchProvider.matchAllSearch(firstResult,
						maxResults, User.class);
			} else {
				result = elasticSearchProvider.search(searchString, fields,
						firstResult, maxResults, User.class);
			}

			List<Map<String, Object>> results = result.getResults();
			boolean hasImage = false;

			List<fi.muikku.rest.model.User> ret = new ArrayList<fi.muikku.rest.model.User>();

			if (!results.isEmpty()) {
				for (Map<String, Object> o : results) {
					boolean filter = false;
					String[] id = ((String) o.get("id")).split("/", 2);
					UserEntity userEntity = userEntityController
							.findUserEntityByDataSourceAndIdentifier(id[1],
									id[0]);
					if (!StringUtils.isEmpty(archetype)) {
						EnvironmentUser environmentUser = environmentUserController
								.findEnvironmentUserByUserEntity(userEntity);
					    if (environmentUser != null) {
					    	EnvironmentRoleEntity environmentRole = environmentUser.getRole();
							EnvironmentRoleArchetype environmentRoleArchetype = environmentRole.getArchetype();
							if (!StringUtils.equals(environmentRoleArchetype.toString(), archetype)) {
								filter = true;
							}
					    }
					}

					if (!filter && userEntity != null)
						ret.add(new fi.muikku.rest.model.User(userEntity
								.getId(), (String) o.get("firstName"),
								(String) o.get("lastName"), hasImage,
								(String) o.get("nationality"), (String) o
										.get("language"), (String) o
										.get("municipality"), (String) o
										.get("school")));
				}

				return Response.ok(ret).build();
			} else
				return Response.noContent().build();
		}

		return Response.status(Response.Status.INTERNAL_SERVER_ERROR).build();
	}

	@GET
	@Path("/users/{ID}")
  @RESTPermitUnimplemented
	public Response findUser(@PathParam("ID") Long id) {
    if (!sessionController.isLoggedIn()) {
      return Response.status(Status.FORBIDDEN).build();
    }

		UserEntity userEntity = userEntityController.findUserEntityById(id);
		if (userEntity == null) {
			return Response.status(Response.Status.NOT_FOUND).build();
		}

		User user = userController.findUserByDataSourceAndIdentifier(
				userEntity.getDefaultSchoolDataSource(),
				userEntity.getDefaultIdentifier());
		if (user == null) {
			return Response.status(Response.Status.NOT_FOUND).build();
		}

		return Response.ok(createRestModel(userEntity, user)).build();
	}

	private fi.muikku.rest.model.User createRestModel(UserEntity userEntity,
			User user) {
		// TODO: User Image
		boolean hasImage = false;
		return new fi.muikku.rest.model.User(userEntity.getId(),
				user.getFirstName(), user.getLastName(), hasImage,
				user.getNationality(), user.getLanguage(),
				user.getMunicipality(), user.getSchool());
	}

	//
	// FIXME: Re-enable this service
	//
	// // @GET
	// // @Path ("/listEnvironmentUsers")
	// // public Response listEnvironmentUsers() {
	// // List<EnvironmentUser> users = userController.listEnvironmentUsers();
	// //
	// // TranquilityBuilder tranquilityBuilder =
	// tranquilityBuilderFactory.createBuilder();
	// // Tranquility tranquility = tranquilityBuilder.createTranquility()
	// //
	// .addInstruction(tranquilityBuilder.createPropertyTypeInstruction(TranquilModelType.COMPLETE));
	// //
	// // return Response.ok(
	// // tranquility.entities(users)
	// // ).build();
	// // }
	//

	private SearchProvider getProvider(String name) {
		Iterator<SearchProvider> i = searchProviders.iterator();
		while (i.hasNext()) {
			SearchProvider provider = i.next();
			if (name.equals(provider.getName())) {
				return provider;
			}
		}
		return null;
	}

}
