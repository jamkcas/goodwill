var addDeedToList = function(data, list) {
  // Creating a new list item by creating a data object and passing it into the deed_entry jst template
  var template = JST['templates/deed_entry']({data: data});
  // Appending the template to the appropriate item
  $(list).append(template);
};

var fullList = function(data, type) {
  var suggested = _.where(data, {category: 'suggested'});
  var suggestedDonations = _.where(suggested, {type: 'donation'});
  var suggestedServices = _.where(suggested, {type: 'service'});
  var local = _.where(data, {category: 'local'});
  if(type === 'donation') {
    var list = suggestedDonations;
  } else if(type = 'service') {
    var list = suggestedServices;
  } else {
    var list = local;
  }
  var template = JST['templates/deeds_list']({list: list, type: type});
  $('#overlayWindow').append(template);
  showModal();
};

// Populating the lists for the index page
var pageLists = function(data) {
  var suggested = _.where(data, {category: 'suggested'});
  var suggestedDonations = _.where(suggested, {type: 'donation'});
  var suggestedServices = _.where(suggested, {type: 'service'});

  var local = _.where(data, {category: 'local'});
  // Populating each list with the deed list returned from the db
  // if the deed category is suggested then it populates the suggested lists

  // if the deed type is a donation then it populates the donations list
  _.each(suggestedDonations.slice(0, 4), function(d) {
    addDeedToList(d, '#suggestedDonations');
  });
  // assignMore(suggestedDonations, 'donation');

  // if there are more suggested donations a more button is added
  if(suggestedDonations.length > 4) {
    $('#suggestedDonations').append('<p class="more moreDonations">More...</p>');
  }

  // if the deed type is a service then it populates the services list
  _.each(suggestedServices.slice(0, 4), function(d) {
      addDeedToList(d, '#suggestedServices');
  });
  // if there are more suggested services a more button is added
  if(suggestedServices.length > 4) {
    $('#suggestedServices').append('<p class="more moreServices">More...</p>');
  }

  // if the deed category is local it populates the local lists
  _.each(local.slice(0, 4), function(d) {
    addDeedToList(d, '#localCauses');
  });
  // if there are more local causes a more button is added
  if(local.length > 4) {
    $('#localCauses').append('<p class="more moreLocal">More...</p>');
  }
};

// Populating the lists for new post modal
var modalLists = function(data) {
  // Populating each list with the deed list returned from the db
  _.each(data, function(d) {
    // if the deed category is a deed then it populates the suggested lists
    if(d.category === 'suggested') {
      // if the deed type is a donation then it populates the donations list
      if(d.type === 'donation') {
        addDeedToList(d, '.suggestedDonationsModal');
      } else { // if the deed type is a service then it populates the services list
        addDeedToList(d, '.suggestedServicesModal');
      }
    } else { // if the deed category is help it populates the local lists
      addDeedToList(d, '.localCausesModal');
    }
  });
};

// Sort votes function
var sortVotes = function(data) {
  var sort = _.sortBy(data, function(d) {
    return -d.score;
  });
  return sort;
};

// Categorizing function
var categorize = function(data, category) {
  // Creating a new array to store only the categry type deeds
  var sorted = [];
  // Cycle through each deed and add the category type ones to the featured array
  _.each(data, function(d) {
    if(d.deed.category === category) {
      sorted.push(d);
    }
  });
  return sorted;
  };

// Populating the featured deeds list
var featuredLists = function(data) {
  // Filtering out the suggested deeds
  var featured = categorize(data, 'suggested');
  // Sort the featured array by score
  var sorted = sortVotes(featured);
  // Displaying the top 6 scored deeds
  _.each(sorted.slice(0, 6), function(d) {
    var template = JST['templates/featured_entry']({data: d});
    $('#featuredDeeds').append(template);
  });
};

// Populating the featured local cause
var featuredLocal = function(data) {
  // Filtering out the local deeds
  var featured = categorize(data, 'local');
  // Getting the highest rated deed
  var max = _.max(featured, function(entry) {
    return entry.score;
  });
  // Displaying the highest rated deed
  var template = JST['templates/featured_cause']({data: max});
  $('#featuredLocal').append(template);
};

// Fetching all the deeds and using the passed in the proper list populating function
var populatePage = function(list, type) {
  // Getting all the deeds from the db
  $.get('/deeds').done(function(data) {
    // This is for adding a new deed
    // if(data[0].logged === 'in') {
    //   $('.addDeed').empty();
    //   var button = '<p class="newDeed button">+ DEED</p>'
    //   $('.addDeed').append(button)
    // }
    list(data, type);
  });
};

// Clearing the lists (this is for when the votes are made in the modal view, to refresh the index page vote counts)
var emptyPage = function() {
  $('#suggestedDonations').empty();
  $('#suggestedServices').empty();
  $('#localCauses').empty();
}

var assignDeedClicks = function() {
  $('.bottom').on('click', '.featuredEntry', function(){
    var current = $(this);
    var post_id = null
    var id = current.data('id');
    if($('#currentDeed').data('id')) {
      post_id = $('#currentDeed').data('id')
    }
    $.get('/deeds/' + id).done(function(data) {
      var template = JST['templates/details_page']({details: data, post_id: post_id});
      $('#overlayWindow').append(template);
      showModal();
    });
  });

  $('.bottom').on('click', '.deedEntry', function() {
    var current = $(this);
    var post_id = null
    var id = current.parent().data('id');
    if($('#currentDeed').data('id')) {
      post_id = $('#currentDeed').data('id')
    }
    $.get('/deeds/' + id).done(function(data) {
      var template = JST['templates/details_page']({details: data, post_id: post_id});
      $('#overlayWindow').append(template);
      showModal();
    });
  });

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

  $('.container').on('click', '.changeDeed', function() {
    var id = $(this).data('id');
    var template = JST['templates/new_post'];
    $('#overlayWindow').append(template);
    populatePage(modalLists);
    showModal();
  });

  $('#thread').on('click', '.showCurrent', function() {
    var id = $(this).data('id');
    $.get('/deeds/' + id).done(function(data) {
      var template = JST['templates/details_page']({details: data, post_id: null});
      $('#overlayWindow').append(template);
      showModal();
    });
  });
  $('.container').on('click', '.moreDonations', function(){
    populatePage(fullList, 'donation');
  });
  $('.container').on('click', '.moreServices', function(){
    populatePage(fullList, 'service');
  });
  $('.container').on('click', '.moreLocal', function(){
    populatePage(fullList, 'local');
  });
};


