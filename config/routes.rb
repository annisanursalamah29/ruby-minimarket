require "sidekiq/web" # Tambahkan baris ini di paling atas

Rails.application.routes.draw do
  root "sessions#new"

  mount Sidekiq::Web => "/sidekiq"

  get  "/login",  to: "sessions#new",     as: "login"
  post "/login",  to: "sessions#create"
  delete "/logout", to: "sessions#destroy", as: "logout"

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

  get 'inertia-example', to: 'inertia_example#index'

  get "up" => "rails/health#show", as: :rails_health_check

  constraints(host: "127.0.0.1") do
    get "(*path)", to: redirect { |params, req| "#{req.protocol}rubyminimarket.test:#{req.port}/#{params[:path]}" }
  end
end