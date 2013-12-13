// Function to add a contact contacts to the contacts list window
var addContacts = function(data) {
  template = JST['templates/contacts_entry']({contacts: data});
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
  $('#overlayWindow').on('click', '.googleContacts', function(e) {
    e.preventDefault();
    // Ajax call to get authorization code and then access token for user
    $.ajax('/contacts/google').done(function(data) {
      // If a url is returned then a call is made to get an access token, otherwise the current user already has an access token
      if(data.url != 'null') {
        // Makes a popup window for Permissions page for google (auto-closes when done)
        window.open(data.url, "popupWindow", "width=600,height=600,scrollbars=yes");
      }
    });
    // Makes a call to get the contacts and append them to contacts list page
    getContacts();
    $('.googleContacts').remove();
  });
};

// Call to get contacts if they exist on page load or add a button to get from google
var fetchContacts = function() {
  $.ajax('/contacts/get_contacts').done(function(data) {
    // If no contacts exist in the db then add a prompt and a button to import them
    if(data.length === 0) {
      template = JST['templates/import'];
      $('.contacts').append(template);
      // Importing google contacts
      importGoogle();
    } else {
      // Appending the contacts to the contacts list
      addContacts(data);
    }
  });
}

// Function to set the modal with details to complete the post
var makePostModal = function(currentDeed) {
  template = JST['templates/post_complete']({current: currentDeed});
  $('#overlayWindow').append(template);
};

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
    // Adding the complete post modal
    makePostModal(currentDeed);
    // Adding the person's contacts if they exist or the import google button
    fetchContacts();

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
    // Resetting the modal
    $('#overlayWindow').empty();
  })


  // When an invite is clicked, an ajax call is made to email an invite to the corresponding contact
  $('#overlayWindow').on('click', '.invite', function() {
    // Setting the current button to a variable
    current = $(this);
    // Getting the id of the contact, as well as the id of the thread the user is currently on
    friend_id = current.data('id');
    thread_id = $('#currentDeed').data('id');
    // Making the ajax call to send the email for this person
    $.ajax('/posts/invite', {
      data: {
              thread: thread_id,
              friend: friend_id
            }
    }).done(function(data) {
      // Removing the invite button and adding a sent message once the invitation was sent (need to check for success still)
      current.parent().append('<h4>Invite Sent!</h4>');
      current.remove();
    });
  });
};

