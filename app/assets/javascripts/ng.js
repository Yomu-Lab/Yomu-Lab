var yomu_lab = angular.module('yomu_lab', [ 'Devise', 'ngCookies' ]);

var EMAIL_REGEXP = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;
var PASSWORD_LENGTH_MINIMUM = 8;

/*
* YomuLabs Controller
*/
yomu_lab.controller('YomuLabsCtrl', ['$scope', '$http', '$window', '$cookies', 'yomuLabAppService', 'Auth', function($scope, $http, $window, $cookies, yomuLabAppService, Auth) {

  $scope.init = function(){
    $scope.message_box = "";
    //console.log("init method");
    //loginForm = {};
  }
  
  $scope.submit_credentials = function(loginForm){
    // Empty the Error Message Box
    $scope.message_box = "";
    $scope.message_box = check_input_for_login(loginForm, loginForm.email, loginForm.password);
    if ( $scope.message_box != "" ){
      $scope.message_type = "error";
      return false;
    }
    var config = {
      headers: {
        'X-HTTP-Method-Override': 'POST'
      }
    };
    Auth.login(loginForm, config).then(function(user) {
      // Setting a cookie       
      $cookies.put('yomu_app_token', user.authentication_token);
    }, function(error) {
      //$cookies.remove('yomu_app_token');
      $cookies.yomu_app_token = undefined;
      /*
      =>  Authentication Failed
      */
      $scope.message_type = "error";
      $scope.message_box = "Invalid Email and Password. Please try again.";
    });

    $scope.$on('devise:login', function(event, currentUser) {
      console.log("current_user = "+currentUser);
      var landingUrl = "http://" + $window.location.host + "/home/tell_your_friends";
      $window.location.href = landingUrl;       // after a login, a hard refresh, a new tab
    });

    $scope.$on('devise:new-session', function(event, currentUser) {
      console.log("current_user = "+currentUser);
      // user logged in by Auth.login({...})
    });
  }

  $scope.forgot_password = function(loginForm){    
    /*
      => Check Email Valid Or Not
    */
    var config = {
      headers: {
        'X-HTTP-Method-Override': 'POST'
      }
    };

    // Empty the Error Message Box
    $scope.message_box = "";
    $scope.message_box = check_input_for_forgot_password(loginForm.email);
    if ( $scope.message_box != "" ){
      $scope.message_type = "error";
      return false;
    }

    /*
      => Reset Password Link - To Email
    */
    yomuLabAppService.get_reset_password_link(loginForm, config).then(function(data) {
      $scope.message_type = "success";
      $scope.message_box = data.data.response_message;
      //console.log("forgot_password - message_box = "+$scope.message_box);
    }, function() {
      $scope.message_type = "error";
      $scope.message_box = "Service gives error while retrieving password link.";
      //console.log("Service give error while retrieving password link.");
    });
  }

}]);

/*
* YomuLabsSignOutCtrl Controller
*/
yomu_lab.controller('YomuLabsSignOutCtrl', ['$scope', '$http', '$window', '$cookies', function($scope, $http, $window, $cookies) {
  $scope.init = function(){
    $scope.message_box = "";
  }
  $scope.init();

  $scope.sign_out = function(){    
    $cookies.remove('yomu_app_token');
    var landingUrl = "http://" + $window.location.host + "/Login";
    $window.location.href = landingUrl;       // after a login, a hard refresh, a new tab
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
    if ( $scope.message_box != "" ){ 
      $scope.message_type = "error";
      return false; 
    }

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
      $scope.message_type = "error";
      $scope.message_box = "Service gives error while creating new user.";
      //console.log("Service give error while creating new user.");
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
      //console.log("current_user-email="+$scope.current_user.email);
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
    yomuLabAppService.get_user_details_by_reset_password_token(reset_password_token).then(function(data) {
      logged_in_user = angular.fromJson(data.data.current_user);

      if (logged_in_user == null){
        // Pass invalid token message - Some error code
        $cookies.put('yomu_app_token', "");
        var landingUrl = "http://" + $window.location.host + "/Login";
        $window.location.href = landingUrl;
      }else{
        $scope.current_user_email = logged_in_user.email;
        $scope.current_user_name = logged_in_user.first_name +" "+logged_in_user.last_name;
      }
    }, function() {
      console.log("Service give error while retrieving the user details at reset password token.");
    });
  }

  $scope.set_new_password_using_token = function(reset_password_token, reset_password_form){
    // Empty the Error Message Box
    $scope.message_box = "";
    $scope.message_box = check_input_for_reset_password_token(reset_password_token, reset_password_form);
    if ( $scope.message_box != "" ){ 
      $scope.message_type = "error";
      return false;
    }

    yomuLabAppService.set_new_password_using_token(reset_password_token, reset_password_form).then(function(data) {
      $scope.message_type = "success";
      $scope.message_box = data.data.response_message;
    }, function() {
      console.log("Service give error while setting new password.");
    });
  }

}]);
