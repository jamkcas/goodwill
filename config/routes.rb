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
  resources :deeds, only: [:index, :show]

  # Posts controller routes
  get '/posts/current', to: 'posts#get_current'
  get '/posts/invite', to: 'posts#invite_friend'
  get '/posts/join_thread/:id', to: 'posts#join_thread'
  put '/posts/finish_post/:id', to: 'posts#finish_post'
  post '/posts/create', to: 'posts#create'
  get '/posts/populate_map', to: 'posts#populate_map'
  get '/posts/reset', to: 'posts#reset_queue'
  get '/posts/recent', to: 'posts#get_recent'

  # Votes controller routes
  post '/votes/save_vote', to: 'votes#save_vote'
end
