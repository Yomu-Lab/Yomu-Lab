var yomu_lab = angular.module('yomu_lab', ["angular.filter","ngRoute", "Devise" ]);

yomu_lab.controller('YomuLabsCtrl', ['$scope', '$http', '$window', 'Auth', 'yomuLabApp', function($scope, $http, $window, Auth, yomuLabApp) {

  $scope.init = function(){
    $scope.error_message = "";
    console.log("init method");
    //loginForm = {};
  }
  $scope.init();
  
  $scope.submitLogin = function(loginForm){

    $scope.error_message = check_input_for_login(loginForm);

    if ($scope.error_message != ""){
      return false;
    }

    // var credentials = {
    //     email: 'rpatil@mailinator.com',
    //     password: '12345678'
    // };
    var config = {
      headers: {
        'X-HTTP-Method-Override': 'POST'
      }
    };

    Auth.login(loginForm, config).then(function(user) {
      // Setting a cookie       //$cookies.put('yomu_app_token', user.authentication_token);
    }, function(error) {
      console.log("Auth failed");       // Authentication failed...
    });

    $scope.$on('devise:login', function(event, currentUser) {
      var landingUrl = "http://" + $window.location.host + "/home/tell_your_friends";
      $window.location.href = landingUrl;       // after a login, a hard refresh, a new tab
    });

    $scope.$on('devise:new-session', function(event, currentUser) {
      // user logged in by Auth.login({...})
      yomuLabApp.get_logged_in_user(currentUser.authentication_token);
    });
  }


}]);

yomu_lab.controller('DashboardCtrl',['$scope', '$http', '$window', 'yomuLabApp', function($scope, $http, $window, yomuLabApp) {

  $scope.init = function(authentication_token){
    $scope.confirmation_msg = "Thank you for signing up. Please confirm your email.";
    console.log("Token = "+authentication_token);
    current_user = yomuLabApp.get_user_details(authentication_token);
    console.log("current_user-email="+current_user.email);
  }
  $scope.init();
}]);


yomu_lab.controller('LogOutCtrl',['$scope', '$http', '$window', 'Auth',function($scope, $http, $window, Auth) {
  
  $scope.clickLogOut = function(){

    Auth.logout(config).then(function(oldUser) {
        alert(oldUser.name + "you're signed out now.");
    }, function(error) {
        // An error occurred logging out.
    });

    $scope.$on('devise:logout', function(event, oldCurrentUser) {
        // ...
    });
  }

}]);
