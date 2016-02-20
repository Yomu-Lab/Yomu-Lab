var yomu_lab = angular.module('yomu_lab', [ 'Devise', 'LocalStorageModule']);

var EMAIL_REGEXP = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;
var PASSWORD_LENGTH_MINIMUM = 8;

/*
* YomuLabs Controller
*/
yomu_lab.controller('YomuLabsCtrl', ['$scope', '$http', '$window', 'yomuLabAppLocalStorageService', 'yomuLabAppService', 'Auth', function($scope, $http, $window, yomuLabAppLocalStorageService, yomuLabAppService, Auth) {

  $scope.init = function(){
    // => Hide Loader
    yomuLabAppService.hide_loader();

    $scope.message_box = "";
    if(yomuLabAppLocalStorageService.isSupported_or_not){
      //console.log("LocalStorage isSupported");
    }else{
      //console.log("LocalStorage NOT Supported");
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
    //console.log("redirect_user_to_refer_your_friends");
    yomuLabAppLocalStorageService.redirect_user_to_refer_your_friends();
  };
  
  $scope.submit_credentials = function(loginForm){
    // => Show Loader
    yomuLabAppService.show_loader();

    // Empty the Error Message Box
    $scope.message_box = "";
    $scope.message_box = check_input_for_login(loginForm);
    if ( $scope.message_box != "" ){
      $scope.message_type = "error";
      // => Hide Loader
      yomuLabAppService.hide_loader();
      return false;
    }

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
      if(error.data.error!=""){
        $scope.message_box = error.data.error;
      }
      // => Hide Loader
      yomuLabAppService.hide_loader();

    });

    $scope.$on('devise:login', function(event, currentUser) {
      window.location = "/home/tell_your_friends";
    });

    $scope.$on('devise:new-session', function(event, currentUser) { });
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
      yomuLabAppLocalStorageService.remove_authentication_token();
      yomuLabAppLocalStorageService.authentication_token_exist_or_not();
    }, function(error) {
        //console.log("Error occurred while logout.");
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

  $scope.submit_sign_up_details = function(sign_up_form, prelaunch_ref){    
    /*
      => Empty the Error Message Box
    */    

    // => Show Loader
    yomuLabAppService.show_loader();

    $scope.message_box = "";
    $scope.message_box = check_input_for_signup(sign_up_form);
    if ( $scope.message_box != "" ){ 
      $scope.message_type = "error";
      // => Hide Loader
      yomuLabAppService.hide_loader();
      return false; 
    }

    var logged_in_user = "";
    yomuLabAppService.register_new_user(sign_up_form, prelaunch_ref).then(function(data) {

      if (data.data.current_user == false){
        // Remove Authenticaiton Token Local Storage
        yomuLabAppLocalStorageService.remove_authentication_token();
        $scope.message_type = "error";
        $scope.message_box = data.data.response_message;
        // => Hide Loader
        yomuLabAppService.hide_loader();
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
        yomuLabAppLocalStorageService.set_authentication_token(logged_in_user.authentication_token, sign_up_form.remember_me, logged_in_user.refresh_token);

        // Redirect User To Tell Your Friends Page after Successful SignUp
        $window.location = "/home/tell_your_friends";
      }
    }, function() {
      // => Hide Loader
      yomuLabAppService.hide_loader();

      $scope.message_type = "error";
      $scope.message_box = "Service gives error while creating new user.";
    });
  }
}]);

yomu_lab.controller('DashboardCtrl', ['$scope', '$http', '$window', 'yomuLabAppLocalStorageService','yomuLabAppService', function($scope, $http, $window, yomuLabAppLocalStorageService, yomuLabAppService) {

  $scope.init = function(token){
    var logged_in_user = "";
    if (token != ""){      
      // Fetch User Details From User Table
      authentication_token = { "token": token }

      yomuLabAppService.get_user_details(token).then(function(data) {
        var logged_in_user = angular.fromJson(data.data.current_user);
        yomuLabAppLocalStorageService.set_authentication_token(logged_in_user.authentication_token, false, logged_in_user.refresh_token);
        
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
          authentication_token: logged_in_user.authentication_token,
          referral_url: logged_in_user.referral_url,
        };
        $scope.referral_url = logged_in_user.referral_url;
      }, function() {
        //console.log("Service give error while retrieving the user details.");
      });
    }
    else{

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
          authentication_token: logged_in_user.authentication_token,
          referral_url: logged_in_user.referral_url,
        };
        $scope.referral_url = logged_in_user.referral_url;
      }, function() {
        //console.log("Service give error while retrieving the user details.");
      });
    }

    //  => Message Success
    $scope.message_type = "alert-success";

    yomuLabAppService.get_referral_count(authentication_token.token).then(function(data) {
      $scope.referral_count = angular.fromJson(data.data.referral_count);
    }, function() {
      //console.log("Service give error while retrieving the referral_code.");
    });
  }

}]);


