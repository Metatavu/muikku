package fi.muikku.plugins.material.rest;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.ws.rs.GET;
import javax.ws.rs.NotFoundException;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import fi.muikku.plugin.PluginRESTService;
import fi.muikku.plugins.material.HtmlMaterialController;
import fi.muikku.plugins.material.model.HtmlMaterial;

@RequestScoped
@Path("/materials")
@Stateful
@Produces ("application/json")
public class MaterialRESTService extends PluginRESTService {
	@Inject
	private HtmlMaterialController htmlMaterialController;
	
	// 
	// HtmlMaterial 
	// 
	
	@GET
	@Path ("/html/{id}")
	@Produces(MediaType.TEXT_HTML)
	public String findMaterial(@PathParam("id") long id) {
	  HtmlMaterial material = htmlMaterialController.findHtmlMaterialById(id);
	  if (material == null) {
	    throw new NotFoundException();
	  }
	  return material.getHtml();
	}
}
