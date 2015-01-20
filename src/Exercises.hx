package;
import js.Browser;
import js.html.Element;
import js.Lib;
import nx3.js.MouseInteraction;
import nx3.NNote;
import nx3.NNotes;
import nx3.NScore;
import nx3.utils.PartFilter;
import nx3.utils.RandomBuilder;
import nx3.utils.ScriptScoresX;
import nx3.utils.ScriptScoresXInteraction;
import nx3.utils.ScriptScoreX;
import nx3.xml.ScoreXML;

import audiotools.sound.Wav16SoundManager;
import audiotools.utils.Wav16PartsBuilder;

using Lambda;
/**
 * Exercises
 * @author Jonas Nyström
 */
@:expose
class Exercises 
{

	/*
	public function new(scoreId:String) 
	{
		this.scoreId = scoreId;
		
		this.init();
		
	}
	*/
	
	static var count:Int = 1;
	static var correctIncrease = 5;
	static var correctCount = 0;

	
	static var nscoreRandom:NScore;
	static var currentScoreId:String;
	
	static public function random(scoreId:String = '') {
		
		var nscore = getNScore(scoreId);
		//Lib.alert(scoreId);
		clear();
		
		var nscoreFiltered = new NScore(new PartFilter(nscore.nbars).getPart(0));
		nscoreRandom = new NScore(new RandomBuilder(nscoreFiltered.nbars).getRandomNotes(count));		
		
		ScriptScoresXInteraction.getInstance().onInteractExternal = function(scriptScore:ScriptScoreX, interaction:MouseInteraction) {
			if (scoreId != scriptScore.id) return;
			switch interaction {
				case MouseInteraction.PlayNote(scoreId, pnote, noteinfo, sound): {
					var note:NNote = pnote.nnote;
					answerNotes.push(note);
					
					feedback();
					
					Browser.document.getElementById('randomFeedback').textContent = Std.string(answerNotes.length);
				}				
				default:
			}
			
			//Lib.alert(scoreId + ' ' + scriptScore.id);
		}
		
		Browser.document.getElementById('randomFeedback').textContent = 'Klicka nu på playknappen för att höra tonföljden';
		
		var div = Browser.document.getElementById('feedbackdiv');
		for (i in 0 ... count) {
			var span = Browser.document.createSpanElement();
			span.textContent = Std.string(i + 1);
			span.classList.add('btn');
			span.classList.add('btn-default');
			span.classList.add('btn-circle');
			span.style.marginLeft = '4px';
			div.appendChild(span);	
		}		
		
	}
	
	static function feedback() {
		
		var div = Browser.document.getElementById('feedbackdiv');
		div.innerHTML = '';
		
		var randomNotes:NNotes = nscoreRandom.nbars[0].nparts[0].nvoices[0].nnotes;
		
		var randomTags = [ for (n in randomNotes) n.getTag()];
		var answerTags = [ for (n in answerNotes) n.getTag()];
		
		if (answerTags.length > randomTags.length) {
			clear();
			return;
		}
		
		

		
		var anidx = 0;
		for (at in answerTags) {
			
			var noteCorrect:Bool = (at == randomTags[anidx]);
			var noteExists:Bool = randomTags.has(at);
			
			var span = Browser.document.createSpanElement();
			span.textContent = Std.string(anidx + 1);
			span.classList.add('btn');
			span.classList.add('btn-default');
			span.classList.add('btn-circle');
			span.style.marginLeft = '4px';
			if (noteCorrect) {
				span.classList.add('btn-success');
			} else {
				if (noteExists) 
					span.classList.add('btn-warning');
				else 
					span.classList.add('btn-inverse');
			}
			div.appendChild(span);
			
			anidx++;
		}
		for (i in anidx ... randomTags.length) {
			var span = Browser.document.createSpanElement();
			span.textContent = Std.string(i + 1);
			span.classList.add('btn');
			span.classList.add('btn-default');
			span.classList.add('btn-circle');
			span.style.marginLeft = '4px';
			div.appendChild(span);	
			
		}
		
		var correct = (Std.string(randomTags) == Std.string(answerTags));
		if (correct) {
			
			
			correctCount++;
			if (correctCount > correctIncrease) {
				correctCount = 0;
				count++;			
				Lib.alert('Bravo! Nu förlängs övningen till $count toner.');
			} else {
				Lib.alert('Korrekt!');
			}
			clear();
		}
		
	}
	
	static var answerNotes:NNotes = [];
	
	
	static public function playRandom() {
		
		if (nscoreRandom == null) {
			Lib.alert('No randomScore created!');
			return;
		}
		
		function playCallback(id:String, pos:Float) {
		
		}	
		
		Wav16PartsBuilder.getInstance().getScoreWav16Async(nscoreRandom, 60).handle(function(wav16) {
			trace('FINISHED nscore1');
			 Wav16SoundManager.getInstance().initSound(wav16, playCallback, nscoreRandom.uuid + '60');
			 //this.drawingTools.drawColumnFromTime(0);
			 Wav16SoundManager.getInstance().start(0);										
		});			
		
	}
	
	static public function clear() {
		var div = Browser.document.getElementById('feedbackdiv');
		div.innerHTML = '';		
		answerNotes = [];	
		//feedback();
		Browser.document.getElementById('randomFeedback').textContent = Std.string(answerNotes.length);
	}
	
	static function getNScore(scoreId:String) {		
		var script:Element = Browser.document.getElementById(scoreId);
		if (script == null) {
			Lib.alert('cant find $scoreId');
			return null;
		}				
		var nscore:NScore = ScoreXML.fromXmlStr(script.innerHTML);
		return nscore;
	}	
	
	
}