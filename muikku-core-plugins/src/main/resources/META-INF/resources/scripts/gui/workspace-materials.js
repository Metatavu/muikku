(function() {
  'use strict';
  
  function scrollToPage(workspaceMaterialId, animate) {
    var topOffset = $('#contentWorkspaceMaterials').offset().top;
    var scrollTop = $('#page-' + workspaceMaterialId).offset().top - topOffset;
    if (animate) {
      $(window).data('scrolling', true);
      
      $('html, body').stop().animate({
        scrollTop : scrollTop
      }, {
        duration : 500,
        easing : "easeInOutQuad",
        complete : function() {
          $('a.active').removeClass('active');
          $('a[href="#page-' + workspaceMaterialId + '"]').addClass('active');
          window.location.hash = 'p-' + workspaceMaterialId;
          $(window).data('scrolling', false);
        }
      });
    } else {
      $('html, body').stop().scrollTop(scrollTop);
      window.location.hash = 'p-' + workspaceMaterialId;
      $('a.active').removeClass('active');
      $('a[href="#page-' + workspaceMaterialId + '"]').addClass('active');
    }
  }
  
  $(document).on('click', '.workspace-materials-toc-item a', function (event) {
    event.preventDefault();
    scrollToPage($($(this).attr('href')).data('workspaceMaterialId'), true);
  });
  
  $(window).load(function () {
    if (window.location.hash && (window.location.hash.indexOf('p-') > 0)) {
      scrollToPage(window.location.hash.substring(3), false);
    }
  });

  $(document).ready(function() {
    $(document).muikkuMaterialLoader()
      .muikkuMaterialLoader('loadMaterials', $('.workspace-materials-view-page'));
    
    $(document).on('beforeHtmlMaterialRender', function (event, data) {
      $(window).data('loading', true);
    });
    
    $(document).on('afterHtmlMaterialRender', function (event, data) {
      if (window.location.hash && (window.location.hash.indexOf('p-') > 0)) {
        scrollToPage(window.location.hash.substring(3).split('/'), false);
      }
      
      if ($('.workspace-material-loading').length == 0) {
        $(window).data('loading', false);
      }
    });

    $('.workspace-materials-view-page').waypoint(function(direction) {
      if (($(window).data('scrolling') !== true) && ($(window).data('loading') === false)) {
        var workspaceMaterialId = parseInt($(this).attr('data-workspace-material-id'));
        $('a.active').removeClass('active');
        $('a[href="#page-' + workspaceMaterialId + '"]').addClass('active');
        window.location.hash = '#p-' + workspaceMaterialId;
      }
    }, {
      offset: '60%'
    });
    
    $('.workspace-materials-view-page[data-workspace-material-assigment-type="EXERCISE"]').each(function (index, page) {
      $(page).prepend($('<div>')
          .addClass('muikku-page-assignment-type exercise')
          .text(getLocaleText("plugin.workspace.materialsLoader.exerciseAssignmentLabel"))
      );
    });
    
    $('.workspace-materials-view-page[data-workspace-material-assigment-type="EVALUATED"]').each(function (index, page) {
      $(page).prepend($('<div>')
          .addClass('muikku-page-assignment-type evaluated')
          .text(getLocaleText("plugin.workspace.materialsLoader.evaluatedAssignmentLabel"))
      );
    });
    
  });

  $(document).on('change', '.muikku-field', function (event, data) {
    $(this).removeClass('muikku-field-correct-answer muikku-field-incorrect-answer');
    var page = $(this).closest('.workspace-materials-view-page');
    var saveButton = $(page).find('.muikku-save-page');
    if (saveButton.length) {
      saveButton
        .removeClass('icon-checkmark save-successful')          
        .text(saveButton.data('unsaved-text'));
    }
  });

  $(document).on('click', '.muikku-save-page', function (event, data) {
    var page = $(this).closest('.workspace-materials-view-page');
    var workspaceEntityId = $('.workspaceEntityId').val(); //  TODO: data?
    var workspaceMaterialId = $(page).data('workspace-material-id');
    var reply = [];
    var exercise = $(page).data('workspace-material-assigment-type') == "EXERCISE" ;
      
    page.find('.muikku-field-examples').remove();
    page.find('.muikku-field').each(function (index, field) {
      $(field).removeClass('muikku-field-correct-answer muikku-field-incorrect-answer');
      
      reply.push({
        value: $(field).muikkuField('answer'),
        embedId: $(field).muikkuField('embedId'),
        materialId: $(field).muikkuField('materialId'),
        fieldName: $(field).muikkuField('fieldName')
      });
    });
    
    mApi().workspace.workspaces.materials.replies.create(workspaceEntityId, workspaceMaterialId, {
      answers: reply
    })
    .callback($.proxy(function (err) {
      if (err) {
        $('.notification-queue').notificationQueue('notification', 'error',getLocaleText('plugin.workspace.materials.answerSavingFailed', err));
      } else {
        if (exercise) {
          // Correct answer checking
          page.find('.muikku-field').each(function (index, field) {
            if ($(field).muikkuField('canCheckAnswer')) {
              $(field).addClass($(field).muikkuField('isCorrectAnswer') ? 'muikku-field-correct-answer' : 'muikku-field-incorrect-answer');
            }
            else {
              if ($(field).muikkuField('hasExamples')) {
                var exampleDetails = $('<span>')
                  .addClass('muikku-field-examples')
                  .attr('data-for-field', $(field).attr('name'));
                
                exampleDetails.append( 
                  $('<span>')
                    .addClass('muikku-field-examples-title')
                    .text(getLocaleText('plugin.workspace.assigment.checkAnswers.detailsSummary.title'))
                );
                
                $.each($(field).muikkuField('getExamples'), function (index, example) {
                  exampleDetails.append(
                    $('<span>') 
                      .addClass('muikku-field-example')
                      .text(example)    
                  );
                });

                $(field).after(exampleDetails);
              }
            }
          });
        } 
        
        // Save button
        $(this)
          .addClass("icon-checkmark save-successful")
          .text(exercise ? getLocaleText('plugin.workspace.materials.answerChecked') : getLocaleText('plugin.workspace.materials.answerSaved'));
      } 
    }, this));
  });

}).call(this);