package;
import audiotools.sound.Wav16SoundManager;
import audiotools.utils.Wav16PartsBuilder;
import audiotools.Wav16;
import js.Browser;
import js.html.Event;
import js.Lib;
import nx3.audio.NotenrItem;
import nx3.audio.NotenrTools;
import nx3.ENoteVal;
import nx3.ENoteValTools;
using Detox;
using StringTools;
/**
 * ExerciseIntervals
 * @author Jonas Nyström
 */
class ExerciseIntervals 
{
  	private static var instance:ExerciseIntervals;
  
  	public static inline function getInstance()
  	{
		if (instance == null)
			return instance = new ExerciseIntervals();
		else
			return instance;
  	}
	
	private function new() { }
	
	public function init() {
		
		
		var collection = ".ex-intervals".find();
		for (node in collection) {
			new Interval(node);
		}
		
	}
	
	
}

class Interval {
	var parent:DOMNode;
	var alternatives:Array<String>;
	var semitones:Array<Int>;
	var id:String;
	var notenritems:PartsNotenrItems;
	var wave:Wav16;
	var waveId:String;
	var usediff:Bool;
	var correct:Int;
	var info:dtx.DOMNode;
	
	public function new(node:DOMNode) {
		parent = node;
		alternatives = node.attr('data-alternatives').split(',').map(function(a) return a.trim());
		semitones = alternatives.map(function (a) return getSemitones(a));
		trace('new Inteval: ' + alternatives + ' ' + semitones);
		this.createUI();
		this.id = 'ID-' + alternatives.join('') + Std.string(Math.random()).replace('.', '-');
		this.waveId = '';
		this.usediff = true;
		//this.notenritems = createNotenrItems(10, 0);
		//createWave();
		newinterval();
	}
	
	function createWave() 
	{
		NotenrTools.calculateSoundLengths(this.notenritems, 60);		
		Wav16PartsBuilder.getInstance().getPartsnotesWav16Async(this.waveId, this.notenritems, ['piano', 'piano']).handle(function(wave:Wav16) {
			trace('WAVE :-)');
			trace(wave.length);
			this.wave = wave;
		});				
	}
	
	public function getSemitones(type:String):Int {
		type = type.toUpperCase();
		return switch type {
			case 'R1', 'F2': 0;
			case 'L2', 'Ö1': 1;
			case 'S2', 'F3': 2;
			case 'Ö2', 'L3': 3;
			case 'S3', 'F4': 4;
			case 'R4', 'Ö3': 5;
			case 'Ö4', 'F5': 6;
			case 'R5', 'F6': 7;
			case 'Ö5', 'L6': 8;
			case 'S6', 'F7': 9;
			case 'L7', 'Ö6': 10;
			case 'S7', 'F8': 11;
			case 'R8', 'F9': 12;
			case 'L9', 'Ö8': 1;
			case 'S9', 'F10': 2;
			case 'Ö9', 'L10': 3;			
			case 'S10', 'F11': 4;		
			case 'R11', 'Ö10': 5;
			case 'Ö11', 'F12': 6;
			case 'R12': 7;			
			default: throw 'Unimplemented interval size: $type';
		}		
	}
	
