class DeedsController < ApplicationController
  def index
    # Fetches all the deeds from the db
    @deeds = Deed.all()

    render json: @deeds
  end
end