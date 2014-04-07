$(document).ready(function() {
    // Dynamic navigation -->
    
      $( "#dynamicNaviButton" ).click(function() {
       $( "#dynamicNaviContainer" ).toggle( "slide", 500 );
      });

    // Widget settings tool area -->
      
      $( "div[class*='wi-frontpage']" ).mouseenter(function() {
        var tools =  $(this).find(".wi-frontpage-widget-toolarea");
         tools.show( "slide", 50 );
         
        });
  
      $( "div[class*='wi-frontpage']" ).mouseleave(function() {
        var tools =  $(this).find(".wi-frontpage-widget-toolarea");
         tools.hide( "slide", 50 );
        });
  


     // Widget dragging --> 
     
      $( "div[class*='wi-frontpage-dynamic']" ).draggable({ snapMode: "inner" });
        
     // Seeker functionalities -->

      
      $( "#seeker" ).focus(function() {
        $('#seeker').val('');
      });

       $( "#seeker" ).blur(function() {
         var sval = this.defaultValue;
          $('#seeker').val(sval);
        });

    // fastlinks and dialogs for dock applications -->
    
    $( "div[class*='wi-dock-static-navi']" ).mouseenter(function() {
      var tooltip = $(this).find("[class*='dock-navi-tt-container']");
      tooltip.stop().show("fade", 100);
      var innerTooltip = tooltip.children('div');
      var tOffsets = tooltip.offset();
      tooltip.css({
    	width: $(window).width(),
    	left:-tOffsets.left,
      });
      innerTooltip.css({
    	  paddingLeft: tOffsets.left + 20
      });
      
    });

    $( "div[class*='wi-dock-static-navi']" ).mouseleave(function() {
      var tooltip =  $(this).find("[class*='dock-navi-tt-container']");
      tooltip.stop().hide();
      tooltip.css({
       	left:'0px'
      });
    });

});
