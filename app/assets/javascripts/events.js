/******************************/
/******* Event Handlers *******/
/******************************/

var assignEvents = function() {


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

  $('.bottom').on('mouseenter', '.deedEntry', function() {
    $(this).parent().css('background', '#E8EAEB');
    $(this).parent().css('cursor', 'pointer');
  });

  $('.bottom').on('mouseleave', '.deedEntry', function() {
    $(this).parent().css('background', 'white');
    $(this).parent().css('cursor', 'none');
  });

  $('.container').on('click', '.change', function() {
    var id = $(this).data('id');
    var template = JST['templates/confirm']({id: id});
    $('#overlayWindow').empty();
    $('#overlayWindow').append(template);
  });

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
      // Changing the vote on the index page if clicking on the modal page
      if(current_vote.parent().parent().parent().parent().parent().hasClass('lists') || current_vote.parent().parent().parent().hasClass('completeLists')) {
        emptyPage();
        // Refreshing the lists on the index page
        /****** Move this to Sidekiq and sideTiq later ******/
        /****** Actually populating each list twice atm ******/
        refreshLists();
      }
      // Getting the old vote count
      oldTotal = current_vote.next().text();
      // Adding the new vote to the vote count
      new_total = parseInt(oldTotal) + parseInt(data)
      // Setting the new vote count to display
      current_vote.next().text(new_total);
      // Removing both voting buttons so the current user cant vote again
      current_vote.removeClass('upVote');
      current_vote.next().next().removeClass('downVote');
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
      if(current_vote.parent().parent().parent().parent().parent().hasClass('lists') || current_vote.parent().parent().parent().hasClass('completeLists')) {
        emptyPage();
        refreshLists();
      }
      // Getting the old vote count
      oldTotal = current_vote.next().text();
      // Adding the new vote to the vote count
      new_total = parseInt(oldTotal) + Math.abs(parseInt(data));
      // Setting the new vote count to display
      current_vote.next().text(new_total);
      // Removing both voting buttons so the current user cant vote again
      current_vote.prev().prev().removeClass('upVote');
      current_vote.removeClass('downVote');
    });
  });

};