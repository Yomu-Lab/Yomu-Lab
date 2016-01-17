Rails.application.routes.draw do
  
  resources :home, only: :index do
    collection do
      get :tell_your_friends, as: :tell_your_friends
    end
  end

  devise_for :users, controllers: {
    sessions: 'users/sessions', :omniauth_callbacks => "callbacks", :passwords =>"users/passwords",
    :confirmations => "users/confirmations"
  }

  #patch '/users/confirmation' => 'users/confirmations#update', :via => :patch, :as => :update_user_confirmation

  match '/users/:id/finish_signup' => 'users#finish_signup', via: [:get, :patch], :as => :finish_signup

  resources :home
  match '/Index'   => "home#index",     via: [:get]
  match '/Login'   => "home#login",     via: [:get]
  match '/SignUp'  => "home#sign_up",   via: [:get]
  
  get 'home/user_details/:authentication_token' => 'home#user_details'
  get 'home/current_user_details/:authentication_token' => 'home#current_user_details'
  post 'home/register' => 'home#register'
  match '/ReconfirmUser' => 'home#reconfirm_user', via: [:get]
  get 'home/current_user_referral_count/:authentication_token' => 'home#current_user_referral_count'

  resources :default
  # match '/ForgotPassword' => 'default#forgot_password', via: [:get]
  match '/ResetPassword' => 'default#reset_password', via: [:get]
  get 'default/get_user_details_by_reset_password_token/:token' => 'default#get_user_details_by_reset_password_token'
  get 'default/get_user_details_by_authentication_token/:token' => 'default#get_user_details_by_authentication_token'

  root 'home#index'

  # The priority is based upon order of creation: first created -> highest priority.
  # See how all your routes lay out with "rake routes".

  # You can have the root of your site routed with "root"
  # root 'welcome#index'

  # Example of regular route:
  #   get 'products/:id' => 'catalog#view'

  # Example of named route that can be invoked with purchase_url(id: product.id)
  #   get 'products/:id/purchase' => 'catalog#purchase', as: :purchase

  # Example resource route (maps HTTP verbs to controller actions automatically):
  #   resources :products

  # Example resource route with options:
  #   resources :products do
  #     member do
  #       get 'short'
  #       post 'toggle'
  #     end
  #
  #     collection do
  #       get 'sold'
  #     end
  #   end

  # Example resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Example resource route with more complex sub-resources:
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', on: :collection
  #     end
  #   end

  # Example resource route with concerns:
  #   concern :toggleable do
  #     post 'toggle'
  #   end
  #   resources :posts, concerns: :toggleable
  #   resources :photos, concerns: :toggleable

  # Example resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end
end
