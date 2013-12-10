// Make a call to the posts/current to find the user's current post and thread
var getCurrent = function() {
  $.get('/posts/current').done(function(data) {
    // If not currently on a thread, a new button is appended
    if(data.length === 0) {
      $('#thread').append("<button id='startThread'>Start a Thread</button>")
    } else { // If on a current thread the post details are displayed
      template = JST['templates/current_deed']({current: data});
      $('#thread').append(template);
    }
  });
};

