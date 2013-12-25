module PostsHelper
  def fetch_recent
    posts = Post.all
    # Adding the poster's name to each post
    all_posts = new_posts(posts)
    sorted = (all_posts.sort_by { |post| post[:updated_at] }).reverse
  end

  def start_post
    # In the case where a person decides to change threads, their old post is deleted
    current = current_user.posts.where(complete: false)[0]
    current.delete if current
    # Searches for the deed the user selected
    deed = Deed.find(params[:data_id])
    if(session[:queue] == nil)
      # Creates a random id
      id = SecureRandom.urlsafe_base64(nil, false)
      # If, by chance that id already exists as a thread id, then a new id is selected
      until Post.find_all_by_thread_id(id).empty?
        id = SecureRandom.urlsafe_base64(nil, false)
      end
    else
      id = session[:queue]
    end
    # Creates a hash passing in the new thread id, lat and lon, and deed details
    post_params = {title: deed.title, content: deed.description, deed_id: deed.id, user_id: current_user.id, thread_id: id, lat: params[:lat], lon: params[:lon]}
    # Creates a new post with the created hash
    post = Post.create(post_params)
    # Clearing the queue
    session[:queue] = nil if post.save
    # If post isnt save a post status of false is returned
    post = 'false' if !post.save
    # Returns the post
    post
  end









  def set_queue
    # Setting a session variable to temporarily save the thread id, while user is directed through login process
    unless Post.find_all_by_thread_id(params[:id]).empty?
      session[:queue] = params[:id]
    end
  end

  def clear_queue
    session[:queue] = nil
  end
end