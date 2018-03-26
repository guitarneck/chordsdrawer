function Chord ( name ,strings ,start )
{
    
    this.state      = {
        mutted      : StringsSet.prototype.mutted,
        opened      : StringsSet.prototype.opened
    }
    
    this.constructor =
    function ()
    {
    }
    
    this.create =
    function ( name ,strings ,start )
    {
        name    = name      || "empty";
        strings = strings   || null;
        start   = start     || 1;
        
        if ( strings != null && typeof strings != 'String' ) strings = strings.strings;

        var rnd = Math.round(Math.random() * 1000000);
        
        var image       = new Image();
        image.id        = 'Chord' + rnd;
        image.title     = name;
        image.start     = start;
        image.strings   = new StringsSet( strings );

        return image;
    }
    
    this.compress =
    function ( image ,steps )
    {
        var done = image.strings.compress(steps);
            done && (image.start += steps);
        return done;
    }
        
    this.constructor();
}

var Chord = new Chord();
window.Chord = Chord;