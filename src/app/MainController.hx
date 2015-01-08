package app;
import haxe.ds.StringMap;
import haxe.Serializer;
import Main;
import Main.TestPermissions;
import nx3.NScore;
import nx3.test.TestItemsBach;
import ufront.web.Controller;
import ufront.web.result.ActionResult;
import ufront.web.result.ContentResult;
import ufront.web.result.RedirectResult;

import tink.core.Error;
import tink.core.Future;
import tink.core.Outcome;
import ufront.auth.AuthError;
import ufront.web.HttpError;
import app.Iso;
using Detox;
using StringTools;

import nx3.NScore;
import nx3.PScore;
import nx3.render.Renderer;
import nx3.render.scaling.Scaling;
import nx3.render.TargetSvgXml;

/**
 * IsoController
 * @author 
 */

 enum Permissions {
	 PermYes;
	 PermNo;
 }
  
class MainController extends  ufront.web.Controller {	
	
	//var testApi:TestApi;
	
	
	
	public function new() {
		super();						
	}
	
	@:route( '/' ) public function index() {		
		if (this.context.auth.isLoggedIn())  
			return loadContent('/home')
		else
			return loadContent('/home', '-guest');	
	}
	@:route( '/home' ) public function home() return index();
	@:route( '/nops' ) public function noPS() {
		this.context.session.init();
		var user = this.context.session.get('user');		
		
		return new IsoResult('<div class="page-header"><h1>No pushstate</h1><p>Current user: <b>$user</b></p></div><p>This is a standard request - no pushstate is used here</p>') ;
	}
	@:route( '/info' ) public function info() return  loadContent(this.context.request.uri);
	
	@:route( '/slask' ) public function slask() {				
		//var userID = this.context.auth.currentUser.userID;
		
		//this.context.ufTrace(this.context.session);
		//this.context.ufTrace(this.context.auth);
		this.context.ufTrace(this.context.auth.currentUser);
		//this.context.auth.requirePermission(TestPermissions.CanThat);
		//this.context.auth.currentUser)
		
		ufTrace(this.context.contentDirectory);

		this.ufTrace(this.context.auth.isLoggedIn());
		this.context.ufTrace('Hello');
		var testUser:TestUser = cast this.context.auth.currentUser;
		ufTrace(testUser);
		
		this.context.auth.requireLogin();
		this.context.auth.requirePermission(Super);
		
		var content = 'slask';		
		return new IsoResult(content);
	}
	
	
	@:route( '/contact/', GET ) public function contact() return new IsoResult("<div class='page-header'><h1>Contact</h1></div><p>The form submit is handled just as a normal server request - no pushstate or isometric stuff.</p><form method='POST' action='/contact/'><div class='col-xs-3'><p>Name:<br/><input name='name' class='form-control'/></p><p>Age:<br/><input name='age' class='form-control' /></p><input type='submit'/></div></form>");
	@:route( '/contact/', POST ) public function contactPost( args: { ?name:String, ?age:Int}) return new IsoResult("<div class='page-header'><h1>Contact Post</h1></div>" + Std.string(args)); 
	
	@:route( '/login/', GET ) public function login() {
		
		/*
		this.context.session.init();
		var user = this.context.session.get('user');
		this.ufTrace(this.context.session);
		*/
		var user = this.context.auth.currentUser;
		
		return new IsoResult('<div class="page-header"><h1>Login</h1><p>Current user: <b>${Std.string(user)}</b></p></div><p>The form submit is handled just as a normal server request - no pushstate or isometric stuff.</p><form method="POST" action="/login/"><div class="col-xs-3"><p>Username:<br/><input name="username" class="form-control"/></p><p>Password:<br/><input name="password" class="form-control" /></p><input type="submit"/></div></form>');
	}
	
	@:route( '/login/', POST ) public function loginPost( args: { ?username:String, ?password:String } ):ActionResult {
		
		var user = new TestApi().attemptLogin(this.context.session, args.username, args.password);
		if (user == null) return new IsoResult ('Could not log in: ${args.username} / ${args.password}');
		return new RedirectResult('/');
		//return new IsoResult('<div class="page-header"><h1>Login</h1><p>Current user: <b>${Std.string(user)}</b></p></div>' + Std.string(args)); 		
	}
	
	@:route( '/logout' ) public function logout() {
		var testApi = new TestApi();
		testApi.logout(this.context.session);
		return  new RedirectResult('/');
	}
	
	//@:rount('/ex/*') public var exController:ExController;
	@:route( '/sub/*' ) public var subController:SubController;
	@:route( '/seq/*' ) public var seqController:SeqController;
	@:route( '/score/*' ) public var scoreController:ScoreController;
	
	
	
	
	
