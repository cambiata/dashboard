package app;

import ufront.web.context.ActionContext;

/**
 * ScoreResult
 * @author Jonas Nyström
 */
class ScoreResult extends IsoResult 
{

	public function new(content:String) 
	{
		super(content);			
	}
	
	override function wrapContent(actionContext:ActionContext, content:String) 
	{		
		return content;		
	
	}
}