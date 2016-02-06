class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable, :omniauthable, :confirmable,
         :omniauth_providers => [:facebook, :google_oauth2]

  ## Token Authenticatable
  acts_as_token_authenticatable # => field :authentication_token

  has_many :articles

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

  def only_if_unconfirmed
    pending_any_confirmation {yield}
  end

  def attempt_set_password(params)
    p = {}
    p[:password] = params[:password]
    p[:password_confirmation] = params[:password_confirmation]
    update_attributes(p)
  end
  
  # new function to return whether a password has been set
  def has_no_password?
    self.encrypted_password.blank?
  end

end
