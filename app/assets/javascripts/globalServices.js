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
  }]);

// })();

