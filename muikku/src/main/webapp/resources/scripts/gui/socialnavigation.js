
function openInSN(template, result, formFunction) {
  var functionContainer = $('.sn-container');
  var formContainer = $('#mainfunctionFormTabs');

  // temporary solution for removing existing tabs --> TODO: TABBING

  formContainer.empty();

  var openTabs = formContainer.children().length;
  var tabDiv = $("<div class='mf-form-tab' id='mainfunctionFormTab-" + eval(openTabs + 1) + "'>");

  tabDiv.appendTo(formContainer);

  renderDustTemplate(template, result, function(text) {
    $(tabDiv).append($.parseHTML(text));

    var textareas = functionContainer.find("textarea");    
    var cancelBtn = $(tabDiv).find("input[name='cancel']");
    var sendBtn = $(tabDiv).find("input[name='send']");
    var elements = $(tabDiv).find("form");
    
    
    // Getting existing content 
    
    // Discussion 
     if(result != null && result.actionType == "edit"){
      var msg = result.message;
     }
    $(textareas).each(function(index,textarea){
      
      $(textarea).val(msg);
      
      CKEDITOR.replace(textarea, {
        height : '100px',
        toolbar: [
                  { name: 'basicstyles', items: [ 'Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript', '-', 'RemoveFormat' ] },
                  { name: 'styles', items: [ 'Styles', 'Format', 'Font', 'FontSize' ] },                    
                  { name: 'paragraph', groups: [ 'list', 'indent', 'blocks', 'align', 'bidi' ], items: [ 'NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'Blockquote', 'CreateDiv', '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock', '-', 'BidiLtr', 'BidiRtl', 'Language' ] },
                  { name: 'links', items: [ 'Link', 'Unlink', 'Anchor' ] },
                  { name: 'insert', items: [ 'Image', 'Flash', 'Table', 'HorizontalRule', 'Smiley', 'SpecialChar', 'PageBreak', 'Iframe' ] },
     
                ]          
          
      });
      

      
    });
    
    // Selects current forum area when new message form loads
    var selArea = $("#discussionAreaSelect").val();
    
    if (selArea != "all") {
      $("#forumAreaIdSelect option")
      .prop('selected', false)
      .filter('[value="' + selArea + '"]')
      .prop('selected', true);
    }
    
    cancelBtn.on("click", cancelBtn, function() {
      formContainer.empty();
      $('.sn-container').removeClass('open');
      $('.sn-container').addClass('closed');
      
      adjustContentMargin();
    });

    sendBtn.on("click", sendBtn, function() {
      var vals = elements.serializeArray();
      var obj = {};
      var varIsArray = {};
      var ckContent = null;
      // TODO: Remove this hack
      if (CKEDITOR.instances.textContent) {
        ckContent = CKEDITOR.instances.textContent.getData();
      } else if (CKEDITOR.instances.length > 0) {
        ckContent = CKEDITOR.instances[0].textContent.getData();
      }
      
      elements.find(':input').each(function(index, element) {
        element0r = $(element);
        varIsArray[element.name] = element0r.data('array') || false;
      });

      $.each(vals, function(index, value) {
        if (varIsArray[value.name] != true) {
          
          if (value.name == "content" || value.name == "message" && textareas.length > 0) {
            obj[value.name] = ckContent || '';         
          } else {
            obj[value.name] = value.value || '';   
          }
          
        } else {
          if (obj[value.name] == undefined)
            obj[value.name] = [];

          obj[value.name].push(value.value);
        }
      });

      var result = formFunction(obj);
      if (result !== false) {
        formContainer.empty();
        $('.sn-container').removeClass('open');
        $('.sn-container').addClass('closed');
        adjustContentMargin();
      }

    });


  });

  functionContainer.removeClass('closed');
  functionContainer.addClass('open');
  adjustContentMargin();
}

// TODO: create more sophisticated fix for content area's bottom margin adjustment when social navigation is opened  
function adjustContentMargin() {
  if ($('.sn-container.open').length > 0) {
  
    if ($("#content").length > 0) {
      $("#content").css({
        "margin-bottom" : "320px"
      });
    }
    
  } else {
    if ($("#content").length > 0) {
      $("#content").css({
        "margin-bottom" : 0
      });
    }
  }
  
}
