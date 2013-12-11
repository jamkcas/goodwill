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
    # Pass back the current_post hash
    render json: @current_post
  end

  def create
    # If there is a current_user, a new post is created using the params given
    if current_user
      @post = Post.create(params[:post])
    end
    # Pass back the newly created post hash
    render json: @post
  end

  def get_friends
    # If there is a current user, a call is made to the graph.facebook.com api to get the friends list
    if current_user
      api = Koala::Facebook::API.new(current_user.oauth_token)
      @friends = api.get_connections("me", "friends?fields=id,name,picture.height(100).width(100)")
    end
    # Pass back the friends hash
    render json: @friends
  end

  def invite_friends
    api = Koala::Facebook::API.new(current_user.oauth_token)
    api.put_object("747771671", "apprequests", {:message=>'Welcome to my app'})
    render text: 'Ok'
  end
end