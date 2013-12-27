/**************************************/
/******* Current post functions *******/
/**************************************/

// Function to set the modal with details to complete the post
var makePostModal = function(currentDeed) {
  var template = JST['templates/post_complete']({current: currentDeed});
  $('.window').append(template);
};

// Setting current thread details or a button if not currently on a thread
var setCurrent = function(data) {
  // If not currently on a thread, a new button is appended
  if(data.id === 'null') {
    $('.thread').append("<p class='startThread button'>START A THREAD</p>")
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

// Update post as complete in db function
var postAsComplete = function(current_id, title, details, type) {
  navigator.geolocation.getCurrentPosition(function(position) {
    initialLocation = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
    $.ajax('/posts/finish_post/' + current_id, {
      method: 'PUT',
      data: {
        title: title,
        details: details,
        lat: initialLocation.nb,
        lon: initialLocation.ob,
        updateType: type
      }
    }).done(function(data) {
      if(type === 'complete') {
        // Resetting the thread window on the index page
        $('.thread').empty();
        // Adding the start a new thread on the window
        fetchCurrent('thread', setCurrent);
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
  // Hiding the popup modal
  hideModal();
  // Getting the user's current location then making an update to the db to complete the post
  postAsComplete(id, title, details, 'complete');
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

  modalSize(0.7);

  // Getting all the deeds from the db
  populatePage(modalLists, 'donation');
  showModal();
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
    }
  });
}


