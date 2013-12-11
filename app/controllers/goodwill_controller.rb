class GoodwillController < ApplicationController
  def index

    respond_to do |format|
      format.html
      format.json
    end
  end

  def google
    # {
    #   url: 'https://accounts.google.com/o/oauth2/auth',
    #   method: 'GET',
    #   crossDomain: true,
    #   data:{
    #   response_type: 'code',
    #   client_id: '546926713931.apps.googleusercontent.com',
    #   redirect_uri: 'https://localhost:3000/oauth2callback',
    #   access_type: 'offline',
    #   scope: 'https://www.google.com/m8/feeds',
    #   approval_prompt: 'auto'
    # }
  request = Typhoeus::Request.new(
    'https://accounts.google.com/o/oauth2/auth',
    method: :get,
    params: {
      response_type: 'code',
      client_id: '546926713931-shin5qa5fuiqe2m8e74f3e0cf9asr9dc.apps.googleusercontent.com',
      redirect_uri: 'https://localhost:3000/oauth2callback',
      access_type: 'offline',
      scope: 'https://www.google.com/m8/feeds',
      approval_prompt: 'auto'
     },
     headers: {Accept: "json"}
  )

  request.run
  response = request.response
  puts response.inspect

  # redirect_to response.effective_url
  render json: response.body



  end
end
