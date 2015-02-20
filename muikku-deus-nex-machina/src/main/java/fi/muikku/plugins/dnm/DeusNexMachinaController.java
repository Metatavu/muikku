package fi.muikku.plugins.dnm;

import java.io.IOException;
import java.io.InputStream;
import java.io.StringReader;
import java.io.StringWriter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Properties;
import java.util.logging.Logger;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.annotation.PostConstruct;
import javax.ejb.Stateful;
import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.transform.OutputKeys;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerException;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;
import javax.xml.xpath.XPathExpressionException;

import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.math.NumberUtils;
import org.apache.xerces.parsers.DOMParser;
import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.type.TypeReference;
import org.cyberneko.html.HTMLConfiguration;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.xml.sax.InputSource;
import org.xml.sax.SAXException;

import fi.muikku.controller.PluginSettingsController;
import fi.muikku.model.workspace.WorkspaceEntity;
import fi.muikku.plugins.dnm.parser.DeusNexException;
import fi.muikku.plugins.dnm.parser.DeusNexInternalException;
import fi.muikku.plugins.dnm.parser.DeusNexXmlUtils;
import fi.muikku.plugins.dnm.parser.content.DeusNexContentParser;
import fi.muikku.plugins.dnm.parser.content.DeusNexEmbeddedItemElementHandler;
import fi.muikku.plugins.dnm.parser.structure.DeusNexDocument;
import fi.muikku.plugins.dnm.parser.structure.DeusNexStructureParser;
import fi.muikku.plugins.dnm.parser.structure.model.Binary;
import fi.muikku.plugins.dnm.parser.structure.model.Document;
import fi.muikku.plugins.dnm.parser.structure.model.Folder;
import fi.muikku.plugins.dnm.parser.structure.model.Query;
import fi.muikku.plugins.dnm.parser.structure.model.Resource;
import fi.muikku.plugins.dnm.parser.structure.model.ResourceContainer;
import fi.muikku.plugins.dnm.parser.structure.model.Type;
import fi.muikku.plugins.dnm.unembed.MaterialUnEmbedder;
import fi.muikku.plugins.material.BinaryMaterialController;
import fi.muikku.plugins.material.HtmlMaterialController;
import fi.muikku.plugins.material.model.BinaryMaterial;
import fi.muikku.plugins.material.model.HtmlMaterial;
import fi.muikku.plugins.material.model.Material;
import fi.muikku.plugins.workspace.WorkspaceMaterialController;
import fi.muikku.plugins.workspace.WorkspaceMaterialUtils;
import fi.muikku.plugins.workspace.model.WorkspaceFolder;
import fi.muikku.plugins.workspace.model.WorkspaceMaterial;
import fi.muikku.plugins.workspace.model.WorkspaceMaterialAssignmentType;
import fi.muikku.plugins.workspace.model.WorkspaceNode;
import fi.muikku.plugins.workspace.model.WorkspaceNodeType;
import fi.muikku.schooldata.WorkspaceEntityController;

@ApplicationScoped
@Stateful
public class DeusNexMachinaController {

  @Inject
  private Logger logger;

  @Inject
  private PluginSettingsController pluginSettingsController;
  
  @Inject
  private MaterialUnEmbedder materialUnEmbedder;

  private class EmbeddedItemHandler implements DeusNexEmbeddedItemElementHandler {

    public EmbeddedItemHandler(DeusNexMachinaController deusNexMachinaController, WorkspaceNode importRoot, DeusNexDocument deusNexDocument) {
      this.importRoot = importRoot;
      this.deusNexDocument = deusNexDocument;
    }

    @Override
    public Node handleEmbeddedDocument(org.w3c.dom.Document ownerDocument, String title, Integer queryType, Integer resourceNo, Integer embeddedResourceNo) {
      // TODO: This is just for show, real implementation depends on HtmlMaterial implementation

      String relativePath = getResourcePath(resourceNo);
      if (relativePath != null) {
        Element iframeElement = ownerDocument.createElement("iframe");
        iframeElement.setAttribute("src", relativePath);
        iframeElement.setAttribute("title", title);
        iframeElement.setAttribute("seamless", "seamless");
        iframeElement.setAttribute("border", "0");
        iframeElement.setAttribute("frameborder", "0");
        if (queryType != null && queryType.intValue() == 1) {
          iframeElement.setAttribute("data-assignment-type", "EXERCISE");
        }
        if (queryType != null && queryType.intValue() == 2) {
          iframeElement.setAttribute("data-assignment-type", "EVALUATED");
        }
        iframeElement.setAttribute("data-type", "embedded-document");

        iframeElement.setAttribute("width", "100%");
        iframeElement.setTextContent("Browser does not support iframes");
        return iframeElement;
      } else {
        logger.warning("Embedded document " + resourceNo + " could not be found.");
      }

      return null;
    }

