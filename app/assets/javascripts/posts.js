
// Event for when a user wants to see the details of a particular deed
var assignShowDetails = function() {
  $('#overlayWindow').on('click', '.deedEntry', function(e) {
    e.preventDefault();
    var current = $(this);
    var id = current.parent().data('id');
    // Making a call to the db and getting the deed details
    $.get('/deeds/' + id).done(function(data) {
      // Hiding the lists of deeds div
      $('.lists').hide();
      $('.modalHeader').hide();
      // Creating and appending the deed details to the entry details div
      var template = JST['templates/deed_details']({ details: data });
      $('.entryDetails').append(template);
    });
  });
};




