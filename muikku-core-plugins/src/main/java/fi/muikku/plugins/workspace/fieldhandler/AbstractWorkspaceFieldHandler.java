package fi.muikku.plugins.workspace.fieldhandler;

import java.util.Map;

import org.apache.commons.lang3.math.NumberUtils;
import org.apache.commons.lang3.StringUtils;

public abstract class AbstractWorkspaceFieldHandler implements WorkspaceFieldHandler {

  private static final String FORM_ID = "material-form"; 
  private static final String FIELD_PREFIX = FORM_ID + ":queryform:";
  
  protected String getHtmlFieldName(String fieldName) {
    return FIELD_PREFIX + fieldName;
  }

  protected String getRequestParameterMapFirstValue(Map<String, String[]> requestParameterMap, String key) {
    if (requestParameterMap.containsKey(key)) {
      String[] values = requestParameterMap.get(key);
      if (values != null && values.length > 0) {
        return values[0];
      }
    }
    
    return null;
  }
  
  protected Integer getRequestParameterMapFirstIntegerValue(Map<String, String[]> requestParameterMap, String key) {
    String value = getRequestParameterMapFirstValue(requestParameterMap, key);
    if (StringUtils.isNumeric(value)) {
      return NumberUtils.createInteger(value);
    }
    
    return null;
  }
  
}
