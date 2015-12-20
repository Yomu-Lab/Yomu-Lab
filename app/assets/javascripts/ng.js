var yomu_lab = angular.module('yomu_lab', ["angular.filter","ngRoute", "Devise" ]);

yomu_lab.controller('YomuLabsCtrl', ['$scope', '$http', '$window', 'Auth', 'yomuLabApp', function($scope, $http, $window, Auth, yomuLabApp) {

  //$scope.current_user_authentication_token = "";
  
  $scope.submitLogin = function(loginForm){
    console.log("loginFor="+loginForm);

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
      // Setting a cookie
      //$cookies.put('yomu_app_token', user.authentication_token);
    }, function(error) {
      console.log("Auth failed");
      // Authentication failed...
    });

    $scope.$on('devise:login', function(event, currentUser) {
      var landingUrl = "http://" + $window.location.host + "/TellYourFriends";
      $window.location.href = landingUrl;
      // after a login, a hard refresh, a new tab
    });

    $scope.$on('devise:new-session', function(event, currentUser) {
        // user logged in by Auth.login({...})
        console.log("adsfafasdf");
        //yomuLabApp.current_user.authentication_token = user.authentication_token;
        yomuLabApp.get_logged_in_user(currentUser.authentication_token);
    });
    
  }
}]);

yomu_lab.controller('DashboardCtrl',['$scope', '$http', '$window', '$cookies', 'yomuLabApp',function($scope, $http, $window, $cookies, yomuLabApp) {

  $scope.init = function(yomuLabApp){
    // console.log("Users = "+yomuLabApp.current_user.authentication_token);
    // console.log("uuuuuu = "+$scope.current_user_authentication_token);
    $scope.confirmation_msg = "Thank you for signing up. Please confirm your email.";
    // Retrieving a cookie
    //var yomu_app_token = $cookies.get('yomu_app_token');
    //console.log("Cookie="+yomu_app_token);
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


// yomu_lab.config(function(AuthProvider, AuthInterceptProvider) {
//     // Customize login
//     AuthProvider.loginMethod('GET');
//     AuthProvider.loginPath('/users/sign_in.json');

//     // Customize logout
//     AuthProvider.logoutMethod('POST');
//     AuthProvider.logoutPath('/user/logout.json');

//     // Customize register
//     AuthProvider.registerMethod('PATCH');
//     AuthProvider.registerPath('/user/sign_up.json');

//     // Customize the resource name data use namespaced under
//     // Pass false to disable the namespace altogether.
//     //AuthProvider.resourceName('customer');

//     // Customize user parsing
//     // NOTE: **MUST** return a truth-y expression
//     // AuthProvider.parse(function(response) {
//     //     return response.data.user;
//     // });

//     // Intercept 401 Unauthorized everywhere
//     // Enables `devise:unauthorized` interceptor
//     AuthInterceptProvider.interceptAuth(true);
// });