class PostsController < ApplicationController
  include PostsHelper

  def get_current
    # If there is a current user, then fetch the post the current user is on
    if current_user
      @current = query_current
    end

    # Pass back the current_post hash
    render json: @current
  end

  def create
    # If there is a current_user, a new post is created using the params given
    if current_user
      start_post
    end
    # Pass back the newly created post hash
    render json: @post
  end

  def invite_friend
    # Call method to send out the invitation
    send_invite
    render text: 'Ok'
  end
end