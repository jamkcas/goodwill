class ContactsController < ApplicationController
  def google
    if current_user
      # Do the initial authorization if it hasnt been done before
      if current_user.google_token == nil
        # A request is made to google via Typhoeus in order to get an authorization code
        request = Typhoeus::Request.new(
          'https://accounts.google.com/o/oauth2/auth',
          method: :get,
          params: {
                    response_type: 'code', # The type of response google gives back. Needs to be 'code' for web apps.
                    client_id: CONFIG[:google_client_id], # Id given to my app by google
                    redirect_uri: 'http://localhost:3000/contacts/auth_approve', # When the response is received this is where the user is redirected
                    access_type: 'offline', # By setting to offline, this will allow app to make requests to get updates to google contacts while user is offline
                    scope: 'https://www.google.com/m8/feeds', # Asking for access to google contacts
                    approval_prompt: 'auto' # When set to auto they only have to give permission once
                  },
          headers: { Accept: "json" }
        )

        # Running the request
        request.run
        # Capturing the body of the response given
        url = request.response.effective_url
        # Creating a new hash to send back with the url to redirect users to for giving permission
        response = {}
        # Return the url given by the response (directs to page asking user for permissions. When they accept they are redirected to the auth_approve method)
        response[:url] = url
      else
        response = { url: 'null' }
      end

      render json: response
    end
  end

  def auth_approve
    # Capturing the code given from the google method
    code = params[:code]
    # Making a request with the authorization_code to google to get the access token
    request = Typhoeus::Request.new(
      'https://accounts.google.com/o/oauth2/token',
      method: :post,
      body: {
                code: code,
                client_id: CONFIG[:google_client_id],
                client_secret: CONFIG[:google_client_secret], # Secret that google provided for the app
                redirect_uri: 'http://localhost:3000/contacts/auth_approve', # redirecting the app back to this method after the call is made
                grant_type: 'authorization_code'
              },
      headers: { Accept: "json" }
    )

    request.run
    # Parsing the message given to JSON
    response = JSON(request.response.body)
    # Capturing the access token provided in the response
    google = response['access_token']
    # Saving the current users access token to their account so they dont have to repeat this call again
    current_user.update_attributes(google_token: google)

    # Rendering the auth_approve page instead of the normal application page, so it will self close
    render 'auth_approve', :layout => false
  end
end