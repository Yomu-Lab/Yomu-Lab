class ArticlesController < ApplicationController

  skip_before_filter :authenticate_user!

  before_action :set_article, only: [:show, :edit, :update, :destroy]

  def index
    current_user = User.find_by_authentication_token(params[:authentication_token])
    if current_user.present?
      #@articles = current_user.articles
      @articles = Article.all
    else
      @articles = Article.all
    end
    #@articles = current_user.articles
  end

  def show
  end

  def new
    @article = Article.new
  end

  def edit
  end

  def create
    begin
      @article = Article.new(article_params)
      user = User.find_by_authentication_token(params["authentication_token"]["token"])
      @article.user_id = user.id
      @article.word_count = WordsCounted.count(params[:article][:body]).token_count
      @article.character_count = params[:article][:body].gsub(" ", "").size
      @article.publication_status = GlobalConstant::ARTICLE_STATUS_DRAFT

      if @article.save
        render  :status => 200,
          :json => {
            :article => @article, :response_code => 200,
            :response_url => "/admin/create_article_step2/#{@article.id}?response_code=CODE_200"
          }
      else
        render  :status => 200,
          :json => {
            :response_code => 400, :response_message => GlobalMessage::ARTICLE_ERROR_OCCURED,
            :error_message => @article.errors,
          }
      end
    rescue
      render  :status => 200,
        :json => {
          :response_code => 400, :response_message => GlobalMessage::ARTICLE_ERROR_OCCURED,
          :error_message => @article.errors,
        }
    end
  end

  def update
    respond_to do |format|
      if @article.update(article_params)
        format.html { redirect_to @article, notice: 'Article was successfully updated.' }
        format.json { render :show, status: :ok, location: @article }
      else
        format.html { render :edit }
        format.json { render json: @article.errors, status: :unprocessable_entity }
      end
    end
  end

  def destroy
    @article.destroy
    respond_to do |format|
      format.html { redirect_to articles_url, notice: 'Article was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  def get_article_detail
    @article = Article.find_by_id(params[:id])

    render  :status => 200,
      :json => {
        :response_code => 200, :article => @article
      }
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_article
      @article = Article.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def article_params
      params.require(:article).permit(:auth_token, :user_id, :original_language, :level, :title, :body, :source_name, :source_url, :publication_status, :word_count, :character_count)
    end
end
