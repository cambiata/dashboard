package content;

/**
 * @author Jonas Nyström
 */

 class Document {
	var title(default, null):String;
	var id(default, null):String;
	var tags(default, null):Array<String>;
	var authors(default, null):Array<String>;
	var copyrights(default, null):Array<String>;
	var created(default, null):String;	
	
	public function new(title:String, id:String, ?tags:Array<String>, ?authors:Array<String>, ?copyrights:Array<String>, ?created:String) {
		this.title = title;
		this.id = id;
		this.tags = tags;
		this.authors = authors;
		this.copyrights = copyrights;
		this.created = created;
	}
}

typedef DocumentItem = {doc:Document, sort:Int}

class Documents extends Document {
	var documents:Array<DocumentItem>;
}


typedef Meta = {
	?search:Array<String>,
	?authors:Array<String>,
	?copyrights: Array<String>,
	?created:String,
 }
 
typedef Doc = {
	id:String,
	title:String,
	meta:Meta,	
}

typedef Docs = Array<Doc>;

typedef ChapterDoc = {
	doc:Doc,
	sort:Int,
}

typedef Chapter = {
	title:String,
	meta:Meta,
	chdocs: Array<ChapterDoc>,
}

typedef Chapters = Array<Chapter>;

typedef BookChapter = {
	chapter:Chapter,
	sort:Int,
}

typedef Book = {
	title:String,
	meta:Meta,
	chapters:Array<BookChapter>
}