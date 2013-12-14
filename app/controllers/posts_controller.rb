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
      post = start_post
    end

    # Pass back the newly created post hash
    render json: post
  end

  def invite_friend
    # Call method to send out the invitation
    send_invite
    render text: 'ok'
  end

  def finish_post
    if current_user
      # Updating the post if there is a current user
      update_post
    end

    render text: 'ok'
  end

  def join_thread
    # Setting a queue with a thread id from the link
    setQueue

    redirect_to root_path
  end
end