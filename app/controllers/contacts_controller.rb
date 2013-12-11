class ContactsController < ApplicationController
  def google
    request = Typhoeus::Request.new(
      'https://accounts.google.com/o/oauth2/auth',
      method: :get,
      params: {
                response_type: 'code',
                client_id: CONFIG[:google_client_id],
                redirect_uri: 'http://localhost:3000/contacts/auth_approve',
                access_type: 'offline',
                scope: 'https://www.google.com/m8/feeds',
                approval_prompt: 'auto'
              },
      headers: { Accept: "json" }
    )

    request.run
    response = request.response

    redirect_to response.effective_url
  end

  def auth_approve
    code = params[:code]
    request = Typhoeus::Request.new(
      'https://accounts.google.com/o/oauth2/token',
      method: :post,
      body: {
                code: code,
                client_id: CONFIG[:google_client_id],
                client_secret: 'LTYnAlpPcAj8TkViqQLT9TLA',
                redirect_uri: 'http://localhost:3000/contacts/auth_approve',
                grant_type: 'authorization_code'
              },
      headers: { Accept: "json" }
    )

    request.run
    response = JSON(request.response.body)
     ('*') * 50
    p response
    google = response['access_token']

    p ('*') * 50
    p google
    current_user.update_attributes(google_token: google)


    render json: response
  end
end