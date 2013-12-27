class DeedsController < ApplicationController

  def index
    # Fetches all the deeds from the db
    deeds = Deed.fetch_deeds(current_user)

    render json: deeds
  end

  def show
    deed = Deed.fetch_deed(params)
    if params[:ajax]
      render json: deed
    else
      render text: 'Access Forbidden'
    end
  end
end