/******************************/
/******* Event Handlers *******/
/******************************/

var assignEvents = function() {

  /******************************/
  /******* Modal Handlers *******/
  /******************************/

  // Event for when user hits the close modal button (the core functionality is the hide modal function. The rest of the code refers to the case when a user is closing the modal of the update post flow)
  $('.overlayWindow').on('click', '.closeModal', function(e) {
    e.preventDefault();

    // // If invite has been sent, then the deed is marked as completed so the thread modal needs to be reset
    if(inviteCounter > 0) {
      // If invite is sent then the post needs to be posted on facebook
      var post_id = $('.modalMain').data('id');
      $.ajax('/posts/finish_post/' + post_id, {
        method: 'PUT',
        data: {
          updateType: 'complete'
        }
      });
      // Resetting the thread window on the index page
      $('.thread').empty();
      // Adding the start a new thread on the window
      fetchCurrent('thread', setCurrent);
    }
    // Reset the invite counter
    inviteCounter = 0;

    // Hiding the popup modal
    hideModal();

    // Resetting the queue
    queueReset();
  });


  /***************************************/
  /******* Current Thread Handlers *******/
  /***************************************/

  $('.thread').on('click', '.postComplete', function() {
    // Adding the complete post modal
    fetchCurrent('modal', makePostModal);
    // Adding the person's contacts if they exist or the import google button
    fetchContacts();
    // Making popup modal visible and moving it into position on the screen
    showModal();
  });

  $('.overlayWindow').on('click', '.updatePost', function(e) {
    e.preventDefault();
    // Clearing any existing errors
    $('.postErrors').empty();
    // Making sure at least one invite is sent
    if(inviteCounter === 0) {
      $('.postErrors').append('<p>Sorry! You must invite someone to complete your post. Thanks!</p>')
    } else {
      // Getting the current post and passing in a function to update the finished post
      fetchCurrent('null', finishPost);
    }
  });

  // Puts an event on the signin button so it can be auto-triggered (for when joining a thread via email link)
  $('#user_nav').on('click', '#signin', function() {
    window.location.href = $('#signin').attr('href');
  });


  /*******************************/
  /******* Invite Handlers *******/
  /*******************************/

  // Importing google contacts
  $('.overlayWindow').on('click', '.googleContacts', function() {
    importGoogle();
  });

  $('.overlayWindow').on('click', '.invite', function() {
    // Setting the current button to a variable
    var current = $(this);
    // Getting the id of the contact, as well as the id of the thread the user is currently on
    var friend_id = current.data('id');
    var thread_id = $('.currentDeed').data('id');
    // Setting initail calue of addedEmail
    var email = 'null';

    // Grabbing the email if one is entered manually
    if(current.hasClass('addedEmail')) {
      email = $('#email').val();
    }

    // Clearing error messages
    $('.postErrors').empty();

    // Hiding the invite options and giving the initial invite message
    $('.inviteMessage').append('<h4 class="sent">Invite being sent!</h4>');
    $('.inviteWindow').hide();

    /**************************************************************/
    /*** This is for the multi-person invite flow in the future ***/
    /**************************************************************/

    // // Hiding the invite button and giving inital send message
    // current.parent().append('<h4 class="sent">Invite being sent!</h4>');
    // current.hide();

    /**************************************************************/
    /*** This is for the multi-person invite flow in the future ***/
    /**************************************************************/

    // Making the ajax call to send the email for this person
    $.ajax('/posts/invite', {
      data: {
              thread: thread_id,
              friend: friend_id,
              email: email
            }
    }).done(function(data) {
      // If the invite is successfully sent a post is made to update post as complete
      if(data === 'ok') {
        // Getting the values of the form fields in case the user changed these values
        var details = $('#deedDetails').val();
        var title = $('#postTitle').val();
        // Getting the current post id
        var current_id = $('.modalMain').data('id');
        // Making call to update the post as complete, but NOT post to facebook
        postAsComplete(current_id, title, details, 'invite');
        // Removing the invite button and adding a sent message once the invitation was sent (need to check for success still)
        $('.sent').text('Invite sent!');
        // current.remove(); /*** Also for multi person invites in the future ***/
        // Updating the counter so the post can be submitted as complete to facebook
        inviteCounter += 1;
      }
    });
  });


  /*************************************/
  /******* Accept Modal Handlers *******/
  /*************************************/

  // Clears and hides the modal, clears the queue when the user declines to change threads
  $('.overlayWindow').on('click', '.decline', function() {
    // Hiding the popup modal
    hideModal();
    // Resetting the queue
    queueReset();
  });

  // Clears and hides the modal, clears the queue when the user declines to change threads
  $('.overlayWindow').on('click', '.accept', function() {
    var id = $(this).data('id');
    if(id === null) {
      // Clearing the modal contents
      $('.window').empty();
      // Showing the deed list choices
      var template = JST['templates/new_post']
      $('.window').append(template);
      // Getting all the deeds from the db
      populatePage(modalLists);
    } else {
      navigator.geolocation.getCurrentPosition(function(position) {
        initialLocation = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
        $.ajax('/posts/create', {
          method: 'POST',
          data: {
                  data_id: id,
                  lat: initialLocation.nb,
                  lon: initialLocation.ob
                }
        }).done(function(data) {
          // The modal is hidden
          hideModal();
          // Sets the queue to false if a post was created
          gon.queue = false;
          // The thread div is emptied (start thread button removed)
          $('#thread').empty();
          // The fetch current function is called to set the contents of the thread div to the current posts details
          fetchCurrent(setCurrent);
        });
      });
    }
  });


  /*************************************/
  /******* Start Thread Handlers *******/
  /*************************************/

  // Event for when a user wants to start a thread
  $('.thread').on('click', '.startThread', function() {
    showChoices();
  });

  $('.overlayWindow').on('mouseenter', '.deedEntry', function() {
    $(this).parent().css('background', '#E8EAEB');
  });

  $('.overlayWindow').on('mouseleave', '.deedEntry', function() {
    $(this).parent().css('background', 'white');
  });

  /*************************************/
  /******* Show Details Handlers *******/
  /*************************************/

  // $('.bottom').on('click', '.featuredEntry', function(){
  //   var current = $(this);
  //   var post_id = null
  //   var id = current.data('id');
  //   if($('#currentDeed').data('id')) {
  //     post_id = $('#currentDeed').data('id')
  //   }
  //   $.get('/deeds/' + id).done(function(data) {
  //     var template = JST['templates/details_page']({details: data, post_id: post_id});
  //     $('#overlayWindow').append(template);
  //     showModal();
  //   });
  // });

  // $('.container').on('click', '.deedEntry', function() {

  //   var current = $(this);
  //   var post_id = null
  //   var id = current.parent().data('id');
  //   if($('#currentDeed').data('id')) {
  //     post_id = $('#currentDeed').data('id')
  //   }
  //   $.get('/deeds/' + id).done(function(data) {
  //     $('#overlayWindow').empty();
  //     var template = JST['templates/details_page']({details: data, post_id: post_id});
  //     $('#overlayWindow').append(template);
  //     showModal();
  //   });
  // });



  /************************************/
  /******* Mouse Hover Handlers *******/
  /************************************/

  // $('.bottom').on('mouseenter', '.deedEntry', function() {
  //   $(this).parent().css('background', '#E8EAEB');
  //   $(this).parent().css('cursor', 'pointer');
  // });

  // $('.bottom').on('mouseleave', '.deedEntry', function() {
  //   $(this).parent().css('background', 'white');
  //   $(this).parent().css('cursor', 'none');
  // });

  // $('.container').on('click', '.change', function() {
  //   var id = $(this).data('id');
  //   var template = JST['templates/confirm']({id: id});
  //   $('#overlayWindow').empty();
  //   $('#overlayWindow').append(template);
  // });

  // $('.container').on('click', '.changeDeed', function() {
  //   var id = $(this).data('id');
  //   var template = JST['templates/new_post'];
  //   $('#overlayWindow').append(template);
  //   populatePage(modalLists);
  //   showModal();
  // });

  // $('#thread').on('click', '.showCurrent', function() {
  //   var id = $(this).data('id');
  //   $.get('/deeds/' + id).done(function(data) {
  //     var template = JST['templates/details_page']({details: data, post_id: null});
  //     $('#overlayWindow').append(template);
  //     showModal();
  //   });
  // });
  // $('.container').on('click', '.moreDonations', function(){
  //   populatePage(fullList, 'donation');
  // });
  // $('.container').on('click', '.moreServices', function(){
  //   populatePage(fullList, 'service');
  // });
  // $('.container').on('click', '.moreLocal', function(){
  //   populatePage(fullList, 'local');
  // });



  /*****************************/
  /******* Vote Handlers *******/
  /*****************************/

  // Up vote handler
  $('.container').on('click', '.upVote', function(e) {
    e.preventDefault();
    // Grabbing the data id of the deed being voted on
    var vote_id = $(this).data('id');
    // Setting the vote instance variable for use in the ajax callback
    var current_vote = $(this);
    $.ajax('/votes/save_vote', {
      method: 'POST',
      data: {
              vote_type: 'up',
              id: vote_id,
              votable_type: 'Deed'
            }
    }).done(function(data) {
    //   // Changing the vote on the index page if clicking on the modal page
    //   if(current_vote.parent().parent().parent().parent().parent().hasClass('lists') || current_vote.parent().parent().parent().hasClass('completeLists')) {
    //     emptyPage();
    //     // Refreshing the lists on the index page
    //     ***** Move this to Sidekiq and sideTiq later *****
    //     /****** Actually populating each list twice atm ******/
    //     refreshLists();
    //   }
      // Getting the old vote count
      oldTotal = current_vote.children(1).text();
      // Adding the new vote to the vote count
      new_total = parseInt(oldTotal) + parseInt(data)
      // Setting the new vote count to display
      current_vote.children(1).text(new_total);
      // Removing both voting buttons so the current user cant vote again
      current_vote.removeClass('upVote');
      current_vote.next().removeClass('downVote');
    });
  });

  // Down vote handler
  $('.container').on('click', '.downVote', function(e) {
    e.preventDefault();
    var vote_id = $(this).data('id');
    // Setting the vote instance varaible for use in the ajax callback
    var current_vote = $(this);
    $.ajax('/votes/save_vote', {
      method: 'POST',
      data: {
              vote_type: 'down',
              id: vote_id,
              votable_type: 'Deed'
            }
    }).done(function(data) {
      // Changing the vote on the index page if clicking on the modal page
      // if(current_vote.parent().parent().parent().parent().parent().hasClass('lists') || current_vote.parent().parent().parent().hasClass('completeLists')) {
      //   emptyPage();
      //   refreshLists();
      // }
      // Getting the old vote count
      oldTotal = current_vote.children(1).text();
      // Adding the new vote to the vote count
      new_total = parseInt(oldTotal) + Math.abs(parseInt(data));
      // Setting the new vote count to display
      current_vote.children(1).text(new_total);
      // Removing both voting buttons so the current user cant vote again
      current_vote.prev().removeClass('upVote');
      current_vote.removeClass('downVote');
    });
  });

};