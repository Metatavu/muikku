package fi.muikku.plugins.material.fieldprocessing;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import javax.inject.Inject;

import org.codehaus.jackson.JsonParseException;
import org.codehaus.jackson.map.JsonMappingException;
import org.codehaus.jackson.map.ObjectMapper;

import fi.muikku.plugins.material.MaterialFieldProcessor;
import fi.muikku.plugins.material.QueryConnectFieldController;
import fi.muikku.plugins.material.fieldmeta.ConnectFieldMeta;
import fi.muikku.plugins.material.fieldmeta.ConnectFieldMeta.Connection;
import fi.muikku.plugins.material.fieldmeta.ConnectFieldMeta.Field;
import fi.muikku.plugins.material.model.Material;
import fi.muikku.plugins.material.model.QueryConnectField;
import fi.muikku.plugins.material.model.QueryConnectFieldCounterpart;

public class ConnectFieldMaterialFieldProcessor implements MaterialFieldProcessor {

  @Inject
  private QueryConnectFieldController queryConnectFieldController;
  
  @Override
  public void process(Material material, String content) throws JsonParseException, JsonMappingException, IOException {
    ObjectMapper objectMapper = new ObjectMapper();
    
    ConnectFieldMeta connectFieldMeta = objectMapper.readValue(content, ConnectFieldMeta.class);
    QueryConnectField queryConnectField = queryConnectFieldController.createQueryConnectField(material, connectFieldMeta.getName(), Boolean.FALSE);
    
    Map<String, QueryConnectFieldCounterpart> counterpartMap = new HashMap<>();
    Map<String, String> connectionMap = new HashMap<>(); 
    for (Connection connection : connectFieldMeta.getConnections()) {
      connectionMap.put(connection.getCounterpart(), connection.getField()); 
    }
    
    for (Field counterpart : connectFieldMeta.getCounterparts()) {
      QueryConnectFieldCounterpart connectFieldCounterpart = queryConnectFieldController.createConnectFieldCounterpart(queryConnectField, counterpart.getName(), counterpart.getText()); 
      String termName = connectionMap.get(counterpart.getName());
      counterpartMap.put(termName, connectFieldCounterpart);
    }
    
    for (Field field : connectFieldMeta.getFields()) {
      QueryConnectFieldCounterpart counterpart = counterpartMap.get(field.getName());
      queryConnectFieldController.createConnectFieldTerm(queryConnectField, field.getName(), field.getText(), counterpart);
    }
    
  }

  @Override
  public String getType() {
    return "application/vnd.muikku.field.connect";
  }

}
