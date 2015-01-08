package app;

import cx.CryptTools;
import haxe.Serializer;
import haxe.Template;
import ufront.web.context.ActionContext;
import ufront.web.context.HttpContext;
import ufront.web.HttpError;
import Main;

/**
 * IsoResult
 * @author Jonas Nyström
 */
 
 // The IsoResult is a simple standard ActionResult, that takes the content part of the page and writes 
 // it to the response object. The only iso-specific thing here is that when it's run on the server,
 // it can identify the request as an ajax request by checking a header flag

 // When run on the client, it just passes along the content part of the page
 // Likewise, when run on the server and identified as an ajax request, it just passes along the content part
 
 // However , if it's a server request without the ajax flag being set - it is considered as a standard server 
 // request. In this case the content part is wrapped into a page template.
 
class IsoResult extends ufront.web.result.ActionResult
{
	var content:String;
	
	public function new(content:String) 
	{
		this.content = content;
	}
	
	override public function executeResult( actionContext:ActionContext ) {			
		var content = this.getContent(actionContext, this.content);
		actionContext.httpContext.response.write(content);
		return ufront.core.Sync.success();						
	}
	
	function getContent(actionContext:ActionContext, content:String) {		
		
			 content = this.wrapContent(actionContext, content);
			
			#if Server
				// Check if it is a standard request or an ajax request
				var requestType = actionContext.httpContext.request.clientHeaders.get(Iso.REQUEST_TYPE);				
				// If it isn't an ajax request...				
				if  (requestType != Iso.AJAX) return  new AppLayout(actionContext.httpContext.contentDirectory + '/templates/index.html', actionContext.httpContext).templateContent(content);
			#end
			
			// The following will happen...
			// - when run on server and identified as an ajax call
			// - when run on client
			return content;
	}
	
	
	// Possible to override!
	function wrapContent(actionContext:ActionContext, content:String) {
		return content;
	}
	
	
}


#if sys
class AppLayout {
	var template:Template;
	var context:HttpContext;
	
	public function new(templateFile:String, context:HttpContext) {		
		template = null;
		try  {
			template = new haxe.Template(sys.io.File.getContent(templateFile));
		} catch ( e: Dynamic) {
			throw HttpError.internalServerError('IsoResult: Could not load page template: $templateFile');
		}		
		this.context = context;
	}
	
	public function templateContent(content:Dynamic) {
		//var data = {user: user)
		
		/*
		this.context.session.init();
		var session = this.context.session;				
		var sessionData = session.getSessionData();
		var user = sessionData.get('user');
		*/
		
		//
		//var user = this.context.auth.currentUser;
		
		var testApi = new TestApi();
		
		var user = testApi.getUserFromSession(this.context.session);
		this.context.ufTrace(user);
		
		var sessionData = testApi.getSessiondata(this.context.session);
		
		return  template.execute( { content: content, session: CryptTools.crypt(Serializer.run(sessionData)), user:user } );					
	}
}
#end