    @Override
    public Node handleEmbeddedImage(org.w3c.dom.Document ownerDocument, String title, String alt, Integer width, Integer height, Integer hspace, String align,
        Integer resourceNo) {
      String relativePath = getResourcePath(resourceNo);
      if (relativePath != null) {
        Element imgElement = ownerDocument.createElement("img");
        imgElement.setAttribute("src", relativePath);
        imgElement.setAttribute("title", title);
        imgElement.setAttribute("alt", alt);
        imgElement.setAttribute("width", String.valueOf(width));
        imgElement.setAttribute("height", String.valueOf(height));
        imgElement.setAttribute("hspace", String.valueOf(hspace));
        imgElement.setAttribute("align", align);
        return imgElement;
      } else {
        logger.warning("Embedded image " + resourceNo + " could not be found.");
      }

      return null;
    }

    @Override
    public Node handleEmbeddedAudio(org.w3c.dom.Document ownerDocument, Integer resourceNo, Boolean showAsLink, String fileName, String linkText,
        Boolean autoStart, Boolean loop) {
      String path = getResourcePath(resourceNo);
      if (path != null) {
        if (showAsLink) {
          Element linkElement = ownerDocument.createElement("a");
          linkElement.setTextContent(linkText);
          linkElement.setAttribute("target", "_blank");
          linkElement.setAttribute("href", path);
          return linkElement;
        } else {
          Element audioElement = ownerDocument.createElement("audio");

          String contentType = getResorceContentType(resourceNo);
          if (StringUtils.isNotBlank(contentType)) {
            Element sourceElement = ownerDocument.createElement("source");
            sourceElement.setAttribute("src", path + "?embed=true");
            sourceElement.setAttribute("type", contentType);
            audioElement.appendChild(sourceElement);
          } else {
            logger.warning("Embedded audio " + resourceNo + " content type could not be resolved.");
          }

          if (autoStart) {
            audioElement.setAttribute("autoplay", "autoplay");
          }

          if (loop) {
            audioElement.setAttribute("loop", "loop");
          }

          return audioElement;
        }
      } else {
        logger.warning("Embedded audio " + resourceNo + " could not be found.");
      }

      return null;
    }

    @Override
    public Node handleEmbeddedHyperlink(org.w3c.dom.Document ownerDocument, Integer resourceNo, String target, String fileName, String linkText) {
      String path = getResourcePath(resourceNo);
      if (path != null) {
        Element hyperLinkElement = ownerDocument.createElement("a");
        hyperLinkElement.setAttribute("href", path);
        if (StringUtils.isNotBlank(target)) {
          hyperLinkElement.setAttribute("target", target);
        }

        hyperLinkElement.setTextContent(linkText);

        return hyperLinkElement;
      } else {
        logger.warning("Embedded hyperlink " + resourceNo + " could not be found.");
      }

      return null;
    }

    private String getResourcePath(Integer resourceNo) {
      String path = null;
      String type = null;

      Long workspaceNodeId = getResourceWorkspaceNodeId(resourceNo);
      if (workspaceNodeId != null) {
        // Resource has been imported before
        WorkspaceMaterial workspaceMaterial = workspaceMaterialController.findWorkspaceMaterialById(workspaceNodeId);
        if (workspaceMaterial != null) {
          path = "/" + WorkspaceMaterialUtils.getCompletePath(workspaceMaterial);
          type = "POOL";
        }
      } else {
        Resource resource = deusNexDocument.getResourceByNo(resourceNo);
        if (resource != null) {
          WorkspaceNode reference = importRoot.getParent();
          if (reference == null) {
            reference = importRoot;
          }
          
          String rootPath = WorkspaceMaterialUtils.getCompletePath(reference);
          if (!rootPath.endsWith("/")) {
            rootPath += '/';
          }
          
          String resourcePath = getResourcePath(deusNexDocument, resource);
          path = "/" + rootPath + resourcePath;
          type = "DND";
        }
      }

      if (path != null) {
        path += "?embed=true&on=" + resourceNo + "&rt=" + type;
      }

      return path;
    }

