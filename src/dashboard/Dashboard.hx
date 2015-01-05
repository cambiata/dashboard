package dashboard;

import jQuery.Event;
import jQuery.JQuery;
import js.Browser;
import js.Lib;

/**
 * Dashboard
 * @author Jonas Nyström
 */

class Dashboard 
{
	static public function init() {
		handleSidebarMinify();
		handleMobileSidebarToggle();
		handleSidebarMenu();
		handlePanelAction();
		handleDraggablePanel();
		handelTooltipPopoverActivation();
		handleScrollToTopButton();
		handlePageContentView();
	}
	
	static public function handleSidebarMenu() {
		new JQuery(".sidebar .nav > .has-sub > a").click(function(e:Event) {
			var target = e.target;
			//Lib.alert(e.target);			
			var e = new JQuery(target).next(".sub-menu");
			//Lib.alert(e);
			var t=".sidebar .nav > li.has-sub > .sub-menu";
			
			if(new JQuery(".page-sidebar-minified").length==0){
				new JQuery(t).not(e).slideUp(250); 
				new JQuery(e).slideToggle(250);
			}			
		});
		
		new JQuery(".sidebar .nav > .has-sub .sub-menu li.has-sub > a").click(function(e:Event){
			var target = e.target;
			if (new JQuery(".page-sidebar-minified").length == 0) {
				var e = new JQuery(target).next(".sub-menu");
				new JQuery(e).slideToggle(250);
			}
		});
	}
	
	static public function handleSidebarMinify() {
		new JQuery("[data-click=sidebar-minify]").click(function(e:Event){
			e.preventDefault();			
			var t="page-sidebar-minified";
			var n="#page-container";
			if(new JQuery(n).hasClass(t)){
				new JQuery(n).removeClass(t);
				/*
				if (new JQuery(n).hasClass("page-sidebar-fixed")) {
					generateSlimScroll(new JQuery('#sidebar [data-scrollbar="true"]'));
				}
				*/
			}else{
				new JQuery(n).addClass(t);
				/*
				if(new JQuery(n).hasClass("page-sidebar-fixed")) {
					new JQuery('#sidebar [data-scrollbar="true"]').slimScroll( { destroy:true } );
					new JQuery('#sidebar [data-scrollbar="true"]').removeAttr("style");
				};
				*/
				
				new JQuery("#sidebar [data-scrollbar=true]").trigger("mouseover");
			}
			new JQuery(Browser.window).trigger("resize");
		});
	}
	
	static public function handleMobileSidebarToggle() {
		untyped __js__  ('
			//alert("handleMobileSidebarToggle Haxe");
			var e=false;$(".sidebar").on("click touchstart",function(t){if($(t.target).closest(".sidebar").length!==0){e=true}else{e=false;t.stopPropagation()}});$(document).on("click touchstart",function(t){if($(t.target).closest(".sidebar").length===0){e=false}if(!t.isPropagationStopped()&&e!==true){if($("#page-container").hasClass("page-sidebar-toggled")){$("#page-container").removeClass("page-sidebar-toggled")}if($(window).width()<979){if($("#page-container").hasClass("page-with-two-sidebar")){$("#page-container").removeClass("page-right-sidebar-toggled")}}}});$("[data-click=right-sidebar-toggled]").click(function(e){e.stopPropagation();var t="#page-container";var n="page-right-sidebar-collapsed";n=$(window).width()<979?"page-right-sidebar-toggled":n;if($(t).hasClass(n)){$(t).removeClass(n)}else{$(t).addClass(n)}if($(window).width()<480){$("#page-container").removeClass("page-sidebar-toggled")}});$("[data-click=sidebar-toggled]").click(function(e){e.stopPropagation();var t="page-sidebar-toggled";var n="#page-container";if($(n).hasClass(t)){$(n).removeClass(t)}else{$(n).addClass(t)}if($(window).width()<480){$("#page-container").removeClass("page-right-sidebar-toggled")}})		
		');
	}
	
	static public function handlePanelAction() {
		untyped __js__  ('
			//alert("handlePanelAction Haxe");
			$("[data-click=panel-remove]").hover(function(){$(this).tooltip({title:"Remove",placement:"bottom",trigger:"hover",container:"body"});$(this).tooltip("show")});$("[data-click=panel-remove]").click(function(e){e.preventDefault();$(this).tooltip("destroy");$(this).closest(".panel").remove()});$("[data-click=panel-collapse]").hover(function(){$(this).tooltip({title:"Collapse / Expand",placement:"bottom",trigger:"hover",container:"body"});$(this).tooltip("show")});$("[data-click=panel-collapse]").click(function(e){e.preventDefault();$(this).closest(".panel").find(".panel-body").slideToggle()});$("[data-click=panel-reload]").hover(function(){$(this).tooltip({title:"Reload",placement:"bottom",trigger:"hover",container:"body"});$(this).tooltip("show")});$("[data-click=panel-reload]").click(function(e){e.preventDefault();var t=$(this).closest(".panel");if(!$(t).hasClass("panel-loading")){var n=$(t).find(".panel-body");var r=\'<div class="panel-loader"><span class="spinner-small"></span></div>\';$(t).addClass("panel-loading");$(n).prepend(r);setTimeout(function(){$(t).removeClass("panel-loading");$(t).find(".panel-loader").remove()},2e3)}});$("[data-click=panel-expand]").hover(function(){$(this).tooltip({title:"Expand / Compress",placement:"bottom",trigger:"hover",container:"body"});$(this).tooltip("show")});$("[data-click=panel-expand]").click(function(e){e.preventDefault();var t=$(this).closest(".panel");if($("body").hasClass("panel-expand")&&$(t).hasClass("panel-expand")){$("body, .panel").removeClass("panel-expand");$(".panel").removeAttr("style");$("[class*=col]").sortable("enable")}else{$("body").addClass("panel-expand");$(this).closest(".panel").addClass("panel-expand");$("[class*=col]").sortable("disable")}$(window).trigger("resize")})
		');
	}
	
	static public function handleDraggablePanel() {
		untyped __js__  ('
			//alert("handlePanelAction Haxe");
				var e="[class*=col]";var t=".panel-heading";var n=".row > [class*=col]";$(e).sortable({handle:t,connectWith:n})
		');
	}	
	
	static public function handelTooltipPopoverActivation() {
		untyped __js__  ('
			//alert("handlePanelAction Haxe");
				$("[data-toggle=tooltip]").tooltip();$("[data-toggle=popover]").popover()
		');
	}			
	
	static public function handleScrollToTopButton() {
		untyped __js__  ('
			//alert("handlePanelAction Haxe");
				$(document).scroll(function(){var e=$(document).scrollTop();if(e>=200){$("[data-click=scroll-top]").addClass("in")}else{$("[data-click=scroll-top]").removeClass("in")}});$("[data-click=scroll-top]").click(function(e){e.preventDefault();$("html, body").animate({scrollTop:$("body").offset().top},500)})
		');
	}		
	
	static public function handlePageContentView() {
		untyped __js__  ('
			//alert("handlePanelAction Haxe");
				$.when($("#page-loader").addClass("hide")).done(function(){$("#page-container").addClass("in")})
		');
	}		
}