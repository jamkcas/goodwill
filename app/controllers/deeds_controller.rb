class DeedsController < ApplicationController
  include DeedsHelper

  def index
    # Fetches all the deeds from the db
    deeds = fetch_deeds

    render json: deeds
  end

  def show
    deed = Deed.find(params[:id])
    render json: deed
  end
end