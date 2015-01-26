package app;

#if js
import audiotools.webaudio.pitch.PitchRecognizer;
import js.Browser;
import js.html.Element;
import js.html.ScriptElement;
import js.Lib;
import nx3.utils.ScriptScoresX;
#end

/**
 * ClientUI
 * @author Jonas Nyström
 */
class ClientUI 
{

	static public function initScores(id:String='Leffe') {
		
		#if js
		
		 js.Browser.window.setTimeout(function() {			 
			 ScriptScoresX.getInstance().invokeBodyScores();
			 ExerciseManager.getInstance().init();
			 ExerciseIntervals.getInstance().init();
		 }, 0);
		//ScriptScores.getInstanceX().init();
		//ScriptScores.getInstance().render();			
		
		/*
		var url = Browser.location.pathname;
		trace('URL' + url);
		
		
		var contentEl = js.Browser.document.getElementById('content');
		if (contentEl == null) {
			throw('Could not init contentCache on first request');
			return;
		}
		var content = contentEl.innerHTML;
		var url = js.Browser.window.location.pathname;
		Iso.contentCache.set(url, content);
		*/
		
		
		/*
		js.Browser.document.getElementById('btnScores').onmousedown = function(e) {
			ScriptScores.getInstance().init();
			ScriptScores.getInstance().render();			
		}

		js.Browser.document.getElementById('btnClear').onmousedown = function(e) {
			ScriptScores.getInstance().init();
			ScriptScores.getInstance().clearAll();
		}		
		*/
		try {
			js.Browser.document.getElementById('btnPitch').onmousedown = function(e) {
				PitchRecognizer.getInstance();
				PitchRecognizer.getInstance().onPitch = function(currentFreq:Float, closestIndex:Int, maxVolume:Float) {
					var semitone = (currentFreq > 0) ? PitchRecognizer.getSemitoneDiff(currentFreq) : 0;
					var roundSemitone = Math.round(semitone);
					Browser.document.getElementById('lblPitch').textContent = '$currentFreq : $roundSemitone / $semitone';
				}
			}
			
			js.Browser.document.getElementById('btnPitchStart').onmousedown = function(e) {
				PitchRecognizer.getInstance().startAnalyzing();
			}

			js.Browser.document.getElementById('btnPitchStop').onmousedown = function(e) {
				PitchRecognizer.getInstance().stopAnalyzing();
			}		
		} catch (e:Dynamic) {
			
		}
		
		#end
		
	}

	
}