	//===========================================================================
	// Model stuff here
	// Should be factorzed away in a best practices web mvc manner, I guess...
	//
	#if Client
	// Loads the content part of the page using ajax.
	// It also uses a simple cahing mechanism for storing the content so that it could be reused 
	// when navigating back through the pushstate controlled browser history
	// 
	
	function loadContent(uri:String, tag=''):Surprise<IsoResult, Error> {
		
			this.ufTrace(uri);
		
			var f = Future.trigger();		
	
			// First, check if the content has been cached:			
			
			if (Iso.contentCache.exists(uri)) {
				ufTrace('Try get $uri from cache');
				// Get content from client cache
				var cachedContent = Iso.contentCache.get(uri);
				var content = cachedContent;
				f.trigger(Success( new IsoResult( content)));
				Iso.setLoadinfoLabel('PushState - Loaded from cache', 'label label-warning');
				
			} else {	 // If not in the cache, load it by ajax 
				
				this.ufTrace('Load from ' + uri);
				var request = new js.html.XMLHttpRequest(); 
				request.open('GET', uri);
				
				// Set the request header tag UF-ISO-TYPE to 
				request.setRequestHeader(Iso.REQUEST_TYPE, Iso.AJAX);
				request.onload = function (e) {
					var requestResponse = request.response;
					var content = requestResponse;
					Iso.contentCache.set(uri, requestResponse);
					f.trigger(Success(new IsoResult( content) ));
					Iso.setLoadinfoLabel('PushState - Loaded using ajax', 'label label-success');
				};		
				request.onerror = function(e) {			
					  f.trigger(Failure(new Error('Can\' load from $uri'))); 		
				}
				
				// Timer can be used to simulate a slow ajax loading
				//haxe.Timer.delay(function() {			
					request.send(null);
				//}, 500);
				
			}

		return f.asFuture();
	}
	#end
	
	#if Server
	function loadContent(uri:String, tag=''):Surprise<IsoResult, Error> {
		
		var f = Future.trigger();

		// Load stuff from database or whatever
		// Here we just load some simple file content...
		
		//if (uri == '/') uri = '/home';		
		var filename =this.context.contentDirectory + '/content$uri$tag.xml';
		if (!sys.FileSystem.exists(filename)) {
			f.trigger( Failure(new Error('MainController: Server couldn\'t load content from $filename')));
		} else {
			
			// Sys.sleep can be used to simulate a slow standard request loading
			// Sys.sleep(1) 
			
			var content = sys.io.File.getContent(filename);
			f.trigger(Success( new IsoResult( content)));
		}
		return f.asFuture();
	}
	#end	
	
}


 class SubController extends Controller {
@:route( '/a' ) function subA() return new IsoResult('This is /sub/a');
@:route( '/b' ) function subB() return new IsoResult('This is /sub/b');
@:route( '/*' ) function subElse() return new IsoResult('This is /sub/*');
} 

 class SeqController extends Controller {
@:route( '/a' ) function seqA() return new IsoResult('This is /seq/a');
@:route( '/b' ) function seqB() return new IsoResult('This is /seq/b');
@:route( '/test/$max/$nr/' ) function seqTest(max:Int, nr:Int) return new SeqResult('This is /seq/test : $nr / $max', max, nr);
//@:route( '/*' ) function seqElse() return new IsoResult('This is /seq/*');
} 

 class ScoreController extends Controller {
	@:route( '/a' ) function seqA() return new IsoResult('This is /seq/a');
	@:route( '/b' ) function seqB() return new IsoResult('This is /seq/b');
	@:route( '/file/$filename/' ) function scoreFile(filename:String) {
		
		var uri = this.context.request.uri;
		
		var content = '';
		#if Client
		if (Iso.contentCache.exists(uri)) {
			content = Iso.contentCache.get(uri);
			Iso.setLoadinfoLabel('PushState - Score from cache', 'label label-warning');
		} else {
			var nscore = TestItemsBach.scoreBachSinfonia4();
			var svgXml = getScoreXml(nscore);
			content += svgXml;
			Iso.contentCache.set(uri, content);
			Iso.setLoadinfoLabel('PushState - Build score', 'label label-success');
		}
		#end
		
		#if Server
			var nscore = TestItemsBach.scoreBachSinfonia4();
			var svgXml = getScoreXml(nscore);
			content += svgXml;
		#end
		return new ScoreResult(content);
	}
	
	function getScoreXml(nscore:NScore) {
		var scaling = Scaling.SMALL;
		var target = new TargetSvgXml('#test',scaling);
		var renderer = new Renderer(target, 0, 0);
		renderer.renderScore(new PScore(nscore), 0, 0, 800 /scaling.unitX);		
		return target.getXml();				
		
	}
	
} 
