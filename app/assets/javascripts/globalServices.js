// (function(){
//   'use strict';

  yomu_lab.service('yomuLabAppService', ["$http", '$timeout', function($http, $timeout){
    this.server = {
      baseURL: 'http://localhost:3000/'
    };

    this.locale = "en";

    /*
    # => Service To Logged In User Data
    */
    this.get_logged_in_user = function(authentication_token){
      console.log("get_logged_in_user - enter");
      return $http.get("/home/user_details/"+authentication_token+".json").
        success( function(data, status, header, config){
          var logged_in_user = data.current_user;
          console.log("get_logged_in_user - Success"+data);
        }).
        error( function(data, status, header, config){
          console.log("get_logged_in_user - Error");
        });
    };

    this.get_user_details = function(authentication_token){
      return $http.get("/home/current_user_details/"+authentication_token+".json").success(function(data, status, header, config){
        console.log("get_user_details - success");
      }).error(function(data, status, header, config){
        console.log("get_user_details - Error");
      });
    };

    /*
    # => Register New User
    */
    this.register_new_user = function(sign_up_form){
      return $http.post("/home/register/", sign_up_form).success(function(data, status) {
        console.log("test - "+data);
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
        console.log("forgot password link - Success");
      }).error(function(data, status, header, config){
        console.log("forgot password link - Error");
      });
    };

    /*
    # => Get User Details By Reset Password Token
    */
    this.get_user_details_by_reset_password_token = function(token){
      /*
      login_form = {
                      "user": {
                        "email": login_form.email
                      }
                    }
      */
      return $http.get("/default/get_user_details_by_reset_password_token/"+token+".json").success(function(data, status, header, config) {
        console.log("get_user_details_by_reset_password_token - Success");
      }).error(function(data, status, header, config){
        console.log("get_user_details_by_reset_password_token - Error");
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
        console.log("set_new_password_using_token - Success");
      }).error(function(data, status, header, config){
        console.log("set_new_password_using_token - Error");
      });
    };

    /*
    # => Confirm User Using By Confirmation Token
    */
    this.confirm_user_by_confirmation_token = function(confirmation_token){
      return $http.get("/users/confirmation?confirmation_token="+confirmation_token).success(function(data, status, header, config) {
        console.log("confirm_user_by_confirmation_token - Success");
      }).error(function(data, status, header, config){
        console.log("confirm_user_by_confirmation_token - Error");
      });
    };

  }]);

// })();