    private String getResourcePath(DeusNexDocument deusNexDocument, Resource resource) {
      List<String> result = new ArrayList<String>();

      ResourceContainer parent = deusNexDocument.getParent(resource);
      do {
        result.add(0, parent.getName());
        parent = deusNexDocument.getParent(parent);
      } while (parent != null);

      result.add(resource.getName());

      return StringUtils.join(result, '/');
    }

    private String getResorceContentType(Integer resourceNo) {
      Resource resource = deusNexDocument.getResourceByNo(resourceNo);
      if (resource != null) {
        if (resource instanceof Binary) {
          return ((Binary) resource).getContentType();
        }
      }

      Long workspaceNodeId = getResourceWorkspaceNodeId(resourceNo);
      if (workspaceNodeId != null) {
        // TODO: This reference is a bit strange
        WorkspaceMaterial workspaceMaterial = workspaceMaterialController.findWorkspaceMaterialById(workspaceNodeId);
        if (workspaceMaterial != null) {
          Material material = workspaceMaterialController.getMaterialForWorkspaceMaterial(workspaceMaterial);
          if (material instanceof BinaryMaterial) {
            return ((BinaryMaterial) material).getContentType();
          }
        }
      }

      return null;
    }
    private WorkspaceNode importRoot;
    private DeusNexDocument deusNexDocument;
  }

  private final static String LOOKUP_SETTING_NAME = "[_DEUS_NEX_MACHINA_LOOKUP_]";
  private final static String IDS_SETTING_NAME = "[_DEUS_NEX_MACHINA_IDS_]";

  @Inject
  private HtmlMaterialController htmlMaterialController;

  @Inject
  private BinaryMaterialController binaryMaterialController;

  @Inject
  private WorkspaceMaterialController workspaceMaterialController;

  @Inject
  private WorkspaceEntityController workspaceEntityController;
  
  @PostConstruct
  public void init() throws IOException {
    deusNexStructureParser = new DeusNexStructureParser();
    loadLookup();
    loadIdMap();
  }

  public DeusNexDocument parseDeusNexDocument(InputStream inputStream) throws DeusNexException {
    return deusNexStructureParser.parseDocument(inputStream);
  }

  public void importDeusNexDocument(WorkspaceNode parentNode, InputStream inputStream) throws DeusNexException {
    DeusNexDocument desNexDocument = parseDeusNexDocument(inputStream);

    List<WorkspaceNode> createdNodes = new ArrayList<>();
    for (Resource resource : desNexDocument.getRootFolder().getResources()) {
      importResource(parentNode, parentNode, resource, desNexDocument, createdNodes);
    }
    try {
      postProcessResources(createdNodes);
    } catch (Exception e) {
      throw new DeusNexInternalException("PostProcesssing failed. ", e);
    }
    
    materialUnEmbedder.unembedWorkspaceMaterials(parentNode);
  }

  public void importFrontPageDocument(WorkspaceEntity workspaceEntity, InputStream inputStream) throws DeusNexException {
    DeusNexDocument deusNexDocument = parseDeusNexDocument(inputStream);
    
    List<Resource> resources = deusNexDocument.getRootFolder().getResources();
    if (!resources.isEmpty()) {
      List<WorkspaceNode> createdNodes = new ArrayList<>();
      WorkspaceFolder workspaceFrontPageFolder = workspaceMaterialController.createWorkspaceFrontPageFolder(workspaceEntity);

      for (Resource resource : deusNexDocument.getRootFolder().getResources()) {
        importResource(workspaceFrontPageFolder, workspaceFrontPageFolder, resource, deusNexDocument, createdNodes);
      }
      try {
        postProcessResources(createdNodes);
      } catch (Exception e) {
        throw new DeusNexInternalException("PostProcesssing failed. ", e);
      }
      
    }
  }

  public void importHelpPageDocument(WorkspaceEntity workspaceEntity, InputStream inputStream) throws DeusNexException {
    DeusNexDocument deusNexDocument = parseDeusNexDocument(inputStream);
    
    List<Resource> resources = deusNexDocument.getRootFolder().getResources();
    if (!resources.isEmpty()) {
      List<WorkspaceNode> createdNodes = new ArrayList<>();
      WorkspaceFolder workspaceHelpPageFolder = workspaceMaterialController.createWorkspaceHelpPageFolder(workspaceEntity);

      for (Resource resource : deusNexDocument.getRootFolder().getResources()) {
        importResource(workspaceHelpPageFolder, workspaceHelpPageFolder, resource, deusNexDocument, createdNodes);
      }
      try {
        postProcessResources(createdNodes);
      } catch (Exception e) {
        throw new DeusNexInternalException("PostProcesssing failed. ", e);
      }
      
    }
  }
  
