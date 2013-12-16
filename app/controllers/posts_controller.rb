class PostsController < ApplicationController
  include PostsHelper

  def get_current
    # If there is a current user, then fetch the post the current user is on
    if current_user
      current = query_current
    end
    # Pass back the current_post hash
    render json: current
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
    # Need to figure out error message handling for action mailer
    render text: 'ok'
  end

  def finish_post
    if current_user
      # Updating the post if there is a current user
      post = update_post
      # Post to facebook unless updateType is 'invite'
      post_to_fb(post) if post.complete == true && params[:updateType] == 'complete' || params[:updateType] == 'post'
    end

    render text: 'ok'
  end

  def join_thread
    # Setting a queue with a thread id from the link
    set_queue

    redirect_to root_path
  end

  def populate_map
    # Getting all the locations with the current thread id
    locations = get_locations if current_user

    # Returning the locations
    render json: locations
  end

  def reset_queue
    clear_queue
    render text: 'ok'
  end
end