package fi.muikku.mail;

import java.util.List;

import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;

@RequestScoped
public class Mailer {
  
  @Inject
  private MailBridge bridge;
  
  public void sendMail(MimeType mimeType, String from, List<String> to, List<String> cc, List<String> bcc, String content) {
    bridge.sendMail(mimeType, from, to, cc, bcc, content);
  }
  
  
}
