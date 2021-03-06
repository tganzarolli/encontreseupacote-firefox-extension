
function atualizaPreferenciaUsuario(obj) {
    //USAR COOKIE de remember me
    /*  var prefs = new PrefsWrapper1("extensions.encontreseupacote.");
  prefs.setUnicharPref('remembermetoken',obj.value);*/
}



function loadPrefs() {
    var prefs = new PrefsWrapper1("extensions.encontreseupacote.");
  	document.getElementById("email").setAttribute('value',prefs.getUnicharPref('email'));
	var loginInfo = retrieveLoginInfo(document.getElementById("email").value);
	
	if (loginInfo != null)
  		document.getElementById("password").setAttribute('value',loginInfo.password);

  	document.getElementById("trackingNumberField").setAttribute('value',prefs.getUnicharPref('tracking_number'));
	
}

function onLoadTasks() {
loadPrefs();
verifyLoginAndListUserPackages();	
	if (trackingNumberVal = document.getElementById("trackingNumberField").value != '') {
		performSearch();
	}
}

function onUnLoadTasks() {
	trackingNumberVal = document.getElementById("trackingNumberField").value;
	    var prefs = new PrefsWrapper1("extensions.encontreseupacote.");
		prefs.setUnicharPref('tracking_number', trackingNumberVal);
}


window.addEventListener('load', onLoadTasks, true);
window.addEventListener('unload', onUnLoadTasks, true);

var arrayProjetos = new Array();
var arrayProjetosValor = new Array();
var busyActions = 0;

function showMessages(xmlDocument, level) {
    root = $(xmlDocument).find(level);
    root.each(function() {
        alert($(this).text());
    });
    return root.size();
}

function make_h_cell(src, label, clazz, size) {
	if (size == null)
		size = 85
	_label = document.createElement("textbox");
	_label.setAttribute("value", label);
	_label.setAttribute("readonly", true);
	_label.setAttribute("width", size);
	_label.setAttribute("class",clazz);
    src.appendChild(_label);
	return _label;
}

function make_list_item(src, label, value) {
	listItem = document.createElement("menuitem");
	listItem.setAttribute("label", label);
	listItem.setAttribute("value", value);
	src.appendChild(listItem);	
}

function sortEvents(a,b)
{
return Date.parse(b.time_of_event) - Date.parse(a.time_of_event);
}

function parseResponseUserPackage(dataJson) {
	try {
		parseResponseUserPackageImpl(dataJson);
		hideBusyIndicator();
	}catch (e) {
		alert(e);
		hideBusyIndicator();
	}
}
function parseResponseUserPackageImpl(dataJson) {
	    if (dataJson.error != undefined) {
			return;
		}
		$.each(dataJson, function(index, userPackage) {
			srcBox = document.getElementById("meusPacotesBox");
			make_list_item(srcBox, userPackage.user_package.nickname, userPackage.user_package.package.tracking_number);
		});
}

function toggleLogin(oper) {
	document.getElementById("registerLink").setAttribute("hidden", oper);
	document.getElementById("loginLink").setAttribute("hidden", oper);
	document.getElementById("helpNaoLogado").setAttribute("hidden", oper);
	document.getElementById("userWelcome").setAttribute("hidden", !oper);
	document.getElementById("logoutLink").setAttribute("hidden", !oper);
	document.getElementById("meusPacotesLayer").setAttribute("hidden",!oper);
	if (oper) {
		var prefs = new PrefsWrapper1("extensions.encontreseupacote.");
		emailTmp = prefs.getUnicharPref('email');
		document.getElementById("userWelcome").setAttribute("value", 'Logado como: '+emailTmp);
	}
}

function performCleanUp(showConfirmation) {
	if(showConfirmation) {
		if (!confirm('Deseja mesmo limpar?'))
    		return;
	}
	document.getElementById("trackingNumberField").value = '';
	document.getElementById("trackingNumberField").disabled = false;
    var apontBox = document.getElementById("apontamentos");
    var arrayChildren = $.extend(true, [], apontBox.children);
    $.each(arrayChildren,
    function(intIndex, objValue) {
        apontBox.removeChild(objValue);
    });
}
function cleanUserPackages(){
	var apontBox = document.getElementById("meusPacotesBox");
    var arrayChildren = $.extend(true, [], apontBox.children);
    $.each(arrayChildren,
    function(intIndex, objValue) {
		if (intIndex != 0)
        	apontBox.removeChild(objValue);
    });
}

