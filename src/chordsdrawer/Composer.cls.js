Composer.prototype = {
    version         : '1.0.0',
    
    layout          : {
        container   : null,
        name        : null,
        images      : null
    },
    
    fonts           : { //size,family,baseline,align,color,weight
        name        : ChordsDrawerUtils.create.font( 20, 'Arial' ,'top' ,'center' ,'#000000' ,'bold' )
    },
        
    END:null
};

function
Composer ()
{
    this.create =
    function ()
    {
        var layout = this.layout;
    
        layout.container = DOMHelper.element('DIV');
        layout.name      = DOMHelper.element('DIV');
        layout.images    = DOMHelper.element('DIV');
        
        DOMHelper.attachStyleList(
            layout.name,
            {
                'font-size'     : this.fonts.name.size + 'px',
                'font-family'   : this.fonts.name.family,
                'text-align'    : this.fonts.name.align,
                'vertical-align': this.fonts.name.baseline,
                'color'         : this.fonts.name.color,
                'font-weight'   : this.fonts.name.weight,
                'padding-bottom': '10px'
            }
        );

        DOMHelper.attachStyleList(
            layout.images,
            {
                'text-align'    : 'left',                
                'margin'        : 'auto'              
            }
        );
        
        DOMHelper.append(
            layout.container,
                layout.name,
                layout.images
        );
        
        return layout.container;
    }

    this.setup =
    function ( song )
    {
        this.writeName( this.layout ,song.getName() );
        this.drawChords( this.layout ,song );
    }

    /** Name */
    this.writeName =
    function ( layout ,name )
    {
        DOMHelper.replace( layout.name , layout.name.firstChild, DOMHelper.text(name) );
    }
    
    this.readName =
    function ()
    {
        return this.layout.name.firstChild.textContent;
    }
    
    /** Chords */
    this.updateChord =
    function ( editor ,chord )
    {
        var image = editor.retrieveImage( editor.layout );
        image.id = chord.id;

        image.onload = _notifyLoad;                    
    }
    
    this.chordsCount =
    function ()
    {
        return layout.images.getElementsByTagName('IMG').length; 
    }

    this.getChordAt =
    function ( index )
    {
        return layout.images.getElementsByTagName('IMG')[index]; 
    }

    this.drawImage =
    function ( layout, image )
    {
        var chord = ChordsDrawer.getChord( image.id );

        image.title = chord.title;    
        image.start = chord.start;
        image.strings = chord.strings;
    
        DOMHelper.replace( layout.images, chord ,image );

        image.onclick = _notifySelect;
    }

    this.drawChords =
    function ( layout ,song )
    {
        /*
        DOMHelper.removeAllChildren( layout.images );

        DOMHelper.attachAttributesList(
            layout.images,
            {
                'lengthFrets'   : 'center',                
                'length'        : 'auto'              
            }
        );
        */
    
        var ed;
        ed = new Editor();
        ed.create();
        ed.setup( song );
    
        var chords = this.layout.images.getElementsByTagName('IMG');
        for ( var i = 0, l = chords.length ; i<l ; i++ )
        {
            var chord = chords[i];
            ed.updateChord( chord );
            var image = ed.retrieveImage( ed.layout );

            image.id = chord.id;
            
            image.onload = _notifyLoad;
        }
    }

    var _eventComposer = new (function( self ){
        this.self = self;

        this.fireSelect =
        function (e)
        {
            var self = this.self;
            var chordId = e.target.id;
            ChordsDrawer.updateForChord( self ,chordId );
            
        }

        this.fireLoad =
        function (e)
        {
            var self    = this.self;
            self.drawImage.call( self ,self.layout ,e.target );
        }
    })(this);
    
    function _notifySelect (e) { _eventComposer.fireSelect(e) }
    function _notifyLoad (e) { _eventComposer.fireLoad(e) }

}