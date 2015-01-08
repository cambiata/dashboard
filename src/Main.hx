package;

import app.Iso;
import app.MainController;
import haxe.ds.StringMap;
import ufront.api.UFApi;
import ufront.auth.AuthError;
import ufront.auth.NobodyAuthHandler;
import ufront.auth.UFAuthHandler;
import ufront.auth.UFAuthUser;
import ufront.web.context.HttpContext;
import ufront.web.session.FileSession;
import ufront.web.session.UFHttpSession;
using Lambda;

/**
 * Main
 * @author Jonas Nyström
 */
class Main 
{
	public static var app:ufront.app.UfrontApplication;
	
	public static function main() 
	{
		initApplication();	
	
		#if Client			
			// All clientside url actions are controlled through pushstate
			pushstate.PushState.init();
			pushstate.PushState.addEventListener(function (url) {
				
				// Client-side ufront application is not run on the very first request
				if (! Iso.isFirstRequest()) {
					
					// Timer can be used to dely the client side execution - useful when finding out what's going on...
					//haxe.Timer.delay(function() {					
					
						app.execute(new  ufront.web.context.HttpContext( new ClientRequest(), new ClientResponse() , null,  new app.ClientSession(), new TestAuth()));
						
						
					//}, 1000);
				}
				Iso.setUI(js.Browser.window.location.pathname);
			});
			
			// This is used to put the add the very first  server-generated content to the clientside content cache
			// to prevent the later  need of ajax-reloding it a second time...
			Iso.addFirstRequestToCache();		
			dashboard.Dashboard.init();
		#end
	
		#if Server
			app.executeRequest();
		#end		
	}
	
	static function initApplication() {		
		if ( app==null ) {
			var config:ufront.web.UfrontConfiguration = {
				indexController: MainController,
				basePath: '/',	
				authImplementation: TestAuth,
			}						
			app = new ufront.app.UfrontApplication(config);
		}
	}	
}



#if Client
//==============================================================================================
// These ar client extensions of the request and response classes
// Very basic right now - just enough to run this simple demo app

class ClientRequest extends  ufront.web.context.HttpRequest {
	public function new() {}	
	override function get_uri() return js.Browser.window.location.pathname;
	override function get_scriptDirectory() return null;
	override function get_httpMethod() return 'GET';
	override function get_clientHeaders() return new ufront.core.MultiValueMap<String>();
	override function get_cookies() return new ufront.core.MultiValueMap<String>();
	override function get_query() return new ufront.core.MultiValueMap<String>();
	override function get_post() return new ufront.core.MultiValueMap<String>();
}

class ClientResponse extends  ufront.web.context.HttpResponse {
	public function new() { 
		super(); 
		Iso.setLoadinfoLabel('PushState', 'label label-success');		
	}
	
	override function flush() {				
		// Note! Only the content part of the page is served here...
		var contentHtml = _buff.toString();
		// and injected into the content div
		js.Browser.document.getElementById('content').innerHTML = contentHtml;		
	}
}


#end


class TestUser implements UFAuthUser {	
	public function new(userID:String, password:String, firstname:String, lastname:String, permissions:Array<TestPermissions>=null) {
		this.userID = userID;
		this.password = password;
		this.firstname = firstname;
		this.lastname = lastname;
		if (_permissions == null) this._permissions = [Super];
	}
		
	public var password:String;
	public var firstname:String;
	public var lastname:String;
	
	public var _permissions:Iterable<TestPermissions>;
	
	public function can( ?permission:EnumValue, ?permissions:Iterable<EnumValue> ) {				
		
		var permissions = (permissions != null) ? permissions.array() : new Array<EnumValue>();		
		if (permissions != null) permissions.push(permission);
		for (perm in permissions) {
			if (!_permissions.array().has(cast perm)) return false;
		}		
		return true;
	}
	
	
	public var userID(get, null):String;
	function get_userID() return 'TEST_USER';	
}

class TestAuth implements UFAuthHandler<UFAuthUser> {
	public function new() { 
		//this._currentUser = new TestUser('123', 'pass', 'John', 'Doe'); 	
		this.testApi = new TestApi();		
	}
	@inject public var context(default, null):HttpContext;
	var testApi:TestApi;
	
	
	
