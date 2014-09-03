package fi.muikku.plugins.workspace.dao;

import fi.muikku.dao.DAO;
import fi.muikku.plugins.CorePluginsDAO;
import fi.muikku.plugins.workspace.model.WorkspaceFolder;
import fi.muikku.plugins.workspace.model.WorkspaceNode;

@DAO
public class WorkspaceFolderDAO extends CorePluginsDAO<WorkspaceFolder> {
	
	private static final long serialVersionUID = 9095130166469638314L;

	public WorkspaceFolder create(WorkspaceNode parent, String title, String urlName) {
		WorkspaceFolder workspaceFolder = new WorkspaceFolder();
		workspaceFolder.setParent(parent);
		workspaceFolder.setUrlName(urlName);
		workspaceFolder.setTitle(title);
		return persist(workspaceFolder);
	}

	public void delete(WorkspaceFolder workspaceFolder) {
	  super.delete(workspaceFolder);
	}
	
}
