class HomeController < ApplicationController

  skip_before_filter :authenticate_user!

  def index
  	
  end
  
  def thank_you
  	
  end


  def user_details
  	loggedin_user = User.find_by_authentication_token(params[:authentication_token])
 	  render :json => {
                  :current_user => loggedin_user,
                  :responseMessage => "You have logged in successfully",
                }
  end

end
