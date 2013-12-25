class Post < ActiveRecord::Base
  attr_accessible :complete, :content, :deed_id, :picture, :thread_id, :title, :user_id, :lat, :lon

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

  ###################################
  ##### Method to update a post #####
  ###################################

  def self.update_post(params)
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

  #####################################
  ##### Method to update facebook #####
  #####################################

  def self.post_to_fb(post, current_user)
    p ('* ') * 50
    p 'did it'

    # Posts to facebook the current users good deed
    # api = Koala::Facebook::API.new(current_user.oauth_token)
    # # Need to change the link for production
    # api.put_wall_post("Just completed the deed: #{post.title}\n#{post.content}!", {
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
end
