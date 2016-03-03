class LanguageLevelsController < ApplicationController
  before_action :set_language_level, only: [:show, :edit, :update, :destroy]

  # GET /language_levels
  # GET /language_levels.json
  def index
    @language_levels = LanguageLevel.all
  end

  # GET /language_levels/1
  # GET /language_levels/1.json
  def show
  end

  # GET /language_levels/new
  def new
    @language_level = LanguageLevel.new
  end

  # GET /language_levels/1/edit
  def edit
  end

  # POST /language_levels
  # POST /language_levels.json
  def create
    @language_level = LanguageLevel.new(language_level_params)

    respond_to do |format|
      if @language_level.save
        format.html { redirect_to @language_level, notice: 'Language level was successfully created.' }
        format.json { render :show, status: :created, location: @language_level }
      else
        format.html { render :new }
        format.json { render json: @language_level.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /language_levels/1
  # PATCH/PUT /language_levels/1.json
  def update
    respond_to do |format|
      if @language_level.update(language_level_params)
        format.html { redirect_to @language_level, notice: 'Language level was successfully updated.' }
        format.json { render :show, status: :ok, location: @language_level }
      else
        format.html { render :edit }
        format.json { render json: @language_level.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /language_levels/1
  # DELETE /language_levels/1.json
  def destroy
    @language_level.destroy
    respond_to do |format|
      format.html { redirect_to language_levels_url, notice: 'Language level was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_language_level
      @language_level = LanguageLevel.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def language_level_params
      params.require(:language_level).permit(:language_id, :level)
    end
end
