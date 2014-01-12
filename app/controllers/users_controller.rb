class UsersController < ApplicationController
  # Function to update user's home location
  def update_loc
    location = params[:location]

    User.find(current_user.id).update_attributes(location: location) if current_user

    render text: 'ok'
  end

  # Function to update user's new_user status
  def update_status
    User.find(current_user.id).update_attributes(new_user: false) if current_user && params[:ajax]

    render text: 'ok'
  end
end