Rails.application.routes.draw do
  get  "/login",  to: "sessions#new",     as: "login"
  post "/login",  to: "sessions#create"
  delete "/logout", to: "sessions#destroy", as: "logout"

  root "sessions#new" # Jadikan halaman login sebagai tampilan awal

  get "/dashboard", to: "dashboard#index", as: "dashboard"

  # Resource Products
  get "/produk", to: "products#table", as: "products_table"
  post "/produk", to: "products#store", as: "products_store"
  put "/produk/:id", to: "products#update", as: "products_update"
  delete "/produk/:id", to: "products#destroy", as: "products_destroy"

  get "/kasir", to: "sales#new", as: "sales_new"
  post "/sales", to: "sales#create"
  get "/riwayat", to: "sales#history", as: "sales_history"
  delete "/riwayat/:id", to: "sales#destroy", as: "sales_destroy"
get "/riwayat/:id", to: "sales#show", as: "sales_detail"

  #root 'inertia_example#index'
  get 'inertia-example', to: 'inertia_example#index'
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Render dynamic PWA files from app/views/pwa/* (remember to link manifest in application.html.erb)
  # get "manifest" => "rails/pwa#manifest", as: :pwa_manifest
  # get "service-worker" => "rails/pwa#service_worker", as: :pwa_service_worker

  # Defines the root path route ("/")
  # root "posts#index"

  # Redirect to localhost from 127.0.0.1 to use same IP address with Vite server
  constraints(host: "127.0.0.1") do
    get "(*path)", to: redirect { |params, req| "#{req.protocol}localhost:#{req.port}/#{params[:path]}" }
  end
end
