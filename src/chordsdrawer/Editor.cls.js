Editor.prototype = {
    version         : '1.0.0',
        
    fonts           : { //size,family,baseline,align,color,weight
        title       : ChordsDrawerUtils.create.font( 15, 'chords font' ,'top' ,'center' ,'#000000' ,'normal' ),
        strings     : ChordsDrawerUtils.create.font( 10, 'Courrier' ,'top' ,'center' ,'#777777' ),
        frets       : ChordsDrawerUtils.create.font( 10, 'Courrier' ,'center' ,'left' ,'#222222' )
    },
    
    boxes           : {
        title       : ChordsDrawerUtils.create.box(0,0,0,0),
        strings     : ChordsDrawerUtils.create.box(0,0,0,0),
        frets       : ChordsDrawerUtils.create.box(0,0,0,0)
    },
    
    size            : ChordsDrawerUtils.create.size( 3 ,4 ),
        
    END:null
};

function
Editor ()
{
    this.layout = {
        ui              : null,
        ctx             : null,    
        width           : 0,
        height          : 0,
        scale           : 1
    };

    this.chordId        = null;

    var $FRETSAMOUNT    = 5;
    var $STRINGSAMOUNT  = 6;
    var $SCALEFACTOR    = 6;
    var $RADIUS         = 0;
    
    var vlines = [[]];

    this.create =
    function ( layout )
    {
        layout      = layout || this.layout;
        layout.ui   = DOMHelper.element( 'CANVAS' ,{width:100,height:100} );
        layout.ctx  = layout.ui.getContext('2d');

        layout.ui.onmouseup     = _notifyMouseUp;
        layout.ui.onmousedown   = _notifyMouseDown;
                
        return layout.ui;
    }

    this.setup =
    function ( song )
    {
        $FRETSAMOUNT    = song.getFretsAmount();
        $STRINGSAMOUNT  = song.getStringsAmount();

        this.updateDimension( this.layout );
        
        this.updateChord( ChordsDrawer.getFirstChord() );
    }

    this.updateChord =
    function ( chord )
    {
        if ( chord != null && typeof chord != 'undefined' ) this.chordId = chord.id;

        chord = ChordsDrawer.getChord(this.chordId);

        this.clearRect(this.layout ,ChordsDrawerUtils.create.box(0,0,this.layout.width,this.layout.height) );
    
        //this.drawGrid( this.layout );
        
        //console.log( chord.title + ' ' + chord.start + ' ' + chord.strings.strings );

        this.writeTitle( this.layout ,chord.title );
        this.writeInfoFrets( this.layout ,chord.start );
        //this.writeInfoStrings( this.layout ,chord.strings );
        this.refreshGrid( this.layout );
        
        this.layout.ui.refresh && this.layout.ui.refresh(this.chordId);
    }

    this.updateDimension =
    function ( layout )
    {
        var ml = this.marginLeft( layout );
        layout.width  = $STRINGSAMOUNT * ($SCALEFACTOR * this.size.w)
                    - ml * .5
                    + ml;
        layout.height = ($FRETSAMOUNT * ($SCALEFACTOR * this.size.h)) + this.marginTop();

        $RADIUS = this.size.w * 1.9;

        DOMHelper.attachAttributesList( layout.ui ,{
            'width' : layout.width,
            'height': layout.height
        });
        
        this.boxes.title    = ChordsDrawerUtils.create.box(0 ,0 ,layout.width - 1 ,this.fonts.title.size );
        this.boxes.strings  = ChordsDrawerUtils.create.box(0 ,this.fonts.title.size ,layout.width - 1 ,this.fonts.strings.size - 1);
        this.boxes.frets    = ChordsDrawerUtils.create.box( 0 ,this.marginTop() ,this.marginLeft( layout ) - $RADIUS - 1 ,layout.height - this.marginTop() - 1 );
    }

    this.marginLeft =
    function ( layout )
    {
        return this.textWidth(layout ,'000 ' ,this.fonts.frets.size + "px" ,this.fonts.frets.family) + 2;
    }

    this.marginTop =
    function ()
    {
        return this.fonts.title.size + this.fonts.strings.size + 2;
    }

    this.titleBottom =
    function ()
    {
        return this.fonts.title.size;    
    }

    this.textWidth =
    function ( layout ,text ,fontSize ,fontFamily )
    {
        var ctx = layout.ctx;
        var width;
        ctx.save();
        ctx.font = fontSize + ' ' + fontFamily;
        width = ctx.measureText(text).width;
        ctx.restore();
        return width;
    }

    this.windowToCanvas =
    function ( layout ,e )
    {
        var x = e.clientX ? e.clientX : e.pageX,
            y = e.clientY ? e.clientY : e.pageY;
        var bbox = layout.ui.getBoundingClientRect();
        return { x: x - bbox.left * (layout.ui.width  / bbox.width),
                 y: y - bbox.top  * (layout.ui.height / bbox.height)
        };
    }
    
    this.writeText =
    function ( layout ,text ,x ,y ,font )
    {
        var ctx = layout.ctx;
        ctx.save();
        ctx.font            = font.weight +' '+ font.size + 'px ' + font.family;
        ctx.textBaseline    = font.baseline;
        ctx.textAlign       = font.align;
        ctx.fillStyle       = font.color;
        ctx.fillText(text ,x ,y);
        ctx.restore();
    } 
    
    this.clearRect =
    function ( layout, box )
    {
        var ctx = layout.ctx;
        ctx.save();
        /*
        ctx.globalAlpha = 0;
        ctx.clearRect( box.position.x ,box.position.y ,box.size.w ,box.size.h );
        */
        ctx.fillStyle = '#ffffff';
        ctx.fillRect( box.position.x ,box.position.y ,box.size.w ,box.size.h );
        ctx.restore();
    }

    /** Title */
    this.writeTitle =
    function ( layout ,title )
    {
        this.clearRect( layout ,this.boxes.title );

        var ml = this.marginLeft( layout ) - $SCALEFACTOR * .5;

        this.writeText( layout,
                        title,
                        (layout.width + ml) * .5,
                        0,
                        this.fonts.title );

    }

    /** Info frets */
    this.writeInfoFret =
    function ( layout ,fret ,info )
    {
        this.writeText( layout,
                        ' '+(('0'+info).substr(-2).replace(/^[0]/,' ')),
                        0,
                        this.marginTop() + this.fonts.frets.size + this.size.h + (fret * ($SCALEFACTOR * this.size.h)),
                        this.fonts.frets );
    }
    
    this.writeInfoFrets =
    function ( layout ,from )
    {
        var stop = from + $FRETSAMOUNT,
            fret = 0;

        this.clearRect( layout ,this.boxes.frets );

        while ( stop > from )
        {
            this.writeInfoFret( layout ,fret++ ,from++ );
        }

    }

    /** Info strings */
    this.writeInfoString =
    function ( layout ,string ,info )
    {
        this.writeText( layout,
                        info,
                        this.marginLeft( layout ) + (string * ($SCALEFACTOR * this.size.w)),
                        this.fonts.title.size,
                        this.fonts.strings );
    }

    this.writeInfoStrings =
    function ( layout ,strings )
    {    
        this.clearRect( layout ,this.boxes.strings );
        for ( var i=0 ,l=strings.len ; i<l ; i++ )
        {
            this.writeInfoString(layout ,i ,strings.isMutted(i) ? 'X' : strings.isOpened(i) ? 'O' : ' ');
        }
    }

    /** grid */
    this.computeGrid =
    function ( layout )
    {
        if ( vlines.length == $STRINGSAMOUNT && vlines[0].length == $FRETSAMOUNT ) return;

        var x = this.marginLeft( layout ),
            y = this.marginTop();

        vlines = [];
        for( var i=0 ; i<$STRINGSAMOUNT ; i++ ) vlines.push([])

        for( var j=0 ; j<$FRETSAMOUNT ; j++ )
        {
            for( var i=0 ; i<$STRINGSAMOUNT ; i++ )
            {
                var x0 = x + (i * $SCALEFACTOR * this.size.w),
                    y0 = y,
                    y1 = y + ($SCALEFACTOR * this.size.h);
            
                vlines[i][j] = {'x0':Math.abs(x0) ,'y0':Math.abs(y0),
                                'x1':Math.abs(x0) ,'y1':Math.abs(y1),
                                'i': i, 'j': j};
            }
            y += $SCALEFACTOR * this.size.h;
        }

        //console.log('rebuild')
    }
    
    this.drawGrid =
    function ( layout )
    {
        this.computeGrid( layout );
            
        var ctx = layout.ctx;       

        this.clearRect( layout,
                        ChordsDrawerUtils.create.box( vlines[0][0].x0 - $RADIUS,
                                                     vlines[0][0].y0,
                                                     this.layout.width - 1,
                                                     this.layout.height - this.marginTop() - 1));
        ctx.save();
        ctx.beginPath();        
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 1;

        var l  = vlines.length;
        var ll = vlines[0].length;
        var x0,y0,x1,y1;
        for ( var i=0 ; i<l ; i++ )
        {
            var x0 = vlines[i][0].x0, y0 = vlines[i][0].y0,
                x1 = vlines[i][ll - 1].x1; y1 = vlines[i][ll - 1].y1;
                
                ctx.moveTo(x0 ,y0);
                ctx.lineTo(x1 ,y1);
        }

        var x0 = vlines[0][0].x0, y0 = vlines[0][0].y0,
            x1 = vlines[l - 1][0].x0, y1 = vlines[l - 1][0].y0;    
        ctx.moveTo(x0 ,y0);
        ctx.lineTo(x1 ,y1);

        for ( var j=0 ; j<ll ; j++ )
        {                
            var x0 = vlines[0][j].x1, y0 = vlines[0][j].y1,
                x1 = vlines[l - 1][j].x1, y1 = vlines[l - 1][j].y1;
            ctx.moveTo(x0 ,y0);
            ctx.lineTo(x1 ,y1);
        }

        ctx.stroke();

        ctx.closePath();
        ctx.restore();
    }

    this.drawFret =
    function ( layout ,string ,fret )
    {
        var ctx = layout.ctx,
            x0 = vlines[string][fret].x0,
            y0 = vlines[string][fret].y0,
            x1 = vlines[string][fret].x1,
            y1 = vlines[string][fret].y1;
    
        ctx.save();
        ctx.beginPath();
        ctx.fillStyle = '#000000';
        ctx.arc( (x0+x1) * .5 ,(y0+y1)*.5 ,$RADIUS ,0 ,2 * Math.PI);
        ctx.fill();
        ctx.closePath();
        ctx.restore();
    }

    this.drawFrets =
    function ( layout ,strings )
    {
        for ( var i=0 ,l=strings.length ; i<l ; i++ )
        {
            if( strings[i] > 0 && strings[i] <= $FRETSAMOUNT )
            {
                this.drawFret(layout ,i ,strings[i] - 1);
            }
        }
    }

    this.fillFrets =
    function ( layout ,fret ,begString ,endString )
    {
        var x0 = vlines[begString][fret].x0,
            y0 = vlines[begString][fret].y0,
            x1 = vlines[endString][fret].x1,
            y1 = vlines[endString][fret].y1;
    
        var ctx = layout.ctx;
        ctx.save();
        ctx.beginPath();
        ctx.lineWidth = $RADIUS + $RADIUS;
        ctx.lineCap = 'round';
        ctx.strokeStyle = '#000000';
        ctx.moveTo( x0 ,(y0 + y1) * .5 );
        ctx.lineTo( x1 ,(y0 + y1) * .5 );
        ctx.stroke();
        ctx.closePath();
        ctx.restore();
    }
    
    this.refreshGrid =
    function ( layout )
    {
        this.drawGrid( layout );
        
        var chord = ChordsDrawer.getChord( this.chordId );

        var fill = {fret:-1};
        if ( chord.strings.isFilled() )
        {
            var fill = chord.strings.getFilled();
            this.fillFrets( layout ,fill.fret ,fill.start ,fill.close );
        }
        
        this.writeInfoStrings( layout ,chord.strings );

        for ( var i=0 ; i<chord.strings.len ; i++ )
        {
            if ( chord.strings.isPlayed( i ) )
            {
                var ply = chord.strings.at( i );
                if ( ply != fill.fret ) this.drawFret( layout ,i ,ply );
            }
        }

        ChordsDrawer.updateForChord( this ,this.chordId );
    }
    
    this.retrieveImage =
    function ( layout )
    {
        var dataUrl = layout.ui.toDataURL();
        var image = new Image();
        image.src = dataUrl;
        image.id  = this.chordId;
        return image;
    }
    
    var _eventEditor = new (function( self ){
    
        this.self = self;
        
        this.move = {from:0,to:0};
        
        this.getLocation =
        function (e)
        {
            var self    = this.self,
                layout  = self.layout,
                loc     = self.windowToCanvas.call(self ,layout ,e);
                        
            if ( loc.y <= self.titleBottom.call(self) || loc.x <= (self.marginLeft.call(self ,layout) - $RADIUS) )  return null;
            
            return { x : Math.abs(loc.x) ,y : Math.abs(loc.y) };
        };
        
        this.fireMouseDown =
        function (e)
        {
            if (e.button != 0) return;
            if ( this.self.chordId == null ) return;

            var self    = this.self,
                layout  = self.layout,
                loc     = this.getLocation(e);

            if ( loc === null ) return;

            this.move.from = this.move.to = loc;
            
            if ( loc.y <= self.marginTop.call(self) )
            {
                var $2RADIUS = $RADIUS + $RADIUS;

                for ( var i in vlines )
                {
                    var x0 = vlines[i][0].x0 - $2RADIUS, x1 = vlines[i][0].x1 + $2RADIUS;
                    if (!( (x0 <= loc.x && loc.x <= x1) || (x1 <= loc.x && loc.x <= x0) )) continue;

                    var chord = ChordsDrawer.getChord( self.chordId );
                    
                    if ( chord.strings.isPlayed(i) )
                    {
                        chord.strings.setString(i ,Chord.state.mutted );
                        self.refreshGrid.call( self, layout );
                    }
                    else
                    {
                        var stateORfret = chord.strings.isMutted(i) ? Chord.state.opened : Chord.state.mutted;
                        chord.strings.setString(i ,stateORfret);
                        self.refreshGrid.call( self, layout );                        
                    }
                    
                    return;
                }
            }
        };
        
        this.fireMouseUp =
        function (e)
        {
            if (e.button != 0) return;
            if ( this.self.chordId == null ) return;

            var self    = this.self,
                layout  = self.layout,
                loc     = this.getLocation(e);

            if ( loc === null ) return;            

            if ( loc.y <= self.marginTop.call(self) ) return;

            var $2RADIUS = $RADIUS + $RADIUS;

            var y0 = this.move.from.y - $2RADIUS, y1 = this.move.from.y + $2RADIUS;
            if (!( (y0 <= loc.y && loc.y <= y1) || (y1 <= loc.y && loc.y <= y0) )) return;

            //console.log( this.move.from.x + ',' + this.move.from.x + ' : ' + loc.x + ',' + loc.y );

            var chord = ChordsDrawer.getChord( self.chordId );

            if ( Math.abs(loc.y - this.move.from.y) < $2RADIUS && ! (Math.abs(loc.x - this.move.from.x) < $2RADIUS) )
            {
                var fill = {fret:-1 ,start:-1 ,close:-1};

                for ( var j in vlines[0] )
                {
                    var y0 = vlines[0][j].y0, y1 = vlines[0][j].y1;
                    if (!( (y0 <= this.move.from.y && this.move.from.y <= y1) || (y1 <= this.move.from.y && this.move.from.y <= y0) )) continue;
                        
                    fill.fret  = j;

                    for ( var i in vlines )
                    {
                        var x0 = vlines[i][j].x0 - $2RADIUS, x1 = vlines[i][j].x1 + $2RADIUS;
                        if (!( (x0 <= this.move.from.x && this.move.from.x <= x1) || (x1 <= this.move.from.x && this.move.from.x <= x0) )) continue;

                        fill.start = i;
                        break;
                    }

                    for ( var i in vlines )
                    {
                        var x0 = vlines[i][j].x0 - $2RADIUS, x1 = vlines[i][j].x1 + $2RADIUS;
                        if (!( (x0 <= loc.x && loc.x <= x1) || (x1 <= loc.x && loc.x <= x0) )) continue;

                        fill.close = i;
                        break;
                    }
                    
                    break;
                }

                if ( fill.fret < 0 || fill.start < 0 || fill.close < 0 ) return;
                
                if ( fill.start > fill.close ) { var Ø = fill.start; fill.start = fill.close; fill.close = Ø; }

                chord.strings.setString(fill.start ,fill.fret ,fill.close );
                self.refreshGrid.call( self, layout );
            }
            else 
            {
                // draw a circle
                for ( var i in vlines )
                {
                    for ( var j in vlines[i] )
                    {
                        var x0 = vlines[i][j].x0 - $2RADIUS, y0 = vlines[i][j].y0,
                            x1 = vlines[i][j].x1 + $2RADIUS, y1 = vlines[i][j].y1;
                        if (!( (x0 <= loc.x && loc.x <= x1) || (x1 <= loc.x && loc.x <= x0) )) continue;
                        if (!( (y0 <= loc.y && loc.y <= y1) || (y1 <= loc.y && loc.y <= y0) )) continue;

                        chord.strings.setString(i ,j);
                        self.refreshGrid.call( self, layout );
                        return;
                    }
                }
            }
        };
       
    })(this);
    
    function _notifyMouseDown (e) { _eventEditor.fireMouseDown(e) }
    function _notifyMouseUp   (e) { _eventEditor.fireMouseUp(e) }
}