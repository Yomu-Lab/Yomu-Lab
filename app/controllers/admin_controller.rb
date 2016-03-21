class AdminController < ApplicationController

	layout "admin_application"

  def dashboard
  end

  def create_article_step1
    @article_id = params[:article_id] if params[:article_id].present?
  end

  def create_article_step2
    @response_code = params[:response_code] if params[:response_code].present?
    @article_id = params[:article_id] if params[:article_id].present?
    render :layout => "create_article_application"
  end

  def create_article_step3
    @article_id = params[:article_id] if params[:article_id].present?
  end

  def change_article_status   
    begin
      article = Article.find_by_id(params[:article_id])
      article.publication_status = params["translation"]["status"] #GlobalConstant::ARTICLE_STATUS_PUBLISHED
      article.publication_date = ""
      article.publication_date = Date.today.to_s if params["translation"]["status"] == GlobalConstant::ARTICLE_STATUS_PUBLISHED

      article.save!

      render :status => 200,
        :json => {
          :response_code => 200,
          :response_type => GlobalConstant::RESPONSE_TYPE_SUCCESS,
          :response_message => GlobalMessage::ARTICLE_STATUS_PUBLISHED
        }      
    rescue
      render  :status => 200,
        :json => {
          :response_code => 404, 
          :response_type => GlobalConstant::RESPONSE_TYPE_ERROR,
          :response_message => GlobalMessage::ARTICLE_STATUS_UPDATE_ERROR
        }      
    end
  end

end
