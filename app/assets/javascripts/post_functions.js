/**************************************/
/******* Current post functions *******/
/**************************************/

// Function to set the modal with details to complete the post
var makePostModal = function(currentDeed) {
  var template = JST['templates/post_complete']({current: currentDeed});
  $('.window').append(template);
  // Hiding the next screen and the email invite message
  $('.nextScreen').hide();
  $('.enterInvite').hide();
};

// Setting current thread details or a button if not currently on a thread
var setCurrent = function(data) {
  // If not currently on a thread, a new button is appended
  if(data.id === 'null') {
    $('.thread').append("<p class='startThread button'>START A THREAD</p>");
    // Populating the world map with recently done deeds if not on a current thread
    worldMapPoints();
  } else {
    // If on a current thread the post details are displayed
    var template = JST['templates/current_deed']({current: data});
    $('.thread').append(template);
  }
};

// Getting the current post, then performing the passed in function with the data returned
var fetchCurrent = function(type, callback) {
  $.ajax('/posts/current', {
    method: 'GET',
    data: {
            type: type,
            ajax: 'This is an ajax request' // To prevent page from being displayed if not rendered by an ajax call
          }
  }).done(function(data) {
    // Function to populate the current thread window and populate the map
    callback(data);
  });
};

// Updates the current thread window and the map to reflect what the user is working on
var updateCurrent = function() {
  // Add the map to the map canvas
  mapInit();
  // Getting current deed info
  if(gon.logged_in === true) {
    fetchCurrent('thread', setCurrent);
  }
};

// Update post as complete in db function
var postAsComplete = function(current_id, title, details, type, anon) {
  navigator.geolocation.getCurrentPosition(function(position) {
    initialLocation = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
    $.ajax('/posts/finish_post/' + current_id, {
      method: 'PUT',
      data: {
        title: title,
        details: details,
        lat: initialLocation.b,
        lon: initialLocation.d,
        updateType: type,
        anon: anon
      }
    }).done(function(data) {
      if(type === 'complete') {
        // Resetting the thread window on the index page
        $('.thread').empty();
        // Adding the start a new thread on the window
        updateCurrent();
        // Update the recent post list
        populatePosts();
        // Repopulating the map
        worldMapPoints();
      }
    });
  });
};

// Function to grab post details, update the Post db, and make a post on facebook
var finishPost = function(current) {
  // Getting the values of te form fields in case the user changed these values
  var details = $('#deedDetails').val();
  var title = $('#postTitle').val();
  // Getting the id of the current post
  var id = $('.currentDeed').data('id');
  // Checking to see if the user wants to post as anonymous
  var anon = $('#anon').is(':checked') ? true : false;
  // Creating and displaying a completed modal
  var template = JST['templates/thanks']({title: 'Thanks for participating!', msg: 'Congratulations on finishing your deed! Your post has been updated. You should feel good about yourself!'});
  $('.window').empty();
  $('.window').append(template);
  // Getting the user's current location then making an update to the db to complete the post
  postAsComplete(id, title, details, 'complete', anon);
  // Resetting the invite counter
  inviteCounter = 0;
};

var checkCurrent = function() {
  // If there is a current queue a modal is triggered
  if(gon.queue === true) {
    // Checking to see if the user is currently on a thread
    $.ajax('/posts/current', {
      data: {
        type: 'thread',
        ajax: 'This is an ajax request'
      }
    }).done(function(data) {
      if(data.id === 'null') {
        showChoices();
      } else {
        // Showing a confirmation modal so user can decide it they want to switch deed threads
        var template = JST['templates/confirm']({id: 'null'});
        $('.window').append(template);
        showModal();
      }
    });
  }
};

// Function to clear the queue value on both the client and the server side
var queueReset = function() {
  $.get('/posts/reset');
  gon.queue = false;
};


/*********************************/
/******* New post functons *******/
/*********************************/

// Shows the choices of deeds when joining or starting a thread
var showChoices = function() {
  var template = JST['templates/new_post'];
  $('.window').append(template);
  // Loading image for when deeds are loading
  $('.list').append('<img src="loading-animation-1.gif" class="loading">');
  // Setting the modal size and positioning
  modalSize(0.7);

  // Getting all the deeds from the db
  populatePage(modalLists, 'donation');

  $('.searchResults').hide();
  showModal();
};


