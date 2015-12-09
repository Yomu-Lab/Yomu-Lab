class HomeController < ApplicationController

  skip_before_filter :authenticate_user!

  def index
  	
  end
  
  def thank_you
  	
  end

end
