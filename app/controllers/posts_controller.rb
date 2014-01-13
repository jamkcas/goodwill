class PostsController < ApplicationController
  include PostsHelper

  def get_recent
    # Getting the most recent posts that were completed
    posts = Post.fetch_recent

    render json: posts
  end

  def get_current
    # If there is a current user, then fetch the post the current user is on
    if current_user
      current = Post.query_current(current_user, params[:type])
    end
    if params[:ajax]
      render json: current
    else
      render text: 'Access Forbidden'
    end
  end

  def create
    # If there is a current_user, a new post is created using the params given
    if current_user
      post = Post.start_post(params, session, current_user)
    end

    # Pass back the newly created post hash
    render json: post
  end

  def invite_friend
    # Call method to send out the invitation
    Post.send_invite(params, current_user)
    # Need to figure out error message handling for action mailer
    render text: 'ok'
  end

  def finish_post
    if current_user
      # Updating the post if there is a current user
      post = Post.update_post(params)
      # Post to facebook unless updateType is 'invite'
      Post.post_to_fb(post, current_user) if post.complete == true && post.anon == false && params[:updateType] == 'complete' || params[:updateType] == 'post'
    end

    render text: 'ok'
  end

  def join_thread
    # Setting a queue with a thread id from the link
    set_queue

    redirect_to root_path
  end

  def reset_queue
    clear_queue
    render text: 'ok'
  end

  def get_threads
    # Getting all the thread ids and their completion dates associated with this user
    threads = Post.fetch_threads(current_user) if current_user

    if params[:ajax]
      render json: threads
    else
      render text: 'Access Forbidden'
    end
  end

  def get_thread_posts
    # Getting all the posts associated with the thread_id
    thread_posts = Post.fetch_thread_posts(params) if params[:thread_id] && current_user

    if params[:ajax]
      render json: thread_posts
    else
      render text: 'Access Forbidden'
    end
  end
end