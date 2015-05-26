SET REFERENTIAL_INTEGRITY FALSE;

insert into material (id, title, version, originMaterial_id) values 
  (2, '1.0 Testimateriaali', 2, null);

insert into htmlmaterial (id, contentType, html, revisionNumber) values 
  (2, 'text/html;editor=CKEditor', '<html><body>
                  <p>Testi materiaalia:  Lorem ipsum dolor sit amet </p>
                  <p>
                     Proin suscipit luctus orci placerat fringilla. Donec hendrerit laoreet risus eget adipiscing. Suspendisse in urna ligula, a volutpat mauris. Sed enim mi, bibendum eu pulvinar vel, sodales vitae dui. Pellentesque sed sapien lorem, at lacinia urna. In hac habitasse platea dictumst. Vivamus vel justo in leo laoreet ullamcorper non vitae lorem
                  </p>
               </body></html>', 1);

insert into workspacematerial(id, materialId, assignmentType) values 
  (3, 2, null);
  
insert into workspacenode (id, hidden, orderNumber, urlName, parent_id) values 
  (3, false, 1, 'Test Course material node', 1);

insert into workspacefolder(id, defaultMaterial_id, folderType, title) values 
  (2, 1, 'DEFAULT', 'Test folder');
  
SET REFERENTIAL_INTEGRITY TRUE;