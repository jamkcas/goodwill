GoodwillTracker::Application.routes.draw do

  # Contacts controller routes
  get "/contacts/google", to: "contacts#google"
  match '/contacts/auth_approve', to: 'contacts#auth_approve'
  match '/contacts/save_contacts', to: 'contacts#save_contacts'
  match '/contacts/get_contacts', to: 'contacts#get_contacts'

  # Login routes
  # When the callback from facebook(or other provider) is received it is sent to session create controller
  match 'auth/:provider/callback', to: 'sessions#create'
  # Triggered when authentication fails, redirects to index path
  match 'auth/failure', to: redirect('/')
  # Triggered when ending a user session
  match 'signout', to: 'sessions#destroy', as: 'signout'

  root to: 'goodwill#index'
  resources :goodwill, only: :index
  resources :deeds, only: :index

  # Posts controller routes
  get '/posts/current', to: 'posts#get_current'
  get '/posts/friends', to: 'posts#get_friends'
  get '/posts/invite', to: 'posts#invite_friend'
end