	public var currentUser(get,null):UFAuthUser;
	public function isLoggedIn() { 
		return (this.currentUser != null);
	}
	
	public function requireLogin() {
		if (! this.isLoggedIn()) throw AuthError.NotLoggedIn;
	}	
	
	public function isLoggedInAs( user:UFAuthUser ) { return true; }
	public function requireLoginAs( user:UFAuthUser ) { 	}
	public function hasPermission( permission:EnumValue ) { return true; }
	public function hasPermissions( permissions:Iterable<EnumValue> ) { return true; }
	public function requirePermission( permission:EnumValue ) if (!this.currentUser.can(permission)) throw AuthError.NoPermission(permission);			
	public function requirePermissions( permissions:Iterable<EnumValue> ) for (permission in permissions) this.requirePermission(permission);	
	
	public function setCurrentUser( user:UFAuthUser ) { 
		#if Client
		var session = (this.context  != null)  ? context.session : {
			if (_hackSession == null) _hackSession = new app.ClientSession();
			_hackSession;
		}
		#end		
		#if Server
		var session = this.context.session;		
		#end		
		
		this.testApi.setUserFromSession(session, user);
		this._currentUser = cast user;
		
	}
	var _currentUser:TestUser;
	var _hackSession:UFHttpSession;
	function get_currentUser() { 
		#if Client
		var session = (this.context  != null)  ? context.session : {
			if (_hackSession == null) _hackSession = new app.ClientSession();
			_hackSession;
		}
		#end		
		#if Server
		var session = this.context.session;		
		#end
		
		return this.testApi.getUserFromSession(session);
		/*
		var sessionUser = session.get('user');
		if (sessionUser != null) _currentUser = sessionUser;
		return _currentUser; 		
		*/
	}
	public function getUserByID( id:String ) { return null; 	}
	public function toString() { return 'TestAuth';}

}		

enum TestPermissions {
	Plusdeltagare;
	Kantorsstud;
	Hsandstud;
	Super;
}


class TestApi  {
	
	public function new() {
		
	}
	
	public function getUserFromSession(session:UFHttpSession):TestUser {
		if (session == null ) throw 'TestApi: No valid session found';
		var sessionUser = session.get('user');
		return cast sessionUser;
	}
	
	public function setUserFromSession(session:UFHttpSession, user:UFAuthUser):TestUser {
		if (session == null ) throw 'TestApi: No valid session found';
		session.set('user', user);		
		return cast user;
	}
	
	public function getSessiondata(session:UFHttpSession):StringMap<Dynamic> {
		return session.getSessionData();
	}
	
	public function attemptLogin(session:UFHttpSession, userID:String, password:String):TestUser {
		
		//var user = (userID != '' && password != '') ? new TestUser(userID, password, 'TestUser', userID, [CanThis, CanThat]) : null;
		
		
		var foundUser = DummyUserList.users.find(function(user) return (user.userID == userID && user.password == password));
		var user = (foundUser != null) ? new TestUser(foundUser.userID, foundUser.password, foundUser.firstname, foundUser.lastname, foundUser.permissions) : null;
		
		
		setUserFromSession(session, user);
		return user;
	}
	
	public function logout(session:UFHttpSession) {
		setUserFromSession(session, null);
	}	
	
}

typedef DummyUser = { firstname:String, lastname:String, userID:String, password:String, permissions:Array<TestPermissions> };

class DummyUserList {
	
	static public  var users:Array<DummyUser> = [
		 { firstname:'Jonas', lastname:'Nyström', userID:'jonasnys@gmail.com', password:'cambiata', permissions:[Super, Plusdeltagare] }
		 , { firstname:'Lillemor', lastname:'Bodin Carlson', userID:'lillemor.bodin.carlson.mellansel@folkbildning.net', password:'123', permissions:[Plusdeltagare] }
		 , { firstname:'Plus', lastname:'Deltagare', userID:'plus@google.com', password:'123', permissions:[Plusdeltagare] }
		 , { firstname:'Kantor', lastname:'Studerande', userID:'kantor@google.com', password:'123', permissions:[Kantorsstud] }
	];
	
	
}

