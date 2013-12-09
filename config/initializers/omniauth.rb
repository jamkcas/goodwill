OmniAuth.config.logger = Rails.logger

Rails.application.config.middleware.use OmniAuth::Builder do
  provider :facebook, CONFIG[:facebook_app_id], CONFIG[:facebook_secret], :display => 'popup'
end