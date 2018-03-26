function
edition_ui_actions_add_chord ()
{
    ChordsDrawer.newChord();
};

function
edition_ui_actions_dup_chord ()
{
    ChordsDrawer.dupChord();
};

function
edition_ui_actions_del_chord ()
{
    ChordsDrawer.delChord();
};

function
edition_ui_actions_raz_chord ()
{
    ChordsDrawer.razChord();
};

function
edition_ui_actions_append ( parent )
{
    $DB.append( parent,

        $DB.append( 
            $DB.element('DIV'),
        
            $DB.before( $DB.button2( "" ,function(){ edition_ui_actions_add_chord() }).firstChild,
                $DB.class($DB.italic('') ,'far fa-plus-square'),
                $DB.nbsp()
            ),

            $DB.nbsp(),
        
            $DB.before( $DB.button2( "" ,function(){ edition_ui_actions_del_chord() }).firstChild,
                $DB.class($DB.italic('') ,'far fa-trash-alt'),
                $DB.nbsp()
            ),

            $DB.nbsp(),
        
            $DB.before( $DB.button2( "" ,function(){ edition_ui_actions_dup_chord() }).firstChild,
                $DB.class($DB.italic('') ,'far fa-copy'),
                $DB.nbsp()
            ),

            $DB.nbsp(),
        
            $DB.before( $DB.button2( "" ,function(){ edition_ui_actions_raz_chord() }).firstChild,
                $DB.class($DB.italic('') ,'far fa-times-circle'),
                $DB.nbsp()
            )
        )

    );
}