if ( typeof window.DOMHelper === 'undefined' ) throw('ChordsDrawer.cls.js : DOMHelper needed.')

ChordsDrawer.prototype = {
    version         : '1.0.0',

    file            : new CDFile(),
    song            : new Song(),

    editor          : new Editor(),
    composer        : new Composer(),    
    
    extension       : '.cdf',
    
    END:null
};

function
ChordsDrawer ()
{

    this.setupApplication =
    function ( editorId ,composerId )
    {
        DOMHelper.append( DOMHelper.byId(editorId) ,this.editor.create() );
        DOMHelper.append( DOMHelper.byId(composerId) ,this.composer.create() );

        this.addChord( Chord.create() );
        this.setupForSong( this.song );
        
        this.editor.layout.ui.refresh = function (chordId)
        {
            var image = DOMHelper.byId(chordId);
            ui_display_chord_name( image.title );
            ui_display_chord_start( image.start );
        };
    }
    
    this.setupForSong =
    function ( song )
    {
        this.song = song;
    
        this.editor.setup( song );
        this.composer.setup( song );        

        ui_display_song_name( this.song.name );
        ui_display_song_frets( this.song.frets );
        ui_display_song_strings( this.song.strings );
    }
    
    this.updateForChord =
    function ( who ,chordId )
    {
        var chord = this.getChord( chordId );
        if ( chord == null ) chord = this.getFirstChord();
    
        if( who instanceof Composer )
        {
            this.editor.updateChord( chord );
        }

        if( who instanceof Editor )
        {
            this.composer.updateChord( this.editor ,chord );
        }
    }

    this.updateSongName =
    function ( name )
    {
        this.song.name = name;
        this.composer.writeName( this.composer.layout ,name );
        document.title = name;
    }

    this.updateEditorTitle =
    function ( title )
    {
        this.editor.writeTitle( this.editor.layout ,title );
        var chord = this.getChord(this.editor.chordId);
        chord.title = title;
        this.composer.updateChord( this.editor ,chord );
    }

    this.updateEditorFrets =
    function ( start )
    {
        this.editor.writeInfoFrets( this.editor.layout ,start );
        var chord = this.getChord(this.editor.chordId);
        chord.start = start;
        this.composer.updateChord( this.editor ,chord );
    }

    this.newChord =
    function ()
    {
        var chord = Chord.create();
        this.editor.updateDimension( this.editor.layout );
        DOMHelper.append( this.composer.layout.images ,chord );
        this.editor.updateChord( chord );
    }
    
    this.addChord =
    function ( image )
    {
        DOMHelper.append( this.composer.layout.images ,image );
    }

    this.delChord =
    function ()
    {
        var cur = DOMHelper.byId(this.editor.chordId);
        var prev = cur.previousSibling;
        DOMHelper.remove( cur );
        if ( prev != null )
            this.editor.updateChord( prev );
        else
            this.newChord();
    }

    this.dupChord =
    function ()
    {
        var image = DOMHelper.byId(this.editor.chordId);
        if ( image != null )
        {
            var copy = Chord.create();
            copy.title     = image.title;
            copy.start     = image.start;
            copy.strings   = image.strings;
            this.addChord( copy );
            this.editor.updateChord( copy );
        }
    }

    this.razChord =
    function ()
    {
        var image = Chord.create();
        var chord = DOMHelper.byId(this.editor.chordId);
        chord.title     = image.title;
        chord.start     = image.start;
        chord.strings   = image.strings;
        this.editor.updateChord( chord );
    }
    
    this.getChord =
    function ( id )
    {
        return DOMHelper.byId( id );
    }

    this.chords =
    function ()
    {
        return ChordsDrawer.composer.layout.images.getElementsByTagName('IMG');
    }

    this.getFirstChord =
    function ()
    {
        return this.composer.layout.images.firstChild;
    }
    
    this.eraseChords =
    function ()
    {
        DOMHelper.removeAllChildren( this.composer.layout.images );
    }
    
    this.updateFrets =
    function ( newFrets )
    {
        var done = this.song.changeFrets( parseInt(newFrets) );
        return done;
    }
    
    this.splash =
    function ( message )
    {
        var _ = DOMHelper;

        var overlay =
            _.append(
                _.element('DIV',{'class':'cd-overlay'}),
                _.append(
                    _.element('DIV',{'class':'cd-overlay-inner'}),
                    _.append(
                        _.element('P',{'class':'cd-overlay-message'}),
                        _.text( message )
                    )
                )
            );
        
        function AnimationListener (e)
        {
            if ( e.animationName == 'cd-splash' && e.target == overlay )
                if( e.type.toLowerCase().indexOf('animationend') >= 0 ) _.remove( overlay )
        }

        var pfxs = ['webkit', 'moz', 'MS', 'o', ''],
            events = ['AnimationStart','AnimationEnd'];

        for ( var i in pfxs )
        {
            var pfx = pfxs[i];
            for ( var j in events )
            {
                var event = events[j];
                event = pfx + (pfx == '' ? event.toLowerCase() : event);
                overlay.addEventListener(event, AnimationListener, false);
            }
        }

        _.append( document.body ,overlay );
        
    }
    
    this.loadFile =
    function ( file )
    {
        this.file.load(file ,{
            onload:function( filename ,cdfile ,err  )
            {
                if ( err == null )
                {
                    cdfile.acceptLoading(ChordsDrawer.song);
                    ChordsDrawer.setupForSong(ChordsDrawer.song);                    
                }
                else
                    ChordsDrawer.splash(err)
            },
            onabort:function( filename ,err  )
            {
                console.log("aborted");
            }
        });
    }

    this.saveFile =
    function ()
    {
        if ( this.song.getName().trim() === "" )
        {
            ChordsDrawer.splash("Please, give a name to this song beafore saving it.")
            return;
        }
        
        this.file.acceptSaving(this.song);
        this.file.save(function(cdfile){
            console.log("the user did something with the file");
        });
    }

    this.exportLilyPond =
    function ()
    {
        if ( this.song.getName().trim() === "" )
        {
            ChordsDrawer.splash("Please, give a name to this song beafore saving it.")
            return;
        }

        this.file.acceptSaving(this.song);
        this.file.exportLilyPond(function(cdfile){
            console.log("the user did something with the file");
        });
    }

    this.onprint =
    function ( list )
    {
        this.onprintList = list;
    }
    
    this.print =
    function ()
    {
        for (var type in this.onprintList)
        {
            for (var i in this.onprintList[type])
            {
                var item = DOMHelper.byId(this.onprintList[type][i]);
                item.style.display = type === 'hide' ? 'none' : 'contents';
            }
        }

        window.print();

        for (var type in this.onprintList)
        {
            for (var i in this.onprintList[type])
            {
                var item = DOMHelper.byId(this.onprintList[type][i]);
                item.style.display = null;
            }
        }
    }
}

var ChordsDrawer = new ChordsDrawer();
window.ChordsDrawer = ChordsDrawer;