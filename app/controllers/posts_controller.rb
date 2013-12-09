class PostsController < ApplicationController
  def get_current
    # If there is a current user, then fetch the post the current user is on
    if current_user
      @current_post = current_user.posts.where(complete: false)
    end


    render json: @current_post
  end
end