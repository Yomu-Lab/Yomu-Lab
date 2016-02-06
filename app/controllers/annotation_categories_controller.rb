class AnnotationCategoriesController < ApplicationController
  before_action :set_annotation_category, only: [:show, :edit, :update, :destroy]

  def index
    @annotation_categories = AnnotationCategory.all
    @annotation_category = AnnotationCategory.active.unique_name

    respond_to do |format|
      format.json  {
        render :status => 200, :json => { :annotation_category => @annotation_category }
      }
    end
  end

  def show
  end

  def new
    @annotation_category = AnnotationCategory.new
  end

  def edit
  end

  def create
    @annotation_category = AnnotationCategory.new(annotation_category_params)

    respond_to do |format|
      if @annotation_category.save
        format.html { redirect_to @annotation_category, notice: 'Annotation category was successfully created.' }
        format.json { render :show, status: :created, location: @annotation_category }
      else
        format.html { render :new }
        format.json { render json: @annotation_category.errors, status: :unprocessable_entity }
      end
    end
  end

  def update
    respond_to do |format|
      if @annotation_category.update(annotation_category_params)
        format.html { redirect_to @annotation_category, notice: 'Annotation category was successfully updated.' }
        format.json { render :show, status: :ok, location: @annotation_category }
      else
        format.html { render :edit }
        format.json { render json: @annotation_category.errors, status: :unprocessable_entity }
      end
    end
  end

  def destroy
    @annotation_category.destroy
    respond_to do |format|
      format.html { redirect_to annotation_categories_url, notice: 'Annotation category was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  def get_category_list
    begin
      @annotation_categories = AnnotationCategory.all
      render  :status => 200,
        :json => {
          :article => @article, :response_code => 200,
          :response_url => "/admin/create_article_step2/#{@article.id}?response_code=CODE_200"
        }
    rescue
      render  :status => 200,
        :json => {
          :article => @article, :response_code => 200,
          :response_url => "/admin/create_article_step2/#{@article.id}?response_code=CODE_200"
        }      
    end

  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_annotation_category
      @annotation_category = AnnotationCategory.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def annotation_category_params
      params.require(:annotation_category).permit(:name, :status)
    end
end
