class UsersController < ApplicationController
  def update_loc
    location = params[:location]

    User.find(current_user.id).update_attributes(location: location) if current_user

    render text: 'ok'
  end
end