yomu_lab.controller('YomuLabsDefaultCtrl', ['$scope', '$http', '$window', 'yomuLabAppLocalStorageService', 'yomuLabAppService', function($scope, $http, $window, yomuLabAppLocalStorageService, yomuLabAppService) {

  $scope.init = function(){
    yomuLabAppLocalStorageService.redirect_user_to_refer_your_friends();    
  }

  $scope.set_forgot_password_page = function(){
    $scope.message_box = "";
  }

  $scope.forgot_password = function(email){    
    /*
      => Check Email Valid Or Not
    */
    // => Show Loader
    yomuLabAppService.show_loader();

    // Empty the Error Message Box
    $scope.message_box = "";
    $scope.message_box = check_input_for_forgot_password(email);
    if ( $scope.message_box != "" ){
      $scope.message_type = "error";
      // => Hide Loader
      yomuLabAppService.hide_loader();
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
      $scope.redirect_page_to_sign_in_page();
      // => Hide Loader
      yomuLabAppService.hide_loader();
    }, function() {
      // => Hide Loader
      yomuLabAppService.hide_loader();

      $scope.message_type = "error";
      $scope.message_box = "Service gives error while retrieving password link.";
      //console.log("Service give error while retrieving password link.");
    });
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
      $scope.redirect_page_to_sign_in_page();
    }, function() {
      //console.log("Service give error while fetch_user_by_confirmation_token.");
    });
  };

}])
//;

/*
yomu_lab.config(function(AuthProvider) {
  AuthProvider.logoutPath('/users/sign_out.json');
  AuthProvider.logoutMethod('DELETE');
});
*/


yomu_lab.filter('create_input_box_with_ng_model', ['$sce', function($sce) {
  return function(text) {
    try {
      var new_text="";
      var text_array = text.split('\n');
      $.each(text_array, function(index, value) {
        if (value!=""){
          var paragraph_id = index+1;
          //var translation_input_box = '<div class="form-group"><textarea class="form-control translatedText" ng-model="translation.paragraph['+paragraph_id+']" id="paragraph_'+paragraph_id+'" placeholder="Enter Translation");>{{translation.paragraph['+paragraph_id+']}}</textarea></div>';
          //var translation_input_box = '<div class="form-group"><textarea class="form-control translatedText" ng-model="translation.paragraph['+paragraph_id+']" id="paragraph_'+paragraph_id+'" placeholder="Enter Translation" ng-blur=doneEditing("paragraph_'+paragraph_id+'");>{{translation.paragraph['+paragraph_id+']}}</textarea></div>';
          var translation_input_box = '<div class="form-group"><textarea class="form-control translatedText" ng-model="translation.paragraph['+paragraph_id+']" id="paragraph_'+paragraph_id+'" placeholder="Enter Translation" ng-blur="store_translation('+paragraph_id+');" ></textarea></div>';
          new_text +=value+translation_input_box;
        }
      });
      return $sce.trustAsHtml(new_text);
    }
    catch(err) {
      //catchCode - Block of code to handle errors
    }
  }
}]);

yomu_lab.run(['yomuLabAppService', function(yomuLabAppService) {
  yomuLabAppService.hide_alert_message();
  yomuLabAppService.hide_response_message();
}]);

yomu_lab.directive('compile', ['$compile', '$timeout', function($compile, $timeout){
  return{
    restrict:'A',
    link: function(scope,elem,attrs){
      $timeout(function(){                
        $compile(elem.contents())(scope);
      });
    }        
  };
}]);

// => Blur directive
/*
yomu_lab.directive('myBlur', ['$scope', function ($scope) {
  return {
    restrict: 'A',
    link: function (scope, element, attr) {
      element.bind('blur', function () {
        //apply scope (attributes)
        scope.$apply(attr.myBlur);
        //return scope value for focusing to false
        scope.$eval(attr.myFocus + '=false');
      });
    }
  };
}]);
*/