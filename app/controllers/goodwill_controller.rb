class GoodwillController < ApplicationController
  include GoodwillHelper
  def index
    # Checking to see if a Session queue exists and setting the status as a javascript variable
    checkQueue

    # Checking to see if user exists and setting status as a Gon variable for javascript
    checkUser

    respond_to do |format|
      format.html
      format.json
    end
  end
end
