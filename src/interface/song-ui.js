function
song_ui_setSongName ( name )
{
    ChordsDrawer.updateSongName( name );
}

function
song_ui_setGuitarStrings ( number )
{
    console.log("change strings length to all song")
}

function
song_ui_setGuitarFrets ( number )
{
    var old = number.defaultValue;
    if (  ChordsDrawer.updateFrets( number.value ) )
        number.defaultValue = number.value;
    else
        number.value = old;
}

function
song_ui_createSong ()
{
    window.location.reload();
}

function
song_ui_loadSong ( file )
{
    ChordsDrawer.loadFile( file );
}

function
song_ui_saveSong ()
{
    ChordsDrawer.saveFile();
}

function
song_ui_lilyPond ()
{
    ChordsDrawer.exportLilyPond();
}

function
song_ui_printSong ()
{
    ChordsDrawer.print();
}

function
song_ui_create ()
{
    var fs0 = $DB.fieldset( "Song" );

    var $fileLoader =        
    $DB.attachAttributesList(
        $DB.fileload( 'fileLoader' ,function(){ song_ui_loadSong(this.files[0]) } ),
        {
            'style'     : 'display:none',
            'accept'    : ChordsDrawer.extension+',text/plain'
        }
    );
    
    $DB.append( fs0 ,
        $DB.label( $DB.italic("Name : ") ,UIIDS.name ),
        $DB.attachAttributesList(
            $DB.textfield( 'songName-textField' ,function(){ song_ui_setSongName(this.value) } ,UIIDS.name ),
            {
                'class':'input-normal-text',
                'style':'font-size:90%'
            }
        ),

        $DB.nbsp(),
            
        $DB.label( $DB.italic("Guitar strings : ") ,UIIDS.strings ),
        $DB.attachAttributesList(
            $DB.number( UIIDS.strings ,1 ,8 ,6 ,function(){ song_ui_setGuitarStrings(this.value) }),
            {
                'style':'width:40px'
            }
        ),

        $DB.nbsp(),
            
        $DB.label( $DB.italic("Diagram frets : ") ,UIIDS.frets ),
        $DB.attachAttributesList(
            $DB.number( UIIDS.frets ,1 ,10 ,5 ,function(){ song_ui_setGuitarFrets(this) }),
            {
                'style':'width:40px'
            }
        ),

        $DB.br(),

        $DB.class(
            $DB.before( $DB.button2( "New" ,function(){ song_ui_createSong() }).firstChild,
                $DB.class($DB.italic('') ,'far fa-file'),
                $DB.nbsp()
            ),
            'input-normal-text'
        ),

        $DB.nbsp(),

        $fileLoader,
        
        $DB.class(
            $DB.before( $DB.button2( "Load" ,function(){ ($DB.byId($fileLoader.id)).click() }).firstChild,
                $DB.class($DB.italic('') ,'far fa-folder-open'),
                $DB.nbsp()
            ),
            'input-normal-text'
        ),

        $DB.nbsp(),
        
        $DB.class(
            $DB.before( $DB.button2( "Save as..." ,function(){ song_ui_saveSong() }).firstChild,
                $DB.class($DB.italic('') ,'far fa-save'),
                $DB.nbsp()
            ),
            'input-normal-text'
        ),

        $DB.nbsp(),
/*
        $DB.class(
            $DB.before( $DB.button2( "LilyPond" ,function(){ song_ui_lilyPond() }).firstChild,
                $DB.class($DB.italic('') ,'far fa-save'),
                $DB.nbsp()
            ),
            'input-normal-text'
        ),

        $DB.nbsp(),
*/
        $DB.class(
            $DB.before( $DB.button2( "Print" ,function(){ song_ui_printSong() }).firstChild,
                $DB.class($DB.italic('') ,'fas fa-print'),
                $DB.nbsp()
            ),
            'input-normal-text'
        )
    );
    
    return fs0;
};