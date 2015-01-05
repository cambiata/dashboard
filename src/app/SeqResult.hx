package app;
import ufront.web.context.ActionContext;

/**
 * SeqResult
 * @author Jonas Nyström
 */
class SeqResult extends IsoResult 
{
	var max:Int;
	var nr:Int;

	public function new(content:String, max:Int, nr:Int) 
	{
		super(content);		
		this.max = max;
		this.nr = nr;
	}
	
	override function wrapContent(actionContext:ActionContext, content:String) 
	{
		var uriSegments = actionContext.httpContext.request.uri.split('/');
		var pagination = '<ul class="pagination pagination-lg m-t-0 m-b-10">';
		var url = '/' + uriSegments[1] + '/' + uriSegments[2];
		//var prevDisabled = (this.nr < 2) ? 'disabled' : '';
		//if (this.nr > 1) pagination += '<li class="$prevDisabled"><a rel="pushstate" href="$url/${this.max}/${this.nr-1}">«</a></li>';
		for (i in 1 ... max+1) {
			var cls = (i == this.nr) ? 'active': '';
			pagination += '<li class="$cls"><a rel="pushstate" href="$url/${this.max}/${i}">$i</a></li>';
		}
		//var nextDisabled = (this.nr > this.max - 1) ? 'disabled' : '';		
		//if (this.nr < this.max) pagination += '<li class="$nextDisabled"><a rel="pushstate" href="$url/${this.max}/${this.nr+1}">»</a></li>';
                         pagination +=  '</ul>';
		
		return content + '<hr/>' + pagination;
	}
	
}