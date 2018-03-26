StringsSet.prototype = {

    mutted          : 'x',
    opened          : 'o',

    regex : {
        mutted      : new RegExp('x','i'),
        opened      : new RegExp('o','i'),
    
        played      : new RegExp('^[0-9]$'),
    
        filled      : new RegExp('[0-9]-\\(|[0-9]-\\)'),
        filledStart : new RegExp('([0-9])-\\('),
        filledClose : new RegExp('([0-9])-\\)')
    },
    
    fillStart       : '-(',
    fillClose       : '-)',
    
    END:null
};

function
StringsSet ( strings )
{
    this.strings = 'x;x;x;x;x;x;'; //"3-(;5;5;4;3;3-);"
    this.len     = 6;
    
    this.constructor = 
    function ( strings )
    {
        this.strings = strings || this.strings;
        this.len     = (this.strings.match(/;/g) || []).length;        
    }

    this.validate =
    function ( strings )
    {
        // TODO
    }

    this.setStrings =
    function ( strings )
    {
        try
        {
            this.validate( strings );
        }
        catch (e) { throw e }
        
        this.constructor( strings );
    }

    this.getStrings =
    function ()
    {
        return this.strings;
    }
    
    this.limits =
    function ()
    {
        var all = this.strings.split(';');
        var limits = {min:Infinity,max:-Infinity};
        for ( var i = 0 ,l = all.length ; i<l ; i++ )
        {
            var n = parseInt(all[i]);
            if ( isNaN(n) ) continue;
            limits.min = Math.min(limits.min,n);
            limits.max = Math.max(limits.max,n);
        }
        return limits;
    }
    
    /**
     * Compress the chord and retrive a preconised start
     * 0 means no compression possible.
     */
    this.compress =
    function ( steps )
    {
        var limits = this.limits();
        if ( limits.min - steps < 0 ) return false;
        
        var old = this.strings.split(';');
        var set = [].concat(old);
        
        for ( var i=0 ,l=old.length ; i<l ; i++ )
        {
            var n = parseInt(old[i]);
            if ( isNaN(n) ) continue;
            set[i] = n - steps;
            if( set[i] < 0 ) set[i] = this.opened;
            else
            {
                if ( this.regex.filledStart.test(old[i]) ) set[i] += this.fillStart;
                if ( this.regex.filledClose.test(old[i]) ) set[i] += this.fillClose;
            }
        }
        
        this.strings = set.join(';');        
        
        return true;
    }

    this.setString = 
    function ( string ,fret ,toString )
    {
        var old_strings = this.strings.split(';'),
            new_strings = (new Array(old_strings.length)).fill(''),
            fill        = null,

            fillOn = typeof toString !== 'undefined';

        try
        {
            if ( string < 0 || string > this.len - 1)
                throw new Error("StringsSet.setString() : Parameter string out of range.");

            if ( fillOn && ( toString < 0 || toString > this.len - 1))
                throw new Error("StringsSet.setString() : Parameter toString out of range.");

            if ( fillOn )
            {
                for ( var i = string, l = toString ; i <= l ; i++ ) new_strings[i] = fret;
            }
            else new_strings[string] = fret;
        }
        catch (e)
        {
            console.error( e.message );
            return;
        }

        // On transforme en numéros
        for ( var i in old_strings )
        {
            var n = parseInt(old_strings[i]);
            if ( !isNaN(n) ) old_strings[i] = n;
        }

        for ( var i in new_strings )
        {
            if ( i == string ) continue;
            if ( fillOn && i == toString ) continue;
        
            if ( new_strings[i] === '' ) new_strings[i] = old_strings[i];
            else
            {
                if ( fillOn && new_strings[i] == fret ) // En cas de fill, on repositionne les frets qui sont au delà du fill
                {
                    if ( !isNaN(old_strings[i]) && old_strings[i] > fret ) new_strings[i] = old_strings[i];
                }
                    
            }
        }

        if ( fillOn )
        {
            new_strings[string]   += this.fillStart;
            new_strings[toString] += this.fillClose;
        }
        else
        if( this.isFilled() )
        {
            fill = this.getFilled();

            //console.log('is filled',' ',fill.toSource(),' ',new_strings)

            for ( var i=0, l=new_strings.length - 1 ; i<l ; i++  )
            {
                if ( new_strings[i] == fill.fret && i < fill.close )
                {
                    for ( var j=new_strings.length - 1, s=fill.start ; j>s ; j--  )
                    {
                        if ( new_strings[j] != fill.fret ) continue;
                        if ( new_strings[i] != new_strings[j] ) break;
                        new_strings[i] += this.fillStart;
                        new_strings[j] += this.fillClose;
                        break;
                    }
                    break;
                }
            }
        }

        //console.log( new_strings,' ',old_strings )        
        
        this.strings = new_strings.join(';');   
    }
    
    this.at =
    function ( string )
    {
        try
        {
            if ( string < 0 || string > this.len - 1)
                throw new Error("StringsSet.setString() : Parameter string out of range.");
        }
        catch (e)
        {
            console.error( e.message );
            return false;
        }
        return (this.strings.split(';'))[string];
    }
    
    this.isMutted =
    function ( string )
    {
        try
        {
            if ( string < 0 || string > this.len - 1)
                throw new Error("StringsSet.setString() : Parameter string out of range.");
        }
        catch (e)
        {
            console.error( e.message );
            return false;
        }
        return (this.strings.split(';'))[string] === this.mutted;
    }

    this.isOpened =
    function ( string )
    {
        try
        {
            if ( string < 0 || string > this.len - 1)
                throw new Error("StringsSet.setString() : Parameter string out of range.");
        }
        catch (e)
        {
            console.error( e.message );
            return false;
        }
        return (this.strings.split(';'))[string] === this.opened;
    }

    this.isPlayed =
    function ( string )
    {
        try
        {
            if ( string < 0 || string > this.len - 1)
                throw new Error("StringsSet.setString() : Parameter string out of range.");
        }
        catch (e)
        {
            console.error( e.message );
            return false;
        }
        return this.regex.played.test((this.strings.split(';'))[string]);
    }

    this.isFilledStart =
    function ( string )
    {
        try
        {
            if ( string < 0 || string > this.len - 1)
                throw new Error("StringsSet.setString() : Parameter string out of range.");
        }
        catch (e)
        {
            console.error( e.message );
            return false;
        }
        return this.regex.filledStart.test((this.strings.split(';'))[string]);
    }

    this.isFilledClose =
    function ( string )
    {
        try
        {
            if ( string < 0 || string > this.len - 1)
                throw new Error("StringsSet.setString() : Parameter string out of range.");
        }
        catch (e)
        {
            console.error( e.message );
            return false;
        }
        return this.regex.filledClose.test((this.strings.split(';'))[string]);
    }
    
    this.isFilled = 
    function  ()
    {
        return this.regex.filled.test(this.strings);
    }
    
    this.getFilled = 
    function  ()
    {
        var m       = null,
           strings  = this.strings.split(';'),
           fill     = {fret:0,start:0,close:0};

        try
        {
            for ( var i in strings )
            {
                if ( (m = strings[i].match(this.regex.filledStart)) !== null )
                {
                    fill.fret = m[1];
                    fill.start  = i;
                }
                if ( (m = strings[i].match(this.regex.filledClose)) !== null )
                {
                    if ( fill.fret !== m[1] ) throw new Error("StringsSet.getFilled() : Frets start and stop don't match.")
                    fill.close  = i;
                    break;
                }
            }
        }
        catch (e)
        {
            console.error(e.message);
            return null;
        }
        
        return fill;
    }
    
    this.constructor( strings );
}