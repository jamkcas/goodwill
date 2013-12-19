module PostsHelper
  def fetch_recent
    posts = Post.all
    # Adding the poster's name to each post
    all_posts = new_posts(posts)
    sorted = (all_posts.sort_by { |post| post[:updated_at] }).reverse
  end

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
    post.update_attributes(lat: params[:lat]) if params[:lat]
    post.update_attributes(lon: params[:lon]) if params[:lon]
    # Updating the post's complete status to true
    post.update_attributes(complete: true) unless params[:updateType] == 'post'

    post
  end

  def post_to_fb(post)
    # Posts to facebook the current users good deed
    # api = Koala::Facebook::API.new(current_user.oauth_token)
    # # Need to change the link for production
    # api.put_wall_post("Just completed the deed: #{post.title}\n#{post.content}!", {
    #   "name" => "Goodwill Tracking",
    #  "link"=> "http://goodwill-tracker.herokuapp.com",
    #  "caption"=> "Keep the kindness going!",
    #  "description"=> "Join my thread on Goodwill Tracking and commit to doing a good deed today!",
    #  "picture"=> "http://www.example.com/thumbnail.jpg"}, "me")
  end

  def new_posts(posts)
    # Creating a new array of post hashes adding the the poster's name to each hash
    new_posts = []
    posts.each do |p|
      new_hash = {
        name: p.user.name,
        pic: p.user.profile_pic,
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
    # Returns the new posts hash
    new_posts
  end

  def get_locations
    # Finds the current post thread id with the post id
    thread = Post.find(params[:post_id]).thread_id
    # Finds all the posts with current post thread id
    posts = Post.find_all_by_thread_id(thread)
    # Adding the poster's name to each post
    locations = new_posts(posts)
  end

  def send_invite
    thread = Post.find(params[:thread]).thread_id

    if params[:email] == 'null'
      friend = Contact.find(params[:friend]).email
    else
      friend = params[:email]
    end

    # Send email passing in the user's current thread and the contact's email
    invite = InviteMailer.invite(friend, thread).deliver
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