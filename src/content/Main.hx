package content;

import haxe.Json;
import neko.Lib;
import sys.io.File;
import tjson.TJSON;
import content.Doc;
using Lambda;
/**
 * ...
 * @author Jonas Nyström
 */

class Main 
{	
	static function main() 
	{	
		var l = new Loader();
		var docs = l.loadDocs();
		var chapters = l.loadChapters(docs);
		chapters.iter(function(c) trace(c.title));
	}
}