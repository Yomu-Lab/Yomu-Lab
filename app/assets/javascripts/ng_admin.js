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

  /*
  # => Redirect To Create Article Page
  */
  $scope.redirect_to_create_articles = function(){
    window.location = "/admin/create_article_step1";
  };

  /*
  # => Submit Article Step 1
  */
  $scope.submit_article_step_1 = function(article){
  
    // => Fetch Authentication Token
    var authentication_token = yomuLabAppLocalStorageService.get_authentication_token();

    yomuLabAppService.create_article_step1(article, authentication_token.token).then(function(data){
      var create_response = angular.fromJson(data.data);
      if (create_response == 400){
        console.log("Service give error while creating the article Step One.");
        $scope.message_type = "error_box";
        $scope.message_content = create_response.response_message; //"Service give error while creating the article Step One.";
      }
      else
      {
        window.location = create_response.response_url;
      }      
    }, function() {
      console.log("Service give error while creating the article Step One.");
      $scope.message_type = "error_box";
      $scope.message_content = "Service give error while creating the article Step One.";
    });
  };

  /*
  # => Fetch Article Data - At Step 1
  */
  $scope.fetch_article_data_at_step1 = function(article_id){
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

  /*
  # => Fetch Article Data - At Step 2
  */
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

  /*
  # => Response From Create Article Step 1
  */
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

  /*
  # => Fetch Annotation Category
  */
  $scope.fetch_annotation_category = function(){
    yomuLabAppService.get_annotation_category().then(function(data){
      $scope.annotation_category = angular.fromJson(data.data.annotation_category);
    }, function() {
      console.log("Service give error while fetching the annotation_category Step two Data.");
    });
  };

  /*
  # => Select Annotation Category While Creating Annotation
  */
  $scope.select_annotation_category = function(category_id){
    $scope.annotation = {
      selected_annotation_category: category_id
    };
    $("#annotationForm .annotation_button button").addClass("stepButton");
    $("#annotationForm .annotation_button button#"+category_id).removeClass("stepButton");
  };

  /*
  # => Select Annotation Category While Creating Annotation
  */
  $scope.create_annotation = function(annotation){
    console.log(annotation);
    var article_id = $("#article_id").val();
  
    // => Fetch Authentication Token
    var authentication_token = yomuLabAppLocalStorageService.get_authentication_token();

    yomuLabAppService.create_annotation(annotation, article_id, authentication_token.token).then(function(data){
      var success_response = angular.fromJson(data.data);
      $scope.annotation_notification_message_type = "success_box";  
      $scope.annotation_notification_message = success_response.response_message;      
    }, function() {
      console.log("Service give error while creating the annotation.");
      $scope.annotation_notification_message_type = "error_box";
      $scope.annotation_notification_message = "Service give error while creating the annotation.";
    });
    $(".annotation_notification.response_message_box").show();
  };


  /*
  # => Fetch Article Data - At Step 3
  */
  $scope.fetch_article_data_at_step3 = function(article_id){

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
      console.log("Service give error while fetching the article Step Three Data.");
      $scope.message_type = "error_box";
      $scope.message_content = "Service give error while creating the article Step Three.";
    });
  };



}]);

