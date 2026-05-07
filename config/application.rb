require_relative "boot"

require "rails/all"

Bundler.require(*Rails.groups)

module RubyMinimarket
  class Application < Rails::Application
    config.load_defaults 8.1

    config.autoload_lib(ignore: %w[assets tasks])

    config.active_job.queue_adapter = :sidekiq

    # Use AnyCable secret to sign Turbo Streams
    # https://docs.anycable.io/guides/hotwire?id=rails-applications
    config.turbo.signed_stream_verifier_key = AnyCable.config.secret
  end
end
