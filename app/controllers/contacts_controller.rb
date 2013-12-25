class ContactsController < ApplicationController
  def google
    if current_user
      # Do the initial authorization if it hasnt been done before
      if current_user.google_token == nil
        # Getting the Url for permissions page
        url = Contact.get_auth

        # Creating a new hash to send back with the url to redirect users to for giving permission. Return the url given by the response (directs to page asking user for permissions. When they accept they are redirected to the auth_approve method)
        response = { url: url }
      else
        response = { url: 'null' }
      end

      render json: response
    end
  end

  def auth_approve
    # Capturing the code given from the google method
    code = params[:code]

    # Passing the code into the approve_auth method to get access token
    response = Contact.approve_auth(code)

    # Capturing the access token provided in the response
    google = response['access_token']
    # Saving the current users access token to their account so they dont have to repeat this call again
    current_user.update_attributes(google_token: google)

    # Rendering the auth_approve page instead of the normal application page, so it will self close
    redirect_to contacts_save_contacts_path
  end

  def save_contacts
    # Getting the current user's access token for google
    access = current_user.google_token

    # Getting contacts from google using the current user's google access token
    contacts = Contact.fetch_contacts(access)

    # Parsing the response from google with Nokogiri
    noko = Contact.to_noko(contacts)

    # Taking the Nokogiri object and turning into a json response
    response = Contact.noko_parse(noko)

    # Saving the contacts to the db
    Contact.save_contact_list(response, current_user)

    # render text: 'Contacts saved.'
    render 'save_contacts', :layout => false
  end

  def get_contacts
    # Fetching the user's contacts
    contacts = current_user.contacts

    render json: contacts
  end
end