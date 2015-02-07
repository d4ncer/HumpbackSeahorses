var UsersInRoomView = Backbone.View.extend({

  el: $('#usersInRoom'),

  initialize: function(){
    this.collection.on("add", this.render, this);
  },

  render: function(){

    var nameIdPairs = _.uniq(this.collection.map(function(message){
      return message.get("username") + ";" + message.get("user_id");
    }));

    this.$el.empty();
    nameIdPairs.forEach(function(nameIdPair){
      var index = nameIdPair.indexOf(";");
      var username = nameIdPair.slice(0,index);
      var user_id = nameIdPair.slice(index+1);
      var data = 'data-user_id="' + user_id + '"';
      var action = 'onclick="styleTool($(this), \'toggleHighlight\'  )"';
      var drag = 'draggable="true" ondragstart="drag(event)"';
      var typing = '<span class="typingIndicator"></span>'
      this.$el.append('<li style="list-style: none"' + drag + action + data + '>' + username + typing + '</li>');
    }, this)

  }
});
