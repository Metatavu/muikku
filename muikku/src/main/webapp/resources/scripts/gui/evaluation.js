(function() {
  'use strict';
  
  var ASSIGNMENTS = null;
  
  function getAssignmentData(workspaceMaterialId) {
    for (var i = 0, l = ASSIGNMENTS.length; i < l; i++) {
      if (ASSIGNMENTS[i].workspaceMaterialId == parseInt(workspaceMaterialId)) {
        return ASSIGNMENTS[i];
      }
    }
    
    return null;
  }
  
  $(document).on('afterHtmlMaterialRender', function (event, data) {
    $(data.pageElement).find('textarea').each(function (index, textarea) {
      $(textarea).css("min-height", $(textarea).prop('scrollHeight'));
    });
  });
  
  // Overrides JQuery.UI dialog setting that prevents html being inserted into title
  $.widget("ui.dialog", $.extend({}, $.ui.dialog.prototype, {
    _title: function(title) {
      if (!this.options.title ) {
          title.html("&#160;");
      } else {
          title.html(this.options.title);
      }
    }
  })); 
  
  $.widget("custom.evaluationSlyder", {
    options : {
      workspaceEntityId: null,
      workspaceStudentCount: 0
    },
    
    _create : function() {
      this.element.append($('<div>').addClass('evaluation-views-slyder'));
      var pageCount = Math.ceil(this.options.workspaceStudentCount / this.options.maxStudents);
      for (var i = 0; i < pageCount; i++) {
        this.element.find('.evaluation-views-slyder')
          .append($('<div>')
            .attr('data-page-id', i)
            .css({
              'width': this.element.width(),
              'height': '1px'
            })
            .addClass('evaluation-view-wrapper evaluation-view-placeholder')
            .append($('<div>').addClass('content-loading').append($('<div>').addClass('icon-spinner')))
          );
      }
      
      this.element.sly({
        horizontal: 1,
        itemNav: 'forceCentered',
        smart: false,
        activateMiddle: 1,
        mouseDragging: 1,
        touchDragging: 1,
        releaseSwing: 1,
        startAt: 0,
        scrollBy: 0,
        speed: 300,
        elasticBounds: 1,
        easing: 'easeOutExpo',
        scrollBar: '.scrollbar',
        prevPage: '.prevPage',
        nextPage: '.nextPage',
        dragHandle: 1,
        dynamicHandle: 1,
        minHandleSize: 50,
        clickBar: 1,
        syncSpeed: 0.5
      })
      .sly('on', 'active', $.proxy(this._onSlyActive, this));
      
      this._pagesLoaded = {};

      this._loadPage(0);
      this._loadPage(1);
    },
    
    _loadPage: function (pageId, callback) {
      this._pagesLoaded[pageId] = 'LOADING';
      
      $.ajax({
        url : CONTEXTPATH + '/evaluation/' + this.options.workspaceEntityId + '/page/' + pageId + '?maxStudents=' + this.options.maxStudents,
        success : $.proxy(function(data) {
          this._pagesLoaded[pageId] = 'LOADED';
          var parsed = $(data);
          var studentAssignmentDatas = {};
          
          var studentNodes = parsed.find('.evaluation-student-wrapper');
          studentNodes.each(function (studentIndex, studentElement) {
            var assignmentData = $.parseJSON($(studentElement).attr('data-assignment-data'));
            $.each(assignmentData, function (index, entry) {
              studentAssignmentDatas[$(studentElement).attr('data-workspace-student-entity-id') + '_' + entry.workspaceMaterialId] = entry;
            });
          });
          
          $.each(ASSIGNMENTS, function (assignmentIndex, assignment) {
            var row = $('<div>').addClass('evaluation-student-assignment-listing-row')

            studentNodes.each(function (studentIndex, studentElement) {
              var studentAssignmentData = studentAssignmentDatas[$(studentElement).attr('data-workspace-student-entity-id') + '_' + assignment.workspaceMaterialId];
              
              var wrapper = $('<div>')
                .addClass('evaluation-assignment-wrapper')
                .attr({
                  'data-workspace-material-id': assignment.workspaceMaterialId,
                  'data-workspace-material-evaluation-id': studentAssignmentData.workspaceMaterialEvaluationId,
                  'data-student-entity-id': $(studentElement).attr('data-user-entity-id')
                })
                .append($('<div>').addClass('evaluation-assignment-picture'))
                .append($('<div>').addClass('evaluation-assignment-title').text(assignment.title))
                .appendTo(row);
              
              switch (studentAssignmentData.status) {
                case 'DONE':
                  wrapper.addClass('assignment-done');
                break;
                case 'EVALUATED':
                  wrapper.addClass('assignment-evaluated');
                break;
                case 'EVALUATION_CRITICAL':
                  wrapper.addClass('assignment-evaluation-critical');
                break;
              } 
            });
            parsed.find('.evaluation-student-assignment-listing-wrapper').append(row);
          });
          
          $('.evaluation-view-placeholder[data-page-id=' + pageId + ']')
            .replaceWith(parsed.css('width', this.element.width()));
              
          if ($.isFunction(callback)) {
            callback();
          }
        } ,this),
        complete : $.proxy(function(data) {
          
          if (pageId == 0) {
            $('.content-loading')
              .animate({
                opacity: 0
            },{
              duration:900,
              easing: "easeInOutQuint",
              complete: function () {
                $('.content-loading').remove();
              }
            });
          }
          
        } ,this)
      });
    },
    
    _onSlyActive: function (eventName, index) {
      if (!this._pagesLoaded[index + 1]) {
        this._loadPage(index + 1);
      } 
    },
    
    _destroy: function () {
      
    }
  });

  function openWorkspaceEvaluationDialog(workspaceEntityId, studentEntityId, workspaceStudentEntityId, studentDisplayName, alreadyEvaluated, evaluationData){
    renderDustTemplate('evaluation/evaluation_evaluate_workspace_modal_view.dust', {
      studentDisplayName: studentDisplayName,
      gradingScales: $.parseJSON($('input[name="grading-scales"]').val()),

      assessors: $.parseJSON($('input[name="assessors"]').val()),
      workspaceName: $('input[name="workspaceName"]').val(),
      assignments: ASSIGNMENTS
    }, $.proxy(function (text) {
      var dialog = $(text); 
      
      dialog.dialog({
        modal: true, 
        resizable: false,
        width: 'auto',
        height: 'auto',
        title: '<span class="modal-title-student-name">'+studentDisplayName+'</span><span class="modal-title-workspace-name">'+$('input[name="workspaceName"]').val()+'</span>',
        dialogClass: "evaluation-evaluate-modal",
        open: function() {
          
          $(this).find('input[name="evaluationDate"]')
            .css({'z-index': 9999, 'position': 'relative'})
            .attr('type', 'text')
            .datepicker();
          
          if(!alreadyEvaluated){
            $(this).find('input[name="evaluationDate"]').datepicker('setDate', new Date()); 
          }else{
            $(this).find('input[name="evaluationDate"]').datepicker('setDate', new Date(evaluationData.date));
            $(this).find('#evaluateFormLiteralEvaluation').val(evaluationData.verbalAssessment);
            $(this).find('select[name="grade"]').val(evaluationData.gradeString);
            $(this).find('select[name="assessor"]').val(evaluationData.assessingUserEntityId);
          }
          
          var workspaceMaterialIds = $.map(ASSIGNMENTS, function (assignment) {
            return assignment.workspaceMaterialId;
          });
         
          var batchCalls = $.map(workspaceMaterialIds, function (workspaceMaterialId) {
            return mApi().workspace.workspaces.materials.replies.read(workspaceEntityId, workspaceMaterialId, {
              userEntityId: studentEntityId
            });
          });
          
          mApi().batch(batchCalls).callback(function (err, results) {
            if (err) {
              $('.notification-queue').notificationQueue('notification', 'error', err);
            } else {
              var answers = $.map(results, function(result) {
                return result.answers;
              });

              var fieldAnswers = {};
              if (answers && answers.length) {
                for (var i = 0, l = answers.length; i < l; i++) {
                  var answer = answers[i];
                  var answerKey = [answer.materialId, answer.embedId, answer.fieldName].join('.');
                  fieldAnswers[answerKey] = answer.value;
                }
              }
              
              $(document).muikkuMaterialLoader('loadMaterials', $(dialog).find('.evaluation-assignment'), fieldAnswers);
            }
          });
          
        },
        buttons: [{
          'text': dialog.data('button-save-text'),
          'class': 'save-evaluation-button',
          'click': function(event) {
            var gradeValue = $(this).find('select[name="grade"]')
              .val()
              .split('@', 2);
            var grade = gradeValue[0].split('/', 2);
            var gradingScale = gradeValue[1].split('/', 2);
            var evaluated = $(this).find('input[name="evaluationDate"]').datepicker('getDate').getTime();
            var assessorEntityId = $(this).find('select[name="assessor"]').val();
            
            if(alreadyEvaluated){
              //TODO: update
            }else{
              mApi().workspace.workspaces.assessments.create(workspaceEntityId, {
                evaluated: evaluated,
                gradeIdentifier: grade[0],
                gradeSchoolDataSource: grade[1],
                gradingScaleIdentifier: gradingScale[0],
                gradingScaleSchoolDataSource: gradingScale[1],
                workspaceUserEntityId: workspaceStudentEntityId,
                assessorEntityId: assessorEntityId,
                verbalAssessment: $(this).find('#evaluateFormLiteralEvaluation').val()
              }).callback($.proxy(function (err, result) {
                if (err) {
                  $('.notification-queue').notificationQueue('notification', 'error', err);
                } else { 
                  $(this).dialog("destroy").remove();
                  console.log(result);
                }
              }, this));
            }
          }
        }, {
          'text': dialog.data('button-cancel-text'),
          'class': 'cancel-evaluation-button',
          'click': function(event) {
            $(this).dialog("destroy").remove();
          }
        }]
      });
    }, this));
  };
  
  function openMaterialEvaluationDialog(workspaceEntityId, workspaceMaterialId, studentEntityId, studentDisplayName, workspaceMaterialEvaluation) {
    var assignmentData = getAssignmentData(workspaceMaterialId);
    
    renderDustTemplate('evaluation/evaluation_evaluate_assignment_modal_view.dust', {
      studentDisplayName: studentDisplayName,
      gradingScales: $.parseJSON($('input[name="grading-scales"]').val()),
      assessors: $.parseJSON($('input[name="assessors"]').val()),
      workspaceName: $('input[name="workspaceName"]').val(),
      assignments: [{
        workspaceMaterialId: assignmentData.workspaceMaterialId,
        materialId: assignmentData.materialId,
        title: assignmentData.title, 
        html: assignmentData.html,
        type: assignmentData.type,
      }]
    }, $.proxy(function (text) {
      var dialog = $(text);
      
      dialog.dialog({
        modal: true, 
        resizable: false,
        width: 'auto',
        height: 'auto',
        title: '<span class="modal-title-student-name">'+studentDisplayName+'</span><span class="modal-title-workspace-name">'+$('input[name="workspaceName"]').val()+'</span>',
        dialogClass: "evaluation-evaluate-modal",
        open: function() {
          $(this).find('input[name="evaluationDate"]')
            .css({'z-index': 9999, 'position': 'relative'})
            .attr('type', 'text')
            .datepicker();
          
          if (!workspaceMaterialEvaluation) {
            $(this).find('input[name="evaluationDate"]')
              .datepicker('setDate', new Date());
          } else {
            var gradeId = 
              workspaceMaterialEvaluation.gradeIdentifier + '/' + workspaceMaterialEvaluation.gradeSchoolDataSource + '@' + 
              workspaceMaterialEvaluation.gradingScaleIdentifier + '/' + workspaceMaterialEvaluation.gradingScaleSchoolDataSource;
                
            $(this).find('input[name="evaluationDate"]')
              .datepicker('setDate', new Date(workspaceMaterialEvaluation.evaluated));
            $(this).find('#evaluateFormLiteralEvaluation').val(workspaceMaterialEvaluation.verbalAssessment);
            $(this).find('select[name="grade"]').val(gradeId);
            $(this).find('select[name="assessor"]').val(workspaceMaterialEvaluation.assessorEntityId);
          }
          
          mApi().workspace.workspaces.materials.replies.read(workspaceEntityId, workspaceMaterialId, {
            userEntityId: studentEntityId
          }).callback(function (err, reply) {
            if (err) {
              $('.notification-queue').notificationQueue('notification', 'error', err);
            } else {

              var fieldAnswers = {};
              if (reply && reply.answers.length) {
                for (var i = 0, l = reply.answers.length; i < l; i++) {
                  var answer = reply.answers[i];
                  var answerKey = [answer.materialId, answer.embedId, answer.fieldName].join('.');
                  fieldAnswers[answerKey] = answer.value;
                }
              }
              
              $(document).muikkuMaterialLoader('loadMaterials', $(dialog).find('.evaluation-assignment'), fieldAnswers);
            }
          });
          
        },
        buttons: [{
          'text': dialog.data('button-save-text'),
          'class': 'save-evaluation-button',
          'click': function(event) {
            var gradeValue = $(this).find('select[name="grade"]')
              .val()
              .split('@', 2);
            var grade = gradeValue[0].split('/', 2);
            var gradingScale = gradeValue[1].split('/', 2);
            // TODO: Switch to ISO 8601
            var evaluationDate = $(this).find('input[name="evaluationDate"]').datepicker('getDate').getTime();
            var assessorEntityId = $(this).find('select[name="assessor"]').val();
            
            if (workspaceMaterialEvaluation && workspaceMaterialEvaluation.id) {
              mApi().workspace.workspaces.materials.evaluations.update(workspaceEntityId, workspaceMaterialId, workspaceMaterialEvaluation.id, {
                evaluated: evaluationDate,
                gradeIdentifier: grade[0],
                gradeSchoolDataSource: grade[1],
                gradingScaleIdentifier: gradingScale[0],
                gradingScaleSchoolDataSource: gradingScale[1],
                assessorEntityId: assessorEntityId,
                studentEntityId: studentEntityId,
                workspaceMaterialId: workspaceMaterialId,
                verbalAssessment: $(this).find('#evaluateFormLiteralEvaluation').val()
              }).callback($.proxy(function (err, result) {
                if (err) {
                  $('.notification-queue').notificationQueue('notification', 'error', err);
                } else { 
                  $(this).dialog("destroy").remove();
                }
              }, this));
            } else {
              mApi().workspace.workspaces.materials.evaluations.create(workspaceEntityId, workspaceMaterialId, {
                evaluated: evaluationDate,
                gradeIdentifier: grade[0],
                gradeSchoolDataSource: grade[1],
                gradingScaleIdentifier: gradingScale[0],
                gradingScaleSchoolDataSource: gradingScale[1],
                assessorEntityId: assessorEntityId,
                studentEntityId: studentEntityId,
                workspaceMaterialId: workspaceMaterialId,
                verbalAssessment: $(this).find('#evaluateFormLiteralEvaluation').val()
              }).callback($.proxy(function (err, result) {
                if (err) {
                  $('.notification-queue').notificationQueue('notification', 'error', err);
                } else { 
                  $(this).dialog("destroy").remove();
                }
              }, this));
            }
          }
        }, {
          'text': dialog.data('button-cancel-text'),
          'class': 'cancel-evaluation-button',
          'click': function(event) {
            $(this).dialog("destroy").remove();
          }
        }]
      });
    }, this));
  }

  $(document).ready(function() {
    var workspaceEntityId = $('#evaluation-views-wrapper').attr('data-workspace-entity-id');
    ASSIGNMENTS = $.parseJSON($('input[name="assignments"]').val())
    
    $(document).muikkuMaterialLoader({
      loadAnswers: false,
      readOnlyFields: true,
      workspaceEntityId: workspaceEntityId
    });
    
    $('#evaluation-views-wrapper')
      .evaluationSlyder({
        workspaceEntityId: workspaceEntityId,
        maxStudents: 6,
        workspaceStudentCount: $('input[name="workspaceStudentCount"]').val()
      });

    // Evaluation's workspaces
    if ($('#evaluationQueueWrapper').length > 0) {
      
      var height = $(window).height();
      var queueWrapper = $('#evaluationQueueContainer');
      var queueOpenCloseButton = $('.wi-evaluation-queue-navi-button-toc > .icon-navicon');
      var assigmentContainer = $('#evaluationStudentAssignmentListingWrapper');

      var queueWrapperWidth = queueWrapper.width();
      var queueWrapperLeftMargin = "-" + queueWrapperWidth + "px";
      var queueWrapperLeftMargin = "-" + queueWrapperWidth + "px";
      var contentMinLeftOffset = queueWrapperWidth + 20;
      var assigmentContainerRightPadding = 20;
        
      // Prevent icon-navicon link from working normally
      $(queueOpenCloseButton).bind('click', function(e) {
        e.stopPropagation();
      });

    };
    
    //Prevent page scroll happening if scrollable area reaches bottom
    $(document)
    .on('DOMMouseScroll mousewheel', '.evaluation-workspacelist-content-inner, .evaluation-modal-evaluateForm-header, .evaluation-modal-evaluateForm-content, .evaluation-modal-studentAssignmentWrapper', function(ev) {
      var $this = $(this),
        scrollTop = this.scrollTop,
        scrollHeight = this.scrollHeight,
        height = $this.height(),
        delta = (ev.type == 'DOMMouseScroll' ?
          ev.originalEvent.detail * -40 :
          ev.originalEvent.wheelDelta),
        up = delta > 0;

      var prevent = function() {
        ev.stopPropagation();
        ev.preventDefault();
        ev.returnValue = false;
        return false;
      }

      if (!up && -delta > scrollHeight - height - scrollTop) {
        // Scrolling down, but this will take us past the bottom.
        $this.scrollTop(scrollHeight);

        return prevent();
      } else if (up && delta > scrollTop) {
        // Scrolling up, but this will take us past the top.
        $this.scrollTop(0);
        return prevent();
      }
    });
    
    $(document).on('click', '.evaluation-student-wrapper', function(event){
      var workspaceEntityId = $('input[name="workspace-entity-id"]').val();
      var workspaceStudentEntityId = $(this).attr('data-workspace-student-entity-id');
      var studentDisplayName = $(this).find('.evaluation-student-name').text();
      var studentEntityId = $(this).attr('data-user-entity-id');
      var evaluated = $(this).attr('data-workspace-evaluated') == 'true' ? true : false;
      var evaluationData = {};
      if(evaluated){
        evaluationData = JSON.parse($(this).attr('data-workspace-evaluation-data'));
      }
      
      openWorkspaceEvaluationDialog(workspaceEntityId, studentEntityId, workspaceStudentEntityId, studentDisplayName, evaluated, evaluationData);
    });
    
    /* Evaluate assignment when its state is DONE or CRITICAL (means its late) */
    $(document).on('click', '.assignment-done, .assignment-evaluation-critical', function (event) {
      var workspaceEntityId = $('input[name="workspace-entity-id"]').val();
      var workspaceMaterialId = $(this).attr('data-workspace-material-id');
      var studentEntityId = $(this).attr('data-student-entity-id');
      var studentDisplayName = $(this)
        .closest('.evaluation-view-wrapper')
        .find('.evaluation-student-wrapper[data-user-entity-id=' + studentEntityId + ']')
        .attr('data-display-name');
      
      openMaterialEvaluationDialog(workspaceEntityId, workspaceMaterialId, studentEntityId, studentDisplayName, null);
    });
    
    /* View evaluation when assigment's state is EVALUATED */
    $(document).on('click', '.assignment-evaluated', function (event) {
      var workspaceEntityId = $('input[name="workspace-entity-id"]').val();
      var workspaceMaterialId = $(this).attr('data-workspace-material-id');
      var studentEntityId = $(this).attr('data-student-entity-id');
      var studentDisplayName = $(this)
        .closest('.evaluation-view-wrapper')
        .find('.evaluation-student-wrapper[data-user-entity-id=' + studentEntityId + ']')
        .attr('data-display-name');
      var workspaceMaterialEvaluationId = $(this).attr('data-workspace-material-evaluation-id');
      
      mApi().workspace.workspaces.materials.evaluations.read(workspaceEntityId, workspaceMaterialId, workspaceMaterialEvaluationId)
        .callback(function (err, result) {
          if (err) {
            $('.notification-queue').notificationQueue('notification', 'error', err);
          } else { 
            openMaterialEvaluationDialog(workspaceEntityId, workspaceMaterialId, studentEntityId,studentDisplayName,  result);
          }
        });
    });
    
    //Student user picture tooltip show on mouseover
    $(document).on('mouseover', '.evaluation-workspacelist-item', function (event) {
      
      var sName = $(this).attr('data-workspace-title');
      var sContainerLoc = $(this).offset().top - $('.evaluation-workspacelist-wrapper').offset().top;
      
      $('#workspaceTitleContainer').css({
        position: 'absolute',
        left: '30px',
        top: sContainerLoc
      })
      .show()
      .clearQueue()
      .stop()
      .animate({
          opacity: 1
        },{
          duration:150,
          easing: "easeInOutQuint",
          complete: function () {

          }
        })
      .text(sName);

    });
    
    //Student user picture tooltip hide on mouseout
    $(document).on('mouseout', '.evaluation-workspacelist-item', function (event) {
      
      $('#workspaceTitleContainer')
      .clearQueue()
      .stop()
      .animate({
          opacity: 0
        },{
          duration:150,
          easing: "easeInOutQuint",
          complete: function () {
            $(this).hide();
          }
        });

    });

  });
  

  
}).call(this);
