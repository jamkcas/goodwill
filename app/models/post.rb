class Post < ActiveRecord::Base
  attr_accessible :complete, :content, :deed_id, :picture, :thread_id, :title, :user_id, :lat, :lon, :anon

  belongs_to :user
  belongs_to :deed
  has_many :comments, as: :commentable
  has_many :votes, as: :votable

  validates :content, presence: true
  validates :deed_id, presence: true
  validates :user_id, presence: true
  validates :title, presence: true
  validates :thread_id, presence: true


  ######################################
  ##### Method to get current post #####
  ######################################

  def self.query_current(current_user, type)
    # Starting a new hash to return
    current = {}
    # Find the current post id
    current_post = current_user.posts.where(complete: false)[0]
    # If a current post exists, its info and associated posts are passed back. Otherwise a null value is passed back
    if current_post
      # Find the deed associated with current post
      deed = Deed.find(current_post.deed_id)
      # Passing in current posts id to the hash, and the details of the associated deed
      current[:id] = current_post.id
      current[:details] = deed

      # Finding all the posts (and their locations) that belong to the current deed's thread
      current[:posts] = get_locations(current_post.thread_id) if type == 'map'
    else
      current[:id] = 'null'
    end
    # Return the current_post
    current
  end

  ##################################################################
  ##### Method to get locations associated with current thread #####
  ##################################################################

  def self.get_locations(thread)
    # Finds all the posts with current post thread id
    posts = Post.find_all_by_thread_id(thread)
    # Adding the poster's name to each post
    locations = new_posts(posts)
  end

  ###################################################################################
  ##### Method to get all the info for each post associated with current thread #####
  ###################################################################################

  def self.new_posts(posts)
    # Creating a new array of post hashes adding the the poster's name to each hash
    new_posts = []
    posts.each do |p|
      # Checking to see if poster posted as anonymous and setting the name and image accordingly
      if p.anon
        pic = '/anon.png'
        name = 'Anonymous'
      else
        pic = p.user.profile_pic
        name = p.user.name
      end
      new_hash = {
        name: name,
        pic: pic,
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

  ###################################
  ##### Method to update a post #####
  ###################################

  def self.update_post(params)
    id = params[:id]
    # Getting the new title and content if given
    content = params[:details] unless params[:details] == ''
    title = params[:title] unless params[:title] == ''
    anon = params[:anon]

    # Fetching the post to update
    post = Post.find(id)
    # Updating the content only if title and content were given
    post.update_attributes(title: title) if title
    post.update_attributes(content: content) if content
    # Updating user anonymous status if needed
    post.update_attributes(anon: anon) if anon
    # Updating the user's location
    post.update_attributes(lat: params[:lat]) if params[:lat]
    post.update_attributes(lon: params[:lon]) if params[:lon]
    # Updating the post's complete status to true
    post.update_attributes(complete: true) unless params[:updateType] == 'post'

    post
  end

  #####################################
  ##### Method to update facebook #####
  #####################################

  def self.post_to_fb(post, current_user)
    p ('* ') * 50
    p 'did it'

    # Posts to facebook the current users good deed
    # api = Koala::Facebook::API.new(current_user.oauth_token)
    # # Need to change the link for production
    # api.put_wall_post("Just completed the good deed: #{post.title}\n#{post.content}!", {
    #   "name" => "Goodwill Tracking",
    #  "link"=> "http://goodwill-tracker.herokuapp.com",
    #  "caption"=> "Keep the kindness going!",
    #  "description"=> "Visit Goodwill Tracking and commit to doing a good deed today!"}, "me")
  end

  #################################
  ##### Method to send invite #####
  #################################

  def self.send_invite(params)
    thread = Post.find(params[:thread]).thread_id

    if params[:email] == 'null'
      friend = Contact.find(params[:friend]).email
    else
      friend = params[:email]
    end

    # Send email passing in the user's current thread and the contact's email
    invite = InviteMailer.invite(friend, thread).deliver
  end

  ###################################
  ##### Method to create a post #####
  ###################################

  def self.start_post(params, session, current_user)
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


  def self.fetch_recent
    # Finding all the completed posts
    posts = Post.where(complete: true)
    # Adding the poster's name to each post
    all_posts = new_posts(posts)
    # Returning the posts sorted by time completed
    sorted = (all_posts.sort_by { |post| post[:updated_at] }).reverse
  end
end
