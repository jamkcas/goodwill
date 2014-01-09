require 'open-uri'

class Contact < ActiveRecord::Base
  attr_accessible :email, :name, :user_id

  belongs_to :User

  validates :email, presence: true
  validates :name, presence: true
  validates :user_id, presence: true


  ############################################
  ##### Method to get google permissions #####
  ############################################

  def self.get_auth
    # A request is made to google via Typhoeus in order to get an authorization code
    request = Typhoeus::Request.new(
      'https://accounts.google.com/o/oauth2/auth',
      method: :get,
      params: {
                response_type: 'code', # The type of response google gives back. Needs to be 'code' for web apps.
                client_id: ENV['GOOGLE_CLIENT_ID'], # Id given to my app by google
                redirect_uri: 'http://goodwill-tracker.herokuapp.com/contacts/auth_approve', # When the response is received this is where the user is redirected
                scope: 'https://www.google.com/m8/feeds', # Asking for access to google contacts
                approval_prompt: 'auto' # When set to auto they only have to give permission once
              },
      headers: { Accept: "json" }
    )

    # Running the request
    request.run
    # Capturing the body of the response given
    url = request.response.effective_url
  end

  #############################################
  ##### Method to save google permissions #####
  #############################################

  def self.approve_auth(code)
    # Making a request with the authorization_code to google to get the access token
    request = Typhoeus::Request.new(
      'https://accounts.google.com/o/oauth2/token',
      method: :post,
      body: {
                code: code,
                client_id: ENV['GOOGLE_CLIENT_ID'],
                client_secret: ENV['GOOGLE_CLIENT_SECRET'], # Secret that google provided for the app
                redirect_uri: 'http://goodwill-tracker.herokuapp.com/contacts/auth_approve', # redirecting the app back to this method after the call is made
                grant_type: 'authorization_code'
              },
      headers: { Accept: "json" }
    )

    request.run
    # Parsing the message given to JSON
    response = JSON(request.response.body)
  end

  ############################################
  ##### Method to import google contacts #####
  ############################################

  def self.fetch_contacts(access)
    # Fetching the user's contacts from google
    request = Typhoeus::Request.new(
      "https://www.google.com/m8/feeds/contacts/default/full?access_token=#{access}",
      method: :get
    )

    request.run
    response = request.response.body
  end

  ###############################################
  ##### Method to parse google xml response #####
  ###############################################

  def self.to_noko(contact_list)
    # Taking google response and parsing it with Nokogiri
    request = Nokogiri::XML(contact_list)
    request.remove_namespaces!
  end

  ##################################################
  ##### Method to parse the nokogiri's parsing #####
  ##################################################

  def self.noko_parse(noko_list)
    # Creating an array to store the each new formatted contact hash
    all_contacts = []
    # Getting the length of the list to be extracted
    list_length = noko_list.xpath('//entry').length

    index = 0
    # Going through the list and extracting the name and email of each contact and saving it as a new contact hash
    while index < list_length
      contact = {}
      contact[:name] = noko_list.xpath('//entry//title')[index].text
      contact[:email] = noko_list.xpath('//@address')[index].text
      # Pushing each newly created contact into the all_contact array
      all_contacts << contact
      index += 1
    end

    all_contacts
  end

  ###########################################
  ##### Method to save a google contact #####
  ###########################################

  def self.save_contact_list(contacts, current_user)
    # Saving each of the user's contacts to the db
    contacts.each do |c|
      Contact.create(name: c[:name], email: c[:email], user_id: current_user.id)
    end
  end

end
