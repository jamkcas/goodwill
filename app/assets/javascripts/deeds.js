var addDeedToList = function(data, id) {
  // Creating a new list item by creating a data object and passing it into the deed_entry jst template
  template = JST['templates/deed_entry']({data: data});
  // Appending the template to the appropriate item
  $(id).append(template);
};

var populatePage = function() {
  // Getting all the deeds from the db
  $.get('/deeds').done(function(data) {

    // Populating each list with the deed list returned from the db
    _.each(data, function(d) {
      // if the deed category is a deed then it populates the suggested lists
      if(d.category === 'suggested') {
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
  });
};