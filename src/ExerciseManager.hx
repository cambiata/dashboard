package;
import js.Browser;
import js.Lib;
import nx3.utils.ScriptScoreX;
using Detox;
/**
 * ExerciseManager
 * @author 
 */
class ExerciseManager 
{

  	private static var instance:ExerciseManager;
  
  	public static inline function getInstance()
  	{
		if (instance == null)
			return instance = new ExerciseManager();
		else
			return instance;
  	}
	
	private function new() { }
	
	public function init() {
		//Lib.alert('ExerciseManager.init()');
		
		//var nodes = Browser.document.getElementsByClassName('nx-exercise');
		var nodes:DOMCollection = ".nx-exercise".find();
	
		//Lib.alert(nodes.length);
		for (node in nodes) {
			var type = node.attr('data-type');
			if (type == null) continue;
			switch type {
				case 'test': new ExerciseTest(node);
				default: Lib.alert('ExerciseManager: .nx-exercise node without data-type set');
			}
		}
	}
	
}

class ExerciseTest {
	var parentNode:DOMNode;
	var scriptScore:ScriptScoreX;
	
	public function new(parentNode:DOMNode) {
		this.parentNode = parentNode;
		var script = Detox.find(".nx-score").first();
		
		if (script == null) {
			Lib.alert('ExerciseTest: ScoreScript == null');
			return;
		}
		
		this.scriptScore = new ScriptScoreX(script);
		
		//Lib.alert('new ExerciseTest');
	}
	
	
	
}
