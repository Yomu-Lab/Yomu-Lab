require 'test_helper'

class AnnotationCategoriesControllerTest < ActionController::TestCase
  setup do
    @annotation_category = annotation_categories(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:annotation_categories)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create annotation_category" do
    assert_difference('AnnotationCategory.count') do
      post :create, annotation_category: { name: @annotation_category.name, status: @annotation_category.status }
    end

    assert_redirected_to annotation_category_path(assigns(:annotation_category))
  end

  test "should show annotation_category" do
    get :show, id: @annotation_category
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @annotation_category
    assert_response :success
  end

  test "should update annotation_category" do
    patch :update, id: @annotation_category, annotation_category: { name: @annotation_category.name, status: @annotation_category.status }
    assert_redirected_to annotation_category_path(assigns(:annotation_category))
  end

  test "should destroy annotation_category" do
    assert_difference('AnnotationCategory.count', -1) do
      delete :destroy, id: @annotation_category
    end

    assert_redirected_to annotation_categories_path
  end
end
