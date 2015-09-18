(function() {
  'use strict';
  
  $.widget("custom.muikkuWebSocket", {
    
    options: {
      reconnectInterval: 200
    },
    
    _create : function() {
      this._ticket = null;
      this._webSocket = null;
      this._socketOpen = false;
      this._messagesPending = [];
      
      this._getTicket($.proxy(function (ticket) {
        if (this._ticket) {
          this._openWebSocket();
        } else {
          $('.notification-queue').notificationQueue('notification', 'error', "Could not open WebSocket because ticket was missing");
        }
      }, this));

      this.element.on("webSocketConnected", $.proxy(this._onWebSocketConnected, this));
      this.element.on("webSocketDisconnected", $.proxy(this._onWebSocketDisconnected, this));
    },
    
    sendMessage: function (eventType, data) {
      var message = {
        eventType: eventType,
        data: data
      };
      
      if (this._socketOpen) {
        this._webSocket.send(JSON.stringify(message));
      } else {
        this._messagesPending.push({
          eventType: eventType,
          data: data
        });
      }
    },
    
    ticket: function () {
      return this._ticket;
    },
    
    _getTicket: function (callback) {
      if (this._ticket) {
        // We have a ticket, so we need to validate it before using it
        mApi().websocket.ticket.check.read(this._ticket).callback($.proxy(function (err, response) {
          if (err) {
            // Ticket did not pass validation, so we need to create a new one
            this._createTicket($.proxy(function (ticket) {
              this._ticket = ticket;
              callback(ticket);
            }, this));
          } else {
            // Ticket passed validation, so we use it
            callback(this._ticket);
          }
        }, this));
      } else {
        // Create new ticket
        this._createTicket($.proxy(function (ticket) {
          this._ticket = ticket;
          callback(ticket);
        }, this));
      }
    },
    
    _createTicket: function (callback) {
      mApi().websocket.ticket.read().callback($.proxy(function (err, ticket) {
        if (!err) {
          callback(ticket.ticket);
        } else {
          $('.notification-queue').notificationQueue('notification', 'error', "Could not create WebSocket ticket");
        }
      }, this));
    },
    
    _openWebSocket: function () {
      var host = window.location.host;
      var secure = location.protocol == 'https:';
      this._webSocket = this._createWebSocket((secure ? 'wss://' : 'ws://') + host + '/ws/socket/' + this._ticket);
      
      if (this._webSocket) {
        this._webSocket.onmessage = $.proxy(this._onWebSocketMessage, this);
        this._webSocket.onerror = $.proxy(this._onWebSocketError, this);
        this._webSocket.onclose = $.proxy(this._onWebSocketClose, this);
        switch (this._webSocket.readyState) {
          case this._webSocket.CONNECTING:
            this._webSocket.onopen = $.proxy(this._onWebSocketOpen, this);
          break;
          case this._webSocket.OPEN:
            this.element.trigger("webSocketConnected"); 
          break;
          default:
            $('.notification-queue').notificationQueue('notification', 'error', "WebSocket connection failed");
          break;
        }
      } else {
        $('.notification-queue').notificationQueue('notification', 'error', "Could not open WebSocket connection");
      }
    },
    
    _createWebSocket: function (url) {
      if ((typeof window.WebSocket) !== 'undefined') {
        return new WebSocket(url);
      } else if ((typeof window.MozWebSocket) !== 'undefined') {
        return new MozWebSocket(url);
      }
      
      return null;
    },
    
    _reconnect: function () {
      this._socketOpen = false;
      clearTimeout(this._reconnectTimeout);
      
      this._reconnectTimeout = setTimeout($.proxy(function () {
        try {
          if (this._webSocket) {
            this._webSocket.onclose = function () {};
            this._webSocket.close();
          }
        } catch (e) {
          
        }
        
        this._getTicket($.proxy(function (ticket) {
          if (this._ticket) {
            this._openWebSocket();
          } else {
            $('.notification-queue').notificationQueue('notification', 'error', "Could not open WebSocket because ticket was missing");
          }
        }, this));
        
      }, this), this.options.reconnectInterval);
    },

    _onWebSocketOpen: function (event, data) {
      this.element.trigger("webSocketConnected"); 
    },
    
    _onWebSocketError: function () {
      this._reconnect();
    },
    
    _onWebSocketClose: function () {
      this.element.trigger("webSocketDisconnected"); 
      this._reconnect();
    },
    
    _onWebSocketConnected: function () {
      this._socketOpen = true;
      
      while (this._messagesPending.length) {
        var message = this._messagesPending.shift();
        this.sendMessage(message.eventType, message.data);
      }
    },
    
    _onWebSocketDisconnected: function () {
      this._socketOpen = false;
    },
   
    _onWebSocketMessage: function (event) {
      var message = JSON.parse(event.data);
      var eventType = message.eventType;
      
      this.element.trigger(eventType, message.data);
    },
    
    _onBeforeWindowUnload: function () {
      if (this._webSocket) {
        this._webSocket.onclose = function () {};
        this._webSocket.close();
      }
    }
  });

  $(document).muikkuWebSocket();
  
}).call(this);