package fi.otavanopisto.muikku.ui.sauce.tor;

import java.net.MalformedURLException;

import org.junit.Before;
import org.junit.Rule;

import com.saucelabs.common.SauceOnDemandAuthentication;
import com.saucelabs.junit.SauceOnDemandTestWatcher;
import fi.otavanopisto.muikku.ui.base.tor.ToRTestsBase;

public class ToRTestsIT extends ToRTestsBase {
  
  public SauceOnDemandAuthentication authentication = new SauceOnDemandAuthentication(getSauceUsername(), getSauceAccessKey());

  @Rule
  public SauceOnDemandTestWatcher resultReportingTestWatcher = new SauceOnDemandTestWatcher(this, authentication);
  
  @Before
  public void setUp() throws MalformedURLException {
    setWebDriver(createSauceWebDriver());
  }

}
