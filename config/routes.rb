GoodwillTracker::Application.routes.draw do
  # When the callback from facebook(or other provider) is received it is sent to session create controller
  match 'auth/:provider/callback', to: 'sessions#create'
  # Triggered when authentication fails, redirects to index path
  match 'auth/failure', to: redirect('/')
  # Triggered when ending a user session
  match 'signout', to: 'sessions#destroy', as: 'signout'

  root to: 'goodwill#index'
  resources :goodwill, only: :index
  resources :deeds, only: :index
  get '/posts/current', to: 'posts#get_current'
  get '/posts/friends', to: 'posts#get_friends'
end
