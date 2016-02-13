class AnnotationsController < ApplicationController
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
      annotation = params[:annotation_data]
      user_id = User.find_by_authentication_token(params[:authentication_token]).id

      check_annotation_exist_or_not = check_annotation_existance(annotation[:article_id], annotation[:source_text])
      if check_annotation_exist_or_not
        existing_annotation = Annotation.find_by_article_id_and_source_text(annotation[:article_id], annotation[:source_text])
        existing_annotation.update_attributes(:source_text => annotation[:source_text], 
          :original_conjugation => annotation[:original_conjugation],
          :definition => annotation[:definition],
          :reading => annotation[:reading],
          :translation => annotation[:translation],
          :usage_note => annotation[:general_note],
          :specific_note => annotation[:specific_note],
          :annotation_category_id => annotation[:selected_annotation_category],
          :article_id => annotation[:article_id],
          :user_id => user_id )        
          response_code = 200
          response_message = GlobalMessage::ANNOTATION_UPDATED
      else
        @annotation = Annotation.new
        @annotation.source_text = annotation[:source_text]
        @annotation.original_conjugation = annotation[:original_conjugation]
        @annotation.definition = annotation[:definition]
        @annotation.reading = annotation[:reading]
        @annotation.translation = annotation[:translation]
        @annotation.usage_note = annotation[:general_note]
        @annotation.specific_note = annotation[:specific_note]
        @annotation.annotation_category_id = annotation[:selected_annotation_category]
        @annotation.article_id = annotation[:article_id]
        @annotation.user_id = user_id        
        if @annotation.save
          response_code = 200
          response_message = GlobalMessage::ANNOTATION_SAVED
        else
          response_code = 400
          response_message = GlobalMessage::ANNOTATION_NOT_SAVED
        end
      end
      render :status => 200,
        :json => {
          :response_code => response_code,
          :response_message => response_message
        }     
    rescue
      render  :status => 200,
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
      annotation = Annotation.find_by_source_text(params[:annotation][:source_text])

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

  def save_translation
    article_id = params[:translation][:article_id]
    content_translation = params[:translation][:content_translation]
    annotation_category_id = (AnnotationCategory.find_by name: 'Translation').id
    user_id = User.find_by_authentication_token(params[:authentication_token]).id
    content_translation.each do |content|
      paragraph_id = content[0].split("_")[1].to_i
      Annotation.where(article_id: article_id, paragraph_id: paragraph_id, annotation_category_id: annotation_category_id).first_or_initialize do |annotation|
        annotation.translation = content[1]
        annotation.user_id = user_id
        annotation.save!
      end
      puts "=================#{content[0]}=====#{content[0].split("_")[1].to_i}============#{content[1]}======================="
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
end
