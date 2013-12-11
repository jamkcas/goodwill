// Make a call to the posts/current to find the user's current post and thread
var getCurrent = function() {
  var currentDeed;
  $.get('/posts/current').done(function(data) {
    currentDeed = data;
    // If not currently on a thread, a new button is appended
    if(data.length === 0) {
      $('#thread').append("<button id='startThread'>Start a Thread</button>")
    } else { // If on a current thread the post details are displayed
      template = JST['templates/current_deed']({current: data});
      $('#thread').append(template);
    }
  });

  // When the user wants to post that they have finished the deed and hit Post as Complete
  $('#thread').on('click', '#postComplete', function(e) {
    e.preventDefault();
    $.get('/posts/friends').done(function(data) {
      // Creating a popup modal to display form for submitting a completed deed, passing in current deed info and friends list
      template = JST['templates/post_complete']({current: currentDeed, friends: data});
      $('#overlayWindow').append(template);
    });

    // Making popup modal visible and moving it into position on the screen
    $('#overlay').css('visibility', 'visible');
    $('#overlayWindow').fadeIn(500).animate({'top': '50px'}, {duration: 300, queue: false});
  });

  // Close modal
  $('#overlayWindow').on('click', '.closeModal', function(e) {
    e.preventDefault();
    // Hiding the popup modal
    $('#overlay').css('visibility', 'hidden');
    $('#overlayWindow').fadeOut(500).animate({'top': '-1000px'}, {duration: 300, queue: false});
  })
};

