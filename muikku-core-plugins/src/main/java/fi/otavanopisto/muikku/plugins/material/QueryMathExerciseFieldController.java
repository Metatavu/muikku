package fi.otavanopisto.muikku.plugins.material;

import javax.enterprise.context.Dependent;
import javax.enterprise.event.Event;
import javax.inject.Inject;

import fi.otavanopisto.muikku.plugins.material.dao.QueryMathExerciseFieldDAO;
import fi.otavanopisto.muikku.plugins.material.events.QueryFieldDeleteEvent;
import fi.otavanopisto.muikku.plugins.material.model.Material;
import fi.otavanopisto.muikku.plugins.material.model.QueryMathExerciseField;

@Dependent
public class QueryMathExerciseFieldController {

  @Inject
  private QueryMathExerciseFieldDAO queryMathExerciseFieldDAO;
  
  @Inject
  private Event<QueryFieldDeleteEvent> queryFieldDeleteEvent;

  public QueryMathExerciseField createQueryMathExerciseField(Material material, String name) {
    return queryMathExerciseFieldDAO.create(material, name);
  }

  public QueryMathExerciseField findQueryMathExerciseFieldbyId(Long id) {
    return queryMathExerciseFieldDAO.findById(id);
  }

  public QueryMathExerciseField findQueryMathExerciseFieldByMaterialAndName(Material material, String name) {
    return queryMathExerciseFieldDAO.findByMaterialAndName(material, name);
  }

  public void deleteQueryMathExerciseField(QueryMathExerciseField queryField, boolean removeAnswers) {
    queryFieldDeleteEvent.fire(new QueryFieldDeleteEvent(queryField, removeAnswers));
    queryMathExerciseFieldDAO.delete(queryField);
  }

}
