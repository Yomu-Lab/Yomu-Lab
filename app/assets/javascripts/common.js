var lang = new Lang('en');
lang.dynamic('fr', 'js/langpack/fr.json');
lang.dynamic('de', 'js/langpack/de.json');

function check_input_for_login(loginForm){
	console.log("check_input_for_login"+loginForm);

	var EMAIL_REGEXP = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;

	if( loginForm.email == undefined || loginForm.email == "" || loginForm.password == "" ){
		return "Email and Password is required.";
	}

	if (!EMAIL_REGEXP.test(loginForm.email)) {
		return "Please enter your valid email address.";
	}
}