class AdminController < ApplicationController

	layout "admin_application"

  def dashboard
  end

  def create_article_step1
    @article_id = params[:article_id] if params[:article_id].present?
  end

  def create_article_step2
    #{"response_code"=>"CODE_200", "controller"=>"admin", "action"=>"create_article_step2", "article_id"=>"18"}
    @response_code = params[:response_code] if params[:response_code].present?
    @article_id = params[:article_id] if params[:article_id].present?
  end

  def create_article_step3
    @article_id = params[:article_id] if params[:article_id].present?
  end

end
