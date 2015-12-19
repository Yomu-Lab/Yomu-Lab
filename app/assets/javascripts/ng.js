var yomu_lab = angular.module('yomu_lab', ["angular.filter","ngRoute", "Devise" ]);

yomu_lab.controller('YomuLabsCtrl', ['$scope', '$http', '$window', 'Auth', function($scope, $http, $window, Auth) {
  
  $scope.submitLogin = function(loginForm){
    console.log("loginForm="+loginForm);

    var credentials = {
        email: "rpatil@mailinator.com", //loginForm.email,
        password: "12345678" //loginForm.password
    };
    var config = {
      headers: {
        'X-HTTP-Method-Override': 'POST'
      }
    };

    Auth.login(credentials, config).then(function(user) {
      console.log(user); // => {id: 1, ect: '...'}
      $scope.currentUser = user;

    }, function(error) {
    	console.log("Auth failed");    // Authentication failed...
    });

    $scope.$on('devise:login', function(event, currentUser) {
      var landingUrl = "http://" + $window.location.host + "/Index";
      $window.location.href = landingUrl;
    });

    $scope.$on('devise:new-session', function(event, currentUser) {
      // user logged in by Auth.login({...})

    });

  }

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


yomu_lab.config(function(AuthProvider, AuthInterceptProvider) {
    // Customize login
    AuthProvider.loginMethod('GET');
    AuthProvider.loginPath('/users/sign_in.json');

    // Customize logout
    AuthProvider.logoutMethod('POST');
    AuthProvider.logoutPath('/user/logout.json');

    // Customize register
    AuthProvider.registerMethod('PATCH');
    AuthProvider.registerPath('/user/sign_up.json');

    // Customize the resource name data use namespaced under
    // Pass false to disable the namespace altogether.
    AuthProvider.resourceName('customer');

    // Customize user parsing
    // NOTE: **MUST** return a truth-y expression
    AuthProvider.parse(function(response) {
        return response.data.user;
    });

    // Intercept 401 Unauthorized everywhere
    // Enables `devise:unauthorized` interceptor
    AuthInterceptProvider.interceptAuth(true);
});