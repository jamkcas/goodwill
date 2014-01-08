class Deed < ActiveRecord::Base
  attr_accessible :category, :email, :phone, :url, :deadline, :description, :location, :picture, :title, :deed_type, :user_id

  belongs_to :user
  has_many :posts
  has_many :votes, as: :votable
  has_many :comments, as: :commentable
  has_many :favorites

  validates :category, presence: true
  validates :deed_type, presence: true
  validates :title, presence: true
  validates :description, presence: true
  validates :user_id, presence: true

  #################################
  ##### Method to fetch deeds #####
  #################################

  def self.fetch_deeds(current_user)
    # Getting all the deeds
    deeds = Deed.all()
    # Creating a new array to store new deeds hashes
    donations = []
    services = []
    locals = []

    new_deeds = [donations, services, locals]
    # Cycling through each deed entry to create a new hash to store the deed itself, along with the number of up and down votes, and the current user's vote status for each deed
    deeds.each do |d|
      # Starting new hash to store deed and vote details together
      new_deed = {}
      # Adding the deed details
      new_deed[:deed] = d
      # Adding location if the deed has a location
      new_deed[:loc] = d.location if d.location
      # Initializing the user's vote status to true if there is no current user to prevent voting options from being shown, otherwise setting vote status to false
      new_deed[:voted] = current_user ? false : true
      # Initializing vote counts
      up = 0
      down = 0
      # Cycling through each vote for this deed and updating the count totals, as well as updating the user's vote status if they have voted for this deed already
      d.votes.each do |v|
        if current_user
          new_deed[:voted] = v.user_id == current_user.id ? true : false
        end
        up += 1 if v.vote_type == 'up'
        down += 1 if v.vote_type == 'down'
      end
      # Setting the up and down vote totals for this deed
      new_deed[:up] = up
      new_deed[:down] = down
      # Setting the total score
      new_deed[:score] = up - down
      # Shoving the new deed into the proper category
      if d.category == 'suggested' && d.deed_type == 'donation'
        donations.push new_deed
      elsif d.category == 'suggested' && d.deed_type == 'service'
        services.push new_deed
      else
        locals.push new_deed
      end
    end

    # Returning the new_deeds hash
    new_deeds
  end

  ########################################
  ##### Method to fetch deed details #####
  ########################################

  def self.fetch_deed(params)
    # Finding the deed and attaching the user who submitted it
    deed = Deed.find(params[:id])
    deed[:submitted_by] = User.find(deed.user_id).name

    # Returning the deeds
    deed
  end

  #######################################
  ##### Method to save deed details #####
  #######################################

  def self.save_deed(params, current_user)
    deed = {}
    # Formatting the phone number if given
    phone = (params[:phone].scan(/\d+/)).join if params[:phone] != ''
    # Formatting the phone_number
    if phone
      if phone.length == 11
        phone_number = '(' + phone.slice(1,3) + ') ' + phone.slice(4,3) + '-' + phone.slice(7,4)
      else
        phone_number = '(' + phone.slice(0,3) + ') ' + phone.slice(3,3) + '-' + phone.slice(6,4)
      end
    end
    # Setting the category and deed type
    if params[:category] == 'local'
      category = 'local'
      deed_type = 'donation'
    elsif params[:category] == 'donation'
      category = 'suggested'
      deed_type = 'donation'
    else
      category = 'suggested'
      deed_type = 'service'
    end
    # Creating a deed hash tp be saved
    deed[:title] = params[:title]
    deed[:description] = params[:description]
    deed[:phone] = phone_number if phone_number
    deed[:email] = params[:email] if params[:email] != ''
    deed[:picture] = params[:picture]
    deed[:url] = params[:url] if params[:url] != ''
    deed[:user_id] = current_user.id
    deed[:location] = params[:location] if params[:location] != ''
    deed[:category] = category
    deed[:deed_type] = deed_type
    # Creating the deed
    Deed.create(deed)
    # Returning the deed
    deed
  end
end
