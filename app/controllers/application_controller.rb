class ApplicationController < ActionController::Base
  protect_from_forgery

private
  # Method to set the current user
  def current_user
    # if session id exists then set it to current user
    @current_user ||= User.find(session[:user_id]) if session[:user_id]
  end
  # current user is set as a helper method so it can be accessed in the view
  helper_method :current_user
end
