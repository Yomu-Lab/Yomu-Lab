// (function(){
//   'use strict';

  yomu_lab.service('yomuLabAppService', ["$http", '$timeout', '$q', function($http, $timeout, $q){
    this.server = {
      baseURL: 'http://localhost:3000/'
    };

    this.locale = "en";

    /*
    # => Service To Logged In User Data
    */
    this.get_logged_in_user = function(authentication_token){
      console.log("Service - Get Logged In User - Enter");
      return $http.get("/home/user_details/"+authentication_token+".json").
        success( function(data, status, header, config){
          var logged_in_user = data.current_user;
          console.log("Service - Get Logged In User - Enter - Success "+data);
        }).
        error( function(data, status, header, config){
          console.log("Service - Get Logged In User - Error");
        });
    };

    this.get_user_details = function(authentication_token){
      return $http.get("/home/current_user_details/"+authentication_token.token+".json").success(function(data, status, header, config){
        console.log("Service - Get User Details - Enter - success");
      }).error(function(data, status, header, config){
        console.log("Service - Get User Details - Error");
      });
    };

    /*
    # => Register New User
    */
    this.register_new_user = function(sign_up_form, prelaunch_ref){
      sign_up_form.prelaunch_ref = prelaunch_ref;
      return $http.post("/home/register/", sign_up_form).success(function(data, status) {
        console.log("Service - Register New User - "+data);
      });      
    };

    /*
    # => Register New User
    */
    this.get_reset_password_link = function(email){
      login_form = {
                      "user": {
                        "email": email
                      }
                    }
      return $http.post("/users/password", login_form).success(function(data, status, header, config) {
        console.log("Service - Forgot Password Link - Success");
      }).error(function(data, status, header, config){
        console.log("Service - Forgot Password Link- Error");
      });
    };

    /*
    # => Get User Details By Reset Password Token
    */
    this.get_user_details_by_reset_password_token = function(token){
      return $http.get("/default/get_user_details_by_reset_password_token/"+token+".json").success(function(data, status, header, config) {
        console.log("Service - Get User Details By Reset Password Token - Success");
      }).error(function(data, status, header, config){
        console.log("Service - Get User Details By Reset Password Token - Error");
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
      return $http.put("/users/password/", new_password_details).success(function(data, status, header, config) {
        console.log("Service - Get New Password Using Token - Success");
      }).error(function(data, status, header, config){
        console.log("Service - Get New Password Using Token - Error");
      });
    };

    /*
    # => Confirm User Using By Confirmation Token
    */
    this.confirm_user_by_confirmation_token = function(confirmation_token){
      return $http.get("/users/confirmation?confirmation_token="+confirmation_token).success(function(data, status, header, config) {
        console.log("Service - Confirm User By Confirmation Token - Success");
      }).error(function(data, status, header, config){
        console.log("Service - Confirm User By Confirmation Token - Error");
      });
    };

    /*
    # => Get Referral Count of Logged In User Using By Confirmation Token
    */
    this.get_referral_count = function(authentication_token){
      return $http.get("/home/current_user_referral_count/"+authentication_token+".json").success(function(data, status, header, config) {
        console.log("Service - Confirm User By Confirmation Token - Success");
      }).error(function(data, status, header, config){
        console.log("Service - Confirm User By Confirmation Token - Error");
      });
    };

  }]);

/*
# => Global Service To Check Local Storage Value
*/
  yomu_lab.service('yomuLabAppLocalStorageService', ['localStorageService', function(localStorageService){

    this.isSupported_or_not = function(){
      this.authentication_token_exist_or_not();
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
        var date = new Date();
        var current_time = date.setTime(date.getTime());
        //console.log("current_time = "+current_time + "::existing_user.token_expires_at="+existing_user.token_expires_at);

        if (existing_user.token_expires_at < current_time){
          this.remove_authentication_token();
          this.authentication_token_exist_or_not();
        }
      }
    };

    /*
    # => Service To Set Authentication Inside Local Storage
    */
    this.set_authentication_token = function(authentication_token, remember_me){

      var date = new Date();

      // 30 minutes is 30 * 60 * 1000 miliseconds. Add that to the current date to specify an expiration date 30 minutes in the future
      var minutes = 120;
      if (remember_me == true){
        minutes = 30;
      }
      var expiresAt = date.setTime(date.getTime() + (minutes * 60 * 1000));
      var yomu_app_token = { 'token': authentication_token, 'remember_me': remember_me, 'token_expires_at': expiresAt };

      // Set Authenticaiton Token Local Storage
      localStorageService.set('yomu_app_token', JSON.stringify(yomu_app_token));
      this.authentication_token_exist_or_not();
    };

    /*
    # => Service To Get Authentication via Local Storage
    */
    this.get_authentication_token = function(){
      var logged_in_token = JSON.parse(localStorageService.get('yomu_app_token'));
      console.log("Local Storage Token ="+logged_in_token);
      return logged_in_token;
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
      //console.log("current_time = "+current_time + "::existing_user.token_expires_at="+authentication_token.token_expires_at);
      
      if( authentication_token!=null && ( authentication_token.token!=null || authentication_token.token.length != 0 )){
        if( authentication_token.token_expires_at < current_time ){
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

