(function () { "use strict";
var Main = function() {
};
Main.main = function() {
	dashboard.Dashboard.init();
	new Main();
};
var dashboard = {};
dashboard.Dashboard = function() { };
dashboard.Dashboard.init = function() {
	dashboard.Dashboard.handleSidebarMinify();
	dashboard.Dashboard.handleMobileSidebarToggle();
	dashboard.Dashboard.handleSidebarMenu();
	dashboard.Dashboard.handlePanelAction();
	dashboard.Dashboard.handleDraggablePanel();
	dashboard.Dashboard.handelTooltipPopoverActivation();
	dashboard.Dashboard.handleScrollToTopButton();
	dashboard.Dashboard.handlePageContentView();
};
dashboard.Dashboard.handleSidebarMenu = function() {
	new $(".sidebar .nav > .has-sub > a").click(function(e) {
		var target = e.target;
		var e1 = new $(target).next(".sub-menu");
		var t = ".sidebar .nav > li.has-sub > .sub-menu";
		if(new $(".page-sidebar-minified").length == 0) {
			new $(t).not(e1).slideUp(250);
			new $(e1).slideToggle(250);
		}
	});
	new $(".sidebar .nav > .has-sub .sub-menu li.has-sub > a").click(function(e2) {
		var target1 = e2.target;
		if(new $(".page-sidebar-minified").length == 0) {
			var e3 = new $(target1).next(".sub-menu");
			new $(e3).slideToggle(250);
		}
	});
};
dashboard.Dashboard.handleSidebarMinify = function() {
	new $("[data-click=sidebar-minify]").click(function(e) {
		e.preventDefault();
		var t = "page-sidebar-minified";
		var n = "#page-container";
		if(new $(n).hasClass(t)) new $(n).removeClass(t); else {
			new $(n).addClass(t);
			new $("#sidebar [data-scrollbar=true]").trigger("mouseover");
		}
		new $(window).trigger("resize");
	});
};
dashboard.Dashboard.handleMobileSidebarToggle = function() {
	
			//alert("handleMobileSidebarToggle Haxe");
			var e=false;$(".sidebar").on("click touchstart",function(t){if($(t.target).closest(".sidebar").length!==0){e=true}else{e=false;t.stopPropagation()}});$(document).on("click touchstart",function(t){if($(t.target).closest(".sidebar").length===0){e=false}if(!t.isPropagationStopped()&&e!==true){if($("#page-container").hasClass("page-sidebar-toggled")){$("#page-container").removeClass("page-sidebar-toggled")}if($(window).width()<979){if($("#page-container").hasClass("page-with-two-sidebar")){$("#page-container").removeClass("page-right-sidebar-toggled")}}}});$("[data-click=right-sidebar-toggled]").click(function(e){e.stopPropagation();var t="#page-container";var n="page-right-sidebar-collapsed";n=$(window).width()<979?"page-right-sidebar-toggled":n;if($(t).hasClass(n)){$(t).removeClass(n)}else{$(t).addClass(n)}if($(window).width()<480){$("#page-container").removeClass("page-sidebar-toggled")}});$("[data-click=sidebar-toggled]").click(function(e){e.stopPropagation();var t="page-sidebar-toggled";var n="#page-container";if($(n).hasClass(t)){$(n).removeClass(t)}else{$(n).addClass(t)}if($(window).width()<480){$("#page-container").removeClass("page-right-sidebar-toggled")}})		
		;
};
dashboard.Dashboard.handlePanelAction = function() {
	
			//alert("handlePanelAction Haxe");
			$("[data-click=panel-remove]").hover(function(){$(this).tooltip({title:"Remove",placement:"bottom",trigger:"hover",container:"body"});$(this).tooltip("show")});$("[data-click=panel-remove]").click(function(e){e.preventDefault();$(this).tooltip("destroy");$(this).closest(".panel").remove()});$("[data-click=panel-collapse]").hover(function(){$(this).tooltip({title:"Collapse / Expand",placement:"bottom",trigger:"hover",container:"body"});$(this).tooltip("show")});$("[data-click=panel-collapse]").click(function(e){e.preventDefault();$(this).closest(".panel").find(".panel-body").slideToggle()});$("[data-click=panel-reload]").hover(function(){$(this).tooltip({title:"Reload",placement:"bottom",trigger:"hover",container:"body"});$(this).tooltip("show")});$("[data-click=panel-reload]").click(function(e){e.preventDefault();var t=$(this).closest(".panel");if(!$(t).hasClass("panel-loading")){var n=$(t).find(".panel-body");var r='<div class="panel-loader"><span class="spinner-small"></span></div>';$(t).addClass("panel-loading");$(n).prepend(r);setTimeout(function(){$(t).removeClass("panel-loading");$(t).find(".panel-loader").remove()},2e3)}});$("[data-click=panel-expand]").hover(function(){$(this).tooltip({title:"Expand / Compress",placement:"bottom",trigger:"hover",container:"body"});$(this).tooltip("show")});$("[data-click=panel-expand]").click(function(e){e.preventDefault();var t=$(this).closest(".panel");if($("body").hasClass("panel-expand")&&$(t).hasClass("panel-expand")){$("body, .panel").removeClass("panel-expand");$(".panel").removeAttr("style");$("[class*=col]").sortable("enable")}else{$("body").addClass("panel-expand");$(this).closest(".panel").addClass("panel-expand");$("[class*=col]").sortable("disable")}$(window).trigger("resize")})
		;
};
dashboard.Dashboard.handleDraggablePanel = function() {
	
			//alert("handlePanelAction Haxe");
				var e="[class*=col]";var t=".panel-heading";var n=".row > [class*=col]";$(e).sortable({handle:t,connectWith:n})
		;
};
dashboard.Dashboard.handelTooltipPopoverActivation = function() {
	
			//alert("handlePanelAction Haxe");
				$("[data-toggle=tooltip]").tooltip();$("[data-toggle=popover]").popover()
		;
};
dashboard.Dashboard.handleScrollToTopButton = function() {
	
			//alert("handlePanelAction Haxe");
				$(document).scroll(function(){var e=$(document).scrollTop();if(e>=200){$("[data-click=scroll-top]").addClass("in")}else{$("[data-click=scroll-top]").removeClass("in")}});$("[data-click=scroll-top]").click(function(e){e.preventDefault();$("html, body").animate({scrollTop:$("body").offset().top},500)})
		;
};
dashboard.Dashboard.handlePageContentView = function() {
	
			//alert("handlePanelAction Haxe");
				$.when($("#page-loader").addClass("hide")).done(function(){$("#page-container").addClass("in")})
		;
};
Main.main();
})();
