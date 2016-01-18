var yomu_lab = angular.module('yomu_lab', [ 'Devise', 'LocalStorageModule' ]);

var EMAIL_REGEXP = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;
var PASSWORD_LENGTH_MINIMUM = 8;

/*
* YomuLabs Controller
*/
yomu_lab.controller('YomuLabsCtrl', ['$scope', '$http', '$window', 'yomuLabAppLocalStorageService', 'yomuLabAppService', 'Auth', function($scope, $http, $window, yomuLabAppLocalStorageService, yomuLabAppService, Auth) {

  $scope.init = function(){
    $scope.message_box = "";
    if(yomuLabAppLocalStorageService.isSupported_or_not){
      console.log("LocalStorage isSupported");
    }else{
      console.log("LocalStorage NOT Supported");
    }
    $scope.loginForm = {
      remember_me : true
    };
  };

  $scope.set_remember_me = function(){
    if ($scope.loginForm.remember_me == true){
      $scope.loginForm.remember_me = false;
    }
  };

  /*
  # => Service To Redirect The User To Tell Your Friend Page If Authentication Token Exists
  */
  $scope.redirect_user_to_refer_your_friends = function(){
    console.log("redirect_user_to_refer_your_friends");
    yomuLabAppLocalStorageService.redirect_user_to_refer_your_friends();
  };
  
  $scope.submit_credentials = function(loginForm){
    // Empty the Error Message Box
    $scope.message_box = "";
    $scope.message_box = check_input_for_login(loginForm);
    if ( $scope.message_box != "" ){
      $scope.message_type = "error";
      return false;
    }
    //return false;
    var config = {
      headers: {
        'X-HTTP-Method-Override': 'POST'
      }
    };
    Auth.login(loginForm, config).then(function(user) {
      // Remove Authenticaiton Token Local Storage
      yomuLabAppLocalStorageService.remove_authentication_token();

      // Set Remember Me
      $scope.remember_me = loginForm.remember_me;

      // Set Authenticaiton Token Local Storage
      yomuLabAppLocalStorageService.set_authentication_token(user.authentication_token, $scope.remember_me, user.refresh_token);


    }, function(error) {
      // Remove Authenticaiton Token Local Storage
      yomuLabAppLocalStorageService.remove_authentication_token();
      /*
      =>  Authentication Failed
      */
      $scope.message_type = "error";
      $scope.message_box = "Invalid Email and Password. Please try again.";
    });

    $scope.$on('devise:login', function(event, currentUser) {
      window.location = "/home/tell_your_friends";
    });

    $scope.$on('devise:new-session', function(event, currentUser) { });
  }

  $scope.forgot_password = function(email){    
    /*
      => Check Email Valid Or Not
    */
    // Empty the Error Message Box
    $scope.message_box = "";
    $scope.message_box = check_input_for_forgot_password(email);
    if ( $scope.message_box != "" ){
      $scope.message_type = "error";
      return false;
    }

    /*
      => Reset Password Link - To Email
    */
    var config = {
      headers: {
        'X-HTTP-Method-Override': 'POST'
      }
    };
    yomuLabAppService.get_reset_password_link(email, config).then(function(data) {
      $scope.message_type = data.data.response_type;
      $scope.message_box = data.data.response_message;
      console.log("forgot_password - message_box = "+$scope.message_box);
    }, function() {
      $scope.message_type = "error";
      $scope.message_box = "Service gives error while retrieving password link.";
      console.log("Service give error while retrieving password link.");
    });
  }

}]);

/*
* YomuLabsSignOutCtrl Controller
*/
yomu_lab.controller('YomuLabsSignOutCtrl', ['$scope', '$http', '$window', 'yomuLabAppLocalStorageService', 'Auth', function($scope, $http, $window, yomuLabAppLocalStorageService, Auth) {
  $scope.init = function(){
    $scope.message_box = "";
  }

  $scope.sign_out = function(){
    var config = {
      headers: {
        'X-HTTP-Method-Override': 'DELETE'
      }
    };

    Auth.logout(config).then(function() {
      console.log("you're signed out now.");
      yomuLabAppLocalStorageService.remove_authentication_token();
      yomuLabAppLocalStorageService.authentication_token_exist_or_not();
    }, function(error) {
        // An error occurred logging out.
        console.log("Error occurred while logout.");
    });

    $scope.$on('devise:logout', function(event, oldCurrentUser) {
        // ...
    });
  }
}]);