/***********************************/
/******* Old thread functons *******/
/***********************************/

// Function to get previous deed threads
var getThreads = function() {
  $.ajax('/posts/threads', {
    method: 'GET',
    data: {
      ajax: 'This is an ajax request'
    }
  }).done(function(data) {
    var template = JST['templates/thread_list']({lists: data});
    $('.oldThreadList').append(template);
  });
};

// Function to show thread list
var showThreads = function() {
  $('.oldThreadList').show(0, function() {
    $('.oldThreadList').css('padding', '10px 0');
  if($('.threadList').children().length >= 4) {
    $('.oldThreadList').css('height', '140px');
  } else if($('.threadList').children().length === 3) {
    $('.oldThreadList').css('height', '120px');
  } else if($('.threadList').children().length === 2) {
    $('.oldThreadList').css('height', '100px');
  } else {
    $('.oldThreadList').css('height', '70px');
  }
  $('.oldThreadList').css('border', '1px solid #838488');
  });
};

// Function to hide thread list
var hideThreads = function() {
  $('.oldThreadList').css('padding', '0');
  $('.oldThreadList').css('height', '0');
  $('.oldThreadList').css('border-bottom', 'none');
  $('.oldThreadList').delay(400).hide(0);
};

// Function to get posts of previous deed threads
var getThreadPosts = function(thread_id, title) {
  $.ajax('/posts/thread_posts', {
    method: 'GET',
    data: {
      ajax: 'This is an ajax request',
      thread_id: thread_id
    }
  }).done(function(data) {
    if(data.length > 0) {
      // Setting the current map title
      $('.currentHeader h3').text(title);
      // Drawing the map with new points
      drawLines(setLocations(data, 'old'));
    }
  });
};


/************************************/
/******* Recent post functons *******/
/************************************/

// Function to populate the recent posts
var populatePosts = function() {
  $.get('/posts/recent').done(function(data) {
    $('.recentList').empty();
    _.each(data.slice(0, 5), function(post) {
      var template = JST['templates/recent_post']({ data: post });
      $('.recentList').append(template);
    });
  });
};


/********************************/
/******* Contact functons *******/
/********************************/

// Function to change email input display size based on whether import from google button is present
var setEmailSize = function() {
  $('.addEmail').css('width', '100%');
  $('.addEmail').css('margin-left', '0');
  $('#email').css('width', '50%');
  $('#email').css('margin-right', '10px');
};

// Function to add a contact contacts to the contacts list window
var addContacts = function(data) {
  var template = JST['templates/contacts_entry']({contacts: data});
  $('.contactsList').append(template);
  // Changing the invite messages
  $('.contactsMessage').text('Invite from Google contacts');
  $('.enterInvite').show();
};

// Function to fetch contacts after a google token request
var getContacts = function() {
  $.ajax('/contacts/get_contacts').done(function(data) {
    // If the google response hasnt come back, it will recall itself every 0.2s until it comes back (still need to edge case for if the user doesnt have any google contacts)
    if(data.length === 0) {
      setTimeout(getContacts, 200);
    } else {
      // Appending the contacts to the contacts list
      addContacts(data);
    }
  });
};

// Call to google to get permissions and ask for contacts list
var importGoogle = function() {
  // Ajax call to get authorization code and then access token for user
  $.ajax('/contacts/google').done(function(data) {
    // If a url is returned then a call is made to get an access token, otherwise the current user already has an access token
    if(data.url != 'null') {
      // Makes a popup window for Permissions page for google (auto-closes when done)
      window.open(data.url, "popupWindow", "width=600,height=600,scrollbars=yes");
    }
  }).done(function(data) {
    // Makes a call to get the contacts and append them to contacts list page
    getContacts();
  });

  // Removing the add contacts function
  $('.google').remove();
  setEmailSize();
};

// Call to get contacts if they exist on page load or add a button to get from google
var fetchContacts = function() {
  $.ajax('/contacts/get_contacts').done(function(data) {
    // If no contacts exist in the db then add a prompt and a button to import them
    if(data.length === 0) {
      var template = JST['templates/import'];
      $('.google').append(template);
    } else {
      // Appending the contacts to the contacts list
      addContacts(data);
      $('.google').remove();
      setEmailSize();
      $('.contacts').css('border', '1px solid #E8EAEB');
    }
  });
}


