package app;
import haxe.ds.StringMap;
using Detox;
/**
 * Iso
 * @author 
 */
class Iso 
{
	public static var REQUEST_TYPE:String = 'UF_ISO_TYPE';
	public static var AJAX:String = 'AJAX';
	public static var REQ_TYPE_SERVER:String = 'SERVER';

	public static var UF_CLIENT_SESSION:String = 'UFrontClientSession';
	// Using Detox, this could be run on both server and client
	public static  function setUI(uri:String) {		
		// Update main menu
		var menu = "#menu".find();
		for (item in menu.first().children()) {							
			var href = item.children().first().attr('href');
			if (href == uri) {
				if(!item.hasClass('active')) item.addClass('active');
			} else {
				item.removeClass('active');	
			}
		}

	}
	
	public static  function setLoadinfoLabel(text:String, clss:String) {
		'#load-type'.find().setText(text);
		'#load-type'.find().setAttr('class', clss);			
	}

	
	#if js
	public static function isFirstRequest():Bool return ++stateChangeCount <= 1 ;
	public static var stateChangeCount:Int = 0;	
	 static var contentCache = new StringMap<String>();	
	 
	 static public function contentCacheSet(id:String, content:String) {
		// js.Lib.alert('SET : ' +  id + ' : ' +  content);
		 contentCache.set(id, content);		 
	 }
	 
	 static public function contentCacheGet(id:String):String {
		 return contentCache.get(id);
	 }
	 
	 static public function contentCacheExists(id:String) return contentCache.exists(id);
	 
	 
	 
	 
	public static function addFirstRequestToCache() {
				var contentEl = js.Browser.document.getElementById('content');
				if (contentEl == null) {
					throw('Could not init contentCache on first request');
					return;
				}
				var content = contentEl.innerHTML;
				var url = js.Browser.window.location.pathname;
				contentCache.set(url, content);
	}
	
	#end

}

 class ClientUser {
	 public var firstname:String;
	 public var lastname:String;

	 public function new(firstname:String, lastname:String) { 
		 this.firstname = firstname;
		 this.lastname = lastname;
	 }
 }
