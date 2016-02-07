require 'test_helper'

class AnnotationsControllerTest < ActionController::TestCase
  setup do
    @annotation = annotations(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:annotations)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create annotation" do
    assert_difference('Annotation.count') do
      post :create, annotation: { annotation_category_id: @annotation.annotation_category_id, article_id: @annotation.article_id, character_count: @annotation.character_count, definition: @annotation.definition, destination_language: @annotation.destination_language, location_end: @annotation.location_end, location_start: @annotation.location_start, paragraph_id: @annotation.paragraph_id, reading: @annotation.reading, source_text: @annotation.source_text, specific_note: @annotation.specific_note, translation: @annotation.translation, usage_note: @annotation.usage_note, user_id: @annotation.user_id, word_count: @annotation.word_count }
    end

    assert_redirected_to annotation_path(assigns(:annotation))
  end

  test "should show annotation" do
    get :show, id: @annotation
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @annotation
    assert_response :success
  end

  test "should update annotation" do
    patch :update, id: @annotation, annotation: { annotation_category_id: @annotation.annotation_category_id, article_id: @annotation.article_id, character_count: @annotation.character_count, definition: @annotation.definition, destination_language: @annotation.destination_language, location_end: @annotation.location_end, location_start: @annotation.location_start, paragraph_id: @annotation.paragraph_id, reading: @annotation.reading, source_text: @annotation.source_text, specific_note: @annotation.specific_note, translation: @annotation.translation, usage_note: @annotation.usage_note, user_id: @annotation.user_id, word_count: @annotation.word_count }
    assert_redirected_to annotation_path(assigns(:annotation))
  end

  test "should destroy annotation" do
    assert_difference('Annotation.count', -1) do
      delete :destroy, id: @annotation
    end

    assert_redirected_to annotations_path
  end
end
