var yomu_lab = angular.module('yomu_lab', [ 'Devise', 'ngCookies' ]);

var EMAIL_REGEXP = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;
var PASSWORD_LENGTH_MINIMUM = 8;

/*
* YomuLabs Controller
*/
yomu_lab.controller('YomuLabsCtrl', ['$scope', '$http', '$window', '$cookies', 'yomuLabAppService', 'Auth', function($scope, $http, $window, $cookies, yomuLabAppService, Auth) {

  $scope.init = function(){
    $scope.message_box = "";
    console.log("init method");
    //loginForm = {};
  }
  
  $scope.submit_credentials = function(loginForm){
    // Empty the Error Message Box
    $scope.message_box = "";
    $scope.message_box = check_input_for_login(loginForm, loginForm.email, loginForm.password);
    if ( $scope.message_box != "" ){ return false; }
    var config = {
      headers: {
        'X-HTTP-Method-Override': 'POST'
      }
    };
    Auth.login(loginForm, config).then(function(user) {
      // Setting a cookie       
      $cookies.put('yomu_app_token', user.authentication_token);
    }, function(error) {
      console.log("Auth failed");       // Authentication failed...
    });

    $scope.$on('devise:login', function(event, currentUser) {
      var landingUrl = "http://" + $window.location.host + "/home/tell_your_friends";
      $window.location.href = landingUrl;       // after a login, a hard refresh, a new tab
    });

    $scope.$on('devise:new-session', function(event, currentUser) {
      // user logged in by Auth.login({...})
    });
  }

  $scope.forgot_password = function(loginForm){    
    /*
      => Check Email Valid Or Not
    */
    $scope.message_box = check_input_for_forgot_password(loginForm.email);
    if ( $scope.message_box != "" ){ return false; }
    /*
      => Reset Password Link - To Email
    */
    yomuLabAppService.get_reset_password_link(loginForm).then(function(data) {
      $scope.message_box = data.data.response_message;
    }, function() {
      console.log("Service give error while retrieving password link.");
    });
  }

}]);

/*
* YomuLabsSignUpCtrl Controller
*/
yomu_lab.controller('YomuLabsSignUpCtrl', ['$scope', '$http', '$window', '$cookies', 'yomuLabAppService', 'Auth', function($scope, $http, $window, $cookies, yomuLabAppService, Auth) {
  $scope.init = function(){
    $scope.message_box = "";
  }
  $scope.init();

  $scope.submit_sign_up_details = function(sign_up_form){    
    // Empty the Error Message Box
    $scope.message_box = "";
    $scope.message_box = check_input_for_signup(sign_up_form);
    if ( $scope.message_box != "" ){ return false; }

    var logged_in_user = "";

    yomuLabAppService.register_new_user(sign_up_form).then(function(data) {

      if (data.data.current_user == false){
        $cookies.remove("yomu_app_token");
        $scope.message_box = data.data.response_message;
      }
      else{

        logged_in_user = angular.fromJson(data.data.current_user);
        $scope.message_box = data.data.response_message;

        $scope.current_user = {
          email: logged_in_user.email,
          first_name: logged_in_user.first_name,
          last_name: logged_in_user.last_name,
          id: logged_in_user.id,
          level: logged_in_user.level,
          original_language: logged_in_user.original_language,
          provider: logged_in_user.provider,
          target_language: logged_in_user.target_language,
          ui_language: logged_in_user.ui_language,
          unconfirmed_email: logged_in_user.unconfirmed_email,
          authentication_token: logged_in_user.authentication_token
        };

        $cookies.put('yomu_app_token', $scope.current_user.authentication_token);
        var landingUrl = "http://" + $window.location.host + "/home/tell_your_friends";
        $window.location.href = landingUrl;       // after a login, a hard refresh, a new tab
      }
    }, function() {
      console.log("Service give error while creating new user.");
    });
  }
}]);

yomu_lab.controller('DashboardCtrl', ['$scope', '$http', '$window', '$cookies', 'yomuLabAppService', 'Auth', function($scope, $http, $window, $cookies, yomuLabAppService, Auth) {

  $scope.init = function(token){
    if (token != ""){
      $cookies.put('yomu_app_token', token);
    }
    var authentication_token = $cookies.get('yomu_app_token');
    var logged_in_user = "";

    yomuLabAppService.get_user_details(authentication_token).then(function(data) {
      logged_in_user = angular.fromJson(data.data.current_user);
      $scope.message_box = data.data.response_message;

      $scope.current_user = {
        email: logged_in_user.email,
        first_name: logged_in_user.first_name,
        last_name: logged_in_user.last_name,
        id: logged_in_user.id,
        level: logged_in_user.level,
        original_language: logged_in_user.original_language,
        provider: logged_in_user.provider,
        target_language: logged_in_user.target_language,
        ui_language: logged_in_user.ui_language,
        unconfirmed_email: logged_in_user.unconfirmed_email
      };
      console.log("current_user-email="+$scope.current_user.email);
    }, function() {
      console.log("Service give error while retrieving the user details.");
    });
  }

  $scope.init();

}]);


yomu_lab.controller('YomuLabsDefaultCtrl', ['$scope', '$http', '$window', '$cookies', 'yomuLabAppService', 'Auth', function($scope, $http, $window, $cookies, yomuLabAppService, Auth) {

  $scope.init = function(){
    //console.log("YomuLabsDefaultCtrl - init");
  }

  //$scope.init();
  $scope.fetch_user_by_token = function(reset_password_token){
    //console.log("YomuLabsDefaultCtrl - set_token");

    yomuLabAppService.get_user_details_by_reset_password_token(reset_password_token).then(function(data) {
      logged_in_user = angular.fromJson(data.data.current_user);
      $scope.current_user_email = logged_in_user.email;
      $scope.current_user_name = logged_in_user.first_name +" "+logged_in_user.last_name;

      //console.log("current_user-email="+$scope.current_user_email);
    }, function() {
      console.log("Service give error while retrieving the user details at reset password token.");
    });


  }



}]);
