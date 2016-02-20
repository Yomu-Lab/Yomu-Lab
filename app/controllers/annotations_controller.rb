class AnnotationsController < ApplicationController

  skip_before_filter :authenticate_user!

  before_action :set_annotation, only: [:show, :edit, :update, :destroy]

  def index
    @annotations = Annotation.all
  end

  def show
  end

  def new
    @annotation = Annotation.new
  end

  def edit
  end

  def create
    begin
      annotation_array = params[:annotation_data]
      user_id = User.find_by_authentication_token(params[:authentication_token]).id

      check_annotation_exist_or_not = check_annotation_existance(annotation_array[:article_id].to_i, annotation_array[:source_text])
      if check_annotation_exist_or_not
        existing_annotation = Annotation.find_by_article_id_and_source_text(annotation_array[:article_id].to_i, annotation_array[:source_text])
        existing_annotation.update_attributes(:source_text => annotation_array[:source_text], 
          :original_conjugation => annotation_array[:original_conjugation],
          :definition => annotation_array[:definition],
          :reading => annotation_array[:reading],
          :translation => annotation_array[:translation],
          :usage_note => annotation_array[:general_note],
          :specific_note => annotation_array[:specific_note],
          :annotation_category_id => annotation_array[:selected_annotation_category],
          :article_id => annotation_array[:article_id],
          :user_id => user_id )        
        response_code = 200
        response_message = GlobalMessage::ANNOTATION_UPDATED
      else
        new_annotation = Annotation.where(:source_text => annotation_array[:source_text], :article_id => annotation_array[:article_id])
          .first_or_create!(:original_conjugation => annotation_array[:original_conjugation], :definition => annotation_array[:definition],
            :reading => annotation_array[:reading], :translation => annotation_array[:translation], :usage_note => annotation_array[:general_note],
            :specific_note => annotation_array[:specific_note], :annotation_category_id => annotation_array[:selected_annotation_category],
            :article_id => annotation_array[:article_id].to_i, :user_id => user_id )
        if new_annotation
          response_code = 200
          response_message = GlobalMessage::ANNOTATION_SAVED
        else
          response_code = 400
          response_message = GlobalMessage::ANNOTATION_NOT_SAVED
        end
      end

      # Set Article Status as Draft
      set_articles_publication_status(annotation_array[:article_id].to_i, GlobalConstant::ARTICLE_STATUS_DRAFT)

      render :status => 200,
        :json => {
          :response_code => response_code,
          :response_message => response_message
        }     
    rescue
      render :status => 200,
        :json => {
          :response_code => 404, 
          :response_message => GlobalMessage::ANNOTATION_NOT_SAVED
        }
    end
  end

  def update
    respond_to do |format|
      if @annotation.update(annotation_params)
        format.html { redirect_to @annotation, notice: 'Annotation was successfully updated.' }
        format.json { render :show, status: :ok, location: @annotation }
      else
        format.html { render :edit }
        format.json { render json: @annotation.errors, status: :unprocessable_entity }
      end
    end
  end

  def destroy
    @annotation.destroy
    respond_to do |format|
      format.html { redirect_to annotations_url, notice: 'Annotation was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  def get_annotation
    if authentication_token_valid(params["authentication_token"])
      annotation = Annotation.find_by_source_text_and_article_id(params[:annotation][:source_text], params[:annotation][:article_id].to_i)

      if annotation.present?
        @annotation = { 
          :original_conjugation => annotation.original_conjugation,
          :definition => annotation.definition,
          :reading => annotation.reading,
          :translation => annotation.translation,
          :usage_note => annotation.usage_note,
          :specific_note => annotation.specific_note,
          :selected_annotation_category => annotation.annotation_category_id,
        }
        render  :status => 200, :json => { :annotation => @annotation, :response_code => 200 }
      else
        render  :status => 200, :json => { :response_code => 404, :response_message => "Error occured while retrieving annotation meaning." }
      end
    else
      render  :status => 200,
        :json => {
          :response_code => 400, :response_message => "Error occured while retrieving annotation meaning."
        }
    end
  end

  def save_paragraph_translation
    begin
      article_id = params[:translation][:article_id]
      paragraph_id = params[:translation][:paragraph_id]
      translation_paragraph = params[:translation][:paragraph]
      annotation_category_id = (AnnotationCategory.find_by name: 'Translation').id
      user_id = User.find_by_authentication_token(params[:authentication_token]).id

      article_paragraph = Annotation.where(article_id: article_id, paragraph_id: paragraph_id, annotation_category_id: annotation_category_id).first_or_initialize
      article_paragraph.translation = translation_paragraph
      article_paragraph.user_id = user_id
      article_paragraph.save!

      # Set Article Status as Unplublished
      set_articles_publication_status(article_id, GlobalConstant::ARTICLE_STATUS_UNPUBLISHED)
      render :status => 200,
        :json => {
          :response_code => 200,
          :response_type => GlobalConstant::RESPONSE_TYPE_SUCCESS,
          :response_message => GlobalMessage::TRANSLATION_UPDATED
        }      
    rescue
      render  :status => 200,
        :json => {
          :response_code => 404, 
          :response_type => GlobalConstant::RESPONSE_TYPE_ERROR,
          :response_message => GlobalMessage::TRANSLATION_NOT_SAVED
        }      
    end
  end


  def get_translation
    article_id = params["translation"]["article_id"]
    if authentication_token_valid(params[:authentication_token])
      translation = Annotation.where(:article_id => article_id).where.not(paragraph_id: nil).select('translation','paragraph_id')
      if translation.present?
        list = translation.map do |statement|
          { 
            :article_id => article_id,
            :translation => statement.translation,
            :paragraph_id => statement.paragraph_id
          }
        end
        render :status => 200, :json => { :translation => list.to_json, :response_code => 200 }
      else
        render :status => 200, 
          :json => { 
            :response_code => 404, 
            :response_type => GlobalConstant::RESPONSE_TYPE_ERROR,
            :response_message => "Error occured while retrieving annotation meaning." 
          }
      end
    else
      render :status => 200,
        :json => {
          :response_code => 400, 
          :response_type => GlobalConstant::RESPONSE_TYPE_ERROR,
          :response_message => "Error occured while retrieving annotation meaning."
        }
    end
  end

  def get_list_of_existing_annotation
    keyword_list = Array[]
    article_id = params["annotation"]["article_id"]
    if authentication_token_valid(params["authentication_token"])
      annotation = Annotation.where(:article_id => article_id).where(paragraph_id: nil).select('id', 'location_start', 'source_text')
      if annotation.present?
        annotation.each do |keyword|
          keyword_list << keyword
        end
        render  :status => 200, :json => { :keyword_list => keyword_list, :response_code => 200 }
      else
        render  :status => 200, :json => { :response_code => 404, :response_message => "Error occured while retrieving keyword list." }
      end
    else
      render  :status => 200,
        :json => {
          :response_code => 400, :response_message => "Error occured while retrieving keyword list"
        }
    end    
  end


  # => Check Annotation Exist or Not
  def check_annotation_existance(article_id, source_text)
    return true if Annotation.find_by_article_id_and_source_text(article_id, source_text).present?
    return false
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_annotation
      @annotation = Annotation.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def annotation_params
      params.require(:annotation).permit(:user_id, :article_id, :destination_language, :source_text, :location_start, :location_end, :word_count, :character_count, :annotation_category_id, :original_conjugation, :definition, :reading, :translation, :usage_note, :specific_note, :paragraph_id)
    end

    def set_articles_publication_status(article_id, status_type)
      article = Article.find_by_id(article_id)
      article.publication_status = status_type
      article.save!
    end

end