  private void postProcessResources(List<WorkspaceNode> createdNodes) throws ParserConfigurationException, SAXException,
      IOException, XPathExpressionException, TransformerException {
    for (WorkspaceNode node : createdNodes) {
      if (node.getType() == WorkspaceNodeType.MATERIAL) {
        WorkspaceMaterial workspaceMaterial = (WorkspaceMaterial) node;
        HtmlMaterial htmlMaterial = htmlMaterialController.findHtmlMaterialById(workspaceMaterial.getMaterialId());
        if (htmlMaterial != null && StringUtils.isNotBlank(htmlMaterial.getHtml())) {
          postProcessHtml(htmlMaterial);
        }
      }
    }
  }

  private void postProcessHtml(HtmlMaterial material) throws ParserConfigurationException, SAXException, IOException,
      XPathExpressionException, TransformerException {
    StringReader htmlReader = new StringReader(material.getHtml());
    DOMParser parser = new DOMParser(new HTMLConfiguration());
    parser.setProperty("http://cyberneko.org/html/properties/names/elems", "lower");
    InputSource inputSource = new InputSource(htmlReader);
    parser.parse(inputSource);
    org.w3c.dom.Document domDocument = parser.getDocument();
    List<Element> elements = DeusNexXmlUtils.getElementsByXPath(domDocument.getDocumentElement(), "//IFRAME[@data-type=\"embedded-document\"]");
    if (!elements.isEmpty()) {
      for (Element element : elements) {
        String path = element.getAttribute("src");
        String workspaceUrlName = "";
        Pattern pattern = Pattern.compile("/([0-9_\\-.a-zA-Z]*)/([0-9_\\-.a-zA-Z]*)/materials/([0-9_\\-.a-zA-Z/]*).*");
        Matcher matcher = pattern.matcher(path);
        if (matcher.matches()) {
          workspaceUrlName = matcher.group(2);
          path = matcher.group(3);
          WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceByUrlName(workspaceUrlName);
          WorkspaceMaterial workspaceMaterial = workspaceMaterialController.findWorkspaceMaterialByWorkspaceEntityAndPath(workspaceEntity, path);
          HtmlMaterial htmlMaterial = htmlMaterialController.findHtmlMaterialById(workspaceMaterial.getMaterialId());
          element.setAttribute("data-material-id", String.valueOf(htmlMaterial.getId()));
          element.setAttribute("data-material-type", htmlMaterial.getType());
          element.setAttribute("data-workspace-material-id", String.valueOf(workspaceMaterial.getId()));
        }
      }
      StringWriter writer = new StringWriter();
      TransformerFactory transformerFactory = TransformerFactory.newInstance();
      Transformer transformer = transformerFactory.newTransformer();
      transformer.setOutputProperty(OutputKeys.ENCODING, "UTF-8");
      transformer.setOutputProperty(OutputKeys.OMIT_XML_DECLARATION, "yes");
      transformer.setOutputProperty(OutputKeys.METHOD, "xml");
      transformer.setOutputProperty(OutputKeys.INDENT, "no");
      transformer.transform(new DOMSource(domDocument), new StreamResult(writer));
      htmlMaterialController.updateHtmlMaterialHtml(material, writer.getBuffer().toString());
    }

  }
  
  private WorkspaceMaterialAssignmentType determineEmbeddedAssignmentType(HtmlMaterial material) throws DeusNexException {
    try {
      if (material.getHtml() == null) {
        return null;
      }
      StringReader htmlReader = new StringReader(material.getHtml());
      DOMParser parser = new DOMParser();
      InputSource inputSource = new InputSource(htmlReader);
      parser.parse(inputSource);
      org.w3c.dom.Document domDocument = parser.getDocument();
      List<Element> elements = DeusNexXmlUtils.getElementsByXPath(domDocument.getDocumentElement(), "//IFRAME[@data-type=\"embedded-document\"]");
      List<WorkspaceMaterialAssignmentType> assignmentTypes = new ArrayList<>();
      if (!elements.isEmpty()) {
        for (Element element : elements) {
          if ("EXERCISE".equals(element.getAttribute("data-assignment-type"))) {
            assignmentTypes.add(WorkspaceMaterialAssignmentType.EXERCISE);
          }
          if ("EVALUATED".equals(element.getAttribute("data-assignment-type"))) {
            assignmentTypes.add(WorkspaceMaterialAssignmentType.EVALUATED);
          }
        }
      }
      if ((assignmentTypes.contains(WorkspaceMaterialAssignmentType.EXERCISE)
          && assignmentTypes.contains(WorkspaceMaterialAssignmentType.EVALUATED))) {
        return WorkspaceMaterialAssignmentType.MIXED;
      } else if (assignmentTypes.isEmpty()) {
        return null;
      } else {
        return assignmentTypes.get(0);
      }
    } catch (SAXException | IOException | XPathExpressionException e) {
      throw new DeusNexInternalException("Embedded assignment type handling failed. ", e);
    }
  }

