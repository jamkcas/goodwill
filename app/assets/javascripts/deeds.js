var addDeedToList = function(data, list) {
  // Creating a new list item by creating a data object and passing it into the deed_entry jst template
  var template = JST['templates/deed_entry']({data: data});
  // Appending the template to the appropriate item
  $(list).append(template);
};

// Populating the lists for te index page
var pageLists = function(data) {
  // Populating each list with the deed list returned from the db
  _.each(data, function(d) {
    // if the deed category is a deed then it populates the suggested lists
    if(d.deed.category === 'suggested') {
      // if the deed type is a donation then it populates the donations list
      if(d.deed_type === 'donation') {
        addDeedToList(d, '#suggestedDonations');
      } else { // if the deed type is a service then it populates the services list
        addDeedToList(d, '#suggestedServices');
      }
    } else { // if the deed category is help it populates the local lists
      if(d.deed_type === 'local') {
        // if the deed type is a donation then it populates the donations list
        addDeedToList(d, '#localDonations');
      } else { // if the deed type is a service then it populates the services list
        addDeedToList(d, '#localServices');
      }
    }
  });
};

// Populating the lists for new post modal
var modalLists = function(data) {
  // Populating each list with the deed list returned from the db
  _.each(data, function(d) {
    // if the deed category is a deed then it populates the suggested lists
    if(d.deed.category === 'suggested') {
      // if the deed type is a donation then it populates the donations list
      if(d.deed_type === 'donation') {
        addDeedToList(d, '.suggestedDonationsModal');
      } else { // if the deed type is a service then it populates the services list
        addDeedToList(d, '.suggestedServicesModal');
      }
    } else { // if the deed category is help it populates the local lists
      if(d.deed_type === 'local') {
        // if the deed type is a donation then it populates the donations list
        addDeedToList(d, '.localDonationsModal');
      } else { // if the deed type is a service then it populates the services list
        addDeedToList(d, '.localServicesModal');
      }
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
  _.each(sorted.slice(0, 5), function(d) {
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
  var template = JST['templates/featured_entry']({data: max});
  $('#featuredLocal').append(template);
};

// Fetching all the deeds and using the passed in the proper list populating function
var populatePage = function(list) {
  // Getting all the deeds from the db
  $.get('/deeds').done(function(data) {
    list(data);
  });
};

// Clearing the lists (this is for when the votes are made in the modal view, to refresh the index page vote counts)
var emptyPage = function() {
  $('#suggestedDonations').empty();
  $('#suggestedServices').empty();
  $('#localDonations').empty();
  $('#localServices').empty();
}

