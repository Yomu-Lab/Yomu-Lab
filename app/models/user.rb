class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable, :omniauthable, 
         :omniauth_providers => [:facebook, :google_oauth2]

  ## Token Authenticatable
  acts_as_token_authenticatable # => field :authentication_token

  def self.from_omniauth(auth)
    
    if auth.provider == "facebook"
      first_name = auth.info.first_name
      last_name = auth.info.last_name
      email = auth.info.email
    end

    if auth.provider == "google_oauth2"
      first_name = auth.extra.raw_info.given_name
      last_name = auth.extra.raw_info.family_name
      email = auth.extra.raw_info.email
    end

    where(provider: auth.provider, uid: auth.uid).first_or_create do |user|
      user.provider = auth.provider
      user.uid = auth.uid
      user.first_name = first_name
      user.last_name = last_name
      user.email = email
      user.password = Devise.friendly_token[0,20]
    end
  end

end
