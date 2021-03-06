(function ($hx_exports) { "use strict";
$hx_exports.audiotools = $hx_exports.audiotools || {};
$hx_exports.audiotools.sound = $hx_exports.audiotools.sound || {};
$hx_exports.audiotools.sound.Wav16SoundJS = $hx_exports.audiotools.sound.Wav16SoundJS || {};
var $estr = function() { return js.Boot.__string_rec(this,''); };
function $extend(from, fields) {
	function Inherit() {} Inherit.prototype = from; var proto = new Inherit();
	for (var name in fields) proto[name] = fields[name];
	if( fields.toString !== Object.prototype.toString ) proto.toString = fields.toString;
	return proto;
}
var EReg = function(r,opt) {
	opt = opt.split("u").join("");
	this.r = new RegExp(r,opt);
};
EReg.__name__ = true;
EReg.prototype = {
	match: function(s) {
		if(this.r.global) this.r.lastIndex = 0;
		this.r.m = this.r.exec(s);
		this.r.s = s;
		return this.r.m != null;
	}
	,matched: function(n) {
		if(this.r.m != null && n >= 0 && n < this.r.m.length) return this.r.m[n]; else throw "EReg::matched";
	}
	,__class__: EReg
};
var ExerciseIntervals = function() {
};
ExerciseIntervals.__name__ = true;
ExerciseIntervals.getInstance = function() {
	if(ExerciseIntervals.instance == null) return ExerciseIntervals.instance = new ExerciseIntervals(); else return ExerciseIntervals.instance;
};
ExerciseIntervals.prototype = {
	init: function() {
		var collection = dtx.Tools.find(".ex-intervals");
		var $it0 = HxOverrides.iter(collection.collection);
		while( $it0.hasNext() ) {
			var node = $it0.next();
			new Interval(node);
		}
	}
	,__class__: ExerciseIntervals
};
var Interval = function(node) {
	var _g = this;
	this.parent = node;
	this.alternatives = dtx.single.ElementManipulation.attr(node,"data-alternatives").split(",").map(function(a) {
		return StringTools.trim(a);
	});
	this.semitones = this.alternatives.map(function(a1) {
		return _g.getSemitones(a1);
	});
	console.log("new Inteval: " + Std.string(this.alternatives) + " " + Std.string(this.semitones));
	this.createUI();
	this.id = "ID-" + this.alternatives.join("") + StringTools.replace(Std.string(Math.random()),".","-");
	this.waveId = "";
	this.usediff = true;
	this.newinterval();
};
Interval.__name__ = true;
Interval.prototype = {
	createWave: function() {
		var _g = this;
		nx3.audio.NotenrTools.calculateSoundLengths(this.notenritems,null,60);
		var this1 = (audiotools.utils.Wav16PartsBuilder.instance == null?audiotools.utils.Wav16PartsBuilder.instance = new audiotools.utils.Wav16PartsBuilder():audiotools.utils.Wav16PartsBuilder.instance).getPartsnotesWav16Async(this.waveId,this.notenritems,["piano","piano"]);
		this1(function(wave) {
			console.log("WAVE :-)");
			console.log(wave.get_length());
			_g.wave = wave;
		});
	}
	,getSemitones: function(type) {
		type = type.toUpperCase();
		switch(type) {
		case "R1":case "F2":
			return 0;
		case "L2":case "Ö1":
			return 1;
		case "S2":case "F3":
			return 2;
		case "Ö2":case "L3":
			return 3;
		case "S3":case "F4":
			return 4;
		case "R4":case "Ö3":
			return 5;
		case "Ö4":case "F5":
			return 6;
		case "R5":case "F6":
			return 7;
		case "Ö5":case "L6":
			return 8;
		case "S6":case "F7":
			return 9;
		case "L7":case "Ö6":
			return 10;
		case "S7":case "F8":
			return 11;
		case "R8":case "F9":
			return 12;
		case "L9":case "Ö8":
			return 1;
		case "S9":case "F10":
			return 2;
		case "Ö9":case "L10":
			return 3;
		case "S10":case "F11":
			return 4;
		case "R11":case "Ö10":
			return 5;
		case "Ö11":case "F12":
			return 6;
		case "R12":
			return 7;
		default:
			throw "Unimplemented interval size: " + type;
		}
	}
	,createUI: function() {
		var _g = this;
		console.log(this.semitones);
		var playbutton = dtx.Tools.create("button");
		playbutton.textContent = "play";
		this.parent.appendChild(playbutton);
		dtx.single.EventManagement.on(playbutton,"mousedown",null,$bind(this,this.play));
		var label = dtx.Tools.create("label");
		label.textContent = "samtidigt";
		var checkbox = dtx.Tools.create("input");
		dtx.single.ElementManipulation.setAttr(checkbox,"type","checkbox");
		dtx.single.ElementManipulation.setInnerHTML(checkbox,"Samtidigt");
		dtx.single.EventManagement.on(checkbox,"change",null,function(e) {
			_g.usediff = !checkbox.checked;
			_g.newinterval();
		});
		label.appendChild(checkbox);
		this.parent.appendChild(label);
		dtx.single.DOMManipulation.append(this.parent,dtx.Tools.create("br"));
		this.info = dtx.Tools.create("span");
		this.info.textContent = "Info";
		this.parent.appendChild(this.info);
		dtx.single.DOMManipulation.append(this.parent,dtx.Tools.create("br"));
		var idx = 0;
		var _g1 = 0;
		var _g11 = this.alternatives;
		while(_g1 < _g11.length) {
			var alt = _g11[_g1];
			++_g1;
			var abutton = dtx.Tools.create("button");
			abutton.textContent = this.alternatives[idx];
			var semi = [this.semitones[idx]];
			this.parent.appendChild(abutton);
			dtx.single.EventManagement.on(abutton,"mousedown",null,(function(semi) {
				return function(e1) {
					_g.answer(semi[0]);
				};
			})(semi));
			idx++;
		}
	}
	,newinterval: function(e) {
		var rnd = Math.floor(Math.random() * this.alternatives.length);
		var rndsemi = this.semitones[rnd];
		var rnd1 = Std["int"](Math.random() * 24) + 60;
		var rnd2;
		if(Math.random() > 0.5) rnd2 = rnd1 + rndsemi; else rnd2 = rnd1 - rndsemi;
		this.waveId = this.id + "-" + rnd1 + "-" + rnd2;
		while(rnd1 < 48) {
			rnd1++;
			rnd2++;
		}
		while(rnd2 < 48) {
			rnd1++;
			rnd2++;
		}
		console.log(Std.string([rnd,rndsemi,rnd1,rnd2,this.waveId]));
		var diff;
		if(this.usediff) diff = nx3.ENoteValTools.value(nx3.ENoteVal.Nv4); else diff = 0;
		this.notenritems = this.createNotenrItems(rnd1,rnd2,diff);
		this.createWave();
		this.correct = rndsemi;
		var altcopy = this.alternatives.slice();
		var lastalt = altcopy.pop();
		var otheralts = altcopy.join(", ");
		this.info.textContent = "Ett nytt slumpintervall bestående av något av intervallen " + otheralts + " och " + lastalt + " har skapats. Klicka på playknappen för att höra intervallet spelas.";
	}
	,playCallback: function(id,pos) {
	}
	,play: function(e) {
		(audiotools.sound.Wav16SoundManager.instance == null?audiotools.sound.Wav16SoundManager.instance = new audiotools.sound.Wav16SoundManager():audiotools.sound.Wav16SoundManager.instance).initSound(this.wave,$bind(this,this.playCallback),this.waveId);
		(audiotools.sound.Wav16SoundManager.instance == null?audiotools.sound.Wav16SoundManager.instance = new audiotools.sound.Wav16SoundManager():audiotools.sound.Wav16SoundManager.instance).start(0);
		this.info.textContent = "Klicka på den knapp nedan som motsvarar det intervall du hör spelas";
	}
	,createNotenrItems: function(rnd1,rnd2,diff) {
		if(diff == null) diff = 0;
		console.log("diff: " + diff);
		var notenritem1 = nx3.audio.NotenrTools.createNotenrItem(0,0,nx3.ENoteValTools.value(nx3.ENoteVal.Nv4),0,0,rnd1,null,null,null,"",false,true,0,0,nx3.ENoteValTools.value(nx3.ENoteVal.Nv1) + nx3.ENoteValTools.value(nx3.ENoteVal.Nv1),null);
		var notenritem2 = nx3.audio.NotenrTools.createNotenrItem(0,diff,nx3.ENoteValTools.value(nx3.ENoteVal.Nv4),0,0,rnd2,null,null,null,"",false,true,1,0,nx3.ENoteValTools.value(nx3.ENoteVal.Nv1) + nx3.ENoteValTools.value(nx3.ENoteVal.Nv1),null);
		var part1 = [notenritem1];
		var part2 = [notenritem2];
		var parts = [part1,part2];
		return parts;
	}
	,answer: function(a) {
		var _g = this;
		console.log("answer : " + a);
		if(this.correct == a) {
			this.info.textContent = "Rätt! Vänta medan ett nytt slumpexempel skapas...";
			window.setTimeout(function() {
				_g.newinterval();
			},800);
		} else this.info.textContent = "Nänä! Klicka på playknappen, lyssna och försök igen.";
	}
	,__class__: Interval
};
var HxOverrides = function() { };
HxOverrides.__name__ = true;
HxOverrides.cca = function(s,index) {
	var x = s.charCodeAt(index);
	if(x != x) return undefined;
	return x;
};
HxOverrides.substr = function(s,pos,len) {
	if(pos != null && pos != 0 && len != null && len < 0) return "";
	if(len == null) len = s.length;
	if(pos < 0) {
		pos = s.length + pos;
		if(pos < 0) pos = 0;
	} else if(len < 0) len = s.length + len - pos;
	return s.substr(pos,len);
};
HxOverrides.indexOf = function(a,obj,i) {
	var len = a.length;
	if(i < 0) {
		i += len;
		if(i < 0) i = 0;
	}
	while(i < len) {
		if(a[i] === obj) return i;
		i++;
	}
	return -1;
};
HxOverrides.remove = function(a,obj) {
	var i = HxOverrides.indexOf(a,obj,0);
	if(i == -1) return false;
	a.splice(i,1);
	return true;
};
HxOverrides.iter = function(a) {
	return { cur : 0, arr : a, hasNext : function() {
		return this.cur < this.arr.length;
	}, next : function() {
		return this.arr[this.cur++];
	}};
};
var Lambda = function() { };
Lambda.__name__ = true;
Lambda.array = function(it) {
	var a = new Array();
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var i = $it0.next();
		a.push(i);
	}
	return a;
};
Lambda.list = function(it) {
	var l = new List();
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var i = $it0.next();
		l.add(i);
	}
	return l;
};
Lambda.map = function(it,f) {
	var l = new List();
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var x = $it0.next();
		l.add(f(x));
	}
	return l;
};
Lambda.has = function(it,elt) {
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var x = $it0.next();
		if(x == elt) return true;
	}
	return false;
};
Lambda.foreach = function(it,f) {
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var x = $it0.next();
		if(!f(x)) return false;
	}
	return true;
};
Lambda.iter = function(it,f) {
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var x = $it0.next();
		f(x);
	}
};
Lambda.filter = function(it,f) {
	var l = new List();
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var x = $it0.next();
		if(f(x)) l.add(x);
	}
	return l;
};
Lambda.indexOf = function(it,v) {
	var i = 0;
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var v2 = $it0.next();
		if(v == v2) return i;
		i++;
	}
	return -1;
};
var List = function() {
	this.length = 0;
};
List.__name__ = true;
List.prototype = {
	add: function(item) {
		var x = [item];
		if(this.h == null) this.h = x; else this.q[1] = x;
		this.q = x;
		this.length++;
	}
	,push: function(item) {
		var x = [item,this.h];
		this.h = x;
		if(this.q == null) this.q = x;
		this.length++;
	}
	,iterator: function() {
		return { h : this.h, hasNext : function() {
			return this.h != null;
		}, next : function() {
			if(this.h == null) return null;
			var x = this.h[0];
			this.h = this.h[1];
			return x;
		}};
	}
	,map: function(f) {
		var b = new List();
		var l = this.h;
		while(l != null) {
			var v = l[0];
			l = l[1];
			b.add(f(v));
		}
		return b;
	}
	,__class__: List
};
var IMap = function() { };
IMap.__name__ = true;
IMap.prototype = {
	__class__: IMap
};
Math.__name__ = true;
var Reflect = function() { };
Reflect.__name__ = true;
Reflect.field = function(o,field) {
	try {
		return o[field];
	} catch( e ) {
		return null;
	}
};
Reflect.setField = function(o,field,value) {
	o[field] = value;
};
Reflect.isFunction = function(f) {
	return typeof(f) == "function" && !(f.__name__ || f.__ename__);
};
Reflect.compare = function(a,b) {
	if(a == b) return 0; else if(a > b) return 1; else return -1;
};
var Std = function() { };
Std.__name__ = true;
Std.string = function(s) {
	return js.Boot.__string_rec(s,"");
};
Std["int"] = function(x) {
	return x | 0;
};
Std.parseInt = function(x) {
	var v = parseInt(x,10);
	if(v == 0 && (HxOverrides.cca(x,1) == 120 || HxOverrides.cca(x,1) == 88)) v = parseInt(x);
	if(isNaN(v)) return null;
	return v;
};
Std.parseFloat = function(x) {
	return parseFloat(x);
};
Std.random = function(x) {
	if(x <= 0) return 0; else return Math.floor(Math.random() * x);
};
var StringBuf = function() {
	this.b = "";
};
StringBuf.__name__ = true;
StringBuf.prototype = {
	add: function(x) {
		this.b += Std.string(x);
	}
	,addSub: function(s,pos,len) {
		if(len == null) this.b += HxOverrides.substr(s,pos,null); else this.b += HxOverrides.substr(s,pos,len);
	}
	,__class__: StringBuf
};
var StringTools = function() { };
StringTools.__name__ = true;
StringTools.htmlEscape = function(s,quotes) {
	s = s.split("&").join("&amp;").split("<").join("&lt;").split(">").join("&gt;");
	if(quotes) return s.split("\"").join("&quot;").split("'").join("&#039;"); else return s;
};
StringTools.htmlUnescape = function(s) {
	return s.split("&gt;").join(">").split("&lt;").join("<").split("&quot;").join("\"").split("&#039;").join("'").split("&amp;").join("&");
};
StringTools.isSpace = function(s,pos) {
	var c = HxOverrides.cca(s,pos);
	return c > 8 && c < 14 || c == 32;
};
StringTools.ltrim = function(s) {
	var l = s.length;
	var r = 0;
	while(r < l && StringTools.isSpace(s,r)) r++;
	if(r > 0) return HxOverrides.substr(s,r,l - r); else return s;
};
StringTools.rtrim = function(s) {
	var l = s.length;
	var r = 0;
	while(r < l && StringTools.isSpace(s,l - r - 1)) r++;
	if(r > 0) return HxOverrides.substr(s,0,l - r); else return s;
};
StringTools.trim = function(s) {
	return StringTools.ltrim(StringTools.rtrim(s));
};
StringTools.replace = function(s,sub,by) {
	return s.split(sub).join(by);
};
StringTools.hex = function(n,digits) {
	var s = "";
	var hexChars = "0123456789ABCDEF";
	do {
		s = hexChars.charAt(n & 15) + s;
		n >>>= 4;
	} while(n > 0);
	if(digits != null) while(s.length < digits) s = "0" + s;
	return s;
};
StringTools.fastCodeAt = function(s,index) {
	return s.charCodeAt(index);
};
var Type = function() { };
Type.__name__ = true;
Type.createEnum = function(e,constr,params) {
	var f = Reflect.field(e,constr);
	if(f == null) throw "No such constructor " + constr;
	if(Reflect.isFunction(f)) {
		if(params == null) throw "Constructor " + constr + " need parameters";
		return f.apply(e,params);
	}
	if(params != null && params.length != 0) throw "Constructor " + constr + " does not need parameters";
	return f;
};
var XmlType = { __ename__ : true, __constructs__ : [] };
var Xml = function() {
};
Xml.__name__ = true;
Xml.parse = function(str) {
	return haxe.xml.Parser.parse(str);
};
Xml.createElement = function(name) {
	var r = new Xml();
	r.nodeType = Xml.Element;
	r._children = new Array();
	r._attributes = new haxe.ds.StringMap();
	r.set_nodeName(name);
	return r;
};
Xml.createPCData = function(data) {
	var r = new Xml();
	r.nodeType = Xml.PCData;
	r.set_nodeValue(data);
	return r;
};
Xml.createCData = function(data) {
	var r = new Xml();
	r.nodeType = Xml.CData;
	r.set_nodeValue(data);
	return r;
};
Xml.createComment = function(data) {
	var r = new Xml();
	r.nodeType = Xml.Comment;
	r.set_nodeValue(data);
	return r;
};
Xml.createDocType = function(data) {
	var r = new Xml();
	r.nodeType = Xml.DocType;
	r.set_nodeValue(data);
	return r;
};
Xml.createProcessingInstruction = function(data) {
	var r = new Xml();
	r.nodeType = Xml.ProcessingInstruction;
	r.set_nodeValue(data);
	return r;
};
Xml.createDocument = function() {
	var r = new Xml();
	r.nodeType = Xml.Document;
	r._children = new Array();
	return r;
};
Xml.prototype = {
	get_nodeName: function() {
		if(this.nodeType != Xml.Element) throw "bad nodeType";
		return this._nodeName;
	}
	,set_nodeName: function(n) {
		if(this.nodeType != Xml.Element) throw "bad nodeType";
		return this._nodeName = n;
	}
	,set_nodeValue: function(v) {
		if(this.nodeType == Xml.Element || this.nodeType == Xml.Document) throw "bad nodeType";
		return this._nodeValue = v;
	}
	,get: function(att) {
		if(this.nodeType != Xml.Element) throw "bad nodeType";
		return this._attributes.get(att);
	}
	,set: function(att,value) {
		if(this.nodeType != Xml.Element) throw "bad nodeType";
		this._attributes.set(att,value);
	}
	,exists: function(att) {
		if(this.nodeType != Xml.Element) throw "bad nodeType";
		return this._attributes.exists(att);
	}
	,attributes: function() {
		if(this.nodeType != Xml.Element) throw "bad nodeType";
		return this._attributes.keys();
	}
	,iterator: function() {
		if(this._children == null) throw "bad nodetype";
		return { cur : 0, x : this._children, hasNext : function() {
			return this.cur < this.x.length;
		}, next : function() {
			return this.x[this.cur++];
		}};
	}
	,elements: function() {
		if(this._children == null) throw "bad nodetype";
		return { cur : 0, x : this._children, hasNext : function() {
			var k = this.cur;
			var l = this.x.length;
			while(k < l) {
				if(this.x[k].nodeType == Xml.Element) break;
				k += 1;
			}
			this.cur = k;
			return k < l;
		}, next : function() {
			var k1 = this.cur;
			var l1 = this.x.length;
			while(k1 < l1) {
				var n = this.x[k1];
				k1 += 1;
				if(n.nodeType == Xml.Element) {
					this.cur = k1;
					return n;
				}
			}
			return null;
		}};
	}
	,elementsNamed: function(name) {
		if(this._children == null) throw "bad nodetype";
		return { cur : 0, x : this._children, hasNext : function() {
			var k = this.cur;
			var l = this.x.length;
			while(k < l) {
				var n = this.x[k];
				if(n.nodeType == Xml.Element && n._nodeName == name) break;
				k++;
			}
			this.cur = k;
			return k < l;
		}, next : function() {
			var k1 = this.cur;
			var l1 = this.x.length;
			while(k1 < l1) {
				var n1 = this.x[k1];
				k1++;
				if(n1.nodeType == Xml.Element && n1._nodeName == name) {
					this.cur = k1;
					return n1;
				}
			}
			return null;
		}};
	}
	,firstChild: function() {
		if(this._children == null) throw "bad nodetype";
		return this._children[0];
	}
	,firstElement: function() {
		if(this._children == null) throw "bad nodetype";
		var cur = 0;
		var l = this._children.length;
		while(cur < l) {
			var n = this._children[cur];
			if(n.nodeType == Xml.Element) return n;
			cur++;
		}
		return null;
	}
	,addChild: function(x) {
		if(this._children == null) throw "bad nodetype";
		if(x._parent != null) HxOverrides.remove(x._parent._children,x);
		x._parent = this;
		this._children.push(x);
	}
	,toString: function() {
		if(this.nodeType == Xml.PCData) return StringTools.htmlEscape(this._nodeValue);
		if(this.nodeType == Xml.CData) return "<![CDATA[" + this._nodeValue + "]]>";
		if(this.nodeType == Xml.Comment) return "<!--" + this._nodeValue + "-->";
		if(this.nodeType == Xml.DocType) return "<!DOCTYPE " + this._nodeValue + ">";
		if(this.nodeType == Xml.ProcessingInstruction) return "<?" + this._nodeValue + "?>";
		var s = new StringBuf();
		if(this.nodeType == Xml.Element) {
			s.b += "<";
			s.b += Std.string(this._nodeName);
			var $it0 = this._attributes.keys();
			while( $it0.hasNext() ) {
				var k = $it0.next();
				s.b += " ";
				if(k == null) s.b += "null"; else s.b += "" + k;
				s.b += "=\"";
				s.add(this._attributes.get(k));
				s.b += "\"";
			}
			if(this._children.length == 0) {
				s.b += "/>";
				return s.b;
			}
			s.b += ">";
		}
		var $it1 = this.iterator();
		while( $it1.hasNext() ) {
			var x = $it1.next();
			s.add(x.toString());
		}
		if(this.nodeType == Xml.Element) {
			s.b += "</";
			s.b += Std.string(this._nodeName);
			s.b += ">";
		}
		return s.b;
	}
	,__class__: Xml
};
var audio = {};
audio.LinearAccelerator = function(startTempo,endTempo,numBeats) {
	this.startTempo = startTempo;
	this.deltaTempo = endTempo - startTempo;
	this.numBeats = numBeats;
};
audio.LinearAccelerator.__name__ = true;
audio.LinearAccelerator.test = function() {
	console.log(new audio.LinearAccelerator(1,2,4).acceleratedDuration(0,4));
	console.log(new audio.LinearAccelerator(1,1,4).acceleratedDuration(0,4));
};
audio.LinearAccelerator.prototype = {
	evaluate: function(time) {
		return this.numBeats * Math.log(this.numBeats + this.deltaTempo) * time;
	}
	,acceleratedDuration: function(startTime,dur) {
		var s = this.evaluate(startTime);
		var d = this.evaluate(dur);
		console.log("starttime " + startTime + " " + s + " " + d);
		return this.evaluate(startTime + dur) - this.evaluate(startTime);
	}
	,__class__: audio.LinearAccelerator
};
var audiotools = {};
audiotools.Wav16 = function(channel1,channel2) {
	this.stereo = false;
	this.ch1 = channel1;
	this.ch2 = channel2;
	if(this.ch2 != null && this.ch2.length != this.ch1.length) throw "Stereo file channels must have same length";
	this.stereo = this.ch2 != null;
};
audiotools.Wav16.__name__ = true;
audiotools.Wav16.fromFileBytes = function(wavfileBytes) {
	var wave = new format.wav.Reader(new haxe.io.BytesInput(wavfileBytes)).read();
	var stereo = wave.header.channels == 2;
	var data = wave.data;
	var w16 = null;
	if(stereo) {
		var aInts = audiotools.Wav16Tools.stereoToInts(data,false);
		w16 = new audiotools.Wav16(aInts[0],aInts[1]);
	} else {
		var ints = audiotools.Wav16Tools.monoBytesToInts(data,false);
		w16 = new audiotools.Wav16(ints);
	}
	return w16;
};
audiotools.Wav16.create = function(lengthSamples,stereo,prefill) {
	if(prefill == null) prefill = true;
	if(stereo == null) stereo = false;
	var getChannel = function() {
		var ch;
		var this1;
		this1 = new Array(lengthSamples);
		ch = this1;
		if(prefill) {
			var _g = 0;
			while(_g < lengthSamples) {
				var i = _g++;
				ch[i] = 0;
			}
		}
		return ch;
	};
	return new audiotools.Wav16(getChannel(),stereo?getChannel():null);
};
audiotools.Wav16.createSecs = function(lengthSecs,stereo,prefill) {
	if(prefill == null) prefill = true;
	if(stereo == null) stereo = false;
	return audiotools.Wav16.create(audiotools.Wav16Tools.toSamples(lengthSecs),stereo,prefill);
};
audiotools.Wav16.prototype = {
	get_length: function() {
		return this.ch1.length;
	}
	,toStereo: function() {
		if(this.stereo) return;
		var this1;
		this1 = new Array(this.ch1.length);
		this.ch2 = this1;
		var _g1 = 0;
		var _g = this.ch1.length;
		while(_g1 < _g) {
			var i = _g1++;
			this.ch2[i] = this.ch1[i];
		}
	}
	,__class__: audiotools.Wav16
};
audiotools.Wav16DSP = function() { };
audiotools.Wav16DSP.__name__ = true;
audiotools.Wav16DSP.wspMix = function(w1,w2,mixVol,w1vol,w2vol) {
	if(w2vol == null) w2vol = 1.0;
	if(w1vol == null) w1vol = 1.0;
	if(mixVol == null) mixVol = 1.0;
	var stereo = w1.stereo || w2.stereo;
	if(stereo && !w1.stereo) w1.toStereo();
	if(stereo && !w2.stereo) w2.toStereo();
	var resultCh1 = audiotools.Wav16DSP.dspMix(w1.ch1,w2.ch1,mixVol,w1vol,w2vol);
	var resultCh2 = null;
	if(stereo) resultCh2 = audiotools.Wav16DSP.dspMix(w1.ch2,w2.ch2,mixVol,w1vol,w2vol);
	return new audiotools.Wav16(resultCh1,resultCh2);
};
audiotools.Wav16DSP.wspMixInto = function(w1,w2,offset,w2length,w2Vol) {
	if(w2Vol == null) w2Vol = 1.0;
	if(w2length == null) w2length = -1;
	if(offset == null) offset = 0;
	if(w1.stereo != w2.stereo) {
		w1.toStereo();
		w2.toStereo();
	}
	audiotools.Wav16DSP.dspMixInto(w1.ch1,w2.ch1,offset,w2length,w2Vol);
	if(w1.stereo) audiotools.Wav16DSP.dspMixInto(w1.ch2,w2.ch2,offset,w2length,w2Vol);
};
audiotools.Wav16DSP.dspMix = function(w1,w2,mixVol,w1vol,w2vol) {
	if(w2vol == null) w2vol = 1.0;
	if(w1vol == null) w1vol = 1.0;
	if(mixVol == null) mixVol = 1.0;
	var result;
	var this1;
	this1 = new Array(w1.length);
	result = this1;
	var _g1 = 0;
	var _g = w1.length;
	while(_g1 < _g) {
		var pos = _g1++;
		var v1 = w1[pos] * w1vol;
		var v2 = w2[pos] * w2vol;
		var v3 = Math.floor((v1 + v2) / mixVol);
		result[pos] = v3;
	}
	return result;
};
audiotools.Wav16DSP.dspMixInto = function(w1,w2,offset,w2length,w2vol,soften) {
	if(soften == null) soften = 500;
	if(w2vol == null) w2vol = 1.0;
	if(w2length == null) w2length = -1;
	if(offset == null) offset = 0;
	var length;
	if(w2length > 0) length = Std["int"](Math.min(w2.length,w2length)); else length = w2.length;
	if(w1 == null) throw "Wav16DSP Error: dspMixInto - w1 == null ";
	if(offset + length > w1.length) {
		console.log([length,offset + length,w1.length]);
		console.log("Wav16DSP Error: dspMixInto - ");
		return;
	}
	var softenstart = length - soften;
	var _g = 0;
	while(_g < length) {
		var i = _g++;
		var val1 = w1[offset + i];
		var val2 = w2[i] * w2vol | 0;
		if(i > softenstart) {
			var delta = (length - i) / soften;
			val2 = val2 * delta | 0;
		}
		var val3 = val1 + val2;
		w1[offset + i] = val3;
	}
};
audiotools.Wav16DSP.dspFadeIn = function(ints,length,startLevel) {
	if(startLevel == null) startLevel = 0.0;
	var result;
	var this1;
	this1 = new Array(ints.length);
	result = this1;
	var length1 = Std["int"](Math.min(length,ints.length));
	var _g = 0;
	while(_g < length1) {
		var pos = _g++;
		var $int = ints[pos];
		var delta = (1 - startLevel) * (pos / length1) + startLevel;
		var newInt = $int * delta | 0;
		result[pos] = newInt;
	}
	if(length1 < ints.length) {
		var _g1 = length1 + 1;
		var _g2 = ints.length;
		while(_g1 < _g2) {
			var pos1 = _g1++;
			result[pos1] = ints[pos1];
		}
	}
	return result;
};
audiotools.Wav16DSP.dspFadeOut = function(ints,length,endLevel) {
	if(endLevel == null) endLevel = 0.0;
	var result;
	var this1;
	this1 = new Array(ints.length);
	result = this1;
	var length1 = Std["int"](Math.min(length,ints.length));
	var startPos = ints.length - length1;
	if(startPos > 0) {
		var _g1 = 0;
		var _g = startPos - 1;
		while(_g1 < _g) {
			var pos = _g1++;
			result[pos] = ints[pos];
		}
	}
	var _g11 = startPos;
	var _g2 = ints.length;
	while(_g11 < _g2) {
		var pos1 = _g11++;
		var $int = ints[pos1];
		var delta = (endLevel - 1) * ((pos1 - startPos) / length1) + 1;
		var newInt = $int * delta | 0;
		result[pos1] = newInt;
	}
	return result;
};
audiotools.Wav16DSP.dspReverse = function(ints) {
	var result;
	var this1;
	this1 = new Array(ints.length);
	result = this1;
	var len = ints.length - 1;
	var _g1 = 0;
	var _g = ints.length;
	while(_g1 < _g) {
		var i = _g1++;
		result[i] = ints[len - i];
	}
	return result;
};
audiotools.Wav16DSP.interpolate = function(f,a,b) {
	return (b - a) * f + a;
};
audiotools.Wav16Tools = function() { };
audiotools.Wav16Tools.__name__ = true;
audiotools.Wav16Tools.inRange = function(val,min,max) {
	return val >= min && val <= max;
};
audiotools.Wav16Tools.monoBytesToInts = function(wavData,stripWavfileHeader) {
	if(stripWavfileHeader == null) stripWavfileHeader = true;
	var start;
	if(stripWavfileHeader) start = 44; else start = 0;
	var length = ((wavData.length - wavData.length % 2) / 2 | 0) - start;
	var result;
	var this1;
	this1 = new Array(length);
	result = this1;
	var _g = 0;
	while(_g < length) {
		var i = _g++;
		var pos = i * 2;
		var left = wavData.b[pos + start];
		var right = wavData.b[pos + start + 1];
		var val = audiotools.Wav16Tools.ucharsToShort(right,left);
		result[i] = val;
	}
	return result;
};
audiotools.Wav16Tools.stereoToInts = function(wavData,stripWavfileHeader) {
	if(stripWavfileHeader == null) stripWavfileHeader = true;
	var start;
	if(stripWavfileHeader) start = 44; else start = 0;
	var wavDataLength = wavData.length - start;
	var length = (wavDataLength - wavDataLength % 2) / 4 | 0;
	var resultLeft;
	var this1;
	this1 = new Array(length);
	resultLeft = this1;
	var resultRight;
	var this2;
	this2 = new Array(length);
	resultRight = this2;
	var setpos = 0;
	var _g1 = 0;
	var _g = length * 2;
	while(_g1 < _g) {
		var i = _g1++;
		var pos = i * 2;
		var left = wavData.b[pos + start];
		var right = wavData.b[pos + start + 1];
		var val = audiotools.Wav16Tools.ucharsToShort(right,left);
		if(i % 2 == 0) resultLeft[setpos] = val; else {
			resultRight[setpos] = val;
			setpos++;
		}
	}
	return [resultLeft,resultRight];
};
audiotools.Wav16Tools.intsToMono16Bytes = function(ints) {
	var result = haxe.io.Bytes.alloc(ints.length * 2);
	var pos = 0;
	var _g = 0;
	while(_g < ints.length) {
		var v = ints[_g];
		++_g;
		var a = audiotools.Wav16Tools.shortToUChars(v);
		result.set(pos++,a[1]);
		result.set(pos++,a[0]);
	}
	return result;
};
audiotools.Wav16Tools.intsToStero16Bytes = function(leftInts,rightInts) {
	if(leftInts.length != rightInts.length) throw "Left and Right ints lengths differ!";
	var result = haxe.io.Bytes.alloc(leftInts.length * 2 * 2);
	var pos = 0;
	var _g1 = 0;
	var _g = leftInts.length;
	while(_g1 < _g) {
		var i = _g1++;
		var v = leftInts[i];
		var a = audiotools.Wav16Tools.shortToUChars(v);
		result.set(pos++,a[1]);
		result.set(pos++,a[0]);
		var v1 = rightInts[i];
		var a1 = audiotools.Wav16Tools.shortToUChars(v1);
		result.set(pos++,a1[1]);
		result.set(pos++,a1[0]);
	}
	return result;
};
audiotools.Wav16Tools.ucharsToShort = function(ucharLeft,ucharRight) {
	if(ucharLeft < 0) ucharLeft += 256;
	if(ucharRight < 0) ucharLeft += 256;
	if(!(ucharLeft >= 0 && ucharLeft <= 255)) throw "Range error  ucharLeft: " + ucharLeft;
	if(!(ucharRight >= 0 && ucharRight <= 255)) throw "Range error ucharRight: " + ucharRight;
	var negative = (ucharLeft & 128) == 128;
	var result;
	if(!negative) result = (ucharLeft << 8) + ucharRight; else result = -32768 + ((ucharLeft - 128 << 8) + ucharRight);
	return result;
};
audiotools.Wav16Tools.shortToUChars = function($short) {
	if(!($short >= -32767 && $short <= 32767)) {
		console.log("Range error: " + $short);
		return [0,0];
	}
	var result = [0,0];
	if($short >= 0) result = [($short ^ 255) >> 8,$short & 255]; else {
		var i2 = 32768 + $short;
		result = [i2 >> 8 | 128,i2 & 255];
	}
	return result;
};
audiotools.Wav16Tools.createHeader = function(stereo,samplingRate,bitsPerSample) {
	if(bitsPerSample == null) bitsPerSample = 16;
	if(samplingRate == null) samplingRate = 44100;
	if(stereo == null) stereo = false;
	var channels;
	if(stereo) channels = 2; else channels = 1;
	return { format : format.wav.WAVEFormat.WF_PCM, channels : channels, samplingRate : samplingRate, byteRate : samplingRate * channels * bitsPerSample / 8 | 0, blockAlign : channels * bitsPerSample / 8 | 0, bitsPerSample : bitsPerSample};
};
audiotools.Wav16Tools.getWaveformSamples = function(ints,nrOfSamples,sampleAcc) {
	if(sampleAcc == null) sampleAcc = 100;
	var windowSize = Math.floor(ints.length / nrOfSamples + 1);
	var result = [];
	var _g = 0;
	while(_g < nrOfSamples) {
		var i = _g++;
		var start = i * windowSize;
		var end = Std["int"](Math.min(start + sampleAcc,ints.length - 1));
		var maxlevel = 0.0;
		var _g1 = start;
		while(_g1 < end) {
			var j = _g1++;
			var level = Math.abs(ints[j]) / 32767;
			if(level < 0.0001) level = 0;
			if(j > ints.length) level = 0;
			maxlevel = Math.max(level,maxlevel);
		}
		var sqr = Math.sqrt(maxlevel);
		result.push(sqr);
	}
	return result;
};
audiotools.Wav16Tools.toSecs = function(samples) {
	return samples / audiotools.Wav16Tools.SAMPLERATE;
};
audiotools.Wav16Tools.toSamples = function(secs) {
	return secs * audiotools.Wav16Tools.SAMPLERATE | 0;
};
audiotools.Wav16Tools.copyChannel = function(ints) {
	var result;
	var this1;
	this1 = new Array(ints.length);
	result = this1;
	var _g1 = 0;
	var _g = ints.length;
	while(_g1 < _g) {
		var i = _g1++;
		result[i] = ints[i];
	}
	return result;
};
audiotools.Wav16Tools.testplay = function(wav16) {
	audiotools.webaudio.WATools.testplay(wav16);
	return;
};
audiotools.sound = {};
audiotools.sound.Wav16Sound = function() { };
audiotools.sound.Wav16Sound.__name__ = true;
audiotools.sound.Wav16Sound.prototype = {
	__class__: audiotools.sound.Wav16Sound
};
audiotools.sound.Wav16SoundBase = function(wav16,playCallback,key) {
	this.playing = false;
	this.key = key;
	this.playCallback = playCallback;
	this.playing = false;
};
audiotools.sound.Wav16SoundBase.__name__ = true;
audiotools.sound.Wav16SoundBase.__interfaces__ = [audiotools.sound.Wav16Sound];
audiotools.sound.Wav16SoundBase.prototype = {
	start: function(pos) {
		console.log("should be overridden");
	}
	,stop: function() {
		console.log("should be overridden");
	}
	,__class__: audiotools.sound.Wav16SoundBase
};
audiotools.sound.Wav16SoundJS = function(wav16,playCallback,key) {
	this.delta = .0;
	this.lastTime = .0;
	audiotools.sound.Wav16SoundBase.call(this,wav16,playCallback,key);
	this.context = (audiotools.webaudio.Context.instance == null?audiotools.webaudio.Context.instance = new audiotools.webaudio.Context():audiotools.webaudio.Context.instance).getContext();
	this.buffer = audiotools.webaudio.WATools.createBufferFromWav16(wav16,this.context,48000);
	audiotools.sound.Wav16SoundJS.animationCallback = $bind(this,this.onAnimate);
	
			window.requestAnimFrame = (function() {
			    return window.requestAnimationFrame ||
				window.webkitRequestAnimationFrame ||
				window.mozRequestAnimationFrame ||
				window.oRequestAnimationFrame ||
				window.msRequestAnimationFrame ||
				function(/* function */ callback, /* DOMElement */ element) {
				    window.setTimeout(callback, 1000 / 60);
				};
			})();		 
		 ;
	this.onAnimate();
};
audiotools.sound.Wav16SoundJS.__name__ = true;
audiotools.sound.Wav16SoundJS.__interfaces__ = [audiotools.sound.Wav16Sound];
audiotools.sound.Wav16SoundJS.animationCallback = $hx_exports.audiotools.sound.Wav16SoundJS.animationCallback = function() {
};
audiotools.sound.Wav16SoundJS.__super__ = audiotools.sound.Wav16SoundBase;
audiotools.sound.Wav16SoundJS.prototype = $extend(audiotools.sound.Wav16SoundBase.prototype,{
	start: function(pos) {
		this.source = this.context.createBufferSource();
		this.source.buffer = this.buffer;
		this.source.connect(this.context.destination,0,0);
		this.elapsedTimeSinceStart = pos;
		this.source.start(pos);
		this.lastTime = this.context.currentTime;
		this.playing = true;
	}
	,stop: function() {
		if(this.playing == false) return;
		if(this.source == null) return;
		this.source.stop(0);
		this.source == null;
		this.elapsedTimeSinceStart = 0;
		this.playing = false;
	}
	,onAnimate: function() {
		if(this.playing) {
			if(this.elapsedTimeSinceStart > this.buffer.duration) this.stop();
			var delta = this.context.currentTime - this.lastTime;
			this.elapsedTimeSinceStart += delta;
			this.playCallback(this.key,this.elapsedTimeSinceStart);
			this.lastTime = this.context.currentTime;
		} else {
		}
		requestAnimFrame(  audiotools.sound.Wav16SoundJS.animationCallback);;
	}
	,__class__: audiotools.sound.Wav16SoundJS
});
audiotools.sound.Wav16SoundLoader = function() {
	this.cache = new haxe.ds.StringMap();
};
audiotools.sound.Wav16SoundLoader.__name__ = true;
audiotools.sound.Wav16SoundLoader.getInstance = function() {
	if(audiotools.sound.Wav16SoundLoader.instance == null) return audiotools.sound.Wav16SoundLoader.instance = new audiotools.sound.Wav16SoundLoader(); else return audiotools.sound.Wav16SoundLoader.instance;
};
audiotools.sound.Wav16SoundLoader.prototype = {
	getWav16s: function(mp3files,startCallback) {
		var _g = this;
		var f = new tink.core.FutureTrigger();
		var result = new haxe.ds.StringMap();
		if(mp3files == null || mp3files.length == 0) f.trigger(result);
		var cacheKeys = cx.ArrayTools.fromIterator(this.cache.keys());
		var loadKeys = cx.ArrayTools.hasNot(cacheKeys,mp3files);
		if(startCallback != null) startCallback(loadKeys.length);
		var _g1 = 0;
		while(_g1 < cacheKeys.length) {
			var mp3file = cacheKeys[_g1];
			++_g1;
			var value = this.cache.get(mp3file);
			result.set(mp3file,value);
		}
		if(loadKeys.length == 0) f.trigger(result);
		var this1 = audiotools.utils.Mp3Wav16Decoders.decodeAllMap(loadKeys);
		this1(function(soundData) {
			var $it0 = soundData.keys();
			while( $it0.hasNext() ) {
				var mp3file1 = $it0.next();
				var value1 = soundData.get(mp3file1);
				_g.cache.set(mp3file1,value1);
				var value2 = soundData.get(mp3file1);
				result.set(mp3file1,value2);
			}
			f.trigger(result);
		});
		return f.future;
	}
	,__class__: audiotools.sound.Wav16SoundLoader
};
audiotools.sound.Wav16SoundManager = function() {
};
audiotools.sound.Wav16SoundManager.__name__ = true;
audiotools.sound.Wav16SoundManager.__interfaces__ = [audiotools.sound.Wav16Sound];
audiotools.sound.Wav16SoundManager.getInstance = function() {
	if(audiotools.sound.Wav16SoundManager.instance == null) return audiotools.sound.Wav16SoundManager.instance = new audiotools.sound.Wav16SoundManager(); else return audiotools.sound.Wav16SoundManager.instance;
};
audiotools.sound.Wav16SoundManager.prototype = {
	initSound: function(wav16,playCallback,key) {
		console.log(key);
		if(this.sound != null) this.sound.stop();
		if(wav16 == this.wav16 && playCallback == this.playCallback && key == this.key) {
			console.log("no need to re initialize");
			return;
		}
		this.wav16 = wav16;
		this.playCallback = playCallback;
		this.key = key;
		this.sound = new audiotools.sound.Wav16SoundJS(wav16,playCallback,key);
	}
	,start: function(pos) {
		if(this.sound != null) this.sound.start(pos); else console.log("Wav16SoundManager has no sound instance");
	}
	,stop: function() {
		if(this.sound != null) this.sound.stop(); else console.log("Wav16SoundManager has no sound instance");
	}
	,__class__: audiotools.sound.Wav16SoundManager
};
audiotools.utils = {};
audiotools.utils.Mp3Wav16Decoder = function() { };
audiotools.utils.Mp3Wav16Decoder.__name__ = true;
audiotools.utils.Mp3Wav16Decoder.decode = function(filename) {
	var f = new tink.core.FutureTrigger();
	if(audiotools.utils.Mp3Wav16Decoder.context == null) audiotools.utils.Mp3Wav16Decoder.context = audiotools.webaudio.WATools.getAudioContext();
	new audiotools.webaudio.Mp3ToBuffer(filename,audiotools.utils.Mp3Wav16Decoder.context).setLoadedHandler(function(buffer,filename1) {
		var wavBytes = null;
		var left = buffer.getChannelData(0);
		var leftInts;
		var this1;
		this1 = new Array(left.length);
		leftInts = this1;
		var pos = 0;
		var _g = 0;
		while(_g < left.length) {
			var n = left[_g];
			++_g;
			leftInts[pos] = n * 32767 | 0;
			pos++;
		}
		var w16 = null;
		if(buffer.numberOfChannels > 1) {
			var right = buffer.getChannelData(1);
			var rightInts;
			var this2;
			this2 = new Array(right.length);
			rightInts = this2;
			var pos1 = 0;
			var _g1 = 0;
			while(_g1 < right.length) {
				var n1 = right[_g1];
				++_g1;
				rightInts[pos1] = n1 * 32767 | 0;
				pos1++;
			}
			w16 = new audiotools.Wav16(leftInts,rightInts);
		} else w16 = new audiotools.Wav16(leftInts);
		f.trigger(tink.core.Outcome.Success({ filename : filename1, w16 : w16}));
	}).load();
	return f.future;
};
audiotools.utils.Mp3Wav16Decoders = function() { };
audiotools.utils.Mp3Wav16Decoders.__name__ = true;
audiotools.utils.Mp3Wav16Decoders.setContext = function(context) {
	audiotools.utils.Mp3Wav16Decoder.context = context;
};
audiotools.utils.Mp3Wav16Decoders.decodeAll = function(filenames) {
	return tink.core._Future.Future_Impl_.fromMany((function($this) {
		var $r;
		var _g = [];
		{
			var _g1 = 0;
			while(_g1 < filenames.length) {
				var filename = filenames[_g1];
				++_g1;
				_g.push(audiotools.utils.Mp3Wav16Decoder.decode(filename));
			}
		}
		$r = _g;
		return $r;
	}(this)));
};
audiotools.utils.Mp3Wav16Decoders.decodeAllMap = function(filenames) {
	var f = new tink.core.FutureTrigger();
	var result = new haxe.ds.StringMap();
	var this1 = audiotools.utils.Mp3Wav16Decoders.decodeAll(filenames);
	this1(function(items) {
		Lambda.iter(items,function(item) {
			switch(item[1]) {
			case 0:
				var wav16file = item[2];
				result.set(wav16file.filename,wav16file.w16);
				break;
			case 1:
				var wav16Error = item[2];
				break;
			}
		});
		f.trigger(result);
	});
	return f.future;
};
audiotools.utils.Wav16DecoderPool = function() {
	this.files = new haxe.ds.StringMap();
};
audiotools.utils.Wav16DecoderPool.__name__ = true;
audiotools.utils.Wav16DecoderPool.prototype = {
	getFiles: function() {
		return this.files;
	}
	,requestFile: function(sound,midinr,version) {
		if(version == null) version = "";
		var _g = this;
		var f = new tink.core.FutureTrigger();
		console.log(this.files.toString());
		var filetag = "" + sound + "/" + midinr + version + ".mp3";
		console.log(filetag);
		if(this.files.exists(filetag)) {
			console.log("get from cache");
			f.trigger(tink.core.Outcome.Success(this.files.get(filetag)));
		} else {
			var this1 = audiotools.utils.Mp3Wav16Decoder.decode(filetag);
			this1(function(outcome) {
				switch(outcome[1]) {
				case 0:
					var wav16file = outcome[2];
					_g.files.set(filetag,wav16file.w16);
					console.log("set to cache " + filetag);
					console.log(_g.files.toString());
					console.log(wav16file);
					f.trigger(tink.core.Outcome.Success(wav16file.w16));
					break;
				case 1:
					var wav16error = outcome[2];
					console.log(wav16error);
					f.trigger(tink.core.Outcome.Failure(wav16error.message));
					break;
				}
			});
		}
		console.log(this.files.toString());
		return f.future;
	}
	,__class__: audiotools.utils.Wav16DecoderPool
};
audiotools.utils.Wav16PartsBuilder = function() {
	this.initialized = false;
	this.scorecache = new haxe.ds.StringMap();
};
audiotools.utils.Wav16PartsBuilder.__name__ = true;
audiotools.utils.Wav16PartsBuilder.getInstance = function() {
	if(audiotools.utils.Wav16PartsBuilder.instance == null) return audiotools.utils.Wav16PartsBuilder.instance = new audiotools.utils.Wav16PartsBuilder(); else return audiotools.utils.Wav16PartsBuilder.instance;
};
audiotools.utils.Wav16PartsBuilder.prototype = {
	initAsync: function(mp3files) {
		var _g = this;
		var f = new tink.core.FutureTrigger();
		var result = new haxe.ds.StringMap();
		var this1 = (audiotools.sound.Wav16SoundLoader.instance == null?audiotools.sound.Wav16SoundLoader.instance = new audiotools.sound.Wav16SoundLoader():audiotools.sound.Wav16SoundLoader.instance).getWav16s(mp3files,null);
		this1(function(soundmap) {
			_g.soundmap = soundmap;
			_g.initialized = true;
			_g.finishedDecoding();
			f.trigger(_g.soundmap);
		});
		return f.future;
	}
	,startDecoding: function(filesToLoad) {
	}
	,finishedDecoding: function() {
	}
	,buildSoundmap: function(partsnotes,soundmap) {
		if(!this.initialized) throw "Wav16PartsBuilder not initialized - sounds not decoded";
		var length = nx3.audio.NotenrTools.getTotalLength(partsnotes) + 1;
		var result = audiotools.Wav16.createSecs(length,true);
		var partidx = 0;
		var _g = 0;
		while(_g < partsnotes.length) {
			var part = partsnotes[_g];
			++_g;
			var _g1 = 0;
			while(_g1 < part.length) {
				var note = part[_g1];
				++_g1;
				if(!note.playable) continue;
				var key = note.mp3file;
				var w16 = this.soundmap.get(key);
				if(w16 != null) {
					var offset = audiotools.Wav16Tools.toSamples(note.playpos);
					var length1 = audiotools.Wav16Tools.toSamples(note.soundlength + 0.1);
					audiotools.Wav16DSP.wspMixInto(result,w16,offset,length1);
				} else console.log("ERROR : " + key + " == null!");
			}
			partidx++;
		}
		return result;
	}
	,getScoreWav16Async: function(nscore,tempo,partsSounds) {
		if(tempo == null) tempo = 60;
		var _g = this;
		var f = new tink.core.FutureTrigger();
		var key = nscore.uuid + (":" + tempo + ":" + Std.string(partsSounds));
		if(this.scorecache.exists(key)) {
			console.log("Get wav16 from cache " + key);
			var wav16 = this.scorecache.get(key);
			f.trigger(wav16);
		} else {
			var partsnotes = nx3.audio.NotenrTools.getPartsnotes(nscore.nbars,tempo);
			var files = nx3.audio.NotenrTools.getPartsnotesMp3files(partsnotes,partsSounds);
			var this1 = this.initAsync(files);
			this1(function(soundmap) {
				var wav161 = _g.buildSoundmap(partsnotes,soundmap);
				_g.scorecache.set(key,wav161);
				console.log("Set wav16 to cache " + key);
				f.trigger(wav161);
			});
		}
		return f.future;
	}
	,getPartsnotesWav16Async: function(id,partsnotes,partsSounds) {
		var _g = this;
		var f = new tink.core.FutureTrigger();
		var key = id + "";
		if(this.scorecache.exists(key)) {
			console.log("Get wav16 from cache " + key);
			var wav16 = this.scorecache.get(key);
			f.trigger(wav16);
		} else {
			var files = nx3.audio.NotenrTools.getPartsnotesMp3files(partsnotes,partsSounds);
			var this1 = this.initAsync(files);
			this1(function(soundmap) {
				var wav161 = _g.buildSoundmap(partsnotes,soundmap);
				_g.scorecache.set(key,wav161);
				console.log("Set wav16 to cache " + key);
				f.trigger(wav161);
			});
		}
		return f.future;
	}
	,removeScoreFromCache: function(nscore,tempo,partsSounds) {
		if(tempo == null) tempo = 60;
		var key = nscore.uuid + (":" + tempo + ":" + Std.string(partsSounds));
		if(this.scorecache.exists(key)) {
			this.scorecache.remove(key);
			console.log("remove key " + key);
		} else console.log("can not find key " + key + " to remove");
	}
	,__class__: audiotools.utils.Wav16PartsBuilder
};
audiotools.webaudio = {};
audiotools.webaudio.Context = function() {
	this.context = audiotools.webaudio.Context.createAudioContext();
};
audiotools.webaudio.Context.__name__ = true;
audiotools.webaudio.Context.getInstance = function() {
	if(audiotools.webaudio.Context.instance == null) return audiotools.webaudio.Context.instance = new audiotools.webaudio.Context(); else return audiotools.webaudio.Context.instance;
};
audiotools.webaudio.Context.createAudioContext = function() {
	var context = null;
	
			if (typeof AudioContext == "function") {
				context = new AudioContext();
				console.log("USING STANDARD WEB AUDIO API");
			} else if ((typeof webkitAudioContext == "function") || (typeof webkitAudioContext == "object")) {
				context = new webkitAudioContext();
				console.log("USING WEBKIT AUDIO API");
			} else {
				alert("AudioContext is not supported.");
				throw new Error("AudioContext is not supported. :(");
			}
		;
	return context;
};
audiotools.webaudio.Context.prototype = {
	getContext: function() {
		return this.context;
	}
	,__class__: audiotools.webaudio.Context
};
audiotools.webaudio.Mp3ToBuffer = function(url,context) {
	this.url = url;
	this.context = context;
};
audiotools.webaudio.Mp3ToBuffer.__name__ = true;
audiotools.webaudio.Mp3ToBuffer.prototype = {
	load: function() {
		var _g = this;
		var request = new XMLHttpRequest();
		request.open("GET",this.url,true);
		request.responseType = "arraybuffer";
		request.onload = function(_) {
			_g.context.decodeAudioData(request.response,function(buffer) {
				console.log("Loaded and decoded track...");
				_g.audioBuffer = buffer;
				_g.onLoaded(_g.audioBuffer,_g.url);
				if(buffer == null) {
					js.Lib.alert("error decoding file data: " + _g.url);
					return false;
				}
				return true;
			},function(error) {
				js.Lib.alert("decodeAudioData error " + Std.string(error));
				return false;
			});
		};
		request.onprogress = function(e) {
			if(e.total != 0) {
			}
		};
		request.onerror = function(e1) {
			js.Lib.alert("BufferLoader: XHR error");
		};
		request.send();
	}
	,onLoaded: function(audioBuffer,filename) {
		console.log(audioBuffer);
		console.log(filename);
	}
	,setLoadedHandler: function(callbck) {
		this.onLoaded = callbck;
		return this;
	}
	,__class__: audiotools.webaudio.Mp3ToBuffer
};
audiotools.webaudio.WATools = function() { };
audiotools.webaudio.WATools.__name__ = true;
audiotools.webaudio.WATools.createBufferFromWav16 = function(wav16,context,samplerate) {
	if(samplerate == null) samplerate = 44100;
	var stereo = wav16.stereo;
	var length = wav16.ch1.length;
	var left = new Float32Array(length);
	var pos = 0;
	var _g = 0;
	var _g1 = wav16.ch1;
	while(_g < _g1.length) {
		var $int = _g1[_g];
		++_g;
		left[pos] = $int / 32767;
		pos++;
	}
	var right = null;
	if(stereo) {
		right = new Float32Array(length);
		var pos1 = 0;
		var _g2 = 0;
		var _g11 = wav16.ch2;
		while(_g2 < _g11.length) {
			var int1 = _g11[_g2];
			++_g2;
			right[pos1] = int1 / 32767;
			pos1++;
		}
	}
	var newbuffer = null;
	if(stereo) {
		newbuffer = context.createBuffer(2,left.length,samplerate);
		newbuffer.getChannelData(0).set(left);
		newbuffer.getChannelData(1).set(right);
	} else {
		newbuffer = context.createBuffer(1,left.length,samplerate);
		newbuffer.getChannelData(0).set(left);
	}
	return newbuffer;
};
audiotools.webaudio.WATools.testplay = function(w,context) {
	if(context == null) context = audiotools.webaudio.WATools.getAudioContext();
	var source = context.createBufferSource();
	source.buffer = audiotools.webaudio.WATools.createBufferFromWav16(w,context,48000);
	source.connect(context.destination,0,0);
	source.start(0);
};
audiotools.webaudio.WATools.getAudioContext = function() {
	if(audiotools.webaudio.WATools._context == null) audiotools.webaudio.WATools._context = audiotools.webaudio.WATools.createAudioContext();
	return audiotools.webaudio.WATools._context;
};
audiotools.webaudio.WATools.createAudioContext = function() {
	var context = null;
	
			if (typeof AudioContext == "function") {
				context = new AudioContext();
				console.log("USING STANDARD WEB AUDIO API");
				//alert("Standard Web Audio Api");
			} else if ((typeof webkitAudioContext == "function") || (typeof webkitAudioContext == "object")) {
				context = new webkitAudioContext();
				console.log("USING WEBKIT AUDIO API");
				//alert("Using Webkit Web Audio Api");
			} else {
				alert("AudioContext is not supported.");
				throw new Error("AudioContext is not supported. :(");
			}
		;
	return context;
};
var cx = {};
cx.ArrayTools = function() { };
cx.ArrayTools.__name__ = true;
cx.ArrayTools.next = function(a,item) {
	var idx = HxOverrides.indexOf(a,item,0);
	if(idx == -1) return null;
	if(idx == a.length - 1) return null;
	return a[idx + 1];
};
cx.ArrayTools.prev = function(a,item) {
	var idx = HxOverrides.indexOf(a,item,0);
	if(idx <= 0) return null;
	return a[idx - 1];
};
cx.ArrayTools.reverse = function(a) {
	var result = [];
	var _g = 0;
	while(_g < a.length) {
		var item = a[_g];
		++_g;
		result.unshift(item);
	}
	return result;
};
cx.ArrayTools.has = function(a,item) {
	return HxOverrides.indexOf(a,item,0) != -1;
};
cx.ArrayTools.nextOrNull = function(a,item) {
	return cx.ArrayTools.indexOrNull(a,HxOverrides.indexOf(a,item,0) + 1);
};
cx.ArrayTools.indexOrNull = function(a,idx) {
	if(a == null) return null;
	if(idx < 0 || idx > a.length - 1) return null; else return a[idx];
};
cx.ArrayTools.indexOrValue = function(a,idx,fallbackValue) {
	if((a == null?null:idx < 0 || idx > a.length - 1?null:a[idx]) != null) return a[idx]; else return fallbackValue;
};
cx.ArrayTools.equals = function(a,b) {
	return a.toString() == b.toString();
};
cx.ArrayTools.unique = function(arr) {
	var result = new Array();
	var _g = 0;
	while(_g < arr.length) {
		var item = arr[_g];
		++_g;
		if(!Lambda.has(result,item)) result.push(item);
	}
	result.sort(function(a,b) {
		return Reflect.compare(a,b);
	});
	return result;
};
cx.ArrayTools.fromIterator = function(it) {
	var result = [];
	while( it.hasNext() ) {
		var v = it.next();
		result.push(v);
	}
	return result;
};
cx.ArrayTools.fromIterables = function(it) {
	return cx.ArrayTools.fromIterator($iterator(it)());
};
cx.ArrayTools.fromHashKeys = function(it) {
	return cx.ArrayTools.fromIterator(it);
};
cx.ArrayTools.allNull = function(it) {
	var _g = 0;
	while(_g < it.length) {
		var v = it[_g];
		++_g;
		if(v != null) return false;
	}
	return true;
};
cx.ArrayTools.doOverlap = function(array1,array2) {
	var _g = 0;
	while(_g < array1.length) {
		var item = array1[_g];
		++_g;
		if(Lambda.has(array2,item)) return true;
	}
	return false;
};
cx.ArrayTools.overlap = function(array1,array2) {
	return Lambda.array(array1.filter(function(value1) {
		var ret = Lambda.has(array2,value1);
		return ret;
	}));
};
cx.ArrayTools.diff = function(array1,array2) {
	var result = new Array();
	var _g = 0;
	while(_g < array1.length) {
		var item = array1[_g];
		++_g;
		if(!Lambda.has(array2,item)) result.push(item);
	}
	var _g1 = 0;
	while(_g1 < array2.length) {
		var item1 = array2[_g1];
		++_g1;
		if(!Lambda.has(array1,item1)) result.push(item1);
	}
	return result;
};
cx.ArrayTools.hasNot = function(array1,array2) {
	var result = new Array();
	var _g = 0;
	while(_g < array2.length) {
		var item = array2[_g];
		++_g;
		if(!Lambda.has(array1,item)) result.push(item);
	}
	return result;
};
cx.ArrayTools.first = function(array) {
	return array[0];
};
cx.ArrayTools.isFirst = function(array,item) {
	return array[0] == item;
};
cx.ArrayTools.last = function(array) {
	return array[array.length - 1];
};
cx.ArrayTools.isLast = function(array,item) {
	return array[array.length - 1] == item;
};
cx.ArrayTools.secondLast = function(array) {
	return array[array.length - 2];
};
cx.ArrayTools.index = function(array,item) {
	return Lambda.indexOf(array,item);
};
cx.ArrayTools.second = function(array) {
	return array[1];
};
cx.ArrayTools.third = function(array) {
	return array[2];
};
cx.ArrayTools.fourth = function(array) {
	return array[3];
};
cx.ArrayTools.fifth = function(array) {
	return array[4];
};
cx.ArrayTools.sixth = function(array) {
	return array[5];
};
cx.ArrayTools.seventh = function(array) {
	return array[6];
};
cx.ArrayTools.eighth = function(array) {
	return array[7];
};
cx.ArrayTools.nineth = function(array) {
	return array[8];
};
cx.ArrayTools.shuffle = function(a) {
	var t = cx.ArrayTools.range(a.length);
	var arr = [];
	while(t.length > 0) {
		var pos = Std.random(t.length);
		var index = t[pos];
		t.splice(pos,1);
		arr.push(a[index]);
	}
	return arr;
};
cx.ArrayTools.countItem = function(a,item) {
	var cnt = 0;
	var _g = 0;
	while(_g < a.length) {
		var ai = a[_g];
		++_g;
		if(ai == item) cnt++;
	}
	return cnt;
};
cx.ArrayTools.sorta = function(a) {
	a.sort(function(a1,b) {
		return Reflect.compare(a1,b);
	});
	return a;
};
cx.ArrayTools.range = function(start,stop,step) {
	if(step == null) step = 1;
	if(null == stop) {
		stop = start;
		start = 0;
	}
	if((stop - start) / step == Math.POSITIVE_INFINITY) throw "infinite range";
	var range = [];
	var i = -1;
	var j;
	if(step < 0) while((j = start + step * ++i) > stop) range.push(j); else while((j = start + step * ++i) < stop) range.push(j);
	return range;
};
cx.ArrayTools.intsMin = function(a) {
	var r = a[0];
	var _g = 0;
	while(_g < a.length) {
		var v = a[_g];
		++_g;
		if(v < r) r = v;
	}
	return r;
};
cx.EnumTools = function() { };
cx.EnumTools.__name__ = true;
cx.EnumTools.createFromString = function(e,str) {
	try {
		var type = str;
		var params = [];
		if(cx.StrTools.has(str,"(")) {
			var parIdx = str.indexOf("(");
			type = HxOverrides.substr(str,0,parIdx);
			params = StringTools.replace(StringTools.replace(HxOverrides.substr(str,parIdx,null),"(",""),")","").split(",");
		}
		return Type.createEnum(e,type,params);
	} catch( e1 ) {
	}
	return null;
};
cx.MapTools = function() { };
cx.MapTools.__name__ = true;
cx.MapTools.keysToArray = function(it) {
	var result = [];
	while( it.hasNext() ) {
		var v = it.next();
		result.push(v);
	}
	return result;
};
cx.MapTools.sortarray = function(a) {
	a.sort(function(a1,b) {
		return Reflect.compare(a1,b);
	});
	return a;
};
cx.MathTools = function() { };
cx.MathTools.__name__ = true;
cx.MathTools.floatFromString = function(str,comma) {
	if(comma == null) comma = ",";
	str = StringTools.replace(str,",",".");
	return Std.parseFloat(str);
};
cx.MathTools.floatToString = function(val,comma) {
	if(comma == null) comma = ",";
	var result;
	if(val == null) result = "null"; else result = "" + val;
	if(comma != ".") result = StringTools.replace(result,".",comma);
	return result;
};
cx.MathTools.floatEquals = function(a,b) {
	return Math.abs(a - b) <= 0.00001;
};
cx.MathTools.inRange = function(min,value,max) {
	if(value < min) return false;
	if(value > max) return false;
	return true;
};
cx.MathTools.floatRange = function(min,value,max) {
	if(value < min) return min;
	if(value > max) return max;
	return value;
};
cx.MathTools.round2 = function(number,precision) {
	if(precision == null) precision = 6;
	number = number * Math.pow(10,precision);
	number = Math.round(number) / Math.pow(10,precision);
	return number;
};
cx.MathTools.intRange = function(min,value,max) {
	if(value < min) return min;
	if(value > max) return max;
	return value;
};
cx.MathTools.intMin = function(a,b) {
	if(a < b) return a;
	return b;
};
cx.MathTools.intMax = function(a,b) {
	if(a > b) return a;
	return b;
};
cx.MathTools.ipol = function(a,b,delta) {
	return delta * (b - a) + a;
};
cx.StrTools = function() { };
cx.StrTools.__name__ = true;
cx.StrTools.countSub = function(str,lookForStr) {
	return str.split(lookForStr).length - 1;
};
cx.StrTools.until = function(str,untilStr,includeUntilStr) {
	if(includeUntilStr == null) includeUntilStr = false;
	var pos = str.indexOf(untilStr);
	if(includeUntilStr) pos++;
	return str.substring(0,pos);
};
cx.StrTools.untilLast = function(str,untilStr,includeUntilStr) {
	if(includeUntilStr == null) includeUntilStr = false;
	var pos = str.lastIndexOf(untilStr);
	if(includeUntilStr) pos++;
	return str.substring(0,pos);
};
cx.StrTools.tab = function(str) {
	return str + "\t";
};
cx.StrTools.newline = function(str) {
	return str + "\n";
};
cx.StrTools.repeat = function(repeatString,count) {
	var result = "";
	var _g = 0;
	while(_g < count) {
		var i = _g++;
		result += repeatString;
	}
	return result;
};
cx.StrTools.fill = function(str,toLength,fill,replaceNull) {
	if(replaceNull == null) replaceNull = "-";
	if(fill == null) fill = " ";
	if(toLength == null) toLength = 32;
	if(str == null) str = replaceNull;
	do str += fill; while(str.length < toLength);
	return HxOverrides.substr(str,0,toLength);
};
cx.StrTools.splitTrim = function(str,delimiter) {
	if(delimiter == null) delimiter = ",";
	if(str == null) return [];
	var a = str.split(delimiter);
	var a2 = new Array();
	var _g = 0;
	while(_g < a.length) {
		var part = a[_g];
		++_g;
		var part2 = StringTools.trim(part);
		if(part2.length > 0) a2.push(part2);
	}
	return a2;
};
cx.StrTools.replaceNull = function(str,fill) {
	if(fill == null) fill = "-";
	if(str == null) return fill; else return str;
};
cx.StrTools.firstUpperCase = function(str,restToLowercase) {
	if(restToLowercase == null) restToLowercase = true;
	var rest;
	if(restToLowercase) rest = HxOverrides.substr(str,1,null).toLowerCase(); else rest = HxOverrides.substr(str,1,null);
	return HxOverrides.substr(str,0,1).toUpperCase() + rest;
};
cx.StrTools.afterLast = function(str,$char,includeChar) {
	if(includeChar == null) includeChar = false;
	var idx = str.lastIndexOf($char);
	if(idx == -1) return str;
	if(!includeChar) idx += $char.length;
	return HxOverrides.substr(str,idx,null);
};
cx.StrTools.similarityCaseIgnore = function(strA,strB) {
	return cx.StrTools.similarity(strA.toLowerCase(),strB.toLowerCase());
};
cx.StrTools.similarityCaseBalance = function(strA,strB) {
	return (cx.StrTools.similarity(strA,strB) + cx.StrTools.similarity(strA.toLowerCase(),strB.toLowerCase())) / 2;
};
cx.StrTools.similarity = function(strA,strB) {
	if(strA == strB) return 1;
	if(strA.length > strB.length) {
		var strC = strA;
		strA = strB;
		strB = strC;
	}
	return cx.StrTools._similarity(strA,strB);
};
cx.StrTools.similarityAssymetric = function(strShorter,strLonger) {
	if(strShorter == strLonger) return 1;
	return cx.StrTools._similarity(strShorter,strShorter);
};
cx.StrTools._similarity = function(strA,strB) {
	var lengthA = strA.length;
	var lengthB = strB.length;
	var i = 0;
	var segmentCount = 0;
	var segmentsInfos = new Array();
	var segment = "";
	while(i < lengthA) {
		var $char = strA.charAt(i);
		if(strB.indexOf($char) > -1) {
			segment += $char;
			if(strB.indexOf(segment) > -1) {
				var segmentPosA = i - segment.length + 1;
				var segmentPosB = strB.indexOf(segment);
				var positionDiff = Math.abs(segmentPosA - segmentPosB);
				var posFactor = (lengthA - positionDiff) / lengthB;
				var lengthFactor = segment.length / lengthA;
				segmentsInfos[segmentCount] = { segment : segment, score : posFactor * lengthFactor};
			} else {
				segment = "";
				segmentCount++;
				i--;
			}
		} else {
			segment = "";
			segmentCount++;
		}
		i++;
	}
	var usedSegmentsCount = -2;
	var totalScore = 0.0;
	var _g = 0;
	while(_g < segmentsInfos.length) {
		var si = segmentsInfos[_g];
		++_g;
		if(si != null) {
			totalScore += si.score;
			usedSegmentsCount++;
		}
	}
	totalScore = totalScore - Math.max(usedSegmentsCount,0) * 0.02;
	return Math.max(0,Math.min(totalScore,1));
};
cx.StrTools.has = function(str,substr) {
	return str.indexOf(substr) > -1;
};
cx.StrTools.reverse = function(string) {
	var result = "";
	var _g1 = 0;
	var _g = string.length;
	while(_g1 < _g) {
		var i = _g1++;
		result = string.charAt(i) + result;
	}
	return result;
};
cx.StrTools.intToChar = function($int,offset) {
	if(offset == null) offset = 65;
	if($int > 9) throw "int to char error";
	if($int < 0) throw "int to char error";
	var c = $int + offset;
	var $char = String.fromCharCode(c);
	return $char;
};
cx.StrTools.charToInt = function($char,offset) {
	if(offset == null) offset = 65;
	if($char.length > 1) throw "char to int error";
	return HxOverrides.cca($char,0) - offset;
};
cx.StrTools.numToStr = function(numStr,offset) {
	if(offset == null) offset = 65;
	var testParse = Std.parseInt(numStr);
	var result = "";
	var _g1 = 0;
	var _g = numStr.length;
	while(_g1 < _g) {
		var i = _g1++;
		var $int = Std.parseInt(numStr.charAt(i));
		var $char = cx.StrTools.intToChar($int,offset);
		result += $char;
	}
	return result;
};
cx.StrTools.strToNum = function(str,offset) {
	if(offset == null) offset = 65;
	var result = "";
	var _g1 = 0;
	var _g = str.length;
	while(_g1 < _g) {
		var i = _g1++;
		var $char = str.charAt(i);
		var $int = cx.StrTools.charToInt($char,offset);
		if($int == null) result += "null"; else result += "" + $int;
	}
	return result;
};
cx.StrTools.rotate = function(str,positions) {
	if(positions == null) positions = 1;
	var result = str;
	var _g = 0;
	while(_g < positions) {
		var i = _g++;
		result = HxOverrides.substr(result,1,result.length) + HxOverrides.substr(result,0,1);
	}
	return result;
};
cx.StrTools.rotateBack = function(str,positions) {
	if(positions == null) positions = 1;
	var result = str;
	var _g = 0;
	while(_g < positions) {
		var i = _g++;
		result = HxOverrides.substr(result,-1,null) + HxOverrides.substr(result,0,result.length - 1);
	}
	return result;
};
cx.StrTools.toLatin1 = function(str) {
	return haxe.Utf8.decode(str);
	return str;
};
cx.StrTools.lastIdxOf = function(str,search,lastPos) {
	if(lastPos == null) lastPos = 0;
	if(lastPos == 0) return str.lastIndexOf(search);
	var _g = 0;
	while(_g < lastPos) {
		var i = _g++;
		var len = str.lastIndexOf(search);
		str = HxOverrides.substr(str,0,len);
	}
	return str.lastIndexOf(search);
};
cx.StrTools.toInt = function(str) {
	return Std.parseInt(str);
};
cx.StrTools.toFloat = function(str) {
	return Std.parseFloat(str);
};
var dev = {};
dev.MainDevExe = function() { };
dev.MainDevExe.__name__ = true;
dev.MainDevExe.main = function() {
	console.log("hello");
	if(audiotools.sound.Wav16SoundManager.instance == null) audiotools.sound.Wav16SoundManager.instance = new audiotools.sound.Wav16SoundManager(); else audiotools.sound.Wav16SoundManager.instance;
	(nx3.utils.ScriptScoresX.instance == null?nx3.utils.ScriptScoresX.instance = new nx3.utils.ScriptScoresX():nx3.utils.ScriptScoresX.instance).invokeBodyScores();
	(ExerciseIntervals.instance == null?ExerciseIntervals.instance = new ExerciseIntervals():ExerciseIntervals.instance).init();
};
var dtx = {};
dtx.DOMCollection = function(nodes) {
	this.collection = [];
	if(nodes != null) {
		var $it0 = $iterator(nodes)();
		while( $it0.hasNext() ) {
			var n = $it0.next();
			if(n != null) this.collection.push(n);
		}
	}
};
dtx.DOMCollection.__name__ = true;
dtx.DOMCollection.prototype = {
	iterator: function() {
		return HxOverrides.iter(this.collection);
	}
	,getNode: function(i) {
		if(i == null) i = 0;
		if(this.collection.length > i && i >= 0) return this.collection[i]; else return null;
	}
	,eq: function(i) {
		if(i == null) i = 0;
		return new dtx.DOMCollection().add(this.getNode(i));
	}
	,first: function() {
		return this.getNode(0);
	}
	,last: function() {
		return this.getNode(this.collection.length - 1);
	}
	,add: function(node,pos) {
		if(pos == null) pos = -1;
		if(pos < 0 || pos > this.collection.length) pos = this.collection.length;
		if(node != null) {
			if(HxOverrides.indexOf(this.collection,node,0) == -1) this.collection.splice(pos,0,node);
		}
		return this;
	}
	,addCollection: function(collection,elementsOnly) {
		if(elementsOnly == null) elementsOnly = false;
		if(collection != null) {
			var $it0 = $iterator(collection)();
			while( $it0.hasNext() ) {
				var node = $it0.next();
				if(elementsOnly == false || dtx.single.ElementManipulation.isElement(node)) this.add(node);
			}
		}
		return this;
	}
	,addNodeList: function(nodeList,elementsOnly) {
		if(elementsOnly == null) elementsOnly = false;
		if(nodeList != null) {
			var _g1 = 0;
			var _g = nodeList.length;
			while(_g1 < _g) {
				var i = _g1++;
				var node = nodeList.item(i);
				if(elementsOnly == false || dtx.single.ElementManipulation.isElement(node)) this.add(node);
			}
		}
		return this;
	}
	,removeFromCollection: function(node,nodeCollection) {
		if(node != null) this.removeNode(node);
		if(nodeCollection != null) {
			var $it0 = $iterator(nodeCollection)();
			while( $it0.hasNext() ) {
				var n = $it0.next();
				this.removeNode(n);
			}
		}
		return this;
	}
	,removeNode: function(n) {
		HxOverrides.remove(this.collection,n);
	}
	,each: function(f) {
		if(f != null) {
			var _g = 0;
			var _g1 = this.collection;
			while(_g < _g1.length) {
				var n = _g1[_g];
				++_g;
				f(n);
			}
		}
		return this;
	}
	,filter: function(f) {
		var newCollection;
		if(f != null) {
			var filtered = this.collection.filter(f);
			newCollection = new dtx.DOMCollection(filtered);
		} else newCollection = new dtx.DOMCollection(this.collection);
		return newCollection;
	}
	,clone: function() {
		var q = new dtx.DOMCollection();
		var $it0 = HxOverrides.iter(this.collection);
		while( $it0.hasNext() ) {
			var node = $it0.next();
			q.add(node.cloneNode(true));
		}
		return q;
	}
	,get_length: function() {
		return this.collection.length;
	}
	,__class__: dtx.DOMCollection
};
dtx._DOMNode = {};
dtx._DOMNode.DOMNode_Impl_ = function() { };
dtx._DOMNode.DOMNode_Impl_.__name__ = true;
dtx._DOMNode.DOMNode_Impl_._new = function(n) {
	return n;
};
dtx._DOMNode.DOMNode_Impl_._getInnerHTML = function(this1) {
	if(this1.nodeType == dtx.DOMType.ELEMENT_NODE) {
		var elm = this1;
		return elm.innerHTML;
	} else return null;
};
dtx._DOMNode.DOMNode_Impl_._setInnerHTML = function(this1,html) {
	if(this1.nodeType == dtx.DOMType.ELEMENT_NODE) {
		var elm = this1;
		elm.innerHTML = html;
	}
	return html;
};
dtx._DOMNode.DOMNode_Impl_.get_attributes = function(this1) {
	var list = new List();
	var _g1 = 0;
	var _g = this1.attributes.length;
	while(_g1 < _g) {
		var i = _g1++;
		var attNode = this1.attributes[i];
		list.push({ name : attNode.nodeName, value : attNode.nodeValue});
	}
	return list;
};
dtx._DOMNode.DOMNode_Impl_.get_childNodes = function(this1) {
	var children = [];
	var _g1 = 0;
	var _g = this1.childNodes.length;
	while(_g1 < _g) {
		var i = _g1++;
		children.push(this1.childNodes.item(i));
	}
	return children;
};
dtx._DOMNode.DocumentOrElement_Impl_ = function() { };
dtx._DOMNode.DocumentOrElement_Impl_.__name__ = true;
dtx._DOMNode.DocumentOrElement_Impl_._new = function(n) {
	return n;
};
dtx._DOMNode.DocumentOrElement_Impl_.fromElement = function(e) {
	return e;
};
dtx._DOMNode.DocumentOrElement_Impl_.fromDocument = function(d) {
	return d;
};
dtx._DOMNode.DocumentOrElement_Impl_.querySelector = function(this1,selectors) {
	return this1.querySelector(selectors);
};
dtx._DOMNode.DocumentOrElement_Impl_.querySelectorAll = function(this1,selectors) {
	return this1.querySelectorAll(selectors);
};
dtx.DOMType = function() { };
dtx.DOMType.__name__ = true;
dtx.Tools = function() { };
dtx.Tools.__name__ = true;
dtx.Tools.get_document = function() {
	if(dtx.Tools.document == null) dtx.Tools.document = document;
	return dtx.Tools.document;
};
dtx.Tools.get_body = function() {
	return dtx.Tools.get_document().body;
};
dtx.Tools.get_window = function() {
	return window;
};
dtx.Tools.toCollection = function(n) {
	return new dtx.DOMCollection([n]);
};
dtx.Tools.find = function(selector) {
	return dtx.single.Traversing.find(dtx.Tools.get_document(),selector);
};
dtx.Tools.create = function(tagName) {
	var elm = null;
	if(tagName != null) try {
		elm = document.createElement(tagName);
	} catch( e ) {
		elm = null;
	}
	return elm;
};
dtx.Tools.parse = function(xml) {
	var q;
	if(xml != null && xml != "") {
		var parentTag = "div";
		if(dtx.Tools.firstTag.match(xml)) {
			var tagName = dtx.Tools.firstTag.matched(1);
			switch(tagName) {
			case "tbody":
				parentTag = "table";
				break;
			case "tfoot":
				parentTag = "table";
				break;
			case "thead":
				parentTag = "table";
				break;
			case "colgroup":
				parentTag = "table";
				break;
			case "col":
				parentTag = "colgroup";
				break;
			case "tr":
				parentTag = "tbody";
				break;
			case "th":
				parentTag = "tr";
				break;
			case "td":
				parentTag = "tr";
				break;
			default:
				parentTag = "div";
			}
		}
		var n = dtx.Tools.create(parentTag);
		dtx.single.ElementManipulation.setInnerHTML(n,xml);
		q = dtx.single.Traversing.children(n,false);
	} else q = new dtx.DOMCollection();
	return q;
};
dtx.Tools.setDocument = function(newDocument) {
	if(newDocument != null) {
		if(newDocument.nodeType == dtx.DOMType.DOCUMENT_NODE || newDocument.nodeType == dtx.DOMType.ELEMENT_NODE) dtx.Tools.document = newDocument;
	}
};
dtx.Tools.toDetox = function(x) {
	if(x != null) return dtx.Tools.parse(x.toString()); else return new dtx.DOMCollection();
};
dtx.Tools.toNode = function(eventHandler) {
	if(eventHandler != null && js.Boot.__instanceof(eventHandler,Node)) return eventHandler; else return null;
};
dtx.Tools.ready = function(f) {
	(function(h,a,c,k){if(h[a]==null&&h[c]){h[a]="loading";h[c](k,c=function(){h[a]="complete";h.removeEventListener(k,c,!1)},!1)}})(document,"readyState","addEventListener","DOMContentLoaded");
	Reflect.setField(window,"checkReady",dtx.Tools.checkReady);
	if(f != null) dtx.Tools.checkReady(f);
};
dtx.Tools.checkReady = function(f) {
	/in/.test(document.readyState) ? setTimeout(function () { checkReady(f) }, 9) : f();
};
dtx.Tools.includeSizzle = function() {
};
dtx.Tools.includeJQuery = function() {
};
dtx.collection = {};
dtx.collection.DOMManipulation = function() { };
dtx.collection.DOMManipulation.__name__ = true;
dtx.collection.DOMManipulation.append = function(parentCollection,childNode,childCollection) {
	var firstChildUsed = false;
	if(parentCollection != null) {
		var $it0 = HxOverrides.iter(parentCollection.collection);
		while( $it0.hasNext() ) {
			var parent = $it0.next();
			if(firstChildUsed && childNode != null) childNode = childNode.cloneNode(true); else childNode = childNode;
			if(firstChildUsed && childCollection != null) childCollection = childCollection.clone(); else childCollection = childCollection;
			dtx.single.DOMManipulation.append(parent,childNode,childCollection);
			firstChildUsed = true;
		}
	}
	return parentCollection;
};
dtx.collection.DOMManipulation.prepend = function(parentCollection,childNode,childCollection) {
	var firstChildUsed = false;
	if(parentCollection != null) {
		var $it0 = HxOverrides.iter(parentCollection.collection);
		while( $it0.hasNext() ) {
			var parent = $it0.next();
			if(firstChildUsed == false) firstChildUsed = true; else {
				if(childNode != null) childNode = childNode.cloneNode(true);
				if(childCollection != null) childCollection = childCollection.clone();
			}
			dtx.single.DOMManipulation.prepend(parent,childNode,childCollection);
		}
	}
	return parentCollection;
};
dtx.collection.DOMManipulation.appendTo = function(children,parentNode,parentCollection) {
	if(parentNode != null) dtx.single.DOMManipulation.append(parentNode,null,children);
	if(parentCollection != null) {
		var childrenToAppend;
		if(parentNode != null) childrenToAppend = children.clone(); else childrenToAppend = children;
		dtx.collection.DOMManipulation.append(parentCollection,null,childrenToAppend);
	}
	return children;
};
dtx.collection.DOMManipulation.prependTo = function(children,parentNode,parentCollection) {
	if(children != null) {
		var childArray = children.collection.slice();
		childArray.reverse();
		var _g = 0;
		while(_g < childArray.length) {
			var child = childArray[_g];
			++_g;
			dtx.single.DOMManipulation.prependTo(child,parentNode,parentCollection);
		}
	}
	return children;
};
dtx.collection.DOMManipulation.insertThisBefore = function(content,targetNode,targetCollection) {
	if(content != null) {
		var firstChildUsed = false;
		if(targetNode != null) {
			firstChildUsed = true;
			var $it0 = HxOverrides.iter(content.collection);
			while( $it0.hasNext() ) {
				var childToAdd = $it0.next();
				dtx.single.DOMManipulation.insertThisBefore(childToAdd,targetNode);
			}
		}
		if(targetCollection != null) {
			var childCollection = content;
			var $it1 = HxOverrides.iter(targetCollection.collection);
			while( $it1.hasNext() ) {
				var target = $it1.next();
				if(firstChildUsed) childCollection = childCollection.clone(); else childCollection = childCollection;
				dtx.collection.DOMManipulation.insertThisBefore(childCollection,target);
				firstChildUsed = true;
			}
		}
	}
	return content;
};
dtx.collection.DOMManipulation.insertThisAfter = function(content,targetNode,targetCollection) {
	if(content != null) {
		var firstChildUsed = false;
		if(targetNode != null) {
			firstChildUsed = true;
			var currentTarget = targetNode;
			var $it0 = HxOverrides.iter(content.collection);
			while( $it0.hasNext() ) {
				var childToAdd = $it0.next();
				dtx.single.DOMManipulation.insertThisAfter(childToAdd,currentTarget);
				currentTarget = childToAdd;
			}
		}
		if(targetCollection != null) {
			var childCollection = content;
			var $it1 = HxOverrides.iter(targetCollection.collection);
			while( $it1.hasNext() ) {
				var target = $it1.next();
				if(firstChildUsed) childCollection = childCollection.clone(); else childCollection = childCollection;
				dtx.collection.DOMManipulation.insertThisAfter(childCollection,target);
				firstChildUsed = true;
			}
		}
	}
	return content;
};
dtx.collection.DOMManipulation.beforeThisInsert = function(target,contentNode,contentCollection) {
	if(contentNode != null) dtx.single.DOMManipulation.insertThisBefore(contentNode,null,target);
	if(contentCollection != null) dtx.collection.DOMManipulation.insertThisBefore(contentCollection,null,target);
	return target;
};
dtx.collection.DOMManipulation.afterThisInsert = function(target,contentNode,contentCollection) {
	if(contentNode != null) dtx.single.DOMManipulation.insertThisAfter(contentNode,null,target);
	if(contentCollection != null) dtx.collection.DOMManipulation.insertThisAfter(contentCollection,null,target);
	return target;
};
dtx.collection.DOMManipulation.remove = function(nodesToRemove) {
	if(nodesToRemove != null) {
		var $it0 = HxOverrides.iter(nodesToRemove.collection);
		while( $it0.hasNext() ) {
			var node = $it0.next();
			dtx.single.DOMManipulation.remove(node);
		}
	}
	return nodesToRemove;
};
dtx.collection.DOMManipulation.removeFromDOM = function(nodesToRemove) {
	return dtx.collection.DOMManipulation.remove(nodesToRemove);
};
dtx.collection.DOMManipulation.removeChildren = function(parents,childToRemove,childrenToRemove) {
	if(parents != null) {
		var $it0 = HxOverrides.iter(parents.collection);
		while( $it0.hasNext() ) {
			var parent = $it0.next();
			dtx.single.DOMManipulation.removeChildren(parent,childToRemove,childrenToRemove);
		}
	}
	return parents;
};
dtx.collection.DOMManipulation.replaceWith = function(target,contentNode,contentCollection) {
	dtx.collection.DOMManipulation.afterThisInsert(target,contentNode,contentCollection);
	dtx.collection.DOMManipulation.remove(target);
	return target;
};
dtx.collection.DOMManipulation.empty = function(parents) {
	if(parents != null) {
		var $it0 = HxOverrides.iter(parents.collection);
		while( $it0.hasNext() ) {
			var parent = $it0.next();
			var $it1 = Lambda.list(dtx._DOMNode.DOMNode_Impl_.get_childNodes(parent)).iterator();
			while( $it1.hasNext() ) {
				var child = $it1.next();
				parent.removeChild(child);
			}
		}
	}
	return parents;
};
dtx.collection.ElementManipulation = function() { };
dtx.collection.ElementManipulation.__name__ = true;
dtx.collection.ElementManipulation.index = function(c) {
	if(c != null) return dtx.single.ElementManipulation.index(c.getNode()); else return -1;
};
dtx.collection.ElementManipulation.attr = function(collection,attName) {
	if(collection != null) return dtx.single.ElementManipulation.attr(collection.getNode(),attName); else return "";
};
dtx.collection.ElementManipulation.setAttr = function(collection,attName,attValue) {
	if(collection != null) {
		var $it0 = HxOverrides.iter(collection.collection);
		while( $it0.hasNext() ) {
			var node = $it0.next();
			dtx.single.ElementManipulation.setAttr(node,attName,attValue);
		}
	}
	return collection;
};
dtx.collection.ElementManipulation.removeAttr = function(collection,attName) {
	if(collection != null) {
		var $it0 = HxOverrides.iter(collection.collection);
		while( $it0.hasNext() ) {
			var node = $it0.next();
			dtx.single.ElementManipulation.removeAttr(node,attName);
		}
	}
	return collection;
};
dtx.collection.ElementManipulation.hasClass = function(collection,className) {
	var result = false;
	if(collection != null && collection.collection.length > 0) {
		result = true;
		var $it0 = HxOverrides.iter(collection.collection);
		while( $it0.hasNext() ) {
			var node = $it0.next();
			if(dtx.single.ElementManipulation.hasClass(node,className) == false) {
				result = false;
				break;
			}
		}
	}
	return result;
};
dtx.collection.ElementManipulation.addClass = function(collection,className) {
	if(collection != null) {
		var $it0 = HxOverrides.iter(collection.collection);
		while( $it0.hasNext() ) {
			var node = $it0.next();
			dtx.single.ElementManipulation.addClass(node,className);
		}
	}
	return collection;
};
dtx.collection.ElementManipulation.removeClass = function(collection,className) {
	if(collection != null) {
		var $it0 = HxOverrides.iter(collection.collection);
		while( $it0.hasNext() ) {
			var node = $it0.next();
			dtx.single.ElementManipulation.removeClass(node,className);
		}
	}
	return collection;
};
dtx.collection.ElementManipulation.toggleClass = function(collection,className) {
	if(collection != null) {
		var $it0 = HxOverrides.iter(collection.collection);
		while( $it0.hasNext() ) {
			var node = $it0.next();
			dtx.single.ElementManipulation.toggleClass(node,className);
		}
	}
	return collection;
};
dtx.collection.ElementManipulation.tagName = function(collection) {
	if(collection != null) return dtx.single.ElementManipulation.tagName(collection.getNode()); else return "";
};
dtx.collection.ElementManipulation.val = function(collection) {
	if(collection != null) return dtx.single.ElementManipulation.val(collection.getNode()); else return "";
};
dtx.collection.ElementManipulation.setVal = function(collection,value) {
	if(collection != null) {
		var $it0 = HxOverrides.iter(collection.collection);
		while( $it0.hasNext() ) {
			var node = $it0.next();
			dtx.single.ElementManipulation.setVal(node,value);
		}
	}
	return collection;
};
dtx.collection.ElementManipulation.text = function(collection) {
	var text = "";
	if(collection != null) {
		var $it0 = HxOverrides.iter(collection.collection);
		while( $it0.hasNext() ) {
			var node = $it0.next();
			text = text + dtx.single.ElementManipulation.text(node);
		}
	}
	return text;
};
dtx.collection.ElementManipulation.setText = function(collection,text) {
	if(collection != null) {
		var $it0 = HxOverrides.iter(collection.collection);
		while( $it0.hasNext() ) {
			var node = $it0.next();
			dtx.single.ElementManipulation.setText(node,text);
		}
	}
	return collection;
};
dtx.collection.ElementManipulation.innerHTML = function(collection) {
	var sb = new StringBuf();
	if(collection != null) {
		var $it0 = HxOverrides.iter(collection.collection);
		while( $it0.hasNext() ) {
			var node = $it0.next();
			sb.add(dtx.single.ElementManipulation.innerHTML(node));
		}
	}
	return sb.b;
};
dtx.collection.ElementManipulation.setInnerHTML = function(collection,html) {
	if(collection != null) {
		var $it0 = HxOverrides.iter(collection.collection);
		while( $it0.hasNext() ) {
			var node = $it0.next();
			dtx.single.ElementManipulation.setInnerHTML(node,html);
		}
	}
	return collection;
};
dtx.collection.ElementManipulation.html = function(collection) {
	var sb = new StringBuf();
	if(collection != null) {
		var $it0 = HxOverrides.iter(collection.collection);
		while( $it0.hasNext() ) {
			var node = $it0.next();
			sb.add(dtx.single.ElementManipulation.html(node));
		}
	}
	return sb.b;
};
dtx.collection.EventManagement = function() { };
dtx.collection.EventManagement.__name__ = true;
dtx.collection.EventManagement.trigger = function(targetCollection,eventType) {
	if(targetCollection != null) {
		var $it0 = HxOverrides.iter(targetCollection.collection);
		while( $it0.hasNext() ) {
			var target = $it0.next();
			if(target != null && eventType != null) bean.fire(target,eventType);
			target;
		}
	}
	return targetCollection;
};
dtx.collection.EventManagement.on = function(targetCollection,eventType,selector,listener) {
	if(targetCollection != null) {
		var $it0 = HxOverrides.iter(targetCollection.collection);
		while( $it0.hasNext() ) {
			var target = $it0.next();
			dtx.single.EventManagement.on(target,eventType,selector,listener);
		}
	}
	return targetCollection;
};
dtx.collection.EventManagement.off = function(targetCollection,eventType,listener) {
	if(targetCollection != null) {
		var $it0 = HxOverrides.iter(targetCollection.collection);
		while( $it0.hasNext() ) {
			var target = $it0.next();
			dtx.single.EventManagement.off(target,eventType,listener);
		}
	}
	return targetCollection;
};
dtx.collection.EventManagement.one = function(targetCollection,eventType,selector,listener) {
	if(targetCollection != null) {
		var $it0 = HxOverrides.iter(targetCollection.collection);
		while( $it0.hasNext() ) {
			var target = $it0.next();
			dtx.single.EventManagement.one(target,eventType,selector,listener);
		}
	}
	return targetCollection;
};
dtx.collection.EventManagement.mousedown = function(target,selector,listener) {
	return dtx.collection.EventManagement.on(target,"mousedown",selector,listener);
};
dtx.collection.EventManagement.mouseenter = function(target,selector,listener) {
	return dtx.collection.EventManagement.on(target,"mouseenter",selector,listener);
};
dtx.collection.EventManagement.mouseleave = function(target,selector,listener) {
	return dtx.collection.EventManagement.on(target,"mouseleave",selector,listener);
};
dtx.collection.EventManagement.mousemove = function(target,selector,listener) {
	return dtx.collection.EventManagement.on(target,"mousemove",selector,listener);
};
dtx.collection.EventManagement.mouseout = function(target,selector,listener) {
	return dtx.collection.EventManagement.on(target,"mouseout",selector,listener);
};
dtx.collection.EventManagement.mouseover = function(target,selector,listener) {
	return dtx.collection.EventManagement.on(target,"mouseover",selector,listener);
};
dtx.collection.EventManagement.mouseup = function(target,selector,listener) {
	return dtx.collection.EventManagement.on(target,"mouseup",selector,listener);
};
dtx.collection.EventManagement.keydown = function(target,selector,listener) {
	return dtx.collection.EventManagement.on(target,"keydown",selector,listener);
};
dtx.collection.EventManagement.keypress = function(target,selector,listener) {
	return dtx.collection.EventManagement.on(target,"keypress",selector,listener);
};
dtx.collection.EventManagement.keyup = function(target,selector,listener) {
	return dtx.collection.EventManagement.on(target,"keyup",selector,listener);
};
dtx.collection.EventManagement.hover = function(targetCollection,selector,listener1,listener2) {
	if(targetCollection != null) {
		var $it0 = HxOverrides.iter(targetCollection.collection);
		while( $it0.hasNext() ) {
			var node = $it0.next();
			dtx.single.EventManagement.hover(node,selector,listener1,listener2);
		}
	}
	return targetCollection;
};
dtx.collection.EventManagement.submit = function(target,selector,listener) {
	return dtx.collection.EventManagement.on(target,"submit",selector,listener);
};
dtx.collection.EventManagement.toggleClick = function(targetCollection,selector,listenerFirstClick,listenerSecondClick) {
	if(targetCollection != null) {
		var $it0 = HxOverrides.iter(targetCollection.collection);
		while( $it0.hasNext() ) {
			var target = $it0.next();
			dtx.single.EventManagement.toggleClick(target,selector,listenerFirstClick,listenerSecondClick);
		}
	}
	return targetCollection;
};
dtx.collection.EventManagement.blur = function(target,selector,listener) {
	return dtx.collection.EventManagement.on(target,"blur",selector,listener);
};
dtx.collection.EventManagement.change = function(target,selector,listener) {
	return dtx.collection.EventManagement.on(target,"change",selector,listener);
};
dtx.collection.EventManagement.click = function(target,selector,listener) {
	return dtx.collection.EventManagement.on(target,"click",selector,listener);
};
dtx.collection.EventManagement.dblclick = function(target,selector,listener) {
	return dtx.collection.EventManagement.on(target,"dblclick",selector,listener);
};
dtx.collection.EventManagement.focus = function(target,selector,listener) {
	return dtx.collection.EventManagement.on(target,"focus",selector,listener);
};
dtx.collection.EventManagement.focusIn = function(target,selector,listener) {
	return dtx.collection.EventManagement.on(target,"focusIn",selector,listener);
};
dtx.collection.EventManagement.focusOut = function(target,selector,listener) {
	return dtx.collection.EventManagement.on(target,"focusOut",selector,listener);
};
dtx.collection.EventManagement.resize = function(target,selector,listener) {
	return dtx.collection.EventManagement.on(target,"resize",selector,listener);
};
dtx.collection.EventManagement.scroll = function(target,selector,listener) {
	return dtx.collection.EventManagement.on(target,"scroll",selector,listener);
};
dtx.collection.EventManagement.wheel = function(target,selector,listener) {
	if(target != null) {
		var $it0 = HxOverrides.iter(target.collection);
		while( $it0.hasNext() ) {
			var n = $it0.next();
			dtx.single.EventManagement.wheel(n,selector,listener);
		}
	}
	return target;
};
dtx.collection.EventManagement.select = function(target,selector,listener) {
	return dtx.collection.EventManagement.on(target,"select",selector,listener);
};
dtx.collection.EventManagement.load = function(target,selector,listener) {
	return dtx.collection.EventManagement.on(target,"load",selector,listener);
};
dtx.collection.EventManagement.unload = function(target,selector,listener) {
	return dtx.collection.EventManagement.on(target,"unload",selector,listener);
};
dtx.collection.EventManagement.error = function(target,selector,listener) {
	return dtx.collection.EventManagement.on(target,"error",selector,listener);
};
dtx.collection.EventManagement.ready = function(target,selector,listener) {
	return dtx.collection.EventManagement.on(target,"ready",selector,listener);
};
dtx.collection.Style = function() { };
dtx.collection.Style.__name__ = true;
dtx.collection.Style.getStyle = function(c) {
	if(c != null) return dtx.single.Style.getStyle(c.getNode(0)); else return null;
};
dtx.collection.Style.getComputedStyle = function(c) {
	if(c != null) return dtx.single.Style.getComputedStyle(c.getNode(0)); else return null;
};
dtx.collection.Style.css = function(c,property) {
	if(c != null) return dtx.single.Style.css(c.getNode(0),property); else return null;
};
dtx.collection.Style.setCSS = function(c,prop,val,important) {
	if(important == null) important = false;
	if(c != null) {
		var $it0 = HxOverrides.iter(c.collection);
		while( $it0.hasNext() ) {
			var node = $it0.next();
			dtx.single.Style.setCSS(node,prop,val,important);
		}
	}
	return c;
};
dtx.collection.Style.removeCSS = function(c,prop) {
	if(c != null) {
		var $it0 = HxOverrides.iter(c.collection);
		while( $it0.hasNext() ) {
			var node = $it0.next();
			dtx.single.Style.removeCSS(node,prop);
		}
	}
	return c;
};
dtx.collection.Style.show = function(c) {
	return dtx.collection.Style.removeCSS(c,"display");
};
dtx.collection.Style.hide = function(c) {
	return dtx.collection.Style.setCSS(c,"display","none",true);
};
dtx.collection.Style.pos = function(c) {
	return dtx.single.Style.pos(c.getNode(0));
};
dtx.collection.Traversing = function() { };
dtx.collection.Traversing.__name__ = true;
dtx.collection.Traversing.children = function(collection,elementsOnly) {
	if(elementsOnly == null) elementsOnly = true;
	var children = new dtx.DOMCollection();
	if(collection != null) {
		var $it0 = HxOverrides.iter(collection.collection);
		while( $it0.hasNext() ) {
			var node = $it0.next();
			if(dtx.single.ElementManipulation.isElement(node)) children.addCollection(dtx._DOMNode.DOMNode_Impl_.get_childNodes(node),elementsOnly);
		}
	}
	return children;
};
dtx.collection.Traversing.firstChildren = function(collection,elementsOnly) {
	if(elementsOnly == null) elementsOnly = true;
	var children = new dtx.DOMCollection();
	if(collection != null) {
		var $it0 = HxOverrides.iter(collection.collection);
		while( $it0.hasNext() ) {
			var node = $it0.next();
			if(dtx.single.ElementManipulation.isElement(node)) {
				var e = node.firstChild;
				while(elementsOnly == true && e != null && dtx.single.ElementManipulation.isElement(e) == false) e = e.nextSibling;
				if(e != null) children.add(e);
			}
		}
	}
	return children;
};
dtx.collection.Traversing.lastChildren = function(collection,elementsOnly) {
	if(elementsOnly == null) elementsOnly = true;
	var children = new dtx.DOMCollection();
	if(collection != null) {
		var $it0 = HxOverrides.iter(collection.collection);
		while( $it0.hasNext() ) {
			var node = $it0.next();
			if(dtx.single.ElementManipulation.isElement(node)) {
				var e = node.lastChild;
				while(elementsOnly == true && e != null && dtx.single.ElementManipulation.isElement(e) == false) e = e.previousSibling;
				if(e != null) children.add(e);
			}
		}
	}
	return children;
};
dtx.collection.Traversing.parent = function(collection) {
	var parents = new dtx.DOMCollection();
	if(collection != null) {
		var $it0 = HxOverrides.iter(collection.collection);
		while( $it0.hasNext() ) {
			var node = $it0.next();
			if(node.parentNode != null && node != dtx.Tools.get_document()) parents.add(node.parentNode);
		}
	}
	return parents;
};
dtx.collection.Traversing.parents = function(collection) {
	return dtx.collection.Traversing.parent(collection);
};
dtx.collection.Traversing.ancestors = function(collection) {
	var ancestorList = new dtx.DOMCollection();
	if(collection != null) {
		var $it0 = HxOverrides.iter(collection.collection);
		while( $it0.hasNext() ) {
			var node = $it0.next();
			var p = dtx.single.Traversing.parent(node);
			while(p != null) {
				ancestorList.add(p);
				p = dtx.single.Traversing.parent(p);
			}
		}
	}
	return ancestorList;
};
dtx.collection.Traversing.descendants = function(collection,elementsOnly) {
	if(elementsOnly == null) elementsOnly = true;
	var descendantList = new dtx.DOMCollection();
	if(collection != null) {
		var $it0 = HxOverrides.iter(collection.collection);
		while( $it0.hasNext() ) {
			var node = $it0.next();
			var l = dtx.single.Traversing.descendants(node,elementsOnly);
			descendantList.addCollection(l);
		}
	}
	return descendantList;
};
dtx.collection.Traversing.next = function(collection,elementsOnly) {
	if(elementsOnly == null) elementsOnly = true;
	var siblings = new dtx.DOMCollection();
	if(collection != null) {
		var $it0 = HxOverrides.iter(collection.collection);
		while( $it0.hasNext() ) {
			var node = $it0.next();
			var sibling = node.nextSibling;
			while(sibling != null && sibling.nodeType != dtx.DOMType.ELEMENT_NODE && elementsOnly) sibling = sibling.nextSibling;
			if(sibling != null) siblings.add(sibling);
		}
	}
	return siblings;
};
dtx.collection.Traversing.prev = function(collection,elementsOnly) {
	if(elementsOnly == null) elementsOnly = true;
	var siblings = new dtx.DOMCollection();
	if(collection != null) {
		var $it0 = HxOverrides.iter(collection.collection);
		while( $it0.hasNext() ) {
			var node = $it0.next();
			var sibling = node.previousSibling;
			while(sibling != null && sibling.nodeType != dtx.DOMType.ELEMENT_NODE && elementsOnly) sibling = sibling.previousSibling;
			if(sibling != null) siblings.add(sibling);
		}
	}
	return siblings;
};
dtx.collection.Traversing.find = function(collection,selector) {
	var newDOMCollection = new dtx.DOMCollection();
	if(collection != null && selector != null && selector != "") {
		var $it0 = HxOverrides.iter(collection.collection);
		while( $it0.hasNext() ) {
			var node = $it0.next();
			if(dtx.single.ElementManipulation.isElement(node) || dtx.single.ElementManipulation.isDocument(node)) {
				var element = node;
				if($bind(element,element.querySelectorAll)) {
					var results = element.querySelectorAll(selector);
					newDOMCollection.addNodeList(results);
				} else {
					var engine = 
								(('undefined' != typeof Sizzle && Sizzle) ||
								(('undefined' != typeof jQuery) && jQuery.find) ||
								(('undefined' != typeof $) && $.find))
							;
					var results1 = engine(selector,node);
					newDOMCollection.addCollection(results1);
				}
			}
		}
	}
	return newDOMCollection;
};
dtx.single = {};
dtx.single.DOMManipulation = function() { };
dtx.single.DOMManipulation.__name__ = true;
dtx.single.DOMManipulation.append = function(parent,childNode,childCollection) {
	if(parent != null) {
		if(childNode != null) parent.appendChild(childNode);
		if(childCollection != null) {
			var $it0 = HxOverrides.iter(childCollection.collection);
			while( $it0.hasNext() ) {
				var child = $it0.next();
				parent.appendChild(child);
			}
		}
	}
	return parent;
};
dtx.single.DOMManipulation.prepend = function(parent,childNode,childCollection) {
	if(parent != null) {
		if(childNode != null) {
			if(parent.hasChildNodes()) dtx.single.DOMManipulation.insertThisBefore(childNode,parent.firstChild); else dtx.single.DOMManipulation.append(parent,childNode);
		}
		if(childCollection != null) dtx.collection.DOMManipulation.insertThisBefore(childCollection,parent.firstChild);
	}
	return parent;
};
dtx.single.DOMManipulation.appendTo = function(child,parentNode,parentCollection) {
	if(parentNode != null) dtx.single.DOMManipulation.append(parentNode,child);
	if(parentCollection != null) {
		var childToInsert;
		if(parentNode != null) {
			if(child == null) childToInsert = null; else childToInsert = child.cloneNode(true);
		} else childToInsert = child;
		dtx.collection.DOMManipulation.append(parentCollection,childToInsert);
	}
	return child;
};
dtx.single.DOMManipulation.prependTo = function(child,parentNode,parentCollection) {
	if(parentNode != null) {
		if(parentNode.hasChildNodes()) dtx.single.DOMManipulation.insertThisBefore(child,parentNode.firstChild,parentCollection); else dtx.single.DOMManipulation.append(parentNode,child);
	}
	if(parentCollection != null) {
		var childToInsert;
		if(parentNode != null) {
			if(child == null) childToInsert = null; else childToInsert = child.cloneNode(true);
		} else childToInsert = child;
		dtx.collection.DOMManipulation.prepend(parentCollection,childToInsert);
	}
	return child;
};
dtx.single.DOMManipulation.insertThisBefore = function(content,targetNode,targetCollection) {
	if(content != null) {
		var firstChildUsed = false;
		if(targetNode != null) {
			var parent = targetNode.parentNode;
			if(parent != null) {
				firstChildUsed = true;
				parent.insertBefore(content,targetNode);
			}
		}
		if(targetCollection != null) {
			var $it0 = HxOverrides.iter(targetCollection.collection);
			while( $it0.hasNext() ) {
				var target = $it0.next();
				var childToInsert;
				if(firstChildUsed) childToInsert = content.cloneNode(true); else childToInsert = content;
				var parent1 = target.parentNode;
				if(parent1 != null) parent1.insertBefore(childToInsert,target);
				firstChildUsed = true;
			}
		}
	}
	return content;
};
dtx.single.DOMManipulation.insertThisAfter = function(content,targetNode,targetCollection) {
	if(content != null) {
		var firstChildUsed = false;
		if(targetNode != null) {
			var next = targetNode.nextSibling;
			var parent = targetNode.parentNode;
			if(parent != null) {
				firstChildUsed = true;
				if(next != null) parent.insertBefore(content,next); else parent.appendChild(content);
			}
		}
		if(targetCollection != null) {
			var $it0 = HxOverrides.iter(targetCollection.collection);
			while( $it0.hasNext() ) {
				var target = $it0.next();
				var childToInsert;
				if(firstChildUsed) childToInsert = content.cloneNode(true); else childToInsert = content;
				var next1 = target.nextSibling;
				if(next1 != null) {
					var parent1 = target.parentNode;
					if(parent1 != null) parent1.insertBefore(childToInsert,next1);
				} else dtx.single.DOMManipulation.append(target.parentNode,childToInsert);
				firstChildUsed = true;
			}
		}
	}
	return content;
};
dtx.single.DOMManipulation.beforeThisInsert = function(target,contentNode,contentCollection) {
	if(target != null) {
		if(contentNode != null) dtx.single.DOMManipulation.insertThisBefore(contentNode,target);
		if(contentCollection != null) dtx.collection.DOMManipulation.insertThisBefore(contentCollection,target);
	}
	return target;
};
dtx.single.DOMManipulation.afterThisInsert = function(target,contentNode,contentCollection) {
	if(target != null) {
		if(contentNode != null) dtx.single.DOMManipulation.insertThisAfter(contentNode,target);
		if(contentCollection != null) dtx.collection.DOMManipulation.insertThisAfter(contentCollection,target);
	}
	return target;
};
dtx.single.DOMManipulation.remove = function(childToRemove) {
	if(childToRemove != null) {
		var parent = childToRemove.parentNode;
		if(parent != null) parent.removeChild(childToRemove);
	}
	return childToRemove;
};
dtx.single.DOMManipulation.removeFromDOM = function(nodesToRemove) {
	return dtx.single.DOMManipulation.remove(nodesToRemove);
};
dtx.single.DOMManipulation.removeChildren = function(parent,childToRemove,childrenToRemove) {
	if(parent != null) {
		if(childToRemove != null && childToRemove.parentNode == parent) parent.removeChild(childToRemove);
		if(childrenToRemove != null) {
			var $it0 = HxOverrides.iter(childrenToRemove.collection);
			while( $it0.hasNext() ) {
				var child = $it0.next();
				if(child.parentNode == parent) parent.removeChild(child);
			}
		}
	}
	return parent;
};
dtx.single.DOMManipulation.replaceWith = function(target,contentNode,contentCollection) {
	dtx.single.DOMManipulation.afterThisInsert(target,contentNode,contentCollection);
	dtx.single.DOMManipulation.remove(target);
	return target;
};
dtx.single.DOMManipulation.empty = function(parent) {
	if(parent != null) {
		var $it0 = Lambda.list(dtx._DOMNode.DOMNode_Impl_.get_childNodes(parent)).iterator();
		while( $it0.hasNext() ) {
			var child = $it0.next();
			parent.removeChild(child);
		}
	}
	return parent;
};
dtx.single.ElementManipulation = function() { };
dtx.single.ElementManipulation.__name__ = true;
dtx.single.ElementManipulation.isElement = function(node) {
	return node != null && node.nodeType == dtx.DOMType.ELEMENT_NODE;
};
dtx.single.ElementManipulation.isComment = function(node) {
	return node != null && node.nodeType == dtx.DOMType.COMMENT_NODE;
};
dtx.single.ElementManipulation.isTextNode = function(node) {
	return node != null && node.nodeType == dtx.DOMType.TEXT_NODE;
};
dtx.single.ElementManipulation.isDocument = function(node) {
	return node != null && node.nodeType == dtx.DOMType.DOCUMENT_NODE;
};
dtx.single.ElementManipulation.index = function(n) {
	return Lambda.indexOf(dtx.single.Traversing.children(dtx.single.Traversing.parent(n),false),n);
};
dtx.single.ElementManipulation.attr = function(elm,attName) {
	var ret = "";
	if(dtx.single.ElementManipulation.isElement(elm) && attName != null) {
		var element = elm;
		ret = element.getAttribute(attName);
		if(ret == null) ret = "";
	}
	return ret;
};
dtx.single.ElementManipulation.setAttr = function(elm,attName,attValue) {
	if(elm != null && elm.nodeType == dtx.DOMType.ELEMENT_NODE && attName != null) {
		if(attValue == null) attValue = "";
		var element = elm;
		element.setAttribute(attName,attValue);
	}
	return elm;
};
dtx.single.ElementManipulation.removeAttr = function(elm,attName) {
	if(elm != null && elm.nodeType == dtx.DOMType.ELEMENT_NODE && attName != null) {
		var element = elm;
		element.removeAttribute(attName);
	}
	return elm;
};
dtx.single.ElementManipulation.testForClass = function(elm,className) {
	return (function($this) {
		var $r;
		var _this = dtx.single.ElementManipulation.attr(elm,"class").split(" ");
		$r = HxOverrides.indexOf(_this,className,0);
		return $r;
	}(this)) > -1;
};
dtx.single.ElementManipulation.hasClass = function(elm,className) {
	var hasClass = false;
	if(dtx.single.ElementManipulation.isElement(elm) && className != null && className != "") {
		hasClass = true;
		var _g = 0;
		var _g1 = className.split(" ");
		while(_g < _g1.length) {
			var name = _g1[_g];
			++_g;
			if(name != "" && dtx.single.ElementManipulation.testForClass(elm,name) == false) {
				hasClass = false;
				break;
			}
		}
	}
	return hasClass;
};
dtx.single.ElementManipulation.addClass = function(elm,className) {
	if(className != null) {
		var _g = 0;
		var _g1 = className.split(" ");
		while(_g < _g1.length) {
			var name = _g1[_g];
			++_g;
			if(name != "" && dtx.single.ElementManipulation.hasClass(elm,name) == false) {
				var oldClassAttr = dtx.single.ElementManipulation.attr(elm,"class");
				var newClassAttr;
				if(oldClassAttr == "") newClassAttr = name; else newClassAttr = "" + oldClassAttr + " " + name;
				dtx.single.ElementManipulation.setAttr(elm,"class",newClassAttr);
			}
		}
	}
	return elm;
};
dtx.single.ElementManipulation.removeClass = function(elm,className) {
	var classes = dtx.single.ElementManipulation.attr(elm,"class").split(" ");
	if(className != null) {
		var _g = 0;
		var _g1 = className.split(" ");
		while(_g < _g1.length) {
			var name = _g1[_g];
			++_g;
			HxOverrides.remove(classes,name);
		}
	}
	var newClassValue = classes.join(" ");
	dtx.single.ElementManipulation.setAttr(elm,"class",newClassValue);
	return elm;
};
dtx.single.ElementManipulation.toggleClass = function(elm,className) {
	if(className != null) {
		var _g = 0;
		var _g1 = className.split(" ");
		while(_g < _g1.length) {
			var name = _g1[_g];
			++_g;
			if(dtx.single.ElementManipulation.hasClass(elm,name)) dtx.single.ElementManipulation.removeClass(elm,name); else dtx.single.ElementManipulation.addClass(elm,name);
		}
	}
	return elm;
};
dtx.single.ElementManipulation.tagName = function(elm) {
	if(elm == null) return ""; else return elm.nodeName.toLowerCase();
};
dtx.single.ElementManipulation.val = function(node) {
	var val = "";
	if(node != null) {
		var _g = node.nodeType;
		switch(_g) {
		case dtx.DOMType.ELEMENT_NODE:
			if(node.nodeName.toLowerCase() == "input" && dtx.single.ElementManipulation.attr(node,"type") == "checkbox") {
				if(Reflect.field(node,"checked")) {
					val = dtx.single.ElementManipulation.attr(node,"value");
					if(val == "") val = "checked";
				} else "";
			} else {
				val = Reflect.field(node,"value");
				if(val == null) val = dtx.single.ElementManipulation.attr(node,"value");
			}
			break;
		default:
			val = node.nodeValue;
		}
	}
	return val;
};
dtx.single.ElementManipulation.setVal = function(node,val) {
	if(node != null) {
		var _g = node.nodeType;
		switch(_g) {
		case dtx.DOMType.ELEMENT_NODE:
			node.value = val;
			break;
		default:
			node.nodeValue = val;
		}
	}
	return node;
};
dtx.single.ElementManipulation.text = function(elm) {
	var text = "";
	if(elm != null) {
		if(dtx.single.ElementManipulation.isElement(elm) || dtx.single.ElementManipulation.isDocument(elm)) text = elm.textContent; else text = elm.nodeValue;
	}
	return text;
};
dtx.single.ElementManipulation.setText = function(elm,text) {
	if(text == null) text = "";
	if(elm != null) {
		if(dtx.single.ElementManipulation.isElement(elm) || dtx.single.ElementManipulation.isDocument(elm)) elm.textContent = text; else elm.nodeValue = text;
	}
	return elm;
};
dtx.single.ElementManipulation.innerHTML = function(elm) {
	var ret = "";
	if(dtx.single.ElementManipulation.isElement(elm) || dtx.single.ElementManipulation.isDocument(elm)) {
		var sb = new StringBuf();
		var $it0 = new dtx.DOMCollection().addCollection(dtx._DOMNode.DOMNode_Impl_.get_childNodes(elm),false).iterator();
		while( $it0.hasNext() ) {
			var child = $it0.next();
			dtx.single.ElementManipulation.printHtml(child,sb,false);
		}
		ret = sb.b;
	} else if(elm != null) ret = elm.textContent;
	return ret;
};
dtx.single.ElementManipulation.setInnerHTML = function(elm,html) {
	if(html == null) html = "";
	if(elm != null) {
		var _g = elm.nodeType;
		switch(_g) {
		case dtx.DOMType.ELEMENT_NODE:
			dtx._DOMNode.DOMNode_Impl_._setInnerHTML(elm,html);
			break;
		default:
			elm.textContent = html;
		}
	}
	return elm;
};
dtx.single.ElementManipulation.clone = function(elm) {
	if(elm == null) return null; else return elm.cloneNode(true);
};
dtx.single.ElementManipulation.html = function(node) {
	if(node == null) return "";
	var sb = new StringBuf();
	dtx.single.ElementManipulation.printHtml(node,sb,false);
	return sb.b;
};
dtx.single.ElementManipulation.printHtml = function(n,sb,preserveTagNameCase) {
	if(dtx.single.ElementManipulation.isElement(n)) {
		var elmName;
		if(preserveTagNameCase) elmName = n.nodeName; else elmName = n.nodeName.toLowerCase();
		sb.b += Std.string("<" + elmName);
		var $it0 = $iterator(dtx._DOMNode.DOMNode_Impl_.get_attributes(n))();
		while( $it0.hasNext() ) {
			var att = $it0.next();
			sb.b += Std.string(" " + att.name + "=\"");
			dtx.single.ElementManipulation.addHtmlEscapedString(att.value,sb,true);
			sb.b += "\"";
		}
		var children = new dtx.DOMCollection().addCollection(dtx._DOMNode.DOMNode_Impl_.get_childNodes(n),false);
		if(children.collection.length > 0) {
			sb.b += ">";
			var $it1 = HxOverrides.iter(children.collection);
			while( $it1.hasNext() ) {
				var child = $it1.next();
				dtx.single.ElementManipulation.printHtml(child,sb,preserveTagNameCase);
			}
			sb.b += Std.string("</" + elmName + ">");
		} else if(Lambda.has(dtx.single.ElementManipulation.selfClosingElms,elmName)) sb.b += " />"; else sb.b += Std.string("></" + elmName + ">");
	} else if(dtx.single.ElementManipulation.isDocument(n)) {
		var $it2 = dtx.single.Traversing.children(n,false).iterator();
		while( $it2.hasNext() ) {
			var child1 = $it2.next();
			dtx.single.ElementManipulation.printHtml(child1,sb,preserveTagNameCase);
		}
	} else if(dtx.single.ElementManipulation.isTextNode(n)) dtx.single.ElementManipulation.addHtmlEscapedString(n.nodeValue,sb,false); else if(dtx.single.ElementManipulation.isComment(n)) {
		sb.b += "<!--";
		if(n.nodeValue == null) sb.b += "null"; else sb.b += "" + n.nodeValue;
		sb.b += "-->";
	}
};
dtx.single.ElementManipulation.addHtmlEscapedString = function(str,sb,encodeQuotes) {
	var _g1 = 0;
	var _g = str.length;
	while(_g1 < _g) {
		var i = _g1++;
		var charCode = str.charCodeAt(i);
		if(charCode == 38) {
			var peekIndex = i + 1;
			var isEntity = false;
			while(peekIndex < str.length) {
				var c = str.charCodeAt(peekIndex);
				if(c == 59) {
					isEntity = peekIndex > i + 1;
					break;
				}
				if(c >= 97 && c <= 122 || c >= 65 && c <= 90 || c >= 48 && c <= 57 || c == 35) {
					peekIndex++;
					continue;
				} else break;
			}
			if(isEntity) sb.b += "&"; else sb.b += "&amp;";
		} else if(charCode == 60) sb.b += "&lt;"; else if(charCode == 62) sb.b += "&gt;"; else if(charCode == 160) sb.b += "&nbsp;"; else if(encodeQuotes && charCode == 39) sb.b += "&#039;"; else if(encodeQuotes && charCode == 34) sb.b += "&quot;"; else if(charCode < 161) sb.b += String.fromCharCode(charCode); else sb.b += String.fromCharCode(charCode);
	}
};
dtx.single.EventManagement = function() { };
dtx.single.EventManagement.__name__ = true;
dtx.single.EventManagement.trigger = function(target,eventName) {
	if(target != null && eventName != null) bean.fire(target,eventName);
	return target;
};
dtx.single.EventManagement.on = function(target,eventType,selector,listener) {
	if(target != null && eventType != null) {
		if(listener != null) {
			if(selector != null) bean.on(target,eventType,selector,listener); else bean.on(target,eventType,listener);
		} else {
			if(target != null && eventType != null) bean.fire(target,eventType);
			target;
		}
	}
	return target;
};
dtx.single.EventManagement.off = function(target,eventType,listener) {
	if(target != null) {
		if(eventType != null && listener != null) bean.off(target,eventType,listener); else if(eventType != null) bean.off(target,eventType); else if(listener != null) bean.off(target,listener); else bean.off(target);
	}
	return target;
};
dtx.single.EventManagement.one = function(target,eventType,selector,listener) {
	if(target != null) {
		if(selector != null) bean.one(target,eventType,selector,listener); else bean.one(target,eventType,listener);
	}
	return target;
};
dtx.single.EventManagement.mousedown = function(target,selector,listener) {
	return dtx.single.EventManagement.on(target,"mousedown",selector,listener);
};
dtx.single.EventManagement.mouseenter = function(target,selector,listener) {
	return dtx.single.EventManagement.on(target,"mouseover",selector,listener);
};
dtx.single.EventManagement.mouseleave = function(target,selector,listener) {
	return dtx.single.EventManagement.on(target,"mouseout",selector,listener);
};
dtx.single.EventManagement.mousemove = function(target,selector,listener) {
	return dtx.single.EventManagement.on(target,"mousemove",selector,listener);
};
dtx.single.EventManagement.mouseout = function(target,selector,listener) {
	return dtx.single.EventManagement.on(target,"mouseout",selector,listener);
};
dtx.single.EventManagement.mouseover = function(target,selector,listener) {
	return dtx.single.EventManagement.on(target,"mouseover",selector,listener);
};
dtx.single.EventManagement.mouseup = function(target,selector,listener) {
	return dtx.single.EventManagement.on(target,"mouseup",selector,listener);
};
dtx.single.EventManagement.keydown = function(target,selector,listener) {
	return dtx.single.EventManagement.on(target,"keydown",selector,listener);
};
dtx.single.EventManagement.keypress = function(target,selector,listener) {
	return dtx.single.EventManagement.on(target,"keypress",selector,listener);
};
dtx.single.EventManagement.keyup = function(target,selector,listener) {
	return dtx.single.EventManagement.on(target,"keyup",selector,listener);
};
dtx.single.EventManagement.hover = function(target,selector,listener1,listener2) {
	dtx.single.EventManagement.on(target,"mouseover",selector,listener1);
	if(listener2 == null) dtx.single.EventManagement.on(target,"mouseout",selector,listener1); else dtx.single.EventManagement.on(target,"mouseout",selector,listener2);
	return target;
};
dtx.single.EventManagement.submit = function(target,selector,listener) {
	return dtx.single.EventManagement.on(target,"submit",selector,listener);
};
dtx.single.EventManagement.toggleClick = function(target,selector,listenerFirstClick,listenerSecondClick) {
	var fn1 = null;
	var fn2 = null;
	fn1 = function(e) {
		listenerFirstClick(e);
		dtx.single.EventManagement.off(target,"click",fn1);
		dtx.single.EventManagement.on(target,"click",selector,fn2);
	};
	fn2 = function(e1) {
		listenerSecondClick(e1);
		dtx.single.EventManagement.off(target,"click",fn2);
		dtx.single.EventManagement.on(target,"click",selector,fn1);
	};
	dtx.single.EventManagement.on(target,"click",selector,fn1);
	return target;
};
dtx.single.EventManagement.blur = function(target,selector,listener) {
	return dtx.single.EventManagement.on(target,"blur",selector,listener);
};
dtx.single.EventManagement.change = function(target,selector,listener) {
	return dtx.single.EventManagement.on(target,"change",selector,listener);
};
dtx.single.EventManagement.click = function(target,selector,listener) {
	return dtx.single.EventManagement.on(target,"click",selector,listener);
};
dtx.single.EventManagement.dblclick = function(target,selector,listener) {
	return dtx.single.EventManagement.on(target,"dblclick",selector,listener);
};
dtx.single.EventManagement.focus = function(target,selector,listener) {
	return dtx.single.EventManagement.on(target,"focus",selector,listener);
};
dtx.single.EventManagement.focusIn = function(target,selector,listener) {
	return dtx.single.EventManagement.on(target,"focusIn",selector,listener);
};
dtx.single.EventManagement.focusOut = function(target,selector,listener) {
	return dtx.single.EventManagement.on(target,"focusOut",selector,listener);
};
dtx.single.EventManagement.resize = function(target,selector,listener) {
	return dtx.single.EventManagement.on(target,"resize",selector,listener);
};
dtx.single.EventManagement.scroll = function(target,selector,listener) {
	return dtx.single.EventManagement.on(target,"scroll",selector,listener);
};
dtx.single.EventManagement.wheel = function(target,selector,listener) {
	target.addEventListener("wheel",listener);
	return target;
};
dtx.single.EventManagement.select = function(target,selector,listener) {
	return dtx.single.EventManagement.on(target,"select",selector,listener);
};
dtx.single.EventManagement.load = function(target,selector,listener) {
	return dtx.single.EventManagement.on(target,"load",selector,listener);
};
dtx.single.EventManagement.unload = function(target,selector,listener) {
	return dtx.single.EventManagement.on(target,"unload",selector,listener);
};
dtx.single.EventManagement.error = function(target,selector,listener) {
	return dtx.single.EventManagement.on(target,"error",selector,listener);
};
dtx.single.Style = function() { };
dtx.single.Style.__name__ = true;
dtx.single.Style.getStyle = function(node) {
	var style = null;
	if(dtx.single.ElementManipulation.isElement(node)) {
		var elm = node;
		style = elm.style;
	}
	return style;
};
dtx.single.Style.getComputedStyle = function(node) {
	var style = null;
	if(dtx.single.ElementManipulation.isElement(node)) style = window.getComputedStyle(node);
	return style;
};
dtx.single.Style.css = function(node,prop) {
	var style = dtx.single.Style.getComputedStyle(node);
	if(style != null && prop != null) return style.getPropertyValue(prop); else return null;
};
dtx.single.Style.setCSS = function(node,prop,val,important) {
	if(important == null) important = false;
	if(dtx.single.ElementManipulation.isElement(node) && prop != null) {
		var style = dtx.single.Style.getStyle(node);
		var priority;
		if(important) priority = "important"; else priority = "";
		style.setProperty(prop,val,priority);
	}
	return node;
};
dtx.single.Style.removeCSS = function(node,prop) {
	if(dtx.single.ElementManipulation.isElement(node) && prop != null) {
		var style = dtx.single.Style.getStyle(node);
		style.removeProperty(prop);
	}
	return node;
};
dtx.single.Style.show = function(node) {
	return dtx.single.Style.removeCSS(node,"display");
};
dtx.single.Style.hide = function(node) {
	return dtx.single.Style.setCSS(node,"display","none",true);
};
dtx.single.Style.pos = function(node) {
	var pos = { top : -1, left : -1, width : 0, height : 0};
	if(dtx.single.ElementManipulation.isElement(node)) {
		var e = node;
		return { top : e.offsetTop, left : e.offsetLeft, width : e.offsetWidth, height : e.offsetHeight};
	}
	return pos;
};
dtx.single.Traversing = function() { };
dtx.single.Traversing.__name__ = true;
dtx.single.Traversing.unsafeGetChildren = function(elm,elementsOnly) {
	if(elementsOnly == null) elementsOnly = true;
	return new dtx.DOMCollection().addCollection(dtx._DOMNode.DOMNode_Impl_.get_childNodes(elm),elementsOnly);
};
dtx.single.Traversing.children = function(node,elementsOnly) {
	if(elementsOnly == null) elementsOnly = true;
	if(node != null && dtx.single.ElementManipulation.isElement(node)) return new dtx.DOMCollection().addCollection(dtx._DOMNode.DOMNode_Impl_.get_childNodes(node),elementsOnly); else return new dtx.DOMCollection();
};
dtx.single.Traversing.firstChildren = function(node,elementsOnly) {
	if(elementsOnly == null) elementsOnly = true;
	var firstChild = null;
	if(node != null && dtx.single.ElementManipulation.isElement(node)) {
		var e = node.firstChild;
		while(elementsOnly == true && e != null && dtx.single.ElementManipulation.isElement(e) == false) e = e.nextSibling;
		if(e != null) firstChild = e;
	}
	return firstChild;
};
dtx.single.Traversing.lastChildren = function(node,elementsOnly) {
	if(elementsOnly == null) elementsOnly = true;
	var lastChild = null;
	if(node != null && dtx.single.ElementManipulation.isElement(node)) {
		var e = node.lastChild;
		while(elementsOnly == true && e != null && dtx.single.ElementManipulation.isElement(e) == false) e = e.previousSibling;
		if(e != null) lastChild = e;
	}
	return lastChild;
};
dtx.single.Traversing.parent = function(node) {
	var p = null;
	if(node != null && node != dtx.Tools.get_document()) p = node.parentNode;
	return p;
};
dtx.single.Traversing.parents = function(node) {
	return dtx.single.Traversing.parent(node);
};
dtx.single.Traversing.ancestors = function(node) {
	var ancestorList = new dtx.DOMCollection();
	var p = dtx.single.Traversing.parent(node);
	while(p != null) {
		ancestorList.add(p);
		p = dtx.single.Traversing.parent(p);
	}
	return ancestorList;
};
dtx.single.Traversing.descendants = function(node,elementsOnly) {
	if(elementsOnly == null) elementsOnly = true;
	var descendantList = new dtx.DOMCollection();
	var $it0 = dtx.single.Traversing.children(node,elementsOnly).iterator();
	while( $it0.hasNext() ) {
		var child = $it0.next();
		descendantList.add(child);
		descendantList.addCollection(dtx.single.Traversing.descendants(child,elementsOnly));
	}
	return descendantList;
};
dtx.single.Traversing.next = function(node,elementsOnly) {
	if(elementsOnly == null) elementsOnly = true;
	var sibling;
	if(node != null) sibling = node.nextSibling; else sibling = null;
	while(sibling != null && elementsOnly && sibling.nodeType != dtx.DOMType.ELEMENT_NODE) sibling = sibling.nextSibling;
	return sibling;
};
dtx.single.Traversing.prev = function(node,elementsOnly) {
	if(elementsOnly == null) elementsOnly = true;
	var sibling;
	if(node != null) sibling = node.previousSibling; else sibling = null;
	while(sibling != null && elementsOnly && sibling.nodeType != dtx.DOMType.ELEMENT_NODE) sibling = sibling.previousSibling;
	return sibling;
};
dtx.single.Traversing.find = function(node,selector) {
	var newDOMCollection = new dtx.DOMCollection();
	if(node != null && dtx.single.ElementManipulation.isElement(node) || dtx.single.ElementManipulation.isDocument(node)) {
		var element = node;
		if($bind(element,element.querySelectorAll)) {
			var results = element.querySelectorAll(selector);
			newDOMCollection.addNodeList(results);
		} else {
			var engine = 
						(('undefined' != typeof Sizzle && Sizzle) ||
						(('undefined' != typeof jQuery) && jQuery.find) ||
						(('undefined' != typeof $) && $.find))
					;
			var results1 = engine(selector,node);
			newDOMCollection.addCollection(results1);
		}
	}
	return newDOMCollection;
};
var format = {};
format.wav = {};
format.wav.WAVEFormat = { __ename__ : true, __constructs__ : ["WF_PCM"] };
format.wav.WAVEFormat.WF_PCM = ["WF_PCM",0];
format.wav.WAVEFormat.WF_PCM.toString = $estr;
format.wav.WAVEFormat.WF_PCM.__enum__ = format.wav.WAVEFormat;
format.wav.Reader = function(i) {
	this.i = i;
	i.set_bigEndian(false);
};
format.wav.Reader.__name__ = true;
format.wav.Reader.prototype = {
	readInt: function() {
		return this.i.readInt32();
	}
	,read: function() {
		if(this.i.readString(4) != "RIFF") throw "RIFF header expected";
		var len = this.i.readInt32();
		if(this.i.readString(4) != "WAVE") throw "WAVE signature not found";
		var x = this.i.readString(4);
		if(x != "fmt ") throw "expected fmt subchunk";
		var fmtlen = this.i.readInt32();
		var x1 = this.i.readUInt16();
		var format1;
		switch(x1) {
		case 1:
			format1 = format.wav.WAVEFormat.WF_PCM;
			break;
		default:
			console.log("only PCM (uncompressed) WAV files are supported");
			format1 = format.wav.WAVEFormat.WF_PCM;
		}
		var channels = this.i.readUInt16();
		var samplingRate = this.i.readInt32();
		var byteRate = this.i.readInt32();
		var blockAlign = this.i.readUInt16();
		var bitsPerSample = this.i.readUInt16();
		if(fmtlen > 16) this.i.read(fmtlen - 16);
		var nextChunk = this.i.readString(4);
		while(nextChunk != "data") {
			this.i.read(this.i.readInt32());
			nextChunk = this.i.readString(4);
		}
		if(nextChunk != "data") throw "expected data subchunk";
		var datalen = this.i.readInt32();
		var data = this.i.readAll();
		if(data.length > datalen) data = data.sub(0,datalen);
		return { header : { format : format1, channels : channels, samplingRate : samplingRate, byteRate : byteRate, blockAlign : blockAlign, bitsPerSample : bitsPerSample}, data : data};
	}
	,__class__: format.wav.Reader
};
format.wav.Writer = function(output) {
	this.o = output;
	this.o.set_bigEndian(false);
};
format.wav.Writer.__name__ = true;
format.wav.Writer.prototype = {
	write: function(wav) {
		var hdr = wav.header;
		this.o.writeString("RIFF");
		this.o.writeInt32(36 + wav.data.length);
		this.o.writeString("WAVE");
		this.o.writeString("fmt ");
		this.o.writeInt32(16);
		this.o.writeUInt16(1);
		this.o.writeUInt16(hdr.channels);
		this.o.writeInt32(hdr.samplingRate);
		this.o.writeInt32(hdr.byteRate);
		this.o.writeUInt16(hdr.blockAlign);
		this.o.writeUInt16(hdr.bitsPerSample);
		this.o.writeString("data");
		this.o.writeInt32(wav.data.length);
		this.o.write(wav.data);
	}
	,writeInt: function(v) {
		this.o.writeInt32(v);
	}
	,__class__: format.wav.Writer
};
var haxe = {};
haxe.Utf8 = function() { };
haxe.Utf8.__name__ = true;
haxe.Utf8.decode = function(s) {
	throw "Not implemented";
	return s;
};
haxe.ds = {};
haxe.ds.IntMap = function() {
	this.h = { };
};
haxe.ds.IntMap.__name__ = true;
haxe.ds.IntMap.__interfaces__ = [IMap];
haxe.ds.IntMap.prototype = {
	set: function(key,value) {
		this.h[key] = value;
	}
	,get: function(key) {
		return this.h[key];
	}
	,exists: function(key) {
		return this.h.hasOwnProperty(key);
	}
	,keys: function() {
		var a = [];
		for( var key in this.h ) {
		if(this.h.hasOwnProperty(key)) a.push(key | 0);
		}
		return HxOverrides.iter(a);
	}
	,__class__: haxe.ds.IntMap
};
haxe.ds.ObjectMap = function() {
	this.h = { };
	this.h.__keys__ = { };
};
haxe.ds.ObjectMap.__name__ = true;
haxe.ds.ObjectMap.__interfaces__ = [IMap];
haxe.ds.ObjectMap.prototype = {
	set: function(key,value) {
		var id = key.__id__ || (key.__id__ = ++haxe.ds.ObjectMap.count);
		this.h[id] = value;
		this.h.__keys__[id] = key;
	}
	,get: function(key) {
		return this.h[key.__id__];
	}
	,keys: function() {
		var a = [];
		for( var key in this.h.__keys__ ) {
		if(this.h.hasOwnProperty(key)) a.push(this.h.__keys__[key]);
		}
		return HxOverrides.iter(a);
	}
	,__class__: haxe.ds.ObjectMap
};
haxe.ds.Option = { __ename__ : true, __constructs__ : ["Some","None"] };
haxe.ds.Option.Some = function(v) { var $x = ["Some",0,v]; $x.__enum__ = haxe.ds.Option; $x.toString = $estr; return $x; };
haxe.ds.Option.None = ["None",1];
haxe.ds.Option.None.toString = $estr;
haxe.ds.Option.None.__enum__ = haxe.ds.Option;
haxe.ds.StringMap = function() {
	this.h = { };
};
haxe.ds.StringMap.__name__ = true;
haxe.ds.StringMap.__interfaces__ = [IMap];
haxe.ds.StringMap.prototype = {
	set: function(key,value) {
		this.h["$" + key] = value;
	}
	,get: function(key) {
		return this.h["$" + key];
	}
	,exists: function(key) {
		return this.h.hasOwnProperty("$" + key);
	}
	,remove: function(key) {
		key = "$" + key;
		if(!this.h.hasOwnProperty(key)) return false;
		delete(this.h[key]);
		return true;
	}
	,keys: function() {
		var a = [];
		for( var key in this.h ) {
		if(this.h.hasOwnProperty(key)) a.push(key.substr(1));
		}
		return HxOverrides.iter(a);
	}
	,toString: function() {
		var s = new StringBuf();
		s.b += "{";
		var it = this.keys();
		while( it.hasNext() ) {
			var i = it.next();
			if(i == null) s.b += "null"; else s.b += "" + i;
			s.b += " => ";
			s.add(Std.string(this.get(i)));
			if(it.hasNext()) s.b += ", ";
		}
		s.b += "}";
		return s.b;
	}
	,__class__: haxe.ds.StringMap
};
haxe.io = {};
haxe.io.Bytes = function(length,b) {
	this.length = length;
	this.b = b;
};
haxe.io.Bytes.__name__ = true;
haxe.io.Bytes.alloc = function(length) {
	var a = new Array();
	var _g = 0;
	while(_g < length) {
		var i = _g++;
		a.push(0);
	}
	return new haxe.io.Bytes(length,a);
};
haxe.io.Bytes.ofString = function(s) {
	var a = new Array();
	var i = 0;
	while(i < s.length) {
		var c = StringTools.fastCodeAt(s,i++);
		if(55296 <= c && c <= 56319) c = c - 55232 << 10 | StringTools.fastCodeAt(s,i++) & 1023;
		if(c <= 127) a.push(c); else if(c <= 2047) {
			a.push(192 | c >> 6);
			a.push(128 | c & 63);
		} else if(c <= 65535) {
			a.push(224 | c >> 12);
			a.push(128 | c >> 6 & 63);
			a.push(128 | c & 63);
		} else {
			a.push(240 | c >> 18);
			a.push(128 | c >> 12 & 63);
			a.push(128 | c >> 6 & 63);
			a.push(128 | c & 63);
		}
	}
	return new haxe.io.Bytes(a.length,a);
};
haxe.io.Bytes.prototype = {
	set: function(pos,v) {
		this.b[pos] = v & 255;
	}
	,sub: function(pos,len) {
		if(pos < 0 || len < 0 || pos + len > this.length) throw haxe.io.Error.OutsideBounds;
		return new haxe.io.Bytes(len,this.b.slice(pos,pos + len));
	}
	,getString: function(pos,len) {
		if(pos < 0 || len < 0 || pos + len > this.length) throw haxe.io.Error.OutsideBounds;
		var s = "";
		var b = this.b;
		var fcc = String.fromCharCode;
		var i = pos;
		var max = pos + len;
		while(i < max) {
			var c = b[i++];
			if(c < 128) {
				if(c == 0) break;
				s += fcc(c);
			} else if(c < 224) s += fcc((c & 63) << 6 | b[i++] & 127); else if(c < 240) {
				var c2 = b[i++];
				s += fcc((c & 31) << 12 | (c2 & 127) << 6 | b[i++] & 127);
			} else {
				var c21 = b[i++];
				var c3 = b[i++];
				var u = (c & 15) << 18 | (c21 & 127) << 12 | (c3 & 127) << 6 | b[i++] & 127;
				s += fcc((u >> 10) + 55232);
				s += fcc(u & 1023 | 56320);
			}
		}
		return s;
	}
	,toString: function() {
		return this.getString(0,this.length);
	}
	,__class__: haxe.io.Bytes
};
haxe.io.BytesBuffer = function() {
	this.b = new Array();
};
haxe.io.BytesBuffer.__name__ = true;
haxe.io.BytesBuffer.prototype = {
	addBytes: function(src,pos,len) {
		if(pos < 0 || len < 0 || pos + len > src.length) throw haxe.io.Error.OutsideBounds;
		var b1 = this.b;
		var b2 = src.b;
		var _g1 = pos;
		var _g = pos + len;
		while(_g1 < _g) {
			var i = _g1++;
			this.b.push(b2[i]);
		}
	}
	,getBytes: function() {
		var bytes = new haxe.io.Bytes(this.b.length,this.b);
		this.b = null;
		return bytes;
	}
	,__class__: haxe.io.BytesBuffer
};
haxe.io.Input = function() { };
haxe.io.Input.__name__ = true;
haxe.io.Input.prototype = {
	readByte: function() {
		throw "Not implemented";
	}
	,readBytes: function(s,pos,len) {
		var k = len;
		var b = s.b;
		if(pos < 0 || len < 0 || pos + len > s.length) throw haxe.io.Error.OutsideBounds;
		while(k > 0) {
			b[pos] = this.readByte();
			pos++;
			k--;
		}
		return len;
	}
	,set_bigEndian: function(b) {
		this.bigEndian = b;
		return b;
	}
	,readAll: function(bufsize) {
		if(bufsize == null) bufsize = 16384;
		var buf = haxe.io.Bytes.alloc(bufsize);
		var total = new haxe.io.BytesBuffer();
		try {
			while(true) {
				var len = this.readBytes(buf,0,bufsize);
				if(len == 0) throw haxe.io.Error.Blocked;
				total.addBytes(buf,0,len);
			}
		} catch( e ) {
			if( js.Boot.__instanceof(e,haxe.io.Eof) ) {
			} else throw(e);
		}
		return total.getBytes();
	}
	,readFullBytes: function(s,pos,len) {
		while(len > 0) {
			var k = this.readBytes(s,pos,len);
			pos += k;
			len -= k;
		}
	}
	,read: function(nbytes) {
		var s = haxe.io.Bytes.alloc(nbytes);
		var p = 0;
		while(nbytes > 0) {
			var k = this.readBytes(s,p,nbytes);
			if(k == 0) throw haxe.io.Error.Blocked;
			p += k;
			nbytes -= k;
		}
		return s;
	}
	,readUInt16: function() {
		var ch1 = this.readByte();
		var ch2 = this.readByte();
		if(this.bigEndian) return ch2 | ch1 << 8; else return ch1 | ch2 << 8;
	}
	,readInt32: function() {
		var ch1 = this.readByte();
		var ch2 = this.readByte();
		var ch3 = this.readByte();
		var ch4 = this.readByte();
		if(this.bigEndian) return ch4 | ch3 << 8 | ch2 << 16 | ch1 << 24; else return ch1 | ch2 << 8 | ch3 << 16 | ch4 << 24;
	}
	,readString: function(len) {
		var b = haxe.io.Bytes.alloc(len);
		this.readFullBytes(b,0,len);
		return b.toString();
	}
	,__class__: haxe.io.Input
};
haxe.io.BytesInput = function(b,pos,len) {
	if(pos == null) pos = 0;
	if(len == null) len = b.length - pos;
	if(pos < 0 || len < 0 || pos + len > b.length) throw haxe.io.Error.OutsideBounds;
	this.b = b.b;
	this.pos = pos;
	this.len = len;
	this.totlen = len;
};
haxe.io.BytesInput.__name__ = true;
haxe.io.BytesInput.__super__ = haxe.io.Input;
haxe.io.BytesInput.prototype = $extend(haxe.io.Input.prototype,{
	readByte: function() {
		if(this.len == 0) throw new haxe.io.Eof();
		this.len--;
		return this.b[this.pos++];
	}
	,readBytes: function(buf,pos,len) {
		if(pos < 0 || len < 0 || pos + len > buf.length) throw haxe.io.Error.OutsideBounds;
		if(this.len == 0 && len > 0) throw new haxe.io.Eof();
		if(this.len < len) len = this.len;
		var b1 = this.b;
		var b2 = buf.b;
		var _g = 0;
		while(_g < len) {
			var i = _g++;
			b2[pos + i] = b1[this.pos + i];
		}
		this.pos += len;
		this.len -= len;
		return len;
	}
	,__class__: haxe.io.BytesInput
});
haxe.io.Output = function() { };
haxe.io.Output.__name__ = true;
haxe.io.Output.prototype = {
	writeByte: function(c) {
		throw "Not implemented";
	}
	,writeBytes: function(s,pos,len) {
		var k = len;
		var b = s.b;
		if(pos < 0 || len < 0 || pos + len > s.length) throw haxe.io.Error.OutsideBounds;
		while(k > 0) {
			this.writeByte(b[pos]);
			pos++;
			k--;
		}
		return len;
	}
	,set_bigEndian: function(b) {
		this.bigEndian = b;
		return b;
	}
	,write: function(s) {
		var l = s.length;
		var p = 0;
		while(l > 0) {
			var k = this.writeBytes(s,p,l);
			if(k == 0) throw haxe.io.Error.Blocked;
			p += k;
			l -= k;
		}
	}
	,writeFullBytes: function(s,pos,len) {
		while(len > 0) {
			var k = this.writeBytes(s,pos,len);
			pos += k;
			len -= k;
		}
	}
	,writeUInt16: function(x) {
		if(x < 0 || x >= 65536) throw haxe.io.Error.Overflow;
		if(this.bigEndian) {
			this.writeByte(x >> 8);
			this.writeByte(x & 255);
		} else {
			this.writeByte(x & 255);
			this.writeByte(x >> 8);
		}
	}
	,writeInt32: function(x) {
		if(this.bigEndian) {
			this.writeByte(x >>> 24);
			this.writeByte(x >> 16 & 255);
			this.writeByte(x >> 8 & 255);
			this.writeByte(x & 255);
		} else {
			this.writeByte(x & 255);
			this.writeByte(x >> 8 & 255);
			this.writeByte(x >> 16 & 255);
			this.writeByte(x >>> 24);
		}
	}
	,writeString: function(s) {
		var b = haxe.io.Bytes.ofString(s);
		this.writeFullBytes(b,0,b.length);
	}
	,__class__: haxe.io.Output
};
haxe.io.Eof = function() {
};
haxe.io.Eof.__name__ = true;
haxe.io.Eof.prototype = {
	toString: function() {
		return "Eof";
	}
	,__class__: haxe.io.Eof
};
haxe.io.Error = { __ename__ : true, __constructs__ : ["Blocked","Overflow","OutsideBounds","Custom"] };
haxe.io.Error.Blocked = ["Blocked",0];
haxe.io.Error.Blocked.toString = $estr;
haxe.io.Error.Blocked.__enum__ = haxe.io.Error;
haxe.io.Error.Overflow = ["Overflow",1];
haxe.io.Error.Overflow.toString = $estr;
haxe.io.Error.Overflow.__enum__ = haxe.io.Error;
haxe.io.Error.OutsideBounds = ["OutsideBounds",2];
haxe.io.Error.OutsideBounds.toString = $estr;
haxe.io.Error.OutsideBounds.__enum__ = haxe.io.Error;
haxe.io.Error.Custom = function(e) { var $x = ["Custom",3,e]; $x.__enum__ = haxe.io.Error; $x.toString = $estr; return $x; };
haxe.xml = {};
haxe.xml.Parser = function() { };
haxe.xml.Parser.__name__ = true;
haxe.xml.Parser.parse = function(str) {
	var doc = Xml.createDocument();
	haxe.xml.Parser.doParse(str,0,doc);
	return doc;
};
haxe.xml.Parser.doParse = function(str,p,parent) {
	if(p == null) p = 0;
	var xml = null;
	var state = 1;
	var next = 1;
	var aname = null;
	var start = 0;
	var nsubs = 0;
	var nbrackets = 0;
	var c = str.charCodeAt(p);
	var buf = new StringBuf();
	while(!(c != c)) {
		switch(state) {
		case 0:
			switch(c) {
			case 10:case 13:case 9:case 32:
				break;
			default:
				state = next;
				continue;
			}
			break;
		case 1:
			switch(c) {
			case 60:
				state = 0;
				next = 2;
				break;
			default:
				start = p;
				state = 13;
				continue;
			}
			break;
		case 13:
			if(c == 60) {
				var child = Xml.createPCData(buf.b + HxOverrides.substr(str,start,p - start));
				buf = new StringBuf();
				parent.addChild(child);
				nsubs++;
				state = 0;
				next = 2;
			} else if(c == 38) {
				buf.addSub(str,start,p - start);
				state = 18;
				next = 13;
				start = p + 1;
			}
			break;
		case 17:
			if(c == 93 && str.charCodeAt(p + 1) == 93 && str.charCodeAt(p + 2) == 62) {
				var child1 = Xml.createCData(HxOverrides.substr(str,start,p - start));
				parent.addChild(child1);
				nsubs++;
				p += 2;
				state = 1;
			}
			break;
		case 2:
			switch(c) {
			case 33:
				if(str.charCodeAt(p + 1) == 91) {
					p += 2;
					if(HxOverrides.substr(str,p,6).toUpperCase() != "CDATA[") throw "Expected <![CDATA[";
					p += 5;
					state = 17;
					start = p + 1;
				} else if(str.charCodeAt(p + 1) == 68 || str.charCodeAt(p + 1) == 100) {
					if(HxOverrides.substr(str,p + 2,6).toUpperCase() != "OCTYPE") throw "Expected <!DOCTYPE";
					p += 8;
					state = 16;
					start = p + 1;
				} else if(str.charCodeAt(p + 1) != 45 || str.charCodeAt(p + 2) != 45) throw "Expected <!--"; else {
					p += 2;
					state = 15;
					start = p + 1;
				}
				break;
			case 63:
				state = 14;
				start = p;
				break;
			case 47:
				if(parent == null) throw "Expected node name";
				start = p + 1;
				state = 0;
				next = 10;
				break;
			default:
				state = 3;
				start = p;
				continue;
			}
			break;
		case 3:
			if(!(c >= 97 && c <= 122 || c >= 65 && c <= 90 || c >= 48 && c <= 57 || c == 58 || c == 46 || c == 95 || c == 45)) {
				if(p == start) throw "Expected node name";
				xml = Xml.createElement(HxOverrides.substr(str,start,p - start));
				parent.addChild(xml);
				state = 0;
				next = 4;
				continue;
			}
			break;
		case 4:
			switch(c) {
			case 47:
				state = 11;
				nsubs++;
				break;
			case 62:
				state = 9;
				nsubs++;
				break;
			default:
				state = 5;
				start = p;
				continue;
			}
			break;
		case 5:
			if(!(c >= 97 && c <= 122 || c >= 65 && c <= 90 || c >= 48 && c <= 57 || c == 58 || c == 46 || c == 95 || c == 45)) {
				var tmp;
				if(start == p) throw "Expected attribute name";
				tmp = HxOverrides.substr(str,start,p - start);
				aname = tmp;
				if(xml.exists(aname)) throw "Duplicate attribute";
				state = 0;
				next = 6;
				continue;
			}
			break;
		case 6:
			switch(c) {
			case 61:
				state = 0;
				next = 7;
				break;
			default:
				throw "Expected =";
			}
			break;
		case 7:
			switch(c) {
			case 34:case 39:
				state = 8;
				start = p;
				break;
			default:
				throw "Expected \"";
			}
			break;
		case 8:
			if(c == str.charCodeAt(start)) {
				var val = StringTools.htmlUnescape(HxOverrides.substr(str,start + 1,p - start - 1));
				xml.set(aname,val);
				state = 0;
				next = 4;
			}
			break;
		case 9:
			p = haxe.xml.Parser.doParse(str,p,xml);
			start = p;
			state = 1;
			break;
		case 11:
			switch(c) {
			case 62:
				state = 1;
				break;
			default:
				throw "Expected >";
			}
			break;
		case 12:
			switch(c) {
			case 62:
				if(nsubs == 0) parent.addChild(Xml.createPCData(""));
				return p;
			default:
				throw "Expected >";
			}
			break;
		case 10:
			if(!(c >= 97 && c <= 122 || c >= 65 && c <= 90 || c >= 48 && c <= 57 || c == 58 || c == 46 || c == 95 || c == 45)) {
				if(start == p) throw "Expected node name";
				var v = HxOverrides.substr(str,start,p - start);
				if(v != parent.get_nodeName()) throw "Expected </" + parent.get_nodeName() + ">";
				state = 0;
				next = 12;
				continue;
			}
			break;
		case 15:
			if(c == 45 && str.charCodeAt(p + 1) == 45 && str.charCodeAt(p + 2) == 62) {
				parent.addChild(Xml.createComment(HxOverrides.substr(str,start,p - start)));
				p += 2;
				state = 1;
			}
			break;
		case 16:
			if(c == 91) nbrackets++; else if(c == 93) nbrackets--; else if(c == 62 && nbrackets == 0) {
				parent.addChild(Xml.createDocType(HxOverrides.substr(str,start,p - start)));
				state = 1;
			}
			break;
		case 14:
			if(c == 63 && str.charCodeAt(p + 1) == 62) {
				p++;
				var str1 = HxOverrides.substr(str,start + 1,p - start - 2);
				parent.addChild(Xml.createProcessingInstruction(str1));
				state = 1;
			}
			break;
		case 18:
			if(c == 59) {
				var s = HxOverrides.substr(str,start,p - start);
				if(s.charCodeAt(0) == 35) {
					var i;
					if(s.charCodeAt(1) == 120) i = Std.parseInt("0" + HxOverrides.substr(s,1,s.length - 1)); else i = Std.parseInt(HxOverrides.substr(s,1,s.length - 1));
					buf.add(String.fromCharCode(i));
				} else if(!haxe.xml.Parser.escapes.exists(s)) buf.b += Std.string("&" + s + ";"); else buf.add(haxe.xml.Parser.escapes.get(s));
				start = p + 1;
				state = next;
			}
			break;
		}
		c = StringTools.fastCodeAt(str,++p);
	}
	if(state == 1) {
		start = p;
		state = 13;
	}
	if(state == 13) {
		if(p != start || nsubs == 0) parent.addChild(Xml.createPCData(buf.b + HxOverrides.substr(str,start,p - start)));
		return p;
	}
	throw "Unexpected end";
};
haxe.xml.Parser.isValidChar = function(c) {
	return c >= 97 && c <= 122 || c >= 65 && c <= 90 || c >= 48 && c <= 57 || c == 58 || c == 46 || c == 95 || c == 45;
};
var hxlazy = {};
hxlazy.Lazy = function() { };
hxlazy.Lazy.__name__ = true;
var js = {};
js.Boot = function() { };
js.Boot.__name__ = true;
js.Boot.getClass = function(o) {
	if((o instanceof Array) && o.__enum__ == null) return Array; else return o.__class__;
};
js.Boot.__string_rec = function(o,s) {
	if(o == null) return "null";
	if(s.length >= 5) return "<...>";
	var t = typeof(o);
	if(t == "function" && (o.__name__ || o.__ename__)) t = "object";
	switch(t) {
	case "object":
		if(o instanceof Array) {
			if(o.__enum__) {
				if(o.length == 2) return o[0];
				var str = o[0] + "(";
				s += "\t";
				var _g1 = 2;
				var _g = o.length;
				while(_g1 < _g) {
					var i = _g1++;
					if(i != 2) str += "," + js.Boot.__string_rec(o[i],s); else str += js.Boot.__string_rec(o[i],s);
				}
				return str + ")";
			}
			var l = o.length;
			var i1;
			var str1 = "[";
			s += "\t";
			var _g2 = 0;
			while(_g2 < l) {
				var i2 = _g2++;
				str1 += (i2 > 0?",":"") + js.Boot.__string_rec(o[i2],s);
			}
			str1 += "]";
			return str1;
		}
		var tostr;
		try {
			tostr = o.toString;
		} catch( e ) {
			return "???";
		}
		if(tostr != null && tostr != Object.toString) {
			var s2 = o.toString();
			if(s2 != "[object Object]") return s2;
		}
		var k = null;
		var str2 = "{\n";
		s += "\t";
		var hasp = o.hasOwnProperty != null;
		for( var k in o ) {
		if(hasp && !o.hasOwnProperty(k)) {
			continue;
		}
		if(k == "prototype" || k == "__class__" || k == "__super__" || k == "__interfaces__" || k == "__properties__") {
			continue;
		}
		if(str2.length != 2) str2 += ", \n";
		str2 += s + k + " : " + js.Boot.__string_rec(o[k],s);
		}
		s = s.substring(1);
		str2 += "\n" + s + "}";
		return str2;
	case "function":
		return "<function>";
	case "string":
		return o;
	default:
		return String(o);
	}
};
js.Boot.__interfLoop = function(cc,cl) {
	if(cc == null) return false;
	if(cc == cl) return true;
	var intf = cc.__interfaces__;
	if(intf != null) {
		var _g1 = 0;
		var _g = intf.length;
		while(_g1 < _g) {
			var i = _g1++;
			var i1 = intf[i];
			if(i1 == cl || js.Boot.__interfLoop(i1,cl)) return true;
		}
	}
	return js.Boot.__interfLoop(cc.__super__,cl);
};
js.Boot.__instanceof = function(o,cl) {
	if(cl == null) return false;
	switch(cl) {
	case Int:
		return (o|0) === o;
	case Float:
		return typeof(o) == "number";
	case Bool:
		return typeof(o) == "boolean";
	case String:
		return typeof(o) == "string";
	case Array:
		return (o instanceof Array) && o.__enum__ == null;
	case Dynamic:
		return true;
	default:
		if(o != null) {
			if(typeof(cl) == "function") {
				if(o instanceof cl) return true;
				if(js.Boot.__interfLoop(js.Boot.getClass(o),cl)) return true;
			}
		} else return false;
		if(cl == Class && o.__name__ != null) return true;
		if(cl == Enum && o.__ename__ != null) return true;
		return o.__enum__ == cl;
	}
};
js.Lib = function() { };
js.Lib.__name__ = true;
js.Lib.alert = function(v) {
	alert(js.Boot.__string_rec(v,""));
};
var nx3 = {};
nx3.Constants = function() { };
nx3.Constants.__name__ = true;
nx3.EAllotment = { __ename__ : true, __constructs__ : ["LeftAlign","Equal","Logaritmic","Linear"] };
nx3.EAllotment.LeftAlign = ["LeftAlign",0];
nx3.EAllotment.LeftAlign.toString = $estr;
nx3.EAllotment.LeftAlign.__enum__ = nx3.EAllotment;
nx3.EAllotment.Equal = ["Equal",1];
nx3.EAllotment.Equal.toString = $estr;
nx3.EAllotment.Equal.__enum__ = nx3.EAllotment;
nx3.EAllotment.Logaritmic = ["Logaritmic",2];
nx3.EAllotment.Logaritmic.toString = $estr;
nx3.EAllotment.Logaritmic.__enum__ = nx3.EAllotment;
nx3.EAllotment.Linear = ["Linear",3];
nx3.EAllotment.Linear.toString = $estr;
nx3.EAllotment.Linear.__enum__ = nx3.EAllotment;
nx3.EBarType = { __ename__ : true, __constructs__ : ["Normal","Repeat","Ignore","Folded"] };
nx3.EBarType.Normal = ["Normal",0];
nx3.EBarType.Normal.toString = $estr;
nx3.EBarType.Normal.__enum__ = nx3.EBarType;
nx3.EBarType.Repeat = ["Repeat",1];
nx3.EBarType.Repeat.toString = $estr;
nx3.EBarType.Repeat.__enum__ = nx3.EBarType;
nx3.EBarType.Ignore = ["Ignore",2];
nx3.EBarType.Ignore.toString = $estr;
nx3.EBarType.Ignore.__enum__ = nx3.EBarType;
nx3.EBarType.Folded = ["Folded",3];
nx3.EBarType.Folded.toString = $estr;
nx3.EBarType.Folded.__enum__ = nx3.EBarType;
nx3.EBarline = { __ename__ : true, __constructs__ : ["Normal","None","Double","Final","Dotted","Breath","EndRepeat","EndAndStartRepeat"] };
nx3.EBarline.Normal = ["Normal",0];
nx3.EBarline.Normal.toString = $estr;
nx3.EBarline.Normal.__enum__ = nx3.EBarline;
nx3.EBarline.None = ["None",1];
nx3.EBarline.None.toString = $estr;
nx3.EBarline.None.__enum__ = nx3.EBarline;
nx3.EBarline.Double = ["Double",2];
nx3.EBarline.Double.toString = $estr;
nx3.EBarline.Double.__enum__ = nx3.EBarline;
nx3.EBarline.Final = ["Final",3];
nx3.EBarline.Final.toString = $estr;
nx3.EBarline.Final.__enum__ = nx3.EBarline;
nx3.EBarline.Dotted = ["Dotted",4];
nx3.EBarline.Dotted.toString = $estr;
nx3.EBarline.Dotted.__enum__ = nx3.EBarline;
nx3.EBarline.Breath = ["Breath",5];
nx3.EBarline.Breath.toString = $estr;
nx3.EBarline.Breath.__enum__ = nx3.EBarline;
nx3.EBarline.EndRepeat = ["EndRepeat",6];
nx3.EBarline.EndRepeat.toString = $estr;
nx3.EBarline.EndRepeat.__enum__ = nx3.EBarline;
nx3.EBarline.EndAndStartRepeat = ["EndAndStartRepeat",7];
nx3.EBarline.EndAndStartRepeat.toString = $estr;
nx3.EBarline.EndAndStartRepeat.__enum__ = nx3.EBarline;
nx3.EBarlineLeft = { __ename__ : true, __constructs__ : ["None","Single","Double","StartRepeat"] };
nx3.EBarlineLeft.None = ["None",0];
nx3.EBarlineLeft.None.toString = $estr;
nx3.EBarlineLeft.None.__enum__ = nx3.EBarlineLeft;
nx3.EBarlineLeft.Single = ["Single",1];
nx3.EBarlineLeft.Single.toString = $estr;
nx3.EBarlineLeft.Single.__enum__ = nx3.EBarlineLeft;
nx3.EBarlineLeft.Double = ["Double",2];
nx3.EBarlineLeft.Double.toString = $estr;
nx3.EBarlineLeft.Double.__enum__ = nx3.EBarlineLeft;
nx3.EBarlineLeft.StartRepeat = ["StartRepeat",3];
nx3.EBarlineLeft.StartRepeat.toString = $estr;
nx3.EBarlineLeft.StartRepeat.__enum__ = nx3.EBarlineLeft;
nx3.EBeamflagType = { __ename__ : true, __constructs__ : ["None","Start16","End16","Full16"] };
nx3.EBeamflagType.None = ["None",0];
nx3.EBeamflagType.None.toString = $estr;
nx3.EBeamflagType.None.__enum__ = nx3.EBeamflagType;
nx3.EBeamflagType.Start16 = ["Start16",1];
nx3.EBeamflagType.Start16.toString = $estr;
nx3.EBeamflagType.Start16.__enum__ = nx3.EBeamflagType;
nx3.EBeamflagType.End16 = ["End16",2];
nx3.EBeamflagType.End16.toString = $estr;
nx3.EBeamflagType.End16.__enum__ = nx3.EBeamflagType;
nx3.EBeamflagType.Full16 = ["Full16",3];
nx3.EBeamflagType.Full16.toString = $estr;
nx3.EBeamflagType.Full16.__enum__ = nx3.EBeamflagType;
nx3.EClef = { __ename__ : true, __constructs__ : ["ClefG","ClefF","ClefC"] };
nx3.EClef.ClefG = ["ClefG",0];
nx3.EClef.ClefG.toString = $estr;
nx3.EClef.ClefG.__enum__ = nx3.EClef;
nx3.EClef.ClefF = ["ClefF",1];
nx3.EClef.ClefF.toString = $estr;
nx3.EClef.ClefF.__enum__ = nx3.EClef;
nx3.EClef.ClefC = ["ClefC",2];
nx3.EClef.ClefC.toString = $estr;
nx3.EClef.ClefC.__enum__ = nx3.EClef;
nx3.EDirectionTools = function() { };
nx3.EDirectionTools.__name__ = true;
nx3.EDirectionTools.uadToUd = function(directionUAD) {
	if(directionUAD == nx3.EDirectionUAD.Up) return nx3.EDirectionUD.Up;
	return nx3.EDirectionUD.Down;
};
nx3.EDirectionUAD = { __ename__ : true, __constructs__ : ["Up","Auto","Down"] };
nx3.EDirectionUAD.Up = ["Up",0];
nx3.EDirectionUAD.Up.toString = $estr;
nx3.EDirectionUAD.Up.__enum__ = nx3.EDirectionUAD;
nx3.EDirectionUAD.Auto = ["Auto",1];
nx3.EDirectionUAD.Auto.toString = $estr;
nx3.EDirectionUAD.Auto.__enum__ = nx3.EDirectionUAD;
nx3.EDirectionUAD.Down = ["Down",2];
nx3.EDirectionUAD.Down.toString = $estr;
nx3.EDirectionUAD.Down.__enum__ = nx3.EDirectionUAD;
nx3.EDirectionUADTools = function() { };
nx3.EDirectionUADTools.__name__ = true;
nx3.EDirectionUADTools.toUD = function(direction) {
	switch(direction[1]) {
	case 0:
		return nx3.EDirectionUD.Up;
	case 2:
		return nx3.EDirectionUD.Down;
	default:
		return nx3.EDirectionUD.Down;
	}
};
nx3.EDirectionUD = { __ename__ : true, __constructs__ : ["Up","Down"] };
nx3.EDirectionUD.Up = ["Up",0];
nx3.EDirectionUD.Up.toString = $estr;
nx3.EDirectionUD.Up.__enum__ = nx3.EDirectionUD;
nx3.EDirectionUD.Down = ["Down",1];
nx3.EDirectionUD.Down.toString = $estr;
nx3.EDirectionUD.Down.__enum__ = nx3.EDirectionUD;
nx3.EDirectionUDTools = function() { };
nx3.EDirectionUDTools.__name__ = true;
nx3.EDirectionUDTools.toUAD = function(direction) {
	if(direction == nx3.EDirectionUD.Up) return nx3.EDirectionUAD.Up; else return nx3.EDirectionUAD.Down;
};
nx3.EDisplayALN = { __ename__ : true, __constructs__ : ["Always","Layout","Never"] };
nx3.EDisplayALN.Always = ["Always",0];
nx3.EDisplayALN.Always.toString = $estr;
nx3.EDisplayALN.Always.__enum__ = nx3.EDisplayALN;
nx3.EDisplayALN.Layout = ["Layout",1];
nx3.EDisplayALN.Layout.toString = $estr;
nx3.EDisplayALN.Layout.__enum__ = nx3.EDisplayALN;
nx3.EDisplayALN.Never = ["Never",2];
nx3.EDisplayALN.Never.toString = $estr;
nx3.EDisplayALN.Never.__enum__ = nx3.EDisplayALN;
nx3.EHeadPosition = { __ename__ : true, __constructs__ : ["Left","Center","Right"] };
nx3.EHeadPosition.Left = ["Left",0];
nx3.EHeadPosition.Left.toString = $estr;
nx3.EHeadPosition.Left.__enum__ = nx3.EHeadPosition;
nx3.EHeadPosition.Center = ["Center",1];
nx3.EHeadPosition.Center.toString = $estr;
nx3.EHeadPosition.Center.__enum__ = nx3.EHeadPosition;
nx3.EHeadPosition.Right = ["Right",2];
nx3.EHeadPosition.Right.toString = $estr;
nx3.EHeadPosition.Right.__enum__ = nx3.EHeadPosition;
nx3.EHeadType = { __ename__ : true, __constructs__ : ["Normal","Rythmic","Crossed","Pause","Other"] };
nx3.EHeadType.Normal = ["Normal",0];
nx3.EHeadType.Normal.toString = $estr;
nx3.EHeadType.Normal.__enum__ = nx3.EHeadType;
nx3.EHeadType.Rythmic = ["Rythmic",1];
nx3.EHeadType.Rythmic.toString = $estr;
nx3.EHeadType.Rythmic.__enum__ = nx3.EHeadType;
nx3.EHeadType.Crossed = ["Crossed",2];
nx3.EHeadType.Crossed.toString = $estr;
nx3.EHeadType.Crossed.__enum__ = nx3.EHeadType;
nx3.EHeadType.Pause = ["Pause",3];
nx3.EHeadType.Pause.toString = $estr;
nx3.EHeadType.Pause.__enum__ = nx3.EHeadType;
nx3.EHeadType.Other = ["Other",4];
nx3.EHeadType.Other.toString = $estr;
nx3.EHeadType.Other.__enum__ = nx3.EHeadType;
nx3.EHeadValueType = { __ename__ : true, __constructs__ : ["HVT4","HVT2","HVT1"] };
nx3.EHeadValueType.HVT4 = ["HVT4",0];
nx3.EHeadValueType.HVT4.toString = $estr;
nx3.EHeadValueType.HVT4.__enum__ = nx3.EHeadValueType;
nx3.EHeadValueType.HVT2 = ["HVT2",1];
nx3.EHeadValueType.HVT2.toString = $estr;
nx3.EHeadValueType.HVT2.__enum__ = nx3.EHeadValueType;
nx3.EHeadValueType.HVT1 = ["HVT1",2];
nx3.EHeadValueType.HVT1.toString = $estr;
nx3.EHeadValueType.HVT1.__enum__ = nx3.EHeadValueType;
nx3.EKey = { __ename__ : true, __constructs__ : ["Sharp6","Sharp5","Sharp4","Sharp3","Sharp2","Sharp1","Natural","Flat1","Flat2","Flat3","Flat4","Flat5","Flat6"] };
nx3.EKey.Sharp6 = ["Sharp6",0];
nx3.EKey.Sharp6.toString = $estr;
nx3.EKey.Sharp6.__enum__ = nx3.EKey;
nx3.EKey.Sharp5 = ["Sharp5",1];
nx3.EKey.Sharp5.toString = $estr;
nx3.EKey.Sharp5.__enum__ = nx3.EKey;
nx3.EKey.Sharp4 = ["Sharp4",2];
nx3.EKey.Sharp4.toString = $estr;
nx3.EKey.Sharp4.__enum__ = nx3.EKey;
nx3.EKey.Sharp3 = ["Sharp3",3];
nx3.EKey.Sharp3.toString = $estr;
nx3.EKey.Sharp3.__enum__ = nx3.EKey;
nx3.EKey.Sharp2 = ["Sharp2",4];
nx3.EKey.Sharp2.toString = $estr;
nx3.EKey.Sharp2.__enum__ = nx3.EKey;
nx3.EKey.Sharp1 = ["Sharp1",5];
nx3.EKey.Sharp1.toString = $estr;
nx3.EKey.Sharp1.__enum__ = nx3.EKey;
nx3.EKey.Natural = ["Natural",6];
nx3.EKey.Natural.toString = $estr;
nx3.EKey.Natural.__enum__ = nx3.EKey;
nx3.EKey.Flat1 = ["Flat1",7];
nx3.EKey.Flat1.toString = $estr;
nx3.EKey.Flat1.__enum__ = nx3.EKey;
nx3.EKey.Flat2 = ["Flat2",8];
nx3.EKey.Flat2.toString = $estr;
nx3.EKey.Flat2.__enum__ = nx3.EKey;
nx3.EKey.Flat3 = ["Flat3",9];
nx3.EKey.Flat3.toString = $estr;
nx3.EKey.Flat3.__enum__ = nx3.EKey;
nx3.EKey.Flat4 = ["Flat4",10];
nx3.EKey.Flat4.toString = $estr;
nx3.EKey.Flat4.__enum__ = nx3.EKey;
nx3.EKey.Flat5 = ["Flat5",11];
nx3.EKey.Flat5.toString = $estr;
nx3.EKey.Flat5.__enum__ = nx3.EKey;
nx3.EKey.Flat6 = ["Flat6",12];
nx3.EKey.Flat6.toString = $estr;
nx3.EKey.Flat6.__enum__ = nx3.EKey;
nx3.EKeysTools = function() { };
nx3.EKeysTools.__name__ = true;
nx3.EKeysTools.getLevels = function(key,clef) {
	var result = new Array();
	switch(key[1]) {
	case 7:
		result = [0];
		break;
	case 8:
		result = [0,-3];
		break;
	case 9:
		result = [0,-3,1];
		break;
	case 10:
		result = [0,-3,1,-2];
		break;
	case 11:
		result = [0,-3,1,-2,2,-1];
		break;
	case 12:
		result = [0,-3,1,-2,2,-1,3];
		break;
	case 5:
		result = [-4];
		break;
	case 4:
		result = [-4,-1];
		break;
	case 3:
		result = [-4,-1,-5];
		break;
	case 2:
		result = [-4,-1,-5,-2];
		break;
	case 1:
		result = [-4,-1,-5,-2,1];
		break;
	case 0:
		result = [-4,-1,-5,-2,1,-3];
		break;
	default:
		result = [];
	}
	var adjust;
	switch(clef[1]) {
	case 0:
		adjust = -1;
		break;
	case 1:
		adjust = 1;
		break;
	default:
		adjust = 0;
	}
	var _g1 = 0;
	var _g = result.length;
	while(_g1 < _g) {
		var i = _g1++;
		result[i] = result[i] + adjust;
	}
	return result;
};
nx3.EKeysTools.getSigncode = function(key) {
	switch(key[1]) {
	case 7:case 8:case 9:case 10:case 11:case 12:
		return -1;
	case 5:case 4:case 3:case 2:case 1:case 0:
		return 1;
	default:
		return 0;
	}
};
nx3.EKeysTools.getKeyNr = function(key) {
	switch(key[1]) {
	case 12:
		return -6;
	case 11:
		return -5;
	case 10:
		return -4;
	case 9:
		return -3;
	case 8:
		return -2;
	case 7:
		return -1;
	case 5:
		return 1;
	case 4:
		return 2;
	case 3:
		return 3;
	case 2:
		return 4;
	case 1:
		return 5;
	case 0:
		return 6;
	default:
		return 0;
	}
};
nx3.EKeysTools.getNotenrBaseMap = function(key) {
	if(key == null) {
		var _g = new haxe.ds.IntMap();
		_g.set(0,11);
		_g.set(1,9);
		_g.set(2,7);
		_g.set(3,5);
		_g.set(4,4);
		_g.set(5,2);
		_g.set(6,0);
		return _g;
	}
	switch(key[1]) {
	case 12:
		var _g1 = new haxe.ds.IntMap();
		_g1.set(0,10);
		_g1.set(1,8);
		_g1.set(2,6);
		_g1.set(3,5);
		_g1.set(4,3);
		_g1.set(5,1);
		_g1.set(6,-1);
		return _g1;
	case 11:
		var _g11 = new haxe.ds.IntMap();
		_g11.set(0,10);
		_g11.set(1,8);
		_g11.set(2,6);
		_g11.set(3,5);
		_g11.set(4,3);
		_g11.set(5,1);
		_g11.set(6,0);
		return _g11;
	case 10:
		var _g12 = new haxe.ds.IntMap();
		_g12.set(0,10);
		_g12.set(1,8);
		_g12.set(2,7);
		_g12.set(3,5);
		_g12.set(4,3);
		_g12.set(5,1);
		_g12.set(6,0);
		return _g12;
	case 9:
		var _g13 = new haxe.ds.IntMap();
		_g13.set(0,10);
		_g13.set(1,8);
		_g13.set(2,7);
		_g13.set(3,5);
		_g13.set(4,3);
		_g13.set(5,2);
		_g13.set(6,0);
		return _g13;
	case 8:
		var _g14 = new haxe.ds.IntMap();
		_g14.set(0,10);
		_g14.set(1,9);
		_g14.set(2,7);
		_g14.set(3,5);
		_g14.set(4,3);
		_g14.set(5,2);
		_g14.set(6,0);
		return _g14;
	case 7:
		var _g15 = new haxe.ds.IntMap();
		_g15.set(0,10);
		_g15.set(1,9);
		_g15.set(2,7);
		_g15.set(3,5);
		_g15.set(4,4);
		_g15.set(5,2);
		_g15.set(6,0);
		return _g15;
	case 5:
		var _g16 = new haxe.ds.IntMap();
		_g16.set(0,11);
		_g16.set(1,9);
		_g16.set(2,7);
		_g16.set(3,6);
		_g16.set(4,4);
		_g16.set(5,2);
		_g16.set(6,0);
		return _g16;
	case 4:
		var _g17 = new haxe.ds.IntMap();
		_g17.set(0,11);
		_g17.set(1,9);
		_g17.set(2,7);
		_g17.set(3,6);
		_g17.set(4,4);
		_g17.set(5,2);
		_g17.set(6,1);
		return _g17;
	case 3:
		var _g18 = new haxe.ds.IntMap();
		_g18.set(0,11);
		_g18.set(1,9);
		_g18.set(2,8);
		_g18.set(3,6);
		_g18.set(4,4);
		_g18.set(5,2);
		_g18.set(6,1);
		return _g18;
	case 2:
		var _g19 = new haxe.ds.IntMap();
		_g19.set(0,11);
		_g19.set(1,9);
		_g19.set(2,8);
		_g19.set(3,6);
		_g19.set(4,4);
		_g19.set(5,3);
		_g19.set(6,1);
		return _g19;
	case 1:
		var _g110 = new haxe.ds.IntMap();
		_g110.set(0,11);
		_g110.set(1,10);
		_g110.set(2,8);
		_g110.set(3,6);
		_g110.set(4,4);
		_g110.set(5,3);
		_g110.set(6,1);
		return _g110;
	case 0:
		var _g111 = new haxe.ds.IntMap();
		_g111.set(0,11);
		_g111.set(1,10);
		_g111.set(2,8);
		_g111.set(3,6);
		_g111.set(4,5);
		_g111.set(5,3);
		_g111.set(6,1);
		return _g111;
	default:
		var _g112 = new haxe.ds.IntMap();
		_g112.set(0,11);
		_g112.set(1,9);
		_g112.set(2,7);
		_g112.set(3,5);
		_g112.set(4,4);
		_g112.set(5,2);
		_g112.set(6,0);
		return _g112;
	}
};
nx3.EKeysTools.getSignsBaseMap = function(key) {
	if(key == null) {
		var _g = new haxe.ds.IntMap();
		_g.set(0,nx3.ESign.Natural);
		_g.set(1,nx3.ESign.Natural);
		_g.set(2,nx3.ESign.Natural);
		_g.set(3,nx3.ESign.Natural);
		_g.set(4,nx3.ESign.Natural);
		_g.set(5,nx3.ESign.Natural);
		_g.set(6,nx3.ESign.Natural);
		return _g;
	}
	switch(key[1]) {
	case 12:
		var _g1 = new haxe.ds.IntMap();
		_g1.set(0,nx3.ESign.Flat);
		_g1.set(1,nx3.ESign.Flat);
		_g1.set(2,nx3.ESign.Flat);
		_g1.set(3,nx3.ESign.Natural);
		_g1.set(4,nx3.ESign.Flat);
		_g1.set(5,nx3.ESign.Flat);
		_g1.set(6,nx3.ESign.Flat);
		return _g1;
	case 11:
		var _g11 = new haxe.ds.IntMap();
		_g11.set(0,nx3.ESign.Flat);
		_g11.set(1,nx3.ESign.Flat);
		_g11.set(2,nx3.ESign.Flat);
		_g11.set(3,nx3.ESign.Natural);
		_g11.set(4,nx3.ESign.Flat);
		_g11.set(5,nx3.ESign.Flat);
		_g11.set(6,nx3.ESign.Natural);
		return _g11;
	case 10:
		var _g12 = new haxe.ds.IntMap();
		_g12.set(0,nx3.ESign.Flat);
		_g12.set(1,nx3.ESign.Flat);
		_g12.set(2,nx3.ESign.Natural);
		_g12.set(3,nx3.ESign.Natural);
		_g12.set(4,nx3.ESign.Flat);
		_g12.set(5,nx3.ESign.Flat);
		_g12.set(6,nx3.ESign.Natural);
		return _g12;
	case 9:
		var _g13 = new haxe.ds.IntMap();
		_g13.set(0,nx3.ESign.Flat);
		_g13.set(1,nx3.ESign.Flat);
		_g13.set(2,nx3.ESign.Natural);
		_g13.set(3,nx3.ESign.Natural);
		_g13.set(4,nx3.ESign.Flat);
		_g13.set(5,nx3.ESign.Natural);
		_g13.set(6,nx3.ESign.Natural);
		return _g13;
	case 8:
		var _g14 = new haxe.ds.IntMap();
		_g14.set(0,nx3.ESign.Flat);
		_g14.set(1,nx3.ESign.Natural);
		_g14.set(2,nx3.ESign.Natural);
		_g14.set(3,nx3.ESign.Natural);
		_g14.set(4,nx3.ESign.Flat);
		_g14.set(5,nx3.ESign.Natural);
		_g14.set(6,nx3.ESign.Natural);
		return _g14;
	case 7:
		var _g15 = new haxe.ds.IntMap();
		_g15.set(0,nx3.ESign.Flat);
		_g15.set(1,nx3.ESign.Natural);
		_g15.set(2,nx3.ESign.Natural);
		_g15.set(3,nx3.ESign.Natural);
		_g15.set(4,nx3.ESign.Natural);
		_g15.set(5,nx3.ESign.Natural);
		_g15.set(6,nx3.ESign.Natural);
		return _g15;
	case 5:
		var _g16 = new haxe.ds.IntMap();
		_g16.set(0,nx3.ESign.Natural);
		_g16.set(1,nx3.ESign.Natural);
		_g16.set(2,nx3.ESign.Natural);
		_g16.set(3,nx3.ESign.Sharp);
		_g16.set(4,nx3.ESign.Natural);
		_g16.set(5,nx3.ESign.Natural);
		_g16.set(6,nx3.ESign.Natural);
		return _g16;
	case 4:
		var _g17 = new haxe.ds.IntMap();
		_g17.set(0,nx3.ESign.Natural);
		_g17.set(1,nx3.ESign.Natural);
		_g17.set(2,nx3.ESign.Natural);
		_g17.set(3,nx3.ESign.Sharp);
		_g17.set(4,nx3.ESign.Natural);
		_g17.set(5,nx3.ESign.Natural);
		_g17.set(6,nx3.ESign.Sharp);
		return _g17;
	case 3:
		var _g18 = new haxe.ds.IntMap();
		_g18.set(0,nx3.ESign.Natural);
		_g18.set(1,nx3.ESign.Natural);
		_g18.set(2,nx3.ESign.Sharp);
		_g18.set(3,nx3.ESign.Sharp);
		_g18.set(4,nx3.ESign.Natural);
		_g18.set(5,nx3.ESign.Natural);
		_g18.set(6,nx3.ESign.Sharp);
		return _g18;
	case 2:
		var _g19 = new haxe.ds.IntMap();
		_g19.set(0,nx3.ESign.Natural);
		_g19.set(1,nx3.ESign.Natural);
		_g19.set(2,nx3.ESign.Sharp);
		_g19.set(3,nx3.ESign.Sharp);
		_g19.set(4,nx3.ESign.Natural);
		_g19.set(5,nx3.ESign.Sharp);
		_g19.set(6,nx3.ESign.Sharp);
		return _g19;
	case 1:
		var _g110 = new haxe.ds.IntMap();
		_g110.set(0,nx3.ESign.Natural);
		_g110.set(1,nx3.ESign.Sharp);
		_g110.set(2,nx3.ESign.Sharp);
		_g110.set(3,nx3.ESign.Sharp);
		_g110.set(4,nx3.ESign.Natural);
		_g110.set(5,nx3.ESign.Sharp);
		_g110.set(6,nx3.ESign.Sharp);
		return _g110;
	case 0:
		var _g111 = new haxe.ds.IntMap();
		_g111.set(0,nx3.ESign.Natural);
		_g111.set(1,nx3.ESign.Sharp);
		_g111.set(2,nx3.ESign.Sharp);
		_g111.set(3,nx3.ESign.Sharp);
		_g111.set(4,nx3.ESign.Sharp);
		_g111.set(5,nx3.ESign.Sharp);
		_g111.set(6,nx3.ESign.Sharp);
		return _g111;
	default:
		var _g112 = new haxe.ds.IntMap();
		_g112.set(0,nx3.ESign.Natural);
		_g112.set(1,nx3.ESign.Natural);
		_g112.set(2,nx3.ESign.Natural);
		_g112.set(3,nx3.ESign.Natural);
		_g112.set(4,nx3.ESign.Natural);
		_g112.set(5,nx3.ESign.Natural);
		_g112.set(6,nx3.ESign.Natural);
		return _g112;
	}
};
nx3.EKeysTools.getKeyRootShift = function(key) {
	switch(key[1]) {
	case 12:
		return 4;
	case 11:
		return 1;
	case 10:
		return 8;
	case 9:
		return 3;
	case 8:
		return 10;
	case 7:
		return 5;
	case 6:
		return 0;
	case 5:
		return 7;
	case 4:
		return 2;
	case 3:
		return 9;
	case 2:
		return 4;
	case 1:
		return 11;
	case 0:
		return 6;
	}
	return 0;
};
nx3.ELyricContinuation = { __ename__ : true, __constructs__ : ["Hyphen","Melisma"] };
nx3.ELyricContinuation.Hyphen = ["Hyphen",0];
nx3.ELyricContinuation.Hyphen.toString = $estr;
nx3.ELyricContinuation.Hyphen.__enum__ = nx3.ELyricContinuation;
nx3.ELyricContinuation.Melisma = ["Melisma",1];
nx3.ELyricContinuation.Melisma.toString = $estr;
nx3.ELyricContinuation.Melisma.__enum__ = nx3.ELyricContinuation;
nx3.EModus = { __ename__ : true, __constructs__ : ["Major","Minor"] };
nx3.EModus.Major = ["Major",0];
nx3.EModus.Major.toString = $estr;
nx3.EModus.Major.__enum__ = nx3.EModus;
nx3.EModus.Minor = ["Minor",1];
nx3.EModus.Minor.toString = $estr;
nx3.EModus.Minor.__enum__ = nx3.EModus;
nx3.ENotationVariant = { __ename__ : true, __constructs__ : ["Normal","Rythmic","RythmicSingleLevel","HeadsOnly","StavesOnly"] };
nx3.ENotationVariant.Normal = ["Normal",0];
nx3.ENotationVariant.Normal.toString = $estr;
nx3.ENotationVariant.Normal.__enum__ = nx3.ENotationVariant;
nx3.ENotationVariant.Rythmic = ["Rythmic",1];
nx3.ENotationVariant.Rythmic.toString = $estr;
nx3.ENotationVariant.Rythmic.__enum__ = nx3.ENotationVariant;
nx3.ENotationVariant.RythmicSingleLevel = function(level) { var $x = ["RythmicSingleLevel",2,level]; $x.__enum__ = nx3.ENotationVariant; $x.toString = $estr; return $x; };
nx3.ENotationVariant.HeadsOnly = ["HeadsOnly",3];
nx3.ENotationVariant.HeadsOnly.toString = $estr;
nx3.ENotationVariant.HeadsOnly.__enum__ = nx3.ENotationVariant;
nx3.ENotationVariant.StavesOnly = ["StavesOnly",4];
nx3.ENotationVariant.StavesOnly.toString = $estr;
nx3.ENotationVariant.StavesOnly.__enum__ = nx3.ENotationVariant;
nx3.ENoteArticulation = { __ename__ : true, __constructs__ : ["Staccato","Tenuto","Marcato"] };
nx3.ENoteArticulation.Staccato = ["Staccato",0];
nx3.ENoteArticulation.Staccato.toString = $estr;
nx3.ENoteArticulation.Staccato.__enum__ = nx3.ENoteArticulation;
nx3.ENoteArticulation.Tenuto = ["Tenuto",1];
nx3.ENoteArticulation.Tenuto.toString = $estr;
nx3.ENoteArticulation.Tenuto.__enum__ = nx3.ENoteArticulation;
nx3.ENoteArticulation.Marcato = ["Marcato",2];
nx3.ENoteArticulation.Marcato.toString = $estr;
nx3.ENoteArticulation.Marcato.__enum__ = nx3.ENoteArticulation;
nx3.ENoteAttributes = { __ename__ : true, __constructs__ : ["Arpeggio","Clef"] };
nx3.ENoteAttributes.Arpeggio = function(top,bottomY) { var $x = ["Arpeggio",0,top,bottomY]; $x.__enum__ = nx3.ENoteAttributes; $x.toString = $estr; return $x; };
nx3.ENoteAttributes.Clef = function(variant) { var $x = ["Clef",1,variant]; $x.__enum__ = nx3.ENoteAttributes; $x.toString = $estr; return $x; };
nx3.ENoteType = { __ename__ : true, __constructs__ : ["Note","Pause","BarPause","Tpl","Lyric","Chord","Dynamics","Pitch"] };
nx3.ENoteType.Note = function(heads,variant,articulations,attributes) { var $x = ["Note",0,heads,variant,articulations,attributes]; $x.__enum__ = nx3.ENoteType; $x.toString = $estr; return $x; };
nx3.ENoteType.Pause = function(level) { var $x = ["Pause",1,level]; $x.__enum__ = nx3.ENoteType; $x.toString = $estr; return $x; };
nx3.ENoteType.BarPause = ["BarPause",2];
nx3.ENoteType.BarPause.toString = $estr;
nx3.ENoteType.BarPause.__enum__ = nx3.ENoteType;
nx3.ENoteType.Tpl = function(level,sign,pause) { var $x = ["Tpl",3,level,sign,pause]; $x.__enum__ = nx3.ENoteType; $x.toString = $estr; return $x; };
nx3.ENoteType.Lyric = function(text,offset,continuation,font) { var $x = ["Lyric",4,text,offset,continuation,font]; $x.__enum__ = nx3.ENoteType; $x.toString = $estr; return $x; };
nx3.ENoteType.Chord = ["Chord",5];
nx3.ENoteType.Chord.toString = $estr;
nx3.ENoteType.Chord.__enum__ = nx3.ENoteType;
nx3.ENoteType.Dynamics = ["Dynamics",6];
nx3.ENoteType.Dynamics.toString = $estr;
nx3.ENoteType.Dynamics.__enum__ = nx3.ENoteType;
nx3.ENoteType.Pitch = function(level,midinote) { var $x = ["Pitch",7,level,midinote]; $x.__enum__ = nx3.ENoteType; $x.toString = $estr; return $x; };
nx3.ENoteVal = { __ename__ : true, __constructs__ : ["Nv1","Nv1dot","Nv1ddot","Nv1tri","Nv2","Nv2dot","Nv2ddot","Nv2tri","Nv4","Nv4dot","Nv4ddot","Nv4tri","Nv8","Nv8dot","Nv8ddot","Nv8tri","Nv16","Nv16dot","Nv16ddot","Nv16tri","Nv32","Nv32dot","Nv32ddot","Nv32tri"] };
nx3.ENoteVal.Nv1 = ["Nv1",0];
nx3.ENoteVal.Nv1.toString = $estr;
nx3.ENoteVal.Nv1.__enum__ = nx3.ENoteVal;
nx3.ENoteVal.Nv1dot = ["Nv1dot",1];
nx3.ENoteVal.Nv1dot.toString = $estr;
nx3.ENoteVal.Nv1dot.__enum__ = nx3.ENoteVal;
nx3.ENoteVal.Nv1ddot = ["Nv1ddot",2];
nx3.ENoteVal.Nv1ddot.toString = $estr;
nx3.ENoteVal.Nv1ddot.__enum__ = nx3.ENoteVal;
nx3.ENoteVal.Nv1tri = ["Nv1tri",3];
nx3.ENoteVal.Nv1tri.toString = $estr;
nx3.ENoteVal.Nv1tri.__enum__ = nx3.ENoteVal;
nx3.ENoteVal.Nv2 = ["Nv2",4];
nx3.ENoteVal.Nv2.toString = $estr;
nx3.ENoteVal.Nv2.__enum__ = nx3.ENoteVal;
nx3.ENoteVal.Nv2dot = ["Nv2dot",5];
nx3.ENoteVal.Nv2dot.toString = $estr;
nx3.ENoteVal.Nv2dot.__enum__ = nx3.ENoteVal;
nx3.ENoteVal.Nv2ddot = ["Nv2ddot",6];
nx3.ENoteVal.Nv2ddot.toString = $estr;
nx3.ENoteVal.Nv2ddot.__enum__ = nx3.ENoteVal;
nx3.ENoteVal.Nv2tri = ["Nv2tri",7];
nx3.ENoteVal.Nv2tri.toString = $estr;
nx3.ENoteVal.Nv2tri.__enum__ = nx3.ENoteVal;
nx3.ENoteVal.Nv4 = ["Nv4",8];
nx3.ENoteVal.Nv4.toString = $estr;
nx3.ENoteVal.Nv4.__enum__ = nx3.ENoteVal;
nx3.ENoteVal.Nv4dot = ["Nv4dot",9];
nx3.ENoteVal.Nv4dot.toString = $estr;
nx3.ENoteVal.Nv4dot.__enum__ = nx3.ENoteVal;
nx3.ENoteVal.Nv4ddot = ["Nv4ddot",10];
nx3.ENoteVal.Nv4ddot.toString = $estr;
nx3.ENoteVal.Nv4ddot.__enum__ = nx3.ENoteVal;
nx3.ENoteVal.Nv4tri = ["Nv4tri",11];
nx3.ENoteVal.Nv4tri.toString = $estr;
nx3.ENoteVal.Nv4tri.__enum__ = nx3.ENoteVal;
nx3.ENoteVal.Nv8 = ["Nv8",12];
nx3.ENoteVal.Nv8.toString = $estr;
nx3.ENoteVal.Nv8.__enum__ = nx3.ENoteVal;
nx3.ENoteVal.Nv8dot = ["Nv8dot",13];
nx3.ENoteVal.Nv8dot.toString = $estr;
nx3.ENoteVal.Nv8dot.__enum__ = nx3.ENoteVal;
nx3.ENoteVal.Nv8ddot = ["Nv8ddot",14];
nx3.ENoteVal.Nv8ddot.toString = $estr;
nx3.ENoteVal.Nv8ddot.__enum__ = nx3.ENoteVal;
nx3.ENoteVal.Nv8tri = ["Nv8tri",15];
nx3.ENoteVal.Nv8tri.toString = $estr;
nx3.ENoteVal.Nv8tri.__enum__ = nx3.ENoteVal;
nx3.ENoteVal.Nv16 = ["Nv16",16];
nx3.ENoteVal.Nv16.toString = $estr;
nx3.ENoteVal.Nv16.__enum__ = nx3.ENoteVal;
nx3.ENoteVal.Nv16dot = ["Nv16dot",17];
nx3.ENoteVal.Nv16dot.toString = $estr;
nx3.ENoteVal.Nv16dot.__enum__ = nx3.ENoteVal;
nx3.ENoteVal.Nv16ddot = ["Nv16ddot",18];
nx3.ENoteVal.Nv16ddot.toString = $estr;
nx3.ENoteVal.Nv16ddot.__enum__ = nx3.ENoteVal;
nx3.ENoteVal.Nv16tri = ["Nv16tri",19];
nx3.ENoteVal.Nv16tri.toString = $estr;
nx3.ENoteVal.Nv16tri.__enum__ = nx3.ENoteVal;
nx3.ENoteVal.Nv32 = ["Nv32",20];
nx3.ENoteVal.Nv32.toString = $estr;
nx3.ENoteVal.Nv32.__enum__ = nx3.ENoteVal;
nx3.ENoteVal.Nv32dot = ["Nv32dot",21];
nx3.ENoteVal.Nv32dot.toString = $estr;
nx3.ENoteVal.Nv32dot.__enum__ = nx3.ENoteVal;
nx3.ENoteVal.Nv32ddot = ["Nv32ddot",22];
nx3.ENoteVal.Nv32ddot.toString = $estr;
nx3.ENoteVal.Nv32ddot.__enum__ = nx3.ENoteVal;
nx3.ENoteVal.Nv32tri = ["Nv32tri",23];
nx3.ENoteVal.Nv32tri.toString = $estr;
nx3.ENoteVal.Nv32tri.__enum__ = nx3.ENoteVal;
nx3.ENoteValTools = function() { };
nx3.ENoteValTools.__name__ = true;
nx3.ENoteValTools.beaminglevel = function(val) {
	switch(val[1]) {
	case 12:
		return 1;
	case 15:
		return 1;
	case 13:
		return 1;
	case 14:
		return 1;
	case 16:
		return 2;
	case 19:
		return 2;
	case 17:
		return 2;
	case 18:
		return 2;
	case 20:
		return 3;
	case 23:
		return 3;
	case 21:
		return 3;
	case 22:
		return 3;
	default:
		return 0;
	}
};
nx3.ENoteValTools.stavinglevel = function(val) {
	switch(val[1]) {
	case 0:
		return 0;
	case 3:
		return 0;
	case 1:
		return 0;
	case 2:
		return 0;
	default:
		return 1;
	}
};
nx3.ENoteValTools.dotlevel = function(val) {
	switch(val[1]) {
	case 1:case 5:case 9:case 13:case 17:case 21:
		return 1;
	case 2:case 6:case 10:case 14:case 18:case 22:
		return 2;
	default:
		return 0;
	}
};
nx3.ENoteValTools.head = function(val) {
	switch(val[1]) {
	case 0:
		return nx3.EHeadValueType.HVT1;
	case 3:
		return nx3.EHeadValueType.HVT1;
	case 1:
		return nx3.EHeadValueType.HVT1;
	case 2:
		return nx3.EHeadValueType.HVT1;
	case 4:
		return nx3.EHeadValueType.HVT2;
	case 7:
		return nx3.EHeadValueType.HVT2;
	case 5:
		return nx3.EHeadValueType.HVT2;
	case 6:
		return nx3.EHeadValueType.HVT2;
	default:
		return nx3.EHeadValueType.HVT4;
	}
};
nx3.ENoteValTools.value = function(noteval) {
	switch(noteval[1]) {
	case 0:
		return 12096;
	case 1:
		return 18144;
	case 2:
		return 21168;
	case 3:
		return 8063;
	case 4:
		return 6048;
	case 5:
		return 9072;
	case 6:
		return 10584;
	case 7:
		return 4031;
	case 8:
		return 3024;
	case 9:
		return 4536;
	case 10:
		return 5292;
	case 11:
		return 2015;
	case 12:
		return 1512;
	case 13:
		return 2268;
	case 14:
		return 2646;
	case 15:
		return 1007;
	case 16:
		return 756;
	case 17:
		return 1134;
	case 18:
		return 1323;
	case 19:
		return 503;
	case 20:
		return 378;
	case 21:
		return 567;
	case 22:
		return 661;
	case 23:
		return 251;
	}
};
nx3.ENoteValTools.getFromValue = function(value) {
	switch(value) {
	case 12096:
		return nx3.ENoteVal.Nv1;
	case 18144:
		return nx3.ENoteVal.Nv1dot;
	case 21168:
		return nx3.ENoteVal.Nv1ddot;
	case 8063:
		return nx3.ENoteVal.Nv1tri;
	case 6048:
		return nx3.ENoteVal.Nv2;
	case 9072:
		return nx3.ENoteVal.Nv2dot;
	case 10584:
		return nx3.ENoteVal.Nv2ddot;
	case 4031:
		return nx3.ENoteVal.Nv2tri;
	case 3024:
		return nx3.ENoteVal.Nv4;
	case 4536:
		return nx3.ENoteVal.Nv4dot;
	case 5292:
		return nx3.ENoteVal.Nv4ddot;
	case 2015:
		return nx3.ENoteVal.Nv4tri;
	case 1512:
		return nx3.ENoteVal.Nv8;
	case 2268:
		return nx3.ENoteVal.Nv8dot;
	case 2646:
		return nx3.ENoteVal.Nv8ddot;
	case 1007:
		return nx3.ENoteVal.Nv8tri;
	case 756:
		return nx3.ENoteVal.Nv16;
	case 1134:
		return nx3.ENoteVal.Nv16dot;
	case 1323:
		return nx3.ENoteVal.Nv16ddot;
	case 503:
		return nx3.ENoteVal.Nv16tri;
	case 378:
		return nx3.ENoteVal.Nv32;
	case 567:
		return nx3.ENoteVal.Nv32dot;
	case 661:
		return nx3.ENoteVal.Nv32ddot;
	case 251:
		return nx3.ENoteVal.Nv32tri;
	default:
		return null;
	}
};
nx3.ENoteValTools.toValString = function(val) {
	switch(val[1]) {
	case 0:
		return "1";
	case 1:
		return "1.";
	case 2:
		return "1..";
	case 3:
		return "1-3";
	case 4:
		return "2";
	case 5:
		return "2.";
	case 6:
		return "2..";
	case 7:
		return "2-3";
	case 8:
		return "4";
	case 9:
		return "4.";
	case 10:
		return "4..";
	case 11:
		return "4-3";
	case 12:
		return "8";
	case 13:
		return "8.";
	case 14:
		return "8..";
	case 15:
		return "8-3";
	case 16:
		return "16";
	case 17:
		return "16.";
	case 18:
		return "16..";
	case 19:
		return "16-3";
	case 20:
		return "32";
	case 21:
		return "32.";
	case 22:
		return "32..";
	case 23:
		return "32-3";
	}
};
nx3.ENoteValTools.fromValString = function(valString) {
	if(valString == null) return nx3.ENoteVal.Nv4; else switch(valString) {
	case "":
		return nx3.ENoteVal.Nv4;
	case "1":
		return nx3.ENoteVal.Nv1;
	case "1.":
		return nx3.ENoteVal.Nv1dot;
	case "1..":
		return nx3.ENoteVal.Nv1ddot;
	case "1-3":
		return nx3.ENoteVal.Nv1tri;
	case "2":
		return nx3.ENoteVal.Nv2;
	case "2.":
		return nx3.ENoteVal.Nv2dot;
	case "2..":
		return nx3.ENoteVal.Nv2ddot;
	case "2-3":
		return nx3.ENoteVal.Nv2tri;
	case "4":
		return nx3.ENoteVal.Nv4;
	case "4.":
		return nx3.ENoteVal.Nv4dot;
	case "4..":
		return nx3.ENoteVal.Nv4ddot;
	case "4-3":
		return nx3.ENoteVal.Nv4tri;
	case "8":
		return nx3.ENoteVal.Nv8;
	case "8.":
		return nx3.ENoteVal.Nv8dot;
	case "8..":
		return nx3.ENoteVal.Nv8ddot;
	case "8-3":
		return nx3.ENoteVal.Nv8tri;
	case "16":
		return nx3.ENoteVal.Nv16;
	case "16.":
		return nx3.ENoteVal.Nv16dot;
	case "16..":
		return nx3.ENoteVal.Nv16ddot;
	case "16-3":
		return nx3.ENoteVal.Nv16tri;
	case "32":
		return nx3.ENoteVal.Nv32;
	case "32.":
		return nx3.ENoteVal.Nv32dot;
	case "32..":
		return nx3.ENoteVal.Nv32ddot;
	case "32-3":
		return nx3.ENoteVal.Nv32tri;
	default:
		throw "unhandled note value: " + valString;
	}
};
nx3.EOctave = { __ename__ : true, __constructs__ : ["Normal","Up","Down"] };
nx3.EOctave.Normal = ["Normal",0];
nx3.EOctave.Normal.toString = $estr;
nx3.EOctave.Normal.__enum__ = nx3.EOctave;
nx3.EOctave.Up = ["Up",1];
nx3.EOctave.Up.toString = $estr;
nx3.EOctave.Up.__enum__ = nx3.EOctave;
nx3.EOctave.Down = ["Down",2];
nx3.EOctave.Down.toString = $estr;
nx3.EOctave.Down.__enum__ = nx3.EOctave;
nx3.EPartType = { __ename__ : true, __constructs__ : ["Normal","Lyrics","Tplrow","Tplchain","Dynamics","Chords","Ignore","Hidden","PitchRow","PitchChain"] };
nx3.EPartType.Normal = ["Normal",0];
nx3.EPartType.Normal.toString = $estr;
nx3.EPartType.Normal.__enum__ = nx3.EPartType;
nx3.EPartType.Lyrics = ["Lyrics",1];
nx3.EPartType.Lyrics.toString = $estr;
nx3.EPartType.Lyrics.__enum__ = nx3.EPartType;
nx3.EPartType.Tplrow = function(modus,octave) { var $x = ["Tplrow",2,modus,octave]; $x.__enum__ = nx3.EPartType; $x.toString = $estr; return $x; };
nx3.EPartType.Tplchain = function(modus,octave) { var $x = ["Tplchain",3,modus,octave]; $x.__enum__ = nx3.EPartType; $x.toString = $estr; return $x; };
nx3.EPartType.Dynamics = ["Dynamics",4];
nx3.EPartType.Dynamics.toString = $estr;
nx3.EPartType.Dynamics.__enum__ = nx3.EPartType;
nx3.EPartType.Chords = ["Chords",5];
nx3.EPartType.Chords.toString = $estr;
nx3.EPartType.Chords.__enum__ = nx3.EPartType;
nx3.EPartType.Ignore = ["Ignore",6];
nx3.EPartType.Ignore.toString = $estr;
nx3.EPartType.Ignore.__enum__ = nx3.EPartType;
nx3.EPartType.Hidden = ["Hidden",7];
nx3.EPartType.Hidden.toString = $estr;
nx3.EPartType.Hidden.__enum__ = nx3.EPartType;
nx3.EPartType.PitchRow = ["PitchRow",8];
nx3.EPartType.PitchRow.toString = $estr;
nx3.EPartType.PitchRow.__enum__ = nx3.EPartType;
nx3.EPartType.PitchChain = function(leveloffset) { var $x = ["PitchChain",9,leveloffset]; $x.__enum__ = nx3.EPartType; $x.toString = $estr; return $x; };
nx3.EPosition = { __ename__ : true, __constructs__ : ["X","Y","XY","XYW"] };
nx3.EPosition.X = function(x) { var $x = ["X",0,x]; $x.__enum__ = nx3.EPosition; $x.toString = $estr; return $x; };
nx3.EPosition.Y = function(y) { var $x = ["Y",1,y]; $x.__enum__ = nx3.EPosition; $x.toString = $estr; return $x; };
nx3.EPosition.XY = function(x,y) { var $x = ["XY",2,x,y]; $x.__enum__ = nx3.EPosition; $x.toString = $estr; return $x; };
nx3.EPosition.XYW = function(x,y,w) { var $x = ["XYW",3,x,y,w]; $x.__enum__ = nx3.EPosition; $x.toString = $estr; return $x; };
nx3.ESign = { __ename__ : true, __constructs__ : ["None","Natural","Flat","Sharp","DoubleFlat","DoubleSharp","ParNatural","ParFlat","ParSharp"] };
nx3.ESign.None = ["None",0];
nx3.ESign.None.toString = $estr;
nx3.ESign.None.__enum__ = nx3.ESign;
nx3.ESign.Natural = ["Natural",1];
nx3.ESign.Natural.toString = $estr;
nx3.ESign.Natural.__enum__ = nx3.ESign;
nx3.ESign.Flat = ["Flat",2];
nx3.ESign.Flat.toString = $estr;
nx3.ESign.Flat.__enum__ = nx3.ESign;
nx3.ESign.Sharp = ["Sharp",3];
nx3.ESign.Sharp.toString = $estr;
nx3.ESign.Sharp.__enum__ = nx3.ESign;
nx3.ESign.DoubleFlat = ["DoubleFlat",4];
nx3.ESign.DoubleFlat.toString = $estr;
nx3.ESign.DoubleFlat.__enum__ = nx3.ESign;
nx3.ESign.DoubleSharp = ["DoubleSharp",5];
nx3.ESign.DoubleSharp.toString = $estr;
nx3.ESign.DoubleSharp.__enum__ = nx3.ESign;
nx3.ESign.ParNatural = ["ParNatural",6];
nx3.ESign.ParNatural.toString = $estr;
nx3.ESign.ParNatural.__enum__ = nx3.ESign;
nx3.ESign.ParFlat = ["ParFlat",7];
nx3.ESign.ParFlat.toString = $estr;
nx3.ESign.ParFlat.__enum__ = nx3.ESign;
nx3.ESign.ParSharp = ["ParSharp",8];
nx3.ESign.ParSharp.toString = $estr;
nx3.ESign.ParSharp.__enum__ = nx3.ESign;
nx3.ETie = { __ename__ : true, __constructs__ : ["Tie","Gliss"] };
nx3.ETie.Tie = function(direction,level) { var $x = ["Tie",0,direction,level]; $x.__enum__ = nx3.ETie; $x.toString = $estr; return $x; };
nx3.ETie.Gliss = function(direction,levelLeft,levelRight) { var $x = ["Gliss",1,direction,levelLeft,levelRight]; $x.__enum__ = nx3.ETie; $x.toString = $estr; return $x; };
nx3.ETime = { __ename__ : true, __constructs__ : ["Time2_2","Time3_2","Time4_2","Time2_4","Time3_4","Time4_4","Time5_4","Time6_4","Time7_4","Time2_8","Time3_8","Time4_8","Time5_8","Time6_8","Time7_8","Time9_8","Time12_8","TimeCommon","TimeAllabreve"] };
nx3.ETime.Time2_2 = ["Time2_2",0];
nx3.ETime.Time2_2.toString = $estr;
nx3.ETime.Time2_2.__enum__ = nx3.ETime;
nx3.ETime.Time3_2 = ["Time3_2",1];
nx3.ETime.Time3_2.toString = $estr;
nx3.ETime.Time3_2.__enum__ = nx3.ETime;
nx3.ETime.Time4_2 = ["Time4_2",2];
nx3.ETime.Time4_2.toString = $estr;
nx3.ETime.Time4_2.__enum__ = nx3.ETime;
nx3.ETime.Time2_4 = ["Time2_4",3];
nx3.ETime.Time2_4.toString = $estr;
nx3.ETime.Time2_4.__enum__ = nx3.ETime;
nx3.ETime.Time3_4 = ["Time3_4",4];
nx3.ETime.Time3_4.toString = $estr;
nx3.ETime.Time3_4.__enum__ = nx3.ETime;
nx3.ETime.Time4_4 = ["Time4_4",5];
nx3.ETime.Time4_4.toString = $estr;
nx3.ETime.Time4_4.__enum__ = nx3.ETime;
nx3.ETime.Time5_4 = ["Time5_4",6];
nx3.ETime.Time5_4.toString = $estr;
nx3.ETime.Time5_4.__enum__ = nx3.ETime;
nx3.ETime.Time6_4 = ["Time6_4",7];
nx3.ETime.Time6_4.toString = $estr;
nx3.ETime.Time6_4.__enum__ = nx3.ETime;
nx3.ETime.Time7_4 = ["Time7_4",8];
nx3.ETime.Time7_4.toString = $estr;
nx3.ETime.Time7_4.__enum__ = nx3.ETime;
nx3.ETime.Time2_8 = ["Time2_8",9];
nx3.ETime.Time2_8.toString = $estr;
nx3.ETime.Time2_8.__enum__ = nx3.ETime;
nx3.ETime.Time3_8 = ["Time3_8",10];
nx3.ETime.Time3_8.toString = $estr;
nx3.ETime.Time3_8.__enum__ = nx3.ETime;
nx3.ETime.Time4_8 = ["Time4_8",11];
nx3.ETime.Time4_8.toString = $estr;
nx3.ETime.Time4_8.__enum__ = nx3.ETime;
nx3.ETime.Time5_8 = ["Time5_8",12];
nx3.ETime.Time5_8.toString = $estr;
nx3.ETime.Time5_8.__enum__ = nx3.ETime;
nx3.ETime.Time6_8 = ["Time6_8",13];
nx3.ETime.Time6_8.toString = $estr;
nx3.ETime.Time6_8.__enum__ = nx3.ETime;
nx3.ETime.Time7_8 = ["Time7_8",14];
nx3.ETime.Time7_8.toString = $estr;
nx3.ETime.Time7_8.__enum__ = nx3.ETime;
nx3.ETime.Time9_8 = ["Time9_8",15];
nx3.ETime.Time9_8.toString = $estr;
nx3.ETime.Time9_8.__enum__ = nx3.ETime;
nx3.ETime.Time12_8 = ["Time12_8",16];
nx3.ETime.Time12_8.toString = $estr;
nx3.ETime.Time12_8.__enum__ = nx3.ETime;
nx3.ETime.TimeCommon = ["TimeCommon",17];
nx3.ETime.TimeCommon.toString = $estr;
nx3.ETime.TimeCommon.__enum__ = nx3.ETime;
nx3.ETime.TimeAllabreve = ["TimeAllabreve",18];
nx3.ETime.TimeAllabreve.toString = $estr;
nx3.ETime.TimeAllabreve.__enum__ = nx3.ETime;
nx3.ETimeUtils = function() { };
nx3.ETimeUtils.__name__ = true;
nx3.ETimeUtils.toString = function(time) {
	if(time == null) return "";
	switch(time[1]) {
	case 0:
		return "2/2";
	case 1:
		return "3/2";
	case 2:
		return "4/2";
	case 8:
		return "7/4";
	case 7:
		return "6/4";
	case 6:
		return "5/4";
	case 5:
		return "4/4";
	case 4:
		return "3/4";
	case 3:
		return "2/4";
	case 9:
		return "2/8";
	case 10:
		return "3/8";
	case 11:
		return "4/8";
	case 12:
		return "5/8";
	case 13:
		return "6/8";
	case 14:
		return "7/8";
	case 15:
		return "9/8";
	case 16:
		return "12/8";
	case 17:
		return "C";
	case 18:
		return "AllaBreve";
	}
	return "time-unknown";
};
nx3.ETimeUtils.fromString = function(str) {
	if(str == null) return null;
	switch(str) {
	case "4/2":
		return nx3.ETime.Time4_2;
	case "3/2":
		return nx3.ETime.Time3_2;
	case "224":
		return nx3.ETime.Time2_2;
	case "7/4":
		return nx3.ETime.Time7_4;
	case "6/4":
		return nx3.ETime.Time6_4;
	case "5/4":
		return nx3.ETime.Time5_4;
	case "4/4":
		return nx3.ETime.Time4_4;
	case "3/4":
		return nx3.ETime.Time3_4;
	case "2/4":
		return nx3.ETime.Time2_4;
	case "2/8":
		return nx3.ETime.Time2_8;
	case "3/8":
		return nx3.ETime.Time3_8;
	case "4/8":
		return nx3.ETime.Time4_8;
	case "5/8":
		return nx3.ETime.Time5_8;
	case "6/8":
		return nx3.ETime.Time6_8;
	case "7/8":
		return nx3.ETime.Time7_8;
	case "9/8":
		return nx3.ETime.Time9_8;
	case "12/8":
		return nx3.ETime.Time12_8;
	case "C":
		return nx3.ETime.TimeCommon;
	case "AllaBreve":
		return nx3.ETime.TimeAllabreve;
	default:
		return null;
	}
	return null;
};
nx3.EVoiceType = { __ename__ : true, __constructs__ : ["Normal","Barpause"] };
nx3.EVoiceType.Normal = ["Normal",0];
nx3.EVoiceType.Normal.toString = $estr;
nx3.EVoiceType.Normal.__enum__ = nx3.EVoiceType;
nx3.EVoiceType.Barpause = function(level) { var $x = ["Barpause",1,level]; $x.__enum__ = nx3.EVoiceType; $x.toString = $estr; return $x; };
nx3.IBarWidthCalculator = function() { };
nx3.IBarWidthCalculator.__name__ = true;
nx3.IBarWidthCalculator.prototype = {
	__class__: nx3.IBarWidthCalculator
};
nx3.NBar = function(parts,type,time,timeDisplay,allotment,spacing) {
	if(spacing == null) spacing = 0;
	this.nparts = parts;
	var _g = 0;
	while(_g < parts.length) {
		var part = parts[_g];
		++_g;
		part.nbar = this;
	}
	if(type == null) this.type = nx3.EBarType.Normal; else this.type = type;
	this.time = time;
	if(timeDisplay == null) this.timeDisplay = nx3.EDisplayALN.Layout; else this.timeDisplay = timeDisplay;
	if(allotment == null) this.allotment = nx3.EAllotment.Logaritmic; else this.allotment = allotment;
	if(spacing != 0) this.spacing = spacing; else this.spacing = 8;
};
nx3.NBar.__name__ = true;
nx3.NBar.prototype = {
	getNNote: function(partIdx,voiceIdx,noteIdx) {
		return this.getNPart(partIdx).getNVoice(voiceIdx).getNNote(noteIdx);
	}
	,getNPart: function(idx) {
		if(idx < 0 || idx > this.nparts.length) return null; else return this.nparts[idx];
	}
	,iterator: function() {
		return HxOverrides.iter(this.nparts);
	}
	,get_length: function() {
		return this.nparts.length;
	}
	,getTag: function() {
		var partstags = "";
		Lambda.iter(this.nparts,function(npart) {
			partstags += npart.getTag();
		});
		var time = nx3.NTags.timeTag(this.time) + nx3.NTags.displayALNTag(this.timeDisplay);
		var spacing;
		if(this.spacing != 8) spacing = "sp:" + this.spacing; else spacing = "";
		var type = nx3.NTags.nbarTypeTag(this.type);
		var allot = nx3.NTags.nbarAllotmentTag(this.allotment);
		return "/" + type + partstags + time + allot + spacing;
	}
	,__class__: nx3.NBar
};
nx3.NBarUtils = function() { };
nx3.NBarUtils.__name__ = true;
nx3.NBarUtils.getValue = function(bar) {
	var barvalue = 0;
	var $it0 = bar.iterator();
	while( $it0.hasNext() ) {
		var part = $it0.next();
		var $it1 = part.iterator();
		while( $it1.hasNext() ) {
			var voice = $it1.next();
			var voicevalue = 0;
			var $it2 = voice.iterator();
			while( $it2.hasNext() ) {
				var note = $it2.next();
				voicevalue += nx3.ENoteValTools.value(note.value);
			}
			barvalue = Std["int"](Math.max(barvalue,voicevalue));
		}
	}
	return barvalue;
};
nx3.NHead = function(type,level,sign,tie,tieTo) {
	if(level == null) level = 0;
	if(type != null) this.type = type; else this.type = nx3.EHeadType.Normal;
	if(sign != null) this.sign = sign; else this.sign = nx3.ESign.None;
	if(tie != null) this.tie = tie; else this.tie = null;
	if(tieTo != null) this.tieTo = tieTo; else this.tieTo = null;
	this.level = level;
};
nx3.NHead.__name__ = true;
nx3.NHead.prototype = {
	toString: function() {
		var str = "" + this.level;
		if(this.type != nx3.EHeadType.Normal) str += " " + this.type[0]; else str += "";
		if(this.sign != nx3.ESign.None) str += " " + this.sign[0]; else str += "";
		return "NHead(" + str + ")";
	}
	,getTag: function() {
		var level = Std.string(this.level);
		var tie;
		if(this.tie != null) tie = "_"; else tie = "";
		var sign = nx3.NTags.headSignTag(this.sign);
		var type = nx3.NTags.headTypetag(this.type);
		return "&" + type + level + sign + tie;
	}
	,__class__: nx3.NHead
};
nx3.NNote = function(type,heads,value,direction) {
	if(type == null) if(heads != null) type = nx3.ENoteType.Note(heads); else type = nx3.ENoteType.Note([new nx3.NHead()]);
	if(heads != null) {
		var _g = 0;
		while(_g < heads.length) {
			var head = heads[_g];
			++_g;
			head.nnote = this;
		}
	}
	if(type == null) this.type = nx3.ENoteType.Note(heads); else this.type = type;
	if(value == null) this.value = nx3.ENoteVal.Nv4; else this.value = value;
	if(direction == null) this.direction = nx3.EDirectionUAD.Auto; else this.direction = direction;
};
nx3.NNote.__name__ = true;
nx3.NNote.__interfaces__ = [hxlazy.Lazy];
nx3.NNote.prototype = {
	iterator: function() {
		var _this = this.get_nheads();
		return HxOverrides.iter(_this);
	}
	,get_length: function() {
		return this.get_nheads().length;
	}
	,get_nheads: function() {
		if(this.nheads_ != null) return this.nheads_;
		{
			var _g = this.type;
			switch(_g[1]) {
			case 0:
				var attributes = _g[5];
				var articulations = _g[4];
				var variant = _g[3];
				var nheads = _g[2];
				nheads.sort(function(a,b) {
					return Reflect.compare(a.level,b.level);
				});
				this.nheads_ = nheads;
				break;
			case 1:
				var level = _g[2];
				this.nheads_ = [new nx3.NHead(nx3.EHeadType.Pause,level)];
				break;
			default:
				this.nheads_ = [new nx3.NHead(nx3.EHeadType.Other,0)];
			}
		}
		return this.nheads_;
	}
	,getNHead: function(idx) {
		if(idx < 0 || idx > this.get_nheads().length) return null; else return this.get_nheads()[idx];
	}
	,toString: function() {
		var str = "";
		if(this.type[0] != "Note") str += " " + this.type[0]; else str += "";
		var heads = "";
		var _g = 0;
		var _g1 = this.get_nheads();
		while(_g < _g1.length) {
			var head = _g1[_g];
			++_g;
			heads += head.toString();
		}
		return "NNote(" + str + "):" + heads;
	}
	,getTag: function() {
		var headstags = "";
		Lambda.iter(this,function(nhead) {
			headstags += nhead.getTag();
		});
		var type = nx3.NTags.noteTypeTag(this.type);
		var val = nx3.ENoteValTools.toValString(this.value);
		return "%l" + type + headstags + val;
	}
	,get_headLevels: function() {
		if(this.__lazyheadLevels != null) return this.__lazyheadLevels;
		return this.__lazyheadLevels = Lambda.array(Lambda.map(this,function(head) {
			return head.level;
		}));
	}
	,get_topLevel: function() {
		if(this.__lazytopLevel != null) return this.__lazytopLevel;
		return this.__lazytopLevel = this.get_nheads()[0].level;
	}
	,get_bottomLevel: function() {
		if(this.__lazybottomLevel != null) return this.__lazybottomLevel;
		return this.__lazybottomLevel = this.get_nheads()[this.get_nheads().length - 1].level;
	}
	,get_ties: function() {
		if(this.__lazyties != null) return this.__lazyties;
		return this.__lazyties = Lambda.array(Lambda.filter(this,function(head) {
			return head.tie != null;
		}).map(function(head1) {
			return head1.tie;
		}));
	}
	,__class__: nx3.NNote
};
nx3.NPart = function(voices,type,clef,clefDisplay,key,keyDisplay,sound) {
	if(sound == null) sound = "";
	this.nvoices = voices;
	var _g = 0;
	while(_g < voices.length) {
		var voice = voices[_g];
		++_g;
		voice.npart = this;
	}
	if(this.nvoices.length > 2) throw "For now, NPart can't have more than two voices";
	if(type == null) this.type = nx3.EPartType.Normal; else this.type = type;
	this.clef = clef;
	if(clefDisplay == null) this.clefDisplay = nx3.EDisplayALN.Layout; else this.clefDisplay = clefDisplay;
	this.key = key;
	if(keyDisplay == null) this.keyDisplay = nx3.EDisplayALN.Layout; else this.keyDisplay = keyDisplay;
	this.sound = sound;
};
nx3.NPart.__name__ = true;
nx3.NPart.prototype = {
	iterator: function() {
		return HxOverrides.iter(this.nvoices);
	}
	,get_length: function() {
		return this.nvoices.length;
	}
	,getNVoice: function(idx) {
		if(idx < 0 || idx > this.nvoices.length) return null; else return this.nvoices[idx];
	}
	,getTag: function() {
		var voicestags = "";
		Lambda.iter(this,function(nvoice) {
			voicestags += nvoice.getTag();
		});
		var clef = nx3.NTags.clefTag(this.clef) + nx3.NTags.displayALNTag(this.clefDisplay);
		var key = nx3.NTags.keyTag(this.key) + nx3.NTags.displayALNTag(this.keyDisplay);
		var type = nx3.NTags.npartTypeTag(this.type);
		return "!" + type + voicestags + clef + key;
	}
	,__class__: nx3.NPart
};
nx3.NScore = function(nbars) {
	this.nbars = nbars;
	var _g = 0;
	while(_g < nbars.length) {
		var bar = nbars[_g];
		++_g;
		bar.nscore = this;
	}
	this.configuration = { };
	this.configuration.test = 123;
	this.configuration.rtempo = 80;
	this.configuration.rlength = 3;
	this.configuration.rcountin = 2;
	this.uuid = thx.core.UUID.create();
};
nx3.NScore.__name__ = true;
nx3.NScore.prototype = {
	getNBar: function(idx) {
		if(idx < 0 || idx > this.nbars.length) return null; else return this.nbars[idx];
	}
	,iterator: function() {
		return HxOverrides.iter(this.nbars);
	}
	,get_length: function() {
		return this.nbars.length;
	}
	,getTag: function() {
		var bartags = "";
		Lambda.iter(this.nbars,function(nbar) {
			bartags += nbar.getTag();
		});
		return "#" + bartags;
	}
	,__class__: nx3.NScore
};
nx3.NTags = function() {
};
nx3.NTags.__name__ = true;
nx3.NTags.nbarAllotmentTag = function(allotment) {
	if(allotment == null) return "";
	switch(allotment[1]) {
	case 1:
		return "aEQ";
	case 0:
		return "aLA";
	case 3:
		return "aLN";
	case 2:
		return "";
	}
};
nx3.NTags.nbarTypeTag = function(type) {
	if(type == null) return "";
	switch(type[1]) {
	case 3:
		return "bFO";
	case 2:
		return "bIG";
	case 1:
		return "bRP";
	default:
		return "";
	}
};
nx3.NTags.timeTag = function(time) {
	if(time == null) return "";
	return nx3.ETimeUtils.toString(time);
};
nx3.NTags.npartTypeTag = function(type) {
	if(type == null) return "";
	switch(type[1]) {
	case 5:
		return "pCH";
	case 4:
		return "pDY";
	case 7:
		return "pHI";
	case 6:
		return "pIG";
	case 1:
		return "pLY";
	case 8:
		return "pPR";
	case 3:
		return "pTC";
	case 2:
		return "pTR";
	default:
		return "";
	}
};
nx3.NTags.keyTag = function(key) {
	if(key == null) return "";
	return Std.string(nx3.EKeysTools.getKeyNr(key));
};
nx3.NTags.clefTag = function(clef) {
	if(clef == null) return "";
	switch(clef[1]) {
	case 2:
		return "C";
	case 1:
		return "F";
	case 0:
		return "G";
	}
};
nx3.NTags.displayALNTag = function(display) {
	if(display == null) return "";
	switch(display[1]) {
	case 0:
		return "dA";
	case 2:
		return "dN";
	default:
		return "";
	}
};
nx3.NTags.nvoiceTypeTag = function(type) {
	if(type == null) return "";
	switch(type[1]) {
	case 1:
		return "vBP";
	default:
		return "";
	}
};
nx3.NTags.directionUADTag = function(dir) {
	if(dir == null) return "";
	switch(dir[1]) {
	case 0:
		return "U";
	case 2:
		return "D";
	default:
		return "";
	}
};
nx3.NTags.noteTypeTag = function(type) {
	if(type == null) return "";
	switch(type[1]) {
	case 2:
		return "tB";
	case 5:
		return "tC";
	case 6:
		return "tD";
	case 4:
		var f = type[5];
		var c = type[4];
		var offset = type[3];
		var text = type[2];
		return "tL" + text + ":" + Std.string(offset);
	case 1:
		var level = type[2];
		return "tP" + level;
	case 7:
		var midinoter = type[3];
		var level1 = type[2];
		return "tI" + level1 + ":midinote";
	case 3:
		var pause = type[4];
		var sign = type[3];
		var level2 = type[2];
		return "tT" + level2 + ":" + Std.string(sign) + ":" + (pause == null?"null":"" + pause);
	default:
		return "";
	}
};
nx3.NTags.headSignTag = function(sign) {
	if(sign == null) return "";
	switch(sign[1]) {
	case 4:
		return "bb";
	case 2:
		return "b";
	case 3:
		return "#";
	case 5:
		return "##";
	case 1:
		return "N";
	default:
		return "";
	}
};
nx3.NTags.headTypetag = function(type) {
	if(type == null) return "";
	switch(type[1]) {
	case 2:
		return "tC";
	case 1:
		return "tR";
	case 3:
		return "tP";
	case 4:
		return "tO";
	default:
		return "";
	}
};
nx3.NTags.prototype = {
	__class__: nx3.NTags
};
nx3.NVoice = function(notes,type,direction) {
	if(notes == null || notes.length == 0) {
		this.nnotes = [];
		this.type = nx3.EVoiceType.Barpause(0);
	} else {
		this.nnotes = notes;
		if(type != null) this.type = type; else this.type = nx3.EVoiceType.Normal;
	}
	var _g = 0;
	while(_g < notes.length) {
		var note = notes[_g];
		++_g;
		note.nvoice = this;
	}
	if(direction != null) this.direction = direction; else this.direction = nx3.EDirectionUAD.Auto;
};
nx3.NVoice.__name__ = true;
nx3.NVoice.prototype = {
	iterator: function() {
		return HxOverrides.iter(this.nnotes);
	}
	,get_length: function() {
		return this.nnotes.length;
	}
	,getNNote: function(idx) {
		if(idx < 0 || idx > this.nnotes.length) return null; else return this.nnotes[idx];
	}
	,getTag: function() {
		var dir = nx3.NTags.directionUADTag(this.direction);
		var type = nx3.NTags.nvoiceTypeTag(this.type);
		var notestags = "";
		Lambda.iter(this,function(nnote) {
			notestags += nnote.getTag();
		});
		return "@" + type + notestags + dir;
	}
	,__class__: nx3.NVoice
};
nx3.PAttributesRectsCalculator = function() { };
nx3.PAttributesRectsCalculator.__name__ = true;
nx3.PAttributesRectsCalculator.getClefRect = function(clef) {
	switch(clef[1]) {
	case 2:
		return new nx3.geom.Rectangle(0,-3,9,6);
	case 1:
		return new nx3.geom.Rectangle(0,-4,9,8);
	case 0:
		return new nx3.geom.Rectangle(0,-5,9,10);
	}
};
nx3.PAttributesRectsCalculator.getKeyRect = function(key) {
	switch(key[1]) {
	case 6:
		return new nx3.geom.Rectangle(0,-3,1,6);
	case 7:case 5:
		return new nx3.geom.Rectangle(0,-3,4.4,6);
	case 8:case 4:
		return new nx3.geom.Rectangle(0,-3,6.8,6);
	case 9:case 3:
		return new nx3.geom.Rectangle(0,-3,9.2,6);
	case 10:case 2:
		return new nx3.geom.Rectangle(0,-3,11.6,6);
	case 11:case 1:
		return new nx3.geom.Rectangle(0,-3,14.,6);
	default:
		return new nx3.geom.Rectangle(0,-2,.5,4);
	}
};
nx3.PAttributesRectsCalculator.getTimeRect = function(time) {
	if(time == null) return new nx3.geom.Rectangle(0,-3,.5,3);
	switch(time[1]) {
	case 16:
		return new nx3.geom.Rectangle(0,-3,6,6);
	default:
		return new nx3.geom.Rectangle(0,-3,4,3);
	}
};
nx3.PBamegroupFrameTipCalculator = function(notelevels,direction) {
	if(direction == nx3.EDirectionUD.Down) {
		var invertedLevels = new Array();
		var _g = 0;
		while(_g < notelevels.length) {
			var level = notelevels[_g];
			++_g;
			invertedLevels.push(level * -1);
		}
		notelevels = invertedLevels;
	}
	this.notelevels = notelevels;
	this.direction = direction;
};
nx3.PBamegroupFrameTipCalculator.__name__ = true;
nx3.PBamegroupFrameTipCalculator.floatMin = function(levels) {
	var result = levels[0];
	if(levels.length == 1) return result;
	var _g = 0;
	while(_g < levels.length) {
		var level = levels[_g];
		++_g;
		result = Math.min(result,level);
	}
	return result;
};
nx3.PBamegroupFrameTipCalculator.intMin = function(levels) {
	var result = levels[0];
	if(levels.length == 1) return result;
	var _g = 0;
	while(_g < levels.length) {
		var level = levels[_g];
		++_g;
		result = Std["int"](Math.min(result,level));
	}
	return result;
};
nx3.PBamegroupFrameTipCalculator.intMax = function(levels) {
	var result = levels[0];
	if(levels.length == 1) return result;
	var _g = 0;
	while(_g < levels.length) {
		var level = levels[_g];
		++_g;
		result = Std["int"](Math.max(result,level));
	}
	return result;
};
nx3.PBamegroupFrameTipCalculator.prototype = {
	getTips: function() {
		var stemLength = 7;
		var min = nx3.PBamegroupFrameTipCalculator.intMin(this.notelevels);
		var leftTip = this.notelevels[0];
		var rightTip = cx.ArrayTools.last(this.notelevels);
		if(this.notelevels.length == 2) {
			var slopevalue = 1;
			leftTip = nx3.PBamegroupFrameTipCalculator.floatMin([leftTip,rightTip + slopevalue,stemLength]);
			rightTip = nx3.PBamegroupFrameTipCalculator.floatMin([rightTip,leftTip + slopevalue,stemLength]);
		} else {
			var slopevalue1 = this.notelevels.length * .25;
			var inlevels = this.notelevels.slice();
			inlevels.shift();
			inlevels.pop();
			var inmin = nx3.PBamegroupFrameTipCalculator.intMin(inlevels);
			if(inlevels.length == 0) inmin = null;
			if(inmin != null && leftTip >= inmin && rightTip >= inmin) {
				leftTip = inmin;
				rightTip = inmin;
			} else if(rightTip < leftTip && min < leftTip) leftTip = nx3.PBamegroupFrameTipCalculator.floatMin([min + slopevalue1,leftTip]); else if(leftTip < rightTip && min < rightTip) rightTip = nx3.PBamegroupFrameTipCalculator.floatMin([min + slopevalue1,rightTip]);
		}
		leftTip = Std["int"](Math.min(stemLength,leftTip));
		rightTip = Std["int"](Math.min(stemLength,rightTip));
		if(this.direction == nx3.EDirectionUD.Down) return { leftTip : -leftTip, rightTip : -rightTip};
		return { leftTip : leftTip, rightTip : rightTip};
	}
	,__class__: nx3.PBamegroupFrameTipCalculator
};
nx3.PBar = function(nbar) {
	this.stretchwidth = 0;
	this._keys = null;
	this._clefs = null;
	this.nbar = nbar;
	this.value = 0;
};
nx3.PBar.__name__ = true;
nx3.PBar.prototype = {
	iterator: function() {
		var _this = this.getParts();
		return HxOverrides.iter(_this);
	}
	,get_length: function() {
		return this.getParts().length;
	}
	,getScore: function() {
		return this.score;
	}
	,getSystembar: function() {
		return this.systembar;
	}
	,get_clefs: function() {
		if(this._clefs != null) return this._clefs;
		this._clefs = new Array();
		var _g = 0;
		var _g1 = this.getParts();
		while(_g < _g1.length) {
			var vpart = _g1[_g];
			++_g;
			this._clefs.push(vpart.npart.clef);
		}
		return this._clefs;
	}
	,get_keys: function() {
		if(this._keys != null) return this._keys;
		this._keys = new Array();
		var _g = 0;
		var _g1 = this.getParts();
		while(_g < _g1.length) {
			var vpart = _g1[_g];
			++_g;
			this._keys.push(vpart.npart.key);
		}
		return this._keys;
	}
	,get_time: function() {
		return this.nbar.time;
	}
	,get_displayClefs: function() {
		var result = nx3.EDisplayALN.Never;
		var _g = 0;
		var _g1 = this.getParts();
		while(_g < _g1.length) {
			var vpart = _g1[_g];
			++_g;
			if(vpart.npart.clefDisplay == null) result = nx3.EDisplayALN.Layout;
			if(vpart.npart.clefDisplay == nx3.EDisplayALN.Layout) result = nx3.EDisplayALN.Layout;
			if(vpart.npart.clefDisplay == nx3.EDisplayALN.Always) {
				result = nx3.EDisplayALN.Always;
				break;
			}
		}
		return result;
	}
	,get_displayKeys: function() {
		var result = nx3.EDisplayALN.Never;
		var _g = 0;
		var _g1 = this.getParts();
		while(_g < _g1.length) {
			var vpart = _g1[_g];
			++_g;
			if(vpart.npart.keyDisplay == null) result = nx3.EDisplayALN.Layout;
			if(vpart.npart.keyDisplay == nx3.EDisplayALN.Layout) result = nx3.EDisplayALN.Layout;
			if(vpart.npart.keyDisplay == nx3.EDisplayALN.Always) {
				result = nx3.EDisplayALN.Always;
				break;
			}
		}
		return result;
	}
	,get_displayTime: function() {
		var result;
		if(this.nbar.timeDisplay != null) result = this.nbar.timeDisplay; else result = nx3.EDisplayALN.Layout;
		return this.nbar.timeDisplay;
	}
	,getParts: function() {
		if(this.parts != null) return this.parts;
		this.parts = [];
		var _g = 0;
		var _g1 = this.nbar.nparts;
		while(_g < _g1.length) {
			var npart = _g1[_g];
			++_g;
			var ppart = new nx3.PPart(npart);
			ppart.bar = this;
			this.parts.push(ppart);
		}
		return this.parts;
	}
	,getPart: function(idx) {
		if(idx < 0 || idx > this.getParts().length) return null; else return this.getParts()[idx];
	}
	,getColumns: function() {
		if(this.columns != null) return this.columns;
		var generator = new nx3.PColumnsGenerator(this);
		this.columns = generator.getColumns();
		this.calculateMDistances();
		return this.columns;
	}
	,getIndex: function() {
		var _this = this.getScore().getBars();
		return HxOverrides.indexOf(_this,this,0);
	}
	,calculateMDistances: function() {
		if(this.columns == null) this.getColumns();
		new nx3.PColumnsDistancesCalculator(this).calculate();
	}
	,calculateAPositions: function() {
		new nx3.PColumnsAllotmentCalculator(this).calculate();
	}
	,getValue: function() {
		if(this.value != 0) return this.value;
		var _g = 0;
		var _g1 = this.getParts();
		while(_g < _g1.length) {
			var part = _g1[_g];
			++_g;
			this.value = Std["int"](Math.max(this.value,part.getValue()));
		}
		return this.value;
	}
	,getContentwidth: function() {
		if(this.contentwidth != null) return this.contentwidth;
		var lastcolumn = cx.ArrayTools.last(this.getColumns());
		this.contentwidth = lastcolumn.getAPostion() + Math.max(lastcolumn.getADistance(),lastcolumn.getRightX());
		return this.contentwidth;
	}
	,getContentXZero: function() {
		var firstcolumn = cx.ArrayTools.first(this.getColumns());
		this.contentx = -firstcolumn.getLeftX();
		return this.contentx;
	}
	,getAllottedDistanceSum: function() {
		if(this.allottedDistanceSum != null) return this.allottedDistanceSum;
		this.getContentwidth();
		return this.allottedDistanceSum;
	}
	,getStretchWidth: function() {
		return this.stretchwidth;
	}
	,getTieConnections: function() {
		if(this.tieconnections != null) return this.tieconnections;
		this.tieconnections = [];
		var nextBar = cx.ArrayTools.indexOrNull(this.score.getBars(),this.getIndex() + 1);
		if(nextBar == null) return this.tieconnections;
		var _g = 0;
		var _g1 = this.getParts();
		while(_g < _g1.length) {
			var part = _g1[_g];
			++_g;
			var nextPart = cx.ArrayTools.indexOrNull(nextBar.getParts(),part.getIndex());
			var _g2 = 0;
			var _g3 = part.getVoices();
			while(_g2 < _g3.length) {
				var voice = _g3[_g2];
				++_g2;
				var lastnote = cx.ArrayTools.last(voice.getNotes());
				if(!lastnote.getHasTie()) continue;
				var _g4 = 0;
				var _g5 = lastnote.nnote.get_nheads();
				while(_g4 < _g5.length) {
					var nhead = _g5[_g4];
					++_g4;
					if(nhead.tie != null) {
						var level = nhead.level;
						var nextPart1 = cx.ArrayTools.indexOrNull(nextBar.getParts(),part.getIndex());
						if(nextPart1 == null) break;
						var _g6 = 0;
						var _g7 = nextPart1.getVoices();
						while(_g6 < _g7.length) {
							var voice1 = _g7[_g6];
							++_g6;
							var nextnote = cx.ArrayTools.first(voice1.getNotes());
							var _g8 = 0;
							var _g9 = nextnote.nnote.get_nheads();
							while(_g8 < _g9.length) {
								var nnhead = _g9[_g8];
								++_g8;
								if(nnhead.level == nhead.level) {
									this.tieconnections.push({ from : lastnote, to : nextnote, level : nhead.level, tie : nhead.tie});
									break;
								}
							}
						}
					}
				}
			}
		}
		return this.tieconnections;
	}
	,__class__: nx3.PBar
};
nx3.PBarConfig = function(showClef,showKey,showTime,showCautClef,showCautKey,showCautTime) {
	if(showCautTime == null) showCautTime = false;
	if(showCautKey == null) showCautKey = false;
	if(showCautClef == null) showCautClef = false;
	if(showTime == null) showTime = false;
	if(showKey == null) showKey = false;
	if(showClef == null) showClef = false;
	this.showClef = showClef;
	this.showKey = showKey;
	this.showTime = showTime;
	this.showCautClef = showCautClef;
	this.showCautKey = showCautKey;
	this.showCautTime = showCautTime;
};
nx3.PBarConfig.__name__ = true;
nx3.PBarConfig.prototype = {
	__class__: nx3.PBarConfig
};
nx3.PBarStretchCalculator = function(systembar) {
	this.systembar = systembar;
};
nx3.PBarStretchCalculator.__name__ = true;
nx3.PBarStretchCalculator.prototype = {
	stretch: function(amount) {
		this.systembar.getBarMeasurements().setContentWidth(this.systembar.getBarMeasurements().getContentWidth() + amount);
		if(this.systembar.bar.getColumns().length < 2) return;
		var columns = this.systembar.bar.getColumns();
		var firstcolumn = columns[0];
		var aDistance = new haxe.ds.ObjectMap();
		var gotShared = new haxe.ds.ObjectMap();
		var _g = 0;
		while(_g < columns.length) {
			var column = columns[_g];
			++_g;
			var value = column.getADistance();
			aDistance.set(column,value);
			gotShared.set(column,0);
		}
		var seedThreshold = new haxe.ds.IntMap();
		var seedrest = amount;
		var countIterations = 0;
		while(seedrest > 0) {
			var seed = .5;
			var _g1 = 0;
			while(_g1 < columns.length) {
				var column1 = columns[_g1];
				++_g1;
				var grain = column1.getDistanceDelta() * seed;
				var valueDeltaInt = Std["int"](column1.getDistanceDelta() * 100000);
				if(!seedThreshold.exists(valueDeltaInt)) seedThreshold.set(valueDeltaInt,0);
				var value1 = seedThreshold.get(valueDeltaInt) + grain;
				seedThreshold.set(valueDeltaInt,value1);
				var threshold = seedThreshold.get(valueDeltaInt);
				var benefit;
				if(column1 == firstcolumn) benefit = 0.0; else benefit = column1.getADistanceBenefit();
				if(threshold > benefit) {
					var value2 = gotShared.h[column1.__id__] + grain;
					gotShared.set(column1,value2);
					seedrest -= grain;
				}
			}
			countIterations++;
		}
		var gain = 0.0;
		var _g2 = 0;
		while(_g2 < columns.length) {
			var column2 = columns[_g2];
			++_g2;
			column2.sposition = column2.getAPostion() + gain;
			gain += gotShared.h[column2.__id__];
		}
	}
	,resetStretch: function() {
		var _g = 0;
		var _g1 = this.systembar.bar.getColumns();
		while(_g < _g1.length) {
			var column = _g1[_g];
			++_g;
			column.sposition = null;
		}
	}
	,__class__: nx3.PBarStretchCalculator
};
nx3.PBarWidthCalculator = function() {
};
nx3.PBarWidthCalculator.__name__ = true;
nx3.PBarWidthCalculator.__interfaces__ = [nx3.IBarWidthCalculator];
nx3.PBarWidthCalculator.prototype = {
	getClefWidth: function(clef) {
		return nx3.PAttributesRectsCalculator.getClefRect(clef).width;
	}
	,getKeyWidth: function(key) {
		return nx3.PAttributesRectsCalculator.getKeyRect(key).width;
	}
	,getTimeWidth: function(time) {
		return nx3.PAttributesRectsCalculator.getTimeRect(time).width;
	}
	,getContentLeftMarginWidth: function(bar) {
		return 3.0;
	}
	,getContentWidth: function(bar) {
		return bar.getContentwidth();
	}
	,getBarlineWidth: function(barline) {
		return 1.0;
	}
	,getLeftBarlineWidth: function(barline) {
		return 1.0;
	}
	,getClefsWidth: function(clefs) {
		var result = 0.0;
		var _g = 0;
		while(_g < clefs.length) {
			var clef = clefs[_g];
			++_g;
			if(clef == null) continue;
			result = Math.max(result,nx3.PAttributesRectsCalculator.getClefRect(clef).width);
		}
		return result;
	}
	,getKeysWidth: function(keys) {
		var result = 0.0;
		var _g = 0;
		while(_g < keys.length) {
			var key = keys[_g];
			++_g;
			if(key == null) continue;
			result = Math.max(result,nx3.PAttributesRectsCalculator.getKeyRect(key).width);
		}
		return result;
	}
	,__class__: nx3.PBarWidthCalculator
};
nx3.PBaseRectCalculator = function(note) {
	this.note = note;
};
nx3.PBaseRectCalculator.__name__ = true;
nx3.PBaseRectCalculator.prototype = {
	getBaseRect: function() {
		{
			var _g = this.note.nnote.type;
			switch(_g[1]) {
			case 0:
				var atr = _g[5];
				var a = _g[4];
				var v = _g[3];
				var h = _g[2];
				var _g1 = nx3.ENoteValTools.head(this.note.nnote.value);
				switch(_g1[1]) {
				case 2:
					return new nx3.geom.Rectangle(-2.8000000000000003,-3,5.6000000000000005,3 * 2);
				default:
					return new nx3.geom.Rectangle(-2.2,-3,4.4,3 * 2);
				}
				break;
			case 4:
				var f = _g[5];
				var c = _g[4];
				var o = _g[3];
				var text = _g[2];
				return cx.ArrayTools.first(this.note.getHeadsRects()).clone();
			default:
				return new nx3.geom.Rectangle(-4,-3,8,3 * 2);
			}
		}
	}
	,__class__: nx3.PBaseRectCalculator
};
nx3.PBeamflagCalculator = function(beamgroup) {
	this.beamgroup = beamgroup;
};
nx3.PBeamflagCalculator.__name__ = true;
nx3.PBeamflagCalculator.prototype = {
	getBeamflags: function() {
		var firstpass = [];
		var noteIdx = 0;
		var holder = [];
		var holderIdx = 0;
		var _g = 0;
		var _g1 = this.beamgroup.pnotes;
		while(_g < _g1.length) {
			var note = _g1[_g];
			++_g;
			var nextnote = cx.ArrayTools.indexOrNull(this.beamgroup.pnotes,noteIdx + 1);
			if(nextnote == null) continue;
			if(nx3.ENoteValTools.beaminglevel(note.nnote.value) > 1 && nx3.ENoteValTools.beaminglevel(nextnote.nnote.value) > 1) {
				holder.push(2);
				firstpass.push(nx3.EBeamflagType.Full16);
			} else if(nx3.ENoteValTools.beaminglevel(note.nnote.value) == 1 && nx3.ENoteValTools.beaminglevel(nextnote.nnote.value) > 1) {
				holder.push(-1);
				firstpass.push(nx3.EBeamflagType.End16);
			} else if(nx3.ENoteValTools.beaminglevel(note.nnote.value) > 1 && nx3.ENoteValTools.beaminglevel(nextnote.nnote.value) == 1) {
				holder.push(1);
				firstpass.push(nx3.EBeamflagType.Start16);
			} else {
				holder.push(0);
				firstpass.push(nx3.EBeamflagType.None);
			}
			noteIdx++;
		}
		var result = [];
		var _g2 = 0;
		while(_g2 < firstpass.length) {
			var r = firstpass[_g2];
			++_g2;
			var rnext = cx.ArrayTools.next(firstpass,r);
			var rprev = cx.ArrayTools.prev(firstpass,r);
			if(rnext == nx3.EBeamflagType.Full16 && r == nx3.EBeamflagType.End16) result.push(nx3.EBeamflagType.None); else if(rprev == nx3.EBeamflagType.Full16 && r == nx3.EBeamflagType.Start16) result.push(nx3.EBeamflagType.None); else result.push(r);
		}
		return result;
	}
	,__class__: nx3.PBeamflagCalculator
};
nx3.PBeamgroup = function(pnotes) {
	this.value = null;
	this.voice = pnotes[0].voice;
	this.pnotes = pnotes;
	var _g = 0;
	while(_g < pnotes.length) {
		var pnote = pnotes[_g];
		++_g;
		pnote.beamgroup = this;
	}
};
nx3.PBeamgroup.__name__ = true;
nx3.PBeamgroup.prototype = {
	getValue: function() {
		if(this.value != null) return this.value;
		this.value = 0;
		var _g = 0;
		var _g1 = this.pnotes;
		while(_g < _g1.length) {
			var pnote = _g1[_g];
			++_g;
			this.value += nx3.ENoteValTools.value(pnote.nnote.value);
		}
		return this.value;
	}
	,setDirection: function(direction) {
		this.direction = direction;
	}
	,getDirection: function() {
		if(this.direction == null) {
			var calculator = new nx3.PPartbeamgroupsDirectionCalculator(this.voice.getPart());
			calculator.calculateBeamgroupsDirections();
		}
		return this.direction;
	}
	,getPVoice: function() {
		return this.voice;
	}
	,getNotesStemXPositions: function() {
		if(this.stavexpositions != null) return this.stavexpositions;
		this.stavexpositions = [];
		var _g = 0;
		var _g1 = this.pnotes;
		while(_g < _g1.length) {
			var note = _g1[_g];
			++_g;
			this.stavexpositions.push(note.getComplex().getXPosition() + note.getStaveXPosition());
		}
		return this.stavexpositions;
	}
	,getFrame: function() {
		if(this.frame != null) return this.frame;
		var firstnote = this.pnotes[0].nnote;
		if(firstnote.type[0] != "Note") return null;
		if(this.pnotes.length == 1) {
			var stavinglevel = nx3.ENoteValTools.stavinglevel(firstnote.value);
			if(stavinglevel <= 0) return null;
		}
		var calculator = new nx3.PBeamgroupFrameCalculator(this);
		this.frame = calculator.getFrame();
		return this.frame;
	}
	,toString: function() {
		return "PBeamgroup \r";
	}
	,__class__: nx3.PBeamgroup
};
nx3.PBeamgroupDirectionCalculator = function(beamgroup) {
	this.beamgroup = beamgroup;
};
nx3.PBeamgroupDirectionCalculator.__name__ = true;
nx3.PBeamgroupDirectionCalculator.prototype = {
	getDirection: function() {
		this.topLevel = this.findTopLevel();
		this.bottomLevel = this.findBottomLevel();
		if(this.topLevel + this.bottomLevel <= 0) return nx3.EDirectionUD.Down;
		return nx3.EDirectionUD.Up;
	}
	,findTopLevel: function() {
		var topLevel = this.beamgroup.pnotes[0].nnote.get_topLevel();
		if(this.beamgroup.pnotes.length == 1) return topLevel;
		var _g1 = 1;
		var _g = this.beamgroup.pnotes.length;
		while(_g1 < _g) {
			var i = _g1++;
			var level = this.beamgroup.pnotes[i].nnote.get_topLevel();
			topLevel = Std["int"](Math.min(topLevel,level));
		}
		return topLevel;
	}
	,findBottomLevel: function() {
		var bottomLevel = this.beamgroup.pnotes[0].nnote.get_bottomLevel();
		if(this.beamgroup.pnotes.length == 1) return bottomLevel;
		var _g1 = 1;
		var _g = this.beamgroup.pnotes.length;
		while(_g1 < _g) {
			var i = _g1++;
			var level = this.beamgroup.pnotes[i].nnote.get_bottomLevel();
			bottomLevel = Std["int"](Math.max(bottomLevel,level));
		}
		return bottomLevel;
	}
	,__class__: nx3.PBeamgroupDirectionCalculator
};
nx3.PBeamgroupFrameCalculator = function(beamgroup) {
	this.beamgroup = beamgroup;
};
nx3.PBeamgroupFrameCalculator.__name__ = true;
nx3.PBeamgroupFrameCalculator.prototype = {
	getFrame: function() {
		this.calcLevelArrays();
		var frame = this.calcFramePrototype();
		return frame;
	}
	,calcFramePrototype: function() {
		var count = this.innerLevels.length;
		var tips = this.calcTips();
		var beamflags = new nx3.PBeamflagCalculator(this.beamgroup).getBeamflags();
		return { leftInnerY : this.innerLevels[0], leftOuterY : this.outerLevels[0], rightInnerY : this.innerLevels[count - 1], rightOuterY : this.outerLevels[count - 1], leftTipY : tips.leftTip, rightTipY : tips.rightTip, outerLevels : this.outerLevels, innerLevels : this.innerLevels, beamflags : beamflags};
	}
	,getTopLevels: function() {
		var levels = [];
		var _g = 0;
		var _g1 = this.beamgroup.pnotes;
		while(_g < _g1.length) {
			var note = _g1[_g];
			++_g;
			levels.push(note.nnote.get_topLevel());
		}
		return levels;
	}
	,getBottomLevels: function() {
		var levels = [];
		var _g = 0;
		var _g1 = this.beamgroup.pnotes;
		while(_g < _g1.length) {
			var note = _g1[_g];
			++_g;
			levels.push(note.nnote.get_bottomLevel());
		}
		return levels;
	}
	,calcLevelArrays: function() {
		var _g = this.beamgroup.getDirection();
		switch(_g[1]) {
		case 0:
			this.outerLevels = this.getTopLevels();
			this.innerLevels = this.getBottomLevels();
			break;
		case 1:
			this.outerLevels = this.getBottomLevels();
			this.innerLevels = this.getTopLevels();
			break;
		}
	}
	,calcTips: function() {
		var stemLenght = 7;
		var direction = this.beamgroup.getDirection();
		var calculator = new nx3.PBamegroupFrameTipCalculator(this.outerLevels,direction);
		var tips = calculator.getTips();
		if(direction == nx3.EDirectionUD.Up) tips.leftTip = tips.leftTip - stemLenght; else tips.leftTip = tips.leftTip + stemLenght;
		if(direction == nx3.EDirectionUD.Up) tips.rightTip = tips.rightTip - stemLenght; else tips.rightTip = tips.rightTip + stemLenght;
		return tips;
	}
	,__class__: nx3.PBeamgroupFrameCalculator
};
nx3.PColumn = function(bar,complexes,valueposition,value) {
	this.allottedDistance = 0;
	this.bar = bar;
	this.complexes = complexes;
	this.valueposition = valueposition;
	this.value = value;
	this.mposition = 0.0;
	this.mdistanceBenefit = 0;
};
nx3.PColumn.__name__ = true;
nx3.PColumn.prototype = {
	getComplexes: function() {
		return this.complexes;
	}
	,getValueposition: function() {
		return this.valueposition;
	}
	,getValue: function() {
		if(this.value == null) throw "value shouldnt be null";
		return this.value;
	}
	,getMDistance: function() {
		if(this.mdistance == null) throw "mdistance shouldnt be null";
		return this.mdistance;
	}
	,getMDistanceBenefit: function() {
		if(this.mdistanceBenefit != null) return this.mdistanceBenefit;
		this.mdistanceBenefit = Math.max(0,this.getMDistance() - 3.2);
		return this.mdistanceBenefit;
	}
	,getDistanceDelta: function() {
		if(this.distancedelta != null) return this.distancedelta;
		this.bar.getContentwidth();
		this.distancedelta = this.allottedDistance / this.bar.getAllottedDistanceSum();
		return this.distancedelta;
	}
	,getMPosition: function() {
		return this.mposition;
	}
	,getADistance: function() {
		if(this.adistance != null) return this.adistance;
		this.bar.calculateAPositions();
		return this.adistance;
	}
	,getADistanceBenefit: function() {
		return this.adistanceBenefit;
	}
	,getAPostion: function() {
		if(this.aposition != null) return this.aposition;
		this.bar.calculateAPositions();
		return this.aposition;
	}
	,getSPosition: function() {
		if(this.sposition != null) return this.sposition;
		return this.getAPostion();
	}
	,getRightX: function() {
		if(this.rightX != null) return this.rightX;
		this.rightX = 0;
		var _g = 0;
		var _g1 = this.getComplexes();
		while(_g < _g1.length) {
			var complex = _g1[_g];
			++_g;
			if(complex != null) this.rightX = Math.max(this.rightX,complex.getRightX());
		}
		return this.rightX;
	}
	,getLeftX: function() {
		if(this.leftX != null) return this.leftX;
		this.leftX = 0;
		var _g = 0;
		var _g1 = this.getComplexes();
		while(_g < _g1.length) {
			var complex = _g1[_g];
			++_g;
			if(complex != null) this.leftX = Math.min(this.leftX,complex.getLeftX());
		}
		return this.leftX;
	}
	,getNextComplex: function(complex) {
		if(this == cx.ArrayTools.last(this.bar.getColumns())) return null;
		var partIndex;
		var _this = this.getComplexes();
		partIndex = HxOverrides.indexOf(_this,complex,0);
		var nextColumnIdx;
		nextColumnIdx = (function($this) {
			var $r;
			var _this1 = $this.bar.getColumns();
			$r = HxOverrides.indexOf(_this1,$this,0);
			return $r;
		}(this)) + 1;
		var _g1 = nextColumnIdx;
		var _g = this.bar.getColumns().length;
		while(_g1 < _g) {
			var ci = _g1++;
			var complex1 = this.bar.getColumns()[ci].getComplexes()[partIndex];
			if(complex1 != null) return complex1;
		}
		return null;
	}
	,toString: function() {
		return "PColumn";
	}
	,__class__: nx3.PColumn
};
nx3.PColumnsAllotmentCalculator = function(bar) {
	this.bar = bar;
	this.spacing = bar.nbar.spacing;
	this.bar.allottedDistanceSum = 0;
};
nx3.PColumnsAllotmentCalculator.__name__ = true;
nx3.PColumnsAllotmentCalculator.prototype = {
	calculate: function(stretch) {
		if(stretch == null) stretch = 0;
		var aposition = this.bar.getContentXZero();
		var _g = 0;
		var _g1 = this.bar.getColumns();
		while(_g < _g1.length) {
			var column = _g1[_g];
			++_g;
			var dist = this.getADistance(column.getValue(),column);
			column.allottedDistance = dist;
			this.bar.allottedDistanceSum += dist;
			var adistance = Math.max(column.getMDistance(),dist);
			var adistanceBenefit = Math.max(0,column.getMDistance() - dist);
			column.aposition = aposition;
			column.adistance = adistance;
			column.adistanceBenefit = adistanceBenefit;
			aposition += adistance;
		}
	}
	,getADistance: function(val,column) {
		var _g = this.bar.nbar.allotment;
		switch(_g[1]) {
		case 1:
			return this.spacing;
		case 0:
			return column.getMDistance();
		case 2:
			return (0.5 + val / 3024 / 2) * this.spacing;
		default:
			return val / 3024 * this.spacing;
		}
	}
	,__class__: nx3.PColumnsAllotmentCalculator
};
nx3.PColumnsDistancesCalculator = function(bar) {
	this.bar = bar;
	this.prevLeftComplex = new haxe.ds.IntMap();
};
nx3.PColumnsDistancesCalculator.__name__ = true;
nx3.PColumnsDistancesCalculator.prototype = {
	calculate: function() {
		var leftColumn = null;
		var xposition = 0.0;
		var _g1 = 0;
		var _g = this.bar.getColumns().length;
		while(_g1 < _g) {
			var columnIdx = _g1++;
			var rightColumn = this.bar.getColumns()[columnIdx];
			rightColumn.mdistance = 0;
			if(columnIdx == 0) {
				var complexId = 0;
				var _g2 = 0;
				var _g3 = cx.ArrayTools.first(this.bar.getColumns()).getComplexes();
				while(_g2 < _g3.length) {
					var complex = _g3[_g2];
					++_g2;
					this.prevLeftComplex.set(complexId,{ leftComplex : complex, columnIdx : 0});
					complexId++;
				}
			} else if(columnIdx < this.bar.getColumns().length) {
				var leftComplexes = leftColumn.getComplexes();
				var rightComplexes = rightColumn.getComplexes();
				var columndistance = 0.0;
				var _g31 = 0;
				var _g21 = leftComplexes.length;
				while(_g31 < _g21) {
					var complexIdx = _g31++;
					var leftComplex = leftComplexes[complexIdx];
					var rightComplex = rightComplexes[complexIdx];
					var distance = this.getComplexDistances(columnIdx,complexIdx,leftComplex,rightComplex);
					columndistance = Math.max(columndistance,distance);
				}
				columndistance = cx.MathTools.round2(columndistance,null);
				leftColumn.mdistance = columndistance;
				xposition += columndistance;
				rightColumn.mposition = xposition;
			}
			if(columnIdx == this.bar.getColumns().length - 1) {
				var lastColumn = this.bar.getColumns()[columnIdx];
				lastColumn.mdistance = lastColumn.getRightX();
				return;
			}
			leftColumn = rightColumn;
		}
	}
	,getComplexDistances: function(columnIdx,complexIdx,leftComplex,rightComplex) {
		if(rightComplex == null) {
			if(leftComplex != null) {
				var leftColumnIdx = columnIdx - 1;
				this.prevLeftComplex.set(complexIdx,{ leftComplex : leftComplex, columnIdx : leftColumnIdx});
			}
			return 0;
		}
		if(leftComplex == null) {
			var currentLeftColumIdx = columnIdx - 1;
			var prevLeftColumnIdx = this.prevLeftComplex.get(complexIdx).columnIdx;
			var currentLeftXPos = this.bar.getColumns()[currentLeftColumIdx].getMPosition();
			var prevLeftXPos = this.bar.getColumns()[prevLeftColumnIdx].getMPosition();
			var distanceBenefit = currentLeftXPos - prevLeftXPos;
			var currentLeftComplex = this.prevLeftComplex.get(complexIdx).leftComplex;
			var distance = new nx3.PComplexDistancesCalculator().getDistance(currentLeftComplex,rightComplex);
			var actualDistance = Math.max(0,distance - distanceBenefit);
			return actualDistance;
		}
		var leftColumnIdx1 = columnIdx - 1;
		var distance1 = new nx3.PComplexDistancesCalculator().getDistance(leftComplex,rightComplex);
		this.prevLeftComplex.set(complexIdx,{ leftComplex : leftComplex, columnIdx : leftColumnIdx1});
		return distance1;
	}
	,__class__: nx3.PColumnsDistancesCalculator
};
nx3.PColumnsGenerator = function(bar) {
	this.bar = bar;
	this.vparts = this.bar.getParts();
};
nx3.PColumnsGenerator.__name__ = true;
nx3.PColumnsGenerator.prototype = {
	getColumns: function() {
		if(this.columns != null) return this.columns;
		this.positions = this.calcPositions(this.vparts);
		this.calcColumns(this.positions,this.vparts);
		return this.columns;
	}
	,calcColumns: function(positions,vparts) {
		var partsCount = vparts.length;
		this.columns = [];
		this.positionsColumns = new haxe.ds.IntMap();
		var barvalue = this.bar.getValue();
		var idx = 0;
		var _g = 0;
		while(_g < positions.length) {
			var pos = positions[_g];
			++_g;
			var nextpos = cx.ArrayTools.indexOrNull(positions,idx + 1);
			if(nextpos == null) nextpos = barvalue;
			var value = nextpos - pos;
			var vcomplexes = [];
			var _g2 = 0;
			var _g1 = this.vparts.length;
			while(_g2 < _g1) {
				var i = _g2++;
				var part = this.vparts[i];
				var x = part.getPositionsComplexes();
				var complex = part.getPositionsComplexes().get(pos);
				vcomplexes.push(complex);
			}
			var vcolumn = new nx3.PColumn(this.bar,vcomplexes,pos,value);
			this.columns.push(vcolumn);
			var _g11 = 0;
			while(_g11 < vcomplexes.length) {
				var complex1 = vcomplexes[_g11];
				++_g11;
				if(complex1 != null) complex1.column = vcolumn;
			}
			this.positionsColumns.set(pos,vcolumn);
			idx++;
		}
	}
	,calcPositions: function(vparts) {
		var positionsMap = new haxe.ds.IntMap();
		var _g = 0;
		while(_g < vparts.length) {
			var vpart = vparts[_g];
			++_g;
			var poss;
			var _this = cx.MapTools.keysToArray(vpart.getPositionsComplexes().keys());
			poss = _this.slice();
			var _g1 = 0;
			while(_g1 < poss.length) {
				var pos = poss[_g1];
				++_g1;
				positionsMap.set(pos,true);
			}
		}
		var positions = cx.MapTools.keysToArray(positionsMap.keys());
		positions.sort(function(a,b) {
			return Reflect.compare(a,b);
		});
		return positions;
	}
	,__class__: nx3.PColumnsGenerator
};
nx3.PComplex = function(part,notes,valueposition) {
	this.part = part;
	if(notes.length > 2) throw "PComplex nr of PNote(s) limited to max 2 - for now";
	this.notes = notes;
	var _g = 0;
	var _g1 = this.notes;
	while(_g < _g1.length) {
		var note = _g1[_g];
		++_g;
		note.complex = this;
	}
	this.valueposition = valueposition;
};
nx3.PComplex.__name__ = true;
nx3.PComplex.prototype = {
	getNotes: function() {
		return this.notes;
	}
	,getValueposition: function() {
		return this.valueposition;
	}
	,getPart: function() {
		return this.part;
	}
	,getColumn: function() {
		if(this.column != null) return this.column;
		this.part.getBar().getColumns();
		if(this.column == null) throw "this shouldn't happen";
		return this.column;
	}
	,getHeadsRects: function() {
		if(this.headsrects != null) return this.headsrects;
		var firstrects = this.notes[0].getHeadsRects();
		if(this.notes.length == 1) return firstrects;
		var secondrects;
		var _this = this.notes[1].getHeadsRects();
		secondrects = _this.slice();
		var xoffset = this.getNoteXOffset(this.notes[1]);
		nx3.geom.RectanglesTools.offset(secondrects,xoffset,0);
		this.headsrects = firstrects.concat(secondrects);
		return this.headsrects;
	}
	,getSignsRects: function() {
		if(this.signsrects != null) return this.signsrects;
		if(this.getVisibleSigns().length == 0) return [];
		this.signsrects = new nx3.PSignsRectsCalculator(this.getVisibleSigns()).getSignRects(this.getHeadsRects());
		return this.signsrects;
	}
	,getNoteXOffset: function(note) {
		if(note == cx.ArrayTools.first(this.getNotes())) return 0;
		if(this.secondoffset != null) return this.secondoffset;
		this.secondoffset = new nx3.PNoteOffsetCalculator(this).getNoteOffset(cx.ArrayTools.second(this.getNotes()));
		return this.secondoffset;
	}
	,getSigns: function() {
		if(this.signs != null) return this.signs;
		this.signs = new nx3.PSignsCalculator(this.getNotes()).getSigns();
		return this.signs;
	}
	,getVisibleSigns: function() {
		if(this.visiblesigns != null) return this.visiblesigns;
		this.visiblesigns = new nx3.PSignsCalculator(this.getNotes()).getVisibleSigns();
		return this.visiblesigns;
	}
	,getStavesRects: function() {
		if(this.stavesrects != null) return this.stavesrects;
		this.stavesrects = [];
		var _g = 0;
		var _g1 = this.notes;
		while(_g < _g1.length) {
			var note = _g1[_g];
			++_g;
			var rect = this.getStaveRect(note);
			if(rect != null) this.stavesrects.push(rect);
		}
		var _g2 = 0;
		var _g11 = this.notes;
		while(_g2 < _g11.length) {
			var note1 = _g11[_g2];
			++_g2;
			var flagrect = new nx3.PStaveRectCalculator(note1).getFlagRect();
			if(flagrect != null) this.stavesrects.push(flagrect);
		}
		return this.stavesrects;
	}
	,getStaveRect: function(note) {
		return new nx3.PStaveRectCalculator(note).getStaveRect();
	}
	,getTieRects: function() {
		if(this.tierects != null) return this.tierects;
		this.tierects = new nx3.PComplexTierectsCalculator(this).getTieRects();
		return this.tierects;
	}
	,getDotRects: function() {
		if(this.dotrects != null) return this.dotrects;
		this.dotrects = new nx3.PComplexDotsrectsCalculator(this).getDotRects();
		return this.dotrects;
	}
	,getBaseRect: function() {
		if(this.baserect != null) return this.baserect;
		this.baserect = new nx3.geom.Rectangle(0,0,0,0);
		var _g = 0;
		var _g1 = this.getNotes();
		while(_g < _g1.length) {
			var note = _g1[_g];
			++_g;
			this.baserect = this.baserect.union(note.getBaseRect());
		}
		return this.baserect;
	}
	,getAllRects: function() {
		if(this.allrects != null) return this.allrects;
		this.allrects = [];
		this.allrects = nx3.geom.RectanglesTools.concat(this.allrects,this.getHeadsRects());
		this.allrects = nx3.geom.RectanglesTools.concat(this.allrects,this.getStavesRects());
		this.allrects = nx3.geom.RectanglesTools.concat(this.allrects,this.getSignsRects());
		this.allrects = nx3.geom.RectanglesTools.concat(this.allrects,this.getTieRects());
		this.allrects = nx3.geom.RectanglesTools.concat(this.allrects,this.getDotRects());
		return this.allrects;
	}
	,getRect: function() {
		this.rect = nx3.geom.RectanglesTools.unionAll(this.getAllRects());
		return this.rect;
	}
	,getXPosition: function() {
		if(this.xposition != null) return this.xposition;
		this.getHeadsRects();
		this.xposition = this.getColumn().getSPosition();
		return this.xposition;
	}
	,getIndex: function() {
		var _this = this.part.getComplexes();
		return HxOverrides.indexOf(_this,this,0);
	}
	,getLeftX: function() {
		if(this.leftX != null) return this.leftX;
		this.leftX = this.getRect().x;
		return this.leftX;
	}
	,getRightX: function() {
		if(this.rightX != null) return this.rightX;
		this.rightX = this.getRect().x + this.getRect().width;
		return this.rightX;
	}
	,getNext: function() {
		if(this.next != null) return this.next;
		this.next = this.getColumn().getNextComplex(this);
		return this.next;
	}
	,setTieinfos: function(val) {
		this.tieinfos = val;
	}
	,getTieinfos: function() {
		if(this.tieinfos == null) this.getTieRects();
		if(this.getTieRects().length == 0) return [];
		this.tieinfos = new nx3.PComplexTieTargetCalculator(this.tieinfos).findTargetHeads();
		return this.tieinfos;
	}
	,getHeads: function() {
		var result = [];
		var _g = 0;
		var _g1 = this.getNotes();
		while(_g < _g1.length) {
			var note = _g1[_g];
			++_g;
			result = result.concat(note.heads);
		}
		return result;
	}
	,getHasTie: function() {
		if(this.hasTie != null) return this.hasTie;
		var _g = 0;
		var _g1 = this.getNotes();
		while(_g < _g1.length) {
			var note = _g1[_g];
			++_g;
			if(note.getHasTie() == true) {
				this.hasTie = true;
				return this.hasTie;
			}
		}
		this.hasTie = false;
		return this.hasTie;
	}
	,getHeadLevels: function() {
		if(this.headlevels != null) return this.headlevels;
		this.headlevels = [];
		var _g = 0;
		var _g1 = this.getNotes();
		while(_g < _g1.length) {
			var note = _g1[_g];
			++_g;
			var _g2 = 0;
			var _g3 = note.nnote.get_nheads();
			while(_g2 < _g3.length) {
				var nhead = _g3[_g2];
				++_g2;
				this.headlevels.push(nhead.level);
			}
		}
		return this.headlevels;
	}
	,toString: function() {
		var str = "PComplex: \r";
		var _g = 0;
		var _g1 = this.getNotes();
		while(_g < _g1.length) {
			var note = _g1[_g];
			++_g;
			str += "- Note: " + Std.string(note.nnote) + "\r";
		}
		return str;
	}
	,__class__: nx3.PComplex
};
nx3.PComplexDistancesCalculator = function() {
};
nx3.PComplexDistancesCalculator.__name__ = true;
nx3.PComplexDistancesCalculator.prototype = {
	getDistance: function(leftComplex,rightComplex) {
		var leftBaseRects = [leftComplex.getBaseRect()];
		var rightBaseRects = [rightComplex.getBaseRect()];
		var minDistance = nx3.geom.RectanglesTools.getXIntersection(leftBaseRects,rightBaseRects);
		var leftRects = leftComplex.getAllRects();
		var rightRects = rightComplex.getAllRects();
		var objDistance = nx3.geom.RectanglesTools.getXIntersection(leftRects,rightRects);
		var objDistanceMargin = objDistance + 0.6;
		return Math.max(minDistance,objDistanceMargin);
	}
	,getRects: function(complex) {
		var rects = [];
		rects.concat(complex.getHeadsRects());
		rects.concat(complex.getStavesRects());
		rects.concat(complex.getSignsRects());
		return rects;
	}
	,__class__: nx3.PComplexDistancesCalculator
};
nx3.PComplexDotsrectsCalculator = function(complex) {
	this.complex = complex;
};
nx3.PComplexDotsrectsCalculator.__name__ = true;
nx3.PComplexDotsrectsCalculator.prototype = {
	getDotRects: function() {
		var nrofnotes = this.complex.getNotes().length;
		var firstnote = cx.ArrayTools.first(this.complex.getNotes());
		var rects = this.getRectsForNote(firstnote,false);
		if(nrofnotes == 2) {
			var secondnote = cx.ArrayTools.second(this.complex.getNotes());
			var secondrects = this.getRectsForNote(secondnote,true);
			rects = nx3.geom.RectanglesTools.concat(rects,secondrects);
		}
		return rects;
	}
	,getRectsForNote: function(note,down) {
		if(down == null) down = false;
		if(nx3.ENoteValTools.dotlevel(note.nnote.value) == 0) return [];
		var rects = [];
		var dotwidth;
		if(nx3.ENoteValTools.dotlevel(note.nnote.value) == 1) dotwidth = 2.0; else dotwidth = 3.0;
		var headrect = nx3.geom.RectanglesTools.unionAll(note.getHeadsRects());
		var rectX = headrect.x + headrect.width;
		var dotlevels = new haxe.ds.IntMap();
		var _g = 0;
		var _g1 = note.nnote.get_nheads();
		while(_g < _g1.length) {
			var head = _g1[_g];
			++_g;
			var level = head.level;
			var adj = Std["int"](Math.abs((level - 1) % 2));
			var dotlevel;
			if(down) dotlevel = level + adj; else dotlevel = level - adj;
			dotlevels.set(dotlevel,true);
		}
		var dotkeys = cx.ArrayTools.fromHashKeys(dotlevels.keys());
		var _g2 = 0;
		while(_g2 < dotkeys.length) {
			var level1 = dotkeys[_g2];
			++_g2;
			rects.push(new nx3.geom.Rectangle(rectX,level1 - 0.5,dotwidth,1));
		}
		return rects;
	}
	,__class__: nx3.PComplexDotsrectsCalculator
};
nx3.PComplexTieTargetCalculator = function(tieinfos) {
	this.tieinfos = tieinfos;
};
nx3.PComplexTieTargetCalculator.__name__ = true;
nx3.PComplexTieTargetCalculator.prototype = {
	findTargetHeads: function() {
		var _g = 0;
		var _g1 = this.tieinfos;
		while(_g < _g1.length) {
			var info = _g1[_g];
			++_g;
			var head = info.head;
			var headlevel = head.nhead.level;
			var nextnote = head.getNote().getNext();
			if(nextnote == null) continue;
			var nextheads = nextnote.getHeads();
			var _g2 = 0;
			while(_g2 < nextheads.length) {
				var nexthead = nextheads[_g2];
				++_g2;
				if(headlevel == nexthead.nhead.level) {
					info.target = nexthead;
					break;
				}
			}
		}
		return this.tieinfos;
	}
	,__class__: nx3.PComplexTieTargetCalculator
};
nx3.PComplexTierectsCalculator = function(complex) {
	this.complex = complex;
};
nx3.PComplexTierectsCalculator.__name__ = true;
nx3.PComplexTierectsCalculator.prototype = {
	getTieRects: function() {
		var nrofnotes = this.complex.getNotes().length;
		var firstnote = cx.ArrayTools.first(this.complex.getNotes());
		var firstties = firstnote.getTies();
		var secondnote;
		if(nrofnotes == 2) secondnote = cx.ArrayTools.second(this.complex.getNotes()); else secondnote = null;
		var secondties;
		if(nrofnotes == 2) secondties = cx.ArrayTools.second(this.complex.getNotes()).getTies(); else secondties = [];
		if(firstties == [] && secondties == []) return [];
		var headrects = this.complex.getHeadsRects();
		var dotrects = this.complex.getDotRects();
		var tieinfos = new Array();
		var rects = new Array();
		var headIdx = 0;
		var dotidx = 0;
		var adjusty = 0.0;
		var tiewidth = 3.2;
		var tieheight = 1.6;
		var _g = 0;
		var _g1 = firstnote.getHeads();
		while(_g < _g1.length) {
			var head = _g1[_g];
			++_g;
			var headrect = this.complex.getHeadsRects()[headIdx];
			var rx = headrect.x + headrect.width;
			if(nx3.ENoteValTools.dotlevel(firstnote.nnote.value) > 0) {
				var dotrect = this.complex.getDotRects()[dotidx];
				rx = dotrect.x + dotrect.width;
				dotidx++;
			}
			if(head.nhead.tie != null) {
				var tielevel = 0;
				{
					var _g2 = head.nhead.tie;
					switch(_g2[1]) {
					case 0:
						var tlevel = _g2[3];
						var tiedir = _g2[2];
						tielevel = tlevel;
						break;
					default:
					}
				}
				var level = head.nhead.level + tielevel;
				var direction = nx3.EDirectionUD.Up;
				if(firstties.length == 1) {
					if(secondnote == null) {
						if(firstnote.getDirection() == nx3.EDirectionUD.Up) level = level + 1; else level = level - 1;
						if(firstnote.getDirection() == nx3.EDirectionUD.Up) direction = nx3.EDirectionUD.Down; else direction = nx3.EDirectionUD.Up;
						if(firstnote.getDirection() == nx3.EDirectionUD.Up) adjusty = .8; else adjusty = -.8;
					} else if(firstnote.getDirection() == nx3.EDirectionUD.Up) level = level - 1; else level = level - 1;
					tiewidth = 3;
				} else if(secondnote == null && head == cx.ArrayTools.last(firstnote.getHeads())) {
					direction = nx3.EDirectionUD.Down;
					adjusty = .5;
				} else adjusty = -.5;
				var r = new nx3.geom.Rectangle(rx,level - 0.8 + adjusty,tiewidth,1.6);
				rects.push(r);
				tieinfos.push({ direction : direction, rect : r, head : head, target : null});
			}
			headIdx++;
		}
		tiewidth = 3.2;
		if(secondnote != null) {
			var _g3 = 0;
			var _g11 = secondnote.getHeads();
			while(_g3 < _g11.length) {
				var head1 = _g11[_g3];
				++_g3;
				if(head1.nhead.tie != null) {
					var level1 = head1.nhead.level;
					var headrect1 = this.complex.getHeadsRects()[headIdx];
					var rx1 = headrect1.x + headrect1.width;
					if(nx3.ENoteValTools.dotlevel(secondnote.nnote.value) > 0) {
						var dotrect1 = this.complex.getDotRects()[dotidx];
						rx1 = dotrect1.x + dotrect1.width;
						dotidx++;
					}
					if(secondties.length == 1) {
						level1++;
						tiewidth = 3;
					}
					var r1 = new nx3.geom.Rectangle(rx1,level1 - 0.8,tiewidth,1.6);
					rects.push(r1);
					tieinfos.push({ direction : nx3.EDirectionUD.Down, rect : r1, head : head1, target : null});
				}
				headIdx++;
			}
		}
		this.complex.setTieinfos(tieinfos);
		return rects;
	}
	,getNoteTies: function(note) {
	}
	,__class__: nx3.PComplexTierectsCalculator
};
nx3.PHead = function(nhead) {
	this.nhead = nhead;
};
nx3.PHead.__name__ = true;
nx3.PHead.prototype = {
	getNote: function() {
		return this.note;
	}
	,toString: function() {
		return "PHead  \r" + Std.string(this.nhead);
	}
	,__class__: nx3.PHead
};
nx3.PHeadPlacementsCalculator = function(vheads,direction) {
	this.vheads = vheads;
	this.direction = direction;
};
nx3.PHeadPlacementsCalculator.__name__ = true;
nx3.PHeadPlacementsCalculator.prototype = {
	getHeadsPlacements: function() {
		if(this.vheads.length == 1) return [{ level : this.vheads[0].nhead.level, pos : nx3.EHeadPosition.Center}];
		var len = this.vheads.length;
		var placements = [];
		var tempArray = [];
		var _g = 0;
		var _g1 = this.vheads;
		while(_g < _g1.length) {
			var vhead = _g1[_g];
			++_g;
			var placement = { level : vhead.nhead.level, pos : nx3.EHeadPosition.Center};
			placements.push(placement);
			tempArray.push(0);
		}
		if(this.direction == nx3.EDirectionUD.Up) {
			var _g11 = 0;
			var _g2 = len - 1;
			while(_g11 < _g2) {
				var j = _g11++;
				var i = len - j - 1;
				var vhead1 = this.vheads[i];
				var vheadNext = this.vheads[i - 1];
				var lDiff = vhead1.nhead.level - vheadNext.nhead.level;
				if(lDiff < 2) {
					if(tempArray[i] == tempArray[i - 1]) {
						tempArray[i - 1] = 1;
						placements[i - 1].pos = nx3.EHeadPosition.Right;
					}
				}
			}
		} else {
			var _g12 = 0;
			var _g3 = len - 1;
			while(_g12 < _g3) {
				var i1 = _g12++;
				var vhead2 = this.vheads[i1];
				var vheadNext1 = this.vheads[i1 + 1];
				var lDiff1 = vheadNext1.nhead.level - vhead2.nhead.level;
				if(lDiff1 < 2) {
					if(tempArray[i1] == tempArray[i1 + 1]) {
						tempArray[i1 + 1] = -1;
						placements[i1 + 1].pos = nx3.EHeadPosition.Left;
					}
				}
			}
		}
		return placements;
	}
	,__class__: nx3.PHeadPlacementsCalculator
};
nx3.PHeadsRectsCalculator = function(note,direction) {
	if(direction != null) this.direction = direction; else this.direction = note.getDirection();
	this.vheads = note.getHeads();
	this.placements = new nx3.PHeadPlacementsCalculator(this.vheads,this.direction).getHeadsPlacements();
	this.notevalue = note.nnote.value;
};
nx3.PHeadsRectsCalculator.__name__ = true;
nx3.PHeadsRectsCalculator.prototype = {
	getHeadsRects: function() {
		var rects = new Array();
		var i = 0;
		var _g = 0;
		var _g1 = this.placements;
		while(_g < _g1.length) {
			var placement = _g1[_g];
			++_g;
			var headtype = this.vheads[i].nhead.type;
			var rect = null;
			var headw = 0;
			this.headRect(headtype,this.notevalue);
			var _g2 = nx3.ENoteValTools.head(this.notevalue);
			switch(_g2[1]) {
			case 2:
				headw = 2.2;
				break;
			default:
				headw = 1.6;
			}
			var rect1 = new nx3.geom.Rectangle(-headw,-1,2 * headw,2);
			var pos = 0.0;
			var _g21 = placement.pos;
			switch(_g21[1]) {
			case 0:
				pos = -2 * headw;
				break;
			case 2:
				pos = 2 * headw;
				break;
			default:
				pos = 0;
			}
			rect1.offset(pos,placement.level);
			rects.push(rect1);
			i++;
		}
		return rects;
	}
	,headRect: function(type,notevalue) {
		var headw = 2;
		var headh = 2;
		switch(type[1]) {
		case 0:
			var _g = nx3.ENoteValTools.head(this.notevalue);
			switch(_g[1]) {
			case 2:
				return new nx3.geom.Rectangle(-2.2,-1,4.4,2);
			default:
				return new nx3.geom.Rectangle(-1.6,-1,3.2,2);
			}
			break;
		case 3:
			var _g1 = nx3.ENoteValTools.beaminglevel(this.notevalue);
			switch(_g1) {
			case 1:
				return new nx3.geom.Rectangle(-1.8,-3,3.6,6);
			case 2:
				return new nx3.geom.Rectangle(-2,-3,4,6);
			default:
				return new nx3.geom.Rectangle(-1.6,-3.3,3.2,6.6);
			}
			break;
		default:
			return new nx3.geom.Rectangle(-2,-2,4,4);
		}
		return new nx3.geom.Rectangle(-2,-2,4,4);
	}
	,__class__: nx3.PHeadsRectsCalculator
};
nx3.PNote = function(nnote) {
	this.nnote = nnote;
};
nx3.PNote.__name__ = true;
nx3.PNote.prototype = {
	iterator: function() {
		return HxOverrides.iter(this.heads);
	}
	,get_length: function() {
		return this.heads.length;
	}
	,getVoice: function() {
		return this.voice;
	}
	,getHeads: function() {
		if(this.heads != null) return this.heads;
		this.heads = [];
		var _g = 0;
		var _g1 = this.nnote.get_nheads();
		while(_g < _g1.length) {
			var nhead = _g1[_g];
			++_g;
			var phead = new nx3.PHead(nhead);
			phead.note = this;
			this.heads.push(phead);
		}
		return this.heads;
	}
	,getBeamgroup: function() {
		if(this.voice == null) throw "PNote doesn't have a parent PVoice";
		if(this.beamgroup == null) this.voice.getBeamgroups();
		if(this.beamgroup == null) throw "this should not happen";
		return this.beamgroup;
	}
	,getDirection: function() {
		return this.getBeamgroup().getDirection();
	}
	,getComplex: function() {
		if(this.voice == null) throw "PNote doesn't have a parent PVoice";
		if(this.complex == null) this.voice.getPart().getComplexes();
		if(this.complex == null) throw "Shouldn't happen";
		return this.complex;
	}
	,getHeadsRects: function() {
		if(this.voice == null) throw "PNote doesn't have a parent PVoice";
		if(this.headsRects != null) return this.headsRects;
		var calculator = new nx3.PNoteheadsRectsCalculator(this);
		this.headsRects = calculator.getHeadsRects();
		return this.headsRects;
	}
	,getStaveRect: function() {
		if(this.voice == null) throw "PNote doesn't have a parent PVoice";
		if(this.staveRectChecked) return this.staveRect;
		this.staveRect = this.getComplex().getStaveRect(this);
		this.staveRectChecked = true;
		return this.staveRect;
	}
	,getStaveXPosition: function() {
		if(this.voice == null) throw "PNote doesn't have a parent PVoice";
		if(this.staveXPosition != null) return this.staveXPosition;
		var staverect = this.getStaveRect();
		if(staverect == null) return 0;
		if(this.getDirection() == nx3.EDirectionUD.Up) this.staveXPosition = staverect.width; else this.staveXPosition = staverect.x;
		return this.staveXPosition;
	}
	,getBaseRect: function() {
		if(this.voice == null) throw "PNote doesn't have a parent PVoice";
		if(this.baserect != null) return this.baserect;
		this.baserect = new nx3.PBaseRectCalculator(this).getBaseRect();
		return this.baserect;
	}
	,getXOffset: function() {
		if(this.voice == null) throw "PNote doesn't have a parent PVoice";
		if(this.xoffset != null) return this.xoffset;
		this.xoffset = this.getComplex().getNoteXOffset(this);
		return this.xoffset;
	}
	,getXPosition: function() {
		if(this.voice == null) throw "PNote doesn't have a parent PVoice";
		if(this.xposition != null) return this.xposition;
		this.xposition = this.getComplex().getXPosition() + this.getXOffset();
		return this.xposition;
	}
	,getTies: function() {
		return this.nnote.get_ties();
	}
	,getNext: function() {
		if(this.voice == null) throw "PNote doesn't have a parent PVoice";
		if(this.next != null) return this.next;
		var idx;
		var _this = this.voice.getNotes();
		idx = HxOverrides.indexOf(_this,this,0);
		this.next = cx.ArrayTools.indexOrNull(this.voice.getNotes(),idx + 1);
		return this.next;
	}
	,getHasTie: function() {
		return !Lambda.foreach(this.nnote,function(nhead) {
			return !(nhead.tie != null);
		});
	}
	,__class__: nx3.PNote
};
nx3.PNoteHeadsRectTplCalculator = function(note) {
	this.note = note;
	var level;
	{
		var _g = note.nnote.type;
		switch(_g[1]) {
		case 3:
			var pause = _g[4];
			var sign = _g[3];
			var level1 = _g[2];
			level = level1;
			break;
		default:
			level = 0;
		}
	}
	var part = this.note.getVoice().getPart().npart;
	var _g1 = part.type;
	switch(_g1[1]) {
	case 3:
		this.level = level * 3;
		break;
	case 2:
		this.level = 0;
		break;
	default:
		this.level = 0;
	}
};
nx3.PNoteHeadsRectTplCalculator.__name__ = true;
nx3.PNoteHeadsRectTplCalculator.prototype = {
	getHeadsRects: function() {
		return [new nx3.geom.Rectangle(-5.5,-5.3 + this.level,10,8.8)];
	}
	,__class__: nx3.PNoteHeadsRectTplCalculator
};
nx3.PNoteHeadsRectsLyricsCalculator = function(note,text,font) {
	this.note = note;
	this.text = text;
	this.font = font;
};
nx3.PNoteHeadsRectsLyricsCalculator.__name__ = true;
nx3.PNoteHeadsRectsLyricsCalculator.prototype = {
	getHeadsRects: function() {
		var target = new nx3.render.TargetSvg();
		if(this.font != null) target.setFont(this.font);
		var width = target.textwidth(this.text);
		var height = target.textheight(this.text);
		return [new nx3.geom.Rectangle(-width / 2,-height / 2,width,height)];
		return null;
	}
	,__class__: nx3.PNoteHeadsRectsLyricsCalculator
};
nx3.PNoteHeadsRectsPausesCalculator = function(vnote) {
	this.vnote = vnote;
};
nx3.PNoteHeadsRectsPausesCalculator.__name__ = true;
nx3.PNoteHeadsRectsPausesCalculator.prototype = {
	getHeadsRects: function() {
		var rects;
		var _g = nx3.ENoteValTools.beaminglevel(this.vnote.nnote.value);
		switch(_g) {
		case 1:
			rects = [new nx3.geom.Rectangle(-1.8,-3,3.6,6)];
			break;
		case 2:
			rects = [new nx3.geom.Rectangle(-2,-3,4,6)];
			break;
		default:
			rects = [new nx3.geom.Rectangle(-1.6,-3.3,3.2,6.6)];
		}
		var level = 0;
		{
			var _g1 = this.vnote.nnote.type;
			switch(_g1[1]) {
			case 1:
				var l = _g1[2];
				level = l;
				break;
			default:
			}
		}
		rects[0].offset(0,level);
		return rects;
	}
	,__class__: nx3.PNoteHeadsRectsPausesCalculator
};
nx3.PNoteHeadsRectsPitchCalculator = function(note) {
	this.note = note;
	{
		var _g = note.nnote.type;
		switch(_g[1]) {
		case 7:
			var midinote = _g[3];
			var level = _g[2];
			this.level = level;
			this.midinote = midinote;
			break;
		default:
		}
	}
	var part = this.note.getVoice().getPart().npart;
	{
		var _g1 = part.type;
		switch(_g1[1]) {
		case 9:
			var l = _g1[2];
			this.chain = true;
			break;
		default:
			this.chain = false;
		}
	}
	{
		var _g2 = part.type;
		switch(_g2[1]) {
		case 9:
			var leveloffset = _g2[2];
			this.partlevel = leveloffset;
			break;
		default:
			this.partlevel = 0;
		}
	}
};
nx3.PNoteHeadsRectsPitchCalculator.__name__ = true;
nx3.PNoteHeadsRectsPitchCalculator.prototype = {
	getHeadsRects: function() {
		if(!this.chain) return [new nx3.geom.Rectangle(-2,-2,1,4)];
		var rlevel = this.level + this.midinote;
		return [new nx3.geom.Rectangle(-2,-2 + rlevel,1,4)];
	}
	,__class__: nx3.PNoteHeadsRectsPitchCalculator
};
nx3.PNoteOffsetCalculator = function(complex) {
	this.complex = complex;
};
nx3.PNoteOffsetCalculator.__name__ = true;
nx3.PNoteOffsetCalculator.prototype = {
	getNoteOffset: function(note) {
		if(note == cx.ArrayTools.first(this.complex.getNotes())) return 0;
		var firstrects = this.complex.notes[0].getHeadsRects();
		var secondrects;
		var _this = this.complex.notes[1].getHeadsRects();
		secondrects = _this.slice();
		var secondoffset = nx3.geom.RectanglesTools.getXIntersection(firstrects,secondrects);
		var firstnote = cx.ArrayTools.first(this.complex.getNotes());
		var diff = note.nnote.get_topLevel() - firstnote.nnote.get_bottomLevel();
		if(diff == 1) secondoffset = secondoffset * 0.8;
		if(diff < 1) {
			if(nx3.ENoteValTools.dotlevel(firstnote.nnote.value) > 0) if(nx3.ENoteValTools.dotlevel(firstnote.nnote.value) == 1) secondoffset += 2.0; else secondoffset += 3.0;
		}
		return secondoffset;
	}
	,__class__: nx3.PNoteOffsetCalculator
};
nx3.PNoteheadsRectsCalculator = function(note) {
	this.note = note;
};
nx3.PNoteheadsRectsCalculator.__name__ = true;
nx3.PNoteheadsRectsCalculator.prototype = {
	getHeadsRects: function() {
		{
			var _g = this.note.nnote.type;
			switch(_g[1]) {
			case 0:
				var a2 = _g[5];
				var a = _g[4];
				var v = _g[3];
				var h = _g[2];
				return new nx3.PHeadsRectsCalculator(this.note).getHeadsRects();
			case 1:
				var l = _g[2];
				return new nx3.PNoteHeadsRectsPausesCalculator(this.note).getHeadsRects();
			case 4:
				var font = _g[5];
				var c = _g[4];
				var o = _g[3];
				var text = _g[2];
				return new nx3.PNoteHeadsRectsLyricsCalculator(this.note,text,font).getHeadsRects();
			case 3:
				var pause = _g[4];
				var sign = _g[3];
				var l1 = _g[2];
				return new nx3.PNoteHeadsRectTplCalculator(this.note).getHeadsRects();
			case 7:
				var m = _g[3];
				var l2 = _g[2];
				return new nx3.PNoteHeadsRectsPitchCalculator(this.note).getHeadsRects();
			default:
				throw "Non implemented ENoteType: " + this.note.nnote.type[0];
				return [];
			}
		}
	}
	,__class__: nx3.PNoteheadsRectsCalculator
};
nx3.PPart = function(npart) {
	this.rect = null;
	this.npart = npart;
	this.value = 0;
};
nx3.PPart.__name__ = true;
nx3.PPart.prototype = {
	iterator: function() {
		var _this = this.getVoices();
		return HxOverrides.iter(_this);
	}
	,get_length: function() {
		return this.getVoices().length;
	}
	,getBar: function() {
		return this.bar;
	}
	,getVoices: function() {
		if(this.voices != null) return this.voices;
		this.voices = [];
		var _g = 0;
		var _g1 = this.npart.nvoices;
		while(_g < _g1.length) {
			var nvoice = _g1[_g];
			++_g;
			var voice = new nx3.PVoice(nvoice);
			voice.part = this;
			this.voices.push(voice);
		}
		return this.voices;
	}
	,getVoice: function(idx) {
		if(idx < 0 || idx > this.getVoices().length) return null; else return this.getVoices()[idx];
	}
	,getComplexes: function() {
		if(this.complexes != null) return this.complexes;
		var generator = new nx3.PPartComplexesGenerator(this);
		this.complexes = generator.getComplexes();
		return this.complexes;
	}
	,getPositionsComplexes: function() {
		if(this.positionsComplexes != null) return this.positionsComplexes;
		this.positionsComplexes = new haxe.ds.IntMap();
		var _g = 0;
		var _g1 = this.getComplexes();
		while(_g < _g1.length) {
			var complex = _g1[_g];
			++_g;
			this.positionsComplexes.set(complex.getValueposition(),complex);
		}
		return this.positionsComplexes;
	}
	,getIndex: function() {
		var _this = this.bar.getParts();
		return HxOverrides.indexOf(_this,this,0);
	}
	,getValue: function() {
		if(this.value != 0) return this.value;
		var _g = 0;
		var _g1 = this.getVoices();
		while(_g < _g1.length) {
			var voice = _g1[_g];
			++_g;
			this.value = Std["int"](Math.max(this.value,voice.getValue()));
		}
		return this.value;
	}
	,getRect: function() {
		if(this.rect != null) return this.rect;
		var result;
		var _g = this.npart.type;
		switch(_g[1]) {
		case 0:
			result = new nx3.geom.Rectangle(0,-8,1,13);
			break;
		default:
			result = new nx3.geom.Rectangle(0,-4,1,8);
		}
		var _g1 = 0;
		var _g11 = this.getComplexes();
		while(_g1 < _g11.length) {
			var complex = _g11[_g1];
			++_g1;
			var cr = complex.getRect();
			result = result.union(cr);
		}
		var _g2 = 0;
		var _g12 = this.getVoices();
		while(_g2 < _g12.length) {
			var voice = _g12[_g2];
			++_g2;
			var _g21 = 0;
			var _g3 = voice.getBeamgroups();
			while(_g21 < _g3.length) {
				var beamgroup = _g3[_g21];
				++_g21;
				var dir = beamgroup.getDirection();
				var frame = beamgroup.getFrame();
				if(frame == null) continue;
				var top;
				if(dir == nx3.EDirectionUD.Up) top = Math.min(frame.leftTipY,frame.rightTipY); else top = 0;
				var bottom;
				if(dir == nx3.EDirectionUD.Up) bottom = 0; else bottom = Math.max(frame.leftTipY,frame.rightTipY);
				var br = new nx3.geom.Rectangle(0,top,1,bottom - top);
				result = result.union(br);
			}
		}
		this.rect = result;
		return result;
	}
	,getYAbove: function() {
		var result = 0.0;
		var index;
		var _this = this.bar.getParts();
		index = HxOverrides.indexOf(_this,this,0);
		if(index == 0) result = this.getRect().y; else {
			var prevPart = this.bar.getPart(index - 1);
			result = prevPart.getRect().get_bottom() + -this.getRect().y;
		}
		return result;
	}
	,__class__: nx3.PPart
};
nx3.PPartComplexesGenerator = function(part) {
	this.part = part;
	this.vvoices = part.getVoices();
};
nx3.PPartComplexesGenerator.__name__ = true;
nx3.PPartComplexesGenerator.prototype = {
	getComplexes: function() {
		if(this.complexes != null) return this.complexes;
		this.positionsMap = this.calcPositionsMap();
		this.calcComplexes(this.positionsMap);
		return this.complexes;
	}
	,calcComplexes: function(positions) {
		this.complexes = [];
		var poskeys = cx.MapTools.keysToArray(positions.keys());
		poskeys = cx.MapTools.sortarray(poskeys);
		var _g = 0;
		while(_g < poskeys.length) {
			var pos = poskeys[_g];
			++_g;
			var vnotes = positions.get(pos);
			var vcomplex = new nx3.PComplex(this.part,vnotes,pos);
			this.complexes.push(vcomplex);
		}
	}
	,calcPositionsMap: function() {
		var positionsMap = new haxe.ds.IntMap();
		var _g = 0;
		var _g1 = this.vvoices;
		while(_g < _g1.length) {
			var vvoice = _g1[_g];
			++_g;
			var _g2 = 0;
			var _g3 = vvoice.getNotes();
			while(_g2 < _g3.length) {
				var vnote = _g3[_g2];
				++_g2;
				var npos;
				var this1 = vvoice.getNotePositions();
				npos = this1.get(vnote);
				if(!positionsMap.exists(npos)) positionsMap.set(npos,[]);
				positionsMap.get(npos).push(vnote);
			}
		}
		return positionsMap;
	}
	,__class__: nx3.PPartComplexesGenerator
};
nx3.PPartbeamgroupsDirectionCalculator = function(ppart) {
	this.ppart = ppart;
};
nx3.PPartbeamgroupsDirectionCalculator.__name__ = true;
nx3.PPartbeamgroupsDirectionCalculator.prototype = {
	calculateBeamgroupsDirections: function() {
		var partbeamgroups = [];
		var _g = 0;
		var _g1 = this.ppart.getVoices();
		while(_g < _g1.length) {
			var pvoice = _g1[_g];
			++_g;
			partbeamgroups.push(pvoice.getBeamgroups());
		}
		var beamgroups0 = partbeamgroups[0];
		var voiceDirection0 = this.ppart.getVoices()[0].nvoice.direction;
		if(voiceDirection0 == null) voiceDirection0 = nx3.EDirectionUAD.Auto;
		if(partbeamgroups.length == 1) {
			var _g2 = 0;
			while(_g2 < beamgroups0.length) {
				var beamgroup = beamgroups0[_g2];
				++_g2;
				var direction = null;
				switch(voiceDirection0[1]) {
				case 0:
					direction = nx3.EDirectionUD.Up;
					break;
				case 2:
					direction = nx3.EDirectionUD.Down;
					break;
				case 1:
					var calculator = new nx3.PBeamgroupDirectionCalculator(beamgroup);
					direction = calculator.getDirection();
					break;
				}
				beamgroup.setDirection(direction);
			}
		} else if(partbeamgroups.length == 2) {
			var beamgroups1 = partbeamgroups[1];
			var voiceDirection1 = this.ppart.getVoices()[1].nvoice.direction;
			if(voiceDirection1 == null) voiceDirection0 = nx3.EDirectionUAD.Auto;
			var voice0 = this.ppart.getVoices()[0];
			var voice1 = this.ppart.getVoices()[1];
			if(voiceDirection0 == nx3.EDirectionUAD.Auto && voiceDirection1 == nx3.EDirectionUAD.Auto) {
				var voice0value = voice0.getValue();
				var voice1value = voice1.getValue();
				var direction1 = null;
				var bgPosition = 0;
				var _g3 = 0;
				while(_g3 < beamgroups0.length) {
					var beamgroup1 = beamgroups0[_g3];
					++_g3;
					if(bgPosition < voice1value) direction1 = nx3.EDirectionUD.Up; else {
						var calculator1 = new nx3.PBeamgroupDirectionCalculator(beamgroup1);
						direction1 = calculator1.getDirection();
					}
					beamgroup1.setDirection(direction1);
					bgPosition += beamgroup1.getValue();
				}
				var bgPosition1 = 0;
				var _g4 = 0;
				while(_g4 < beamgroups1.length) {
					var beamgroup2 = beamgroups1[_g4];
					++_g4;
					if(bgPosition1 < voice0value) direction1 = nx3.EDirectionUD.Down; else {
						var calculator2 = new nx3.PBeamgroupDirectionCalculator(beamgroup2);
						direction1 = calculator2.getDirection();
					}
					beamgroup2.setDirection(direction1);
					bgPosition1 += beamgroup2.getValue();
				}
			} else {
				var _g5 = 0;
				while(_g5 < beamgroups0.length) {
					var beamgroup3 = beamgroups0[_g5];
					++_g5;
					beamgroup3.setDirection(nx3.EDirectionTools.uadToUd(voice0.nvoice.direction));
				}
				var _g6 = 0;
				while(_g6 < beamgroups1.length) {
					var beamgroup4 = beamgroups1[_g6];
					++_g6;
					beamgroup4.setDirection(nx3.EDirectionTools.uadToUd(voice1.nvoice.direction));
				}
			}
		} else throw "SHOULDN'T HAPPEN";
	}
	,__class__: nx3.PPartbeamgroupsDirectionCalculator
};
nx3.PScore = function(nscore) {
	this.prevSystemwidth = 0;
	this.nscore = nscore;
};
nx3.PScore.__name__ = true;
nx3.PScore.prototype = {
	getBars: function() {
		if(this.bars != null) return this.bars;
		this.bars = [];
		var _g = 0;
		var _g1 = this.nscore.nbars;
		while(_g < _g1.length) {
			var nbar = _g1[_g];
			++_g;
			var bar = new nx3.PBar(nbar);
			bar.score = this;
			this.bars.push(bar);
		}
		return this.bars;
	}
	,getNBars: function() {
		var result = [];
		var _g = 0;
		var _g1 = this.getBars();
		while(_g < _g1.length) {
			var bar = _g1[_g];
			++_g;
			result.push(bar.nbar);
		}
		return result;
	}
	,getSystems: function(systemwidth) {
		if(systemwidth != this.prevSystemwidth) this.systems = null;
		if(this.systems != null) return this.systems;
		this.systems = new nx3.PScoreSystemsGenerator(this,this.getBars()).getsSystems([systemwidth]);
		var _g = 0;
		var _g1 = this.systems;
		while(_g < _g1.length) {
			var system = _g1[_g];
			++_g;
			system.calculateSystembarXs();
		}
		var _g2 = 0;
		var _g11 = this.systems;
		while(_g2 < _g11.length) {
			var system1 = _g11[_g2];
			++_g2;
			var ifMoreThan;
			if(system1 != cx.ArrayTools.last(this.systems)) ifMoreThan = 0; else ifMoreThan = system1.getSystemBreakWidth() * .7;
			new nx3.PScoreSystemStretcher(system1).stretchTo(system1.getSystemBreakWidth(),ifMoreThan);
		}
		return this.systems;
	}
	,getBar: function(idx) {
		if(idx < 0 || idx > this.getBars().length) return null; else return this.getBars()[idx];
	}
	,getSystemY: function(system) {
		if(this.systems == null) throw "Systems == null";
		var systemidx = HxOverrides.indexOf(this.systems,system,0);
		var sysY = .0;
		var _g = 0;
		while(_g < systemidx) {
			var i = _g++;
			sysY += this.systems[i].getHeight();
		}
		return sysY;
	}
	,getHeight: function() {
		if(this.systems == null) throw "Systems == null";
		var lastsystem = cx.ArrayTools.last(this.systems);
		return this.getSystemY(lastsystem) + lastsystem.getHeight();
	}
	,getWidth: function() {
		if(this.systems == null) throw "Systems == null";
		var w = .0;
		var _g = 0;
		var _g1 = this.systems;
		while(_g < _g1.length) {
			var sys = _g1[_g];
			++_g;
			w = Math.max(w,sys.getBarsWidth());
		}
		return w;
	}
	,__class__: nx3.PScore
};
nx3.PScoreSystemStretcher = function(system) {
	this.system = system;
};
nx3.PScoreSystemStretcher.__name__ = true;
nx3.PScoreSystemStretcher.prototype = {
	stretchTo: function(stretchSystemToWidth,ifMoreThan) {
		if(ifMoreThan == null) ifMoreThan = 0;
		if(ifMoreThan > 0) {
			if(this.system.getWidth() <= ifMoreThan) return true;
		}
		var diff = stretchSystemToWidth - this.system.getWidth();
		var totalvalue = this.system.getValue();
		var _g = 0;
		var _g1 = this.system.getSystembars();
		while(_g < _g1.length) {
			var systembar = _g1[_g];
			++_g;
			var stretchamount = systembar.bar.getValue() / totalvalue * diff;
			systembar.setBarStretch(stretchamount);
		}
		this.system.calculateSystembarXs();
		return false;
	}
	,__class__: nx3.PScoreSystemStretcher
};
nx3.PScoreSystemsGenerator = function(score,bars) {
	this.bars = bars;
	this.score = score;
};
nx3.PScoreSystemsGenerator.__name__ = true;
nx3.PScoreSystemsGenerator.prototype = {
	getsSystems: function(systemwidths) {
		var tempbars = this.bars.slice();
		var result = new Array();
		var sysidx = 0;
		var prevbarAttributes = null;
		while(tempbars.length > 0) {
			var systemwidthsFirst = systemwidths[0];
			var syswidth;
			if((systemwidths == null?null:sysidx < 0 || sysidx > systemwidths.length - 1?null:systemwidths[sysidx]) != null) syswidth = systemwidths[sysidx]; else syswidth = systemwidthsFirst;
			var generator = new nx3.PSystemBarsGenerator(this.score,tempbars,{ showFirstClef : true, showFirstKey : true, showFirstTime : sysidx == 0},prevbarAttributes,syswidth,new nx3.PBarWidthCalculator());
			var system = generator.getSystem();
			prevbarAttributes = system.getLastBarAttributes();
			result.push(system);
			sysidx++;
		}
		return result;
	}
	,__class__: nx3.PScoreSystemsGenerator
};
nx3.PSignsCalculator = function(notes) {
	this.notes = notes;
};
nx3.PSignsCalculator.__name__ = true;
nx3.PSignsCalculator.prototype = {
	getSigns: function() {
		var signs;
		signs = this.calcUnsortedSigns(this.notes);
		signs = this.calcSortSigns(signs);
		return signs;
	}
	,getVisibleSigns: function() {
		return this.calcVisibleSigns(this.getSigns());
	}
	,calcVisibleSigns: function(signs) {
		var visibleSigns = [];
		var _g = 0;
		while(_g < signs.length) {
			var sign = signs[_g];
			++_g;
			if(sign.sign == nx3.ESign.None) continue;
			visibleSigns.push(sign);
		}
		return visibleSigns;
	}
	,calcUnsortedSigns: function(notes) {
		var PSigns = [];
		var _g = 0;
		while(_g < notes.length) {
			var note = notes[_g];
			++_g;
			var _g1 = 0;
			var _g2 = note.nnote.get_nheads();
			while(_g1 < _g2.length) {
				var nhead = _g2[_g1];
				++_g1;
				var tsign = { sign : nhead.sign, level : nhead.level, position : 0};
				PSigns.push(tsign);
			}
		}
		return PSigns;
	}
	,calcSortSigns: function(PSigns) {
		PSigns.sort(function(a,b) {
			return Reflect.compare(a.level,b.level);
		});
		return PSigns;
	}
	,__class__: nx3.PSignsCalculator
};
nx3.PSignsRectsCalculator = function(signs) {
	this.signs = signs;
};
nx3.PSignsRectsCalculator.__name__ = true;
nx3.PSignsRectsCalculator.prototype = {
	getSignRects: function(headsRects) {
		var rects = new Array();
		if(headsRects == null) headsRects = [];
		var _g = 0;
		var _g1 = this.signs;
		while(_g < _g1.length) {
			var sign = _g1[_g];
			++_g;
			var rect = this.getSignRect(sign.sign);
			rect.offset(-rect.width,sign.level);
			var _g2 = 0;
			while(_g2 < headsRects.length) {
				var hr = headsRects[_g2];
				++_g2;
				var i = rect.intersection(hr);
				var count = 0;
				while(i.width > 0.0000001) {
					rect.offset(-i.width,0);
					i = rect.intersection(hr);
					if(count > 5) break;
					count++;
				}
			}
			var _g21 = 0;
			while(_g21 < rects.length) {
				var r = rects[_g21];
				++_g21;
				var i1 = r.intersection(rect);
				while(i1.width > 0 || i1.height > 0) {
					rect.x = r.x - rect.width;
					i1 = r.intersection(rect);
				}
			}
			rects.push(rect);
		}
		return rects;
	}
	,getSignRect: function(sign) {
		switch(sign[1]) {
		case 0:
			return null;
		case 5:
			return new nx3.geom.Rectangle(0,-1.5,2.6,3);
		case 7:case 8:case 6:
			return new nx3.geom.Rectangle(0,-2,4.4,4);
		case 2:
			return new nx3.geom.Rectangle(0,-3,2.6,5);
		default:
			return new nx3.geom.Rectangle(0,-3,2.6,6);
		}
		throw "This shouldn't happen!";
		return null;
	}
	,__class__: nx3.PSignsRectsCalculator
};
nx3.PStaveRectCalculator = function(note) {
	this.note = note;
};
nx3.PStaveRectCalculator.__name__ = true;
nx3.PStaveRectCalculator.prototype = {
	getStaveRect: function() {
		if(this.note.nnote.type[0] != "Note") return null;
		if(nx3.ENoteValTools.stavinglevel(this.note.nnote.value) < 1) return null;
		var headw;
		var _g = nx3.ENoteValTools.head(this.note.nnote.value);
		switch(_g[1]) {
		case 2:
			headw = 2.2;
			break;
		default:
			headw = 1.6;
		}
		var rect = null;
		if(this.note.getDirection() == nx3.EDirectionUD.Up) rect = new nx3.geom.Rectangle(0,this.note.nnote.get_bottomLevel() - 7,headw,7); else rect = new nx3.geom.Rectangle(-headw,this.note.nnote.get_topLevel(),headw,7);
		rect.offset(this.note.getXOffset(),0);
		return rect;
	}
	,getFlagRect: function() {
		if(this.note.nnote.type[0] != "Note") return null;
		if(nx3.ENoteValTools.beaminglevel(this.note.nnote.value) < 1) return null;
		var beamgroup = this.note.getBeamgroup();
		if(beamgroup != null && beamgroup.pnotes.length == 1) {
			if(nx3.ENoteValTools.beaminglevel(this.note.nnote.value) > 0) {
				var headw;
				var _g = nx3.ENoteValTools.head(this.note.nnote.value);
				switch(_g[1]) {
				case 2:
					headw = 2.2;
					break;
				default:
					headw = 1.6;
				}
				var rect = null;
				if(this.note.getDirection() == nx3.EDirectionUD.Up) rect = new nx3.geom.Rectangle(headw,this.note.nnote.get_bottomLevel() - 7,2.6,4.8); else rect = new nx3.geom.Rectangle(-headw,this.note.nnote.get_topLevel() + 7 - 4.8,2.6,4.8);
				rect.offset(this.note.getXOffset(),0);
				return rect;
			}
		}
		return null;
	}
	,__class__: nx3.PStaveRectCalculator
};
nx3.PSystem = function(score) {
	this.systemBreakWidth = 0;
	this.systembars = [];
	this.width = 0;
	this.score = score;
};
nx3.PSystem.__name__ = true;
nx3.PSystem.prototype = {
	getStatus: function() {
		return this.status;
	}
	,getWidth: function() {
		return this.width;
	}
	,getSystembars: function() {
		return this.systembars;
	}
	,getLastBarAttributes: function() {
		if(this.systembars.length == 0) return null;
		return cx.ArrayTools.last(this.systembars).actAttributes;
	}
	,getSystemBreakWidth: function() {
		return this.systemBreakWidth;
	}
	,getValue: function() {
		if(this.value != null) return this.value;
		this.value = 0;
		var _g = 0;
		var _g1 = this.getSystembars();
		while(_g < _g1.length) {
			var systembar = _g1[_g];
			++_g;
			this.value += systembar.bar.getValue();
		}
		return this.value;
	}
	,calculateSystembarXs: function() {
		var x = 0.0;
		var _g = 0;
		var _g1 = this.getSystembars();
		while(_g < _g1.length) {
			var systemBar = _g1[_g];
			++_g;
			systemBar.xposition = x;
			x += systemBar.getBarMeasurements().getTotalWidth();
		}
	}
	,getSpaceAbovePart: function(partIdx) {
		var distance = 0.0;
		var baridx = 0;
		var _g = 0;
		var _g1 = this.getSystembars();
		while(_g < _g1.length) {
			var systembar = _g1[_g];
			++_g;
			var part = systembar.bar.getPart(partIdx);
			if(part == null) {
				console.log("part == null");
				continue;
			}
			var partdistance = 0.0;
			var partrect = part.getRect();
			if(partIdx == 0) partdistance = -partrect.get_top(); else {
				var prevpart = systembar.bar.getParts()[partIdx - 1];
				var prevpartrect = prevpart.getRect();
				partdistance = prevpartrect.get_bottom() + -partrect.get_top();
			}
			distance = Math.max(distance,partdistance);
			baridx++;
		}
		return distance;
	}
	,getPartY: function(partidx) {
		var party = 0.0;
		var _g1 = 0;
		var _g = partidx + 1;
		while(_g1 < _g) {
			var idx = _g1++;
			party += this.getSpaceAbovePart(idx);
		}
		return party;
	}
	,getTopPartY: function() {
		return this.getPartY(0);
	}
	,getBottomPartY: function() {
		var partcount = this.getSystembars()[0].bar.getParts().length - 1;
		return this.getPartY(partcount);
	}
	,getHeight: function() {
		var partcount = this.getSystembars()[0].bar.getParts().length - 1;
		var partbottom;
		var pb = 0.0;
		var _g = 0;
		var _g1 = this.getSystembars();
		while(_g < _g1.length) {
			var sb = _g1[_g];
			++_g;
			pb = Math.max(pb,sb.bar.getPart(partcount).getRect().get_bottom());
		}
		partbottom = pb;
		return this.getPartY(partcount) + partbottom;
	}
	,getSystembarX: function(systembar) {
		var idx;
		var _this = this.getSystembars();
		idx = HxOverrides.indexOf(_this,systembar,0);
		var x = .0;
		var _g = 0;
		var _g1 = this.getSystembars();
		while(_g < _g1.length) {
			var sb = _g1[_g];
			++_g;
			if(sb == systembar) return x;
			x += sb.getBarMeasurements().getTotalWidth();
		}
		return 0;
	}
	,getBarsWidth: function() {
		var lastbar = cx.ArrayTools.last(this.getSystembars());
		return this.getSystembarX(lastbar) + lastbar.getBarMeasurements().getTotalWidth();
	}
	,getY: function() {
		if(this.score == null) {
			return 0;
			throw "Score == null";
		}
		return this.score.getSystemY(this);
	}
	,__class__: nx3.PSystem
};
nx3.PSystemBar = function(system,bar,barConfig,barMeasurements,actAttributes,caAttributes) {
	this.stretchamount = 0;
	this.system = system;
	this.bar = bar;
	this.bar.systembar = this;
	this.barConfig = barConfig;
	this.barMeasurements = barMeasurements;
	this.actAttributes = actAttributes;
	this.caAttributes = caAttributes;
};
nx3.PSystemBar.__name__ = true;
nx3.PSystemBar.prototype = {
	setBarStretch: function(amount) {
		if(amount == this.stretchamount) return;
		var calculator = new nx3.PBarStretchCalculator(this);
		if(amount == 0) calculator.resetStretch(); else calculator.stretch(amount);
	}
	,getBarMeasurements: function() {
		if(this.barMeasurements != null) return this.barMeasurements;
		this.barMeasurements = new nx3.PSystembarMeasurements(this.bar).init(this.actAttributes,this.barConfig,this.caAttributes);
		return this.barMeasurements;
	}
	,getXPosition: function() {
		return this.xposition;
	}
	,getX: function() {
		if(this.system == null) throw "System == null";
		return this.system.getSystembarX(this);
	}
	,__class__: nx3.PSystemBar
};
nx3.PSystemBarsGenerator = function(score,bars,systemConfig,prevBarAttributes,breakSystemwidth,barWidthCalculator) {
	this.score = score;
	this.bars = bars;
	this.systemConfig = systemConfig;
	this.prevBarAttributes = prevBarAttributes;
	this.breakSystemwidth = breakSystemwidth;
	this.system = new nx3.PSystem(this.score);
	this.barWidthCalculator = barWidthCalculator;
};
nx3.PSystemBarsGenerator.__name__ = true;
nx3.PSystemBarsGenerator.prototype = {
	getSystem: function() {
		this.system.systemBreakWidth = this.breakSystemwidth;
		var tryAnotherBar = true;
		while(tryAnotherBar) {
			var currentBar = this.bars[0];
			var currentBarConfig = new nx3.PBarConfig();
			var currentBarAttributes = this.getBarAttributes(currentBar);
			if(this.prevBarAttributes != null) this.overrideActualAttributesFromPrevBarAttributes(currentBarAttributes,currentBar,this.prevBarAttributes);
			this.overrideActualAttributesWithDefaultsIfStillNotSet(currentBarAttributes);
			if(this.system.getSystembars().length == 0) this.adaptBarConfig(currentBar,currentBarConfig,this.prevBarAttributes,this.systemConfig.showFirstClef,this.systemConfig.showFirstKey,this.systemConfig.showFirstTime); else this.adaptBarConfig(currentBar,currentBarConfig,this.prevBarAttributes,this.systemConfig.showFollowingClef,this.systemConfig.showFollowingKey,this.systemConfig.showFollowingTime);
			var currentMeasurements = new nx3.PSystembarMeasurements(currentBar).init(currentBarAttributes,currentBarConfig);
			var testSystemWidth = this.system.width + currentMeasurements.getTotalWidth();
			if(testSystemWidth > this.breakSystemwidth) {
				this.takeCareOfLastBarCautions();
				return this.system;
			}
			this.system.width += currentMeasurements.getTotalWidth();
			this.system.getSystembars().push(new nx3.PSystemBar(this.system,currentBar,currentBarConfig,currentMeasurements,currentBarAttributes,null));
			this.bars.shift();
			this.prevBarAttributes = this.copyBarAttributes(currentBarAttributes);
			if(this.bars.length < 1) tryAnotherBar = false;
		}
		this.system.status = nx3.PSystemStatus.Ok;
		return this.system;
	}
	,takeCareOfLastBarCautions: function() {
		this.system.status = nx3.PSystemStatus.Ok;
		var sysBar = cx.ArrayTools.last(this.system.getSystembars()).bar;
		var sysBarAttributes = cx.ArrayTools.last(this.system.getSystembars()).actAttributes;
		if(sysBar != cx.ArrayTools.last(this.bars)) {
			var nextBar = this.bars[0];
			var nextBarAttributes = this.getBarAttributes(nextBar);
			var newClef = this.arrayBNullOrDiffers(sysBarAttributes.clefs,nextBarAttributes.clefs);
			var newKey = this.arrayBNullOrDiffers(sysBarAttributes.keys,nextBarAttributes.keys);
			var newTime = this.nullOrDiffers(sysBarAttributes.time,nextBarAttributes.time);
			if(newClef || newKey || newTime) {
				var sysBarCautAttributes = this.copyAndRemoveRedundantAttributes(sysBarAttributes,nextBarAttributes);
				var sysBarConfig = cx.ArrayTools.last(this.system.getSystembars()).barConfig;
				var sysBarWidth = cx.ArrayTools.last(this.system.getSystembars()).getBarMeasurements().getTotalWidth();
				var systemWidthWithoutLastBar = this.system.width - sysBarWidth;
				var sysBarConfigWithCautions = new nx3.PBarConfig(sysBarConfig.showClef,sysBarConfig.showKey,sysBarConfig.showTime);
				if(newClef) sysBarConfigWithCautions.showCautClef = true;
				if(newKey) sysBarConfigWithCautions.showCautKey = true;
				if(newTime) sysBarConfigWithCautions.showCautTime = true;
				var measurementsWithCautions = new nx3.PSystembarMeasurements(sysBar).init(sysBarAttributes,sysBarConfigWithCautions,sysBarCautAttributes);
				if(systemWidthWithoutLastBar + measurementsWithCautions.getTotalWidth() <= this.breakSystemwidth) {
					cx.ArrayTools.last(this.system.getSystembars()).caAttributes = sysBarCautAttributes;
					cx.ArrayTools.last(this.system.getSystembars()).barConfig = sysBarConfigWithCautions;
					this.system.width = this.system.getWidth() - sysBarWidth + cx.ArrayTools.last(this.system.getSystembars()).getBarMeasurements().getTotalWidth();
				} else {
					this.system.status = nx3.PSystemStatus.Problem(101,"Last bar fits without caution attributes but not with them");
					if(this.system.getSystembars().length == 1) {
						this.system.status = nx3.PSystemStatus.Problem(102,"First bar doesn't fit when adding required cational attributes");
						return;
					}
					this.system.getSystembars().pop();
					this.bars.unshift(sysBar);
					this.system.width = this.system.width - sysBarWidth;
					this.system.status = nx3.PSystemStatus.Ok;
				}
			}
		}
	}
	,copyAndRemoveRedundantAttributes: function(sysBarAttributes,nextBarAttributes) {
		var result = this.copyBarAttributes(nextBarAttributes);
		var _g1 = 0;
		var _g = sysBarAttributes.clefs.length;
		while(_g1 < _g) {
			var i = _g1++;
			if(result.clefs[i] == sysBarAttributes.clefs[i]) result.clefs[i] = null;
		}
		var _g11 = 0;
		var _g2 = sysBarAttributes.keys.length;
		while(_g11 < _g2) {
			var i1 = _g11++;
			if(result.keys[i1] == sysBarAttributes.keys[i1]) result.keys[i1] = null;
		}
		if(result.time == sysBarAttributes.time) result.time = null;
		return result;
	}
	,adaptBarConfig: function(bar,barConfig,prevBarAttributes,showClef,showKey,showTime) {
		if(showClef == true) showClef = true; else showClef = false;
		if(showKey == true) showKey = true; else showKey = false;
		if(showTime == true) showTime = true; else showTime = false;
		var barAttributes = this.getBarAttributes(bar);
		var _g = bar.get_displayClefs();
		switch(_g[1]) {
		case 2:
			barConfig.showClef = false;
			break;
		case 0:
			barConfig.showClef = true;
			break;
		default:
			barConfig.showClef = showClef;
			if(showClef == false && prevBarAttributes != null) {
				var _g2 = 0;
				var _g1 = prevBarAttributes.clefs.length;
				while(_g2 < _g1) {
					var i = _g2++;
					if(bar.get_clefs()[i] == null) continue;
					if(bar.get_clefs()[i] == prevBarAttributes.clefs[i]) continue;
					barConfig.showClef = true;
					break;
				}
			}
		}
		var _g3 = bar.get_displayKeys();
		switch(_g3[1]) {
		case 2:
			barConfig.showKey = false;
			break;
		case 0:
			barConfig.showKey = true;
			break;
		default:
			barConfig.showKey = showKey;
			if(showKey == false && prevBarAttributes != null) {
				var _g21 = 0;
				var _g11 = prevBarAttributes.keys.length;
				while(_g21 < _g11) {
					var i1 = _g21++;
					if(bar.get_keys()[i1] == null) continue;
					if(bar.get_keys()[i1] == prevBarAttributes.keys[i1]) continue;
					barConfig.showKey = true;
					break;
				}
			}
		}
		var _g4 = bar.get_displayTime();
		switch(_g4[1]) {
		case 2:
			barConfig.showTime = false;
			break;
		case 0:
			barConfig.showTime = true;
			break;
		default:
			barConfig.showTime = showTime;
			if(showTime == false && prevBarAttributes != null) {
				if(bar.get_time() == null) {
				} else if(bar.get_time() == prevBarAttributes.time) {
				} else barConfig.showTime = true;
			}
		}
	}
	,copyBarAttributes: function(barAttributes) {
		var result = { clefs : new Array(), keys : new Array(), time : null};
		result.clefs = barAttributes.clefs.slice();
		result.keys = barAttributes.keys.slice();
		result.time = barAttributes.time;
		return result;
	}
	,overrideActualAttributesWithDefaultsIfStillNotSet: function(currentBarAttributes) {
		var _g1 = 0;
		var _g = currentBarAttributes.clefs.length;
		while(_g1 < _g) {
			var i = _g1++;
			if(currentBarAttributes.clefs[i] == null) currentBarAttributes.clefs[i] = nx3.PSystemBarsGenerator.defaultClef;
		}
		var _g11 = 0;
		var _g2 = currentBarAttributes.keys.length;
		while(_g11 < _g2) {
			var i1 = _g11++;
			if(currentBarAttributes.keys[i1] == null) currentBarAttributes.keys[i1] = nx3.PSystemBarsGenerator.defaultKey;
		}
		if(currentBarAttributes.time == null) currentBarAttributes.time = nx3.PSystemBarsGenerator.defaultTime;
	}
	,overrideActualAttributesFromPrevBarAttributes: function(currentBarAttributes,currentBar,prevBarAttributes) {
		if(!this.compareBarAttributesValidity(currentBarAttributes,prevBarAttributes)) throw "Attributes non compatible";
		var _g1 = 0;
		var _g = currentBar.get_clefs().length;
		while(_g1 < _g) {
			var i = _g1++;
			if(currentBar.get_clefs()[i] == null && prevBarAttributes.clefs[i] != null) currentBarAttributes.clefs[i] = prevBarAttributes.clefs[i];
		}
		var _g11 = 0;
		var _g2 = currentBar.get_keys().length;
		while(_g11 < _g2) {
			var i1 = _g11++;
			if(currentBar.get_keys()[i1] == null && prevBarAttributes.keys[i1] != null) currentBarAttributes.keys[i1] = prevBarAttributes.keys[i1];
		}
		if(currentBar.get_time() == null && prevBarAttributes.time != null) currentBarAttributes.time = prevBarAttributes.time;
	}
	,getBarAttributes: function(bar) {
		var time = cx.ArrayTools.first((function($this) {
			var $r;
			var _this = [bar.get_time()];
			$r = _this.slice();
			return $r;
		}(this)));
		var result = { clefs : (function($this) {
			var $r;
			var _this1 = bar.get_clefs();
			$r = _this1.slice();
			return $r;
		}(this)), keys : (function($this) {
			var $r;
			var _this2 = bar.get_keys();
			$r = _this2.slice();
			return $r;
		}(this)), time : time};
		return result;
	}
	,compareBarAttributesValidity: function(barAttributesA,barAttributesB) {
		if(barAttributesA.clefs.length != barAttributesB.clefs.length) return false;
		if(barAttributesA.keys.length != barAttributesB.keys.length) return false;
		return true;
	}
	,arrayBNullOrDiffers: function(itemA,itemB) {
		if(cx.ArrayTools.allNull(itemB)) return false;
		var _g1 = 0;
		var _g = itemA.length;
		while(_g1 < _g) {
			var i = _g1++;
			if(itemB[i] != null && itemB[i] != itemA[i]) return true;
		}
		return false;
	}
	,nullOrDiffers: function(itemA,itemB) {
		if(itemB == null) return false;
		return itemB != itemA;
	}
	,__class__: nx3.PSystemBarsGenerator
};
nx3.PSystemStatus = { __ename__ : true, __constructs__ : ["Ok","Problem"] };
nx3.PSystemStatus.Ok = ["Ok",0];
nx3.PSystemStatus.Ok.toString = $estr;
nx3.PSystemStatus.Ok.__enum__ = nx3.PSystemStatus;
nx3.PSystemStatus.Problem = function(code,msg) { var $x = ["Problem",1,code,msg]; $x.__enum__ = nx3.PSystemStatus; $x.toString = $estr; return $x; };
nx3.PSystembarMeasurements = function(bar) {
	this.barlineWidth = 0;
	this.cautTimeWidth = 0;
	this.cautKeyWidth = 0;
	this.cautClefWidth = 0;
	this.contentWidth = 0;
	this.contentXZero = 0;
	this.leftContentMarginWidth = 0;
	this.timeWidth = 0;
	this.keyWidth = 0;
	this.clefWidth = 0;
	this.ackoladeWidth = 0;
	this.bar = bar;
};
nx3.PSystembarMeasurements.__name__ = true;
nx3.PSystembarMeasurements.prototype = {
	getAckoladeXPosition: function() {
		return 0;
	}
	,getClefXPosition: function() {
		return this.getAckoladeXPosition() + this.ackoladeWidth;
	}
	,getKeyXPosition: function() {
		return this.getClefXPosition() + this.clefWidth;
	}
	,getTimeXPosition: function() {
		return this.getKeyXPosition() + this.keyWidth;
	}
	,getLeftContentMarginXPosition: function() {
		return this.getTimeXPosition() + this.timeWidth;
	}
	,getContentXZero: function() {
		return this.contentXZero;
	}
	,getContentXPosition: function() {
		return this.getLeftContentMarginXPosition() + this.leftContentMarginWidth;
	}
	,getContentWidth: function() {
		return this.contentWidth;
	}
	,setContentWidth: function(val) {
		this.contentWidth = val;
	}
	,getCautClefXPosition: function() {
		return this.getContentXPosition() + this.contentWidth;
	}
	,getCautKeyXPosition: function() {
		return this.getCautClefXPosition() + this.cautClefWidth;
	}
	,getCautTimeXPosition: function() {
		return this.getCautKeyXPosition() + this.cautKeyWidth;
	}
	,getBarlineXPosition: function() {
		return this.getCautTimeXPosition() + this.cautTimeWidth;
	}
	,getTotalWidth: function() {
		return this.getBarlineXPosition() + this.barlineWidth;
	}
	,init: function(barAttributes,barConfig,cautAttributes) {
		var calculator = new nx3.PBarWidthCalculator();
		this.ackoladeWidth = calculator.getLeftBarlineWidth(nx3.EBarlineLeft.None);
		if(barConfig.showClef) this.clefWidth = calculator.getClefsWidth(barAttributes.clefs);
		if(barConfig.showKey) this.keyWidth = calculator.getKeysWidth(barAttributes.keys);
		if(barConfig.showTime) this.timeWidth += calculator.getTimeWidth(barAttributes.time);
		this.leftContentMarginWidth = calculator.getContentLeftMarginWidth(this.bar);
		this.contentWidth = calculator.getContentWidth(this.bar);
		this.contentXZero = this.bar.getContentXZero();
		if(barConfig.showCautClef && cautAttributes != null) this.cautClefWidth = calculator.getClefsWidth(cautAttributes.clefs);
		if(barConfig.showCautKey && cautAttributes != null) this.cautKeyWidth = calculator.getKeysWidth(cautAttributes.keys);
		if(barConfig.showCautTime && cautAttributes != null) this.cautTimeWidth += calculator.getTimeWidth(cautAttributes.time);
		this.barlineWidth = calculator.getBarlineWidth(nx3.EBarline.Normal);
		return this;
	}
	,__class__: nx3.PSystembarMeasurements
};
nx3.PSystemsTools = function(systems) {
	this.systems = systems;
};
nx3.PSystemsTools.__name__ = true;
nx3.PSystemsTools.prototype = {
	getColumns: function() {
		if(this.columns != null) return this.columns;
		this.columns = [];
		var _g = 0;
		var _g1 = this.systems;
		while(_g < _g1.length) {
			var system = _g1[_g];
			++_g;
			var _g2 = 0;
			var _g3 = system.getSystembars();
			while(_g2 < _g3.length) {
				var sysbar = _g3[_g2];
				++_g2;
				var _g4 = 0;
				var _g5 = sysbar.bar.getColumns();
				while(_g4 < _g5.length) {
					var column = _g5[_g4];
					++_g4;
					this.columns.push(column);
				}
			}
		}
		return this.columns;
	}
	,getColumnsSysbars: function() {
		if(this.columnsSysbars != null) return this.columnsSysbars;
		this.columnsSysbars = new haxe.ds.ObjectMap();
		var _g = 0;
		var _g1 = this.systems;
		while(_g < _g1.length) {
			var system = _g1[_g];
			++_g;
			var _g2 = 0;
			var _g3 = system.getSystembars();
			while(_g2 < _g3.length) {
				var sysbar = _g3[_g2];
				++_g2;
				var _g4 = 0;
				var _g5 = sysbar.bar.getColumns();
				while(_g4 < _g5.length) {
					var column = _g5[_g4];
					++_g4;
					this.columnsSysbars.set(column,sysbar);
				}
			}
		}
		return this.columnsSysbars;
	}
	,getColumnsPointH: function() {
		if(this.columnsPointH != null) return this.columnsPointH;
		this.columnsPointH = new haxe.ds.ObjectMap();
		var ADD_TO_ENDS = 4;
		var _g = 0;
		var _g1 = this.getColumns();
		while(_g < _g1.length) {
			var column = _g1[_g];
			++_g;
			var sysbar;
			var this1 = this.getColumnsSysbars();
			sysbar = this1.get(column);
			var contentX = sysbar.getBarMeasurements().getContentXPosition();
			var columnX = column.getSPosition();
			var sysbarX = sysbar.getXPosition();
			var systemY = sysbar.system.getY();
			var x = sysbarX + contentX + columnX;
			var y = systemY + sysbar.system.getTopPartY() - ADD_TO_ENDS;
			var y2 = systemY + sysbar.system.getBottomPartY() + ADD_TO_ENDS;
			var h = y2 - y;
			this.columnsPointH.set(column,{ x : x, y : y, height : h});
		}
		return this.columnsPointH;
	}
	,getNotes: function() {
		if(this.pnotes != null) return this.pnotes; else this.pnotes = [];
		var _g = 0;
		var _g1 = this.systems;
		while(_g < _g1.length) {
			var system = _g1[_g];
			++_g;
			var _g2 = 0;
			var _g3 = system.getSystembars();
			while(_g2 < _g3.length) {
				var sysbar = _g3[_g2];
				++_g2;
				var $it0 = sysbar.bar.iterator();
				while( $it0.hasNext() ) {
					var part = $it0.next();
					var $it1 = part.iterator();
					while( $it1.hasNext() ) {
						var voice = $it1.next();
						var $it2 = voice.iterator();
						while( $it2.hasNext() ) {
							var note = $it2.next();
							this.pnotes.push(note);
						}
					}
				}
			}
		}
		return this.pnotes;
	}
	,getNotesParts: function() {
		if(this.pnotesParts != null) return this.pnotesParts; else this.pnotesParts = new haxe.ds.ObjectMap();
		var _g = 0;
		var _g1 = this.systems;
		while(_g < _g1.length) {
			var system = _g1[_g];
			++_g;
			var _g2 = 0;
			var _g3 = system.getSystembars();
			while(_g2 < _g3.length) {
				var sysbar = _g3[_g2];
				++_g2;
				var $it0 = sysbar.bar.iterator();
				while( $it0.hasNext() ) {
					var part = $it0.next();
					var $it1 = part.iterator();
					while( $it1.hasNext() ) {
						var voice = $it1.next();
						var $it2 = voice.iterator();
						while( $it2.hasNext() ) {
							var note = $it2.next();
							this.pnotesParts.set(note,part);
						}
					}
				}
			}
		}
		return this.pnotesParts;
	}
	,getNotesRects: function() {
		if(this.pnotesRects != null) return this.pnotesRects; else this.pnotesRects = new haxe.ds.ObjectMap();
		var _g = 0;
		var _g1 = this.getNotes();
		while(_g < _g1.length) {
			var note = _g1[_g];
			++_g;
			var column = note.getComplex().getColumn();
			var columnPointH;
			var this1 = this.getColumnsPointH();
			columnPointH = this1.get(column);
			var part;
			var this2 = this.getNotesParts();
			part = this2.get(note);
			var partIdx = part.getIndex();
			var sysbar;
			var this3 = this.getColumnsSysbars();
			sysbar = this3.get(column);
			var system = sysbar.system;
			var noteRect = nx3.geom.RectangleTools.union(note.getHeadsRects());
			noteRect.offset(columnPointH.x,system.getY() + system.getPartY(partIdx));
			this.pnotesRects.set(note,noteRect);
		}
		return this.pnotesRects;
	}
	,getNoteFromCoord: function(x,y) {
		var point = new nx3.geom.Point(x,y);
		var _g = 0;
		var _g1 = this.getNotes();
		while(_g < _g1.length) {
			var note = _g1[_g];
			++_g;
			var rect;
			var this1 = this.getNotesRects();
			rect = this1.get(note);
			if(rect.containsPoint(point)) return note;
		}
		return null;
	}
	,getNBarsFromSystems: function() {
		if(this.nbars != null) return this.nbars; else this.nbars = [];
		var _g = 0;
		var _g1 = this.systems;
		while(_g < _g1.length) {
			var system = _g1[_g];
			++_g;
			var _g2 = 0;
			var _g3 = system.getSystembars();
			while(_g2 < _g3.length) {
				var sysbar = _g3[_g2];
				++_g2;
				var nbar = sysbar.bar.nbar;
				this.nbars.push(nbar);
			}
		}
		return this.nbars;
	}
	,getNotesNotenritems: function() {
		if(this.notesNotenritems != null) return this.notesNotenritems;
		this.notesNotenritems = new haxe.ds.ObjectMap();
		var nbars = this.getNBarsFromSystems();
		if(nx3.utils.VoiceSplitter.canSplit(nbars)) nbars = new nx3.utils.VoiceSplitter(nbars).getVoicesplittedNBars();
		var partsnotes = new nx3.audio.NotenrBarsCalculator(nbars).getPartsNotenrItems();
		this.notesNotenritems = nx3.audio.NotenrTools.getNotesNotenritems(partsnotes);
		return this.notesNotenritems;
	}
	,getColumnsPositions: function() {
		if(this.columnsPositions != null) return this.columnsPositions;
		this.columnsPositions = new haxe.ds.ObjectMap();
		var barpos = 0;
		var _g = 0;
		var _g1 = this.systems;
		while(_g < _g1.length) {
			var system = _g1[_g];
			++_g;
			var _g2 = 0;
			var _g3 = system.getSystembars();
			while(_g2 < _g3.length) {
				var sysbar = _g3[_g2];
				++_g2;
				var _g4 = 0;
				var _g5 = sysbar.bar.getColumns();
				while(_g4 < _g5.length) {
					var column = _g5[_g4];
					++_g4;
					var value = column.getValueposition() + barpos;
					this.columnsPositions.set(column,value);
				}
				barpos += sysbar.bar.getValue();
			}
		}
		return this.columnsPositions;
	}
	,getColumnsTimeFixed: function(fixedTempoBPM,beatfactor) {
		if(beatfactor == null) beatfactor = 1.0;
		if(fixedTempoBPM == null) fixedTempoBPM = 60;
		if(this.columnsTime != null) return this.columnsTime;
		this.columnsTime = new haxe.ds.ObjectMap();
		var columnsPositions = this.getColumnsPositions();
		var $it0 = columnsPositions.keys();
		while( $it0.hasNext() ) {
			var column = $it0.next();
			var position = columnsPositions.h[column.__id__];
			var time = position / 3024 / (fixedTempoBPM / 60) / beatfactor;
			this.columnsTime.set(column,time);
		}
		return this.columnsTime;
	}
	,getTimesColumns: function(fixedTempoBPM,beatfactor) {
		if(beatfactor == null) beatfactor = 1.0;
		if(fixedTempoBPM == null) fixedTempoBPM = 60;
		if(this.timesColumns != null) return this.timesColumns;
		var columnsTime = this.getColumnsTimeFixed(fixedTempoBPM,beatfactor);
		this.timesColumns = [];
		var $it0 = columnsTime.keys();
		while( $it0.hasNext() ) {
			var column = $it0.next();
			this.timesColumns.push({ time : columnsTime.h[column.__id__], column : column});
		}
		this.timesColumns.sort(function(a,b) {
			return Reflect.compare(a.time,b.time);
		});
		return this.timesColumns;
	}
	,__class__: nx3.PSystemsTools
};
nx3.PVoice = function(nvoice) {
	this.nvoice = nvoice;
};
nx3.PVoice.__name__ = true;
nx3.PVoice.prototype = {
	iterator: function() {
		var _this = this.getNotes();
		return HxOverrides.iter(_this);
	}
	,get_length: function() {
		return this.getNotes().length;
	}
	,getPart: function() {
		return this.part;
	}
	,getNotes: function() {
		if(this.notes != null) return this.notes;
		this.notes = [];
		var _g = 0;
		var _g1 = this.nvoice.nnotes;
		while(_g < _g1.length) {
			var nnote = _g1[_g];
			++_g;
			var pnote = new nx3.PNote(nnote);
			pnote.voice = this;
			this.notes.push(pnote);
		}
		return this.notes;
	}
	,getNote: function(idx) {
		if(idx < 0 || idx > this.getNotes().length) return null; else return this.getNotes()[idx];
	}
	,getValue: function() {
		if(this.value != null) return this.value;
		if(this.notes == null) this.getNotes();
		this.value = 0;
		var _g = 0;
		var _g1 = this.notes;
		while(_g < _g1.length) {
			var pnote = _g1[_g];
			++_g;
			this.value += nx3.ENoteValTools.value(pnote.nnote.value);
		}
		return this.value;
	}
	,getBeamgroups: function(pattern) {
		if(pattern != null && pattern != this.beampattern) {
			this.beampattern = pattern;
			this.beamgroups = null;
		}
		if(this.beamgroups != null) return this.beamgroups;
		this.beamgroups = new nx3.PVoiceBeamgroupsGenerator(this.getNotes(),pattern).getBeamgroups();
		return this.beamgroups;
	}
	,getNotePositions: function() {
		if(this.pnotePositions != null) return this.pnotePositions;
		if(this.notes == null) this.getNotes();
		this.pnotePositions = new haxe.ds.ObjectMap();
		var pos = 0;
		var _g = 0;
		var _g1 = this.notes;
		while(_g < _g1.length) {
			var pnote = _g1[_g];
			++_g;
			this.pnotePositions.set(pnote,pos);
			pos += nx3.ENoteValTools.value(pnote.nnote.value);
		}
		return this.pnotePositions;
	}
	,__class__: nx3.PVoice
};
nx3.PVoiceBeamgroupsGenerator = function(pnotes,pattern) {
	if(pattern == null) pattern = [nx3.ENoteVal.Nv4];
	this.voice = pnotes[0].getVoice();
	this.notes = pnotes;
	this.pattern = pattern;
	this.adjustPatternLenght();
};
nx3.PVoiceBeamgroupsGenerator.__name__ = true;
nx3.PVoiceBeamgroupsGenerator.prototype = {
	getBeamgroups: function() {
		var patternPositions = this.getPatternPositions();
		var notesPositions = this.getNotesPositions();
		var notesBeamgroupPosIndexes = this.getNotesBeamgroupPosIndexes(patternPositions,notesPositions);
		var beamgroups = this.createBeamgroups(notesBeamgroupPosIndexes);
		return beamgroups;
	}
	,createBeamgroups: function(indexes) {
		var noteIdx = 0;
		var prevBeamgroupPosIdx = -1;
		var groupIdx = -1;
		var result = [];
		var pnoteGroupIdx = [];
		var groupIdxpnotes = [];
		var _g = 0;
		var _g1 = this.notes;
		while(_g < _g1.length) {
			var pnote = _g1[_g];
			++_g;
			var beamgroupPosIdx = indexes[noteIdx];
			if(beamgroupPosIdx == -1) {
				groupIdx++;
				pnoteGroupIdx.push(groupIdx);
			} else {
				if(prevBeamgroupPosIdx != beamgroupPosIdx) groupIdx++;
				pnoteGroupIdx.push(groupIdx);
			}
			prevBeamgroupPosIdx = beamgroupPosIdx;
			noteIdx++;
		}
		var noteIdx1 = 0;
		var grouppnotes = [];
		var pnotes = null;
		var _g2 = 0;
		var _g11 = this.notes;
		while(_g2 < _g11.length) {
			var pnote1 = _g11[_g2];
			++_g2;
			var groupIdx1 = pnoteGroupIdx[noteIdx1];
			if(grouppnotes[groupIdx1] == null) grouppnotes[groupIdx1] = [];
			grouppnotes[groupIdx1].push(pnote1);
			noteIdx1++;
		}
		var _g3 = 0;
		while(_g3 < grouppnotes.length) {
			var group = grouppnotes[_g3];
			++_g3;
			var beamgroup = new nx3.PBeamgroup(group);
			result.push(beamgroup);
		}
		return result;
	}
	,getNotesBeamgroupPosIndexes: function(patternPositions,notesPositions) {
		var findPatternIdxForNote = function(curNotePos) {
			var _g1 = 0;
			var _g = patternPositions.length;
			while(_g1 < _g) {
				var p = _g1++;
				var curPatternPos = patternPositions[p];
				if(curNotePos.start >= curPatternPos.start && curNotePos.end <= curPatternPos.end) return p;
			}
			return -1;
		};
		var result = [];
		var p1 = 0;
		var curPatternPos1 = patternPositions[p1];
		var _g11 = 0;
		var _g2 = this.notes.length;
		while(_g11 < _g2) {
			var n = _g11++;
			var curNotePos1 = notesPositions[n];
			var nnote = this.notes[n].nnote;
			var patternIdx;
			{
				var _g21 = nnote.type;
				switch(_g21[1]) {
				case 0:
					var attributes = _g21[5];
					var articluation = _g21[4];
					var variant = _g21[3];
					var heads = _g21[2];
					if(nx3.ENoteValTools.beaminglevel(nnote.value) <= 0) patternIdx = -1; else patternIdx = findPatternIdxForNote(curNotePos1);
					break;
				case 1:
					var level = _g21[2];
					patternIdx = -1;
					break;
				default:
					patternIdx = -1;
				}
			}
			result.push(patternIdx);
		}
		return result;
	}
	,getNotesPositions: function() {
		var result = [];
		var currPos = 0;
		var _g = 0;
		var _g1 = this.notes;
		while(_g < _g1.length) {
			var pnote = _g1[_g];
			++_g;
			var value = nx3.ENoteValTools.value(pnote.nnote.value);
			var posinfo = { start : currPos, end : currPos + value};
			result.push(posinfo);
			currPos += value;
		}
		return result;
	}
	,getPatternPositions: function() {
		var result = [];
		var currPos = 0;
		var _g = 0;
		var _g1 = this.pattern;
		while(_g < _g1.length) {
			var segment = _g1[_g];
			++_g;
			var value = nx3.ENoteValTools.value(segment);
			var posinfo = { start : currPos, end : currPos + value};
			result.push(posinfo);
			currPos += value;
		}
		return result;
	}
	,adjustPatternLenght: function() {
		var notesValue = 0;
		var _g = 0;
		var _g1 = this.notes;
		while(_g < _g1.length) {
			var pnote = _g1[_g];
			++_g;
			notesValue += nx3.ENoteValTools.value(pnote.nnote.value);
		}
		var patternValue = 0;
		var _g2 = 0;
		var _g11 = this.pattern;
		while(_g2 < _g11.length) {
			var value = _g11[_g2];
			++_g2;
			patternValue += nx3.ENoteValTools.value(value);
		}
		while(patternValue < notesValue) {
			this.pattern = this.pattern.concat(this.pattern);
			patternValue *= 2;
		}
	}
	,__class__: nx3.PVoiceBeamgroupsGenerator
};
nx3.QNote = function(headLevel,headLevels,head,heads,value,signs,direction) {
	if(signs == null) signs = "";
	signs += "...........";
	var aSigns = signs.split("");
	if(headLevel != null) headLevels = [headLevel];
	if(headLevels != null) {
		heads = [];
		var i = 0;
		var _g = 0;
		while(_g < headLevels.length) {
			var level = headLevels[_g];
			++_g;
			heads.push(new nx3.NHead(null,level,this.getSign(aSigns[i++])));
		}
	}
	if(head != null) heads = [head];
	if(heads == null) heads = [new nx3.NHead(null,0)];
	if(value == null) value = nx3.ENoteVal.Nv4;
	nx3.NNote.call(this,null,heads,value,direction);
};
nx3.QNote.__name__ = true;
nx3.QNote.__super__ = nx3.NNote;
nx3.QNote.prototype = $extend(nx3.NNote.prototype,{
	getSign: function(val) {
		switch(val) {
		case "#":
			return nx3.ESign.Sharp;
		case "b":
			return nx3.ESign.Flat;
		case "N":case "n":
			return nx3.ESign.Natural;
		default:
			return null;
		}
	}
	,__class__: nx3.QNote
});
nx3.QPause16 = function(level) {
	if(level == null) level = 0;
	nx3.NNote.call(this,nx3.ENoteType.Pause(level),null,nx3.ENoteVal.Nv16);
};
nx3.QPause16.__name__ = true;
nx3.QPause16.__super__ = nx3.NNote;
nx3.QPause16.prototype = $extend(nx3.NNote.prototype,{
	__class__: nx3.QPause16
});
nx3.QPause8 = function(level) {
	if(level == null) level = 0;
	nx3.NNote.call(this,nx3.ENoteType.Pause(level),null,nx3.ENoteVal.Nv8);
};
nx3.QPause8.__name__ = true;
nx3.QPause8.__super__ = nx3.NNote;
nx3.QPause8.prototype = $extend(nx3.NNote.prototype,{
	__class__: nx3.QPause8
});
nx3.QPause4 = function(level) {
	if(level == null) level = 0;
	nx3.NNote.call(this,nx3.ENoteType.Pause(level),null,nx3.ENoteVal.Nv4);
};
nx3.QPause4.__name__ = true;
nx3.QPause4.__super__ = nx3.NNote;
nx3.QPause4.prototype = $extend(nx3.NNote.prototype,{
	__class__: nx3.QPause4
});
nx3.QPause2 = function(level) {
	if(level == null) level = 0;
	nx3.NNote.call(this,nx3.ENoteType.Pause(level),null,nx3.ENoteVal.Nv2);
};
nx3.QPause2.__name__ = true;
nx3.QPause2.__super__ = nx3.NNote;
nx3.QPause2.prototype = $extend(nx3.NNote.prototype,{
	__class__: nx3.QPause2
});
nx3.QPause1 = function(level) {
	if(level == null) level = 0;
	nx3.NNote.call(this,nx3.ENoteType.Pause(level),null,nx3.ENoteVal.Nv1);
};
nx3.QPause1.__name__ = true;
nx3.QPause1.__super__ = nx3.NNote;
nx3.QPause1.prototype = $extend(nx3.NNote.prototype,{
	__class__: nx3.QPause1
});
nx3.QLyric8 = function(text) {
	if(text == null) text = "QLyric4";
	nx3.NNote.call(this,nx3.ENoteType.Lyric(text),null,nx3.ENoteVal.Nv8);
};
nx3.QLyric8.__name__ = true;
nx3.QLyric8.__super__ = nx3.NNote;
nx3.QLyric8.prototype = $extend(nx3.NNote.prototype,{
	__class__: nx3.QLyric8
});
nx3.QLyric4 = function(text) {
	if(text == null) text = "QLyric4";
	nx3.NNote.call(this,nx3.ENoteType.Lyric(text),null,nx3.ENoteVal.Nv4);
};
nx3.QLyric4.__name__ = true;
nx3.QLyric4.__super__ = nx3.NNote;
nx3.QLyric4.prototype = $extend(nx3.NNote.prototype,{
	__class__: nx3.QLyric4
});
nx3.QLyric2 = function(text) {
	if(text == null) text = "QLyric4";
	nx3.NNote.call(this,nx3.ENoteType.Lyric(text),null,nx3.ENoteVal.Nv2);
};
nx3.QLyric2.__name__ = true;
nx3.QLyric2.__super__ = nx3.NNote;
nx3.QLyric2.prototype = $extend(nx3.NNote.prototype,{
	__class__: nx3.QLyric2
});
nx3.QNote4 = function(dot,headLevel,headLevels,signs) {
	if(signs == null) signs = "";
	if(dot == null) dot = false;
	var val;
	if(dot) val = nx3.ENoteVal.Nv4dot; else val = nx3.ENoteVal.Nv4;
	nx3.QNote.call(this,headLevel,headLevels,null,null,val,signs);
};
nx3.QNote4.__name__ = true;
nx3.QNote4.__super__ = nx3.QNote;
nx3.QNote4.prototype = $extend(nx3.QNote.prototype,{
	__class__: nx3.QNote4
});
nx3.QNote8 = function(dot,headLevel,headLevels,signs) {
	if(signs == null) signs = "";
	if(dot == null) dot = false;
	var val;
	if(dot) val = nx3.ENoteVal.Nv8dot; else val = nx3.ENoteVal.Nv8;
	nx3.QNote.call(this,headLevel,headLevels,null,null,val,signs);
};
nx3.QNote8.__name__ = true;
nx3.QNote8.__super__ = nx3.QNote;
nx3.QNote8.prototype = $extend(nx3.QNote.prototype,{
	__class__: nx3.QNote8
});
nx3.QNote16 = function(headLevel,headLevels,signs) {
	if(signs == null) signs = "";
	nx3.QNote.call(this,headLevel,headLevels,null,null,nx3.ENoteVal.Nv16,signs);
};
nx3.QNote16.__name__ = true;
nx3.QNote16.__super__ = nx3.QNote;
nx3.QNote16.prototype = $extend(nx3.QNote.prototype,{
	__class__: nx3.QNote16
});
nx3.QNote2 = function(dot,headLevel,headLevels,signs) {
	if(signs == null) signs = "";
	if(dot == null) dot = false;
	var val;
	if(dot) val = nx3.ENoteVal.Nv2dot; else val = nx3.ENoteVal.Nv2;
	nx3.QNote.call(this,headLevel,headLevels,null,null,val,signs);
};
nx3.QNote2.__name__ = true;
nx3.QNote2.__super__ = nx3.QNote;
nx3.QNote2.prototype = $extend(nx3.QNote.prototype,{
	__class__: nx3.QNote2
});
nx3.QNote1 = function(headLevel,headLevels,signs) {
	if(signs == null) signs = "";
	nx3.QNote.call(this,headLevel,headLevels,null,null,nx3.ENoteVal.Nv1,signs);
};
nx3.QNote1.__name__ = true;
nx3.QNote1.__super__ = nx3.QNote;
nx3.QNote1.prototype = $extend(nx3.QNote.prototype,{
	__class__: nx3.QNote1
});
nx3.action = {};
nx3.action.EActionInfo = { __ename__ : true, __constructs__ : ["TargetXY"] };
nx3.action.EActionInfo.TargetXY = function(target,x,y) { var $x = ["TargetXY",0,target,x,y]; $x.__enum__ = nx3.action.EActionInfo; $x.toString = $estr; return $x; };
nx3.action.EActionType = { __ename__ : true, __constructs__ : ["HeadAction","NoteAction"] };
nx3.action.EActionType.HeadAction = function(type,head,info) { var $x = ["HeadAction",0,type,head,info]; $x.__enum__ = nx3.action.EActionType; $x.toString = $estr; return $x; };
nx3.action.EActionType.NoteAction = function(type,note,info) { var $x = ["NoteAction",1,type,note,info]; $x.__enum__ = nx3.action.EActionType; $x.toString = $estr; return $x; };
nx3.action.EActivityType = { __ename__ : true, __constructs__ : ["MouseDown","MouseUp","MouseOver","MouseOut"] };
nx3.action.EActivityType.MouseDown = ["MouseDown",0];
nx3.action.EActivityType.MouseDown.toString = $estr;
nx3.action.EActivityType.MouseDown.__enum__ = nx3.action.EActivityType;
nx3.action.EActivityType.MouseUp = ["MouseUp",1];
nx3.action.EActivityType.MouseUp.toString = $estr;
nx3.action.EActivityType.MouseUp.__enum__ = nx3.action.EActivityType;
nx3.action.EActivityType.MouseOver = ["MouseOver",2];
nx3.action.EActivityType.MouseOver.toString = $estr;
nx3.action.EActivityType.MouseOver.__enum__ = nx3.action.EActivityType;
nx3.action.EActivityType.MouseOut = ["MouseOut",3];
nx3.action.EActivityType.MouseOut.toString = $estr;
nx3.action.EActivityType.MouseOut.__enum__ = nx3.action.EActivityType;
nx3.action.IInteractivity = function() { };
nx3.action.IInteractivity.__name__ = true;
nx3.action.IInteractivity.prototype = {
	__class__: nx3.action.IInteractivity
};
nx3.audio = {};
nx3.audio.NotenrBarsCalculator = function(nbars) {
	this.nbars = nbars;
};
nx3.audio.NotenrBarsCalculator.__name__ = true;
nx3.audio.NotenrBarsCalculator.prototype = {
	getPartsNotenrItems: function() {
		var partsNotenerItems = [];
		var barvalues = [];
		var _g = 0;
		var _g1 = this.nbars;
		while(_g < _g1.length) {
			var bar = _g1[_g];
			++_g;
			var barvalue = nx3.NBarUtils.getValue(bar);
			barvalues.push(barvalue);
		}
		var partslist = this.getPartslist();
		var partnr = 0;
		var _g2 = 0;
		while(_g2 < partslist.length) {
			var parts = partslist[_g2];
			++_g2;
			var partNotenrItems = new nx3.audio.NotenrPartsCalculator(parts,partnr,barvalues).execute();
			partsNotenerItems.push(partNotenrItems);
			partnr++;
		}
		return partsNotenerItems;
	}
	,getPartslist: function() {
		var partcount = this.nbars[0].nparts.length;
		var result = [];
		var _g = 0;
		while(_g < partcount) {
			var partidx = _g++;
			var parts = new Array();
			var _g1 = 0;
			var _g2 = this.nbars;
			while(_g1 < _g2.length) {
				var bar = _g2[_g1];
				++_g1;
				var barpart = bar.nparts[partidx];
				parts.push(barpart);
			}
			result.push(parts);
		}
		return result;
	}
	,__class__: nx3.audio.NotenrBarsCalculator
};
nx3.audio.NotenrPartsCalculator = function(rowOfParts,partnr,partvalues) {
	this.parts = rowOfParts;
	this.partnr = partnr;
	this.partvalues = partvalues;
};
nx3.audio.NotenrPartsCalculator.__name__ = true;
nx3.audio.NotenrPartsCalculator.prototype = {
	execute: function() {
		var partsItems = [];
		var currentclef = null;
		var currentkey = null;
		var currentsound = "";
		var currentmodus = null;
		var currentoctave = null;
		var prevpart = null;
		var prevnoteitems = null;
		var resultnoteitems = [];
		var partposition = 0;
		var baridx = 0;
		var _g = 0;
		var _g1 = this.parts;
		while(_g < _g1.length) {
			var part = _g1[_g];
			++_g;
			if(part.clef != null) currentclef = part.clef;
			if(part.key != null) currentkey = part.key;
			if(part.sound != "") currentsound = part.sound;
			{
				var _g2 = part.type;
				switch(_g2[1]) {
				case 3:
					var o = _g2[3];
					var m = _g2[2];
					if(m != null) currentmodus = m;
					if(o != null) currentoctave = o;
					break;
				case 2:
					var o = _g2[3];
					var m = _g2[2];
					if(m != null) currentmodus = m;
					if(o != null) currentoctave = o;
					break;
				default:
				}
			}
			var partvalue = [cx.ArrayTools.indexOrNull(this.partvalues,baridx)];
			var noteitems = new nx3.audio.PartNotesToNotenrCalculator(part,this.partnr,baridx,partvalue[0],currentclef,currentkey,currentsound,currentmodus,currentoctave).getNotnrItems();
			if(partvalue[0] == null) {
				partvalue[0] = 0;
				Lambda.iter(noteitems,(function(partvalue) {
					return function(item) {
						partvalue[0] = Std["int"](Math.max(partvalue[0],item.position + item.noteval));
					};
				})(partvalue));
			}
			Lambda.iter(noteitems,(function() {
				return function(item1) {
					item1.partposition = partposition;
				};
			})());
			partposition += partvalue[0];
			resultnoteitems = resultnoteitems.concat(noteitems);
			prevnoteitems = noteitems;
			baridx++;
		}
		return resultnoteitems;
	}
	,__class__: nx3.audio.NotenrPartsCalculator
};
nx3.audio.PartNotesToNotenrCalculator = function(part,partnr,barnr,barvalue,partclef,partkey,partsound,partmodus,partoctave) {
	if(partsound == null) partsound = "";
	this.part = part;
	this.partnr = partnr;
	this.partclef = partclef;
	this.partkey = partkey;
	this.partmodus = partmodus;
	this.partoctave = partoctave;
	this.partsound = partsound;
	this.barnr = barnr;
	this.barvalue = barvalue;
};
nx3.audio.PartNotesToNotenrCalculator.__name__ = true;
nx3.audio.PartNotesToNotenrCalculator.prototype = {
	getNotnrItems: function() {
		var map = this.getPartPositionsNotes(this.part);
		this.signstable = nx3.audio.NotenrTools.getSignsTable(this.partkey);
		var items = this.partPositionsToNotenr(map,this.partclef,this.partkey);
		return items;
	}
	,partPositionsToNotenr: function(map,partclef,partkey) {
		var result = new Array();
		var positions = cx.ArrayTools.fromHashKeys(map.keys());
		positions.sort(function(a,b) {
			return Reflect.compare(a,b);
		});
		var _g = 0;
		while(_g < positions.length) {
			var position = positions[_g];
			++_g;
			var notes = map.get(position);
			var _g1 = 0;
			while(_g1 < notes.length) {
				var note = notes[_g1];
				++_g1;
				{
					var _g2 = note.type;
					switch(_g2[1]) {
					case 0:
						var at = _g2[5];
						var a1 = _g2[4];
						var v = _g2[3];
						var h = _g2[2];
						var $it0 = note.iterator();
						while( $it0.hasNext() ) {
							var head = $it0.next();
							var cleflevel = nx3.audio.NotenrTools.clefLevel(head.level,partclef);
							var keysign = this.signstable.get(cleflevel);
							var headsign = head.sign;
							var playsign;
							switch(headsign[1]) {
							case 0:
								playsign = keysign;
								break;
							case 1:
								playsign = headsign;
								break;
							default:
								playsign = headsign;
							}
							var notenr = nx3.audio.NotenrTools.getSignaffectedNotenr(cleflevel,keysign,headsign);
							var midinr = nx3.audio.NotenrTools.getMidinr(notenr);
							var notename = nx3.audio.NotenrTools.getNotename(notenr,playsign);
							var tie = head.tie != null;
							var playable = nx3.audio.NotenrTools.getPlayable(note);
							result.push({ note : note, position : position, noteval : nx3.ENoteValTools.value(note.value), level : cleflevel, notenr : notenr, midinr : midinr, notename : notename, tie : tie, headsign : headsign, keysign : keysign, playsign : playsign, partposition : 0, playable : playable, partnr : this.partnr, barnr : this.barnr, barvalue : this.barvalue});
							if(headsign != null && headsign != nx3.ESign.None) this.signstable.set(cleflevel,headsign);
						}
						break;
					case 3:
						var pause = _g2[4];
						var sign = _g2[3];
						var level = _g2[2];
						var levelmap;
						if(this.partmodus == nx3.EModus.Minor) levelmap = [0,2,3,5,7,8,10]; else levelmap = [0,2,4,5,7,9,11];
						var levelmod = (-level + 21) % 7;
						var keyRootShift = nx3.EKeysTools.getKeyRootShift(this.partkey);
						var mappedlevel = levelmap[levelmod];
						var clevel = 60 - level;
						var leveloctave = 0;
						if(level < -6) leveloctave = 12;
						if(level > 0) leveloctave = -12;
						var minorshift;
						if(this.partmodus == nx3.EModus.Minor) minorshift = -3; else minorshift = 0;
						var signshift;
						if(sign != null) switch(sign[1]) {
						case 3:
							signshift = 1;
							break;
						case 2:
							signshift = -1;
							break;
						default:
							signshift = 0;
						} else signshift = 0;
						var midinr1 = 60 + mappedlevel + leveloctave + keyRootShift + minorshift + signshift;
						var notenr1 = 0;
						var notename1 = "";
						var tie1 = false;
						var headsign1 = sign;
						var playsign1 = sign;
						var playable1 = !pause;
						var cleflevel1 = 0;
						var keysign1 = sign;
						result.push({ note : note, position : position, noteval : nx3.ENoteValTools.value(note.value), level : cleflevel1, notenr : notenr1, midinr : midinr1, notename : notename1, tie : tie1, headsign : headsign1, keysign : keysign1, playsign : playsign1, partposition : 0, playable : playable1, partnr : this.partnr, barnr : this.barnr, barvalue : this.barvalue});
						break;
					default:
					}
				}
			}
		}
		return result;
	}
	,getPartPositionsNotes: function(part) {
		var result = new haxe.ds.IntMap();
		var $it0 = part.iterator();
		while( $it0.hasNext() ) {
			var voice = $it0.next();
			var pos = 0;
			var $it1 = voice.iterator();
			while( $it1.hasNext() ) {
				var note = $it1.next();
				if(!result.exists(pos)) result.set(pos,[]);
				result.get(pos).push(note);
				pos += nx3.ENoteValTools.value(note.value);
			}
		}
		return result;
	}
	,__class__: nx3.audio.PartNotesToNotenrCalculator
};
nx3.audio.TestScores = function() { };
nx3.audio.TestScores.__name__ = true;
nx3.audio.TestScores.score1 = function() {
	return null;
};
nx3.audio.NotenrTestItems = function() { };
nx3.audio.NotenrTestItems.__name__ = true;
nx3.audio.NotenrTestItems.testTies = function() {
	var p1 = new nx3.NPart([new nx3.NVoice([new nx3.NNote(null,[new nx3.NHead(null,0,nx3.ESign.None)]),new nx3.NNote(null,[new nx3.NHead(null,0,nx3.ESign.None)])]),new nx3.NVoice([new nx3.NNote(null,[new nx3.NHead(null,0,nx3.ESign.None,nx3.ETie.Tie(nx3.EDirectionUAD.Auto,0))],nx3.ENoteVal.Nv2)])],null,nx3.EClef.ClefG,null,nx3.EKey.Flat2);
	var p2 = new nx3.NPart([new nx3.NVoice([new nx3.NNote(null,[new nx3.NHead(null,0,nx3.ESign.None)]),new nx3.NNote(null,[new nx3.NHead(null,0,nx3.ESign.None)])])]);
	return [p1,p2];
};
nx3.audio.NotenrTestItems.testTwoVoices = function() {
	var p1 = new nx3.NPart([new nx3.NVoice([new nx3.NNote(null,[new nx3.NHead(null,0,nx3.ESign.Flat)]),new nx3.NNote(null,[new nx3.NHead(null,0,nx3.ESign.None)])]),new nx3.NVoice([new nx3.NNote(null,[new nx3.NHead(null,0,nx3.ESign.Sharp)])])],null,nx3.EClef.ClefG,null,nx3.EKey.Natural);
	return [p1];
};
nx3.audio.NotenrTestItems.testParts0 = function() {
	var p1 = new nx3.NPart([new nx3.NVoice([new nx3.NNote(null,[new nx3.NHead(null,0,nx3.ESign.None)]),new nx3.NNote(null,[new nx3.NHead(null,3,nx3.ESign.Natural)]),new nx3.NNote(null,[new nx3.NHead(null,0,nx3.ESign.None)]),new nx3.NNote(null,[new nx3.NHead(null,1,nx3.ESign.None)]),new nx3.NNote(null,[new nx3.NHead(null,1,nx3.ESign.None)]),new nx3.NNote(null,[new nx3.NHead(null,2,nx3.ESign.None)]),new nx3.NNote(null,[new nx3.NHead(null,2,nx3.ESign.None)]),new nx3.NNote(null,[new nx3.NHead(null,3,nx3.ESign.None)])])],null,nx3.EClef.ClefG,null,nx3.EKey.Sharp3);
	return [p1];
};
nx3.audio.NotenrTestItems.testParts1 = function() {
	var p1 = new nx3.NPart([new nx3.NVoice([new nx3.NNote(null,[new nx3.NHead(null,0)]),new nx3.NNote(null,[new nx3.NHead(null,1)]),new nx3.QNote4(null,2),new nx3.QNote4(null,3),new nx3.QNote4(null,4),new nx3.QNote4(null,5),new nx3.QNote4(null,6)])],null,nx3.EClef.ClefG,null,nx3.EKey.Flat1);
	var p2 = new nx3.NPart([new nx3.NVoice([new nx3.QNote4(null,0),new nx3.QNote4(null,1),new nx3.QNote4(null,2),new nx3.QNote4(null,3),new nx3.QNote4(null,4),new nx3.QNote4(null,5),new nx3.QNote4(null,6)])],null,null);
	return [p1,p2];
};
nx3.audio.NotenrTestItems.testParts2 = function() {
	var p1 = new nx3.NPart([new nx3.NVoice([new nx3.QNote4(null,0),new nx3.QNote4(null,0),new nx3.QNote4(null,0),new nx3.QNote4(null,0)]),new nx3.NVoice([new nx3.QNote2(null,2),new nx3.QNote4(true,2),new nx3.QNote8(null,2)])]);
	var p2 = new nx3.NPart([new nx3.NVoice([new nx3.QNote4(null,0),new nx3.QNote4(null,0),new nx3.QNote4(null,0),new nx3.QNote4(null,0)]),new nx3.NVoice([new nx3.QNote2(null,2),new nx3.QNote4(true,2),new nx3.QNote8(null,2)])]);
	return [p1,p2];
};
nx3.audio.NotenrTools = function(clef,key) {
	this.clef = clef;
	this.key = key;
	this.table = nx3.audio.NotenrTools.getNotenrTable(key);
};
nx3.audio.NotenrTools.__name__ = true;
nx3.audio.NotenrTools.getNotenrTable = function(key,levelmin,levelmax) {
	if(levelmax == null) levelmax = 30;
	if(levelmin == null) levelmin = -30;
	var table = new haxe.ds.IntMap();
	var _g = levelmin;
	while(_g < levelmax) {
		var level = _g++;
		var octave = Math.floor(level / 7);
		var basekey;
		if(level >= 0) basekey = level % 7; else basekey = (level % 7 + 7) % 7;
		var notenr;
		notenr = (function($this) {
			var $r;
			var this1 = nx3.EKeysTools.getNotenrBaseMap(key);
			$r = this1.get(basekey);
			return $r;
		}(this)) - 12 * octave;
		table.set(level,notenr);
	}
	return table;
};
nx3.audio.NotenrTools.getSignsTable = function(key,levelmin,levelmax) {
	if(levelmax == null) levelmax = 30;
	if(levelmin == null) levelmin = -30;
	var table = new haxe.ds.IntMap();
	var _g = levelmin;
	while(_g < levelmax) {
		var level = _g++;
		var octave = Math.floor(level / 7);
		var basekey;
		if(level >= 0) basekey = level % 7; else basekey = (level % 7 + 7) % 7;
		var sign;
		var this1 = nx3.EKeysTools.getSignsBaseMap(key);
		sign = this1.get(basekey);
		table.set(level,sign);
	}
	return table;
};
nx3.audio.NotenrTools.getNotename = function(notenr,sign) {
	var base = ["c","ciss/dess","d","diss/ess","e","f","fiss/gess","g","giss/ass","a","aiss/bess","b"];
	var bnr;
	if(notenr >= 0) bnr = notenr % 12; else bnr = (notenr % 12 + 12) % 12;
	var octave;
	if(notenr >= 0) octave = Math.floor(notenr / 12); else octave = Math.floor(notenr / 12);
	var bname = base[bnr];
	if(sign != null && sign != nx3.ESign.Natural || sign != nx3.ESign.None) {
		if(bname.indexOf("/") > -1) {
			var bnames = bname.split("/");
			switch(sign[1]) {
			case 3:
				bname = bnames[0];
				break;
			case 2:
				bname = bnames[1];
				break;
			default:
				bname = bname;
			}
		}
	}
	return "" + bname + "[" + octave + "]";
};
nx3.audio.NotenrTools.getMidinr = function(notenr) {
	return notenr + 72;
};
nx3.audio.NotenrTools.clefLevel = function(level,clef) {
	if(clef == null) return level;
	switch(clef[1]) {
	case 2:
		return level + 6;
	case 1:
		return level + 12;
	default:
		return level;
	}
};
nx3.audio.NotenrTools.getSignaffectedNotenr = function(level,keysign,headsign) {
	var sign = keysign;
	if(headsign != null && headsign != keysign && headsign != nx3.ESign.None) sign = headsign;
	var stemtonenr = nx3.audio.NotenrTools.stemtonestable.get(level);
	if(sign == null) return stemtonenr;
	switch(sign[1]) {
	case 1:
		return stemtonenr;
	case 2:
		return stemtonenr - 1;
	case 4:
		return stemtonenr - 2;
	case 3:
		return stemtonenr + 1;
	case 5:
		return stemtonenr + 2;
	default:
		return stemtonenr;
	}
};
nx3.audio.NotenrTools.getPlayable = function(note) {
	{
		var _g = note.type;
		switch(_g[1]) {
		case 0:
			return true;
		case 3:
			return true;
		default:
			return false;
		}
	}
};
nx3.audio.NotenrTools.calculateSoundLengths = function(partsnotes,tempos,defaulttempo) {
	if(defaulttempo == null) defaulttempo = 120;
	var partidx = 0;
	var _g = 0;
	while(_g < partsnotes.length) {
		var part = partsnotes[_g];
		++_g;
		var barsoundends = [];
		var _g1 = 0;
		while(_g1 < part.length) {
			var note = part[_g1];
			++_g1;
			var barnr = note.barnr;
			var info = new nx3.audio.SoundlengthCalculator(note,tempos,defaulttempo).getSoundposAndDuration();
			note.soundlength = info.length;
			note.soundposition = info.pos;
			note.barsoundlength = info.barlength;
			if(barnr == 0) {
				note.barsoundposition = 0;
				barsoundends[0] = note.barsoundlength;
			} else {
				note.barsoundposition = barsoundends[barnr - 1];
				barsoundends[barnr] = note.barsoundposition + note.barsoundlength;
			}
			note.playpos = note.barsoundposition + note.soundposition;
			note.playend = note.playpos + note.soundlength;
		}
		partidx++;
	}
};
nx3.audio.NotenrTools.getTotalLength = function(partsnotes) {
	var lenght = 0.0;
	var _g = 0;
	while(_g < partsnotes.length) {
		var part = partsnotes[_g];
		++_g;
		var last = part[part.length - 1];
		lenght = Math.max(lenght,last.barsoundposition + last.barsoundlength);
	}
	return lenght;
};
nx3.audio.NotenrTools.resolveTies = function(partsnotes) {
	var result = [];
	var _g = 0;
	while(_g < partsnotes.length) {
		var part = partsnotes[_g];
		++_g;
		var newpart = [];
		var note = part[0];
		var previdx = -1;
		while(note != null) {
			newpart.push(note);
			var noteidx = cx.ArrayTools.index(part,note);
			var foundtie = false;
			if(note.tie) {
				var nextpos = note.partposition + note.position + note.noteval;
				var nextnote = cx.ArrayTools.indexOrNull(part,HxOverrides.indexOf(part,note,0) + 1);
				while(nextnote != null) {
					var pos = nextnote.partposition + nextnote.position;
					if(pos == nextpos && nextnote.midinr == note.midinr) {
						var newsoundlength = note.soundlength + nextnote.soundlength;
						var newvalue = note.noteval + nextnote.noteval;
						note.soundlength = newsoundlength;
						note.noteval = newvalue;
						HxOverrides.remove(part,nextnote);
						note.tie = nextnote.tie;
						foundtie = true;
					}
					if(pos == nextpos) nextnote = cx.ArrayTools.indexOrNull(part,HxOverrides.indexOf(part,nextnote,0) + 1); else nextnote = null;
				}
			}
			if(!foundtie) note = cx.ArrayTools.indexOrNull(part,HxOverrides.indexOf(part,note,0) + 1); else {
				HxOverrides.remove(newpart,note);
				previdx = noteidx;
			}
		}
		result.push(newpart);
	}
	return result;
};
nx3.audio.NotenrTools.debug = function(partsnotes) {
	console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - ");
	var _g = 0;
	while(_g < partsnotes.length) {
		var part = partsnotes[_g];
		++_g;
		console.log("Part: ");
		var _g1 = 0;
		while(_g1 < part.length) {
			var note = part[_g1];
			++_g1;
			console.log([note.barnr,note.position,note.midinr,note.noteval]);
		}
	}
};
nx3.audio.NotenrTools.getNotesNotenritems = function(partsnotes) {
	var map = new haxe.ds.ObjectMap();
	var _g = 0;
	while(_g < partsnotes.length) {
		var items = partsnotes[_g];
		++_g;
		var _g1 = 0;
		while(_g1 < items.length) {
			var item = items[_g1];
			++_g1;
			var note = item.note;
			map.set(note,item);
		}
	}
	return map;
};
nx3.audio.NotenrTools.getPartsnotesMp3files = function(partsnotes,partsSounds,path,soundFallback) {
	if(soundFallback == null) soundFallback = "piano";
	if(path == null) path = "/sounds/";
	var result = [];
	if(partsSounds == null) partsSounds = [];
	while(partsSounds.length < partsnotes.length) partsSounds.push(soundFallback);
	var _g = 0;
	while(_g < partsnotes.length) {
		var items = partsnotes[_g];
		++_g;
		var sound = partsSounds.shift();
		var soundPath = "" + path + sound + "/";
		var _g1 = 0;
		while(_g1 < items.length) {
			var item = items[_g1];
			++_g1;
			var note = item.note;
			var midinr = item.midinr;
			var filename = "" + path + sound + "/" + midinr + ".mp3";
			item.mp3file = filename;
			if(!Lambda.has(result,filename)) result.push(filename);
		}
	}
	return result;
};
nx3.audio.NotenrTools.getPartsnotes = function(nbars,tempo,resolveTies) {
	if(resolveTies == null) resolveTies = true;
	if(tempo == null) tempo = 60;
	var partsnotes = new nx3.audio.NotenrBarsCalculator(nbars).getPartsNotenrItems();
	nx3.audio.NotenrTools.calculateSoundLengths(partsnotes,null,tempo);
	partsnotes = nx3.audio.NotenrTools.resolveTies(partsnotes);
	return partsnotes;
};
nx3.audio.NotenrTools.tplToNotenritem = function(partkey,partmodus,partoctave,level,sign) {
	return null;
};
nx3.audio.NotenrTools.createNotenrItem = function(partpos,pos,noteval,level,notenr,midinr,headsign,keysign,playsign,notename,tie,playable,partnr,barnr,barvalue,note) {
	var item = { partposition : partpos, position : pos, noteval : noteval, level : level, notenr : notenr, midinr : midinr, headsign : headsign, keysign : keysign, playsign : playsign, notename : notename, tie : tie, playable : playable, partnr : partnr, barnr : barnr, barvalue : barvalue, note : note};
	return item;
};
nx3.audio.NotenrTools.prototype = {
	getNotenr: function(level) {
		var _g = this.clef;
		switch(_g[1]) {
		case 1:
			return this.table.get(level + 12);
		default:
			return this.table.get(level);
		}
	}
	,__class__: nx3.audio.NotenrTools
};
nx3.audio.SoundlengthCalculator = function(n,tempos,defaulttempo,pulseval) {
	if(defaulttempo == null) defaulttempo = 60;
	if(pulseval == null) this.beatvalue = nx3.ENoteValTools.value(nx3.ENoteVal.Nv4); else this.beatvalue = nx3.ENoteValTools.value(pulseval);
	this.n = n;
	this.tempos = tempos;
	if(this.tempos != null) this.tempos.sort(function(a,b) {
		return Reflect.compare(a.pos,b.pos);
	});
	this.defaulttempo = defaulttempo;
};
nx3.audio.SoundlengthCalculator.__name__ = true;
nx3.audio.SoundlengthCalculator.prototype = {
	getSoundposAndDuration: function() {
		var note = this.n;
		var starttempo = this.defaulttempo;
		var endtempo = null;
		if(this.tempos != null && this.tempos.length >= 1) {
			var firsttempoinfo = this.tempos[0];
			starttempo = firsttempoinfo.bpm;
		}
		if(this.tempos != null && this.tempos.length >= 2) {
			var secondtempo = this.tempos[1];
			endtempo = secondtempo.bpm;
		}
		if(this.tempos != null && this.tempos.length >= 3) throw "This version can't handle more than two tempoinfos!";
		var tempochange = endtempo != null;
		if(tempochange) {
		}
		var soundlength = note.noteval / this.beatvalue * (60 / this.defaulttempo);
		var soundposition = note.position / this.beatvalue * (60 / this.defaulttempo);
		var barlength = note.barvalue / this.beatvalue * (60 / this.defaulttempo);
		return { length : soundlength, pos : soundposition, barlength : barlength};
	}
	,__class__: nx3.audio.SoundlengthCalculator
};
nx3.geom = {};
nx3.geom.BezieerTool = function() { };
nx3.geom.BezieerTool.__name__ = true;
nx3.geom.BezieerTool.bezieerCoordinates = function(anchor1,control1,control2,anchor2,lineWidth,lineColor,segments) {
	if(segments == null) segments = 10;
	if(lineColor == null) lineColor = 0;
	if(lineWidth == null) lineWidth = 1;
	var coord = [];
	coord.push(anchor1);
	var posx;
	var posy;
	var _g = 0;
	while(_g < segments) {
		var i = _g++;
		var u = i / segments;
		posx = Math.pow(u,3) * (anchor2.x + 3 * (control1.x - control2.x) - anchor1.x) + 3 * Math.pow(u,2) * (anchor1.x - 2 * control1.x + control2.x) + 3 * u * (control1.x - anchor1.x) + anchor1.x;
		posy = Math.pow(u,3) * (anchor2.y + 3 * (control1.y - control2.y) - anchor1.y) + 3 * Math.pow(u,2) * (anchor1.y - 2 * control1.y + control2.y) + 3 * u * (control1.y - anchor1.y) + anchor1.y;
		coord.push({ x : posx, y : posy});
	}
	coord.push(anchor2);
	return coord;
};
nx3.geom.Point = function(x,y) {
	if(y == null) y = 0;
	if(x == null) x = 0;
	this.x = x;
	this.y = y;
};
nx3.geom.Point.__name__ = true;
nx3.geom.Point.distance = function(pt1,pt2) {
	var dx = pt1.x - pt2.x;
	var dy = pt1.y - pt2.y;
	return Math.sqrt(dx * dx + dy * dy);
};
nx3.geom.Point.interpolate = function(pt1,pt2,f) {
	return new nx3.geom.Point(pt2.x + f * (pt1.x - pt2.x),pt2.y + f * (pt1.y - pt2.y));
};
nx3.geom.Point.polar = function(len,angle) {
	return new nx3.geom.Point(len * Math.cos(angle),len * Math.sin(angle));
};
nx3.geom.Point.prototype = {
	add: function(v) {
		return new nx3.geom.Point(v.x + this.x,v.y + this.y);
	}
	,clone: function() {
		return new nx3.geom.Point(this.x,this.y);
	}
	,copyFrom: function(sourcePoint) {
		this.x = sourcePoint.x;
		this.y = sourcePoint.y;
	}
	,equals: function(toCompare) {
		return toCompare.x == this.x && toCompare.y == this.y;
	}
	,normalize: function(thickness) {
		if(this.x == 0 && this.y == 0) return; else {
			var norm = thickness / Math.sqrt(this.x * this.x + this.y * this.y);
			this.x *= norm;
			this.y *= norm;
		}
	}
	,offset: function(dx,dy) {
		this.x += dx;
		this.y += dy;
	}
	,setTo: function(x,y) {
		this.x = x;
		this.y = y;
	}
	,subtract: function(v) {
		return new nx3.geom.Point(this.x - v.x,this.y - v.y);
	}
	,toString: function() {
		return "(" + this.x + ", " + this.y + ")";
	}
	,get_length: function() {
		return Math.sqrt(this.x * this.x + this.y * this.y);
	}
	,__class__: nx3.geom.Point
};
nx3.geom.Rectangle = function(x,y,width,height) {
	if(height == null) height = 0;
	if(width == null) width = 0;
	if(y == null) y = 0;
	if(x == null) x = 0;
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
};
nx3.geom.Rectangle.__name__ = true;
nx3.geom.Rectangle.prototype = {
	clone: function() {
		return new nx3.geom.Rectangle(this.x,this.y,this.width,this.height);
	}
	,contains: function(x,y) {
		return x >= this.x && y >= this.y && x < this.get_right() && y < this.get_bottom();
	}
	,containsPoint: function(point) {
		return this.contains(point.x,point.y);
	}
	,containsRect: function(rect) {
		if(rect.width <= 0 || rect.height <= 0) return rect.x > this.x && rect.y > this.y && rect.get_right() < this.get_right() && rect.get_bottom() < this.get_bottom(); else return rect.x >= this.x && rect.y >= this.y && rect.get_right() <= this.get_right() && rect.get_bottom() <= this.get_bottom();
	}
	,copyFrom: function(sourceRect) {
		this.x = sourceRect.x;
		this.y = sourceRect.y;
		this.width = sourceRect.width;
		this.height = sourceRect.height;
	}
	,equals: function(toCompare) {
		return this.x == toCompare.x && this.y == toCompare.y && this.width == toCompare.width && this.height == toCompare.height;
	}
	,extendBounds: function(r) {
		var dx = this.x - r.x;
		if(dx > 0) {
			this.x -= dx;
			this.width += dx;
		}
		var dy = this.y - r.y;
		if(dy > 0) {
			this.y -= dy;
			this.height += dy;
		}
		if(r.get_right() > this.get_right()) this.set_right(r.get_right());
		if(r.get_bottom() > this.get_bottom()) this.set_bottom(r.get_bottom());
	}
	,inflate: function(dx,dy) {
		this.x -= dx;
		this.y -= dy;
		this.width += dx * 2;
		this.height += dy * 2;
	}
	,inflatePoint: function(point) {
		this.inflate(point.x,point.y);
	}
	,intersection: function(toIntersect) {
		var x0;
		if(this.x < toIntersect.x) x0 = toIntersect.x; else x0 = this.x;
		var x1;
		if(this.get_right() > toIntersect.get_right()) x1 = toIntersect.get_right(); else x1 = this.get_right();
		if(x1 <= x0) return new nx3.geom.Rectangle();
		var y0;
		if(this.y < toIntersect.y) y0 = toIntersect.y; else y0 = this.y;
		var y1;
		if(this.get_bottom() > toIntersect.get_bottom()) y1 = toIntersect.get_bottom(); else y1 = this.get_bottom();
		if(y1 <= y0) return new nx3.geom.Rectangle();
		return new nx3.geom.Rectangle(x0,y0,cx.MathTools.round2(x1 - x0,null),cx.MathTools.round2(y1 - y0,null));
	}
	,intersects: function(toIntersect) {
		var x0;
		if(this.x < toIntersect.x) x0 = toIntersect.x; else x0 = this.x;
		var x1;
		if(this.get_right() > toIntersect.get_right()) x1 = toIntersect.get_right(); else x1 = this.get_right();
		if(x1 <= x0) return false;
		var y0;
		if(this.y < toIntersect.y) y0 = toIntersect.y; else y0 = this.y;
		var y1;
		if(this.get_bottom() > toIntersect.get_bottom()) y1 = toIntersect.get_bottom(); else y1 = this.get_bottom();
		return y1 > y0;
	}
	,isEmpty: function() {
		return this.width <= 0 || this.height <= 0;
	}
	,offset: function(dx,dy) {
		this.x = cx.MathTools.round2(this.x + dx,null);
		this.y = cx.MathTools.round2(this.y + dy,null);
	}
	,offsetPoint: function(point) {
		this.x += point.x;
		this.y += point.y;
	}
	,setEmpty: function() {
		this.x = 0;
		this.y = 0;
		this.width = 0;
		this.height = 0;
	}
	,toString: function() {
		return "(x=" + this.x + ", y=" + this.y + ", width=" + this.width + ", height=" + this.height + ")";
	}
	,union: function(toUnion) {
		var x0;
		if(this.x > toUnion.x) x0 = toUnion.x; else x0 = this.x;
		var x1;
		if(this.get_right() < toUnion.get_right()) x1 = toUnion.get_right(); else x1 = this.get_right();
		var y0;
		if(this.y > toUnion.y) y0 = toUnion.y; else y0 = this.y;
		var y1;
		if(this.get_bottom() < toUnion.get_bottom()) y1 = toUnion.get_bottom(); else y1 = this.get_bottom();
		return new nx3.geom.Rectangle(x0,y0,x1 - x0,y1 - y0);
	}
	,get_bottom: function() {
		return this.y + this.height;
	}
	,set_bottom: function(value) {
		this.height = value - this.y;
		return value;
	}
	,get_bottomRight: function() {
		return new nx3.geom.Point(this.x + this.width,this.y + this.height);
	}
	,set_bottomRight: function(value) {
		this.width = value.x - this.x;
		this.height = value.y - this.y;
		return value.clone();
	}
	,get_left: function() {
		return this.x;
	}
	,set_left: function(value) {
		this.width -= value - this.x;
		this.x = value;
		return value;
	}
	,get_right: function() {
		return this.x + this.width;
	}
	,set_right: function(value) {
		this.width = value - this.x;
		return value;
	}
	,get_size: function() {
		return new nx3.geom.Point(this.width,this.height);
	}
	,set_size: function(value) {
		this.width = value.x;
		this.height = value.y;
		return value.clone();
	}
	,get_top: function() {
		return this.y;
	}
	,set_top: function(value) {
		this.height -= value - this.y;
		this.y = value;
		return value;
	}
	,get_topLeft: function() {
		return new nx3.geom.Point(this.x,this.y);
	}
	,set_topLeft: function(value) {
		this.x = value.x;
		this.y = value.y;
		return value.clone();
	}
	,__class__: nx3.geom.Rectangle
};
nx3.geom.RectangleTools = function() { };
nx3.geom.RectangleTools.__name__ = true;
nx3.geom.RectangleTools.union = function(rectangles) {
	var result = rectangles[0].clone();
	if(rectangles.length == 1) return result;
	var _g1 = 1;
	var _g = rectangles.length;
	while(_g1 < _g) {
		var i = _g1++;
		result = result.union(rectangles[i]);
	}
	return result;
};
nx3.geom.RectangleTools.draw = function(ctx,rect,enlarge) {
	if(enlarge == null) enlarge = 0;
	ctx.strokeRect(rect.x - enlarge,rect.y - enlarge,rect.width + enlarge * 2,rect.height + enlarge * 2);
};
nx3.geom.RectanglesTools = function() { };
nx3.geom.RectanglesTools.__name__ = true;
nx3.geom.RectanglesTools.getXIntersection = function(rectsA,rectsB) {
	var rectsB2 = new Array();
	var _g = 0;
	while(_g < rectsB.length) {
		var r = rectsB[_g];
		++_g;
		rectsB2.push(r.clone());
	}
	var check = function() {
		var _g1 = 0;
		while(_g1 < rectsA.length) {
			var ra = rectsA[_g1];
			++_g1;
			var _g11 = 0;
			while(_g11 < rectsB2.length) {
				var rb = rectsB2[_g11];
				++_g11;
				var i = ra.intersection(rb);
				i.width = cx.MathTools.round2(i.width,8);
				if(i.width > 0) return i.width;
			}
		}
		return 0;
	};
	var x = 0;
	var moveX = check();
	while(moveX > 0) {
		x += moveX;
		var _g2 = 0;
		while(_g2 < rectsB2.length) {
			var r1 = rectsB2[_g2];
			++_g2;
			r1.offset(moveX,0);
		}
		moveX = check();
	}
	return x;
};
nx3.geom.RectanglesTools.clone = function(rects) {
	if(rects == null) return null;
	var result = new Array();
	var _g = 0;
	while(_g < rects.length) {
		var r = rects[_g];
		++_g;
		result.push(r);
	}
	return result;
};
nx3.geom.RectanglesTools.offset = function(rects,x,y) {
	var _g = 0;
	while(_g < rects.length) {
		var r = rects[_g];
		++_g;
		r.offset(x,y);
	}
};
nx3.geom.RectanglesTools.unionAll = function(rects) {
	if(rects == null) return null;
	if(rects.length == 1) return rects[0].clone();
	var r = rects[0].clone();
	var _g1 = 1;
	var _g = rects.length;
	while(_g1 < _g) {
		var i = _g1++;
		r = r.union(rects[i]);
	}
	return r;
};
nx3.geom.RectanglesTools.concat = function(rectsA,rectsB) {
	var _g = 0;
	while(_g < rectsB.length) {
		var r = rectsB[_g];
		++_g;
		rectsA.push(r);
	}
	return rectsA;
};
nx3.js = {};
nx3.js.MouseInteraction = { __ename__ : true, __constructs__ : ["PlayNote","StopNote","ShowTooltip","HideTooltip"] };
nx3.js.MouseInteraction.PlayNote = function(scoreId,note,noteinfo,sound) { var $x = ["PlayNote",0,scoreId,note,noteinfo,sound]; $x.__enum__ = nx3.js.MouseInteraction; $x.toString = $estr; return $x; };
nx3.js.MouseInteraction.StopNote = function(scoreId) { var $x = ["StopNote",1,scoreId]; $x.__enum__ = nx3.js.MouseInteraction; $x.toString = $estr; return $x; };
nx3.js.MouseInteraction.ShowTooltip = function(scoreId,note,noteinfo,type) { var $x = ["ShowTooltip",2,scoreId,note,noteinfo,type]; $x.__enum__ = nx3.js.MouseInteraction; $x.toString = $estr; return $x; };
nx3.js.MouseInteraction.HideTooltip = function(scoreId) { var $x = ["HideTooltip",3,scoreId]; $x.__enum__ = nx3.js.MouseInteraction; $x.toString = $estr; return $x; };
nx3.render = {};
nx3.render.ITarget = function() { };
nx3.render.ITarget.__name__ = true;
nx3.render.ITarget.prototype = {
	__class__: nx3.render.ITarget
};
nx3.render.Renderer = function(target,targetX,targetY,interactions) {
	if(targetY == null) targetY = 0;
	if(targetX == null) targetX = 0;
	this.target = target;
	this.targetX = targetX;
	this.targetY = targetY;
	this.scaling = this.target.getScaling();
	if(interactions != null) this.interactions = interactions; else this.interactions = [];
};
nx3.render.Renderer.__name__ = true;
nx3.render.Renderer.prototype = {
	xToUnitX: function(x) {
		return x * (1 / this.scaling.unitX);
	}
	,yToUnitY: function(y) {
		return y * (1 / this.scaling.unitY);
	}
	,renderSystem: function(system,newX,newY) {
		if(newY == null) newY = -1;
		if(newX == null) newX = -1;
		if(newX != -1) this.targetX = newX;
		if(newY != -1) this.targetY = newY;
		this.drawSystem(system);
	}
	,renderScore: function(score,newX,newY,systemwidth) {
		if(systemwidth == null) systemwidth = 400;
		if(newY == null) newY = -1;
		if(newX == null) newX = -1;
		if(newX != -1) this.targetX = newX;
		if(newY != -1) this.targetY = newY;
		this.drawSystems(score.getSystems(systemwidth));
		this.target.totalWidth = score.getWidth() * this.scaling.unitX;
		this.target.totalHeight = score.getHeight() * this.scaling.unitY;
		return { width : score.getWidth() * this.scaling.unitX, height : score.getHeight() * this.scaling.unitY};
	}
	,testText: function() {
		this.target.setFont(nx3.Constants.FONT_TEXT_DEFAULTFORMAT);
		var str = "ABC abc 123";
		this.target.text(0,0,str);
		var w = this.target.textwidth(str);
		var h = this.target.textheight(str);
		this.target.rectangle(0,0,new nx3.geom.Rectangle(0,0,w,h),1,16711680);
	}
	,addInteraction: function(interaction) {
		this.interactions.push(interaction);
	}
	,drawSystems: function(systems) {
		var _g = 0;
		while(_g < systems.length) {
			var system = systems[_g];
			++_g;
			this.drawSystem(system);
		}
	}
	,drawSystemExtras: function(systems,system,nx,ny) {
		if(ny == null) ny = 0;
		if(nx == null) nx = 0;
		var tx = this.targetX + nx * this.scaling.unitX;
		var ty = this.targetY + ny * this.scaling.unitY;
		var _g = 0;
		var _g1 = system.getSystembars();
		while(_g < _g1.length) {
			var systembar = _g1[_g];
			++_g;
			if(systembar == cx.ArrayTools.first(system.getSystembars())) {
				if(system != systems[0]) {
					var prevSystem = cx.ArrayTools.prev(systems,system);
					var prevSystembar = cx.ArrayTools.last(prevSystem.getSystembars());
					var tieconnections = prevSystembar.bar.getTieConnections();
					var _g2 = 0;
					while(_g2 < tieconnections.length) {
						var connection = tieconnections[_g2];
						++_g2;
						var fromBarX = systembar.getXPosition();
						var fromNoteX = systembar.getBarMeasurements().getLeftContentMarginXPosition() + connection.from.getXPosition();
						var part = connection.to.getComplex().getPart();
						var partidx;
						var _this = part.getBar().getParts();
						partidx = HxOverrides.indexOf(_this,part,0);
						var party = partidx * 20 * this.scaling.unitY;
						var tielevel = 0;
						{
							var _g3 = connection.tie;
							switch(_g3[1]) {
							case 0:
								var tlevel = _g3[3];
								var tdir = _g3[2];
								tielevel = tlevel;
								break;
							default:
							}
						}
						var xshift = -5;
						var tiewidth = 3;
						var tierect = new nx3.geom.Rectangle(fromBarX + fromNoteX + xshift,connection.level + tielevel,tiewidth,1);
						this.drawTie(system,tx,ty + party,tierect,nx3.EDirectionUD.Down);
					}
				}
			}
			if(systembar == cx.ArrayTools.last(system.getSystembars())) {
				var tieconnections1 = systembar.bar.getTieConnections();
				var _g21 = 0;
				while(_g21 < tieconnections1.length) {
					var connection1 = tieconnections1[_g21];
					++_g21;
					var fromBarX1 = systembar.getXPosition();
					var fromNoteX1 = systembar.getBarMeasurements().getLeftContentMarginXPosition() + connection1.from.getXPosition();
					var toBarX = systembar.getXPosition() + systembar.getBarMeasurements().getTotalWidth();
					var part1 = connection1.to.getComplex().getPart();
					var partidx1;
					var _this1 = part1.getBar().getParts();
					partidx1 = HxOverrides.indexOf(_this1,part1,0);
					var party1 = partidx1 * 20 * this.scaling.unitY;
					var tielevel1 = 0;
					{
						var _g31 = connection1.tie;
						switch(_g31[1]) {
						case 0:
							var tlevel1 = _g31[3];
							var tdir1 = _g31[2];
							tielevel1 = tlevel1;
							break;
						default:
						}
					}
					var xshift1 = 2;
					var tierect1 = new nx3.geom.Rectangle(fromBarX1 + fromNoteX1 + xshift1,connection1.level + tielevel1,toBarX - (fromBarX1 + fromNoteX1),2);
					this.drawTie(system,tx,ty + party1,tierect1,nx3.EDirectionUD.Down);
				}
			} else {
				var tieconnections2 = systembar.bar.getTieConnections();
				var _g22 = 0;
				while(_g22 < tieconnections2.length) {
					var connection2 = tieconnections2[_g22];
					++_g22;
					var fromBarX2 = systembar.getXPosition();
					var nextsystembar = connection2.to.getComplex().getPart().getBar().getSystembar();
					var toBarX1 = nextsystembar.getXPosition();
					var fromNoteX2 = systembar.getBarMeasurements().getLeftContentMarginXPosition() + connection2.from.getXPosition();
					var toNoteX = nextsystembar.getBarMeasurements().getLeftContentMarginXPosition() + connection2.to.getXPosition();
					var part2 = connection2.to.getComplex().getPart();
					var partidx2;
					var _this2 = part2.getBar().getParts();
					partidx2 = HxOverrides.indexOf(_this2,part2,0);
					var party2 = partidx2 * 20 * this.scaling.unitY;
					var xshift2 = 2;
					var tielevel2 = 0;
					{
						var _g32 = connection2.tie;
						switch(_g32[1]) {
						case 0:
							var tlevel2 = _g32[3];
							var tdir2 = _g32[2];
							tielevel2 = tlevel2;
							break;
						default:
						}
					}
					var tierect2 = new nx3.geom.Rectangle(fromBarX2 + fromNoteX2 + xshift2,connection2.level + tielevel2,toBarX1 + toNoteX - (fromBarX2 + fromNoteX2) - xshift2 - xshift2,2);
					this.drawTie(system,tx,ty + party2,tierect2,nx3.EDirectionUD.Down);
				}
			}
		}
	}
	,drawSystem: function(system) {
		this.drawBarlines(system,system.getSystembars());
		var _g = 0;
		var _g1 = system.getSystembars();
		while(_g < _g1.length) {
			var systembar = _g1[_g];
			++_g;
			this.drawBarAttributes(system,systembar);
			this.drawBarContent(system,systembar);
		}
	}
	,drawBarlines: function(system,systembars) {
		var tx = this.targetX;
		var ty = this.targetY + system.getY() * this.scaling.unitY;
		var part = cx.ArrayTools.first(systembars[0].bar.getParts());
		var partidx;
		var _this = part.getBar().getParts();
		partidx = HxOverrides.indexOf(_this,part,0);
		var party = system.getPartY(0) * this.scaling.unitY;
		var partFirstY = party - 4 * this.scaling.unitY;
		var partY = 0.0;
		var _g = 0;
		while(_g < systembars.length) {
			var systembar = systembars[_g];
			++_g;
			var barX = systembar.getX();
			var barWidth = systembar.getBarMeasurements().getTotalWidth();
			var _g1 = 0;
			var _g2 = systembar.bar.getParts();
			while(_g1 < _g2.length) {
				var part1 = _g2[_g1];
				++_g1;
				var partidx1;
				var _this1 = part1.getBar().getParts();
				partidx1 = HxOverrides.indexOf(_this1,part1,0);
				var part_getYPosition = system.getPartY(partidx1);
				var _g3 = part1.npart.type;
				switch(_g3[1]) {
				case 0:
					var barlineTop = (part_getYPosition - 4) * this.scaling.unitY;
					var barlineBottom = (part_getYPosition + 4) * this.scaling.unitY;
					var barlineX = tx + (barX + barWidth) * this.scaling.unitX;
					this.target.line(barlineX,ty + barlineTop,barlineX,ty + barlineBottom,1.4,0);
					partY = part_getYPosition;
					break;
				default:
				}
			}
		}
		var partLastY = (partY + 4) * this.scaling.unitY;
		this.target.line(tx,ty + partFirstY,tx,ty + partLastY,2,0);
	}
	,drawBarAttributes: function(system,systembar) {
		var tx = this.targetX;
		var _g = 0;
		var _g1 = systembar.bar.getParts();
		while(_g < _g1.length) {
			var part = _g1[_g];
			++_g;
			if(part.npart.type[0] != "Normal") continue;
			var partIdx;
			var _this = systembar.bar.getParts();
			partIdx = HxOverrides.indexOf(_this,part,0);
			var partX = this.targetX + systembar.getX() * this.scaling.unitX;
			var partY = this.targetY + (system.getY() + system.getPartY(partIdx)) * this.scaling.unitY;
			this.target.testLines(partX,partY,systembar.getBarMeasurements().getTotalWidth() * this.scaling.unitX);
			this.drawBarAttributeClef(system,systembar,part);
			this.drawBarAttributeKey(system,systembar,part);
			this.drawBarAttributeTime(system,systembar,part);
		}
	}
	,drawBarAttributeTime: function(system,systembar,part) {
		var showTime = systembar.barConfig.showTime;
		if(!showTime) return;
		var acttime = systembar.actAttributes.time;
		var tx = this.targetX + systembar.getX() * this.scaling.unitX;
		var ty = this.targetY;
		var timeX = systembar.getBarMeasurements().getTimeXPosition() * this.scaling.unitX;
		var partidx;
		var _this = part.getBar().getParts();
		partidx = HxOverrides.indexOf(_this,part,0);
		var part_getYPosition = system.getY() + system.getPartY(partidx);
		var timeChars = nx3.ETimeUtils.toString(acttime).split("/");
		if(timeChars.length == 2) {
			var upperXmlStr = this.getSvgNumber(timeChars[0]);
			var timeY = -3 * this.scaling.unitY;
			this.target.shape(tx + timeX,ty + timeY + part_getYPosition * this.scaling.unitY,upperXmlStr);
			var lowerXmlStr = this.getSvgNumber(timeChars[1]);
			var timeY1 = this.scaling.unitY;
			this.target.shape(tx + timeX,ty + timeY1 + part_getYPosition * this.scaling.unitY,lowerXmlStr);
		} else {
			var midXmlStr = this.getSvgNumber(timeChars[0]);
			var timeY2 = -1 * this.scaling.unitY;
			this.target.shape(tx + timeX,ty + timeY2 + part_getYPosition * this.scaling.unitY,midXmlStr);
		}
	}
	,drawBarAttributeKey: function(system,systembar,part) {
		var showkey = systembar.barConfig.showKey;
		if(!showkey) return;
		var partidx;
		var _this = systembar.bar.getParts();
		partidx = HxOverrides.indexOf(_this,part,0);
		var part_getYPosition = system.getPartY(partidx);
		var actkey = systembar.actAttributes.keys[partidx];
		var tx = this.targetX + systembar.getX() * this.scaling.unitX;
		var ty = this.targetY + system.getY() * this.scaling.unitY;
		var keyX = systembar.getBarMeasurements().getKeyXPosition() * this.scaling.unitX;
		var keyY = this.scaling.unitY;
		var keyCode = nx3.EKeysTools.getSigncode(actkey);
		var svgXmlstr;
		if(keyCode == -1) svgXmlstr = nx3.render.svg.SvgElements.signFlat; else svgXmlstr = nx3.render.svg.SvgElements.signSharp;
		var keyLevels = nx3.EKeysTools.getLevels(actkey,systembar.actAttributes.clefs[partidx]);
		var _g = 0;
		while(_g < keyLevels.length) {
			var level = keyLevels[_g];
			++_g;
			var keyY1 = level * this.scaling.unitY;
			this.target.shape(tx + keyX,ty + keyY1 + part_getYPosition * this.scaling.unitY,svgXmlstr);
			keyX += 2.4 * this.target.getScaling().unitX;
		}
	}
	,drawBarAttributeClef: function(system,systembar,part) {
		var showclef = systembar.barConfig.showClef;
		if(!showclef) return;
		var partidx;
		var _this = systembar.bar.getParts();
		partidx = HxOverrides.indexOf(_this,part,0);
		var part_getYPosition = system.getPartY(partidx);
		var actclef = systembar.actAttributes.clefs[partidx];
		var tx = this.targetX + systembar.getX() * this.scaling.unitX;
		var ty = this.targetY + system.getY() * this.scaling.unitY;
		var clefX = systembar.getBarMeasurements().getClefXPosition() * this.scaling.unitX;
		var clefY = this.scaling.unitY;
		var svgXmlstr;
		switch(actclef[1]) {
		case 2:
			svgXmlstr = nx3.render.svg.SvgElements.clefC;
			break;
		case 0:
			svgXmlstr = nx3.render.svg.SvgElements.clefG;
			break;
		case 1:
			svgXmlstr = nx3.render.svg.SvgElements.clefF;
			break;
		}
		this.target.shape(tx + clefX,ty + clefY + part_getYPosition * this.scaling.unitY,svgXmlstr);
	}
	,drawBarContent: function(system,systembar) {
		var bar = systembar.bar;
		var barx = systembar.getX() + systembar.getBarMeasurements().getContentXPosition();
		var nx = systembar.getBarMeasurements().getContentXPosition();
		var tx = this.targetX + barx * this.scaling.unitX;
		var ty = this.targetY;
		var contentwidth = bar.getContentwidth();
		var _g = 0;
		var _g1 = bar.getParts();
		while(_g < _g1.length) {
			var part = _g1[_g];
			++_g;
			var _g2 = 0;
			var _g3 = part.getVoices();
			while(_g2 < _g3.length) {
				var voice = _g3[_g2];
				++_g2;
				var _g4 = 0;
				var _g5 = voice.getBeamgroups();
				while(_g4 < _g5.length) {
					var beamgroup = _g5[_g4];
					++_g4;
					this.drawBeamgroup(system,systembar,beamgroup);
				}
			}
		}
		var _g6 = 0;
		var _g11 = bar.getColumns();
		while(_g6 < _g11.length) {
			var column = _g11[_g6];
			++_g6;
			var _g21 = 0;
			var _g31 = column.getComplexes();
			while(_g21 < _g31.length) {
				var complex = _g31[_g21];
				++_g21;
				this.drawComplex(system,systembar,complex);
			}
		}
	}
	,drawNoteHeads: function(system,systembar,note) {
		var _g3 = this;
		var part = note.getComplex().getPart();
		var partidx;
		var _this = part.getBar().getParts();
		partidx = HxOverrides.indexOf(_this,part,0);
		var part_getYPosition = system.getPartY(partidx);
		var barx = systembar.getX() + systembar.getBarMeasurements().getContentXPosition();
		var x = this.targetX + (barx + note.getComplex().getXPosition()) * this.target.getScaling().unitX;
		var y = this.targetY + (system.getY() + part_getYPosition) * this.target.getScaling().unitY;
		{
			var _g = note.nnote.type;
			switch(_g[1]) {
			case 4:
				var font = _g[5];
				var c = _g[4];
				var o = _g[3];
				var text = _g[2];
				var rect = cx.ArrayTools.first(note.getHeadsRects());
				this.target.rectangle(x,y,rect,1,255);
				this.target.text(x + rect.x * this.scaling.unitX,y + rect.y * this.scaling.unitY,text);
				break;
			case 7:
				var midinote = _g[3];
				var level = _g[2];
				var rect1 = cx.ArrayTools.first(note.getHeadsRects());
				var nextnote = note.getNext();
				var width;
				if(nextnote != null) {
					var nextX = nextnote.getXPosition();
					width = nextX - note.getXPosition();
				} else width = systembar.getBarMeasurements().getContentWidth() - note.getXPosition();
				this.target.rectangle(x,y,new nx3.geom.Rectangle(rect1.x,rect1.y,width,rect1.height),3,255);
				break;
			case 3:
				var pause = _g[4];
				var sign = _g[3];
				var level1 = _g[2];
				var rect2 = cx.ArrayTools.first(note.getHeadsRects()).clone();
				rect2.inflate(-0.8,-0.8);
				var color;
				if(pause) color = 11184810; else color = 0;
				this.target.filledellipse(x,y,rect2,this.scaling.linesWidth * 5,color,16777215);
				var levelmod = (-level1 + 21) % 7;
				var numSvgStr;
				switch(levelmod) {
				case 0:
					numSvgStr = nx3.render.svg.SvgElements.tpl1;
					break;
				case 1:
					numSvgStr = nx3.render.svg.SvgElements.tpl2;
					break;
				case 2:
					numSvgStr = nx3.render.svg.SvgElements.tpl3;
					break;
				case 3:
					numSvgStr = nx3.render.svg.SvgElements.tpl4;
					break;
				case 4:
					numSvgStr = nx3.render.svg.SvgElements.tpl5;
					break;
				case 5:
					numSvgStr = nx3.render.svg.SvgElements.tpl6;
					break;
				case 6:
					numSvgStr = nx3.render.svg.SvgElements.tpl7;
					break;
				default:
					numSvgStr = nx3.render.svg.SvgElements.tpl1;
				}
				if(pause) {
					numSvgStr = StringTools.replace(numSvgStr,"fill:#000000","fill:#AAAAAA");
					console.log(numSvgStr);
				}
				var tx;
				if(this.scaling == nx3.render.scaling.Scaling.NORMAL) tx = x - this.scaling.unitX * 5; else tx = x - this.scaling.unitX * 5.5;
				var ty;
				if(note.getVoice().getPart().npart.type[0] == "Tplchain") ty = y + level1 * 3 * this.scaling.unitY; else ty = y;
				ty += this.scaling.unitY * .4;
				this.target.shape(tx,ty,numSvgStr,color);
				var signSvgStr;
				if(sign != null) switch(sign[1]) {
				case 2:
					signSvgStr = nx3.render.svg.SvgElements.tplArrowDown;
					break;
				case 3:
					signSvgStr = nx3.render.svg.SvgElements.tplArrowUp;
					break;
				default:
					signSvgStr = nx3.render.svg.SvgElements.tplArrowUp;
				} else signSvgStr = "";
				if(signSvgStr != "") this.target.shape(tx,ty,signSvgStr,color);
				break;
			default:
				var svginfo = nx3.render.RendererTools.getHeadSvgInfo(note.nnote);
				var hx1 = x;
				var hx2 = x;
				var _g1 = 0;
				var _g2 = note.getHeadsRects();
				while(_g1 < _g2.length) {
					var rect3 = [_g2[_g1]];
					++_g1;
					this.target.shape(x + rect3[0].x * this.scaling.unitX,y + (rect3[0].y + svginfo.y) * this.scaling.unitY,svginfo.xmlStr);
					this.target.interactiveEllipse(x,y,rect3[0],5 * this.scaling.linesWidth,3585587,null,(function(rect3) {
						return function(activityType) {
							var _g4 = 0;
							var _g5 = _g3.interactions;
							while(_g4 < _g5.length) {
								var interaction = _g5[_g4];
								++_g4;
								interaction.handleAction(nx3.action.EActionType.NoteAction(activityType,note,nx3.action.EActionInfo.TargetXY(_g3.target,x + rect3[0].x * _g3.scaling.unitX,y + rect3[0].y * _g3.scaling.unitY)));
							}
						};
					})(rect3));
				}
				var i = 0;
				var _g11 = 0;
				var _g21 = note.getHeadsRects();
				while(_g11 < _g21.length) {
					var rect4 = _g21[_g11];
					++_g11;
					var level2 = note.getHeads()[i].nhead.level;
					if(level2 > 5 || level2 < -5) {
						hx1 = Math.min(hx1,x + (rect4.x - 0.6) * this.scaling.unitX);
						hx2 = Math.max(hx2,x + (rect4.x + rect4.width + 0.6) * this.scaling.unitX);
					}
					i++;
				}
				var _g12 = 0;
				var _g22 = note.getHeads();
				while(_g12 < _g22.length) {
					var head = _g22[_g12];
					++_g12;
					var level3 = head.nhead.level;
					if(level3 < 5 && level3 > -5) continue;
					var lev1;
					if(level3 < 0) lev1 = level3; else lev1 = 5;
					var lev2;
					if(level3 < 0) lev2 = -4; else lev2 = level3 + 1;
					var _g31 = lev1;
					while(_g31 < lev2) {
						var l = _g31++;
						if((l + 100) % 2 == 1) continue;
						var hy = y + l * this.scaling.unitY;
						this.target.line(hx1,hy,hx2,hy,1,0);
					}
				}
			}
		}
	}
	,drawComplex: function(system,systembar,complex) {
		if(complex == null) return;
		var _g = 0;
		var _g1 = complex.getNotes();
		while(_g < _g1.length) {
			var note = _g1[_g];
			++_g;
			this.drawNoteHeads(system,systembar,note);
		}
		this.drawComplexSigns(system,systembar,complex);
		this.drawComplexDots(system,systembar,complex);
		this.drawComplexTies(system,systembar,complex);
	}
	,drawComplexTies: function(system,systembar,complex,nx,ny) {
		if(ny == null) ny = 0;
		if(nx == null) nx = 0;
		var part = complex.getPart();
		var partidx;
		var _this = part.getBar().getParts();
		partidx = HxOverrides.indexOf(_this,part,0);
		var part_getYPosition = system.getPartY(partidx);
		var barx = systembar.getX() + systembar.getBarMeasurements().getContentXPosition();
		var x = this.targetX + (barx + complex.getXPosition()) * this.target.getScaling().unitX;
		var y = this.targetY + (system.getY() + part_getYPosition) * this.target.getScaling().unitY;
		var _g = 0;
		var _g1 = complex.getTieinfos();
		while(_g < _g1.length) {
			var info = _g1[_g];
			++_g;
			var rect = info.rect;
			var direction = info.direction;
			if(info.target != null) {
				var targetcomplex = info.target.getNote().getComplex();
				var thisx = complex.getXPosition() + rect.x;
				var targetAllRect = nx3.geom.RectanglesTools.unionAll(targetcomplex.getAllRects());
				var targetx = targetcomplex.getXPosition() + targetAllRect.x;
				var xshift = .5 * this.scaling.unitX;
				rect.width = targetx - thisx - 0.5;
				this.drawTie(system,x + xshift,y,rect,direction);
			} else rect.width = 6;
		}
	}
	,drawComplexDots: function(system,systembar,complex,nx,ny) {
		if(ny == null) ny = 0;
		if(nx == null) nx = 0;
		var _g = 0;
		var _g1 = complex.getDotRects();
		while(_g < _g1.length) {
			var r = _g1[_g];
			++_g;
			var part = complex.getPart();
			var partidx;
			var _this = part.getBar().getParts();
			partidx = HxOverrides.indexOf(_this,part,0);
			var part_getYPosition = system.getPartY(partidx);
			var barx = systembar.getX() + systembar.getBarMeasurements().getContentXPosition();
			var x = this.targetX + (barx + complex.getXPosition()) * this.target.getScaling().unitX;
			var y = this.targetY + (system.getY() + part_getYPosition) * this.target.getScaling().unitY;
			var crect = r.clone();
			var ddot = crect.width == 3.0;
			crect.offset(0.9,0.2);
			crect.width = 0.7;
			crect.height = 0.6;
			this.target.filledellipse(x,y,crect,0,0,0);
			if(!ddot) continue;
			crect.offset(1.3,0);
			this.target.filledellipse(x,y,crect,0,0,0);
		}
	}
	,drawComplexSigns: function(system,systembar,complex,nx,ny) {
		if(ny == null) ny = 0;
		if(nx == null) nx = 0;
		var part = complex.getPart();
		var partidx;
		var _this = part.getBar().getParts();
		partidx = HxOverrides.indexOf(_this,part,0);
		var part_getYPosition = system.getPartY(partidx);
		var barx = systembar.getX() + systembar.getBarMeasurements().getContentXPosition();
		var x = this.targetX + (barx + complex.getXPosition()) * this.target.getScaling().unitX;
		var y = this.targetY + (system.getY() + part_getYPosition) * this.target.getScaling().unitY;
		var signs = complex.getVisibleSigns();
		var rects = complex.getSignsRects();
		var _g1 = 0;
		var _g = signs.length;
		while(_g1 < _g) {
			var i = _g1++;
			var sign = signs[i];
			var rect = rects[i];
			var xmlStr;
			var _g2 = sign.sign;
			switch(_g2[1]) {
			case 2:
				xmlStr = nx3.render.svg.SvgElements.signFlat;
				break;
			case 1:
				xmlStr = nx3.render.svg.SvgElements.signNatural;
				break;
			case 3:
				xmlStr = nx3.render.svg.SvgElements.signSharp;
				break;
			default:
				xmlStr = null;
			}
			if(xmlStr != null) this.target.shape(x + rect.x * this.scaling.unitX,y + (rect.y + 2) * this.scaling.unitY,xmlStr);
		}
	}
	,drawBeamgroup: function(system,systembar,beamgroup) {
		var frame = beamgroup.getFrame();
		if(frame == null) return;
		var barx = systembar.getX() + systembar.getBarMeasurements().getContentXPosition();
		var tx = this.targetX + barx * this.scaling.unitX;
		var ty = this.targetY + system.getY() * this.scaling.unitY;
		var part = beamgroup.getPVoice().getPart();
		var partidx;
		var _this = part.getBar().getParts();
		partidx = HxOverrides.indexOf(_this,part,0);
		var part_getYPosition = system.getPartY(partidx);
		var rightY = ty + part_getYPosition * this.target.getScaling().unitY;
		var direction = beamgroup.getDirection();
		var firstnote = beamgroup.pnotes[0];
		var leftX = cx.ArrayTools.first(beamgroup.getNotesStemXPositions()) * this.scaling.unitX;
		var leftOuterY = frame.leftOuterY * this.scaling.unitY;
		var leftInnerY = frame.leftInnerY * this.scaling.unitY;
		var leftTipY = frame.leftTipY * this.scaling.unitY;
		this.target.line(tx + leftX,rightY + leftInnerY,tx + leftX,rightY + leftTipY,1,0);
		if(beamgroup.pnotes.length == 1) {
			if(nx3.ENoteValTools.beaminglevel(firstnote.nnote.value) > 0) {
				if(beamgroup.getDirection() == nx3.EDirectionUD.Up) {
					var adjustX = 0.6 * this.scaling.unitX;
					var adjustY = this.scaling.unitY;
					var flag;
					if(nx3.ENoteValTools.beaminglevel(firstnote.nnote.value) == 2) flag = nx3.render.svg.SvgElements.flagUp16; else flag = nx3.render.svg.SvgElements.flagUp8;
					this.target.shape(tx + leftX - adjustX,rightY + adjustY + leftTipY,flag,0);
				} else {
					var adjustX1 = 0.6 * this.scaling.unitX;
					var adjustY1 = -3 * this.scaling.unitY;
					var flag1;
					if(nx3.ENoteValTools.beaminglevel(firstnote.nnote.value) == 2) flag1 = nx3.render.svg.SvgElements.flagDown16; else flag1 = nx3.render.svg.SvgElements.flagDown8;
					this.target.shape(tx + leftX - adjustX1,rightY + adjustY1 + leftTipY,flag1,0);
				}
			}
		}
		if(beamgroup.pnotes.length < 2) return;
		var storeY = [rightY + leftTipY];
		var storeX = [tx + leftX];
		var lastnote = cx.ArrayTools.last(beamgroup.pnotes);
		var rightX = cx.ArrayTools.last(beamgroup.getNotesStemXPositions()) * this.scaling.unitX;
		var rightOuterY = frame.rightOuterY * this.scaling.unitY;
		var rightInnerY = frame.rightInnerY * this.scaling.unitY;
		var rightTipY = frame.rightTipY * this.scaling.unitY;
		this.target.line(tx + rightX,rightY + rightInnerY,tx + rightX,rightY + rightTipY,1,0);
		var beamh = 0.95 * this.scaling.unitY;
		if(beamgroup.getDirection() == nx3.EDirectionUD.Up) beamh = -beamh; else beamh = beamh;
		this.target.parallellogram(tx + leftX,rightY + leftTipY - beamh,tx + rightX,rightY + rightTipY - beamh,beamh,0,0,0);
		if(beamgroup.pnotes.length > 2) {
			var _g1 = 1;
			var _g = frame.outerLevels.length - 1;
			while(_g1 < _g) {
				var i = _g1++;
				var midX = beamgroup.getNotesStemXPositions()[i] * this.scaling.unitX;
				var midInnerY = frame.innerLevels[i] * this.scaling.unitY;
				var delta = (midX - leftX) / (rightX - leftX);
				var midTipY = leftTipY + (rightTipY - leftTipY) * delta;
				this.target.line(tx + midX,rightY + midInnerY,tx + midX,rightY + midTipY,1,0);
				storeY.push(rightY + midTipY);
				storeX.push(tx + midX);
			}
		}
		storeY.push(rightY + rightTipY);
		storeX.push(tx + rightX);
		var idx = 0;
		var beamh1 = 0.95 * this.scaling.unitY;
		var _g2 = 0;
		var _g11 = beamgroup.getFrame().beamflags;
		while(_g2 < _g11.length) {
			var flagtype = _g11[_g2];
			++_g2;
			var adjustY2;
			if(beamgroup.getDirection() == nx3.EDirectionUD.Up) adjustY2 = 2.1; else adjustY2 = -2.1;
			adjustY2 *= this.scaling.unitY;
			var currX = storeX[idx];
			var currY = storeY[idx] + adjustY2;
			var nextX = storeX[idx + 1];
			var nextY = storeY[idx + 1] + adjustY2;
			var factor = 2.2 * this.scaling.unitX;
			switch(flagtype[1]) {
			case 3:
				this.target.parallellogram(currX,currY - beamh1 / 2,nextX,nextY - beamh1 / 2,beamh1,0,0,0);
				break;
			case 1:
				var endX = currX + factor;
				var endY = factor / (nextX - currX) * (nextY - currY) + currY;
				this.target.parallellogram(currX,currY - beamh1 / 2,endX,endY - beamh1 / 2,beamh1,0,0,0);
				break;
			case 2:
				var startX = nextX - factor;
				var startY = -((nextX - startX) / (nextX - currX)) * (nextY - currY) + nextY;
				this.target.parallellogram(startX,startY - beamh1 / 2,nextX,nextY - beamh1 / 2,beamh1,0,0,0);
				break;
			default:
			}
			idx++;
		}
	}
	,drawBeamgroupX: function(system,beamgroup,nx,ny) {
		if(ny == null) ny = 0;
		if(nx == null) nx = 0;
		var frame = beamgroup.getFrame();
		if(frame == null) return;
		var tx = this.targetX + nx * this.scaling.unitX;
		var ty = this.targetY + ny * this.scaling.unitY;
		var part = beamgroup.getPVoice().getPart();
		var partidx;
		var _this = part.getBar().getParts();
		partidx = HxOverrides.indexOf(_this,part,0);
		var part_getYPosition = partidx * 20;
		var rightY = this.targetY + part_getYPosition * this.target.getScaling().unitY;
		var direction = beamgroup.getDirection();
		var firstnote = beamgroup.pnotes[0];
		var leftX = cx.ArrayTools.first(beamgroup.getNotesStemXPositions()) * this.scaling.unitX;
		var leftOuterY = frame.leftOuterY * this.scaling.unitY;
		var leftInnerY = frame.leftInnerY * this.scaling.unitY;
		var leftTipY = frame.leftTipY * this.scaling.unitY;
		this.target.line(this.targetX + leftX,rightY + leftInnerY,this.targetX + leftX,rightY + leftTipY,1,0);
		if(beamgroup.pnotes.length == 1) {
			if(nx3.ENoteValTools.beaminglevel(firstnote.nnote.value) > 0) {
				if(beamgroup.getDirection() == nx3.EDirectionUD.Up) {
					var adjustX = 0.6 * this.scaling.unitX;
					var adjustY = this.scaling.unitY;
					var flag;
					if(nx3.ENoteValTools.beaminglevel(firstnote.nnote.value) == 2) flag = nx3.render.svg.SvgElements.flagUp16; else flag = nx3.render.svg.SvgElements.flagUp8;
					this.target.shape(this.targetX + leftX - adjustX,rightY + adjustY + leftTipY,flag,0);
				} else {
					var adjustX1 = 0.6 * this.scaling.unitX;
					var adjustY1 = -3 * this.scaling.unitY;
					var flag1;
					if(nx3.ENoteValTools.beaminglevel(firstnote.nnote.value) == 2) flag1 = nx3.render.svg.SvgElements.flagDown16; else flag1 = nx3.render.svg.SvgElements.flagDown8;
					this.target.shape(this.targetX + leftX - adjustX1,rightY + adjustY1 + leftTipY,flag1,0);
				}
			}
		}
		if(beamgroup.pnotes.length < 2) return;
		var storeY = [rightY + leftTipY];
		var storeX = [this.targetX + leftX];
		var lastnote = cx.ArrayTools.last(beamgroup.pnotes);
		var rightX = cx.ArrayTools.last(beamgroup.getNotesStemXPositions()) * this.scaling.unitX;
		var rightOuterY = frame.rightOuterY * this.scaling.unitY;
		var rightInnerY = frame.rightInnerY * this.scaling.unitY;
		var rightTipY = frame.rightTipY * this.scaling.unitY;
		this.target.line(this.targetX + rightX,rightY + rightInnerY,this.targetX + rightX,rightY + rightTipY,1,0);
		var beamh = 0.95 * this.scaling.unitY;
		if(beamgroup.getDirection() == nx3.EDirectionUD.Up) beamh = -beamh; else beamh = beamh;
		this.target.parallellogram(this.targetX + leftX,rightY + leftTipY - beamh,this.targetX + rightX,rightY + rightTipY - beamh,beamh,0,0,0);
		if(beamgroup.pnotes.length > 2) {
			var _g1 = 1;
			var _g = frame.outerLevels.length - 1;
			while(_g1 < _g) {
				var i = _g1++;
				var midX = beamgroup.getNotesStemXPositions()[i] * this.scaling.unitX;
				var midInnerY = frame.innerLevels[i] * this.scaling.unitY;
				var delta = (midX - leftX) / (rightX - leftX);
				var midTipY = leftTipY + (rightTipY - leftTipY) * delta;
				this.target.line(this.targetX + midX,rightY + midInnerY,this.targetX + midX,rightY + midTipY,1,0);
				storeY.push(rightY + midTipY);
				storeX.push(this.targetX + midX);
			}
		}
		storeY.push(rightY + rightTipY);
		storeX.push(this.targetX + rightX);
		var idx = 0;
		var beamh1 = 0.95 * this.scaling.unitY;
		var _g2 = 0;
		var _g11 = beamgroup.getFrame().beamflags;
		while(_g2 < _g11.length) {
			var flagtype = _g11[_g2];
			++_g2;
			var adjustY2;
			if(beamgroup.getDirection() == nx3.EDirectionUD.Up) adjustY2 = 2.1; else adjustY2 = -2.1;
			adjustY2 *= this.scaling.unitY;
			var currX = storeX[idx];
			var currY = storeY[idx] + adjustY2;
			var nextX = storeX[idx + 1];
			var nextY = storeY[idx + 1] + adjustY2;
			var factor = 2.2 * this.scaling.unitX;
			switch(flagtype[1]) {
			case 3:
				this.target.parallellogram(currX,currY - beamh1 / 2,nextX,nextY - beamh1 / 2,beamh1,0,0,0);
				break;
			case 1:
				var endX = currX + factor;
				var endY = factor / (nextX - currX) * (nextY - currY) + currY;
				this.target.parallellogram(currX,currY - beamh1 / 2,endX,endY - beamh1 / 2,beamh1,0,0,0);
				break;
			case 2:
				var startX = nextX - factor;
				var startY = -((nextX - startX) / (nextX - currX)) * (nextY - currY) + nextY;
				this.target.parallellogram(startX,startY - beamh1 / 2,nextX,nextY - beamh1 / 2,beamh1,0,0,0);
				break;
			default:
			}
			idx++;
		}
	}
	,drawTie: function(system,x,y,rect,direction) {
		var a1 = null;
		var c1 = null;
		var c2 = null;
		var a2 = null;
		if(direction == nx3.EDirectionUD.Down) {
			a1 = { x : rect.x, y : rect.y};
			c1 = { x : rect.x + 1, y : rect.get_bottom()};
			c2 = { x : rect.get_right() - 1, y : rect.get_bottom()};
			a2 = { x : rect.get_right(), y : rect.y};
		} else {
			a1 = { x : rect.x, y : rect.get_bottom()};
			c1 = { x : rect.x + 1, y : rect.y};
			c2 = { x : rect.get_right() - 1, y : rect.y};
			a2 = { x : rect.get_right(), y : rect.get_bottom()};
		}
		var coords1 = nx3.geom.BezieerTool.bezieerCoordinates(a1,c1,c2,a2);
		var thickness = 0.06 * this.scaling.unitY;
		if(direction == nx3.EDirectionUD.Down) {
			c1 = { x : rect.x, y : rect.get_bottom() - thickness};
			c2 = { x : rect.get_right(), y : rect.get_bottom() - thickness};
		} else {
			c1 = { x : rect.x, y : rect.y + thickness};
			c2 = { x : rect.get_right(), y : rect.y + thickness};
		}
		var coords2 = nx3.geom.BezieerTool.bezieerCoordinates(a2,c2,c1,a1);
		coords1.shift();
		var coords = coords1.concat(coords2);
		this.target.polyfill(x,y,coords);
	}
	,getSvgNumber: function($char) {
		switch($char) {
		case "0":
			return nx3.render.svg.SvgElements.time0;
		case "1":
			return nx3.render.svg.SvgElements.time1;
		case "2":
			return nx3.render.svg.SvgElements.time2;
		case "3":
			return nx3.render.svg.SvgElements.time3;
		case "4":
			return nx3.render.svg.SvgElements.time4;
		case "5":
			return nx3.render.svg.SvgElements.time5;
		case "6":
			return nx3.render.svg.SvgElements.time6;
		case "7":
			return nx3.render.svg.SvgElements.time7;
		case "8":
			return nx3.render.svg.SvgElements.time8;
		case "9":
			return nx3.render.svg.SvgElements.time9;
		case "C":
			return nx3.render.svg.SvgElements.timeCommon;
		case "AllaBreve":
			return nx3.render.svg.SvgElements.timeAllabreve;
		default:
			return "";
		}
	}
	,getTarget: function() {
		return this.target;
	}
	,interactiveComplex: function(system,complex,nx,ny) {
		if(complex == null) return;
		var part = complex.getPart();
		var partidx;
		var _this = part.getBar().getParts();
		partidx = HxOverrides.indexOf(_this,part,0);
		var part_getYPosition = partidx * 20;
		var x = this.targetX + (nx + complex.getXPosition()) * this.target.getScaling().unitX;
		var y = this.targetY + (ny + part_getYPosition) * this.target.getScaling().unitY;
		var _g = 0;
		var _g1 = complex.getNotes();
		while(_g < _g1.length) {
			var note = _g1[_g];
			++_g;
			this.interactiveNote(system,note,nx,ny);
		}
	}
	,interactiveNote: function(system,note,nx,ny) {
		var part = note.getComplex().getPart();
		var partidx;
		var _this = part.getBar().getParts();
		partidx = HxOverrides.indexOf(_this,part,0);
		var part_getYPosition = partidx * 20;
		var x = this.targetX + (nx + note.getComplex().getXPosition()) * this.target.getScaling().unitX;
		var y = this.targetY + (ny + part_getYPosition) * this.target.getScaling().unitY;
	}
	,__class__: nx3.render.Renderer
};
nx3.render.RendererTools = function() { };
nx3.render.RendererTools.__name__ = true;
nx3.render.RendererTools.getHeadSvgInfo = function(nnote) {
	{
		var _g = nnote.type;
		switch(_g[1]) {
		case 0:
			var attributes = _g[5];
			var articulations = _g[4];
			var variant = _g[3];
			var heads = _g[2];
			var _g1 = nx3.ENoteValTools.head(nnote.value);
			switch(_g1[1]) {
			case 2:
				return { xmlStr : nx3.render.svg.SvgElements.noteWhole, y : 0};
			case 1:
				return { xmlStr : nx3.render.svg.SvgElements.noteWhite, y : 0};
			default:
				return { xmlStr : nx3.render.svg.SvgElements.noteBlack, y : 0};
			}
			break;
		case 1:
			var level = _g[2];
			var _g11 = nx3.ENoteValTools.beaminglevel(nnote.value);
			switch(_g11) {
			case 0:
				var _g2 = nx3.ENoteValTools.head(nnote.value);
				switch(_g2[1]) {
				case 0:
					return { xmlStr : nx3.render.svg.SvgElements.pauseNv4, y : 2};
				case 1:
					return { xmlStr : nx3.render.svg.SvgElements.pauseNv2, y : 2};
				case 2:
					return { xmlStr : nx3.render.svg.SvgElements.pauseNv1, y : 2};
				}
				break;
			case 1:
				return { xmlStr : nx3.render.svg.SvgElements.pauseNv8, y : 2};
			case 2:
				return { xmlStr : nx3.render.svg.SvgElements.pauseNv16, y : 2};
			case 3:
				return { xmlStr : nx3.render.svg.SvgElements.pauseNv16, y : 2};
			default:
				return { xmlStr : nx3.render.svg.SvgElements.clefG, y : 2};
			}
			break;
		default:
			return { xmlStr : nx3.render.svg.SvgElements.clefG, y : 2};
		}
	}
};
nx3.render.TargetSvg = function(svgId,scaling,jsFileName) {
	this.svgId = svgId;
	if(scaling != null) this.scaling = scaling; else this.scaling = nx3.render.scaling.Scaling.NORMAL;
	this.jsFileName = jsFileName;
	this.snap = new Snap(svgId);
	this.font = nx3.Constants.FONT_TEXT_DEFAULTFORMAT;
};
nx3.render.TargetSvg.__name__ = true;
nx3.render.TargetSvg.__interfaces__ = [nx3.render.ITarget];
nx3.render.TargetSvg.hex = function($int) {
	if($int == 0) return "#000"; else return "#" + StringTools.hex($int);
};
nx3.render.TargetSvg.prototype = {
	testLines: function(x,y,width) {
		var _g = -2;
		while(_g < 3) {
			var i = _g++;
			var cy = y + i * this.scaling.space;
			var line = this.snap.line(x,cy,x + width,cy);
			line.attr({ stroke : "#000", strokeWidth : this.scaling.linesWidth});
		}
	}
	,getScaling: function() {
		return this.scaling;
	}
	,rect: function(x,y,rect,lineWidth,lineColor) {
		if(lineColor == null) lineColor = 0;
		var r = this.snap.rect(x + rect.x,y + rect.y,rect.width,rect.height);
		r.attr({ fill : "none", stroke : lineColor == 0?"#000":"#" + StringTools.hex(lineColor), strokeWidth : lineWidth});
	}
	,rectangle: function(x,y,rect,lineWidth,lineColor) {
		if(lineColor == null) lineColor = 0;
		if(lineWidth == null) lineWidth = 1;
		var r = this.snap.rect(x + rect.x * this.scaling.unitX,y + rect.y * this.scaling.unitY,rect.width * this.scaling.unitX,rect.height * this.scaling.unitY);
		r.attr({ fill : "none", stroke : lineColor == 0?"#000":"#" + StringTools.hex(lineColor), strokeWidth : lineWidth * this.scaling.linesWidth});
	}
	,rectangles: function(x,y,rects,lineWidth,lineColor) {
		if(lineColor == null) lineColor = 0;
		var _g = 0;
		while(_g < rects.length) {
			var rect = rects[_g];
			++_g;
			this.rectangle(x,y,rect,lineWidth,lineColor);
		}
	}
	,line: function(x,y,x2,y2,lineWidth,lineColor) {
		if(lineColor == null) lineColor = 0;
		this.snap.line(x,y,x2,y2).attr({ stroke : lineColor == 0?"#000":"#" + StringTools.hex(lineColor), strokeWidth : lineWidth * this.scaling.linesWidth});
	}
	,shape: function(x,y,xmlStr,fillColor) {
		if(fillColor == null) fillColor = 0;
		var xml = Xml.parse(xmlStr);
		var element = null;
		var elementTag = xml.firstElement().firstChild().firstChild().get_nodeName().toLowerCase();
		switch(elementTag) {
		case "path":
			var pathD = xml.firstElement().firstChild().firstChild().get("d");
			element = this.snap.path(pathD).attr({ fill : "#000000", stroke : "none"});
			break;
		case "rect":
			var rectXml = xml.firstElement().firstChild().firstChild();
			element = this.snap.rect(Std.parseFloat(rectXml.get("x")),Std.parseFloat(rectXml.get("y")),Std.parseFloat(rectXml.get("width")),Std.parseFloat(rectXml.get("height"))).attr({ fill : "#000000", stroke : "none"});
			break;
		default:
		}
		y = y + this.scaling.svgY;
		x = x + this.scaling.svgX;
		var g = this.snap.el("svg",{ x : x, y : y});
		g.append(element);
		var sc = this.scaling.svgScale;
		element.transform("matrix(" + sc + ",0,0," + sc + ",0,0)");
	}
	,text: function(x,y,text) {
		var fontsize = this.font.size * this.scaling.fontScaling;
		x = x + -2.2 * this.scaling.fontScaling;
		y = y + -13 * this.scaling.fontScaling;
		var etext = this.snap.text(x,y,text).attr({ fontSize : "" + fontsize + "px ", fontFamily : this.font.name});
	}
	,textwidth: function(text) {
		if(this.context == null) {
			var canvas = window.document.getElementById("CanvasTextMeasurement");
			if(canvas == null) js.Lib.alert("Canvas element " + "CanvasTextMeasurement" + " is missing!");
			this.context = canvas.getContext("2d");
		}
		var fontsize = this.font.size * this.scaling.fontScaling;
		var fontstr = "" + fontsize + "px " + this.font.name;
		this.context.font = fontstr;
		var measure = this.context.measureText(text);
		return measure.width / this.scaling.unitX;
	}
	,textheight: function(text) {
		return this.font.size / 3.8;
	}
	,setFont: function(font) {
		this.font = font;
	}
	,filledrectangle: function(x,y,rect,lineWidth,lineColor,fillColor) {
	}
	,filledellipse: function(x,y,rect,lineWidth,lineColor,fillColor) {
		if(fillColor == null) fillColor = 65280;
		if(lineColor == null) lineColor = 16711680;
		if(lineWidth == null) lineWidth = 1;
		var el = this.snap.ellipse(x + (rect.x + rect.width / 2) * this.scaling.unitX,y + (rect.y + rect.height / 2) * this.scaling.unitY,rect.width / 2 * this.scaling.unitX,rect.height / 2 * this.scaling.unitY);
		el.attr({ fill : fillColor == 0?"#000":"#" + StringTools.hex(fillColor), stroke : lineColor == 0?"#000":"#" + StringTools.hex(lineColor), strokeWidth : lineWidth * this.scaling.linesWidth});
	}
	,parallellogram: function(x,y,x2,y2,pheight,lineWidth,lineColor,fillColor) {
		if(fillColor == null) fillColor = 65280;
		if(lineColor == null) lineColor = 16711680;
		if(lineWidth == null) lineWidth = 1;
		var pathStr = "M " + x + " " + y + " L " + x2 + " " + y2 + "  L " + x2 + " " + (y2 + pheight) + "  L " + x + "  " + (y + pheight) + "  L " + x + " " + y;
		var el = this.snap.path(pathStr);
		el.attr({ fill : fillColor == 0?"#000":"#" + StringTools.hex(fillColor), stroke : lineColor == 0?"#000":"#" + StringTools.hex(lineColor), strokeWidth : lineWidth * this.scaling.linesWidth});
	}
	,clear: function() {
		var svgElement = new js.JQuery(this.svgId);
		svgElement.empty();
	}
	,polyline: function(x,y,coordinates,lineWidth,lineColor) {
		if(lineColor == null) lineColor = 0;
		if(lineWidth == null) lineWidth = 1;
		var pathStr = this.getPathString(x,y,coordinates);
		var el = this.snap.path(pathStr);
		el.attr({ stroke : lineColor == 0?"#000":"#" + StringTools.hex(lineColor), strokeWidth : lineWidth * this.scaling.linesWidth});
	}
	,polyfill: function(x,y,coordinates,lineWidth,lineColor,fillColor) {
		if(fillColor == null) fillColor = 0;
		if(lineColor == null) lineColor = 0;
		if(lineWidth == null) lineWidth = 1;
		var pathStr = this.getPathString(x,y,coordinates);
		var el = this.snap.path(pathStr);
		el.attr({ fill : fillColor == 0?"#000":"#" + StringTools.hex(fillColor), stroke : lineColor == 0?"#000":"#" + StringTools.hex(lineColor), strokeWidth : lineWidth * this.scaling.linesWidth});
	}
	,interactiveEllipse: function(x,y,rect,lineWidth,lineColor,fillColor,cb) {
		var rect1 = this.scaleRect(rect);
		x = x + this.scaling.unitX;
		y = y + this.scaling.unitY;
		var el = this.snap.ellipse(x + rect1.x * this.scaling.unitX,y + rect1.y * this.scaling.unitY,rect1.width,rect1.height);
		el.attr({ fill : fillColor == 0?"#000":"#" + StringTools.hex(fillColor), stroke : "#ddd", strokeWidth : lineWidth, fillOpacity : 0.0, strokeOpacity : 0.1});
		el.mouseover(function(e) {
			el.attr({ fillOpacity : 0.0, strokeOpacity : 0.5, stroke : lineColor == 0?"#000":"#" + StringTools.hex(lineColor)});
			cb(nx3.action.EActivityType.MouseOver);
		});
		el.mouseout(function(e1) {
			el.attr({ fillOpacity : 0.0, strokeOpacity : 0.1, stroke : "#ddd"});
			cb(nx3.action.EActivityType.MouseOut);
		});
		if(cb != null) el.mousedown(function(e2) {
			cb(nx3.action.EActivityType.MouseDown);
		});
		el.mouseup(function(e3) {
			cb(nx3.action.EActivityType.MouseUp);
		});
	}
	,scaleRect: function(rect,inflateX,inflateY) {
		if(inflateY == null) inflateY = 0;
		if(inflateX == null) inflateX = 0;
		var result = new nx3.geom.Rectangle(rect.x,rect.y,rect.width * this.scaling.unitX,rect.height * this.scaling.unitX);
		if(inflateX != 0 || inflateY != 0) result.inflate(inflateX * this.scaling.unitX,inflateY * this.scaling.unitY);
		return result;
	}
	,tooltipShow: function(rect,text) {
		if(this.tooltip == null) this.createTooltip(rect,text);
		if(this.tooltip != null) {
			this.tooltip.attr({ x : Math.round(rect.x), y : Math.round(rect.y), visibility : "visible"});
			this.toolText.node.textContent = text;
		}
	}
	,tooltipHide: function() {
		if(this.tooltip != null) this.tooltip.attr({ visibility : "hidden"});
	}
	,createTooltip: function(rect,text) {
		this.tooltip = this.snap.el("svg",{ x : rect.x, y : rect.y});
		var toolBackground = this.snap.rect(0,0,rect.width,rect.height);
		toolBackground.attr({ fill : "#fff2ca", stroke : "#666666", rx : 4, ry : 4, strokeWidth : 1});
		this.tooltip.append(toolBackground);
		this.toolText = this.snap.text(8,19,"");
		this.toolText.attr({ fontSize : "13px ", fontFamily : "Open Sans"});
		this.tooltip.append(this.toolText);
		this.tooltip.attr({ visibility : "hidden"});
	}
	,getPathString: function(x,y,coordinates) {
		var pathStr = "";
		var first = coordinates.shift();
		var cx = x + first.x * this.scaling.unitX;
		var cy = y + first.y * this.scaling.unitY;
		pathStr += "M " + cx + " " + cy + " ";
		var _g = 0;
		while(_g < coordinates.length) {
			var coord = coordinates[_g];
			++_g;
			var cx1 = x + coord.x * this.scaling.unitX;
			var cy1 = y + coord.y * this.scaling.unitY;
			pathStr += "L " + cx1 + " " + cy1 + " ";
		}
		return pathStr;
	}
	,__class__: nx3.render.TargetSvg
};
nx3.render.TargetSvgXml = function(svgId,scaling) {
	this.svgId = svgId;
	this.svg = Xml.createElement("svg");
	this.svg.set("id",svgId);
	if(scaling != null) this.scaling = scaling; else this.scaling = nx3.render.scaling.Scaling.NORMAL;
	this.font = nx3.Constants.FONT_TEXT_DEFAULTFORMAT;
};
nx3.render.TargetSvgXml.__name__ = true;
nx3.render.TargetSvgXml.__interfaces__ = [nx3.render.ITarget];
nx3.render.TargetSvgXml.hex = function($int) {
	if($int == 0) return "#000"; else return "#" + StringTools.hex($int);
};
nx3.render.TargetSvgXml.prototype = {
	getXml: function() {
		this.svg.set("width",Std.string(this.totalWidth));
		this.svg.set("height",Std.string(this.totalHeight + nx3.render.TargetSvgXml.SVG_EXTRA_HEIGHT));
		return this.svg;
	}
	,getScaling: function() {
		return this.scaling;
	}
	,testLines: function(x,y,width) {
		var _g = -2;
		while(_g < 3) {
			var i = _g++;
			var cy = y + i * this.scaling.space;
			this.line(x,cy,x + width,cy,this.scaling.linesWidth,0);
		}
	}
	,rect: function(x,y,rect,lineWidth,lineColor) {
	}
	,rectangle: function(x,y,rect,lineWidth,lineColor) {
		if(lineColor == null) lineColor = 0;
		if(lineWidth == null) lineWidth = 1;
		var r = Xml.createElement("rect");
		r.set("x",Std.string(x + rect.x * this.scaling.unitX));
		r.set("y",Std.string(y + rect.y * this.scaling.unitY));
		r.set("width",Std.string(rect.width * this.scaling.unitX));
		r.set("height",Std.string(rect.height * this.scaling.unitY));
		r.set("fill","none");
		r.set("stroke",lineColor == 0?"#000":"#" + StringTools.hex(lineColor));
		r.set("stroke-width",Std.string(lineWidth * this.scaling.linesWidth));
		this.svg.addChild(r);
	}
	,rectangles: function(x,y,rects,lineWidth,lineColor) {
	}
	,filledrectangle: function(x,y,rect,lineWidth,lineColor,fillColor) {
	}
	,filledellipse: function(x,y,rect,lineWidth,lineColor,fillColor) {
		var r = Xml.createElement("ellipse");
		r.set("cx",Std.string(x + (rect.x + rect.width / 2) * this.scaling.unitX));
		r.set("cy",Std.string(y + (rect.y + rect.height / 2) * this.scaling.unitY));
		r.set("rx",Std.string(rect.width / 2 * this.scaling.unitX));
		r.set("ry",Std.string(rect.height / 2 * this.scaling.unitY));
		r.set("fill",fillColor == 0?"#000":"#" + StringTools.hex(fillColor));
		r.set("stroke",lineColor == 0?"#000":"#" + StringTools.hex(lineColor));
		r.set("stroke-width",Std.string(lineWidth * this.scaling.linesWidth));
		r.set("style","fill: " + (fillColor == 0?"#000":"#" + StringTools.hex(fillColor)) + "; stroke: " + (lineColor == 0?"#000":"#" + StringTools.hex(lineColor)) + "; stroke-width: " + lineWidth * this.scaling.linesWidth + "; cursor:pointer;");
		this.svg.addChild(r);
	}
	,line: function(x,y,x2,y2,lineWidth,lineColor) {
		if(lineColor == null) lineColor = 16711680;
		if(lineWidth == null) lineWidth = 1;
		var el = Xml.createElement("line");
		el.set("x1",x == null?"null":"" + x);
		el.set("y1",y == null?"null":"" + y);
		el.set("x2",x2 == null?"null":"" + x2);
		el.set("y2",y2 == null?"null":"" + y2);
		el.set("stroke",lineColor == 0?"#000":"#" + StringTools.hex(lineColor));
		el.set("style","stroke-width:" + lineWidth * this.scaling.linesWidth);
		this.svg.addChild(el);
	}
	,shape: function(x,y,xmlStr,fillColor) {
		if(fillColor == null) fillColor = 0;
		var xml = Xml.parse(xmlStr);
		var elementTag = xml.firstElement().firstChild().firstChild().get_nodeName().toLowerCase();
		var element = Xml.createElement("dummy");
		if(elementTag == "path") {
			element = Xml.createElement("path");
			var pathD = xml.firstElement().firstChild().firstChild().get("d");
			element.set("d",pathD);
			element.set("stroke","none");
			element.set("fill",fillColor == 0?"#000":"#" + StringTools.hex(fillColor));
		} else if(elementTag == "rect") {
			var rectXml = xml.firstElement().firstChild().firstChild();
			element = Xml.createElement("rect");
			element.set("x",rectXml.get("x"));
			element.set("y",rectXml.get("y"));
			element.set("width",rectXml.get("width"));
			element.set("height",rectXml.get("height"));
		} else throw "Shape element " + elementTag + " - UNIMPLEMENTED";
		var sc = this.scaling.svgScale;
		element.set("transform","matrix(" + sc + ",0,0," + sc + ",0,0)");
		var svg = Xml.createElement("svg");
		svg.set("x",Std.string(x + this.scaling.svgX));
		svg.set("y",Std.string(y + this.scaling.svgY));
		svg.addChild(element);
		this.svg.addChild(svg);
	}
	,parallellogram: function(x,y,x2,y2,pheight,lineWidth,lineColor,fillColor) {
		var pathStr = "M " + x + " " + y + " L " + x2 + " " + y2 + "  L " + x2 + " " + (y2 + pheight) + "  L " + x + "  " + (y + pheight) + "  L " + x + " " + y;
		var el = Xml.createElement("path");
		el.set("d",pathStr);
		el.set("fill",fillColor == 0?"#000":"#" + StringTools.hex(fillColor));
		el.set("stroke",lineColor == 0?"#000":"#" + StringTools.hex(lineColor));
		el.set("style","stroke-width:" + lineWidth * this.scaling.linesWidth);
		this.svg.addChild(el);
	}
	,clear: function() {
		this.svg = Xml.createElement("svg");
		this.svg.set("id",this.svgId);
	}
	,polyline: function(x,y,coordinates,lineWidth,lineColor) {
		if(lineColor == null) lineColor = 0;
		if(lineWidth == null) lineWidth = 1;
	}
	,polyfill: function(x,y,coordinates,lineWidth,lineColor,fillColor) {
		if(fillColor == null) fillColor = 255;
		if(lineColor == null) lineColor = 0;
		if(lineWidth == null) lineWidth = 1;
	}
	,sline: function(x,y,start,end,lineWidth,lineColor) {
	}
	,interactiveEllipse: function(x,y,rect,lineWidth,lineColor,fillColor,cb) {
	}
	,scaleRect: function(rect,inflateX,inflateY) {
		if(inflateY == null) inflateY = 0;
		if(inflateX == null) inflateX = 0;
		return null;
	}
	,tooltipShow: function(rect,text) {
	}
	,tooltipHide: function() {
	}
	,setFont: function(font) {
		this.font = font;
	}
	,text: function(x,y,text) {
		var fontsize = this.font.size * this.scaling.fontScaling;
		x = x + -2.2 * this.scaling.fontScaling;
		y = y + (-13 + this.font.size) * this.scaling.fontScaling;
		var txt = Xml.createElement("text");
		txt.set("x",x == null?"null":"" + x);
		txt.set("y",y == null?"null":"" + y);
		txt.set("font-size",Std.string(this.font.size * this.scaling.fontScaling));
		txt.set("font-family",Std.string(this.font.name));
		var str = Xml.createPCData(text);
		txt.addChild(str);
		this.svg.addChild(txt);
	}
	,textwidth: function(text) {
		if(this.context == null) {
			var canvas = window.document.getElementById("CanvasTextMeasurement");
			if(canvas == null) {
				console.log("creating a canvas for text measurement");
				var _this = window.document;
				canvas = _this.createElement("canvas");
				canvas.id = "CanvasTextMeasurement";
			}
			this.context = canvas.getContext("2d");
		}
		var fontsize = this.font.size * this.scaling.fontScaling;
		var fontstr = "" + fontsize + "px " + this.font.name;
		this.context.font = fontstr;
		var measure = this.context.measureText(text);
		return measure.width / this.scaling.unitX;
	}
	,textheight: function(text) {
		return this.font.size / 3.8;
	}
	,addToDomElement: function(elementId) {
		window.document.getElementById(elementId).innerHTML = this.getXml().toString();
	}
	,__class__: nx3.render.TargetSvgXml
};
nx3.render.scaling = {};
nx3.render.scaling.Scaling = function() { };
nx3.render.scaling.Scaling.__name__ = true;
nx3.render.scaling.Scaling.scaleRect = function(scaling,rect) {
	return new nx3.geom.Rectangle(rect.x * scaling.unitX,rect.y * scaling.unitY,rect.width * scaling.unitX,rect.height * scaling.unitY);
};
nx3.render.scaling.ScalingTools = function() { };
nx3.render.scaling.ScalingTools.__name__ = true;
nx3.render.scaling.ScalingTools.scaleRect = function(scaling,rect) {
	return new nx3.geom.Rectangle(rect.x * scaling.unitX,rect.y * scaling.unitY,rect.width * scaling.unitX,rect.height * scaling.unitY);
};
nx3.render.scaling.ScalingTools.targetRect = function(scaling,rect) {
	return new nx3.geom.Rectangle(rect.x / scaling.unitX,rect.y / scaling.unitY,rect.width / scaling.unitX,rect.height / scaling.unitY);
};
nx3.render.scaling.ScalingTools.scalePoint = function(scaling,x,y) {
	return { x : x * scaling.unitX, y : y * scaling.unitY};
};
nx3.render.scaling.ScalingTools.targetPoint = function(scaling,x,y) {
	return { x : x / scaling.unitX, y : y / scaling.unitY};
};
nx3.render.scaling.ScalingTools.scaleX = function(scaling,x) {
	return x * scaling.unitX;
};
nx3.render.scaling.ScalingTools.scaleY = function(scaling,y) {
	return y * scaling.unitY;
};
nx3.render.scaling.ScalingTools.targetX = function(scaling,x) {
	return x / scaling.unitX;
};
nx3.render.scaling.ScalingTools.targetY = function(scaling,y) {
	return y / scaling.unitY;
};
nx3.render.scaling.ScalingTools.fromString = function(scl) {
	if(scl == null) return nx3.render.scaling.Scaling.NORMAL;
	if(scl == "") return nx3.render.scaling.Scaling.NORMAL;
	scl = scl.toLowerCase();
	switch(scl) {
	case "mini":case "1":
		return nx3.render.scaling.Scaling.MINI;
	case "small":case "2":
		return nx3.render.scaling.Scaling.SMALL;
	case "normal":case "3":
		return nx3.render.scaling.Scaling.NORMAL;
	case "mid":case "4":
		return nx3.render.scaling.Scaling.MID;
	case "big":case "5":
		return nx3.render.scaling.Scaling.BIG;
	case "print1":case "6":
		return nx3.render.scaling.Scaling.PRINT1;
	default:
		return nx3.render.scaling.Scaling.NORMAL;
	}
};
nx3.render.svg = {};
nx3.render.svg.SvgElements = function() { };
nx3.render.svg.SvgElements.__name__ = true;
nx3.utils = {};
nx3.utils.DrawTools = function() { };
nx3.utils.DrawTools.__name__ = true;
nx3.utils.DrawTools.draw = function(ctx,rect,enlarge) {
	if(enlarge == null) enlarge = 0;
	ctx.strokeRect(rect.x - enlarge,rect.y - enlarge,rect.width + enlarge * 2,rect.height + enlarge * 2);
};
nx3.utils.DrawTools.setLineStyle = function(ctx,color,width) {
	if(width == null) width = 1;
	var strokestyle = "#" + StringTools.hex(color,6);
	ctx.lineWidth = width;
	ctx.strokeStyle = strokestyle;
};
nx3.utils.DrawTools.drawLine = function(ctx,x,y,x2,y2) {
	ctx.beginPath();
	ctx.moveTo(x,y);
	ctx.lineTo(x2,y2);
	ctx.stroke();
};
nx3.utils.DrawTools.clean = function(ctx,width,height) {
	ctx.clearRect(0,0,width,height);
};
nx3.utils.ScoreDrawingTools = function(score,width,scaling,tempo,context) {
	if(tempo == null) tempo = 60;
	this.lastTimeIdx = 0;
	this.lastTime = -1;
	this.context = context;
	this.score = score;
	this.scaling = scaling;
	this.width = width;
	this.tempo = tempo;
	this.systools = new nx3.PSystemsTools(this.score.getSystems(this.width));
	this.scoreWidth = this.score.getWidth() * this.scaling.unitX;
	this.scoreHeight = this.score.getHeight() * this.scaling.unitY;
	this.columnsPos = this.systools.getColumnsPointH();
	this.columns = this.systools.getColumns();
	this.columnsPositions = this.systools.getColumnsPositions();
	this.columnsTime = this.systools.getColumnsTimeFixed(this.tempo,1);
	var _this = this.systools.getTimesColumns(this.tempo);
	this.timesColumns = _this.slice();
};
nx3.utils.ScoreDrawingTools.__name__ = true;
nx3.utils.ScoreDrawingTools.prototype = {
	clean: function() {
		nx3.utils.DrawTools.clean(this.context,this.scoreWidth,this.scoreHeight);
	}
	,drawNotesRects: function(color) {
		if(color == null) color = 255;
		var notes = this.systools.getNotes();
		var notesRects = this.systools.getNotesRects();
		nx3.utils.DrawTools.setLineStyle(this.context,color);
		var _g = 0;
		while(_g < notes.length) {
			var note = notes[_g];
			++_g;
			var noteRect = notesRects.h[note.__id__];
			var scaledRect = nx3.render.scaling.ScalingTools.scaleRect(this.scaling,noteRect);
			nx3.utils.DrawTools.draw(this.context,scaledRect);
		}
	}
	,getNotesRects: function() {
		return this.systools.getNotesRects();
	}
	,getNotesNotenritems: function() {
		return this.systools.getNotesNotenritems();
	}
	,drawColumns: function(color) {
		if(color == null) color = 16711680;
		var columnsPos = this.systools.getColumnsPointH();
		nx3.utils.DrawTools.setLineStyle(this.context,color);
		var _g = 0;
		var _g1 = this.columns;
		while(_g < _g1.length) {
			var column = _g1[_g];
			++_g;
			var columnPosH = columnsPos.h[column.__id__];
			var x = columnPosH.x * this.scaling.unitX;
			var y = columnPosH.y * this.scaling.unitY;
			var h = columnPosH.height * this.scaling.unitY;
			nx3.utils.DrawTools.drawLine(this.context,x,y,x,y + h);
		}
	}
	,drawColumnFromTime: function(time,color,width) {
		if(width == null) width = 3;
		if(color == null) color = 16744960;
		if(this.lastTime == time) return;
		var column = null;
		var timeIdx = 0;
		var startIdx;
		if(time > this.lastTime) startIdx = this.lastTimeIdx; else startIdx = 0;
		var _g1 = startIdx;
		var _g = this.timesColumns.length;
		while(_g1 < _g) {
			var i = _g1++;
			var timeColumn = this.timesColumns[i];
			if(timeColumn.time >= time) {
				var idx = Std["int"](Math.max(0,i - 1));
				column = this.timesColumns[idx].column;
				timeIdx = idx;
				break;
			}
		}
		if(column == null) return;
		var pos = this.columnsPos.h[column.__id__];
		this.clean();
		nx3.utils.DrawTools.setLineStyle(this.context,color,width);
		nx3.utils.DrawTools.drawLine(this.context,pos.x * this.scaling.unitX,pos.y * this.scaling.unitY,pos.x * this.scaling.unitX,(pos.y + pos.height) * this.scaling.unitY);
		this.lastTime = time;
		this.lastTimeIdx = timeIdx;
	}
	,setLineStyle: function(color,width) {
		if(width == null) width = 1;
		nx3.utils.DrawTools.setLineStyle(this.context,width | 0,color);
	}
	,__class__: nx3.utils.ScoreDrawingTools
};
nx3.utils.ScriptScoreX = function(scriptElement) {
	this.id = dtx.single.ElementManipulation.attr(scriptElement,"id");
	this.parent = scriptElement.parentNode;
	this.parentWrapper = dtx.single.Traversing.parent(this.parent);
	dtx.single.ElementManipulation.setAttr(this.parent,"id",this.id + "-parent");
	dtx.single.ElementManipulation.addClass(this.parent,"nx-parent");
	this.script = StringTools.htmlUnescape(dtx.single.ElementManipulation.innerHTML(scriptElement));
	this.nscore = nx3.xml.ScoreXML.fromXmlStr(this.script);
	console.log(nx3.xml.ScoreXML.toXml(this.nscore).toString());
	var tmpo = Std.parseInt(dtx.single.ElementManipulation.attr(scriptElement,"data-tempo"));
	if(tmpo == null) this.tempo = 60; else this.tempo = tmpo;
	var snds = dtx.single.ElementManipulation.attr(scriptElement,"data-sounds");
	if(snds != null) this.sounds = snds.split(",").map(function(s) {
		return StringTools.trim(s);
	}); else this.sounds = [];
	console.log(this.sounds);
	var scl = dtx.single.ElementManipulation.attr(scriptElement,"data-scaling");
	this.scaling = nx3.render.scaling.ScalingTools.fromString(scl);
	var fxw = dtx.single.ElementManipulation.attr(scriptElement,"data-width");
	if(fxw != null) {
		if(fxw.toLowerCase() == "auto") {
			this.autoWidth = true;
			this.fixedWidth = 780;
		} else {
			var w = Std.parseInt(fxw);
			if(w != null) w = Std["int"](Math.max(400,w)); else w = 780;
			this.fixedWidth = w;
			this.autoWidth = false;
		}
	} else {
		this.fixedWidth = 780;
		this.autoWidth = false;
	}
	this.render();
	this.addHandlers();
};
nx3.utils.ScriptScoreX.__name__ = true;
nx3.utils.ScriptScoreX.prototype = {
	getHtml: function() {
		return Std.string(this.parent);
	}
	,render: function() {
		if(this.autoWidth) this._autorender(); else this._render(this.fixedWidth);
	}
	,clear: function(clearHeight) {
		if(clearHeight == null) clearHeight = true;
		var parent = window.document.getElementById(this.id + "-parent");
		var svg = window.document.getElementById(this.id + "-svg");
		var canvas = window.document.getElementById(this.id + "-canvas");
		if(svg != null) {
			parent.removeChild(svg);
			svg = null;
			this.svgElement = null;
		}
		if(canvas != null) {
			parent.removeChild(canvas);
			canvas = null;
			this.canvasElement = null;
		}
		if(clearHeight) dtx.single.ElementManipulation.setAttr(parent,"style","" + 30 + "px");
	}
	,_autorender: function() {
		var _g = this;
		var whenUserIdle = function() {
			var par = window.document.getElementById(_g.id + "-parent");
			var parentWrapper = par.parentElement;
			var parentwrapperWidth = parentWrapper.clientWidth - 40;
			var width = Std["int"](Math.max(400,parentwrapperWidth));
			_g.clear(false);
			_g._render(width);
			_g.addHandlers();
		};
		var idleTimer = null;
		var resetTimer = function() {
			window.clearTimeout(idleTimer);
			idleTimer = window.setTimeout(whenUserIdle,500);
		};
		window.addEventListener("resize",function(e) {
			resetTimer();
		});
		whenUserIdle();
	}
	,_render: function(width) {
		width = Math.max(width,400);
		var toolbarId = this.id + "-toolbar";
		var existingToolbar = dtx.single.Traversing.find(this.parent,"#" + toolbarId).first();
		if(existingToolbar != null) this.labelTime = dtx.Tools.find("#" + toolbarId + "-label").first(); else {
			this.toolbar = dtx.Tools.create("div");
			dtx.single.ElementManipulation.setAttr(this.toolbar,"id",toolbarId);
			dtx.single.ElementManipulation.addClass(this.toolbar,"nx-control toolbar");
			dtx.single.ElementManipulation.setAttr(this.toolbar,"style","height:" + 30 + ";");
			this.btnPlay = dtx.Tools.create("button");
			dtx.single.ElementManipulation.setAttr(this.btnPlay,"id",toolbarId + "-play");
			dtx.single.ElementManipulation.addClass(this.btnPlay,"nx-button nx-green");
			this.btnPlay.textContent = "Play";
			this.btnStop = dtx.Tools.create("button");
			dtx.single.ElementManipulation.setAttr(this.btnStop,"id",toolbarId + "-stop");
			dtx.single.ElementManipulation.addClass(this.btnStop,"nx-button nx-red");
			this.btnStop.textContent = "Stop";
			this.labelTime = dtx.Tools.create("span");
			dtx.single.ElementManipulation.setAttr(this.labelTime,"id",toolbarId + "-label");
			this.labelTime.textContent = "0";
			dtx.single.ElementManipulation.setAttr(this.labelTime,"style","maxWidth:40px;");
			this.toolbar.appendChild(this.btnPlay);
			this.toolbar.appendChild(this.btnStop);
			this.toolbar.appendChild(this.labelTime);
			this.parent.appendChild(this.toolbar);
		}
		var svgId = this.id + "-svg";
		var existingSvg = dtx.single.Traversing.find(this.parent,"#" + svgId).first();
		var pscore = null;
		if(existingSvg != null) {
			var existingWidth = dtx.single.ElementManipulation.attr(existingSvg,"width");
			var existingHeight = dtx.single.ElementManipulation.attr(existingSvg,"height");
			this.svgSize = { width : Std.parseFloat(existingWidth), height : Std.parseFloat(existingHeight)};
		} else {
			var target = new nx3.render.TargetSvgXml(svgId,this.scaling);
			var render = new nx3.render.Renderer(target);
			var scaledWidth = width / this.scaling.unitX;
			pscore = new nx3.PScore(this.nscore);
			this.svgSize = render.renderScore(pscore,0,0,scaledWidth);
			var svgXml = target.getXml().toString();
			this.svgElement = dtx.Tools.parse(svgXml).first();
			var style = "position:absolute";
			dtx.single.ElementManipulation.setAttr(this.svgElement,"style",style);
			dtx.single.DOMManipulation.append(this.parent,this.svgElement);
		}
		var canvasId = this.id + "-canvas";
		var existingCanvas = dtx.single.Traversing.find(this.parent,"#" + canvasId).first();
		if(existingCanvas != null) {
		} else {
			this.canvasElement = dtx.Tools.create("canvas");
			dtx.single.ElementManipulation.setAttr(this.canvasElement,"id",canvasId);
			dtx.single.ElementManipulation.setAttr(this.canvasElement,"width",Std.string(this.svgSize.width));
			dtx.single.ElementManipulation.setAttr(this.canvasElement,"height",Std.string(this.svgSize.height));
			dtx.single.ElementManipulation.setAttr(this.canvasElement,"width",this.svgSize.width + "px");
			var style1 = "zindex:8; position:absolute;";
			dtx.single.ElementManipulation.setAttr(this.canvasElement,"style",style1);
			this.parent.appendChild(this.canvasElement);
		}
		dtx.single.ElementManipulation.setAttr(this.parent,"style","width: " + this.svgSize.width + "px; height: " + (this.svgSize.height + 30) + "px");
		var canvas = window.document.getElementById(this.id + "-canvas");
		this.context = canvas.getContext("2d");
		if(pscore == null) pscore = new nx3.PScore(this.nscore);
		this.drawingtools = new nx3.utils.ScoreDrawingTools(pscore,width / this.scaling.unitX,this.scaling,this.tempo,this.context);
	}
	,addHandlers: function() {
		var _g = this;
		var notesrects = this.drawingtools.getNotesRects();
		window.document.getElementById(this.id + "-toolbar").onmousedown = function(e) {
			(nx3.utils.ScriptScoresXInteraction.instance == null?nx3.utils.ScriptScoresXInteraction.instance = new nx3.utils.ScriptScoresXInteraction():nx3.utils.ScriptScoresXInteraction.instance).onActivate(_g);
			e.stopPropagation();
		};
		window.document.getElementById(this.id + "-toolbar" + "-play").onmousedown = function(e1) {
			(nx3.utils.ScriptScoresXInteraction.instance == null?nx3.utils.ScriptScoresXInteraction.instance = new nx3.utils.ScriptScoresXInteraction():nx3.utils.ScriptScoresXInteraction.instance).onActivate(_g);
			(nx3.utils.ScriptScoresXInteraction.instance == null?nx3.utils.ScriptScoresXInteraction.instance = new nx3.utils.ScriptScoresXInteraction():nx3.utils.ScriptScoresXInteraction.instance).onPlay(_g);
			e1.stopPropagation();
		};
		window.document.getElementById(this.id + "-toolbar" + "-stop").onmousedown = function(e2) {
			(nx3.utils.ScriptScoresXInteraction.instance == null?nx3.utils.ScriptScoresXInteraction.instance = new nx3.utils.ScriptScoresXInteraction():nx3.utils.ScriptScoresXInteraction.instance).onActivate(_g);
			(nx3.utils.ScriptScoresXInteraction.instance == null?nx3.utils.ScriptScoresXInteraction.instance = new nx3.utils.ScriptScoresXInteraction():nx3.utils.ScriptScoresXInteraction.instance).onStop();
			e2.stopPropagation();
		};
		var canvas = window.document.getElementById(this.id + "-canvas");
		var canvasClientX = 0;
		var canvasClientY = 0;
		var canvasTimer = null;
		var findNote = function() {
			var rect = canvas.getBoundingClientRect();
			var x = canvasClientX - rect.left;
			var y = canvasClientY - rect.top;
			var point = new nx3.geom.Point(x / _g.scaling.unitX,y / _g.scaling.unitY);
			var $it0 = notesrects.keys();
			while( $it0.hasNext() ) {
				var note = $it0.next();
				var rect1 = notesrects.h[note.__id__].clone();
				{
					var _g1 = note.nnote.type;
					switch(_g1[1]) {
					case 3:
						var p = _g1[4];
						var s = _g1[3];
						var l = _g1[2];
						break;
					case 0:
						var at = _g1[5];
						var a = _g1[4];
						var v = _g1[3];
						var h = _g1[2];
						rect1.inflate(2,1);
						break;
					default:
					}
				}
				if(rect1.containsPoint(point)) {
					var noteinfo;
					var this1 = _g.drawingtools.getNotesNotenritems();
					noteinfo = this1.get(note.nnote);
					return { note : note, noteinfo : noteinfo};
					break;
				}
			}
			return null;
		};
		var resetCanvasTimer = function() {
			window.clearTimeout(canvasTimer);
			canvasTimer = window.setTimeout(function() {
				var foundnote = findNote();
				if(foundnote == null) (nx3.utils.ScriptScoresXInteraction.instance == null?nx3.utils.ScriptScoresXInteraction.instance = new nx3.utils.ScriptScoresXInteraction():nx3.utils.ScriptScoresXInteraction.instance).onInteract(_g,nx3.js.MouseInteraction.HideTooltip(_g.id)); else (nx3.utils.ScriptScoresXInteraction.instance == null?nx3.utils.ScriptScoresXInteraction.instance = new nx3.utils.ScriptScoresXInteraction():nx3.utils.ScriptScoresXInteraction.instance).onInteract(_g,nx3.js.MouseInteraction.ShowTooltip(_g.id,foundnote.note,foundnote.noteinfo,"TESSSSST"));
			},500);
		};
		canvas.onmousemove = function(e3) {
			canvasClientX = e3.clientX;
			canvasClientY = e3.clientY;
			resetCanvasTimer();
		};
		canvas.onmousedown = function(e4) {
			(nx3.utils.ScriptScoresXInteraction.instance == null?nx3.utils.ScriptScoresXInteraction.instance = new nx3.utils.ScriptScoresXInteraction():nx3.utils.ScriptScoresXInteraction.instance).onActivate(_g);
			canvasClientX = e4.clientX;
			canvasClientY = e4.clientY;
			var foundnote1 = findNote();
			if(foundnote1 == null) return;
			var noteinfo1 = foundnote1.noteinfo;
			var sound = cx.ArrayTools.indexOrValue(_g.sounds,noteinfo1.partnr,"silent");
			console.log(sound);
			(nx3.utils.ScriptScoresXInteraction.instance == null?nx3.utils.ScriptScoresXInteraction.instance = new nx3.utils.ScriptScoresXInteraction():nx3.utils.ScriptScoresXInteraction.instance).onInteract(_g,nx3.js.MouseInteraction.PlayNote(_g.id,foundnote1.note,foundnote1.noteinfo,sound));
			e4.stopPropagation();
		};
		canvas.onmouseup = function(e5) {
			(nx3.utils.ScriptScoresXInteraction.instance == null?nx3.utils.ScriptScoresXInteraction.instance = new nx3.utils.ScriptScoresXInteraction():nx3.utils.ScriptScoresXInteraction.instance).onInteract(_g,nx3.js.MouseInteraction.StopNote(_g.id));
		};
	}
	,__class__: nx3.utils.ScriptScoreX
};
nx3.utils.ScriptScoresX = function() {
};
nx3.utils.ScriptScoresX.__name__ = true;
nx3.utils.ScriptScoresX.getInstance = function() {
	if(nx3.utils.ScriptScoresX.instance == null) return nx3.utils.ScriptScoresX.instance = new nx3.utils.ScriptScoresX(); else return nx3.utils.ScriptScoresX.instance;
};
nx3.utils.ScriptScoresX.prototype = {
	resolveScriptScores: function(xmlString) {
		var parsed = dtx.Tools.parse(StringTools.trim(xmlString));
		var html = "";
		var _g = 0;
		var _g1 = parsed.collection;
		while(_g < _g1.length) {
			var node = _g1[_g];
			++_g;
			var _g2;
			if(node.nodeType == null) _g2 = "null"; else _g2 = "" + node.nodeType;
			switch(_g2) {
			case "element":
				dtx.Tools.setDocument(node);
				this.invokeScriptScores(node);
				html += Std.string(dtx.Tools.get_document());
				break;
			default:
				html += Std.string(node);
			}
		}
		return html;
	}
	,invokeScriptScores: function(node) {
		var scripts = dtx.single.Traversing.find(node,".nx-score");
		var $it0 = HxOverrides.iter(scripts.collection);
		while( $it0.hasNext() ) {
			var script = $it0.next();
			if(dtx.single.ElementManipulation.attr(script,"data-invoke") == "false") continue;
			var scriptScore = new nx3.utils.ScriptScoreX(script);
		}
	}
	,invokeBodyScores: function() {
		this.invokeScriptScores(dtx.Tools.find("body").first());
	}
	,__class__: nx3.utils.ScriptScoresX
};
nx3.utils.ScriptScoresXInteraction = function() {
	this.currentActive = null;
	this.MINIMUM_MOUSEDOWN_PLAY_TIME = 700;
	this.started = false;
	this.startPlayAt = 0;
};
nx3.utils.ScriptScoresXInteraction.__name__ = true;
nx3.utils.ScriptScoresXInteraction.getInstance = function() {
	if(nx3.utils.ScriptScoresXInteraction.instance == null) return nx3.utils.ScriptScoresXInteraction.instance = new nx3.utils.ScriptScoresXInteraction(); else return nx3.utils.ScriptScoresXInteraction.instance;
};
nx3.utils.ScriptScoresXInteraction.prototype = {
	onActivate: function(scriptScore) {
		this.activateScore(scriptScore);
	}
	,onPlay: function(scriptScore) {
		console.log("play " + scriptScore.id);
		this.play(scriptScore);
	}
	,onStop: function() {
		this.stop();
	}
	,onInteract: function(scriptScore,interaction) {
		var _g = this;
		if(this.onInteractExternal != null) {
			this.onInteractExternal(scriptScore,interaction);
			return;
		}
		switch(interaction[1]) {
		case 0:
			var sound = interaction[5];
			var noteinfo = interaction[4];
			var note = interaction[3];
			var scoreId = interaction[2];
			var midinr = noteinfo.midinr;
			var filename = "/sounds/" + sound + "/" + midinr + ".mp3";
			this.startPlayAt = new Date().getTime();
			this.started = true;
			var this1 = (audiotools.sound.Wav16SoundLoader.instance == null?audiotools.sound.Wav16SoundLoader.instance = new audiotools.sound.Wav16SoundLoader():audiotools.sound.Wav16SoundLoader.instance).getWav16s([filename],function(val) {
			});
			this1(function(map) {
				var wav16 = map.get(filename);
				(audiotools.sound.Wav16SoundManager.instance == null?audiotools.sound.Wav16SoundManager.instance = new audiotools.sound.Wav16SoundManager():audiotools.sound.Wav16SoundManager.instance).initSound(wav16,function(key,pos) {
				},scoreId + "PLAY");
				(audiotools.sound.Wav16SoundManager.instance == null?audiotools.sound.Wav16SoundManager.instance = new audiotools.sound.Wav16SoundManager():audiotools.sound.Wav16SoundManager.instance).start(0);
			});
			break;
		case 1:
			var scoreId1 = interaction[2];
			var playtime = Std["int"](new Date().getTime() - this.startPlayAt);
			var stoptime = Std["int"](Math.max(this.MINIMUM_MOUSEDOWN_PLAY_TIME - playtime,0));
			window.setTimeout(function() {
				if(_g.started) return;
				(audiotools.sound.Wav16SoundManager.instance == null?audiotools.sound.Wav16SoundManager.instance = new audiotools.sound.Wav16SoundManager():audiotools.sound.Wav16SoundManager.instance).stop();
				_g.started = false;
			},stoptime);
			break;
		default:
		}
	}
	,activateScore: function(scriptScore) {
		if(this.currentActive == scriptScore) return;
		(audiotools.sound.Wav16SoundManager.instance == null?audiotools.sound.Wav16SoundManager.instance = new audiotools.sound.Wav16SoundManager():audiotools.sound.Wav16SoundManager.instance).stop();
		console.log("activate");
		var parents = this.findNxParents();
		var $it0 = HxOverrides.iter(parents.collection);
		while( $it0.hasNext() ) {
			var parent = $it0.next();
			dtx.single.ElementManipulation.removeClass(parent,"nx-active");
		}
		dtx.single.ElementManipulation.addClass(scriptScore.parent,"nx-active");
		this.currentActive = scriptScore;
	}
	,findNxParents: function() {
		return dtx.Tools.find(".nx-parent");
	}
	,play: function(scriptScore) {
		var _g = this;
		var startPlayack = function(pos) {
			(audiotools.sound.Wav16SoundManager.instance == null?audiotools.sound.Wav16SoundManager.instance = new audiotools.sound.Wav16SoundManager():audiotools.sound.Wav16SoundManager.instance).start(0);
			dtx.single.ElementManipulation.removeClass(scriptScore.parent,"nx-activating");
			dtx.single.ElementManipulation.addClass(scriptScore.parent,"nx-active");
		};
		scriptScore.labelTime.textContent = "Laddar...";
		dtx.single.ElementManipulation.addClass(scriptScore.parent,"nx-activating");
		var timeStart = new Date().getTime();
		var nscore = scriptScore.nscore;
		var tempo = scriptScore.tempo;
		var sounds = scriptScore.sounds.slice();
		var this1 = (audiotools.utils.Wav16PartsBuilder.instance == null?audiotools.utils.Wav16PartsBuilder.instance = new audiotools.utils.Wav16PartsBuilder():audiotools.utils.Wav16PartsBuilder.instance).getScoreWav16Async(scriptScore.nscore,scriptScore.tempo,sounds);
		this1(function(wav16) {
			(audiotools.sound.Wav16SoundManager.instance == null?audiotools.sound.Wav16SoundManager.instance = new audiotools.sound.Wav16SoundManager():audiotools.sound.Wav16SoundManager.instance).initSound(wav16,$bind(_g,_g.playCallback),scriptScore.id + scriptScore.tempo + Std.string(scriptScore.sounds));
			var timeBuild = new Date().getTime() - timeStart;
			if(timeBuild > 500) window.setTimeout(function() {
				startPlayack(0);
			},1000); else startPlayack(0);
		});
	}
	,stop: function() {
		(audiotools.sound.Wav16SoundManager.instance == null?audiotools.sound.Wav16SoundManager.instance = new audiotools.sound.Wav16SoundManager():audiotools.sound.Wav16SoundManager.instance).stop();
	}
	,playCallback: function(key,pos) {
		if(this.currentActive == null) return;
		this.currentActive.drawingtools.drawColumnFromTime(pos);
		var _this;
		if(pos == null) _this = "null"; else _this = "" + pos;
		this.currentActive.labelTime.textContent = HxOverrides.substr(_this,0,5);
	}
	,__class__: nx3.utils.ScriptScoresXInteraction
};
nx3.utils.VoiceSplitter = function(nbars) {
	this.nbars = nbars;
	if(!nx3.utils.VoiceSplitter.canSplit(this.nbars)) throw "Can't split this nbars - irregular voice pattern";
};
nx3.utils.VoiceSplitter.__name__ = true;
nx3.utils.VoiceSplitter.canSplit = function(nbars) {
	var firstpattern = nx3.utils.VoiceSplitter.getPartPattern(nbars[0]);
	var _g = 0;
	while(_g < nbars.length) {
		var bar = nbars[_g];
		++_g;
		var barpattern = nx3.utils.VoiceSplitter.getPartPattern(bar);
		if(Std.string(barpattern) != Std.string(firstpattern)) return false;
	}
	return true;
};
nx3.utils.VoiceSplitter.getPartPattern = function(bar) {
	var pattern = [];
	var $it0 = bar.iterator();
	while( $it0.hasNext() ) {
		var part = $it0.next();
		pattern.push(part.get_length());
	}
	return pattern;
};
nx3.utils.VoiceSplitter.prototype = {
	getVoicesplittedNBars: function() {
		var newbars = new Array();
		var _g = 0;
		var _g1 = this.nbars;
		while(_g < _g1.length) {
			var bar = _g1[_g];
			++_g;
			var newparts = new Array();
			var $it0 = bar.iterator();
			while( $it0.hasNext() ) {
				var part = $it0.next();
				var $it1 = part.iterator();
				while( $it1.hasNext() ) {
					var voice = $it1.next();
					var newvoice = new nx3.NVoice(voice.nnotes,voice.type,voice.direction);
					var newpart = new nx3.NPart([newvoice],part.type,part.clef,part.clefDisplay,part.key,part.keyDisplay);
					newparts.push(newpart);
				}
			}
			var newbar = new nx3.NBar(newparts,bar.type,bar.time,bar.timeDisplay,bar.allotment,bar.spacing);
			newbars.push(newbar);
		}
		return newbars;
	}
	,__class__: nx3.utils.VoiceSplitter
};
nx3.xml = {};
nx3.xml.BarXML = function() { };
nx3.xml.BarXML.__name__ = true;
nx3.xml.BarXML.toXml = function(bar) {
	var xml = Xml.createElement("bar");
	var _g = 0;
	var _g1 = bar.nparts;
	while(_g < _g1.length) {
		var part = _g1[_g];
		++_g;
		var partXml = nx3.xml.PartXML.toXml(part);
		xml.addChild(partXml);
	}
	var _g2 = bar.type;
	switch(_g2[1]) {
	case 0:
		break;
	default:
		xml.set("type",Std.string(bar.type));
	}
	if(bar.time != null) {
		var _g3 = bar.time;
		switch(_g3[1]) {
		case 5:
			break;
		default:
			xml.set("time",Std.string(nx3.ETimeUtils.toString(bar.time)));
		}
	}
	var _g4 = bar.timeDisplay;
	switch(_g4[1]) {
	case 1:
		break;
	default:
		xml.set("timedisplay",Std.string(bar.timeDisplay));
	}
	return xml;
};
nx3.xml.BarXML.fromXmlStr = function(xmlStr) {
	var xml = Xml.parse(xmlStr).firstElement();
	var parts = [];
	var $it0 = xml.elements();
	while( $it0.hasNext() ) {
		var p = $it0.next();
		var part = nx3.xml.PartXML.fromXmlStr(p.toString());
		parts.push(part);
	}
	var typeStr = xml.get("type");
	var type;
	if(typeStr == null) type = nx3.EBarType.Normal; else type = cx.EnumTools.createFromString(nx3.EBarType,typeStr);
	var time = null;
	var timeStr = xml.get("time");
	if(timeStr != null) time = nx3.ETimeUtils.fromString(timeStr);
	var timeDisplayStr = xml.get("timedisplay");
	var timeDisplay;
	if(timeDisplayStr == null) timeDisplay = nx3.EDisplayALN.Layout; else timeDisplay = cx.EnumTools.createFromString(nx3.EDisplayALN,timeDisplayStr);
	return new nx3.NBar(parts,type,time,timeDisplay);
};
nx3.xml.BarXML.test = function(item) {
	var str = nx3.xml.BarXML.toXml(item).toString();
	var item2 = nx3.xml.BarXML.fromXmlStr(str);
	var str2 = nx3.xml.BarXML.toXml(item2).toString();
	console.log(str);
	console.log(str2);
	return str == str2;
	return false;
};
nx3.xml.HeadXML = function() { };
nx3.xml.HeadXML.__name__ = true;
nx3.xml.HeadXML.toXml = function(head) {
	var xml = Xml.createElement(nx3.xml.HeadXML.XHEAD);
	var _g = head.type;
	switch(_g[1]) {
	case 2:case 1:
		xml.set(nx3.xml.HeadXML.XHEAD_TYPE,Std.string(head.type));
		break;
	default:
	}
	xml.set(nx3.xml.HeadXML.XHEAD_LEVEL,head.level == null?"null":"" + head.level);
	if(head.sign != nx3.ESign.None) xml.set(nx3.xml.HeadXML.XHEAD_SIGN,Std.string(head.sign));
	if(head.tie != null) {
		var _g1 = head.tie;
		switch(_g1[1]) {
		case 0:
			var level = _g1[3];
			var direction = _g1[2];
			xml.set(nx3.xml.HeadXML.XHEAD_TIE,"true");
			if(level != 0) xml.set(nx3.xml.HeadXML.XHEAD_TIE_LEVEL,level == null?"null":"" + level);
			if(direction != nx3.EDirectionUAD.Auto) xml.set(nx3.xml.HeadXML.XHEAD_TIE_DIRECTION,Std.string(direction[0]));
			break;
		case 1:
			var levelRight = _g1[4];
			var levelLeft = _g1[3];
			var direction1 = _g1[2];
			xml.set(nx3.xml.HeadXML.XHEAD_TIE,levelLeft == null?"null":"" + levelLeft);
			break;
		}
	}
	if(head.tieTo != null) {
		var _g2 = head.tieTo;
		switch(_g2[1]) {
		case 0:
			var level1 = _g2[3];
			var direction2 = _g2[2];
			xml.set(nx3.xml.HeadXML.XHEAD_TIETO,Std.string(head.tieTo));
			break;
		case 1:
			var levelRight1 = _g2[4];
			var levelLeft1 = _g2[3];
			var direction3 = _g2[2];
			xml.set(nx3.xml.HeadXML.XHEAD_TIETO,Std.string(head.tieTo));
			break;
		}
	}
	return xml;
};
nx3.xml.HeadXML.fromXmlStr = function(xmlStr) {
	var xml = Xml.parse(xmlStr).firstElement();
	var typeStr = xml.get(nx3.xml.HeadXML.XHEAD_TYPE);
	var type = cx.EnumTools.createFromString(nx3.EHeadType,typeStr);
	var level = Std.parseInt(xml.get(nx3.xml.HeadXML.XHEAD_LEVEL));
	var sign = cx.EnumTools.createFromString(nx3.ESign,xml.get(nx3.xml.HeadXML.XHEAD_SIGN));
	var tie = null;
	if(xml.get(nx3.xml.HeadXML.XHEAD_TIE) != null) {
		var tiedirection;
		if(xml.get(nx3.xml.HeadXML.XHEAD_TIE_DIRECTION) == null) tiedirection = nx3.EDirectionUAD.Auto; else tiedirection = nx3.EDirectionUAD.Up;
		var tielevel;
		if(xml.get(nx3.xml.HeadXML.XHEAD_TIE_LEVEL) == null) tielevel = 0; else tielevel = Std.parseInt(xml.get(nx3.xml.HeadXML.XHEAD_TIE_LEVEL));
		tie = nx3.ETie.Tie(tiedirection,tielevel);
	}
	var tieTo = cx.EnumTools.createFromString(nx3.ETie,xml.get(nx3.xml.HeadXML.XHEAD_TIETO));
	return new nx3.NHead(type,level,sign,tie,tieTo);
};
nx3.xml.HeadXML.test = function(item) {
	var str = nx3.xml.HeadXML.toXml(item).toString();
	var item2 = nx3.xml.HeadXML.fromXmlStr(str);
	var str2 = nx3.xml.HeadXML.toXml(item2).toString();
	console.log(str);
	console.log(str2);
	return str == str2;
};
nx3.xml.NoteXML = function() { };
nx3.xml.NoteXML.__name__ = true;
nx3.xml.NoteXML.toXml = function(note) {
	var xml = null;
	{
		var _g = note.type;
		switch(_g[1]) {
		case 0:
			var attributes = _g[5];
			var articulations = _g[4];
			var variant = _g[3];
			var heads = _g[2];
			xml = Xml.createElement("note");
			var _g1 = 0;
			while(_g1 < heads.length) {
				var head = heads[_g1];
				++_g1;
				var headXml = nx3.xml.HeadXML.toXml(head);
				xml.addChild(headXml);
			}
			if(variant != null) xml.set("variant",Std.string(variant));
			if(articulations != null) {
				var articulationStrings = [];
				var _g11 = 0;
				while(_g11 < articulations.length) {
					var articulation = articulations[_g11];
					++_g11;
					articulationStrings.push(Std.string(articulation));
				}
				xml.set("articulations",articulationStrings.join(";"));
			}
			if(attributes != null) {
				var attributesStrings = [];
				var _g12 = 0;
				while(_g12 < attributes.length) {
					var attribute = attributes[_g12];
					++_g12;
					attributesStrings.push(Std.string(attribute));
				}
				xml.set("attributes",attributesStrings.join(";"));
			}
			break;
		case 1:
			var level = _g[2];
			xml = Xml.createElement("pause");
			if(level != 0) xml.set("level",level == null?"null":"" + level);
			break;
		case 4:
			var format = _g[5];
			var continuation = _g[4];
			var offset = _g[3];
			var text = _g[2];
			xml = Xml.createElement("lyric");
			xml.set("text",text);
			if(continuation != null) xml.set("continuation",Std.string(continuation));
			if(offset != null) xml.set("offset",Std.string(offset));
			if(format != null) xml.set("format",Std.string(format));
			break;
		case 7:
			var midinote = _g[3];
			var level1 = _g[2];
			xml = Xml.createElement("pitch");
			if(level1 != 0) xml.set("level",level1 == null?"null":"" + level1);
			if(midinote != 0) xml.set("midinote",midinote == null?"null":"" + midinote);
			break;
		case 3:
			var pause = _g[4];
			var sign = _g[3];
			var level2 = _g[2];
			xml = Xml.createElement("tpl");
			xml.set("level",level2 == null?"null":"" + level2);
			if(sign != nx3.ESign.None) xml.set("sign",Std.string(sign));
			if(pause == true) xml.set("pause","true");
			break;
		default:
			xml = Xml.createElement("undefined");
		}
	}
	if(nx3.ENoteValTools.value(note.value) != nx3.ENoteValTools.value(nx3.ENoteVal.Nv4)) xml.set("val",Std.string(nx3.ENoteValTools.toValString(note.value)));
	if(note.direction != nx3.EDirectionUAD.Auto) xml.set("direction",Std.string(note.direction));
	return xml;
};
nx3.xml.NoteXML.fromXmlStr = function(xmlStr) {
	var xml = Xml.parse(xmlStr).firstElement();
	var xmlType = xml.get_nodeName();
	var type = null;
	switch(xmlType) {
	case "note":
		var heads = [];
		var $it0 = xml.elementsNamed(nx3.xml.HeadXML.XHEAD);
		while( $it0.hasNext() ) {
			var h = $it0.next();
			var head = nx3.xml.HeadXML.fromXmlStr(h.toString());
			heads.push(head);
		}
		var variant = cx.EnumTools.createFromString(nx3.ENotationVariant,xml.get("variant"));
		var articulations = [];
		var articulationsStr = xml.get("articulations");
		if(articulationsStr != null) {
			var articulationStrings = articulationsStr.split(";");
			var _g = 0;
			while(_g < articulationStrings.length) {
				var articulationStr = articulationStrings[_g];
				++_g;
				articulations.push(cx.EnumTools.createFromString(nx3.ENoteArticulation,articulationStr));
			}
		}
		if(articulations.length == 0) articulations = null;
		var attributes = [];
		var attributesStr = xml.get("attributes");
		if(attributesStr != null) {
			var attributesStrings = attributesStr.split(";");
			var _g1 = 0;
			while(_g1 < attributesStrings.length) {
				var attributeStr = attributesStrings[_g1];
				++_g1;
				attributes.push(cx.EnumTools.createFromString(nx3.ENoteAttributes,attributeStr));
			}
		}
		if(attributes.length == 0) attributes = null;
		type = nx3.ENoteType.Note(heads,variant,articulations,attributes);
		break;
	case "pause":
		var pauseLevelStr = xml.get("level");
		var levelInt;
		if(pauseLevelStr == null) levelInt = 0; else levelInt = Std.parseInt(pauseLevelStr);
		type = nx3.ENoteType.Pause(levelInt);
		break;
	case "lyric":
		var text = xml.get("text");
		var offsetStr = xml.get("offset");
		var offset = cx.EnumTools.createFromString(nx3.EPosition,offsetStr);
		var continuationStr = xml.get("continuation");
		var continuation = cx.EnumTools.createFromString(nx3.ELyricContinuation,continuationStr);
		type = nx3.ENoteType.Lyric(text,offset,continuation);
		break;
	case "pitch":
		var levelstr = xml.get("level");
		var level;
		if(levelstr != null) level = Std.parseInt(levelstr); else level = 0;
		var midinotestr = xml.get("midinote");
		var midinote;
		if(midinotestr != null) midinote = Std.parseInt(midinotestr); else midinote = 0;
		type = nx3.ENoteType.Pitch(level,midinote);
		break;
	case "tpl":
		var levelstr1 = xml.get("level");
		var level1;
		if(levelstr1 != null) level1 = Std.parseInt(levelstr1); else level1 = 0;
		var sign = cx.EnumTools.createFromString(nx3.ESign,xml.get("sign"));
		var pausestr = xml.get("pause");
		var pause = pausestr != null && pausestr.toLowerCase() == "true";
		type = nx3.ENoteType.Tpl(level1,sign,pause);
		break;
	}
	var valStr = xml.get("val");
	var value = nx3.ENoteValTools.fromValString(valStr);
	var direction = cx.EnumTools.createFromString(nx3.EDirectionUAD,xml.get("direction"));
	return new nx3.NNote(type,null,value,direction);
};
nx3.xml.NoteXML.test = function(item) {
	var str = nx3.xml.NoteXML.toXml(item).toString();
	var item2 = nx3.xml.NoteXML.fromXmlStr(str);
	var str2 = nx3.xml.NoteXML.toXml(item2).toString();
	console.log(str);
	console.log(str2);
	return str == str2;
};
nx3.xml.NoteXML.clone = function(nnote) {
	return nx3.xml.NoteXML.fromXmlStr(nx3.xml.NoteXML.toXml(nnote).toString());
};
nx3.xml.PartXML = function() { };
nx3.xml.PartXML.__name__ = true;
nx3.xml.PartXML.toXml = function(part) {
	var xml = Xml.createElement("part");
	var _g = 0;
	var _g1 = part.nvoices;
	while(_g < _g1.length) {
		var voice = _g1[_g];
		++_g;
		var voiceXml = nx3.xml.VoiceXML.toXml(voice);
		xml.addChild(voiceXml);
	}
	{
		var _g2 = part.type;
		switch(_g2[1]) {
		case 0:
			break;
		case 3:
			var octave = _g2[3];
			var modus = _g2[2];
			xml.set("type","tplchain");
			if(modus != null) {
				if(modus != nx3.EModus.Major) xml.set("modus",Std.string(modus));
			}
			if(octave != null) {
				if(octave != nx3.EOctave.Normal || octave != null) xml.set("octave",Std.string(octave));
			}
			break;
		case 2:
			var octave1 = _g2[3];
			var modus1 = _g2[2];
			xml.set("type","tplchain");
			if(modus1 != null) {
				if(modus1 != nx3.EModus.Major) xml.set("modus",Std.string(modus1));
			}
			if(octave1 != null) {
				if(octave1 != nx3.EOctave.Normal || octave1 != null) xml.set("octave",Std.string(octave1));
			}
			break;
		case 9:
			var leveloffset = _g2[2];
			xml.set("type","pitchchain");
			xml.set("leveloffset",leveloffset == null?"null":"" + leveloffset);
			break;
		default:
			xml.set("type",Std.string(part.type));
		}
	}
	if(part.clef != null) {
		var _g3 = part.clef;
		switch(_g3[1]) {
		case 0:
			break;
		default:
			xml.set("clef",Std.string(part.clef));
		}
	}
	if(part.key != null) {
		var _g4 = part.key;
		switch(_g4[1]) {
		case 6:
			break;
		default:
			xml.set("key",Std.string(part.key));
		}
	}
	var _g5 = part.clefDisplay;
	switch(_g5[1]) {
	case 1:
		break;
	default:
		xml.set("clefdisplay",Std.string(part.clefDisplay));
	}
	var _g6 = part.keyDisplay;
	switch(_g6[1]) {
	case 1:
		break;
	default:
		xml.set("keydisplay",Std.string(part.keyDisplay));
	}
	return xml;
};
nx3.xml.PartXML.fromXmlStr = function(xmlStr) {
	var xml = Xml.parse(xmlStr).firstElement();
	var voices = [];
	var $it0 = xml.elements();
	while( $it0.hasNext() ) {
		var v = $it0.next();
		var voice = nx3.xml.VoiceXML.fromXmlStr(v.toString());
		voices.push(voice);
	}
	var type = null;
	var typeStr = xml.get("type");
	if(typeStr == "pitchchain") {
		var leveloffset = Std.parseInt(xml.get("leveloffset"));
		type = nx3.EPartType.PitchChain(leveloffset);
	} else if(typeStr == "tplchain" || typeStr == "tplrow") {
		var oct = xml.get("octave");
		var octave = null;
		if(oct != null) octave = cx.EnumTools.createFromString(nx3.EOctave,oct);
		var mod = xml.get("modus");
		var modus = null;
		if(mod != null) modus = cx.EnumTools.createFromString(nx3.EModus,mod);
		type = nx3.EPartType.Tplchain(modus,octave);
	} else type = cx.EnumTools.createFromString(nx3.EPartType,typeStr);
	var str = xml.get("clef");
	var clef = null;
	if(str != null) clef = cx.EnumTools.createFromString(nx3.EClef,str);
	var clefDisplayStr = xml.get("clefdisplay");
	var clefDisplay;
	if(clefDisplayStr == null) clefDisplay = nx3.EDisplayALN.Layout; else clefDisplay = cx.EnumTools.createFromString(nx3.EDisplayALN,clefDisplayStr);
	var str1 = xml.get("key");
	var key = null;
	if(str1 != null) key = cx.EnumTools.createFromString(nx3.EKey,str1);
	var keyDisplayStr = xml.get("keydisplay");
	var keyDisplay;
	if(keyDisplayStr == null) keyDisplay = nx3.EDisplayALN.Layout; else keyDisplay = cx.EnumTools.createFromString(nx3.EDisplayALN,keyDisplayStr);
	return new nx3.NPart(voices,type,clef,clefDisplay,key,keyDisplay);
};
nx3.xml.ScoreXML = function() { };
nx3.xml.ScoreXML.__name__ = true;
nx3.xml.ScoreXML.toXml = function(score) {
	var xml = Xml.createElement("score");
	var config = Xml.createElement("config");
	config.set("test","12345");
	xml.addChild(config);
	var $it0 = score.iterator();
	while( $it0.hasNext() ) {
		var bar = $it0.next();
		var barXml = nx3.xml.BarXML.toXml(bar);
		xml.addChild(barXml);
	}
	return xml;
};
nx3.xml.ScoreXML.fromXmlStr = function(xmlStr) {
	var xml = Xml.parse(xmlStr).firstElement();
	var bars = [];
	var config = xml.elementsNamed("config").next();
	var configObject = { };
	if(config != null) {
		var $it0 = config.attributes();
		while( $it0.hasNext() ) {
			var attr = $it0.next();
			Reflect.setField(configObject,attr,config.get(attr));
		}
	}
	var $it1 = xml.elementsNamed("bar");
	while( $it1.hasNext() ) {
		var b = $it1.next();
		var bar = nx3.xml.BarXML.fromXmlStr(b.toString());
		bars.push(bar);
	}
	var score = new nx3.NScore(bars);
	score.configuration = configObject;
	return score;
};
nx3.xml.VoiceXML = function() { };
nx3.xml.VoiceXML.__name__ = true;
nx3.xml.VoiceXML.toXml = function(voice) {
	var xml = Xml.createElement("voice");
	var _g = voice.type;
	switch(_g[1]) {
	case 1:
		xml.set("type",Std.string(voice.type));
		break;
	default:
	}
	if(voice.direction != nx3.EDirectionUAD.Auto) xml.set("direction",Std.string(voice.direction));
	if(voice.nnotes != null) {
		var _g1 = 0;
		var _g11 = voice.nnotes;
		while(_g1 < _g11.length) {
			var note = _g11[_g1];
			++_g1;
			var noteXml = nx3.xml.NoteXML.toXml(note);
			xml.addChild(noteXml);
		}
	}
	return xml;
};
nx3.xml.VoiceXML.fromXmlStr = function(xmlStr) {
	var xml = Xml.parse(xmlStr).firstElement();
	var typeStr = xml.get("type");
	var type = cx.EnumTools.createFromString(nx3.EVoiceType,typeStr);
	var directionStr = xml.get("direction");
	var direction = null;
	if(directionStr == null) direction = nx3.EDirectionUAD.Auto; else direction = cx.EnumTools.createFromString(nx3.EDirectionUAD,directionStr);
	var notes = [];
	var $it0 = xml.elements();
	while( $it0.hasNext() ) {
		var n = $it0.next();
		var note = nx3.xml.NoteXML.fromXmlStr(n.toString());
		notes.push(note);
	}
	return new nx3.NVoice(notes,type,direction);
};
nx3.xml.VoiceXML.test = function(item) {
	var str = nx3.xml.VoiceXML.toXml(item).toString();
	var item2 = nx3.xml.VoiceXML.fromXmlStr(str);
	var str2 = nx3.xml.VoiceXML.toXml(item2).toString();
	console.log(str);
	console.log(str2);
	return str == str2;
};
var thx = {};
thx.core = {};
thx.core.UUID = function() { };
thx.core.UUID.__name__ = true;
thx.core.UUID.random = function() {
	return Math.floor(Math.random() * 16);
};
thx.core.UUID.srandom = function() {
	return "" + Math.floor(Math.random() * 16);
};
thx.core.UUID.create = function() {
	var s = [];
	var _g = 0;
	while(_g < 8) {
		var i = _g++;
		s[i] = "" + Math.floor(Math.random() * 16);
	}
	s[8] = "-";
	var _g1 = 9;
	while(_g1 < 13) {
		var i1 = _g1++;
		s[i1] = "" + Math.floor(Math.random() * 16);
	}
	s[13] = "-";
	s[14] = "4";
	var _g2 = 15;
	while(_g2 < 18) {
		var i2 = _g2++;
		s[i2] = "" + Math.floor(Math.random() * 16);
	}
	s[18] = "-";
	s[19] = "" + (Math.floor(Math.random() * 16) & 3 | 8);
	var _g3 = 20;
	while(_g3 < 23) {
		var i3 = _g3++;
		s[i3] = "" + Math.floor(Math.random() * 16);
	}
	s[23] = "-";
	var _g4 = 24;
	while(_g4 < 36) {
		var i4 = _g4++;
		s[i4] = "" + Math.floor(Math.random() * 16);
	}
	return s.join("");
};
var tink = {};
tink.core = {};
tink.core._Callback = {};
tink.core._Callback.Callback_Impl_ = function() { };
tink.core._Callback.Callback_Impl_.__name__ = true;
tink.core._Callback.Callback_Impl_._new = function(f) {
	return f;
};
tink.core._Callback.Callback_Impl_.invoke = function(this1,data) {
	this1(data);
};
tink.core._Callback.Callback_Impl_.fromNiladic = function(f) {
	return function(r) {
		f();
	};
};
tink.core._Callback.Callback_Impl_.fromMany = function(callbacks) {
	return function(v) {
		var _g = 0;
		while(_g < callbacks.length) {
			var callback = callbacks[_g];
			++_g;
			callback(v);
		}
	};
};
tink.core._Callback.CallbackLink_Impl_ = function() { };
tink.core._Callback.CallbackLink_Impl_.__name__ = true;
tink.core._Callback.CallbackLink_Impl_._new = function(link) {
	return link;
};
tink.core._Callback.CallbackLink_Impl_.dissolve = function(this1) {
	if(this1 != null) this1();
};
tink.core._Callback.CallbackLink_Impl_.toCallback = function(this1) {
	var f = this1;
	return function(r) {
		f();
	};
};
tink.core._Callback.CallbackLink_Impl_.fromFunction = function(f) {
	return f;
};
tink.core._Callback.CallbackLink_Impl_.fromMany = function(callbacks) {
	return function() {
		var _g = 0;
		while(_g < callbacks.length) {
			var cb = callbacks[_g];
			++_g;
			if(cb != null) cb();
		}
	};
};
tink.core._Callback.Cell = function() {
};
tink.core._Callback.Cell.__name__ = true;
tink.core._Callback.Cell.get = function() {
	if(tink.core._Callback.Cell.pool.length > 0) return tink.core._Callback.Cell.pool.pop(); else return new tink.core._Callback.Cell();
};
tink.core._Callback.Cell.prototype = {
	free: function() {
		this.cb = null;
		tink.core._Callback.Cell.pool.push(this);
	}
	,__class__: tink.core._Callback.Cell
};
tink.core._Callback.CallbackList_Impl_ = function() { };
tink.core._Callback.CallbackList_Impl_.__name__ = true;
tink.core._Callback.CallbackList_Impl_._new = function() {
	return [];
};
tink.core._Callback.CallbackList_Impl_.get_length = function(this1) {
	return this1.length;
};
tink.core._Callback.CallbackList_Impl_.add = function(this1,cb) {
	var cell;
	if(tink.core._Callback.Cell.pool.length > 0) cell = tink.core._Callback.Cell.pool.pop(); else cell = new tink.core._Callback.Cell();
	cell.cb = cb;
	this1.push(cell);
	return function() {
		if(HxOverrides.remove(this1,cell)) {
			cell.cb = null;
			tink.core._Callback.Cell.pool.push(cell);
		}
		cell = null;
	};
};
tink.core._Callback.CallbackList_Impl_.invoke = function(this1,data) {
	var _g = 0;
	var _g1 = this1.slice();
	while(_g < _g1.length) {
		var cell = _g1[_g];
		++_g;
		if(cell.cb != null) cell.cb(data);
	}
};
tink.core._Callback.CallbackList_Impl_.clear = function(this1) {
	var _g = 0;
	var _g1 = this1.splice(0,this1.length);
	while(_g < _g1.length) {
		var cell = _g1[_g];
		++_g;
		cell.cb = null;
		tink.core._Callback.Cell.pool.push(cell);
	}
};
tink.core.Either = { __ename__ : true, __constructs__ : ["Left","Right"] };
tink.core.Either.Left = function(a) { var $x = ["Left",0,a]; $x.__enum__ = tink.core.Either; $x.toString = $estr; return $x; };
tink.core.Either.Right = function(b) { var $x = ["Right",1,b]; $x.__enum__ = tink.core.Either; $x.toString = $estr; return $x; };
tink.core._Error = {};
tink.core._Error.ErrorCode_Impl_ = function() { };
tink.core._Error.ErrorCode_Impl_.__name__ = true;
tink.core.TypedError = function(code,message,pos) {
	if(code == null) code = 500;
	this.code = code;
	this.message = message;
	this.pos = pos;
};
tink.core.TypedError.__name__ = true;
tink.core.TypedError.withData = function(code,message,data,pos) {
	if(code == null) code = 500;
	var ret = new tink.core.TypedError(code,message,pos);
	ret.data = data;
	return ret;
};
tink.core.TypedError.prototype = {
	printPos: function() {
		return this.pos.className + "." + this.pos.methodName + ":" + this.pos.lineNumber;
	}
	,toString: function() {
		var ret = "Error: " + this.message;
		if(this.pos != null) ret += " " + this.printPos();
		return ret;
	}
	,throwSelf: function() {
		throw this;
	}
	,__class__: tink.core.TypedError
};
tink.core._Future = {};
tink.core._Future.Future_Impl_ = function() { };
tink.core._Future.Future_Impl_.__name__ = true;
tink.core._Future.Future_Impl_._new = function(f) {
	return f;
};
tink.core._Future.Future_Impl_.handle = function(this1,callback) {
	return this1(callback);
};
tink.core._Future.Future_Impl_.gather = function(this1) {
	var op = new tink.core.FutureTrigger();
	var self = this1;
	return tink.core._Future.Future_Impl_._new(function(cb) {
		if(self != null) {
			this1($bind(op,op.trigger));
			self = null;
		}
		return op.future(cb);
	});
};
tink.core._Future.Future_Impl_.first = function(this1,other) {
	return tink.core._Future.Future_Impl_.async(function(cb) {
		this1(cb);
		other(cb);
	});
};
tink.core._Future.Future_Impl_.map = function(this1,f,gather) {
	if(gather == null) gather = true;
	var ret = tink.core._Future.Future_Impl_._new(function(callback) {
		return this1(function(result) {
			var data = f(result);
			callback(data);
		});
	});
	if(gather) return tink.core._Future.Future_Impl_.gather(ret); else return ret;
};
tink.core._Future.Future_Impl_.flatMap = function(this1,next,gather) {
	if(gather == null) gather = true;
	var ret = tink.core._Future.Future_Impl_.flatten(tink.core._Future.Future_Impl_.map(this1,next,gather));
	if(gather) return tink.core._Future.Future_Impl_.gather(ret); else return ret;
};
tink.core._Future.Future_Impl_.merge = function(this1,other,merger,gather) {
	if(gather == null) gather = true;
	return tink.core._Future.Future_Impl_.flatMap(this1,function(t) {
		return tink.core._Future.Future_Impl_.map(other,function(a) {
			return merger(t,a);
		},false);
	},gather);
};
tink.core._Future.Future_Impl_.flatten = function(f) {
	return tink.core._Future.Future_Impl_._new(function(callback) {
		var ret = null;
		ret = f(function(next) {
			ret = next(function(result) {
				callback(result);
			});
		});
		return ret;
	});
};
tink.core._Future.Future_Impl_.fromTrigger = function(trigger) {
	return trigger.future;
};
tink.core._Future.Future_Impl_.ofMany = function(futures,gather) {
	if(gather == null) gather = true;
	var ret = tink.core._Future.Future_Impl_.sync([]);
	var _g = 0;
	while(_g < futures.length) {
		var f = [futures[_g]];
		++_g;
		ret = tink.core._Future.Future_Impl_.flatMap(ret,(function(f) {
			return function(results) {
				return tink.core._Future.Future_Impl_.map(f[0],(function() {
					return function(result) {
						return results.concat([result]);
					};
				})(),false);
			};
		})(f),false);
	}
	if(gather) return tink.core._Future.Future_Impl_.gather(ret); else return ret;
};
tink.core._Future.Future_Impl_.fromMany = function(futures) {
	return tink.core._Future.Future_Impl_.ofMany(futures);
};
tink.core._Future.Future_Impl_.lazy = function(l) {
	return tink.core._Future.Future_Impl_._new(function(cb) {
		var data = l();
		cb(data);
		return null;
	});
};
tink.core._Future.Future_Impl_.sync = function(v) {
	return tink.core._Future.Future_Impl_._new(function(callback) {
		callback(v);
		return null;
	});
};
tink.core._Future.Future_Impl_.async = function(f,lazy) {
	if(lazy == null) lazy = false;
	if(lazy) return tink.core._Future.Future_Impl_.flatten(tink.core._Future.Future_Impl_.lazy(tink.core._Lazy.Lazy_Impl_.ofFunc((function(f1,f2,a1) {
		return function() {
			return f1(f2,a1);
		};
	})(tink.core._Future.Future_Impl_.async,f,false)))); else {
		var op = new tink.core.FutureTrigger();
		f($bind(op,op.trigger));
		return op.future;
	}
};
tink.core._Future.Future_Impl_.or = function(a,b) {
	return tink.core._Future.Future_Impl_.first(a,b);
};
tink.core._Future.Future_Impl_.either = function(a,b) {
	return tink.core._Future.Future_Impl_.first(tink.core._Future.Future_Impl_.map(a,tink.core.Either.Left,false),tink.core._Future.Future_Impl_.map(b,tink.core.Either.Right,false));
};
tink.core._Future.Future_Impl_.and = function(a,b) {
	return tink.core._Future.Future_Impl_.merge(a,b,function(a1,b1) {
		return { a : a1, b : b1};
	});
};
tink.core._Future.Future_Impl_._tryFailingFlatMap = function(f,map) {
	return tink.core._Future.Future_Impl_.flatMap(f,function(o) {
		switch(o[1]) {
		case 0:
			var d = o[2];
			return map(d);
		case 1:
			var f1 = o[2];
			return tink.core._Future.Future_Impl_.sync(tink.core.Outcome.Failure(f1));
		}
	});
};
tink.core._Future.Future_Impl_._tryFlatMap = function(f,map) {
	return tink.core._Future.Future_Impl_.flatMap(f,function(o) {
		switch(o[1]) {
		case 0:
			var d = o[2];
			return tink.core._Future.Future_Impl_.map(map(d),tink.core.Outcome.Success);
		case 1:
			var f1 = o[2];
			return tink.core._Future.Future_Impl_.sync(tink.core.Outcome.Failure(f1));
		}
	});
};
tink.core._Future.Future_Impl_._tryFailingMap = function(f,map) {
	return tink.core._Future.Future_Impl_.map(f,function(o) {
		return tink.core.OutcomeTools.flatMap(o,tink.core._Outcome.OutcomeMapper_Impl_.withSameError(map));
	});
};
tink.core._Future.Future_Impl_._tryMap = function(f,map) {
	return tink.core._Future.Future_Impl_.map(f,function(o) {
		return tink.core.OutcomeTools.map(o,map);
	});
};
tink.core._Future.Future_Impl_._flatMap = function(f,map) {
	return tink.core._Future.Future_Impl_.flatMap(f,map);
};
tink.core._Future.Future_Impl_._map = function(f,map) {
	return tink.core._Future.Future_Impl_.map(f,map);
};
tink.core._Future.Future_Impl_.trigger = function() {
	return new tink.core.FutureTrigger();
};
tink.core.FutureTrigger = function() {
	var _g = this;
	this.list = [];
	this.future = tink.core._Future.Future_Impl_._new(function(callback) {
		if(_g.list == null) {
			callback(_g.result);
			return null;
		} else return tink.core._Callback.CallbackList_Impl_.add(_g.list,callback);
	});
};
tink.core.FutureTrigger.__name__ = true;
tink.core.FutureTrigger.prototype = {
	asFuture: function() {
		return this.future;
	}
	,trigger: function(result) {
		if(this.list == null) return false; else {
			var list = this.list;
			this.list = null;
			this.result = result;
			tink.core._Callback.CallbackList_Impl_.invoke(list,result);
			tink.core._Callback.CallbackList_Impl_.clear(list);
			return true;
		}
	}
	,__class__: tink.core.FutureTrigger
};
tink.core._Lazy = {};
tink.core._Lazy.Lazy_Impl_ = function() { };
tink.core._Lazy.Lazy_Impl_.__name__ = true;
tink.core._Lazy.Lazy_Impl_._new = function(r) {
	return r;
};
tink.core._Lazy.Lazy_Impl_.get = function(this1) {
	return this1();
};
tink.core._Lazy.Lazy_Impl_.ofFunc = function(f) {
	var result = null;
	return function() {
		if(f != null) {
			result = f();
			f = null;
		}
		return result;
	};
};
tink.core._Lazy.Lazy_Impl_.map = function(this1,f) {
	return tink.core._Lazy.Lazy_Impl_.ofFunc(function() {
		return f(this1());
	});
};
tink.core._Lazy.Lazy_Impl_.flatMap = function(this1,f) {
	return tink.core._Lazy.Lazy_Impl_.ofFunc(function() {
		var this2 = f(this1());
		return this2();
	});
};
tink.core._Lazy.Lazy_Impl_.ofConst = function(c) {
	return function() {
		return c;
	};
};
tink.core.Outcome = { __ename__ : true, __constructs__ : ["Success","Failure"] };
tink.core.Outcome.Success = function(data) { var $x = ["Success",0,data]; $x.__enum__ = tink.core.Outcome; $x.toString = $estr; return $x; };
tink.core.Outcome.Failure = function(failure) { var $x = ["Failure",1,failure]; $x.__enum__ = tink.core.Outcome; $x.toString = $estr; return $x; };
tink.core.OutcomeTools = function() { };
tink.core.OutcomeTools.__name__ = true;
tink.core.OutcomeTools.sure = function(outcome) {
	switch(outcome[1]) {
	case 0:
		var data = outcome[2];
		return data;
	case 1:
		var failure = outcome[2];
		if(js.Boot.__instanceof(failure,tink.core.TypedError)) return failure.throwSelf(); else throw failure;
		break;
	}
};
tink.core.OutcomeTools.toOption = function(outcome) {
	switch(outcome[1]) {
	case 0:
		var data = outcome[2];
		return haxe.ds.Option.Some(data);
	case 1:
		return haxe.ds.Option.None;
	}
};
tink.core.OutcomeTools.toOutcome = function(option,pos) {
	switch(option[1]) {
	case 0:
		var value = option[2];
		return tink.core.Outcome.Success(value);
	case 1:
		return tink.core.Outcome.Failure(new tink.core.TypedError(404,"Some value expected but none found in " + pos.fileName + "@line " + pos.lineNumber,{ fileName : "Outcome.hx", lineNumber : 37, className : "tink.core.OutcomeTools", methodName : "toOutcome"}));
	}
};
tink.core.OutcomeTools.orUse = function(outcome,fallback) {
	switch(outcome[1]) {
	case 0:
		var data = outcome[2];
		return data;
	case 1:
		return fallback();
	}
};
tink.core.OutcomeTools.orTry = function(outcome,fallback) {
	switch(outcome[1]) {
	case 0:
		return outcome;
	case 1:
		return fallback();
	}
};
tink.core.OutcomeTools.equals = function(outcome,to) {
	switch(outcome[1]) {
	case 0:
		var data = outcome[2];
		return data == to;
	case 1:
		return false;
	}
};
tink.core.OutcomeTools.map = function(outcome,transform) {
	switch(outcome[1]) {
	case 0:
		var a = outcome[2];
		return tink.core.Outcome.Success(transform(a));
	case 1:
		var f = outcome[2];
		return tink.core.Outcome.Failure(f);
	}
};
tink.core.OutcomeTools.isSuccess = function(outcome) {
	switch(outcome[1]) {
	case 0:
		return true;
	default:
		return false;
	}
};
tink.core.OutcomeTools.flatMap = function(o,mapper) {
	return tink.core._Outcome.OutcomeMapper_Impl_.apply(mapper,o);
};
tink.core._Outcome = {};
tink.core._Outcome.OutcomeMapper_Impl_ = function() { };
tink.core._Outcome.OutcomeMapper_Impl_.__name__ = true;
tink.core._Outcome.OutcomeMapper_Impl_._new = function(f) {
	return { f : f};
};
tink.core._Outcome.OutcomeMapper_Impl_.apply = function(this1,o) {
	return this1.f(o);
};
tink.core._Outcome.OutcomeMapper_Impl_.withSameError = function(f) {
	return tink.core._Outcome.OutcomeMapper_Impl_._new(function(o) {
		switch(o[1]) {
		case 0:
			var d = o[2];
			return f(d);
		case 1:
			var f1 = o[2];
			return tink.core.Outcome.Failure(f1);
		}
	});
};
tink.core._Outcome.OutcomeMapper_Impl_.withEitherError = function(f) {
	return tink.core._Outcome.OutcomeMapper_Impl_._new(function(o) {
		switch(o[1]) {
		case 0:
			var d = o[2];
			{
				var _g = f(d);
				switch(_g[1]) {
				case 0:
					var d1 = _g[2];
					return tink.core.Outcome.Success(d1);
				case 1:
					var f1 = _g[2];
					return tink.core.Outcome.Failure(tink.core.Either.Right(f1));
				}
			}
			break;
		case 1:
			var f2 = o[2];
			return tink.core.Outcome.Failure(tink.core.Either.Left(f2));
		}
	});
};
tink.core._Pair = {};
tink.core._Pair.Pair_Impl_ = function() { };
tink.core._Pair.Pair_Impl_.__name__ = true;
tink.core._Pair.Pair_Impl_._new = function(a,b) {
	return { a : a, b : b};
};
tink.core._Pair.Pair_Impl_.get_a = function(this1) {
	return this1.a;
};
tink.core._Pair.Pair_Impl_.get_b = function(this1) {
	return this1.b;
};
tink.core._Pair.Pair_Impl_.toBool = function(this1) {
	return this1 != null;
};
tink.core._Pair.Pair_Impl_.isNil = function(this1) {
	return this1 == null;
};
tink.core._Pair.Pair_Impl_.nil = function() {
	return null;
};
tink.core._Pair.MPair_Impl_ = function() { };
tink.core._Pair.MPair_Impl_.__name__ = true;
tink.core._Pair.MPair_Impl_._new = function(a,b) {
	return { a : a, b : b};
};
tink.core._Pair.MPair_Impl_.get_a = function(this1) {
	return this1.a;
};
tink.core._Pair.MPair_Impl_.get_b = function(this1) {
	return this1.b;
};
tink.core._Pair.MPair_Impl_.set_a = function(this1,v) {
	return this1.a = v;
};
tink.core._Pair.MPair_Impl_.set_b = function(this1,v) {
	return this1.b = v;
};
function $iterator(o) { if( o instanceof Array ) return function() { return HxOverrides.iter(o); }; return typeof(o.iterator) == 'function' ? $bind(o,o.iterator) : o.iterator; }
var $_, $fid = 0;
function $bind(o,m) { if( m == null ) return null; if( m.__id__ == null ) m.__id__ = $fid++; var f; if( o.hx__closures__ == null ) o.hx__closures__ = {}; else f = o.hx__closures__[m.__id__]; if( f == null ) { f = function(){ return f.method.apply(f.scope, arguments); }; f.scope = o; f.method = m; o.hx__closures__[m.__id__] = f; } return f; }
if(Array.prototype.indexOf) HxOverrides.indexOf = function(a,o,i) {
	return Array.prototype.indexOf.call(a,o,i);
};
Math.NaN = Number.NaN;
Math.NEGATIVE_INFINITY = Number.NEGATIVE_INFINITY;
Math.POSITIVE_INFINITY = Number.POSITIVE_INFINITY;
Math.isFinite = function(i) {
	return isFinite(i);
};
Math.isNaN = function(i1) {
	return isNaN(i1);
};
String.prototype.__class__ = String;
String.__name__ = true;
Array.__name__ = true;
Date.prototype.__class__ = Date;
Date.__name__ = ["Date"];
var Int = { __name__ : ["Int"]};
var Dynamic = { __name__ : ["Dynamic"]};
var Float = Number;
Float.__name__ = ["Float"];
var Bool = Boolean;
Bool.__ename__ = ["Bool"];
var Class = { __name__ : ["Class"]};
var Enum = { };
if(Array.prototype.map == null) Array.prototype.map = function(f) {
	var a = [];
	var _g1 = 0;
	var _g = this.length;
	while(_g1 < _g) {
		var i = _g1++;
		a[i] = f(this[i]);
	}
	return a;
};
if(Array.prototype.filter == null) Array.prototype.filter = function(f1) {
	var a1 = [];
	var _g11 = 0;
	var _g2 = this.length;
	while(_g11 < _g2) {
		var i1 = _g11++;
		var e = this[i1];
		if(f1(e)) a1.push(e);
	}
	return a1;
};
Xml.Element = "element";
Xml.PCData = "pcdata";
Xml.CData = "cdata";
Xml.Comment = "comment";
Xml.DocType = "doctype";
Xml.ProcessingInstruction = "processingInstruction";
Xml.Document = "document";
var q = window.jQuery;
js.JQuery = q;
audiotools.Wav16Tools.SAMPLERATE = 48000;
dtx.DOMType.DOCUMENT_NODE = 9;
dtx.DOMType.ELEMENT_NODE = 1;
dtx.DOMType.TEXT_NODE = 3;
dtx.DOMType.COMMENT_NODE = 8;
dtx.Tools.firstTag = new EReg("<([a-z]+)[ />]","");
dtx.single.ElementManipulation.NodeTypeElement = 1;
dtx.single.ElementManipulation.NodeTypeAttribute = 2;
dtx.single.ElementManipulation.NodeTypeText = 3;
dtx.single.ElementManipulation.NodeTypeComment = 8;
dtx.single.ElementManipulation.NodeTypeDocument = 9;
dtx.single.ElementManipulation.selfClosingElms = ["area","base","br","col","command","embed","hr","img","input","keygen","link","meta","param","source","track","wbr"];
haxe.ds.ObjectMap.count = 0;
haxe.xml.Parser.escapes = (function($this) {
	var $r;
	var h = new haxe.ds.StringMap();
	h.set("lt","<");
	h.set("gt",">");
	h.set("amp","&");
	h.set("quot","\"");
	h.set("apos","'");
	h.set("nbsp",String.fromCharCode(160));
	$r = h;
	return $r;
}(this));
nx3.Constants.BASE_NOTE_VALUE = 3024;
nx3.Constants.STAVE_LENGTH = 6.8;
nx3.Constants.STAVE_BASIC_LENGTH = 7;
nx3.Constants.SIGN_TO_NOTE_DISTANCE = 0.8;
nx3.Constants.COMPLEX_COLLISION_OVERLAP_XTRA = 0.6;
nx3.Constants.SIGN_NORMAL_WIDTH = 2.6;
nx3.Constants.SIGN_PARENTHESIS_WIDTH = 4.4;
nx3.Constants.HEAD_ADJUST_X = 0;
nx3.Constants.COMPLEX_COLLISION_ADJUST_SAMELINE = 3.0;
nx3.Constants.COMPLEX_COLLISION_ADJUST_NEXTLINE = 2.2;
nx3.Constants.COMPLEX_COLLISION_ADJUST_SAMELINE_WHOLE = 4.3;
nx3.Constants.COMPLEX_COLLISION_ADJUST_NEXTLINE_WHOLE = 4;
nx3.Constants.NOTE_STEM_X_NORMAL = 1.6;
nx3.Constants.HEAD_WIDTH_NORMAL = 3.2;
nx3.Constants.HEAD_HALFWIDTH_NORMAL = 1.6;
nx3.Constants.HEAD_HALFWIDTH_WIDE = 2.2;
nx3.Constants.COMPLEX_COLLISION_CHORD_INTERSECTION = 0.8;
nx3.Constants.COMPLEX_COLLISION_NEXTLINEDELTA = 0.7;
nx3.Constants.COMPLEX_COLLISION_NEXTLINEDELTA_H1 = 0.9;
nx3.Constants.DOT_WIDTH = 2.0;
nx3.Constants.DDOT_WIDTH = 3.0;
nx3.Constants.FLAG_HEIGHT = 4.8;
nx3.Constants.FLAG_WIDTH = 2.6;
nx3.Constants.FLOAT_QUASI_ZERO = 0.0000001;
nx3.Constants.FONT_TEXT_DEFAULTFORMAT = { name : "Georgia", size : 20, bold : false, italic : false};
nx3.Constants.JS_CANVAS_TEXT_MEASUREMENT = "CanvasTextMeasurement";
nx3.Constants.FONT_TEXT_X_ADJUST_SVG = -2.2;
nx3.Constants.FONT_TEXT_Y_ADJUST_SVG = -13;
nx3.Constants.FONT_TEXT_Y_ADJUST_FLASH = -1.2;
nx3.Constants.FONT_TEXT_X_ADJUST_FLASH = -.3;
nx3.Constants.FONT_TEXT_X_ADJUST_SYS = 0;
nx3.Constants.FONT_TEXT_Y_ADJUST_SYS = -6;
nx3.Constants.BEAM_HEIGHT = 0.95;
nx3.Constants.TIE_WIDTH_CHORD = 3.2;
nx3.Constants.TIE_WIDTH_SINGLE = 3;
nx3.Constants.TIE_HEIGHT = 1.6;
nx3.Constants.LEGER_MARGIN = 0.6;
nx3.Constants.OBJECT_XMARGIN = 0.6;
nx3.Constants.ATTRIBUTE_SIGN_WIDTH = 2.4;
nx3.Constants.SCORE_DEFAULT_COUNTIN = 0;
nx3.Constants.SCORE_DEFAULT_TEMPO = 80;
nx3.Constants.BAR_SPACING_DEFAULT = 8;
nx3.ENoteValTools.DOT = 1.5;
nx3.ENoteValTools.DOTDOT = 1.75;
nx3.ENoteValTools.TRI = 0.66666666;
nx3.ENoteValTools.N1 = 4;
nx3.ENoteValTools.N2 = 2;
nx3.ENoteValTools.N4 = 1;
nx3.ENoteValTools.N8 = .5;
nx3.ENoteValTools.N16 = .25;
nx3.ENoteValTools.N32 = .125;
nx3.ENoteValTools.valNv1 = 12096;
nx3.ENoteValTools.valNv1dot = 18144;
nx3.ENoteValTools.valNv1ddot = 21168;
nx3.ENoteValTools.valNv1tri = 8063;
nx3.ENoteValTools.valNv2 = 6048;
nx3.ENoteValTools.valNv2dot = 9072;
nx3.ENoteValTools.valNv2ddot = 10584;
nx3.ENoteValTools.valNv2tri = 4031;
nx3.ENoteValTools.valNv4 = 3024;
nx3.ENoteValTools.valNv4dot = 4536;
nx3.ENoteValTools.valNv4ddot = 5292;
nx3.ENoteValTools.valNv4tri = 2015;
nx3.ENoteValTools.valNv8 = 1512;
nx3.ENoteValTools.valNv8dot = 2268;
nx3.ENoteValTools.valNv8ddot = 2646;
nx3.ENoteValTools.valNv8tri = 1007;
nx3.ENoteValTools.valNv16 = 756;
nx3.ENoteValTools.valNv16dot = 1134;
nx3.ENoteValTools.valNv16ddot = 1323;
nx3.ENoteValTools.valNv16tri = 503;
nx3.ENoteValTools.valNv32 = 378;
nx3.ENoteValTools.valNv32dot = 567;
nx3.ENoteValTools.valNv32ddot = 661;
nx3.ENoteValTools.valNv32tri = 251;
nx3.PBaseRectCalculator.BASERECT_HEIGHT = 3;
nx3.PBaseRectCalculator.BASERECT_HEIGHT_X_2 = 3 * 2;
nx3.PBaseRectCalculator.BASERECT_MARGIN = 0.6;
nx3.PBaseRectCalculator.BASERECT_MARGIN_X_2 = 1.2;
nx3.PColumnsAllotmentCalculator.delta = 0.5;
nx3.PSystemBarsGenerator.defaultClef = nx3.EClef.ClefF;
nx3.PSystemBarsGenerator.defaultKey = nx3.EKey.Flat2;
nx3.PSystemBarsGenerator.defaultTime = nx3.ETime.Time6_4;
nx3.audio.NotenrTools.stemtonestable = nx3.audio.NotenrTools.getNotenrTable(nx3.EKey.Natural);
nx3.render.TargetSvgXml.SVG_EXTRA_HEIGHT = 5;
nx3.render.scaling.Scaling.MID = { linesWidth : 0.8, space : 12.0, unitY : 6.0, noteWidth : 10, unitX : 5, quarterNoteWidth : 2.5, signPosWidth : 14.0, svgScale : .27, svgX : 0, svgY : -55.0, fontScaling : 1.5};
nx3.render.scaling.Scaling.NORMAL = { linesWidth : .5, space : 8.0, unitY : 4.0, noteWidth : 7.0, unitX : 3.5, quarterNoteWidth : 1.75, signPosWidth : 9.5, svgScale : .175, svgX : 0, svgY : -36.0, fontScaling : 1.0};
nx3.render.scaling.Scaling.SMALL = { linesWidth : .5, space : 6.0, unitY : 3.0, noteWidth : 5.0, unitX : 2.5, quarterNoteWidth : 1.25, signPosWidth : 7.0, svgScale : .14, svgX : 0, svgY : -28.5, fontScaling : 0.75};
nx3.render.scaling.Scaling.MINI = { linesWidth : .5, space : 4.0, unitY : 2.0, noteWidth : 3.3333333333333335, unitX : 1.6666666666666667, quarterNoteWidth : 0.83333333333333337, signPosWidth : 4.666666666666667, svgScale : 0.093333333333333338, svgX : 0, svgY : -19., fontScaling : 0.5};
nx3.render.scaling.Scaling.BIG = { linesWidth : 1.5, space : 16.0, unitY : 8.0, noteWidth : 14.0, unitX : 7.0, quarterNoteWidth : 5.5, signPosWidth : 19.0, svgScale : .36, svgX : -0.0, svgY : -74.0, fontScaling : 2.0};
nx3.render.scaling.Scaling.PRINT1 = { linesWidth : 3, space : 32.0, unitY : 16.0, noteWidth : 28.0, unitX : 14.0, quarterNoteWidth : 11.0, signPosWidth : 38.0, svgScale : .72, svgX : -0.0, svgY : -148.0, fontScaling : 4.0};
nx3.render.svg.SvgElements.pauseNv2 = "<svg><g><rect height=\"23\" width=\"50\" x=\"8\" y=\"210\" /></g></svg>";
nx3.render.svg.SvgElements.pauseNv1 = "<svg><g><rect height=\"26\" width=\"50\" x=\"8\" y=\"234\" /></g></svg>";
nx3.render.svg.SvgElements.clefG = "<svg><g><path style=\"fill:#000000;fill-opacity:1;fill-rule:evenodd;stroke:none\"\r\n\t\t\td=\"m 95.72971,266.7949 c -5.57504,2.79274 -12.48498,4.1891 -20.72511,4.1891 -9.69981,0 -18.99938,-1.66998 -27.91049,-5.00757 -8.90876,-3.33996 -16.75807,-7.86163 -23.54558,-13.56975 -6.78751,-5.70339 -12.24248,-12.38094 -16.36254,-20.03029 -4.12007,-7.64934 -6.1801,-15.78458 -6.1801,-24.40572 0,-29.26234 20.72746,-61.31506 62.18472,-96.1605 -1.3349,-5.34251 -2.33313,-10.74399 -2.99941,-16.209153 -0.66627,-5.460449 -1.00058,-11.107236 -1.00058,-16.938007 0,-8.010226 0.66392,-15.871864 1.99646,-23.582532 1.3302,-7.710668 3.23955,-14.935434 5.72336,-21.674325 2.48617,-6.738864 5.54208,-12.869193 9.17715,-18.393316 3.63272,-5.5265031 7.814,-10.1708424 12.53677,-13.9306366 16.47555,22.8253826 24.71097,44.6247216 24.71097,65.3862176 0,13.480109 -3.18069,26.321 -9.54442,38.522682 -6.36138,12.20404 -16.32959,24.07079 -29.90225,35.60967 l 7.99763,38.42834 c 4.36256,-0.35616 6.78751,-0.53307 7.2725,-0.53307 6.05767,0 11.72453,1.09209 16.99586,3.27863 5.27368,2.18418 9.88109,5.18919 13.82693,9.01269 3.94349,3.82349 7.07003,8.34517 9.37727,13.56502 2.30488,5.21986 3.4585,10.86193 3.46085,16.93329 -0.002,4.36836 -0.78869,8.68011 -2.36374,12.92581 -1.57504,4.25042 -3.814,8.28856 -6.72159,12.10969 -2.90994,3.82586 -6.36373,7.34272 -10.36137,10.55766 -3.99764,3.21965 -8.42141,5.98172 -13.26896,8.28856 0,-0.24294 0.18129,0.45523 0.54385,2.09218 0.36492,1.63932 0.8193,3.79048 1.36315,6.46291 0.5462,2.67008 1.18187,5.64443 1.90935,8.92306 0.72749,3.27626 1.36316,6.43224 1.90936,9.46556 0.5462,3.03568 1.02884,5.73878 1.45497,8.10222 0.42378,2.37052 0.63567,3.97681 0.63567,4.82595 0,5.70576 -1.21248,10.92561 -3.63508,15.65957 -2.42495,4.73396 -5.69746,8.80041 -9.81988,12.19933 -4.12006,3.39656 -8.90875,6.03833 -14.36136,7.9206 -5.45497,1.88226 -11.21364,2.82339 -17.27602,2.82339 -4.60506,0 -8.90641,-0.72885 -12.90875,-2.18654 -4,-1.45769 -7.515,-3.52157 -10.54502,-6.18929 -3.02765,-2.67244 -5.422,-5.91568 -7.18068,-9.73918 -1.75632,-3.82113 -2.63449,-8.03853 -2.63449,-12.64984 0,-3.27862 0.54621,-6.37563 1.63626,-9.2863 1.09005,-2.91066 2.60623,-5.39912 4.54384,-7.463 1.93996,-2.06389 4.3037,-3.7032 7.09122,-4.91323 2.78987,-1.21474 5.81989,-1.82329 9.09004,-1.82329 2.90994,0 5.63625,0.66988 8.18127,2.00492 2.54502,1.33503 4.72748,3.06634 6.54502,5.18919 1.81754,2.12521 3.27251,4.5547 4.36491,7.2861 1.09005,2.72905 1.63626,5.49111 1.63626,8.28384 0,6.31431 -2.33314,11.4752 -7.00176,15.48267 -4.66627,4.00512 -10.51205,6.37328 -17.54441,7.09976 5.57504,2.79509 11.329,4.19146 17.2666,4.1891 4.8452,0.002 9.57268,-0.87745 14.17773,-2.64177 4.6027,-1.75961 8.62859,-4.12777 12.08474,-7.10212 3.45379,-2.97436 6.24131,-6.43932 8.3602,-10.38547 2.11889,-3.94614 3.18069,-8.16354 3.18069,-12.65692 0,-1.70299 -0.18365,-3.58526 -0.54385,-5.64914 L 95.72971,266.7949 z M 95.18821,27.488123 c -1.21483,-0.243068 -2.30724,-0.365597 -3.27486,-0.365597 -3.75986,0 -7.24661,1.912917 -10.46026,5.738777 -3.21365,3.823478 -6.00352,8.80275 -8.36726,14.933079 -2.36374,6.132684 -4.21188,13.022518 -5.54914,20.671856 -1.33254,7.649365 -2.00117,15.298698 -2.00117,22.948042 0,3.158334 0.12478,6.194011 0.36492,9.10704 0.24485,2.91538 0.67333,5.70811 1.2831,8.37819 24.73216,-21.976242 37.09942,-41.768292 37.09942,-59.373819 0,-8.378205 -3.03237,-15.723276 -9.09475,-22.037568 z m 3.814,231.850857 c 5.94467,-4.37072 10.46026,-9.16837 13.55619,-14.39058 3.09123,-5.21986 4.63802,-10.86429 4.63802,-16.93801 0,-3.76216 -0.63802,-7.4347 -1.91171,-11.01996 -1.27134,-3.57818 -3.08887,-6.76718 -5.45497,-9.56227 -2.36609,-2.78801 -5.18657,-5.03588 -8.46143,-6.7318 -3.27486,-1.69828 -6.85108,-2.54506 -10.72865,-2.54506 -0.24249,0 -0.72749,0.0307 -1.45497,0.0873 -0.72513,0.0613 -1.75633,0.15097 -3.08887,0.2689 l 12.90639,60.83151 z M 81.56374,199.26225 c -3.75749,0.48354 -7.2725,1.42468 -10.545,2.82104 -3.27251,1.39637 -6.08828,3.12767 -8.45202,5.19155 -2.36374,2.06389 -4.24249,4.43205 -5.63625,7.10212 -1.39376,2.67244 -2.09064,5.58546 -2.09064,8.7438 0,9.34762 4.96527,17.11962 14.88874,23.31127 -8.24013,-1.33503 -14.84636,-4.52167 -19.81634,-9.56227 -4.96997,-5.03823 -7.45378,-11.38084 -7.45378,-19.03255 0,-4.49101 0.93937,-8.83106 2.81812,-13.02016 1.87875,-4.18909 4.39317,-7.95598 7.54325,-11.30065 3.15479,-3.34703 6.85108,-6.23647 11.09121,-8.66595 4.24249,-2.43421 8.72748,-4.13721 13.45261,-5.10664 l -7.63507,-36.42579 c -17.08768,12.86684 -30.02468,25.49546 -38.81101,37.88112 -8.78633,12.38567 -13.1795,24.64868 -13.1795,36.79139 0,6.67755 1.48322,12.99421 4.45438,18.94292 2.97115,5.95106 6.9735,11.14026 12.00469,15.5723 5.03119,4.4344 10.85107,7.92531 17.45966,10.47274 6.60623,2.55214 13.60563,3.82821 20.9982,3.82821 4.24249,0 8.18127,-0.39627 11.81634,-1.18408 3.63743,-0.79017 7.03001,-2.03558 10.1801,-3.73386 L 81.56374,199.26225 z\" />\r\n\t\t</g></svg>";
nx3.render.svg.SvgElements.clefC = "<svg><g><path style=\"fill:#000000;fill-opacity:1;fill-rule:evenodd;stroke:none\"\r\n\t\t\td=\"M 90,276 C 86,276 81,275 77,274 73,273 70,271 67,268 64,266 61,263 60,260 58,256 57,253 57,249 57,247 57,245 58,243 59,241 60,239 61,238 63,236 64,235 66,234 68,233 70,232 72,232 74,232 76,233 77,233 79,234 81,236 82,237 84,238 85,240 86,242 87,244 87,246 87,248 87,250 86,252 85,253 84,255 82,256 80,258 79,259 77,260 76,261 75,262 74,262 74,263 74,267 79,269 88,269 92,269 96,268 98,267 101,266 103,264 105,261 107,258 108,255 109,250 110,245 110,239 110,232 110,228 110,224 109,220 108,216 107,212 105,210 104,207 102,204 100,203 98,201 96,200 93,200 84,200 76,207 67,222 66,217 65,213 64,209 63,205 62,201 60,199 59,196 57,193 55,192 53,190 52,189 49,189 48,189 47,189 46,190 L 46,275 39,275 39,93 46,93 46,179 C 46,179 47,179 47,179 48,180 48,180 49,180 51,180 53,179 55,177 57,175 59,173 60,170 62,167 63,163 64,159 65,155 66,151 67,147 77,160 86,166 92,166 94,166 97,165 99,164 101,162 103,160 104,157 106,155 107,151 108,148 109,144 109,140 109,135 109,128 109,122 108,117 107,113 106,109 104,107 102,104 99,102 96,101 93,100 89,100 84,100 75,100 71,102 71,105 71,106 73,107 75,108 80,110 83,112 85,114 86,116 87,118 87,121 87,123 87,124 86,126 85,128 84,130 83,131 81,133 80,134 78,135 76,136 74,137 72,137 68,137 64,135 61,132 58,129 56,125 56,120 56,114 58,108 62,102 66,98 70,95 74,94 79,93 83,92 88,92 95,92 101,93 106,95 112,96 116,99 120,102 124,105 127,110 129,114 131,119 132,125 132,131 132,136 131,142 129,147 128,152 125,157 122,161 119,165 116,168 112,170 108,173 103,174 98,174 89,174 81,172 76,169 L 76,169 C 74,169 72,170 71,173 70,175 69,178 69,182 69,184 69,186 69,188 70,191 70,193 71,194 72,196 72,197 73,198 74,199 75,200 76,200 79,197 82,194 86,193 89,191 93,190 97,190 102,190 107,191 111,194 116,196 120,200 123,204 126,209 129,214 130,219 132,225 133,231 133,237 133,250 129,259 122,266 114,273 104,276 90,276 Z M 27,93 L 27,275 4,275 4,93 27,93 Z\"/>\r\n\t\t</g></svg>";
nx3.render.svg.SvgElements.clefF = "<svg><g><path style=\"fill:#000000;fill-opacity:1;fill-rule:evenodd;stroke:none\"\r\n\t\t\td=\"M 8,240 C 21,236 32,230 39,224 45,218 51,211 57,204 62,197 67,190 70,183 74,176 77,168 79,161 81,153 82,146 82,139 82,133 81,127 80,122 78,118 76,113 73,110 70,106 66,103 62,101 58,99 53,98 48,98 44,98 41,99 37,100 33,101 30,103 27,106 24,108 22,111 20,114 18,117 17,120 17,123 17,125 17,126 18,126 18,126 18,126 19,125 20,125 20,124 22,123 23,123 24,122 26,122 27,121 29,121 31,121 33,121 35,121 36,122 38,123 40,124 41,126 42,127 43,129 44,131 45,133 45,135 45,137 45,143 43,147 40,151 36,155 32,157 26,157 23,157 20,156 18,155 16,154 14,152 12,149 10,147 9,144 8,141 7,138 7,134 7,131 7,126 8,121 11,116 13,111 16,107 21,104 25,101 29,98 35,96 40,94 46,93 52,93 62,93 71,95 78,98 85,101 91,105 95,111 99,116 102,122 104,128 105,134 106,140 106,147 106,150 106,154 105,157 105,161 104,164 102,168 101,172 99,176 97,180 94,185 91,190 88,195 84,202 78,209 71,215 64,221 57,226 50,230 43,235 36,238 29,240 23,243 18,244 14,244 10,244 8,243 8,240 Z M 121,116 C 121,113 122,111 124,110 125,108 127,107 130,107 133,107 135,108 136,110 138,111 139,113 139,116 139,119 138,121 136,122 135,124 133,125 130,125 127,125 125,124 124,122 122,121 121,119 121,116 Z M 121,162 C 121,159 122,157 124,156 125,154 127,153 130,153 133,153 135,154 136,156 138,157 139,159 139,162 139,165 138,167 136,168 135,170 133,171 130,171 127,171 125,170 124,168 122,167 121,165 121,162 Z\"/>\r\n\t\t</g></svg>";
nx3.render.svg.SvgElements.HVT4 = nx3.render.svg.SvgElements.noteBlack;
nx3.render.svg.SvgElements.noteBlack = "<svg><g><path style=\"fill:#000000;fill-opacity:1;fill-rule:evenodd;stroke:none\"\r\n\t\t\td = \"m 20.557649,250.57631 c -5.81753,-0.002 -10.6650905,-1.36806 -14.5450105,-4.0971 -3.87756,-2.73612 -5.81516995,-6.6516 -5.81516995,-11.74881 0,-4.12777 1.30193995,-8.10458 3.90816995,-11.92807 2.60387,-3.82585 5.9069905,-7.19411 9.9070005,-10.1095 3.99998,-2.91302 8.452014,-5.24816 13.360774,-7.01013 4.90876,-1.7596 9.66448,-2.63941 14.2719,-2.63941 6.1801,0 11.17834,1.42467 14.99703,4.27637 3.81636,2.85406 5.72572,6.70821 5.72572,11.56483 0,4.00747 -1.30195,7.92295 -3.90817,11.7488 -2.60623,3.8235 -5.93761,7.19412 -9.99882,10.10714 -4.05885,2.91303 -8.54382,5.27883 -13.45258,7.10448 -4.90878,1.81858 -9.72573,2.72905 -14.450844,2.7314 z\" />\r\n\t\t</g></svg>";
nx3.render.svg.SvgElements.HVT2 = nx3.render.svg.SvgElements.noteWhite;
nx3.render.svg.SvgElements.noteWhite = "<svg><g><path style=\"fill:#000000;fill-opacity:1;fill-rule:evenodd;stroke:none\"\r\n\t\t\td=\"m -0.01820308,235.29885 c 0,-4.12777 1.15125988,-8.19421 3.45376988,-12.20168 2.30253,-4.00747 5.3325496,-7.55735 9.0900592,-10.65436 3.7575,-3.09701 7.96936,-5.58546 12.63565,-7.46772 4.66627,-1.88227 9.30428,-2.8234 13.90934,-2.8234 7.63741,0 13.69743,1.60865 18.18243,4.82831 4.48262,3.2173 6.72393,7.73898 6.72863,13.56739 -0.005,4.25042 -1.21482,8.25553 -3.63977,12.02006 -2.4226,3.76452 -5.57504,7.04315 -9.4526,9.83588 -3.87756,2.79037 -8.30134,5.00522 -13.27367,6.64689 -4.96763,1.63695 -10.06001,2.45779 -15.27249,2.46015 -6.18245,-0.002 -11.45615,-1.42939 -15.8186992,-4.28109 -4.36254,-2.85641 -6.54264988,-6.83322 -6.54264988,-11.93043 z M 49.439026,207.62158 c -1.93759,0 -4.39551,0.48589 -7.3643,1.45769 -2.97117,0.96944 -6.15186,2.2455 -9.54915,3.82113 -3.39257,1.57799 -6.75924,3.39893 -10.09297,5.46517 -3.33606,2.06388 -6.36843,4.18438 -9.09475,6.37091 -2.731,2.18182 -4.9417295,4.39902 -6.6391792,6.64453 -1.69512,2.24787 -2.54502,4.28109 -2.54738,6.10202 0.002,5.7034 3.4561299,8.55746 10.3684392,8.55746 3.27486,0 7.45849,-1.06143 12.55087,-3.18664 5.09241,-2.12285 10.0624,-4.73396 14.91464,-7.82861 4.84756,-3.097 9.03119,-6.34497 12.54619,-9.74153 3.51735,-3.40128 5.27603,-6.4346 5.27603,-9.10468 0,-5.7034 -3.45377,-8.55745 -10.36844,-8.55745 z\" />\r\n\t\t</g></svg>";
nx3.render.svg.SvgElements.HVT1 = nx3.render.svg.SvgElements.noteWhole;
nx3.render.svg.SvgElements.noteWhole = "<svg><g><path style=\"fill:#000000;fill-opacity:1;fill-rule:evenodd;stroke:none\"\r\n\t\t\td=\"m 0.14197458,226.9183 c 0,-3.64187 1.21011002,-6.97946 3.63271012,-10.01514 2.4226,-3.03568 5.66217,-5.64679 9.7233503,-7.83569 4.0565,-2.18182 8.692204,-3.85179 13.899944,-5.00757 5.21012,-1.15106 10.54031,-1.72894 15.99057,-1.7313 5.09006,0.002 10.08827,0.64157 14.99232,1.91292 4.9064,1.27843 9.32782,3.00738 13.26661,5.19156 3.93643,2.18653 7.11712,4.76698 9.54208,7.74133 2.42025,2.97671 3.63271,6.22468 3.63271,9.74389 0,3.88718 -1.0312,7.34743 -3.08885,10.38311 -2.06004,3.03568 -4.99825,5.58546 -8.81461,7.64935 -3.81636,2.06388 -8.38843,3.67253 -13.71862,4.8283 -5.33019,1.15106 -11.26544,1.72895 -17.8081,1.73131 -5.81517,-0.002 -11.23482,-0.58025 -16.26603,-1.73131 -5.026479,-1.15577 -9.389044,-2.79508 -13.082984,-4.9203 -3.6962903,-2.12521 -6.6015203,-4.70565 -8.7204103,-7.73897 -2.1212401,-3.03568 -3.18069012,-6.43696 -3.18069012,-10.20149 z m 65.06407442,9.28158 c 0,-4.00511 -1.39376,-8.80276 -4.18363,-14.38822 -1.33254,-2.67007 -2.75691,-5.00757 -4.27074,-7.01248 -1.51618,-2.00256 -3.18305,-3.61121 -5.00057,-4.82595 -1.81754,-1.21239 -3.90817,-2.12522 -6.27193,-2.73141 -2.36373,-0.60619 -5.06179,-0.91047 -8.09181,-0.91047 -11.63506,0 -17.452602,4.675 -17.452602,14.02498 0,3.51922 0.696896,6.88984 2.090662,10.10714 1.39376,3.2173 3.24189,6.10202 5.54443,8.6518 2.30253,2.54978 4.84756,4.583 7.63508,6.09966 2.78751,1.51902 5.63859,2.27853 8.54853,2.27853 2.6651,0 5.17951,-0.12266 7.54324,-0.3656 2.36376,-0.24296 4.485,-0.72885 6.36375,-1.45769 1.8811,-0.72649 3.48674,-1.8516 4.81694,-3.36826 1.33489,-1.51666 2.24367,-3.55224 2.72865,-6.10203 z\" />\r\n\t\t</g></svg>";
nx3.render.svg.SvgElements.signNatural = "<svg><g><path style=\"fill:#000000;fill-opacity:1;fill-rule:evenodd;stroke:none;display:inline\"\r\n\t\t\td=\"m 27.763524,289.1105 0,-36.43051 -27.82574358,9.65191 0,-97.8116 4.52499988,0 0.0183,36.60977 27.8092637,-9.83589 0,97.81632 -4.52736,0 z m -23.3007437,-42.80378 23.3007437,-8.38055 -0.0157,-30.60209 -23.2842537,8.55981 0,30.42283 z\" />\t\r\n\t\t</g></svg>";
nx3.render.svg.SvgElements.signSharp = "<svg><g><path style=\"fill:#000000;fill-opacity:1;fill-rule:evenodd;stroke:none;display:inline\"\r\n\t\t\td=\"m 31.526296,208.23455 -17.48556,5.8284 0.0157,31.51021 17.46908,-5.82841 0,-31.5102 z m 4.52736,-43.89588 0.0131,26.0474 9.44083,-3.09464 0,16.5724 -9.4526,3.097 0,31.50785 9.4526,-3.09701 0,16.57476 -9.4526,3.09701 0,28.59482 -4.52736,0 0,-27.32111 -17.48556,5.82841 0,27.31875 -4.52736,0 0,-26.04268 -9.4526,3.09464 0,-16.57239 9.4526,-3.09701 -0.0131,-31.50785 -9.43847,3.09465 0,-16.5724 9.4526,-3.09701 0,-28.59482 4.52736,0 0.0157,27.32111 17.46908,-5.82841 0,-27.32347 4.52736,0 z\" />\t\r\n\t\t</g></svg>";
nx3.render.svg.SvgElements.signFlat = "<svg><g><path style=\"fill:#000000;fill-opacity:1;fill-rule:evenodd;stroke:none;display:inline\"\r\n\t\t\t\td=\"m 0.119631,150.69109 5.81283,0 -1.25721,57.37598 c 3.63742,-5.96993 9.26898,-8.95607 16.901689,-8.95371 2.66507,-0.002 5.23835,0.45287 7.72451,1.3657 2.48383,0.91046 4.63332,2.15823 6.45084,3.73622 1.8152,1.58034 3.27018,3.46025 4.36022,5.64914 1.09004,2.18654 1.63625,4.55234 1.63625,7.10684 -0.24254,3.52158 -1.54679,7.44178 -3.90817,11.75353 -2.36373,4.3141 -6.39435,8.53622 -12.08944,12.66399 l -25.631519,18.95235 0,-109.65004 z m 16.901689,55.71308 c -5.082969,0 -8.960559,2.55214 -11.620919,7.65407 -0.71102,6.92521 -1.06652,12.87863 -1.06652,17.86026 0,8.62586 0.29665,14.63825 0.88758,18.03953 2.30253,-1.45769 4.75337,-3.61121 7.35491,-6.46763 2.603867,-2.85641 4.991139,-5.89445 7.171249,-9.11175 2.17775,-3.21966 3.96469,-6.43696 5.35609,-9.65898 1.39141,-3.21966 2.08592,-6.04541 2.08827,-8.47254 -0.002,-2.79509 -0.96997,-5.13494 -2.90523,-7.0172 -1.93762,-1.88463 -4.35784,-2.82576 -7.26543,-2.82576 z\" />\r\n\t\t</g></svg>";
nx3.render.svg.SvgElements.flagDown8 = "<svg><g><path style=\"fill:#000000;fill-opacity:1;fill-rule:evenodd;stroke:none\" \r\n\t\t\td=\"M 10,227 C 12,227 14,227 15,227 16,227 17,226 19,226 20,225 22,224 23,223 25,222 27,220 30,218 39,211 44,206 46,205 54,195 58,185 58,174 58,166 55,156 48,144 48,143 47,142 47,141 47,140 48,139 48,139 49,139 50,140 52,142 53,144 55,146 56,149 57,152 59,155 60,158 61,161 62,164 62,166 63,171 64,176 64,181 64,186 63,190 61,195 60,200 57,204 54,209 50,213 47,216 43,220 39,224 36,228 33,232 29,237 25,243 22,249 18,255 15,262 13,269 12,269 12,270 12,271 12,271 12,272 13,272 13,273 12,273 10,273 L 10,227 Z\"/>\r\n\t\t</g></svg>";
nx3.render.svg.SvgElements.flagUp8 = "<svg><g><path style=\"fill:#000000;fill-opacity:1;fill-rule:evenodd;stroke:none\" \r\n\t\t\td=\"M 12,181 C 14,181 15,181 14,181 14,181 14,182 14,182 14,183 14,184 14,184 20,199 27,211 35,221 45,234 50,241 52,243 56,250 58,258 58,266 L 58,267 C 58,273 58,278 57,282 56,287 55,291 53,294 52,297 51,299 50,301 48,302 48,303 47,303 46,303 46,303 46,302 46,301 46,300 47,298 48,295 49,293 50,291 50,290 51,288 51,286 51,284 52,282 52,280 52,277 52,274 52,270 L 52,269 C 52,256 45,245 30,234 28,233 27,232 26,231 25,230 24,230 22,229 21,228 20,228 18,227 16,227 14,227 12,227 L 12,181 Z\"/>\r\n\t\t</g></svg>";
nx3.render.svg.SvgElements.flagDown16 = "<svg><g><path style=\"fill:#000000;fill-opacity:1;fill-rule:evenodd;stroke:none\" \r\n\t\t\td=\"M 65,152 C 65,157 64,162 63,165 65,169 66,175 66,181 66,186 65,191 64,196 62,200 59,205 56,209 52,213 49,217 45,221 42,224 38,228 35,232 31,238 27,243 23,250 20,256 17,262 15,269 15,269 15,270 15,271 15,271 15,272 15,272 15,273 14,273 12,273 L 12,192 C 16,192 20,192 24,190 28,188 32,186 36,183 39,181 42,178 45,176 47,174 49,172 50,171 55,165 58,158 58,150 58,143 56,135 53,127 52,125 51,124 51,123 51,122 52,122 53,122 55,122 56,123 58,126 59,129 60,132 61,136 62,139 63,143 64,146 65,149 65,151 65,152 Z M 60,179 C 60,178 60,177 60,177 60,176 60,175 60,174 59,175 58,177 55,180 53,182 50,185 47,187 45,190 42,192 40,194 37,196 36,198 35,199 29,207 23,216 19,226 20,225 22,225 24,224 26,222 28,221 30,219 36,214 41,210 44,207 48,204 50,202 50,202 57,195 60,187 60,179 Z\"/>\r\n\t\t</g></svg>";
nx3.render.svg.SvgElements.flagUp16 = "<svg><g><path style=\"fill:#000000;fill-opacity:1;fill-rule:evenodd;stroke:none\" \r\n\t\t\td=\"M 52,321 C 51,321 50,321 50,320 50,319 51,318 51,316 51,314 52,312 52,310 53,308 53,305 53,303 54,301 54,299 54,297 54,295 54,293 53,291 52,290 51,288 50,286 48,284 46,281 43,279 40,276 36,273 31,269 28,268 27,266 25,265 23,264 22,263 21,263 20,262 19,262 17,262 16,262 15,262 13,262 L 13,181 14,181 C 14,181 15,181 15,182 15,182 15,183 16,184 19,196 26,208 36,221 39,225 41,228 45,232 48,235 51,239 53,242 56,246 58,250 59,255 60,259 61,264 61,269 61,275 60,281 58,285 59,286 59,288 59,290 60,292 60,295 60,298 L 60,298 C 60,300 60,302 59,305 59,307 58,310 57,312 56,315 56,317 55,318 54,320 53,321 52,321 Z M 55,272 C 55,263 53,256 48,250 48,250 46,249 44,247 42,245 40,242 37,240 34,237 31,235 28,233 24,230 22,229 19,228 22,233 24,238 27,243 30,247 32,252 36,255 36,256 37,257 39,259 41,260 43,262 45,264 47,267 49,269 51,271 53,273 54,275 55,277 55,276 55,275 55,274 55,273 55,272 55,272 Z\"/>\r\n\t\t</g></svg>";
nx3.render.svg.SvgElements.pauseNv4 = "<svg><g><path style=\"fill:#000000;fill-opacity:1;fill-rule:evenodd;stroke:none\"\r\n\t\t\td=\"M 54,263 C 49,261 43,260 38,260 34,260 30,261 27,263 24,266 22,269 22,273 22,280 26,287 34,294 33,295 33,295 32,295 31,295 29,294 26,292 23,291 20,288 17,285 14,283 12,280 9,276 7,273 6,269 6,266 6,264 6,261 7,258 8,256 9,254 11,252 12,250 14,248 17,247 19,246 21,245 24,245 28,245 31,246 35,248 34,246 32,244 30,241 29,239 27,237 24,234 22,231 20,228 17,225 14,221 11,217 7,213 20,201 26,191 26,181 26,179 25,176 24,173 23,170 21,167 19,165 18,162 16,160 15,158 13,156 13,155 13,155 13,154 14,153 16,153 L 48,198 C 37,212 31,222 31,228 31,231 32,233 34,236 35,239 37,242 40,245 42,248 45,251 47,254 50,257 52,260 54,263 Z\" />\r\n\t\t</g></svg>";
nx3.render.svg.SvgElements.pauseNv8 = "<svg><g><path style=\"fill:#000000;fill-opacity:1;fill-rule:evenodd;stroke:none\"\r\n\t\t\td=\"M 30,273 L 22,273 52,208 C 42,211 34,213 28,213 17,213 11,208 11,199 11,197 12,194 15,193 18,191 21,190 24,190 31,190 34,193 34,199 34,202 33,205 31,209 32,209 32,209 34,209 42,209 50,205 60,197 L 30,273 Z\"/>\r\n\t\t</g></svg>";
nx3.render.svg.SvgElements.pauseNv16 = "<svg><g><path style=\"fill:#000000;fill-opacity:1;fill-rule:evenodd;stroke:none\"\r\n\t\t\td=\"M 26,314 L 18,314 44,253 C 37,256 30,258 23,258 12,258 6,254 6,245 6,242 8,240 10,238 13,236 16,235 20,235 27,235 30,238 30,244 30,246 29,249 27,253 28,253 29,253 29,253 30,253 31,253 31,253 34,253 39,252 46,249 L 65,207 C 57,210 49,212 42,212 31,212 25,208 25,200 25,197 26,194 29,192 31,190 34,189 38,189 44,189 48,192 48,198 48,201 47,204 45,208 46,208 47,208 48,208 53,208 62,204 73,196 L 26,314 Z\"/>\r\n\t\t</g></svg>";
nx3.render.svg.SvgElements.time0 = "<svg><g><path style=\"fill:#000000;fill-opacity:1;fill-rule:evenodd;stroke:none\" \r\n\t\t\td=\"M 81,227 C 81,232 80,238 78,243 76,248 74,252 70,256 67,260 63,263 59,265 54,268 50,269 45,269 40,269 35,268 30,265 26,263 22,260 19,256 16,252 13,247 11,242 9,237 8,232 8,227 8,222 9,216 11,211 13,206 16,202 19,197 22,193 26,190 30,188 35,185 40,184 45,184 49,184 54,185 58,188 63,190 67,193 70,197 73,201 76,206 78,211 80,216 81,221 81,227 Z M 58,229 C 58,202 54,189 45,189 36,189 31,202 31,227 31,252 36,264 45,264 54,264 58,252 58,229 Z\"/>\r\n\t\t</g></svg>";
nx3.render.svg.SvgElements.time1 = "<svg><g><path style=\"fill:#000000;fill-opacity:1;fill-rule:evenodd;stroke:none\" \r\n\t\t\td=\"M 10,269 C 10,266 11,264 13,264 16,263 18,262 19,261 20,259 20,257 20,253 L 20,215 C 20,211 20,208 19,207 19,207 18,208 17,210 16,211 15,212 13,214 12,216 11,217 9,219 8,220 8,221 7,221 7,221 6,221 5,221 14,203 19,191 20,184 21,184 23,185 25,185 26,185 29,185 31,185 37,185 41,185 43,184 L 43,253 C 43,257 44,259 45,261 46,262 47,262 48,263 50,263 51,264 52,264 53,265 54,266 54,269 L 10,269 Z\"/>\r\n\t\t</g></svg>";
nx3.render.svg.SvgElements.time2 = "<svg><g><path style=\"fill:#000000;fill-opacity:1;fill-rule:evenodd;stroke:none\" \r\n\t\t\td=\"M 76,239 C 75,260 68,271 55,271 53,271 51,270 48,269 45,268 41,267 38,266 35,265 32,263 29,262 26,261 24,261 23,261 21,261 19,261 18,262 17,263 16,263 15,264 14,265 13,266 12,267 11,267 10,268 9,268 8,268 7,267 7,267 7,263 8,259 10,257 12,255 13,252 15,250 18,245 23,240 29,236 34,232 38,229 40,227 43,225 45,223 47,221 48,219 49,217 49,215 50,213 50,211 50,209 50,204 49,199 46,196 43,193 39,191 34,191 28,191 24,193 22,196 24,197 27,199 29,201 31,203 32,205 32,208 32,210 32,211 31,213 30,214 29,215 28,216 27,217 25,218 24,219 22,219 21,220 19,220 12,220 8,216 8,208 8,200 11,194 17,189 23,185 31,183 42,183 48,183 54,184 58,186 62,188 65,190 68,192 70,195 72,198 73,201 74,204 74,206 74,208 74,214 72,219 68,223 67,224 64,225 61,227 57,229 53,231 49,233 44,235 40,237 36,239 32,241 29,243 27,245 L 27,245 C 27,245 28,245 29,245 29,245 30,245 31,245 33,245 35,245 38,246 41,247 44,247 48,248 51,249 54,250 56,251 59,252 61,252 62,252 65,252 68,251 69,249 69,249 70,248 71,246 71,244 73,242 76,239 Z\"/>\r\n\t\t</g></svg>";
nx3.render.svg.SvgElements.time3 = "<svg><g><path style=\"fill:#000000;fill-opacity:1;fill-rule:evenodd;stroke:none\" \r\n\t\t\td=\"M 70,245 C 70,253 67,260 61,264 56,268 48,270 37,270 33,270 29,270 25,269 21,268 18,267 15,265 12,263 10,261 8,259 7,257 6,254 6,251 6,248 7,245 10,243 12,241 15,240 18,240 21,240 24,241 26,243 28,245 29,247 29,250 29,255 27,259 24,262 26,264 30,265 35,265 39,265 43,263 45,260 48,257 49,253 49,249 49,243 48,239 46,237 44,234 41,232 37,231 33,231 30,231 28,230 25,230 24,229 24,228 24,227 24,225 24,225 24,224 25,223 25,223 26,223 27,223 28,223 29,223 30,222 32,222 37,222 41,220 44,218 47,216 48,212 48,206 48,195 43,189 32,189 28,189 25,190 23,192 25,194 26,196 28,198 29,200 30,202 30,205 30,208 29,211 27,212 24,214 22,215 19,215 15,215 13,214 10,212 8,210 7,207 7,203 7,197 10,192 15,189 21,186 28,184 37,184 46,184 54,186 60,190 65,194 68,199 68,207 68,211 67,215 64,219 61,222 58,225 53,226 L 54,227 C 58,228 62,230 65,233 68,236 70,240 70,245 Z\"/>\r\n\t\t</g></svg>";
nx3.render.svg.SvgElements.time4 = "<svg><g><path style=\"fill:#000000;fill-opacity:1;fill-rule:evenodd;stroke:none\" \r\n\t\t\td=\"M 66,250 L 66,255 C 66,256 66,256 66,257 66,257 66,258 66,258 66,260 67,262 68,262 69,263 72,264 76,264 L 77,269 32,269 32,264 C 38,264 41,262 42,261 43,260 43,256 43,250 L 6,250 6,243 C 8,239 11,235 14,230 16,225 19,220 21,215 23,209 25,204 26,199 28,193 29,189 29,184 L 60,184 C 58,192 52,202 41,213 28,226 21,235 18,242 L 43,242 43,221 66,201 66,242 78,242 78,250 66,250 Z\"/>\r\n\t\t</g></svg>";
nx3.render.svg.SvgElements.time5 = "<svg><g><path style=\"fill:#000000;fill-opacity:1;fill-rule:evenodd;stroke:none\" \r\n\t\t\td=\"M 4,249 C 4,245 5,242 8,239 10,236 13,235 16,235 25,235 29,239 29,247 29,248 29,250 28,251 27,253 27,254 26,255 25,256 24,258 24,258 23,259 22,260 22,260 24,263 28,264 32,264 43,264 48,256 48,241 48,234 47,230 44,226 42,222 38,220 33,220 29,220 24,222 18,225 17,225 17,225 17,226 17,226 16,226 16,226 16,227 15,227 14,227 13,227 11,227 9,228 9,223 10,217 10,209 11,202 11,193 12,183 20,185 31,186 44,186 52,186 61,185 69,184 68,197 56,204 34,204 34,204 32,204 31,204 30,204 28,204 27,204 25,203 23,203 22,203 21,203 20,203 19,203 19,203 18,204 18,205 18,206 18,207 18,209 18,210 17,212 17,213 17,215 17,217 17,218 24,215 31,213 39,213 43,213 47,214 51,215 56,216 59,218 62,220 65,223 68,226 69,229 71,232 72,236 72,240 72,245 71,249 69,252 67,256 65,259 62,261 58,264 55,266 50,267 46,268 41,269 36,269 31,269 26,268 23,267 19,266 15,265 13,263 10,261 8,259 6,256 5,254 4,251 4,249 Z\"/>\r\n\t\t</g></svg>";
nx3.render.svg.SvgElements.time6 = "<svg><g><path style=\"fill:#000000;fill-opacity:1;fill-rule:evenodd;stroke:none\" \r\n\t\t\td=\"M 74,241 C 74,245 73,249 72,253 70,257 68,260 65,262 62,265 59,267 55,268 51,269 46,270 42,270 30,270 21,266 15,259 9,251 6,240 6,227 6,221 7,215 9,210 10,204 13,200 16,196 19,192 23,189 27,186 31,184 36,183 41,183 46,183 49,183 53,184 57,185 60,186 63,188 66,189 68,191 69,193 71,196 72,198 72,201 72,204 71,207 68,210 66,212 63,213 59,213 55,213 52,212 50,209 47,207 46,204 46,201 46,200 46,198 47,196 48,195 48,193 48,192 48,189 46,188 42,188 40,188 38,189 36,190 34,192 33,194 32,196 31,198 30,201 29,204 28,207 28,211 28,214 28,214 28,215 28,217 28,219 28,221 28,223 35,220 43,218 50,218 57,218 63,220 67,224 72,228 74,234 74,241 Z M 43,226 C 34,226 29,232 29,245 29,258 33,264 41,264 49,264 53,258 53,245 53,232 50,226 43,226 Z\"/>\r\n\t\t</g></svg>";
nx3.render.svg.SvgElements.time7 = "<svg><g><path style=\"fill:#000000;fill-opacity:1;fill-rule:evenodd;stroke:none\" \r\n\t\t\td=\"M 77,188 C 77,194 72,207 63,227 54,245 50,259 50,269 L 50,271 C 47,270 42,270 34,270 32,270 29,270 27,270 25,270 24,271 22,271 23,257 32,242 49,225 55,219 59,214 61,209 56,212 50,213 45,213 44,213 41,213 39,212 36,211 34,210 31,209 28,208 26,207 23,206 21,206 20,205 19,205 18,205 16,207 15,209 14,212 13,214 12,217 10,215 9,213 8,211 L 8,203 C 8,203 8,201 8,200 8,198 8,197 8,195 L 8,186 C 14,188 17,190 17,190 18,190 18,189 20,189 21,188 23,187 25,186 26,185 28,185 30,184 32,183 34,183 36,183 38,183 40,184 42,185 45,186 48,188 50,190 53,192 55,193 57,195 59,196 61,197 62,197 67,197 71,193 72,187 L 74,187 C 76,187 77,187 77,188 Z\"/>\r\n\t\t</g></svg>";
nx3.render.svg.SvgElements.time8 = "<svg><g><path style=\"fill:#000000;fill-opacity:1;fill-rule:evenodd;stroke:none\" \r\n\t\t\td=\"M 75,244 C 75,248 74,251 72,255 71,258 68,260 65,263 62,265 58,267 54,268 50,269 46,270 42,270 37,270 32,269 28,268 24,267 21,266 18,264 15,262 12,259 11,256 9,253 8,250 8,246 8,242 9,238 12,234 14,231 18,229 22,227 14,223 10,216 10,207 10,203 11,200 12,197 14,195 16,192 19,190 21,188 25,187 28,186 32,185 36,184 40,184 50,184 58,186 64,189 70,193 73,198 73,204 73,213 69,219 61,225 70,229 75,235 75,244 Z M 60,203 C 60,198 58,195 55,192 52,190 47,189 41,189 31,189 26,193 26,200 26,208 34,214 50,219 57,215 60,210 60,203 L 60,203 Z M 58,252 C 58,249 57,247 56,246 54,244 52,242 49,240 47,239 44,237 40,235 37,234 33,232 30,231 23,234 20,240 20,246 20,251 22,256 26,259 30,262 35,263 41,263 45,263 49,262 53,260 56,258 58,255 58,252 Z\"/>\r\n\t\t</g></svg>";
nx3.render.svg.SvgElements.time9 = "<svg><g><path style=\"fill:#000000;fill-opacity:1;fill-rule:evenodd;stroke:none\" \r\n\t\t\td=\"M 4,212 C 4,202 7,195 13,190 20,185 28,183 39,183 50,183 58,187 64,195 70,203 73,213 73,227 73,233 72,238 70,244 68,249 66,253 63,257 59,261 55,264 51,267 46,269 41,270 36,270 32,270 29,270 25,269 22,268 19,267 16,265 14,263 11,262 10,259 8,257 7,255 7,252 7,249 8,246 11,244 13,241 15,240 19,240 23,240 26,241 28,244 30,246 31,249 31,253 31,254 31,255 30,257 30,259 29,260 29,261 29,264 31,265 35,265 45,265 50,254 50,232 L 50,229 C 42,233 35,235 29,235 21,235 15,233 11,229 6,225 4,219 4,212 Z M 38,189 C 34,189 30,191 28,195 25,198 24,203 24,209 24,214 25,218 27,222 29,225 32,227 36,227 45,227 50,221 50,209 50,203 49,199 47,195 45,191 42,189 38,189 Z\"/>\r\n\t\t</g></svg>";
nx3.render.svg.SvgElements.timeCommon = "<svg><g><path style=\"fill:#000000;fill-opacity:1;fill-rule:evenodd;stroke:none\" \r\n\t\t\td=\"M 78,247 C 77,250 76,253 74,255 72,258 70,261 67,263 64,265 61,267 58,268 55,269 52,270 49,270 43,270 37,269 32,267 27,264 23,261 19,257 16,253 13,248 11,243 9,238 8,232 8,226 8,220 9,214 11,209 13,204 15,199 19,196 22,192 26,189 31,187 36,185 42,184 48,184 51,184 55,184 59,185 62,186 66,187 68,189 71,190 73,192 75,194 76,197 77,199 77,202 77,205 76,208 73,210 71,212 68,213 65,213 62,213 59,212 56,210 53,208 52,205 52,202 52,198 54,193 59,189 56,189 54,189 52,189 48,189 45,190 42,192 39,193 36,196 34,199 32,202 31,205 30,210 29,214 28,218 28,224 28,229 29,234 30,239 31,244 33,248 35,252 37,256 39,259 42,261 45,264 48,265 52,265 60,265 69,259 78,247 Z\"/>\r\n\t\t</g></svg>";
nx3.render.svg.SvgElements.timeAllabreve = "<svg><g><path style=\"fill:#000000;fill-opacity:1;fill-rule:evenodd;stroke:none\" \r\n\t\t\td=\"M 39,191 C 30,197 26,207 26,223 26,227 26,230 27,234 28,238 29,241 30,245 31,248 32,251 34,254 35,257 37,259 39,261 L 39,191 Z M 74,247 C 73,250 72,253 70,256 68,259 66,261 63,263 61,265 58,267 55,268 52,270 49,270 46,270 L 45,270 45,284 39,284 39,270 C 34,269 29,267 25,264 21,262 18,259 15,255 12,251 10,246 8,241 7,236 6,231 6,225 6,220 7,215 8,210 10,205 12,201 15,198 18,194 21,191 25,188 29,186 34,185 39,184 L 39,171 45,171 45,184 C 49,184 52,184 56,185 59,186 63,187 65,189 68,191 70,192 72,195 73,197 74,199 74,202 74,205 73,207 70,210 68,212 65,213 62,213 59,213 56,212 53,210 50,208 49,205 49,202 49,198 51,193 56,189 55,189 54,189 52,189 51,188 50,188 49,188 48,188 48,188 47,188 46,188 46,188 45,189 L 45,265 C 46,265 48,265 49,265 57,265 66,259 74,247 Z\"/>\r\n\t\t</g></svg>";
nx3.render.svg.SvgElements.tplTestCircle = "\r\n\t<svg ><circle style=\"fill:none;stroke:#ff00ff;stroke-width:16.41697121;stroke-miterlimit:4;stroke-dasharray:none\" id=\"path3384\" cx=\"92.372879\" cy=\"174.15253\" r=\"76.117874\" /> </svg>\r\n\t";
nx3.render.svg.SvgElements.tplCircle = "\r\n\t\t<svg ><g visibility=\"visible\" id=\"page1\"><desc>Slide</desc><g><desc>Drawing</desc><g><g style=\"stroke:none;fill:#FFFFFFF\"><path d=\"M 93,253 C 78,253 66,250 53,242 41,235 32,226 25,214 17,201 14,189 14,175 14,160 17,148 25,135 32,123 41,114 53,107 66,99 78,96 92,96 107,96 119,99 132,107 144,114 153,123 160,135 168,148 171,160 171,174 171,189 168,201 160,214 153,226 144,235 132,242 119,250 107,253 93,253 L 93,253 Z\"/></g><g style=\"stroke:#000000;fill:none\"><path style=\"fill:none\" d=\"M 93,253 C 78,253 66,250 53,242 41,235 32,226 25,214 17,201 14,189 14,175 14,160 17,148 25,135 32,123 41,114 53,107 66,99 78,96 92,96 107,96 119,99 132,107 144,114 153,123 160,135 168,148 171,160 171,174 171,189 168,201 160,214 153,226 144,235 132,242 119,250 107,253 93,253\"/></g><g/></g></g><g><desc>Drawing</desc><g><g style=\"stroke:none;fill:#000000\"><path d=\"M 71,256 C 64,254 57,252 50,248 44,244 38,239 33,234 28,229 23,223 19,217 15,210 13,203 11,196 9,189 8,182 8,175 8,167 9,160 11,153 13,146 15,139 19,132 23,126 28,120 33,115 38,110 44,105 50,101 57,97 64,95 71,93 78,91 85,90 92,90 100,90 107,91 114,93 121,95 128,97 135,101 141,105 147,110 152,115 157,120 162,126 166,132 170,139 172,146 174,153 176,160 177,167 177,174 177,182 176,189 174,196 172,203 170,210 166,217 162,223 157,229 152,234 147,239 141,244 135,248 128,252 121,254 114,256 107,258 100,259 93,259 85,259 78,258 71,256 Z M 130,239 C 136,236 141,232 145,227 150,223 154,218 157,212 160,206 163,200 165,194 166,188 167,181 167,174 167,168 166,161 165,155 163,149 160,143 157,137 154,131 150,126 145,122 141,117 136,113 130,110 124,107 118,104 112,102 106,101 99,100 92,100 86,100 79,101 73,102 67,104 61,107 55,110 49,113 44,117 40,122 35,126 31,131 28,137 25,143 22,149 20,155 19,161 18,168 18,175 18,181 19,188 20,194 22,200 25,206 28,212 31,218 35,223 40,227 44,232 49,236 55,239 61,242 67,245 73,247 79,248 86,249 93,249 99,249 106,248 112,247 118,245 124,242 130,239 Z\"/></g><g style=\"stroke:none;fill:none\"><rect x=\"8\" y=\"89\" width=\"170\" height=\"171\"/></g><g/></g></g><g><desc>Drawing</desc><g><g style=\"stroke:none;fill:none\"><rect x=\"0\" y=\"464\" width=\"854\" height=\"964\"/></g><g/></g></g></g></svg>";
nx3.render.svg.SvgElements.tplArrowDown = "<svg><g><path style=\"fill:#000000;fill-opacity:1;fill-rule:evenodd;stroke:none\" \r\n\t\t d=\"m 93.219081,334.7112 26.789959,-45.28185 -16.80224,0 0,-27.26555 -19.974144,0 0,27.26555 -16.80224,0 26.788665,45.28185 z\"   />\r\n\t</g></svg>";
nx3.render.svg.SvgElements.tplArrowUp = "<svg><g>< path style = \"fill:#000000;fill-opacity:1;fill-rule:evenodd;stroke:none\" \r\n\t\td=\"m 93.220375,22.163798 -26.789959,45.281851 16.802241,0 0,27.265551 19.974143,0 0,-27.265551 16.80224,0 -26.788665,-45.281851 z\" />\r\n\t</g></svg>";
nx3.render.svg.SvgElements.tpl1 = "<svg><g><path style=\"fill:#000000;fill-opacity:1;fill-rule:evenodd;stroke:none\" \r\n\t\t\t d=\"M 106,225 L 93,225 93,146 C 90,149 86,152 82,155 77,158 73,160 69,161 L 69,149 C 76,146 82,142 87,137 92,133 96,128 98,124 L 106,124 106,225 Z\"/>\t\t\r\n\t\t</g></svg>";
nx3.render.svg.SvgElements.tpl2 = "<svg><g><path style=\"fill:#000000;fill-opacity:1;fill-rule:evenodd;stroke:none\" \r\n\t\t\td=\"M 124,212 L 124,225 58,225 C 58,222 58,219 59,216 61,211 64,207 67,202 71,197 76,192 83,187 93,178 101,171 104,166 108,161 110,157 110,152 110,148 108,144 105,141 102,138 97,136 92,136 86,136 82,138 78,141 75,144 73,148 73,154 L 60,152 C 61,143 64,136 70,131 75,126 83,124 92,124 102,124 109,127 115,132 120,137 123,144 123,152 123,156 122,160 121,164 119,168 117,172 113,176 109,180 103,186 95,193 87,199 83,203 80,206 78,208 77,210 75,212 L 124,212 Z\"/>\r\n\t\t</g></svg>";
nx3.render.svg.SvgElements.tpl3 = "<svg><g><path style=\"fill:#000000;fill-opacity:1;fill-rule:evenodd;stroke:none\" \r\n\t\t\td=\"M 60,198 L 73,196 C 74,202 77,207 80,210 83,213 87,214 92,214 99,214 104,212 107,208 111,204 113,200 113,194 113,189 111,184 108,181 104,177 99,176 94,176 91,176 88,176 85,177 L 86,165 C 87,165 88,165 88,165 93,165 98,164 102,161 106,159 108,155 108,150 108,146 106,143 103,140 100,137 97,136 92,136 87,136 83,137 80,140 77,143 75,147 74,152 L 61,150 C 63,142 66,135 71,131 77,126 83,124 91,124 97,124 102,125 107,127 111,130 115,133 117,137 120,141 121,145 121,150 121,154 120,158 117,161 115,165 112,167 107,169 113,171 118,174 121,178 124,182 126,188 126,194 126,203 123,211 116,217 110,223 102,226 92,226 83,226 76,223 70,218 64,213 61,206 60,198 Z\"/>\r\n\t\t</g></svg>";
nx3.render.svg.SvgElements.tpl4 = "<svg><g><path style=\"fill:#000000;fill-opacity:1;fill-rule:evenodd;stroke:none\" \r\n\t\t\td=\"M 101,225 L 101,201 56,201 56,188 104,125 114,125 114,188 126,188 126,201 114,201 114,225 101,225 Z M 101,188 L 101,145 69,188 101,188 Z\"/>\r\n\t\t</g></svg>";
nx3.render.svg.SvgElements.tpl5 = "<svg><g><path style=\"fill:#000000;fill-opacity:1;fill-rule:evenodd;stroke:none\" \r\n\t\t\td=\"M 60,198 L 73,197 C 74,203 76,207 79,210 83,213 87,214 92,214 98,214 103,212 107,208 111,204 113,198 113,191 113,185 111,179 108,176 104,172 99,170 93,170 88,170 85,171 82,173 79,174 77,176 75,179 L 62,177 72,125 121,125 121,138 83,138 78,165 C 84,160 90,158 96,158 104,158 112,161 117,167 123,173 126,181 126,190 126,199 123,207 118,214 112,222 103,226 92,226 83,226 76,223 70,218 64,213 61,206 60,198 Z\"/>\r\n\t\t</g></svg>";
nx3.render.svg.SvgElements.tpl6x = "<svg><g><path style=\"fill:#000000;fill-opacity:1;fill-rule:evenodd;stroke:none\" \r\n\t\t\td=\"M 124,150 L 111,151 C 110,146 108,143 106,141 103,138 99,136 94,136 90,136 86,137 83,139 80,142 77,145 74,150 72,155 71,162 71,172 74,168 78,165 82,162 86,160 91,159 96,159 104,159 111,162 117,168 123,174 126,182 126,192 126,198 125,204 122,209 119,215 115,219 110,222 105,225 100,226 94,226 83,226 75,222 68,215 61,207 58,195 58,178 58,158 62,144 69,135 75,128 84,124 95,124 103,124 110,126 115,131 120,136 123,142 124,150 Z M 71,191 C 71,195 72,199 74,203 76,206 78,209 82,211 85,213 89,214 93,214 99,214 103,212 107,208 111,204 113,199 113,192 113,186 111,180 107,177 104,173 99,171 92,171 86,171 81,173 77,177 73,180 71,185 71,191 Z\"/>\r\n\t\t</g></svg>";
nx3.render.svg.SvgElements.tpl6 = "<svg><g><path style=\"fill:#000000;fill-opacity:1;fill-rule:evenodd;stroke:none\" \r\n\t\t\td=\"M 124,150 L 111,151 C 110,146 108,143 106,141 103,138 99,136 94,136 90,136 86,137 83,139 80,142 77,145 74,150 72,155 71,162 71,172 74,168 78,165 82,162 86,160 91,159 96,159 104,159 111,162 117,168 123,174 126,182 126,192 126,198 125,204 122,209 119,215 115,219 110,222 105,225 100,226 94,226 83,226 75,222 68,215 61,207 58,195 58,178 58,158 62,144 69,135 75,128 84,124 95,124 103,124 110,126 115,131 120,136 123,142 124,150 Z M 71,191 C 71,195 72,199 74,203 76,206 78,209 82,211 85,213 89,214 93,214 99,214 103,212 107,208 111,204 113,199 113,192 113,186 111,180 107,177 104,173 99,171 92,171 86,171 81,173 77,177 73,180 71,185 71,191 Z\"/>\r\n\t\t</g></svg>";
nx3.render.svg.SvgElements.tpl7 = "<svg><g><path style=\"fill:#000000;fill-opacity:1;fill-rule:evenodd;stroke:none\" \r\n\t\t\td=\"M 61,138 L 61,125 126,125 126,136 C 120,142 114,152 108,163 102,174 97,186 94,197 91,206 90,215 89,225 L 76,225 C 76,217 78,208 81,196 83,185 87,175 93,164 98,154 104,145 110,138 L 61,138 Z\"/>\r\n\t\t</g></svg>";
nx3.utils.ScriptScoreX.MIN_SCORE_WIDTH = 400;
nx3.utils.ScriptScoreX.SCORE_RIGHT_MARGIN = 40;
nx3.utils.ScriptScoreX.SCORE_DEFAULT_WIDTH = 780;
nx3.utils.ScriptScoreX.TOOLBAR_HEIGHT = 30;
nx3.utils.ScriptScoreX.ID_PARENT = "-parent";
nx3.utils.ScriptScoreX.ID_SVG = "-svg";
nx3.utils.ScriptScoreX.ID_CANVAS = "-canvas";
nx3.utils.ScriptScoreX.ID_TOOLBAR = "-toolbar";
nx3.utils.ScriptScoreX.ID_PLAY = "-play";
nx3.utils.ScriptScoreX.ID_STOP = "-stop";
nx3.utils.ScriptScoreX.ID_LABEL = "-label";
nx3.xml.BarXML.XBAR = "bar";
nx3.xml.BarXML.XBAR_TYPE = "type";
nx3.xml.BarXML.XBAR_TIME = "time";
nx3.xml.BarXML.XBAR_TIMEDISPLAY = "timedisplay";
nx3.xml.HeadXML.XHEAD = "headx";
nx3.xml.HeadXML.XHEAD_TYPE = "type";
nx3.xml.HeadXML.XHEAD_LEVEL = "level";
nx3.xml.HeadXML.XHEAD_SIGN = "sign";
nx3.xml.HeadXML.XHEAD_TIE = "tie";
nx3.xml.HeadXML.XHEAD_TIETO = "tieto";
nx3.xml.HeadXML.XHEAD_TIE_DIRECTION = "tiedirection";
nx3.xml.HeadXML.XHEAD_TIE_LEVEL = "tielevel";
nx3.xml.NoteXML.XNOTE = "note";
nx3.xml.NoteXML.XPAUSE = "pause";
nx3.xml.NoteXML.XPAUSE_LEVEL = "level";
nx3.xml.NoteXML.XLYRIC = "lyric";
nx3.xml.NoteXML.XLYRIC_TEXT = "text";
nx3.xml.NoteXML.XUNDEFINED = "undefined";
nx3.xml.NoteXML.XPITCH = "pitch";
nx3.xml.NoteXML.XPITCH_LEVEL = "level";
nx3.xml.NoteXML.XPITCH_MIDINOTE = "midinote";
nx3.xml.NoteXML.XTPL = "tpl";
nx3.xml.NoteXML.XTPL_LEVEL = "level";
nx3.xml.NoteXML.XTPL_SIGN = "sign";
nx3.xml.NoteXML.XNOTE_TYPE = "type";
nx3.xml.NoteXML.XNOTE_TYPE_NOTE = "note";
nx3.xml.NoteXML.XNOTE_TYPE_NOTATION_VARIANT = "variant";
nx3.xml.NoteXML.XNOTE_VALUE = "value";
nx3.xml.NoteXML.XNOTE_VAL = "val";
nx3.xml.NoteXML.XNOTE_DIRECTION = "direction";
nx3.xml.NoteXML.XNOTE_TYPE_PAUSE = "pause";
nx3.xml.NoteXML.XNOTE_TYPE_NOTE_ARTICULATIONS = "articulations";
nx3.xml.NoteXML.LIST_DELIMITER = ";";
nx3.xml.NoteXML.XNOTE_TYPE_NOTE_ATTRIBUTES = "attributes";
nx3.xml.NoteXML.XOFFSET = "offset";
nx3.xml.NoteXML.XLYRIC_CONTINUATION = "continuation";
nx3.xml.NoteXML.XLYRIC_FORMAT = "format";
nx3.xml.NoteXML.XTPL_PAUSE = "pause";
nx3.xml.PartXML.XPART = "part";
nx3.xml.PartXML.XPART_TYPE = "type";
nx3.xml.PartXML.XPART_LEVELOFFSET = "leveloffset";
nx3.xml.PartXML.XPART_CLEF = "clef";
nx3.xml.PartXML.XPART_CLEFDISPLAY = "clefdisplay";
nx3.xml.PartXML.XPART_KEY = "key";
nx3.xml.PartXML.XPART_KEYDISPLAY = "keydisplay";
nx3.xml.PartXML.XPART_PITCHCHAIN = "pitchchain";
nx3.xml.PartXML.XPART_TYPE_TPLCHAIN = "tplchain";
nx3.xml.PartXML.XPART_TYPE_TPLROW = "tplrow";
nx3.xml.PartXML.XPART_MODUS = "modus";
nx3.xml.PartXML.XPART_OCTAVE = "octave";
nx3.xml.ScoreXML.XSCORE = "score";
nx3.xml.ScoreXML.XCONFIG = "config";
nx3.xml.VoiceXML.XVOICE = "voice";
nx3.xml.VoiceXML.XVOICE_TYPE = "type";
nx3.xml.VoiceXML.XVOICE_BARPAUSE = "barpause";
nx3.xml.VoiceXML.XVOICE_DIRECTION = "direction";
tink.core._Callback.Cell.pool = [];
tink.core._Error.ErrorCode_Impl_.BadRequest = 400;
tink.core._Error.ErrorCode_Impl_.Unauthorized = 401;
tink.core._Error.ErrorCode_Impl_.PaymentRequired = 402;
tink.core._Error.ErrorCode_Impl_.Forbidden = 403;
tink.core._Error.ErrorCode_Impl_.NotFound = 404;
tink.core._Error.ErrorCode_Impl_.MethodNotAllowed = 405;
tink.core._Error.ErrorCode_Impl_.Gone = 410;
tink.core._Error.ErrorCode_Impl_.NotAcceptable = 406;
tink.core._Error.ErrorCode_Impl_.Timeout = 408;
tink.core._Error.ErrorCode_Impl_.Conflict = 409;
tink.core._Error.ErrorCode_Impl_.OutOfRange = 416;
tink.core._Error.ErrorCode_Impl_.ExpectationFailed = 417;
tink.core._Error.ErrorCode_Impl_.I_am_a_Teapot = 418;
tink.core._Error.ErrorCode_Impl_.AuthenticationTimeout = 419;
tink.core._Error.ErrorCode_Impl_.UnprocessableEntity = 422;
tink.core._Error.ErrorCode_Impl_.InternalError = 500;
tink.core._Error.ErrorCode_Impl_.NotImplemented = 501;
tink.core._Error.ErrorCode_Impl_.ServiceUnavailable = 503;
tink.core._Error.ErrorCode_Impl_.InsufficientStorage = 507;
tink.core._Error.ErrorCode_Impl_.BandwidthLimitExceeded = 509;
dev.MainDevExe.main();
})(typeof window != "undefined" ? window : exports);
