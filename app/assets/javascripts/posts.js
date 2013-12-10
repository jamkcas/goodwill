// Make a call to the posts/current to find the user's current post and thread
var getCurrent = function() {
  $.get('/posts/current').done(function(data) {
    if(data.length === 0) {
      $('#thread').append("<button id='startThread'>Start a Thread</button>")
    } else {
      template = JST['templates/current_deed']({current: data});
      $('#thread').append(template);
    }
  });
};

