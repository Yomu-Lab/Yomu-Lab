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
      var landingUrl = "http://" + $window.location.host + "/TellYourFriends";
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

/*
#<OmniAuth::AuthHash credentials=#<OmniAuth::AuthHash expires=true 
  expires_at=1455882525 token="CAAClN0T3eJwBAAQzzY3zgMBjCYbYKWHWgbE2TLBjQYZA9wopgPGKFF2dBTTYpt7JtvUIDR3jnNXWLRVlZAMzGypHnfCkXfHl5g4F2jnbQ17HpoBTeZB7ZA1XdrktguXq1FNvQ4j022UpTK8CfR0HCdZAwEXpLiLcAqcw496UkOMsVbYVVJLhwPWZBvJJc4FxZB2n6KJZA1GTcAZDZD"> 
  extra=#<OmniAuth::AuthHash 
    raw_info=#<OmniAuth::AuthHash 
      email="rahulpatil_scs@yahoo.co.in" 
      first_name="Rahul" 
      id="1063036573715640" 
      last_name="Patil">> 

      info=#<OmniAuth::AuthHash::InfoHash 
        email="rahulpatil_scs@yahoo.co.in" 
        first_name="Rahul" 
        image="http://graph.facebook.com/1063036573715640/picture" 
        last_name="Patil"> 
    provider="facebook" 
    uid="1063036573715640">


    (byebug) auth.provider
"facebook"
(byebug) auth.uid
"1063036573715640"
(byebug) 
(byebug) auth.info.email
"rahulpatil_scs@yahoo.co.in"
*/