# config/initializers/session_store.rb

# Gunakan konfigurasi yang mendukung domain .test di development
Rails.application.config.session_store :cookie_store, 
  key: '_ruby_minimarket_session', 
  domain: :all