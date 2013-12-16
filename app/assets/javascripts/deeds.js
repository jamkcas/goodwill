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

// Fetching all the deeds and using the passed in the proper list populating function
var populatePage = function(list) {
  // Getting all the deeds from the db
  $.get('/deeds').done(function(data) {
    list(data);
  });
};

var emptyPage = function() {
  $('#suggestedDonations').empty();
  $('#suggestedServices').empty();
  $('#localDonations').empty();
  $('#localServices').empty();
}

