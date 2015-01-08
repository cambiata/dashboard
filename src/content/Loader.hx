package content;
import content.Doc.Chapter;
import content.Doc.Chapters;
import content.Doc.Docs;
import sys.io.File;
import tjson.TJSON;
using Lambda;
/**
 * Loader
 * @author Jonas Nyström
 */
class Loader 
{
	var path:String;

	public function new(contentpath:String = '.') 
	{
		this.path = contentpath;
	}
	
	public function loadDocs(filename = 'docs.json'):Docs {
		var json = File.getContent(this.path + '/' + filename);
		var jdocs:Docs = TJSON.parse(json);
		//trace(jdocs);
		var docs:Docs = new Docs();
		for (jdoc in jdocs) {
			var doc:Doc = jdoc;
			if (doc.id == null) throw "Missing doc.id";
			if (doc.file == null) throw "Missing doc.file : " + doc.id;
			if (doc.title == null) throw "Missing doc.title : " + doc.id;
			if (doc.meta == null) doc.meta = { };
			if (doc.meta.authors == null) doc.meta.authors = [];
			if (doc.meta.copyrights == null) doc.meta.copyrights = [];
			if (doc.meta.search == null) doc.meta.search = [];
			if (doc.meta.created == null) doc.meta.created = '';
			docs.push(doc);
		}
		return docs;
	}
	
	public function loadChapters(docs:Docs, filename = 'chapters.json') {
		var json = File.getContent(this.path + '/' + filename);
		var objs:Array<Dynamic> = TJSON.parse(json);		
		var chapters:Chapters =  [];

		for (obj in objs) {
			
			var chapter:Chapter = {title: obj.title, meta:{}, chdocs:[]};
			
			var objdocs:Array<Dynamic> = cast obj.docs;
			var sortidx = 0;
			for (objdoc in objdocs) {
				var doc = docs.find(function (d) return d.id == objdoc.id);
				var sort :Int = (objdoc.sort != null) ? Std.parseInt(objdoc.sort) : sortidx++; 
				if (doc != null) chapter.chdocs.push( { doc: doc, sort: sort } );
			}
			chapters.push(chapter);
		}
		
		return chapters;		
	}
	
	
}