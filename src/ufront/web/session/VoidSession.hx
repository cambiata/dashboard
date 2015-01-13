package ufront.web.session;

import haxe.ds.StringMap;
import ufront.web.session.UFHttpSession;
import ufront.web.context.HttpContext;
import tink.CoreApi;

/**
	A session implementation that doesn't actually save session state.

	In fact, it forgets everything the moment you ask it.
	Use this when you do not want a session implementation, but also do not want to get null related errors in your code.
	For example, when testing.
**/
class VoidSession implements UFHttpSession
{
	public var id(get,null):String;

	public function new() {}

	public function setExpiry( e:Int ) {}

	public function init():Surprise<Noise,String> return Future.sync( Success(Noise) );

	public function commit():Surprise<Noise,String> return Future.sync( Success(Noise) );

	public function triggerCommit():Void {};

	public function isActive():Bool return false;

	public function get( name:String ):Dynamic return null;

	public function set( name:String, value:Dynamic ):Void {}

	public function exists( name:String ):Bool return false;

	public function remove(name:String):Void {}

	public function clear():Void {}

	public function regenerateID() return Future.sync( Success("") );

	public function close():Void {}
	
	/* INTERFACE ufront.web.session.UFHttpSession */
	
	public function getSessionData():StringMap<Dynamic> 
	{
		return null;
	}
	
	/* INTERFACE ufront.web.session.UFHttpSession */
	


	function get_id() return "";
}
