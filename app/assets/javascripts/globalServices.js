// (function(){
//   'use strict';

  yomu_lab.service('yomuLabAppService', ["$http", '$timeout', '$q', 'yomuLabAppLocalStorageService', function($http, $timeout, $q, yomuLabAppLocalStorageService){
    this.server = {
      baseURL: 'http://localhost:3000/'
    };
    this.locale = "en";

    /*
    # => Service To Hide Alert Message
    */
    this.hide_alert_message = function(){
      setInterval( function(){
        $(".alert").fadeOut(500);
      }, 5000 );
    };

    /*
    # => Service To Hide Response Message From Article
    */
    this.hide_response_message = function(){
      setInterval( function(){
        $(".response_message_box").fadeOut(500);
      }, 5000 );
    };
    /*
    # => Service To Logged In User Data
    */
    this.get_logged_in_user = function(authentication_token){
      return $http.get("/home/user_details/"+authentication_token+".json")
        .success( function(data, status, header, config){
          var logged_in_user = data.current_user;
        })
        .error( function(data, status, header, config){
          //console.log("Service - Get Logged In User - Error");
        });
    };

    this.get_user_details = function(authentication_token){
      return $http.get("/home/current_user_details/"+authentication_token+".json")
        .success(function(data, status, header, config){
        })
        .error(function(data, status, header, config){
          //console.log("Service - Get User Details - Error");
        });
    };

    /*
    # => Register New User
    */
    this.register_new_user = function(sign_up_form, prelaunch_ref){
      sign_up_form.prelaunch_ref = prelaunch_ref;
      return $http.post("/home/register/", sign_up_form)
        .success(function(data, status) {
        });      
    };

    /*
    # => Reseet Password Link
    */
    this.get_reset_password_link = function(email){
      login_form = {
                      "user": {
                        "email": email
                      }
                    }
      return $http.post("/users/password", login_form)
        .success(function(data, status, header, config) {
        })
        .error(function(data, status, header, config){
          //console.log("Service - Forgot Password Link- Error");
        });
    };

    /*
    # => Get User Details By Reset Password Token
    */
    this.get_user_details_by_reset_password_token = function(token){
      return $http.get("/default/get_user_details_by_reset_password_token/"+token+".json")
        .success(function(data, status, header, config) {
        }).error(function(data, status, header, config){
          //console.log("Service - Get User Details By Reset Password Token - Error");
        });
    };

    /*
    # => Set New Password Using By Reset Password Token
    */
    this.set_new_password_using_token = function(reset_password_token, reset_password_form){
      new_password_details = {
                                "user": {
                                  "reset_password_token": reset_password_token,
                                  "password": reset_password_form.password,
                                  "password_confirmation": reset_password_form.password_confirmation
                                }
                              }
      return $http.put("/users/password/", new_password_details)
        .success(function(data, status, header, config) {
        }).error(function(data, status, header, config){
          //console.log("Service - Get New Password Using Token - Error");
        });
    };

    /*
    # => Confirm User Using By Confirmation Token
    */
    this.confirm_user_by_confirmation_token = function(confirmation_token){
      return $http.get("/users/confirmation?confirmation_token="+confirmation_token)
        .success(function(data, status, header, config) {
        }).error(function(data, status, header, config){
          //console.log("Service - Confirm User By Confirmation Token - Error");
        });
    };

    /*
    # => Get Referral Count of Logged In User Using By Confirmation Token
    */
    this.get_referral_count = function(authentication_token){
      return $http.get("/home/current_user_referral_count/"+authentication_token+".json")
        .success(function(data, status, header, config) {
        }).error(function(data, status, header, config){
          //console.log("Service - get_referral_count - Error");
        });
    };

    /*
    # => Show Loader
    */
    this.show_loader = function(){      
      $(".waiting-loader").find(".loader").removeClass("hidden");
    };

    /*
    # => Hide Loader
    */
    this.hide_loader = function(){      
      $(".waiting-loader").find(".loader").addClass("hidden");
    };

    /*
    # => Article Listing - Logged In User
    */
    this.get_articles_list = function(authentication_token){
      console.log("GlobalService = "+authentication_token);
      return $http.get("/articles.json?authentication_token="+authentication_token)
        .success(function(data, status, header, config) {
        }).error(function(data, status, header, config){
          //console.log("Service - get_referral_count - Error");
        });      
    };

    /*
    # => Create Article Step One - Logged In User
    */
    this.create_article_step1 = function(article, authentication_token){
      // => Fetch Authentication Token
      var authentication_token = yomuLabAppLocalStorageService.get_authentication_token();




      params_article = {
                          "article": {
                            "title": article.title,
                            "source_name": article.source_name,
                            "source_url": article.source_url,
                            "level": article.level,
                            "body": article.body,
                            "id": article.id,
                          },
                          "authentication_token": authentication_token,
                        }

      if (article.id == ""){
        return $http.post("/articles", params_article)
          .success(function(data, status, header, config) {
            console.log("Service - create article step 1 - Success");
          }).error(function(data, status, header, config){
            console.log("Service - create article step 1 - Error");
          });
      }else{
        return $http.put("/articles/"+article.id, params_article)
          .success(function(data, status, header, config) {
            console.log("Service - create article step 1 - Success");
          }).error(function(data, status, header, config){
            console.log("Service - create article step 1 - Error");
          });
      }
    };

    /*
    # => Fetch Article Step One Data - Logged In User
    */
    this.get_article_step1_data = function(article_id){
      // => Fetch Authentication Token
      var authentication_token = yomuLabAppLocalStorageService.get_authentication_token();

      return $http.get("/articles/get_article_detail/"+article_id)
        .success(function(data, status, header, config) {
          console.log("Service - fetch article step 1 - Success");
        }).error(function(data, status, header, config){
          console.log("Service - fetch article step 1 - Error");
        });      
    };

    /*
    # => Fetch Annotation Categories - Logged In User
    */
    this.get_annotation_category = function(article_id){
      return $http.get("/annotation_categories.json")
        .success(function(data, status, header, config) {
          console.log("Service - fetch_annotation_category - Success");
        }).error(function(data, status, header, config){
          console.log("Service - fetch_annotation_category - Error");
        });      
    };

}]);


