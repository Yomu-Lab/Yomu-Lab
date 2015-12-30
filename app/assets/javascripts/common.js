var lang = new Lang('en');
lang.dynamic('fr', 'js/langpack/fr.json');
lang.dynamic('de', 'js/langpack/de.json');

//function check_input_for_login(loginForm, email, password){
function check_input_for_login(loginForm){
  var error_message_value = "";
  if ( loginForm == undefined ){
    error_message_value = "Please enter your email and password.";
  } 
  else if ( loginForm.email == undefined || loginForm.email == "" || loginForm.email.length == 0 ){
    error_message_value = "Please enter your email.";
  }
  else if ( !EMAIL_REGEXP.test(loginForm.email) ) {
    error_message_value = "Please enter your valid email address.";
  }
  else if ( loginForm.password == undefined || loginForm.password == "" || loginForm.password.length == 0 ){
    error_message_value = "Please enter your password.";
  }
  else if ( loginForm.password.length < PASSWORD_LENGTH_MINIMUM ){
    error_message_value = "Short passwords are easy to guess. Try one with at least 8 characters.";
  }
  return error_message_value;
}

function check_input_for_forgot_password(email){
  var error_message_value = "";
  if ( email == undefined || email == "" || email.length == 0 ){
    error_message_value = "Please enter your email to recieve forgot password link.";
  }
  else if ( !EMAIL_REGEXP.test(email) ) {
    error_message_value = "Please enter your valid email address.";
  }
  return error_message_value;
}

function check_input_for_signup(sign_up_form){
  //console.log("check_input_for_signup(sign_up_form)="+sign_up_form);
  var error_message_value = "";
  if ( sign_up_form == undefined ){
    error_message_value = "Please fill the empty text boxes.";
  } 
  else if ( sign_up_form.first_name == undefined || sign_up_form.first_name == "" || sign_up_form.first_name.length == 0 ){
    error_message_value = "Please enter your first name.";
  }
  else if ( sign_up_form.last_name == undefined || sign_up_form.last_name == "" || sign_up_form.last_name.length == 0 ){
    error_message_value = "Please enter your last name.";
  }
  else if ( sign_up_form.email == undefined || sign_up_form.email == "" || sign_up_form.email.length == 0 ){
    error_message_value = "Please enter your email.";
  }
  else if ( !EMAIL_REGEXP.test(sign_up_form.email) ) {
    error_message_value = "Please enter your valid email address.";
  }
  else if ( sign_up_form.password == undefined || sign_up_form.password == "" || sign_up_form.password.length == 0 ){
    error_message_value = "Please enter your password.";
  }
  else if ( sign_up_form.password_confirmation == undefined || sign_up_form.password_confirmation == "" || sign_up_form.password_confirmation.length == 0 ){
    error_message_value = "Please enter your password confirmation.";
  }
  else if ( sign_up_form.password.length < PASSWORD_LENGTH_MINIMUM || sign_up_form.password_confirmation.length < PASSWORD_LENGTH_MINIMUM ){
    error_message_value = "Short passwords are easy to guess. Try one with at least 8 characters.";
  }
  else if ( sign_up_form.password != sign_up_form.password_confirmation ){
    error_message_value = "Both these passwords don't match. Try again?";
  }
  return error_message_value;  
}

function check_input_for_reset_password_token(reset_password_token, reset_password_form){
  //console.log("check_input_for_reset_password_token="+reset_password_form);
  var error_message_value = "";
  if ( reset_password_form == undefined ){
    error_message_value = "Please fill the empty text boxes.";
  } 
  else if ( reset_password_form.password == undefined || reset_password_form.password == "" || reset_password_form.password.length == 0 ){
    error_message_value = "Please enter your password.";
  }
  else if ( reset_password_form.password_confirmation == undefined || reset_password_form.password_confirmation == "" || reset_password_form.password_confirmation.length == 0 ){
    error_message_value = "Please enter your password confirmation.";
  }
  else if ( reset_password_form.password.length < PASSWORD_LENGTH_MINIMUM || reset_password_form.password_confirmation.length < PASSWORD_LENGTH_MINIMUM ){
    error_message_value = "Short passwords are easy to guess. Try one with at least 8 characters.";
  }
  else if ( reset_password_form.password != reset_password_form.password_confirmation ){
    error_message_value = "Both these passwords don't match. Try again?";
  }
  return error_message_value;  
}



/*
* Redirect To Login Page
*/
function redirect_page_to_sign_in_page1($scope){
  var seconds = 5;
  $scope.remaining_seconds = seconds;
  setInterval(function () {
    seconds--;
    $scope.remaining_seconds = seconds;
    if (seconds == 0) {
      $scope.remaining_seconds = 0;
      window.location = "/Login";
    }
  }, 1000);
}

/*
$(function () {
    $("#btnRedirect").click(function () {
        var seconds = 5;
        $("#dvCountDown").show();
        $("#lblCount").html(seconds);
        setInterval(function () {
            seconds--;
            $("#lblCount").html(seconds);
            if (seconds == 0) {
                $("#dvCountDown").hide();
                window.location = "http://www.aspsnippets.com/";
            }
        }, 1000);
    });
});
*/