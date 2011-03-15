function buildUserData(email, password) {
	    var prefs = new PrefsWrapper1("extensions.encontreseupacote.");
		userData=''
		if (prefs.getBoolPref('auto_login') == false) {
			userData+='session[remember_me_flag]=0&';
		}
		userData += 'email=' + email + "&password=" + password;
		return userData;
}

function retrieveLoginInfo(user) {
	var hostname = 'http://www.encontreseupacote.com.br';
	var formSubmitURL = 'http://www.encontreseupacote.com.br/sign_in_from_api_json';  
	var httprealm = null;
	var username = user;

	try {
	   // Get Login Manager 
	   var myLoginManager = Components.classes["@mozilla.org/login-manager;1"].
	                          getService(Components.interfaces.nsILoginManager);

	   // Find users for the given parameters
	   var logins = myLoginManager.findLogins({}, hostname, formSubmitURL, httprealm);

	   // Find user from returned array of nsILoginInfo objects
	   for (var i = 0; i < logins.length; i++) {
	      if (logins[i].username == username) {
	         return logins[i];
	      }
	   }
	}
	catch(ex) {
	   // This will only happen if there is no nsILoginManager component class
	}

}

function saveLoginInfo(loginInfo) {
	   var myLoginManager = Components.classes["@mozilla.org/login-manager;1"].
	                          getService(Components.interfaces.nsILoginManager);
	myLoginManager.addLogin(loginInfo);  
}

function modifyLoginInfo(oldLogin, newLogin) {
	   var myLoginManager = Components.classes["@mozilla.org/login-manager;1"].
	                          getService(Components.interfaces.nsILoginManager);
	myLoginManager.modifyLogin(oldLogin, newLogin);   
}

function composeLoginInfo(username, password) {
	var nsLoginInfo = new Components.Constructor("@mozilla.org/login-manager/loginInfo;1",
	                                             Components.interfaces.nsILoginInfo,
	                                             "init");
	var formLoginInfo = new nsLoginInfo('http://www.encontreseupacote.com.br',
	                       'http://www.encontreseupacote.com.br/sign_in_from_api_json', null,
	                       username, password, 'email', 'password');
	return formLoginInfo;
}