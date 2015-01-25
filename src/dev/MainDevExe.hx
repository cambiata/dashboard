package dev;

import audiotools.sound.Wav16SoundManager;
import js.Lib;
import nx3.utils.ScriptScoresX;

/**
 * ...
 * @author Jonas Nyström
 */

class MainDevExe
{
	
	static function main() 
	{
		trace('hello');
		Wav16SoundManager.getInstance();
		ScriptScoresX.getInstance().invokeBodyScores();
		//ExerciseManager.getInstance().init();
	}
	
}