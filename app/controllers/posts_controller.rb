class PostsController < ApplicationController
  def get_current
    # If there is a current user, then fetch the post the current user is on
    if current_user
      # Find the current post id
      current_post = current_user.posts.where(complete: false)[0].id
      # Find the deed associated with current post
      deed = Deed.find(current_post)
      # Starting a new hash to return
      @current_post = {}
      # Passing in current posts id to the hash, and the details of the associated deed
      @current_post[:id] = current_post
      @current_post[:details] = deed
    end

    render json: @current_post
  end

  def create
    if current_user
      @post = Post.create(params[:post])
    end

    render json: @post
  end
end