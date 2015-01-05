package lab.auth;

import lab.auth.Main.TestAuthHandler;
import neko.Lib;
import ufront.auth.UFAuthHandler;
import ufront.auth.UFAuthUser;

/**
 * ...
 * @author Jonas Nyström
 */

 enum TestPermissions {
	 HaveCake;
	 EatCake;
 }

class Main 
{
	
	static function main() new Main();

	public function new() {
		
		var user = new TestUser();
		
		
		var testAuth:UFAuthHandler<UFAuthUser> = new TestAuthHandler();
		trace(testAuth.isLoggedIn());
		
	}
}


class TestAuthHandler implements UFAuthHandler<UFAuthUser>
{
	
	
	public function new() {}
	/**
		Is a session currently open and authenticated - is the user logged in?
	**/
	public function isLoggedIn() return true;

	/**
		Require the user to be logged in.
		Otherwise trigger the `onNotLoggedIn` notifier, and throw `AuthError.NotLoggedIn`
	**/
	public function requireLogin() {}

	/**
		Is this particular user currently logged in.  Will return false if a different user is logged in.
	**/
	public function isLoggedInAs( user:UFAuthUser ) return true;

	/**
		Require this user to be the one currently logged in.
		Otherwise will trigger `onNotLoggedInAs` dispatcher, and throw `AuthError.NotLoggedInAs( user )`
	**/
	public function requireLoginAs( user:UFAuthUser ) {}
	/**
		Does the given user have the specified permission?
		Will return false if the user is not logged in, or if the user does not have permission.
	**/
	public function hasPermission( permission:EnumValue ) return true;

	/**
		Does the given user have the specified permissions?
		Will return false if the user is not logged in, or if the user does not have all of the specified permissions.
	**/
	public function hasPermissions( permissions:Iterable<EnumValue> ) return true;

	/**
		Require the given user to have the specified permission.
		If not, trigger the `onNoPermission` dispatcher, throw `AuthError.NoPermission(permission)`.
	**/
	public function requirePermission( permission:EnumValue ) {}

	/**
		Require the given user to have the specified permissions.
		If not, trigger the `onNoPermission` dispatcher, throw `AuthError.NoPermission(permission)`.
	**/
	public function requirePermissions( permissions:Iterable<EnumValue> ) {}

	/**
		Given a String containing the user ID, find the appropriate UFAuthUser object.
		The user ID should match the one provided by `ufront.auth.UFAuthUser.userID`.
	**/
	public function getUserByID( id:String ):Null<UFAuthUser> return new TestUser();

	/**
		Change the currentUser in the session.
		This is used when implementing "login as _____" functionality.
		Make sure to only expose this method in a secure piece of code, ie, after checking the current user has permissions to take over another user's account.
		Will throw an error if the user could not be set.
	**/
	public function setCurrentUser( u:Null<UFAuthUser> ) {}

	/** A String representation, usually just the name of the AuthHandler class, and possibly the current user. **/
	/**
		The currently logged in user.  Will be null if no user is logged in.
	**/
	public function toString() return "TestAuthHandler";

	public var currentUser(get,never):Null<UFAuthUser>;
	
	function get_currentUser() return new TestUser();
	
	
}

class TestUser implements ufront.auth.UFAuthUser {
	public var userID(get,null):String;
	public function new() {}
	public function can( ?p:EnumValue, ?ps:Iterable<EnumValue> ):Bool return true;
	function get_userID() return "IDTestUser";
}
