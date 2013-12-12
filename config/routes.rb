GoodwillTracker::Application.routes.draw do
  # When the callback from facebook(or other provider) is received it is sent to session create controller
  get "/contacts/google", to: "contacts#google"
  match '/contacts/auth_approve', to: 'contacts#auth_approve'
  match '/contacts/get_contacts', to: 'contacts#get_contacts'
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
  post '/posts/invite', to: 'posts#invite_friends'
end
