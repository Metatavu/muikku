package fi.muikku.plugins.announcer.rest;

import java.util.Date;

public class AnnouncementRESTModel {
  public Long getId() {
    return id;
  }
  public void setId(Long id) {
    this.id = id;
  }
  public Long getPublisherUserEntityId() {
    return publisherUserEntityId;
  }
  public void setPublisherUserEntityId(Long publisherUserEntityId) {
    this.publisherUserEntityId = publisherUserEntityId;
  }
  public String getCaption() {
    return caption;
  }
  public void setCaption(String caption) {
    this.caption = caption;
  }
  public String getContent() {
    return content;
  }
  public void setContent(String content) {
    this.content = content;
  }
  public Date getCreated() {
    return created;
  }
  public void setCreated(Date created) {
    this.created = created;
  }

  private Long id;
  private Long publisherUserEntityId;
  private String caption;
  private String content;
  private Date created;
}
