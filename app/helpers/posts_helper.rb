module PostsHelper
  def query_current
    # Starting a new hash to return
    current = {}
    # Find the current post id
    current_post = current_user.posts.where(complete: false)[0]
    if current_post
      # Find the deed associated with current post
      deed = Deed.find(current_post.deed_id)

      # Passing in current posts id to the hash, and the details of the associated deed
      current[:id] = current_post.id
      current[:details] = deed
    else
      current[:id] = 'null'
    end

    # Return the current_post
    current
  end

  def start_post
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
    # Creates a hash passing in the new thread id and deed details
    post_params = {title: deed.title, content: deed.description, deed_id: deed.id, user_id: current_user.id, thread_id: id}
    # Clearing the queue
    session[:queue] = nil
    # Creates a new post with the created hash
    post = Post.create(post_params)

  end

  def update_post
    id = params[:id]
    # Getting the new title and content if given
    content = params[:details] unless params[:details] == ''
    title = params[:title] unless params[:title] == ''

    # Fetching the post to update
    post = Post.find(id)
    # Updating the content only if title and content were given
    post.update_attributes(title: title) if title
    post.update_attributes(content: content) if content
    # Updating the user's location
    post.update_attributes(lat: params[:lat])
    post.update_attributes(lon: params[:lon])
    # Updating the post's complete status to true
    post.update_attributes(complete: true)

    if post.complete == true
      api = Koala::Facebook::API.new(current_user.oauth_token)
      api.put_wall_post("Just completed the deed: #{post.title}\n#{post.content}!", {
        "name" => "Goodwill Tracking",
       "link"=> "http://www.jamkcas.com",
       "caption"=> "Keep the kindness going!",
       "description"=> "Join my thread on Goodwill Tracking and commit to doing a good deed today!",
       "picture"=> "http://www.example.com/thumbnail.jpg"}, "me")
    end
  end

  def send_invite
    friend = Contact.find(params[:friend])
    thread = Post.find(params[:thread]).thread_id

    # Send email passing in the user's current thread and the contact's email
    invite = InviteMailer.invite(friend, thread).deliver
  end

  def setQueue

    unless Post.find_all_by_thread_id(params[:id]).empty?
      session[:queue] = params[:id]
    end
  end
end