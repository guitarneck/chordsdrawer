var $DB = DOMHelper;

var UIIDS = {
    title       : 'gridTitle',
    start       : 'gridStart',
    name        : 'usrSongName',
    strings     : 'usrGuitarStrings',
    frets       : 'usrDiagramFrets',
    file        : 'usrFileLoad'
}
    
function setupui ()
{
    var ui = $DB.div('chordsform');

    $DB.append( ui ,
        song_ui_create(),
        edition_ui_create()
    );

    
    edition_ui_actions_append($DB.byId('editorgrid'));
        
    return ui;
}

function ui_display_song_name ( value ) { ($DB.byId(UIIDS.name)).value = value; document.title = value }
function ui_display_song_frets ( value ) { ($DB.byId(UIIDS.frets)).value = value }
function ui_display_song_strings ( value ) { ($DB.byId(UIIDS.strings)).value = value }

function ui_display_chord_name ( value ) { ($DB.byId(UIIDS.title)).value = value }
function ui_display_chord_start ( value ) { ($DB.byId(UIIDS.start)).value = value }