//var yomu_lab = angular.module('yomu_lab', [ 'Devise', 'LocalStorageModule' ]);

/*
* YomuLabsAdminCtrl Controller
*/
yomu_lab.controller('YomuLabsAdminCtrl', ['$scope', '$http', '$window', 'yomuLabAppLocalStorageService', 'yomuLabAppService', 'Auth', '$sce', function($scope, $http, $window, yomuLabAppLocalStorageService, yomuLabAppService, Auth,  $sce) {

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
        //body: article.body,
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
  $scope.create_annotation = function(article, annotation){
    var article_id = $("#article_id").val();
    var selected_annotation_category = $("#selected_annotation_category").val();
    var source_text = $("#source_text").val();

    if ( article_id !="" && selected_annotation_category != "" && source_text != "" && annotation != "" ){
      // => Fetch Authentication Token
      var authentication_token = yomuLabAppLocalStorageService.get_authentication_token();

      yomuLabAppService.create_annotation(source_text, annotation, article_id, selected_annotation_category, authentication_token.token).then(function(data){
        var success_response = angular.fromJson(data.data);

        // Update Article Body
        var article_body = $("p#article_content").html();
        yomuLabAppService.update_article_body(article_body, article_id).then(function(data){
          var success_response = angular.fromJson(data.data);
        }, function() {
          console.log("Service give error while updating the article content.");
        });
        $scope.message_type = "success_box";  
        $scope.message_content = success_response.response_message;      
      }, function() {
        console.log("Service give error while creating the annotation.");
        $scope.message_type = "error_box";
        $scope.message_content = "Service give error while creating the annotation.";
      });
      $("#articleHeader .response_message_box").show();
      this.fetch_article_data_at_step2(article_id);
    }else{
      var error_message = "";
      if ( article_id ==""){ error_message = "Required article is missing."; }
      else if ( selected_annotation_category == "" ){ error_message = "Please select annotation category."; } 
      else if ( annotation == "" ){ error_message = "Please add definition for selected keywords."; }
      else if ( source_text == "" ){ error_message = "Please select text from paragraph."; }
      $scope.message_type = "error_box";
      $scope.message_content = error_message;
      $("#articleHeader .response_message_box").show();
    }
    $("#selected_annotation_category").val("");
    $("#source_text").val("");
    $("#loader_icon").addClass("hidden");
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
      $("#annotationForm .annotation_button button").addClass("stepButton");
      if ( annotation_data.response_code == 404 ){
        $scope.annotation = "";
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
  $scope.save_article_translation = function(article_id, status){
    this.change_article_status_to_unpublished_from_draft(article_id, status);
    //window.location = "/admin/dashboard";
  };

  /*
  # => Get Translation Data
  */
  $scope.get_article_translation = function(article_id){
    yomuLabAppService.get_translation(article_id).then(function(data){
      var translation_data = angular.fromJson(data.data.translation);
      $scope.translation={
        title: "",
        paragraph: [],
      };
      /* Try Catch */
      //try {
        var translation_data_length = translation_data.length;
        if (translation_data_length != 'undefined'){
          
          for (var i = 0, len = translation_data_length; i < len; i++) {
            if(translation_data[i].paragraph_id==0){
              $scope.translation.title = translation_data[i].translation;
            }
            else{
              $("#paragraph_"+translation_data[i].paragraph_id).text(translation_data[i].translation);
            }
          }
        }
      // }
      // catch(err) {
      //   //document.getElementById("demo").innerHTML = err.message;
      // }
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
  $scope.change_article_status = function(article_id, status){
    yomuLabAppService.set_article_status(article_id, status).then(function(data){
      var response = angular.fromJson(data.data);
      $("div.article_message div").addClass(response.response_type);
      $("div.article_message div span").text(response.response_message);
      yomuLabAppService.hide_response_message();
      $scope.init();
    }, function() {
      console.log("Service give error while retrieving the article lists.");
    });
  };

  /*
  # => Change Article Status To Unpublished From Draft
  */
  $scope.change_article_status_to_unpublished_from_draft = function(article_id, status){
    yomuLabAppService.set_article_status(article_id, status).then(function(data){
      var response = angular.fromJson(data.data);
      $("div.article_message div").addClass(response.response_type);
      $("div.article_message div span").text(response.response_message);
      yomuLabAppService.hide_response_message();
      //$scope.init();
    }, function() {
      console.log("Service give error while retrieving the article lists.");
    });
  };

  /*
  # => Save Translation Data
  */
  $scope.store_translation = function(paragraph_id){
    var translation={
      article_id: $("#article_id").val(),
      paragraph_id: paragraph_id,
      paragraph: $('#paragraph_'+paragraph_id).val(),
    };

    yomuLabAppService.save_paragraph_translation(translation).then(function(data){
      var response = angular.fromJson(data.data);
      $("div.article_message div").addClass(response.response_type);
      $("div.article_message div span").text(response.response_message);
      $scope.message_type = response.response_type;
      $scope.message_content = response.response_message;      
    }, function() {
      var response = angular.fromJson(data.data);
      console.log("Service give error while saving article translation.");
      $("div.article_message div").addClass(response.response_type);
      $("div.article_message div span").text(response.response_message);
    });
  };

}]);