/*
# => Global Service To Check Local Storage Value
*/

  yomu_lab.service('yomuLabAppLocalStorageService', ["$http",'localStorageService', function($http,localStorageService){
    this.server = {
      baseURL: 'http://localhost:3000/'
    };

    this.isSupported_or_not = function(){
      return localStorageService.isSupported;
    }

    /*
    # => Service To Check Authentication Exist
    */
    this.authentication_token_exist_or_not = function(){
      var existing_user = JSON.parse(localStorageService.get('yomu_app_token'));
      if ( existing_user==null || existing_user.token==null || existing_user.token.length == 0 ){
        window.location = "/Login";
      }else{

        if ( existing_user.remember_me == "true" ){
          var date = new Date();
          var current_time = date.setTime(date.getTime());        
          if (existing_user.token_expires_at < current_time){
            this.remove_authentication_token();
            this.authentication_token_exist_or_not();
          }
        }
        //console.log("current_time = "+current_time + "::existing_user.token_expires_at="+existing_user.token_expires_at);      
      }
    };

    /*
    # => Service To Set Authentication Inside Local Storage
    */
    this.set_authentication_token = function(authentication_token, remember_me, refresh_token){

      var date = new Date();
      var expiresAt = ""

      // 30 minutes is 30 * 60 * 1000 miliseconds. Add that to the current date to specify an expiration date 30 minutes in the future
      var minutes = 0;
      if ( remember_me == true ){ 
        minutes = 2; 
        expiresAt = date.setTime(date.getTime() + (minutes * 60 * 1000));
      }
      var yomu_app_token = { 
        'token': authentication_token, 
        'remember_me': remember_me, 
        'token_expires_at': expiresAt,
        'refresh_token': refresh_token 
      };

      // Set Authenticaiton Token Local Storage
      localStorageService.set('yomu_app_token', JSON.stringify(yomu_app_token));
    };

    /*
    # => Service To Get Authentication via Local Storage
    */
    this.get_authentication_token = function(){
      return JSON.parse(localStorageService.get('yomu_app_token'));
    };

    /*
    # => Service To Remove Authentication Local Storage
    */
    this.remove_authentication_token = function(){
      localStorageService.remove('yomu_app_token');
    };

    /*
    # => Service To Redirect The User To Tell Your Friend Page If Authentication Token Exists
    */
    this.redirect_user_to_refer_your_friends = function(){
      var authentication_token = this.get_authentication_token();
      var date = new Date();
      var current_time = date.setTime(date.getTime());
      
      if( authentication_token!=null && ( authentication_token.token!=null || authentication_token.token.length != 0 )){

        if(  authentication_token.refresh_token == true && authentication_token.token_expires_at < current_time ){
          this.remove_authentication_token();
          this.authentication_token_exist_or_not();
        }else{
          window.location = "/home/tell_your_friends";
        }
      }
    };
  }]);
/*
# => End - Global Service To Check Local Storage Value
*/