  private void importResource(WorkspaceNode importRoot, WorkspaceNode parent, Resource resource, DeusNexDocument deusNexDocument,
      List<WorkspaceNode> createdNodes) throws DeusNexException {
    WorkspaceNode node = findNode(parent, resource);

    if (resource.getType() == Type.FOLDER) {
      Folder folderResource = (Folder) resource;
      WorkspaceFolder folder = null;
      if (node instanceof WorkspaceFolder) {
        folder = (WorkspaceFolder) node;
      }

      if (folder == null) {
        folder = createFolder(parent, folderResource);
        try {
          setResourceWorkspaceNodeId(resource.getNo(), folder.getId());
        } catch (IOException e) {
          throw new DeusNexInternalException("Failed to store resourceNo lookup file", e);
        }
        createdNodes.add(folder);
      }

      for (Resource childResource : folderResource.getResources()) {
        importResource(importRoot, folder, childResource, deusNexDocument, createdNodes);
      }
    } else {
      if (node == null) {
        logger.fine("importing " + resource.getPath());

        Material material = createMaterial(importRoot, resource, deusNexDocument);

        if (material != null) {
          WorkspaceMaterialAssignmentType assignmentType = null;

          if (resource instanceof Query) {
            switch (((Query)resource).getQueryType()) {
            case "1":
              assignmentType = WorkspaceMaterialAssignmentType.EXERCISE;
              break;
            case "2":
              assignmentType = WorkspaceMaterialAssignmentType.EVALUATED;
              break;
            }
          } else if (material instanceof HtmlMaterial) {
            assignmentType = determineEmbeddedAssignmentType((HtmlMaterial) material);
          }
          
          WorkspaceMaterial workspaceMaterial = workspaceMaterialController.createWorkspaceMaterial(parent, material, resource.getName(), assignmentType);
          
          try {
            setResourceWorkspaceNodeId(resource.getNo(), workspaceMaterial.getId());
          } catch (IOException e) {
            throw new DeusNexInternalException("Failed to store resourceNo lookup file", e);
          }

          if (resource instanceof ResourceContainer) {
            List<Resource> childResources = ((ResourceContainer) resource).getResources();
            if (childResources != null) {
              for (Resource childResource : childResources) {
                importResource(importRoot, workspaceMaterial, childResource, deusNexDocument, createdNodes);
              }
            }
          }
          
          if (resource.getHidden()) {
            workspaceMaterialController.hideWorkspaceNode(workspaceMaterial);
          }
          
          createdNodes.add(workspaceMaterial);
        }
      } else {
        logger.info(node.getPath() + " already exists, skipping");
      }
    }
    
    
  }

  private Material createMaterial(WorkspaceNode importRoot, Resource resource, DeusNexDocument deusNexDocument) throws DeusNexException {
    switch (resource.getType()) {
      case BINARY:
        return createBinaryMaterial((Binary) resource);
      case DOCUMENT:
        return createDocumentMaterial(importRoot, (Document) resource, deusNexDocument);
      case QUERY:
        return createQueryMaterial(importRoot, (Query) resource, deusNexDocument);
      default:
      break;
    }

    return null;
  }

  private Material createDocumentMaterial(WorkspaceNode importRoot, Document resource, DeusNexDocument deusNexDocument) throws DeusNexException {
    String title = resource.getTitle();
    String html = parseDocumentContent(importRoot, resource.getDocument(), deusNexDocument);

    return htmlMaterialController.createHtmlMaterial(title, html, "text/html;editor=CKEditor", 0l);
  }