function parseResponse(dataJson) {
	try {
		parseResponseImpl(dataJson);
		hideBusyIndicator();
	} catch(e) {
		hideBusyIndicator();
	}
}
function parseResponseImpl(dataJson) {

    var apontBox = document.getElementById("apontamentos");
    //copia o array (deep copy)
    var arrayChildren = $.extend(true, [], apontBox.children);
    if (arrayChildren.length > 0)
   /* if (!confirm('Sobrescreve a lista existente?'))
    return;*/
    $.each(arrayChildren,
    function(intIndex, objValue) {
        apontBox.removeChild(objValue);
    });

	
    if (dataJson.error != undefined) {
		alert(dataJson.error);
		return
    }

	endpoints = dataJson.status_request.package.endpoints
	hops = dataJson.status_request.package.hops
		var arrayCombined = endpoints.concat(hops);
			
arrayMega = arrayCombined.sort(sortEvents);
    $.each(arrayMega, function(endpointIndex, endpoint) {

         var horizontalBox = document.createElement("hbox");
		 

		 dateFormated = dateFormat(new Date(Date.parse(endpoint.time_of_event)), "dd/mm/yyyy HH:MM"); //.format('d/n/y H:i');
		 make_h_cell(horizontalBox, dateFormated, "default_cell", 90).setAttribute("style","font-size:0.78em");
		 	if (endpoint.post_office_location != undefined) {
				make_h_cell(horizontalBox, endpoint.post_office_location.name, "current_cell")
				make_h_cell(horizontalBox, endpoint.delivery_status.name, "status_cell")
			}
			else {
				make_h_cell(horizontalBox, endpoint.current_post_office_location.name, "present_cell")
				make_h_cell(horizontalBox, endpoint.outgoing_post_office_location.name, "outgoing_cell")
			}
         apontBox.appendChild(horizontalBox);

		});
}

function verifyLoginAndListUserPackages() {

	url='http://www.encontreseupacote.com.br/is_signed_in_json'

	$.getJSON(url, function(data) { 
			    if (data.error == 'OK') {
					toggleLogin(true);
					listUserPackages();
				}
				else {
					    var prefs = new PrefsWrapper1("extensions.encontreseupacote.");
					if (prefs.getBoolPref('auto_login') == true) {
						performLogin();
					}
				}
		});
	
}

function listUserPackages() {
	showBusyIndicator();
	$.getJSON('http://www.encontreseupacote.com.br/user_packages/list/json', function(data) { parseResponseUserPackage(data); });	
}

function performSearch() {
	showBusyIndicator();
	trackingNumberVal = document.getElementById("trackingNumberField").value;
    if (trackingNumberVal == '') {
        alert("Forneça uma chave de rastreio");
		hideBusyIndicator();
        return;
    }

	url='http://www.encontreseupacote.com.br/status_request/track/json/'+trackingNumberVal;

	$.getJSON(url, function(data) { parseResponse(data); });


}

function performLogin() {
	showBusyIndicator();
	document.getElementById('login_panel').hidePopup();
	userData = buildUserData(document.getElementById('email').value ,document.getElementById('password').value);
	$.ajax({
	  url: 'http://www.encontreseupacote.com.br/sign_in_from_api_json',
	  dataType: 'json',
	  type: 'POST',
	  data: userData,
	  success: loginCallBack,
	  error: handleError
	});

	
}

function performLogout() {
	showBusyIndicator();
	$.ajax({
	  url: 'http://www.encontreseupacote.com.br/sign_out',
	  type: 'GET',
	  success: logoutCallBack,
	  error: handleError
	});
	
}

function loginCallBack(dataJson){
	hideBusyIndicator();
	if (dataJson.error == 'OK') {
		var prefs = new PrefsWrapper1("extensions.encontreseupacote.");
		var email = document.getElementById('email').value;
		var password = document.getElementById('password').value;
	  	prefs.setUnicharPref('email', email);
	
		var oldLoginInfo = retrieveLoginInfo(email);
		if (oldLoginInfo != null) {
			//necessario salvar nesse caso
			if (password != oldLoginInfo.password) {
				var loginInfo = composeLoginInfo(email, password);
				modifyLoginInfo(oldLoginInfo, loginInfo);
			}
		}
		else {
			var loginInfo = composeLoginInfo(email, password);
			saveLoginInfo(loginInfo);	
		}
		toggleLogin(true);
		listUserPackages();
	}
	else {
		alert('Login falhou.');
	}
}

function logoutCallBack(dataJson){
	toggleLogin(false);
	cleanUserPackages();
	hideBusyIndicator();
	alert("Usuário deslogado com sucesso");
}

function selectUserPackage() {
	list = document.getElementById("meusPacotesList");
	if (list.selectedItem.value == '-1') {
		performCleanUp(false);
		return;
	}
	document.getElementById("trackingNumberField").value = list.selectedItem.value;
	document.getElementById("trackingNumberField").disabled="true"
	performSearch();
	
}

function handleError(dataJson){
	hideBusyIndicator();
	alert("Erro inesperado. Pode ser problemas com a rede ou site fora do ar/manutenção. Tente mais tarde.");
}


function showBusyIndicator() {
	busyActions++;
	document.getElementById('busy_indicator').setAttribute('hidden', false);
}
function hideBusyIndicator() {
	if (busyActions > 0)
		busyActions--;
	if (busyActions == 0)
		document.getElementById('busy_indicator').setAttribute('hidden', true);	
}