var ChordsDrawerUtils={};function StringsSet(t){this.strings="x;x;x;x;x;x;",this.len=6,this.constructor=function(t){this.strings=t||this.strings,this.len=(this.strings.match(/;/g)||[]).length},this.validate=function(t){},this.setStrings=function(t){try{this.validate(t)}catch(t){throw t}this.constructor(t)},this.getStrings=function(){return this.strings},this.limits=function(){for(var t=this.strings.split(";"),e={min:1/0,max:-1/0},r=0,i=t.length;r<i;r++){var s=parseInt(t[r]);isNaN(s)||(e.min=Math.min(e.min,s),e.max=Math.max(e.max,s))}return e},this.compress=function(t){if(this.limits().min-t<0)return!1;for(var e=this.strings.split(";"),r=[].concat(e),i=0,s=e.length;i<s;i++){var n=parseInt(e[i]);isNaN(n)||(r[i]=n-t,r[i]<0?r[i]=this.opened:(this.regex.filledStart.test(e[i])&&(r[i]+=this.fillStart),this.regex.filledClose.test(e[i])&&(r[i]+=this.fillClose)))}return this.strings=r.join(";"),!0},this.setString=function(t,e,r){var i=this.strings.split(";"),s=new Array(i.length).fill(""),n=null,o=void 0!==r;try{if(t<0||t>this.len-1)throw new Error("StringsSet.setString() : Parameter string out of range.");if(o&&(r<0||r>this.len-1))throw new Error("StringsSet.setString() : Parameter toString out of range.");if(o)for(var a=t,h=r;a<=h;a++)s[a]=e;else s[t]=e}catch(t){return void console.error(t.message)}for(var a in i){var l=parseInt(i[a]);isNaN(l)||(i[a]=l)}for(var a in s)a!=t&&(o&&a==r||(""===s[a]?s[a]=i[a]:o&&s[a]==e&&!isNaN(i[a])&&i[a]>e&&(s[a]=i[a])));if(o)s[t]+=this.fillStart,s[r]+=this.fillClose;else if(this.isFilled()){n=this.getFilled();for(a=0,h=s.length-1;a<h;a++)if(s[a]==n.fret&&a<n.close){for(var d=s.length-1,f=n.start;d>f;d--)if(s[d]==n.fret){if(s[a]!=s[d])break;s[a]+=this.fillStart,s[d]+=this.fillClose;break}break}}this.strings=s.join(";")},this.at=function(t){try{if(t<0||t>this.len-1)throw new Error("StringsSet.setString() : Parameter string out of range.")}catch(t){return console.error(t.message),!1}return this.strings.split(";")[t]},this.isMutted=function(t){try{if(t<0||t>this.len-1)throw new Error("StringsSet.setString() : Parameter string out of range.")}catch(t){return console.error(t.message),!1}return this.strings.split(";")[t]===this.mutted},this.isOpened=function(t){try{if(t<0||t>this.len-1)throw new Error("StringsSet.setString() : Parameter string out of range.")}catch(t){return console.error(t.message),!1}return this.strings.split(";")[t]===this.opened},this.isPlayed=function(t){try{if(t<0||t>this.len-1)throw new Error("StringsSet.setString() : Parameter string out of range.")}catch(t){return console.error(t.message),!1}return this.regex.played.test(this.strings.split(";")[t])},this.isFilledStart=function(t){try{if(t<0||t>this.len-1)throw new Error("StringsSet.setString() : Parameter string out of range.")}catch(t){return console.error(t.message),!1}return this.regex.filledStart.test(this.strings.split(";")[t])},this.isFilledClose=function(t){try{if(t<0||t>this.len-1)throw new Error("StringsSet.setString() : Parameter string out of range.")}catch(t){return console.error(t.message),!1}return this.regex.filledClose.test(this.strings.split(";")[t])},this.isFilled=function(){return this.regex.filled.test(this.strings)},this.getFilled=function(){var t=null,e=this.strings.split(";"),r={fret:0,start:0,close:0};try{for(var i in e)if(null!==(t=e[i].match(this.regex.filledStart))&&(r.fret=t[1],r.start=i),null!==(t=e[i].match(this.regex.filledClose))){if(r.fret!==t[1])throw new Error("StringsSet.getFilled() : Frets start and stop don't match.");r.close=i;break}}catch(t){return console.error(t.message),null}return r},this.constructor(t)}function Chord(t,e,r){this.state={mutted:StringsSet.prototype.mutted,opened:StringsSet.prototype.opened},this.constructor=function(){},this.create=function(t,e,r){t=t||"empty",r=r||1,null!=(e=e||null)&&"String"!=typeof e&&(e=e.strings);var i=Math.round(1e6*Math.random()),s=new Image;return s.id="Chord"+i,s.title=t,s.start=r,s.strings=new StringsSet(e),s},this.compress=function(t,e){var r=t.strings.compress(e);return r&&(t.start+=e),r},this.constructor()}ChordsDrawerUtils.create={},ChordsDrawerUtils.create.position=function(t,e){return{x:t=t||0,y:e=e||0}},ChordsDrawerUtils.create.size=function(t,e){return{w:t=t||0,h:e=e||0}},ChordsDrawerUtils.create.box=function(t,e,r,i){return{position:ChordsDrawerUtils.create.position(t,e),size:ChordsDrawerUtils.create.size(r,i)}},ChordsDrawerUtils.create.line=function(t,e,r,i){return{beg:ChordsDrawerUtils.create.position(t,e),end:ChordsDrawerUtils.create.position(r,i)}},ChordsDrawerUtils.create.font=function(t,e,r,i,s,n){return{size:t=t||10,family:e=e||"Courrier",baseline:r=r||"top",align:i=i||"center",color:s=s||"#000000",weight:n=n||""}},void 0===String.trim&&(String.prototype.trim=function(){return this.replace(/^\s+|\s+$/gm,"")}),StringsSet.prototype={mutted:"x",opened:"o",regex:{mutted:new RegExp("x","i"),opened:new RegExp("o","i"),played:new RegExp("^[0-9]$"),filled:new RegExp("[0-9]-\\(|[0-9]-\\)"),filledStart:new RegExp("([0-9])-\\("),filledClose:new RegExp("([0-9])-\\)")},fillStart:"-(",fillClose:"-)",END:null};var Chord=new Chord;function Song(t,e,r){t=t||"Song Title Empty",e=e||6,r=r||5,this.name,this.frets,this.strings,this.constructor=function(t,e,r){this.name=t,this.frets=r,this.strings=e},this.getName=function(){return this.name},this.getStringsAmount=function(){return this.strings},this.getFretsAmount=function(){return this.frets},this.changeFrets=function(t){var e=!1,r=ChordsDrawer.chords(),i=[],s=[],n=Math.abs(this.frets-t);alert(n);for(var o=0,a=r.length;o<a;o++){var h=r[o];s.push({start:h.start,strings:h.strings.getStrings()}),h.strings.limits().max<t||i.push(o)}var l=0==i.length?"Frets will now have a length of "+t+".":"Some chords need to be changed. Trying to update to new frets length.";return confirm(l)&&(e=function changeThem(e,o){var a=!0;if(o)for(var h=0,l=i.length;h<l&&(a=Chord.compress(r[i[h]],n));h++);if(a)e.frets=t,ChordsDrawer.setupForSong(e);else for(ChordsDrawer.splash("Some chords can't be compressed. Aborted."),h=0,l=r.length;h<l;h++)r[h].start=s[h].start,r[h].strings.setStrings(s[h].strings);return a}(this,i.length>0)),e},this.visitLoading=function(t){if(t instanceof CDFile){this.name=t.name,this.frets=t.lengths.frets,this.strings=t.lengths.strings,ChordsDrawer.eraseChords();for(var e=0,r=t.chords.length;e<r;e++){var i=t.chords[e];ChordsDrawer.addChord(Chord.create(i.name,i.strings,i.start))}}},this.visitSaving=function(t){if(t instanceof CDFile){t.name=this.name,t.lengths.frets=this.frets,t.lengths.strings=this.strings,t.chords.length=0;for(var e=ChordsDrawer.chords(),r=0,i=e.length;r<i;r++){var s=e[r];t.chords.push(new CDChord(s.title,s.start,s.strings))}}},this.constructor(t,e,r)}function Editor(){this.layout={ui:null,ctx:null,width:0,height:0,scale:1},this.chordId=null;var t=5,e=6,r=0,i=[[]];this.create=function(t){return(t=t||this.layout).ui=DOMHelper.element("CANVAS",{width:100,height:100}),t.ctx=t.ui.getContext("2d"),t.ui.onmouseup=_notifyMouseUp,t.ui.onmousedown=_notifyMouseDown,t.ui},this.setup=function(r){t=r.getFretsAmount(),e=r.getStringsAmount(),this.updateDimension(this.layout),this.updateChord(ChordsDrawer.getFirstChord())},this.updateChord=function(t){null!=t&&void 0!==t&&(this.chordId=t.id),t=ChordsDrawer.getChord(this.chordId),this.clearRect(this.layout,ChordsDrawerUtils.create.box(0,0,this.layout.width,this.layout.height)),this.writeTitle(this.layout,t.title),this.writeInfoFrets(this.layout,t.start),this.refreshGrid(this.layout),this.layout.ui.refresh&&this.layout.ui.refresh(this.chordId)},this.updateDimension=function(i){var s=this.marginLeft(i);i.width=e*(6*this.size.w)-.5*s+s,i.height=t*(6*this.size.h)+this.marginTop(),r=1.9*this.size.w,DOMHelper.attachAttributesList(i.ui,{width:i.width,height:i.height}),this.boxes.title=ChordsDrawerUtils.create.box(0,0,i.width-1,this.fonts.title.size),this.boxes.strings=ChordsDrawerUtils.create.box(0,this.fonts.title.size,i.width-1,this.fonts.strings.size-1),this.boxes.frets=ChordsDrawerUtils.create.box(0,this.marginTop(),this.marginLeft(i)-r-1,i.height-this.marginTop()-1)},this.marginLeft=function(t){return this.textWidth(t,"000 ",this.fonts.frets.size+"px",this.fonts.frets.family)+2},this.marginTop=function(){return this.fonts.title.size+this.fonts.strings.size+2},this.titleBottom=function(){return this.fonts.title.size},this.textWidth=function(t,e,r,i){var s,n=t.ctx;return n.save(),n.font=r+" "+i,s=n.measureText(e).width,n.restore(),s},this.windowToCanvas=function(t,e){var r=e.clientX?e.clientX:e.pageX,i=e.clientY?e.clientY:e.pageY,s=t.ui.getBoundingClientRect();return{x:r-s.left*(t.ui.width/s.width),y:i-s.top*(t.ui.height/s.height)}},this.writeText=function(t,e,r,i,s){var n=t.ctx;n.save(),n.font=s.weight+" "+s.size+"px "+s.family,n.textBaseline=s.baseline,n.textAlign=s.align,n.fillStyle=s.color,n.fillText(e,r,i),n.restore()},this.clearRect=function(t,e){var r=t.ctx;r.save(),r.fillStyle="#ffffff",r.fillRect(e.position.x,e.position.y,e.size.w,e.size.h),r.restore()},this.writeTitle=function(t,e){this.clearRect(t,this.boxes.title);var r=this.marginLeft(t)-3;this.writeText(t,e,.5*(t.width+r),0,this.fonts.title)},this.writeInfoFret=function(t,e,r){this.writeText(t," "+("0"+r).substr(-2).replace(/^[0]/," "),0,this.marginTop()+this.fonts.frets.size+this.size.h+e*(6*this.size.h),this.fonts.frets)},this.writeInfoFrets=function(e,r){var i=r+t,s=0;for(this.clearRect(e,this.boxes.frets);i>r;)this.writeInfoFret(e,s++,r++)},this.writeInfoString=function(t,e,r){this.writeText(t,r,this.marginLeft(t)+e*(6*this.size.w),this.fonts.title.size,this.fonts.strings)},this.writeInfoStrings=function(t,e){this.clearRect(t,this.boxes.strings);for(var r=0,i=e.len;r<i;r++)this.writeInfoString(t,r,e.isMutted(r)?"X":e.isOpened(r)?"O":" ")},this.computeGrid=function(r){if(i.length!=e||i[0].length!=t){var s=this.marginLeft(r),n=this.marginTop();i=[];for(var o=0;o<e;o++)i.push([]);for(var a=0;a<t;a++){for(o=0;o<e;o++){var h=s+6*o*this.size.w,l=n,d=n+6*this.size.h;i[o][a]={x0:Math.abs(h),y0:Math.abs(l),x1:Math.abs(h),y1:Math.abs(d),i:o,j:a}}n+=6*this.size.h}}},this.drawGrid=function(t){this.computeGrid(t);var e=t.ctx;this.clearRect(t,ChordsDrawerUtils.create.box(i[0][0].x0-r,i[0][0].y0,this.layout.width-1,this.layout.height-this.marginTop()-1)),e.save(),e.beginPath(),e.strokeStyle="#000000",e.lineWidth=1;for(var s=i.length,n=i[0].length,o=0;o<s;o++){var a=i[o][0].x0,h=i[o][0].y0,l=i[o][n-1].x1;d=i[o][n-1].y1,e.moveTo(a,h),e.lineTo(l,d)}a=i[0][0].x0,h=i[0][0].y0,l=i[s-1][0].x0;var d=i[s-1][0].y0;e.moveTo(a,h),e.lineTo(l,d);for(var f=0;f<n;f++){a=i[0][f].x1,h=i[0][f].y1,l=i[s-1][f].x1,d=i[s-1][f].y1;e.moveTo(a,h),e.lineTo(l,d)}e.stroke(),e.closePath(),e.restore()},this.drawFret=function(t,e,s){var n=t.ctx,o=i[e][s].x0,a=i[e][s].y0,h=i[e][s].x1,l=i[e][s].y1;n.save(),n.beginPath(),n.fillStyle="#000000",n.arc(.5*(o+h),.5*(a+l),r,0,2*Math.PI),n.fill(),n.closePath(),n.restore()},this.drawFrets=function(e,r){for(var i=0,s=r.length;i<s;i++)r[i]>0&&r[i]<=t&&this.drawFret(e,i,r[i]-1)},this.fillFrets=function(t,e,s,n){var o=i[s][e].x0,a=i[s][e].y0,h=i[n][e].x1,l=i[n][e].y1,d=t.ctx;d.save(),d.beginPath(),d.lineWidth=r+r,d.lineCap="round",d.strokeStyle="#000000",d.moveTo(o,.5*(a+l)),d.lineTo(h,.5*(a+l)),d.stroke(),d.closePath(),d.restore()},this.refreshGrid=function(t){this.drawGrid(t);var e=ChordsDrawer.getChord(this.chordId),r={fret:-1};if(e.strings.isFilled()){r=e.strings.getFilled();this.fillFrets(t,r.fret,r.start,r.close)}this.writeInfoStrings(t,e.strings);for(var i=0;i<e.strings.len;i++)if(e.strings.isPlayed(i)){var s=e.strings.at(i);s!=r.fret&&this.drawFret(t,i,s)}ChordsDrawer.updateForChord(this,this.chordId)},this.retrieveImage=function(t){var e=t.ui.toDataURL(),r=new Image;return r.src=e,r.id=this.chordId,r};var s=new function(t){this.self=t,this.move={from:0,to:0},this.getLocation=function(t){var e=this.self,i=e.layout,s=e.windowToCanvas.call(e,i,t);return s.y<=e.titleBottom.call(e)||s.x<=e.marginLeft.call(e,i)-r?null:{x:Math.abs(s.x),y:Math.abs(s.y)}},this.fireMouseDown=function(t){if(0==t.button&&null!=this.self.chordId){var e=this.self,s=e.layout,n=this.getLocation(t);if(null!==n&&(this.move.from=this.move.to=n,n.y<=e.marginTop.call(e))){var o=r+r;for(var a in i){var h=i[a][0].x0-o,l=i[a][0].x1+o;if(h<=n.x&&n.x<=l||l<=n.x&&n.x<=h){var d=ChordsDrawer.getChord(e.chordId);if(d.strings.isPlayed(a))d.strings.setString(a,Chord.state.mutted),e.refreshGrid.call(e,s);else{var f=d.strings.isMutted(a)?Chord.state.opened:Chord.state.mutted;d.strings.setString(a,f),e.refreshGrid.call(e,s)}return}}}}},this.fireMouseUp=function(t){if(0==t.button&&null!=this.self.chordId){var e=this.self,s=e.layout,n=this.getLocation(t);if(null!==n&&!(n.y<=e.marginTop.call(e))){var o=r+r,a=this.move.from.y-o,h=this.move.from.y+o;if(a<=n.y&&n.y<=h||h<=n.y&&n.y<=a){var l=ChordsDrawer.getChord(e.chordId);if(Math.abs(n.y-this.move.from.y)<o&&!(Math.abs(n.x-this.move.from.x)<o)){var d={fret:-1,start:-1,close:-1};for(var f in i[0]){a=i[0][f].y0,h=i[0][f].y1;if(a<=this.move.from.y&&this.move.from.y<=h||h<=this.move.from.y&&this.move.from.y<=a){for(var c in d.fret=f,i){var u=i[c][f].x0-o,g=i[c][f].x1+o;if(u<=this.move.from.x&&this.move.from.x<=g||g<=this.move.from.x&&this.move.from.x<=u){d.start=c;break}}for(var c in i){u=i[c][f].x0-o,g=i[c][f].x1+o;if(u<=n.x&&n.x<=g||g<=n.x&&n.x<=u){d.close=c;break}}break}}if(d.fret<0||d.start<0||d.close<0)return;if(d.start>d.close){var m=d.start;d.start=d.close,d.close=m}l.strings.setString(d.start,d.fret,d.close),e.refreshGrid.call(e,s)}else for(var c in i)for(var f in i[c]){u=i[c][f].x0-o,a=i[c][f].y0,g=i[c][f].x1+o,h=i[c][f].y1;if((u<=n.x&&n.x<=g||g<=n.x&&n.x<=u)&&(a<=n.y&&n.y<=h||h<=n.y&&n.y<=a))return l.strings.setString(c,f),void e.refreshGrid.call(e,s)}}}}}}(this);function _notifyMouseDown(t){s.fireMouseDown(t)}function _notifyMouseUp(t){s.fireMouseUp(t)}}function Composer(){this.create=function(){var t=this.layout;return t.container=DOMHelper.element("DIV"),t.name=DOMHelper.element("DIV"),t.images=DOMHelper.element("DIV"),DOMHelper.attachStyleList(t.name,{"font-size":this.fonts.name.size+"px","font-family":this.fonts.name.family,"text-align":this.fonts.name.align,"vertical-align":this.fonts.name.baseline,color:this.fonts.name.color,"font-weight":this.fonts.name.weight,"padding-bottom":"10px"}),DOMHelper.attachStyleList(t.images,{"text-align":"left",margin:"auto"}),DOMHelper.append(t.container,t.name,t.images),t.container},this.setup=function(t){this.writeName(this.layout,t.getName()),this.drawChords(this.layout,t)},this.writeName=function(t,e){DOMHelper.replace(t.name,t.name.firstChild,DOMHelper.text(e))},this.readName=function(){return this.layout.name.firstChild.textContent},this.updateChord=function(t,e){var r=t.retrieveImage(t.layout);r.id=e.id,r.onload=_notifyLoad},this.chordsCount=function(){return layout.images.getElementsByTagName("IMG").length},this.getChordAt=function(t){return layout.images.getElementsByTagName("IMG")[t]},this.drawImage=function(t,e){var r=ChordsDrawer.getChord(e.id);e.title=r.title,e.start=r.start,e.strings=r.strings,DOMHelper.replace(t.images,r,e),e.onclick=_notifySelect},this.drawChords=function(t,e){var r;(r=new Editor).create(),r.setup(e);for(var i=this.layout.images.getElementsByTagName("IMG"),s=0,n=i.length;s<n;s++){var o=i[s];r.updateChord(o);var a=r.retrieveImage(r.layout);a.id=o.id,a.onload=_notifyLoad}};var t=new function(t){this.self=t,this.fireSelect=function(t){var e=this.self,r=t.target.id;ChordsDrawer.updateForChord(e,r)},this.fireLoad=function(t){var e=this.self;e.drawImage.call(e,e.layout,t.target)}}(this);function _notifySelect(e){t.fireSelect(e)}function _notifyLoad(e){t.fireLoad(e)}}function CDChord(t,e,r){this.name=t||"",this.start=e||1,this.strings=r||""}function CDFile(){this.chunk="ChDw",this.version="1.0.0",this.name="",this.lengths={frets:0,strings:0},this.chords=[],this.serialize=function(){return JSON.stringify({chunk:this.chunk,version:this.version,name:this.name,lengths:this.lengths,chords:this.chords})},this.unserialize=function(t){var e="";try{var r=JSON.parse(t);if(r.chunk!==this.chunk)throw new Error("File error : Bad chunk.");if(r.version!=this.version)throw new Error("File error : unknown version.");this.name=r.name,this.lengths=r.lengths,this.chords=[].concat(r.chords)}catch(t){e=t.message}return""!=e?e:null},this.acceptLoading=function(t){t instanceof Song&&t.visitLoading(this)},this.acceptSaving=function(t){t instanceof Song&&t.visitSaving(this)},this.load=function(t,e){if(!t instanceof File)throw new Error("CDFile.load() : file parameter must be a File object.");var r=["onabort","onerror","onload","onloadstart","onloadend","onprogress"];for(var i in r)e[r[i]]=r[i]in e&&e[r[i]];if(!e.onload)throw new Error("CDFile.load() : callback.onload(filename,data) required.");var s=new FileReader,n=this,o=function(r){var i="",o=null;if(null==r.target.error){s.readyState!==FileReader.EMPTY&&(i=r.target.result);try{o=n.unserialize(i)}catch(r){o=r.message}e.onload(t.name,n,o)}},a=function(r){if(e.onerror){var i,s=r.target.error;if(null!=s)switch(s.code){case s.ENCODING_ERR:i=CDFile.ENCODING_ERR;break;case s.NOT_FOUND_ERR:i=CDFile.NOT_FOUND_ERR;break;case s.NOT_READABLE_ERR:i=CDFile.NOT_READABLE_ERR;break;case s.SECURITY_ERR:i=CDFile.SECURITY_ERR;break;default:i=CDFile.UNKNOWN_ERR}e.onerror(t.name,i)}},h=function(r){e.onabort&&e.onabort(t.name,CDFile.ABORT_ERR)},l=function(t){e.onloadstart&&e.onloadstart(t)},d=function(t){e.onloadend&&e.onloadend(t)},f=function(t){t.lengthComputable&&e.onprogress&&e.onprogress(t)};s.onload=o,s.onerror=a,s.onabort=h,s.onloadstart=l,s.onloadend=d,s.onprogress=f,s.readAsText(t,"UTF-8")},this.save=function(t){var e=this.serialize(),r=new Blob([e],{type:"text/plain"}),i=document.createElement("A");i.download=this.name+ChordsDrawer.extension,i.innerHTML="Save as...",window.webkitURL?i.href=window.webkitURL.createObjectURL(r):(i.href=window.URL.createObjectURL(r),i.onclick=function(t){document.body.removeChild(t.target)},i.style.display="none",document.body.appendChild(i));var s=this,n=function(e){null!=i.href&&(window.webkitURL?window.webkitURL.revokeObjectURL(i.href):window.URL.revokeObjectURL(i.href),i.href=null,t&&t(s)),window.onfocus=function(){}};window.onfocus=n,i.click()},this.exportLilyPond=function(t){ChordsDrawer.splash("Not yet implemented. Coming soon.")}}if(window.Chord=Chord,Editor.prototype={version:"1.0.0",fonts:{title:ChordsDrawerUtils.create.font(15,"chords font","top","center","#000000","normal"),strings:ChordsDrawerUtils.create.font(10,"Courrier","top","center","#777777"),frets:ChordsDrawerUtils.create.font(10,"Courrier","center","left","#222222")},boxes:{title:ChordsDrawerUtils.create.box(0,0,0,0),strings:ChordsDrawerUtils.create.box(0,0,0,0),frets:ChordsDrawerUtils.create.box(0,0,0,0)},size:ChordsDrawerUtils.create.size(3,4),END:null},Composer.prototype={version:"1.0.0",layout:{container:null,name:null,images:null},fonts:{name:ChordsDrawerUtils.create.font(20,"Arial","top","center","#000000","bold")},END:null},CDFile.prototype.ERROR={NOT_FOUND_ERR:1,SECURITY_ERR:2,NOT_READABLE_ERR:4,ENCODING_ERR:8,ABORT_ERR:16,UNKNOWN_ERR:32},void 0===window.DOMHelper)throw"ChordsDrawer.cls.js : DOMHelper needed.";function ChordsDrawer(){this.setupApplication=function(t,e){DOMHelper.append(DOMHelper.byId(t),this.editor.create()),DOMHelper.append(DOMHelper.byId(e),this.composer.create()),this.addChord(Chord.create()),this.setupForSong(this.song),this.editor.layout.ui.refresh=function(t){var e=DOMHelper.byId(t);ui_display_chord_name(e.title),ui_display_chord_start(e.start)}},this.setupForSong=function(t){this.song=t,this.editor.setup(t),this.composer.setup(t),ui_display_song_name(this.song.name),ui_display_song_frets(this.song.frets),ui_display_song_strings(this.song.strings)},this.updateForChord=function(t,e){var r=this.getChord(e);null==r&&(r=this.getFirstChord()),t instanceof Composer&&this.editor.updateChord(r),t instanceof Editor&&this.composer.updateChord(this.editor,r)},this.updateSongName=function(t){this.song.name=t,this.composer.writeName(this.composer.layout,t),document.title=t},this.updateEditorTitle=function(t){this.editor.writeTitle(this.editor.layout,t);var e=this.getChord(this.editor.chordId);e.title=t,this.composer.updateChord(this.editor,e)},this.updateEditorFrets=function(t){this.editor.writeInfoFrets(this.editor.layout,t);var e=this.getChord(this.editor.chordId);e.start=t,this.composer.updateChord(this.editor,e)},this.newChord=function(){var t=Chord.create();this.editor.updateDimension(this.editor.layout),DOMHelper.append(this.composer.layout.images,t),this.editor.updateChord(t)},this.addChord=function(t){DOMHelper.append(this.composer.layout.images,t)},this.delChord=function(){var t=DOMHelper.byId(this.editor.chordId),e=t.previousSibling;DOMHelper.remove(t),null!=e?this.editor.updateChord(e):this.newChord()},this.dupChord=function(){var t=DOMHelper.byId(this.editor.chordId);if(null!=t){var e=Chord.create();e.title=t.title,e.start=t.start,e.strings=t.strings,this.addChord(e),this.editor.updateChord(e)}},this.razChord=function(){var t=Chord.create(),e=DOMHelper.byId(this.editor.chordId);e.title=t.title,e.start=t.start,e.strings=t.strings,this.editor.updateChord(e)},this.getChord=function(t){return DOMHelper.byId(t)},this.chords=function(){return ChordsDrawer.composer.layout.images.getElementsByTagName("IMG")},this.getFirstChord=function(){return this.composer.layout.images.firstChild},this.eraseChords=function(){DOMHelper.removeAllChildren(this.composer.layout.images)},this.updateFrets=function(t){return this.song.changeFrets(parseInt(t))},this.splash=function(t){var e=DOMHelper,r=e.append(e.element("DIV",{class:"cd-overlay"}),e.append(e.element("DIV",{class:"cd-overlay-inner"}),e.append(e.element("P",{class:"cd-overlay-message"}),e.text(t))));function AnimationListener(t){"cd-splash"==t.animationName&&t.target==r&&t.type.toLowerCase().indexOf("animationend")>=0&&e.remove(r)}var i=["webkit","moz","MS","o",""],s=["AnimationStart","AnimationEnd"];for(var n in i){var o=i[n];for(var a in s){var h=s[a];h=o+(""==o?h.toLowerCase():h),r.addEventListener(h,AnimationListener,!1)}}e.append(document.body,r)},this.loadFile=function(t){this.file.load(t,{onload:function(t,e,r){null==r?(e.acceptLoading(ChordsDrawer.song),ChordsDrawer.setupForSong(ChordsDrawer.song)):ChordsDrawer.splash(r)},onabort:function(t,e){console.log("aborted")}})},this.saveFile=function(){""!==this.song.getName().trim()?(this.file.acceptSaving(this.song),this.file.save(function(t){console.log("the user did something with the file")})):ChordsDrawer.splash("Please, give a name to this song beafore saving it.")},this.exportLilyPond=function(){""!==this.song.getName().trim()?(this.file.acceptSaving(this.song),this.file.exportLilyPond(function(t){console.log("the user did something with the file")})):ChordsDrawer.splash("Please, give a name to this song beafore saving it.")},this.onprint=function(t){this.onprintList=t},this.print=function(){for(var t in this.onprintList)for(var e in this.onprintList[t]){DOMHelper.byId(this.onprintList[t][e]).style.display="hide"===t?"none":"contents"}for(var t in window.print(),this.onprintList)for(var e in this.onprintList[t]){DOMHelper.byId(this.onprintList[t][e]).style.display=null}}}ChordsDrawer.prototype={version:"1.0.0",file:new CDFile,song:new Song,editor:new Editor,composer:new Composer,extension:".cdf",END:null};var ChordsDrawer=new ChordsDrawer;window.ChordsDrawer=ChordsDrawer;