package fi.muikku.plugins.coursepicker;

import java.util.ArrayList;
import java.util.List;

import javax.inject.Inject;

import fi.muikku.i18n.LocaleController;
import fi.muikku.plugins.seeker.DefaultSeekerResultImpl;
import fi.muikku.plugins.seeker.SeekerResult;
import fi.muikku.plugins.seeker.SeekerResultProvider;
import fi.muikku.session.SessionController;

public class CoursePickerSeekerResultProvider implements SeekerResultProvider {

  @Inject
  private LocaleController localeController;
  
  @Inject
  private SessionController sessionController;
  
  @Override
  public List<SeekerResult> search(String searchTerm) {
    List<SeekerResult> result = new ArrayList<SeekerResult>();
    
    String searchTerms = localeController.getText(sessionController.getLocale(), "plugin.coursepicker.seekersearchterms").toLowerCase();
    
    if (searchTerms.contains(searchTerm.toLowerCase()))
      result.add(new CoursePickerSeekerResult(localeController.getText(sessionController.getLocale(), "plugin.coursepicker.coursepicker"), 
          null, "/coursepicker/coursepicker.jsf", null));
    
    return result; 
  }
}
