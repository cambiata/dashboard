package content;


/**
 * @author Jonas Nyström
 */

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
	file:String,
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