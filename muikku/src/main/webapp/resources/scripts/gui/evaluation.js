(function() {
  
  $.widget("custom.evaluationSlyder", {
    options : {
      workspaceEntityId: null
    },
    
    _create : function() {
      this.element.append($('<div>').addClass('evaluation-views-slyder'));
      
      this._pagesLoaded = {};
      
      this._loadPage(0, $.proxy(function () {
        this._loadPage(1, $.proxy(function () {
          this.element.sly({
            horizontal: 1,
            itemNav: 'forceCentered',
            smart: 1,
            activateMiddle: 1,
            mouseDragging: 1,
            touchDragging: 1,
            releaseSwing: 1,
            startAt: 0,
            scrollBy: 1,
            speed: 300,
            elasticBounds: 1,
            easing: 'easeOutExpo'
          })
          .sly('on', 'active', $.proxy(this._onSlyActive, this));
        }, this));
      }, this));
    },
    
    _loadPage: function (pageId, callback) {
      console.log("look! im loading a page!");
      
      this._pagesLoaded[pageId] = 'LOADING';
      
      $.ajax({
        url : CONTEXTPATH + '/evaluation/' + this.options.workspaceEntityId + '/page/' + pageId + '?maxStudents=' + this.options.maxStudents,
        success : $.proxy(function(data) {
          this._pagesLoaded[pageId] = 'LOADED';
          
          this.element.find('.evaluation-views-slyder').append($(data).css('width', this.element.width()));
          this.element.sly('reload');
              
          if ($.isFunction(callback)) {
            callback();
          }
        }, this)
      });
    },
    
    _onSlyActive: function (eventName, index) {
      if (!this._pagesLoaded[index + 1]) {
        this._loadPage(index + 1);
      } else {
        console.log("look! im NOT loading a page!");
      }
    },
    
    _destroy: function () {
      
    }
  });

  $(document).ready(function() {
    
    $('#evaluation-views-wrapper')
      .evaluationSlyder({
        workspaceEntityId: $('#evaluation-views-wrapper').attr('data-workspace-entity-id'),
        maxStudents: 8
      });
    
    if ($('#evaluationModalWrapper').length > 0) {
      $('#evaluationModalWrapper').hide();
    }

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
    
    //Prevent page scroll happening if TOC scroll reaches bottom
    $('.evaluation-queue-content-inner, .evaluation-modal-evaluateForm-header, .evaluation-modal-evaluateForm-content')
    .on('DOMMouseScroll mousewheel', function(ev) {
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
    
    $(document).on('click', '.evaluation-modal-close-wrapper', function (event) {
      $('#evaluationModalWrapper').hide();
    });
    
    /* Evaluate assignment when its state is DONE or CRITICAL (means its late) */
    $(document).on('click', '.evaluation-assignment-wrapper, .assignment-evaluation-critical', function (event) {
      renderDustTemplate('evaluation/evaluation_evaluate_modal_view.dust', {
        gradingScales: $.parseJSON($('input[name="grading-scales"]').val())
      }, $.proxy(function (text) {
        var dialog = $(text);
        $(text).dialog({
          modal: true, 
          height: $(window).height() - 50,
          resizable: false,
          width: $(window).width() - 50,
          dialogClass: "evaluation-evaluate-modal",
          buttons: [{
            'text': dialog.data('button-save-text'),
            'class': 'save-evaluation-button',
            'click': function(event) {
              var gradeValue = $(this).find('select[name="grade"]').val();
              if (gradeValue) {
                var gradeValueParts = gradeValue.split('@', 2);
                var grade = gradeValueParts[0];
                var gradingScale = gradeValueParts[1];
                
                console.log("Grade " + grade + ' in grading scale ' + gradingScale);
              }
              
              $(this).dialog("destroy").remove();
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
      
    });
    
    /* View evaluation when assigment's state is EVALUATED */
    $(document).on('click', '.assignment-evaluated', function (event) {
      
      renderDustTemplate('evaluation/evaluation_evaluate_modal_view.dust', { }, $.proxy(function (text) {
        var dialog = $(text);
        $(text).dialog({
          modal: true, 
          height: $(window).height() - 50,
          resizable: false,
          width: $(window).width() - 50,
          dialogClass: "evaluation-evaluate-modal",
          buttons: [{
            'text': dialog.data('button-save-text'),
            'class': 'save-evaluation-button',
            'click': function(event) {
      
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
      
    });
    
    //Student user picture tooltip show on mouseover
    $(document).on('mouseover', '.evaluation-workspacelist-item', function (event) {
      
      sName = $(this).attr('data-workspace-title');
      sContainerLoc = $(this).offset().top - $('.evaluation-workspacelist-wrapper').offset().top + 2;
      
      $('#workspaceTitleContainer').css({
        position: 'absolute',
        left: '20px',
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
