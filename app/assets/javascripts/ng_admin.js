//var yomu_lab = angular.module('yomu_lab', [ 'Devise', 'LocalStorageModule' ]);

/*
* YomuLabsAdminCtrl Controller
*/
yomu_lab.controller('YomuLabsAdminCtrl', ['$scope', '$http', '$window', 'yomuLabAppLocalStorageService', 'yomuLabAppService', 'Auth', function($scope, $http, $window, yomuLabAppLocalStorageService, yomuLabAppService, Auth) {

  $scope.init = function(){
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
    $("#selected_annotation_category").val(category_id);
    $("#annotationForm .annotation_button button").addClass("stepButton");
    $("#annotationForm .annotation_button button#"+category_id).removeClass("stepButton");
  };

  /*
  # => Select Annotation Category While Creating Annotation
  */
  $scope.create_annotation = function(annotation){
    var article_id = $("#article_id").val();
    var selected_annotation_category = $("#selected_annotation_category").val();
  
    // => Fetch Authentication Token
    var authentication_token = yomuLabAppLocalStorageService.get_authentication_token();

    yomuLabAppService.create_annotation(annotation, article_id, selected_annotation_category, authentication_token.token).then(function(data){
      var success_response = angular.fromJson(data.data);
      $scope.message_type = "success_box";  
      $scope.message_content = success_response.response_message;      
    }, function() {
      console.log("Service give error while creating the annotation.");
      $scope.message_type = "error_box";
      $scope.message_content = "Service give error while creating the annotation.";
    });
    $("#articleHeader .response_message_box").show();
  };

  /*
  # => Fetch Article Data - At Step 3
  */
  $scope.fetch_article_data_at_step3 = function(article_id){
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
      $scope.message_content = "Service give error while fetching the article Step Three Data.";
    });
  };

  /*
  # => Fetch Data For Existing Annotation - Step 2
  */
  $scope.fetch_data_for_existing_annotation = function(selected_string){
    var article_id = $("#article_id").val();
    yomuLabAppService.fetch_data_for_existing_annotation(article_id, selected_string).then(function(data){
      var annotation_data = angular.fromJson(data.data);
      if ( annotation_data.response_code == 404 ){
        $scope.annotation = "";
        $("#annotationForm .annotation_button button").addClass("stepButton");
      }else{
        annotation_data = annotation_data.annotation;
        $scope.annotation = {
          original_conjugation: annotation_data.original_conjugation,
          definition: annotation_data.definition,
          reading: annotation_data.reading,
          translation: annotation_data.translation,
          general_note: annotation_data.usage_note,
          specific_note: annotation_data.specific_note,
          selected_annotation_category: annotation_data.selected_annotation_category,
        };
        /* Activate Annotation Category */
        $("#annotationForm .annotation_button button#"+annotation_data.selected_annotation_category).removeClass("stepButton");
      }
    }, function() {
      console.log("Service give error while fetching the annotation at Step 2 Data.");
      $scope.message_type = "error_box";
      $scope.message_content = "Service give error while fetching the annotation Step 2.";
    });
  };

  /*
  # => Fetch Keyword List Of Article - Step 2
  */
  $scope.fetch_keyword_for_existing_article = function(article_id){
    //var article_id = $("#article_id").val();
    yomuLabAppService.fetch_keyword_for_existing_article(article_id).then(function(data){
      /*
      var keyword_annotation = angular.fromJson(data.data.keyword_list);
      //data = {"keyword_list":[{"id":3,"source_text":"lorem","location_start":2},{"id":4,"source_text":"ipsum","location_start":1}],"response_code":200};
      var articleData = $("#article_content").html().replace(/\n/g, "").split(" ");
      $.each(keyword_annotation, function(key,value){
        console.log("Key="+key+"::Value="+value);
          if(articleData[value.location_start] == value.source_text){
            articleData[value.location_start] = "<span style='text-decoration:undeline;color:red;'>" + value.source_text +"</span>";  
          }
      });
      */
      //return articleData.join(" ");
      //$scope.article.body = articleData.join(" ");
    }, function() {
      console.log("Service give error while fetching the Keyword List at Step 2 Data.");
      $scope.message_type = "error_box";
      $scope.message_content = "Service give error while fetching the Keyword List Step 2.";
    });
  };

  /*
  # => Select Annotation Category While Creating Annotation
  */
  $scope.discard_annotation_data = function(){
    $scope.annotation = { };
    $("#selected_annotation_category").val("");
    $("#source_text").val("");    
    $("#annotationForm .annotation_button button").addClass("stepButton");
  };

  /*
  # => Save Translation Data
  */
  $scope.save_article_translation = function(translation, article_id){
    console.log("save_article_translation- start");
    yomuLabAppService.save_translation(article_id, translation).then(function(data){
      var response = angular.fromJson(data.data);
      $("div.article_message div").addClass(response.response_type);
      $("div.article_message div span").text(response.response_message);
      $scope.redirect_to_admin_dashboard();

    }, function() {
      var response = angular.fromJson(data.data);
      console.log("Service give error while saving article translation.");
      $("div.article_message div").addClass(response.response_type);
      $("div.article_message div span").text(response.response_message);
    });
  };

  /*
  # => Get Translation Data
  */
  $scope.get_article_translation = function(article_id){
    yomuLabAppService.get_translation(article_id).then(function(data){
      var translation_data = angular.fromJson(data.data.translation);
      $scope.translation={
        title: "",
        paragraph: [null],
      };

      translation_data.forEach( function( statement ) {
        if(statement.paragraph_id==0){
          $scope.translation.title = statement.translation;
        }
        else{
          $scope.translation.paragraph.push(statement.translation);
        }
      });
    }, function() {
      console.log("Service give error while getting article translation.");
      $scope.message_type = "error_box";
      $scope.message_content = "Service give error while getting article translation";
    });
  };

  /*
  # => Redirect To Create Article Page
  */
  $scope.redirect_to_admin_dashboard = function(){
    var seconds = 5;
    setInterval(function () {
      seconds--;
      if (seconds == 0) {
        window.location = "/admin/dashboard";
      }
    }, 1000);
  };

  /*
  # => Change Article Status To Publish From Unpublished
  */
  $scope.change_article_status = function(article_id){
    yomuLabAppService.set_article_status_as_publish(article_id).then(function(data){
      var response = angular.fromJson(data.data);
      $("div.article_message div").addClass(response.response_type);
      $("div.article_message div span").text(response.response_message);
      yomuLabAppService.hide_response_message();
      $scope.init();
    }, function() {
      console.log("Service give error while retrieving the article lists.");
    });
  };




}]);



