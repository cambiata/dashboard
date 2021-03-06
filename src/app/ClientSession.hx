package app;
import cx.CryptTools;
import haxe.ds.StringMap;
import haxe.Unserializer;
import js.Browser;
import js.Cookie;
import js.Lib;
import ufront.web.context.HttpContext;
import ufront.web.HttpCookie;
import ufront.web.session.UFHttpSession;
import ufront.core.InjectionRef;
import tink.CoreApi;
/**
 * ClientSession
 * @author Jonas Nyström
 */
class ClientSession  implements UFHttpSession
{
	
	var sessionData = new StringMap<Dynamic>();
	public var id(get,null):String;
	
	public function new(sessionElementID:String = 'session') {
		//Lib.alert('client session');
		var cookieStr = Cookie.get(Iso.UF_CLIENT_SESSION);
		this.sessionData = Unserializer.run(cx.CryptTools.decrypt(cookieStr));
		
		
		//var sessionElement = js.Browser.document.getElementById(sessionElementID);		
		//var dataStr = sessionElement.innerHTML;
		//if (dataStr != null) this.sessionData = Unserializer.run(cx.CryptTools.decrypt(dataStr));
		//Lib.alert(this.sessionData);
	}

	public function setExpiry( e:Int ) {}

	public function init():Surprise<Noise,String> return Future.sync( Success(Noise) );

	public function commit():Surprise<Noise,String> return Future.sync( Success(Noise) );

	public function triggerCommit():Void {};

	public function isActive():Bool return false;

	public function get( name:String ):Dynamic {
		return this.sessionData.get(name);
	}

	public function set( name:String, value:Dynamic ):Void {}

	public function exists( name:String ):Bool return false;

	public function remove(name:String):Void {}

	public function clear():Void {}

	public function regenerateID() return Future.sync( Success("") );

	public function close():Void {}
	

	
	/* INTERFACE ufront.web.session.UFHttpSession */
	
	public function getSessionData():StringMap<Dynamic> 
	{
		return this.sessionData;
	}

	function get_id() return "";
}