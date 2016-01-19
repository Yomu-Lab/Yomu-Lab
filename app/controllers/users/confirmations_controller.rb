class Users::ConfirmationsController < Devise::ConfirmationsController
  # GET /resource/confirmation/new
  # def new
  #   super
  # end

  # POST /resource/confirmation
  # def create
  #   super
  # end

  # GET /resource/confirmation?confirmation_token=abcdef
  def show
    #super
    with_unconfirmed_confirmable do
      if @confirmable.has_no_password?
        @confirmation_token = params[:confirmation_token]
        @requires_password = true
        self.resource = @confirmable
      else
        @confirmable.confirm
        set_referral_count_true(@confirmable.id)
      end
    end

    unless @confirmable.errors.empty?
      self.resource = @confirmable
      #render 'devise/confirmations/new' #Change this if you don't have the views on default path
      message_type = "error"
      message_code = 400
      if @confirmable.errors.messages[:confirmation_token].present?
        message_content = "Confirmation Token #{@confirmable.errors.messages[:confirmation_token][0]}"
      elsif @confirmable.errors.messages[:email].present?
        message_content = "Email #{@confirmable.errors.messages[:email][0]}"
      else
        message_content = "Confirm Token went wrong. Please resend confirmation token to your registered email address."
      end
    else
      message_type = "success"
      message_code = 200
      message_content = "Your email address has been successfully confirmed."           
    end

    render  :status => 200, 
            :json => { :response_type => message_type, :response_code => message_code, :response_message => message_content }
  end

  def set_referral_count_true(user_id)
    referral_bonus_active = ReferralUser.find_by_referral_user_id(user_id)
    if referral_bonus_active.present?
      referral_bonus_active.status = true
      referral_bonus_active.save
    end
  end

protected

  def with_unconfirmed_confirmable
    @confirmable = User.find_or_initialize_with_error_by(:confirmation_token, params[:confirmation_token])
    if !@confirmable.new_record?
      @confirmable.only_if_unconfirmed {yield}
    end
  end

  # protected

  # The path used after resending confirmation instructions.
  # def after_resending_confirmation_instructions_path_for(resource_name)
  #   super(resource_name)
  # end

  # The path used after confirmation.
  # def after_confirmation_path_for(resource_name, resource)
  #   super(resource_name, resource)
  # end
end
