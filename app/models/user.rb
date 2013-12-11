class User < ActiveRecord::Base
  has_many :deeds
  has_many :posts
  has_many :favorites
  has_many :votes, as: :votable
  has_many :comments, as: :commentable

  def self.from_omniauth(auth)
    # slice method extracts one hash out of another, looking for the first entry that matches that provider and uid in the db, or creating a new entry in the db
    where(auth.slice(:provider, :uid)).first || create_from_omniauth(auth)
  end

  def self.create_from_omniauth(auth)
    # Creating a new user from the hash facebook provided
    create! do |user|
      user.provider = auth.provider
      user.uid = auth.uid
      user.name = auth.info.nickname
      user.oauth_token = auth.credentials.token
      user.oauth_expires_at = Time.at(auth.credentials.expires_at)
    end
  end
end
