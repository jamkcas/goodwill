GoodwillTracker::Application.routes.draw do

  match 'auth/:provider/callback', to: 'sessions#create'
  match 'auth/failure', to: redirect('/')
  match 'signout', to: 'sessions#destroy', as: 'signout'

  root to: 'goodwill#index'
  resources :goodwill, only: :index
end