	function createUI() {
		trace(this.semitones);

		/*
		var newbutton = Detox.create('button');
		newbutton.textContent = 'new';
		this.parent.appendChild(newbutton);
		newbutton.on('mousedown', newinterval);
		*/
		
		var playbutton = Detox.create('button');
		playbutton.textContent = 'Play';
		this.parent.appendChild(playbutton);
		playbutton.on('mousedown', play);
		playbutton.setAttr('class', 'nx-button nx-green');
		
		var label = Detox.create('label');
		label.textContent = ' Spela samtidigt ';
		var checkbox = Detox.create('input');
		checkbox.setAttr('type', 'checkbox');
		checkbox.on('change', function(e) {
				this.usediff = ! untyped checkbox.checked;
				newinterval();
		});
		label.appendChild(checkbox);
		this.parent.appendChild(label);

		this.parent.append(Detox.create('br'));
		
		info = Detox.create('span');
		info.textContent = 'Info';
		this.parent.appendChild(info);
		
		
		this.parent.append(Detox.create('br'));
		
		var idx = 0;
		for (alt in alternatives) {
			var abutton = Detox.create('button');
			abutton.textContent = alternatives[idx];
			var semi = this.semitones[idx];
			abutton.setAttr('class', 'btn btn-primary btn-icon btn-circle btn-lg');
			abutton.setAttr('style', 'margin:4px');
			this.parent.appendChild(abutton);
			abutton.on('mousedown', function(e) {
				answer(semi);
			});			
			idx++;
		}
	}
	
	function newinterval(e=null, delay=0) 
	{
		var rnd = Math.floor(Math.random() * (this.alternatives.length));
		
		var rndsemi = this.semitones[rnd];
		
		var rnd1 = Std.int(Math.random() * 24) + 60;
		var rnd2 = (Math.random() > 0.5) ? rnd1 + rndsemi : rnd1 - rndsemi;
		this.waveId = this.id + '-' + rnd1 + '-' + rnd2;
		
		while (rnd1 < 48) { rnd1++; rnd2++; };
		while (rnd2 < 48) { rnd1++; rnd2++; };
		
		
		trace(Std.string([rnd, rndsemi, rnd1, rnd2, this.waveId]));
		
		var diff = (this.usediff) ? ENoteValTools.value(ENoteVal.Nv4): 0;
		
		this.notenritems = this.createNotenrItems(rnd1, rnd2, diff);
		createWave();
		this.correct = rndsemi;
		var altcopy = alternatives.copy();
		
		var lastalt = altcopy.pop();
		
		var otheralts = altcopy.join(', ');

		Browser.window.setTimeout(function() {						
			this.info.textContent = 'Ett nytt slumpintervall bestående av något av intervallen $otheralts och $lastalt har skapats. Klicka på playknappen för att höra intervallet spelas.';
		}, delay);		
		
	}
	
	function playCallback(id:String, pos:Float) {
	
	}		

	function play(e) 
	{
		Wav16SoundManager.getInstance().initSound(this.wave, this.playCallback, this.waveId);			
		Wav16SoundManager.getInstance().start(0);		
		this.info.textContent = 'Klicka på den knapp nedan som motsvarar det intervall du hör spelas';
	}
	
	function createNotenrItems(rnd1:Int, rnd2:Int, diff:Int = 0) {	
		trace('diff: $diff');
		var notenritem1:NotenrItem = NotenrTools.createNotenrItem(0, 0, ENoteValTools.value(ENoteVal.Nv4), 0, 0, rnd1, null, null, null, '', false, true, 0, 0,  ENoteValTools.value(ENoteVal.Nv1) +ENoteValTools.value(ENoteVal.Nv1), null);
		var notenritem2:NotenrItem = NotenrTools.createNotenrItem(0,diff , ENoteValTools.value(ENoteVal.Nv4), 0, 0, rnd2, null, null, null, '', false, true, 1, 0,  ENoteValTools.value(ENoteVal.Nv1) +ENoteValTools.value(ENoteVal.Nv1), null);		
		var part1:NotenrItems = [notenritem1];
		var part2:NotenrItems = [notenritem2];
		var parts:PartsNotenrItems = [part1, part2];
		return parts;
	}
	

	
	function answer(a:Int) {
		trace('answer : $a');
		//Lib.alert(this.correct + ' ' + a);
		if (this.correct == a) {
			this.info.setInnerHTML('<b>Rätt!</b> Vänta medan ett nytt slumpexempel skapas...');
			newinterval(null, 1200);		
	
			
		} else {
			this.info.textContent = 'Nänä! Klicka på playknappen, lyssna och försök igen.';
		}
		
		
	}
	
}