/*
* YomuLabsSignUpCtrl Controller
*/
yomu_lab.controller('YomuLabsSignUpCtrl', ['$scope', '$http', '$window', 'yomuLabAppLocalStorageService', 'yomuLabAppService', 'Auth', function($scope, $http, $window, yomuLabAppLocalStorageService, yomuLabAppService, Auth) {
  $scope.init = function(referral_code){
    $scope.message_box = "";
    $scope.referral_code = referral_code;
    yomuLabAppLocalStorageService.redirect_user_to_refer_your_friends();
  }
  //$scope.init();

  $scope.submit_sign_up_details = function(sign_up_form, prelaunch_ref){    
    /*
      => Empty the Error Message Box
    */    
    $scope.message_box = "";
    $scope.message_box = check_input_for_signup(sign_up_form);
    if ( $scope.message_box != "" ){ 
      $scope.message_type = "error";
      return false; 
    }

    var logged_in_user = "";
    yomuLabAppService.register_new_user(sign_up_form, prelaunch_ref).then(function(data) {

      if (data.data.current_user == false){
        // Remove Authenticaiton Token Local Storage
        yomuLabAppLocalStorageService.remove_authentication_token();
        $scope.message_type = "error";
        $scope.message_box = data.data.response_message;
      }
      else
      {
        logged_in_user = angular.fromJson(data.data.current_user);
        $scope.message_type = "success";
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

        // Set Authenticaiton Token Local Storage
        //yomuLabAppLocalStorageService.set_authentication_token(logged_in_user.authentication_token);
        yomuLabAppLocalStorageService.set_authentication_token(logged_in_user.authentication_token, sign_up_form.remember_me, logged_in_user.refresh_token);

        // Redirect User To Tell Your Friends Page after Successful SignUp
        $window.location = "/home/tell_your_friends";
      }
    }, function() {
      $scope.message_type = "error";
      $scope.message_box = "Service gives error while creating new user.";
    });
  }
}]);

yomu_lab.controller('DashboardCtrl', ['$scope', '$http', '$window', 'yomuLabAppLocalStorageService','yomuLabAppService', function($scope, $http, $window, yomuLabAppLocalStorageService, yomuLabAppService) {

  $scope.init = function(token){
    if (token != ""){      
      // Fetch User Details From User Table
      authentication_token = { "token": token }

      yomuLabAppService.get_user_details(token).then(function(data) {
        logged_in_user = angular.fromJson(data.data.current_user);
        yomuLabAppLocalStorageService.set_authentication_token(logged_in_user.authentication_token, false, logged_in_user.refresh_token);
        //console.log("logged_in_user = "+logged_in_user);
      }, function() {
        //console.log("Service give error while retrieving the user details.");
      });
    }

    // => Fetch Authentication Token
    var authentication_token = yomuLabAppLocalStorageService.get_authentication_token();
    
    // => Check Authentication Token Exist Or Not
    yomuLabAppLocalStorageService.authentication_token_exist_or_not();

    var logged_in_user = "";

    yomuLabAppService.get_user_details(authentication_token.token).then(function(data) {
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
        referral_code: logged_in_user.referral_code,
        authentication_token: logged_in_user.authentication_token
      };
      $scope.referral_url = "https://yomu-lab-staging.herokuapp.com/SignUp?prelaunch_ref="+logged_in_user.referral_code;
    }, function() {
      //console.log("Service give error while retrieving the user details.");
    });

    //  => Message Success
    $scope.message_type = "alert-success";

    yomuLabAppService.get_referral_count(authentication_token.token).then(function(data) {
      $scope.referral_count = angular.fromJson(data.data.referral_count);
    }, function() {
      //console.log("Service give error while retrieving the referral_code.");
    });
  }

}]);


yomu_lab.controller('YomuLabsDefaultCtrl', ['$scope', '$http', '$window', 'localStorageService', 'yomuLabAppService', function($scope, $http, $window, localStorageService, yomuLabAppService) {

  $scope.init = function(){
    yomuLabAppLocalStorageService.redirect_user_to_refer_your_friends();
  }

  $scope.fetch_user_by_token = function(reset_password_token){
    yomuLabAppService.get_user_details_by_reset_password_token(reset_password_token).then(function(data) {
      logged_in_user = angular.fromJson(data.data.current_user);

      if (logged_in_user == null){
        yomuLabAppLocalStorageService.remove_authentication_token();
        yomuLabAppLocalStorageService.authentication_token_exist_or_not();
      }else{
        $scope.current_user_email = logged_in_user.email;
        $scope.current_user_name = logged_in_user.first_name +" "+logged_in_user.last_name;
      }
    }, function() {
      //console.log("Service give error while retrieving the user details at reset password token.");
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
      $scope.redirect_page_to_sign_in_page();
      $scope.message_box = data.data.response_message;
    }, function() {
      //console.log("Service give error while setting new password.");
    });
  }

  $scope.redirect_page_to_sign_in_page = function(){
    var seconds = 5;
    $scope.remaining_seconds = seconds;
    setInterval(function () {
      seconds--;
      $scope.remaining_seconds = seconds;
      if (seconds == 0) {
        // Remove Authenticaiton Token Local Storage
        yomuLabAppLocalStorageService.remove_authentication_token();
        window.location = "/Login";
      }
    }, 1000);
  }

  $scope.fetch_user_by_confirmation_token = function(confirmation_token){
    yomuLabAppService.confirm_user_by_confirmation_token(confirmation_token).then(function(data) {
      $scope.message_type = data.data.response_type;
      $scope.message_box = data.data.response_message;
    }, function() {
      //console.log("Service give error while fetch_user_by_confirmation_token.");
    });
  };

}]);

/*
yomu_lab.config(function(AuthProvider) {
  AuthProvider.logoutPath('/users/sign_out.json');
  AuthProvider.logoutMethod('DELETE');
});
*/