package;

import app.Iso;
import app.MainController;
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
						app.execute(new  ufront.web.context.HttpContext( new ClientRequest(), new ClientResponse() , new app.ClientSession('session')));
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