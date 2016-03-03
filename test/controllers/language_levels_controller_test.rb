require 'test_helper'

class LanguageLevelsControllerTest < ActionController::TestCase
  setup do
    @language_level = language_levels(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:language_levels)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create language_level" do
    assert_difference('LanguageLevel.count') do
      post :create, language_level: { language_id: @language_level.language_id, level: @language_level.level }
    end

    assert_redirected_to language_level_path(assigns(:language_level))
  end

  test "should show language_level" do
    get :show, id: @language_level
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @language_level
    assert_response :success
  end

  test "should update language_level" do
    patch :update, id: @language_level, language_level: { language_id: @language_level.language_id, level: @language_level.level }
    assert_redirected_to language_level_path(assigns(:language_level))
  end

  test "should destroy language_level" do
    assert_difference('LanguageLevel.count', -1) do
      delete :destroy, id: @language_level
    end

    assert_redirected_to language_levels_path
  end
end
