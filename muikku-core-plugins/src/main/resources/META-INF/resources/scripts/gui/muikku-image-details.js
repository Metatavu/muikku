(function() {
  'use strict';
  
  $.widget("custom.imageDetails", {
    
    _create : function() {
      this._details = null;
      
      $.each(['source', 'author', 'license'], $.proxy(function (index, type) {
        this._appendDetails(type, this.element.attr('data-' + type), this.element.attr('data-' + type + '-url'));
      }, this));
    },
    
    _appendDetails: function (type, text, url) {
      if (text || url) {
        if (!this._details) {
          var figure = this.element.closest('figure');
          if (!figure.length) {
            var figure = $('<figure>')
              .addClass('image');

            var parentLink = this.element.parent('a');
            if (parentLink.length) {
              figure.insertBefore(parentLink);
              parentLink.appendTo(figure);
            } else {
              figure.insertBefore(this.element);
              this.element.appendTo(figure);
            }
          }
          
          figure.css('max-width', this.element.width())
          
          this._details = $('<div>')
            .addClass('image-details icon-copyright')
            .insertAfter(this.element);
        
          this._detailsContainer = $('<div>')
            .append($('<span>').text(getLocaleText('plugin.workspace.materials.detailsSourceLabel')))
            .addClass('image-details-container')
            .appendTo(this._details);
        }
        
        if (url) {
          $('<a>')
            .attr('href', url)
            .text(text||url)
            .appendTo(this._detailsContainer);
        } else {
          $('<span>')
            .text(text||url)
            .appendTo(this._detailsContainer);
        }
      }
    },
    
    _destroy: function () {
      
    }
  });
  
  
  
}).call(this);
