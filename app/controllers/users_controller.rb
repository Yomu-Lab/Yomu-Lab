class UsersController < ApplicationController
  before_action :set_user, only: [:show, :edit, :update, :destroy]

  before_action :set_loggedin_user, only: [ :find_loggedin_user_language ]

  def show
    # authorize! :read, @user
  end

  def edit
    # authorize! :update, @user
  end

  def update
    # authorize! :update, @user
    respond_to do |format|
      if @user.update(user_params)
        sign_in(@user == current_user ? @user : current_user, :bypass => true)
        format.html { redirect_to @user, notice: 'Your profile was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: 'edit' }
        format.json { render json: @user.errors, status: :unprocessable_entity }
      end
    end
  end

  def finish_signup
    # authorize! :update, @user 
    if request.patch? && params[:user] #&& params[:user][:email]
      if @user.update(user_params)
        @user.skip_reconfirmation!
        sign_in(@user, :bypass => true)
        redirect_to @user, notice: 'Your profile was successfully updated.'
      else
        @show_errors = true
      end
    end
  end

  def destroy
    # authorize! :delete, @user
    @user.destroy
    respond_to do |format|
      format.html { redirect_to root_url }
      format.json { head :no_content }
    end
  end
  
  def find_loggedin_user_language
    render :status => 200,
      :json => {
        :response_code => 200,
        :ui_language => @user.ui_language,
        :original_language => @user.original_language,
        :target_language => @user.target_language,
        :level => @user.level
      }
  end

  private

    def set_loggedin_user
      @user = User.find_by_authentication_token(params[:token])
    end

    def set_user
      @user = User.find(params[:id])
    end

    def user_params
      accessible = [ :name, :email, :prelaunch_ref ] # extend with your own params
      accessible << [ :password, :password_confirmation ] unless params[:user][:password].blank?
      params.require(:user).permit(accessible)
    end
end