source 'https://rubygems.org'


# Bundle edge Rails instead: gem 'rails', github: 'rails/rails'
gem 'rails', '4.2.2'
# Use sqlite3 as the database for Active Record
# Use SCSS for stylesheets
gem 'sass-rails', '~> 5.0'
# Use Uglifier as compressor for JavaScript assets
gem 'uglifier', '>= 1.3.0'
# Use CoffeeScript for .coffee assets and views
gem 'coffee-rails', '~> 4.1.0'
# See https://github.com/rails/execjs#readme for more supported runtimes
# gem 'therubyracer', platforms: :ruby

# Use jquery as the JavaScript library
gem 'jquery-rails'
# Turbolinks makes following links in your web application faster. Read more: https://github.com/rails/turbolinks
# Build JSON APIs with ease. Read more: https://github.com/rails/jbuilder
gem 'jbuilder', '~> 2.0'
# bundle exec rake doc:rails generates the API under doc/api.
gem 'sdoc', '~> 0.4.0', group: :doc
# Use ActiveModel has_secure_password
# gem 'bcrypt', '~> 3.1.7'

# Use Unicorn as the app server
# gem 'unicorn'

# Use Capistrano for deployment
# gem 'capistrano-rails', group: :development
gem 'mysql2', '~> 0.3.18'
gem 'devise'
gem 'omniauth'
gem 'omniauth-twitter'
gem 'omniauth-google-oauth2', github: 'zquestz/omniauth-google-oauth2'
gem 'active_model_serializers', '0.10.0.rc3'

gem 'turbolinks',           '2.3.0'
gem 'words_counted'

group :production do
	gem 'pg'
end


group :development do
	gem 'execjs'
	gem 'therubyracer'
	gem 'pry'
  gem 'sqlite3',     '1.3.9'
  gem 'byebug',      '3.4.0'
  gem 'web-console', '2.0.0.beta3'
  gem 'spring'
  gem 'guard-rspec'
  gem 'growl'
  gem 'spring-commands-rspec'
  gem "rails-erd"
  gem 'pry-rescue'
  gem 'pry-stack_explorer'
  gem 'database_cleaner', '~> 1.5', '>= 1.5.1'
end

group :test do
  gem "rspec-rails", "~> 2.14"
  gem "factory_girl_rails"
  gem 'ffaker'
  gem "shoulda-matchers"
  gem 'simplecov', :require => false
end
