class SessionsController < ApplicationController
  # Creating a new User Session from the info provided from facebook
  def create
    # Use this to see what is being returned from facebook
    # raise env['omniauth.auth'].to_json

    # Need to find a user that matches omniauth.auth credentials or create one (from_omniauth is a method defined in the User model)
    user = User.from_omniauth(env['omniauth.auth'])
    # Creates a new session with the user id
    session[:user_id] = user.id
    # Redirect it back to the index page
    redirect_to root_url
  end

  # Ending a session
  def destroy
    # Destroying a session by setting the session id to nil
    session[:user_id] = nil
    # Clearing the queue
    session[:queue] = nil
    # Redirect it back to the index page
    redirect_to root_url
  end
end