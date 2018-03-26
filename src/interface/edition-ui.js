function
edition_ui_setGridTitle ( title )
{
    ChordsDrawer.updateEditorTitle( title );
}

function
edition_ui_setGridStart ( start )
{
    ChordsDrawer.updateEditorFrets( parseInt(start) );    
}

function
edition_ui_clearTitle ()
{
    var inputText = $DB.byId(UIIDS.title);
    inputText.value ='';
    inputText.onchange();
}

function
edition_ui_create()
{
    var fs1 = $DB.fieldset( "Edition" );

    $DB.append(fs1,

        $DB.label( $DB.italic("Title : ") ,UIIDS.title ),
    
        $DB.attachAttributesList(
            $DB.textfield( 'title-textField' ,function(){ edition_ui_setGridTitle(this.value) } ,UIIDS.title ),
            {
                'class':'chords-font',
                'style':'font-size:90%',
                'maxlength':'14'
            }
        ),
    
        $DB.nbsp(),
    
        $DB.reset("Clear",function(){ edition_ui_clearTitle () }),

        $DB.nbsp(),

        $DB.label( $DB.italic("Start : ") ,UIIDS.start ),

        $DB.attachAttributesList(
            $DB.number( UIIDS.start ,1 ,20 ,1 ,function(){ edition_ui_setGridStart(this.value) }),
            {
                'style':'width:40px'
            }
        ),

        $DB.attachAttributesList($DB.hr(),{'style':'border:0;border-top:1px solid grey'})
    );
    
    edition_ui_buttons_append ( fs1 )
    
    return fs1;
};