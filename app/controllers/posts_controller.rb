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

  def populate_map
    thread = Post.find(params[:post_id]).thread_id
    posts = Post.find_all_by_thread_id(thread)
    new_posts = []
    posts.each do |p|
      new_hash = {
        name: p.user.name,
        title: p.title,
        content: p.content,
        lat: p.lat,
        lon: p.lon,
        thread_id: p.thread_id,
        deed_id: p.deed_id,
        complete: p.complete,
        id: p.id,
        created_at: p.created_at,
        updated_at: p.updated_at
      }
      new_posts << new_hash
    end
    # binding.pry

    p ('*') * 50
    p new_posts
    render json: new_posts
  end

end