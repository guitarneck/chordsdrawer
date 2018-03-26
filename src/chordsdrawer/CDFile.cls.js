function
CDChord ( name ,start ,strings )
{
    this.name       = name      || '';
    this.start      = start     || 1;
    this.strings    = strings   || '';
}

CDFile.prototype.ERROR =
{
    NOT_FOUND_ERR       : 0x01,
    SECURITY_ERR        : 0x02,
    NOT_READABLE_ERR    : 0x04,
    ENCODING_ERR        : 0x08,
    ABORT_ERR           : 0x10,
    UNKNOWN_ERR         : 0x20
}

function
CDFile ()
{
    this.chunk      = 'ChDw';
    this.version    = '1.0.0';
    
    this.name       = '';
    this.lengths    = { frets:0 ,strings:0 };    
    this.chords     = [];
        
    this.serialize =
    function ()
    {
        return JSON.stringify({
            chunk   : this.chunk,
            version : this.version,
            name    : this.name,
            lengths : this.lengths,
            chords  : this.chords
        });
    }
    
    this.unserialize =
    function ( json )
    {
        var error = '';
    
        try
        {
            var that = JSON.parse(json);
        
            if ( that.chunk !== this.chunk ) throw new Error("File error : Bad chunk.");
        
            if ( that.version == this.version )
            {
                this.name       = that.name;
                this.lengths    = that.lengths;
                this.chords     = [].concat(that.chords);
            }
            else
            {
                throw new Error("File error : unknown version.");
            }
        }
        catch (e)
        {
            error = e.message;
        }
        
        return error!=''?error:null;
    }
    
    this.acceptLoading =
    function ( obj )
    {
        if ( obj instanceof Song ) obj.visitLoading(this);
    }

    this.acceptSaving =
    function ( obj )
    {
        if ( obj instanceof Song ) obj.visitSaving(this);
    }
    
    this.load =
    function ( file ,callback )
    {
        if ( ! file instanceof File ) throw new Error("CDFile.load() : file parameter must be a File object.")

        var m = ['onabort','onerror','onload','onloadstart','onloadend','onprogress'];
        for( var i in m ) callback[m[i]] = (m[i] in callback) ? callback[m[i]] : false;
    
        if ( ! callback.onload ) throw new Error("CDFile.load() : callback.onload(filename,data) required.");
    
        var $fileReader = new FileReader();

        var self = this;

        var CDFile_listener =
        {
            onload  : function (e)
            {
                var res = '', err = null;
        
                if ( e.target.error != null ) return;
                if ( $fileReader.readyState !== FileReader.EMPTY ) res = e.target.result; //LOADING, DONE
            
                try
                {
                    err = self.unserialize(res);
                }
                catch(e) { err = e.message }
            
                callback.onload(file.name ,self ,err );
            },
            onerror : function (e)
            {
                if ( callback.onerror )
                {
                    var error = e.target.error, code;

                    if (error != null)
                    {
                        switch (error.code)
                        {
                            case error.ENCODING_ERR:
                                code = CDFile.ENCODING_ERR;
                                break;

                            case error.NOT_FOUND_ERR:
                                code = CDFile.NOT_FOUND_ERR;
                                break;

                            case error.NOT_READABLE_ERR:
                                code = CDFile.NOT_READABLE_ERR;
                                break;

                            case error.SECURITY_ERR:
                                code = CDFile.SECURITY_ERR;
                                break;

                            default:
                                code = CDFile.UNKNOWN_ERR;
                        }
                    }            
                    callback.onerror(file.name ,code)
                }
            },
            onabort : function (e) { if ( callback.onabort ) callback.onabort(file.name ,CDFile.ABORT_ERR) },
            onloadstart : function (e) { if ( callback.onloadstart ) callback.onloadstart(e) },
            onloadend : function (e) { if ( callback.onloadend ) callback.onloadend(e) },
            onprogress : function (data)
            {
                if ( ! data.lengthComputable ) return;
                if ( callback.onprogress ) callback.onprogress(data) //data.total, data.loaded
            }
        };

        $fileReader.onload      = CDFile_listener.onload;
        $fileReader.onerror     = CDFile_listener.onerror;
        $fileReader.onabort     = CDFile_listener.onabort;
        $fileReader.onloadstart = CDFile_listener.onloadstart;
        $fileReader.onloadend   = CDFile_listener.onloadend;
        $fileReader.onprogress  = CDFile_listener.onprogress;
        
        $fileReader.readAsText( file ,'UTF-8' );
    }
    
    /**
     * TODO: Save a lilypond file
     */
    this.save =
    function ( callback )
    {
        var $json = this.serialize();
        var $blob = new Blob([$json], {type:'text/plain'});
        
        var $link = document.createElement('A');
        $link.download = this.name + ChordsDrawer.extension;
        $link.innerHTML = "Save as...";
        if ( window.webkitURL )
        {
            $link.href = window.webkitURL.createObjectURL( $blob );
        }
        else
        {
            $link.href = window.URL.createObjectURL( $blob );
            $link.onclick = function (e){ document.body.removeChild(e.target) };
            $link.style.display = 'none';
            document.body.appendChild( $link );
        }
        
        var self = this;
        
        var CDFile_listener =
        {
            onfocus:function(e)
            {
                if ( $link.href != null )
                {
                    if ( window.webkitURL )
                        window.webkitURL.revokeObjectURL( $link.href );
                    else
                        window.URL.revokeObjectURL( $link.href );
                    
                    $link.href = null;
                    
                    if(callback) callback(self);
                }
                window.onfocus = function(){};
            }
        };

        window.onfocus = CDFile_listener.onfocus;

        $link.click();    
    }
    
    this.exportLilyPond =
    function ( callback )
    {
        ChordsDrawer.splash("Not yet implemented. Coming soon.");
/*    
        var version = '\version "2.18.2"';
        
        var predefined = ['\storePredefinedDiagram #default-fret-table','\chordmode { bes:m7 }','#guitar-tuning','#"%0"'].join('\n');
        
        var chordShape = '\addChordShape #\'fis:5- #guitar-tuning #"%0"';
        var store = ['\storePredefinedDiagram #default-fret-table','\chordmode { fis:5- }','#guitar-tuning','#(offset-fret 0 (chord-shape \'fis:5- guitar-tuning))'].join('\n');
        
        var diagram = '\fret-diagram-terse #"%0"';

dSix = { <a\4 b\1 d\3 fis\2> }
\storePredefinedDiagram #default-fret-table \dSix
                        #cuatroTuning
                        #"o;o;o;o;"
*/
    }
}