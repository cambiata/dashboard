package;
import js.Browser;
import js.html.Element;
import js.Lib;
import nx3.audio.NotenrItem;
import nx3.js.MouseInteraction;
import nx3.NNote;
import nx3.NNotes;
import nx3.NScore;
import nx3.PBar;
import nx3.PNote;
import nx3.PVoice;
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
	
	static public function init() {
		count = 2;
		//Lib.alert('init');
	}
	
	static var count:Int = 2;
	static var correctIncrease = 4;
	static var correctCount = 0;

	
	static var nscoreRandom:NScore;
	static var currentScoreId:String;
	
	
	
	static public function random(scoreId:String = '') {
		currentScoreId = scoreId;
		var nscore = getNScore(scoreId);
		//Lib.alert(scoreId);
		clear(true, true);
		
		var nscoreFiltered = new NScore(new PartFilter(nscore.nbars).getPart(0));
		nscoreRandom = new NScore(new RandomBuilder(nscoreFiltered.nbars).getRandomNotes(count));		
		
		ScriptScoresXInteraction.getInstance().onInteractExternal = function(scriptScore:ScriptScoreX, interaction:MouseInteraction) {
			if (scoreId != scriptScore.id) return;
			switch interaction {
				case MouseInteraction.PlayNote(scoreId, pnote, noteinfo, sound): {
					var note:NNote = pnote.nnote;
					
					var pn:PNote = pnote;
					var voice:PVoice = pn.getVoice();
					var bar:PBar =  voice.getPart().getBar();
					var noteidx = voice.getNotes().indexOf(pnote);
					var baridx = bar.getScore().getBars().indexOf(bar);
					var ninfo:NotenrItem = noteinfo;
					if (ninfo.partnr > 0) {						
						note = bar.getPart(0).getVoice(0).getNote(noteidx).nnote;						
					}
					
					answerNotes.push(note);
					feedback();
					
					//Browser.document.getElementById('randomFeedback').textContent = Std.string(answerNotes.length);
				}				
				default:
			}
			
			//Lib.alert(scoreId + ' ' + scriptScore.id);
		}
		showInstructions('
			<button class="btn btn-success" onmousedown="Exercises.playRandom()">Play</button>
			<hr />
			<p>En ny slumpgenererad tonföljd har skapats, $count toner lång. Tonerna motsvaras av $count runda grå cirklar ovan. Klicka nu på playknappen för att höra tonföljden spelas.</p>
		');
		
		drawBlank();
	}
	
	static function feedback() {
		
		var div = Browser.document.getElementById('feedbackdiv');
		div.innerHTML = '';
		
		var randomNotes:NNotes = nscoreRandom.nbars[0].nparts[0].nvoices[0].nnotes;
		
		var randomTags = [ for (n in randomNotes) n.getTag()];
		var answerTags = [ for (n in answerNotes) n.getTag()];

		/*
		if (answerTags.length > randomTags.length) {
			clear();
			return;
		}
		*/
		
		var anidx = 0;
		for (at in answerTags) {
			
			var noteCorrect:Bool = (at == randomTags[anidx]);
			var noteExists:Bool = randomTags.has(at);
			
			var span = Browser.document.createSpanElement();
			span.innerHTML = '&nbsp;&nbsp;'; // Std.string(anidx + 1);
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
		drawBlank(anidx);
		
		var correct = (Std.string(randomTags) == Std.string(answerTags));
		if (correct) {
			correctCount++;
			if (correctCount > correctIncrease) {
				correctCount = 0;
				count++;			
				//Lib.alert('Bravo! Nu förlängs övningen till $count toner.');
				showInstructions('
				<button id="btnRandomCreate" class="btn btn-primary" >Skapa nytt slumpexempel</button>	
				<hr />
				<p><b>Bravo!</b>Nu förlängs övningen till $count toner.</p>
				', true);
				Browser.document.getElementById('btnRandomCreate').onmousedown = function(e) {
					Exercises.random(currentScoreId);
				}
			} else {
				//Lib.alert('Korrekt!');
				showInstructions('
					<button id="btnRandomCreate" class="btn btn-primary" >Skapa nytt slumpexempel</button>
					<hr />
					<p><b>Rätt!</b> Klicka på Skapa-knappen och därefter på Play-knappen för att lyssna till ett nytt exempel.</p>
				', true);
				Browser.document.getElementById('btnRandomCreate').onmousedown = function(e) {
					Exercises.random(currentScoreId);
				}
				//Exercises.random(currentScoreId);
			}
			answerNotes = [];
			return;
		}
		
		if (answerTags.length >= randomTags.length) {
			clear(true, true);
			showInstructions('
				<button class="btn btn-success" onmousedown="Exercises.playRandom()">Play</button>
				<hr />
				<p>Du har svarat genom att klicka på $count toner. Inte alla rätt! Klicka på Play-knappen och försök igen!</p>
			');
		}
		
	}
	
	static function drawBlank(startIdx = 0) {
		
		var div = Browser.document.getElementById('feedbackdiv');
		for (i in startIdx ... count) {
			var span = Browser.document.createSpanElement();
			span.innerHTML = '&nbsp;&nbsp;'; // Std.string(i + 1);
			span.classList.add('btn');
			span.classList.add('btn-default');
			span.classList.add('btn-circle');
			span.style.marginLeft = '4px';
			div.appendChild(span);	
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
			 showInstructions('
			 <button class="btn btn-success" onmousedown="Exercises.playRandom()">Play</button><button class="btn btn-warning" style="margin-left:4px" onmousedown="Exercises.clear(true, false)">Rensa</button>
			 <hr />
			 <p>När tonföljden ($count toner lång) spelats färdig: Klicka på nothuvudena ovan i den ordning du uppfattar dem. För varje ton du klickar på så färgas motsvarande runda markering ovan. Grön markering visar att tonhöjden är riktig, gul markering visar att tonhöjden du klickat på finns med i lösningen, men på annan plats.</p>
			 ');
		});			
		
	}
	
	static public function clear(clearFeedback:Bool=false, clearInstructions=true) {
		if (clearFeedback) Browser.document.getElementById('feedbackdiv').innerHTML = '';	
		if (clearInstructions) Browser.document.getElementById('instructions').innerHTML = '';
		answerNotes = [];	
		//feedback();
		//Browser.document.getElementById('randomFeedback').textContent = Std.string(answerNotes.length);
		//showFeedback(
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
	
	static public function showInstructions(msg:String, alert:Bool=false) {
		if (alert) {
			var html = '<div class="alert alert-success">$msg</div>';
			Browser.document.getElementById('instructions').innerHTML = html;
		} else 
		{
			var html = '<div class="alert alert-warning">$msg</div>';
			Browser.document.getElementById('instructions').innerHTML = html;
		}
	}
	
	
}