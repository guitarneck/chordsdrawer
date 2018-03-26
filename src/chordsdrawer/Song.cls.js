function Song ( name ,strings ,frets )
{
    name    = name      || "Song Title Empty";
    strings = strings   || 6;
    frets   = frets     || 5;

    this.name;
    this.frets;
    this.strings;

    this.constructor =
    function ( name ,strings ,frets )
    {
        this.name       = name;
        this.frets      = frets;
        this.strings    = strings;
    }

    this.getName =
    function ()
    {
        return this.name;
    }

    this.getStringsAmount =
    function ()
    {
        return this.strings;
    }

    this.getFretsAmount =
    function ()
    {
        return this.frets;
    }

    this.changeFrets =
    function ( newFrets )
    {
        var done = false;
    
        var chords      = ChordsDrawer.chords(),
            toCompress  = [],
            saved       = [];
            
        //var sign  = Math.sign(newFrets - this.frets);
        var delta = Math.abs(this.frets - newFrets);
            
        for ( var i=0 ,l=chords.length ; i<l ; i++ )
        {
            var chord  = chords[i];
            saved.push( {'start':chord.start ,'strings':chord.strings.getStrings()} );
            var limits = chord.strings.limits();
            if ( limits.max < newFrets ) continue;
            toCompress.push(i);
        }
        
        function changeThem (self ,needCompress)
        {
            var done  = true;
            
            if ( needCompress )
            {
                for ( var i=0 ,l=toCompress.length ; i<l ; i++ )
                {
                   if ( !(done = Chord.compress( chords[toCompress[i]] ,delta )) ) break;
                }
            }

            if ( !done )
            {
                ChordsDrawer.splash("Some chords can't be compressed. Aborted.");
                for ( var i=0 ,l=chords.length ; i<l ; i++ )
                {
                    chords[i].start = saved[i].start;
                    chords[i].strings.setStrings(saved[i].strings);
                }
            }
            else
            {
                self.frets = newFrets;
                ChordsDrawer.setupForSong( self );
            }
            
            return done;
        }
        
        var message = toCompress.length == 0
                    ?
                    "Frets will now have a length of "+newFrets+"."
                    :
                    "Some chords need to be changed. Trying to update to new frets length.";
        
        if( confirm(message) ) done = changeThem(this ,toCompress.length > 0);
        
        return done;
    }

    this.visitLoading =
    function ( obj )
    {
        if ( obj instanceof CDFile )
        {
            this.name      = obj.name;
            this.frets     = obj.lengths.frets;
            this.strings   = obj.lengths.strings;

            ChordsDrawer.eraseChords();
            
            for ( var i=0, l=obj.chords.length ; i<l ; i++ )
            {
                var chord = obj.chords[i];
                ChordsDrawer.addChord( Chord.create( chord.name, chord.strings ,chord.start ) );
            }
        }
    }

    this.visitSaving =
    function ( obj )
    {
        if ( obj instanceof CDFile )
        {
            obj.name            = this.name;
            obj.lengths.frets   = this.frets;
            obj.lengths.strings = this.strings;
            
            obj.chords.length = 0;
            
            var chords = ChordsDrawer.chords();
            for ( var i=0, l=chords.length ; i<l ; i++ )
            {
                var chord = chords[i];
                obj.chords.push( new CDChord( chord.title ,chord.start ,chord.strings ) );
            }
        }
    }

    this.constructor( name ,strings ,frets );
}