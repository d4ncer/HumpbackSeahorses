//returns rendered template
var MessageView = Backbone.View.extend({
  template : _.template('<div class="message-display"><h4> <%- username %> </h4>\
                          <div><%- text %></div>\
                          <div><%- lang %> | <%- room %></div>\
                        </div>'
                        ),

  render:function(){
    this.$el.html(this.template(this.model.attributes));
    return this.$el;
  }
});

var MessagesView = Backbone.View.extend({

  initialize : function(){
    var collection = this.collection;
    this.collection.on('add', this.render, this);

    //socket.io listener for emits
    socket.on('chat message', function(msg){
      //adds message to collection
      collection.addmsg(msg);
    });

    //storage variable for displayed messages
    this.onscreenMessages = {};
  },

  render : function () {
    this.collection.forEach(this.renderMessage, this);
  },

  renderMessage : function(message) {
    //message.cid is unique client-only id
    if (!this.onscreenMessages[message.cid]) {
      var messageView = new MessageView ({model : message});
      this.$el.prepend (messageView.render());
      this.onscreenMessages[message.cid] = true;
    }
  }

});