//var yomu_lab = angular.module('yomu_lab', [ 'Devise', 'LocalStorageModule' ]);

/*
* YomuLabsAdminCtrl Controller
*/
yomu_lab.controller('YomuLabsAdminCtrl', ['$scope', '$http', '$window', 'yomuLabAppLocalStorageService', 'yomuLabAppService', 'Auth', function($scope, $http, $window, yomuLabAppLocalStorageService, yomuLabAppService, Auth) {

  $scope.init = function(){
    console.log("YomuLabsAdminCtrl - init()");

    // => Fetch Authentication Token
    var authentication_token = yomuLabAppLocalStorageService.get_authentication_token();

    // => Check Authentication Token Exist Or Not
    yomuLabAppLocalStorageService.authentication_token_exist_or_not();

    this.get_articles_list(authentication_token.token);
  };

  /*
  # => Controller Service To Get Articles List of Logged In Admin User
  */
  $scope.get_articles_list = function(authentication_token){
    console.log("get_articles_list="+authentication_token);

    yomuLabAppService.get_articles_list(authentication_token).then(function(data){
      $scope.articles = angular.fromJson(data.data);
    }, function() {
      console.log("Service give error while retrieving the article lists.");
    });
  };

  $scope.redirect_to_create_articles = function(){
    window.location = "/admin/article_new";
  };

  $scope.submit_article_step_1 = function(article){
  
    // => Fetch Authentication Token
    var authentication_token = yomuLabAppLocalStorageService.get_authentication_token();

    yomuLabAppService.create_article_step1(article, authentication_token.token).then(function(data){
      var success_response = angular.fromJson(data.data);
      window.location = success_response.response_url;
    }, function() {
      console.log("Service give error while creating the article Step One.");
      $scope.message_type = "error_box";
      $scope.message_content = "Service give error while creating the article Step One.";
    });
  };


  $scope.fetch_article_data_at_step1 = function(article_id){
    //this.fetch_annotation_category();
    yomuLabAppService.get_article_step1_data(article_id).then(function(data){
      var article = angular.fromJson(data.data.article);
      $scope.article = {
        id: article.id,
        title: article.title,
        source_name: article.source_name,
        source_url: article.source_url,
        original_language: article.original_language,
        level: article.level,
        body: article.body,
        publication_status: article.publication_status,
        character_count: article.character_count,
        word_count:  article.word_count
      };
    }, function() {
      console.log("Service give error while fetching the article Step One Data.");
      $scope.message_type = "error_box";
      $scope.message_content = "Service give error while creating the article Step One.";
    });
  };




  $scope.fetch_article_data_at_step2 = function(article_id){

    this.fetch_annotation_category();

    yomuLabAppService.get_article_step1_data(article_id).then(function(data){
      var article = angular.fromJson(data.data.article);
      $scope.article = {
        id: article.id,
        title: article.title,
        source_name: article.source_name,
        source_url: article.source_url,
        original_language: article.original_language,
        level: article.level,
        body: article.body,
        publication_status: article.publication_status,
        character_count: article.character_count,
        word_count:  article.word_count
      };
    }, function() {
      console.log("Service give error while fetching the article Step One Data.");
      $scope.message_type = "error_box";
      $scope.message_content = "Service give error while creating the article Step One.";
    });
  };

  $scope.response_from_create_article_step1 = function(response_code){
    if (response_code == 'CODE_200'){
      $scope.message_type = "success_box";
      $scope.message_content = "Your changes have been saved successfully.";
    }
    if (response_code == 'CODE_400'){
      $scope.message_type = "error_box";
      $scope.message_content = "Error occurred while saving the article.";
    }
  };

  $scope.fetch_annotation_category = function(){
    yomuLabAppService.get_annotation_category().then(function(data){
      $scope.annotation_category = angular.fromJson(data.data.annotation_category);
    }, function() {
      console.log("Service give error while fetching the annotation_category Step two Data.");
      $scope.message_type = "error_box";
      alert("Service give error while fetching the annotation_category Step two Data.");
    });
  };

  $scope.select_annotation_category = function(category_id){
    $scope.selected_annotation_category = category_id;
    console.log("category_id = "+category_id);
  };


}]);
