(function(){
  'use strict';

  yomu_lab.service('yomuLabApp', ["$http", '$timeout', function($http, $timeout) {
    this.server = {
      baseURL: 'http://localhost:3000/'
    };

    //this.user = {id: 10};

    //this.token = "aabf7016be848f4ee05db565bd148896";
    this.locale = "en";
    //this.currentUser = "";

    // this.current_user = {
    //   user_id: "",
    //   email: "",
    //   authentication_token: "",
    //   first_name: "",
    //   last_name: "",
    //   ui_language: "",
    //   original_language: "",
    //   target_language: "",
    //   open_id: "",
    //   level: ""
    // };

    /*
    # => Service To Logged In User Data
    */
    this.get_logged_in_user = function(authentication_token){
      console.log("get_logged_in_user - enter");
      return $http.get("/home/user_details/"+authentication_token+".json").
        success( function(data, status, header, config){

          var logged_in_user = data.current_user;
          console.log("get_logged_in_user - Success"+data);

          yomuLabApp.current_user = {
            user_id: logged_in_user.id,
            email: logged_in_user.email,
            authentication_token: logged_in_user.authentication_token,
            first_name: logged_in_user.first_name,
            last_name: logged_in_user.last_name,
            ui_language: logged_in_user.ui_language,
            original_language: logged_in_user.original_language,
            target_language: logged_in_user.target_language,
            open_id: logged_in_user.open_id,
            level: logged_in_user.level
          };

        }).
        error( function(data, status, header, config){
          console.log("get_logged_in_user - Error");
        });
    };
    // this.preferred_language = function(navigator){
    //   console.log("navigator.language="+navigator.language);
    //   return navigator.language;
    // };

    /*
    this.getApiURL = function(query) {
      return (this.server.baseURL + query);
    };

    this.setLocale = function(locale) {
      this.locale = locale;
    };
    */

  }]);

})();