  private Material createQueryMaterial(WorkspaceNode importRoot, Query resource, DeusNexDocument deusNexDocument) throws DeusNexException {
    // TODO: Replace with query implementation when the implementation itself is ready for it

    String title = resource.getTitle();
    String html = parseQueryContent(importRoot, resource.getDocument(), deusNexDocument);

    return htmlMaterialController.createHtmlMaterial(title, html, "text/html;editor=CKEditor", 0l);
  }

  private BinaryMaterial createBinaryMaterial(Binary resource) {
    String title = resource.getName(); // Nexus title is usually something like "tiedosto"
    String contentType = resource.getContentType();
    byte[] content = resource.getContent();

    return binaryMaterialController.createBinaryMaterial(title, contentType, content);
  }

  private String parseDocumentContent(WorkspaceNode importRoot, Element document, DeusNexDocument deusNexDocument) throws DeusNexException {
    Map<String, String> localeContents = new DeusNexContentParser().setEmbeddedItemElementHandler(new EmbeddedItemHandler(this, importRoot, deusNexDocument))
        .parseContent(document);
    String contentFi = localeContents.get("fi");
    return contentFi;
  }

  private String parseQueryContent(WorkspaceNode importRoot, Element document, DeusNexDocument deusNexDocument) throws DeusNexException {
    Map<String, String> localeContents = new DeusNexContentParser().setEmbeddedItemElementHandler(new EmbeddedItemHandler(this, importRoot, deusNexDocument))
        .setFieldElementHandler(new FieldElementsHandler(deusNexDocument)).parseContent(document);
    String contentFi = localeContents.get("fi");
    return contentFi;
  }

  private WorkspaceFolder createFolder(WorkspaceNode parent, Folder resource) {
    return workspaceMaterialController.createWorkspaceFolder(parent, resource.getTitle(), resource.getName());
  }

  private WorkspaceNode findNode(WorkspaceNode parent, Resource resource) {
    return workspaceMaterialController.findWorkspaceNodeByParentAndUrlName(parent, resource.getName());
  }

  private void setResourceWorkspaceNodeId(Integer resourceNo, Long workspaceNodeId) throws IOException {
    lookupProperties.put(String.valueOf(resourceNo), String.valueOf(workspaceNodeId));
    storeLookup();
  }

  Long getResourceWorkspaceNodeId(Integer resourceNo) {
    return NumberUtils.createLong(lookupProperties.getProperty(String.valueOf(resourceNo)));
  }

  private void loadLookup() throws IOException {
    lookupProperties = new Properties();

    String lookupSetting = pluginSettingsController.getPluginSetting(DeusNexMachinaPluginDescriptor.PLUGIN_NAME, LOOKUP_SETTING_NAME);
    if (StringUtils.isNotBlank(lookupSetting)) {
      StringReader lookupSettingReader = new StringReader(lookupSetting);
      try {
        lookupProperties.load(lookupSettingReader);
      } finally {
        lookupSettingReader.close();
      }
    }
  }

  private void storeLookup() throws IOException {
    StringWriter lookupSettingWriter = new StringWriter();
    lookupProperties.store(lookupSettingWriter, null);
    String lookupSetting = lookupSettingWriter.toString();
    pluginSettingsController.setPluginSetting(DeusNexMachinaPluginDescriptor.PLUGIN_NAME, LOOKUP_SETTING_NAME, lookupSetting);
  }
  
  public void setWorkspaceEntityIdDnmId(String dnmId, Long workspaceEntityId) throws IOException {
    idMap.put(dnmId, workspaceEntityId);
    storeIdMap();
  }
  
  public Long getWorkspaceEntityIdDnmId(String dnmId) {
    return idMap.get(dnmId);
  }
  
  private void storeIdMap() throws IOException {
    pluginSettingsController.setPluginSetting(DeusNexMachinaPluginDescriptor.PLUGIN_NAME, IDS_SETTING_NAME, new ObjectMapper().writeValueAsString(idMap));
  }
  
  private void loadIdMap() throws IOException {
    String setting = pluginSettingsController.getPluginSetting(DeusNexMachinaPluginDescriptor.PLUGIN_NAME, IDS_SETTING_NAME);
    if (StringUtils.isNotBlank(setting)) {
      idMap = new ObjectMapper().readValue(setting, new TypeReference<Map<String, Long>>() {});
    } else {
      idMap = new HashMap<>();
    }
  }

  private DeusNexStructureParser deusNexStructureParser;
  private Properties lookupProperties;
  private Map<String, Long> idMap;
}
